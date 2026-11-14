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

## 1. Authentication & Onboarding (10 screens)

| # | Stitch Screen Title | Target Route | Role | Status |
|---|---------------------|-------------|------|--------|
| 1 | Public Landing Page | `/` | Public | ✅ Implemented (Phase UI-4E) |
| 2 | Sign In | `/auth/signin` | Public | ✅ Implemented (Phase UI-1) |
| 3 | Sign Up | `/auth/signup` | Public | ✅ Implemented (Phase UI-1) |
| 4 | Forgot Password | `/auth/forgot-password` | Public | ✅ Implemented (Phase UI-1) |
| 5 | Password Reset | `/auth/reset-password` | Public | ✅ Implemented (Phase UI-1) |
| 6 | Email Verification | `/auth/verify-email` | Public | ✅ Implemented (Phase UI-1) |
| 7 | Role Selection | `/onboarding/role` | Authenticated | ✅ Implemented (Phase UI-1) |
| 8 | Student Onboarding | `/onboarding/student` | Student | ✅ Implemented (Phase UI-1) |
| 9 | Company Onboarding | `/onboarding/company` | Company | ✅ Implemented (Phase UI-1) |
| 10 | Instructor Onboarding | `/onboarding/instructor` | Instructor | ✅ Implemented (Phase UI-4C) |

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
| 18 | Learning Progress | `/student/progress` | ✅ Implemented (Phase UI-4A) |
| 19 | Student Profile | `/student/profile` | ✅ Implemented (Phase UI-4A) |
| 20 | Student Settings | `/student/settings` | ✅ Implemented (Phase UI-4A) |

---

## 3. Student — Career & Community (5 screens)

| # | Stitch Screen Title | Target Route | Status |
|---|---------------------|-------------|--------|
| 21 | Student Career Opportunities | `/student/careers` | ✅ Implemented (Phase UI-3A) |
| 22 | Opportunity Details & Application | `/student/careers/[id]` | ✅ Implemented (Phase UI-3A) |
| 23 | My Applications & Saved Opportunities | `/student/careers/applications` | ✅ Implemented (Phase UI-3A) |
| 24 | Community Feed | `/student/community` | ✅ Implemented (Phase UI-3B) |
| 25 | Create Community Post | `/student/community/create` | ✅ Implemented (Phase UI-3B) |

---

## 4. Student — Messaging & Notifications (3 screens)

| # | Stitch Screen Title | Target Route | Status |
|---|---------------------|-------------|--------|
| 26 | One-to-One Student Chat | `/student/messages` | ✅ Implemented (Phase UI-4A) |
| 27 | Notifications (Student) | `/student/notifications` | ✅ Implemented (Phase UI-4A) |
| 28 | Coins Wallet | `/student/wallet` | ✅ Implemented (Phase UI-4A) |

---

## 5. Company / Recruiter Screens (13 screens)

| # | Stitch Screen Title | Target Route | Status |
|---|---------------------|-------------|--------|
| 29 | Company Dashboard | `/company/dashboard` | ✅ Implemented (Phase UI-4B) |
| 30 | Company Opportunities Dashboard | `/company/opportunities` | ✅ Implemented (Phase UI-4B) |
| 31 | Create Opportunity | `/company/opportunities/create` | ✅ Implemented (Phase UI-4B) |
| 32 | Edit Opportunity | `/company/opportunities/[id]/edit` | ✅ Implemented (Phase UI-4B) |
| 33 | Opportunity Details & Applicant Overview | `/company/opportunities/[id]` | ✅ Implemented (Phase UI-4B) |
| 34 | Company Applications Inbox | `/company/applications` | ✅ Implemented (Phase UI-4B) |
| 35 | Application Details | `/company/applications/[id]` | ✅ Implemented (Phase UI-4B) |
| 36 | Company Talent Discovery | `/company/talent` | ✅ Implemented (Phase UI-4B) |
| 37 | Student Talent Profile (Recruiter View) | `/company/talent/[id]` | ✅ Implemented (Phase UI-4B) |
| 38 | Saved Candidates | `/company/talent/saved` | ✅ Implemented (Phase UI-4B) |
| 39 | Candidate Evaluation | `/company/talent/[id]/evaluate` | ✅ Implemented (Phase UI-4B) |
| 40 | Recruitment Pipeline | `/company/pipeline` | ✅ Implemented (Phase UI-4B) |
| 41 | One-to-One Candidate Chat | `/company/messages` | ✅ Implemented (Phase UI-4B) |

---

## 6. Company — Profile & Settings (5 screens)

| # | Stitch Screen Title | Target Route | Status |
|---|---------------------|-------------|--------|
| 42 | Company Public Profile | `/company/profile` | ✅ Implemented (Phase UI-4B) |
| 43 | Recruiter Personal Profile | `/company/profile/personal` | ✅ Implemented (Phase UI-4B) |
| 44 | Recruiter Account Settings | `/company/settings` | ✅ Implemented (Phase UI-4B) |
| 45 | Recruiter Notifications | `/company/notifications` | ✅ Implemented (Phase UI-4B) |
| 46 | Recruiter Messages (Alternative View) | `/company/messages` | ✅ Implemented (Phase UI-4B - Reconciled) |

