import assert from 'assert';
import http from 'http';
import app from '../src/app.js';
import prisma from '../src/config/database.js';
import { signAccessToken } from '../src/utils/jwt.js';

// Configure offline test mode so requireAuth authenticates via JWT claims
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

// In-Memory Database store for mock persistence
const db = {
  courses: [],
  chapters: [],
  lessons: [],
  enrollments: [],
  wallets: {},
  transactions: [],
};

// Setup Mock Prisma Handlers
prisma.course = {
  findMany: async ({ where, skip = 0, take = 10 }) => {
    let list = db.courses;
    if (where?.status && where.status !== 'ALL') {
      list = list.filter((c) => c.status === where.status);
    }
    if (where?.instructorId) {
      list = list.filter((c) => c.instructorId === where.instructorId);
    }
    if (where?.category) {
      list = list.filter((c) => c.category === where.category);
    }
    if (where?.level) {
      list = list.filter((c) => c.level === where.level);
    }
    if (where?.OR) {
      list = list.filter((c) =>
        where.OR.some(
          (cond) =>
            (cond.title && c.title.toLowerCase().includes(cond.title.contains.toLowerCase())) ||
            (cond.description && c.description.toLowerCase().includes(cond.description.contains.toLowerCase()))
        )
      );
    }
    return list.slice(skip, skip + take);
  },
  count: async ({ where }) => {
    let list = db.courses;
    if (where?.status && where.status !== 'ALL') list = list.filter((c) => c.status === where.status);
    return list.length;
  },
  findUnique: async ({ where }) => {
    const course = db.courses.find((c) => c.id === where.id);
    if (!course) return null;
    const chapters = db.chapters
      .filter((ch) => ch.courseId === course.id)
      .sort((a, b) => a.order - b.order)
      .map((ch) => ({
        ...ch,
        lessons: db.lessons.filter((l) => l.chapterId === ch.id).sort((a, b) => a.order - b.order),
      }));
    return {
      ...course,
      instructor: {
        id: course.instructorId,
        email: 'instructor@test.com',
        profile: { firstName: 'Alan', lastName: 'Turing', experience: 'Computer Pioneer' },
      },
      chapters,
    };
  },
  create: async ({ data }) => {
    const course = {
      id: `course_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    db.courses.push(course);
    return course;
  },
  update: async ({ where, data }) => {
    const idx = db.courses.findIndex((c) => c.id === where.id);
    if (idx === -1) return null;
    db.courses[idx] = { ...db.courses[idx], ...data, updatedAt: new Date() };
    return db.courses[idx];
  },
  delete: async ({ where }) => {
    const idx = db.courses.findIndex((c) => c.id === where.id);
    if (idx === -1) return null;
    const deleted = db.courses.splice(idx, 1)[0];
    return deleted;
  },
};

prisma.chapter = {
  create: async ({ data }) => {
    const chapter = {
      id: `chap_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      ...data,
      lessons: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    db.chapters.push(chapter);
    return chapter;
  },
  findUnique: async ({ where, include }) => {
    const chapter = db.chapters.find((ch) => ch.id === where.id);
    if (!chapter) return null;
    if (include?.course) {
      const course = db.courses.find((c) => c.id === chapter.courseId);
      return { ...chapter, course };
    }
    return chapter;
  },
  update: async ({ where, data }) => {
    const idx = db.chapters.findIndex((ch) => ch.id === where.id);
    if (idx === -1) return null;
    db.chapters[idx] = { ...db.chapters[idx], ...data, updatedAt: new Date() };
    return db.chapters[idx];
  },
};

prisma.lesson = {
  create: async ({ data }) => {
    const lesson = {
      id: `les_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    db.lessons.push(lesson);
    return lesson;
  },
  findUnique: async ({ where, include }) => {
    const lesson = db.lessons.find((l) => l.id === where.id);
    if (!lesson) return null;
    if (include?.chapter) {
      const chapter = db.chapters.find((ch) => ch.id === lesson.chapterId);
      const course = db.courses.find((c) => c.id === chapter?.courseId);
      return { ...lesson, chapter: chapter ? { ...chapter, course } : null };
    }
    return lesson;
  },
  update: async ({ where, data }) => {
    const idx = db.lessons.findIndex((l) => l.id === where.id);
    if (idx === -1) return null;
    db.lessons[idx] = { ...db.lessons[idx], ...data, updatedAt: new Date() };
    return db.lessons[idx];
  },
  count: async ({ where }) => {
    if (where?.chapter?.courseId) {
      const chapIds = db.chapters.filter((ch) => ch.courseId === where.chapter.courseId).map((ch) => ch.id);
      return db.lessons.filter((l) => chapIds.includes(l.chapterId)).length;
    }
    return db.lessons.length;
  },
};

prisma.enrollment = {
  upsert: async ({ where, create }) => {
    const key = `${where.userId_courseId.userId}_${where.userId_courseId.courseId}`;
    let enrollment = db.enrollments.find((e) => `${e.userId}_${e.courseId}` === key);
    if (!enrollment) {
      enrollment = {
        id: `enr_${Date.now()}`,
        ...create,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      db.enrollments.push(enrollment);
    }
    return enrollment;
  },
  findUnique: async ({ where }) => {
    return db.enrollments.find((e) => e.userId === where.userId_courseId.userId && e.courseId === where.userId_courseId.courseId) || null;
  },
  findMany: async ({ where }) => {
    return db.enrollments.filter((e) => e.userId === where.userId);
  },
  update: async ({ where, data }) => {
    const idx = db.enrollments.findIndex((e) => e.id === where.id);
    if (idx === -1) return null;
    db.enrollments[idx] = { ...db.enrollments[idx], ...data, updatedAt: new Date() };
    return db.enrollments[idx];
  },
};

prisma.wallet = {
  findUnique: async ({ where }) => {
    if (where.userId) return db.wallets[where.userId] || null;
    if (where.id) return Object.values(db.wallets).find((w) => w.id === where.id) || null;
    return null;
  },
  update: async ({ where, data }) => {
    const wallet = Object.values(db.wallets).find((w) => w.id === where.id);
    if (wallet && data.balance?.decrement) {
      wallet.balance -= data.balance.decrement;
    }
    return wallet;
  },
  updateMany: async ({ where, data }) => {
    let list = Object.values(db.wallets);
    if (where.id) list = list.filter((w) => w.id === where.id);
    if (where.userId) list = list.filter((w) => w.userId === where.userId);
    if (where.balance?.gte !== undefined) list = list.filter((w) => w.balance >= where.balance.gte);
    list.forEach((w) => {
      if (data.balance?.decrement) w.balance -= data.balance.decrement;
      if (data.balance?.increment) w.balance += data.balance.increment;
    });
    return { count: list.length };
  },
};

prisma.$transaction = async (fn) => {
  const tx = {
    wallet: {
      findUnique: async ({ where }) => {
        if (where.userId) return db.wallets[where.userId] || null;
        if (where.id) return Object.values(db.wallets).find((w) => w.id === where.id) || null;
        return null;
      },
      update: async ({ where, data }) => {
        const wallet = Object.values(db.wallets).find((w) => w.id === where.id);
        if (wallet && data.balance?.decrement) {
          wallet.balance -= data.balance.decrement;
        }
        return wallet;
      },
      updateMany: async ({ where, data }) => {
        let list = Object.values(db.wallets);
        if (where.id) list = list.filter((w) => w.id === where.id);
        if (where.userId) list = list.filter((w) => w.userId === where.userId);
        if (where.balance?.gte !== undefined) list = list.filter((w) => w.balance >= where.balance.gte);
        list.forEach((w) => {
          if (data.balance?.decrement) w.balance -= data.balance.decrement;
          if (data.balance?.increment) w.balance += data.balance.increment;
        });
        return { count: list.length };
      },
    },
    walletTransaction: {
      create: async ({ data }) => {
        db.transactions.push(data);
        return data;
      },
    },
    enrollment: {
      findUnique: async ({ where }) => {
        if (where.id) return db.enrollments.find((e) => e.id === where.id) || null;
        if (where.userId_courseId) {
          return (
            db.enrollments.find(
              (e) =>
                e.userId === where.userId_courseId.userId &&
                e.courseId === where.userId_courseId.courseId
            ) || null
          );
        }
        return null;
      },
      updateMany: async ({ where, data }) => {
        let list = db.enrollments.filter((e) => {
          if (where.id && e.id !== where.id) return false;
          if (where.NOT?.unlockedChapterIds?.has && e.unlockedChapterIds?.includes(where.NOT.unlockedChapterIds.has)) {
            return false;
          }
          return true;
        });
        list.forEach((e) => {
          if (data.unlockedChapterIds?.push) {
            if (!e.unlockedChapterIds.includes(data.unlockedChapterIds.push)) {
              e.unlockedChapterIds.push(data.unlockedChapterIds.push);
            }
          }
          e.updatedAt = new Date();
        });
        return { count: list.length };
      },
      update: async ({ where, data }) => {
        const idx = db.enrollments.findIndex((e) => e.id === where.id);
        if (data.unlockedChapterIds?.push) {
          db.enrollments[idx].unlockedChapterIds.push(data.unlockedChapterIds.push);
        }
        return db.enrollments[idx];
      },
    },
  };
  return fn(tx);
};

// Seed Test Users & Tokens
const studentUser = { id: 'usr_stud_101', email: 'student@test.com', role: 'STUDENT', tokenVersion: 0 };
const instructorUser = { id: 'usr_inst_202', email: 'instructor@test.com', role: 'INSTRUCTOR', tokenVersion: 0 };
const otherInstructorUser = { id: 'usr_inst_999', email: 'other@test.com', role: 'INSTRUCTOR', tokenVersion: 0 };
const adminUser = { id: 'usr_admin_303', email: 'admin@test.com', role: 'ADMIN', tokenVersion: 0 };

const testUsers = [studentUser, instructorUser, otherInstructorUser, adminUser];
prisma.user = {
  findUnique: async ({ where }) => {
    const u = testUsers.find((user) => user.id === where.id);
    if (!u) return null;
    return { isActive: true, tokenVersion: 0, ...u };
  },
};

const studentToken = signAccessToken(studentUser);
const instructorToken = signAccessToken(instructorUser);
const otherInstructorToken = signAccessToken(otherInstructorUser);
const adminToken = signAccessToken(adminUser);

// Seed initial wallet for student with 100 coins
db.wallets[studentUser.id] = { id: 'wal_stud_1', userId: studentUser.id, balance: 100 };

async function runTests() {
  console.log('=== STARTING MODULE 2: COURSE PLATFORM & LEARNING API TEST SUITE ===\n');
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

  // 1. Course Discovery: Public Browsing
  {
    const res = await simulateRequest(app, {
      method: 'GET',
      url: '/api/courses',
    });
    report('1. Public GET /api/courses returns 200 without requiring authentication', res.statusCode === 200 && res.body.success === true);
  }

  // 2. Instructor Course Creation
  let createdCourseId = null;
  {
    const res = await simulateRequest(app, {
      method: 'POST',
      url: '/api/courses',
      headers: { Authorization: `Bearer ${instructorToken}` },
      body: {
        title: 'Modern Full-Stack Engineering with Next.js',
        description: 'Comprehensive curriculum covering App Router, React Server Components, and scalable architecture.',
        category: 'Web Development',
        level: 'Intermediate',
        tags: ['React', 'Next.js', 'Prisma'],
      },
    });
    report('2. Instructor can create course draft with status DRAFT', res.statusCode === 201 && res.body.data?.status === 'DRAFT');
    createdCourseId = res.body?.data?.id;
  }

  // 3. Student RBAC: Student cannot create courses
  {
    const res = await simulateRequest(app, {
      method: 'POST',
      url: '/api/courses',
      headers: { Authorization: `Bearer ${studentToken}` },
      body: {
        title: 'Unauthorized Course Creation',
        description: 'This should fail because students lack INSTRUCTOR role.',
        category: 'Web Development',
        level: 'Beginner',
      },
    });
    report('3. Student role is rejected with 403 FORBIDDEN when attempting to create a course', res.statusCode === 403);
  }

  // 4. Course Ownership Security: Other instructor cannot edit course
  {
    const res = await simulateRequest(app, {
      method: 'PATCH',
      url: `/api/courses/${createdCourseId}`,
      headers: { Authorization: `Bearer ${otherInstructorToken}` },
      body: { title: 'Hijacked Course Title' },
    });
    report('4. Non-owner instructor cannot modify course (403 FORBIDDEN)', res.statusCode === 403);
  }

  // 5. Course Ownership: Owner can update course metadata
  {
    const res = await simulateRequest(app, {
      method: 'PATCH',
      url: `/api/courses/${createdCourseId}`,
      headers: { Authorization: `Bearer ${instructorToken}` },
      body: { title: 'Modern Full-Stack Engineering with Next.js 14' },
    });
    report('5. Course owner can update metadata successfully', res.statusCode === 200 && res.body.data?.title === 'Modern Full-Stack Engineering with Next.js 14');
  }

  // 6. Chapter Creation: Freemium Rule Enforcement (Chapters 0-5 Free)
  let ch0Id = null;
  let ch6Id = null;
  {
    const res = await simulateRequest(app, {
      method: 'POST',
      url: `/api/courses/${createdCourseId}/chapters`,
      headers: { Authorization: `Bearer ${instructorToken}` },
      body: {
        title: 'Orientation & Core Architecture',
        order: 0,
        isFree: true,
      },
    });
    report('6. Chapter 0 (order 0) automatically enforces Freemium Free Access (isFree: true, coinsCost: 0)', res.statusCode === 201 && res.body.data?.isFree === true && res.body.data?.coinsCost === 0);
    ch0Id = res.body?.data?.id;
  }

  // 7. Chapter Creation: Freemium Rule Enforcement (Chapter 6+ Coin Unlocked)
  {
    const res = await simulateRequest(app, {
      method: 'POST',
      url: `/api/courses/${createdCourseId}/chapters`,
      headers: { Authorization: `Bearer ${instructorToken}` },
      body: {
        title: 'Advanced Edge Middleware & Distributed Caching',
        order: 6,
        isFree: false,
        coinsCost: 50,
      },
    });
    report('7. Chapter 6 (order 6) enforces Coin Unlock rule (isFree: false, coinsCost: 50)', res.statusCode === 201 && res.body.data?.isFree === false && res.body.data?.coinsCost === 50);
    ch6Id = res.body?.data?.id;
  }

  // 8. Lesson Creation & Hybrid Blocks
  let lesson1Id = null;
  let lesson2Id = null;
  {
    const res = await simulateRequest(app, {
      method: 'POST',
      url: `/api/courses/chapters/${ch0Id}/lessons`,
      headers: { Authorization: `Bearer ${instructorToken}` },
      body: {
        title: 'Client vs Server Components',
        order: 0,
        duration: 15,
        content: {
          lead: 'Dissecting RSC boundaries and network waterfalls.',
          codeSnippet: "'use client';\nexport default function Counter() { return <button>Click</button>; }",
          keyTakeaways: ['RSC executes exclusively on the server', 'Interactivity requires client boundaries'],
        },
      },
    });
    report('8. Instructor can add structured hybrid lesson to chapter', res.statusCode === 201 && res.body.data?.title === 'Client vs Server Components');
    lesson1Id = res.body?.data?.id;
  }

  // 9. Lesson Update: Hybrid Lesson Builder
  {
    const res = await simulateRequest(app, {
      method: 'PATCH',
      url: `/api/courses/lessons/${lesson1Id}`,
      headers: { Authorization: `Bearer ${instructorToken}` },
      body: {
        title: 'Client vs Server Components (Updated)',
        duration: 20,
      },
    });
    report('9. Instructor can update lesson title and duration via Hybrid Builder', res.statusCode === 200 && res.body.data?.title === 'Client vs Server Components (Updated)' && res.body.data?.duration === 20);
  }

  // 10. Add second lesson
  {
    const res = await simulateRequest(app, {
      method: 'POST',
      url: `/api/courses/chapters/${ch0Id}/lessons`,
      headers: { Authorization: `Bearer ${instructorToken}` },
      body: {
        title: 'Server Actions and Mutations',
        order: 1,
        duration: 20,
        content: { lead: 'Mutating data seamlessly with server actions.' },
      },
    });
    report('10. Instructor can add second lesson to chapter', res.statusCode === 201);
    lesson2Id = res.body?.data?.id;
  }

  // 11. Empty Course Submission Protection
  {
    const emptyCourse = await prisma.course.create({
      data: {
        title: 'Empty Test Course Without Chapters',
        description: 'Should be blocked from submission.',
        category: 'Web Development',
        level: 'Beginner',
        instructorId: instructorUser.id,
      },
    });

    const res = await simulateRequest(app, {
      method: 'POST',
      url: `/api/courses/${emptyCourse.id}/submit-review`,
      headers: { Authorization: `Bearer ${instructorToken}` },
    });
    report('11. Submission of empty course without chapters is rejected with 400 EMPTY_COURSE', res.statusCode === 400 && res.body.error?.code === 'EMPTY_COURSE');
  }

  // 12. Valid Course Submission: Transitions to PENDING_REVIEW
  {
    const res = await simulateRequest(app, {
      method: 'POST',
      url: `/api/courses/${createdCourseId}/submit-review`,
      headers: { Authorization: `Bearer ${instructorToken}` },
    });
    report('12. Submitting non-empty course updates status to PENDING_REVIEW', res.statusCode === 200 && res.body.data?.status === 'PENDING_REVIEW');
  }

  // 13. Admin Review Accreditation Decision: Approve Course
  {
    const res = await simulateRequest(app, {
      method: 'POST',
      url: `/api/courses/${createdCourseId}/review-decision`,
      headers: { Authorization: `Bearer ${adminToken}` },
      body: {
        status: 'APPROVED',
        reviewNote: 'Curriculum meets architectural and pedagogical excellence standards.',
      },
    });
    report('13. Admin can approve course review, updating status to APPROVED', res.statusCode === 200 && res.body.data?.status === 'APPROVED');
  }

  // 14. Student Enrollment: Auto-unlock free chapters (0-5)
  {
    const res = await simulateRequest(app, {
      method: 'POST',
      url: `/api/learning/enroll/${createdCourseId}`,
      headers: { Authorization: `Bearer ${studentToken}` },
    });
    report('14. Student enrollment auto-unlocks free chapters (ch0 in unlockedChapterIds, ch6 excluded)', res.statusCode === 201 && res.body.data?.unlockedChapterIds?.includes(ch0Id) && !res.body.data?.unlockedChapterIds?.includes(ch6Id));
  }

  // 15. Lesson Completion & Progress Calculation
  {
    const res = await simulateRequest(app, {
      method: 'POST',
      url: `/api/learning/courses/${createdCourseId}/lessons/${lesson1Id}/complete`,
      headers: { Authorization: `Bearer ${studentToken}` },
    });
    // 2 total lessons, 1 completed -> progressPercent = 50%
    report('15. Completing lesson updates completedLessonIds and calculates 50% progress', res.statusCode === 200 && res.body.data?.completedLessonIds?.includes(lesson1Id) && res.body.data?.progressPercent === 50);
  }

  // 16. Unlock Chapter 6: Insufficient coins check
  {
    // Temporarily reduce student coins to 20
    db.wallets[studentUser.id].balance = 20;

    const res = await simulateRequest(app, {
      method: 'POST',
      url: `/api/learning/courses/${createdCourseId}/chapters/${ch6Id}/unlock`,
      headers: { Authorization: `Bearer ${studentToken}` },
    });
    report('16. Unlocking chapter with insufficient coins returns 400 INSUFFICIENT_COINS', res.statusCode === 400 && res.body.error?.code === 'INSUFFICIENT_COINS');
  }

  // 17. Unlock Chapter 6: Successful atomic deduction and unlocking
  {
    // Restore balance to 100 coins
    db.wallets[studentUser.id].balance = 100;

    const res = await simulateRequest(app, {
      method: 'POST',
      url: `/api/learning/courses/${createdCourseId}/chapters/${ch6Id}/unlock`,
      headers: { Authorization: `Bearer ${studentToken}` },
    });
    const walletAfter = db.wallets[studentUser.id].balance;
    report('17. Unlocking chapter with sufficient coins deducts 50 coins (100 -> 50) and updates unlockedChapterIds', res.statusCode === 200 && walletAfter === 50 && res.body.data?.enrollment?.unlockedChapterIds?.includes(ch6Id));
  }

  // 18. Idempotent Chapter Unlock: Second unlock does not re-charge coins
  {
    const res = await simulateRequest(app, {
      method: 'POST',
      url: `/api/learning/courses/${createdCourseId}/chapters/${ch6Id}/unlock`,
      headers: { Authorization: `Bearer ${studentToken}` },
    });
    const walletAfter = db.wallets[studentUser.id].balance;
    report('18. Unlocking already-unlocked chapter is idempotent and does not deduct additional coins', res.statusCode === 200 && res.body.data?.alreadyUnlocked === true && walletAfter === 50);
  }

  // 19. CRSE-001: Instructor modifying an APPROVED course resets status to PENDING_REVIEW
  {
    const res = await simulateRequest(app, {
      method: 'PATCH',
      url: `/api/courses/${createdCourseId}`,
      headers: { Authorization: `Bearer ${instructorToken}` },
      body: {
        title: 'Next.js 15 Masterclass - Post-Approval Modification',
      },
    });
    const updated = db.courses.find((c) => c.id === createdCourseId);
    report('19. Modifying approved course resets status to PENDING_REVIEW', res.statusCode === 200 && updated?.status === 'PENDING_REVIEW');
  }

  console.log(`\n=== COURSE PLATFORM TEST SUMMARY: ${passed} Passed, ${failed} Failed ===`);
  if (failed > 0) process.exit(1);
}

runTests().catch((err) => {
  console.error('Test runner failure:', err);
  process.exit(1);
});
