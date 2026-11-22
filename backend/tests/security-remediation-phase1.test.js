import assert from 'assert';
import http from 'http';
import jwt from 'jsonwebtoken';
import app from '../src/app.js';
import prisma from '../src/config/database.js';
import {
  signAccessToken,
  signRefreshToken,
  verifyAccessToken,
  validateJwtSecret,
  validateAuthConfig,
} from '../src/utils/jwt.js';

// Setup test secrets (at least 32 characters)
const TEST_JWT_SECRET = 'skillority-phase1-super-secure-jwt-test-secret-key-32chars';
process.env.JWT_ACCESS_SECRET = TEST_JWT_SECRET;
process.env.JWT_REFRESH_SECRET = TEST_JWT_SECRET;
process.env.JWT_SECRET = TEST_JWT_SECRET;
process.env.DATABASE_URL = 'mongodb://placeholder_user:dummy@localhost:27017/skillority_test';

function simulateRequest(appInstance, { method, url, headers = {}, body = null }) {
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
      rawReq.push(JSON.stringify(body));
      rawReq.push(null);
    } else {
      rawReq.push(null);
    }

    const rawRes = new http.ServerResponse(rawReq);
    let responseBody = '';

    rawRes.write = function (chunk, ...args) {
      if (chunk) responseBody += chunk.toString();
      return true;
    };

    rawRes.end = function (chunk, ...args) {
      if (chunk) responseBody += chunk.toString();
      let parsed = null;
      try {
        parsed = JSON.parse(responseBody);
      } catch (e) {
        parsed = responseBody;
      }
      resolve({
        statusCode: rawRes.statusCode,
        headers: rawRes.getHeaders(),
        body: parsed,
      });
    };

    appInstance(rawReq, rawRes);
  });
}

// In-Memory Database store
const db = {
  users: [],
  courses: [],
  chapters: [],
  lessons: [],
  enrollments: [],
  wallets: {},
  transactions: [],
  quizAttempts: [],
  assessmentAttempts: [],
  certificates: [],
};

// Flags for mocking DB errors
let forceDatabaseError = false;

// Mock Prisma models
prisma.user = {
  findUnique: async ({ where }) => {
    if (forceDatabaseError) {
      const err = new Error('Database connection failed');
      err.code = 'P1001';
      throw err;
    }
    const u = db.users.find((user) => user.id === where.id);
    if (!u) return null;
    return { isActive: true, tokenVersion: 0, ...u };
  },
};

prisma.course = {
  count: async ({ where } = {}) => {
    let list = db.courses;
    if (where?.status?.in) {
      list = list.filter((c) => where.status.in.includes(c.status));
    } else if (where?.status && where.status !== 'ALL') {
      list = list.filter((c) => c.status === where.status);
    }
    return list.length;
  },
  findMany: async ({ where, skip = 0, take = 10, include } = {}) => {
    let list = db.courses;
    if (where?.status?.in) {
      list = list.filter((c) => where.status.in.includes(c.status));
    } else if (where?.status && where.status !== 'ALL') {
      list = list.filter((c) => c.status === where.status);
    }
    return list.slice(skip, skip + take).map((c) => {
      const inst = db.users.find((u) => u.id === c.instructorId);
      return {
        ...c,
        instructor: inst
          ? {
              id: inst.id,
              email: inst.email,
              profile: { firstName: 'Instructor', lastName: 'Name' },
            }
          : null,
      };
    });
  },
  findUnique: async ({ where, include }) => {
    const c = db.courses.find((course) => course.id === where.id);
    if (!c) return null;
    const inst = db.users.find((u) => u.id === c.instructorId);
    const chaps = db.chapters.filter((ch) => ch.courseId === c.id);
    return {
      ...c,
      instructor: inst
        ? {
            id: inst.id,
            email: inst.email,
            profile: { firstName: 'Instructor', lastName: 'Name' },
          }
        : null,
      chapters: chaps.map((ch) => ({
        ...ch,
        lessons: db.lessons.filter((l) => l.chapterId === ch.id),
      })),
    };
  },
};

prisma.chapter = {
  findUnique: async ({ where }) => {
    const ch = db.chapters.find((c) => c.id === where.id);
    if (!ch) return null;
    const course = db.courses.find((co) => co.id === ch.courseId);
    return { ...ch, course };
  },
};

prisma.enrollment = {
  findUnique: async ({ where }) => {
    return (
      db.enrollments.find(
        (e) =>
          e.userId === where.userId_courseId.userId &&
          e.courseId === where.userId_courseId.courseId
      ) || null
    );
  },
  update: async ({ where, data }) => {
    const idx = db.enrollments.findIndex((e) => e.id === where.id);
    if (idx === -1) return null;
    db.enrollments[idx] = { ...db.enrollments[idx], ...data, updatedAt: new Date() };
    return db.enrollments[idx];
  },
};

