# Skillority — Architecture Document

## 1. System Overview

Skillority is a professional learning and career development platform supporting four roles: **Student**, **Company/Recruiter**, **Instructor**, and **Admin**. The architecture follows a decoupled frontend/backend model.

```
skillority/
├── frontend/          # Next.js 14+ App Router (React, JSX, Tailwind CSS)
├── backend/           # Node.js + Express REST API
└── docs/              # Project documentation
```

---

## 2. Technology Stack

| Layer | Technology | Notes |
|-------|-----------|-------|
| Frontend Framework | Next.js 14+ (App Router) | JavaScript/JSX — NO TypeScript |
| UI Library | React 18+ | Client & Server Components |
| Styling | Tailwind CSS 3.4+ | Design system tokens |
| Icons | Lucide React | Consistent icon set |
| Fonts | Geist Sans + Geist Mono | Via `next/font` |
| Backend Framework | Express.js | REST API |
| Runtime | Node.js 20+ | LTS |
| Database | MongoDB Atlas | Cloud-hosted |
| ORM | Prisma (MongoDB provider) | NO Mongoose |
| Auth | JWT (access + refresh tokens) | httpOnly cookies |
| Package Manager | pnpm | Workspaces optional |

---

## 3. Frontend Architecture

### 3.1 Directory Structure

```
frontend/
├── public/
│   └── assets/
├── src/
│   ├── app/                      # Next.js App Router
│   │   ├── (public)/             # Public routes group
│   │   │   ├── page.jsx          # Landing page
│   │   │   └── auth/
│   │   │       ├── signin/
│   │   │       ├── signup/
│   │   │       ├── forgot-password/
│   │   │       ├── reset-password/
│   │   │       └── verify-email/
│   │   ├── (onboarding)/         # Onboarding flow
│   │   │   └── onboarding/
│   │   │       ├── role/
│   │   │       ├── student/
│   │   │       ├── company/
│   │   │       └── instructor/
│   │   ├── (student)/            # Student routes
│   │   │   └── student/
│   │   │       ├── dashboard/
│   │   │       ├── learn/
│   │   │       ├── courses/[id]/
│   │   │       ├── progress/
│   │   │       ├── careers/
│   │   │       ├── community/
│   │   │       ├── messages/
│   │   │       ├── notifications/
│   │   │       ├── wallet/
│   │   │       ├── profile/
│   │   │       └── settings/
│   │   ├── (company)/            # Company / Recruiter routes
│   │   │   └── company/
│   │   │       ├── dashboard/
│   │   │       ├── opportunities/
│   │   │       ├── applications/
│   │   │       ├── talent/
│   │   │       ├── pipeline/
│   │   │       ├── messages/
│   │   │       ├── notifications/
│   │   │       ├── profile/
│   │   │       └── settings/
│   │   ├── (instructor)/         # Instructor routes
│   │   │   └── instructor/
│   │   │       ├── dashboard/
│   │   │       ├── courses/
│   │   │       ├── students/
│   │   │       ├── notifications/
│   │   │       ├── profile/
│   │   │       └── settings/
│   │   ├── (admin)/              # Admin routes
│   │   │   └── admin/
│   │   │       ├── dashboard/
│   │   │       ├── users/
│   │   │       ├── courses/reviews/
│   │   │       ├── activity/
│   │   │       ├── reports/
│   │   │       ├── notifications/
│   │   │       ├── profile/
│   │   │       └── settings/
│   │   ├── layout.jsx
│   │   └── globals.css
│   ├── components/
│   │   ├── ui/                   # Reusable primitives (Button, Input, Card, Badge…)
│   │   ├── layout/               # Sidebar, TopBar, PageShell
│   │   ├── auth/                 # Auth forms
│   │   ├── student/              # Student-specific components
│   │   ├── company/              # Company-specific components
│   │   ├── instructor/           # Instructor-specific components
│   │   ├── admin/                # Admin-specific components
│   │   └── shared/               # Cross-role components (CourseCard, UserAvatar…)
│   ├── lib/
│   │   ├── api.js                # API client (fetch wrapper)
│   │   ├── auth.js               # Auth context & hooks
│   │   ├── constants.js          # Routes, config
│   │   └── utils.js              # Helpers
│   ├── hooks/                    # Custom React hooks
│   └── styles/                   # Additional style files
├── tailwind.config.js
├── next.config.js
├── jsconfig.json
└── package.json
```

