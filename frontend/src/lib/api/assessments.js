import api from '../apiClient';

export const assessmentApi = {
  submitQuiz: (chapterId, answers) =>
    api.post(`/assessments/quizzes/${chapterId}/submit`, { answers }),
  submitAssessment: (courseId, answers) =>
    api.post(`/assessments/courses/${courseId}/submit`, { answers }),
  claimCompletionCertificate: (courseId) =>
    api.post(`/assessments/courses/${courseId}/claim-completion`, {}),
  getMyCertificates: () => api.get('/assessments/my-certificates'),
  verifyCertificate: (credentialId) =>
    api.get(`/assessments/verify/${credentialId}`, { requiresAuth: false }),
};

export default assessmentApi;
