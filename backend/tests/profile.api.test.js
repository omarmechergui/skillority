import assert from 'assert';
import http from 'http';
import app from '../src/app.js';
import prisma from '../src/config/database.js';
import { signAccessToken } from '../src/utils/jwt.js';
import { updateProfile } from '../src/services/profile.service.js';

// Configure offline test mode so requireAuth authenticates via JWT claims
process.env.DATABASE_URL = 'mongodb://placeholder_user:dummy@localhost:27017/test';

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

      let parsed;
      try {
        parsed = JSON.parse(responseBody);
      } catch {
        parsed = responseBody;
      }

      resolve({
        status: rawRes.statusCode,
        headers: rawRes.getHeaders(),
        body: parsed,
      });
    };

    app.handle(rawReq, rawRes);
  });
}

// In-Memory Profile Database for Isolated API Integration Testing
const profileStore = new Map();

function seedUserAndProfile(user, profile) {
  profileStore.set(user.id, {
    ...profile,
    userId: user.id,
    user: {
      id: user.id,
      email: user.email,
      role: user.role,
      isActive: user.isActive !== undefined ? user.isActive : true,
      createdAt: new Date(),
    },
    createdAt: new Date(),
    updatedAt: new Date(),
  });
}

// Hook prisma.profile methods to in-memory store
prisma.profile.findUnique = async ({ where, include }) => {
  const targetId = where.userId || where.id;
  const p = profileStore.get(targetId);
  if (!p) return null;
  return JSON.parse(JSON.stringify(p));
};

prisma.profile.update = async ({ where, data, include }) => {
  const targetId = where.userId || where.id;
  const existing = profileStore.get(targetId);
  if (!existing) {
    throw new Error(`Profile not found for userId ${targetId}`);
  }
  const updated = {
    ...existing,
    ...data,
    updatedAt: new Date(),
  };
  profileStore.set(targetId, updated);
  return JSON.parse(JSON.stringify(updated));
};

