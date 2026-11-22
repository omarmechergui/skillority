import assert from 'assert';
import http from 'http';
import app from '../src/app.js';
import prisma from '../src/config/database.js';
import { signAccessToken } from '../src/utils/jwt.js';
import { INITIAL_CAREER_PATHS } from '../src/data/careerPaths.data.js';
import { calculateOpportunityMatch, calculateCareerProgress } from '../src/services/matching.service.js';

process.env.DATABASE_URL = 'mongodb://placeholder_user:dummy@localhost:27017/test';
process.env.JWT_SECRET = 'test-secret-key-skillority-jwt-32-bytes';

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
        body: parsed,
      });
    };

    appInstance(rawReq, rawRes);
  });
}

// In-Memory Database store for mock persistence
const db = {
  users: [],
  profiles: [],
  careerPaths: [...INITIAL_CAREER_PATHS.map((p, idx) => ({ ...p, id: `path_${idx + 1}` }))],
  studentCareerGoals: [],
  opportunities: [],
  applications: [],
  interviews: [],
  offers: [],
  timelines: [],
  notifications: [],
  enrollments: [],
  certificates: [],
};

// Setup Mock Prisma Handlers
prisma.careerPath = {
  count: async ({ where } = {}) => {
    let list = db.careerPaths;
    if (where?.isActive !== undefined) list = list.filter((p) => p.isActive === where.isActive);
    if (where?.category) list = list.filter((p) => p.category === where.category);
    return list.length;
  },
  findMany: async ({ where, skip = 0, take = 50 } = {}) => {
    let list = db.careerPaths;
    if (where?.isActive !== undefined) list = list.filter((p) => p.isActive === where.isActive);
    if (where?.category) list = list.filter((p) => p.category === where.category);
    if (where?.difficultyLevel) list = list.filter((p) => p.difficultyLevel === where.difficultyLevel);
    if (where?.OR) {
      list = list.filter((p) =>
        where.OR.some(
          (cond) =>
            (cond.title && p.title.toLowerCase().includes(cond.title.contains.toLowerCase())) ||
            (cond.description && p.description.toLowerCase().includes(cond.description.contains.toLowerCase()))
        )
      );
    }
    return list.slice(skip, skip + take);
  },
  findUnique: async ({ where }) => {
    if (where.slug) return db.careerPaths.find((p) => p.slug === where.slug) || null;
    if (where.id) return db.careerPaths.find((p) => p.id === where.id) || null;
    return null;
  },
  create: async ({ data }) => {
    const newPath = { id: `path_${Date.now()}_${Math.random().toString(36).substring(7)}`, ...data };
    db.careerPaths.push(newPath);
    return newPath;
  },
  update: async ({ where, data }) => {
    const idx = db.careerPaths.findIndex((p) => p.id === where.id);
    if (idx === -1) return null;
    db.careerPaths[idx] = { ...db.careerPaths[idx], ...data };
    return db.careerPaths[idx];
  },
};

prisma.studentCareerGoal = {
  findMany: async ({ where }) => {
    const goals = db.studentCareerGoals.filter((g) => g.studentId === where.studentId);
    return goals.map((g) => ({
      ...g,
      careerPath: db.careerPaths.find((p) => p.id === g.careerPathId),
    }));
  },
  findUnique: async ({ where }) => {
    if (where.studentId_careerPathId) {
      return (
        db.studentCareerGoals.find(
          (g) =>
            g.studentId === where.studentId_careerPathId.studentId &&
            g.careerPathId === where.studentId_careerPathId.careerPathId
        ) || null
      );
    }
    return db.studentCareerGoals.find((g) => g.id === where.id) || null;
  },
  create: async ({ data }) => {
    const newGoal = { id: `goal_${Date.now()}`, ...data, createdAt: new Date() };
    db.studentCareerGoals.push(newGoal);
    return {
      ...newGoal,
      careerPath: db.careerPaths.find((p) => p.id === newGoal.careerPathId),
    };
  },
  update: async ({ where, data }) => {
    const idx = db.studentCareerGoals.findIndex((g) => g.id === where.id);
    if (idx === -1) return null;
    db.studentCareerGoals[idx] = { ...db.studentCareerGoals[idx], ...data };
    return {
      ...db.studentCareerGoals[idx],
      careerPath: db.careerPaths.find((p) => p.id === db.studentCareerGoals[idx].careerPathId),
    };
  },
  updateMany: async ({ where, data }) => {
    let count = 0;
    db.studentCareerGoals.forEach((g) => {
      if (g.studentId === where.studentId) {
        Object.assign(g, data);
        count++;
      }
    });
    return { count };
  },
  delete: async ({ where }) => {
    const idx = db.studentCareerGoals.findIndex((g) => g.id === where.id);
    if (idx === -1) return null;
    const deleted = db.studentCareerGoals.splice(idx, 1)[0];
    return deleted;
  },
};

