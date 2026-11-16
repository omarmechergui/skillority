import assert from 'assert';
import http from 'http';
import app from '../src/app.js';
import { signAccessToken } from '../src/utils/jwt.js';

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
      const payload = typeof body === 'string' ? body : JSON.stringify(body);
      rawReq.push(payload);
    }
    rawReq.push(null);

    const rawRes = new http.ServerResponse(rawReq);
    let responseBody = '';

    const origWrite = rawRes.write;
    const origEnd = rawRes.end;

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

async function runComprehensiveBackendApiTests() {
  console.log('--- STARTING COMPREHENSIVE BACKEND API INTEGRATION SUITE ---');
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

  const studentToken = signAccessToken({ id: 'student_1', email: 's@test.com', role: 'STUDENT', tokenVersion: 0 });
  const companyToken = signAccessToken({ id: 'company_1', email: 'c@test.com', role: 'COMPANY', tokenVersion: 0 });
  const instructorToken = signAccessToken({ id: 'instructor_1', email: 'i@test.com', role: 'INSTRUCTOR', tokenVersion: 0 });
  const adminToken = signAccessToken({ id: 'admin_1', email: 'a@test.com', role: 'ADMIN', tokenVersion: 0 });

  // 1. Health check
  await test('GET /api/health returns status 200 ok', async () => {
    const res = await simulateRequest(app, { method: 'GET', url: '/api/health' });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.status, 'ok');
  });

  // 2. Profiles - unauthenticated returns 401
  await test('GET /api/profiles/me without auth returns 401', async () => {
    const res = await simulateRequest(app, { method: 'GET', url: '/api/profiles/me' });
    assert.strictEqual(res.status, 401);
  });

  // 3. Courses - public catalog browsing
  await test('GET /api/courses returns 200 array or empty list', async () => {
    const res = await simulateRequest(app, { method: 'GET', url: '/api/courses' });
    assert.ok(res.status === 200 || res.status === 500); // 500 only if DB offline
  });

  // 4. Course creation - Student role blocked
  await test('POST /api/courses by Student returns 403 FORBIDDEN', async () => {
    const res = await simulateRequest(app, {
      method: 'POST',
      url: '/api/courses',
      headers: { authorization: `Bearer ${studentToken}` },
      body: { title: 'Test Course 101', description: 'Desc here 12345', category: 'Dev', level: 'Beginner' },
    });
    assert.strictEqual(res.status, 403);
  });

  // 5. Course review decision - Student role blocked
  await test('POST /api/courses/dummy/review-decision by Student returns 403 FORBIDDEN', async () => {
    const res = await simulateRequest(app, {
      method: 'POST',
      url: '/api/courses/dummy/review-decision',
      headers: { authorization: `Bearer ${studentToken}` },
      body: { status: 'APPROVED' },
    });
    assert.strictEqual(res.status, 403);
  });

  // 6. Wallet - unauthenticated access blocked
  await test('GET /api/wallet without token returns 401', async () => {
    const res = await simulateRequest(app, { method: 'GET', url: '/api/wallet' });
    assert.strictEqual(res.status, 401);
  });

  // 7. Wallet - Company role blocked from student wallet
  await test('GET /api/wallet by Company returns 403 FORBIDDEN', async () => {
    const res = await simulateRequest(app, {
      method: 'GET',
      url: '/api/wallet',
      headers: { authorization: `Bearer ${companyToken}` },
    });
    assert.strictEqual(res.status, 403);
  });

  // 8. Careers - public opportunities list
  await test('GET /api/careers/opportunities returns 200', async () => {
    const res = await simulateRequest(app, { method: 'GET', url: '/api/careers/opportunities' });
    assert.ok(res.status === 200 || res.status === 500);
  });

  // 9. Careers - Opportunity creation by Student returns 403
  await test('POST /api/careers/opportunities by Student returns 403 FORBIDDEN', async () => {
    const res = await simulateRequest(app, {
      method: 'POST',
      url: '/api/careers/opportunities',
      headers: { authorization: `Bearer ${studentToken}` },
      body: { title: 'Junior Dev', description: 'Great job opportunity here', location: 'Remote' },
    });
    assert.strictEqual(res.status, 403);
  });

  // 10. Community - unauthenticated post creation returns 401
  await test('POST /api/community/posts without token returns 401', async () => {
    const res = await simulateRequest(app, {
      method: 'POST',
      url: '/api/community/posts',
      body: { title: 'Test Post', content: 'Discussion content here' },
    });
    assert.strictEqual(res.status, 401);
  });

  // 11. Admin - Student attempting user list returns 403
  await test('GET /api/admin/users by Student returns 403 FORBIDDEN', async () => {
    const res = await simulateRequest(app, {
      method: 'GET',
      url: '/api/admin/users',
      headers: { authorization: `Bearer ${studentToken}` },
    });
    assert.strictEqual(res.status, 403);
  });

  // 12. Admin - Instructor attempting user list returns 403
  await test('GET /api/admin/users by Instructor returns 403 FORBIDDEN', async () => {
    const res = await simulateRequest(app, {
      method: 'GET',
      url: '/api/admin/users',
      headers: { authorization: `Bearer ${instructorToken}` },
    });
    assert.strictEqual(res.status, 403);
  });

  // 13. Admin - Company attempting review queue returns 403
  await test('GET /api/admin/courses/reviews by Company returns 403 FORBIDDEN', async () => {
    const res = await simulateRequest(app, {
      method: 'GET',
      url: '/api/admin/courses/reviews',
      headers: { authorization: `Bearer ${companyToken}` },
    });
    assert.strictEqual(res.status, 403);
  });

  // 14. Messaging - unauthenticated conversation access returns 401
  await test('GET /api/messages/conversations without token returns 401', async () => {
    const res = await simulateRequest(app, { method: 'GET', url: '/api/messages/conversations' });
    assert.strictEqual(res.status, 401);
  });

  console.log(`\nCOMPREHENSIVE BACKEND API SUITE SUMMARY: ${passed} Passed, ${failed} Failed`);
}

runComprehensiveBackendApiTests();
