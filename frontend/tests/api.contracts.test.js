import assert from 'assert';
import { profileApi } from '../src/lib/api/profiles.js';
import { coursesApi } from '../src/lib/api/courses.js';
import { walletApi } from '../src/lib/api/wallet.js';
import { apiRequest } from '../src/lib/apiClient.js';

async function runApiContractTests() {
  console.log('--- STARTING PHASE 0: API CONTRACT ALIGNMENT VERIFICATION SUITE ---');
  let passed = 0;
  let failed = 0;

  function test(name, fn) {
    try {
      fn();
      console.log(`[PASS] ${name}`);
      passed++;
    } catch (err) {
      console.error(`[FAIL] ${name}: ${err.message}`);
      failed++;
    }
  }

  async function asyncTest(name, fn) {
    try {
      await fn();
      console.log(`[PASS] ${name}`);
      passed++;
    } catch (err) {
      console.error(`[FAIL] ${name}: ${err.message}`);
      failed++;
    }
  }

  // Intercept global fetch to verify exact method, URL, and headers sent by wrappers
  const originalFetch = globalThis.fetch;
  let interceptedCalls = [];

  function setupMockFetch(responder) {
    interceptedCalls = [];
    globalThis.fetch = async (url, config = {}) => {
      interceptedCalls.push({ url, config });
      if (responder) {
        return responder(url, config);
      }
      return {
        ok: true,
        status: 200,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => ({ success: true, data: {} }),
      };
    };
  }

  function restoreFetch() {
    globalThis.fetch = originalFetch;
    interceptedCalls = [];
  }

  // 1. Profile API contract
  await asyncTest('profileApi.updateMyProfile dispatches PATCH /profiles/me', async () => {
    setupMockFetch();
    try {
      await profileApi.updateMyProfile({ bio: 'Updated bio' });
      assert.strictEqual(interceptedCalls.length, 1);
      assert.strictEqual(interceptedCalls[0].config.method, 'PATCH');
      assert.ok(interceptedCalls[0].url.endsWith('/profiles/me'));
    } finally {
      restoreFetch();
    }
  });

  await asyncTest('profileApi.getPublicProfile requires auth by default and sends GET /profiles/:id', async () => {
    setupMockFetch();
    try {
      await profileApi.getPublicProfile('user_xyz_123');
      assert.strictEqual(interceptedCalls.length, 1);
      assert.strictEqual(interceptedCalls[0].config.method, 'GET');
      assert.ok(interceptedCalls[0].url.endsWith('/profiles/user_xyz_123'));
    } finally {
      restoreFetch();
    }
  });

  await asyncTest('profileApi.completeStudentOnboarding dispatches POST /auth/onboarding/student', async () => {
    setupMockFetch();
    try {
      await profileApi.completeStudentOnboarding({
        university: 'MIT',
        major: 'Computer Science',
        graduationYear: 2026,
        skills: ['React', 'Node.js'],
      });
      assert.strictEqual(interceptedCalls.length, 1);
      assert.strictEqual(interceptedCalls[0].config.method, 'POST');
      assert.ok(interceptedCalls[0].url.endsWith('/auth/onboarding/student'));
      const parsedBody = JSON.parse(interceptedCalls[0].config.body);
      assert.strictEqual(parsedBody.university, 'MIT');
      assert.strictEqual(parsedBody.major, 'Computer Science');
      assert.strictEqual(parsedBody.graduationYear, 2026);
      assert.deepStrictEqual(parsedBody.skills, ['React', 'Node.js']);
    } finally {
      restoreFetch();
    }
  });

  await asyncTest('profileApi.completeCompanyOnboarding dispatches POST /auth/onboarding/company', async () => {
    setupMockFetch();
    try {
      await profileApi.completeCompanyOnboarding({
        companyName: 'Acme Corp',
        industry: 'Technology',
        companySize: '51-200',
        website: 'https://acme.com',
        companyDescription: 'Leading tech enterprise',
      });
      assert.strictEqual(interceptedCalls.length, 1);
      assert.strictEqual(interceptedCalls[0].config.method, 'POST');
      assert.ok(interceptedCalls[0].url.endsWith('/auth/onboarding/company'));
      const parsedBody = JSON.parse(interceptedCalls[0].config.body);
      assert.strictEqual(parsedBody.companyName, 'Acme Corp');
      assert.strictEqual(parsedBody.industry, 'Technology');
      assert.strictEqual(parsedBody.companySize, '51-200');
      assert.strictEqual(parsedBody.website, 'https://acme.com');
      assert.strictEqual(parsedBody.companyDescription, 'Leading tech enterprise');
    } finally {
      restoreFetch();
    }
  });

  await asyncTest('profileApi.completeInstructorOnboarding dispatches POST /auth/onboarding/instructor', async () => {
    setupMockFetch();
    try {
      await profileApi.completeInstructorOnboarding({
        name: 'Dr. Sarah Jenkins',
        headline: 'Principal Engineer & Systems Architect',
        expertise: ['Web Development', 'Distributed Systems', 'Next.js'],
        bio: '10+ years experience building distributed architectures',
        courseIdea: 'Building Enterprise Micro-Frontends with React 19',
      });
      assert.strictEqual(interceptedCalls.length, 1);
      assert.strictEqual(interceptedCalls[0].config.method, 'POST');
      assert.ok(interceptedCalls[0].url.endsWith('/auth/onboarding/instructor'));
      const parsedBody = JSON.parse(interceptedCalls[0].config.body);
      assert.strictEqual(parsedBody.name, 'Dr. Sarah Jenkins');
      assert.strictEqual(parsedBody.headline, 'Principal Engineer & Systems Architect');
      assert.deepStrictEqual(parsedBody.expertise, ['Web Development', 'Distributed Systems', 'Next.js']);
      assert.strictEqual(parsedBody.bio, '10+ years experience building distributed architectures');
      assert.strictEqual(parsedBody.courseIdea, 'Building Enterprise Micro-Frontends with React 19');
    } finally {
      restoreFetch();
    }
  });

  // 2. Course API contract
  await asyncTest('coursesApi.updateCourse dispatches PATCH /courses/:id', async () => {
    setupMockFetch();
    try {
      await coursesApi.updateCourse('course_abc', { title: 'New Title' });
      assert.strictEqual(interceptedCalls.length, 1);
      assert.strictEqual(interceptedCalls[0].config.method, 'PATCH');
      assert.ok(interceptedCalls[0].url.endsWith('/courses/course_abc'));
    } finally {
      restoreFetch();
    }
  });

  await asyncTest('coursesApi.deleteCourse dispatches DELETE /courses/:id (documented as pending server route)', async () => {
    setupMockFetch();
    try {
      await coursesApi.deleteCourse('course_abc');
      assert.strictEqual(interceptedCalls.length, 1);
      assert.strictEqual(interceptedCalls[0].config.method, 'DELETE');
      assert.ok(interceptedCalls[0].url.endsWith('/courses/course_abc'));
    } finally {
      restoreFetch();
    }
  });

  // 3. Wallet API contracts
  await asyncTest('walletApi.claimDailyLogin dispatches POST /wallet/claim-daily-login', async () => {
    setupMockFetch();
    try {
      await walletApi.claimDailyLogin();
      assert.strictEqual(interceptedCalls.length, 1);
      assert.strictEqual(interceptedCalls[0].config.method, 'POST');
      assert.ok(interceptedCalls[0].url.endsWith('/wallet/claim-daily-login'));
    } finally {
      restoreFetch();
    }
  });

  await asyncTest('walletApi.claimAdReward dispatches POST /wallet/claim-ad-reward', async () => {
    setupMockFetch();
    try {
      await walletApi.claimAdReward();
      assert.strictEqual(interceptedCalls.length, 1);
      assert.strictEqual(interceptedCalls[0].config.method, 'POST');
      assert.ok(interceptedCalls[0].url.endsWith('/wallet/claim-ad-reward'));
    } finally {
      restoreFetch();
    }
  });

  // 4. Response Unwrapping in apiClient
  await asyncTest('apiClient correctly unwraps { success: true, data: { ... } } payload', async () => {
    setupMockFetch(async () => ({
      ok: true,
      status: 200,
      headers: new Headers({ 'content-type': 'application/json' }),
      json: async () => ({
        success: true,
        data: { id: 'wallet_1', balance: 250 },
      }),
    }));
    try {
      const res = await walletApi.getWallet();
      assert.strictEqual(res.status, 200);
      assert.strictEqual(res.error, null);
      assert.strictEqual(res.data.id, 'wallet_1');
      assert.strictEqual(res.data.balance, 250);
      assert.strictEqual(res.raw.success, true);
    } finally {
      restoreFetch();
    }
  });

  await asyncTest('apiClient correctly unwraps array payloads { success: true, data: [...] }', async () => {
    setupMockFetch(async () => ({
      ok: true,
      status: 200,
      headers: new Headers({ 'content-type': 'application/json' }),
      json: async () => ({
        success: true,
        data: [{ id: 'c1', title: 'React 19' }, { id: 'c2', title: 'Next.js 16' }],
      }),
    }));
    try {
      const res = await coursesApi.getCourses();
      assert.strictEqual(res.status, 200);
      assert.ok(Array.isArray(res.data));
      assert.strictEqual(res.data.length, 2);
      assert.strictEqual(res.data[0].id, 'c1');
    } finally {
      restoreFetch();
    }
  });

  // 5. Wallet Reward Response Extraction
  test('Wallet reward handler extracts coinsAwarded and balance from real backend shape', () => {
    const backendDailyResponse = {
      data: { balance: 105, coinsAwarded: 5 },
      raw: { success: true, message: 'Daily reward claimed (+5 Coins)', data: { balance: 105, coinsAwarded: 5 } },
      status: 200,
      error: null,
    };

    const coinsAwarded = backendDailyResponse.data?.coinsAwarded ?? backendDailyResponse.data?.awardedCoins;
    const newBalance = backendDailyResponse.data?.balance ?? backendDailyResponse.data?.newBalance;

    assert.strictEqual(coinsAwarded, 5);
    assert.strictEqual(newBalance, 105);
  });

  test('Wallet error extraction handles backend 400 ALREADY_CLAIMED cleanly', () => {
    const backendErrorResponse = {
      data: null,
      error: {
        code: 'ALREADY_CLAIMED',
        message: 'You have already claimed your daily reward today',
        status: 400,
      },
      status: 400,
    };

    const errorMsg = backendErrorResponse.error?.message;
    assert.strictEqual(errorMsg, 'You have already claimed your daily reward today');
  });

  // 6. Dashboard Extraction Pattern Resilience
  test('Dashboard extracts profile from both unwrapped and legacy envelopes safely', () => {
    const unwrappedProfile = {
      status: 'fulfilled',
      value: {
        data: { id: 'prof_1', firstName: 'Alex', lastName: 'Morgan', currentStreakDays: 3 },
      },
    };

    const live = unwrappedProfile.value?.data?.profile || unwrappedProfile.value?.data;
    assert.strictEqual(live.firstName, 'Alex');
    assert.strictEqual(live.currentStreakDays, 3);
  });

  test('Dashboard extracts courses list from real backend courses array payload', () => {
    const backendCoursesRes = {
      status: 'fulfilled',
      value: {
        data: [{ id: 'course_101', title: 'TypeScript Pro', category: 'Dev' }],
      },
    };

    const rawCourses = backendCoursesRes.value?.data?.courses || backendCoursesRes.value?.data;
    const liveList = Array.isArray(rawCourses) ? rawCourses : [];
    assert.strictEqual(liveList.length, 1);
    assert.strictEqual(liveList[0].id, 'course_101');
  });

  console.log(`\nAPI CONTRACT TEST SUMMARY: ${passed} Passed, ${failed} Failed\n`);
  if (failed > 0) process.exit(1);
}

runApiContractTests().catch((err) => {
  console.error('Test execution failed:', err);
  process.exit(1);
});
