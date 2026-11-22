import * as careerService from '../services/career.service.js';

// ============================================================================
// MODULE 3A: CAREER PATHS & GOALS
// ============================================================================

export async function listCareerPaths(req, res, next) {
  try {
    const { category, difficulty, search, page, limit } = req.query;
    const result = await careerService.listCareerPaths({
      category,
      difficulty,
      search,
      page: Number(page) || 1,
      limit: Number(limit) || 20,
    });
    return res.status(200).json({ success: true, data: result.paths, meta: result });
  } catch (err) {
    next(err);
  }
}

export async function getCareerPathBySlug(req, res, next) {
  try {
    const { slug } = req.params;
    const path = await careerService.getCareerPathBySlug(slug);
    if (!path) {
      return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Career path not found' } });
    }
    return res.status(200).json({ success: true, data: path });
  } catch (err) {
    next(err);
  }
}

export async function createCareerPath(req, res, next) {
  try {
    const path = await careerService.createCareerPath(req.validatedBody);
    return res.status(201).json({ success: true, message: 'Career path created', data: path });
  } catch (err) {
    next(err);
  }
}

export async function updateCareerPath(req, res, next) {
  try {
    const { id } = req.params;
    const path = await careerService.updateCareerPath(id, req.validatedBody);
    return res.status(200).json({ success: true, message: 'Career path updated', data: path });
  } catch (err) {
    next(err);
  }
}

export async function deleteCareerPath(req, res, next) {
  try {
    const { id } = req.params;
    await careerService.deleteCareerPath(id);
    return res.status(200).json({ success: true, message: 'Career path deactivated' });
  } catch (err) {
    next(err);
  }
}

export async function getMyCareerGoals(req, res, next) {
  try {
    const goals = await careerService.getStudentCareerGoals(req.user.id);
    return res.status(200).json({ success: true, data: goals });
  } catch (err) {
    next(err);
  }
}

export async function setCareerGoal(req, res, next) {
  try {
    const goal = await careerService.setStudentCareerGoal(req.user.id, req.validatedBody);
    return res.status(200).json({ success: true, message: 'Career goal updated', data: goal });
  } catch (err) {
    next(err);
  }
}

export async function deleteCareerGoal(req, res, next) {
  try {
    const { careerPathId } = req.params;
    await careerService.removeStudentCareerGoal(req.user.id, careerPathId);
    return res.status(200).json({ success: true, message: 'Career goal removed' });
  } catch (err) {
    next(err);
  }
}

export async function getCareerProgress(req, res, next) {
  try {
    const { careerPathId } = req.params;
    const progress = await careerService.getCareerProgressForStudent(req.user.id, careerPathId);
    return res.status(200).json({ success: true, data: progress });
  } catch (err) {
    if (err.message === 'CAREER_PATH_NOT_FOUND') {
      return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Career path not found' } });
    }
    next(err);
  }
}

// ============================================================================
// MODULE 3B: OPPORTUNITIES / INTERNSHIPS
// ============================================================================

export async function listOpportunities(req, res, next) {
  try {
    const {
      type,
      category,
      workplaceType,
      skills,
      location,
      search,
      companyId,
      status,
      isOpen,
      sortBy,
      sortOrder,
      page,
      limit,
    } = req.query;

    const currentStudentId = req.user?.role === 'STUDENT' ? req.user.id : null;

    const result = await careerService.listOpportunities({
      type,
      category,
      workplaceType,
      skills,
      location,
      search,
      companyId,
      status,
      isOpen: isOpen === undefined ? undefined : (isOpen === 'true' || isOpen === true),
      sortBy: sortBy || 'createdAt',
      sortOrder: sortOrder || 'desc',
      page: Number(page) || 1,
      limit: Number(limit) || 10,
      currentStudentId,
    });
    return res.status(200).json({ success: true, data: result.opportunities, meta: result });
  } catch (err) {
    next(err);
  }
}

export async function getOpportunity(req, res, next) {
  try {
    const currentStudentId = req.user?.role === 'STUDENT' ? req.user.id : null;
    const opp = await careerService.getOpportunityById(req.params.id, currentStudentId);
    if (!opp) {
      return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Opportunity not found' } });
    }
    return res.status(200).json({ success: true, data: opp });
  } catch (err) {
    next(err);
  }
}

export async function createOpportunity(req, res, next) {
  try {
    const opp = await careerService.createOpportunity(req.user.id, req.validatedBody);
    return res.status(201).json({ success: true, message: 'Opportunity posted successfully', data: opp });
  } catch (err) {
    next(err);
  }
}

export async function updateOpportunity(req, res, next) {
  try {
    const { id } = req.params;
    const opp = await careerService.updateOpportunity(id, req.user.id, req.validatedBody);
    if (!opp) return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Opportunity not found' } });
    return res.status(200).json({ success: true, message: 'Opportunity updated', data: opp });
  } catch (err) {
    if (err.message === 'FORBIDDEN_NOT_OWNER') {
      return res.status(403).json({ success: false, error: { code: 'FORBIDDEN', message: 'Not authorized to modify this opportunity' } });
    }
    next(err);
  }
}

