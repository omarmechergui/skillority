import { Router } from 'express';
import { requireAuth, requireRole } from '../middleware/auth.middleware.js';
import {
  enroll,
  getMyEnrollments,
  completeLesson,
  unlockChapter,
} from '../controllers/learning.controller.js';

const router = Router();

router.post('/enroll/:courseId', requireAuth, requireRole('STUDENT'), enroll);
router.get('/my-courses', requireAuth, requireRole('STUDENT'), getMyEnrollments);
router.post('/courses/:courseId/lessons/:lessonId/complete', requireAuth, requireRole('STUDENT'), completeLesson);
router.post('/courses/:courseId/chapters/:chapterId/unlock', requireAuth, requireRole('STUDENT'), unlockChapter);

export default router;
