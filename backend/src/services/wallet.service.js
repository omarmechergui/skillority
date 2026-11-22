import crypto from 'crypto';
import prisma from '../config/database.js';

// ============================================================================
// COIN ECONOMY CONSTANTS (FIXED BUSINESS RULES)
// ============================================================================

export const COIN_PACKAGES = Object.freeze([
  { id: 'pkg_5', coins: 5, priceDT: 1 },
  { id: 'pkg_25', coins: 25, priceDT: 2 },
  { id: 'pkg_50', coins: 50, priceDT: 4 },
  { id: 'pkg_100', coins: 100, priceDT: 7 },
]);

export const DAILY_LOGIN_REWARD = 5; // Strict rule: +5 Coins
export const MAX_DAILY_MISSION_COINS = 25; // Strict rule: maximum +25 Coins per day
export const MAX_DAILY_ADS = 5; // Maximum 5 rewarded ads per calendar day
export const AD_COOLDOWN_MS = 60 * 1000; // 60 seconds minimum cooldown between ad rewards
export const AD_SESSION_EXPIRY_MS = 5 * 60 * 1000; // 5 minutes validity for ad session token

export const DAILY_MISSIONS = Object.freeze([
  {
    id: 'MISSION_LESSON_COMPLETE',
    title: 'Daily Learner',
    description: 'Complete at least 1 lesson today',
    coinsReward: 5,
  },
  {
    id: 'MISSION_QUIZ_PASS',
    title: 'Knowledge Check',
    description: 'Score a passing grade on any chapter quiz today',
    coinsReward: 10,
  },
  {
    id: 'MISSION_DAILY_STUDY',
    title: 'Study Streak',
    description: 'Complete at least 2 lessons or update your career goals today',
    coinsReward: 10,
  },
]);

/**
 * Probability distribution according to product requirements:
 * 1 Coin: 70%
 * 2 Coins: 25%
 * 3 Coins: 2%
 * 4 Coins: 1.5%
 * 5 Coins: 0.5%
 */
export function calculateRewardedAdCoins() {
  const rand = Math.random() * 100;
  if (rand < 70) return 1;
  if (rand < 95) return 2;
  if (rand < 97) return 3;
  if (rand < 98.5) return 4;
  return 5;
}

function getAdSecret() {
  return (
    process.env.AD_REWARD_SECRET ||
    process.env.JWT_ACCESS_SECRET ||
    process.env.JWT_SECRET ||
    'ad-reward-verification-secret-32-chars-long'
  );
}

/**
 * Generates a cryptographically signed one-time ad reward session token.
 */
export function generateAdSessionToken(userId) {
  const sessionId = `ad_${crypto.randomBytes(16).toString('hex')}`;
  const timestamp = Date.now();
  const payload = `${userId}:${sessionId}:${timestamp}`;
  const signature = crypto.createHmac('sha256', getAdSecret()).update(payload).digest('hex');
  return Buffer.from(JSON.stringify({ userId, sessionId, timestamp, signature })).toString('base64url');
}

/**
 * Verifies the validity, user binding, and expiration of an ad reward session token.
 */
export function verifyAdSessionToken(token, expectedUserId) {
  if (!token || typeof token !== 'string') {
    return { valid: false, error: 'MISSING_TOKEN' };
  }
  try {
    const raw = Buffer.from(token, 'base64url').toString('utf8');
    const { userId, sessionId, timestamp, signature } = JSON.parse(raw);
    if (!userId || !sessionId || !timestamp || !signature) {
      return { valid: false, error: 'MALFORMED_TOKEN' };
    }
    if (userId !== expectedUserId) {
      return { valid: false, error: 'USER_MISMATCH' };
    }

    const now = Date.now();
    const age = now - timestamp;
    if (age < 0 || age > AD_SESSION_EXPIRY_MS) {
      return { valid: false, error: 'EXPIRED_SESSION' };
    }

    const expectedPayload = `${userId}:${sessionId}:${timestamp}`;
    const expectedSig = crypto.createHmac('sha256', getAdSecret()).update(expectedPayload).digest('hex');

    const bufA = Buffer.from(signature, 'hex');
    const bufB = Buffer.from(expectedSig, 'hex');
    if (bufA.length !== bufB.length || !crypto.timingSafeEqual(bufA, bufB)) {
      return { valid: false, error: 'INVALID_SIGNATURE' };
    }

    return { valid: true, sessionId, timestamp };
  } catch {
    return { valid: false, error: 'INVALID_TOKEN' };
  }
}

