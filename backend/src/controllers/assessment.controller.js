import * as assessmentService from '../services/assessment.service.js';

export async function submitQuiz(req, res, next) {
  try {
    const { chapterId } = req.params;
    const { answers } = req.body;
    const result = await assessmentService.submitChapterQuiz(req.user.id, chapterId, answers || {});
    return res.status(200).json({ success: true, message: result.passed ? 'Quiz Passed!' : 'Quiz not passed', data: result });
  } catch (err) {
    if (err.message === 'CHAPTER_NOT_FOUND') return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: err.message } });
    if (err.message?.startsWith('NOT_ENROLLED')) return res.status(403).json({ success: false, error: { code: 'NOT_ENROLLED', message: err.message } });
    if (err.message?.startsWith('INVALID_QUIZ')) return res.status(400).json({ success: false, error: { code: 'INVALID_QUIZ', message: err.message } });
    next(err);
  }
}

export async function submitAssessment(req, res, next) {
  try {
    const { courseId } = req.params;
    const { answers } = req.body;
    const result = await assessmentService.submitFinalAssessment(req.user.id, courseId, answers || {});
    return res.status(200).json({
      success: true,
      message: result.passed ? 'Assessment Passed! Certificate issued.' : 'Assessment not passed',
      data: result,
    });
  } catch (err) {
    if (err.message === 'COURSE_NOT_FOUND') return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: err.message } });
    if (err.message?.startsWith('NOT_ENROLLED')) return res.status(403).json({ success: false, error: { code: 'NOT_ENROLLED', message: err.message } });
    if (err.message?.startsWith('INVALID_ASSESSMENT')) return res.status(400).json({ success: false, error: { code: 'INVALID_ASSESSMENT', message: err.message } });
    next(err);
  }
}

export async function claimCompletionCertificate(req, res, next) {
  try {
    const { courseId } = req.params;
    const cert = await assessmentService.issueCourseCompletionCertificate(req.user.id, courseId);
    return res.status(201).json({ success: true, message: 'Course completion certificate issued', data: cert });
  } catch (err) {
    if (err.message === 'COURSE_INCOMPLETE') {
      return res.status(400).json({ success: false, error: { code: 'INCOMPLETE', message: 'You must complete 100% of lessons first' } });
    }
    next(err);
  }
}

export async function getCertificates(req, res, next) {
  try {
    const certs = await assessmentService.getUserCertificates(req.user.id);
    return res.status(200).json({ success: true, data: certs });
  } catch (err) {
    next(err);
  }
}

export async function verifyCertificate(req, res, next) {
  try {
    const { credentialId } = req.params;
    const cert = await assessmentService.verifyCertificateByCredential(credentialId);
    if (!cert) return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Invalid certificate ID' } });
    return res.status(200).json({ success: true, data: cert });
  } catch (err) {
    next(err);
  }
}
