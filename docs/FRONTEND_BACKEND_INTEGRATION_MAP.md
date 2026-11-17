# SKILLORITY — FRONTEND ↔ BACKEND INTEGRATION MAP

> **Date**: November 16, 2026  
> **Status**: COMPREHENSIVE INTEGRATION INVENTORY & AUDIT  
> **Backend Architecture**: Express + Prisma ORM (MongoDB Provider)  
> **Frontend Architecture**: Next.js 14 App Router (Pure JavaScript/JSX)

---

## 1. Executive Summary

This document establishes the master mapping connecting all 76 frontend routes and UI components to their corresponding backend REST endpoints, detailing HTTP methods, required roles, current data sources, and missing behaviors.

---

## 2. Complete Integration Matrix

| # | Feature Domain | Frontend Route | Key Component / Page | Current Data Source | Required Endpoint | Actual Implemented Endpoint | Method | Role | Integration Status |
|---|---|---|---|---|---|---|:---:|:---:|:---:|
| 1 | Public Landing | `/` | `src/app/page.jsx` | Static / Mock courses | `/api/courses` | `/api/courses` | GET | PUBLIC | PARTIALLY_INTEGRATED |
| 2 | Sign In | `/auth/signin` | `src/app/(public)/auth/signin/page.jsx` | Direct fetch / AuthContext | `/api/auth/login` | `/api/auth/login` | POST | PUBLIC | INTEGRATED |
| 3 | Sign Up | `/auth/signup` | `src/app/(public)/auth/signup/page.jsx` | Direct fetch / AuthContext | `/api/auth/signup/student`, `/company` | `/api/auth/signup/student`, `/company` | POST | PUBLIC | INTEGRATED |
| 4 | Forgot Password | `/auth/forgot-password`| `src/app/(public)/auth/forgot-password/page.jsx`| Direct fetch | `/api/auth/forgot-password`| `/api/auth/forgot-password`| POST | PUBLIC | INTEGRATED |
| 5 | Reset Password | `/auth/reset-password` | `src/app/(public)/auth/reset-password/page.jsx` | Direct fetch | `/api/auth/reset-password` | `/api/auth/reset-password` | POST | PUBLIC | INTEGRATED |
| 6 | Email Verify | `/auth/verify-email` | `src/app/(public)/auth/verify-email/page.jsx` | Static state | `/api/auth/verify-email` | `/api/auth/verify-email` | GET | PUBLIC | PARTIALLY_INTEGRATED |
| 7 | Role Selection | `/onboarding/role` | `src/app/(onboarding)/onboarding/role/page.jsx` | Client state | `/api/auth/select-role` | `/api/auth/select-role` | POST | AUTH | PARTIALLY_INTEGRATED |
| 8 | Student Onboard| `/onboarding/student` | `src/app/(onboarding)/onboarding/student/page.jsx` | Client state | `/api/auth/onboarding/student` | `/api/auth/onboarding/student` | POST | STUDENT | INTEGRATED |
| 9 | Company Onboard| `/onboarding/company` | `src/app/(onboarding)/onboarding/company/page.jsx` | Client state | `/api/auth/onboarding/company` | `/api/auth/onboarding/company` | POST | COMPANY | INTEGRATED |
| 10| Instructor Invite| `/onboarding/instructor`| `src/app/(onboarding)/onboarding/instructor/page.jsx`| Client state | `/api/auth/instructors/accept-invitation` | `/api/auth/instructors/accept-invitation` | POST | INSTRUCTOR | INTEGRATED |
| 11| Student Dash | `/student/dashboard` | `src/app/(student)/student/dashboard/page.jsx` | `mockStudentData.js`, `mockLearningData.js` | `/api/learning/my-courses`, `/api/wallet` | `/api/learning/my-courses`, `/api/wallet` | GET | STUDENT | PARTIALLY_INTEGRATED |
| 12| Learn Hub | `/student/learn` | `src/app/(student)/student/learn/page.jsx` | `mockLearningData.js` | `/api/courses` | `/api/courses` | GET | STUDENT | PARTIALLY_INTEGRATED |
| 13| Course Details | `/student/courses/[id]`| `src/app/(student)/student/courses/[id]/page.jsx` | `mockLearningData.js` | `/api/courses/:id`, `/api/learning/enroll/:id` | `/api/courses/:id`, `/api/learning/enroll/:id` | GET, POST | STUDENT | PARTIALLY_INTEGRATED |
| 14| Chapter Details| `/student/courses/[id]/chapters/[chapterId]` | `src/app/.../chapters/[chapterId]/page.jsx` | `mockLearningData.js` | `/api/courses/:id`, `/api/learning/chapters/:id/unlock` | `/api/courses/:id`, `/api/learning/courses/:id/chapters/:chId/unlock` | GET, POST | STUDENT | PARTIALLY_INTEGRATED |
| 15| Lesson Viewer | `/student/courses/[id]/.../lessons/[lessonId]` | `src/app/.../lessons/[lessonId]/page.jsx` | `mockLearningData.js` | `/api/learning/courses/:id/lessons/:id/complete` | `/api/learning/courses/:id/lessons/:id/complete` | POST | STUDENT | PARTIALLY_INTEGRATED |
| 16| Chapter Quiz | `/student/courses/[id]/.../quiz` | `src/app/.../quiz/page.jsx` | `mockLearningData.js` | `/api/assessments/quizzes/:id/submit` | `/api/assessments/quizzes/:chapterId/submit` | POST | STUDENT | PARTIALLY_INTEGRATED |
| 17| Final Assess | `/student/courses/[id]/assessment` | `src/app/.../assessment/page.jsx` | `mockLearningData.js` | `/api/assessments/courses/:id/submit` | `/api/assessments/courses/:courseId/submit` | POST | STUDENT | PARTIALLY_INTEGRATED |
| 18| Learning Prog | `/student/progress` | `src/app/(student)/student/progress/page.jsx` | `mockLearningData.js`, `mockStudentData.js` | `/api/learning/my-courses`, `/api/assessments/my-certificates` | `/api/learning/my-courses`, `/api/assessments/my-certificates` | GET | STUDENT | PARTIALLY_INTEGRATED |
| 19| Student Profile| `/student/profile` | `src/app/(student)/student/profile/page.jsx` | `mockStudentData.js` | `/api/profiles/me` | `/api/profiles/me` | GET, PATCH | STUDENT | PARTIALLY_INTEGRATED |
| 20| Student Setting| `/student/settings` | `src/app/(student)/student/settings/page.jsx` | `mockStudentData.js` | `/api/profiles/me` | `/api/profiles/me` | GET, PATCH | STUDENT | PARTIALLY_INTEGRATED |
| 21| Student Careers| `/student/careers` | `src/app/(student)/student/careers/page.jsx` | `mockCareerData.js` | `/api/careers/opportunities` | `/api/careers/opportunities` | GET | STUDENT | PARTIALLY_INTEGRATED |
| 22| Career Details | `/student/careers/[id]`| `src/app/(student)/student/careers/[id]/page.jsx` | `mockCareerData.js` | `/api/careers/opportunities/:id/apply` | `/api/careers/opportunities/:id/apply` | POST | STUDENT | PARTIALLY_INTEGRATED |
| 23| My Applications| `/student/careers/applications` | `src/app/.../applications/page.jsx` | `mockCareerData.js` | `/api/careers/my-applications` | `/api/careers/my-applications` | GET | STUDENT | PARTIALLY_INTEGRATED |
| 24| Community Feed | `/student/community` | `src/app/(student)/student/community/page.jsx` | `mockCommunityData.js` | `/api/community/posts`, `/like` | `/api/community/posts`, `/like` | GET, POST | STUDENT | PARTIALLY_INTEGRATED |
| 25| Create Post | `/student/community/create` | `src/app/.../community/create/page.jsx` | `mockCommunityData.js` | `/api/community/posts` | `/api/community/posts` | POST | STUDENT | PARTIALLY_INTEGRATED |
| 26| Student Messages| `/student/messages` | `src/app/(student)/student/messages/page.jsx` | `mockStudentData.js` | `/api/messages/conversations` | `/api/messages/conversations` | GET, POST | STUDENT | PARTIALLY_INTEGRATED |
| 27| Notifications | `/student/notifications`| `src/app/(student)/student/notifications/page.jsx` | `mockStudentData.js` | `/api/messages/notifications` | `/api/messages/notifications` | GET, PATCH | STUDENT | PARTIALLY_INTEGRATED |
| 28| Coins Wallet | `/student/wallet` | `src/app/(student)/student/wallet/page.jsx` | `mockStudentData.js` | `/api/wallet`, `/claim-daily-login`, `/claim-ad-reward` | `/api/wallet/*` | GET, POST | STUDENT | PARTIALLY_INTEGRATED |
| 29| Company Dash | `/company/dashboard` | `src/app/(company)/company/dashboard/page.jsx` | `mockCompanyData.js` | `/api/careers/applications`, `/api/careers/opportunities` | `/api/careers/applications` | GET | COMPANY | PARTIALLY_INTEGRATED |
| 30| Company Opps | `/company/opportunities`| `src/app/(company)/company/opportunities/page.jsx`| `mockCompanyData.js` | `/api/careers/opportunities` | `/api/careers/opportunities` | GET | COMPANY | PARTIALLY_INTEGRATED |
| 31| Create Opp | `/company/opportunities/create` | `src/app/.../create/page.jsx` | `mockCompanyData.js` | `/api/careers/opportunities` | `/api/careers/opportunities` | POST | COMPANY | PARTIALLY_INTEGRATED |
| 32| Edit Opp | `/company/opportunities/[id]/edit` | `src/app/.../edit/page.jsx` | `mockCompanyData.js` | `/api/careers/opportunities/:id` | `/api/careers/opportunities/:id` | PATCH | COMPANY | PARTIALLY_INTEGRATED |
| 33| Opp Details | `/company/opportunities/[id]` | `src/app/.../opportunities/[id]/page.jsx` | `mockCompanyData.js` | `/api/careers/opportunities/:id` | `/api/careers/opportunities/:id` | GET | COMPANY | PARTIALLY_INTEGRATED |
| 34| Company Inbx | `/company/applications`| `src/app/(company)/company/applications/page.jsx` | `mockCompanyData.js` | `/api/careers/applications` | `/api/careers/applications` | GET | COMPANY | PARTIALLY_INTEGRATED |
| 35| App Details | `/company/applications/[id]` | `src/app/.../applications/[id]/page.jsx` | `mockCompanyData.js` | `/api/careers/applications/:id/status` | `/api/careers/applications/:id/status` | PATCH | COMPANY | PARTIALLY_INTEGRATED |
| 36| Talent Discovery| `/company/talent` | `src/app/(company)/company/talent/page.jsx` | `mockCompanyData.js` | `/api/admin/users?role=STUDENT` | `/api/admin/users?role=STUDENT` | GET | COMPANY | PARTIALLY_INTEGRATED |
| 37| Talent Profile | `/company/talent/[id]` | `src/app/(company)/company/talent/[id]/page.jsx` | `mockCompanyData.js` | `/api/profiles/:userId` | `/api/profiles/:userId` | GET | COMPANY | PARTIALLY_INTEGRATED |
| 38| Saved Talent | `/company/talent/saved`| `src/app/(company)/company/talent/saved/page.jsx` | `mockCompanyData.js` | `/api/profiles/saved` | Client State / Mock | GET | COMPANY | PARTIALLY_INTEGRATED |
| 39| Candidate Eval | `/company/talent/[id]/evaluate` | `src/app/.../evaluate/page.jsx` | `mockCompanyData.js` | `/api/careers/applications/:id/status` | `/api/careers/applications/:id/status` | PATCH | COMPANY | PARTIALLY_INTEGRATED |
| 40| Kanban Pipeline| `/company/pipeline` | `src/app/(company)/company/pipeline/page.jsx` | `mockCompanyData.js` | `/api/careers/applications` | `/api/careers/applications` | GET, PATCH | COMPANY | PARTIALLY_INTEGRATED |
| 41| Company Msg | `/company/messages` | `src/app/(company)/company/messages/page.jsx` | `mockCompanyData.js` | `/api/messages/conversations` | `/api/messages/conversations` | GET, POST | COMPANY | PARTIALLY_INTEGRATED |
| 42| Company Profile| `/company/profile` | `src/app/(company)/company/profile/page.jsx` | `mockCompanyData.js` | `/api/profiles/me` | `/api/profiles/me` | GET, PATCH | COMPANY | PARTIALLY_INTEGRATED |
| 43| Recruiter Prof | `/company/profile/personal` | `src/app/.../personal/page.jsx` | `mockCompanyData.js` | `/api/profiles/me` | `/api/profiles/me` | GET, PATCH | COMPANY | PARTIALLY_INTEGRATED |
| 44| Company Settings| `/company/settings` | `src/app/(company)/company/settings/page.jsx` | `mockCompanyData.js` | `/api/profiles/me` | `/api/profiles/me` | GET, PATCH | COMPANY | PARTIALLY_INTEGRATED |
| 45| Company Alerts | `/company/notifications`| `src/app/(company)/company/notifications/page.jsx`| `mockCompanyData.js` | `/api/messages/notifications` | `/api/messages/notifications` | GET, PATCH | COMPANY | PARTIALLY_INTEGRATED |
| 46| Instructor Dash| `/instructor/dashboard`| `src/app/(instructor)/instructor/dashboard/page.jsx`| `mockInstructorData.js` | `/api/courses?instructor=me` | `/api/courses` | GET | INSTRUCTOR | PARTIALLY_INTEGRATED |
| 47| My Courses | `/instructor/courses` | `src/app/(instructor)/instructor/courses/page.jsx` | `mockInstructorData.js` | `/api/courses` | `/api/courses` | GET | INSTRUCTOR | PARTIALLY_INTEGRATED |
| 48| Create Course | `/instructor/courses/create` | `src/app/.../courses/create/page.jsx` | `mockInstructorData.js` | `/api/courses` | `/api/courses` | POST | INSTRUCTOR | PARTIALLY_INTEGRATED |
| 49| Course Overview| `/instructor/courses/[id]` | `src/app/.../courses/[id]/page.jsx` | `mockInstructorData.js` | `/api/courses/:id`, `/submit-review` | `/api/courses/:id`, `/submit-review` | GET, POST | INSTRUCTOR | PARTIALLY_INTEGRATED |
| 50| Curriculum Bld | `/instructor/courses/[id]/curriculum` | `src/app/.../curriculum/page.jsx` | `mockInstructorData.js` | `/api/courses/:id/chapters` | `/api/courses/:id/chapters` | POST | INSTRUCTOR | PARTIALLY_INTEGRATED |
| 51| Lesson Builder | `/instructor/courses/[id]/lessons/[lessonId]/edit` | `src/app/.../edit/page.jsx` | `mockInstructorData.js` | `/api/courses/chapters/:chId/lessons` | `/api/courses/chapters/:chapterId/lessons` | POST | INSTRUCTOR | PARTIALLY_INTEGRATED |
| 52| Lesson Preview | `/instructor/courses/[id]/lessons/[lessonId]/preview` | `src/app/.../preview/page.jsx` | `mockInstructorData.js` | `/api/courses/:id` | `/api/courses/:id` | GET | INSTRUCTOR | PARTIALLY_INTEGRATED |
| 53| Assess Builder | `/instructor/courses/[id]/assessment/edit` | `src/app/.../assessment/edit/page.jsx` | `mockInstructorData.js` | `/api/courses/:id` | `/api/courses/:id` | PATCH | INSTRUCTOR | PARTIALLY_INTEGRATED |
| 54| Assess Preview | `/instructor/courses/[id]/assessment/preview` | `src/app/.../assessment/preview/page.jsx` | `mockInstructorData.js` | `/api/courses/:id` | `/api/courses/:id` | GET | INSTRUCTOR | PARTIALLY_INTEGRATED |
| 55| Student Mgmt | `/instructor/students` | `src/app/(instructor)/instructor/students/page.jsx` | `mockInstructorData.js` | `/api/courses` | `/api/courses` | GET | INSTRUCTOR | PARTIALLY_INTEGRATED |
| 56| Student Direct | `/instructor/students/directory` | `src/app/.../directory/page.jsx` | `mockInstructorData.js` | `/api/courses` | `/api/courses` | GET | INSTRUCTOR | PARTIALLY_INTEGRATED |
| 57| Student Detail | `/instructor/students/[id]` | `src/app/.../students/[id]/page.jsx` | `mockInstructorData.js` | `/api/profiles/:userId` | `/api/profiles/:userId` | GET | INSTRUCTOR | PARTIALLY_INTEGRATED |
| 58| Course Progress| `/instructor/students/[id]/courses/[courseId]` | `src/app/.../courses/[courseId]/page.jsx` | `mockInstructorData.js` | `/api/learning/my-courses` | `/api/learning/my-courses` | GET | INSTRUCTOR | PARTIALLY_INTEGRATED |
| 59| Instructor Prof| `/instructor/profile` | `src/app/(instructor)/instructor/profile/page.jsx` | `mockInstructorData.js` | `/api/profiles/me` | `/api/profiles/me` | GET, PATCH | INSTRUCTOR | PARTIALLY_INTEGRATED |
| 60| Instructor Sett| `/instructor/settings` | `src/app/(instructor)/instructor/settings/page.jsx`| `mockInstructorData.js` | `/api/profiles/me` | `/api/profiles/me` | GET, PATCH | INSTRUCTOR | PARTIALLY_INTEGRATED |
| 61| Instructor Noti| `/instructor/notifications` | `src/app/.../notifications/page.jsx` | `mockInstructorData.js` | `/api/messages/notifications` | `/api/messages/notifications` | GET, PATCH | INSTRUCTOR | PARTIALLY_INTEGRATED |
| 62| Admin Dashboard| `/admin/dashboard` | `src/app/(admin)/admin/dashboard/page.jsx` | `mockAdminData.js` | `/api/admin/stats` | `/api/admin/stats` | GET | ADMIN | PARTIALLY_INTEGRATED |
| 63| User Directory | `/admin/users` | `src/app/(admin)/admin/users/page.jsx` | `mockAdminData.js` | `/api/admin/users` | `/api/admin/users` | GET | ADMIN | PARTIALLY_INTEGRATED |
| 64| User Details | `/admin/users/[id]` | `src/app/(admin)/admin/users/[id]/page.jsx` | `mockAdminData.js` | `/api/profiles/:userId` | `/api/profiles/:userId` | GET | ADMIN | PARTIALLY_INTEGRATED |
| 65| User Manage | `/admin/users/[id]/manage` | `src/app/.../manage/page.jsx` | `mockAdminData.js` | `/api/admin/users/:id/status` | `/api/admin/users/:id/status` | PATCH | ADMIN | PARTIALLY_INTEGRATED |
| 66| Course Reviews | `/admin/courses/reviews` | `src/app/(admin)/admin/courses/reviews/page.jsx` | `mockAdminData.js` | `/api/admin/courses/reviews` | `/api/admin/courses/reviews` | GET | ADMIN | PARTIALLY_INTEGRATED |
| 67| Review Details | `/admin/courses/reviews/[id]` | `src/app/.../reviews/[id]/page.jsx` | `mockAdminData.js` | `/api/courses/:id` | `/api/courses/:id` | GET | ADMIN | PARTIALLY_INTEGRATED |
| 68| Review Decision| `/admin/courses/reviews/[id]/decide` | `src/app/.../decide/page.jsx` | `mockAdminData.js` | `/api/courses/:id/review-decision` | `/api/courses/:id/review-decision` | POST | ADMIN | PARTIALLY_INTEGRATED |
| 69| Activity Dash | `/admin/activity` | `src/app/(admin)/admin/activity/page.jsx` | `mockAdminData.js` | `/api/admin/stats` | `/api/admin/stats` | GET | ADMIN | PARTIALLY_INTEGRATED |
| 70| Activity Log | `/admin/activity/log` | `src/app/(admin)/admin/activity/log/page.jsx` | `mockAdminData.js` | `/api/admin/stats` | `/api/admin/stats` | GET | ADMIN | PARTIALLY_INTEGRATED |
| 71| Reports | `/admin/reports` | `src/app/(admin)/admin/reports/page.jsx` | `mockAdminData.js` | `/api/admin/stats` | `/api/admin/stats` | GET | ADMIN | PARTIALLY_INTEGRATED |
| 72| Admin Notifs | `/admin/notifications` | `src/app/(admin)/admin/notifications/page.jsx` | `mockAdminData.js` | `/api/messages/notifications` | `/api/messages/notifications` | GET, PATCH | ADMIN | PARTIALLY_INTEGRATED |
| 73| Admin Settings | `/admin/settings` | `src/app/(admin)/admin/settings/page.jsx` | `mockAdminData.js` | `/api/profiles/me` | `/api/profiles/me` | GET, PATCH | ADMIN | PARTIALLY_INTEGRATED |
| 74| Admin Profile | `/admin/profile` | `src/app/(admin)/admin/profile/page.jsx` | `mockAdminData.js` | `/api/profiles/me` | `/api/profiles/me` | GET, PATCH | ADMIN | PARTIALLY_INTEGRATED |
| 75| Recruiter Msgs | `/company/messages` | `src/app/(company)/company/messages/page.jsx` | `mockCompanyData.js` | `/api/messages/conversations` | `/api/messages/conversations` | GET, POST | COMPANY | PARTIALLY_INTEGRATED |
| 76| Block Inserter | Modal in Hybrid Lesson Builder | `src/app/.../lessons/[lessonId]/edit/page.jsx` | In-memory component | Client interaction | Local Component | N/A | INSTRUCTOR | INTEGRATED |
