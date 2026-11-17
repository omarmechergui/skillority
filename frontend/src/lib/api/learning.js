import api from '../apiClient';

export const learningApi = {
  enroll: (courseId) => api.post(`/learning/enroll/${courseId}`, {}),
  getMyEnrollments: () => api.get('/learning/my-courses'),
  completeLesson: (courseId, lessonId) =>
    api.post(`/learning/courses/${courseId}/lessons/${lessonId}/complete`, {}),
  unlockChapter: (courseId, chapterId) =>
    api.post(`/learning/courses/${courseId}/chapters/${chapterId}/unlock`, {}),
};

export default learningApi;
