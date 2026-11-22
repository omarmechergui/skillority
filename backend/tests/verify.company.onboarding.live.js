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

async function runLiveCompanyDatabaseVerification() {
  console.log('=== STARTING LIVE MONGODB & BACKEND COMPANY ONBOARDING VERIFICATION ===');
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

  const testEmail = `test.company.${Date.now()}@skillority.test`;
  const testPassword = 'Password123!';
  let testUserId = null;
  let accessToken = null;

  try {
    // 1. Signup new company
    await asyncTest('1. Real registration creates company user in MongoDB Atlas', async () => {
      const res = await makeRequest(server, {
        method: 'POST',
        path: '/api/auth/signup/company',
        body: {
          email: testEmail,
          password: testPassword,
          firstName: 'Enterprise',
          lastName: 'Recruiter',
          companyName: 'Genesis Corp',
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
      assert.strictEqual(dbUser.role, 'COMPANY');
      assert.ok(dbUser.profile, 'Profile must exist in MongoDB');
      assert.strictEqual(dbUser.profile.companyName, 'Genesis Corp');
      assert.strictEqual(dbUser.profile.industry, null, 'Industry should initially be null');
      assert.strictEqual(dbUser.profile.companySize, null, 'Company size should initially be null');
    });

    // 2. Submit company onboarding data through live endpoint
    await asyncTest('2. Complete company onboarding via POST /api/auth/onboarding/company', async () => {
      const onboardingPayload = {
        companyName: 'Genesis Technologies Inc.',
        industry: 'Technology',
        companySize: '51-200',
        website: 'https://genesis-tech.test',
        companyDescription: 'Building next-generation distributed enterprise platforms',
        bio: 'Premier technology partner for skilled engineering graduates',
      };

      const res = await makeRequest(server, {
        method: 'POST',
        path: '/api/auth/onboarding/company',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: onboardingPayload,
      });

      assert.strictEqual(res.status, 200, `Expected 200 OK, got: ${JSON.stringify(res.body)}`);
      assert.strictEqual(res.body.success, true);
      assert.strictEqual(res.body.message, 'Company onboarding completed successfully');
      assert.ok(res.body.data.profile);
      assert.strictEqual(res.body.data.profile.companyName, 'Genesis Technologies Inc.');
      assert.strictEqual(res.body.data.profile.industry, 'Technology');
      assert.strictEqual(res.body.data.profile.companySize, '51-200');
    });

    // 3. Direct MongoDB Query: Validate persistence of all company fields
    await asyncTest('3. Verify submitted company fields persist accurately in MongoDB Atlas', async () => {
      const dbProfile = await prisma.profile.findUnique({
        where: { userId: testUserId },
      });

      assert.ok(dbProfile, 'Profile must be queryable in database');
      assert.strictEqual(dbProfile.companyName, 'Genesis Technologies Inc.');
      assert.strictEqual(dbProfile.industry, 'Technology');
      assert.strictEqual(dbProfile.companySize, '51-200');
      assert.strictEqual(dbProfile.website, 'https://genesis-tech.test');
      assert.strictEqual(dbProfile.companyDescription, 'Building next-generation distributed enterprise platforms');
      assert.strictEqual(dbProfile.bio, 'Premier technology partner for skilled engineering graduates');
    });

    // 4. Session refresh verification: /api/auth/me returns updated company profile
    await asyncTest('4. Authenticated /api/auth/me returns updated company onboarding profile', async () => {
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
      assert.strictEqual(user.profile.companyName, 'Genesis Technologies Inc.');
      assert.strictEqual(user.profile.industry, 'Technology');
      assert.strictEqual(user.profile.companySize, '51-200');

      // Verify company onboarding completion logic against returned user
      const isComplete = Boolean(user.profile.companyName && user.profile.industry && user.profile.companySize);
      assert.strictEqual(isComplete, true, 'Frontend isOnboardingComplete must evaluate to true');
    });

    // 5. Logout & Login flow: persistence across sessions
    await asyncTest('5. Re-authentication (/api/auth/login) returns complete company profile and routes to dashboard', async () => {
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
      assert.strictEqual(loginUser.profile.companyName, 'Genesis Technologies Inc.');
      assert.strictEqual(loginUser.profile.industry, 'Technology');
      assert.strictEqual(loginUser.profile.companySize, '51-200');

      // Verify destination is /company/dashboard
      const destination = (loginUser.profile.companyName && loginUser.profile.industry && loginUser.profile.companySize)
        ? '/company/dashboard'
        : '/onboarding/company';
      assert.strictEqual(destination, '/company/dashboard');
    });

  } finally {
    // Clean up dedicated test user from database
    if (testUserId) {
      console.log(`Cleaning up test company user ${testUserId} (${testEmail}) from MongoDB...`);
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

  console.log(`\n=== LIVE COMPANY DATABASE VERIFICATION SUMMARY: ${passed} Passed, ${failed} Failed ===`);
  if (failed > 0) {
    process.exit(1);
  }
}

runLiveCompanyDatabaseVerification().catch((err) => {
  console.error('Fatal live verification error:', err);
  process.exit(1);
});