export async function closeOpportunity(req, res, next) {
  try {
    const { id } = req.params;
    const opp = await careerService.closeOpportunity(id, req.user.id);
    if (!opp) return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Opportunity not found' } });
    return res.status(200).json({ success: true, message: 'Opportunity closed to applications', data: opp });
  } catch (err) {
    if (err.message === 'FORBIDDEN_NOT_OWNER') {
      return res.status(403).json({ success: false, error: { code: 'FORBIDDEN', message: 'Not authorized to close this opportunity' } });
    }
    next(err);
  }
}

// ============================================================================
// MODULE 3C: STUDENT APPLICATIONS
// ============================================================================

export async function apply(req, res, next) {
  try {
    const { opportunityId } = req.params;
    const payload = req.validatedBody || req.body || {};
    const application = await careerService.applyToOpportunity(req.user.id, opportunityId, payload);
    return res.status(201).json({ success: true, message: 'Application submitted successfully', data: application });
  } catch (err) {
    if (err.code === 'ALREADY_APPLIED' || err.message === 'ALREADY_APPLIED' || err.message?.includes('Unique constraint')) {
      return res.status(409).json({ success: false, error: { code: 'ALREADY_APPLIED', message: 'You have already applied to this opportunity' } });
    }
    if (err.message === 'OPPORTUNITY_CLOSED' || err.message === 'OPPORTUNITY_NOT_AVAILABLE') {
      return res.status(400).json({ success: false, error: { code: 'UNAVAILABLE', message: 'Opportunity is closed or no longer accepting applications' } });
    }
    if (err.message === 'APPLICATION_DEADLINE_PASSED') {
      return res.status(400).json({ success: false, error: { code: 'DEADLINE_PASSED', message: 'The deadline for this opportunity has passed' } });
    }
    if (err.message === 'POSITIONS_FULL') {
      return res.status(400).json({ success: false, error: { code: 'POSITIONS_FULL', message: 'All open positions for this opportunity have been filled' } });
    }
    if (err.message === 'OPPORTUNITY_NOT_FOUND') {
      return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Opportunity not found' } });
    }
    next(err);
  }
}

export async function getMyApplications(req, res, next) {
  try {
    const applications = await careerService.getStudentApplications(req.user.id);
    return res.status(200).json({ success: true, data: applications });
  } catch (err) {
    next(err);
  }
}

export async function withdrawApplication(req, res, next) {
  try {
    const { applicationId } = req.params;
    const { reason } = req.body || {};
    const updated = await careerService.withdrawApplication(req.user.id, applicationId, reason);
    if (!updated) return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Application not found' } });
    return res.status(200).json({ success: true, message: 'Application withdrawn', data: updated });
  } catch (err) {
    if (err.message === 'FORBIDDEN_NOT_OWNER') {
      return res.status(403).json({ success: false, error: { code: 'FORBIDDEN', message: 'Not authorized to withdraw this application' } });
    }
    if (err.message === 'CANNOT_WITHDRAW') {
      return res.status(400).json({ success: false, error: { code: 'INVALID_STATE', message: 'Cannot withdraw an accepted, rejected, or already withdrawn application' } });
    }
    next(err);
  }
}

// ============================================================================
// MODULE 3D: COMPANY RECRUITMENT MANAGEMENT
// ============================================================================

export async function getCompanyDashboardMetrics(req, res, next) {
  try {
    const metrics = await careerService.getCompanyRecruitmentDashboardMetrics(req.user.id);
    return res.status(200).json({ success: true, data: metrics });
  } catch (err) {
    next(err);
  }
}

export async function getCompanyApplications(req, res, next) {
  try {
    const { opportunityId, status, search, page, limit } = req.query;
    const applications = await careerService.getCompanyApplications(req.user.id, {
      opportunityId,
      status,
      search,
      page: Number(page) || 1,
      limit: Number(limit) || 50,
    });
    return res.status(200).json({ success: true, data: applications });
  } catch (err) {
    next(err);
  }
}

export async function getCompanyApplicationDetails(req, res, next) {
  try {
    const { applicationId } = req.params;
    const application = await careerService.getCompanyApplicationDetails(applicationId, req.user.id);
    if (!application) {
      return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Application not found' } });
    }
    return res.status(200).json({ success: true, data: application });
  } catch (err) {
    if (err.message === 'FORBIDDEN_NOT_OWNER') {
      return res.status(403).json({ success: false, error: { code: 'FORBIDDEN', message: 'Not authorized to view this application' } });
    }
    next(err);
  }
}

export async function evaluateCandidate(req, res, next) {
  try {
    const { applicationId } = req.params;
    const updated = await careerService.evaluateCandidate(applicationId, req.user.id, req.validatedBody);
    if (!updated) return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Application not found' } });
    return res.status(200).json({ success: true, message: 'Candidate evaluation recorded', data: updated });
  } catch (err) {
    if (err.message === 'FORBIDDEN_NOT_OWNER') {
      return res.status(403).json({ success: false, error: { code: 'FORBIDDEN', message: 'Not authorized to evaluate this application' } });
    }
    next(err);
  }
}

