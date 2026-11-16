import { Router } from 'express';
import { requireAuth } from '../middleware/auth.middleware.js';
import { validate } from '../validators/auth.validators.js';
import { updateProfileSchema } from '../validators/profile.validators.js';
import {
  getMyProfile,
  updateMyProfile,
  getPublicProfile,
} from '../controllers/profile.controller.js';

const router = Router();

router.get('/me', requireAuth, getMyProfile);
router.patch('/me', requireAuth, validate(updateProfileSchema), updateMyProfile);
router.get('/:userId', requireAuth, getPublicProfile);

export default router;
