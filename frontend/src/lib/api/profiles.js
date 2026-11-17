import api from '../apiClient';

export const profileApi = {
  getMyProfile: () => api.get('/profiles/me'),
  updateMyProfile: (data) => api.put('/profiles/me', data),
  getPublicProfile: (id) => api.get(`/profiles/${id}`, { requiresAuth: false }),
};

export default profileApi;
