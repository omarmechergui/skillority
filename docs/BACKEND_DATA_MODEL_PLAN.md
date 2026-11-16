# SKILLORITY — BACKEND DATA MODEL PLAN

> **Database**: MongoDB Atlas via Prisma ORM  
> **Status**: Comprehensive Model Definition & Enhancement Plan

---

## 1. Existing Models vs Required Additions

| Model Name | Status in Codebase | Role / Responsibility |
|---|:---:|---|
| `User` | Existing | Authentication credentials, role, flags, tokenVersion |
| `Profile` | Existing | Polymorphic student, recruiter, instructor profile fields |
| `PasswordResetToken` | Existing | Password reset hashes and expiry |
| `RefreshToken` | Existing | Refresh token rotation and revocation |
| `AdminInvitation` | Existing | Instructor onboarding invitation lifecycle |
| `Course` | Existing | Course metadata, category, level, review status |
| `Chapter` | Existing | Chapter ordering (0-5 free, 6+ paid), quiz JSON, coins cost |
| `Lesson` | Existing | Rich content blocks (text, code, video, callout), duration |
| `Enrollment` | Existing | Student course progress, completed lessons, unlocked chapters |
| `Wallet` | Existing | Current utility coin balance |
| `WalletTransaction` | Existing | Credit/debit transaction audit ledger |
| `Opportunity` | Existing | Company jobs & internships |
| `Application` | Existing | Student job application and recruiter review state |
| `CommunityPost` | Existing | Social feed discussions and questions |
| `Comment` | Existing | Threaded responses on posts |
| **`QuizAttempt`** | **NEW REQUIRED** | Chapter quiz submission logs, score, and pass state |
| **`AssessmentAttempt`** | **NEW REQUIRED** | Course final assessment attempt, score, and certification trigger |
| **`Certificate`** | **NEW REQUIRED** | Dual-type certificate ledger (COMPLETION vs ASSESSMENT) |
| **`Conversation`** | **NEW REQUIRED** | One-to-one messaging thread pairing student and recruiter |
| **`Message`** | **NEW REQUIRED** | Chat messages with sender, recipient, content, and read status |
| **`Notification`** | **NEW REQUIRED** | User notification stream (read/unread, deep link) |
| **`CandidateEvaluation`**| **NEW REQUIRED** | Recruiter scorecards & candidate assessment notes |
| **`SavedCandidate`** | **NEW REQUIRED** | Recruiter saved candidate bookmarks |

---

## 2. Updated Prisma Schema Specification

