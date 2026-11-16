import { Router } from 'express';
import { requireAuth, requireRole } from '../middleware/auth.middleware.js';
import {
  getWallet,
  claimDailyLogin,
  claimAdReward,
} from '../controllers/wallet.controller.js';

const router = Router();

router.get('/', requireAuth, requireRole('STUDENT'), getWallet);
router.post('/claim-daily-login', requireAuth, requireRole('STUDENT'), claimDailyLogin);
router.post('/claim-ad-reward', requireAuth, requireRole('STUDENT'), claimAdReward);

export default router;
