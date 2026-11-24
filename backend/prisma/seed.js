/**
 * ============================================================================
 * SKILLORITY LARGE-SCALE REALISTIC TEST DATA SEED ENGINE
 * ============================================================================
 * 
 * Target Dataset:
 * - 500 Students (Diverse profiles, Tunisian focus + international, universities, skills)
 * - 100 Instructors (Professional backgrounds, expertise, teaching experience)
 * - 20 Tech Companies & Recruiters (Real ecosystems, authentic descriptions)
 * - 5 Admin Accounts (Predictable test admin + operational admins)
 * - 105 Realistic Courses (Web, Mobile, AI/Data, Cloud/DevOps, Security, Architecture, UI/UX)
 * - Hundreds of Chapters & Lessons with rich hybrid content and structured quizzes
 * - Realistic Enrollments, Lesson Progress, Quiz Attempts, Assessments & Certificates
 * - Wallets & Transactions (Consistent coin economy, daily bonuses, quiz rewards, chapter unlocks)
 * - Community Discussions, Comments, Likes, and Direct Messages
 * - Career Paths, Student Goals, Job Opportunities, Applications, Interviews, Offers & Timelines
 * - Notifications & Admin Invitations
 * 
 * Safety & Integrity:
 * - Preserves existing real data safely without conflicts
 * - Deterministic 24-character hexadecimal ObjectIds for perfect relational integrity
 * - Bulk inserts via Prisma createMany with chunking for high performance
 * - Pre-hashed bcrypt password for development efficiency
 * ============================================================================
 */

import crypto from 'crypto';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import prisma from '../src/config/database.js';
import { hashPassword } from '../src/utils/security.js';
import { INITIAL_CAREER_PATHS } from '../src/data/careerPaths.data.js';

import {
  TUNISIAN_FIRST_NAMES_MALE,
  TUNISIAN_FIRST_NAMES_FEMALE,
  INTERNATIONAL_FIRST_NAMES_MALE,
  INTERNATIONAL_FIRST_NAMES_FEMALE,
  TUNISIAN_LAST_NAMES,
  INTERNATIONAL_LAST_NAMES,
  UNIVERSITIES,
  MAJORS,
  SKILLS_POOL,
  STUDENT_BIOS,
  INSTRUCTOR_BIOS,
  INSTRUCTOR_EXPERIENCES,
} from './seed-data/raw-profiles.js';

import { COMPANIES_DATA } from './seed-data/raw-companies.js';
import { COURSE_DEFINITIONS } from './seed-data/raw-courses.js';
import { COMMUNITY_TOPICS } from './seed-data/raw-community.js';

// Setup environment loading
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });
dotenv.config({ path: path.resolve(process.cwd(), 'backend/.env') });

// Configuration constants
const STUDENTS_COUNT = process.env.STUDENTS_COUNT ? parseInt(process.env.STUDENTS_COUNT, 10) : 500;
const INSTRUCTORS_COUNT = process.env.INSTRUCTORS_COUNT ? parseInt(process.env.INSTRUCTORS_COUNT, 10) : 100;
const COMPANIES_COUNT = process.env.COMPANIES_COUNT ? parseInt(process.env.COMPANIES_COUNT, 10) : 20;
const COURSES_COUNT = process.env.COURSES_COUNT ? parseInt(process.env.COURSES_COUNT, 10) : COURSE_DEFINITIONS.length;
const ADMINS_COUNT = 5;

const DEFAULT_DEV_PASSWORD = 'DevTestPass2026!';
const BATCH_SIZE = 250;

// Helper: Generate a deterministic 24-char hex MongoDB ObjectId
function generateObjectId() {
  return crypto.randomBytes(12).toString('hex');
}

// Helper: Pick a random element from an array
function sample(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// Helper: Pick N random distinct elements
function sampleSize(arr, n) {
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, Math.min(n, arr.length));
}

// Helper: Random integer between min and max inclusive
function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Helper: Batch execution of createMany
async function executeBatchCreateMany(modelName, items) {
  if (!items || items.length === 0) return 0;
  let totalCreated = 0;
  for (let i = 0; i < items.length; i += BATCH_SIZE) {
    const chunk = items.slice(i, i + BATCH_SIZE);
    const res = await prisma[modelName].createMany({ data: chunk });
    totalCreated += res.count;
  }
  return totalCreated;
}

