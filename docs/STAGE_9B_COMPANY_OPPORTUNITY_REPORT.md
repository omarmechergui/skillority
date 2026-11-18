# STAGE 9B — COMPANY OPPORTUNITY CREATION REPORT

**Project**: Skillority  
**Milestone**: Stage 9B — Full Frontend-Backend Integration  
**Date**: November 17, 2026  
**Auditor / Implementer**: Senior Full-Stack Integration & QA Engineer  
**Status**: **100% VERIFIED & COMPLETED**

---

## 1. Objective
Connect Company / Recruiter opportunity authoring, listing, and persistence to the real Express backend API and MongoDB Atlas database via Prisma ORM, replacing client-only redirects with live database creation, loading/error states, duplicate submission prevention, and RBAC security enforcement.

---

## 2. Initial State & Root Cause
* **Initial State**: On `/company/opportunities/create`, submitting the form intercepted the event via `e.preventDefault()` and called `router.push('/company/opportunities')` with zero API interaction. In `/company/opportunities`, the page rendered only static items from `mockCompanyData.js`.
* **Root Cause**: The view was an interactive UI prototype that had not yet been wired to `frontend/src/lib/api/careers.js`. Additionally, the frontend career API module had minor path mismatches (`/careers/applications/my` vs `/careers/my-applications`), and backend queries did not support filtering by `companyId` or returning only company-scoped vacancies.

---

## 3. Files Inspected & Modified

### Files Inspected:
* `frontend/src/app/(company)/company/opportunities/create/page.jsx`
* `frontend/src/app/(company)/company/opportunities/page.jsx`
* `frontend/src/lib/api/careers.js`
* `backend/src/routes/career.routes.js`
* `backend/src/controllers/career.controller.js`
* `backend/src/services/career.service.js`
* `backend/src/validators/career.validators.js`

### Files Modified:
1. [careers.js](file:///C:/Users/USER/Desktop/skillority/frontend/src/lib/api/careers.js): Standardized endpoint paths (`getMyApplications` to `/careers/my-applications`, `applyToOpportunity` payload from `coverNote` to `notes`).
2. [career.controller.js](file:///C:/Users/USER/Desktop/skillority/backend/src/controllers/career.controller.js): Updated `listOpportunities` to accept `companyId` and `isOpen` query parameters.
3. [career.service.js](file:///C:/Users/USER/Desktop/skillority/backend/src/services/career.service.js): Enhanced `listOpportunities` Prisma query to filter by `companyId` for recruiter dashboards and manage vacancy status.
4. [create/page.jsx](file:///C:/Users/USER/Desktop/skillority/frontend/src/app/(company)/company/opportunities/create/page.jsx): Wired form submit to `careerApi.createOpportunity()`, added loading spinner, disabled inputs during creation, added error alert banners, and parsed comma-separated skills into clean string arrays.
5. [opportunities/page.jsx](file:///C:/Users/USER/Desktop/skillority/frontend/src/app/(company)/company/opportunities/page.jsx): Connected live opportunity retrieval filtering by authenticated `user.id`, with empty state UI when no postings exist.

---

## 4. API & Database Specifications
* **Endpoint Used**: `POST /api/careers/opportunities`
* **Authentication**: Required (`requireAuth`, Bearer JWT or Cookie)
* **RBAC Allowed**: `COMPANY` (Rejects `STUDENT` and `INSTRUCTOR` with 403)
* **Payload Schema (Zod)**:
  * `title`: String, min 5, max 100 characters.
  * `description`: String, min 10, max 2000 characters.
  * `type`: Enum (`INTERNSHIP`, `FULL_TIME`, `PART_TIME`, `CONTRACT`).
  * `location`: String, min 2 characters.
  * `skills`: Array of strings (min 1).
* **Database Model**: `Opportunity` in MongoDB Atlas:
  * `isOpen: true` upon creation.
  * Tied to authenticated company `companyId`.

---

## 5. Security & Persistence Verification

A live automated verification script was executed against the database and server endpoints:

| Verification Check | Target Role / Action | Expected Result | Actual Result | Status |
|---|---|---|---|---|
| **A. Unauthenticated Attempt** | Anonymous POST to `/api/careers/opportunities` | `401 UNAUTHORIZED` | `401` returned | ✅ **PASS** |
| **B. Student Role RBAC** | Authenticated `STUDENT` token | `403 FORBIDDEN` | `403` returned | ✅ **PASS** |
| **C. Invalid Payload** | Title < 5 chars, Description < 10 | `400 VALIDATION_ERROR` | `400` returned with field errors | ✅ **PASS** |
| **D. Valid Company Creation** | Authenticated `COMPANY` token | `201 CREATED`, `isOpen: true` | `201` returned, Opportunity ID created | ✅ **PASS** |
| **E. MongoDB Persistence** | Direct `prisma.opportunity.findUnique()` | Opportunity record exists with companyId | Verified in MongoDB Atlas | ✅ **PASS** |
| **F. Teardown & Hygiene** | Cleanup test user and opportunity | All test records deleted | Verified clean | ✅ **PASS** |

---

## 6. Stage 9B Verdict
* **Stage Status**: **COMPLETE & VERIFIED (100% PASS)**
* **Remaining Blockers for 9B**: **NONE**