### 3.2 Design System Tokens (Tailwind)

```js
// tailwind.config.js (key tokens)
module.exports = {
  theme: {
    extend: {
      colors: {
        canvas: '#F8FAFC',
        card: '#FFFFFF',
        border: '#E2E8F0',
        primary: {
          DEFAULT: '#2563EB',
          hover: '#1D4ED8',
          light: '#EFF6FF',
        },
        secondary: '#D97706',
        neutral: '#64748B',
      },
      fontFamily: {
        sans: ['Geist', 'sans-serif'],
        mono: ['Geist Mono', 'monospace'],
      },
      borderRadius: {
        DEFAULT: '12px',
        lg: '16px',
        md: '8px',
      },
    },
  },
};
```

### 3.3 Layout Strategy

Each role group has its own layout with a dedicated sidebar:

- **Public pages**: No sidebar, centered layout
- **Auth pages**: Split layout (form + branding panel)
- **Student / Company / Instructor**: Left sidebar + top bar + content area
- **Admin**: Left sidebar + top bar + content area (distinct nav)

---

## 4. Backend Architecture

### 4.1 Directory Structure

```
backend/
├── prisma/
│   └── schema.prisma             # Prisma schema (MongoDB)
├── src/
│   ├── server.js                 # Entry point
│   ├── app.js                    # Express app setup
│   ├── config/
│   │   ├── database.js           # Prisma client singleton
│   │   ├── env.js                # Environment validation
│   │   └── cors.js               # CORS config
│   ├── middleware/
│   │   ├── auth.js               # JWT verification
│   │   ├── authorize.js          # Role-based access
│   │   ├── validate.js           # Request validation
│   │   ├── errorHandler.js       # Global error handler
│   │   └── rateLimiter.js        # Rate limiting
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── user.routes.js
│   │   ├── course.routes.js
│   │   ├── chapter.routes.js
│   │   ├── lesson.routes.js
│   │   ├── assessment.routes.js
│   │   ├── opportunity.routes.js
│   │   ├── application.routes.js
│   │   ├── community.routes.js
│   │   ├── message.routes.js
│   │   ├── notification.routes.js
│   │   ├── wallet.routes.js
│   │   └── admin.routes.js
│   ├── controllers/              # Route handlers
│   ├── services/                 # Business logic
│   ├── utils/
│   │   ├── jwt.js
│   │   ├── password.js
│   │   └── response.js
│   └── validators/               # Input validation schemas
├── .env
├── .env.example
└── package.json
```

### 4.2 API Design

RESTful JSON API with consistent response format:

```json
{
  "success": true,
  "data": { },
  "message": "Operation successful",
  "meta": { "page": 1, "limit": 20, "total": 100 }
}
```

