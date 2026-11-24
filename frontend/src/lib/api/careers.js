import api from '../apiClient.js';

export const careerApi = {
  // --------------------------------------------------------------------------
  // MODULE 3A: CAREER PATHS & STUDENT GOALS
  // --------------------------------------------------------------------------
  getCareerPaths: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return api.get(`/careers/paths${query ? `?${query}` : ''}`, { requiresAuth: false });
  },
  getCareerPath: (slug) =>
    api.get(`/careers/paths/${slug}`, { requiresAuth: false }),
  getMyCareerGoals: () =>
    api.get('/careers/goals'),
  setCareerGoal: (data) =>
    api.post('/careers/goals', data),
  deleteCareerGoal: (careerPathId) =>
    api.delete(`/careers/goals/${careerPathId}`),
  getCareerProgress: (careerPathId) =>
    api.get(`/careers/progress/${careerPathId}`),
  createCareerPath: (data) =>
    api.post('/careers/paths', data),
  updateCareerPath: (id, data) =>
    api.patch(`/careers/paths/${id}`, data),
  deleteCareerPath: (id) =>
    api.delete(`/careers/paths/${id}`),

  // --------------------------------------------------------------------------
  // MODULE 3B: INTERNSHIPS & OPPORTUNITIES MARKETPLACE
  // --------------------------------------------------------------------------
  getOpportunities: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return api.get(`/careers/opportunities${query ? `?${query}` : ''}`, { requiresAuth: false });
  },
  getOpportunity: (id) =>
    api.get(`/careers/opportunities/${id}`, { requiresAuth: false }),
  createOpportunity: (data) =>
    api.post('/careers/opportunities', data),
  updateOpportunity: (id, data) =>
    api.patch(`/careers/opportunities/${id}`, data),
  closeOpportunity: (id) =>
    api.post(`/careers/opportunities/${id}/close`, {}),

  // --------------------------------------------------------------------------
  // MODULE 3C: STUDENT APPLICATIONS
  // --------------------------------------------------------------------------
  applyToOpportunity: (id, payload) => {
    const body = typeof payload === 'string' ? { notes: payload, coverLetter: payload } : payload;
    return api.post(`/careers/opportunities/${id}/apply`, body);
  },
  getMyApplications: () =>
    api.get('/careers/my-applications'),
  withdrawApplication: (applicationId, reason = '') =>
    api.post(`/careers/applications/${applicationId}/withdraw`, { reason }),

  // --------------------------------------------------------------------------
  // MODULE 3D: COMPANY RECRUITMENT MANAGEMENT
  // --------------------------------------------------------------------------
  getCompanyDashboardMetrics: () =>
    api.get('/careers/company/dashboard'),
  getCompanyApplications: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return api.get(`/careers/applications${query ? `?${query}` : ''}`);
  },
  getCompanyApplicationDetails: (applicationId) =>
    api.get(`/careers/applications/${applicationId}`),
  evaluateCandidate: (applicationId, data) =>
    api.post(`/careers/applications/${applicationId}/evaluate`, data),
  updateApplicationStatus: (id, status, notes = null, internalNotes = null) =>
    api.patch(`/careers/applications/${id}/status`, { status, notes, internalNotes }),

  // --------------------------------------------------------------------------
  // MODULE 3F: INTERVIEWS & OFFERS
  // --------------------------------------------------------------------------
  scheduleInterview: (applicationId, data) =>
    api.post(`/careers/applications/${applicationId}/interviews`, data),
  updateInterview: (interviewId, data) =>
    api.patch(`/careers/interviews/${interviewId}`, data),
  createOffer: (applicationId, data) =>
    api.post(`/careers/applications/${applicationId}/offers`, data),
  respondToOffer: (offerId, data) =>
    api.post(`/careers/offers/${offerId}/respond`, data),

  // --------------------------------------------------------------------------
  // MODULE 3G: ADMIN MODERATION
  // --------------------------------------------------------------------------
  getAdminRecruitmentOverview: () =>
    api.get('/careers/admin/overview'),
  moderateOpportunity: (id, data) =>
    api.patch(`/careers/admin/opportunities/${id}/moderate`, data),
};

export default careerApi;
