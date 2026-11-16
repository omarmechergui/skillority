import prisma from '../config/database.js';

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

export async function claimDailyLoginBonus(userId) {
  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  return prisma.$transaction(async (tx) => {
    let wallet = await tx.wallet.findUnique({ where: { userId } });
    if (!wallet) {
      wallet = await tx.wallet.create({ data: { userId, balance: 100 } });
    }

    // Check if already claimed today
    if (wallet.lastLoginBonus && wallet.lastLoginBonus >= startOfDay) {
      throw new Error('ALREADY_CLAIMED_TODAY');
    }

    const BONUS_AMOUNT = 5; // Strict rule: +5 Coins

    const updated = await tx.wallet.update({
      where: { id: wallet.id },
      data: {
        balance: { increment: BONUS_AMOUNT },
        lastLoginBonus: now,
      },
    });

    await tx.walletTransaction.create({
      data: {
        walletId: wallet.id,
        amount: BONUS_AMOUNT,
        type: 'DAILY_LOGIN',
        description: 'Daily login attendance reward',
      },
    });

    return { balance: updated.balance, coinsAwarded: BONUS_AMOUNT };
  });
}

export async function claimAdReward(userId) {
  const coins = calculateRewardedAdCoins();

  return prisma.$transaction(async (tx) => {
    let wallet = await tx.wallet.findUnique({ where: { userId } });
    if (!wallet) {
      wallet = await tx.wallet.create({ data: { userId, balance: 100 } });
    }

    const updated = await tx.wallet.update({
      where: { id: wallet.id },
      data: { balance: { increment: coins } },
    });

    await tx.walletTransaction.create({
      data: {
        walletId: wallet.id,
        amount: coins,
        type: 'AD_REWARD',
        description: `Sponsored video reward (${coins} Coins)`,
      },
    });

    return { balance: updated.balance, coinsAwarded: coins };
  });
}
