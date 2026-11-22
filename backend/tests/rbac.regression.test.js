import assert from 'assert';
import http from 'http';
import app from '../src/app.js';
import { requireRole } from '../src/middleware/auth.middleware.js';
import { signAccessToken } from '../src/utils/jwt.js';

// Set offline placeholder so requireAuth uses token claims directly without remote network calls
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

function runMiddleware(middleware, req) {
  return new Promise((resolve) => {
    let statusCode = 200;
    let jsonBody = null;
    let nextCalled = false;

    const res = {
      status(code) {
        statusCode = code;
        return this;
      },
      json(body) {
        jsonBody = body;
        resolve({ nextCalled: false, status: statusCode, body: jsonBody });
      },
    };

    middleware(req, res, () => {
      nextCalled = true;
      resolve({ nextCalled: true, status: 200, body: null });
    });
  });
}

async function runRbacRegressionTests() {
  console.log('=== STARTING RBAC SECURITY & REGRESSION VERIFICATION SUITE ===');
  let passed = 0;
  let failed = 0;

  async function test(name, fn) {
    try {
      await fn();
      console.log(`[PASS] ${name}`);
      passed++;
    } catch (err) {
      console.error(`[FAIL] ${name}: ${err.message}`);
      failed++;
    }
  }

  // Tokens for each distinct platform role
  const studentToken = signAccessToken({ id: 'u_student_1', email: 's@test.com', role: 'STUDENT', tokenVersion: 0 });
  const companyToken = signAccessToken({ id: 'u_company_1', email: 'c@test.com', role: 'COMPANY', tokenVersion: 0 });
  const instructorToken = signAccessToken({ id: 'u_instructor_1', email: 'i@test.com', role: 'INSTRUCTOR', tokenVersion: 0 });
  const adminToken = signAccessToken({ id: 'u_admin_1', email: 'a@test.com', role: 'ADMIN', tokenVersion: 0 });
  const invalidRoleToken = signAccessToken({ id: 'u_hacker_1', email: 'h@test.com', role: 'ANONYMOUS', tokenVersion: 0 });

  // =========================================================================
  // 1. DIRECT MIDDLEWARE UNIT CHECKS (Contract Verification for all syntax)
  // =========================================================================

  await test('1. requireRole("STUDENT") grants STUDENT and rejects COMPANY/ADMIN', async () => {
    const guard = requireRole('STUDENT');
    const allowRes = await runMiddleware(guard, { user: { role: 'STUDENT' } });
    assert.strictEqual(allowRes.nextCalled, true);

    const denyCompany = await runMiddleware(guard, { user: { role: 'COMPANY' } });
    assert.strictEqual(denyCompany.nextCalled, false);
    assert.strictEqual(denyCompany.status, 403);
    assert.strictEqual(denyCompany.body.error.code, 'FORBIDDEN');

    const denyAdmin = await runMiddleware(guard, { user: { role: 'ADMIN' } });
    assert.strictEqual(denyAdmin.nextCalled, false);
    assert.strictEqual(denyAdmin.status, 403);
  });

  await test('2. requireRole("COMPANY") grants COMPANY and rejects STUDENT/ADMIN', async () => {
    const guard = requireRole('COMPANY');
    const allowRes = await runMiddleware(guard, { user: { role: 'COMPANY' } });
    assert.strictEqual(allowRes.nextCalled, true);

    const denyStudent = await runMiddleware(guard, { user: { role: 'STUDENT' } });
    assert.strictEqual(denyStudent.nextCalled, false);
    assert.strictEqual(denyStudent.status, 403);

    const denyAdmin = await runMiddleware(guard, { user: { role: 'ADMIN' } });
    assert.strictEqual(denyAdmin.nextCalled, false);
    assert.strictEqual(denyAdmin.status, 403);
  });

  await test('3. requireRole("ADMIN") grants ADMIN and rejects STUDENT/COMPANY/INSTRUCTOR', async () => {
    const guard = requireRole('ADMIN');
    const allowRes = await runMiddleware(guard, { user: { role: 'ADMIN' } });
    assert.strictEqual(allowRes.nextCalled, true);

    const denyStudent = await runMiddleware(guard, { user: { role: 'STUDENT' } });
    assert.strictEqual(denyStudent.status, 403);

    const denyCompany = await runMiddleware(guard, { user: { role: 'COMPANY' } });
    assert.strictEqual(denyCompany.status, 403);

    const denyInstructor = await runMiddleware(guard, { user: { role: 'INSTRUCTOR' } });
    assert.strictEqual(denyInstructor.status, 403);
  });

  await test('4. requireRole(["STUDENT"]) (array parameter) grants STUDENT and rejects unauthorized', async () => {
    const guard = requireRole(['STUDENT']);
    const allowRes = await runMiddleware(guard, { user: { role: 'STUDENT' } });
    assert.strictEqual(allowRes.nextCalled, true);

    const denyRes = await runMiddleware(guard, { user: { role: 'COMPANY' } });
    assert.strictEqual(denyRes.nextCalled, false);
    assert.strictEqual(denyRes.status, 403);
  });

  await test('5. Multi-role syntax: requireRole("INSTRUCTOR", "ADMIN") and requireRole(["INSTRUCTOR", "ADMIN"])', async () => {
    const guardArgs = requireRole('INSTRUCTOR', 'ADMIN');
    assert.strictEqual((await runMiddleware(guardArgs, { user: { role: 'INSTRUCTOR' } })).nextCalled, true);
    assert.strictEqual((await runMiddleware(guardArgs, { user: { role: 'ADMIN' } })).nextCalled, true);
    assert.strictEqual((await runMiddleware(guardArgs, { user: { role: 'STUDENT' } })).status, 403);
    assert.strictEqual((await runMiddleware(guardArgs, { user: { role: 'COMPANY' } })).status, 403);

    const guardArray = requireRole(['INSTRUCTOR', 'ADMIN']);
    assert.strictEqual((await runMiddleware(guardArray, { user: { role: 'INSTRUCTOR' } })).nextCalled, true);
    assert.strictEqual((await runMiddleware(guardArray, { user: { role: 'ADMIN' } })).nextCalled, true);
    assert.strictEqual((await runMiddleware(guardArray, { user: { role: 'STUDENT' } })).status, 403);
  });

  await test('6. Missing authentication (req.user undefined) returns 401 UNAUTHORIZED', async () => {
    const guard = requireRole('STUDENT');
    const res = await runMiddleware(guard, {});
    assert.strictEqual(res.nextCalled, false);
    assert.strictEqual(res.status, 401);
    assert.strictEqual(res.body.error.code, 'UNAUTHORIZED');
  });

  await test('7. Invalid role value returns 403 FORBIDDEN', async () => {
    const guard = requireRole('STUDENT');
    const res = await runMiddleware(guard, { user: { role: 'INVALID_ROLE' } });
    assert.strictEqual(res.nextCalled, false);
    assert.strictEqual(res.status, 403);
  });

  // =========================================================================
  // 2. END-TO-END HTTP ROUTE AUTHORIZATION CHECKS (Express Pipeline)
  // =========================================================================

  await test('8. Student Onboarding endpoint: Unauthenticated access returns 401 UNAUTHORIZED', async () => {
    const res = await simulateRequest(app, {
      method: 'POST',
      url: '/api/auth/onboarding/student',
      body: { university: 'Harvard' },
    });
    assert.strictEqual(res.status, 401);
    assert.strictEqual(res.body.error.code, 'UNAUTHORIZED');
  });

  await test('9. Student Onboarding endpoint: Malformed token returns 401 INVALID_TOKEN', async () => {
    const res = await simulateRequest(app, {
      method: 'POST',
      url: '/api/auth/onboarding/student',
      headers: { authorization: 'Bearer bogus.token.value' },
      body: { university: 'Harvard' },
    });
    assert.strictEqual(res.status, 401);
    assert.strictEqual(res.body.error.code, 'INVALID_TOKEN');
  });

  await test('10. Student Onboarding endpoint: Company role receives 403 FORBIDDEN', async () => {
    const res = await simulateRequest(app, {
      method: 'POST',
      url: '/api/auth/onboarding/student',
      headers: { authorization: `Bearer ${companyToken}` },
      body: { university: 'Harvard', major: 'CS' },
    });
    assert.strictEqual(res.status, 403);
    assert.strictEqual(res.body.error.code, 'FORBIDDEN');
  });

  await test('11. Student Onboarding endpoint: Admin role receives 403 FORBIDDEN', async () => {
    const res = await simulateRequest(app, {
      method: 'POST',
      url: '/api/auth/onboarding/student',
      headers: { authorization: `Bearer ${adminToken}` },
      body: { university: 'Harvard', major: 'CS' },
    });
    assert.strictEqual(res.status, 403);
    assert.strictEqual(res.body.error.code, 'FORBIDDEN');
  });

  await test('12. Company Onboarding endpoint: Student role receives 403 FORBIDDEN', async () => {
    const res = await simulateRequest(app, {
      method: 'POST',
      url: '/api/auth/onboarding/company',
      headers: { authorization: `Bearer ${studentToken}` },
      body: { companyName: 'Acme Corp' },
    });
    assert.strictEqual(res.status, 403);
    assert.strictEqual(res.body.error.code, 'FORBIDDEN');
  });

  await test('13. Admin Invite endpoint: Student role receives 403 FORBIDDEN', async () => {
    const res = await simulateRequest(app, {
      method: 'POST',
      url: '/api/auth/admin/instructors/invite',
      headers: { authorization: `Bearer ${studentToken}` },
      body: { email: 'prof@school.edu' },
    });
    assert.strictEqual(res.status, 403);
    assert.strictEqual(res.body.error.code, 'FORBIDDEN');
  });

  await test('14. Admin Revoke endpoint: Student role receives 403 FORBIDDEN', async () => {
    const res = await simulateRequest(app, {
      method: 'PUT',
      url: '/api/auth/admin/instructors/inst_123/revoke',
      headers: { authorization: `Bearer ${studentToken}` },
    });
    assert.strictEqual(res.status, 403);
    assert.strictEqual(res.body.error.code, 'FORBIDDEN');
  });

  await test('15. Admin Invite endpoint: Company role receives 403 FORBIDDEN', async () => {
    const res = await simulateRequest(app, {
      method: 'POST',
      url: '/api/auth/admin/instructors/invite',
      headers: { authorization: `Bearer ${companyToken}` },
      body: { email: 'prof@school.edu' },
    });
    assert.strictEqual(res.status, 403);
    assert.strictEqual(res.body.error.code, 'FORBIDDEN');
  });

  await test('16. Invalid/Spoofed Role token: rejected with 403 FORBIDDEN', async () => {
    const res = await simulateRequest(app, {
      method: 'POST',
      url: '/api/auth/onboarding/student',
      headers: { authorization: `Bearer ${invalidRoleToken}` },
      body: { university: 'Harvard', major: 'CS' },
    });
    assert.strictEqual(res.status, 403);
    assert.strictEqual(res.body.error.code, 'FORBIDDEN');
  });

  await test('17. Student Onboarding endpoint: Student role passes RBAC (proceeds to validator)', async () => {
    // Send invalid body so validator catches it at next step (confirming RBAC passed!)
    const res = await simulateRequest(app, {
      method: 'POST',
      url: '/api/auth/onboarding/student',
      headers: { authorization: `Bearer ${studentToken}` },
      body: { graduationYear: 'not-a-number' },
    });
    // Status is 400 VALIDATION_ERROR (not 401 or 403!) confirming student cleared requireRole('STUDENT')
    assert.strictEqual(res.status, 400);
    assert.strictEqual(res.body.error.code, 'VALIDATION_ERROR');
  });

  await test('18. Instructor Onboarding endpoint: Unauthenticated request receives 401 UNAUTHORIZED', async () => {
    const res = await simulateRequest(app, {
      method: 'POST',
      url: '/api/auth/onboarding/instructor',
      body: { headline: 'Architect', expertise: ['React'] },
    });
    assert.strictEqual(res.status, 401);
    assert.strictEqual(res.body.error.code, 'UNAUTHORIZED');
  });

  await test('19. Instructor Onboarding endpoint: Student role receives 403 FORBIDDEN', async () => {
    const res = await simulateRequest(app, {
      method: 'POST',
      url: '/api/auth/onboarding/instructor',
      headers: { authorization: `Bearer ${studentToken}` },
      body: { headline: 'Architect', expertise: ['React'] },
    });
    assert.strictEqual(res.status, 403);
    assert.strictEqual(res.body.error.code, 'FORBIDDEN');
  });

  await test('20. Instructor Onboarding endpoint: Company role receives 403 FORBIDDEN', async () => {
    const res = await simulateRequest(app, {
      method: 'POST',
      url: '/api/auth/onboarding/instructor',
      headers: { authorization: `Bearer ${companyToken}` },
      body: { headline: 'Architect', expertise: ['React'] },
    });
    assert.strictEqual(res.status, 403);
    assert.strictEqual(res.body.error.code, 'FORBIDDEN');
  });

  await test('21. Instructor Onboarding endpoint: Instructor role passes RBAC (proceeds to validator)', async () => {
    // Send empty body so validator catches it at next step (confirming RBAC passed!)
    const res = await simulateRequest(app, {
      method: 'POST',
      url: '/api/auth/onboarding/instructor',
      headers: { authorization: `Bearer ${instructorToken}` },
      body: {},
    });
    assert.strictEqual(res.status, 400);
    assert.strictEqual(res.body.error.code, 'VALIDATION_ERROR');
  });

  console.log(`\n=== RBAC REGRESSION TEST SUMMARY: ${passed} Passed, ${failed} Failed ===`);
  if (failed > 0) {
    process.exit(1);
  }
}

runRbacRegressionTests().catch((err) => {
  console.error('Fatal RBAC test error:', err);
  process.exit(1);
});
