import * as learningService from '../services/learning.service.js';

export async function enroll(req, res, next) {
  try {
    const { courseId } = req.params;
    const enrollment = await learningService.enrollInCourse(req.user.id, courseId);
    return res.status(201).json({ success: true, message: 'Enrolled successfully', data: enrollment });
  } catch (err) {
    if (err.message === 'COURSE_NOT_FOUND') return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: err.message } });
    if (err.message === 'COURSE_NOT_AVAILABLE') return res.status(400).json({ success: false, error: { code: 'UNAVAILABLE', message: err.message } });
    next(err);
  }
}

export async function getMyEnrollments(req, res, next) {
  try {
    const enrollments = await learningService.getStudentEnrollments(req.user.id);
    return res.status(200).json({ success: true, data: enrollments });
  } catch (err) {
    next(err);
  }
}

export async function completeLesson(req, res, next) {
  try {
    const { courseId, lessonId } = req.params;
    const result = await learningService.markLessonComplete(req.user.id, courseId, lessonId);
    return res.status(200).json({ success: true, message: 'Lesson progress marked', data: result });
  } catch (err) {
    if (err.message === 'NOT_ENROLLED') return res.status(403).json({ success: false, error: { code: 'NOT_ENROLLED', message: err.message } });
    if (err.message === 'CHAPTER_LOCKED_REQUIRES_COINS') {
      return res.status(402).json({ success: false, error: { code: 'PAYMENT_REQUIRED', message: 'Chapter requires coin unlock' } });
    }
    next(err);
  }
}

export async function unlockChapter(req, res, next) {
  try {
    const { courseId, chapterId } = req.params;
    const result = await learningService.unlockChapterWithCoins(req.user.id, courseId, chapterId);
    return res.status(200).json({ success: true, message: 'Chapter unlocked', data: result });
  } catch (err) {
    if (err.message === 'INSUFFICIENT_COINS') {
      return res.status(400).json({ success: false, error: { code: 'INSUFFICIENT_COINS', message: 'Wallet balance is insufficient' } });
    }
    next(err);
  }
}
