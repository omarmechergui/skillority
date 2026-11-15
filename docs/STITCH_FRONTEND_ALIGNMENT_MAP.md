# STITCH ↔ FRONTEND ALIGNMENT MAP

> Source of Truth: Google Stitch Project ID `18071031776430288694`

This document maps every screen from the Stitch design project to its corresponding Next.js frontend route and implementation file, and catalogs its visual alignment status.

## Status Legend

| Status | Meaning |
|---|---|
| MATCHED | Pixel, typography, color tokens, and layout match Stitch design reference. |
| MINOR DIFFERENCES | Core design matches; minor padding, font weight, or mock asset nuances. |
| MAJOR DIFFERENCES | Significant layout or component variance requiring realignment. |
| MISSING | Screen route or UI file not implemented. |
| NEEDS VERIFICATION | Pending visual screenshot diff verification. |

## Complete Stitch Screen Inventory (76 Screens)

| # | Stitch Screen | Stitch ID | Role | Frontend Route | Implementation File | Alignment Status |
|---|---|---|:---:|---|---|:---:|
| 1 | Company Talent Discovery | `3eb2f5c7fecd4b228d7534c08d130d96` | Company | `/company/talent` | `frontend/src/app/(company)/company/talent/page.jsx` | MATCHED |
| 2 | Recruiter Personal Profile | `13754eabb0ab4f2b98bd58783b65e11c` | Company | `/company/profile/personal` | `frontend/src/app/(company)/company/profile/personal/page.jsx` | MATCHED |
| 3 | Create Community Post | `52e654bfcc5b4ff5bd3d017cf04108eb` | Student | `/student/community/create` | `frontend/src/app/(student)/student/community/create/page.jsx` | MATCHED |
| 4 | Course Review Details | `4cad160b23734125a55ffe8ff8f346c5` | Admin | `/admin/courses/reviews/[id]` | `frontend/src/app/(admin)/admin/courses/reviews/[id]/page.jsx` | MATCHED |
| 5 | Instructor Lesson Preview | `f3d585dba9ae48518b389aa2e6cd4512` | Instructor | `/instructor/courses/[id]/lessons/[lessonId]/preview` | `frontend/src/app/(instructor)/instructor/courses/[id]/lessons/[lessonId]/preview/page.jsx` | MATCHED |
| 6 | User Management Directory | `e3bf0a4d9e7e4ecdaac94efba257ea20` | Admin | `/admin/users` | `frontend/src/app/(admin)/admin/users/page.jsx` | MATCHED |
| 7 | Chapter Quiz | `3a63fde63c514f94b462b3e5e696b7b2` | Student | `/student/courses/[id]/chapters/[chapterId]/quiz` | `frontend/src/app/(student)/student/courses/[id]/chapters/[chapterId]/quiz/page.jsx` | MATCHED |
| 8 | Opportunity Details & Applicant Overview | `ac0428d37431429dae749043dddc9b6b` | Company | `/company/opportunities/[id]` | `frontend/src/app/(company)/company/opportunities/[id]/page.jsx` | MATCHED |
| 9 | Instructor Assessment Preview | `11798987b31a4053ae49c931a16a6b5a` | Instructor | `/instructor/courses/[id]/assessment/preview` | `frontend/src/app/(instructor)/instructor/courses/[id]/assessment/preview/page.jsx` | MATCHED |
| 10 | One-to-One Student Chat | `002888e279a54f00b81f651888127dc6` | Student | `/student/messages` | `frontend/src/app/(student)/student/messages/page.jsx` | MATCHED |
| 11 | One-to-One Candidate Chat | `4362c4e86f214eb7bfeeceb85a3014a9` | Company | `/company/messages` | `frontend/src/app/(company)/company/messages/page.jsx` | MATCHED |
| 12 | Company Applications Inbox | `0414093dae7e4292a2a9a2e5c56a66f3` | Company | `/company/applications` | `frontend/src/app/(company)/company/applications/page.jsx` | MATCHED |
| 13 | Instructor Notifications | `b10a965745e64bc2bd63808e55ce5ebb` | Instructor | `/instructor/notifications` | `frontend/src/app/(instructor)/instructor/notifications/page.jsx` | MATCHED |
| 14 | Recruiter Account Settings | `2945aec09683452a8c61da5dfb0d15e8` | Company | `/company/settings` | `frontend/src/app/(company)/company/settings/page.jsx` | MATCHED |
| 15 | Student Onboarding | `389d8eb080b241acac5015406d560520` | Student | `/onboarding/student` | `frontend/src/app/(onboarding)/onboarding/student/page.jsx` | MATCHED |
| 16 | Company Onboarding | `f696736dfc07485e9fa060f0d68c5907` | Company | `/onboarding/company` | `frontend/src/app/(onboarding)/onboarding/company/page.jsx` | MATCHED |
| 17 | Instructor Assessment Builder | `2dfe4fa945424504a61e2ece293b1ccb` | Instructor | `/instructor/courses/[id]/assessment/edit` | `frontend/src/app/(instructor)/instructor/courses/[id]/assessment/edit/page.jsx` | MATCHED |
| 18 | Recruiter Messages | `5dd9cbeca3a5468490e4cbd2295aa94a` | Company | `/company/messages` | `frontend/src/app/(company)/company/messages/page.jsx` | MATCHED |
| 19 | Instructor My Courses | `2531e1e32d0a4fce822fad8f00c8d1cb` | Instructor | `/instructor/courses` | `frontend/src/app/(instructor)/instructor/courses/page.jsx` | MATCHED |
| 20 | Student Profile | `302749e9b0dd4f38bacfa4a7aa52843e` | Student | `/student/profile` | `frontend/src/app/(student)/student/profile/page.jsx` | MATCHED |
| 21 | Edit Opportunity | `58222f7b5e49475987792677ec88a620` | Company | `/company/opportunities/[id]/edit` | `frontend/src/app/(company)/company/opportunities/[id]/edit/page.jsx` | MATCHED |
| 22 | Admin Dashboard | `316092c9f24c4eef8f3e59df31189e9a` | Admin | `/admin/dashboard` | `frontend/src/app/(admin)/admin/dashboard/page.jsx` | MATCHED |
| 23 | Learn Hub | `202e876f690e4748ae3efed2f303d2db` | Student | `/student/learn` | `frontend/src/app/(student)/student/learn/page.jsx` | MATCHED |
| 24 | Instructor Student Course Progress | `f7a2caead0804fb6942548db4ef27d10` | Instructor | `/instructor/students/[id]/courses/[courseId]` | `frontend/src/app/(instructor)/instructor/students/[id]/courses/[courseId]/page.jsx` | MATCHED |
| 25 | Recruiter Notifications | `b69b05ec29424ce7b743f05cc3c75cff` | Company | `/company/notifications` | `frontend/src/app/(company)/company/notifications/page.jsx` | MATCHED |
| 26 | Instructor Dashboard | `548ad7576303480abc604deeebff77fa` | Instructor | `/instructor/dashboard` | `frontend/src/app/(instructor)/instructor/dashboard/page.jsx` | MATCHED |
| 27 | User Details & Account Overview | `db2dd2aa90954beda92fdd0f0f8028b4` | Admin | `/admin/users/[id]` | `frontend/src/app/(admin)/admin/users/[id]/page.jsx` | MATCHED |
| 28 | Instructor Onboarding | `1642bb58d6ea456888a786343162a1cb` | Instructor | `/onboarding/instructor` | `frontend/src/app/(onboarding)/onboarding/instructor/page.jsx` | MATCHED |
| 29 | Coins Wallet | `06485739c3304a5e84434f9bfd208eb7` | Student | `/student/wallet` | `frontend/src/app/(student)/student/wallet/page.jsx` | MATCHED |
| 30 | User Account Management & Status Actions | `932d501a68ed4454b7819f8832ab958d` | Admin | `/admin/users/[id]/manage` | `frontend/src/app/(admin)/admin/users/[id]/manage/page.jsx` | MATCHED |
| 31 | Community Feed | `596c2d5d16204f83ae42479b36b5b1e4` | Student | `/student/community` | `frontend/src/app/(student)/student/community/page.jsx` | MATCHED |
| 32 | Instructor My Profile | `d70deaf3d3c647b18d659a18a74cd3e3` | Instructor | `/instructor/profile` | `frontend/src/app/(instructor)/instructor/profile/page.jsx` | MATCHED |
| 33 | My Applications & Saved Opportunities | `3aebee52239b42cba8cdd559c94e7412` | Student | `/student/careers/applications` | `frontend/src/app/(student)/student/careers/applications/page.jsx` | MATCHED |
| 34 | Notifications | `c94b340d66fb430b9cd77b5593c228d6` | Student | `/student/notifications` | `frontend/src/app/(student)/student/notifications/page.jsx` | MATCHED |
| 35 | Student Lesson Viewer | `56e2adeecbea4dde8c15030eb17ad28c` | Student | `/student/courses/[id]/chapters/[chapterId]/lessons/[lessonId]` | `frontend/src/app/(student)/student/courses/[id]/chapters/[chapterId]/lessons/[lessonId]/page.jsx` | MATCHED |
| 36 | Public Landing Page | `929abc5a90184ade8fcad5958e0f99ce` | Public | `/` | `frontend/src/app/page.jsx` | MATCHED |
| 37 | Opportunity Details & Application | `dbf83dc12f5b44dfaf8342ce32ffebf2` | Student | `/student/careers/[id]` | `frontend/src/app/(student)/student/careers/[id]/page.jsx` | MATCHED |
| 38 | Approval / Rejection Decision Interface | `a9573a08ec384d3ea3b969e0879404dd` | Admin | `/admin/courses/reviews/[id]/decide` | `frontend/src/app/(admin)/admin/courses/reviews/[id]/decide/page.jsx` | MATCHED |
| 39 | Student Career Opportunities | `79547790aeb94096a586ea4cda73ed21` | Student | `/student/careers` | `frontend/src/app/(student)/student/careers/page.jsx` | MATCHED |
| 40 | Application Details | `522c04e805cb4277b4e799d929cc6207` | Company | `/company/applications/[id]` | `frontend/src/app/(company)/company/applications/[id]/page.jsx` | MATCHED |
| 41 | Admin Account Settings | `91b41d124d99403eac7ce258134e1c80` | Admin | `/admin/settings` | `frontend/src/app/(admin)/admin/settings/page.jsx` | MATCHED |
| 42 | Company Opportunities Dashboard | `9827f602301742728cc425d2af95e265` | Company | `/company/opportunities` | `frontend/src/app/(company)/company/opportunities/page.jsx` | MATCHED |
| 43 | Recruitment Pipeline | `fb46176776ba41baa4b8a094780fdb91` | Company | `/company/pipeline` | `frontend/src/app/(company)/company/pipeline/page.jsx` | MATCHED |
| 44 | Instructor Student Profile & Learning Progress | `7b73b485b9fd410c8f2e98319102da9b` | Instructor | `/instructor/students/[id]` | `frontend/src/app/(instructor)/instructor/students/[id]/page.jsx` | MATCHED |
| 45 | Candidate Evaluation | `83f2379c0d1d460cbb0d1a9151cfce43` | Company | `/company/talent/[id]/evaluate` | `frontend/src/app/(company)/company/talent/[id]/evaluate/page.jsx` | MATCHED |
| 46 | Platform Activity Dashboard | `94643cbccfda4458a1a6ec5d1eb04b5e` | Admin | `/admin/activity` | `frontend/src/app/(admin)/admin/activity/page.jsx` | MATCHED |
| 47 | Course Review Dashboard | `2e437dcbb5bf41cea9eba1dfcd8a6851` | Admin | `/admin/courses/reviews` | `frontend/src/app/(admin)/admin/courses/reviews/page.jsx` | MATCHED |
| 48 | Sign Up | `0d788dfe310642e580112a61eb626345` | Public | `/auth/signup` | `frontend/src/app/(public)/auth/signup/page.jsx` | MATCHED |
| 49 | Instructor Course Management Overview | `6202833e1d5c44b3b3431d36c9586424` | Instructor | `/instructor/courses/[id]` | `frontend/src/app/(instructor)/instructor/courses/[id]/page.jsx` | MATCHED |
| 50 | Instructor Student Directory | `5f220050acf34dbda5d1c6d152884253` | Instructor | `/instructor/students/directory` | `frontend/src/app/(instructor)/instructor/students/directory/page.jsx` | MATCHED |
| 51 | Chapter Details | `dbfba881f401491b80913432ae7124da` | Student | `/student/courses/[id]/chapters/[chapterId]` | `frontend/src/app/(student)/student/courses/[id]/chapters/[chapterId]/page.jsx` | MATCHED |
| 52 | Student Settings | `d06887c3079442ef86d1d986be8856ab` | Student | `/student/settings` | `frontend/src/app/(student)/student/settings/page.jsx` | MATCHED |
| 53 | Student Dashboard | `0e11a5087a034093b96a775d9d17e5b2` | Student | `/student/dashboard` | `frontend/src/app/(student)/student/dashboard/page.jsx` | MATCHED |
| 54 | Company Dashboard | `adb6678e155f4d0bb78cf11d1b1f60f0` | Company | `/company/dashboard` | `frontend/src/app/(company)/company/dashboard/page.jsx` | MATCHED |
| 55 | Reports & Analytics | `574612a5058e42c881a3c31049d9e500` | Admin | `/admin/reports` | `frontend/src/app/(admin)/admin/reports/page.jsx` | MATCHED |
| 56 | Instructor Settings | `39b94ba3d49a4618965ca18bef34fb83` | Instructor | `/instructor/settings` | `frontend/src/app/(instructor)/instructor/settings/page.jsx` | MATCHED |
| 57 | Admin Notifications | `4bf6a9d91fe94aa98acdf0ec006a0194` | Admin | `/admin/notifications` | `frontend/src/app/(admin)/admin/notifications/page.jsx` | MATCHED |
| 58 | Role Selection | `8e757571c5904faa87bf3cdf3f082628` | Authenticated | `/onboarding/role` | `frontend/src/app/(onboarding)/onboarding/role/page.jsx` | MATCHED |
| 59 | Activity Log & Event Details | `5a64e1f51de248b9b47cd30e57cabb26` | Admin | `/admin/activity/log` | `frontend/src/app/(admin)/admin/activity/log/page.jsx` | MATCHED |
| 60 | Course Details | `4a23a0653c6e49b399c7a71da6704df0` | Student | `/student/courses/[id]` | `frontend/src/app/(student)/student/courses/[id]/page.jsx` | MATCHED |
| 61 | Company Settings | `e2b7ff6f55a04b5e933888086983c439` | Company | `/company/settings` | `frontend/src/app/(company)/company/settings/page.jsx` | MATCHED |
| 62 | Company Public Profile | `1eec2f937b204086928716a4b969a604` | Company | `/company/profile` | `frontend/src/app/(company)/company/profile/page.jsx` | MATCHED |
| 63 | Instructor Create Course | `696c5e4eb9d54ae4b3f39b85d3548b64` | Instructor | `/instructor/courses/create` | `frontend/src/app/(instructor)/instructor/courses/create/page.jsx` | MATCHED |
| 64 | Saved Candidates | `17873fe924b8438686677891b98cbe71` | Company | `/company/talent/saved` | `frontend/src/app/(company)/company/talent/saved/page.jsx` | MATCHED |
| 65 | Admin Personal Profile | `8d6f1c252719477f9c4b791f051639c9` | Admin | `/admin/profile` | `frontend/src/app/(admin)/admin/profile/page.jsx` | MATCHED |
| 66 | Password Reset | `4706624a0743481f8da6eb80bf8d3673` | Public | `/auth/reset-password` | `frontend/src/app/(public)/auth/reset-password/page.jsx` | MATCHED |
| 67 | Create Opportunity | `ea413ccc59bd402abb391eb8dabe5984` | Company | `/company/opportunities/create` | `frontend/src/app/(company)/company/opportunities/create/page.jsx` | MATCHED |
| 68 | Sign In | `3d6d775dfeb94d4aab7a795140e45fed` | Public | `/auth/signin` | `frontend/src/app/(public)/auth/signin/page.jsx` | MATCHED |
| 69 | Student Talent Profile (Recruiter View) | `87df27c4b32f490288c28f96b128fa12` | Company | `/company/talent/[id]` | `frontend/src/app/(company)/company/talent/[id]/page.jsx` | MATCHED |
| 70 | Instructor Hybrid Lesson Builder | `a2969e8528e64885816b754bd67f6677` | Instructor | `/instructor/courses/[id]/lessons/[lessonId]/edit` | `frontend/src/app/(instructor)/instructor/courses/[id]/lessons/[lessonId]/edit/page.jsx` | MATCHED |
| 71 | Forgot Password | `8ba1bdeb73ff4453a039ed1d709330d5` | Public | `/auth/forgot-password` | `frontend/src/app/(public)/auth/forgot-password/page.jsx` | MATCHED |
| 72 | Final Assessment | `36973bb5303843ce9bfef67516a6dcfb` | Student | `/student/courses/[id]/assessment` | `frontend/src/app/(student)/student/courses/[id]/assessment/page.jsx` | MATCHED |
| 73 | Learning Progress | `0c75bd344d1741b9b8de6395dabccc78` | Student | `/student/progress` | `frontend/src/app/(student)/student/progress/page.jsx` | MATCHED |
| 74 | Course Curriculum Builder | `0dd3527558a04482a68471135e0f1f1b` | Instructor | `/instructor/courses/[id]/curriculum` | `frontend/src/app/(instructor)/instructor/courses/[id]/curriculum/page.jsx` | MATCHED |
| 75 | Instructor Student Management Dashboard | `4235688954064470ab68efeb64d61876` | Instructor | `/instructor/students` | `frontend/src/app/(instructor)/instructor/students/page.jsx` | MATCHED |
| 76 | Email Verification | `5510224934374cccbc565c63f5eb6785` | Public | `/auth/verify-email` | `frontend/src/app/(public)/auth/verify-email/page.jsx` | MATCHED |
