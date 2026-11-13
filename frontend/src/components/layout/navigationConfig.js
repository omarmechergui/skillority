import {
  BookOpen,
  LayoutDashboard,
  Compass,
  Briefcase,
  Users,
  MessageSquare,
  Wallet,
  Settings,
  GraduationCap,
  FileCheck,
  Building2,
  ShieldCheck,
  BarChart3,
  UserCheck,
} from 'lucide-react';

export const studentNav = [
  { label: 'Dashboard', href: '/student/dashboard', icon: LayoutDashboard },
  { label: 'Learn Hub', href: '/student/learn', icon: BookOpen },
  { label: 'My Progress', href: '/student/progress', icon: Compass },
  { label: 'Career Opportunities', href: '/student/careers', icon: Briefcase },
  { label: 'Community Feed', href: '/student/community', icon: Users },
  { label: 'Messages', href: '/student/messages', icon: MessageSquare },
  { label: 'Coins & Wallet', href: '/student/wallet', icon: Wallet },
  { label: 'Settings', href: '/student/settings', icon: Settings },
];

export const companyNav = [
  { label: 'Dashboard', href: '/company/dashboard', icon: LayoutDashboard },
  { label: 'Job Opportunities', href: '/company/opportunities', icon: Briefcase },
  { label: 'Applications Inbox', href: '/company/applications', icon: FileCheck },
  { label: 'Talent Discovery', href: '/company/talent', icon: Users },
  { label: 'Recruitment Pipeline', href: '/company/pipeline', icon: BarChart3 },
  { label: 'Candidate Messages', href: '/company/messages', icon: MessageSquare },
  { label: 'Company Profile', href: '/company/profile', icon: Building2 },
  { label: 'Settings', href: '/company/settings', icon: Settings },
];

export const instructorNav = [
  { label: 'Instructor Hub', href: '/instructor/dashboard', icon: LayoutDashboard },
  { label: 'My Courses', href: '/instructor/courses', icon: BookOpen },
  { label: 'Curriculum Builder', href: '/instructor/courses/create', icon: GraduationCap },
  { label: 'Student Directory', href: '/instructor/students', icon: UserCheck },
  { label: 'Assessments', href: '/instructor/assessments', icon: FileCheck },
  { label: 'Settings', href: '/instructor/settings', icon: Settings },
];

export const adminNav = [
  { label: 'Admin Overview', href: '/admin/dashboard', icon: LayoutDashboard },
  { label: 'User Directory', href: '/admin/users', icon: UserCheck },
  { label: 'Course Approvals', href: '/admin/courses/reviews', icon: FileCheck },
  { label: 'Platform Activity', href: '/admin/activity', icon: ShieldCheck },
  { label: 'Reports & Analytics', href: '/admin/reports', icon: BarChart3 },
  { label: 'Platform Settings', href: '/admin/settings', icon: Settings },
];

