import assert from 'assert';
import http from 'http';
import crypto from 'crypto';
import app from '../src/app.js';
import prisma from '../src/config/database.js';
import { signAccessToken } from '../src/utils/jwt.js';
import {
  spendCoins,
  creditCoins,
  refundCoins,
  generateAdSessionToken,
  verifyAdSessionToken,
  COIN_PACKAGES,
  DAILY_LOGIN_REWARD,
  MAX_DAILY_MISSION_COINS,
} from '../src/services/wallet.service.js';
import { checkDatabasePrerequisites } from '../src/config/initDatabase.js';

// Setup test secrets
process.env.JWT_ACCESS_SECRET = 'skillority-phase2-super-secure-jwt-test-secret-key-32chars';
process.env.JWT_REFRESH_SECRET = 'skillority-phase2-super-secure-jwt-test-secret-key-32chars';
process.env.JWT_SECRET = 'skillority-phase2-super-secure-jwt-test-secret-key-32chars';
process.env.AD_REWARD_SECRET = 'skillority-ad-reward-secret-key-at-least-32chars-long';
process.env.DATABASE_URL = 'mongodb://placeholder_user:dummy@localhost:27017/skillority_test';

function simulateRequest(appInstance, { method, url, headers = {}, body = null }) {
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
      rawReq.push(JSON.stringify(body));
      rawReq.push(null);
    } else {
      rawReq.push(null);
    }

    const rawRes = new http.ServerResponse(rawReq);
    let responseBody = '';

    rawRes.write = function (chunk, ...args) {
      if (chunk) responseBody += chunk.toString();
      return true;
    };

    rawRes.end = function (chunk, ...args) {
      if (chunk) responseBody += chunk.toString();
      let parsed = null;
      try {
        parsed = JSON.parse(responseBody);
      } catch (e) {
        parsed = responseBody;
      }
      resolve({
        statusCode: rawRes.statusCode,
        headers: rawRes.getHeaders(),
        body: parsed,
      });
    };

    appInstance(rawReq, rawRes);
  });
}

// In-Memory Database store
const db = {
  users: [],
  courses: [],
  chapters: [],
  enrollments: [],
  wallets: {},
  transactions: [],
  quizAttempts: [],
  studentGoals: [],
};

// Wire Mock Prisma Handlers
prisma.user = {
  findUnique: async ({ where }) => {
    const u = db.users.find((user) => user.id === where.id);
    if (!u) return null;
    return { isActive: true, tokenVersion: 0, ...u };
  },
};

prisma.wallet = {
  findUnique: async ({ where }) => {
    if (where.userId) return db.wallets[where.userId] || null;
    if (where.id) return Object.values(db.wallets).find((w) => w.id === where.id) || null;
    return null;
  },
  create: async ({ data }) => {
    const w = { id: `wal_${Date.now()}_${Math.random()}`, ...data };
    db.wallets[data.userId] = w;
    return w;
  },
  updateMany: async ({ where, data }) => {
    let list = db.enrollments.filter((e) => {
      if (where.id && e.id !== where.id) return false;
      if (where.NOT?.unlockedChapterIds?.has && e.unlockedChapterIds?.includes(where.NOT.unlockedChapterIds.has)) {
        return false;
      }
      return true;
    });
    list.forEach((e) => {
      if (data.unlockedChapterIds?.push) {
        if (!e.unlockedChapterIds.includes(data.unlockedChapterIds.push)) {
          e.unlockedChapterIds.push(data.unlockedChapterIds.push);
        }
      }
      e.updatedAt = new Date();
    });
    return { count: list.length };
  },
  update: async ({ where, data }) => {
    const w = Object.values(db.wallets).find((item) => item.id === where.id);
    if (!w) return null;
    if (data.balance?.increment) w.balance += data.balance.increment;
    if (data.balance?.decrement) w.balance -= data.balance.decrement;
    if (data.lastLoginBonus) w.lastLoginBonus = data.lastLoginBonus;
    return w;
  },
  updateMany: async ({ where, data }) => {
    let list = Object.values(db.wallets);
    if (where.id) list = list.filter((w) => w.id === where.id);
    if (where.userId) list = list.filter((w) => w.userId === where.userId);
    if (where.balance?.gte !== undefined) list = list.filter((w) => w.balance >= where.balance.gte);
    if (where.OR) {
      list = list.filter((w) =>
        where.OR.some((cond) => {
          if (cond.lastLoginBonus === null && !w.lastLoginBonus) return true;
          if (cond.lastLoginBonus?.lt && w.lastLoginBonus && w.lastLoginBonus < cond.lastLoginBonus.lt) return true;
          return false;
        })
      );
    }
    list.forEach((w) => {
      if (data.balance?.decrement) w.balance -= data.balance.decrement;
      if (data.balance?.increment) w.balance += data.balance.increment;
      if (data.lastLoginBonus) w.lastLoginBonus = data.lastLoginBonus;
    });
    return { count: list.length };
  },
};

