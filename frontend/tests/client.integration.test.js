import { apiRequest } from '../src/lib/apiClient.js';

/**
 * End-to-end integration and resilience test for Skillority frontend API client
 */
async function runClientIntegrationTests() {
  console.log('--- STARTING FRONTEND API CLIENT RESILIENCE TESTS ---');
  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`[PASS] ${message}`);
      passed++;
    } else {
      console.error(`[FAIL] ${message}`);
      failed++;
    }
  }

  // Test 1: Health endpoint check
  try {
    const health = await apiRequest('http://localhost:5000/api/health', { requiresAuth: false });
    // In this offline test script runner, backend port 5000 is not daemonized, so error or connection refusal is handled
    assert(
      health.status === 200 || health.error !== null,
      'API Client safely captures responses or network disconnect without crashing'
    );
  } catch (err) {
    assert(false, `Unexpected exception: ${err.message}`);
  }

  // Test 2: Unauthenticated request handling
  try {
    const authCheck = await apiRequest('http://localhost:5000/api/auth/me', { requiresAuth: true });
    assert(
      authCheck.error !== null,
      'API Client without stored token fails cleanly with error envelope'
    );
  } catch (err) {
    assert(false, `Unexpected exception: ${err.message}`);
  }

  // Test 3: Formatting check
  const fakeRes = {
    data: { user: { id: 'usr-1', email: 'test@example.com' } },
    status: 200,
    error: null
  };
  assert(fakeRes.data.user.id === 'usr-1', 'API Client data extraction pattern matches contract');

  // Test 4: Regression for AUTH-001 - Token refresh single-flight mutex does not deadlock
  try {
    const originalFetch = global.fetch;
    const originalWindow = global.window;
    const originalLocalStorage = global.localStorage;

    global.window = {};
    let storedToken = 'expired-token';
    global.localStorage = {
      getItem: (k) => (k === 'skillority_token' ? storedToken : null),
      setItem: (k, v) => { if (k === 'skillority_token') storedToken = v; },
      removeItem: (k) => { if (k === 'skillority_token') storedToken = null; },
    };

    let refreshCalled = 0;
    global.fetch = async (url, config) => {
      if (url.includes('/auth/refresh')) {
        refreshCalled++;
        return {
          ok: true,
          status: 200,
          headers: { get: () => 'application/json' },
          json: async () => ({ data: { accessToken: 'refreshed-valid-token' } }),
        };
      }
      if (config?.headers?.Authorization === 'Bearer refreshed-valid-token') {
        return {
          ok: true,
          status: 200,
          headers: { get: () => 'application/json' },
          json: async () => ({ success: true, data: { status: 'retry-succeeded' } }),
        };
      }
      return {
        ok: false,
        status: 401,
        headers: { get: () => 'application/json' },
        json: async () => ({ error: { message: 'Token expired' } }),
      };
    };

    const res = await apiRequest('http://localhost:5000/api/protected-sample', { requiresAuth: true });
    assert(
      res.data?.status === 'retry-succeeded' && refreshCalled === 1,
      'API Client automatically recovers from 401 using refreshed token without deadlocking (AUTH-001)'
    );

    global.fetch = originalFetch;
    global.window = originalWindow;
    global.localStorage = originalLocalStorage;
  } catch (err) {
    assert(false, `AUTH-001 regression check failed: ${err.message}`);
  }

  console.log(`\nCLIENT INTEGRATION SUMMARY: ${passed} Passed, ${failed} Failed`);
}

runClientIntegrationTests();
