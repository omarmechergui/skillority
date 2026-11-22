import * as walletService from '../services/wallet.service.js';

export async function getWallet(req, res, next) {
  try {
    const wallet = await walletService.getWallet(req.user.id);
    return res.status(200).json({ success: true, data: wallet });
  } catch (err) {
    next(err);
  }
}

export async function getPackages(req, res, next) {
  try {
    const packages = walletService.getCoinPackages();
    return res.status(200).json({ success: true, data: packages });
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
      return res.status(400).json({
        success: false,
        error: { code: 'ALREADY_CLAIMED', message: 'You have already claimed your daily reward today' },
      });
    }
    next(err);
  }
}

export async function initiateAdSession(req, res, next) {
  try {
    const session = await walletService.initiateAdRewardSession(req.user.id);
    return res.status(200).json({ success: true, message: 'Ad reward session initiated', data: session });
  } catch (err) {
    if (err.message?.startsWith('AD_COOLDOWN_ACTIVE')) {
      return res.status(429).json({
        success: false,
        error: {
          code: 'AD_COOLDOWN_ACTIVE',
          message: err.message,
          cooldownRemaining: err.cooldownRemaining,
        },
      });
    }
    if (err.message === 'DAILY_AD_LIMIT_EXCEEDED') {
      return res.status(400).json({
        success: false,
        error: { code: 'DAILY_AD_LIMIT_EXCEEDED', message: 'Maximum 5 rewarded ads reached for today' },
      });
    }
    next(err);
  }
}

export async function claimAdReward(req, res, next) {
  try {
    const { adSessionToken } = req.body || {};
    const result = await walletService.claimAdReward(req.user.id, { adSessionToken });
    return res.status(200).json({ success: true, message: `Reward claimed (+${result.coinsAwarded} Coins)`, data: result });
  } catch (err) {
    if (err.message?.startsWith('INVALID_AD_VERIFICATION')) {
      return res.status(400).json({
        success: false,
        error: { code: 'INVALID_AD_VERIFICATION', message: err.message },
      });
    }
    if (err.message?.startsWith('AD_REWARD_ALREADY_CLAIMED')) {
      return res.status(409).json({
        success: false,
        error: { code: 'AD_REWARD_ALREADY_CLAIMED', message: err.message },
      });
    }
    if (err.message?.startsWith('AD_COOLDOWN_ACTIVE')) {
      return res.status(429).json({
        success: false,
        error: {
          code: 'AD_COOLDOWN_ACTIVE',
          message: err.message,
          cooldownRemaining: err.cooldownRemaining,
        },
      });
    }
    if (err.message === 'DAILY_AD_LIMIT_EXCEEDED') {
      return res.status(400).json({
        success: false,
        error: { code: 'DAILY_AD_LIMIT_EXCEEDED', message: 'Daily limit of 5 rewarded ads reached' },
      });
    }
    next(err);
  }
}

export async function getDailyMissions(req, res, next) {
  try {
    const missions = await walletService.getDailyMissionsStatus(req.user.id);
    return res.status(200).json({ success: true, data: missions });
  } catch (err) {
    next(err);
  }
}

export async function claimDailyMission(req, res, next) {
  try {
    const { missionId } = req.params;
    const result = await walletService.claimDailyMission(req.user.id, missionId);
    return res.status(200).json({
      success: true,
      message: `Mission claimed (+${result.coinsAwarded} Coins)`,
      data: result,
    });
  } catch (err) {
    if (err.message === 'INVALID_MISSION') {
      return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Invalid mission ID' } });
    }
    if (err.message === 'MISSION_ALREADY_CLAIMED') {
      return res.status(409).json({
        success: false,
        error: { code: 'ALREADY_CLAIMED', message: 'This mission has already been claimed today' },
      });
    }
    if (err.message === 'MISSION_NOT_COMPLETED') {
      return res.status(400).json({
        success: false,
        error: { code: 'MISSION_INCOMPLETE', message: 'Mission requirements have not been completed yet' },
      });
    }
    if (err.message === 'DAILY_MISSION_LIMIT_EXCEEDED') {
      return res.status(400).json({
        success: false,
        error: { code: 'DAILY_LIMIT_EXCEEDED', message: 'Maximum 25 mission coins reached for today' },
      });
    }
    next(err);
  }
}