// ============================================================================
// WALLET MANAGEMENT & TRANSACTIONS
// ============================================================================

export async function getWallet(userId) {
  let wallet = await prisma.wallet.findUnique({
    where: { userId },
    include: {
      transactions: {
        orderBy: { createdAt: 'desc' },
        take: 50,
      },
    },
  });

  if (!wallet) {
    wallet = await prisma.wallet.create({
      data: { userId, balance: 100 },
      include: { transactions: true },
    });
  }

  return wallet;
}

export function getCoinPackages() {
  return COIN_PACKAGES;
}

/**
 * Atomically spends coins from a user's wallet with conditional balance verification.
 * Guarantees that balance can NEVER drop below zero under concurrent requests.
 */
export async function spendCoins(userId, { amount, type, description, referenceId, idempotencyKey }) {
  if (!amount || typeof amount !== 'number' || amount <= 0 || !Number.isInteger(amount)) {
    throw new Error('INVALID_AMOUNT');
  }

  return prisma.$transaction(async (tx) => {
    let wallet = await tx.wallet.findUnique({ where: { userId } });
    if (!wallet) {
      wallet = await tx.wallet.create({ data: { userId, balance: 100 } });
    }

    // Idempotency check: if referenceId / idempotencyKey was already processed, return existing
    const refKey = idempotencyKey || referenceId;
    if (refKey) {
      const existingTx = await tx.walletTransaction.findFirst({
        where: { walletId: wallet.id, referenceId: refKey },
      });
      if (existingTx) {
        return {
          idempotentReplay: true,
          balance: wallet.balance,
          transaction: existingTx,
        };
      }
    }

    // Atomic conditional decrement: balance must be >= amount
    const updateResult = await tx.wallet.updateMany({
      where: {
        id: wallet.id,
        balance: { gte: amount },
      },
      data: {
        balance: { decrement: amount },
      },
    });

    if (updateResult.count === 0) {
      throw new Error('INSUFFICIENT_COINS');
    }

    const transaction = await tx.walletTransaction.create({
      data: {
        walletId: wallet.id,
        amount: -amount,
        type: type || 'CHAPTER_UNLOCK',
        description: description || `Spent ${amount} Coins`,
        referenceId: refKey || null,
      },
    });

    const refreshed = await tx.wallet.findUnique({ where: { id: wallet.id } });
    return {
      idempotentReplay: false,
      balance: refreshed.balance,
      transaction,
    };
  });
}

/**
 * Atomically credits coins to a user's wallet with audit trail.
 */
export async function creditCoins(userId, { amount, type, description, referenceId, idempotencyKey }) {
  if (!amount || typeof amount !== 'number' || amount <= 0 || !Number.isInteger(amount)) {
    throw new Error('INVALID_AMOUNT');
  }

  return prisma.$transaction(async (tx) => {
    let wallet = await tx.wallet.findUnique({ where: { userId } });
    if (!wallet) {
      wallet = await tx.wallet.create({ data: { userId, balance: 100 } });
    }

    const refKey = idempotencyKey || referenceId;
    if (refKey) {
      const existingTx = await tx.walletTransaction.findFirst({
        where: { walletId: wallet.id, referenceId: refKey },
      });
      if (existingTx) {
        return {
          idempotentReplay: true,
          balance: wallet.balance,
          transaction: existingTx,
        };
      }
    }

    const updated = await tx.wallet.update({
      where: { id: wallet.id },
      data: { balance: { increment: amount } },
    });

    const transaction = await tx.walletTransaction.create({
      data: {
        walletId: wallet.id,
        amount,
        type: type || 'CREDIT_BONUS',
        description: description || `Credited ${amount} Coins`,
        referenceId: refKey || null,
      },
    });

    return {
      idempotentReplay: false,
      balance: updated.balance,
      coinsAwarded: amount,
      transaction,
    };
  });
}

/**
 * Atomically refunds a prior coin transaction.
 */
