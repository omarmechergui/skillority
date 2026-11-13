# Skillority — Project Audit

**Audit Date:** 2026-11-12
**Auditor:** Principal Software Architect
**Workspace:** `c:\Users\USER\Desktop\skillority`

---

## 1. Executive Summary

The Skillority workspace is **empty** — no frontend, backend, configuration, or dependency files exist. This is a greenfield project. The Stitch design project contains **78 screens** across four roles (Student, Company/Recruiter, Instructor, Admin) plus authentication and onboarding flows.

> [!IMPORTANT]
> This is a **brand new project**. All implementation starts from scratch. No existing code to preserve, no conflicts to resolve.

---

## 2. Workspace Inspection Results

### 2.1 Current File System State

```
skillority/
└── docs/                  ← Created during this audit
    ├── PROJECT_AUDIT.md
    ├── ARCHITECTURE.md
    ├── SCREEN_INVENTORY.md
    └── IMPLEMENTATION_ROADMAP.md
```

**Frontend directory:** ⬜ Does not exist
**Backend directory:** ⬜ Does not exist
**Configuration files:** ⬜ None (no package.json, no .env, no .gitignore)
**Git repository:** ⬜ Not initialized

### 2.2 Existing Routes & Components

None — empty workspace.

### 2.3 Existing Dependencies

None — no `package.json` files exist.

---

## 3. Design Source Analysis

### 3.1 Stitch Projects Identified

| Project | ID | Screens | Role |
|---------|-----|---------|------|
| Duplicate of Skillority Platform Redesign | `18071031776430288694` | 65 | **Primary source of truth** |
| Skillority Instructor Lesson Builder UX/UI | `8177869117756269574` | 3 | Supplementary (Lesson Builder) |
| Skillority Platform Redesign | `4342781051277333193` | — | Original (superseded by duplicate) |
| Skillority Design System | `9029156295774080149` | — | Design tokens reference |

### 3.2 Design System Confirmed

From Stitch project metadata:

| Token | Value | Confirmed |
|-------|-------|-----------|
| Color Mode | Light | ✅ |
| Primary Color | `#2563EB` | ✅ |
| Secondary Color | `#D97706` | ✅ |
| Neutral Color | `#64748B` | ✅ |
| Font Family | Geist (headline, body, label) | ✅ |
| Roundness | `ROUND_EIGHT` (8px base → 12px cards) | ✅ |
| Background | `#F8F9FF` (close to `#F8FAFC`) | ✅ |
| Surface Lowest | `#FFFFFF` | ✅ |

### 3.3 Screen Count by Domain

| Domain | Count |
|--------|:-----:|
| Authentication & Onboarding | 10 |
| Student — Learning | 10 |
| Student — Career & Community | 5 |
| Student — Messaging & Wallet | 3 |
| Company / Recruiter | 18 |
| Instructor | 19 |
| Admin | 13 |
| **Total** | **78** |

---

## 4. Implementation Status Assessment

### Status: ⬜ Not Implemented (100%)

| Category | Status |
|----------|--------|
| Frontend scaffolding (Next.js) | ⬜ Not Implemented |
| Backend scaffolding (Express) | ⬜ Not Implemented |
| Database schema (Prisma) | ⬜ Not Implemented |
| Authentication system | ⬜ Not Implemented |
| Student module | ⬜ Not Implemented |
| Company module | ⬜ Not Implemented |
| Instructor module | ⬜ Not Implemented |
| Admin module | ⬜ Not Implemented |
| Messaging system | ⬜ Not Implemented |
| Notification system | ⬜ Not Implemented |
| Coins / Wallet system | ⬜ Not Implemented |
| Community feed | ⬜ Not Implemented |

---

## 5. Reusable Components Identified

Since the workspace is empty, these are **planned reusable components** based on Stitch screen analysis:

### 5.1 Layout Components (shared across roles)
- `Sidebar` — role-specific navigation items, same shell
- `TopBar` — search, notifications bell, user avatar dropdown
- `PageShell` — consistent page wrapper with header/actions