---

## 7. Instructor Screens (19 screens)

| # | Stitch Screen Title | Target Route | Status |
|---|---------------------|-------------|--------|
| 47 | Instructor Dashboard | `/instructor/dashboard` | ✅ Implemented (Phase UI-4C) |
| 48 | Instructor My Courses | `/instructor/courses` | ✅ Implemented (Phase UI-4C) |
| 49 | Instructor Create Course | `/instructor/courses/create` | ✅ Implemented (Phase UI-4C) |
| 50 | Instructor Course Management Overview | `/instructor/courses/[id]` | ✅ Implemented (Phase UI-4C) |
| 51 | Course Curriculum Builder | `/instructor/courses/[id]/curriculum` | ✅ Implemented (Phase UI-4C) |
| 52 | Instructor Hybrid Lesson Builder | `/instructor/courses/[id]/lessons/[lessonId]/edit` | ✅ Implemented (Phase UI-4C) |
| 53 | Instructor Lesson Preview | `/instructor/courses/[id]/lessons/[lessonId]/preview` | ✅ Implemented (Phase UI-4C) |
| 54 | Instructor Assessment Builder | `/instructor/courses/[id]/assessment/edit` | ✅ Implemented (Phase UI-4C) |
| 55 | Instructor Assessment Preview | `/instructor/courses/[id]/assessment/preview` | ✅ Implemented (Phase UI-4C) |
| 56 | Instructor Student Management Dashboard | `/instructor/students` | ✅ Implemented (Phase UI-4C) |
| 57 | Instructor Student Directory | `/instructor/students/directory` | ✅ Implemented (Phase UI-4C) |
| 58 | Instructor Student Profile & Learning Progress | `/instructor/students/[id]` | ✅ Implemented (Phase UI-4C) |
| 59 | Instructor Student Course Progress | `/instructor/students/[id]/courses/[courseId]` | ✅ Implemented (Phase UI-4C) |
| 60 | Instructor My Profile | `/instructor/profile` | ✅ Implemented (Phase UI-4C) |
| 61 | Instructor Settings | `/instructor/settings` | ✅ Implemented (Phase UI-4C) |
| 62 | Instructor Notifications | `/instructor/notifications` | ✅ Implemented (Phase UI-4C) |

### Instructor Lesson Builder UX (supplementary Stitch project)

| # | Stitch Screen Title | Target Route | Status |
|---|---------------------|-------------|--------|
| 63 | Instructor: Create Lesson Basics | `/instructor/courses/[id]/lessons/create` | ✅ Implemented (Phase UI-4C) |
| 64 | Instructor: Lesson Builder Workspace | `/instructor/courses/[id]/lessons/[lessonId]/edit` | ✅ Implemented (Phase UI-4C) |
| 65 | Instructor: Add Block Menu | _(modal overlay in Builder)_ | ✅ Implemented (Phase UI-4C) |

---

## 8. Admin Screens (13 screens)

| # | Stitch Screen Title | Target Route | Status |
|---|---------------------|-------------|--------|
| 66 | Admin Dashboard | `/admin/dashboard` | ✅ Implemented (Phase UI-4D) |
| 67 | User Management Directory | `/admin/users` | ✅ Implemented (Phase UI-4D) |
| 68 | User Details & Account Overview | `/admin/users/[id]` | ✅ Implemented (Phase UI-4D) |
| 69 | User Account Management & Status Actions | `/admin/users/[id]/manage` | ✅ Implemented (Phase UI-4D) |
| 70 | Course Review Dashboard | `/admin/courses/reviews` | ✅ Implemented (Phase UI-4D) |
| 71 | Course Review Details | `/admin/courses/reviews/[id]` | ✅ Implemented (Phase UI-4D) |
| 72 | Approval / Rejection Decision Interface | `/admin/courses/reviews/[id]/decide` | ✅ Implemented (Phase UI-4D) |
| 73 | Platform Activity Dashboard | `/admin/activity` | ✅ Implemented (Phase UI-4D) |
| 74 | Activity Log & Event Details | `/admin/activity/log` | ✅ Implemented (Phase UI-4D) |
| 75 | Reports & Analytics | `/admin/reports` | ✅ Implemented (Phase UI-4D) |
| 76 | Admin Notifications | `/admin/notifications` | ✅ Implemented (Phase UI-4D) |
| 77 | Admin Account Settings | `/admin/settings` | ✅ Implemented (Phase UI-4D) |
| 78 | Admin Personal Profile | `/admin/profile` | ✅ Implemented (Phase UI-4D) |

---

## Summary

| Category | Screen Count | Implemented | Pending |
|----------|:----------:|:-----------:|:-------:|
| Auth & Onboarding | 10 | 10 | 0 |
| Student — Learning | 10 | 10 | 0 |
| Student — Career & Community | 5 | 5 | 0 |
| Student — Messaging & Wallet | 3 | 3 | 0 |
| Company / Recruiter | 18 | 18 | 0 |
| Instructor | 19 | 19 | 0 |
| Admin | 13 | 13 | 0 |
| **Total** | **78** | **78** | **0** |
