import * as courseService from '../services/course.service.js';

export async function listCourses(req, res, next) {
  try {
    const { category, level, search, status, instructorId, page, limit } = req.query;
    const result = await courseService.listCourses({
      category,
      level,
      search,
      status: status || 'PUBLISHED',
      instructorId,
      page: Number(page) || 1,
      limit: Number(limit) || 10,
    });
    return res.status(200).json({ success: true, data: result.courses, meta: result });
  } catch (err) {
    next(err);
  }
}

export async function getCourse(req, res, next) {
  try {
    const includeFull = req.query.includeContent === 'true' || req.query.includeCurriculum === 'true';
    const course = await courseService.getCourseById(req.params.id, includeFull);
    if (!course) {
      return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Course not found' } });
    }
    return res.status(200).json({ success: true, data: course });
  } catch (err) {
    next(err);
  }
}

export async function createCourse(req, res, next) {
  try {
    const course = await courseService.createCourse(req.user.id, req.validatedBody);
    return res.status(201).json({ success: true, message: 'Course created as draft', data: course });
  } catch (err) {
    next(err);
  }
}

export async function updateCourse(req, res, next) {
  try {
    const course = await courseService.updateCourse(
      req.params.id,
      req.user.id,
      req.validatedBody,
      req.user.role === 'ADMIN'
    );
    if (!course) return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Course not found' } });
    return res.status(200).json({ success: true, message: 'Course updated', data: course });
  } catch (err) {
    if (err.message === 'FORBIDDEN_NOT_OWNER') {
      return res.status(403).json({ success: false, error: { code: 'FORBIDDEN', message: 'Not authorized to edit this course' } });
    }
    next(err);
  }
}

export async function deleteCourse(req, res, next) {
  try {
    const result = await courseService.deleteCourse(
      req.params.id,
      req.user.id,
      req.user.role === 'ADMIN'
    );
    if (!result) return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Course not found' } });
    return res.status(200).json({ success: true, message: 'Course deleted successfully' });
  } catch (err) {
    if (err.message === 'FORBIDDEN_NOT_OWNER') {
      return res.status(403).json({ success: false, error: { code: 'FORBIDDEN', message: 'Not authorized to delete this course' } });
    }
    next(err);
  }
}

export async function updateChapter(req, res, next) {
  try {
    const chapter = await courseService.updateChapter(
      req.params.chapterId,
      req.user.id,
      req.validatedBody,
      req.user.role === 'ADMIN'
    );
    if (!chapter) return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Chapter not found' } });
    return res.status(200).json({ success: true, message: 'Chapter updated', data: chapter });
  } catch (err) {
    if (err.message === 'FORBIDDEN_NOT_OWNER') {
      return res.status(403).json({ success: false, error: { code: 'FORBIDDEN', message: 'Not authorized to modify this chapter' } });
    }
    next(err);
  }
}

export async function updateLesson(req, res, next) {
  try {
    const lesson = await courseService.updateLesson(
      req.params.lessonId,
      req.user.id,
      req.validatedBody,
      req.user.role === 'ADMIN'
    );
    if (!lesson) return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Lesson not found' } });
    return res.status(200).json({ success: true, message: 'Lesson updated', data: lesson });
  } catch (err) {
    if (err.message === 'FORBIDDEN_NOT_OWNER') {
      return res.status(403).json({ success: false, error: { code: 'FORBIDDEN', message: 'Not authorized to modify this lesson' } });
    }
    next(err);
  }
}

export async function addChapter(req, res, next) {
  try {
    const chapter = await courseService.addChapter(req.params.id, req.user.id, req.validatedBody);
    return res.status(201).json({ success: true, message: 'Chapter added', data: chapter });
  } catch (err) {
    if (err.message === 'FORBIDDEN_NOT_OWNER') {
      return res.status(403).json({ success: false, error: { code: 'FORBIDDEN', message: 'Not authorized to modify this course' } });
    }
    next(err);
  }
}

export async function addLesson(req, res, next) {
  try {
    const lesson = await courseService.addLesson(req.params.chapterId, req.user.id, req.validatedBody);
    return res.status(201).json({ success: true, message: 'Lesson added', data: lesson });
  } catch (err) {
    if (err.message === 'FORBIDDEN_NOT_OWNER') {
      return res.status(403).json({ success: false, error: { code: 'FORBIDDEN', message: 'Not authorized to modify this chapter' } });
    }
    next(err);
  }
}

export async function submitForReview(req, res, next) {
  try {
    const course = await courseService.submitForReview(req.params.id, req.user.id);
    return res.status(200).json({ success: true, message: 'Course submitted for Admin review', data: course });
  } catch (err) {
    if (err.message === 'FORBIDDEN_NOT_OWNER') {
      return res.status(403).json({ success: false, error: { code: 'FORBIDDEN', message: 'Not authorized' } });
    }
    if (err.message.startsWith('CANNOT_SUBMIT_EMPTY_COURSE')) {
      return res.status(400).json({ success: false, error: { code: 'EMPTY_COURSE', message: err.message } });
    }
    next(err);
  }
}

export async function reviewDecision(req, res, next) {
  try {
    const course = await courseService.reviewCourseDecision(req.params.id, req.validatedBody);
    return res.status(200).json({ success: true, message: `Course status updated to ${req.validatedBody.status}`, data: course });
  } catch (err) {
    next(err);
  }
}
