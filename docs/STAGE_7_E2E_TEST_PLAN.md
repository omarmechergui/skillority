# STAGE 7 — END-TO-END (E2E) TEST PLAN

**Project**: Skillority  
**Date**: November 16, 2026  
**Status**: APPROVED & IN EXECUTION  
**Scope**: Full User Journeys (Student, Instructor, Company, Admin), Backend Security & RBAC Enforcement, Negative Testing, and Database Integrity Audit.

---

## 1. Test Architecture & Infrastructure

### 1.1 Execution Model
- **Environment**: Node.js v20+ / Windows 11 / Express.js Backend / Next.js 16 App Router Frontend.
- **Test Harness**: In-process simulated HTTP test harnesses and API client integration runners using Node's native test assertions (`assert`), preserving the strict zero-additional-bloat architecture.
- **Network / Database Realities**:
  - Live Atlas MongoDB URL (`cluster.mongodb.net`) has no active external DNS routing in this sandbox.
  - Tests explicitly audit both in-memory/in-process pipeline behavior and isolate MongoDB database-bound operations, labeling unresolvable Atlas queries honestly as **BLOCKED** rather than falsely green.
  - Fail-safe controller resilience is verified: failures produce handled JSON responses without unhandled process termination.

### 1.2 Multi-Role Test Personas

| Role | Test ID Prefix | Identity / Credentials | Primary Workflow Focus |
|---|---|---|---|
| **Student** | `E2E-STU` | Alex Morgan (`student@test.skillority.internal`) | Registration, Learn Hub, Free vs Paid Chapters, Quizzes, Certificates, Coin Wallet & Ads |
| **Instructor** | `E2E-INS` | Dr. Marcus Vance (`instructor@test.skillority.internal`) | Course Creation, Chapter & Lesson Authoring, Assessment Configuration, Review Submission |
| **Company** | `E2E-COM` | Elena Vance (`recruiter@techcorp.internal`) | Recruiter Onboarding, Opportunity Creation, Candidate Review, Status Updates |
| **Admin** | `E2E-ADM` | System Admin (`admin@skillority.internal`) | Platform Moderation, Review Decisioning (Approve/Reject), User Suspension/Activation |

---

## 2. Test Matrix by Domain

### 2.1 Student Journey (23 Scenarios)
- `STU-01`: Register new Student with valid credentials and verify JWT payload.
- `STU-02`: Login and verify cookie/token delivery.
- `STU-03`: Session restoration via `GET /api/auth/me`.
- `STU-04`: Update Student profile (bio, education, skills).
- `STU-05`: Browse published course catalog.
- `STU-06`: View course curriculum and syllabus details.
- `STU-07`: Free chapter enrollment (Chapters 0–5).
- `STU-08`: Paid chapter gatekeeping (Chapter 6+ requires Coins).
- `STU-09`: Chapter unlocking with sufficient Coins.
- `STU-10`: Lesson completion marking and progress tracking.
- `STU-11`: Chapter Quiz submission and scoring (70% pass threshold).
- `STU-12`: Final Course Assessment submission (80% pass threshold).
- `STU-13`: Separate Course Completion Certificate issuance.
- `STU-14`: Separate Final Assessment Certificate issuance.
- `STU-15`: Public verification of credential ID.
- `STU-16`: Daily login bonus (+5 Coins, 24h lockout).
- `STU-17`: Rewarded ad claim (stochastic weighted distribution).
- `STU-18`: Spending Coins on paid chapters.
- `STU-19`: Wallet transaction history ledger accuracy.
- `STU-20`: Community post creation.
- `STU-21`: Community comment and like toggling.
- `STU-22`: Sending direct message to connection.
- `STU-23`: Notification delivery and read status update.