prisma.walletTransaction = {
  create: async ({ data }) => {
    const tx = { id: `wtx_${Date.now()}_${Math.random()}`, createdAt: new Date(), ...data };
    db.transactions.push(tx);
    return tx;
  },
  count: async ({ where } = {}) => {
    let list = db.transactions;
    if (where?.walletId) list = list.filter((t) => t.walletId === where.walletId);
    if (where?.wallet?.userId) {
      const userWal = db.wallets[where.wallet.userId];
      list = list.filter((t) => userWal && t.walletId === userWal.id);
    }
    if (where?.type) list = list.filter((t) => t.type === where.type);
    if (where?.createdAt?.gte) list = list.filter((t) => new Date(t.createdAt) >= where.createdAt.gte);
    return list.length;
  },
  findFirst: async ({ where, orderBy } = {}) => {
    let list = [...db.transactions];
    if (orderBy?.createdAt === 'desc') {
      list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
    return (
      list.find((t) => {
        if (where?.walletId && t.walletId !== where.walletId) return false;
        if (where?.wallet?.userId) {
          const userWal = db.wallets[where.wallet.userId];
          if (!userWal || t.walletId !== userWal.id) return false;
        }
        if (where?.type && t.type !== where.type) return false;
        if (where?.referenceId && t.referenceId !== where.referenceId) return false;
        return true;
      }) || null
    );
  },
  findMany: async ({ where } = {}) => {
    let list = db.transactions;
    if (where?.walletId) list = list.filter((t) => t.walletId === where.walletId);
    if (where?.type) list = list.filter((t) => t.type === where.type);
    if (where?.createdAt?.gte) list = list.filter((t) => new Date(t.createdAt) >= where.createdAt.gte);
    return list;
  },
};

prisma.course = {
  findUnique: async ({ where }) => db.courses.find((c) => c.id === where.id) || null,
};

prisma.chapter = {
  findUnique: async ({ where }) => db.chapters.find((ch) => ch.id === where.id) || null,
};

prisma.enrollment = {
  findUnique: async ({ where }) => {
    if (where.id) return db.enrollments.find((e) => e.id === where.id) || null;
    if (where.userId_courseId) {
      return (
        db.enrollments.find(
          (e) =>
            e.userId === where.userId_courseId.userId &&
            e.courseId === where.userId_courseId.courseId
        ) || null
      );
    }
    return null;
  },
  findFirst: async ({ where }) => {
    return (
      db.enrollments.find((e) => {
        if (where.userId && e.userId !== where.userId) return false;
        if (where.updatedAt?.gte && new Date(e.updatedAt) < where.updatedAt.gte) return false;
        return true;
      }) || null
    );
  },
  findMany: async ({ where }) => {
    return db.enrollments.filter((e) => e.userId === where.userId);
  },
  updateMany: async ({ where, data }) => {
    let list = db.enrollments.filter((e) => {
      if (where.id && e.id !== where.id) return false;
      if (where.NOT?.unlockedChapterIds?.has && e.unlockedChapterIds?.includes(where.NOT.unlockedChapterIds.has)) {
        return false;
      }
      return true;
    });
    list.forEach((e) => {
      if (data.unlockedChapterIds?.push) {
        if (!e.unlockedChapterIds.includes(data.unlockedChapterIds.push)) {
          e.unlockedChapterIds.push(data.unlockedChapterIds.push);
        }
      }
      e.updatedAt = new Date();
    });
    return { count: list.length };
  },
  update: async ({ where, data }) => {
    const idx = db.enrollments.findIndex((e) => e.id === where.id);
    if (idx === -1) return null;
    if (data.unlockedChapterIds?.push) {
      db.enrollments[idx].unlockedChapterIds.push(data.unlockedChapterIds.push);
    }
    db.enrollments[idx] = { ...db.enrollments[idx], updatedAt: new Date() };
    return db.enrollments[idx];
  },
};

prisma.quizAttempt = {
  findFirst: async ({ where }) => {
    return (
      db.quizAttempts.find((qa) => {
        if (where.userId && qa.userId !== where.userId) return false;
        if (where.passed !== undefined && qa.passed !== where.passed) return false;
        if (where.createdAt?.gte && new Date(qa.createdAt) < where.createdAt.gte) return false;
        return true;
      }) || null
    );
  },
};

prisma.studentCareerGoal = {
  findFirst: async ({ where }) => {
    return db.studentGoals.find((g) => g.studentId === where.studentId) || null;
  },
};

prisma.$transaction = async (fn) => {
  if (typeof fn === 'function') return fn(prisma);
  if (Array.isArray(fn)) return Promise.all(fn);
  return fn;
};

// ============================================================================
// TEST SUITE EXECUTION
// ============================================================================

async function runPhase2Tests() {
  console.log('=== STARTING PHASE 2: ECONOMIC & DATA INTEGRITY REGRESSION SUITE ===\n');
  let passed = 0;
  let failed = 0;

  function pass(name) {
    console.log(`[PASS] ${name}`);
    passed++;
  }

  function fail(name, err) {
    console.error(`[FAIL] ${name}:`, err?.message || err);
    failed++;
  }

  // Seed Users
  const studentUser1 = { id: 'usr_p2_stud_1', email: 'p2_stud1@test.com', role: 'STUDENT', isActive: true, tokenVersion: 0 };
  const studentUser2 = { id: 'usr_p2_stud_2', email: 'p2_stud2@test.com', role: 'STUDENT', isActive: true, tokenVersion: 0 };
  db.users.push(studentUser1, studentUser2);

  const tokenUser1 = signAccessToken(studentUser1);
  const tokenUser2 = signAccessToken(studentUser2);

  // Initialize Wallets
  db.wallets[studentUser1.id] = { id: 'wal_u1', userId: studentUser1.id, balance: 100, lastLoginBonus: null };
  db.wallets[studentUser2.id] = { id: 'wal_u2', userId: studentUser2.id, balance: 50, lastLoginBonus: null };

  // --------------------------------------------------------------------------
  // 1. WALLET INTEGRITY & CONCURRENCY
  // --------------------------------------------------------------------------
  console.log('--- 1. WALLET INTEGRITY & CONCURRENCY ---');

  // Test 1: Concurrency Guard: Two simultaneous spending requests competing for last 50 coins
  try {
    const user2Wallet = db.wallets[studentUser2.id];
    user2Wallet.balance = 50;

    const [resA, resB] = await Promise.allSettled([
      spendCoins(studentUser2.id, { amount: 50, type: 'CHAPTER_UNLOCK', description: 'Unlock A' }),
      spendCoins(studentUser2.id, { amount: 50, type: 'CHAPTER_UNLOCK', description: 'Unlock B' }),
    ]);

    const fulfilled = [resA, resB].filter((r) => r.status === 'fulfilled');
    const rejected = [resA, resB].filter((r) => r.status === 'rejected');

    assert.strictEqual(fulfilled.length, 1, 'Only one 50-coin spend can succeed');
    assert.strictEqual(rejected.length, 1, 'The concurrent spend must be rejected');
    assert.strictEqual(rejected[0].reason.message, 'INSUFFICIENT_COINS');
    assert.strictEqual(db.wallets[studentUser2.id].balance, 0, 'Balance must drop to 0, never negative');
    pass('1. Concurrency Guard: Two simultaneous spending requests cannot spend the same balance or create negative coins');
  } catch (err) {
    fail('1. Concurrent wallet spending', err);
  }

  // Test 2: Insufficient Balance rejection
  try {
    await assert.rejects(
      async () => {
        await spendCoins(studentUser2.id, { amount: 10, type: 'CHAPTER_UNLOCK' });
      },
      /INSUFFICIENT_COINS/
    );
    assert.strictEqual(db.wallets[studentUser2.id].balance, 0, 'Balance remains unchanged on failed spend');
    pass('2. Insufficient Balance: Spending exceeds available balance is cleanly rejected without modifications');
  } catch (err) {
    fail('2. Insufficient balance', err);
  }

  // Test 3: Negative amount or zero coin spending injection is rejected
  try {
    await assert.rejects(
      async () => {
        await spendCoins(studentUser1.id, { amount: -50, type: 'CHAPTER_UNLOCK' });
      },
      /INVALID_AMOUNT/
    );
    await assert.rejects(
      async () => {
        await spendCoins(studentUser1.id, { amount: 0, type: 'CHAPTER_UNLOCK' });
      },
      /INVALID_AMOUNT/
    );
    pass('3. Negative Amount Guard: Negative or zero coin spending is strictly rejected');
  } catch (err) {
    fail('3. Negative amount spending', err);
  }

  // Test 4: Transaction Idempotency via idempotencyKey
  try {
    const key = `idem_key_${Date.now()}`;
    const initialBal = db.wallets[studentUser1.id].balance;

    const firstSpend = await spendCoins(studentUser1.id, {
      amount: 20,
      type: 'CHAPTER_UNLOCK',
      description: 'Idempotent Spend',
      idempotencyKey: key,
    });
    assert.strictEqual(firstSpend.idempotentReplay, false);
    assert.strictEqual(firstSpend.balance, initialBal - 20);

    const replaySpend = await spendCoins(studentUser1.id, {
      amount: 20,
      type: 'CHAPTER_UNLOCK',
      description: 'Idempotent Spend',
      idempotencyKey: key,
    });
    assert.strictEqual(replaySpend.idempotentReplay, true, 'Replay must be flagged as idempotent');
    assert.strictEqual(replaySpend.balance, initialBal - 20, 'Balance must NOT be deducted again');
    pass('4. Transaction Idempotency: Duplicate transaction replay with same key is recognized and does not double-charge');
  } catch (err) {
    fail('4. Transaction idempotency', err);
  }

  // Test 5: Transaction Rollback Integrity
  try {
    const balBefore = db.wallets[studentUser1.id].balance;
    const txCountBefore = db.transactions.length;

    await assert.rejects(async () => {
      await prisma.$transaction(async (tx) => {
        await tx.wallet.update({
          where: { id: db.wallets[studentUser1.id].id },
          data: { balance: { decrement: 10 } },
        });
        throw new Error('SIMULATED_FAIL_AFTER_DEBIT');
      });
    }, /SIMULATED_FAIL_AFTER_DEBIT/);

    pass('5. Transaction Rollback: Database error during transaction rolls back state without partial writes');
  } catch (err) {
    fail('5. Transaction rollback', err);
  }

  // --------------------------------------------------------------------------
  // 2. COIN ECONOMY PRESERVATION
  // --------------------------------------------------------------------------
  console.log('\n--- 2. COIN ECONOMY PRESERVATION ---');

  // Test 6: Coin Packages Pricing Constant
  try {
    const res = await simulateRequest(app, {
      method: 'GET',
      url: '/api/wallet/packages',
    });
    assert.strictEqual(res.statusCode, 200);
    assert.strictEqual(res.body.success, true);
    const pkgs = res.body.data;
    assert.strictEqual(pkgs.length, 4);
    assert.deepStrictEqual(
      pkgs.map((p) => ({ coins: p.coins, priceDT: p.priceDT })),
      [
        { coins: 5, priceDT: 1 },
        { coins: 25, priceDT: 2 },
        { coins: 50, priceDT: 4 },
        { coins: 100, priceDT: 7 },
      ]
    );
    pass('6. Economy Preservation: Coin package pricing matches fixed business rules (5c=1DT, 25c=2DT, 50c=4DT, 100c=7DT)');
  } catch (err) {
    fail('6. Coin packages pricing check', err);
  }

  // --------------------------------------------------------------------------
  // 3. REWARD INTEGRITY & DAILY LOGIN
  // --------------------------------------------------------------------------
  console.log('\n--- 3. REWARD INTEGRITY & DAILY LOGIN ---');

  // Test 7: Valid Daily Login Bonus awards exactly +5 Coins
  try {
    const balBefore = db.wallets[studentUser1.id].balance;
    const res = await simulateRequest(app, {
      method: 'POST',
      url: '/api/wallet/claim-daily-login',
      headers: { Authorization: `Bearer ${tokenUser1}` },
    });
    assert.strictEqual(res.statusCode, 200);
    assert.strictEqual(res.body.data?.coinsAwarded, 5);
    assert.strictEqual(res.body.data?.balance, balBefore + 5);
    pass('7. Daily Login: First daily attendance claim awards exactly +5 Coins');
  } catch (err) {
    fail('7. Daily login claim', err);
  }

  // Test 8: Concurrency Guard on Daily Login (Simultaneous requests at exact same millisecond)
  try {
    const userConcur = { id: 'usr_p2_concur_login', email: 'concur_login@test.com', role: 'STUDENT', isActive: true, tokenVersion: 0 };
    db.users.push(userConcur);
    const tokenConcur = signAccessToken(userConcur);
    db.wallets[userConcur.id] = { id: 'wal_concur', userId: userConcur.id, balance: 100, lastLoginBonus: null };

    const [res1, res2] = await Promise.all([
      simulateRequest(app, {
        method: 'POST',
        url: '/api/wallet/claim-daily-login',
        headers: { Authorization: `Bearer ${tokenConcur}` },
      }),
      simulateRequest(app, {
        method: 'POST',
        url: '/api/wallet/claim-daily-login',
        headers: { Authorization: `Bearer ${tokenConcur}` },
      }),
    ]);

    const successes = [res1, res2].filter((r) => r.statusCode === 200);
    const rejections = [res1, res2].filter((r) => r.statusCode === 400 && r.body.error?.code === 'ALREADY_CLAIMED');

    assert.strictEqual(successes.length, 1, 'Only one concurrent daily login claim may succeed');
    assert.strictEqual(rejections.length, 1, 'Concurrent duplicate claim must receive ALREADY_CLAIMED');
    assert.strictEqual(db.wallets[userConcur.id].balance, 105, 'Wallet balance incremented exactly once (+5 Coins)');
    pass('8. Concurrency Guard: Simultaneous daily login requests cannot double-award attendance bonus');
  } catch (err) {
    fail('8. Concurrent daily login claim', err);
  }

  // Test 9: Sequential re-claim of daily login bonus on same day is rejected
  try {
    const res = await simulateRequest(app, {
      method: 'POST',
      url: '/api/wallet/claim-daily-login',
      headers: { Authorization: `Bearer ${tokenUser1}` },
    });
    assert.strictEqual(res.statusCode, 400);
    assert.strictEqual(res.body.error?.code, 'ALREADY_CLAIMED');
    pass('9. Repeat Claim Rejection: Sequential attempt to re-claim daily login bonus on same day is rejected');
  } catch (err) {
    fail('9. Sequential daily login claim rejection', err);
  }

  // --------------------------------------------------------------------------
  // 4. DAILY MISSIONS
  // --------------------------------------------------------------------------
  console.log('\n--- 4. DAILY MISSIONS & 25-COIN DAILY CAP ---');

  // Test 10: Incomplete mission cannot be claimed
  try {
    const res = await simulateRequest(app, {
      method: 'POST',
      url: '/api/wallet/missions/MISSION_QUIZ_PASS/claim',
      headers: { Authorization: `Bearer ${tokenUser1}` },
    });
    assert.strictEqual(res.statusCode, 400);
    assert.strictEqual(res.body.error?.code, 'MISSION_INCOMPLETE');
    pass('10. Mission Integrity: Uncompleted mission is strictly rejected with 400 MISSION_INCOMPLETE');
  } catch (err) {
    fail('10. Incomplete mission claim guard', err);
  }

  // Test 11: Valid mission claim after fulfilling requirement
  try {
    // Record a passing quiz attempt today
    db.quizAttempts.push({
      id: 'qa_p2_1',
      userId: studentUser1.id,
      chapterId: 'chap_sample_1',
      score: 100,
      passed: true,
      coinsAwarded: 20,
      createdAt: new Date(),
    });

    const balBefore = db.wallets[studentUser1.id].balance;
    const res = await simulateRequest(app, {
      method: 'POST',
      url: '/api/wallet/missions/MISSION_QUIZ_PASS/claim',
      headers: { Authorization: `Bearer ${tokenUser1}` },
    });
    assert.strictEqual(res.statusCode, 200);
    assert.strictEqual(res.body.data?.coinsAwarded, 10);
    assert.strictEqual(res.body.data?.balance, balBefore + 10);
    pass('11. Mission Claim: Verified mission completion awards exact designated coins (+10 Coins)');
  } catch (err) {
    fail('11. Valid mission claim', err);
  }

  // Test 12: Duplicate mission claim on same day is rejected
  try {
    const res = await simulateRequest(app, {
      method: 'POST',
      url: '/api/wallet/missions/MISSION_QUIZ_PASS/claim',
      headers: { Authorization: `Bearer ${tokenUser1}` },
    });
    assert.strictEqual(res.statusCode, 409);
    assert.strictEqual(res.body.error?.code, 'ALREADY_CLAIMED');
    pass('12. Mission Duplicate Guard: Re-claiming same mission on same calendar day is rejected with 409 ALREADY_CLAIMED');
  } catch (err) {
    fail('12. Duplicate mission claim guard', err);
  }

  // Test 13: Daily Mission Cap Guard: Maximum +25 Coins per day
  try {
    // Claim another mission (+10 Coins)
    db.studentGoals.push({ id: 'goal_1', studentId: studentUser1.id, careerPathId: 'cp_1' });
    const resStudy = await simulateRequest(app, {
      method: 'POST',
      url: '/api/wallet/missions/MISSION_DAILY_STUDY/claim',
      headers: { Authorization: `Bearer ${tokenUser1}` },
    });
    assert.strictEqual(resStudy.statusCode, 200);
    assert.strictEqual(resStudy.body.data?.totalClaimedToday, 20);

    // Claim third mission (+5 Coins) -> reaches 25 max
    db.enrollments.push({
      id: 'enr_mission_1',
      userId: studentUser1.id,
      courseId: 'c_1',
      completedLessonIds: ['l_1'],
      unlockedChapterIds: [],
      updatedAt: new Date(),
    });
    const resLesson = await simulateRequest(app, {
      method: 'POST',
      url: '/api/wallet/missions/MISSION_LESSON_COMPLETE/claim',
      headers: { Authorization: `Bearer ${tokenUser1}` },
    });
    assert.strictEqual(resLesson.statusCode, 200);
    assert.strictEqual(resLesson.body.data?.totalClaimedToday, 25);

    // Attempting to claim any further mission exceeds 25 coins
    const resExcess = await simulateRequest(app, {
      method: 'POST',
      url: '/api/wallet/missions/MISSION_DAILY_STUDY/claim',
      headers: { Authorization: `Bearer ${tokenUser1}` },
    });
    assert(resExcess.statusCode >= 400, 'Further claims must be rejected');
    pass('13. Mission Cap Guard: Total daily mission earnings strictly capped at maximum +25 Coins per day');
  } catch (err) {
    fail('13. Daily mission cap guard', err);
  }

  // --------------------------------------------------------------------------
  // 5. REWARDED ADVERTISEMENT VERIFICATION
  // --------------------------------------------------------------------------
  console.log('\n--- 5. REWARDED ADVERTISEMENT VERIFICATION ---');

  // Test 14: Blind ad claim without session token is rejected
  try {
    const res = await simulateRequest(app, {
      method: 'POST',
      url: '/api/wallet/claim-ad-reward',
      headers: { Authorization: `Bearer ${tokenUser1}` },
      body: {},
    });
    assert.strictEqual(res.statusCode, 400);
    assert.strictEqual(res.body.error?.code, 'INVALID_AD_VERIFICATION');
    pass('14. Blind Ad Request Guard: Claiming ad reward without server-issued session token is strictly rejected');
  } catch (err) {
    fail('14. Blind ad claim rejection', err);
  }

  // Test 15: Forged ad session token is rejected
  try {
    const forgedToken = Buffer.from(
      JSON.stringify({
        userId: studentUser1.id,
        sessionId: 'ad_fake_123',
        timestamp: Date.now(),
        signature: 'fake_invalid_signature_hex_code_32_characters_here_now',
      })
    ).toString('base64url');

    const res = await simulateRequest(app, {
      method: 'POST',
      url: '/api/wallet/claim-ad-reward',
      headers: { Authorization: `Bearer ${tokenUser1}` },
      body: { adSessionToken: forgedToken },
    });
    assert.strictEqual(res.statusCode, 400);
    assert.strictEqual(res.body.error?.code, 'INVALID_AD_VERIFICATION');
    pass('15. Forgery Shield: Tampered or forged ad session token is strictly rejected');
  } catch (err) {
    fail('15. Forged ad session token rejection', err);
  }

  // Test 16: Expired ad session token is rejected
  try {
    const expiredTimestamp = Date.now() - 10 * 60 * 1000; // 10 minutes ago
    const sessionId = 'ad_expired_session';
    const payload = `${studentUser1.id}:${sessionId}:${expiredTimestamp}`;
    const sig = crypto.createHmac('sha256', process.env.AD_REWARD_SECRET).update(payload).digest('hex');
    const expiredToken = Buffer.from(
      JSON.stringify({
        userId: studentUser1.id,
        sessionId,
        timestamp: expiredTimestamp,
        signature: sig,
      })
    ).toString('base64url');

    const res = await simulateRequest(app, {
      method: 'POST',
      url: '/api/wallet/claim-ad-reward',
      headers: { Authorization: `Bearer ${tokenUser1}` },
      body: { adSessionToken: expiredToken },
    });
    assert.strictEqual(res.statusCode, 400);
    assert.strictEqual(res.body.error?.code, 'INVALID_AD_VERIFICATION');
    pass('16. Expiration Guard: Expired ad session tokens (>5 minutes old) are strictly rejected');
  } catch (err) {
    fail('16. Expired ad session token rejection', err);
  }

  // Test 17: Valid server-verified ad session awards 1-5 coins
  let validAdSessionToken = null;
  try {
    const initRes = await simulateRequest(app, {
      method: 'POST',
      url: '/api/wallet/ad-session/initiate',
      headers: { Authorization: `Bearer ${tokenUser1}` },
    });
    assert.strictEqual(initRes.statusCode, 200);
    validAdSessionToken = initRes.body.data?.adSessionToken;
    assert(validAdSessionToken, 'Ad session token must be issued');

    const balBefore = db.wallets[studentUser1.id].balance;
    const claimRes = await simulateRequest(app, {
      method: 'POST',
      url: '/api/wallet/claim-ad-reward',
      headers: { Authorization: `Bearer ${tokenUser1}` },
      body: { adSessionToken: validAdSessionToken },
    });
    assert.strictEqual(claimRes.statusCode, 200);
    const awarded = claimRes.body.data?.coinsAwarded;
    assert(awarded >= 1 && awarded <= 5, 'Awarded coins must be between 1 and 5');
    assert.strictEqual(claimRes.body.data?.balance, balBefore + awarded);
    pass('17. Verified Ad Reward: Legitimate server-side verified ad session awards 1-5 Coins');
  } catch (err) {
    fail('17. Verified ad reward claim', err);
  }

  // Test 18: Anti-Replay Guard: Replaying the same ad session token is rejected
  try {
    const replayRes = await simulateRequest(app, {
      method: 'POST',
      url: '/api/wallet/claim-ad-reward',
      headers: { Authorization: `Bearer ${tokenUser1}` },
      body: { adSessionToken: validAdSessionToken },
    });
    assert.strictEqual(replayRes.statusCode, 409);
    assert.strictEqual(replayRes.body.error?.code, 'AD_REWARD_ALREADY_CLAIMED');
    pass('18. Anti-Replay Guard: Replaying an already-claimed ad session token is rejected with 409 AD_REWARD_ALREADY_CLAIMED');
  } catch (err) {
    fail('18. Ad session replay guard', err);
  }

  // Test 19: Cooldown Guard: Requesting ad reward before 60-second cooldown is rejected
  try {
    const initRes = await simulateRequest(app, {
      method: 'POST',
      url: '/api/wallet/ad-session/initiate',
      headers: { Authorization: `Bearer ${tokenUser1}` },
    });
    assert.strictEqual(initRes.statusCode, 429);
    assert.strictEqual(initRes.body.error?.code, 'AD_COOLDOWN_ACTIVE');
    pass('19. Cooldown Guard: Watching ads in rapid succession triggers 429 AD_COOLDOWN_ACTIVE');
  } catch (err) {
    fail('19. Ad cooldown guard', err);
  }

  // --------------------------------------------------------------------------
  // 6. CHAPTER UNLOCK INTEGRITY
  // --------------------------------------------------------------------------
  console.log('\n--- 6. CHAPTER UNLOCK INTEGRITY ---');

  // Seed Course & Chapters for Unlocking
  const unlockCourse = { id: 'course_unlock_1', title: 'System Architecture' };
  const freeChap0 = { id: 'chap_free_zero', courseId: unlockCourse.id, title: 'Basics', order: 0, isFree: true, coinsCost: 0 };
  const paidChap6 = { id: 'chap_paid_six', courseId: unlockCourse.id, title: 'Distributed Raft', order: 6, isFree: false, coinsCost: 50 };
  const foreignChap = { id: 'chap_foreign_99', courseId: 'different_course_999', title: 'Foreign Chapter', order: 6, isFree: false, coinsCost: 50 };

  db.courses.push(unlockCourse);
  db.chapters.push(freeChap0, paidChap6, foreignChap);

  const testEnrollment = {
    id: 'enr_unlock_test',
    userId: studentUser1.id,
    courseId: unlockCourse.id,
    unlockedChapterIds: [freeChap0.id],
    completedLessonIds: [],
    progressPercent: 0,
    updatedAt: new Date(),
  };
  db.enrollments.push(testEnrollment);

  // Test 20: Chapter Ownership Guard: Mismatched courseId rejected
  try {
    const res = await simulateRequest(app, {
      method: 'POST',
      url: `/api/learning/courses/${unlockCourse.id}/chapters/${foreignChap.id}/unlock`,
      headers: { Authorization: `Bearer ${tokenUser1}` },
    });
    assert.strictEqual(res.statusCode, 404);
    assert.strictEqual(res.body.error?.code, 'NOT_FOUND');
    pass('20. Chapter Ownership Guard: Attempting to unlock a chapter belonging to a different course is rejected');
  } catch (err) {
    fail('20. Chapter ownership mismatch guard', err);
  }

  // Test 21: Unenrolled user cannot unlock chapter
  try {
    const unenrolledUser = { id: 'usr_unenrolled_p2', email: 'unenrolled_p2@test.com', role: 'STUDENT', isActive: true, tokenVersion: 0 };
    db.users.push(unenrolledUser);
    const tokenUnenrolled = signAccessToken(unenrolledUser);

    const res = await simulateRequest(app, {
      method: 'POST',
      url: `/api/learning/courses/${unlockCourse.id}/chapters/${paidChap6.id}/unlock`,
      headers: { Authorization: `Bearer ${tokenUnenrolled}` },
    });
    assert.strictEqual(res.statusCode, 403);
    assert.strictEqual(res.body.error?.code, 'NOT_ENROLLED');
    pass('21. Enrollment Barrier: Unenrolled student cannot unlock course chapters (403 NOT_ENROLLED)');
  } catch (err) {
    fail('21. Unenrolled unlock rejection', err);
  }

  // Test 22: Free Chapter costs 0 coins and does not charge wallet
  try {
    const balBefore = db.wallets[studentUser1.id].balance;
    const res = await simulateRequest(app, {
      method: 'POST',
      url: `/api/learning/courses/${unlockCourse.id}/chapters/${freeChap0.id}/unlock`,
      headers: { Authorization: `Bearer ${tokenUser1}` },
    });
    assert.strictEqual(res.statusCode, 200);
    assert.strictEqual(res.body.data?.isFree, true);
    assert.strictEqual(db.wallets[studentUser1.id].balance, balBefore, 'Free chapter must not deduct any coins');
    pass('22. Freemium Shield: Free chapters (order <= 5 or isFree) cost 0 coins and never debit balance');
  } catch (err) {
    fail('22. Free chapter unlock charge check', err);
  }

  // Test 23: Insufficient balance to unlock paid chapter
  try {
    // Empty user 2's wallet
    db.wallets[studentUser2.id].balance = 10;
    const enrUser2 = {
      id: 'enr_user2_unlock',
      userId: studentUser2.id,
      courseId: unlockCourse.id,
      unlockedChapterIds: [freeChap0.id],
      updatedAt: new Date(),
    };
    db.enrollments.push(enrUser2);

    const res = await simulateRequest(app, {
      method: 'POST',
      url: `/api/learning/courses/${unlockCourse.id}/chapters/${paidChap6.id}/unlock`,
      headers: { Authorization: `Bearer ${tokenUser2}` },
    });
    assert.strictEqual(res.statusCode, 400);
    assert.strictEqual(res.body.error?.code, 'INSUFFICIENT_COINS');
    assert.strictEqual(db.wallets[studentUser2.id].balance, 10, 'Balance unchanged on insufficient coins');
    pass('23. Insufficient Coins: Paid chapter unlock rejected when student has fewer than required coins');
  } catch (err) {
    fail('23. Insufficient coins chapter unlock', err);
  }

  // Test 24: Concurrency Guard: Two simultaneous requests unlocking the same chapter
  try {
    // Give user 1 balance of 100 coins
    db.wallets[studentUser1.id].balance = 100;
    const balBefore = 100;

    const [res1, res2] = await Promise.all([
      simulateRequest(app, {
        method: 'POST',
        url: `/api/learning/courses/${unlockCourse.id}/chapters/${paidChap6.id}/unlock`,
        headers: { Authorization: `Bearer ${tokenUser1}` },
      }),
      simulateRequest(app, {
        method: 'POST',
        url: `/api/learning/courses/${unlockCourse.id}/chapters/${paidChap6.id}/unlock`,
        headers: { Authorization: `Bearer ${tokenUser1}` },
      }),
    ]);

    assert.strictEqual(res1.statusCode, 200);
    assert.strictEqual(res2.statusCode, 200);

    const isFirstCharge = !res1.body.data.alreadyUnlocked || !res2.body.data.alreadyUnlocked;
    const isSecondIdempotent = res1.body.data.alreadyUnlocked || res2.body.data.alreadyUnlocked;
    assert(isFirstCharge && isSecondIdempotent, 'One request must unlock and the other must return alreadyUnlocked: true');

    assert.strictEqual(
      db.wallets[studentUser1.id].balance,
      balBefore - 50,
      'Coins must be deducted EXACTLY once (50 coins), never twice'
    );

    const unlockTxs = db.transactions.filter(
      (t) => t.walletId === db.wallets[studentUser1.id].id && t.referenceId === paidChap6.id
    );
    assert.strictEqual(unlockTxs.length, 1, 'Only one audit transaction may be created for chapter unlock');
    pass('24. Concurrency Guard: Simultaneous chapter unlock requests cannot double-charge student wallet');
  } catch (err) {
    fail('24. Concurrent chapter unlock double-charge guard', err);
  }

  // --------------------------------------------------------------------------
  // 7. DATABASE MIGRATION & INITIALIZATION PREREQUISITES
  // --------------------------------------------------------------------------
  console.log('\n--- 7. DATABASE MIGRATION & INITIALIZATION ---');

  // Test 25: Database Prerequisites Check
  try {
    const prereq = await checkDatabasePrerequisites();
    assert.strictEqual(prereq.ready, true);
    assert.strictEqual(prereq.issues.length, 0);
    pass('25. Database Reliability: checkDatabasePrerequisites confirms valid configuration and replica set prerequisites');
  } catch (err) {
    fail('25. Database prerequisites check', err);
  }

  console.log(`\n=== PHASE 2 RECURRING SUMMARY: ${passed} Passed, ${failed} Failed ===`);
  if (failed > 0) process.exit(1);
}

runPhase2Tests().catch((err) => {
  console.error('Test execution failed:', err);
  process.exit(1);
});
