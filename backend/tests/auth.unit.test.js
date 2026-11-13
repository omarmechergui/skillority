import assert from 'assert';
import {
  hashPassword,
  comparePassword,
  generateCryptoToken,
  hashCryptoToken,
} from '../src/utils/security.js';
import {
  signAccessToken,
  signRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
} from '../src/utils/jwt.js';
import {
  registerStudentSchema,
  registerCompanySchema,
  loginSchema,
  resetPasswordSchema,
  inviteInstructorSchema,
} from '../src/validators/auth.validators.js';

async function runUnitTests() {
  console.log('--- STARTING PHASE 2 AUTHENTICATION UNIT TESTS ---');
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

  // 1. Password Hashing & Verification
  await asyncTest('Password hashing produces bcrypt hash and verifies correctly', async () => {
    const password = 'StrongPassword123';
    const hash = await hashPassword(password);
    assert(hash && hash.startsWith('$2'), 'Hash should be a bcrypt string');
    const valid = await comparePassword(password, hash);
    assert.strictEqual(valid, true, 'Original password must match hash');
    const invalid = await comparePassword('WrongPassword123', hash);
    assert.strictEqual(invalid, false, 'Incorrect password must not match');
  });

  // 2. Token Generation & Hashing
  test('Crypto token generator generates non-empty hex string and consistent SHA-256 hash', () => {
    const raw = generateCryptoToken(32);
    assert.strictEqual(raw.length, 64, '32 bytes hex should be 64 characters');
    const hash1 = hashCryptoToken(raw);
    const hash2 = hashCryptoToken(raw);
    assert.strictEqual(hash1, hash2, 'Hash must be deterministic');
    assert.notStrictEqual(raw, hash1, 'Raw token and hash must not be equal');
  });

  // 3. JWT Access Token signing and verification
  test('JWT Access Token signs payload and verifies claims correctly', () => {
    const payload = { id: 'user_123', email: 'test@student.com', role: 'STUDENT', tokenVersion: 0 };
    const token = signAccessToken(payload);
    const result = verifyAccessToken(token);
    assert.strictEqual(result.valid, true);
    assert.strictEqual(result.payload.id, 'user_123');
    assert.strictEqual(result.payload.role, 'STUDENT');
    assert.strictEqual(result.payload.tokenVersion, 0);
  });

  // 4. JWT Refresh Token signing and verification
  test('JWT Refresh Token signs and verifies correctly', () => {
    const payload = { id: 'user_123', tokenVersion: 1 };
    const token = signRefreshToken(payload);
    const result = verifyRefreshToken(token);
    assert.strictEqual(result.valid, true);
    assert.strictEqual(result.payload.id, 'user_123');
    assert.strictEqual(result.payload.tokenVersion, 1);
  });

  // 5. Invalid JWT Token rejection
  test('Invalid JWT tokens are rejected cleanly', () => {
    const badToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.badpayload.signature';
    const result = verifyAccessToken(badToken);
    assert.strictEqual(result.valid, false);
    assert(result.error !== undefined);
  });

  // 6. Validation Schema: Student Registration
  test('Student Registration schema accepts valid payload and rejects weak passwords', () => {
    const validData = {
      email: 'student@example.com',
      password: 'SecurePassword1',
      firstName: 'Alice',
      lastName: 'Smith',
    };
    const validResult = registerStudentSchema.safeParse(validData);
    assert.strictEqual(validResult.success, true);

    const weakPassword = { ...validData, password: 'weak' };
    const invalidResult = registerStudentSchema.safeParse(weakPassword);
    assert.strictEqual(invalidResult.success, false);
  });

  // 7. Validation Schema: Company Registration
  test('Company Registration schema requires companyName and valid email', () => {
    const validData = {
      email: 'recruiter@techcorp.com',
      password: 'SecurePassword1',
      firstName: 'Bob',
      lastName: 'Jones',
      companyName: 'TechCorp',
    };
    const validResult = registerCompanySchema.safeParse(validData);
    assert.strictEqual(validResult.success, true);

    const missingCompany = { ...validData, companyName: '' };
    const invalidResult = registerCompanySchema.safeParse(missingCompany);
    assert.strictEqual(invalidResult.success, false);
  });

  // 8. Validation Schema: Instructor Invitation
  test('Instructor Invitation schema enforces valid email', () => {
    const validResult = inviteInstructorSchema.safeParse({ email: 'prof@university.edu' });
    assert.strictEqual(validResult.success, true);

    const invalidResult = inviteInstructorSchema.safeParse({ email: 'not-an-email' });
    assert.strictEqual(invalidResult.success, false);
  });

  console.log(`\nUNIT TEST SUMMARY: ${passed} Passed, ${failed} Failed`);
  if (failed > 0) {
    process.exit(1);
  }
}

runUnitTests().catch((err) => {
  console.error('Test execution error:', err);
  process.exit(1);
});