### 2.2 Instructor Journey (13 Scenarios)
- `INS-01`: Instructor authentication and profile completion.
- `INS-02`: Course shell creation (`POST /api/courses`).
- `INS-03`: Chapter creation within course hierarchy.
- `INS-04`: Lesson creation within chapter hierarchy.
- `INS-05`: Rich-text/video content attachment.
- `INS-06`: Chapter quiz creation with questions/answers.
- `INS-07`: Final assessment configuration.
- `INS-08`: Submission of course for Admin publishing review.
- `INS-09`: Verification of `IN_REVIEW` status (locked for edits).
- `INS-10`: Verification of Admin approval transition to `PUBLISHED`.
- `INS-11`: Verification of Admin rejection transition to `REJECTED` with feedback.
- `INS-12`: Enforcement that unapproved courses are hidden from public catalog.
- `INS-13`: Ownership check: Instructor B cannot modify Instructor A's course.

### 2.3 Company / Recruiter Journey (12 Scenarios)
- `COM-01`: Recruiter authentication and company profile verification.
- `COM-02`: Opportunity / job creation (`POST /api/careers/opportunities`).
- `COM-03`: Opportunity editing and update.
- `COM-04`: Public listing of active opportunity.
- `COM-05`: Receipt of student applications.
- `COM-06`: Viewing candidate profile and credentials.
- `COM-07`: Talent discovery filtering (by skill, level).
- `COM-08`: Candidate bookmarking/saving.
- `COM-09`: Candidate evaluation scoring.
- `COM-10`: Application pipeline status progression (`REVIEWING`, `INTERVIEWING`, `OFFERED`, `REJECTED`).
- `COM-11`: Direct messaging with applicant.
- `COM-12`: Forbidden access to Instructor- or Admin-only routes.

### 2.4 Admin Journey (12 Scenarios)
- `ADM-01`: Admin authentication and platform dashboard metrics.
- `ADM-02`: User directory listing with pagination.
- `ADM-03`: User search by email and name.
- `ADM-04`: Role-based user filtering.
- `ADM-05`: Account suspension (`isActive: false`).
- `ADM-06`: Account reactivation (`isActive: true`).
- `ADM-07`: Instructor invitation code dispatch.
- `ADM-08`: Review queue retrieval (`GET /api/admin/courses/reviews`).
- `ADM-09`: Course review approval (`APPROVED`).
- `ADM-10`: Course review rejection (`REJECTED`) with mandatory feedback.
- `ADM-11`: Community moderation / post removal.
- `ADM-12`: Platform audit logging.

### 2.5 Security, Negative & Edge-Case Testing (16 Scenarios)
- `SEC-01`: Unauthenticated request to protected endpoint (401).
- `SEC-02`: Malformed or spoofed JWT token (401).
- `SEC-03`: Expired access token handling.
- `SEC-04`: Refresh token reuse detection & revocation.
- `SEC-05`: Student attempting Admin route (403).
- `SEC-06`: Company attempting Student onboarding/wallet (403).
- `SEC-07`: Instructor attempting to edit another instructor's course (403).
- `SEC-08`: Student attempting to review a course (403).
- `SEC-09`: Missing required fields in registration (400 validation error).
- `SEC-10`: Invalid email syntax (400).
- `SEC-11`: Password below complexity threshold (400).
- `SEC-12`: Non-existent resource ID (404).
- `SEC-13`: Duplicate daily coin claim within 24h window (400/handled).
- `SEC-14`: Insufficient coins when unlocking paid chapter (400/handled).
- `SEC-15`: Database timeout / DNS resolution handling (graceful handled error).
- `SEC-16`: Inactive Google OAuth & Google Meet placeholders (disabled state verified).

---

## 3. Reporting Protocol
Test runs will be logged in:
1. `docs/STAGE_7_E2E_TEST_REPORT.md` (End-to-End Functional Results)
2. `docs/STAGE_7_SECURITY_TEST_REPORT.md` (Security, RBAC, Negative Tests)
3. `docs/STAGE_7_DATABASE_VALIDATION_REPORT.md` (Database Persistence & Blockers)
