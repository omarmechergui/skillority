import * as walletService from '../services/wallet.service.js';

export async function getWallet(req, res, next) {
  try {
    const wallet = await walletService.getWallet(req.user.id);
    return res.status(200).json({ success: true, data: wallet });
  } catch (err) {
    next(err);
  }
}

export async function claimDailyLogin(req, res, next) {
  try {
    const result = await walletService.claimDailyLoginBonus(req.user.id);
    return res.status(200).json({ success: true, message: 'Daily reward claimed (+5 Coins)', data: result });
  } catch (err) {
    if (err.message === 'ALREADY_CLAIMED_TODAY') {
      return res.status(400).json({ success: false, error: { code: 'ALREADY_CLAIMED', message: 'You have already claimed your daily reward today' } });
    }
    next(err);
  }
}

export async function claimAdReward(req, res, next) {
  try {
    const result = await walletService.claimAdReward(req.user.id);
    return res.status(200).json({ success: true, message: `Reward claimed (+${result.coinsAwarded} Coins)`, data: result });
  } catch (err) {
    next(err);
  }
}
