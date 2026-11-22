import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import {
  registerStudent,
  registerCompany,
  login,
  logout,
  refresh,
  forgotPassword,
  resetPassword,
  getMe,
} from '../controllers/auth.controller.js';
import {
  inviteInstructor,
  verifyInstructorInvite,
  acceptInstructorInvite,
  revokeInstructor,
} from '../controllers/instructor.controller.js';
import {
  completeStudentOnboarding,
  completeCompanyOnboarding,
  completeInstructorOnboarding,
} from '../controllers/onboarding.controller.js';
import { requireAuth, requireRole, requireOwnershipOrAdmin } from '../middleware/auth.middleware.js';
import {
  validate,
  registerStudentSchema,
  registerCompanySchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  inviteInstructorSchema,
  acceptInstructorInviteSchema,
  studentOnboardingSchema,
  companyOnboardingSchema,
  instructorOnboardingSchema,
} from '../validators/auth.validators.js';

const router = Router();

// Strict rate limiters for authentication endpoints to prevent brute force
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 mins
  max: 20, // 20 attempts
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: {
      code: 'TOO_MANY_REQUESTS',
      message: 'Too many authentication attempts. Please try again after 15 minutes.',
    },
  },
});

// -------------------------------------------------------------
// PUBLIC AUTHENTICATION ROUTES
// -------------------------------------------------------------

router.post('/signup/student', authLimiter, validate(registerStudentSchema), registerStudent);
router.post('/signup/company', authLimiter, validate(registerCompanySchema), registerCompany);
router.post('/login', authLimiter, validate(loginSchema), login);
router.post('/logout', logout);
router.post('/refresh', refresh);
router.post('/forgot-password', authLimiter, validate(forgotPasswordSchema), forgotPassword);
router.post('/reset-password', authLimiter, validate(resetPasswordSchema), resetPassword);

// -------------------------------------------------------------
// INSTRUCTOR INVITATION ROUTES (Critical Business Rule)
// -------------------------------------------------------------

// Admin invites instructor
router.post(
  '/admin/instructors/invite',
  requireAuth,
  requireRole('ADMIN'),
  validate(inviteInstructorSchema),
  inviteInstructor
);

// Public verification of instructor invitation token
router.get('/instructors/invitation/:token', verifyInstructorInvite);

// Public acceptance of instructor invitation
router.post(
  '/instructors/accept-invitation',
  authLimiter,
  validate(acceptInstructorInviteSchema),
  acceptInstructorInvite
);

// Admin revokes instructor permissions
router.put(
  '/admin/instructors/:instructorId/revoke',
  requireAuth,
  requireRole('ADMIN'),
  revokeInstructor
);

// -------------------------------------------------------------
// PROTECTED USER / ONBOARDING ROUTES
// -------------------------------------------------------------

router.get('/me', requireAuth, getMe);

// Student Onboarding
router.post(
  '/onboarding/student',
  requireAuth,
  requireRole('STUDENT'),
  validate(studentOnboardingSchema),
  completeStudentOnboarding
);

// Company Onboarding
router.post(
  '/onboarding/company',
  requireAuth,
  requireRole('COMPANY'),
  validate(companyOnboardingSchema),
  completeCompanyOnboarding
);

// Instructor Onboarding
router.post(
  '/onboarding/instructor',
  requireAuth,
  requireRole('INSTRUCTOR'),
  validate(instructorOnboardingSchema),
  completeInstructorOnboarding
);

// Ownership / Protected test route for RBAC testing
router.get('/users/:userId/profile', requireAuth, requireOwnershipOrAdmin('userId'), (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Ownership or Admin access granted to user profile.',
    data: { userId: req.params.userId, accessedBy: req.user.id },
  });
});

export default router;