export async function updateApplicationStatus(req, res, next) {
  try {
    const { applicationId } = req.params;
    const { status, notes, internalNotes } = req.validatedBody;
    const updated = await careerService.updateApplicationStatus(applicationId, req.user.id, status, notes, internalNotes);
    if (!updated) return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Application not found' } });
    return res.status(200).json({ success: true, message: `Status updated to ${status}`, data: updated });
  } catch (err) {
    if (err.message === 'FORBIDDEN_NOT_OWNER') {
      return res.status(403).json({ success: false, error: { code: 'FORBIDDEN', message: 'Not authorized to modify this application' } });
    }
    if (err.message === 'APPLICATION_ALREADY_WITHDRAWN') {
      return res.status(400).json({ success: false, error: { code: 'WITHDRAWN', message: 'Cannot modify an application that was withdrawn by the candidate' } });
    }
    next(err);
  }
}

// ============================================================================
// MODULE 3F: INTERVIEWS & OFFERS
// ============================================================================

export async function scheduleInterview(req, res, next) {
  try {
    const { applicationId } = req.params;
    const interview = await careerService.scheduleInterview(req.user.id, applicationId, req.validatedBody);
    return res.status(201).json({ success: true, message: 'Interview scheduled', data: interview });
  } catch (err) {
    if (err.message === 'APPLICATION_NOT_FOUND') {
      return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Application not found' } });
    }
    if (err.message === 'FORBIDDEN_NOT_OWNER') {
      return res.status(403).json({ success: false, error: { code: 'FORBIDDEN', message: 'Not authorized to schedule interviews for this opportunity' } });
    }
    next(err);
  }
}

export async function updateInterview(req, res, next) {
  try {
    const { interviewId } = req.params;
    const interview = await careerService.updateInterview(interviewId, req.user.id, req.validatedBody);
    if (!interview) return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Interview not found' } });
    return res.status(200).json({ success: true, message: 'Interview updated', data: interview });
  } catch (err) {
    if (err.message === 'FORBIDDEN_NOT_OWNER') {
      return res.status(403).json({ success: false, error: { code: 'FORBIDDEN', message: 'Not authorized to update this interview' } });
    }
    next(err);
  }
}

export async function createOffer(req, res, next) {
  try {
    const { applicationId } = req.params;
    const offer = await careerService.createOffer(req.user.id, applicationId, req.validatedBody);
    return res.status(201).json({ success: true, message: 'Offer extended successfully', data: offer });
  } catch (err) {
    if (err.message === 'APPLICATION_NOT_FOUND') {
      return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Application not found' } });
    }
    if (err.message === 'FORBIDDEN_NOT_OWNER') {
      return res.status(403).json({ success: false, error: { code: 'FORBIDDEN', message: 'Not authorized to extend offers for this opportunity' } });
    }
    if (err.message === 'POSITIONS_FULL') {
      return res.status(400).json({ success: false, error: { code: 'POSITIONS_FULL', message: 'All open positions for this opportunity have already been filled' } });
    }
    if (err.message === 'OFFER_ALREADY_EXISTS') {
      return res.status(409).json({ success: false, error: { code: 'OFFER_EXISTS', message: 'An offer has already been extended for this application' } });
    }
    next(err);
  }
}

export async function respondToOffer(req, res, next) {
  try {
    const { offerId } = req.params;
    const offer = await careerService.respondToOffer(req.user.id, offerId, req.validatedBody);
    if (!offer) return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Offer not found' } });
    return res.status(200).json({ success: true, message: `Offer ${req.validatedBody.status.toLowerCase()}`, data: offer });
  } catch (err) {
    if (err.message === 'FORBIDDEN_NOT_OWNER') {
      return res.status(403).json({ success: false, error: { code: 'FORBIDDEN', message: 'Not authorized to respond to this offer' } });
    }
    if (err.message === 'OFFER_ALREADY_RESOLVED') {
      return res.status(400).json({ success: false, error: { code: 'RESOLVED', message: 'This offer has already been accepted or declined' } });
    }
    if (err.message === 'POSITIONS_FULL') {
      return res.status(400).json({ success: false, error: { code: 'POSITIONS_FULL', message: 'Cannot accept offer: positions are full' } });
    }
    next(err);
  }
}

// ============================================================================
// MODULE 3G: ADMIN MODERATION & OVERSIGHT
// ============================================================================

export async function getAdminOverview(req, res, next) {
  try {
    const overview = await careerService.getAdminRecruitmentOverview();
    return res.status(200).json({ success: true, data: overview });
  } catch (err) {
    next(err);
  }
}

export async function moderateOpportunity(req, res, next) {
  try {
    const { id } = req.params;
    const { status, isOpen } = req.body;
    const opp = await careerService.moderateOpportunity(id, { status, isOpen });
    return res.status(200).json({ success: true, message: 'Opportunity moderation updated', data: opp });
  } catch (err) {
    next(err);
  }
}
