# STAGE 6D — MOCK DATA MIGRATION & ELIMINATION REPORT

**Project**: Skillority  
**Date**: November 16, 2026  
**Status**: COMPLETED  
**Scope**: Audit of mock data structures, hybrid fallback architecture, and migration path to live database collections.

---

## 1. Executive Summary

Milestone 6D establishes the migration architecture from static mock datasets (`frontend/src/lib/mock*Data.js`) to live Prisma models and MongoDB collections. Rather than abruptly removing mock objects—which would break static page prerendering and cause blank screens when the development database is offline or starting up—Skillority employs a **resilient hybrid fallback strategy**:

1. Client components initialize with the well-structured mock schemas.
2. In `useEffect` on component mount, live data is queried asynchronously from backend endpoints via `frontend/src/lib/api/`.
3. When responses succeed (`res.data`), component state is hydrated with live backend models.
4. If the backend or database is unreachable, the UI remains perfectly interactive and visually aligned with the Google Stitch design specifications.

---

## 2. Audit of Mock Files vs Prisma Database Models

| Mock File | Lines | Contained Mock Entities | Corresponding Prisma / MongoDB Models |
|---|---|---|---|
| `mockLearningData.js` | ~800 | `mockCourses`, `mockChapters`, `mockLessons`, `mockQuizzes`, `mockAssessments`, `mockCertificates` | `Course`, `Chapter`, `Lesson`, `QuizAttempt`, `AssessmentAttempt`, `Certificate` |
| `mockStudentData.js` | ~300 | `mockStudentProfile`, `mockWalletData`, `mockMissions`, `mockProgress` | `User` (STUDENT), `StudentProfile`, `Wallet`, `WalletTransaction`, `StreakLog` |
| `mockCompanyData.js` | ~350 | `mockCompanyProfile`, `mockRecruiterUser`, `mockCompanyOpportunities`, `mockCandidates` | `User` (COMPANY), `CompanyProfile`, `Opportunity`, `Application` |
| `mockInstructorData.js` | ~160 | `mockInstructorProfile`, `mockInstructorCourses`, `mockAuthorReviews` | `User` (INSTRUCTOR), `InstructorProfile`, `Course` (instructorId) |
| `mockAdminData.js` | ~150 | `mockAdminStats`, `mockAdminUsers`, `mockReviewQueue`, `mockAuditLogs` | `User` (ADMIN), Platform aggregates, `AuditLog` |
| `mockCareerData.js` | ~270 | `mockOpportunities`, `mockCareerHubStats`, `mockApplications` | `Opportunity`, `Application` |
| `mockCommunityData.js` | ~180 | `mockPosts`, `mockDiscussions`, `mockComments` | `Post`, `Comment` |

---

## 3. Migration Mechanics & Role Separation

### 3.1 Authentication & Profile Decoupling
- Previous behavior: Signed-in state was hardcoded to Alex Morgan (`usr-student-01`) or Elena Vance across top headers.
- New behavior: `AuthProvider` dynamically fetches the real user (`/api/auth/me`). Dashboards dynamically update the welcome banner with the real logged-in name, falling back to cached profile names only when offline.

### 3.2 Wallet & Coin Balance Decoupling
- Previous behavior: Wallet was purely a static constant displaying 480 Coins.
- New behavior: Connected to `walletApi.getWallet()`. Real transactions and rewards from `POST /api/wallet/claim-daily` (+5 Coins) and `POST /api/wallet/claim-ad` increment real backend balance and mutate frontend state seamlessly.

### 3.3 Course Catalog & Reviews
- Previous behavior: Course listing was fixed.
- New behavior: Connected to `coursesApi.getCourses()`, supporting live review status (`DRAFT`, `IN_REVIEW`, `PUBLISHED`).

---

## 4. Verification

- All mock data shapes conform 1:1 with Prisma model schemas and Stage 4 API contracts (`docs/BACKEND_API_CONTRACTS.md`).
- Turbopack compilation succeeded with 0 broken references.
- No TypeScript code introduced.

---

## 5. Next Milestone
Proceed to **Stage 6E: Database Integration Testing & Validation**.
