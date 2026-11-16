import { Router } from 'express';
import { requireAuth, requireRole } from '../middleware/auth.middleware.js';
import { validate } from '../validators/auth.validators.js';
import {
  createCourseSchema,
  updateCourseSchema,
  createChapterSchema,
  createLessonSchema,
  reviewDecisionSchema,
} from '../validators/course.validators.js';
import {
  listCourses,
  getCourse,
  createCourse,
  updateCourse,
  addChapter,
  addLesson,
  submitForReview,
  reviewDecision,
} from '../controllers/course.controller.js';

const router = Router();

// Public course browsing
router.get('/', listCourses);
router.get('/:id', getCourse);

// Instructor authoring routes
router.post('/', requireAuth, requireRole('INSTRUCTOR', 'ADMIN'), validate(createCourseSchema), createCourse);
router.patch('/:id', requireAuth, requireRole('INSTRUCTOR', 'ADMIN'), validate(updateCourseSchema), updateCourse);
router.post('/:id/chapters', requireAuth, requireRole('INSTRUCTOR', 'ADMIN'), validate(createChapterSchema), addChapter);
router.post('/chapters/:chapterId/lessons', requireAuth, requireRole('INSTRUCTOR', 'ADMIN'), validate(createLessonSchema), addLesson);
router.post('/:id/submit-review', requireAuth, requireRole('INSTRUCTOR', 'ADMIN'), submitForReview);

// Admin review decision route
router.post('/:id/review-decision', requireAuth, requireRole('ADMIN'), validate(reviewDecisionSchema), reviewDecision);

export default router;
