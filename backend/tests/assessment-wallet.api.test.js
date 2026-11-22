import assert from 'assert';
import http from 'http';
import app from '../src/app.js';
import prisma from '../src/config/database.js';
import { signAccessToken } from '../src/utils/jwt.js';

process.env.DATABASE_URL = 'mongodb://placeholder_user:dummy@localhost:27017/test';
process.env.JWT_SECRET = 'test-secret-key-skillority-jwt-32-bytes';

function simulateRequest(app, { method, url, headers = {}, body = null }) {
  return new Promise((resolve) => {
    const rawReq = new http.IncomingMessage(null);
    rawReq.method = method;
    rawReq.url = url;
    rawReq.originalUrl = url;
    rawReq.headers = {
      'content-type': 'application/json',
      ...Object.keys(headers).reduce((acc, k) => {
        acc[k.toLowerCase()] = headers[k];
        return acc;
      }, {}),
    };
    rawReq.body = body;
    rawReq.cookies = {};
    rawReq.socket = { remoteAddress: '127.0.0.1' };
    rawReq.ip = '127.0.0.1';

    if (body) {
      const payloadStr = JSON.stringify(body);
      rawReq.push(payloadStr);
      rawReq.push(null);
    } else {
      rawReq.push(null);
    }

    const rawRes = new http.ServerResponse(rawReq);
    let responseBody = '';

    const origEnd = rawRes.end;
    const origWrite = rawRes.write;

    rawRes.write = function (chunk, ...args) {
      if (chunk) responseBody += chunk.toString();
      return origWrite.apply(this, [chunk, ...args]);
    };

    rawRes.end = function (chunk, ...args) {
      if (chunk) responseBody += chunk.toString();
      origEnd.apply(this, [chunk, ...args]);
      let parsed = null;
      try {
        parsed = JSON.parse(responseBody);
      } catch (e) {
        parsed = responseBody;
      }
      resolve({
        statusCode: rawRes.statusCode,
        body: parsed,
      });
    };

    app(rawReq, rawRes);
  });
}

// In-Memory store
const db = {
  wallets: {},
  transactions: [],
  chapters: [],
  courses: [],
  enrollments: [],
  quizAttempts: [],
  assessmentAttempts: [],
  certificates: [],
};

// Wire mock Prisma
prisma.wallet = {
  findUnique: async ({ where }) => db.wallets[where.userId] || null,
  create: async ({ data }) => {
    const w = { id: `wal_${Date.now()}`, ...data, transactions: [] };
    db.wallets[data.userId] = w;
    return w;
  },
  update: async ({ where, data }) => {
    const w = Object.values(db.wallets).find((item) => item.id === where.id);
    if (!w) return null;
    if (data.balance?.increment) w.balance += data.balance.increment;
    if (data.balance?.decrement) w.balance -= data.balance.decrement;
    if (data.lastLoginBonus) w.lastLoginBonus = data.lastLoginBonus;
    return w;
  },
  upsert: async ({ where, update, create }) => {
    let w = db.wallets[where.userId];
    if (w) {
      if (update.balance?.increment) w.balance += update.balance.increment;
    } else {
      w = { id: `wal_${Date.now()}`, ...create, transactions: [] };
      db.wallets[where.userId] = w;
    }
    return w;
  },
};

prisma.walletTransaction = {
  create: async ({ data }) => {
    db.transactions.push(data);
    return data;
  },
};

prisma.chapter = {
  findUnique: async ({ where }) => db.chapters.find((ch) => ch.id === where.id) || null,
};

prisma.course = {
  findUnique: async ({ where }) => db.courses.find((c) => c.id === where.id) || null,
};

prisma.enrollment = {
  findUnique: async ({ where }) => {
    return db.enrollments.find((e) => e.userId === where.userId_courseId.userId && e.courseId === where.userId_courseId.courseId) || null;
  },
};

prisma.quizAttempt = {
  create: async ({ data }) => {
    db.quizAttempts.push(data);
    return { id: `qa_${Date.now()}`, ...data };
  },
};

