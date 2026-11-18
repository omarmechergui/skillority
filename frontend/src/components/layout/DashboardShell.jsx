'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  Bell,
  Search,
  ChevronDown,
  Menu,
  X,
  LogOut,
  User,
  Settings,
  Coins,
} from 'lucide-react';
import { Avatar } from '@/components/ui/Avatar';
import { Dropdown } from '@/components/ui/Dropdown';
import { useAuth } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import {
  studentNav,
  companyNav,
  instructorNav,
  adminNav,
} from '@/components/layout/navigationConfig';

export function DashboardShell({
  roleTitle,
  navItems,
  children,
  breadcrumbs = [],
  action,
  role,
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, logoutUser } = useAuth();

  // Determine active role prioritizing:
  // 1. Explicit role prop
  // 2. Route-derived path role
  // 3. Authenticated user role
  // 4. Safe default ('STUDENT')
  const pathRole = pathname?.startsWith('/admin')
    ? 'ADMIN'
    : pathname?.startsWith('/instructor')
    ? 'INSTRUCTOR'
    : pathname?.startsWith('/company')
    ? 'COMPANY'
    : pathname?.startsWith('/student')
    ? 'STUDENT'
    : null;

  const validRoles = ['STUDENT', 'COMPANY', 'INSTRUCTOR', 'ADMIN'];
  const rawRole = role || pathRole || user?.role || 'STUDENT';
  const activeRole = validRoles.includes(String(rawRole).toUpperCase())
    ? String(rawRole).toUpperCase()
    : 'STUDENT';
  const isStudent = activeRole === 'STUDENT';

  // Resolve role title and default nav items per role
  const resolvedRoleTitle =
    roleTitle ||
    (activeRole === 'ADMIN'
      ? 'Platform Admin'
      : activeRole === 'INSTRUCTOR'
      ? 'Instructor Portal'
      : activeRole === 'COMPANY'
      ? 'Recruiter Portal'
      : 'Student Portal');

  const resolvedNavItems =
    navItems && navItems.length > 0
      ? navItems
      : activeRole === 'ADMIN'
      ? adminNav
      : activeRole === 'INSTRUCTOR'
      ? instructorNav
      : activeRole === 'COMPANY'
      ? companyNav
      : studentNav;

  const rolePrefix = activeRole.toLowerCase();

  const userMenuItems = [
    {
      label: 'My Profile',
      icon: User,
      onClick: () => router.push(`/${rolePrefix}/profile`),
    },
    {
      label: 'Account Settings',
      icon: Settings,
      onClick: () => router.push(`/${rolePrefix}/settings`),
    },
    { divider: true },
    {
      label: 'Sign Out',
      icon: LogOut,
      danger: true,
      onClick: logoutUser,
    },
  ];

  // ==========================================
  // STUDENT EXPERIENCE: Top Navigation Layout (Stitch Spec)
  // ==========================================
  if (isStudent) {
    const studentTopNav = [
      { label: 'Dashboard', href: '/student/dashboard' },
      { label: 'Learn', href: '/student/learn' },
      { label: 'Career', href: '/student/careers' },
      { label: 'Community', href: '/student/community' },
      { label: 'Chat', href: '/student/messages' },
    ];

    return (
      <div className="min-h-screen bg-canvas flex flex-col text-neutral-dark font-sans antialiased">
        {/* Top Header matching Stitch specification */}
        <header className="sticky top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-border shadow-[0_1px_8px_rgba(0,0,0,0.03)]">
          <div className="h-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
            {/* Left Brand + Horizontal Navigation */}
            <div className="flex items-center gap-6 lg:gap-8">
              <Link href="/student/dashboard" className="flex items-center gap-2.5 text-primary group">
                <div className="w-8 h-8 rounded-lg bg-primary text-white flex items-center justify-center font-bold text-base shadow-xs">
                  S
                </div>
                <span className="font-bold text-lg text-slate-900 tracking-tight">Skillority</span>
              </Link>

              <nav className="hidden md:flex items-center gap-6">
                {studentTopNav.map((item, idx) => {
                  const isActive =
                    pathname === item.href || (item.href !== '/student/dashboard' && pathname.startsWith(item.href));

                  return (
                    <Link
                      key={idx}
                      href={item.href}
                      className={cn(
                        'text-sm transition-colors py-5 relative font-medium',
                        isActive
                          ? 'text-primary font-semibold after:content-[\'\'] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-primary'
                          : 'text-slate-600 hover:text-slate-900'
                      )}
                    >
                      {item.label}
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* Right Quick Controls: Coins, Search, Notifications, Profile */}
            <div className="flex items-center gap-3 sm:gap-4">
              {/* Coins Badge */}
              <Link
                href="/student/wallet"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-100/80 text-amber-900 text-xs font-semibold hover:bg-amber-200/80 transition-colors shadow-xs"
              >
                <Coins className="w-3.5 h-3.5 text-amber-600 fill-amber-500" />
                <span>480 Coins</span>
              </Link>

              {/* Quick Search */}
              <div className="relative hidden lg:block w-56">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search courses, topics..."
                  className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-100/80 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white transition-all border border-transparent focus:border-border"
                />
              </div>

              {/* Notification Bell */}
              <Link
                href="/student/notifications"
                className="relative p-2 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
                aria-label="Notifications"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500" />
              </Link>

              {/* Profile Avatar / Menu */}
              <div className="flex items-center gap-2 pl-1 border-l border-border">
                <div className="text-right hidden xl:block">
                  <p className="text-xs font-medium text-slate-900 leading-tight">
                    {user?.profile?.firstName
                      ? `${user.profile.firstName} ${user.profile.lastName || ''}`
                      : 'Alex Morgan'}
                  </p>
                  <p className="text-[10px] text-slate-500">Student Account</p>
                </div>
                <Dropdown
                  trigger={
                    <button
                      type="button"
                      className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold text-xs shadow-xs hover:ring-2 hover:ring-primary/20 transition-all"
                    >
                      {user?.profile?.firstName ? user.profile.firstName[0].toUpperCase() : 'A'}
                    </button>
                  }
                  items={userMenuItems}
                  align="right"
                  className="w-48 mt-2"
                />
              </div>

              {/* Mobile menu toggle */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-1.5 text-slate-600 hover:text-slate-900 rounded-md hover:bg-slate-100"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Mobile Drawer */}
          {mobileMenuOpen && (
            <div className="md:hidden border-t border-border bg-white px-4 py-3 space-y-1">
              {studentTopNav.map((item, idx) => {
                const isActive =
                  pathname === item.href || (item.href !== '/student/dashboard' && pathname.startsWith(item.href));
                return (
                  <Link
                    key={idx}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      'block px-3 py-2 rounded-lg text-sm font-medium',
                      isActive ? 'bg-primary-light text-primary font-semibold' : 'text-slate-600 hover:bg-slate-50'
                    )}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>
          )}
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 md:p-8 max-w-7xl w-full mx-auto">{children}</main>
      </div>
    );
  }

  // ==========================================
  // COMPANY, INSTRUCTOR & ADMIN: Fixed Sidebar Layout (Stitch Spec)
  // ==========================================
  return (
    <div className="min-h-screen bg-canvas flex flex-col md:flex-row text-neutral-dark font-sans antialiased">
      {/* Mobile Top Header */}
      <header className="md:hidden flex items-center justify-between px-4 py-3 bg-surface border-b border-border sticky top-0 z-30">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-7 h-7 bg-primary text-white rounded flex items-center justify-center font-bold text-sm">
            S
          </div>
          <span className="font-bold text-sm tracking-tight">Skillority</span>
        </Link>
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-1.5 text-neutral-slate hover:text-neutral-dark rounded-md hover:bg-neutral-light"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </header>

      {/* Sidebar Navigation */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-40 w-64 bg-surface border-r border-border flex flex-col transition-transform md:translate-x-0 md:static md:h-screen sticky top-0 shrink-0 shadow-[0_1px_8px_rgba(0,0,0,0.03)]',
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Brand Header */}
        <div className="h-16 flex items-center px-6 border-b border-border gap-3">
          <div className="w-8 h-8 bg-primary text-white rounded-lg flex items-center justify-center font-bold text-base shadow-xs">
            S
          </div>
          <div>
            <span className="font-bold text-sm tracking-tight block leading-none">Skillority</span>
            <span className="text-[10px] text-neutral-slate font-medium">{resolvedRoleTitle}</span>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-4 py-5 space-y-1 overflow-y-auto">
          {resolvedNavItems.map((item, idx) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (item.href !== `/${rolePrefix}/dashboard` && pathname.startsWith(item.href));

            return (
              <Link
                key={idx}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  'flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-colors',
                  isActive
                    ? 'bg-primary-light text-primary font-semibold'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                )}
              >
                <div className="flex items-center gap-3">
                  {Icon && <Icon className="w-4 h-4 shrink-0" />}
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={cn(
                      'px-1.5 py-0.2 rounded-full text-[10px] font-semibold',
                      isActive ? 'bg-primary text-white' : 'bg-slate-100 text-slate-600'
                    )}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* User Card at Sidebar Bottom */}
        <div className="p-3 border-t border-border bg-canvas/40">
          <Dropdown
            trigger={
              <button
                type="button"
                className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-surface border border-transparent hover:border-border transition-all text-left"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <Avatar
                    fallback={user?.email ? user.email[0].toUpperCase() : 'U'}
                    size="sm"
                    status="online"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold truncate text-neutral-dark">
                      {user?.profile?.firstName
                        ? `${user.profile.firstName} ${user.profile.lastName || ''}`
                        : user?.email || 'Authenticated User'}
                    </p>
                    <p className="text-[10px] text-neutral-slate truncate">{user?.role || resolvedRoleTitle}</p>
                  </div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-neutral-slate shrink-0 ml-1" />
              </button>
            }
            items={userMenuItems}
            align="left"
            className="w-56 bottom-full mb-2 left-0"
          />
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Desktop TopBar */}
        <header className="h-16 bg-surface/90 backdrop-blur-xl border-b border-border px-8 hidden md:flex items-center justify-between sticky top-0 z-20">
          {/* Breadcrumbs or Search */}
          <div className="flex items-center gap-2 text-xs text-neutral-slate">
            {breadcrumbs.length > 0 ? (
              breadcrumbs.map((b, i) => (
                <span key={i} className="flex items-center gap-2">
                  {i > 0 && <span>/</span>}
                  <span className={cn(i === breadcrumbs.length - 1 && 'font-semibold text-neutral-dark')}>
                    {b}
                  </span>
                </span>
              ))
            ) : (
              <div className="relative w-72">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search dashboard, records, users..."
                  className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-border rounded-lg text-neutral-dark placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white transition-all"
                />
              </div>
            )}
          </div>

          {/* Action and Notification Bell */}
          <div className="flex items-center gap-3">
            {action}
            <button
              type="button"
              className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg relative transition-colors"
            >
              <Bell className="w-4 h-4" />
              <span className="w-2 h-2 rounded-full bg-primary absolute top-1.5 right-1.5 ring-2 ring-surface" />
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto">{children}</main>
      </div>
    </div>
  );
}

export default DashboardShell;
