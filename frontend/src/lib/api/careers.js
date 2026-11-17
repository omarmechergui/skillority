import api from '../apiClient';

export const careerApi = {
  getOpportunities: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return api.get(`/careers/opportunities${query ? `?${query}` : ''}`, { requiresAuth: false });
  },
  getOpportunity: (id) => api.get(`/careers/opportunities/${id}`, { requiresAuth: false }),
  createOpportunity: (data) => api.post('/careers/opportunities', data),
  applyToOpportunity: (id, coverNote) =>
    api.post(`/careers/opportunities/${id}/apply`, { coverNote }),
  getMyApplications: () => api.get('/careers/applications/my'),
  getCompanyApplications: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return api.get(`/careers/applications/company${query ? `?${query}` : ''}`);
  },
  updateApplicationStatus: (id, status, notes) =>
    api.patch(`/careers/applications/${id}/status`, { status, notes }),
};

export default careerApi;
