import prisma from '../config/database.js';

export async function enrollInCourse(userId, courseId) {
  const course = await prisma.course.findUnique({
    where: { id: courseId },
    include: { chapters: { select: { id: true, order: true } } },
  });
  if (!course) throw new Error('COURSE_NOT_FOUND');
  if (course.status !== 'PUBLISHED' && course.status !== 'APPROVED') {
    throw new Error('COURSE_NOT_AVAILABLE');
  }

  // Auto-unlock free chapters (orders 0-5)
  const freeChapterIds = course.chapters.filter(ch => ch.order <= 5).map(ch => ch.id);

  return prisma.enrollment.upsert({
    where: { userId_courseId: { userId, courseId } },
    update: {},
    create: {
      userId,
      courseId,
      unlockedChapterIds: freeChapterIds,
      completedLessonIds: [],
      progressPercent: 0,
    },
    include: { course: true },
  });
}

export async function getStudentEnrollments(userId) {
  return prisma.enrollment.findMany({
    where: { userId },
    include: {
      course: {
        include: {
          instructor: { select: { profile: true } },
          _count: { select: { chapters: true } },
        },
      },
    },
    orderBy: { updatedAt: 'desc' },
  });
}

export async function markLessonComplete(userId, courseId, lessonId) {
  const enrollment = await prisma.enrollment.findUnique({
    where: { userId_courseId: { userId, courseId } },
  });
  if (!enrollment) throw new Error('NOT_ENROLLED');

  const lesson = await prisma.lesson.findUnique({
    where: { id: lessonId },
    include: { chapter: true },
  });
  if (!lesson) throw new Error('LESSON_NOT_FOUND');

  // Verify chapter access (must be free or unlocked)
  const isFreeChapter = lesson.chapter.order <= 5;
  const isUnlocked = enrollment.unlockedChapterIds.includes(lesson.chapterId);
  if (!isFreeChapter && !isUnlocked) {
    throw new Error('CHAPTER_LOCKED_REQUIRES_COINS');
  }

  const completedSet = new Set(enrollment.completedLessonIds);
  completedSet.add(lessonId);
  const updatedCompleted = Array.from(completedSet);

  // Calculate course total lessons for progress %
  const totalLessons = await prisma.lesson.count({
    where: { chapter: { courseId } },
  });

  const progressPercent = totalLessons > 0 ? (updatedCompleted.length / totalLessons) * 100 : 0;
  const isCompleted = progressPercent >= 100;

  return prisma.enrollment.update({
    where: { id: enrollment.id },
    data: {
      completedLessonIds: updatedCompleted,
      progressPercent,
      isCompleted,
      completedAt: isCompleted ? new Date() : null,
    },
  });
}

export async function unlockChapterWithCoins(userId, courseId, chapterId) {
  const enrollment = await prisma.enrollment.findUnique({
    where: { userId_courseId: { userId, courseId } },
  });
  if (!enrollment) throw new Error('NOT_ENROLLED');

  const chapter = await prisma.chapter.findUnique({ where: { id: chapterId } });
  if (!chapter || chapter.courseId !== courseId) {
    throw new Error('CHAPTER_NOT_FOUND');
  }

  // Freemium rule: Free chapters (order <= 5 or isFree) cost 0 coins
  const isFreeChapter = chapter.order <= 5 || chapter.isFree === true;
  if (isFreeChapter) {
    if (!enrollment.unlockedChapterIds.includes(chapterId)) {
      const updated = await prisma.enrollment.update({
        where: { id: enrollment.id },
        data: { unlockedChapterIds: { push: chapterId } },
      });
      return { alreadyUnlocked: true, isFree: true, remainingCoins: null, enrollment: updated };
    }
    return { alreadyUnlocked: true, isFree: true, remainingCoins: null, enrollment };
  }

  // Quick check outside transaction
  if (enrollment.unlockedChapterIds.includes(chapterId)) {
    const currentWallet = await prisma.wallet.findUnique({ where: { userId } });
    return { alreadyUnlocked: true, remainingCoins: currentWallet?.balance, enrollment };
  }

  const requiredCoins = chapter.coinsCost > 0 ? chapter.coinsCost : 50;

  // Atomic transaction: verify balance, deduct coins, record audit, update unlocked list
  return prisma.$transaction(async (tx) => {
    // 1. Check if already unlocked inside transaction
    const currentEnrollment = await tx.enrollment.findUnique({ where: { id: enrollment.id } });
    if (!currentEnrollment) throw new Error('NOT_ENROLLED');

    if (currentEnrollment.unlockedChapterIds.includes(chapterId)) {
      const currentWallet = await tx.wallet.findUnique({ where: { userId } });
      return { alreadyUnlocked: true, remainingCoins: currentWallet?.balance, enrollment: currentEnrollment };
    }

    let wallet = await tx.wallet.findUnique({ where: { userId } });
    if (!wallet) {
      wallet = await tx.wallet.create({ data: { userId, balance: 100 } });
    }

    if (wallet.balance < requiredCoins) {
      throw new Error('INSUFFICIENT_COINS');
    }

    // 2. Atomic conditional decrement on wallet: balance must be >= requiredCoins
    const updateWalletResult = await tx.wallet.updateMany({
      where: {
        id: wallet.id,
        balance: { gte: requiredCoins },
      },
      data: {
        balance: { decrement: requiredCoins },
      },
    });

    if (updateWalletResult.count === 0) {
      throw new Error('INSUFFICIENT_COINS');
    }

    // 3. Conditional update on enrollment: ensure chapter is only unlocked once
    const unlockResult = await tx.enrollment.updateMany({
      where: {
        id: enrollment.id,
        NOT: {
          unlockedChapterIds: { has: chapterId },
        },
      },
      data: {
        unlockedChapterIds: { push: chapterId },
      },
    });

    if (unlockResult.count === 0) {
      // Race condition: another concurrent transaction unlocked it at the same moment!
      // Refund the coins we just decremented so the user is never double-charged
      await tx.wallet.update({
        where: { id: wallet.id },
        data: { balance: { increment: requiredCoins } },
      });
      const currentWallet = await tx.wallet.findUnique({ where: { userId } });
      const refreshedEnrollment = await tx.enrollment.findUnique({ where: { id: enrollment.id } });
      return { alreadyUnlocked: true, remainingCoins: currentWallet?.balance, enrollment: refreshedEnrollment };
    }

    // 4. Record audit transaction
    await tx.walletTransaction.create({
      data: {
        walletId: wallet.id,
        amount: -requiredCoins,
        type: 'CHAPTER_UNLOCK',
        description: `Unlocked Chapter: ${chapter.title}`,
        referenceId: chapterId,
      },
    });

    const refreshedWallet = await tx.wallet.findUnique({ where: { id: wallet.id } });
    const refreshedEnrollment = await tx.enrollment.findUnique({ where: { id: enrollment.id } });
    return {
      alreadyUnlocked: false,
      remainingCoins: refreshedWallet.balance,
      coinsDeducted: requiredCoins,
      enrollment: refreshedEnrollment,
    };
  });
}