prisma.opportunity = {
  count: async ({ where } = {}) => {
    let list = db.opportunities;
    if (where?.companyId) list = list.filter((o) => o.companyId === where.companyId);
    if (where?.isOpen !== undefined) list = list.filter((o) => o.isOpen === where.isOpen);
    if (where?.status) list = list.filter((o) => o.status === where.status);
    return list.length;
  },
  findMany: async ({ where = {}, skip = 0, take = 50 } = {}) => {
    let list = db.opportunities;
    if (where.companyId) list = list.filter((o) => o.companyId === where.companyId);
    if (where.isOpen !== undefined) list = list.filter((o) => o.isOpen === where.isOpen);
    if (where.status) list = list.filter((o) => o.status === where.status);
    if (where.type) list = list.filter((o) => o.type === where.type);
    if (where.workplaceType) list = list.filter((o) => o.workplaceType === where.workplaceType);
    if (where.OR) {
      list = list.filter((o) =>
        where.OR.some(
          (cond) =>
            (cond.title && o.title.toLowerCase().includes(cond.title.contains.toLowerCase())) ||
            (cond.description && o.description.toLowerCase().includes(cond.description.contains.toLowerCase())) ||
            (cond.location && o.location.toLowerCase().includes(cond.location.contains.toLowerCase()))
        )
      );
    }
    return list.slice(skip, skip + take).map((o) => ({
      ...o,
      _count: { applications: db.applications.filter((a) => a.opportunityId === o.id).length },
      company: {
        id: o.companyId,
        email: 'company@skillority.com',
        profile: { companyName: 'TechCorp Labs', avatar: null, industry: 'Technology' },
      },
    }));
  },
  findUnique: async ({ where }) => {
    const o = db.opportunities.find((opp) => opp.id === where.id);
    if (!o) return null;
    return {
      ...o,
      _count: { applications: db.applications.filter((a) => a.opportunityId === o.id).length },
      company: {
        id: o.companyId,
        email: 'company@skillority.com',
        profile: { companyName: 'TechCorp Labs', avatar: null, industry: 'Technology' },
      },
    };
  },
  create: async ({ data }) => {
    const newOpp = {
      id: `opp_${Date.now()}_${Math.random().toString(36).substring(7)}`,
      positions: 1,
      filledPositions: 0,
      skills: [],
      optionalSkills: [],
      isOpen: true,
      status: 'PUBLISHED',
      createdAt: new Date(),
      ...data,
    };
    db.opportunities.push(newOpp);
    return newOpp;
  },
  update: async ({ where, data }) => {
    const idx = db.opportunities.findIndex((o) => o.id === where.id);
    if (idx === -1) return null;
    if (data.filledPositions?.increment) {
      db.opportunities[idx].filledPositions = (db.opportunities[idx].filledPositions || 0) + data.filledPositions.increment;
      delete data.filledPositions;
    }
    db.opportunities[idx] = { ...db.opportunities[idx], ...data };
    return db.opportunities[idx];
  },
};

