import prisma from '../config/database.js';
import crypto from 'crypto';

export async function submitChapterQuiz(userId, chapterId, answers) {
  const chapter = await prisma.chapter.findUnique({
    where: { id: chapterId },
    include: { course: true },
  });
  if (!chapter) throw new Error('CHAPTER_NOT_FOUND');

  // Parse quiz definition
  const quiz = chapter.quiz || { questions: [], passingScore: 70 };
  const questions = Array.isArray(quiz.questions) ? quiz.questions : [];

  let correctCount = 0;
  questions.forEach((q, idx) => {
    const selected = answers[q.id || idx];
    if (selected !== undefined && selected === q.correctAnswer) {
      correctCount++;
    }
  });

  const score = questions.length > 0 ? Math.round((correctCount / questions.length) * 100) : 100;
  const passed = score >= (quiz.passingScore || 70);
  const coinsReward = passed ? 20 : 0; // Standard chapter quiz reward

  // Record attempt & reward atomically
  return prisma.$transaction(async (tx) => {
    const attempt = await tx.quizAttempt.create({
      data: {
        userId,
        chapterId,
        score,
        passed,
        coinsAwarded: coinsReward,
        answers,
      },
    });

    if (passed && coinsReward > 0) {
      const wallet = await tx.wallet.upsert({
        where: { userId },
        update: { balance: { increment: coinsReward } },
        create: { userId, balance: 100 + coinsReward },
      });

      await tx.walletTransaction.create({
        data: {
          walletId: wallet.id,
          amount: coinsReward,
          type: 'QUIZ_REWARD',
          description: `Passed Quiz: ${chapter.title}`,
          referenceId: chapterId,
        },
      });
    }

    return { attempt, score, passed, coinsAwarded: coinsReward };
  });
}

export async function submitFinalAssessment(userId, courseId, answers) {
  const course = await prisma.course.findUnique({
    where: { id: courseId },
    include: { chapters: true },
  });
  if (!course) throw new Error('COURSE_NOT_FOUND');

  const assessment = course.finalAssessment || { questions: [], passingScore: 75 };
  const questions = Array.isArray(assessment.questions) ? assessment.questions : [];

  let correctCount = 0;
  questions.forEach((q, idx) => {
    const selected = answers[q.id || idx];
    if (selected !== undefined && selected === q.correctAnswer) {
      correctCount++;
    }
  });

  const score = questions.length > 0 ? Math.round((correctCount / questions.length) * 100) : 100;
  const passed = score >= (assessment.passingScore || 75);

  return prisma.$transaction(async (tx) => {
    let cert = null;
    if (passed) {
      // Issue separate Final Assessment Certificate
      const credentialId = `SKL-ASSESS-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;
      cert = await tx.certificate.upsert({
        where: { credentialId },
        update: {},
        create: {
          recipientId: userId,
          courseId,
          type: 'FINAL_ASSESSMENT',
          credentialId,
        },
      });
    }

    const attempt = await tx.assessmentAttempt.create({
      data: {
        userId,
        courseId,
        score,
        passed,
        certificateIssued: Boolean(cert),
      },
    });

    return { attempt, score, passed, certificate: cert };
  });
}

export async function issueCourseCompletionCertificate(userId, courseId) {
  // Verify 100% lesson completion on enrollment
  const enrollment = await prisma.enrollment.findUnique({
    where: { userId_courseId: { userId, courseId } },
  });
  if (!enrollment || enrollment.progressPercent < 100) {
    throw new Error('COURSE_INCOMPLETE');
  }

  const credentialId = `SKL-COMPL-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;
  return prisma.certificate.upsert({
    where: { credentialId },
    update: {},
    create: {
      recipientId: userId,
      courseId,
      type: 'COURSE_COMPLETION',
      credentialId,
    },
    include: { course: true },
  });
}

export async function getUserCertificates(userId) {
  return prisma.certificate.findMany({
    where: { recipientId: userId },
    include: {
      course: { select: { title: true, category: true, thumbnail: true } },
    },
    orderBy: { issuedAt: 'desc' },
  });
}

export async function verifyCertificateByCredential(credentialId) {
  return prisma.certificate.findUnique({
    where: { credentialId },
    include: {
      recipient: { select: { profile: true, email: true } },
      course: { select: { title: true, category: true, level: true, instructor: { select: { profile: true } } } },
    },
  });
}