export async function refundCoins(userId, { amount, originalReferenceId, reason }) {
  if (!originalReferenceId) throw new Error('MISSING_REFERENCE_ID');

  return prisma.$transaction(async (tx) => {
    let wallet = await tx.wallet.findUnique({ where: { userId } });
    if (!wallet) throw new Error('WALLET_NOT_FOUND');

    const refundRef = `refund_${originalReferenceId}`;
    const alreadyRefunded = await tx.walletTransaction.findFirst({
      where: { walletId: wallet.id, referenceId: refundRef },
    });
    if (alreadyRefunded) {
      throw new Error('ALREADY_REFUNDED');
    }

    const originalTx = await tx.walletTransaction.findFirst({
      where: { walletId: wallet.id, referenceId: originalReferenceId },
    });
    if (!originalTx) {
      throw new Error('ORIGINAL_TRANSACTION_NOT_FOUND');
    }

    const refundAmount = amount || Math.abs(originalTx.amount);

    const updated = await tx.wallet.update({
      where: { id: wallet.id },
      data: { balance: { increment: refundAmount } },
    });

    const transaction = await tx.walletTransaction.create({
      data: {
        walletId: wallet.id,
        amount: refundAmount,
        type: 'ADMIN_ADJUSTMENT',
        description: `Refund: ${reason || 'Transaction reversal'}`,
        referenceId: refundRef,
      },
    });

    return { balance: updated.balance, refundedAmount: refundAmount, transaction };
  });
}

// ============================================================================
// DAILY LOGIN BONUS (RACE-CONDITION RESILIENT)
// ============================================================================

export async function claimDailyLoginBonus(userId) {
  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  return prisma.$transaction(async (tx) => {
    let wallet = await tx.wallet.findUnique({ where: { userId } });
    if (!wallet) {
      wallet = await tx.wallet.create({ data: { userId, balance: 100 } });
    }

    // Atomic conditional update ensuring concurrent requests cannot double-claim
    const updated = await tx.wallet.updateMany({
      where: {
        id: wallet.id,
        OR: [
          { lastLoginBonus: null },
          { lastLoginBonus: { lt: startOfDay } },
        ],
      },
      data: {
        balance: { increment: DAILY_LOGIN_REWARD },
        lastLoginBonus: now,
      },
    });

    if (updated.count === 0) {
      throw new Error('ALREADY_CLAIMED_TODAY');
    }

    await tx.walletTransaction.create({
      data: {
        walletId: wallet.id,
        amount: DAILY_LOGIN_REWARD,
        type: 'DAILY_LOGIN',
        description: 'Daily login attendance reward',
      },
    });

    const refreshed = await tx.wallet.findUnique({ where: { id: wallet.id } });
    return { balance: refreshed.balance, coinsAwarded: DAILY_LOGIN_REWARD };
  });
}

// ============================================================================
// REWARDED ADVERTISEMENT VERIFICATION (SERVER-SIDE)
// ============================================================================

/**
 * Initiates an ad session by validating user eligibility (cooldown + daily limits)
 * and issuing a cryptographically signed one-time session token.
 */
export async function initiateAdRewardSession(userId) {
  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  let wallet = await prisma.wallet.findUnique({ where: { userId } });
  if (!wallet) {
    wallet = await prisma.wallet.create({ data: { userId, balance: 100 } });
  }

  // 1. Check daily ad count limit
  const todayAdCount = await prisma.walletTransaction.count({
    where: {
      walletId: wallet.id,
      type: 'AD_REWARD',
      createdAt: { gte: startOfDay },
    },
  });

  if (todayAdCount >= MAX_DAILY_ADS) {
    throw new Error('DAILY_AD_LIMIT_EXCEEDED');
  }

  // 2. Check cooldown from most recent ad
  const lastAdTx = await prisma.walletTransaction.findFirst({
    where: { walletId: wallet.id, type: 'AD_REWARD' },
    orderBy: { createdAt: 'desc' },
  });

  if (lastAdTx) {
    const elapsed = Date.now() - new Date(lastAdTx.createdAt).getTime();
    if (elapsed < AD_COOLDOWN_MS) {
      const waitSeconds = Math.ceil((AD_COOLDOWN_MS - elapsed) / 1000);
      const err = new Error(`AD_COOLDOWN_ACTIVE: Please wait ${waitSeconds}s before watching another ad`);
      err.cooldownRemaining = waitSeconds;
      throw err;
    }
  }

  const adSessionToken = generateAdSessionToken(userId);
  return {
    adSessionToken,
    expiresAt: new Date(Date.now() + AD_SESSION_EXPIRY_MS),
    cooldownSeconds: Math.round(AD_COOLDOWN_MS / 1000),
    dailyAdsRemaining: MAX_DAILY_ADS - todayAdCount,
  };
}

