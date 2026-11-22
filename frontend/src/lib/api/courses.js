import api from '../apiClient.js';

export const coursesApi = {
  getCourses: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return api.get(`/courses${query ? `?${query}` : ''}`, { requiresAuth: false });
  },
  getCourse: (id, params = {}) => {
    const query = new URLSearchParams(params).toString();
    return api.get(`/courses/${id}${query ? `?${query}` : ''}`, { requiresAuth: false });
  },
  createCourse: (data) => api.post('/courses', data),
  updateCourse: (id, data) => api.patch(`/courses/${id}`, data),
  deleteCourse: (id) => api.delete(`/courses/${id}`),
  addChapter: (courseId, data) => api.post(`/courses/${courseId}/chapters`, data),
  updateChapter: (chapterId, data) => api.patch(`/courses/chapters/${chapterId}`, data),
  addLesson: (chapterId, data) => api.post(`/courses/chapters/${chapterId}/lessons`, data),
  updateLesson: (lessonId, data) => api.patch(`/courses/lessons/${lessonId}`, data),
  submitForReview: (courseId) => api.post(`/courses/${courseId}/submit-review`, {}),
};

export default coursesApi;