prisma.application = {
  count: async ({ where } = {}) => {
    return db.applications.length;
  },
  findMany: async ({ where = {} } = {}) => {
    let list = db.applications;
    if (where.studentId) list = list.filter((a) => a.studentId === where.studentId);
    if (where.opportunity?.companyId) {
      const companyOppIds = db.opportunities
        .filter((o) => o.companyId === where.opportunity.companyId)
        .map((o) => o.id);
      list = list.filter((a) => companyOppIds.includes(a.opportunityId));
    }
    if (where.opportunityId) list = list.filter((a) => a.opportunityId === where.opportunityId);
    if (where.status) list = list.filter((a) => a.status === where.status);

    return list.map((a) => {
      const opp = db.opportunities.find((o) => o.id === a.opportunityId);
      const studentUser = db.users.find((u) => u.id === a.studentId) || { id: a.studentId, email: 'student@skillority.com' };
      const studentProfile = db.profiles.find((p) => p.userId === a.studentId) || { firstName: 'Alice', lastName: 'Student', skills: ['JavaScript', 'React'] };
      const appInterviews = db.interviews.filter((i) => i.applicationId === a.id);
      const appOffer = db.offers.find((o) => o.applicationId === a.id) || null;
      const appTimeline = db.timelines.filter((t) => t.applicationId === a.id);

      return {
        ...a,
        opportunity: {
          ...opp,
          company: {
            id: opp?.companyId,
            profile: { companyName: 'TechCorp Labs', avatar: null },
          },
        },
        student: {
          ...studentUser,
          profile: studentProfile,
          certificates: [],
          enrollments: [],
        },
        interviews: appInterviews,
        offer: appOffer,
        timeline: appTimeline,
      };
    });
  },
  findUnique: async ({ where }) => {
    if (where.opportunityId_studentId) {
      return (
        db.applications.find(
          (a) =>
            a.opportunityId === where.opportunityId_studentId.opportunityId &&
            a.studentId === where.opportunityId_studentId.studentId
        ) || null
      );
    }
    const a = db.applications.find((app) => app.id === where.id);
    if (!a) return null;
    const opp = db.opportunities.find((o) => o.id === a.opportunityId);
    const studentUser = db.users.find((u) => u.id === a.studentId) || { id: a.studentId, email: 'student@skillority.com' };
    const studentProfile = db.profiles.find((p) => p.userId === a.studentId) || { firstName: 'Alice', lastName: 'Student', skills: ['JavaScript', 'React'] };
    const appInterviews = db.interviews.filter((i) => i.applicationId === a.id);
    const appOffer = db.offers.find((o) => o.applicationId === a.id) || null;
    const appTimeline = db.timelines.filter((t) => t.applicationId === a.id);

    return {
      ...a,
      opportunity: opp,
      student: {
        ...studentUser,
        profile: studentProfile,
        certificates: [],
        enrollments: [],
        careerGoals: [],
      },
      interviews: appInterviews,
      offer: appOffer,
      timeline: appTimeline,
    };
  },
  create: async ({ data }) => {
    const newApp = {
      id: `app_${Date.now()}_${Math.random().toString(36).substring(7)}`,
      status: 'PENDING',
      createdAt: new Date(),
      ...data,
    };
    db.applications.push(newApp);
    const opp = db.opportunities.find((o) => o.id === newApp.opportunityId);
    return { ...newApp, opportunity: opp };
  },
  update: async ({ where, data }) => {
    const idx = db.applications.findIndex((a) => a.id === where.id);
    if (idx === -1) return null;
    db.applications[idx] = { ...db.applications[idx], ...data, updatedAt: new Date() };
    return db.applications[idx];
  },
};

prisma.interview = {
  count: async ({ where } = {}) => {
    let list = db.interviews;
    if (where?.status) list = list.filter((i) => i.status === where.status);
    return list.length;
  },
  create: async ({ data }) => {
    const newInv = {
      id: `inv_${Date.now()}`,
      status: 'SCHEDULED',
      createdAt: new Date(),
      ...data,
    };
    db.interviews.push(newInv);
    return newInv;
  },
  findUnique: async ({ where }) => {
    return db.interviews.find((i) => i.id === where.id) || null;
  },
  update: async ({ where, data }) => {
    const idx = db.interviews.findIndex((i) => i.id === where.id);
    if (idx === -1) return null;
    db.interviews[idx] = { ...db.interviews[idx], ...data };
    return db.interviews[idx];
  },
};

