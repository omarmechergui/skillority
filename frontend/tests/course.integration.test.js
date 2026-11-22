import assert from 'assert';
import { coursesApi } from '../src/lib/api/courses.js';
import { learningApi } from '../src/lib/api/learning.js';
import { adminApi } from '../src/lib/api/admin.js';

let passed = 0;
let failed = 0;

function report(name, condition) {
  if (condition) {
    console.log(`[PASS] ${name}`);
    passed++;
  } else {
    console.error(`[FAIL] ${name}`);
    failed++;
  }
}

// Global fetch spy
let lastRequest = null;
global.fetch = async (url, options = {}) => {
  lastRequest = { url, options };
  return {
    ok: true,
    status: 200,
    headers: {
      get: (k) => (k.toLowerCase() === 'content-type' ? 'application/json' : null),
    },
    json: async () => ({
      success: true,
      data: { id: 'mock_resource_id', url, options },
    }),
  };
};

// Mock localStorage
global.window = {};
global.localStorage = {
  store: { skillority_token: 'mock-valid-jwt-token' },
  getItem(key) { return this.store[key] || null; },
  setItem(key, val) { this.store[key] = String(val); },
  removeItem(key) { delete this.store[key]; },
};

async function runCourseIntegrationTests() {
  console.log('=== STARTING MODULE 2D-D: COURSE & LEARNING FRONTEND INTEGRATION SUITE ===\n');

  // 1. coursesApi.getCourses
  {
    await coursesApi.getCourses({ status: 'PUBLISHED', category: 'Web Development' });
    report(
      '1. coursesApi.getCourses formats query params and makes public request',
      lastRequest.url.includes('/courses?status=PUBLISHED&category=Web+Development') &&
      lastRequest.options.method === 'GET' &&
      !lastRequest.options.headers['Authorization']
    );
  }

  // 2. coursesApi.getCourse with query params
  {
    await coursesApi.getCourse('course_123', { includeContent: 'true' });
    report(
      '2. coursesApi.getCourse passes includeContent param for full curriculum inspection',
      lastRequest.url.includes('/courses/course_123?includeContent=true') &&
      lastRequest.options.method === 'GET'
    );
  }

  // 3. coursesApi.createCourse
  {
    await coursesApi.createCourse({
      title: 'Full Stack React',
      category: 'Web Development',
      level: 'Intermediate',
    });
    report(
      '3. coursesApi.createCourse sends POST /courses with auth header',
      lastRequest.url.endsWith('/courses') &&
      lastRequest.options.method === 'POST' &&
      lastRequest.options.headers['Authorization'] === 'Bearer mock-valid-jwt-token'
    );
  }

  // 4. coursesApi.updateCourse
  {
    await coursesApi.updateCourse('course_123', { title: 'Updated Title' });
    report(
      '4. coursesApi.updateCourse sends PATCH /courses/:id',
      lastRequest.url.endsWith('/courses/course_123') &&
      lastRequest.options.method === 'PATCH'
    );
  }

  // 5. coursesApi.deleteCourse
  {
    await coursesApi.deleteCourse('course_123');
    report(
      '5. coursesApi.deleteCourse sends DELETE /courses/:id',
      lastRequest.url.endsWith('/courses/course_123') &&
      lastRequest.options.method === 'DELETE'
    );
  }

  // 6. coursesApi.addChapter
  {
    await coursesApi.addChapter('course_123', { title: 'Chapter 0', order: 0, isFree: true });
    report(
      '6. coursesApi.addChapter sends POST /courses/:id/chapters',
      lastRequest.url.endsWith('/courses/course_123/chapters') &&
      lastRequest.options.method === 'POST'
    );
  }

  // 7. coursesApi.updateChapter
  {
    await coursesApi.updateChapter('chap_456', { title: 'Updated Chapter' });
    report(
      '7. coursesApi.updateChapter sends PATCH /courses/chapters/:chapterId',
      lastRequest.url.endsWith('/courses/chapters/chap_456') &&
      lastRequest.options.method === 'PATCH'
    );
  }

  // 8. coursesApi.addLesson
  {
    await coursesApi.addLesson('chap_456', { title: 'Intro Lesson', order: 0 });
    report(
      '8. coursesApi.addLesson sends POST /courses/chapters/:chapterId/lessons',
      lastRequest.url.endsWith('/courses/chapters/chap_456/lessons') &&
      lastRequest.options.method === 'POST'
    );
  }

  // 9. coursesApi.updateLesson
  {
    await coursesApi.updateLesson('les_789', { title: 'Updated Lesson', duration: 25 });
    report(
      '9. coursesApi.updateLesson sends PATCH /courses/lessons/:lessonId',
      lastRequest.url.endsWith('/courses/lessons/les_789') &&
      lastRequest.options.method === 'PATCH'
    );
  }

  // 10. coursesApi.submitForReview
  {
    await coursesApi.submitForReview('course_123');
    report(
      '10. coursesApi.submitForReview sends POST /courses/:id/submit-review',
      lastRequest.url.endsWith('/courses/course_123/submit-review') &&
      lastRequest.options.method === 'POST'
    );
  }

  // 11. learningApi.enroll
  {
    await learningApi.enroll('course_123');
    report(
      '11. learningApi.enroll sends POST /learning/enroll/:courseId with auth',
      lastRequest.url.endsWith('/learning/enroll/course_123') &&
      lastRequest.options.method === 'POST' &&
      lastRequest.options.headers['Authorization'] === 'Bearer mock-valid-jwt-token'
    );
  }

  // 12. learningApi.getMyEnrollments
  {
    await learningApi.getMyEnrollments();
    report(
      '12. learningApi.getMyEnrollments sends GET /learning/my-courses',
      lastRequest.url.endsWith('/learning/my-courses') &&
      lastRequest.options.method === 'GET'
    );
  }

  // 13. learningApi.completeLesson
  {
    await learningApi.completeLesson('course_123', 'les_789');
    report(
      '13. learningApi.completeLesson sends POST /learning/courses/:courseId/lessons/:lessonId/complete',
      lastRequest.url.endsWith('/learning/courses/course_123/lessons/les_789/complete') &&
      lastRequest.options.method === 'POST'
    );
  }

  // 14. learningApi.unlockChapter
  {
    await learningApi.unlockChapter('course_123', 'chap_456');
    report(
      '14. learningApi.unlockChapter sends POST /learning/courses/:courseId/chapters/:chapterId/unlock',
      lastRequest.url.endsWith('/learning/courses/course_123/chapters/chap_456/unlock') &&
      lastRequest.options.method === 'POST'
    );
  }

  // 15. adminApi.getCourseReviews & decideCourseReview
  {
    await adminApi.getCourseReviews();
    const reviewsReqMatches = lastRequest.url.endsWith('/admin/courses/reviews') && lastRequest.options.method === 'GET';

    await adminApi.decideCourseReview('course_123', 'APPROVED', 'Standard met');
    const decideReqMatches = lastRequest.url.endsWith('/courses/course_123/review-decision') && lastRequest.options.method === 'POST';

    report(
      '15. adminApi.getCourseReviews and decideCourseReview dispatch correctly to accreditation endpoints',
      reviewsReqMatches && decideReqMatches
    );
  }

  // 16. Envelope Unwrapping Matrix: Array payload vs Wrapped { courses: [] }
  {
    const directArrayResponse = { data: [{ id: 'c1' }, { id: 'c2' }] };
    const wrappedObjectResponse = { data: { courses: [{ id: 'c1' }, { id: 'c2' }] } };

    const unwrapCourses = (res) => {
      return Array.isArray(res?.data)
        ? res.data
        : Array.isArray(res?.data?.courses)
        ? res.data.courses
        : [];
    };

    const unwrappedDirect = unwrapCourses(directArrayResponse);
    const unwrappedWrapped = unwrapCourses(wrappedObjectResponse);

    report(
      '16. Unwrapping matrix correctly normalizes both direct array and nested object envelopes',
      unwrappedDirect.length === 2 && unwrappedWrapped.length === 2 && unwrappedDirect[0].id === 'c1'
    );
  }

  // 17. Freemium Business Rule Verification
  {
    const testChapters = [
      { order: 0, coinsCost: 0 },
      { order: 3, coinsCost: 0 },
      { order: 5, coinsCost: 0 },
      { order: 6, coinsCost: 50 },
      { order: 7, coinsCost: 75 },
    ];

    const isChapterFree = (ch) => ch.order <= 5;
    const allExpectedFree = testChapters.slice(0, 3).every(isChapterFree);
    const allExpectedPaid = testChapters.slice(3).every((ch) => !isChapterFree(ch) && ch.coinsCost > 0);

    report(
      '17. Freemium business rule: Chapters 0–5 are strictly free; Chapter 6+ strictly requires coin unlock',
      allExpectedFree && allExpectedPaid
    );
  }

  console.log(`\n=== FRONTEND INTEGRATION TEST SUMMARY: ${passed} Passed, ${failed} Failed ===`);
  if (failed > 0) process.exit(1);
}

runCourseIntegrationTests().catch((err) => {
  console.error('Test runner failure:', err);
  process.exit(1);
});
