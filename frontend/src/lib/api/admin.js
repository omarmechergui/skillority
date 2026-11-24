import api from '../apiClient.js';

export const adminApi = {
  getStats: () => api.get('/admin/stats'),
  getUsers: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return api.get(`/admin/users${query ? `?${query}` : ''}`);
  },
  updateUserStatus: (id, isActive) =>
    api.patch(`/admin/users/${id}/status`, { isActive }),
  getCourseReviews: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return api.get(`/admin/courses/reviews${query ? `?${query}` : ''}`);
  },
  decideCourseReview: (courseId, status, reviewNote) =>
    api.post(`/courses/${courseId}/review-decision`, { status, reviewNote }),
  inviteInstructor: (email) =>
    api.post('/auth/admin/instructors/invite', { email }),
};

export default adminApi;
