import assert from 'assert';
import http from 'http';
import app from '../src/app.js';
import prisma from '../src/config/database.js';
import { signAccessToken } from '../src/utils/jwt.js';
import { INITIAL_CAREER_PATHS } from '../src/data/careerPaths.data.js';
import { calculateOpportunityMatch, calculateCareerProgress, hasSkillMatch } from '../src/services/matching.service.js';

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
    if (data.filledPositions?.decrement) {
      db.opportunities[idx].filledPositions = Math.max(0, (db.opportunities[idx].filledPositions || 0) - data.filledPositions.decrement);
      delete data.filledPositions;
    }
    db.opportunities[idx] = { ...db.opportunities[idx], ...data };
    return db.opportunities[idx];
  },
  updateMany: async ({ where, data }) => {
    const matched = db.opportunities.filter((o) => {
      if (where.id && o.id !== where.id) return false;
      if (where.filledPositions?.lt !== undefined && !(o.filledPositions < where.filledPositions.lt)) return false;
      return true;
    });
    matched.forEach((o) => {
      if (data.filledPositions?.increment) {
        o.filledPositions = (o.filledPositions || 0) + data.filledPositions.increment;
      }
      if (data.status) o.status = data.status;
      if (data.isOpen !== undefined) o.isOpen = data.isOpen;
    });
    return { count: matched.length };
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
    if (idx === -1) {
      const err = new Error('Record to update not found.');
      err.code = 'P2025';
      throw err;
    }
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
  updateMany: async ({ where, data }) => {
    const matched = db.offers.filter((o) => {
      if (where.id && o.id !== where.id) return false;
      if (where.studentId && o.studentId !== where.studentId) return false;
      if (where.status && o.status !== where.status) return false;
      return true;
    });
    matched.forEach((o) => {
      if (data.status) o.status = data.status;
      if (data.respondedAt) o.respondedAt = data.respondedAt;
      if (data.declinedReason !== undefined) o.declinedReason = data.declinedReason;
    });
    return { count: matched.length };
  },
};