prisma.wallet = {
  findUnique: async ({ where }) => db.wallets[where.userId] || null,
  update: async ({ where, data }) => {
    const w = Object.values(db.wallets).find((item) => item.id === where.id);
    if (!w) return null;
    if (data.balance?.increment) w.balance += data.balance.increment;
    if (data.balance?.decrement) w.balance -= data.balance.decrement;
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

prisma.quizAttempt = {
  create: async ({ data }) => {
    const attempt = { id: `qa_${Date.now()}`, ...data, createdAt: new Date() };
    db.quizAttempts.push(attempt);
    return attempt;
  },
  findFirst: async ({ where }) => {
    return (
      db.quizAttempts.find((qa) => {
        if (where.userId && qa.userId !== where.userId) return false;
        if (where.chapterId && qa.chapterId !== where.chapterId) return false;
        if (where.passed !== undefined && qa.passed !== where.passed) return false;
        if (where.coinsAwarded?.gt !== undefined && !(qa.coinsAwarded > where.coinsAwarded.gt))
          return false;
        return true;
      }) || null
    );
  },
};

prisma.assessmentAttempt = {
  create: async ({ data }) => {
    const attempt = { id: `aa_${Date.now()}`, ...data, createdAt: new Date() };
    db.assessmentAttempts.push(attempt);
    return attempt;
  },
  findFirst: async ({ where }) => {
    return (
      db.assessmentAttempts.find((aa) => {
        if (where.userId && aa.userId !== where.userId) return false;
        if (where.courseId && aa.courseId !== where.courseId) return false;
        return true;
      }) || null
    );
  },
};

prisma.certificate = {
  create: async ({ data }) => {
    const cert = { id: `cert_${Date.now()}`, ...data, issuedAt: new Date() };
    db.certificates.push(cert);
    return cert;
  },
  findFirst: async ({ where }) => {
    return (
      db.certificates.find((c) => {
        if (where.recipientId && c.recipientId !== where.recipientId) return false;
        if (where.courseId && c.courseId !== where.courseId) return false;
        if (where.type && c.type !== where.type) return false;
        return true;
      }) || null
    );
  },
  findUnique: async ({ where }) => {
    const cert = db.certificates.find((c) => c.credentialId === where.credentialId);
    if (!cert) return null;
    const recipient = db.users.find((u) => u.id === cert.recipientId);
    const course = db.courses.find((co) => co.id === cert.courseId);
    return {
      ...cert,
      recipient: recipient
        ? {
            email: recipient.email, // In raw DB, but service must sanitize
            profile: { firstName: 'Student', lastName: 'Learner', avatar: null },
          }
        : null,
      course: course ? { title: course.title, category: course.category, level: course.level } : null,
    };
  },
  findMany: async ({ where }) => db.certificates.filter((c) => c.recipientId === where.recipientId),
};

prisma.$transaction = async (fn) => {
  if (typeof fn === 'function') return fn(prisma);
  if (Array.isArray(fn)) return Promise.all(fn);
  return fn;
};

// ============================================================================
// TEST SUITE EXECUTION
// ============================================================================

async function runSecurityRemediationTests() {
  console.log('=== STARTING PHASE 1: SECURITY FOUNDATION VERIFICATION SUITE ===\n');
  let passed = 0;
  let failed = 0;

  function pass(name) {
    console.log(`[PASS] ${name}`);
    passed++;
  }

  function fail(name, err) {
    console.error(`[FAIL] ${name}:`, err?.message || err);
    failed++;
  }

  // Seed Users
  const studentUser = {
    id: 'user_student_1',
    email: 'student1@skillority.com',
    role: 'STUDENT',
    isActive: true,
    tokenVersion: 0,
  };
  const instructorUser = {
    id: 'user_instructor_1',
    email: 'private_instructor@skillority.com',
    role: 'INSTRUCTOR',
    isActive: true,
    tokenVersion: 0,
  };
  const otherInstructor = {
    id: 'user_instructor_2',
    email: 'other_instructor@skillority.com',
    role: 'INSTRUCTOR',
    isActive: true,
    tokenVersion: 0,
  };
  const adminUser = {
    id: 'user_admin_1',
    email: 'admin@skillority.com',
    role: 'ADMIN',
    isActive: true,
    tokenVersion: 0,
  };
  const inactiveUser = {
    id: 'user_inactive_1',
    email: 'inactive@skillority.com',
    role: 'STUDENT',
    isActive: false,
    tokenVersion: 0,
  };

  db.users.push(studentUser, instructorUser, otherInstructor, adminUser, inactiveUser);

  const studentToken = signAccessToken(studentUser);
  const instructorToken = signAccessToken(instructorUser);
  const otherInstructorToken = signAccessToken(otherInstructor);
  const adminToken = signAccessToken(adminUser);
  const inactiveToken = signAccessToken(inactiveUser);

  // --------------------------------------------------------------------------
  // TASK A: AUTHENTICATION FAIL-CLOSED & SECRET SECURITY
  // --------------------------------------------------------------------------
  console.log('--- TASK A: AUTHENTICATION SECURITY ---');

  // Test 1: Forged token with invalid signature is rejected (401)
  try {
    const forgedToken = jwt.sign(
      { id: studentUser.id, role: 'STUDENT' },
      'wrong-secret-key-that-does-not-match-jwt-secret-32-chars'
    );
    const res = await simulateRequest(app, {
      method: 'GET',
      url: '/api/auth/me',
      headers: { Authorization: `Bearer ${forgedToken}` },
    });
    assert.strictEqual(res.statusCode, 401);
    assert.strictEqual(res.body.error?.code, 'INVALID_TOKEN');
    pass('1. Forged token with incorrect signature is strictly rejected with 401 INVALID_TOKEN');
  } catch (err) {
    fail('1. Forged token check', err);
  }

  // Test 2: Expired token is rejected (401)
  try {
    const expiredToken = jwt.sign(
      { id: studentUser.id, role: 'STUDENT' },
      TEST_JWT_SECRET,
      { expiresIn: '-10s' }
    );
    const res = await simulateRequest(app, {
      method: 'GET',
      url: '/api/auth/me',
      headers: { Authorization: `Bearer ${expiredToken}` },
    });
    assert.strictEqual(res.statusCode, 401);
    assert.strictEqual(res.body.error?.code, 'TOKEN_EXPIRED');
    pass('2. Expired token is strictly rejected with 401 TOKEN_EXPIRED');
  } catch (err) {
    fail('2. Expired token check', err);
  }

  // Test 3: JWT secret validation rejects missing, empty, or short (<32 chars) secrets
  try {
    assert.throws(
      () => validateJwtSecret('JWT_SECRET', ''),
      /CRITICAL SECURITY FAILURE.*required and must not be empty/
    );
    assert.throws(
      () => validateJwtSecret('JWT_SECRET', 'short-secret-16ch'),
      /CRITICAL SECURITY FAILURE.*at least 32 characters/
    );
    pass('3. JWT secret validator strictly rejects empty or short (<32 chars) secrets');
  } catch (err) {
    fail('3. Short/empty secret validation', err);
  }

  // Test 4: In production, secret validator rejects known insecure placeholder patterns
  try {
    const origEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'production';
    try {
      assert.throws(
        () =>
          validateJwtSecret(
            'JWT_ACCESS_SECRET',
            'dev_access_secret_skillority_must_change_long_enough_32'
          ),
        /CRITICAL SECURITY FAILURE.*insecure placeholder pattern/
      );
    } finally {
      process.env.NODE_ENV = origEnv;
    }
    pass('4. In production mode, JWT validator rejects placeholder and must_change secrets');
  } catch (err) {
    fail('4. Production placeholder check', err);
  }

  // Test 5: Application startup validator verifies required secrets
  try {
    assert.doesNotThrow(() => validateAuthConfig());
    pass('5. validateAuthConfig startup check executes cleanly with valid configured secrets');
  } catch (err) {
    fail('5. Startup auth config validator', err);
  }

  // Test 6: Database lookup failure triggers fail-closed 503 SERVICE_UNAVAILABLE (no claims trusted)
  try {
    forceDatabaseError = true;
    const res = await simulateRequest(app, {
      method: 'GET',
      url: '/api/auth/me',
      headers: { Authorization: `Bearer ${studentToken}` },
    });
    forceDatabaseError = false;
    assert.strictEqual(res.statusCode, 503);
    assert.strictEqual(res.body.error?.code, 'SERVICE_UNAVAILABLE');
    pass('6. Fail-Closed Auth: Database lookup failure results in 503 SERVICE_UNAVAILABLE without trusting claims');
  } catch (err) {
    forceDatabaseError = false;
    fail('6. Fail-closed on database error', err);
  }

  // Test 7: Inactive user account is rejected (403 ACCOUNT_DISABLED)
  try {
    const res = await simulateRequest(app, {
      method: 'GET',
      url: '/api/auth/me',
      headers: { Authorization: `Bearer ${inactiveToken}` },
    });
    assert.strictEqual(res.statusCode, 403);
    assert.strictEqual(res.body.error?.code, 'ACCOUNT_DISABLED');
    pass('7. Inactive user account is rejected with 403 ACCOUNT_DISABLED');
  } catch (err) {
    fail('7. Inactive account check', err);
  }

  // Test 8: Revoked session / token version mismatch is rejected (401)
  try {
    const revokedToken = signAccessToken({ ...studentUser, tokenVersion: 99 });
    const res = await simulateRequest(app, {
      method: 'GET',
      url: '/api/auth/me',
      headers: { Authorization: `Bearer ${revokedToken}` },
    });
    assert.strictEqual(res.statusCode, 401);
    assert.strictEqual(res.body.error?.code, 'SESSION_REVOKED');
    pass('8. Revoked session with mismatched token version is rejected with 401 SESSION_REVOKED');
  } catch (err) {
    fail('8. Token version revocation check', err);
  }

  // Test 9: Valid token authenticates successfully
  try {
    const res = await simulateRequest(app, {
      method: 'GET',
      url: '/api/auth/me',
      headers: { Authorization: `Bearer ${studentToken}` },
    });
    assert.strictEqual(res.statusCode, 200);
    assert.strictEqual(res.body.success, true);
    assert.strictEqual(res.body.data?.user?.id, studentUser.id);
    pass('9. Valid authentication token succeeds and returns current user');
  } catch (err) {
    fail('9. Valid auth flow check', err);
  }

  // --------------------------------------------------------------------------
  // TASK B: COURSE CONTENT PROTECTION & ANSWER KEY MASKING
  // --------------------------------------------------------------------------
  console.log('\n--- TASK B: COURSE CONTENT & QUIZ PROTECTION ---');

  // Seed Course Data
  const draftCourse = {
    id: 'course_draft_1',
    title: 'Secret Unreleased Systems Course',
    description: 'Internal draft',
    status: 'DRAFT',
    instructorId: instructorUser.id,
    category: 'Engineering',
    level: 'Advanced',
  };

  const publishedCourse = {
    id: 'course_pub_1',
    title: 'Distributed Systems 101',
    description: 'Public course',
    status: 'PUBLISHED',
    instructorId: instructorUser.id,
    category: 'Engineering',
    level: 'Intermediate',
    finalAssessment: {
      passingScore: 70,
      questions: [
        { id: 'fa1', text: 'CAP Theorem question?', correctAnswer: 'Consistency', explanation: 'Secret explanation' },
      ],
    },
  };

  const freeChapter = {
    id: 'chap_free_0',
    courseId: publishedCourse.id,
    title: 'Introduction to Consensus',
    order: 0,
    isFree: true,
    quiz: {
      passingScore: 70,
      questions: [
        { id: 'q_free_1', text: 'Is Paxos leader-based?', correctAnswer: 'Yes', explanation: 'Secret hint' },
      ],
    },
  };

  const paidChapter = {
    id: 'chap_paid_6',
    courseId: publishedCourse.id,
    title: 'Advanced Raft & Byzantine Protocols',
    order: 6,
    isFree: false,
    coinsCost: 50,
  };

  const freeLesson = {
    id: 'les_free_1',
    chapterId: freeChapter.id,
    title: 'Consensus Basics',
    order: 1,
    content: 'TOP_SECRET_LESSON_CONTENT_FREE_CHAPTER',
  };

  const paidLesson = {
    id: 'les_paid_1',
    chapterId: paidChapter.id,
    title: 'Byzantine Fault Tolerance Deep Dive',
    order: 1,
    content: 'TOP_SECRET_PAID_CHAPTER_CONTENT',
  };

  db.courses.push(draftCourse, publishedCourse);
  db.chapters.push(freeChapter, paidChapter);
  db.lessons.push(freeLesson, paidLesson);

  // Test 10: Public GET /api/courses excludes DRAFT courses
  try {
    const res = await simulateRequest(app, {
      method: 'GET',
      url: '/api/courses',
    });
    assert.strictEqual(res.statusCode, 200);
    const draftFound = res.body.data.find((c) => c.id === draftCourse.id);
    assert.strictEqual(draftFound, undefined, 'Draft course must not appear in public listing');
    pass('10. Public GET /api/courses strictly excludes draft or unpublished courses');
  } catch (err) {
    fail('10. Public courses draft exclusion', err);
  }

  // Test 11: Attempting to query status=ALL as unauthenticated user does NOT reveal drafts
  try {
    const res = await simulateRequest(app, {
      method: 'GET',
      url: '/api/courses?status=ALL',
    });
    assert.strictEqual(res.statusCode, 200);
    const draftFound = res.body.data.find((c) => c.id === draftCourse.id);
    assert.strictEqual(draftFound, undefined, 'status=ALL must not bypass draft protection for public');
    pass('11. Query param status=ALL cannot be exploited to expose draft courses to public users');
  } catch (err) {
    fail('11. status=ALL public guard', err);
  }

  // Test 12: Public GET /api/courses does not expose instructor private email
  try {
    const res = await simulateRequest(app, {
      method: 'GET',
      url: '/api/courses',
    });
    const pub = res.body.data.find((c) => c.id === publishedCourse.id);
    assert(pub, 'Published course should be present');
    assert.strictEqual(pub.instructor?.email, undefined, 'Instructor email must be stripped');
    pass('12. Public course listing strictly strips private instructor email addresses');
  } catch (err) {
    fail('12. Instructor email privacy in course list', err);
  }

  // Test 13: Unauthenticated user accessing draft course directly by ID returns 404
  try {
    const res = await simulateRequest(app, {
      method: 'GET',
      url: `/api/courses/${draftCourse.id}`,
    });
    assert.strictEqual(res.statusCode, 404);
    assert.strictEqual(res.body.error?.code, 'NOT_FOUND');
    pass('13. Unauthenticated direct access to draft course by ID returns 404 NOT_FOUND');
  } catch (err) {
    fail('13. Unauthenticated draft course detail access', err);
  }

  // Test 14: Non-owner instructor accessing draft course returns 404
  try {
    const res = await simulateRequest(app, {
      method: 'GET',
      url: `/api/courses/${draftCourse.id}`,
      headers: { Authorization: `Bearer ${otherInstructorToken}` },
    });
    assert.strictEqual(res.statusCode, 404);
    pass('14. Non-owner instructor accessing another instructor draft course returns 404 NOT_FOUND');
  } catch (err) {
    fail('14. Non-owner instructor draft access', err);
  }

  // Test 15: Course owner instructor CAN access own draft course
  try {
    const res = await simulateRequest(app, {
      method: 'GET',
      url: `/api/courses/${draftCourse.id}`,
      headers: { Authorization: `Bearer ${instructorToken}` },
    });
    assert.strictEqual(res.statusCode, 200);
    assert.strictEqual(res.body.data?.id, draftCourse.id);
    pass('15. Course owner instructor retains access to inspect own draft course');
  } catch (err) {
    fail('15. Owner draft access check', err);
  }

  // Test 16: Quiz and Final Assessment correctAnswer and explanation are stripped before submission
  try {
    const res = await simulateRequest(app, {
      method: 'GET',
      url: `/api/courses/${publishedCourse.id}`,
    });
    assert.strictEqual(res.statusCode, 200);
    const ch = res.body.data.chapters.find((c) => c.id === freeChapter.id);
    assert(ch.quiz?.questions?.length > 0, 'Quiz questions should exist');
    const q = ch.quiz.questions[0];
    assert.strictEqual(q.correctAnswer, undefined, 'Quiz correctAnswer must be stripped');
    assert.strictEqual(q.explanation, undefined, 'Quiz explanation must be stripped');

    const fa = res.body.data.finalAssessment;
    assert(fa?.questions?.length > 0, 'Final assessment questions should exist');
    const faq = fa.questions[0];
    assert.strictEqual(faq.correctAnswer, undefined, 'Final assessment correctAnswer must be stripped');
    assert.strictEqual(faq.explanation, undefined, 'Final assessment explanation must be stripped');
    pass('16. Quiz & Assessment Protection: Answer keys and explanations are completely stripped from course responses');
  } catch (err) {
    fail('16. Quiz answer key masking', err);
  }

  // Test 17: includeContent=true without enrollment does NOT expose lesson content
  try {
    const res = await simulateRequest(app, {
      method: 'GET',
      url: `/api/courses/${publishedCourse.id}?includeContent=true`,
    });
    const ch = res.body.data.chapters.find((c) => c.id === freeChapter.id);
    const les = ch.lessons[0];
    assert.strictEqual(les.content, undefined, 'Unenrolled student must not receive lesson content');
    pass('17. Content Guard: includeContent=true without enrollment does not leak lesson content');
  } catch (err) {
    fail('17. includeContent unenrolled guard', err);
  }

  // Test 18: Enrolled student CAN access free chapter lesson content
  try {
    const enrollment = {
      id: 'enr_phase1_1',
      userId: studentUser.id,
      courseId: publishedCourse.id,
      progressPercent: 20.0,
      isCompleted: false,
      unlockedChapterIds: [freeChapter.id],
    };
    db.enrollments.push(enrollment);

    const res = await simulateRequest(app, {
      method: 'GET',
      url: `/api/courses/${publishedCourse.id}?includeContent=true`,
      headers: { Authorization: `Bearer ${studentToken}` },
    });
    const ch = res.body.data.chapters.find((c) => c.id === freeChapter.id);
    const les = ch.lessons[0];
    assert.strictEqual(les.content, 'TOP_SECRET_LESSON_CONTENT_FREE_CHAPTER');
    pass('18. Freemium Access: Enrolled student can access free chapter content (order <= 5)');
  } catch (err) {
    fail('18. Free chapter content access', err);
  }

  // Test 19: Enrolled student CANNOT access locked paid chapter content (order 6+) before unlocking
  try {
    const res = await simulateRequest(app, {
      method: 'GET',
      url: `/api/courses/${publishedCourse.id}?includeContent=true`,
      headers: { Authorization: `Bearer ${studentToken}` },
    });
    const paidCh = res.body.data.chapters.find((c) => c.id === paidChapter.id);
    const paidLes = paidCh.lessons[0];
    assert.strictEqual(paidLes.content, undefined, 'Locked paid chapter content must not be exposed');
    pass('19. Coin Lock Guard: Enrolled student cannot access locked paid chapter content before unlocking');
  } catch (err) {
    fail('19. Paid chapter content protection', err);
  }

  // Test 20: After unlocking paid chapter, enrolled student CAN access paid chapter content
  try {
    const enr = db.enrollments.find(
      (e) => e.userId === studentUser.id && e.courseId === publishedCourse.id
    );
    enr.unlockedChapterIds.push(paidChapter.id);

    const res = await simulateRequest(app, {
      method: 'GET',
      url: `/api/courses/${publishedCourse.id}?includeContent=true`,
      headers: { Authorization: `Bearer ${studentToken}` },
    });
    const paidCh = res.body.data.chapters.find((c) => c.id === paidChapter.id);
    const paidLes = paidCh.lessons[0];
    assert.strictEqual(paidLes.content, 'TOP_SECRET_PAID_CHAPTER_CONTENT');
    pass('20. Unlocked Paid Chapter: Enrolled student accesses content after verified unlock');
  } catch (err) {
    fail('20. Unlocked chapter content access', err);
  }

  // --------------------------------------------------------------------------
  // TASK C: ASSESSMENT & CERTIFICATE INTEGRITY
  // --------------------------------------------------------------------------
  console.log('\n--- TASK C: ASSESSMENT & CERTIFICATE INTEGRITY ---');

  // Test 21: Unenrolled student cannot submit chapter quiz (403 NOT_ENROLLED)
  try {
    const unenrolledStudent = {
      id: 'user_unenrolled_1',
      email: 'unenrolled@skillority.com',
      role: 'STUDENT',
      isActive: true,
      tokenVersion: 0,
    };
    db.users.push(unenrolledStudent);
    const unenrolledToken = signAccessToken(unenrolledStudent);

    const res = await simulateRequest(app, {
      method: 'POST',
      url: `/api/assessments/quizzes/${freeChapter.id}/submit`,
      headers: { Authorization: `Bearer ${unenrolledToken}` },
      body: { answers: { q_free_1: 'Yes' } },
    });
    assert.strictEqual(res.statusCode, 403);
    assert.strictEqual(res.body.error?.code, 'NOT_ENROLLED');
    pass('21. Enrollment Barrier: Unenrolled student cannot submit chapter quizzes (403 NOT_ENROLLED)');
  } catch (err) {
    fail('21. Unenrolled quiz submission guard', err);
  }

  // Test 22: Unenrolled student cannot submit final assessment (403 NOT_ENROLLED)
  try {
    const unenrolledStudent = db.users.find((u) => u.id === 'user_unenrolled_1');
    const unenrolledToken = signAccessToken(unenrolledStudent);

    const res = await simulateRequest(app, {
      method: 'POST',
      url: `/api/assessments/courses/${publishedCourse.id}/submit`,
      headers: { Authorization: `Bearer ${unenrolledToken}` },
      body: { answers: { fa1: 'Consistency' } },
    });
    assert.strictEqual(res.statusCode, 403);
    assert.strictEqual(res.body.error?.code, 'NOT_ENROLLED');
    pass('22. Enrollment Barrier: Unenrolled student cannot submit final assessment (403 NOT_ENROLLED)');
  } catch (err) {
    fail('22. Unenrolled final assessment guard', err);
  }

  // Test 23: Quiz with zero questions is rejected with 400 INVALID_QUIZ
  try {
    const emptyQuizChapter = {
      id: 'chap_empty_quiz',
      courseId: publishedCourse.id,
      title: 'Empty Quiz Chapter',
      order: 1,
      isFree: true,
      quiz: { questions: [], passingScore: 70 },
    };
    db.chapters.push(emptyQuizChapter);

    const res = await simulateRequest(app, {
      method: 'POST',
      url: `/api/assessments/quizzes/${emptyQuizChapter.id}/submit`,
      headers: { Authorization: `Bearer ${studentToken}` },
      body: { answers: {} },
    });
    assert.strictEqual(res.statusCode, 400);
    assert.strictEqual(res.body.error?.code, 'INVALID_QUIZ');
    pass('23. Zero-Question Quiz: Submitting quiz with 0 questions is rejected with 400 INVALID_QUIZ');
  } catch (err) {
    fail('23. Empty quiz rejection', err);
  }

  // Test 24: Final assessment with zero questions is rejected with 400 INVALID_ASSESSMENT
  try {
    const emptyAssessmentCourse = {
      id: 'course_empty_fa',
      title: 'Course With Empty Assessment',
      status: 'PUBLISHED',
      instructorId: instructorUser.id,
      finalAssessment: { questions: [], passingScore: 70 },
    };
    db.courses.push(emptyAssessmentCourse);
    db.enrollments.push({
      id: 'enr_empty_fa',
      userId: studentUser.id,
      courseId: emptyAssessmentCourse.id,
      progressPercent: 100,
      isCompleted: true,
      unlockedChapterIds: [],
    });

    const res = await simulateRequest(app, {
      method: 'POST',
      url: `/api/assessments/courses/${emptyAssessmentCourse.id}/submit`,
      headers: { Authorization: `Bearer ${studentToken}` },
      body: { answers: {} },
    });
    assert.strictEqual(res.statusCode, 400);
    assert.strictEqual(res.body.error?.code, 'INVALID_ASSESSMENT');
    pass('24. Zero-Question Assessment: Submitting final assessment with 0 questions rejected with 400 INVALID_ASSESSMENT');
  } catch (err) {
    fail('24. Empty final assessment rejection', err);
  }

  // Test 25: First passing quiz attempt awards coins; second passing attempt does NOT re-award coins
  try {
    db.wallets[studentUser.id] = { id: 'wal_s1', userId: studentUser.id, balance: 100 };

    // First attempt: pass
    const res1 = await simulateRequest(app, {
      method: 'POST',
      url: `/api/assessments/quizzes/${freeChapter.id}/submit`,
      headers: { Authorization: `Bearer ${studentToken}` },
      body: { answers: { q_free_1: 'Yes' } },
    });
    assert.strictEqual(res1.statusCode, 200);
    assert.strictEqual(res1.body.data?.passed, true);
    assert.strictEqual(res1.body.data?.coinsAwarded, 20);

    // Second attempt: pass again
    const res2 = await simulateRequest(app, {
      method: 'POST',
      url: `/api/assessments/quizzes/${freeChapter.id}/submit`,
      headers: { Authorization: `Bearer ${studentToken}` },
      body: { answers: { q_free_1: 'Yes' } },
    });
    assert.strictEqual(res2.statusCode, 200);
    assert.strictEqual(res2.body.data?.passed, true);
    assert.strictEqual(res2.body.data?.coinsAwarded, 0, 'No repeat coins awarded on subsequent passes');
    pass('25. Anti-Farming: First passing quiz awards coins; subsequent passes strictly award 0 coins');
  } catch (err) {
    fail('25. Quiz coin farming prevention', err);
  }

  // Test 26: Failing quiz attempt awards 0 coins and sets passed: false
  try {
    const res = await simulateRequest(app, {
      method: 'POST',
      url: `/api/assessments/quizzes/${freeChapter.id}/submit`,
      headers: { Authorization: `Bearer ${studentToken}` },
      body: { answers: { q_free_1: 'WrongAnswer' } },
    });
    assert.strictEqual(res.statusCode, 200);
    assert.strictEqual(res.body.data?.passed, false);
    assert.strictEqual(res.body.data?.score, 0);
    assert.strictEqual(res.body.data?.coinsAwarded, 0);
    pass('26. Quiz Evaluation: Failing score strictly produces passed: false and 0 coin rewards');
  } catch (err) {
    fail('26. Quiz fail evaluation', err);
  }

  // Test 27: Course completion certificate rejected if progress < 100%
  try {
    const enr = db.enrollments.find(
      (e) => e.userId === studentUser.id && e.courseId === publishedCourse.id
    );
    enr.progressPercent = 80;
    enr.isCompleted = false;

    const res = await simulateRequest(app, {
      method: 'POST',
      url: `/api/assessments/courses/${publishedCourse.id}/claim-completion`,
      headers: { Authorization: `Bearer ${studentToken}` },
    });
    assert.strictEqual(res.statusCode, 400);
    assert.strictEqual(res.body.error?.code, 'INCOMPLETE');
    pass('27. Completion Guard: Claiming certificate for incomplete course (<100%) rejected with 400 INCOMPLETE');
  } catch (err) {
    fail('27. Incomplete certificate rejection', err);
  }

  // Test 28: Certificate generation uses high-entropy 24 hex char ID (96 bits) and prevents duplicates
  let certCredentialId = null;
  try {
    const enr = db.enrollments.find(
      (e) => e.userId === studentUser.id && e.courseId === publishedCourse.id
    );
    enr.progressPercent = 100;
    enr.isCompleted = true;

    // First claim
    const res1 = await simulateRequest(app, {
      method: 'POST',
      url: `/api/assessments/courses/${publishedCourse.id}/claim-completion`,
      headers: { Authorization: `Bearer ${studentToken}` },
    });
    assert.strictEqual(res1.statusCode, 201);
    certCredentialId = res1.body.data?.credentialId;
    assert(certCredentialId, 'Credential ID must be generated');
    assert(
      /^SKL-COMPL-[A-F0-9]{24}$/.test(certCredentialId),
      `Credential ID must follow SKL-COMPL- with 24 hex chars (got ${certCredentialId})`
    );

    // Second claim: idempotent duplicate guard
    const res2 = await simulateRequest(app, {
      method: 'POST',
      url: `/api/assessments/courses/${publishedCourse.id}/claim-completion`,
      headers: { Authorization: `Bearer ${studentToken}` },
    });
    assert.strictEqual(res2.statusCode, 201);
    assert.strictEqual(
      res2.body.data?.credentialId,
      certCredentialId,
      'Duplicate claim must return existing certificate without minting a second'
    );

    const userCerts = db.certificates.filter(
      (c) => c.recipientId === studentUser.id && c.courseId === publishedCourse.id
    );
    assert.strictEqual(userCerts.length, 1, 'Only one certificate record may exist for course completion');
    pass('28. Certificate Entropy & Idempotency: High-entropy ID generated and duplicate minting prevented');
  } catch (err) {
    fail('28. Certificate creation and duplicate check', err);
  }

  // Test 29: Final assessment certificate generation & duplicate guard
  try {
    const res1 = await simulateRequest(app, {
      method: 'POST',
      url: `/api/assessments/courses/${publishedCourse.id}/submit`,
      headers: { Authorization: `Bearer ${studentToken}` },
      body: { answers: { fa1: 'Consistency' } },
    });
    assert.strictEqual(res1.statusCode, 200);
    assert.strictEqual(res1.body.data?.passed, true);
    const assessCertId = res1.body.data?.certificate?.credentialId;
    assert(
      /^SKL-ASSESS-[A-F0-9]{24}$/.test(assessCertId),
      `Final assessment certificate must follow SKL-ASSESS- with 24 hex chars (got ${assessCertId})`
    );

    // Resubmitting passing final assessment returns existing certificate without duplicating
    const res2 = await simulateRequest(app, {
      method: 'POST',
      url: `/api/assessments/courses/${publishedCourse.id}/submit`,
      headers: { Authorization: `Bearer ${studentToken}` },
      body: { answers: { fa1: 'Consistency' } },
    });
    assert.strictEqual(res2.statusCode, 200);
    assert.strictEqual(res2.body.data?.certificate?.credentialId, assessCertId);

    const assessCerts = db.certificates.filter(
      (c) =>
        c.recipientId === studentUser.id &&
        c.courseId === publishedCourse.id &&
        c.type === 'FINAL_ASSESSMENT'
    );
    assert.strictEqual(assessCerts.length, 1, 'Only one final assessment certificate record must exist');
    pass('29. Final Assessment Integrity: 24-hex credential ID generated and duplicate certificate blocked');
  } catch (err) {
    fail('29. Final assessment certificate idempotency', err);
  }

  // Test 30: Public certificate verification endpoint does not leak recipient email
  try {
    const res = await simulateRequest(app, {
      method: 'GET',
      url: `/api/assessments/verify/${certCredentialId}`,
    });
    assert.strictEqual(res.statusCode, 200);
    assert.strictEqual(res.body.success, true);
    assert.strictEqual(res.body.data?.credentialId, certCredentialId);
    assert.strictEqual(
      res.body.data?.recipient?.email,
      undefined,
      'Public certificate verification must never leak recipient email'
    );
    pass('30. Public Verification Privacy: Certificate verification strictly strips recipient email address');
  } catch (err) {
    fail('30. Public certificate privacy check', err);
  }

  console.log(`\n=== PHASE 1 SECURITY SUMMARY: ${passed} Passed, ${failed} Failed ===`);
  if (failed > 0) process.exit(1);
}

runSecurityRemediationTests().catch((err) => {
  console.error('Test execution failed:', err);
  process.exit(1);
});