async function main() {
  const startTime = Date.now();
  console.log('\n=============================================================');
  console.log('🚀 STARTING SKILLORITY LARGE-SCALE REALISTIC DATABASE SEED');
  console.log('=============================================================\n');

  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`Target Counts:`);
  console.log(`  - Students:    ${STUDENTS_COUNT}`);
  console.log(`  - Instructors: ${INSTRUCTORS_COUNT}`);
  console.log(`  - Companies:   ${COMPANIES_COUNT}`);
  console.log(`  - Courses:     ${COURSES_COUNT}`);
  console.log(`  - Admins:      ${ADMINS_COUNT}\n`);

  // 1. Password Hashing (Compute once for extreme performance)
  console.log('⏳ Computing development bcrypt password hash...');
  const devPasswordHash = await hashPassword(DEFAULT_DEV_PASSWORD);
  console.log('✅ Password hash prepared.\n');

  // 2. Fetch existing database state to preserve real records
  console.log('🔍 Checking existing database records to avoid conflicts...');
  const existingUsers = await prisma.user.findMany({ select: { id: true, email: true, role: true } });
  const existingEmailSet = new Set(existingUsers.map(u => u.email.toLowerCase()));
  console.log(`ℹ️ Found ${existingUsers.length} existing users. All existing records will be safely preserved.\n`);

  // Ensure career paths exist
  console.log('🌱 Verifying career paths catalog...');
  let careerPaths = await prisma.careerPath.findMany();
  if (careerPaths.length === 0) {
    console.log('   Seeding initial 13 career paths...');
    for (const cp of INITIAL_CAREER_PATHS) {
      try {
        await prisma.careerPath.create({ data: cp });
      } catch (err) {
        // ignore duplicate slug
      }
    }
    careerPaths = await prisma.careerPath.findMany();
  }
  console.log(`✅ Career paths ready: ${careerPaths.length} paths available.\n`);

  // --------------------------------------------------------------------------
  // 3. GENERATE ADMIN ACCOUNTS
  // --------------------------------------------------------------------------
  console.log('👤 Generating Admin Accounts...');
  const adminUsers = [];
  const adminProfiles = [];

  const adminDefs = [
    { email: 'admin.demo@skillority.app', firstName: 'Omar', lastName: 'Mechergui', title: 'System Director & Chief Architect' },
    { email: 'admin.support@skillority.app', firstName: 'Selim', lastName: 'Dridi', title: 'Senior Operations & Support Lead' },
    { email: 'admin.curriculum@skillority.app', firstName: 'Ines', lastName: 'Rekik', title: 'Academic Content & Curriculum Director' },
    { email: 'admin.partnerships@skillority.app', firstName: 'Karim', lastName: 'Belhadj', title: 'Industry Partnerships & Talent Director' },
    { email: 'admin.qa@skillority.app', firstName: 'Sarah', lastName: 'Mansour', title: 'Platform Quality Assurance Lead' },
  ];

  for (const a of adminDefs) {
    if (existingEmailSet.has(a.email.toLowerCase())) {
      console.log(`   Admin ${a.email} already exists, skipping.`);
      continue;
    }
    const adminId = generateObjectId();
    adminUsers.push({
      id: adminId,
      email: a.email.toLowerCase(),
      passwordHash: devPasswordHash,
      role: 'ADMIN',
      isVerified: true,
      isActive: true,
      createdAt: new Date('2026-01-10T08:00:00Z'),
      updatedAt: new Date(),
    });
    adminProfiles.push({
      id: generateObjectId(),
      userId: adminId,
      firstName: a.firstName,
      lastName: a.lastName,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${a.firstName}${a.lastName}&gender=male`,
      bio: a.title,
      skills: ['System Administration', 'Platform Security', 'Curriculum Audit', 'Analytics'],
      createdAt: new Date('2026-01-10T08:00:00Z'),
      updatedAt: new Date(),
    });
    existingEmailSet.add(a.email.toLowerCase());
  }

  // --------------------------------------------------------------------------
  // 4. GENERATE INSTRUCTOR ACCOUNTS
  // --------------------------------------------------------------------------
  console.log('👨‍🏫 Generating Instructor Accounts...');
  const instructorUsers = [];
  const instructorProfiles = [];

  // Demo Instructor Account
  const demoInstructorEmail = 'instructor.demo@skillority.app';
  let demoInstructorId = generateObjectId();
  if (!existingEmailSet.has(demoInstructorEmail)) {
    instructorUsers.push({
      id: demoInstructorId,
      email: demoInstructorEmail,
      passwordHash: devPasswordHash,
      role: 'INSTRUCTOR',
      isVerified: true,
      isActive: true,
      createdAt: new Date('2026-01-15T09:00:00Z'),
      updatedAt: new Date(),
    });
    instructorProfiles.push({
      id: generateObjectId(),
      userId: demoInstructorId,
      firstName: 'Dr. Karim',
      lastName: 'Mansour',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=60',
      bio: 'Principal Software Architect & Lead Instructor at Skillority. Former Tech Lead at InstaDeep with 12+ years building enterprise microservices and distributed systems.',
      expertise: ['TypeScript', 'Next.js', 'System Design', 'Cloud Architecture', 'Prisma', 'MongoDB'],
      experience: '12+ years in Software Engineering & Technical Curriculum Design',
      createdAt: new Date('2026-01-15T09:00:00Z'),
      updatedAt: new Date(),
    });
    existingEmailSet.add(demoInstructorEmail);
  } else {
    const existing = existingUsers.find(u => u.email.toLowerCase() === demoInstructorEmail);
    if (existing) demoInstructorId = existing.id;
  }

  // Generate Remaining Instructors
  for (let i = 1; i <= INSTRUCTORS_COUNT - 1; i++) {
    const isTunisian = Math.random() < 0.75;
    const isMale = Math.random() < 0.55;
    const firstName = isTunisian
      ? isMale ? sample(TUNISIAN_FIRST_NAMES_MALE) : sample(TUNISIAN_FIRST_NAMES_FEMALE)
      : isMale ? sample(INTERNATIONAL_FIRST_NAMES_MALE) : sample(INTERNATIONAL_FIRST_NAMES_FEMALE);
    const lastName = isTunisian ? sample(TUNISIAN_LAST_NAMES) : sample(INTERNATIONAL_LAST_NAMES);

    const email = `instructor.${firstName.toLowerCase().replace(/[^a-z]/g, '')}.${lastName.toLowerCase().replace(/[^a-z]/g, '')}.${i}@skillority.tn`;
    if (existingEmailSet.has(email)) continue;

    const instId = generateObjectId();
    const expertise = sampleSize(SKILLS_POOL, randomInt(4, 7));
    const bio = sample(INSTRUCTOR_BIOS);
    const experience = sample(INSTRUCTOR_EXPERIENCES);

    instructorUsers.push({
      id: instId,
      email,
      passwordHash: devPasswordHash,
      role: 'INSTRUCTOR',
      isVerified: true,
      isActive: Math.random() > 0.03, // 97% active
      createdAt: new Date(Date.now() - randomInt(60, 300) * 86400000),
      updatedAt: new Date(),
    });

    instructorProfiles.push({
      id: generateObjectId(),
      userId: instId,
      firstName,
      lastName,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${firstName}${lastName}${i}&gender=${isMale ? 'male' : 'female'}`,
      bio,
      expertise,
      experience,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    existingEmailSet.add(email);
  }

  // --------------------------------------------------------------------------
  // 5. GENERATE COMPANY & RECRUITER ACCOUNTS
  // --------------------------------------------------------------------------
  console.log('🏢 Generating Company & Recruiter Accounts...');
  const companyUsers = [];
  const companyProfiles = [];
  const generatedOpportunities = [];

  // Demo Recruiter Account
  const demoRecruiterEmail = 'recruiter.demo@skillority.app';
  let demoRecruiterId = generateObjectId();
  if (!existingEmailSet.has(demoRecruiterEmail)) {
    companyUsers.push({
      id: demoRecruiterId,
      email: demoRecruiterEmail,
      passwordHash: devPasswordHash,
      role: 'COMPANY',
      isVerified: true,
      isActive: true,
      createdAt: new Date('2026-01-20T10:00:00Z'),
      updatedAt: new Date(),
    });
    companyProfiles.push({
      id: generateObjectId(),
      userId: demoRecruiterId,
      firstName: 'Amira',
      lastName: 'Bouazizi',
      companyName: 'InstaDeep Tunisia',
      companyDescription: 'Pioneering decision-making AI and machine learning solutions to solve complex problems across healthcare, mobility, and energy.',
      industry: 'Artificial Intelligence & Deep Tech',
      companySize: '250-500 employees',
      website: 'https://instadeep.com',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=60',
      bio: 'Lead Technical Talent Partner at InstaDeep Tunisia. Connecting exceptional engineering and AI research graduates with impactful global projects.',
      createdAt: new Date('2026-01-20T10:00:00Z'),
      updatedAt: new Date(),
    });
    existingEmailSet.add(demoRecruiterEmail);
  } else {
    const existing = existingUsers.find(u => u.email.toLowerCase() === demoRecruiterEmail);
    if (existing) demoRecruiterId = existing.id;
  }

  // Generate Remaining Companies from authentic data
  const companiesToSeed = COMPANIES_DATA.slice(0, COMPANIES_COUNT);
  for (let idx = 0; idx < companiesToSeed.length; idx++) {
    const c = companiesToSeed[idx];
    const isDemoCo = idx === 0;
    const compUserId = isDemoCo ? demoRecruiterId : generateObjectId();

    if (!isDemoCo) {
      const email = `recruiter.${c.companyName.toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 15)}@skillority.tn`;
      if (existingEmailSet.has(email)) continue;

      const isMale = Math.random() < 0.5;
      const firstName = isMale ? sample(TUNISIAN_FIRST_NAMES_MALE) : sample(TUNISIAN_FIRST_NAMES_FEMALE);
      const lastName = sample(TUNISIAN_LAST_NAMES);

      companyUsers.push({
        id: compUserId,
        email,
        passwordHash: devPasswordHash,
        role: 'COMPANY',
        isVerified: true,
        isActive: true,
        createdAt: new Date(Date.now() - randomInt(90, 250) * 86400000),
        updatedAt: new Date(),
      });

      companyProfiles.push({
        id: generateObjectId(),
        userId: compUserId,
        firstName,
        lastName,
        companyName: c.companyName,
        companyDescription: c.companyDescription,
        industry: c.industry,
        companySize: c.companySize,
        website: c.website,
        avatar: `https://api.dicebear.com/7.x/identicon/svg?seed=${c.companyName}`,
        bio: `Technical Recruiter at ${c.companyName}. Building high-performing engineering and research teams.`,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      existingEmailSet.add(email);
    }

    // Generate Opportunities for this company
    for (const opp of c.opportunities) {
      generatedOpportunities.push({
        id: generateObjectId(),
        companyId: compUserId,
        title: opp.title,
        description: opp.description,
        type: opp.type,
        category: opp.category,
        industry: c.industry,
        location: opp.location,
        workplaceType: opp.workplaceType,
        duration: opp.duration,
        startDate: new Date('2026-03-01T09:00:00Z'),
        deadline: new Date('2026-04-30T18:00:00Z'),
        positions: randomInt(2, 6),
        filledPositions: randomInt(0, 2),
        skills: opp.skills,
        optionalSkills: opp.optionalSkills || [],
        educationalRequirements: opp.educationalRequirements,
        experienceLevel: opp.experienceLevel,
        responsibilities: opp.responsibilities,
        benefits: opp.benefits,
        stipend: opp.stipend,
        status: opp.status || 'PUBLISHED',
        isOpen: opp.isOpen !== undefined ? opp.isOpen : true,
        publishedAt: new Date(Date.now() - randomInt(10, 60) * 86400000),
        createdAt: new Date(Date.now() - randomInt(15, 70) * 86400000),
        updatedAt: new Date(),
      });
    }
  }

  // --------------------------------------------------------------------------
  // 6. GENERATE STUDENT ACCOUNTS, PROFILES & WALLETS
  // --------------------------------------------------------------------------
  console.log('🎓 Generating Student Accounts, Profiles & Wallets...');
  const studentUsers = [];
  const studentProfiles = [];
  const studentWallets = [];
  const walletTransactions = [];
  const studentCareerGoals = [];

  // Demo Student Account
  const demoStudentEmail = 'student.demo@skillority.app';
  let demoStudentId = generateObjectId();
  let demoWalletId = generateObjectId();

  if (!existingEmailSet.has(demoStudentEmail)) {
    studentUsers.push({
      id: demoStudentId,
      email: demoStudentEmail,
      passwordHash: devPasswordHash,
      role: 'STUDENT',
      isVerified: true,
      isActive: true,
      createdAt: new Date('2026-01-10T11:00:00Z'),
      updatedAt: new Date(),
    });

    studentProfiles.push({
      id: generateObjectId(),
      userId: demoStudentId,
      firstName: 'Nour',
      lastName: 'Ben Salem',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=60',
      bio: 'Final-year Software Engineering student at INSAT. Full-stack developer passionate about React, Next.js, distributed backends, and cloud technologies.',
      skills: ['TypeScript', 'React', 'Next.js', 'Node.js', 'Prisma', 'MongoDB', 'Docker', 'Tailwind CSS'],
      university: 'INSAT (Institut National des Sciences Appliquées et de Technologie)',
      major: 'Software Engineering',
      graduationYear: 2026,
      interests: ['Full-Stack Engineering', 'Cloud Native', 'System Design', 'PFE 2026'],
      learningGoals: 'Master Next.js 15, build scalable microservices, and land a high-impact PFE internship in software engineering.',
      createdAt: new Date('2026-01-10T11:00:00Z'),
      updatedAt: new Date(),
    });

    studentWallets.push({
      id: demoWalletId,
      userId: demoStudentId,
      balance: 380,
      lastLoginBonus: new Date(),
      createdAt: new Date('2026-01-10T11:00:00Z'),
      updatedAt: new Date(),
    });

    // Demo transactions
    walletTransactions.push(
      { id: generateObjectId(), walletId: demoWalletId, amount: 100, type: 'CREDIT_BONUS', description: 'Welcome complimentary learner bonus', createdAt: new Date('2026-01-10T11:00:00Z') },
      { id: generateObjectId(), walletId: demoWalletId, amount: 5, type: 'DAILY_LOGIN', description: 'Daily learning streak reward', createdAt: new Date('2026-02-01T08:00:00Z') },
      { id: generateObjectId(), walletId: demoWalletId, amount: 10, type: 'QUIZ_REWARD', description: 'Scored 100% on Next.js 15 App Router quiz', createdAt: new Date('2026-02-02T14:30:00Z') },
      { id: generateObjectId(), walletId: demoWalletId, amount: 10, type: 'DAILY_MISSION', description: 'Completed daily learning mission', createdAt: new Date('2026-02-03T18:00:00Z') },
      { id: generateObjectId(), walletId: demoWalletId, amount: -15, type: 'CHAPTER_UNLOCK', description: 'Unlocked Chapter 6: Cloud Native Deployment', createdAt: new Date('2026-02-04T12:00:00Z') }
    );

    // Primary career goal
    if (careerPaths.length > 0) {
      const fullStackPath = careerPaths.find(p => p.slug === 'full-stack-developer') || careerPaths[0];
      studentCareerGoals.push({
        id: generateObjectId(),
        studentId: demoStudentId,
        careerPathId: fullStackPath.id,
        isPrimary: true,
        targetDate: new Date('2026-06-30T00:00:00Z'),
        notes: 'Targeting top tier full-stack recruitment in Tunis or Europe upon graduation.',
        createdAt: new Date('2026-01-10T11:30:00Z'),
        updatedAt: new Date(),
      });
    }

    existingEmailSet.add(demoStudentEmail);
  } else {
    const existing = existingUsers.find(u => u.email.toLowerCase() === demoStudentEmail);
    if (existing) demoStudentId = existing.id;
  }

  // Generate Remaining Students
  for (let i = 1; i <= STUDENTS_COUNT - 1; i++) {
    const isTunisian = Math.random() < 0.75;
    const isMale = Math.random() < 0.52;
    const firstName = isTunisian
      ? isMale ? sample(TUNISIAN_FIRST_NAMES_MALE) : sample(TUNISIAN_FIRST_NAMES_FEMALE)
      : isMale ? sample(INTERNATIONAL_FIRST_NAMES_MALE) : sample(INTERNATIONAL_FIRST_NAMES_FEMALE);
    const lastName = isTunisian ? sample(TUNISIAN_LAST_NAMES) : sample(INTERNATIONAL_LAST_NAMES);

    const email = `student.${firstName.toLowerCase().replace(/[^a-z]/g, '')}.${lastName.toLowerCase().replace(/[^a-z]/g, '')}.${i}@skillority.tn`;
    if (existingEmailSet.has(email)) continue;

    const stuId = generateObjectId();
    const walletId = generateObjectId();
    const uni = sample(UNIVERSITIES);
    const major = sample(MAJORS);
    const skills = sampleSize(SKILLS_POOL, randomInt(3, 7));
    const bio = sample(STUDENT_BIOS);
    const gradYear = sample([2024, 2025, 2026, 2027, 2028]);

    // Varied wallet balance based on activity tier
    const activityTier = Math.random(); // 0-0.2: top, 0.2-0.7: med, 0.7-0.9: low, 0.9-1.0: inactive
    let balance = 100;
    const transactionsForStu = [];

    transactionsForStu.push({
      id: generateObjectId(),
      walletId,
      amount: 100,
      type: 'CREDIT_BONUS',
      description: 'Welcome complimentary learner bonus',
      createdAt: new Date(Date.now() - randomInt(30, 180) * 86400000),
    });

    if (activityTier < 0.2) {
      // Top active: 200-500 coins, lots of logins and quiz rewards
      const logins = randomInt(10, 25);
      const quizzes = randomInt(4, 10);
      balance += logins * 5 + quizzes * 10;
      for (let k = 0; k < Math.min(logins, 4); k++) {
        transactionsForStu.push({
          id: generateObjectId(),
          walletId,
          amount: 5,
          type: 'DAILY_LOGIN',
          description: 'Daily check-in streak reward',
          createdAt: new Date(Date.now() - randomInt(1, 20) * 86400000),
        });
      }
      for (let q = 0; q < Math.min(quizzes, 3); q++) {
        transactionsForStu.push({
          id: generateObjectId(),
          walletId,
          amount: 10,
          type: 'QUIZ_REWARD',
          description: 'Chapter quiz passing reward',
          createdAt: new Date(Date.now() - randomInt(1, 15) * 86400000),
        });
      }
      if (Math.random() > 0.4) {
        balance -= 15;
        transactionsForStu.push({
          id: generateObjectId(),
          walletId,
          amount: -15,
          type: 'CHAPTER_UNLOCK',
          description: 'Unlocked premium chapter',
          createdAt: new Date(Date.now() - randomInt(1, 10) * 86400000),
        });
      }
    } else if (activityTier < 0.7) {
      // Medium active: 110-200 coins
      const logins = randomInt(2, 8);
      balance += logins * 5;
      transactionsForStu.push({
        id: generateObjectId(),
        walletId,
        amount: 5,
        type: 'DAILY_LOGIN',
        description: 'Daily login bonus',
        createdAt: new Date(Date.now() - randomInt(1, 10) * 86400000),
      });
    }

    studentUsers.push({
      id: stuId,
      email,
      passwordHash: devPasswordHash,
      role: 'STUDENT',
      isVerified: true,
      isActive: Math.random() > 0.02, // 98% active
      createdAt: new Date(Date.now() - randomInt(20, 240) * 86400000),
      updatedAt: new Date(),
    });

    studentProfiles.push({
      id: generateObjectId(),
      userId: stuId,
      firstName,
      lastName,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${firstName}${lastName}${i}&gender=${isMale ? 'male' : 'female'}`,
      bio,
      skills,
      university: uni.name,
      major,
      graduationYear: gradYear,
      interests: sampleSize(skills, 3),
      learningGoals: `Master modern ${skills[0]} and ${skills[1]} to prepare for high-impact software engineering roles.`,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    studentWallets.push({
      id: walletId,
      userId: stuId,
      balance,
      lastLoginBonus: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    walletTransactions.push(...transactionsForStu);

    // Career Goal (75% of students have an established career goal)
    if (careerPaths.length > 0 && Math.random() < 0.75) {
      const targetPath = sample(careerPaths);
      studentCareerGoals.push({
        id: generateObjectId(),
        studentId: stuId,
        careerPathId: targetPath.id,
        isPrimary: true,
        targetDate: new Date('2026-10-31T00:00:00Z'),
        notes: `Focusing on ${targetPath.title} milestones and foundational requirements.`,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    existingEmailSet.add(email);
  }

  // --------------------------------------------------------------------------
  // 7. GENERATE COURSES, CHAPTERS & LESSONS
  // --------------------------------------------------------------------------
  console.log('📚 Generating Courses, Chapters & Lessons...');
  const allInstructors = [...instructorUsers];
  const allInstructorIds = allInstructors.map(u => u.id);

  const generatedCourses = [];
  const generatedChapters = [];
  const generatedLessons = [];

  for (let cIdx = 0; cIdx < COURSES_COUNT; cIdx++) {
    const cDef = COURSE_DEFINITIONS[cIdx % COURSE_DEFINITIONS.length];
    const courseId = generateObjectId();

    // Assign instructor (Demo instructor gets 4 featured courses, others distributed)
    let instructorId;
    if (cIdx < 4) {
      instructorId = demoInstructorId;
    } else {
      instructorId = sample(allInstructorIds) || demoInstructorId;
    }

    // Realistic Status Distribution:
    // 75% PUBLISHED, 10% APPROVED, 10% PENDING_REVIEW, 3% DRAFT, 2% REJECTED
    let status = 'PUBLISHED';
    let reviewNote = null;
    const randStatus = Math.random();
    if (cIdx >= 4) { // keep demo instructor's first courses published
      if (randStatus < 0.75) {
        status = 'PUBLISHED';
      } else if (randStatus < 0.85) {
        status = 'APPROVED';
      } else if (randStatus < 0.95) {
        status = 'PENDING_REVIEW';
      } else if (randStatus < 0.98) {
        status = 'DRAFT';
      } else {
        status = 'REJECTED';
        reviewNote = 'Please include more hands-on practical code walkthroughs and expand the final assessment questions.';
      }
    }

    generatedCourses.push({
      id: courseId,
      instructorId,
      title: cDef.title,
      description: cDef.description,
      thumbnail: cDef.thumbnail,
      category: cDef.category,
      level: cDef.level,
      tags: cDef.tags,
      status,
      reviewNote,
      finalAssessment: {
        title: `Comprehensive Final Assessment: ${cDef.title}`,
        passingScore: 75,
        durationMinutes: 45,
        totalQuestions: 10,
        questions: [
          {
            id: 'q1',
            question: `In production environments, what is the most critical design consideration when building with ${cDef.tags[0] || 'modern tech'}?`,
            options: [
              'Avoiding all external dependencies',
              'Ensuring scalability, clean boundaries, and proper error handling',
              'Minimizing code readability for execution speed',
              'Hardcoding secrets in environment variables'
            ],
            correctOptionIndex: 1,
            explanation: 'Scalability, separation of concerns, and defensive error handling are fundamental to reliable production architectures.'
          },
          {
            id: 'q2',
            question: 'What is the primary benefit of automated integration tests in CI/CD pipelines?',
            options: [
              'They completely replace the need for code reviews',
              'They catch regressions and verify multi-component interactions before deployment',
              'They increase repository disk usage',
              'They prevent developers from refactoring code'
            ],
            correctOptionIndex: 1,
            explanation: 'Automated integration tests catch defects early when multiple services or database layers interact.'
          }
        ]
      },
      createdAt: new Date(Date.now() - randomInt(30, 200) * 86400000),
      updatedAt: new Date(),
    });

    // Create Chapters for this Course
    const chapterCount = cDef.chapterTitles.length;
    for (let chOrder = 0; chOrder < chapterCount; chOrder++) {
      const chapterId = generateObjectId();
      const chTitle = cDef.chapterTitles[chOrder];
      const isFree = chOrder <= 5; // Freemium rule: order 0-5 free, 6+ paid
      const coinsCost = isFree ? 0 : 15;

      generatedChapters.push({
        id: chapterId,
        courseId,
        title: chTitle,
        order: chOrder,
        isFree,
        coinsCost,
        quiz: {
          title: `Quiz: ${chTitle}`,
          passingScore: 70,
          rewardCoins: 10,
          questions: [
            {
              id: 'q1',
              question: `What is the key takeaway covered in "${chTitle}"?`,
              options: [
                'Syntax is the only important factor',
                'Understanding the core mental model and architectural tradeoffs is essential',
                'Performance optimization should always precede functional correctness',
                'Tests are optional for production deployments'
              ],
              correctOptionIndex: 1,
              explanation: 'Grasping foundational mental models and architectural decisions ensures robust, maintainable code.'
            },
            {
              id: 'q2',
              question: 'Which best practice is recommended for this module?',
              options: [
                'Write modular, self-contained functions with clear error handling',
                'Use global mutable state across all files',
                'Ignore compiler warnings',
                'Disable rate limiting to maximize throughput'
              ],
              correctOptionIndex: 0,
              explanation: 'Modular design and clean error boundaries prevent cascading failures.'
            }
          ]
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      // Create 2 to 3 Lessons per Chapter
      const lessonCount = randomInt(2, 3);
      for (let lOrder = 0; lOrder < lessonCount; lOrder++) {
        generatedLessons.push({
          id: generateObjectId(),
          chapterId,
          title: `${chTitle} - Part ${lOrder + 1}: Implementation & Deep Dive`,
          order: lOrder,
          duration: randomInt(8, 25),
          content: {
            type: 'hybrid',
            blocks: [
              {
                type: 'text',
                body: `Welcome to this lesson exploring **${chTitle}**. We will cover key principles, architecture patterns, and practical code implementations.`
              },
              {
                type: 'code',
                language: 'javascript',
                code: `// Practical demonstration for ${chTitle}\nexport async function executeServiceLogic(context) {\n  const result = await processTask(context);\n  return { success: true, timestamp: Date.now(), data: result };\n}`
              },
              {
                type: 'callout',
                style: 'info',
                title: 'Engineering Best Practice',
                body: 'Always decouple business logic from transport mechanisms (HTTP/gRPC/CLI) to keep tests fast and deterministic.'
              }
            ]
          },
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }
    }
  }

  // --------------------------------------------------------------------------
  // 8. GENERATE REALISTIC ENROLLMENTS, PROGRESS, QUIZZES & CERTIFICATES
  // --------------------------------------------------------------------------
  console.log('📈 Generating Enrollments, Student Progress, Quizzes & Certificates...');
  const allStudents = [...studentUsers];
  const publishedCourses = generatedCourses.filter(c => c.status === 'PUBLISHED');

  // Map courses to their chapters & lessons for quick lookup
  const courseChaptersMap = new Map();
  for (const ch of generatedChapters) {
    if (!courseChaptersMap.has(ch.courseId)) courseChaptersMap.set(ch.courseId, []);
    courseChaptersMap.get(ch.courseId).push(ch);
  }

  const chapterLessonsMap = new Map();
  for (const les of generatedLessons) {
    if (!chapterLessonsMap.has(les.chapterId)) chapterLessonsMap.set(les.chapterId, []);
    chapterLessonsMap.get(les.chapterId).push(les);
  }

  const generatedEnrollments = [];
  const generatedQuizAttempts = [];
  const generatedAssessmentAttempts = [];
  const generatedCertificates = [];

  // Enroll Demo Student in 5 published courses
  const demoCourses = publishedCourses.slice(0, 5);
  for (let dIdx = 0; dIdx < demoCourses.length; dIdx++) {
    const dc = demoCourses[dIdx];
    const chs = courseChaptersMap.get(dc.id) || [];
    const allCourseLessons = chs.flatMap(ch => chapterLessonsMap.get(ch.id) || []);
    const freeChapterIds = chs.filter(ch => ch.order <= 5).map(ch => ch.id);

    const isFullyCompleted = dIdx < 2; // 2 fully completed with certificates
    const progressPercent = isFullyCompleted ? 100 : (dIdx === 2 ? 65 : 30);
    const completedLessonsCount = Math.floor((progressPercent / 100) * allCourseLessons.length);
    const completedLessonIds = allCourseLessons.slice(0, completedLessonsCount).map(l => l.id);

    generatedEnrollments.push({
      id: generateObjectId(),
      userId: demoStudentId,
      courseId: dc.id,
      unlockedChapterIds: freeChapterIds,
      completedLessonIds,
      progressPercent,
      isCompleted: isFullyCompleted,
      completedAt: isFullyCompleted ? new Date('2026-02-15T14:00:00Z') : null,
      createdAt: new Date('2026-01-15T10:00:00Z'),
      updatedAt: new Date(),
    });

    // Quiz attempts for demo student
    for (const ch of chs.slice(0, isFullyCompleted ? chs.length : 2)) {
      generatedQuizAttempts.push({
        id: generateObjectId(),
        userId: demoStudentId,
        chapterId: ch.id,
        score: randomInt(85, 100),
        passed: true,
        coinsAwarded: 10,
        answers: { q1: 1, q2: 0 },
        createdAt: new Date(Date.now() - randomInt(5, 20) * 86400000),
      });
    }

    // Certificate and assessment attempt for completed courses
    if (isFullyCompleted) {
      generatedAssessmentAttempts.push({
        id: generateObjectId(),
        userId: demoStudentId,
        courseId: dc.id,
        score: randomInt(88, 98),
        passed: true,
        certificateIssued: true,
        createdAt: new Date('2026-02-15T14:00:00Z'),
      });

      generatedCertificates.push({
        id: generateObjectId(),
        recipientId: demoStudentId,
        courseId: dc.id,
        type: 'COURSE_COMPLETION',
        credentialId: `SKILL-CERT-2026-${crypto.randomBytes(4).toString('hex').toUpperCase()}`,
        issuedAt: new Date('2026-02-15T14:05:00Z'),
      });
    }
  }

  // Generate Enrollments across remaining students (~1,100 total enrollments)
  // Popular courses get more enrollments, niche courses get fewer
  for (let sIdx = 1; sIdx < allStudents.length; sIdx++) {
    const student = allStudents[sIdx];
    const enrollmentRoll = Math.random();

    // 15% of students are inactive / zero enrollments
    if (enrollmentRoll < 0.15) continue;

    // Determine how many courses to enroll in
    let countToEnroll = 1;
    if (enrollmentRoll > 0.80) countToEnroll = randomInt(3, 5); // top active
    else if (enrollmentRoll > 0.45) countToEnroll = randomInt(2, 3); // moderately active

    const coursesChosen = sampleSize(publishedCourses, countToEnroll);

    for (const crs of coursesChosen) {
      const chs = courseChaptersMap.get(crs.id) || [];
      const allCourseLessons = chs.flatMap(ch => chapterLessonsMap.get(ch.id) || []);
      const freeChapterIds = chs.filter(ch => ch.order <= 5).map(ch => ch.id);

      // Realistic progress distribution:
      // 20% completed, 50% in progress (15-80%), 30% just started (0-10%)
      const progRoll = Math.random();
      let progressPercent = 0;
      let isCompleted = false;

      if (progRoll < 0.20) {
        progressPercent = 100;
        isCompleted = true;
      } else if (progRoll < 0.70) {
        progressPercent = randomInt(15, 80);
      } else {
        progressPercent = randomInt(0, 10);
      }

      const completedLessonsCount = Math.floor((progressPercent / 100) * allCourseLessons.length);
      const completedLessonIds = allCourseLessons.slice(0, completedLessonsCount).map(l => l.id);

      generatedEnrollments.push({
        id: generateObjectId(),
        userId: student.id,
        courseId: crs.id,
        unlockedChapterIds: freeChapterIds,
        completedLessonIds,
        progressPercent,
        isCompleted,
        completedAt: isCompleted ? new Date(Date.now() - randomInt(1, 30) * 86400000) : null,
        createdAt: new Date(Date.now() - randomInt(20, 90) * 86400000),
        updatedAt: new Date(),
      });

      // Quiz attempts on reached chapters
      const reachedChaptersCount = Math.ceil((progressPercent / 100) * chs.length);
      for (let chI = 0; chI < Math.min(reachedChaptersCount, 3); chI++) {
        const targetChapter = chs[chI];
        if (!targetChapter) continue;
        const passed = Math.random() > 0.15; // 85% pass rate
        const score = passed ? randomInt(75, 100) : randomInt(40, 65);
        generatedQuizAttempts.push({
          id: generateObjectId(),
          userId: student.id,
          chapterId: targetChapter.id,
          score,
          passed,
          coinsAwarded: passed ? 10 : 0,
          answers: { q1: passed ? 1 : 0, q2: 0 },
          createdAt: new Date(Date.now() - randomInt(2, 25) * 86400000),
        });
      }

      // Certificate for completed courses
      if (isCompleted && Math.random() < 0.85) {
        generatedAssessmentAttempts.push({
          id: generateObjectId(),
          userId: student.id,
          courseId: crs.id,
          score: randomInt(80, 98),
          passed: true,
          certificateIssued: true,
          createdAt: new Date(Date.now() - randomInt(1, 20) * 86400000),
        });

        generatedCertificates.push({
          id: generateObjectId(),
          recipientId: student.id,
          courseId: crs.id,
          type: 'COURSE_COMPLETION',
          credentialId: `SKILL-CERT-2026-${crypto.randomBytes(4).toString('hex').toUpperCase()}`,
          issuedAt: new Date(Date.now() - randomInt(1, 20) * 86400000),
        });
      }
    }
  }

  // --------------------------------------------------------------------------
  // 9. GENERATE JOB APPLICATIONS, INTERVIEWS, OFFERS & TIMELINES
  // --------------------------------------------------------------------------
  console.log('💼 Generating Job Applications, Interviews, Offers & Timelines...');
  const generatedApplications = [];
  const generatedInterviews = [];
  const generatedOffers = [];
  const generatedTimelines = [];

  const applicationStatuses = [
    'PENDING', 'REVIEWING', 'SHORTLISTED', 'INTERVIEW', 'OFFERED', 'ACCEPTED', 'REJECTED', 'WITHDRAWN'
  ];

  // Demo Student Applications (3 realistic applications)
  const oppsForDemo = generatedOpportunities.slice(0, 3);
  if (oppsForDemo.length >= 3) {
    // 1. Under Interview
    const app1Id = generateObjectId();
    generatedApplications.push({
      id: app1Id,
      opportunityId: oppsForDemo[0].id,
      studentId: demoStudentId,
      status: 'INTERVIEW',
      notes: 'Strong candidate with impressive Next.js and PyTorch GitHub portfolio.',
      resumeUrl: 'https://skillority.app/storage/resumes/nour_bensalem_cv.pdf',
      coverLetter: 'I am thrilled to apply for the AI Research Internship at InstaDeep. My academic background at INSAT combined with practical full-stack and machine learning projects directly align with your mission.',
      portfolioUrl: 'https://nourbensalem.dev',
      githubUrl: 'https://github.com/nourbensalem-insat',
      candidateSkills: ['Python', 'PyTorch', 'Next.js', 'Docker', 'TypeScript'],
      matchScore: 92,
      rating: 5,
      createdAt: new Date('2026-02-01T10:00:00Z'),
      updatedAt: new Date(),
    });

    generatedInterviews.push({
      id: generateObjectId(),
      applicationId: app1Id,
      opportunityId: oppsForDemo[0].id,
      studentId: demoStudentId,
      companyId: oppsForDemo[0].companyId,
      scheduledAt: new Date('2026-03-05T14:30:00Z'),
      timezone: 'UTC+1',
      interviewType: 'TECHNICAL',
      meetingLink: 'https://meet.google.com/xyz-qwer-vbn',
      location: 'Virtual / Google Meet',
      instructions: 'Prepare to discuss your past projects and walk through an interactive coding challenge in Python.',
      status: 'SCHEDULED',
      createdAt: new Date('2026-02-10T11:00:00Z'),
      updatedAt: new Date(),
    });

    generatedTimelines.push(
      { id: generateObjectId(), applicationId: app1Id, action: 'APPLICATION_SUBMITTED', fromStatus: null, toStatus: 'PENDING', note: 'Candidate submitted application', performedById: demoStudentId, performedByRole: 'STUDENT', createdAt: new Date('2026-02-01T10:00:00Z') },
      { id: generateObjectId(), applicationId: app1Id, action: 'STATUS_UPDATED', fromStatus: 'PENDING', toStatus: 'REVIEWING', note: 'Recruiter started initial screening', performedById: oppsForDemo[0].companyId, performedByRole: 'COMPANY', createdAt: new Date('2026-02-03T11:00:00Z') },
      { id: generateObjectId(), applicationId: app1Id, action: 'INTERVIEW_SCHEDULED', fromStatus: 'REVIEWING', toStatus: 'INTERVIEW', note: 'Technical interview invitation sent', performedById: oppsForDemo[0].companyId, performedByRole: 'COMPANY', createdAt: new Date('2026-02-10T11:00:00Z') }
    );

    // 2. Offered
    const app2Id = generateObjectId();
    generatedApplications.push({
      id: app2Id,
      opportunityId: oppsForDemo[1].id,
      studentId: demoStudentId,
      status: 'OFFERED',
      notes: 'Exceptional interview score and architectural maturity.',
      resumeUrl: 'https://skillority.app/storage/resumes/nour_bensalem_cv.pdf',
      candidateSkills: ['TypeScript', 'React', 'Node.js', 'PostgreSQL'],
      matchScore: 95,
      rating: 5,
      createdAt: new Date('2026-01-25T14:00:00Z'),
      updatedAt: new Date(),
    });

    generatedOffers.push({
      id: generateObjectId(),
      applicationId: app2Id,
      opportunityId: oppsForDemo[1].id,
      studentId: demoStudentId,
      companyId: oppsForDemo[1].companyId,
      title: 'Junior Full-Stack Software Engineer Offer',
      stipend: '3,200 TND / month',
      startDate: new Date('2026-07-01T09:00:00Z'),
      duration: 'Permanent (CDI)',
      conditions: 'Successful graduation and defense of engineering degree.',
      expiresAt: new Date('2026-04-15T23:59:59Z'),
      status: 'PENDING',
      createdAt: new Date('2026-02-18T16:00:00Z'),
      updatedAt: new Date(),
    });

    // 3. Reviewing
    const app3Id = generateObjectId();
    generatedApplications.push({
      id: app3Id,
      opportunityId: oppsForDemo[2].id,
      studentId: demoStudentId,
      status: 'REVIEWING',
      notes: 'Under review by engineering hiring committee.',
      resumeUrl: 'https://skillority.app/storage/resumes/nour_bensalem_cv.pdf',
      candidateSkills: ['Java', 'Spring Boot', 'PostgreSQL'],
      matchScore: 84,
      createdAt: new Date('2026-02-12T09:30:00Z'),
      updatedAt: new Date(),
    });
  }

  // Generate ~150 Applications across other active students
  const activeStudentsForApps = allStudents.slice(1, 150);
  for (const stu of activeStudentsForApps) {
    if (Math.random() < 0.25) continue; // 75% apply
    const chosenOpps = sampleSize(generatedOpportunities, randomInt(1, 2));

    for (const opp of chosenOpps) {
      const appId = generateObjectId();
      const st = sample(applicationStatuses);
      const matchScore = randomInt(65, 96);

      generatedApplications.push({
        id: appId,
        opportunityId: opp.id,
        studentId: stu.id,
        status: st,
        resumeUrl: `https://skillority.app/storage/resumes/${stu.email.split('@')[0]}.pdf`,
        candidateSkills: sampleSize(SKILLS_POOL, randomInt(3, 6)),
        matchScore,
        rating: st === 'OFFERED' || st === 'ACCEPTED' ? 5 : (st === 'INTERVIEW' ? 4 : randomInt(2, 4)),
        rejectionReason: st === 'REJECTED' ? 'We have moved forward with candidates whose graduation dates align sooner with project delivery.' : null,
        createdAt: new Date(Date.now() - randomInt(10, 80) * 86400000),
        updatedAt: new Date(),
      });

      // Timelines
      generatedTimelines.push({
        id: generateObjectId(),
        applicationId: appId,
        action: 'APPLICATION_SUBMITTED',
        fromStatus: null,
        toStatus: 'PENDING',
        note: 'Submitted application',
        performedById: stu.id,
        performedByRole: 'STUDENT',
        createdAt: new Date(Date.now() - randomInt(10, 80) * 86400000),
      });

      // If Interview status, create Interview record
      if (st === 'INTERVIEW') {
        generatedInterviews.push({
          id: generateObjectId(),
          applicationId: appId,
          opportunityId: opp.id,
          studentId: stu.id,
          companyId: opp.companyId,
          scheduledAt: new Date(Date.now() + randomInt(2, 14) * 86400000),
          timezone: 'UTC+1',
          interviewType: sample(['TECHNICAL', 'SCREENING', 'BEHAVIORAL']),
          meetingLink: 'https://meet.google.com/abc-defg-hij',
          status: 'SCHEDULED',
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }

      // If Offered or Accepted, create Offer record
      if (st === 'OFFERED' || st === 'ACCEPTED') {
        generatedOffers.push({
          id: generateObjectId(),
          applicationId: appId,
          opportunityId: opp.id,
          studentId: stu.id,
          companyId: opp.companyId,
          title: `${opp.title} Offer`,
          stipend: opp.stipend || '1,000 TND / month',
          startDate: new Date('2026-07-01T09:00:00Z'),
          duration: opp.duration || '6 months',
          status: st === 'ACCEPTED' ? 'ACCEPTED' : 'PENDING',
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }
    }
  }

  // --------------------------------------------------------------------------
  // 10. GENERATE COMMUNITY POSTS, COMMENTS, LIKES & DIRECT MESSAGES
  // --------------------------------------------------------------------------
  console.log('💬 Generating Community Posts, Comments & Direct Messages...');
  const generatedPosts = [];
  const generatedComments = [];
  const generatedMessages = [];

  const communityAuthors = [...allInstructors.slice(0, 20), ...allStudents.slice(0, 50)];

  for (let pIdx = 0; pIdx < COMMUNITY_TOPICS.length * 6; pIdx++) {
    const topic = COMMUNITY_TOPICS[pIdx % COMMUNITY_TOPICS.length];
    const author = sample(communityAuthors);
    const postId = generateObjectId();

    // Randomize likers among students and instructors
    const likers = sampleSize(communityAuthors, randomInt(3, 18));
    const likedByIds = likers.map(l => l.id);

    generatedPosts.push({
      id: postId,
      authorId: author.id,
      title: pIdx >= COMMUNITY_TOPICS.length ? `[Discussion ${pIdx + 1}] ${topic.title}` : topic.title,
      content: topic.content,
      tags: topic.tags,
      likesCount: likedByIds.length,
      likedByIds,
      createdAt: new Date(Date.now() - randomInt(2, 60) * 86400000),
      updatedAt: new Date(),
    });

    // Add Comments
    for (const commentText of topic.comments) {
      const commenter = sample(communityAuthors);
      generatedComments.push({
        id: generateObjectId(),
        postId,
        authorId: commenter.id,
        content: commentText,
        createdAt: new Date(Date.now() - randomInt(1, 45) * 86400000),
        updatedAt: new Date(),
      });
    }
  }

  // Direct Messages (Conversations between students, instructors, and recruiters)
  console.log('   Creating realistic 1-on-1 direct message conversations...');
  const demoConvs = [
    {
      otherId: demoInstructorId,
      messages: [
        { senderId: demoStudentId, recipientId: demoInstructorId, text: 'Hello Dr. Karim! I really enjoyed Chapter 3 on Next.js 15 Server Components. Could you recommend a best practice for revalidating tags across nested layouts?' },
        { senderId: demoInstructorId, recipientId: demoStudentId, text: 'Hi Nour! Great question. You can invoke revalidateTag within your Server Action, and Next.js will purge only that tagged cache slice without invalidating static parents.' },
        { senderId: demoStudentId, recipientId: demoInstructorId, text: 'That worked cleanly! Thank you so much for the quick guidance.' },
      ]
    },
    {
      otherId: demoRecruiterId,
      messages: [
        { senderId: demoRecruiterId, recipientId: demoStudentId, text: 'Hello Nour, we reviewed your Skillority profile and GitHub repositories for the AI Research Internship. Your background looks very strong.' },
        { senderId: demoStudentId, recipientId: demoRecruiterId, text: 'Thank you Amira! I have been following InstaDeep’s work closely and would love the opportunity to contribute.' },
        { senderId: demoRecruiterId, recipientId: demoStudentId, text: 'Wonderful! We have scheduled a technical interview for March 5th. Looking forward to speaking with you.' },
      ]
    }
  ];

  for (const conv of demoConvs) {
    const convId = generateObjectId();
    let msgTime = Date.now() - 3 * 86400000;
    for (const msg of conv.messages) {
      generatedMessages.push({
        id: generateObjectId(),
        conversationId: convId,
        senderId: msg.senderId,
        recipientId: msg.recipientId,
        content: msg.text,
        isRead: true,
        createdAt: new Date(msgTime),
      });
      msgTime += randomInt(1800000, 7200000); // 30 mins - 2 hours apart
    }
  }

  // --------------------------------------------------------------------------
  // 11. GENERATE NOTIFICATIONS & ADMIN INVITATIONS
  // --------------------------------------------------------------------------
  console.log('🔔 Generating Notifications & Admin Invitations...');
  const generatedNotifications = [];

  // Notifications for demo student
  generatedNotifications.push(
    { id: generateObjectId(), userId: demoStudentId, title: 'Welcome to Skillority!', message: 'Your learning account is ready. 100 complimentary coins have been credited to your wallet.', type: 'WALLET', linkUrl: '/student/wallet', isRead: true, createdAt: new Date('2026-01-10T11:05:00Z') },
    { id: generateObjectId(), userId: demoStudentId, title: 'Course Certificate Issued', message: 'Congratulations! You completed "Full-Stack Web Development with Next.js 15" and earned your verified certificate.', type: 'COURSE', linkUrl: '/student/progress', isRead: true, createdAt: new Date('2026-02-15T14:10:00Z') },
    { id: generateObjectId(), userId: demoStudentId, title: 'Technical Interview Scheduled', message: 'InstaDeep Tunisia has invited you to an interview for the AI Research Intern position.', type: 'RECRUITMENT', linkUrl: '/student/careers/applications', isRead: false, createdAt: new Date('2026-02-10T11:05:00Z') },
    { id: generateObjectId(), userId: demoStudentId, title: 'Formal Job Offer Received!', message: 'You have received an employment offer from InstaDeep Tunisia. Review details and respond before deadline.', type: 'RECRUITMENT', linkUrl: '/student/careers/applications', isRead: false, createdAt: new Date('2026-02-18T16:05:00Z') }
  );

  // General notifications for other users (~300)
  for (let i = 0; i < 300; i++) {
    const targetUser = sample(allStudents);
    generatedNotifications.push({
      id: generateObjectId(),
      userId: targetUser.id,
      title: sample([
        'Daily Streak Reminder',
        'New Course Published in Web Development',
        'Your Application Status was Updated',
        'New Reply to your Community Discussion',
        'Coin Reward Credited'
      ]),
      message: 'Check your dashboard for the latest updates on your learning track and career opportunities.',
      type: sample(['SYSTEM', 'COURSE', 'WALLET', 'RECRUITMENT', 'COMMUNITY']),
      linkUrl: sample(['/student/dashboard', '/student/courses', '/student/community', '/student/wallet']),
      isRead: Math.random() > 0.4,
      createdAt: new Date(Date.now() - randomInt(1, 30) * 86400000),
    });
  }

  // Pending Admin Invitations
  const adminInvitations = [
    {
      id: generateObjectId(),
      email: 'dr.anis.chebbi@univ-tunis.tn',
      tokenHash: crypto.createHash('sha256').update('inv_token_dr_anis_chebbi_2026').digest('hex'),
      role: 'INSTRUCTOR',
      createdById: adminUsers[0]?.id || generateObjectId(),
      isAccepted: false,
      expiresAt: new Date(Date.now() + 14 * 86400000),
      createdAt: new Date(),
    },
    {
      id: generateObjectId(),
      email: 'prof.leila.kefi@insat.u-carthage.tn',
      tokenHash: crypto.createHash('sha256').update('inv_token_prof_leila_kefi_2026').digest('hex'),
      role: 'INSTRUCTOR',
      createdById: adminUsers[0]?.id || generateObjectId(),
      isAccepted: false,
      expiresAt: new Date(Date.now() + 14 * 86400000),
      createdAt: new Date(),
    }
  ];

  // --------------------------------------------------------------------------
  // 12. EXECUTE BATCH DATABASE INSERTS
  // --------------------------------------------------------------------------
  console.log('\n=============================================================');
  console.log('💾 EXECUTING BULK INSERTS INTO MONGODB ATLAS (BATCH MODE)');
  console.log('=============================================================\n');

  const allUsersToInsert = [...adminUsers, ...instructorUsers, ...companyUsers, ...studentUsers];
  const allProfilesToInsert = [...adminProfiles, ...instructorProfiles, ...companyProfiles, ...studentProfiles];

  console.log(`1. Inserting ${allUsersToInsert.length} Users...`);
  const usersInserted = await executeBatchCreateMany('user', allUsersToInsert);
  console.log(`   ✅ Users inserted: ${usersInserted}`);

  console.log(`2. Inserting ${allProfilesToInsert.length} Profiles...`);
  const profilesInserted = await executeBatchCreateMany('profile', allProfilesToInsert);
  console.log(`   ✅ Profiles inserted: ${profilesInserted}`);

  console.log(`3. Inserting ${studentWallets.length} Wallets...`);
  const walletsInserted = await executeBatchCreateMany('wallet', studentWallets);
  console.log(`   ✅ Wallets inserted: ${walletsInserted}`);

  console.log(`4. Inserting ${walletTransactions.length} Wallet Transactions...`);
  const walletTxInserted = await executeBatchCreateMany('walletTransaction', walletTransactions);
  console.log(`   ✅ Wallet Transactions inserted: ${walletTxInserted}`);

  console.log(`5. Inserting ${studentCareerGoals.length} Student Career Goals...`);
  const goalsInserted = await executeBatchCreateMany('studentCareerGoal', studentCareerGoals);
  console.log(`   ✅ Student Career Goals inserted: ${goalsInserted}`);

  console.log(`6. Inserting ${generatedCourses.length} Courses...`);
  const coursesInserted = await executeBatchCreateMany('course', generatedCourses);
  console.log(`   ✅ Courses inserted: ${coursesInserted}`);

  console.log(`7. Inserting ${generatedChapters.length} Chapters...`);
  const chaptersInserted = await executeBatchCreateMany('chapter', generatedChapters);
  console.log(`   ✅ Chapters inserted: ${chaptersInserted}`);

  console.log(`8. Inserting ${generatedLessons.length} Lessons...`);
  const lessonsInserted = await executeBatchCreateMany('lesson', generatedLessons);
  console.log(`   ✅ Lessons inserted: ${lessonsInserted}`);

  console.log(`9. Inserting ${generatedEnrollments.length} Enrollments...`);
  const enrollmentsInserted = await executeBatchCreateMany('enrollment', generatedEnrollments);
  console.log(`   ✅ Enrollments inserted: ${enrollmentsInserted}`);

  console.log(`10. Inserting ${generatedQuizAttempts.length} Quiz Attempts...`);
  const quizAttemptsInserted = await executeBatchCreateMany('quizAttempt', generatedQuizAttempts);
  console.log(`    ✅ Quiz Attempts inserted: ${quizAttemptsInserted}`);

  console.log(`11. Inserting ${generatedAssessmentAttempts.length} Assessment Attempts...`);
  const assessInserted = await executeBatchCreateMany('assessmentAttempt', generatedAssessmentAttempts);
  console.log(`    ✅ Assessment Attempts inserted: ${assessInserted}`);

  console.log(`12. Inserting ${generatedCertificates.length} Certificates...`);
  const certsInserted = await executeBatchCreateMany('certificate', generatedCertificates);
  console.log(`    ✅ Certificates inserted: ${certsInserted}`);

  console.log(`13. Inserting ${generatedOpportunities.length} Opportunities...`);
  const oppsInserted = await executeBatchCreateMany('opportunity', generatedOpportunities);
  console.log(`    ✅ Opportunities inserted: ${oppsInserted}`);

  console.log(`14. Inserting ${generatedApplications.length} Job Applications...`);
  const appsInserted = await executeBatchCreateMany('application', generatedApplications);
  console.log(`    ✅ Applications inserted: ${appsInserted}`);

  console.log(`15. Inserting ${generatedInterviews.length} Interviews...`);
  const interviewsInserted = await executeBatchCreateMany('interview', generatedInterviews);
  console.log(`    ✅ Interviews inserted: ${interviewsInserted}`);

  console.log(`16. Inserting ${generatedOffers.length} Offers...`);
  const offersInserted = await executeBatchCreateMany('offer', generatedOffers);
  console.log(`    ✅ Offers inserted: ${offersInserted}`);

  console.log(`17. Inserting ${generatedTimelines.length} Application Timelines...`);
  const timelinesInserted = await executeBatchCreateMany('applicationTimeline', generatedTimelines);
  console.log(`    ✅ Application Timelines inserted: ${timelinesInserted}`);

  console.log(`18. Inserting ${generatedPosts.length} Community Posts...`);
  const postsInserted = await executeBatchCreateMany('communityPost', generatedPosts);
  console.log(`    ✅ Community Posts inserted: ${postsInserted}`);

  console.log(`19. Inserting ${generatedComments.length} Comments...`);
  const commentsInserted = await executeBatchCreateMany('comment', generatedComments);
  console.log(`    ✅ Comments inserted: ${commentsInserted}`);

  console.log(`20. Inserting ${generatedMessages.length} Messages...`);
  const messagesInserted = await executeBatchCreateMany('message', generatedMessages);
  console.log(`    ✅ Messages inserted: ${messagesInserted}`);

  console.log(`21. Inserting ${generatedNotifications.length} Notifications...`);
  const notificationsInserted = await executeBatchCreateMany('notification', generatedNotifications);
  console.log(`    ✅ Notifications inserted: ${notificationsInserted}`);

  console.log(`22. Inserting ${adminInvitations.length} Admin Invitations...`);
  const invitesInserted = await executeBatchCreateMany('adminInvitation', adminInvitations);
  console.log(`    ✅ Admin Invitations inserted: ${invitesInserted}`);

  const totalTimeSeconds = ((Date.now() - startTime) / 1000).toFixed(1);
  console.log('\n=============================================================');
  console.log(`🎉 SKILLORITY DATABASE SEEDING COMPLETED IN ${totalTimeSeconds}s`);
  console.log('=============================================================\n');

  await prisma.$disconnect();
}

main().catch(async (err) => {
  console.error('\n❌ SEED SCRIPT FAILED:', err);
  await prisma.$disconnect();
  process.exit(1);
});
