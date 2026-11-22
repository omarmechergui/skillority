import { Router } from 'express';
import { requireAuth, requireRole, optionalAuth } from '../middleware/auth.middleware.js';
import { validate } from '../validators/auth.validators.js';
import {
  createCareerPathSchema,
  updateCareerPathSchema,
  setCareerGoalSchema,
  createOpportunitySchema,
  updateOpportunitySchema,
  applyOpportunitySchema,
  updateApplicationStatusSchema,
  evaluateCandidateSchema,
  scheduleInterviewSchema,
  updateInterviewSchema,
  createOfferSchema,
  respondOfferSchema,
} from '../validators/career.validators.js';
import {
  listCareerPaths,
  getCareerPathBySlug,
  createCareerPath,
  updateCareerPath,
  deleteCareerPath,
  getMyCareerGoals,
  setCareerGoal,
  deleteCareerGoal,
  getCareerProgress,
  listOpportunities,
  getOpportunity,
  createOpportunity,
  updateOpportunity,
  closeOpportunity,
  apply,
  getMyApplications,
  withdrawApplication,
  getCompanyDashboardMetrics,
  getCompanyApplications,
  getCompanyApplicationDetails,
  evaluateCandidate,
  updateApplicationStatus,
  scheduleInterview,
  updateInterview,
  createOffer,
  respondToOffer,
  getAdminOverview,
  moderateOpportunity,
} from '../controllers/career.controller.js';

const router = Router();

// ============================================================================
// MODULE 3A: CAREER PATHS & STUDENT GOALS
// ============================================================================

// Public / Discoverable career paths
router.get('/paths', listCareerPaths);
router.get('/paths/:slug', getCareerPathBySlug);

// Student Career Goals & Progress
router.get('/goals', requireAuth, requireRole('STUDENT'), getMyCareerGoals);
router.post('/goals', requireAuth, requireRole('STUDENT'), validate(setCareerGoalSchema), setCareerGoal);
router.delete('/goals/:careerPathId', requireAuth, requireRole('STUDENT'), deleteCareerGoal);
router.get('/progress/:careerPathId', requireAuth, requireRole('STUDENT'), getCareerProgress);

// Admin: Career Paths Management
router.post('/paths', requireAuth, requireRole('ADMIN'), validate(createCareerPathSchema), createCareerPath);
router.patch('/paths/:id', requireAuth, requireRole('ADMIN'), validate(updateCareerPathSchema), updateCareerPath);
router.delete('/paths/:id', requireAuth, requireRole('ADMIN'), deleteCareerPath);

// ============================================================================
// MODULE 3B & 3C: OPPORTUNITIES & APPLICATIONS
// ============================================================================

// Public / Student Opportunity Marketplace
router.get('/opportunities', optionalAuth, listOpportunities);
router.get('/opportunities/:id', optionalAuth, getOpportunity);

// Student Applications
router.post('/opportunities/:opportunityId/apply', requireAuth, requireRole('STUDENT'), validate(applyOpportunitySchema), apply);
router.get('/my-applications', requireAuth, requireRole('STUDENT'), getMyApplications);
router.post('/applications/:applicationId/withdraw', requireAuth, requireRole('STUDENT'), withdrawApplication);
router.post('/offers/:offerId/respond', requireAuth, requireRole('STUDENT'), validate(respondOfferSchema), respondToOffer);

// ============================================================================
// MODULE 3D & 3F: COMPANY RECRUITMENT & WORKFLOWS
// ============================================================================

// Company Management
router.get('/company/dashboard', requireAuth, requireRole('COMPANY'), getCompanyDashboardMetrics);
router.post('/opportunities', requireAuth, requireRole('COMPANY'), validate(createOpportunitySchema), createOpportunity);
router.patch('/opportunities/:id', requireAuth, requireRole('COMPANY'), validate(updateOpportunitySchema), updateOpportunity);
router.post('/opportunities/:id/close', requireAuth, requireRole('COMPANY'), closeOpportunity);

// Company Applicants & Evaluations
router.get('/applications', requireAuth, requireRole('COMPANY'), getCompanyApplications);
router.get('/applications/:applicationId', requireAuth, requireRole('COMPANY'), getCompanyApplicationDetails);
router.post('/applications/:applicationId/evaluate', requireAuth, requireRole('COMPANY'), validate(evaluateCandidateSchema), evaluateCandidate);
router.patch('/applications/:applicationId/status', requireAuth, requireRole('COMPANY'), validate(updateApplicationStatusSchema), updateApplicationStatus);

// Company Interviews & Offers
router.post('/applications/:applicationId/interviews', requireAuth, requireRole('COMPANY'), validate(scheduleInterviewSchema), scheduleInterview);
router.patch('/interviews/:interviewId', requireAuth, requireRole('COMPANY'), validate(updateInterviewSchema), updateInterview);
router.post('/applications/:applicationId/offers', requireAuth, requireRole('COMPANY'), validate(createOfferSchema), createOffer);

// ============================================================================
// MODULE 3G: ADMIN OVERSIGHT & MODERATION
// ============================================================================

router.get('/admin/overview', requireAuth, requireRole('ADMIN'), getAdminOverview);
router.patch('/admin/opportunities/:id/moderate', requireAuth, requireRole('ADMIN'), moderateOpportunity);

export default router;
