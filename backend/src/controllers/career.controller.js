import * as careerService from '../services/career.service.js';

export async function listOpportunities(req, res, next) {
  try {
    const { type, location, search, page, limit } = req.query;
    const result = await careerService.listOpportunities({
      type,
      location,
      search,
      page: Number(page) || 1,
      limit: Number(limit) || 10,
    });
    return res.status(200).json({ success: true, data: result.opportunities, meta: result });
  } catch (err) {
    next(err);
  }
}

export async function getOpportunity(req, res, next) {
  try {
    const opp = await careerService.getOpportunityById(req.params.id);
    if (!opp) return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Opportunity not found' } });
    return res.status(200).json({ success: true, data: opp });
  } catch (err) {
    next(err);
  }
}

export async function createOpportunity(req, res, next) {
  try {
    const opp = await careerService.createOpportunity(req.user.id, req.validatedBody);
    return res.status(201).json({ success: true, message: 'Opportunity posted', data: opp });
  } catch (err) {
    next(err);
  }
}

export async function apply(req, res, next) {
  try {
    const { opportunityId } = req.params;
    const { notes } = req.body;
    const application = await careerService.applyToOpportunity(req.user.id, opportunityId, notes);
    return res.status(201).json({ success: true, message: 'Application submitted', data: application });
  } catch (err) {
    if (err.code === 'P2002' || err.message?.includes('Unique constraint')) {
      return res.status(409).json({ success: false, error: { code: 'ALREADY_APPLIED', message: 'You have already applied to this opportunity' } });
    }
    if (err.message === 'OPPORTUNITY_NOT_AVAILABLE') {
      return res.status(400).json({ success: false, error: { code: 'UNAVAILABLE', message: 'Opportunity is closed or invalid' } });
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

export async function getCompanyApplications(req, res, next) {
  try {
    const applications = await careerService.getCompanyApplications(req.user.id);
    return res.status(200).json({ success: true, data: applications });
  } catch (err) {
    next(err);
  }
}

export async function updateApplicationStatus(req, res, next) {
  try {
    const { applicationId } = req.params;
    const { status, notes } = req.validatedBody;
    const updated = await careerService.updateApplicationStatus(applicationId, req.user.id, status, notes);
    if (!updated) return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Application not found' } });
    return res.status(200).json({ success: true, message: 'Status updated', data: updated });
  } catch (err) {
    if (err.message === 'FORBIDDEN_NOT_OWNER') {
      return res.status(403).json({ success: false, error: { code: 'FORBIDDEN', message: 'Not authorized to modify this application' } });
    }
    next(err);
  }
}