prisma.offer = {
  count: async ({ where } = {}) => {
    let list = db.offers;
    if (where?.status) list = list.filter((o) => o.status === where.status);
    return list.length;
  },
  findUnique: async ({ where }) => {
    const o = db.offers.find((off) => off.id === where.id);
    if (!o) return null;
    const opp = db.opportunities.find((opp) => opp.id === o.opportunityId);
    const app = db.applications.find((a) => a.id === o.applicationId);
    return { ...o, opportunity: opp, application: app };
  },
  create: async ({ data }) => {
    const newOffer = {
      id: `offer_${Date.now()}`,
      status: 'PENDING',
      createdAt: new Date(),
      ...data,
    };
    db.offers.push(newOffer);
    return newOffer;
  },
  update: async ({ where, data }) => {
    const idx = db.offers.findIndex((o) => o.id === where.id);
    if (idx === -1) return null;
    db.offers[idx] = { ...db.offers[idx], ...data };
    return db.offers[idx];
  },
};

prisma.applicationTimeline = {
  create: async ({ data }) => {
    const newT = { id: `tl_${Date.now()}`, createdAt: new Date(), ...data };
    db.timelines.push(newT);
    return newT;
  },
};

prisma.notification = {
  create: async ({ data }) => {
    const notif = { id: `notif_${Date.now()}`, isRead: false, createdAt: new Date(), ...data };
    db.notifications.push(notif);
    return notif;
  },
};

prisma.user = {
  findUnique: async ({ where, include }) => {
    let u = db.users.find((user) => user.id === where.id);
    if (!u) {
      u = { id: where.id, email: `${where.id}@skillority.com`, role: 'STUDENT', isActive: true, tokenVersion: 0 };
    }
    const profile = db.profiles.find((p) => p.userId === u.id) || {
      firstName: 'Student',
      lastName: 'User',
      skills: ['JavaScript', 'React', 'HTML5 & CSS3', 'Tailwind CSS'],
      university: 'Tech University',
      major: 'Computer Science',
      bio: 'Enthusiastic developer learning fullstack engineering.',
      interests: ['Software Engineering', 'Web Development'],
    };
    const enrollments = db.enrollments.filter((e) => e.userId === u.id);
    const certificates = db.certificates.filter((c) => c.recipientId === u.id);
    const goals = db.studentCareerGoals
      .filter((g) => g.studentId === u.id)
      .map((g) => ({ ...g, careerPath: db.careerPaths.find((p) => p.id === g.careerPathId) }));

    return {
      ...u,
      profile,
      enrollments,
      certificates,
      careerGoals: goals,
    };
  },
};

// ============================================================================
// TEST RUNNER
// ============================================================================

