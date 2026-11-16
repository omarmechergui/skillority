# SKILLORITY — BACKEND API CONTRACT SPECIFICATION

> **API Base URL**: `/api` (and `/api/v1`)  
> **Format**: JSON, UTF-8  
> **Auth**: `Authorization: Bearer <accessToken>` (where protected)

---

## 1. Authentication & Sessions (`/api/auth`)

| Method | Endpoint | Auth | Description |
|---|---|:---:|---|
| `POST` | `/api/auth/signup/student` | None | Register student (`email`, `password`, `firstName`, `lastName`) |
| `POST` | `/api/auth/signup/company` | None | Register company (`email`, `password`, `firstName`, `lastName`, `companyName`) |
| `POST` | `/api/auth/login` | None | Authenticate with email/password; returns user + tokens |
| `POST` | `/api/auth/refresh` | Cookie | Rotate refresh token; returns new access token |
| `POST` | `/api/auth/logout` | Optional | Revoke refresh token & clear auth cookie |
| `GET` | `/api/auth/me` | Bearer | Return authenticated user, profile, and role state |
| `POST` | `/api/auth/forgot-password`| None | Dispatch password reset token |
| `POST` | `/api/auth/reset-password` | None | Apply new password with reset token |

---

## 2. Profiles & Settings (`/api/profiles`)

| Method | Endpoint | Auth | Description |
|---|---|:---:|---|
| `GET` | `/api/profiles/me` | Bearer | Get full profile of current user |
| `PATCH`| `/api/profiles/me` | Bearer | Update profile fields (bio, skills, links) |
| `GET` | `/api/profiles/:userId` | Bearer | Public/Recruiter view of a profile |

---

## 3. Courses & Curriculum (`/api/courses`)

| Method | Endpoint | Auth | Description |
|---|---|:---:|---|
| `GET` | `/api/courses` | Optional | Public catalog of published courses (filter, search) |
| `GET` | `/api/courses/:id` | Optional | Course syllabus, chapters overview, instructor bio |
| `POST` | `/api/courses` | INSTRUCTOR | Create new course draft |
| `PATCH`| `/api/courses/:id` | INSTRUCTOR | Update course metadata |
| `POST` | `/api/courses/:id/chapters` | INSTRUCTOR | Add chapter (order, title, free/coinsCost) |
| `POST` | `/api/courses/:id/chapters/:chId/lessons` | INSTRUCTOR | Add lesson (order, title, rich blocks) |
| `POST` | `/api/courses/:id/submit-review` | INSTRUCTOR | Submit draft course for Admin review |
| `POST` | `/api/courses/:id/review-decision` | ADMIN | Approve or reject submitted course |

---

## 4. Learning & Progress (`/api/learning`)

| Method | Endpoint | Auth | Description |
|---|---|:---:|---|
| `POST` | `/api/learning/enroll/:courseId` | STUDENT | Enroll in a course |
| `GET` | `/api/learning/my-courses` | STUDENT | List all enrolled courses with progress % |
| `POST` | `/api/learning/lessons/:id/complete` | STUDENT | Mark lesson complete; auto-updates progress % |
| `POST` | `/api/learning/chapters/:id/unlock` | STUDENT | Unlock paid chapter (validates balance, deducts Coins) |

---

## 5. Quizzes, Assessments & Certificates (`/api/assessments`)

| Method | Endpoint | Auth | Description |
|---|---|:---:|---|
| `POST` | `/api/assessments/quizzes/:chapterId/submit` | STUDENT | Submit quiz answers; returns score + reward |
| `POST` | `/api/assessments/courses/:courseId/submit` | STUDENT | Submit final assessment; evaluates certificate eligibility |
| `GET` | `/api/assessments/certificates` | STUDENT | List all earned certificates |
| `GET` | `/api/assessments/certificates/:credentialId`| Optional | Public verification of certificate authenticity |

---

## 6. Coins & Wallet (`/api/wallet`)

| Method | Endpoint | Auth | Description |
|---|---|:---:|---|
| `GET` | `/api/wallet` | STUDENT | Current coin balance & transaction history |
| `POST` | `/api/wallet/claim-daily-login` | STUDENT | Claim +5 Coins (max once per calendar day) |
| `POST` | `/api/wallet/claim-ad-reward` | STUDENT | Claim rewarded ad Coins (server validates 1-5 coins weighted distribution) |

---

## 7. Careers & Recruitment (`/api/careers`)

| Method | Endpoint | Auth | Description |
|---|---|:---:|---|
| `GET` | `/api/careers/opportunities` | Optional | List open opportunities (internship/job) |
| `GET` | `/api/careers/opportunities/:id` | Optional | Get opportunity details & requirements |
| `POST` | `/api/careers/opportunities` | COMPANY | Create new opportunity |
| `POST` | `/api/careers/opportunities/:id/apply` | STUDENT | Apply to opportunity |
| `GET` | `/api/careers/my-applications` | STUDENT | Student track application statuses |
| `GET` | `/api/careers/applications` | COMPANY | Recruiter applications inbox |
| `PATCH`| `/api/careers/applications/:id/status` | COMPANY | Update applicant pipeline status |

---

## 8. Community & Social (`/api/community`)

| Method | Endpoint | Auth | Description |
|---|---|:---:|---|
| `GET` | `/api/community/posts` | Optional | Feed posts (pagination, tags filter) |
| `POST` | `/api/community/posts` | Bearer | Create post |
| `POST` | `/api/community/posts/:id/like` | Bearer | Toggle like/unlike |
| `POST` | `/api/community/posts/:id/comments` | Bearer | Add comment to post |

---

## 9. Messaging & Notifications (`/api/messages`, `/api/notifications`)

| Method | Endpoint | Auth | Description |
|---|---|:---:|---|
| `GET` | `/api/messages/conversations` | Bearer | List user's conversations |
| `GET` | `/api/messages/conversations/:id` | Bearer | Get conversation message history |
| `POST` | `/api/messages/conversations/:id` | Bearer | Send a message to recipient |
| `GET` | `/api/notifications` | Bearer | Get unread/read notification stream |
| `PATCH`| `/api/notifications/:id/read` | Bearer | Mark notification as read |

---

## 10. Admin Management (`/api/admin`)

| Method | Endpoint | Auth | Description |
|---|---|:---:|---|
| `GET` | `/api/admin/users` | ADMIN | User management list & role filters |
| `PATCH`| `/api/admin/users/:id/status` | ADMIN | Suspend or restore user account |
| `GET` | `/api/admin/reviews` | ADMIN | Course review queue |
| `GET` | `/api/admin/activity` | ADMIN | Platform activity metrics & audit logs |