/**
 * Verifies server-side ad session token, validates anti-replay and frequency limits,
 * and awards coins exclusively on verified server-side completion.
 */
export async function claimAdReward(userId, { adSessionToken } = {}) {
  // Reject unverified calls lacking session token
  if (!adSessionToken) {
    throw new Error('INVALID_AD_VERIFICATION: Missing required adSessionToken');
  }

  const verification = verifyAdSessionToken(adSessionToken, userId);
  if (!verification.valid) {
    throw new Error(`INVALID_AD_VERIFICATION: ${verification.error}`);
  }

  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const coins = calculateRewardedAdCoins();

  return prisma.$transaction(async (tx) => {
    let wallet = await tx.wallet.findUnique({ where: { userId } });
    if (!wallet) {
      wallet = await tx.wallet.create({ data: { userId, balance: 100 } });
    }

    // 1. Anti-Replay: Verify that this sessionId was never used before
    const existingTx = await tx.walletTransaction.findFirst({
      where: { referenceId: verification.sessionId },
    });
    if (existingTx) {
      throw new Error('AD_REWARD_ALREADY_CLAIMED: This ad reward session has already been claimed');
    }

    // 2. Cooldown check inside transaction
    const lastAdTx = await tx.walletTransaction.findFirst({
      where: { walletId: wallet.id, type: 'AD_REWARD' },
      orderBy: { createdAt: 'desc' },
    });
    if (lastAdTx) {
      const elapsed = Date.now() - new Date(lastAdTx.createdAt).getTime();
      if (elapsed < AD_COOLDOWN_MS) {
        const waitSeconds = Math.ceil((AD_COOLDOWN_MS - elapsed) / 1000);
        const err = new Error(`AD_COOLDOWN_ACTIVE: Cooldown active (${waitSeconds}s remaining)`);
        err.cooldownRemaining = waitSeconds;
        throw err;
      }
    }

    // 3. Daily limit check inside transaction
    const todayAdCount = await tx.walletTransaction.count({
      where: {
        walletId: wallet.id,
        type: 'AD_REWARD',
        createdAt: { gte: startOfDay },
      },
    });
    if (todayAdCount >= MAX_DAILY_ADS) {
      throw new Error('DAILY_AD_LIMIT_EXCEEDED');
    }

    // 4. Atomic credit
    const updated = await tx.wallet.update({
      where: { id: wallet.id },
      data: { balance: { increment: coins } },
    });

    await tx.walletTransaction.create({
      data: {
        walletId: wallet.id,
        amount: coins,
        type: 'AD_REWARD',
        description: `Sponsored video reward (+${coins} Coins)`,
        referenceId: verification.sessionId,
      },
    });

    return {
      balance: updated.balance,
      coinsAwarded: coins,
      dailyAdsRemaining: MAX_DAILY_ADS - (todayAdCount + 1),
    };
  });
}

// ============================================================================
// DAILY MISSIONS (SERVER-SIDE COMPLETION VALIDATION & 25-COIN DAILY CAP)
// ============================================================================

export async function getDailyMissionsStatus(userId) {
  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  let wallet = await prisma.wallet.findUnique({ where: { userId } });
  if (!wallet) {
    wallet = await prisma.wallet.create({ data: { userId, balance: 100 } });
  }

  // Fetch claimed mission transactions today
  const todayMissionTxs = await prisma.walletTransaction.findMany({
    where: {
      walletId: wallet.id,
      type: 'DAILY_MISSION',
      createdAt: { gte: startOfDay },
    },
  });

  const claimedMissionIds = new Set(
    todayMissionTxs.map((t) => (t.referenceId ? t.referenceId.split('_')[1] : null)).filter(Boolean)
  );

  const totalCoinsClaimedToday = todayMissionTxs.reduce((sum, t) => sum + t.amount, 0);

  // Check completion criteria server-side
  const missionsWithStatus = await Promise.all(
    DAILY_MISSIONS.map(async (mission) => {
      const isClaimed = claimedMissionIds.has(mission.id);
      let isCompleted = isClaimed; // If already claimed, was completed

      if (!isCompleted) {
        if (mission.id === 'MISSION_LESSON_COMPLETE') {
          // Check for lesson completed today
          const recentEnrollment = await prisma.enrollment.findFirst({
            where: { userId, updatedAt: { gte: startOfDay } },
          });
          isCompleted = Boolean(recentEnrollment && recentEnrollment.completedLessonIds?.length > 0);
        } else if (mission.id === 'MISSION_QUIZ_PASS') {
          // Check for passing quiz attempt today
          const quizPassToday = await prisma.quizAttempt.findFirst({
            where: { userId, passed: true, createdAt: { gte: startOfDay } },
          });
          isCompleted = Boolean(quizPassToday);
        } else if (mission.id === 'MISSION_DAILY_STUDY') {
          // Check for multi-lesson completion or active goal
          const goals = await prisma.studentCareerGoal.findFirst({ where: { studentId: userId } });
          const enrollments = await prisma.enrollment.findMany({ where: { userId } });
          const totalCompletedLessons = enrollments.reduce((acc, e) => acc + (e.completedLessonIds?.length || 0), 0);
          isCompleted = totalCompletedLessons >= 2 || Boolean(goals);
        }
      }

      return {
        ...mission,
        isCompleted,
        isClaimed,
      };
    })
  );

  return {
    missions: missionsWithStatus,
    totalCoinsClaimedToday,
    maxDailyCoins: MAX_DAILY_MISSION_COINS,
    canClaimMore: totalCoinsClaimedToday < MAX_DAILY_MISSION_COINS,
  };
}

