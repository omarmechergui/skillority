# Skillority — Screen Inventory

> Design source of truth: [Google Stitch Project](https://stitch.withgoogle.com/projects/18071031776430288694)

This document catalogs every screen from the Stitch design project, maps it to the target application route, and tracks implementation status.

## Status Legend

| Status | Meaning |
|--------|---------|
| ⬜ Not Implemented | No code exists |
| 🟡 Partially Implemented | Some elements exist but incomplete |
| ✅ Implemented | Fully built and functional |
| 🔧 Needs Correction | Exists but has issues |

---

## 1. Authentication & Onboarding (8 screens)

| # | Stitch Screen Title | Target Route | Role | Status |
|---|---------------------|-------------|------|--------|
| 1 | Public Landing Page | `/` | Public | ⬜ Not Implemented |
| 2 | Sign In | `/auth/signin` | Public | ✅ Implemented (Phase UI-1) |
| 3 | Sign Up | `/auth/signup` | Public | ✅ Implemented (Phase UI-1) |
| 4 | Forgot Password | `/auth/forgot-password` | Public | ✅ Implemented (Phase UI-1) |
| 5 | Password Reset | `/auth/reset-password` | Public | ✅ Implemented (Phase UI-1) |
| 6 | Email Verification | `/auth/verify-email` | Public | ✅ Implemented (Phase UI-1) |
| 7 | Role Selection | `/onboarding/role` | Authenticated | ✅ Implemented (Phase UI-1) |
| 8 | Student Onboarding | `/onboarding/student` | Student | ✅ Implemented (Phase UI-1) |
| 9 | Company Onboarding | `/onboarding/company` | Company | ✅ Implemented (Phase UI-1) |
| 10 | Instructor Onboarding | `/onboarding/instructor` | Instructor | ⬜ Not Implemented |

---

## 2. Student Screens (10 screens)

| # | Stitch Screen Title | Target Route | Status |
|---|---------------------|-------------|--------|
| 11 | Student Dashboard | `/student/dashboard` | ✅ Implemented (Phase UI-2) |
| 12 | Learn Hub | `/student/learn` | ✅ Implemented (Phase UI-2) |
| 13 | Course Details | `/student/courses/[id]` | ✅ Implemented (Phase UI-2) |
| 14 | Chapter Details | `/student/courses/[id]/chapters/[chapterId]` | ✅ Implemented (Phase UI-2) |
| 15 | Student Lesson Viewer | `/student/courses/[id]/chapters/[chapterId]/lessons/[lessonId]` | ✅ Implemented (Phase UI-2) |
| 16 | Chapter Quiz | `/student/courses/[id]/chapters/[chapterId]/quiz` | ✅ Implemented (Phase UI-2) |
| 17 | Final Assessment | `/student/courses/[id]/assessment` | ✅ Implemented (Phase UI-2) |
| 18 | Learning Progress | `/student/progress` | ⬜ Not Implemented |
| 19 | Student Profile | `/student/profile` | ⬜ Not Implemented |
| 20 | Student Settings | `/student/settings` | ⬜ Not Implemented |

---

## 3. Student — Career & Community (5 screens)

| # | Stitch Screen Title | Target Route | Status |
|---|---------------------|-------------|--------|
| 21 | Student Career Opportunities | `/student/careers` | ✅ Implemented (Phase UI-3A) |
| 22 | Opportunity Details & Application | `/student/careers/[id]` | ✅ Implemented (Phase UI-3A) |
| 23 | My Applications & Saved Opportunities | `/student/careers/applications` | ✅ Implemented (Phase UI-3A) |
| 24 | Community Feed | `/student/community` | ⬜ Not Implemented |
| 25 | Create Community Post | `/student/community/create` | ⬜ Not Implemented |

---

## 4. Student — Messaging & Notifications (3 screens)

| # | Stitch Screen Title | Target Route | Status |
|---|---------------------|-------------|--------|
| 26 | One-to-One Student Chat | `/student/messages` | ⬜ Not Implemented |
| 27 | Notifications (Student) | `/student/notifications` | ⬜ Not Implemented |
| 28 | Coins Wallet | `/student/wallet` | ⬜ Not Implemented |

---

## 5. Company / Recruiter Screens (13 screens)

| # | Stitch Screen Title | Target Route | Status |
|---|---------------------|-------------|--------|
| 29 | Company Dashboard | `/company/dashboard` | ⬜ Not Implemented |
| 30 | Company Opportunities Dashboard | `/company/opportunities` | ⬜ Not Implemented |
| 31 | Create Opportunity | `/company/opportunities/create` | ⬜ Not Implemented |
| 32 | Edit Opportunity | `/company/opportunities/[id]/edit` | ⬜ Not Implemented |
| 33 | Opportunity Details & Applicant Overview | `/company/opportunities/[id]` | ⬜ Not Implemented |
| 34 | Company Applications Inbox | `/company/applications` | ⬜ Not Implemented |
| 35 | Application Details | `/company/applications/[id]` | ⬜ Not Implemented |
| 36 | Company Talent Discovery | `/company/talent` | ⬜ Not Implemented |
| 37 | Student Talent Profile (Recruiter View) | `/company/talent/[id]` | ⬜ Not Implemented |
| 38 | Saved Candidates | `/company/talent/saved` | ⬜ Not Implemented |
| 39 | Candidate Evaluation | `/company/talent/[id]/evaluate` | ⬜ Not Implemented |
| 40 | Recruitment Pipeline | `/company/pipeline` | ⬜ Not Implemented |
| 41 | One-to-One Candidate Chat | `/company/messages` | ⬜ Not Implemented |

---

## 6. Company — Profile & Settings (4 screens)

| # | Stitch Screen Title | Target Route | Status |
|---|---------------------|-------------|--------|
| 42 | Company Public Profile | `/company/profile` | ⬜ Not Implemented |
| 43 | Recruiter Personal Profile | `/company/profile/personal` | ⬜ Not Implemented |
| 44 | Recruiter Account Settings | `/company/settings` | ⬜ Not Implemented |
| 45 | Recruiter Notifications | `/company/notifications` | ⬜ Not Implemented |
| 46 | Recruiter Messages | `/company/messages` | ⬜ Not Implemented |

---

## 7. Instructor Screens (16 screens)

| # | Stitch Screen Title | Target Route | Status |
|---|---------------------|-------------|--------|
| 47 | Instructor Dashboard | `/instructor/dashboard` | ⬜ Not Implemented |
| 48 | Instructor My Courses | `/instructor/courses` | ⬜ Not Implemented |
| 49 | Instructor Create Course | `/instructor/courses/create` | ⬜ Not Implemented |
| 50 | Instructor Course Management Overview | `/instructor/courses/[id]` | ⬜ Not Implemented |
| 51 | Course Curriculum Builder | `/instructor/courses/[id]/curriculum` | ⬜ Not Implemented |
| 52 | Instructor Hybrid Lesson Builder | `/instructor/courses/[id]/lessons/[lessonId]/edit` | ⬜ Not Implemented |
| 53 | Instructor Lesson Preview | `/instructor/courses/[id]/lessons/[lessonId]/preview` | ⬜ Not Implemented |
| 54 | Instructor Assessment Builder | `/instructor/courses/[id]/assessment/edit` | ⬜ Not Implemented |
| 55 | Instructor Assessment Preview | `/instructor/courses/[id]/assessment/preview` | ⬜ Not Implemented |
| 56 | Instructor Student Management Dashboard | `/instructor/students` | ⬜ Not Implemented |
| 57 | Instructor Student Directory | `/instructor/students/directory` | ⬜ Not Implemented |
| 58 | Instructor Student Profile & Learning Progress | `/instructor/students/[id]` | ⬜ Not Implemented |
| 59 | Instructor Student Course Progress | `/instructor/students/[id]/courses/[courseId]` | ⬜ Not Implemented |
| 60 | Instructor My Profile | `/instructor/profile` | ⬜ Not Implemented |
| 61 | Instructor Settings | `/instructor/settings` | ⬜ Not Implemented |
| 62 | Instructor Notifications | `/instructor/notifications` | ⬜ Not Implemented |

### Instructor Lesson Builder UX (supplementary Stitch project)

| # | Stitch Screen Title | Target Route | Status |
|---|---------------------|-------------|--------|
| 63 | Instructor: Create Lesson Basics | `/instructor/courses/[id]/lessons/create` | ⬜ Not Implemented |
| 64 | Instructor: Lesson Builder Workspace | `/instructor/courses/[id]/lessons/[lessonId]/edit` | ⬜ Not Implemented |
| 65 | Instructor: Add Block Menu | _(modal overlay)_ | ⬜ Not Implemented |

---

## 8. Admin Screens (10 screens)

| # | Stitch Screen Title | Target Route | Status |
|---|---------------------|-------------|--------|
| 66 | Admin Dashboard | `/admin/dashboard` | ⬜ Not Implemented |
| 67 | User Management Directory | `/admin/users` | ⬜ Not Implemented |
| 68 | User Details & Account Overview | `/admin/users/[id]` | ⬜ Not Implemented |
| 69 | User Account Management & Status Actions | `/admin/users/[id]/manage` | ⬜ Not Implemented |
| 70 | Course Review Dashboard | `/admin/courses/reviews` | ⬜ Not Implemented |
| 71 | Course Review Details | `/admin/courses/reviews/[id]` | ⬜ Not Implemented |
| 72 | Approval / Rejection Decision Interface | `/admin/courses/reviews/[id]/decide` | ⬜ Not Implemented |
| 73 | Platform Activity Dashboard | `/admin/activity` | ⬜ Not Implemented |
| 74 | Activity Log & Event Details | `/admin/activity/log` | ⬜ Not Implemented |
| 75 | Reports & Analytics | `/admin/reports` | ⬜ Not Implemented |
| 76 | Admin Notifications | `/admin/notifications` | ⬜ Not Implemented |
| 77 | Admin Account Settings | `/admin/settings` | ⬜ Not Implemented |
| 78 | Admin Personal Profile | `/admin/profile` | ⬜ Not Implemented |

---

## Summary

| Category | Screen Count | Implemented | Pending |
|----------|:----------:|:-----------:|:-------:|
| Auth & Onboarding | 10 | 0 | 10 |
| Student — Learning | 10 | 0 | 10 |
| Student — Career & Community | 5 | 0 | 5 |
| Student — Messaging & Wallet | 3 | 0 | 3 |
| Company / Recruiter | 18 | 0 | 18 |
| Instructor | 19 | 0 | 19 |
| Admin | 13 | 0 | 13 |
| **Total** | **78** | **0** | **78** |