prisma.assessmentAttempt = {
  create: async ({ data }) => {
    db.assessmentAttempts.push(data);
    return { id: `aa_${Date.now()}`, ...data };
  },
};

prisma.certificate = {
  upsert: async ({ where, create }) => {
    let cert = db.certificates.find((c) => c.credentialId === where.credentialId);
    if (!cert) {
      cert = { id: `cert_${Date.now()}`, ...create, issuedAt: new Date() };
      db.certificates.push(cert);
    }
    return cert;
  },
  findMany: async ({ where }) => db.certificates.filter((c) => c.recipientId === where.recipientId),
  findUnique: async ({ where }) => db.certificates.find((c) => c.credentialId === where.credentialId) || null,
};

prisma.$transaction = async (fn) => fn(prisma);

const studentUser = { id: 'usr_stud_quiz_1', email: 'stud_quiz@test.com', role: 'STUDENT', tokenVersion: 0 };
const studentToken = signAccessToken(studentUser);

async function runAssessmentWalletTests() {
  console.log('=== STARTING ASSESSMENT, QUIZ, CERTIFICATES & WALLET TEST SUITE ===\n');
  let passed = 0;
  let failed = 0;

  function report(name, condition) {
    if (condition) {
      console.log(`[PASS] ${name}`);
      passed++;
    } else {
      console.error(`[FAIL] ${name}`);
      failed++;
    }
  }

  // 1. Initial Wallet: GET /api/wallet auto-initializes balance of 100 coins
  {
    const res = await simulateRequest(app, {
      method: 'GET',
      url: '/api/wallet',
      headers: { Authorization: `Bearer ${studentToken}` },
    });
    report('1. Student wallet auto-initializes with 100 coins balance', res.statusCode === 200 && res.body.data?.balance === 100);
  }

  // 2. Daily Login Bonus: +5 coins
  {
    const res = await simulateRequest(app, {
      method: 'POST',
      url: '/api/wallet/claim-daily-login',
      headers: { Authorization: `Bearer ${studentToken}` },
    });
    report('2. Claiming daily login bonus awards +5 coins (balance 105)', res.statusCode === 200 && res.body.data?.balance === 105 && res.body.data?.coinsAwarded === 5);
  }

  // 3. Daily Login Bonus: Repeated claim on same day is rejected
  {
    const res = await simulateRequest(app, {
      method: 'POST',
      url: '/api/wallet/claim-daily-login',
      headers: { Authorization: `Bearer ${studentToken}` },
    });
    report('3. Repeated daily login claim on same day is rejected with 400 ALREADY_CLAIMED', res.statusCode === 400 && res.body.error?.code === 'ALREADY_CLAIMED');
  }

  // 4. Sponsored Ad Reward
  {
    const res = await simulateRequest(app, {
      method: 'POST',
      url: '/api/wallet/claim-ad-reward',
      headers: { Authorization: `Bearer ${studentToken}` },
    });
    report('4. Claiming ad reward increments balance by 1-5 coins', res.statusCode === 200 && res.body.data?.coinsAwarded >= 1 && res.body.data?.coinsAwarded <= 5);
  }

  // Seed Course & Chapter with Quiz
  const testCourse = {
    id: 'course_quiz_1',
    title: 'Distributed Systems',
    status: 'PUBLISHED',
    finalAssessment: {
      questions: [
        { id: 'q1', text: 'CAP theorem C stands for?', correctAnswer: 'Consistency' },
        { id: 'q2', text: 'Raft consensus leader heartbeat?', correctAnswer: 'Periodic' },
      ],
      passingScore: 50,
    },
  };
  db.courses.push(testCourse);

  const testChapter = {
    id: 'chap_quiz_1',
    courseId: testCourse.id,
    title: 'Consensus Algorithms',
    order: 0,
    isFree: true,
    quiz: {
      questions: [
        { id: 'q1', text: 'Is Paxos leaderless or leader-based?', correctAnswer: 'Leader-based' },
        { id: 'q2', text: 'Byzantine fault tolerance tolerates arbitrary faults?', correctAnswer: 'Yes' },
      ],
      passingScore: 50,
    },
  };
  db.chapters.push(testChapter);

  // 5. Submit Chapter Quiz (Passing)
  {
    const res = await simulateRequest(app, {
      method: 'POST',
      url: `/api/assessments/quizzes/${testChapter.id}/submit`,
      headers: { Authorization: `Bearer ${studentToken}` },
      body: {
        answers: { q1: 'Leader-based', q2: 'Yes' },
      },
    });
    report('5. Passing chapter quiz scores 100%, passed: true, and awards +20 coins', res.statusCode === 200 && res.body.data?.passed === true && res.body.data?.coinsAwarded === 20 && res.body.data?.score === 100);
  }

  // 6. Submit Chapter Quiz (Failing)
  {
    const res = await simulateRequest(app, {
      method: 'POST',
      url: `/api/assessments/quizzes/${testChapter.id}/submit`,
      headers: { Authorization: `Bearer ${studentToken}` },
      body: {
        answers: { q1: 'Wrong answer', q2: 'Wrong answer' },
      },
    });
    report('6. Failing chapter quiz scores 0%, passed: false, coinsAwarded: 0', res.statusCode === 200 && res.body.data?.passed === false && res.body.data?.coinsAwarded === 0 && res.body.data?.score === 0);
  }

  // 7. Course Completion Certificate: Rejects if course is incomplete (< 100%)
  {
    db.enrollments.push({
      userId: studentUser.id,
      courseId: testCourse.id,
      progressPercent: 75.0,
      isCompleted: false,
    });

    const res = await simulateRequest(app, {
      method: 'POST',
      url: `/api/assessments/courses/${testCourse.id}/claim-completion`,
      headers: { Authorization: `Bearer ${studentToken}` },
    });
    report('7. Incomplete course (< 100%) claiming completion certificate returns 400 INCOMPLETE', res.statusCode === 400 && res.body.error?.code === 'INCOMPLETE');
  }

  // 8. Course Completion Certificate: Issues when 100% complete
  let issuedCertCredentialId = null;
  {
    const enr = db.enrollments.find((e) => e.userId === studentUser.id && e.courseId === testCourse.id);
    enr.progressPercent = 100.0;
    enr.isCompleted = true;

    const res = await simulateRequest(app, {
      method: 'POST',
      url: `/api/assessments/courses/${testCourse.id}/claim-completion`,
      headers: { Authorization: `Bearer ${studentToken}` },
    });
    report('8. 100% completed course claims completion certificate (SKL-COMPL-...)', res.statusCode === 201 && res.body.data?.credentialId?.startsWith('SKL-COMPL-') && res.body.data?.type === 'COURSE_COMPLETION');
    issuedCertCredentialId = res.body?.data?.credentialId;
  }

  // 9. Public Certificate Verification
  {
    const res = await simulateRequest(app, {
      method: 'GET',
      url: `/api/assessments/verify/${issuedCertCredentialId}`,
    });
    report('9. Public GET /api/assessments/verify/:credentialId verifies certificate without requiring auth', res.statusCode === 200 && res.body.data?.credentialId === issuedCertCredentialId);
  }

  // 10. Final Assessment Submission & Certificate
  {
    const res = await simulateRequest(app, {
      method: 'POST',
      url: `/api/assessments/courses/${testCourse.id}/submit`,
      headers: { Authorization: `Bearer ${studentToken}` },
      body: {
        answers: { q1: 'Consistency', q2: 'Periodic' },
      },
    });
    report('10. Passing final course assessment issues FINAL_ASSESSMENT certificate (SKL-ASSESS-...)', res.statusCode === 200 && res.body.data?.passed === true && res.body.data?.certificate?.credentialId?.startsWith('SKL-ASSESS-'));
  }

  console.log(`\n=== ASSESSMENT & WALLET TEST SUMMARY: ${passed} Passed, ${failed} Failed ===`);
  if (failed > 0) process.exit(1);
}

runAssessmentWalletTests().catch((err) => {
  console.error('Test runner failure:', err);
  process.exit(1);
});