### 5.2 UI Primitives
- `Button` (primary, secondary, outline, ghost, danger)
- `Input`, `Textarea`, `Select`
- `Card`, `CardHeader`, `CardContent`
- `Badge`, `StatusBadge`
- `Avatar`, `AvatarGroup`
- `Modal`, `Dialog`, `ConfirmDialog`
- `Table`, `DataTable` with pagination
- `Tabs`, `TabPanel`
- `EmptyState`
- `Breadcrumb`
- `DropdownMenu`
- `Toast` / `Notification`

### 5.3 Shared Domain Components
- `CourseCard` — used in Student Learn Hub, Instructor My Courses, Admin Reviews
- `UserCard` — used in Admin Users, Instructor Students, Company Talent
- `OpportunityCard` — used in Student Careers, Company Opportunities
- `NotificationList` — shared notification UI across all roles
- `MessageThread` — shared messaging UI
- `StatsCard` — dashboard metrics card
- `ProgressBar` / `ProgressRing`

---

## 6. Architectural Risks & Technical Concerns

### 6.1 Critical Risks

| Risk | Severity | Mitigation |
|------|----------|------------|
| No auth system yet — all routes unprotected | 🔴 High | Implement auth in Phase 1 before any role-specific features |
| Prisma MongoDB — no migrations, only `db push` | 🟡 Medium | Use `prisma db push` carefully; version schema in Git |
| JWT secret management | 🔴 High | Strong secrets in `.env`, never commit |
| Large scope (78 screens) — risk of scope creep | 🟡 Medium | Strict phased implementation, MVP first |

### 6.2 Technical Decisions Needed

| Decision | Options | Recommendation |
|----------|---------|----------------|
| State management | React Context vs Zustand vs SWR | SWR for server state, Context for auth |
| Form handling | Native vs React Hook Form | React Hook Form + Zod |
| File uploads (avatars, thumbnails) | Local vs Cloudinary vs S3 | Cloudinary (simple, free tier) |
| Real-time messaging | Polling vs WebSocket vs Socket.io | Socket.io (Phase 3+) |
| Email service | Nodemailer + SMTP vs Resend | Resend (modern, simple) |

---

## 7. Blockers

| Blocker | Status | Required From |
|---------|--------|---------------|
| MongoDB Atlas connection string | ❌ Not available | User must create cluster & provide `.env` |
| JWT secret keys | ❌ Not available | Generate at project init |
| Email service credentials | ❌ Not available | Needed for email verification flow |
| Cloudinary credentials (if chosen) | ❌ Not available | Needed for file uploads |

> [!WARNING]
> The project cannot run end-to-end without a MongoDB Atlas connection string. A local fallback via Docker is possible for development.

---

## 8. Commands to Run the Project

### Prerequisites
```bash
# Install pnpm globally
npm install -g pnpm

# Ensure Node.js 20+ is installed
node --version
```

### After scaffolding is complete
```bash
# Frontend
cd frontend
pnpm install
pnpm dev          # → http://localhost:3000

# Backend (separate terminal)
cd backend
pnpm install
pnpm dev          # → http://localhost:5000

# Database
cd backend
npx prisma generate
npx prisma db push
```

---

## 9. Recommendations

### 9.1 Recommended Implementation Order

1. **Phase 0** — Project scaffolding (configs, dependencies, Git init)
2. **Phase 1** — Auth system (Sign Up, Sign In, JWT, role selection, onboarding)
3. **Phase 2** — Student core (Dashboard, Learn Hub, Course/Chapter/Lesson viewing)
4. **Phase 3** — Instructor core (Course creation, curriculum builder, lesson builder)
5. **Phase 4** — Admin core (Dashboard, user management, course reviews)
6. **Phase 5** — Company/Recruiter (Dashboard, opportunities, talent discovery)
7. **Phase 6** — Social features (Community, messaging, notifications)
8. **Phase 7** — Financial features (Coins wallet, transactions)
9. **Phase 8** — Polish, testing, deployment

### 9.2 First Implementation Task

**Phase 0: Project Scaffolding** — Initialize both frontend and backend projects with all dependencies, configuration files, design system setup, and folder structure. This requires no external credentials and unblocks all subsequent work.

See [IMPLEMENTATION_ROADMAP.md](./IMPLEMENTATION_ROADMAP.md) for the complete plan.