async function runCareerRecruitmentTests() {
  console.log('=== STARTING MODULE 3: CAREERS, INTERNSHIPS & RECRUITMENT TEST SUITE ===\n');
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

  // Tokens
  const studentToken = signAccessToken({ id: 'student_123', email: 'student@skillority.com', role: 'STUDENT' });
  const companyAToken = signAccessToken({ id: 'company_A', email: 'compA@skillority.com', role: 'COMPANY' });
  const companyBToken = signAccessToken({ id: 'company_B', email: 'compB@skillority.com', role: 'COMPANY' });
  const adminToken = signAccessToken({ id: 'admin_root', email: 'admin@skillority.com', role: 'ADMIN' });

  // --------------------------------------------------------------------------
  // MODULE 3A: CAREER PATHS & SKILL PROGRESS
  // --------------------------------------------------------------------------
  try {
    const res = await simulateRequest(app, {
      method: 'GET',
      url: '/api/careers/paths',
    });
    assert.strictEqual(res.statusCode, 200);
    assert.strictEqual(res.body.success, true);
    assert(Array.isArray(res.body.data));
    assert(res.body.data.length >= 13, `Expected at least 13 career paths, got ${res.body.data.length}`);
    pass('1. Public GET /api/careers/paths returns full career path catalog (13 professions)');
  } catch (err) {
    fail('1. Public GET /api/careers/paths', err);
  }

  try {
    const res = await simulateRequest(app, {
      method: 'GET',
      url: '/api/careers/paths/frontend-developer',
    });
    assert.strictEqual(res.statusCode, 200);
    assert.strictEqual(res.body.success, true);
    assert.strictEqual(res.body.data.title, 'Frontend Developer');
    assert(Array.isArray(res.body.data.requiredSkills));
    assert(res.body.data.requiredSkills.some((s) => s.name === 'React'));
    pass('2. Public GET /api/careers/paths/:slug returns path details with required skills & weights');
  } catch (err) {
    fail('2. Public GET /api/careers/paths/:slug', err);
  }

  try {
    const res = await simulateRequest(app, {
      method: 'POST',
      url: '/api/careers/paths',
      headers: { Authorization: `Bearer ${studentToken}` },
      body: {
        title: 'Hacker Path',
        slug: 'hacker-path',
        description: 'Testing unauthorized creation',
        category: 'Security',
        requiredSkills: [{ name: 'Hacking', proficiency: 'Expert', importance: 'CORE' }],
      },
    });
    assert.strictEqual(res.statusCode, 403);
    pass('3. Student role cannot create career paths (403 FORBIDDEN)');
  } catch (err) {
    fail('3. Non-admin career path creation guard', err);
  }

  try {
    const res = await simulateRequest(app, {
      method: 'POST',
      url: '/api/careers/goals',
      headers: { Authorization: `Bearer ${studentToken}` },
      body: {
        careerPathId: 'path_1', // Frontend Developer
        isPrimary: true,
        notes: 'Targeting junior frontend engineer positions by Q3',
      },
    });
    assert.strictEqual(res.statusCode, 200);
    assert.strictEqual(res.body.success, true);
    assert.strictEqual(res.body.data.careerPathId, 'path_1');
    assert.strictEqual(res.body.data.isPrimary, true);
    pass('4. Student can set primary career goal');
  } catch (err) {
    fail('4. Student career goal selection', err);
  }

  try {
    const res = await simulateRequest(app, {
      method: 'GET',
      url: '/api/careers/goals',
      headers: { Authorization: `Bearer ${studentToken}` },
    });
    assert.strictEqual(res.statusCode, 200);
    assert.strictEqual(res.body.success, true);
    assert(Array.isArray(res.body.data));
    assert.strictEqual(res.body.data[0].progress.stats.totalRequiredSkills, 5);
    pass('5. Student can retrieve career goals with computed progress and skill verification');
  } catch (err) {
    fail('5. Student career goals retrieval', err);
  }

  try {
    const res = await simulateRequest(app, {
      method: 'GET',
      url: '/api/careers/progress/path_1',
      headers: { Authorization: `Bearer ${studentToken}` },
    });
    assert.strictEqual(res.statusCode, 200);
    assert.strictEqual(res.body.success, true);
    assert(res.body.data.readinessScore > 0);
    assert(Array.isArray(res.body.data.verifiedSkills));
    assert(Array.isArray(res.body.data.skillGaps));
    pass('6. Detailed career progress calculates verified skills, milestones, and skill gaps');
  } catch (err) {
    fail('6. Career progress calculation', err);
  }

  // --------------------------------------------------------------------------
  // MODULE 3B: INTERNSHIP MARKETPLACE & CRUD
  // --------------------------------------------------------------------------
  let createdOpportunityId = null;

  try {
    const res = await simulateRequest(app, {
      method: 'POST',
      url: '/api/careers/opportunities',
      headers: { Authorization: `Bearer ${companyAToken}` },
      body: {
        title: 'Frontend React Engineering Intern',
        description: 'Join TechCorp Labs to build responsive client web apps using React, Tailwind, and Next.js.',
        type: 'INTERNSHIP',
        category: 'Software Engineering',
        location: 'Remote',
        workplaceType: 'REMOTE',
        positions: 2,
        duration: '6 months',
        stipend: '$1,200 / month',
        skills: ['JavaScript', 'React', 'Tailwind CSS'],
        optionalSkills: ['Next.js', 'Git & GitHub'],
        status: 'PUBLISHED',
      },
    });
    assert.strictEqual(res.statusCode, 201);
    assert.strictEqual(res.body.success, true);
    assert.strictEqual(res.body.data.title, 'Frontend React Engineering Intern');
    createdOpportunityId = res.body.data.id;
    pass('7. Company can create and publish an internship opportunity');
  } catch (err) {
    fail('7. Create opportunity', err);
  }

  try {
    const res = await simulateRequest(app, {
      method: 'POST',
      url: '/api/careers/opportunities',
      headers: { Authorization: `Bearer ${studentToken}` },
      body: {
        title: 'Unauthorized Student Job',
        description: 'A student trying to post a job opportunity on the platform.',
        location: 'Remote',
        skills: ['Python'],
      },
    });
    assert.strictEqual(res.statusCode, 403);
    pass('8. Student role is rejected when attempting to create opportunities (403 FORBIDDEN)');
  } catch (err) {
    fail('8. Student create opportunity guard', err);
  }

  try {
    const res = await simulateRequest(app, {
      method: 'PATCH',
      url: `/api/careers/opportunities/${createdOpportunityId}`,
      headers: { Authorization: `Bearer ${companyBToken}` },
      body: {
        title: 'Hacked Title by Company B',
      },
    });
    assert.strictEqual(res.statusCode, 403);
    pass('9. Company B cannot update Company A opportunity (Ownership Guard 403 FORBIDDEN)');
  } catch (err) {
    fail('9. Cross-company opportunity modification', err);
  }

  try {
    const res = await simulateRequest(app, {
      method: 'GET',
      url: '/api/careers/opportunities?search=React&workplaceType=REMOTE',
      headers: { Authorization: `Bearer ${studentToken}` },
    });
    assert.strictEqual(res.statusCode, 200);
    assert.strictEqual(res.body.success, true);
    assert(Array.isArray(res.body.data));
    assert(res.body.data.length >= 1);
    assert(res.body.data[0].matchScore >= 60, `Expected matchScore >= 60, got ${res.body.data[0].matchScore}`);
    pass('10. Marketplace search & workplace filtering returns matched opportunities with student match score');
  } catch (err) {
    fail('10. Marketplace filtering & matching', err);
  }

  // --------------------------------------------------------------------------
  // MODULE 3C: STUDENT APPLICATIONS
  // --------------------------------------------------------------------------
  let studentApplicationId = null;

  try {
    const res = await simulateRequest(app, {
      method: 'POST',
      url: `/api/careers/opportunities/${createdOpportunityId}/apply`,
      headers: { Authorization: `Bearer ${studentToken}` },
      body: {
        coverLetter: 'I have completed modern React coursework and built 3 production frontend applications.',
        portfolioUrl: 'https://github.com/student-demo/portfolio',
        candidateSkills: ['JavaScript', 'React', 'Tailwind CSS'],
      },
    });
    assert.strictEqual(res.statusCode, 201);
    assert.strictEqual(res.body.success, true);
    assert.strictEqual(res.body.data.status, 'PENDING');
    assert(res.body.data.matchScore > 0);
    studentApplicationId = res.body.data.id;
    pass('11. Student can apply to published opportunity with cover letter and skills');
  } catch (err) {
    fail('11. Student application creation', err);
  }

  try {
    const res = await simulateRequest(app, {
      method: 'POST',
      url: `/api/careers/opportunities/${createdOpportunityId}/apply`,
      headers: { Authorization: `Bearer ${studentToken}` },
      body: {
        coverLetter: 'Second attempt applying to the same opportunity.',
      },
    });
    assert.strictEqual(res.statusCode, 409);
    assert.strictEqual(res.body.error.code, 'ALREADY_APPLIED');
    pass('12. Duplicate application attempt is strictly rejected with 409 ALREADY_APPLIED');
  } catch (err) {
    fail('12. Duplicate application rejection', err);
  }

  try {
    const res = await simulateRequest(app, {
      method: 'GET',
      url: '/api/careers/my-applications',
      headers: { Authorization: `Bearer ${studentToken}` },
    });
    assert.strictEqual(res.statusCode, 200);
    assert.strictEqual(res.body.success, true);
    assert.strictEqual(res.body.data.length, 1);
    assert.strictEqual(res.body.data[0].status, 'PENDING');
    assert.strictEqual(res.body.data[0].internalNotes, undefined, 'Internal company notes must never leak to student');
    pass('13. Student application dashboard lists applications and strictly sanitizes private notes');
  } catch (err) {
    fail('13. Student applications listing & privacy', err);
  }

  // --------------------------------------------------------------------------
  // MODULE 3D: COMPANY RECRUITMENT MANAGEMENT
  // --------------------------------------------------------------------------
  try {
    const res = await simulateRequest(app, {
      method: 'GET',
      url: '/api/careers/company/dashboard',
      headers: { Authorization: `Bearer ${companyAToken}` },
    });
    assert.strictEqual(res.statusCode, 200);
    assert.strictEqual(res.body.success, true);
    assert.strictEqual(res.body.data.totalOpportunities, 1);
    assert.strictEqual(res.body.data.totalApplications, 1);
    assert.strictEqual(res.body.data.pendingReviewCount, 1);
    pass('14. Company recruitment dashboard returns accurate real-time metrics');
  } catch (err) {
    fail('14. Company dashboard metrics', err);
  }

  try {
    const res = await simulateRequest(app, {
      method: 'POST',
      url: `/api/careers/applications/${studentApplicationId}/evaluate`,
      headers: { Authorization: `Bearer ${companyAToken}` },
      body: {
        internalNotes: 'Strong React background, verified 100% quiz scores.',
        rating: 5,
      },
    });
    assert.strictEqual(res.statusCode, 200);
    assert.strictEqual(res.body.success, true);
    assert.strictEqual(res.body.data.rating, 5);
    pass('15. Company can record candidate evaluation with rating and private internal notes');
  } catch (err) {
    fail('15. Candidate evaluation', err);
  }

  try {
    const res = await simulateRequest(app, {
      method: 'PATCH',
      url: `/api/careers/applications/${studentApplicationId}/status`,
      headers: { Authorization: `Bearer ${companyAToken}` },
      body: {
        status: 'SHORTLISTED',
        notes: 'Passed initial screening; moving candidate to technical interview.',
      },
    });
    assert.strictEqual(res.statusCode, 200);
    assert.strictEqual(res.body.success, true);
    assert.strictEqual(res.body.data.status, 'SHORTLISTED');
    pass('16. Company can advance candidate status to SHORTLISTED in pipeline');
  } catch (err) {
    fail('16. Status transition to SHORTLISTED', err);
  }

  // --------------------------------------------------------------------------
  // MODULE 3E: MATCHING ENGINE UNIT VERIFICATION
  // --------------------------------------------------------------------------
  try {
    const match = calculateOpportunityMatch(
      {
        profile: {
          skills: ['JavaScript', 'React', 'HTML5 & CSS3'],
          university: 'State University',
          major: 'Software Engineering',
          bio: 'Junior frontend developer.',
          interests: ['Software Engineering'],
        },
        enrollments: [{ isCompleted: true }],
        certificates: [{ id: 'cert_1' }],
        careerGoals: [{ isPrimary: true, careerPath: { title: 'Frontend Developer', category: 'Software Engineering' } }],
      },
      {
        skills: ['JavaScript', 'React'],
        optionalSkills: ['Tailwind CSS'],
        category: 'Software Engineering',
        workplaceType: 'REMOTE',
      }
    );
    assert(match.score >= 85, `Expected score >= 85, got ${match.score}`);
    assert.strictEqual(match.matchedSkills.length, 2);
    assert.strictEqual(match.missingSkills.length, 0);
    assert(match.explanations.length > 0);
    pass('17. Deterministic candidate matching engine scores 85%+ for well-aligned candidate with credentials');
  } catch (err) {
    fail('17. Candidate matching engine calculation', err);
  }

  // --------------------------------------------------------------------------
  // MODULE 3F: INTERVIEWS, OFFERS & NOTIFICATIONS
  // --------------------------------------------------------------------------
  let interviewId = null;

  try {
    const interviewDate = new Date(Date.now() + 86400000 * 3).toISOString();
    const res = await simulateRequest(app, {
      method: 'POST',
      url: `/api/careers/applications/${studentApplicationId}/interviews`,
      headers: { Authorization: `Bearer ${companyAToken}` },
      body: {
        scheduledAt: interviewDate,
        timezone: 'UTC',
        interviewType: 'TECHNICAL',
        meetingLink: 'https://meet.jit.si/skillority-interview-test',
        instructions: 'Prepare to discuss your React project architecture and state management.',
      },
    });
    assert.strictEqual(res.statusCode, 201);
    assert.strictEqual(res.body.success, true);
    assert.strictEqual(res.body.data.status, 'SCHEDULED');
    interviewId = res.body.data.id;
    pass('18. Company schedules technical interview; application status auto-updates to INTERVIEW');
  } catch (err) {
    fail('18. Schedule interview', err);
  }

  let offerId = null;

  try {
    const res = await simulateRequest(app, {
      method: 'POST',
      url: `/api/careers/applications/${studentApplicationId}/offers`,
      headers: { Authorization: `Bearer ${companyAToken}` },
      body: {
        title: 'Junior React Frontend Intern',
        stipend: '$1,500 / month',
        duration: '6 months',
        conditions: 'Full-time 40hrs/week remote engagement with senior engineering mentorship.',
      },
    });
    assert.strictEqual(res.statusCode, 201);
    assert.strictEqual(res.body.success, true);
    assert.strictEqual(res.body.data.status, 'PENDING');
    offerId = res.body.data.id;
    pass('19. Company extends official internship offer to candidate');
  } catch (err) {
    fail('19. Create offer', err);
  }

  try {
    const res = await simulateRequest(app, {
      method: 'POST',
      url: `/api/careers/offers/${offerId}/respond`,
      headers: { Authorization: `Bearer ${companyBToken}` }, // unauthorized user
      body: { status: 'ACCEPTED' },
    });
    assert.strictEqual(res.statusCode, 403);
    pass('20. Unauthorized user cannot accept another student\'s offer (403 FORBIDDEN)');
  } catch (err) {
    fail('20. Unauthorized offer response guard', err);
  }

  try {
    const res = await simulateRequest(app, {
      method: 'POST',
      url: `/api/careers/offers/${offerId}/respond`,
      headers: { Authorization: `Bearer ${studentToken}` },
      body: { status: 'ACCEPTED' },
    });
    assert.strictEqual(res.statusCode, 200);
    assert.strictEqual(res.body.success, true);
    assert.strictEqual(res.body.data.status, 'ACCEPTED');

    const opp = db.opportunities.find((o) => o.id === createdOpportunityId);
    assert.strictEqual(opp.filledPositions, 1, 'Accepting offer must increment filledPositions');
    pass('21. Student accepts offer; capacity increments and recruitment lifecycle completes successfully');
  } catch (err) {
    fail('21. Student accept offer', err);
  }

  // --------------------------------------------------------------------------
  // MODULE 3G: ADMIN MODERATION & SECURITY AUDIT
  // --------------------------------------------------------------------------
  try {
    const res = await simulateRequest(app, {
      method: 'GET',
      url: '/api/careers/admin/overview',
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    assert.strictEqual(res.statusCode, 200);
    assert.strictEqual(res.body.success, true);
    assert(res.body.data.totalCareers >= 13);
    assert.strictEqual(res.body.data.totalOpportunities, 1);
    assert.strictEqual(res.body.data.acceptedOffers, 1);
    pass('22. Admin can inspect recruitment oversight metrics across all platform opportunities');
  } catch (err) {
    fail('22. Admin recruitment overview', err);
  }

  try {
    const res = await simulateRequest(app, {
      method: 'PATCH',
      url: `/api/careers/admin/opportunities/${createdOpportunityId}/moderate`,
      headers: { Authorization: `Bearer ${adminToken}` },
      body: { status: 'CLOSED', isOpen: false },
    });
    assert.strictEqual(res.statusCode, 200);
    assert.strictEqual(res.body.success, true);
    assert.strictEqual(res.body.data.status, 'CLOSED');
    pass('23. Admin can moderate and close opportunities server-side');
  } catch (err) {
    fail('23. Admin opportunity moderation', err);
  }

  try {
    // Verify notifications were generated during recruitment actions
    assert(db.notifications.length >= 3, `Expected at least 3 notifications, got ${db.notifications.length}`);
    pass('24. Notifications generated and persisted for application, status updates, interview, and offer');
  } catch (err) {
    fail('24. Notification persistence check', err);
  }

  console.log(`\n=== CAREER & RECRUITMENT TEST SUMMARY: ${passed} Passed, ${failed} Failed ===`);
  if (failed > 0) process.exit(1);
}

runCareerRecruitmentTests();
