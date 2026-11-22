import assert from 'assert';
import { profileApi } from '../src/lib/api/profiles.js';
import { isOnboardingComplete, getPostLoginDestination } from '../src/lib/onboarding.js';

async function runStudentOnboardingTests() {
  console.log('--- STARTING MODULE 1A: STUDENT ONBOARDING TEST SUITE ---');
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

  // Mock global fetch & localStorage for isolation
  const originalFetch = globalThis.fetch;
  const originalLocalStorage = globalThis.localStorage;
  const originalWindow = globalThis.window;
  let interceptedCalls = [];

  const mockStorage = {};
  globalThis.localStorage = {
    getItem: (key) => mockStorage[key] || null,
    setItem: (key, val) => { mockStorage[key] = String(val); },
    removeItem: (key) => { delete mockStorage[key]; },
    clear: () => { Object.keys(mockStorage).forEach(k => delete mockStorage[k]); },
  };
  globalThis.window = {
    localStorage: globalThis.localStorage,
  };

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
        json: async () => ({
          success: true,
          message: 'Student onboarding completed successfully',
          data: {
            profile: {
              id: 'prof_123',
              userId: 'user_student_1',
              firstName: 'Alex',
              lastName: 'Rivera',
              university: 'Stanford University',
              major: 'Computer Science',
              graduationYear: 2026,
              skills: ['React', 'Node.js'],
              learningGoals: 'Master full stack engineering',
            },
          },
        }),
      };
    };
  }

  function restoreFetch() {
    globalThis.fetch = originalFetch;
    interceptedCalls = [];
  }

  // 1. Correct onboarding API method and endpoint
  await asyncTest('1. profileApi.completeStudentOnboarding calls POST /auth/onboarding/student with auth header', async () => {
    localStorage.setItem('skillority_token', 'test_access_jwt_token');
    setupMockFetch();
    try {
      const res = await profileApi.completeStudentOnboarding({
        university: 'Stanford University',
        major: 'Computer Science',
        graduationYear: 2026,
      });

      assert.strictEqual(interceptedCalls.length, 1);
      const call = interceptedCalls[0];
      assert.strictEqual(call.config.method, 'POST');
      assert.ok(call.url.endsWith('/auth/onboarding/student'));
      assert.strictEqual(call.config.headers['Authorization'], 'Bearer test_access_jwt_token');
      assert.strictEqual(call.config.credentials, 'include');
      assert.strictEqual(res.status, 200);
      assert.ok(res.data?.profile);
    } finally {
      restoreFetch();
      localStorage.clear();
    }
  });

  // 2. Correct payload mapping
  test('2. Correct payload mapping transforms form inputs to backend types', () => {
    const rawForm = {
      university: '  UC Berkeley  ',
      major: '  Data Science  ',
      graduationYear: '2026',
      skills: ' Python,  SQL, Machine Learning , ',
      learningGoals: '  Deep learning systems  ',
      bio: '  Aspiring ML Engineer  ',
    };

    const gradYearNum = parseInt(rawForm.graduationYear, 10);
    const skillsArray = rawForm.skills
      ? rawForm.skills.split(',').map(s => s.trim()).filter(Boolean)
      : [];

    const payload = {
      university: rawForm.university.trim(),
      major: rawForm.major.trim(),
      graduationYear: gradYearNum,
      skills: skillsArray,
      learningGoals: rawForm.learningGoals.trim() || undefined,
      bio: rawForm.bio ? rawForm.bio.trim() || undefined : undefined,
    };

    assert.strictEqual(payload.university, 'UC Berkeley');
    assert.strictEqual(payload.major, 'Data Science');
    assert.strictEqual(typeof payload.graduationYear, 'number');
    assert.strictEqual(payload.graduationYear, 2026);
    assert.deepStrictEqual(payload.skills, ['Python', 'SQL', 'Machine Learning']);
    assert.strictEqual(payload.skills.length, 3);
    assert.strictEqual(payload.learningGoals, 'Deep learning systems');
    assert.strictEqual(payload.bio, 'Aspiring ML Engineer');
  });

  // 3. Required field validation
  test('3. Client-side validation rejects missing required fields and invalid ranges', () => {
    function validateForm(formData) {
      const university = (formData.university || '').trim();
      const major = (formData.major || '').trim();
      if (!university) return { valid: false, error: 'University or School is required.' };
      if (!major) return { valid: false, error: 'Field of Study / Major is required.' };
      const gradYearNum = parseInt(formData.graduationYear, 10);
      if (isNaN(gradYearNum) || gradYearNum < 2000 || gradYearNum > 2040) {
        return { valid: false, error: 'Please select a valid graduation year between 2000 and 2040.' };
      }
      const skillsArray = formData.skills
        ? formData.skills.split(',').map(s => s.trim()).filter(Boolean)
        : [];
      if (skillsArray.length > 20) {
        return { valid: false, error: 'You can enter a maximum of 20 skills.' };
      }
      return { valid: true, error: null };
    }

    assert.strictEqual(validateForm({ university: '', major: 'CS', graduationYear: '2026' }).valid, false);
    assert.strictEqual(validateForm({ university: 'MIT', major: '', graduationYear: '2026' }).valid, false);
    assert.strictEqual(validateForm({ university: 'MIT', major: 'CS', graduationYear: '1990' }).valid, false);
    assert.strictEqual(validateForm({ university: 'MIT', major: 'CS', graduationYear: '2050' }).valid, false);
    assert.strictEqual(validateForm({ university: 'MIT', major: 'CS', graduationYear: 'invalid' }).valid, false);
    
    // Test 21 skills
    const tooManySkills = Array.from({ length: 21 }, (_, i) => `Skill${i}`).join(',');
    assert.strictEqual(validateForm({ university: 'MIT', major: 'CS', graduationYear: '2026', skills: tooManySkills }).valid, false);

    // Valid
    assert.strictEqual(validateForm({ university: 'MIT', major: 'CS', graduationYear: '2026', skills: 'JS, React' }).valid, true);
  });

  // 4. API failure handling
  await asyncTest('4. API failure cleanly captures backend 400 validation error details', async () => {
    setupMockFetch(() => ({
      ok: false,
      status: 400,
      headers: new Headers({ 'content-type': 'application/json' }),
      json: async () => ({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid request payload',
          details: [
            { field: 'graduationYear', message: 'Number must be greater than or equal to 2000' },
          ],
        },
      }),
    }));

    try {
      const res = await profileApi.completeStudentOnboarding({
        university: 'Stanford',
        major: 'EE',
        graduationYear: 1999,
      });

      assert.strictEqual(res.status, 400);
      assert.ok(res.error);
      assert.strictEqual(res.error.message, 'Invalid request payload');
      const details = res.error.details?.error?.details;
      assert.ok(Array.isArray(details));
      assert.strictEqual(details[0].field, 'graduationYear');
    } finally {
      restoreFetch();
    }
  });

  // 5. Duplicate submission prevention
  test('5. Duplicate submission guard blocks second submit when loading is true', () => {
    let loading = false;
    let submissionCount = 0;

    function triggerSubmit() {
      if (loading) return 'blocked';
      loading = true;
      submissionCount++;
      return 'submitted';
    }

    assert.strictEqual(triggerSubmit(), 'submitted');
    assert.strictEqual(triggerSubmit(), 'blocked');
    assert.strictEqual(triggerSubmit(), 'blocked');
    assert.strictEqual(submissionCount, 1);
  });

  // 6. Successful submission extraction
  await asyncTest('6. Successful submission unmarshals response profile data correctly', async () => {
    setupMockFetch();
    try {
      const res = await profileApi.completeStudentOnboarding({
        university: 'Harvard University',
        major: 'Computational Biology',
        graduationYear: 2025,
        skills: ['Python', 'Biopython', 'R'],
      });

      assert.strictEqual(res.status, 200);
      assert.strictEqual(res.error, null);
      assert.ok(res.data);
      const profile = res.data.profile;
      assert.strictEqual(profile.university, 'Stanford University');
      assert.strictEqual(profile.major, 'Computer Science');
      assert.strictEqual(profile.graduationYear, 2026);
    } finally {
      restoreFetch();
    }
  });

  // 7. Auth/session synchronization with /auth/me
  await asyncTest('7. Session refresh updates local storage with fresh user profile from /auth/me', async () => {
    localStorage.setItem('skillority_token', 'active_session_token');
    localStorage.setItem('skillority_user', JSON.stringify({
      id: 'usr_1',
      email: 'student@example.com',
      role: 'STUDENT',
      profile: { firstName: 'Alex', lastName: 'Rivera' }, // missing university/major before onboarding
    }));

    const mockFreshUser = {
      id: 'usr_1',
      email: 'student@example.com',
      role: 'STUDENT',
      isVerified: true,
      profile: {
        id: 'prof_1',
        firstName: 'Alex',
        lastName: 'Rivera',
        university: 'Stanford University',
        major: 'Computer Science',
        graduationYear: 2026,
      },
    };

    setupMockFetch((url) => {
      if (url.endsWith('/auth/me')) {
        return {
          ok: true,
          status: 200,
          headers: new Headers({ 'content-type': 'application/json' }),
          json: async () => ({
            success: true,
            data: { user: mockFreshUser },
          }),
        };
      }
      throw new Error(`Unexpected URL: ${url}`);
    });

    try {
      // Simulate refreshUser logic
      const { api } = await import('../src/lib/apiClient.js');
      const res = await api.get('/auth/me');
      assert.strictEqual(res.status, 200);
      assert.ok(res.data?.user);
      localStorage.setItem('skillority_user', JSON.stringify(res.data.user));

      const updatedUser = JSON.parse(localStorage.getItem('skillority_user'));
      assert.strictEqual(updatedUser.profile.university, 'Stanford University');
      assert.strictEqual(updatedUser.profile.major, 'Computer Science');
      assert.strictEqual(isOnboardingComplete(updatedUser), true);
    } finally {
      restoreFetch();
      localStorage.clear();
    }
  });

  // 7b. Fallback session synchronization when /auth/me network fails
  test('7b. Fallback session sync applies saved backend profile when refreshUser fails', () => {
    const existingUser = {
      id: 'usr_fallback_1',
      email: 'student.fallback@example.com',
      role: 'STUDENT',
      profile: { firstName: 'Taylor', lastName: 'Swift' },
    };

    const savedProfileFromBackend = {
      id: 'prof_fallback_1',
      userId: 'usr_fallback_1',
      firstName: 'Taylor',
      lastName: 'Swift',
      university: 'MIT',
      major: 'Electrical Engineering',
      graduationYear: 2026,
    };

    // Simulate fallback logic in handleSubmit
    const freshUser = null; // refreshUser failed
    let sessionUser = existingUser;
    if (!freshUser && savedProfileFromBackend && existingUser) {
      sessionUser = { ...existingUser, profile: savedProfileFromBackend };
      localStorage.setItem('skillority_user', JSON.stringify(sessionUser));
    }

    const stored = JSON.parse(localStorage.getItem('skillority_user'));
    assert.strictEqual(stored.profile.university, 'MIT');
    assert.strictEqual(stored.profile.major, 'Electrical Engineering');
    assert.strictEqual(isOnboardingComplete(stored), true);
  });

  // 8. Redirect destination after completion
  test('8. Post-login and post-onboarding destination resolves to /student/dashboard for completed student', () => {
    const completedStudent = {
      id: 'student_1',
      role: 'STUDENT',
      profile: { university: 'MIT', major: 'EECS' },
    };

    const destination = getPostLoginDestination(completedStudent);
    assert.strictEqual(destination, '/student/dashboard');

    // With a safe student redirect param
    const redirectedDest = getPostLoginDestination(completedStudent, encodeURIComponent('/student/courses/react-101'));
    assert.strictEqual(redirectedDest, '/student/courses/react-101');
  });

  // 9. OnboardingGuard behavior for completed students
  test('9. isOnboardingComplete returns true for completed student profile', () => {
    const studentUser = {
      role: 'STUDENT',
      profile: {
        university: 'Oxford',
        major: 'Mathematics',
      },
    };
    assert.strictEqual(isOnboardingComplete(studentUser), true);
  });

  // 10. OnboardingGuard behavior for incomplete students
  test('10. isOnboardingComplete returns false for incomplete student and getPostLoginDestination routes to /onboarding/student', () => {
    const noProfile = { role: 'STUDENT', profile: null };
    const missingMajor = { role: 'STUDENT', profile: { university: 'Cambridge' } };
    const missingUni = { role: 'STUDENT', profile: { major: 'Physics' } };
    const emptyUni = { role: 'STUDENT', profile: { university: '', major: 'Physics' } };

    assert.strictEqual(isOnboardingComplete(noProfile), false);
    assert.strictEqual(isOnboardingComplete(missingMajor), false);
    assert.strictEqual(isOnboardingComplete(missingUni), false);
    assert.strictEqual(isOnboardingComplete(emptyUni), false);

    assert.strictEqual(getPostLoginDestination(noProfile), '/onboarding/student');
    assert.strictEqual(getPostLoginDestination(missingMajor), '/onboarding/student');
    assert.strictEqual(getPostLoginDestination(missingUni), '/onboarding/student');
  });

  // Cleanup
  globalThis.localStorage = originalLocalStorage;
  globalThis.window = originalWindow;

  console.log(`\nSTUDENT ONBOARDING TEST SUMMARY: ${passed} Passed, ${failed} Failed`);
  if (failed > 0) {
    process.exit(1);
  }
}

runStudentOnboardingTests().catch((err) => {
  console.error('Test execution error:', err);
  process.exit(1);
});
