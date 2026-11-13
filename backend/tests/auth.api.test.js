import assert from 'assert';
import http from 'http';
import app from '../src/app.js';
import { signAccessToken } from '../src/utils/jwt.js';

// Custom simulated mock request runner using real http.ServerResponse to satisfy Helmet & Express
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

    // Express body-parser streams data from IncomingMessage unless stream already finished
    // Push body chunks into rawReq so body-parser finishes immediately
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

async function runDirectApiSecurityTests() {
  console.log('--- STARTING PHASE 2 RBAC & SECURITY API TESTS (DIRECT IN-PROCESS) ---');
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

  // 1. Unauthenticated access to protected route returns 401
  await test('Unauthenticated access to /api/auth/me returns 401 UNAUTHORIZED', async () => {
    const res = await simulateRequest(app, { method: 'GET', url: '/api/auth/me' });
    assert.strictEqual(res.status, 401);
    assert.strictEqual(res.body.error.code, 'UNAUTHORIZED');
  });

  // 2. Invalid Bearer token returns 401 INVALID_TOKEN
  await test('Invalid Bearer token returns 401 INVALID_TOKEN', async () => {
    const res = await simulateRequest(app, {
      method: 'GET',
      url: '/api/auth/me',
      headers: { authorization: 'Bearer invalid.token.payload' },
    });
    assert.strictEqual(res.status, 401);
    assert.strictEqual(res.body.error.code, 'INVALID_TOKEN');
  });

  // 3. Student token attempting Admin route returns 403 FORBIDDEN
  await test('Student role token attempting Admin endpoint returns 403 FORBIDDEN', async () => {
    const studentToken = signAccessToken({
      id: 'student_123',
      email: 'student@example.com',
      role: 'STUDENT',
      tokenVersion: 0,
    });

    const res = await simulateRequest(app, {
      method: 'POST',
      url: '/api/auth/admin/instructors/invite',
      headers: { authorization: `Bearer ${studentToken}` },
      body: { email: 'newprof@test.com' },
    });

    assert.strictEqual(res.status, 403);
    assert.strictEqual(res.body.error.code, 'FORBIDDEN');
  });

  // 4. Company token attempting Student Onboarding returns 403 FORBIDDEN
  await test('Company role token attempting Student Onboarding returns 403 FORBIDDEN', async () => {
    const companyToken = signAccessToken({
      id: 'company_123',
      email: 'recruiter@tech.com',
      role: 'COMPANY',
      tokenVersion: 0,
    });

    const res = await simulateRequest(app, {
      method: 'POST',
      url: '/api/auth/onboarding/student',
      headers: { authorization: `Bearer ${companyToken}` },
      body: { university: 'Tech University' },
    });

    assert.strictEqual(res.status, 403);
    assert.strictEqual(res.body.error.code, 'FORBIDDEN');
  });

  // 5. Resource Ownership Check: Student A accessing Student B profile returns 403
  await test('Student A accessing Student B resource returns 403 FORBIDDEN (Ownership Enforcement)', async () => {
    const studentAToken = signAccessToken({
      id: 'student_user_AAA',
      email: 'userA@student.com',
      role: 'STUDENT',
      tokenVersion: 0,
    });

    const res = await simulateRequest(app, {
      method: 'GET',
      url: '/api/auth/users/student_user_BBB/profile',
      headers: { authorization: `Bearer ${studentAToken}` },
    });

    assert.strictEqual(res.status, 403);
    assert.strictEqual(res.body.error.code, 'FORBIDDEN');
  });

  // 6. Resource Ownership Check: Admin accessing Student B profile succeeds
  await test('Admin role accessing Student B resource bypasses ownership check (Admin Override)', async () => {
    const adminToken = signAccessToken({
      id: 'admin_master',
      email: 'admin@skillority.com',
      role: 'ADMIN',
      tokenVersion: 0,
    });

    const res = await simulateRequest(app, {
      method: 'GET',
      url: '/api/auth/users/student_user_BBB/profile',
      headers: { authorization: `Bearer ${adminToken}` },
    });

    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.success, true);
  });

  // 7. Input validation failure returns 400 with details
  await test('Invalid signup body returns 400 VALIDATION_ERROR with field details', async () => {
    const res = await simulateRequest(app, {
      method: 'POST',
      url: '/api/auth/signup/student',
      body: { email: 'bad-email', password: '123' },
    });
    assert.strictEqual(res.status, 400);
    assert.strictEqual(res.body.error.code, 'VALIDATION_ERROR');
    assert(Array.isArray(res.body.error.details));
    assert(res.body.error.details.length >= 2);
  });

  console.log(`\nDIRECT API & SECURITY TEST SUMMARY: ${passed} Passed, ${failed} Failed`);
  if (failed > 0) {
    process.exit(1);
  }
}

runDirectApiSecurityTests().catch((err) => {
  console.error('Test execution error:', err);
  process.exit(1);
});