prisma.profile.create = async ({ data, include }) => {
  const created = {
    id: `prof_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    ...data,
    skills: data.skills || [],
    interests: data.interests || [],
    expertise: data.expertise || [],
    createdAt: new Date(),
    updatedAt: new Date(),
    user: {
      id: data.userId,
      email: `${data.userId}@test.com`,
      role: 'STUDENT',
      isActive: true,
      createdAt: new Date(),
    },
  };
  profileStore.set(data.userId, created);
  return JSON.parse(JSON.stringify(created));
};

async function runProfileSuite() {
  console.log('=== STARTING MODULE 1D-A: BACKEND PROFILE API HARDENING TEST SUITE ===\n');
  let passed = 0;
  let failed = 0;

  async function test(name, fn) {
    try {
      await fn();
      console.log(`[PASS] ${name}`);
      passed++;
    } catch (err) {
      console.error(`[FAIL] ${name}:`, err.message);
      failed++;
    }
  }

  // Seed sample users
  const studentUser = { id: 'usr_student_1', email: 'alex@student.test', role: 'STUDENT' };
  const companyUser = { id: 'usr_company_1', email: 'recruiter@tech.test', role: 'COMPANY' };
  const instructorUser = { id: 'usr_instructor_1', email: 'sarah@instructor.test', role: 'INSTRUCTOR' };
  const adminUser = { id: 'usr_admin_1', email: 'admin@skillority.test', role: 'ADMIN' };

  seedUserAndProfile(studentUser, {
    id: 'prof_stu_1',
    firstName: 'Alex',
    lastName: 'Morgan',
    bio: 'Computer Science enthusiast',
    university: 'Stanford University',
    major: 'Computer Science',
    graduationYear: 2026,
    skills: ['Python', 'Data Structures'],
    interests: ['AI', 'Robotics'],
    learningGoals: 'Master distributed systems',
  });

  seedUserAndProfile(companyUser, {
    id: 'prof_comp_1',
    firstName: 'David',
    lastName: 'Miller',
    bio: 'Technical recruiting lead',
    companyName: 'Genesis Technologies',
    companyDescription: 'Pioneering cloud solutions',
    industry: 'Technology',
    companySize: '51-200',
    website: 'https://genesis-tech.test',
  });

  seedUserAndProfile(instructorUser, {
    id: 'prof_inst_1',
    firstName: 'Sarah',
    lastName: 'Jenkins',
    bio: 'Distributed systems architect',
    experience: '12+ years distributed systems architecture',
    expertise: ['Cloud Architecture', 'Distributed Systems'],
    website: 'https://sarahjenkins.test',
  });

  const studentToken = signAccessToken({ ...studentUser, tokenVersion: 0 });
  const companyToken = signAccessToken({ ...companyUser, tokenVersion: 0 });
  const instructorToken = signAccessToken({ ...instructorUser, tokenVersion: 0 });
  const adminToken = signAccessToken({ ...adminUser, tokenVersion: 0 });

  // 1. Unauthenticated GET /api/profiles/me returns 401
  await test('1. Unauthenticated GET /api/profiles/me returns 401 UNAUTHORIZED', async () => {
    const res = await simulateRequest(app, { method: 'GET', url: '/api/profiles/me' });
    assert.strictEqual(res.status, 401);
    assert.strictEqual(res.body.error.code, 'UNAUTHORIZED');
  });

  // 2. Authenticated GET /api/profiles/me returns full profile
  await test('2. Authenticated GET /api/profiles/me returns profile for current user', async () => {
    const res = await simulateRequest(app, {
      method: 'GET',
      url: '/api/profiles/me',
      headers: { authorization: `Bearer ${studentToken}` },
    });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.success, true);
    assert.strictEqual(res.body.data.firstName, 'Alex');
    assert.strictEqual(res.body.data.university, 'Stanford University');
    assert.strictEqual(res.body.data.user.role, 'STUDENT');
  });

  // 3. Updating common profile fields (firstName, lastName, bio, avatar, skills)
  await test('3. Updating common profile fields succeeds across roles', async () => {
    const res = await simulateRequest(app, {
      method: 'PATCH',
      url: '/api/profiles/me',
      headers: { authorization: `Bearer ${studentToken}` },
      body: {
        firstName: 'Alexander',
        lastName: 'Morganson',
        bio: 'Updated student bio for 2026',
        avatar: 'https://avatar.test/alex.png',
        skills: ['Python', 'TypeScript', 'Docker'],
      },
    });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.success, true);
    assert.strictEqual(res.body.data.firstName, 'Alexander');
    assert.strictEqual(res.body.data.lastName, 'Morganson');
    assert.strictEqual(res.body.data.bio, 'Updated student bio for 2026');
    assert.deepStrictEqual(res.body.data.skills, ['Python', 'TypeScript', 'Docker']);
  });

  // 4. Student role profile updates (university, major, graduationYear, interests, learningGoals)
  await test('4. Student can update student-specific fields', async () => {
    const res = await simulateRequest(app, {
      method: 'PATCH',
      url: '/api/profiles/me',
      headers: { authorization: `Bearer ${studentToken}` },
      body: {
        university: 'MIT',
        major: 'Artificial Intelligence',
        graduationYear: 2027,
        interests: ['Deep Learning', 'Quantum Computing'],
        learningGoals: 'Publish a research paper on foundation models',
      },
    });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.data.university, 'MIT');
    assert.strictEqual(res.body.data.major, 'Artificial Intelligence');
    assert.strictEqual(res.body.data.graduationYear, 2027);
    assert.deepStrictEqual(res.body.data.interests, ['Deep Learning', 'Quantum Computing']);
  });

  // 5. Company role profile updates (companyName, companyDescription, industry, companySize, website)
  await test('5. Company can update company-specific fields', async () => {
    const res = await simulateRequest(app, {
      method: 'PATCH',
      url: '/api/profiles/me',
      headers: { authorization: `Bearer ${companyToken}` },
      body: {
        companyName: 'Genesis Cloud Corp',
        companyDescription: 'Enterprise AI & Distributed Cloud Systems',
        industry: 'Cloud Infrastructure',
        companySize: '201-500',
        website: 'https://genesis-cloud.test',
      },
    });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.data.companyName, 'Genesis Cloud Corp');
    assert.strictEqual(res.body.data.industry, 'Cloud Infrastructure');
    assert.strictEqual(res.body.data.companySize, '201-500');
  });

  // 6. Instructor role profile updates (experience, expertise, website)
  await test('6. Instructor can update instructor-specific fields', async () => {
    const res = await simulateRequest(app, {
      method: 'PATCH',
      url: '/api/profiles/me',
      headers: { authorization: `Bearer ${instructorToken}` },
      body: {
        experience: 'Principal Systems Architect at Tech Global',
        expertise: ['Distributed Databases', 'High-Throughput Streaming', 'Kubernetes'],
        website: 'https://sarah-systems.test',
      },
    });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.data.experience, 'Principal Systems Architect at Tech Global');
    assert.deepStrictEqual(res.body.data.expertise, ['Distributed Databases', 'High-Throughput Streaming', 'Kubernetes']);
  });

  // 7. Cross-role field injection is rejected with 400 VALIDATION_ERROR
  await test('7. Cross-role field injection is strictly rejected for all roles', async () => {
    // Student attempting company fields
    const res1 = await simulateRequest(app, {
      method: 'PATCH',
      url: '/api/profiles/me',
      headers: { authorization: `Bearer ${studentToken}` },
      body: { companyName: 'Illegal Company Name' },
    });
    assert.strictEqual(res1.status, 400);
    assert.strictEqual(res1.body.error.code, 'VALIDATION_ERROR');
    assert.ok(res1.body.error.details.some((d) => d.field === 'companyName'));

    // Student attempting instructor fields
    const res2 = await simulateRequest(app, {
      method: 'PATCH',
      url: '/api/profiles/me',
      headers: { authorization: `Bearer ${studentToken}` },
      body: { expertise: ['Cloud'] },
    });
    assert.strictEqual(res2.status, 400);
    assert.ok(res2.body.error.details.some((d) => d.field === 'expertise'));

    // Company attempting student fields
    const res3 = await simulateRequest(app, {
      method: 'PATCH',
      url: '/api/profiles/me',
      headers: { authorization: `Bearer ${companyToken}` },
      body: { university: 'Harvard University' },
    });
    assert.strictEqual(res3.status, 400);
    assert.ok(res3.body.error.details.some((d) => d.field === 'university'));

    // Instructor attempting company fields
    const res4 = await simulateRequest(app, {
      method: 'PATCH',
      url: '/api/profiles/me',
      headers: { authorization: `Bearer ${instructorToken}` },
      body: { companySize: '50-100' },
    });
    assert.strictEqual(res4.status, 400);
    assert.ok(res4.body.error.details.some((d) => d.field === 'companySize'));
  });

  // 8. Clearing required onboarding fields is rejected
  await test('8. Clearing required onboarding fields is rejected with 400', async () => {
    // Student clearing university to empty string
    const res1 = await simulateRequest(app, {
      method: 'PATCH',
      url: '/api/profiles/me',
      headers: { authorization: `Bearer ${studentToken}` },
      body: { university: '' },
    });
    assert.strictEqual(res1.status, 400);
    assert.strictEqual(res1.body.error.code, 'VALIDATION_ERROR');

    // Student clearing major to whitespace
    const res2 = await simulateRequest(app, {
      method: 'PATCH',
      url: '/api/profiles/me',
      headers: { authorization: `Bearer ${studentToken}` },
      body: { major: '   ' },
    });
    assert.strictEqual(res2.status, 400);

    // Company clearing companyName to 1 letter
    const res3 = await simulateRequest(app, {
      method: 'PATCH',
      url: '/api/profiles/me',
      headers: { authorization: `Bearer ${companyToken}` },
      body: { companyName: 'A' },
    });
    assert.strictEqual(res3.status, 400);

    // Instructor clearing experience to empty string
    const res4 = await simulateRequest(app, {
      method: 'PATCH',
      url: '/api/profiles/me',
      headers: { authorization: `Bearer ${instructorToken}` },
      body: { experience: '' },
    });
    assert.strictEqual(res4.status, 400);

    // Instructor clearing expertise to empty array
    const res5 = await simulateRequest(app, {
      method: 'PATCH',
      url: '/api/profiles/me',
      headers: { authorization: `Bearer ${instructorToken}` },
      body: { expertise: [] },
    });
    assert.strictEqual(res5.status, 400);
  });

  // 8b. Service-level mandatory field protection when attempting to clear existing fields
  await test('8b. Service-level guard prevents clearing existing mandatory onboarding fields', async () => {
    let threwStudent = false;
    try {
      await updateProfile('usr_student_1', { university: '' }, 'STUDENT');
    } catch (err) {
      threwStudent = true;
      assert.strictEqual(err.code, 'MANDATORY_FIELD_REQUIRED');
    }
    assert.strictEqual(threwStudent, true, 'Service must reject clearing university for student');

    let threwCompany = false;
    try {
      await updateProfile('usr_company_1', { companyName: ' ' }, 'COMPANY');
    } catch (err) {
      threwCompany = true;
      assert.strictEqual(err.code, 'MANDATORY_FIELD_REQUIRED');
    }
    assert.strictEqual(threwCompany, true, 'Service must reject clearing companyName for company');
  });

  // 9. Partial updates preserve untouched fields
  await test('9. Partial updates preserve untouched fields in database', async () => {
    const preUpdate = profileStore.get('usr_student_1');
    const existingUniversity = preUpdate.university;
    const existingMajor = preUpdate.major;

    const res = await simulateRequest(app, {
      method: 'PATCH',
      url: '/api/profiles/me',
      headers: { authorization: `Bearer ${studentToken}` },
      body: { bio: 'A brand new updated bio exclusively' },
    });

    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.data.bio, 'A brand new updated bio exclusively');
    assert.strictEqual(res.body.data.university, existingUniversity);
    assert.strictEqual(res.body.data.major, existingMajor);
  });

  // 10. Invalid graduation year is rejected
  await test('10. Invalid graduation year (< 1980 or > 2040) is rejected', async () => {
    const resTooLow = await simulateRequest(app, {
      method: 'PATCH',
      url: '/api/profiles/me',
      headers: { authorization: `Bearer ${studentToken}` },
      body: { graduationYear: 1970 },
    });
    assert.strictEqual(resTooLow.status, 400);

    const resTooHigh = await simulateRequest(app, {
      method: 'PATCH',
      url: '/api/profiles/me',
      headers: { authorization: `Bearer ${studentToken}` },
      body: { graduationYear: 2045 },
    });
    assert.strictEqual(resTooHigh.status, 400);

    const resValid = await simulateRequest(app, {
      method: 'PATCH',
      url: '/api/profiles/me',
      headers: { authorization: `Bearer ${studentToken}` },
      body: { graduationYear: 2038 },
    });
    assert.strictEqual(resValid.status, 200);
    assert.strictEqual(resValid.body.data.graduationYear, 2038);
  });

  // 11. Invalid URLs are rejected, valid and empty URLs are accepted
  await test('11. Invalid URLs are rejected, valid and empty strings are accepted', async () => {
    const resInvalid = await simulateRequest(app, {
      method: 'PATCH',
      url: '/api/profiles/me',
      headers: { authorization: `Bearer ${companyToken}` },
      body: { website: 'not_a_valid_url' },
    });
    assert.strictEqual(resInvalid.status, 400);
    assert.ok(resInvalid.body.error.details.some((d) => d.field === 'website'));

    const resValidEmpty = await simulateRequest(app, {
      method: 'PATCH',
      url: '/api/profiles/me',
      headers: { authorization: `Bearer ${companyToken}` },
      body: { website: '' },
    });
    assert.strictEqual(resValidEmpty.status, 200);
    assert.strictEqual(resValidEmpty.body.data.website, '');
  });

  // 12. Excessively long bio is rejected
  await test('12. Excessively long bio (> 500 characters) is rejected', async () => {
    const resOver = await simulateRequest(app, {
      method: 'PATCH',
      url: '/api/profiles/me',
      headers: { authorization: `Bearer ${studentToken}` },
      body: { bio: 'A'.repeat(501) },
    });
    assert.strictEqual(resOver.status, 400);
    assert.ok(resOver.body.error.details.some((d) => d.field === 'bio'));

    const resExact = await simulateRequest(app, {
      method: 'PATCH',
      url: '/api/profiles/me',
      headers: { authorization: `Bearer ${studentToken}` },
      body: { bio: 'A'.repeat(500) },
    });
    assert.strictEqual(resExact.status, 200);
    assert.strictEqual(resExact.body.data.bio.length, 500);
  });

  // 13. Sensitive fields cannot be changed via profile endpoints
  await test('13. Sensitive fields (role, password, email, tokenVersion, isActive) are rejected', async () => {
    for (const forbidden of ['role', 'password', 'email', 'tokenVersion', 'isActive', 'isVerified']) {
      const res = await simulateRequest(app, {
        method: 'PATCH',
        url: '/api/profiles/me',
        headers: { authorization: `Bearer ${studentToken}` },
        body: { [forbidden]: 'malicious_attempt' },
      });
      assert.strictEqual(res.status, 400, `Must reject forbidden field: ${forbidden}`);
      assert.strictEqual(res.body.error.code, 'VALIDATION_ERROR');
    }
  });

  // 14. Public profile sanitization
  await test('14. Public profile GET /api/profiles/:userId sanitizes private fields', async () => {
    const res = await simulateRequest(app, {
      method: 'GET',
      url: '/api/profiles/usr_student_1',
      headers: { authorization: `Bearer ${companyToken}` },
    });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.data.firstName, 'Alexander');
    assert.strictEqual(res.body.data.university, 'MIT');
    assert.strictEqual(res.body.data.learningGoals, undefined, 'Private learningGoals must be sanitized');
    assert.strictEqual(res.body.data.passwordHash, undefined, 'Password hash must never appear in public profile');
  });

  // 15. Expertise, skills, and interests normalization (strings, arrays, deduplication)
  await test('15. Expertise, skills, and interests normalization (comma string, deduplication, trim)', async () => {
    // Comma-separated string with duplicates and whitespace
    const resSkills = await simulateRequest(app, {
      method: 'PATCH',
      url: '/api/profiles/me',
      headers: { authorization: `Bearer ${studentToken}` },
      body: {
        skills: 'React, Node.js, React,  , TypeScript, Node.js ',
        interests: 'Quantum Computing, AI, AI,  Robotics ',
      },
    });
    assert.strictEqual(resSkills.status, 200);
    assert.deepStrictEqual(resSkills.body.data.skills, ['React', 'Node.js', 'TypeScript']);
    assert.deepStrictEqual(resSkills.body.data.interests, ['Quantum Computing', 'AI', 'Robotics']);

    // Instructor expertise comma-separated string normalization
    const resExpertise = await simulateRequest(app, {
      method: 'PATCH',
      url: '/api/profiles/me',
      headers: { authorization: `Bearer ${instructorToken}` },
      body: {
        expertise: 'Cloud, Distributed Systems, Cloud,  Networking ',
      },
    });
    assert.strictEqual(resExpertise.status, 200);
    assert.deepStrictEqual(resExpertise.body.data.expertise, ['Cloud', 'Distributed Systems', 'Networking']);
  });

  // 16. Single name field parsing in profile update
  await test('16. Single "name" field is cleanly parsed and updates firstName/lastName', async () => {
    const res = await simulateRequest(app, {
      method: 'PATCH',
      url: '/api/profiles/me',
      headers: { authorization: `Bearer ${instructorToken}` },
      body: {
        name: 'Prof. Dr. Sarah Maria Jenkins',
      },
    });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.data.firstName, 'Sarah');
    assert.strictEqual(res.body.data.lastName, 'Maria Jenkins');
  });

  console.log(`\n=== PROFILE TEST SUMMARY: ${passed} Passed, ${failed} Failed ===`);
  if (failed > 0) {
    process.exit(1);
  }
}

runProfileSuite().catch((err) => {
  console.error('Test execution failed:', err);
  process.exit(1);
});
