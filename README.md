# Skillority — Professional Learning & Career Development Platform

> Built with Next.js App Router, Express, Tailwind CSS, Prisma, and MongoDB Atlas.

---

## 1. Project Overview

Skillority is an enterprise SaaS platform connecting **Students**, **Instructors**, **Companies/Recruiters**, and **Administrators** across learning, skill development, mentorship, and career placement.

### Key Architecture
- **Monorepo / Workspace Structure:** `pnpm` workspaces separating `frontend/`, `backend/`, and `docs/`.
- **Frontend:** Next.js 14 App Router, React 18, JavaScript/JSX, Tailwind CSS with Geist fonts.
- **Backend:** Node.js, Express REST API, Prisma ORM with MongoDB provider.
- **Design Reference:** Google Stitch Project (`18071031776430288694`).

---

## 2. Directory Structure

```
skillority/
├── frontend/             # Next.js 14 App Router (port 3000)
│   ├── src/
│   │   ├── app/          # App Router layouts, pages, and API routes
│   │   ├── components/   # UI primitives and shared components
│   │   └── lib/          # Utilities and API clients
│   ├── public/           # Static assets
│   ├── tailwind.config.js
│   ├── next.config.js
│   └── package.json
├── backend/              # Express REST API (port 5000)
│   ├── prisma/           # Prisma MongoDB schema definition
│   ├── src/
│   │   ├── config/       # Database and environment configurations
│   │   ├── app.js        # Express application setup and middleware
│   │   └── server.js     # Server entry point
│   └── package.json
├── docs/                 # Architectural and audit documentation
│   ├── PROJECT_AUDIT.md
│   ├── ARCHITECTURE.md
│   ├── SCREEN_INVENTORY.md
│   ├── IMPLEMENTATION_ROADMAP.md
│   ├── PHASE_0_VALIDATION_REPORT.md
│   └── PHASE_1_REPORT.md
├── pnpm-workspace.yaml
├── package.json
└── README.md
```

---

## 3. Getting Started

### Prerequisites
- **Node.js:** v20.x or higher LTS
- **pnpm:** v9.x or higher (`npm install -g pnpm`)

### Installation

Clone the repository and install all dependencies using `pnpm`:

```bash
pnpm install
```

### Environment Configuration

1. **Frontend:**
   ```bash
   cp frontend/.env.example frontend/.env.local
   ```
2. **Backend:**
   ```bash
   cp backend/.env.example backend/.env
   ```
   *Note: Update `DATABASE_URL` with your MongoDB Atlas connection string when ready.*

---

## 4. Running the Development Servers

You can run both services concurrently from the root directory or individually:

```bash
# Run both frontend and backend concurrently
pnpm dev

# Or run frontend only (http://localhost:3000)
pnpm dev:frontend

# Or run backend only (http://localhost:5000)
pnpm dev:backend
```

### Health Check Endpoints
- **Frontend Health:** [http://localhost:3000/api/health](http://localhost:3000/api/health)
- **Backend Health:** [http://localhost:5000/api/health](http://localhost:5000/api/health)

---

## 5. Database & Prisma

```bash
# Generate Prisma Client
pnpm --filter backend prisma:generate

# Push schema changes to MongoDB Atlas
pnpm --filter backend prisma:push
```

---

## 6. Code Quality & Linting

```bash
pnpm lint
```

---

## 7. Design System Guidelines

- **Canvas Background:** `#F8FAFC`
- **Card Background:** `#FFFFFF`
- **Border Color:** `#E2E8F0`
- **Primary Accent:** `#2563EB` (Hover: `#1D4ED8`, Active light: `#EFF6FF`)
- **Secondary Accent:** `#D97706`
- **Typography:** Geist Sans & Geist Mono
- **Border Radius:** `12px` default card curvature
- **Icons:** Lucide React

