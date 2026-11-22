import { Router } from 'express';
import { requireAuth } from '../middleware/auth.middleware.js';
import { updateProfileSchema, validateProfileUpdate } from '../validators/profile.validators.js';
import {
  getMyProfile,
  updateMyProfile,
  getPublicProfile,
} from '../controllers/profile.controller.js';

const router = Router();

router.get('/me', requireAuth, getMyProfile);
router.patch('/me', requireAuth, validateProfileUpdate, updateMyProfile);
router.get('/:userId', requireAuth, getPublicProfile);

export default router;
