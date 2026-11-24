/**
 * Comprehensive Database & Integrity Validation Script
 * Tests:
 * 1. Record counts per model
 * 2. Uniqueness of emails and critical identifiers
 * 3. Relational / Foreign Key integrity (no orphaned records)
 * 4. Authentication logic for demo accounts
 * 5. Dashboard query contracts for Student, Instructor, Recruiter, and Admin
 */

import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import prisma from '../src/config/database.js';
import { comparePassword } from '../src/utils/security.js';
import { getPlatformStatistics, getCourseReviewQueue } from '../src/services/admin.service.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });
dotenv.config({ path: path.resolve(process.cwd(), 'backend/.env') });

const DEV_PASSWORD = 'DevTestPass2026!';

async function validate() {
  console.log('=============================================================');
  console.log('🔍 RUNNING SKILLORITY DATABASE INTEGRITY & AUTH VALIDATION');
  console.log('=============================================================\n');

  let passedChecks = 0;
  let failedChecks = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`  ✅ [PASS] ${message}`);
      passedChecks++;
    } else {
      console.error(`  ❌ [FAIL] ${message}`);
      failedChecks++;
    }
  }

  // --------------------------------------------------------------------------
  // 1. RECORD COUNTS ACROSS ALL MODELS
  // --------------------------------------------------------------------------
  console.log('1. Database Model Record Counts:');
  const models = [
    'user', 'profile', 'course', 'chapter', 'lesson', 'enrollment',
    'quizAttempt', 'assessmentAttempt', 'certificate', 'wallet',
    'walletTransaction', 'careerPath', 'studentCareerGoal', 'opportunity',
    'application', 'interview', 'offer', 'applicationTimeline',
    'communityPost', 'comment', 'message', 'notification', 'adminInvitation'
  ];

  const counts = {};
  for (const m of models) {
    try {
      const c = await prisma[m].count();
      counts[m] = c;
      console.log(`   - ${m.padEnd(20)}: ${c.toString().padStart(5)} records`);
    } catch (e) {
      console.error(`   - ${m.padEnd(20)}: ERROR: ${e.message}`);
    }
  }

  assert(counts.user >= 600, `Total Users >= 600 (Actual: ${counts.user})`);
  assert(counts.profile >= 600, `Total Profiles >= 600 (Actual: ${counts.profile})`);
  assert(counts.course >= 100, `Total Courses >= 100 (Actual: ${counts.course})`);
  assert(counts.chapter >= 500, `Total Chapters >= 500 (Actual: ${counts.chapter})`);
  assert(counts.lesson >= 1200, `Total Lessons >= 1200 (Actual: ${counts.lesson})`);
  assert(counts.enrollment >= 1000, `Total Enrollments >= 1000 (Actual: ${counts.enrollment})`);
  assert(counts.quizAttempt >= 1000, `Total Quiz Attempts >= 1000 (Actual: ${counts.quizAttempt})`);
  assert(counts.wallet >= 500, `Total Wallets >= 500 (Actual: ${counts.wallet})`);
  assert(counts.walletTransaction >= 1000, `Total Wallet Transactions >= 1000 (Actual: ${counts.walletTransaction})`);
  assert(counts.communityPost >= 50, `Total Community Posts >= 50 (Actual: ${counts.communityPost})`);
  assert(counts.application >= 100, `Total Job Applications >= 100 (Actual: ${counts.application})`);

  // User breakdown by role
  console.log('\n2. User Breakdown by Role:');
  const roleGroups = await prisma.user.groupBy({
    by: ['role'],
    _count: { id: true },
  });
  const roleCountMap = {};
  for (const rg of roleGroups) {
    roleCountMap[rg.role] = rg._count.id;
    console.log(`   - Role ${rg.role.padEnd(12)}: ${rg._count.id} users`);
  }
  assert(roleCountMap.STUDENT >= 500, `Students count >= 500 (Actual: ${roleCountMap.STUDENT})`);
  assert(roleCountMap.INSTRUCTOR >= 100, `Instructors count >= 100 (Actual: ${roleCountMap.INSTRUCTOR})`);
  assert(roleCountMap.COMPANY >= 20, `Companies count >= 20 (Actual: ${roleCountMap.COMPANY})`);
  assert(roleCountMap.ADMIN >= 5, `Admins count >= 5 (Actual: ${roleCountMap.ADMIN})`);

  // --------------------------------------------------------------------------
  // 3. UNIQUENESS INTEGRITY CHECKS
  // --------------------------------------------------------------------------
  console.log('\n3. Uniqueness Integrity:');
  const allUsers = await prisma.user.findMany({ select: { email: true } });
  const emailSet = new Set();
  let duplicateEmails = 0;
  for (const u of allUsers) {
    const em = u.email.toLowerCase();
    if (emailSet.has(em)) duplicateEmails++;
    emailSet.add(em);
  }
  assert(duplicateEmails === 0, `Zero duplicate emails found (Checked: ${allUsers.length})`);

  const allCerts = await prisma.certificate.findMany({ select: { credentialId: true } });
  const certIdSet = new Set();
  let duplicateCerts = 0;
  for (const c of allCerts) {
    if (certIdSet.has(c.credentialId)) duplicateCerts++;
    certIdSet.add(c.credentialId);
  }
  assert(duplicateCerts === 0, `Zero duplicate Certificate Credential IDs (Checked: ${allCerts.length})`);

  // --------------------------------------------------------------------------
  // 4. RELATIONAL INTEGRITY CHECKS (FOREIGN KEYS & ORPHANS)
  // --------------------------------------------------------------------------
  console.log('\n4. Relational & Foreign Key Integrity:');

  // Check Profiles have valid Users
  const sampleProfiles = await prisma.profile.findMany({ select: { userId: true }, take: 100 });
  const userIds = new Set((await prisma.user.findMany({ select: { id: true } })).map(u => u.id));
  const orphanedProfiles = sampleProfiles.filter(p => !userIds.has(p.userId));
  assert(orphanedProfiles.length === 0, `Sample profiles all resolve to valid Users (0 orphans)`);

  // Check Courses have valid Instructors
  const sampleCourses = await prisma.course.findMany({ select: { instructorId: true }, take: 100 });
  const orphanedCourses = sampleCourses.filter(c => !userIds.has(c.instructorId));
  assert(orphanedCourses.length === 0, `Sample courses all resolve to valid Instructors (0 orphans)`);

  // Check Chapters have valid Courses
  const courseIds = new Set((await prisma.course.findMany({ select: { id: true } })).map(c => c.id));
  const sampleChapters = await prisma.chapter.findMany({ select: { courseId: true }, take: 100 });
  const orphanedChapters = sampleChapters.filter(ch => !courseIds.has(ch.courseId));
  assert(orphanedChapters.length === 0, `Sample chapters all resolve to valid Courses (0 orphans)`);

  // Check Enrollments have valid Users and Courses
  const sampleEnrollments = await prisma.enrollment.findMany({ select: { userId: true, courseId: true }, take: 100 });
  const invalidEnrollments = sampleEnrollments.filter(e => !userIds.has(e.userId) || !courseIds.has(e.courseId));
  assert(invalidEnrollments.length === 0, `Sample enrollments all resolve to valid Users & Courses (0 orphans)`);

  // Check Applications have valid Students and Opportunities
  const oppIds = new Set((await prisma.opportunity.findMany({ select: { id: true } })).map(o => o.id));
  const sampleApps = await prisma.application.findMany({ select: { studentId: true, opportunityId: true }, take: 100 });
  const invalidApps = sampleApps.filter(a => !userIds.has(a.studentId) || !oppIds.has(a.opportunityId));
  assert(invalidApps.length === 0, `Sample applications all resolve to valid Students & Opportunities (0 orphans)`);

  // --------------------------------------------------------------------------
  // 5. DEMO ACCOUNT AUTHENTICATION & CREDENTIAL TESTS
  // --------------------------------------------------------------------------
  console.log('\n5. Demo Account Authentication Verification:');
  const demoAccounts = [
    { email: 'student.demo@skillority.app', expectedRole: 'STUDENT', label: 'Demo Student' },
    { email: 'instructor.demo@skillority.app', expectedRole: 'INSTRUCTOR', label: 'Demo Instructor' },
    { email: 'recruiter.demo@skillority.app', expectedRole: 'COMPANY', label: 'Demo Recruiter' },
    { email: 'admin.demo@skillority.app', expectedRole: 'ADMIN', label: 'Demo Admin' },
  ];

  for (const acc of demoAccounts) {
    const user = await prisma.user.findUnique({
      where: { email: acc.email },
      include: { profile: true, wallet: true },
    });

    assert(user !== null, `${acc.label} (${acc.email}) exists in database`);
    if (user) {
      assert(user.role === acc.expectedRole, `${acc.label} has correct role: ${acc.expectedRole}`);
      assert(user.isActive === true, `${acc.label} is marked active`);
      assert(user.isVerified === true, `${acc.label} is verified`);

      const passwordMatch = await comparePassword(DEV_PASSWORD, user.passwordHash);
      assert(passwordMatch === true, `${acc.label} password authentication matches "${DEV_PASSWORD}"`);
    }
  }

  // --------------------------------------------------------------------------
  // 6. DASHBOARD DATA INTEGRITY CONTRACTS
  // --------------------------------------------------------------------------
  console.log('\n6. Application Dashboard Contracts:');

  // Student Dashboard Contract
  const studentUser = await prisma.user.findUnique({
    where: { email: 'student.demo@skillority.app' },
    include: {
      profile: true,
      wallet: { include: { transactions: true } },
      enrollments: { include: { course: true } },
      careerGoals: { include: { careerPath: true } },
      applications: { include: { opportunity: true, offer: true, interviews: true } },
      certificates: true,
    },
  });

  assert(studentUser.profile?.firstName === 'Nour', `Student Demo profile name is Nour Ben Salem`);
  assert(studentUser.wallet?.balance > 0, `Student Demo wallet has positive balance: ${studentUser.wallet?.balance} coins`);
  assert(studentUser.wallet?.transactions.length > 0, `Student Demo has ${studentUser.wallet?.transactions.length} wallet transactions`);
  assert(studentUser.enrollments.length >= 5, `Student Demo is enrolled in ${studentUser.enrollments.length} courses`);
  assert(studentUser.certificates.length >= 2, `Student Demo has earned ${studentUser.certificates.length} certificates`);
  assert(studentUser.careerGoals.length >= 1, `Student Demo has established primary career goal`);
  assert(studentUser.applications.length >= 3, `Student Demo has submitted ${studentUser.applications.length} applications`);

  // Instructor Dashboard Contract
  const instructorUser = await prisma.user.findUnique({
    where: { email: 'instructor.demo@skillority.app' },
    include: {
      profile: true,
      coursesAuthored: {
        include: {
          chapters: { include: { lessons: true } },
          enrollments: true,
        },
      },
    },
  });

  assert(instructorUser.coursesAuthored.length >= 4, `Instructor Demo has authored ${instructorUser.coursesAuthored.length} courses`);
  const totalStudentsEnrolled = instructorUser.coursesAuthored.reduce((acc, c) => acc + c.enrollments.length, 0);
  assert(totalStudentsEnrolled > 0, `Instructor Demo has ${totalStudentsEnrolled} student enrollments across their courses`);

  // Recruiter Dashboard Contract
  const recruiterUser = await prisma.user.findUnique({
    where: { email: 'recruiter.demo@skillority.app' },
    include: {
      profile: true,
      companyOpportunities: {
        include: {
          applications: { include: { student: { include: { profile: true } } } },
        },
      },
      companyInterviews: true,
      companyOffers: true,
    },
  });

  assert(recruiterUser.companyOpportunities.length >= 2, `Recruiter Demo has posted ${recruiterUser.companyOpportunities.length} opportunities`);
  assert(recruiterUser.companyInterviews.length > 0, `Recruiter Demo has scheduled interviews`);
  assert(recruiterUser.companyOffers.length > 0, `Recruiter Demo has extended job offers`);

  // Admin Dashboard Contract (Platform Stats & Review Queue)
  const platformStats = await getPlatformStatistics();
  assert(platformStats.users?.total >= 600, `Admin getPlatformStatistics users.total: ${platformStats.users?.total}`);
  assert(platformStats.courses?.total >= 100, `Admin getPlatformStatistics courses.total: ${platformStats.courses?.total}`);
  assert(platformStats.enrollments?.total >= 1000, `Admin getPlatformStatistics enrollments.total: ${platformStats.enrollments?.total}`);
  assert(platformStats.courses?.pendingReview >= 5, `Admin getPlatformStatistics courses.pendingReview: ${platformStats.courses?.pendingReview}`);

  const reviewQueue = await getCourseReviewQueue();
  assert(reviewQueue.length >= 5, `Admin review queue contains ${reviewQueue.length} pending courses awaiting moderation`);

  console.log('\n=============================================================');
  console.log(`VALIDATION RESULT: ${passedChecks} Passed, ${failedChecks} Failed`);
  console.log('=============================================================\n');

  await prisma.$disconnect();

  if (failedChecks > 0) {
    process.exit(1);
  }
}

validate().catch(async (e) => {
  console.error('Validation threw unexpected error:', e);
  await prisma.$disconnect();
  process.exit(1);
});
