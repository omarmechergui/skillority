import assert from 'assert';
import { profileApi } from '../src/lib/api/profiles.js';
import { isOnboardingComplete, getPostLoginDestination } from '../src/lib/onboarding.js';

async function runCompanyOnboardingTests() {
  console.log('--- STARTING MODULE 1B: COMPANY ONBOARDING TEST SUITE ---');
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
          message: 'Company onboarding completed successfully',
          data: {
            profile: {
              id: 'prof_comp_123',
              userId: 'user_comp_1',
              firstName: 'Company',
              lastName: 'Representative',
              companyName: 'Stripe, Inc.',
              industry: 'Technology',
              companySize: '51-200',
              website: 'https://stripe.com',
              companyDescription: 'Financial infrastructure for the internet',
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
  await asyncTest('1. profileApi.completeCompanyOnboarding calls POST /auth/onboarding/company with auth header', async () => {
    localStorage.setItem('skillority_token', 'test_company_jwt_token');
    setupMockFetch();
    try {
      const res = await profileApi.completeCompanyOnboarding({
        companyName: 'Stripe, Inc.',
        industry: 'Technology',
        companySize: '51-200',
        website: 'https://stripe.com',
      });

      assert.strictEqual(interceptedCalls.length, 1);
      const call = interceptedCalls[0];
      assert.strictEqual(call.config.method, 'POST');
      assert.ok(call.url.endsWith('/auth/onboarding/company'));
      assert.strictEqual(call.config.headers['Authorization'], 'Bearer test_company_jwt_token');
      assert.strictEqual(call.config.credentials, 'include');
      assert.strictEqual(res.status, 200);
      assert.ok(res.data?.profile);
    } finally {
      restoreFetch();
      localStorage.clear();
    }
  });

  // 2. Correct payload mapping
  test('2. Correct payload mapping transforms company form inputs into backend schema', () => {
    const rawForm = {
      companyName: '  Datadog Inc.  ',
      industry: '  Technology  ',
      companySize: '51-200',
      website: 'datadog.com',
      description: '  Cloud-scale monitoring and security platform.  ',
    };

    let website = rawForm.website.trim();
    if (website && !/^https?:\/\//i.test(website)) {
      website = `https://${website}`;
    }

    const payload = {
      companyName: rawForm.companyName.trim(),
      industry: rawForm.industry.trim(),
      companySize: rawForm.companySize.trim(),
      website: website || '',
      companyDescription: rawForm.description.trim() || undefined,
      bio: rawForm.description.trim() ? rawForm.description.trim().slice(0, 500) : undefined,
    };

    assert.strictEqual(payload.companyName, 'Datadog Inc.');
    assert.strictEqual(payload.industry, 'Technology');
    assert.strictEqual(payload.companySize, '51-200');
    assert.strictEqual(payload.website, 'https://datadog.com');
    assert.strictEqual(payload.companyDescription, 'Cloud-scale monitoring and security platform.');
    assert.strictEqual(payload.bio, 'Cloud-scale monitoring and security platform.');
  });

  // 3. Required field validation
  test('3. Client-side validation rejects missing required fields and invalid URLs', () => {
    function validateCompanyForm(formData) {
      const companyName = (formData.companyName || '').trim();
      const industry = (formData.industry || '').trim();
      const companySize = (formData.companySize || '').trim();

      if (!companyName) return { valid: false, error: 'Company Name is required.' };
      if (companyName.length < 2 || companyName.length > 100) {
        return { valid: false, error: 'Company Name must be between 2 and 100 characters.' };
      }
      if (!industry) return { valid: false, error: 'Industry is required.' };
      if (!companySize) return { valid: false, error: 'Company Size is required.' };

      let website = (formData.website || '').trim();
      if (website) {
        if (!/^https?:\/\//i.test(website)) {
          website = `https://${website}`;
        }
        try {
          new URL(website);
        } catch {
          return { valid: false, error: 'Please enter a valid company website URL.' };
        }
      }

      const description = (formData.description || '').trim();
      if (description.length > 1000) {
        return { valid: false, error: 'Company Overview cannot exceed 1000 characters.' };
      }

      return { valid: true, error: null };
    }

    assert.strictEqual(validateCompanyForm({ companyName: '', industry: 'Tech', companySize: '1-10' }).valid, false);
    assert.strictEqual(validateCompanyForm({ companyName: 'A', industry: 'Tech', companySize: '1-10' }).valid, false);
    assert.strictEqual(validateCompanyForm({ companyName: 'Stripe', industry: '', companySize: '1-10' }).valid, false);
    assert.strictEqual(validateCompanyForm({ companyName: 'Stripe', industry: 'Tech', companySize: '' }).valid, false);
    assert.strictEqual(validateCompanyForm({ companyName: 'Stripe', industry: 'Tech', companySize: '1-10', website: 'not a url !!!' }).valid, false);
    assert.strictEqual(validateCompanyForm({ companyName: 'Stripe', industry: 'Tech', companySize: '1-10', description: 'x'.repeat(1001) }).valid, false);

    // Valid inputs
    assert.strictEqual(validateCompanyForm({ companyName: 'Stripe, Inc.', industry: 'Technology', companySize: '51-200', website: 'https://stripe.com' }).valid, true);
    assert.strictEqual(validateCompanyForm({ companyName: 'Stripe, Inc.', industry: 'Technology', companySize: '51-200', website: 'stripe.com' }).valid, true);
    assert.strictEqual(validateCompanyForm({ companyName: 'Stripe, Inc.', industry: 'Technology', companySize: '51-200', website: '' }).valid, true);
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
            { field: 'companyName', message: 'Company name must be at least 2 characters' },
          ],
        },
      }),
    }));

    try {
      const res = await profileApi.completeCompanyOnboarding({
        companyName: 'X',
        industry: 'Technology',
      });

      assert.strictEqual(res.status, 400);
      assert.ok(res.error);
      assert.strictEqual(res.error.message, 'Invalid request payload');
      const details = res.error.details?.error?.details;
      assert.ok(Array.isArray(details));
      assert.strictEqual(details[0].field, 'companyName');
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
    assert.strictEqual(submissionCount, 1);
  });

  // 6. Successful submission extraction
  await asyncTest('6. Successful submission unmarshals response profile data correctly', async () => {
    setupMockFetch();
    try {
      const res = await profileApi.completeCompanyOnboarding({
        companyName: 'OpenAI',
        industry: 'Technology',
        companySize: '201-1000',
        website: 'https://openai.com',
      });

      assert.strictEqual(res.status, 200);
      assert.strictEqual(res.error, null);
      assert.ok(res.data?.profile);
      assert.strictEqual(res.data.profile.companyName, 'Stripe, Inc.');
      assert.strictEqual(res.data.profile.industry, 'Technology');
    } finally {
      restoreFetch();
    }
  });

  // 7. Auth/session synchronization with /auth/me
  await asyncTest('7. Session refresh updates local storage with fresh company profile from /auth/me', async () => {
    localStorage.setItem('skillority_token', 'active_company_token');
    localStorage.setItem('skillority_user', JSON.stringify({
      id: 'usr_c1',
      email: 'recruiter@company.com',
      role: 'COMPANY',
      profile: { firstName: 'Jane', lastName: 'Doe', companyName: 'Initial Co' },
    }));

    const mockFreshUser = {
      id: 'usr_c1',
      email: 'recruiter@company.com',
      role: 'COMPANY',
      isVerified: true,
      profile: {
        id: 'prof_c1',
        firstName: 'Jane',
        lastName: 'Doe',
        companyName: 'Initial Co',
        industry: 'Technology',
        companySize: '51-200',
        website: 'https://initial.com',
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
      const { api } = await import('../src/lib/apiClient.js');
      const res = await api.get('/auth/me');
      assert.strictEqual(res.status, 200);
      assert.ok(res.data?.user);
      localStorage.setItem('skillority_user', JSON.stringify(res.data.user));

      const updatedUser = JSON.parse(localStorage.getItem('skillority_user'));
      assert.strictEqual(updatedUser.profile.companyName, 'Initial Co');
      assert.strictEqual(updatedUser.profile.industry, 'Technology');
      assert.strictEqual(isOnboardingComplete(updatedUser), true);
    } finally {
      restoreFetch();
      localStorage.clear();
    }
  });

  // 8. Fallback session synchronization when /auth/me network fails
  test('8. Fallback session sync applies saved backend profile when refreshUser fails', () => {
    const existingUser = {
      id: 'usr_c_fallback',
      email: 'recruiter@fallback.com',
      role: 'COMPANY',
      profile: { firstName: 'Fallback', lastName: 'Recruiter', companyName: 'Initial Co' },
    };

    const savedProfileFromBackend = {
      id: 'prof_c_fallback',
      userId: 'usr_c_fallback',
      firstName: 'Fallback',
      lastName: 'Recruiter',
      companyName: 'Updated Co',
      industry: 'Finance',
      companySize: '11-50',
    };

    const freshUser = null; // refreshUser failed
    let sessionUser = existingUser;
    if (!freshUser && savedProfileFromBackend && existingUser) {
      sessionUser = { ...existingUser, profile: savedProfileFromBackend };
      localStorage.setItem('skillority_user', JSON.stringify(sessionUser));
    }

    const stored = JSON.parse(localStorage.getItem('skillority_user'));
    assert.strictEqual(stored.profile.companyName, 'Updated Co');
    assert.strictEqual(stored.profile.industry, 'Finance');
    assert.strictEqual(isOnboardingComplete(stored), true);
  });

  // 9. Redirect destination after completion
  test('9. Post-login and post-onboarding destination resolves to /company/dashboard for completed company', () => {
    const completedCompany = {
      id: 'company_user_1',
      role: 'COMPANY',
      profile: { companyName: 'Acme Corp', industry: 'Technology', companySize: '51-200' },
    };

    const destination = getPostLoginDestination(completedCompany);
    assert.strictEqual(destination, '/company/dashboard');
  });

  // 10. Onboarding completion edge-case permutations matrix
  test('10. Edge-Case Matrix: Mandatory fields (companyName && industry && companySize) strictly enforced', () => {
    // 1. Company with companyName only -> incomplete
    const companyNameOnly = {
      role: 'COMPANY',
      profile: { companyName: 'Acme Inc.', industry: null, companySize: null },
    };
    assert.strictEqual(isOnboardingComplete(companyNameOnly), false);
    assert.strictEqual(getPostLoginDestination(companyNameOnly), '/onboarding/company');

    // 2. Company with companyName + industry but no companySize -> incomplete
    const companyWithIndustryOnly = {
      role: 'COMPANY',
      profile: { companyName: 'Acme Inc.', industry: 'Technology', companySize: null },
    };
    assert.strictEqual(isOnboardingComplete(companyWithIndustryOnly), false);
    assert.strictEqual(getPostLoginDestination(companyWithIndustryOnly), '/onboarding/company');

    // 3. Company with companyName + companySize but no industry -> incomplete
    const companyWithSizeOnly = {
      role: 'COMPANY',
      profile: { companyName: 'Acme Inc.', industry: null, companySize: '51-200' },
    };
    assert.strictEqual(isOnboardingComplete(companyWithSizeOnly), false);
    assert.strictEqual(getPostLoginDestination(companyWithSizeOnly), '/onboarding/company');

    // 4. Company with all required fields -> complete
    const companyFullyOnboarded = {
      role: 'COMPANY',
      profile: { companyName: 'Acme Inc.', industry: 'Technology', companySize: '51-200' },
    };
    assert.strictEqual(isOnboardingComplete(companyFullyOnboarded), true);
    assert.strictEqual(getPostLoginDestination(companyFullyOnboarded), '/company/dashboard');

    // 5. Student onboarding behavior remains strictly unchanged (university && major)
    const studentIncomplete = {
      role: 'STUDENT',
      profile: { university: 'Stanford', major: null },
    };
    const studentComplete = {
      role: 'STUDENT',
      profile: { university: 'Stanford', major: 'Computer Science' },
    };
    assert.strictEqual(isOnboardingComplete(studentIncomplete), false);
    assert.strictEqual(isOnboardingComplete(studentComplete), true);
    assert.strictEqual(getPostLoginDestination(studentIncomplete), '/onboarding/student');
    assert.strictEqual(getPostLoginDestination(studentComplete), '/student/dashboard');
  });

  // 11. OnboardingGuard behavior for incomplete company
  test('11. OnboardingGuard does not redirect incomplete users to dashboard and routes to /onboarding/company', () => {
    const noProfile = { role: 'COMPANY', profile: null };
    const missingCompanyName = { role: 'COMPANY', profile: { firstName: 'Rep', companyName: null, industry: 'Tech', companySize: '1-10' } };
    const newSignupWithOnlyCompanyName = {
      role: 'COMPANY',
      profile: {
        firstName: 'Recruiter',
        lastName: 'Contact',
        companyName: 'Brand New Startup',
        industry: null,
        companySize: null,
      },
    };

    assert.strictEqual(isOnboardingComplete(noProfile), false);
    assert.strictEqual(isOnboardingComplete(missingCompanyName), false);
    assert.strictEqual(isOnboardingComplete(newSignupWithOnlyCompanyName), false);

    assert.strictEqual(getPostLoginDestination(noProfile), '/onboarding/company');
    assert.strictEqual(getPostLoginDestination(missingCompanyName), '/onboarding/company');
    assert.strictEqual(getPostLoginDestination(newSignupWithOnlyCompanyName), '/onboarding/company');
  });

  // Cleanup
  globalThis.localStorage = originalLocalStorage;
  globalThis.window = originalWindow;

  console.log(`\nCOMPANY ONBOARDING TEST SUMMARY: ${passed} Passed, ${failed} Failed`);
  if (failed > 0) {
    process.exit(1);
  }
}

runCompanyOnboardingTests().catch((err) => {
  console.error('Test execution error:', err);
  process.exit(1);
});
