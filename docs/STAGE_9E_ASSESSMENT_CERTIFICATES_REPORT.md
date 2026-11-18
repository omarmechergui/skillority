# STAGE 9E — FINAL ASSESSMENT & CERTIFICATES REPORT

**Project**: Skillority  
**Milestone**: Stage 9E — Full Frontend-Backend Integration  
**Date**: November 17, 2026  
**Auditor / Implementer**: Senior Full-Stack Integration & QA Engineer  
**Status**: **100% VERIFIED & COMPLETED**

---

## 1. Objective
Connect the Final Course Assessment exam runner, server-side score calculation, assessment attempt tracking, separate Certificate issuance (Final Assessment Credential vs Course Completion Credential), and public verification routes to real MongoDB Atlas persistence via Prisma ORM.

---

## 2. Initial State & Root Cause
* **Initial State**: On `/student/courses/[id]/assessment`, submitting the exam evaluated answers in a client-side JavaScript loop (`calculateScore`), displayed a prototype banner ("Sample Demo ID: SKL-2026-CERT-DEMO"), and did not save any credential or attempt record to the database.
* **Root Cause**: The exam runner UI was implemented as an interactive prototype before the backend `/api/assessments/courses/:courseId/submit` endpoint was wired.

---

## 3. Files Inspected & Modified

### Files Inspected:
* `frontend/src/app/(student)/student/courses/[id]/assessment/page.jsx`
* `frontend/src/lib/api/assessments.js`
* `backend/src/routes/assessment.routes.js`
* `backend/src/controllers/assessment.controller.js`
* `backend/src/services/assessment.service.js`
* `backend/prisma/schema.prisma`

### Files Modified:
1. [assessments.js](file:///C:/Users/USER/Desktop/skillority/frontend/src/lib/api/assessments.js): Corrected route paths for completion certificate claims (`/courses/:courseId/claim-completion`), certificate listing (`/my-certificates`), and public verification (`/verify/:credentialId`).
2. [assessment/page.jsx](file:///C:/Users/USER/Desktop/skillority/frontend/src/app/(student)/student/courses/[id]/assessment/page.jsx): Replaced client-only submit handler with `assessmentApi.submitAssessment(courseId, answers)`. Connected the certificate result view to live server response data displaying the actual cryptographic `credentialId` and link to public verification.

---

## 4. API & Database Specifications
* **Assessment Submission Endpoint**: `POST /api/assessments/courses/:courseId/submit`
* **Public Verification Endpoint**: `GET /api/assessments/verify/:credentialId`
* **Authentication**: Required for submission (`requireAuth`, Role: `STUDENT`); Public for verification.
* **Payload**: `{ answers: { [questionId]: selectedOption } }`
* **Certificate Rules & Types**:
  1. `FINAL_ASSESSMENT`: Minted automatically upon scoring $\ge$ passing threshold (e.g. 75%) with unique ID `SKL-ASSESS-[HEX]`.
  2. `COURSE_COMPLETION`: Claimed independently when `enrollment.progressPercent === 100` with unique ID `SKL-COMPL-[HEX]`.
* **Database Models Involved**:
  * `AssessmentAttempt`: Records `userId`, `courseId`, `score`, `passed`, `certificateIssued`.
  * `Certificate`: Records `recipientId`, `courseId`, `type`, `credentialId`, `issuedAt`.

---

## 5. Security & Persistence Verification

A live automated verification script was executed against the database and server endpoints:

| Verification Check | Target Role / Action | Expected Result | Actual Result | Status |
|---|---|---|---|---|
| **A. Unauthenticated Submit** | Anonymous POST to `/courses/:id/submit` | `401 UNAUTHORIZED` | `401` returned | ✅ **PASS** |
| **B. Failing Submission** | Student submits answers scoring < 75% | `200 OK`, `passed: false`, `certificate: null` | `200` returned, Passed: false, Cert: null | ✅ **PASS** |
| **C. Passing Submission** | Student submits answers scoring 100% | `200 OK`, `passed: true`, `certificate.credentialId` generated | `200` returned, Credential ID: `SKL-ASSESS-1B67B5B9` | ✅ **PASS** |
| **D. Public Verification** | Anonymous GET `/verify/SKL-ASSESS-1B67B5B9` | `200 OK`, returns recipient & course details | `200` returned, Verified Recipient and Course | ✅ **PASS** |
| **E. Database Verification** | Query `AssessmentAttempt` and `Certificate` | Attempt count: 2, Certificate count: 1 | Verified in MongoDB Atlas | ✅ **PASS** |
| **F. Teardown & Hygiene** | Cleanup test users, course, attempts, and certificate | All test records deleted | Verified clean | ✅ **PASS** |

---

## 6. Stage 9E Verdict
* **Stage Status**: **COMPLETE & VERIFIED (100% PASS)**
* **Remaining Blockers for 9E**: **NONE**
