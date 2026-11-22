import 'dotenv/config';
import assert from 'assert';
import http from 'http';
import app from '../src/app.js';
import prisma from '../src/config/database.js';
import { hashPassword } from '../src/utils/security.js';

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

async function runLiveInstructorDatabaseVerification() {
  console.log('=== STARTING LIVE MONGODB & BACKEND INSTRUCTOR ONBOARDING VERIFICATION ===');
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

  const testEmail = `test.instructor.${Date.now()}@skillority.test`;
  const testPassword = 'Password123!';
  let testUserId = null;
  let accessToken = null;

  try {
    // 1. Create initial instructor user directly in MongoDB
    await asyncTest('1. Create verified instructor account in MongoDB Atlas', async () => {
      const passwordHash = await hashPassword(testPassword);
      const initialUser = await prisma.user.create({
        data: {
          email: testEmail,
          passwordHash,
          role: 'INSTRUCTOR',
          isVerified: true,
          profile: {
            create: {
              firstName: 'Sarah',
              lastName: 'Jenkins',
            },
          },
        },
        include: { profile: true },
      });

      assert.ok(initialUser);
      assert.strictEqual(initialUser.email, testEmail);
      assert.strictEqual(initialUser.role, 'INSTRUCTOR');
      assert.strictEqual(initialUser.profile.firstName, 'Sarah');
      assert.strictEqual(initialUser.profile.experience, null, 'Experience should initially be null');
      assert.deepStrictEqual(initialUser.profile.expertise, [], 'Expertise should initially be empty');

      testUserId = initialUser.id;
    });

    // 2. Authenticate to obtain live signed JWT access token
    await asyncTest('2. Authenticate instructor via /api/auth/login and verify incomplete state', async () => {
      const res = await makeRequest(server, {
        method: 'POST',
        path: '/api/auth/login',
        body: {
          email: testEmail,
          password: testPassword,
        },
      });

      assert.strictEqual(res.status, 200);
      assert.strictEqual(res.body.success, true);
      assert.ok(res.body.data.accessToken);
      accessToken = res.body.data.accessToken;

      const user = res.body.data.user;
      assert.strictEqual(user.id, testUserId);
      assert.strictEqual(user.role, 'INSTRUCTOR');

      // Verify completion rule is false before onboarding
      const isComplete = Boolean(
        Array.isArray(user.profile?.expertise) &&
          user.profile.expertise.length > 0 &&
          user.profile?.experience &&
          user.profile.experience.trim().length > 0
      );
      assert.strictEqual(isComplete, false, 'Instructor onboarding must be incomplete initially');
    });

    // 3. Submit instructor onboarding data through real POST /api/auth/onboarding/instructor
    await asyncTest('3. Complete instructor onboarding via POST /api/auth/onboarding/instructor', async () => {
      const onboardingPayload = {
        name: 'Dr. Sarah Jenkins',
        headline: 'Principal Systems Architect & Fellow',
        expertise: ['Distributed Systems', 'Cloud Architecture', 'Next.js'],
        bio: '15+ years experience building large scale internet services.',
        courseIdea: 'Building Enterprise Micro-Frontends with React 19',
      };

      const res = await makeRequest(server, {
        method: 'POST',
        path: '/api/auth/onboarding/instructor',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: onboardingPayload,
      });

      assert.strictEqual(res.status, 200, `Expected 200 OK, got: ${JSON.stringify(res.body)}`);
      assert.strictEqual(res.body.success, true);
      assert.strictEqual(res.body.message, 'Instructor onboarding completed successfully');
      assert.ok(res.body.data.profile);

      const prof = res.body.data.profile;
      assert.strictEqual(prof.firstName, 'Sarah', 'Title "Dr." must not be stored as firstName');
      assert.strictEqual(prof.lastName, 'Jenkins');
      assert.strictEqual(prof.experience, 'Principal Systems Architect & Fellow');
      assert.deepStrictEqual(prof.expertise, ['Distributed Systems', 'Cloud Architecture', 'Next.js']);
      assert.strictEqual(prof.bio, '15+ years experience building large scale internet services.');
    });

    // 4. Direct MongoDB Query: Validate persistence in MongoDB Atlas
    await asyncTest('4. Verify submitted instructor fields persist accurately in MongoDB Atlas', async () => {
      const dbProfile = await prisma.profile.findUnique({
        where: { userId: testUserId },
      });

      assert.ok(dbProfile, 'Profile must exist in database');
      assert.strictEqual(dbProfile.firstName, 'Sarah', 'MongoDB firstName must not be "Dr."');
      assert.strictEqual(dbProfile.lastName, 'Jenkins');
      assert.strictEqual(dbProfile.experience, 'Principal Systems Architect & Fellow');
      assert.deepStrictEqual(dbProfile.expertise, ['Distributed Systems', 'Cloud Architecture', 'Next.js']);
      assert.strictEqual(dbProfile.bio, '15+ years experience building large scale internet services.');
    });

    // 4b. Name Parsing & Title Handling Matrix in live API
    await asyncTest('4b. Live API correctly handles multi-word names and preserves existing names without title corruption', async () => {
      // Test A: Sarah Maria Jenkins
      const res1 = await makeRequest(server, {
        method: 'POST',
        path: '/api/auth/onboarding/instructor',
        headers: { Authorization: `Bearer ${accessToken}` },
        body: {
          name: 'Sarah Maria Jenkins',
          headline: 'Systems Architect',
          expertise: ['Cloud'],
        },
      });
      assert.strictEqual(res1.status, 200);
      assert.strictEqual(res1.body.data.profile.firstName, 'Sarah');
      assert.strictEqual(res1.body.data.profile.lastName, 'Maria Jenkins');

      // Test B: Single name "Sarah" preserves existing lastName
      const res2 = await makeRequest(server, {
        method: 'POST',
        path: '/api/auth/onboarding/instructor',
        headers: { Authorization: `Bearer ${accessToken}` },
        body: {
          name: 'Sarah',
          headline: 'Systems Architect',
          expertise: ['Cloud'],
        },
      });
      assert.strictEqual(res2.status, 200);
      assert.strictEqual(res2.body.data.profile.firstName, 'Sarah');
      assert.strictEqual(res2.body.data.profile.lastName, 'Maria Jenkins');

      // Test C: Title only "Dr." does not corrupt or wipe names
      const res3 = await makeRequest(server, {
        method: 'POST',
        path: '/api/auth/onboarding/instructor',
        headers: { Authorization: `Bearer ${accessToken}` },
        body: {
          name: 'Dr.',
          headline: 'Systems Architect',
          expertise: ['Cloud'],
        },
      });
      assert.strictEqual(res3.status, 200);
      assert.strictEqual(res3.body.data.profile.firstName, 'Sarah');
      assert.strictEqual(res3.body.data.profile.lastName, 'Maria Jenkins');

      // Test D: Bio exceeding 500 characters is rejected by validator
      const res4 = await makeRequest(server, {
        method: 'POST',
        path: '/api/auth/onboarding/instructor',
        headers: { Authorization: `Bearer ${accessToken}` },
        body: {
          name: 'Sarah Jenkins',
          headline: 'Systems Architect',
          expertise: ['Cloud'],
          bio: 'a'.repeat(501),
        },
      });
      assert.strictEqual(res4.status, 400);
      assert.strictEqual(res4.body.error.code, 'VALIDATION_ERROR');
    });

    // 5. Session refresh verification: /api/auth/me returns updated instructor profile
    await asyncTest('5. Authenticated /api/auth/me returns updated instructor onboarding profile', async () => {
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
      assert.strictEqual(user.profile.firstName, 'Sarah');
      assert.strictEqual(user.profile.lastName, 'Maria Jenkins');
      assert.strictEqual(user.profile.experience, 'Systems Architect');
      assert.deepStrictEqual(user.profile.expertise, ['Cloud']);

      // Verify onboarding completion logic against returned user
      const isComplete = Boolean(
        Array.isArray(user.profile?.expertise) &&
          user.profile.expertise.length > 0 &&
          user.profile?.experience &&
          user.profile.experience.trim().length > 0
      );
      assert.strictEqual(isComplete, true, 'Frontend isOnboardingComplete must evaluate to true');
    });

    // 6. Re-authentication flow: persistence across login sessions
    await asyncTest('6. Re-authentication (/api/auth/login) returns complete instructor profile and routes to dashboard', async () => {
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
      assert.strictEqual(loginUser.profile.firstName, 'Sarah');
      assert.strictEqual(loginUser.profile.lastName, 'Maria Jenkins');
      assert.strictEqual(loginUser.profile.experience, 'Systems Architect');
      assert.deepStrictEqual(loginUser.profile.expertise, ['Cloud']);

      const destination =
        Array.isArray(loginUser.profile?.expertise) &&
        loginUser.profile.expertise.length > 0 &&
        loginUser.profile?.experience &&
        loginUser.profile.experience.trim().length > 0
          ? '/instructor/dashboard'
          : '/onboarding/instructor';
      assert.strictEqual(destination, '/instructor/dashboard');
    });
  } finally {
    // Clean up dedicated test user from database
    if (testUserId) {
      console.log(`Cleaning up test instructor user ${testUserId} (${testEmail}) from MongoDB...`);
      try {
        await prisma.profile.deleteMany({ where: { userId: testUserId } });
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

  console.log(`\n=== LIVE INSTRUCTOR DATABASE VERIFICATION SUMMARY: ${passed} Passed, ${failed} Failed ===`);
  if (failed > 0) {
    process.exit(1);
  }
}

runLiveInstructorDatabaseVerification().catch((err) => {
  console.error('Fatal live verification error:', err);
  process.exit(1);
});
