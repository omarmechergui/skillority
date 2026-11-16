import { Router } from 'express';
import { requireAuth, requireRole } from '../middleware/auth.middleware.js';
import {
  listUsers,
  updateUserStatus,
  getReviewQueue,
  getStats,
} from '../controllers/admin.controller.js';

const router = Router();

// Strictly Admin-only platform operations
router.get('/users', requireAuth, requireRole('ADMIN'), listUsers);
router.patch('/users/:id/status', requireAuth, requireRole('ADMIN'), updateUserStatus);
router.get('/courses/reviews', requireAuth, requireRole('ADMIN'), getReviewQueue);
router.get('/stats', requireAuth, requireRole('ADMIN'), getStats);

export default router;
