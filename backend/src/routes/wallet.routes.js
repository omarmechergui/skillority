import { Router } from 'express';
import { requireAuth, requireRole } from '../middleware/auth.middleware.js';
import {
  getWallet,
  getPackages,
  claimDailyLogin,
  initiateAdSession,
  claimAdReward,
  getDailyMissions,
  claimDailyMission,
} from '../controllers/wallet.controller.js';

const router = Router();

router.get('/', requireAuth, requireRole('STUDENT'), getWallet);
router.get('/packages', getPackages); // Public or authenticated packages pricing
router.get('/missions', requireAuth, requireRole('STUDENT'), getDailyMissions);
router.post('/missions/:missionId/claim', requireAuth, requireRole('STUDENT'), claimDailyMission);
router.post('/claim-daily-login', requireAuth, requireRole('STUDENT'), claimDailyLogin);
router.post('/ad-session/initiate', requireAuth, requireRole('STUDENT'), initiateAdSession);
router.post('/claim-ad-reward', requireAuth, requireRole('STUDENT'), claimAdReward);

export default router;
