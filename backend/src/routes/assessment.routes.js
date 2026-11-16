import { Router } from 'express';
import { requireAuth, requireRole } from '../middleware/auth.middleware.js';
import {
  submitQuiz,
  submitAssessment,
  claimCompletionCertificate,
  getCertificates,
  verifyCertificate,
} from '../controllers/assessment.controller.js';

const router = Router();

// Chapter quiz & course assessment submissions
router.post('/quizzes/:chapterId/submit', requireAuth, requireRole('STUDENT'), submitQuiz);
router.post('/courses/:courseId/submit', requireAuth, requireRole('STUDENT'), submitAssessment);

// Separate Certificate endpoints
router.post('/courses/:courseId/claim-completion', requireAuth, requireRole('STUDENT'), claimCompletionCertificate);
router.get('/my-certificates', requireAuth, requireRole('STUDENT'), getCertificates);

// Public certificate verification
router.get('/verify/:credentialId', verifyCertificate);

export default router;
