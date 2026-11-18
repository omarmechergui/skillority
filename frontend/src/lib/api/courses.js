import api from '../apiClient';

export const coursesApi = {
  getCourses: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return api.get(`/courses${query ? `?${query}` : ''}`, { requiresAuth: false });
  },
  getCourse: (id) => api.get(`/courses/${id}`, { requiresAuth: false }),
  createCourse: (data) => api.post('/courses', data),
  updateCourse: (id, data) => api.put(`/courses/${id}`, data),
  deleteCourse: (id) => api.delete(`/courses/${id}`),
  addChapter: (courseId, data) => api.post(`/courses/${courseId}/chapters`, data),
  addLesson: (chapterId, data) => api.post(`/courses/chapters/${chapterId}/lessons`, data),
  submitForReview: (courseId) => api.post(`/courses/${courseId}/submit-review`, {}),
};

export default coursesApi;
