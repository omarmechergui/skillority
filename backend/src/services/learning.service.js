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

  if (enrollment.unlockedChapterIds.includes(chapterId)) {
    return { alreadyUnlocked: true, enrollment };
  }

  const chapter = await prisma.chapter.findUnique({ where: { id: chapterId } });
  if (!chapter) throw new Error('CHAPTER_NOT_FOUND');

  const requiredCoins = chapter.coinsCost > 0 ? chapter.coinsCost : 50;

  // Atomic transaction: verify balance, deduct coins, record audit, update unlocked list
  return prisma.$transaction(async (tx) => {
    const wallet = await tx.wallet.findUnique({ where: { userId } });
    if (!wallet || wallet.balance < requiredCoins) {
      throw new Error('INSUFFICIENT_COINS');
    }

    // Deduct coins
    await tx.wallet.update({
      where: { id: wallet.id },
      data: { balance: { decrement: requiredCoins } },
    });

    // Record audit transaction
    await tx.walletTransaction.create({
      data: {
        walletId: wallet.id,
        amount: -requiredCoins,
        type: 'CHAPTER_UNLOCK',
        description: `Unlocked Chapter: ${chapter.title}`,
        referenceId: chapterId,
      },
    });

    // Add to unlocked list
    const updated = await tx.enrollment.update({
      where: { id: enrollment.id },
      data: { unlockedChapterIds: { push: chapterId } },
    });

    return { alreadyUnlocked: false, remainingCoins: wallet.balance - requiredCoins, enrollment: updated };
  });
}
