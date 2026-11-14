// Mock data for Skillority Admin Operations (Phase UI-4D)

export const mockAdminProfile = {
  id: 'usr-admin-01',
  name: 'Marcus Vance',
  role: 'Chief Platform Administrator & Quality Officer',
  email: 'marcus.vance@skillority.com',
  avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&auto=format&fit=crop&q=80',
  department: 'Platform Governance & Accreditation',
  permissions: 'FULL_SUPERADMIN',
  joinedDate: 'August 2025',
};

export const mockAdminStats = {
  totalUsers: 4892,
  activeLearners: 3820,
  verifiedCompanies: 142,
  verifiedInstructors: 48,
  pendingCourseReviews: 4,
  platformUptime: '99.98%',
  totalCoinsCirculating: '420,500',
  monthlyActiveGrowth: '+18.4%',
};

export const mockAdminUsers = [
  {
    id: 'usr-student-01',
    name: 'Alex Rivera',
    email: 'alex.rivera@example.com',
    role: 'STUDENT',
    status: 'ACTIVE',
    joinedDate: 'Sep 14, 2026',
    activityCount: '38.5 hrs learned',
    coinsBalance: 480,
  },
  {
    id: 'usr-rec-01',
    name: 'Rachel Chen',
    email: 'rachel.chen@cloudscale.io',
    role: 'COMPANY',
    company: 'CloudScale Technologies',
    status: 'ACTIVE',
    joinedDate: 'Jan 10, 2026',
    activityCount: '4 listings active',
    coinsBalance: 0,
  },
  {
    id: 'usr-inst-01',
    name: 'Dr. Sarah Jenkins',
    email: 'sarah.jenkins@skillority.edu',
    role: 'INSTRUCTOR',
    status: 'ACTIVE',
    joinedDate: 'Oct 02, 2025',
    activityCount: '2 courses published',
    coinsBalance: 184500,
  },
  {
    id: 'usr-student-susp',
    name: 'Suspended Account Example',
    email: 'flagged.user@example.com',
    role: 'STUDENT',
    status: 'SUSPENDED',
    joinedDate: 'Nov 01, 2026',
    activityCount: 'Flagged for honor code violation',
    coinsBalance: 0,
  },
];

export const mockCourseReviews = [
  {
    id: 'rev-1',
    courseId: 'course-2',
    title: 'TypeScript Enterprise Architecture & Design Patterns',
    instructor: 'Marcus Vance',
    category: 'Software Engineering',
    level: 'Advanced',
    totalChapters: 6,
    totalLessons: 18,
    submittedDate: 'Nov 12, 2026',
    status: 'PENDING',
    reviewNotes: 'Curriculum structure, chapter quizzes, and code exercises require syllabus verification.',
    chapters: [
      { number: 0, title: 'Orientation & Compiler Configuration', free: true },
      { number: 1, title: 'Advanced Generics & Type Gymnastics', free: true },
      { number: 2, title: 'Domain Driven Design & Hexagonal Architecture', free: true },
      { number: 3, title: 'Enterprise Decorators & Metadata Reflection', free: true },
      { number: 4, title: 'Concurrent State Machine Modeling', free: true },
      { number: 5, title: 'Compiler Plugin Transforms & AST Auditing', free: true },
    ],
  },
  {
    id: 'rev-2',
    courseId: 'course-3',
    title: 'Practical AI Agents & LLM Applications with Python',
    instructor: 'Dr. Tariq Mansoor',
    category: 'AI & Machine Learning',
    level: 'Advanced',
    totalChapters: 8,
    totalLessons: 24,
    submittedDate: 'Nov 10, 2026',
    status: 'PENDING',
    reviewNotes: 'Review tool calling test harness and vector database RAG configuration exercises.',
    chapters: [
      { number: 0, title: 'Environment & API Token Setup', free: true },
      { number: 1, title: 'Structured Output Validation with Pydantic', free: true },
      { number: 6, title: 'Autonomous Multi-Agent Tool Hand-offs', free: false },
      { number: 7, title: 'Deterministic Evaluation Guardrails', free: false },
    ],
  },
];

export const mockActivityLogs = [
  {
    id: 'act-1',
    user: 'Alex Rivera (Student)',
    action: 'Unlocked Chapter 6: Production Performance',
    details: 'Spent 250 Coins. Balance updated to 480 Coins.',
    timestamp: '10 minutes ago',
    type: 'COIN_TX',
  },
  {
    id: 'act-2',
    user: 'Dr. Sarah Jenkins (Instructor)',
    action: 'Submitted course for accreditation review',
    details: 'Course: TypeScript Enterprise Architecture',
    timestamp: '2 hours ago',
    type: 'COURSE_SUBMISSION',
  },
  {
    id: 'act-3',
    user: 'CloudScale Technologies (Company)',
    action: 'Published new opportunity listing',
    details: 'Junior Frontend Developer Intern',
    timestamp: '4 hours ago',
    type: 'OPPORTUNITY_POST',
  },
  {
    id: 'act-4',
    user: 'System Guard',
    action: 'Daily database backup & Prisma health check',
    details: 'Latency: 28ms, Replica sync verified',
    timestamp: '8 hours ago',
    type: 'SYSTEM_HEALTH',
  },
];

export const mockAdminNotifications = [
  {
    id: 'adm-notif-1',
    type: 'review',
    title: 'New Course Submitted for Review',
    message: 'Dr. Tariq Mansoor submitted "Practical AI Agents & LLM Applications with Python".',
    time: '2 hours ago',
    read: false,
  },
  {
    id: 'adm-notif-2',
    type: 'flag',
    title: 'Security Anomaly Flagged',
    message: 'Multiple quiz attempts within 15 seconds detected from IP 192.168.1.42.',
    time: '6 hours ago',
    read: false,
  },
  {
    id: 'adm-notif-3',
    type: 'system',
    title: 'Weekly Platform Metrics Available',
    message: 'User enrollment grew by 18.4% over the preceding 7 days.',
    time: 'Yesterday',
    read: true,
  },
];

