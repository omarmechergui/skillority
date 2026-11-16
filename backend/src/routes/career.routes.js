import { Router } from 'express';
import { requireAuth, requireRole } from '../middleware/auth.middleware.js';
import { validate } from '../validators/auth.validators.js';
import {
  createOpportunitySchema,
  updateApplicationStatusSchema,
} from '../validators/career.validators.js';
import {
  listOpportunities,
  getOpportunity,
  createOpportunity,
  apply,
  getMyApplications,
  getCompanyApplications,
  updateApplicationStatus,
} from '../controllers/career.controller.js';

const router = Router();

// Public / Candidate view
router.get('/opportunities', listOpportunities);
router.get('/opportunities/:id', getOpportunity);

// Student actions
router.post('/opportunities/:opportunityId/apply', requireAuth, requireRole('STUDENT'), apply);
router.get('/my-applications', requireAuth, requireRole('STUDENT'), getMyApplications);

// Company / Recruiter actions
router.post('/opportunities', requireAuth, requireRole('COMPANY'), validate(createOpportunitySchema), createOpportunity);
router.get('/applications', requireAuth, requireRole('COMPANY'), getCompanyApplications);
router.patch('/applications/:applicationId/status', requireAuth, requireRole('COMPANY'), validate(updateApplicationStatusSchema), updateApplicationStatus);

export default router;
