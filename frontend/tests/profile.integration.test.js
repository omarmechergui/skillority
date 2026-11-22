import assert from 'assert';
import { profileApi } from '../src/lib/api/profiles.js';
import { isOnboardingComplete } from '../src/lib/onboarding.js';

let originalFetch;
let interceptedCalls = [];

function setupMockFetch(mockResponse = { success: true, data: {} }, status = 200) {
  interceptedCalls = [];
  originalFetch = globalThis.fetch;
  globalThis.fetch = async (url, config = {}) => {
    interceptedCalls.push({ url, config });
    return {
      ok: status >= 200 && status < 300,
      status,
      headers: {
        get: (h) => (h.toLowerCase() === 'content-type' ? 'application/json' : null),
      },
      json: async () => mockResponse,
      text: async () => JSON.stringify(mockResponse),
    };
  };
}

function restoreFetch() {
  if (originalFetch) {
    globalThis.fetch = originalFetch;
  }
}

async function runProfileIntegrationSuite() {
  console.log('=== STARTING MODULE 1D-E: IDENTITY & PROFILE INTEGRATION SUITE ===\n');
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

  // 1. Student Profile update payload dispatch
  await test('1. Student settings update dispatches PATCH /profiles/me with correct payload', async () => {
    const studentPayload = {
      firstName: 'Alex',
      lastName: 'Morgan',
      bio: 'Junior Software Engineer',
      avatar: 'https://avatar.test/alex.png',
      university: 'Stanford University',
      major: 'Computer Science',
      graduationYear: 2026,
      skills: 'React, TypeScript, Node.js',
      interests: 'Distributed Systems, AI',
      learningGoals: 'Master enterprise cloud architectures',
    };

    setupMockFetch({
      success: true,
      message: 'Profile updated successfully',
      data: {
        id: 'prof_1',
        ...studentPayload,
        skills: ['React', 'TypeScript', 'Node.js'],
        interests: ['Distributed Systems', 'AI'],
      },
    });

    try {
      const res = await profileApi.updateMyProfile(studentPayload);
      assert.strictEqual(interceptedCalls.length, 1);
      assert.strictEqual(interceptedCalls[0].config.method, 'PATCH');
      assert.ok(interceptedCalls[0].url.endsWith('/profiles/me'));

      const sentBody = JSON.parse(interceptedCalls[0].config.body);
      assert.strictEqual(sentBody.university, 'Stanford University');
      assert.strictEqual(sentBody.major, 'Computer Science');
      assert.strictEqual(sentBody.graduationYear, 2026);
      assert.strictEqual(res.data.university, 'Stanford University');
    } finally {
      restoreFetch();
    }
  });

  // 2. Company Profile update payload dispatch
  await test('2. Company settings update dispatches PATCH /profiles/me with company schema', async () => {
    const companyPayload = {
      firstName: 'David',
      lastName: 'Miller',
      companyName: 'Genesis Technologies',
      companyDescription: 'Pioneering distributed cloud infrastructure',
      industry: 'Technology & Cloud',
      companySize: '51-200',
      website: 'https://genesis-tech.test',
      bio: 'Engineering-first culture with dedicated internship mentors',
    };

    setupMockFetch({
      success: true,
      message: 'Profile updated successfully',
      data: {
        id: 'prof_comp_1',
        ...companyPayload,
      },
    });

    try {
      const res = await profileApi.updateMyProfile(companyPayload);
      assert.strictEqual(interceptedCalls.length, 1);
      assert.strictEqual(interceptedCalls[0].config.method, 'PATCH');

      const sentBody = JSON.parse(interceptedCalls[0].config.body);
      assert.strictEqual(sentBody.companyName, 'Genesis Technologies');
      assert.strictEqual(sentBody.industry, 'Technology & Cloud');
      assert.strictEqual(sentBody.companySize, '51-200');
      assert.strictEqual(res.data.companyName, 'Genesis Technologies');
    } finally {
      restoreFetch();
    }
  });

  // 3. Instructor Profile update payload dispatch
  await test('3. Instructor settings update dispatches PATCH /profiles/me with educator schema', async () => {
    const instructorPayload = {
      firstName: 'Sarah',
      lastName: 'Jenkins',
      experience: 'Principal Systems Architect at Tech Global',
      expertise: 'Distributed Systems, Cloud Architecture, Kubernetes',
      bio: 'Educating software engineers on modern distributed systems architectures',
      website: 'https://sarahjenkins.test',
    };

    setupMockFetch({
      success: true,
      message: 'Profile updated successfully',
      data: {
        id: 'prof_inst_1',
        ...instructorPayload,
        expertise: ['Distributed Systems', 'Cloud Architecture', 'Kubernetes'],
      },
    });

    try {
      const res = await profileApi.updateMyProfile(instructorPayload);
      assert.strictEqual(interceptedCalls.length, 1);
      assert.strictEqual(interceptedCalls[0].config.method, 'PATCH');

      const sentBody = JSON.parse(interceptedCalls[0].config.body);
      assert.strictEqual(sentBody.experience, 'Principal Systems Architect at Tech Global');
      assert.strictEqual(res.data.experience, 'Principal Systems Architect at Tech Global');
    } finally {
      restoreFetch();
    }
  });

  // 4. Backend validation error capture
  await test('4. Backend 400 validation error details are cleanly captured and mapped', async () => {
    setupMockFetch(
      {
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid request payload',
          details: [
            { field: 'companyName', message: "Field(s) 'companyName' not allowed for role STUDENT" },
          ],
        },
      },
      400
    );

    try {
      const res = await profileApi.updateMyProfile({ companyName: 'Illegal Company' });
      assert.ok(res.error);
      assert.strictEqual(res.status, 400);
      assert.strictEqual(
        res.error.details.error.details[0].message,
        "Field(s) 'companyName' not allowed for role STUDENT"
      );
    } finally {
      restoreFetch();
    }
  });

  // 5. Onboarding completion preservation after student profile update
  await test('5. Student profile update preserves isOnboardingComplete = true', () => {
    const updatedStudentUser = {
      id: 'student_1',
      role: 'STUDENT',
      profile: {
        firstName: 'Alex',
        lastName: 'Morgan',
        university: 'MIT',
        major: 'Computer Science',
        graduationYear: 2026,
        skills: ['React', 'Node.js'],
      },
    };
    assert.strictEqual(isOnboardingComplete(updatedStudentUser), true);
  });

  // 6. Onboarding completion preservation after company profile update
  await test('6. Company profile update preserves isOnboardingComplete = true', () => {
    const updatedCompanyUser = {
      id: 'company_1',
      role: 'COMPANY',
      profile: {
        firstName: 'David',
        lastName: 'Miller',
        companyName: 'Genesis Technologies',
        industry: 'Technology',
        companySize: '51-200',
      },
    };
    assert.strictEqual(isOnboardingComplete(updatedCompanyUser), true);
  });

  // 7. Onboarding completion preservation after instructor profile update
  await test('7. Instructor profile update preserves isOnboardingComplete = true', () => {
    const updatedInstructorUser = {
      id: 'instructor_1',
      role: 'INSTRUCTOR',
      profile: {
        firstName: 'Sarah',
        lastName: 'Jenkins',
        experience: 'Systems Architect',
        expertise: ['Cloud Architecture', 'Distributed Systems'],
      },
    };
    assert.strictEqual(isOnboardingComplete(updatedInstructorUser), true);
  });

  // 8. Admin profile always has onboarding complete
  await test('8. Admin profile has isOnboardingComplete = true unconditionally', () => {
    const adminUser = {
      id: 'admin_1',
      role: 'ADMIN',
      profile: {
        firstName: 'Platform',
        lastName: 'Admin',
      },
    };
    assert.strictEqual(isOnboardingComplete(adminUser), true);
  });

  console.log(`\n=== IDENTITY & PROFILE INTEGRATION SUMMARY: ${passed} Passed, ${failed} Failed ===`);
  if (failed > 0) {
    process.exit(1);
  }
}

runProfileIntegrationSuite().catch((err) => {
  console.error('Integration test failed:', err);
  process.exit(1);
});
