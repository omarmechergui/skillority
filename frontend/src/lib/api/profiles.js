import api from '../apiClient.js';

export const profileApi = {
  getMyProfile: () => api.get('/profiles/me'),
  updateMyProfile: (data) => api.patch('/profiles/me', data),
  getPublicProfile: (id) => api.get(`/profiles/${id}`),
  completeStudentOnboarding: (data) => api.post('/auth/onboarding/student', data),
  completeCompanyOnboarding: (data) => api.post('/auth/onboarding/company', data),
  completeInstructorOnboarding: (data) => api.post('/auth/onboarding/instructor', data),
};

export default profileApi;