Error format:

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Descriptive error message",
    "details": []
  }
}
```

### 4.3 Authentication Flow

1. **Sign Up** → create user → send verification email → redirect to verify page
2. **Email Verification** → confirm token → mark verified
3. **Sign In** → validate credentials → issue access token (15min) + refresh token (7d, httpOnly cookie)
4. **Token Refresh** → validate refresh token → issue new access token
5. **Password Reset** → request reset → email link → verify token → update password

### 4.4 Authorization Model

```
Public           → no auth required
Authenticated    → valid JWT
Student          → JWT + role === 'STUDENT'
Company          → JWT + role === 'COMPANY'
Instructor       → JWT + role === 'INSTRUCTOR' + admin-invited
Admin            → JWT + role === 'ADMIN'
Owner            → JWT + resource.userId === jwt.userId
```

---

## 5. Database Schema (Prisma — MongoDB)

### 5.1 Core Models

```prisma
datasource db {
  provider = "mongodb"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

enum Role {
  STUDENT
  COMPANY
  INSTRUCTOR
  ADMIN
}

enum CourseStatus {
  DRAFT
  PENDING_REVIEW
  APPROVED
  REJECTED
  PUBLISHED
  ARCHIVED
}

model User {
  id                String   @id @default(auto()) @map("_id") @db.ObjectId
  email             String   @unique
  passwordHash      String
  role              Role
  isVerified        Boolean  @default(false)
  isActive          Boolean  @default(true)
  invitedByAdminId  String?  @db.ObjectId
  profile           Profile?
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt
}

model Profile {
  id           String   @id @default(auto()) @map("_id") @db.ObjectId
  userId       String   @unique @db.ObjectId
  user         User     @relation(fields: [userId], references: [id])
  firstName    String
  lastName     String
  avatar       String?
  bio          String?
  skills       String[]
  // Student-specific
  university   String?
  major        String?
  graduationYear Int?
  // Company-specific
  companyName  String?
  industry     String?
  companySize  String?
  website      String?
  // Instructor-specific
  expertise    String[]
  experience   String?
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
}

model Course {
  id            String       @id @default(auto()) @map("_id") @db.ObjectId
  instructorId  String       @db.ObjectId
  title         String
  description   String
  thumbnail     String?
  category      String
  level         String
  tags          String[]
  status        CourseStatus  @default(DRAFT)
  reviewNote    String?
  chapters      Chapter[]
  createdAt     DateTime     @default(now())
  updatedAt     DateTime     @updatedAt
}

model Chapter {
  id         String   @id @default(auto()) @map("_id") @db.ObjectId
  courseId   String   @db.ObjectId
  course     Course   @relation(fields: [courseId], references: [id])
  title      String
  order      Int
  isFree     Boolean  @default(false) // chapters 0-5 free
  coinsCost  Int      @default(0)
  lessons    Lesson[]
  quiz       Json?
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt
}

model Lesson {
  id         String   @id @default(auto()) @map("_id") @db.ObjectId
  chapterId  String   @db.ObjectId
  chapter    Chapter  @relation(fields: [chapterId], references: [id])
  title      String
  content    Json     // Block-based content
  order      Int
  duration   Int?     // minutes
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt
}
```

> [!NOTE]
> Additional models (Opportunity, Application, CommunityPost, Message, Notification, Wallet, Transaction, Enrollment) follow the same pattern. See IMPLEMENTATION_ROADMAP.md for phased schema expansion.

---

## 6. Security Architecture

| Concern | Approach |
|---------|---------|
| Authentication | JWT access + refresh tokens |
| Password storage | bcrypt (12 rounds) |
| Authorization | Middleware role checks + ownership validation |
| Input validation | Joi / Zod on every route |
| Rate limiting | express-rate-limit |
| CORS | Whitelist frontend origin only |
| XSS | React auto-escaping + CSP headers |
| CSRF | SameSite cookies + origin check |
| Secrets | `.env` files, never committed |

---

## 7. Deployment Architecture (Target)

```
┌──────────────────┐      ┌──────────────────┐
│  Vercel / Nginx  │      │  Railway / VPS   │
│  (Next.js SSR)   │─────▶│  (Express API)   │
│  Port 3000       │      │  Port 5000       │
└──────────────────┘      └──────┬───────────┘
                                 │
                          ┌──────▼───────────┐
                          │  MongoDB Atlas    │
                          │  (Cloud DB)       │
                          └──────────────────┘
```

---

## 8. Key Architectural Decisions

| Decision | Rationale |
|----------|-----------|
| App Router over Pages Router | Modern Next.js patterns, layouts, server components |
| Prisma over Mongoose | Type-safe queries, schema-first, migration support |
| JavaScript over TypeScript | Per project requirements |
| Express over Next.js API routes | Separation of concerns, independent scaling |
| JWT over sessions | Stateless, horizontally scalable |
| pnpm over npm/yarn | Faster installs, strict dependency management |
| Route groups `(role)/` | Clean URL structure, role-specific layouts |