```prisma
datasource db {
  provider = "mongodb"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

// -------------------------------------------------------------
// ENUMS
// -------------------------------------------------------------

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

enum OpportunityType {
  INTERNSHIP
  FULL_TIME
  PART_TIME
  CONTRACT
}

enum ApplicationStatus {
  PENDING
  REVIEWING
  INTERVIEW
  OFFERED
  REJECTED
}

enum TransactionType {
  CREDIT_BONUS
  CHAPTER_UNLOCK
  QUIZ_REWARD
  DAILY_LOGIN
  DAILY_MISSION
  AD_REWARD
  ADMIN_ADJUSTMENT
}

enum CertificateType {
  COURSE_COMPLETION
  FINAL_ASSESSMENT
}

// -------------------------------------------------------------
// USER & AUTHENTICATION
// -------------------------------------------------------------

model User {
  id               String          @id @default(auto()) @map("_id") @db.ObjectId
  email            String          @unique
  passwordHash     String
  role             Role
  isVerified       Boolean         @default(false)
  isActive         Boolean         @default(true)
  tokenVersion     Int             @default(0)
  invitedByAdminId String?         @db.ObjectId
  profile          Profile?
  wallet           Wallet?
  coursesAuthored  Course[]        @relation("InstructorCourses")
  enrollments      Enrollment[]
  applications     Application[]
  posts            CommunityPost[]
  comments         Comment[]
  quizAttempts     QuizAttempt[]
  assessmentAttempts AssessmentAttempt[]
  certificates     Certificate[]
  notifications    Notification[]
  sentMessages     Message[]       @relation("SenderMessages")
  createdAt        DateTime        @default(now())
  updatedAt        DateTime        @updatedAt
}

model Profile {
  id                 String   @id @default(auto()) @map("_id") @db.ObjectId
  userId             String   @unique @db.ObjectId
  user               User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  firstName          String
  lastName           String
  avatar             String?
  bio                String?
  skills             String[] @default([])
  university         String?
  major              String?
  graduationYear     Int?
  interests          String[] @default([])
  learningGoals      String?
  companyName        String?
  companyDescription String?
  industry           String?
  companySize        String?
  website            String?
  expertise          String[] @default([])
  experience         String?
  createdAt          DateTime @default(now())
  updatedAt          DateTime @updatedAt
}

model PasswordResetToken {
  id        String   @id @default(auto()) @map("_id") @db.ObjectId
  email     String
  tokenHash String   @unique
  expiresAt DateTime
  used      Boolean  @default(false)
  createdAt DateTime @default(now())
}

model RefreshToken {
  id        String   @id @default(auto()) @map("_id") @db.ObjectId
  userId    String   @db.ObjectId
  tokenHash String   @unique
  expiresAt DateTime
  revoked   Boolean  @default(false)
  createdAt DateTime @default(now())
}

model AdminInvitation {
  id          String   @id @default(auto()) @map("_id") @db.ObjectId
  email       String   @unique
  tokenHash   String   @unique
  role        Role     @default(INSTRUCTOR)
  createdById String   @db.ObjectId
  isAccepted  Boolean  @default(false)
  expiresAt   DateTime
  createdAt   DateTime @default(now())
}

// -------------------------------------------------------------
// COURSES, CHAPTERS & LESSONS
// -------------------------------------------------------------

model Course {
  id           String          @id @default(auto()) @map("_id") @db.ObjectId
  instructorId String          @db.ObjectId
  instructor   User            @relation("InstructorCourses", fields: [instructorId], references: [id])
  title        String
  description  String
  thumbnail    String?
  category     String
  level        String
  tags         String[]        @default([])
  status       CourseStatus    @default(DRAFT)
  reviewNote   String?
  chapters     Chapter[]
  enrollments  Enrollment[]
  certificates Certificate[]
  finalAssessment Json?        // Final assessment question bank & passing criteria
  createdAt    DateTime        @default(now())
  updatedAt    DateTime        @updatedAt
}

model Chapter {
  id        String        @id @default(auto()) @map("_id") @db.ObjectId
  courseId  String        @db.ObjectId
  course    Course        @relation(fields: [courseId], references: [id], onDelete: Cascade)
  title     String
  order     Int           // Chapters 0-5 free; Chapter 6+ requires coins
  isFree    Boolean       @default(false)
  coinsCost Int           @default(0)
  lessons   Lesson[]
  quiz      Json?         // Structured chapter quiz JSON definition
  attempts  QuizAttempt[]
  createdAt DateTime      @default(now())
  updatedAt DateTime      @updatedAt
}

model Lesson {
  id        String   @id @default(auto()) @map("_id") @db.ObjectId
  chapterId String   @db.ObjectId
  chapter   Chapter  @relation(fields: [chapterId], references: [id], onDelete: Cascade)
  title     String
  content   Json     // Hybrid rich blocks: text, code, video, callout
  order     Int
  duration  Int?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Enrollment {
  id                 String   @id @default(auto()) @map("_id") @db.ObjectId
  userId             String   @db.ObjectId
  user               User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  courseId           String   @db.ObjectId
  course             Course   @relation(fields: [courseId], references: [id], onDelete: Cascade)
  completedLessonIds String[] @default([])
  unlockedChapterIds String[] @default([])
  progressPercent    Float    @default(0.0)
  isCompleted        Boolean  @default(false)
  completedAt        DateTime?
  createdAt          DateTime @default(now())
  updatedAt          DateTime @updatedAt

  @@unique([userId, courseId])
}

// -------------------------------------------------------------
// QUIZZES, ASSESSMENTS & CERTIFICATES
// -------------------------------------------------------------

model QuizAttempt {
  id          String   @id @default(auto()) @map("_id") @db.ObjectId
  userId      String   @db.ObjectId
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  chapterId   String   @db.ObjectId
  chapter     Chapter  @relation(fields: [chapterId], references: [id], onDelete: Cascade)
  score       Int      // Earned percentage
  passed      Boolean
  coinsAwarded Int     @default(0)
  answers     Json     // Selected answers
  createdAt   DateTime @default(now())
}

model AssessmentAttempt {
  id          String   @id @default(auto()) @map("_id") @db.ObjectId
  userId      String   @db.ObjectId
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  courseId    String   @db.ObjectId
  score       Int
  passed      Boolean
  certificateIssued Boolean @default(false)
  createdAt   DateTime @default(now())
}

model Certificate {
  id             String          @id @default(auto()) @map("_id") @db.ObjectId
  recipientId    String          @db.ObjectId
  recipient      User            @relation(fields: [recipientId], references: [id], onDelete: Cascade)
  courseId       String          @db.ObjectId
  course         Course          @relation(fields: [courseId], references: [id], onDelete: Cascade)
  type           CertificateType // COURSE_COMPLETION vs FINAL_ASSESSMENT
  credentialId   String          @unique
  issuedAt       DateTime        @default(now())
}

// -------------------------------------------------------------
// COINS & WALLET
// -------------------------------------------------------------

model Wallet {
  id           String              @id @default(auto()) @map("_id") @db.ObjectId
  userId       String              @unique @db.ObjectId
  user         User                @relation(fields: [userId], references: [id], onDelete: Cascade)
  balance      Int                 @default(100)
  transactions WalletTransaction[]
  lastLoginBonus DateTime?
  createdAt    DateTime            @default(now())
  updatedAt    DateTime            @updatedAt
}

model WalletTransaction {
  id          String          @id @default(auto()) @map("_id") @db.ObjectId
  walletId    String          @db.ObjectId
  wallet      Wallet          @relation(fields: [walletId], references: [id], onDelete: Cascade)
  amount      Int
  type        TransactionType
  description String
  referenceId String?
  createdAt   DateTime        @default(now())
}

// -------------------------------------------------------------
// CAREERS, OPPORTUNITIES & RECRUITMENT
// -------------------------------------------------------------

model Opportunity {
  id           String          @id @default(auto()) @map("_id") @db.ObjectId
  companyId    String          @db.ObjectId
  title        String
  description  String
  type         OpportunityType @default(INTERNSHIP)
  location     String
  skills       String[]        @default([])
  isOpen       Boolean         @default(true)
  applications Application[]
  createdAt    DateTime        @default(now())
  updatedAt    DateTime        @updatedAt
}

model Application {
  id            String            @id @default(auto()) @map("_id") @db.ObjectId
  opportunityId String            @db.ObjectId
  opportunity   Opportunity       @relation(fields: [opportunityId], references: [id], onDelete: Cascade)
  studentId     String            @db.ObjectId
  student       User              @relation(fields: [studentId], references: [id], onDelete: Cascade)
  status        ApplicationStatus @default(PENDING)
  notes         String?
  createdAt     DateTime          @default(now())
  updatedAt     DateTime          @updatedAt

  @@unique([opportunityId, studentId])
}

// -------------------------------------------------------------
// COMMUNITY, MESSAGING & NOTIFICATIONS
// -------------------------------------------------------------

model CommunityPost {
  id        String    @id @default(auto()) @map("_id") @db.ObjectId
  authorId  String    @db.ObjectId
  author    User      @relation(fields: [authorId], references: [id], onDelete: Cascade)
  title     String
  content   String
  tags      String[]  @default([])
  likesCount Int      @default(0)
  likedByIds String[] @default([])
  comments  Comment[]
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
}

model Comment {
  id        String        @id @default(auto()) @map("_id") @db.ObjectId
  postId    String        @db.ObjectId
  post      CommunityPost @relation(fields: [postId], references: [id], onDelete: Cascade)
  authorId  String        @db.ObjectId
  author    User          @relation(fields: [authorId], references: [id], onDelete: Cascade)
  content   String
  createdAt DateTime      @default(now())
  updatedAt DateTime      @updatedAt
}

model Message {
  id             String   @id @default(auto()) @map("_id") @db.ObjectId
  conversationId String   @db.ObjectId
  senderId       String   @db.ObjectId
  sender         User     @relation("SenderMessages", fields: [senderId], references: [id], onDelete: Cascade)
  recipientId    String   @db.ObjectId
  content        String
  isRead         Boolean  @default(false)
  createdAt      DateTime @default(now())
}

model Notification {
  id        String   @id @default(auto()) @map("_id") @db.ObjectId
  userId    String   @db.ObjectId
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  title     String
  message   String
  type      String
  linkUrl   String?
  isRead    Boolean  @default(false)
  createdAt DateTime @default(now())
}
```
