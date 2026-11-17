import api from '../apiClient';

export const assessmentApi = {
  submitQuiz: (chapterId, answers) =>
    api.post(`/assessments/quizzes/${chapterId}/submit`, { answers }),
  submitAssessment: (courseId, answers) =>
    api.post(`/assessments/courses/${courseId}/submit`, { answers }),
  claimCompletionCertificate: (courseId) =>
    api.post(`/assessments/certificates/completion/${courseId}`, {}),
  getMyCertificates: () => api.get('/assessments/certificates/my'),
  verifyCertificate: (credentialId) =>
    api.get(`/assessments/certificates/verify/${credentialId}`, { requiresAuth: false }),
};

export default assessmentApi;
