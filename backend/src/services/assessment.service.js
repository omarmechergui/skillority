import prisma from '../config/database.js';
import crypto from 'crypto';

export async function submitChapterQuiz(userId, chapterId, answers) {
  const chapter = await prisma.chapter.findUnique({
    where: { id: chapterId },
    include: { course: true },
  });
  if (!chapter) throw new Error('CHAPTER_NOT_FOUND');

  // Verify that the user is enrolled in the course
  const enrollment = await prisma.enrollment.findUnique({
    where: { userId_courseId: { userId, courseId: chapter.courseId } },
  });
  if (!enrollment) {
    throw new Error('NOT_ENROLLED: You must be enrolled in the course to take chapter quizzes');
  }

  // Parse and strictly validate quiz definition
  const quiz = chapter.quiz;
  if (!quiz || !Array.isArray(quiz.questions) || quiz.questions.length === 0) {
    throw new Error('INVALID_QUIZ: Chapter quiz has no questions configured');
  }

  const questions = quiz.questions;
  let correctCount = 0;
  questions.forEach((q, idx) => {
    const selected = answers ? answers[q.id || idx] : undefined;
    if (selected !== undefined && selected === q.correctAnswer) {
      correctCount++;
    }
  });

  const score = Math.round((correctCount / questions.length) * 100);
  const passed = score >= (quiz.passingScore || 70);

  // Check if coins were already awarded for this chapter quiz
  const priorPassedAttempt = await prisma.quizAttempt.findFirst({
    where: {
      userId,
      chapterId,
      passed: true,
      coinsAwarded: { gt: 0 },
    },
  });

  // Only award coins on the first passing attempt
  const coinsReward = (passed && !priorPassedAttempt) ? 20 : 0;

  // Record attempt & reward atomically
  return prisma.$transaction(async (tx) => {
    const attempt = await tx.quizAttempt.create({
      data: {
        userId,
        chapterId,
        score,
        passed,
        coinsAwarded: coinsReward,
        answers: answers || {},
      },
    });

    if (coinsReward > 0) {
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

  // Verify enrollment
  const enrollment = await prisma.enrollment.findUnique({
    where: { userId_courseId: { userId, courseId } },
  });
  if (!enrollment) {
    throw new Error('NOT_ENROLLED: You must be enrolled in the course to take the final assessment');
  }

  const assessment = course.finalAssessment;
  if (!assessment || !Array.isArray(assessment.questions) || assessment.questions.length === 0) {
    throw new Error('INVALID_ASSESSMENT: Final assessment has no questions configured');
  }

  const questions = assessment.questions;
  let correctCount = 0;
  questions.forEach((q, idx) => {
    const selected = answers ? answers[q.id || idx] : undefined;
    if (selected !== undefined && selected === q.correctAnswer) {
      correctCount++;
    }
  });

  const score = Math.round((correctCount / questions.length) * 100);
  const passed = score >= (assessment.passingScore || 75);

  return prisma.$transaction(async (tx) => {
    let cert = null;
    if (passed) {
      // Check if candidate already holds a FINAL_ASSESSMENT certificate for this course
      const existingCert = await tx.certificate.findFirst({
        where: {
          recipientId: userId,
          courseId,
          type: 'FINAL_ASSESSMENT',
        },
      });

      if (existingCert) {
        cert = existingCert;
      } else {
        // Generate high-entropy credential ID (24 hex chars = 96 bits of cryptographic entropy)
        const credentialId = `SKL-ASSESS-${crypto.randomBytes(12).toString('hex').toUpperCase()}`;
        cert = await tx.certificate.create({
          data: {
            recipientId: userId,
            courseId,
            type: 'FINAL_ASSESSMENT',
            credentialId,
          },
        });
      }
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

  // Prevent duplicate certificate minting
  const existingCert = await prisma.certificate.findFirst({
    where: {
      recipientId: userId,
      courseId,
      type: 'COURSE_COMPLETION',
    },
    include: { course: true },
  });
  if (existingCert) {
    return existingCert;
  }

  // Generate high-entropy credential ID (24 hex chars = 96 bits of cryptographic entropy)
  const credentialId = `SKL-COMPL-${crypto.randomBytes(12).toString('hex').toUpperCase()}`;
  return prisma.certificate.create({
    data: {
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
  const cert = await prisma.certificate.findUnique({
    where: { credentialId },
    include: {
      // Strictly omit recipient.email to protect learner privacy from public scrapers
      recipient: {
        select: {
          profile: {
            select: {
              firstName: true,
              lastName: true,
              avatar: true,
            },
          },
        },
      },
      course: {
        select: {
          title: true,
          category: true,
          level: true,
          instructor: {
            select: {
              profile: {
                select: {
                  firstName: true,
                  lastName: true,
                },
              },
            },
          },
        },
      },
    },
  });

  if (!cert) return null;

  // Defensive sanitization: Ensure recipient email is never leaked even if mock/underlying model returns it
  if (cert.recipient && cert.recipient.email) {
    const { email, ...safeRecipient } = cert.recipient;
    return { ...cert, recipient: safeRecipient };
  }

  return cert;
}