prisma.$transaction = async (fn) => {
  if (typeof fn === 'function') {
    return fn(prisma);
  }
  if (Array.isArray(fn)) {
    return Promise.all(fn);
  }
  return fn;
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
      let role = 'STUDENT';
      if (where.id?.startsWith('company_')) role = 'COMPANY';
      else if (where.id?.startsWith('admin_')) role = 'ADMIN';
      u = { id: where.id, email: `${where.id}@skillority.com`, role, isActive: true, tokenVersion: 0 };
    } else {
      u = { isActive: true, tokenVersion: 0, ...u };
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

  // --------------------------------------------------------------------------
  // MODULE 3 STABILIZATION REGRESSION SUITE
  // --------------------------------------------------------------------------

  // TASK 1: OFFER ACCEPTANCE INTEGRITY
  // Test 25: Two candidates accepting final position concurrently
  try {
    const oppIdConcurrent = 'opp_concurrent_1';
    db.opportunities.push({
      id: oppIdConcurrent,
      companyId: 'company_A',
      title: 'Senior Backend Intern',
      positions: 1,
      filledPositions: 0,
      skills: ['Node.js'],
      isOpen: true,
      status: 'PUBLISHED',
      createdAt: new Date(),
    });

    const student1 = { id: 'usr_stud_concur_1', role: 'STUDENT', email: 's1@test.com' };
    const student2 = { id: 'usr_stud_concur_2', role: 'STUDENT', email: 's2@test.com' };
    db.users.push(student1, student2);
    const tokenS1 = signAccessToken(student1);
    const tokenS2 = signAccessToken(student2);

    const app1 = { id: 'app_concur_1', opportunityId: oppIdConcurrent, studentId: student1.id, status: 'OFFERED' };
    const app2 = { id: 'app_concur_2', opportunityId: oppIdConcurrent, studentId: student2.id, status: 'OFFERED' };
    db.applications.push(app1, app2);

    const offer1 = { id: 'offer_concur_1', opportunityId: oppIdConcurrent, applicationId: app1.id, studentId: student1.id, companyId: 'company_A', status: 'PENDING' };
    const offer2 = { id: 'offer_concur_2', opportunityId: oppIdConcurrent, applicationId: app2.id, studentId: student2.id, companyId: 'company_A', status: 'PENDING' };
    db.offers.push(offer1, offer2);

    const [res1, res2] = await Promise.all([
      simulateRequest(app, {
        method: 'POST',
        url: `/api/careers/offers/${offer1.id}/respond`,
        headers: { Authorization: `Bearer ${tokenS1}` },
        body: { status: 'ACCEPTED' },
      }),
      simulateRequest(app, {
        method: 'POST',
        url: `/api/careers/offers/${offer2.id}/respond`,
        headers: { Authorization: `Bearer ${tokenS2}` },
        body: { status: 'ACCEPTED' },
      }),
    ]);

    const successes = [res1, res2].filter((r) => r.statusCode === 200);
    const rejections = [res1, res2].filter((r) => r.statusCode === 400 && r.body.error?.code === 'POSITIONS_FULL');

    assert.strictEqual(successes.length, 1, 'Only one candidate should be able to accept the final position');
    assert.strictEqual(rejections.length, 1, 'The other candidate must receive POSITIONS_FULL');

    const opp = db.opportunities.find((o) => o.id === oppIdConcurrent);
    assert.strictEqual(opp.filledPositions, 1, 'filledPositions must never exceed positions limit of 1');
    assert.strictEqual(opp.status, 'CLOSED', 'Opportunity must be auto-closed once positions are filled');
    pass('25. Concurrency Guard: Two candidates accepting final position concurrently cannot exceed capacity');
  } catch (err) {
    fail('25. Concurrency Guard: Concurrent offer acceptance', err);
  }

  // Test 26: Duplicate simultaneous requests accepting the same offer
  try {
    const oppIdDup = 'opp_dup_1';
    db.opportunities.push({
      id: oppIdDup,
      companyId: 'company_A',
      title: 'Fullstack Intern',
      positions: 5,
      filledPositions: 0,
      skills: ['React'],
      isOpen: true,
      status: 'PUBLISHED',
      createdAt: new Date(),
    });

    const studentDup = { id: 'usr_stud_dup_1', role: 'STUDENT', email: 's_dup@test.com' };
    db.users.push(studentDup);
    const tokenDup = signAccessToken(studentDup);

    const appDup = { id: 'app_dup_1', opportunityId: oppIdDup, studentId: studentDup.id, status: 'OFFERED' };
    db.applications.push(appDup);

    const offerDup = { id: 'offer_dup_1', opportunityId: oppIdDup, applicationId: appDup.id, studentId: studentDup.id, companyId: 'company_A', status: 'PENDING' };
    db.offers.push(offerDup);

    const [dupRes1, dupRes2] = await Promise.all([
      simulateRequest(app, {
        method: 'POST',
        url: `/api/careers/offers/${offerDup.id}/respond`,
        headers: { Authorization: `Bearer ${tokenDup}` },
        body: { status: 'ACCEPTED' },
      }),
      simulateRequest(app, {
        method: 'POST',
        url: `/api/careers/offers/${offerDup.id}/respond`,
        headers: { Authorization: `Bearer ${tokenDup}` },
        body: { status: 'ACCEPTED' },
      }),
    ]);

    const dupSuccess = [dupRes1, dupRes2].filter((r) => r.statusCode === 200);
    const dupConflict = [dupRes1, dupRes2].filter((r) => r.statusCode === 400 && r.body.error?.code === 'RESOLVED');

    assert.strictEqual(dupSuccess.length, 1, 'Only one of the duplicate acceptance requests should succeed');
    assert.strictEqual(dupConflict.length, 1, 'The second request must be rejected with RESOLVED');

    const opp = db.opportunities.find((o) => o.id === oppIdDup);
    assert.strictEqual(opp.filledPositions, 1, 'filledPositions must increment exactly once');
    pass('26. Duplicate Guard: Two simultaneous requests accepting the same offer cannot double-increment');
  } catch (err) {
    fail('26. Duplicate Guard: Simultaneous accept on same offer', err);
  }

  // Test 27: Capacity already reached
  try {
    const oppIdFull = 'opp_full_1';
    db.opportunities.push({
      id: oppIdFull,
      companyId: 'company_A',
      title: 'DevOps Intern',
      positions: 1,
      filledPositions: 1,
      skills: ['Docker'],
      isOpen: false,
      status: 'CLOSED',
      createdAt: new Date(),
    });

    const studentLate = { id: 'usr_stud_late_1', role: 'STUDENT', email: 's_late@test.com' };
    db.users.push(studentLate);
    const tokenLate = signAccessToken(studentLate);

    const appLate = { id: 'app_late_1', opportunityId: oppIdFull, studentId: studentLate.id, status: 'OFFERED' };
    db.applications.push(appLate);

    const offerLate = { id: 'offer_late_1', opportunityId: oppIdFull, applicationId: appLate.id, studentId: studentLate.id, companyId: 'company_A', status: 'PENDING' };
    db.offers.push(offerLate);

    const res = await simulateRequest(app, {
      method: 'POST',
      url: `/api/careers/offers/${offerLate.id}/respond`,
      headers: { Authorization: `Bearer ${tokenLate}` },
      body: { status: 'ACCEPTED' },
    });

    assert.strictEqual(res.statusCode, 400);
    assert.strictEqual(res.body.error?.code, 'POSITIONS_FULL');
    assert.strictEqual(offerLate.status, 'PENDING', 'Offer status must remain unchanged on capacity failure');
    pass('27. Capacity Check: Offer acceptance rejected when opportunity capacity is already reached');
  } catch (err) {
    fail('27. Capacity Check: Already full rejection', err);
  }

  // Test 28: Failed update and rollback behavior
  try {
    const oppIdRollback = 'opp_rb_1';
    db.opportunities.push({
      id: oppIdRollback,
      companyId: 'company_A',
      title: 'Cloud Intern',
      positions: 2,
      filledPositions: 0,
      skills: ['AWS'],
      isOpen: true,
      status: 'PUBLISHED',
      createdAt: new Date(),
    });

    const studentRb = { id: 'usr_stud_rb_1', role: 'STUDENT', email: 's_rb@test.com' };
    db.users.push(studentRb);
    const tokenRb = signAccessToken(studentRb);

    const offerBroken = { id: 'offer_rb_broken', opportunityId: oppIdRollback, applicationId: 'non_existent_app', studentId: studentRb.id, companyId: 'company_A', status: 'PENDING' };
    db.offers.push(offerBroken);

    const res = await simulateRequest(app, {
      method: 'POST',
      url: `/api/careers/offers/${offerBroken.id}/respond`,
      headers: { Authorization: `Bearer ${tokenRb}` },
      body: { status: 'ACCEPTED' },
    });

    assert.notStrictEqual(res.statusCode, 200, 'Broken transaction must not succeed');
    const opp = db.opportunities.find((o) => o.id === oppIdRollback);
    assert.strictEqual(opp.filledPositions, 0, 'No partial increment should occur on rollback');
    pass('28. Rollback Integrity: Failed transaction leaves no partial updates');
  } catch (err) {
    fail('28. Rollback Integrity', err);
  }

  // TASK 2: INTERVIEW FEEDBACK PRIVACY
  // Test 29: Recruiter feedback is not returned to student in applications or timeline
  try {
    const studentPrivacy = { id: 'usr_stud_privacy_1', role: 'STUDENT', email: 'priv@test.com' };
    db.users.push(studentPrivacy);
    const tokenPrivacy = signAccessToken(studentPrivacy);

    const appPrivacy = {
      id: 'app_privacy_1',
      opportunityId: createdOpportunityId,
      studentId: studentPrivacy.id,
      status: 'INTERVIEW',
      internalNotes: 'SECRET: Candidate has weak fundamental algorithmic skills',
      rating: 2,
    };
    db.applications.push(appPrivacy);

    const interviewPrivacy = {
      id: 'inv_privacy_1',
      applicationId: appPrivacy.id,
      opportunityId: createdOpportunityId,
      studentId: studentPrivacy.id,
      companyId: 'company_A',
      scheduledAt: new Date(),
      status: 'COMPLETED',
      feedback: 'CONFIDENTIAL: Candidate struggled during technical round with trees and graphs.',
    };
    db.interviews.push(interviewPrivacy);

    await simulateRequest(app, {
      method: 'PATCH',
      url: `/api/careers/interviews/${interviewPrivacy.id}`,
      headers: { Authorization: `Bearer ${companyAToken}` },
      body: { status: 'COMPLETED', feedback: 'CONFIDENTIAL: Candidate struggled during technical round with trees and graphs.' },
    });

    const studentRes = await simulateRequest(app, {
      method: 'GET',
      url: '/api/careers/my-applications',
      headers: { Authorization: `Bearer ${tokenPrivacy}` },
    });

    assert.strictEqual(studentRes.statusCode, 200);
    const myApp = studentRes.body.data.find((a) => a.id === appPrivacy.id);
    assert(myApp, 'Application must be returned to student');

    assert.strictEqual(myApp.internalNotes, undefined, 'internalNotes must never be exposed to student');
    assert.strictEqual(myApp.rating, undefined, 'rating must never be exposed to student');

    assert(myApp.interviews && myApp.interviews.length > 0);
    assert.strictEqual(myApp.interviews[0].feedback, undefined, 'interview.feedback must never be exposed to student');

    assert(myApp.timeline && myApp.timeline.length > 0);
    for (const tl of myApp.timeline) {
      assert(!JSON.stringify(tl).includes('CONFIDENTIAL'), 'Timeline must not leak private recruiter feedback string');
      assert(!JSON.stringify(tl).includes('SECRET'), 'Timeline must not leak private internal notes');
      assert.strictEqual(tl.performedById, undefined, 'Timeline must not disclose recruiter user ID to student');
    }

    pass('29. Privacy Guard: Private recruiter feedback and ratings are completely stripped from student view');
  } catch (err) {
    fail('29. Privacy Guard: Student feedback leakage', err);
  }

  // Test 30: Authorized company users can still access full private feedback
  try {
    const compRes = await simulateRequest(app, {
      method: 'GET',
      url: `/api/careers/applications/app_privacy_1`,
      headers: { Authorization: `Bearer ${companyAToken}` },
    });

    assert.strictEqual(compRes.statusCode, 200);
    assert.strictEqual(compRes.body.data.internalNotes, 'SECRET: Candidate has weak fundamental algorithmic skills');
    assert.strictEqual(compRes.body.data.rating, 2);
    assert.strictEqual(compRes.body.data.interviews[0].feedback, 'CONFIDENTIAL: Candidate struggled during technical round with trees and graphs.');
    pass('30. Company Access: Authorized company users retain complete access to private evaluation and feedback');
  } catch (err) {
    fail('30. Company Access: Private feedback', err);
  }

  // Test 31: Legitimate timeline items remain visible to student with generic safe messages
  try {
    const studentPrivacy = db.users.find((u) => u.id === 'usr_stud_privacy_1');
    const tokenPrivacy = signAccessToken(studentPrivacy);

    const studentRes = await simulateRequest(app, {
      method: 'GET',
      url: '/api/careers/my-applications',
      headers: { Authorization: `Bearer ${tokenPrivacy}` },
    });

    const myApp = studentRes.body.data.find((a) => a.id === 'app_privacy_1');
    assert(myApp.timeline.length > 0, 'Timeline entries must be preserved');
    const interviewTl = myApp.timeline.find((t) => t.action && t.action.includes('INTERVIEW'));
    assert(interviewTl, 'Interview timeline event must exist');
    assert(interviewTl.note, 'Timeline entry must have a descriptive safe note');
    assert(!interviewTl.note.includes('CONFIDENTIAL'), 'Note must be a generic safe status message');
    pass('31. Timeline Preservation: Legitimate application milestones remain visible with safe generic text');
  } catch (err) {
    fail('31. Timeline Preservation', err);
  }

  // TASK 3: MATCHING ACCURACY
  // Test 32: Exact normalized matches and canonical aliases
  try {
    assert.strictEqual(hasSkillMatch(['JavaScript'], 'javascript'), true, 'Exact case-insensitive match');
    assert.strictEqual(hasSkillMatch(['js'], 'JavaScript'), true, 'Alias "js" matches "JavaScript"');
    assert.strictEqual(hasSkillMatch(['golang'], 'Go'), true, 'Alias "golang" matches "Go"');
    assert.strictEqual(hasSkillMatch(['TypeScript'], 'ts'), true, 'Alias "TypeScript" matches "ts"');
    assert.strictEqual(hasSkillMatch(['ReactJS'], 'React'), true, 'Alias "ReactJS" matches "React"');
    assert.strictEqual(hasSkillMatch(['k8s'], 'Kubernetes'), true, 'Alias "k8s" matches "Kubernetes"');
    assert.strictEqual(hasSkillMatch(['TailwindCSS'], 'Tailwind CSS'), true, 'Alias "TailwindCSS" matches "Tailwind CSS"');
    pass('32. Matching Accuracy: Exact normalized matches and canonical aliases resolve correctly');
  } catch (err) {
    fail('32. Matching Accuracy: Exact and alias matches', err);
  }

  // Test 33: Short skills strictly avoid false-positive substring matches
  try {
    assert.strictEqual(hasSkillMatch(['c'], 'css'), false, '"c" must NOT match "css"');
    assert.strictEqual(hasSkillMatch(['r'], 'react'), false, '"r" must NOT match "react"');
    assert.strictEqual(hasSkillMatch(['go'], 'algorithm'), false, '"go" must NOT match "algorithm"');
    assert.strictEqual(hasSkillMatch(['java'], 'javascript'), false, '"java" must NOT match "javascript"');
    assert.strictEqual(hasSkillMatch(['react'], 'reaction'), false, '"react" must NOT match "reaction"');
    assert.strictEqual(hasSkillMatch(['c'], 'c'), true, '"c" must match "c" exactly');
    assert.strictEqual(hasSkillMatch(['css'], 'css'), true, '"css" must match "css" exactly');
    assert.strictEqual(hasSkillMatch(['go'], 'go'), true, '"go" must match "go" exactly');
    pass('33. Substring Shield: Short skills strictly avoid false-positive substring collisions');
  } catch (err) {
    fail('33. Substring Shield: False-positive prevention', err);
  }

  // Test 34: Empty skill lists, missing profiles, and deterministic score bounds (0-100)
  try {
    const emptyMatch = calculateOpportunityMatch({}, {});
    assert(emptyMatch.score >= 0 && emptyMatch.score <= 100, 'Score must be bounded between 0 and 100');

    const emptyCandidate = calculateOpportunityMatch({ profile: { skills: [] } }, { skills: ['React', 'Node.js'] });
    assert.strictEqual(emptyCandidate.matchedSkills.length, 0);
    assert.strictEqual(emptyCandidate.missingSkills.length, 2);

    const emptyTarget = calculateOpportunityMatch({ profile: { skills: ['React'] } }, { skills: [] });
    assert.strictEqual(emptyTarget.breakdown.requiredSkillPoints, 40, 'Empty required skills awards baseline');

    pass('34. Edge Resilience: Empty skill sets and missing data yield deterministic scores bounded within [0, 100]');
  } catch (err) {
    fail('34. Edge Resilience: Score bounds and missing data', err);
  }

  console.log(`\n=== CAREER & RECRUITMENT TEST SUMMARY: ${passed} Passed, ${failed} Failed ===`);
  if (failed > 0) process.exit(1);
}

runCareerRecruitmentTests();