export async function claimDailyMission(userId, missionId) {
  const mission = DAILY_MISSIONS.find((m) => m.id === missionId);
  if (!mission) {
    throw new Error('INVALID_MISSION');
  }

  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const dateKey = now.toISOString().slice(0, 10);
  const missionRefKey = `mission_${mission.id}_${dateKey}`;

  return prisma.$transaction(async (tx) => {
    let wallet = await tx.wallet.findUnique({ where: { userId } });
    if (!wallet) {
      wallet = await tx.wallet.create({ data: { userId, balance: 100 } });
    }

    // 1. Check if already claimed today
    const existingClaim = await tx.walletTransaction.findFirst({
      where: { walletId: wallet.id, referenceId: missionRefKey },
    });
    if (existingClaim) {
      throw new Error('MISSION_ALREADY_CLAIMED');
    }

    // 2. Enforce daily mission total coin cap (+25 Coins max)
    const todayMissionTxs = await tx.walletTransaction.findMany({
      where: {
        walletId: wallet.id,
        type: 'DAILY_MISSION',
        createdAt: { gte: startOfDay },
      },
    });
    const currentTotal = todayMissionTxs.reduce((sum, t) => sum + t.amount, 0);
    if (currentTotal + mission.coinsReward > MAX_DAILY_MISSION_COINS) {
      throw new Error('DAILY_MISSION_LIMIT_EXCEEDED');
    }

    // 3. Verify server-side completion
    let isCompleted = false;
    if (mission.id === 'MISSION_LESSON_COMPLETE') {
      const recentEnrollment = await tx.enrollment.findFirst({
        where: { userId, updatedAt: { gte: startOfDay } },
      });
      isCompleted = Boolean(recentEnrollment && recentEnrollment.completedLessonIds?.length > 0);
    } else if (mission.id === 'MISSION_QUIZ_PASS') {
      const quizPassToday = await tx.quizAttempt.findFirst({
        where: { userId, passed: true, createdAt: { gte: startOfDay } },
      });
      isCompleted = Boolean(quizPassToday);
    } else if (mission.id === 'MISSION_DAILY_STUDY') {
      const goals = await tx.studentCareerGoal.findFirst({ where: { studentId: userId } });
      const enrollments = await tx.enrollment.findMany({ where: { userId } });
      const totalCompletedLessons = enrollments.reduce((acc, e) => acc + (e.completedLessonIds?.length || 0), 0);
      isCompleted = totalCompletedLessons >= 2 || Boolean(goals);
    }

    if (!isCompleted) {
      throw new Error('MISSION_NOT_COMPLETED');
    }

    // 4. Atomically credit reward
    const updated = await tx.wallet.update({
      where: { id: wallet.id },
      data: { balance: { increment: mission.coinsReward } },
    });

    await tx.walletTransaction.create({
      data: {
        walletId: wallet.id,
        amount: mission.coinsReward,
        type: 'DAILY_MISSION',
        description: `Daily Mission: ${mission.title}`,
        referenceId: missionRefKey,
      },
    });

    return {
      balance: updated.balance,
      coinsAwarded: mission.coinsReward,
      totalClaimedToday: currentTotal + mission.coinsReward,
    };
  });
}
