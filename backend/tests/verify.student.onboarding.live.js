import 'dotenv/config';
import assert from 'assert';
import http from 'http';
import app from '../src/app.js';
import prisma from '../src/config/database.js';

function makeRequest(server, { method, path, headers = {}, body = null }) {
  return new Promise((resolve, reject) => {
    const address = server.address();
    const payload = body ? JSON.stringify(body) : null;
    const reqHeaders = {
      'Content-Type': 'application/json',
      ...headers,
    };
    if (payload) {
      reqHeaders['Content-Length'] = Buffer.byteLength(payload);
    }

    const req = http.request(
      {
        hostname: '127.0.0.1',
        port: address.port,
        path,
        method,
        headers: reqHeaders,
      },
      (res) => {
        let responseData = '';
        res.on('data', (chunk) => {
          responseData += chunk;
        });
        res.on('end', () => {
          let parsedBody;
          try {
            parsedBody = JSON.parse(responseData);
          } catch {
            parsedBody = responseData;
          }
          resolve({
            status: res.statusCode,
            headers: res.headers,
            body: parsedBody,
          });
        });
      }
    );

    req.on('error', reject);

    if (payload) {
      req.write(payload);
    }
    req.end();
  });
}

async function runLiveDatabaseVerification() {
  console.log('=== STARTING LIVE MONGODB & BACKEND ONBOARDING VERIFICATION ===');
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

  // Start real HTTP server on random free port
  const server = http.createServer(app);
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  const port = server.address().port;
  console.log(`Live verification test server listening on 127.0.0.1:${port}`);

  const testEmail = `test.student.${Date.now()}@skillority.test`;
  const testPassword = 'Password123!';
  let testUserId = null;
  let accessToken = null;

  try {
    // 1. Signup new student
    await asyncTest('1. Real registration creates student in MongoDB Atlas', async () => {
      const res = await makeRequest(server, {
        method: 'POST',
        path: '/api/auth/signup/student',
        body: {
          email: testEmail,
          password: testPassword,
          firstName: 'Verification',
          lastName: 'Candidate',
        },
      });

      assert.strictEqual(res.status, 201);
      assert.strictEqual(res.body.success, true);
      assert.ok(res.body.data.accessToken);
      assert.ok(res.body.data.user.id);

      testUserId = res.body.data.user.id;
      accessToken = res.body.data.accessToken;

      // Verify directly in MongoDB via Prisma
      const dbUser = await prisma.user.findUnique({
        where: { id: testUserId },
        include: { profile: true },
      });

      assert.ok(dbUser, 'User must exist in MongoDB');
      assert.strictEqual(dbUser.email, testEmail);
      assert.strictEqual(dbUser.role, 'STUDENT');
      assert.ok(dbUser.profile, 'Profile must exist in MongoDB');
      assert.strictEqual(dbUser.profile.firstName, 'Verification');
      assert.strictEqual(dbUser.profile.lastName, 'Candidate');
      assert.strictEqual(dbUser.profile.university, null, 'University should initially be null');
      assert.strictEqual(dbUser.profile.major, null, 'Major should initially be null');
    });

    // 2. Submit onboarding data through live endpoint
    await asyncTest('2. Complete student onboarding via POST /api/auth/onboarding/student', async () => {
      const onboardingPayload = {
        university: 'Stanford University',
        major: 'Computer Science',
        graduationYear: 2026,
        skills: ['React', 'Node.js', 'MongoDB', 'TypeScript'],
        learningGoals: 'Master distributed cloud architectures and ML systems',
        bio: 'Passionate student engineer eager to contribute to high-impact products',
      };

      const res = await makeRequest(server, {
        method: 'POST',
        path: '/api/auth/onboarding/student',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: onboardingPayload,
      });

      assert.strictEqual(res.status, 200, `Expected 200 OK, got: ${JSON.stringify(res.body)}`);
      assert.strictEqual(res.body.success, true);
      assert.strictEqual(res.body.message, 'Student onboarding completed successfully');
      assert.ok(res.body.data.profile);
      assert.strictEqual(res.body.data.profile.university, 'Stanford University');
      assert.strictEqual(res.body.data.profile.major, 'Computer Science');
      assert.strictEqual(res.body.data.profile.graduationYear, 2026);
    });

    // 3. Direct MongoDB Query: Validate persistence of all fields
    await asyncTest('3. Verify submitted onboarding fields persist accurately in MongoDB Atlas', async () => {
      const dbProfile = await prisma.profile.findUnique({
        where: { userId: testUserId },
      });

      assert.ok(dbProfile, 'Profile must be queryable in database');
      assert.strictEqual(dbProfile.university, 'Stanford University');
      assert.strictEqual(dbProfile.major, 'Computer Science');
      assert.strictEqual(dbProfile.graduationYear, 2026);
      assert.deepStrictEqual(dbProfile.skills, ['React', 'Node.js', 'MongoDB', 'TypeScript']);
      assert.strictEqual(dbProfile.learningGoals, 'Master distributed cloud architectures and ML systems');
      assert.strictEqual(dbProfile.bio, 'Passionate student engineer eager to contribute to high-impact products');
    });

    // 4. Session refresh verification: /api/auth/me returns updated profile
    await asyncTest('4. Authenticated /api/auth/me returns updated onboarding profile', async () => {
      const res = await makeRequest(server, {
        method: 'GET',
        path: '/api/auth/me',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      assert.strictEqual(res.status, 200);
      assert.strictEqual(res.body.success, true);
      const user = res.body.data.user;
      assert.ok(user);
      assert.ok(user.profile);
      assert.strictEqual(user.profile.university, 'Stanford University');
      assert.strictEqual(user.profile.major, 'Computer Science');
      assert.strictEqual(user.profile.graduationYear, 2026);

      // Verify frontend onboarding completion logic against returned user
      const isComplete = Boolean(user.profile.university && user.profile.major);
      assert.strictEqual(isComplete, true, 'Frontend isOnboardingComplete must evaluate to true');
    });

    // 5. Logout & Login flow: persistence across sessions
    await asyncTest('5. Re-authentication (/api/auth/login) returns complete profile and routes to dashboard', async () => {
      const loginRes = await makeRequest(server, {
        method: 'POST',
        path: '/api/auth/login',
        body: {
          email: testEmail,
          password: testPassword,
        },
      });

      assert.strictEqual(loginRes.status, 200);
      assert.strictEqual(loginRes.body.success, true);
      const loginUser = loginRes.body.data.user;
      assert.ok(loginUser.profile);
      assert.strictEqual(loginUser.profile.university, 'Stanford University');
      assert.strictEqual(loginUser.profile.major, 'Computer Science');

      // Verify destination is /student/dashboard
      const destination = (loginUser.profile.university && loginUser.profile.major)
        ? '/student/dashboard'
        : '/onboarding/student';
      assert.strictEqual(destination, '/student/dashboard');
    });

  } finally {
    // Clean up dedicated test user from database
    if (testUserId) {
      console.log(`Cleaning up test user ${testUserId} (${testEmail}) from MongoDB...`);
      try {
        await prisma.profile.deleteMany({ where: { userId: testUserId } });
        await prisma.wallet.deleteMany({ where: { userId: testUserId } });
        await prisma.refreshToken.deleteMany({ where: { userId: testUserId } });
        await prisma.user.delete({ where: { id: testUserId } });
        console.log('Cleanup completed successfully.');
      } catch (cleanupErr) {
        console.error('Cleanup warning:', cleanupErr.message);
      }
    }

    server.close();
    await prisma.$disconnect();
  }

  console.log(`\n=== LIVE DATABASE VERIFICATION SUMMARY: ${passed} Passed, ${failed} Failed ===`);
  if (failed > 0) {
    process.exit(1);
  }
}

runLiveDatabaseVerification().catch((err) => {
  console.error('Fatal live verification error:', err);
  process.exit(1);
});
