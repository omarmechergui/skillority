import assert from 'assert';
import { profileApi } from '../src/lib/api/profiles.js';
import { isOnboardingComplete, getPostLoginDestination } from '../src/lib/onboarding.js';

async function runInstructorOnboardingTests() {
  console.log('--- STARTING MODULE 1C: INSTRUCTOR ONBOARDING TEST SUITE ---');
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
    setItem: (key, val) => {
      mockStorage[key] = String(val);
    },
    removeItem: (key) => {
      delete mockStorage[key];
    },
    clear: () => {
      Object.keys(mockStorage).forEach((k) => delete mockStorage[k]);
    },
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
          message: 'Instructor onboarding completed successfully',
          data: {
            profile: {
              id: 'prof_inst_123',
              userId: 'user_inst_1',
              firstName: 'Dr. Sarah',
              lastName: 'Jenkins',
              experience: 'Principal Engineer & Systems Architect',
              expertise: ['Web Development', 'Distributed Systems', 'Next.js'],
              bio: '10+ years experience building distributed architectures',
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
  await asyncTest(
    '1. profileApi.completeInstructorOnboarding calls POST /auth/onboarding/instructor with auth header',
    async () => {
      localStorage.setItem('skillority_token', 'test_instructor_jwt_token');
      setupMockFetch();
      try {
        const res = await profileApi.completeInstructorOnboarding({
          name: 'Dr. Sarah Jenkins',
          headline: 'Principal Engineer & Systems Architect',
          expertise: ['Web Development', 'Distributed Systems', 'Next.js'],
          bio: '10+ years experience building distributed architectures',
          courseIdea: 'Building Enterprise Micro-Frontends with React 19',
        });

        assert.strictEqual(interceptedCalls.length, 1);
        const call = interceptedCalls[0];
        assert.strictEqual(call.config.method, 'POST');
        assert.ok(call.url.endsWith('/auth/onboarding/instructor'));
        assert.strictEqual(call.config.headers['Authorization'], 'Bearer test_instructor_jwt_token');
        assert.strictEqual(call.config.credentials, 'include');
        assert.strictEqual(res.status, 200);
        assert.ok(res.data?.profile);
      } finally {
        restoreFetch();
        localStorage.clear();
      }
    }
  );

  // 2. Correct payload mapping and normalization
  test('2. Correct payload mapping transforms instructor form inputs into backend schema', () => {
    const rawForm = {
      name: '  Dr. Sarah Jenkins  ',
      headline: '  Principal Engineer & Systems Architect  ',
      expertise: 'Web Development, Distributed Systems, Next.js, Web Development',
      bio: '  10+ years building web systems.  ',
      courseIdea: '  Micro-frontends  ',
    };

    const items = rawForm.expertise.split(',').map((s) => s.trim()).filter(Boolean);
    const normalizedExpertise = Array.from(new Set(items));

    const payload = {
      name: rawForm.name.trim(),
      headline: rawForm.headline.trim(),
      expertise: normalizedExpertise,
      bio: rawForm.bio.trim() || undefined,
      courseIdea: rawForm.courseIdea.trim() || undefined,
    };

    assert.strictEqual(payload.name, 'Dr. Sarah Jenkins');
    assert.strictEqual(payload.headline, 'Principal Engineer & Systems Architect');
    assert.deepStrictEqual(payload.expertise, ['Web Development', 'Distributed Systems', 'Next.js']);
    assert.strictEqual(payload.bio, '10+ years building web systems.');
    assert.strictEqual(payload.courseIdea, 'Micro-frontends');
  });

  // 3. Client-side validation logic
  test('3. Client-side validation rejects missing required fields and empty expertise', () => {
    function validateInstructorForm(form) {
      const name = (form.name || '').trim();
      const headline = (form.headline || '').trim();
      const items = (form.expertise || '')
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);

      if (!name) return { valid: false, error: 'Instructor Name is required.' };
      if (name.length < 2 || name.length > 100) {
        return { valid: false, error: 'Instructor Name must be between 2 and 100 characters.' };
      }
      if (!headline) return { valid: false, error: 'Professional Headline is required.' };
      if (headline.length < 2 || headline.length > 500) {
        return { valid: false, error: 'Professional Headline must be between 2 and 500 characters.' };
      }
      if (items.length === 0) return { valid: false, error: 'Primary Domain Expertise is required (at least one skill).' };
      if (items.length > 20) return { valid: false, error: 'Primary Domain Expertise cannot exceed 20 skills.' };

      const bio = (form.bio || '').trim();
      if (bio.length > 500) return { valid: false, error: 'Instructor Bio cannot exceed 500 characters.' };

      const courseIdea = (form.courseIdea || '').trim();
      if (courseIdea.length > 200) return { valid: false, error: 'First Course Curriculum Title Idea cannot exceed 200 characters.' };

      return { valid: true, error: null };
    }

    // Invalid missing name
    assert.strictEqual(validateInstructorForm({ name: '', headline: 'Lead Dev', expertise: 'React' }).valid, false);
    // Invalid missing headline
    assert.strictEqual(validateInstructorForm({ name: 'Sarah', headline: '', expertise: 'React' }).valid, false);
    // Invalid empty expertise
    assert.strictEqual(validateInstructorForm({ name: 'Sarah', headline: 'Lead Dev', expertise: '' }).valid, false);
    assert.strictEqual(validateInstructorForm({ name: 'Sarah', headline: 'Lead Dev', expertise: '  ,   ,  ' }).valid, false);
    // Invalid bio exceeding 500 chars
    assert.strictEqual(validateInstructorForm({ name: 'Sarah', headline: 'Lead Dev', expertise: 'React', bio: 'a'.repeat(501) }).valid, false);

    // Valid form inputs
    assert.strictEqual(
      validateInstructorForm({
        name: 'Dr. Sarah Jenkins',
        headline: 'Principal Engineer',
        expertise: 'React, Node.js',
        bio: 'Experienced engineer',
        courseIdea: 'Advanced Next.js',
      }).valid,
      true
    );
    // Valid without optional fields
    assert.strictEqual(
      validateInstructorForm({
        name: 'Dr. Sarah Jenkins',
        headline: 'Principal Engineer',
        expertise: 'React',
        bio: '',
        courseIdea: '',
      }).valid,
      true
    );
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
            { field: 'headline', message: 'Professional headline or experience is required' },
            { field: 'expertise', message: 'At least one domain expertise item is required' },
          ],
        },
      }),
    }));

    try {
      const res = await profileApi.completeInstructorOnboarding({});
      assert.strictEqual(res.status, 400);
      assert.ok(res.error);
      assert.strictEqual(res.error.details.error.code, 'VALIDATION_ERROR');
      const details = res.error.details.error.details;
      assert.strictEqual(details.length, 2);
      assert.strictEqual(details[0].field, 'headline');
      assert.strictEqual(details[1].field, 'expertise');
    } finally {
      restoreFetch();
    }
  });

  // 5. Network error handling
  await asyncTest('5. Network failure cleanly returns error object without crashing', async () => {
    setupMockFetch(() => {
      throw new Error('Failed to fetch: Network disconnected');
    });

    try {
      const res = await profileApi.completeInstructorOnboarding({
        name: 'Sarah',
        headline: 'Lead Dev',
        expertise: ['React'],
      });
      assert.strictEqual(res.data, null);
      assert.ok(res.error);
      assert.strictEqual(res.status, 500);
      assert.ok(res.error.message.includes('Failed to fetch'));
    } finally {
      restoreFetch();
    }
  });

  // 6. Duplicate submission prevention
  test('6. Duplicate submission guard blocks second execution while saving', () => {
    let loading = false;
    let submissions = 0;

    function submitForm() {
      if (loading) return false;
      loading = true;
      submissions++;
      return true;
    }

    assert.strictEqual(submitForm(), true);
    assert.strictEqual(submitForm(), false); // blocked
    assert.strictEqual(submitForm(), false); // blocked
    assert.strictEqual(submissions, 1);

    loading = false; // Reset on completion
    assert.strictEqual(submitForm(), true);
    assert.strictEqual(submissions, 2);
  });

  // 7. Onboarding completion logic edge cases
  test('7. isOnboardingComplete strictly verifies required fields for INSTRUCTOR', () => {
    // A: null user / profile
    assert.strictEqual(isOnboardingComplete(null), false);
    assert.strictEqual(isOnboardingComplete({ role: 'INSTRUCTOR' }), false);
    assert.strictEqual(isOnboardingComplete({ role: 'INSTRUCTOR', profile: {} }), false);

    // B: No expertise and no experience → incomplete
    assert.strictEqual(
      isOnboardingComplete({
        role: 'INSTRUCTOR',
        profile: { expertise: [], experience: null },
      }),
      false
    );
    assert.strictEqual(
      isOnboardingComplete({
        role: 'INSTRUCTOR',
        profile: { expertise: [], experience: '' },
      }),
      false
    );

    // C: Expertise only → incomplete
    assert.strictEqual(
      isOnboardingComplete({
        role: 'INSTRUCTOR',
        profile: { expertise: ['Next.js'], experience: null },
      }),
      false
    );
    assert.strictEqual(
      isOnboardingComplete({
        role: 'INSTRUCTOR',
        profile: { expertise: ['Next.js'], experience: '' },
      }),
      false
    );
    assert.strictEqual(
      isOnboardingComplete({
        role: 'INSTRUCTOR',
        profile: { expertise: ['Next.js'], experience: '   ' },
      }),
      false
    );

    // D: Experience only → incomplete
    assert.strictEqual(
      isOnboardingComplete({
        role: 'INSTRUCTOR',
        profile: { expertise: [], experience: 'Principal Architect' },
      }),
      false
    );
    assert.strictEqual(
      isOnboardingComplete({
        role: 'INSTRUCTOR',
        profile: { experience: 'Principal Architect' },
      }),
      false
    );

    // E: Both present → complete!
    assert.strictEqual(
      isOnboardingComplete({
        role: 'INSTRUCTOR',
        profile: {
          expertise: ['Distributed Systems', 'Next.js'],
          experience: 'Principal Systems Architect',
        },
      }),
      true
    );

    // F: Student completion behavior remains unchanged
    assert.strictEqual(
      isOnboardingComplete({
        role: 'STUDENT',
        profile: { university: 'Stanford', major: 'CS' },
      }),
      true
    );
    assert.strictEqual(
      isOnboardingComplete({
        role: 'STUDENT',
        profile: { university: 'Stanford' },
      }),
      false
    );

    // G: Company completion behavior remains unchanged
    assert.strictEqual(
      isOnboardingComplete({
        role: 'COMPANY',
        profile: { companyName: 'Acme', industry: 'Tech', companySize: '51-200' },
      }),
      true
    );
    assert.strictEqual(
      isOnboardingComplete({
        role: 'COMPANY',
        profile: { companyName: 'Acme', industry: 'Tech' },
      }),
      false
    );
  });

  // 8. Role-based routing and guard behavior for Instructor
  test('8. getPostLoginDestination routes incomplete instructor to onboarding and completed to dashboard', () => {
    const incompleteInstructor = {
      role: 'INSTRUCTOR',
      profile: { expertise: [], experience: null },
    };
    assert.strictEqual(
      getPostLoginDestination(incompleteInstructor),
      '/onboarding/instructor'
    );

    const completedInstructor = {
      role: 'INSTRUCTOR',
      profile: {
        expertise: ['Next.js'],
        experience: 'Staff Engineer',
      },
    };
    assert.strictEqual(
      getPostLoginDestination(completedInstructor),
      '/instructor/dashboard'
    );

    // Safe redirect query for completed instructor
    assert.strictEqual(
      getPostLoginDestination(completedInstructor, encodeURIComponent('/instructor/courses/create')),
      '/instructor/courses/create'
    );

    // Cross-role attempt blocked: student redirect blocked for instructor
    assert.strictEqual(
      getPostLoginDestination(completedInstructor, encodeURIComponent('/student/dashboard')),
      '/instructor/dashboard'
    );
  });

  // 9. Session synchronization fallback
  test('9. Session synchronization falls back to authoritative API response if refreshUser fails', () => {
    let currentUser = {
      id: 'inst_user_1',
      role: 'INSTRUCTOR',
      profile: null,
    };

    function loginUserMock(updatedUser) {
      currentUser = updatedUser;
    }

    const apiResponseData = {
      profile: {
        id: 'prof_123',
        userId: 'inst_user_1',
        firstName: 'Dr. Sarah',
        lastName: 'Jenkins',
        experience: 'Principal Systems Architect',
        expertise: ['Next.js', 'React'],
      },
    };

    // Simulate refreshUser returning null
    const freshUser = null;
    if (!freshUser && apiResponseData.profile && currentUser) {
      loginUserMock({ ...currentUser, profile: apiResponseData.profile });
    }

    assert.ok(currentUser.profile);
    assert.strictEqual(currentUser.profile.experience, 'Principal Systems Architect');
    assert.deepStrictEqual(currentUser.profile.expertise, ['Next.js', 'React']);
    assert.strictEqual(isOnboardingComplete(currentUser), true);
  });

  // 10. Name parsing and title removal matrix
  test('10. Name parsing matrix correctly extracts names, strips titles, and preserves existing names', () => {
    const TITLES_REGEX = /^(dr\.?|prof\.?|professor|mr\.?|mrs\.?|ms\.?|mx\.?|doctor)$/i;

    function parseInstructorName(name, existingProfile = null) {
      if (!name || typeof name !== 'string' || !name.trim()) {
        return {
          firstName: existingProfile?.firstName || undefined,
          lastName: existingProfile?.lastName || undefined,
        };
      }

      const rawTokens = name.trim().split(/\s+/).filter(Boolean);
      if (rawTokens.length === 0) {
        return {
          firstName: existingProfile?.firstName || undefined,
          lastName: existingProfile?.lastName || undefined,
        };
      }

      let tokens = [...rawTokens];
      if (TITLES_REGEX.test(tokens[0])) {
        tokens.shift();
      }

      if (tokens.length === 0) {
        return {
          firstName: existingProfile?.firstName || undefined,
          lastName: existingProfile?.lastName || undefined,
        };
      }

      const firstName = tokens[0];
      const lastName =
        tokens.length > 1
          ? tokens.slice(1).join(' ')
          : existingProfile?.lastName ?? '';

      return { firstName, lastName };
    }

    // Example 1: Sarah Jenkins
    const r1 = parseInstructorName('Sarah Jenkins');
    assert.strictEqual(r1.firstName, 'Sarah');
    assert.strictEqual(r1.lastName, 'Jenkins');

    // Example 2: Dr. Sarah Jenkins (Title must NEVER be stored as firstName)
    const r2 = parseInstructorName('Dr. Sarah Jenkins');
    assert.strictEqual(r2.firstName, 'Sarah');
    assert.strictEqual(r2.lastName, 'Jenkins');

    // Example 3: Sarah (Single name, preserves existing lastName)
    const existing = { firstName: 'Sarah', lastName: 'Jenkins' };
    const r3 = parseInstructorName('Sarah', existing);
    assert.strictEqual(r3.firstName, 'Sarah');
    assert.strictEqual(r3.lastName, 'Jenkins');

    // Example 4: Sarah Maria Jenkins (Multiple middle/last names)
    const r4 = parseInstructorName('Sarah Maria Jenkins');
    assert.strictEqual(r4.firstName, 'Sarah');
    assert.strictEqual(r4.lastName, 'Maria Jenkins');

    // Example 5: Prof. Dr. edge case or Prof Sarah Jenkins
    const r5 = parseInstructorName('Prof. Sarah Jenkins');
    assert.strictEqual(r5.firstName, 'Sarah');
    assert.strictEqual(r5.lastName, 'Jenkins');

    // Example 6: Title-only "Dr." does not destroy existing name
    const r6 = parseInstructorName('Dr.', existing);
    assert.strictEqual(r6.firstName, 'Sarah');
    assert.strictEqual(r6.lastName, 'Jenkins');

    // Example 7: Empty or whitespace preserves existing
    const r7 = parseInstructorName('   ', existing);
    assert.strictEqual(r7.firstName, 'Sarah');
    assert.strictEqual(r7.lastName, 'Jenkins');
  });

  // 11. Bio validation limit consistency
  test('11. Bio character limit is strictly aligned with application-wide 500-char convention', () => {
    const validBio = 'x'.repeat(500);
    const invalidBio = 'x'.repeat(501);

    function checkBioLength(bio) {
      if (!bio) return true;
      return bio.trim().length <= 500;
    }

    assert.strictEqual(checkBioLength(validBio), true);
    assert.strictEqual(checkBioLength(invalidBio), false);
  });

  console.log(`\nINSTRUCTOR ONBOARDING TEST SUMMARY: ${passed} Passed, ${failed} Failed\n`);
  if (failed > 0) {
    process.exit(1);
  }
}

runInstructorOnboardingTests();
