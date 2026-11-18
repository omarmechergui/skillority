# STAGE 9A — INSTRUCTOR COURSE CREATION REPORT

**Project**: Skillority  
**Milestone**: Stage 9A — Full Frontend-Backend Integration  
**Date**: November 17, 2026  
**Auditor / Implementer**: Senior Full-Stack Integration & QA Engineer  
**Status**: **100% VERIFIED & COMPLETED**

---

## 1. Objective
Connect the existing Instructor Course Creation workflow to the live Express backend API and MongoDB Atlas database via Prisma ORM, replacing the client-only `handleSubmit` redirect with live data persistence, proper loading/validation/error states, duplicate submission prevention, and strict RBAC enforcement.

---

## 2. Initial State & Root Cause
* **Initial State**: Submitting the course form on `/instructor/courses/create` intercepted the submit event via `e.preventDefault()` and called `router.push('/instructor/courses')` without issuing any HTTP request or validating payload constraints against the backend.
* **Root Cause**: The view was an interactive UI prototype that had not yet been wired to `frontend/src/lib/api/courses.js`. Additionally, the frontend courses API module contained a path mismatch (`/courses/:id/review-request` instead of `/courses/:id/submit-review`), and the backend course query lacked support for filtering by `instructorId` and `status: 'ALL'`.

---

## 3. Files Inspected & Modified

### Files Inspected:
* `frontend/src/app/(instructor)/instructor/courses/create/page.jsx`
* `frontend/src/app/(instructor)/instructor/courses/page.jsx`
* `frontend/src/lib/api/courses.js`
* `backend/src/routes/course.routes.js`
* `backend/src/controllers/course.controller.js`
* `backend/src/services/course.service.js`
* `backend/src/validators/course.validators.js`

### Files Modified:
1. [courses.js](file:///C:/Users/USER/Desktop/skillority/frontend/src/lib/api/courses.js): Fixed `submitForReview` endpoint path from `/review-request` to `/submit-review`.
2. [course.controller.js](file:///C:/Users/USER/Desktop/skillority/backend/src/controllers/course.controller.js): Expanded `listCourses` query parser to accept `status` and `instructorId` filters.
3. [course.service.js](file:///C:/Users/USER/Desktop/skillority/backend/src/services/course.service.js): Updated `listCourses` Prisma query to filter by `instructorId` and allow `status !== 'ALL'` for instructor course authoring views.
4. [create/page.jsx](file:///C:/Users/USER/Desktop/skillority/frontend/src/app/(instructor)/instructor/courses/create/page.jsx): Wired form submission to `coursesApi.createCourse()`, added loading spinner, disabled inputs during request, error alert banners, and programmatic navigation to the curriculum editor using the returned course ID (`/instructor/courses/${res.data.id}/curriculum`).
5. [courses/page.jsx](file:///C:/Users/USER/Desktop/skillority/frontend/src/app/(instructor)/instructor/courses/page.jsx): Connected live course fetching using `user.id` and `status: 'ALL'`, added empty state UI for new instructors with zero courses.

---

## 4. API & Database Specifications
* **Endpoint Used**: `POST /api/courses`
* **Authentication**: Required (`requireAuth`, Bearer JWT or Cookie)
* **RBAC Allowed**: `INSTRUCTOR`, `ADMIN` (Rejects `STUDENT` and `COMPANY` with 403)
* **Payload Schema (Zod)**:
  * `title`: String, min 5, max 100 characters.
  * `description`: String, min 10, max 2000 characters.
  * `category`: String, min 2 characters.
  * `level`: String (`Beginner`, `Intermediate`, `Advanced`).
  * `tags`: Array of strings.
* **Database Model**: `Course` in MongoDB Atlas:
  * Status set to `DRAFT` upon creation (Admin review required before publication).
  * Linked to authenticated instructor `instructorId`.

---

## 5. Security & Persistence Verification

A live automated verification script was executed against the running database and server endpoints:

| Verification Check | Target Role / Action | Expected Result | Actual Result | Status |
|---|---|---|---|---|
| **A. Unauthenticated Attempt** | Anonymous POST to `/api/courses` | `401 UNAUTHORIZED` | `401` returned | ✅ **PASS** |
| **B. Student Role RBAC** | Authenticated `STUDENT` token | `403 FORBIDDEN` | `403` returned | ✅ **PASS** |
| **C. Invalid Payload** | Title < 5 chars, Description < 10 | `400 VALIDATION_ERROR` | `400` returned with field errors | ✅ **PASS** |
| **D. Valid Instructor Creation** | Authenticated `INSTRUCTOR` token | `201 CREATED`, `status: DRAFT` | `201` returned, ID created | ✅ **PASS** |
| **E. MongoDB Persistence** | Direct `prisma.course.findUnique()` | Course record exists with `DRAFT` | Verified in MongoDB Atlas | ✅ **PASS** |
| **F. Teardown & Hygiene** | Cleanup test user and course | All test records deleted | Verified clean | ✅ **PASS** |

---

## 6. Stage 9A Verdict
* **Stage Status**: **COMPLETE & VERIFIED (100% PASS)**
* **Remaining Blockers for 9A**: **NONE**
