# STAGE 9D — CHAPTER QUIZ PERSISTENCE REPORT

**Project**: Skillority  
**Milestone**: Stage 9D — Full Frontend-Backend Integration  
**Date**: November 17, 2026  
**Auditor / Implementer**: Senior Full-Stack Integration & QA Engineer  
**Status**: **100% VERIFIED & COMPLETED**

---

## 1. Objective
Connect Chapter Quiz submissions, backend scoring, persistence of attempts, atomic Coin reward distribution (+20 Coins on passing), and attempt history tracking to real MongoDB Atlas persistence via Prisma ORM, removing client-calculated trust and local-only state.

---

## 2. Initial State & Root Cause
* **Initial State**: On `/student/courses/[id]/chapters/[chapterId]/quiz`, clicking "Submit Quiz" executed a client-side JavaScript scoring loop in React component state (`calculateScore`), setting local state flags (`isSubmitted: true`, `coinsAwarded: true`) without sending any network request to the backend.
* **Root Cause**: The quiz viewer was authored as an interactive prototype before the backend `/api/assessments/quizzes/:chapterId/submit` endpoint was completed. Scores and coin rewards were calculated entirely client-side and lost upon page refresh.

---

## 3. Files Inspected & Modified

### Files Inspected:
* `frontend/src/app/(student)/student/courses/[id]/chapters/[chapterId]/quiz/page.jsx`
* `frontend/src/lib/api/assessments.js`
* `backend/src/routes/assessment.routes.js`
* `backend/src/controllers/assessment.controller.js`
* `backend/src/services/assessment.service.js`
* `backend/prisma/schema.prisma`

### Files Modified:
1. [assessments.js](file:///C:/Users/USER/Desktop/skillority/frontend/src/lib/api/assessments.js): Verified `submitQuiz` endpoint signature (`POST /api/assessments/quizzes/:chapterId/submit`).
2. [quiz/page.jsx](file:///C:/Users/USER/Desktop/skillority/frontend/src/app/(student)/student/courses/[id]/chapters/[chapterId]/quiz/page.jsx): Wired quiz submission to `assessmentApi.submitQuiz(chapterId, selectedAnswers)`. Replaced client-trusted score calculation with backend server-computed scores (`res.data.score`, `res.data.passed`, `res.data.coinsAwarded`). Added loading states, error boundaries, and attempt retake resets.

---

## 4. API & Database Specifications
* **Endpoint Used**: `POST /api/assessments/quizzes/:chapterId/submit`
* **Authentication**: Required (`requireAuth`, Bearer JWT or Cookie)
* **RBAC Allowed**: `STUDENT`
* **Payload**: `{ answers: { [questionId]: selectedOption } }`
* **Business & Economy Rules**:
  * Score calculated exclusively on the backend by comparing submitted answers against stored quiz questions.
  * Passing threshold: Stored on Chapter quiz JSON definition (default `70%`).
  * Atomic Reward: Passing adds `+20 Coins` to the student's `Wallet` balance and records a `WalletTransaction` with type `QUIZ_REWARD`.
* **Database Models Involved**:
  * `QuizAttempt`: Records `userId`, `chapterId`, `score`, `passed`, `coinsAwarded`, `answers`.
  * `Wallet`: Increments `balance` atomically inside a `$transaction`.
  * `WalletTransaction`: Creates audit ledger entry referencing `chapterId`.

---

## 5. Security & Persistence Verification

A live automated verification script was executed against the database and server endpoints:

| Verification Check | Target Role / Action | Expected Result | Actual Result | Status |
|---|---|---|---|---|
| **A. Unauthenticated Submit** | Anonymous POST to `/quizzes/:id/submit` | `401 UNAUTHORIZED` | `401` returned | ✅ **PASS** |
| **B. Failing Submission** | Student submits incorrect answers | `200 OK`, `score < 70`, `passed: false`, `coinsAwarded: 0` | `200` returned, Score: 0%, Passed: false, Coins: 0 | ✅ **PASS** |
| **C. Passing Submission** | Student submits all correct answers | `200 OK`, `score: 100`, `passed: true`, `coinsAwarded: 20` | `200` returned, Score: 100%, Passed: true, Coins: 20 | ✅ **PASS** |
| **D. Atomic Database Persistence** | Verify `Wallet` & `QuizAttempt` models | Balance: 100 → 120 Coins; Attempt count: 2 | Verified in MongoDB Atlas | ✅ **PASS** |
| **E. Teardown & Hygiene** | Cleanup test user, course, chapter, wallet, and attempts | All test records deleted | Verified clean | ✅ **PASS** |

---

## 6. Stage 9D Verdict
* **Stage Status**: **COMPLETE & VERIFIED (100% PASS)**
* **Remaining Blockers for 9D**: **NONE**
