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
} from 'lucide-react';
import { Avatar } from '@/components/ui/Avatar';
import { Dropdown } from '@/components/ui/Dropdown';
import { useAuth } from '@/lib/auth';

export function DashboardShell({
  roleTitle = 'Student Portal',
  navItems = [],
  children,
  breadcrumbs = [],
  action,
}) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, logoutUser } = useAuth();

  const userMenuItems = [
    {
      label: 'My Profile',
      icon: User,
      onClick: () => console.log('Navigate to profile'),
    },
    {
      label: 'Account Settings',
      icon: Settings,
      onClick: () => console.log('Navigate to settings'),
    },
    { divider: true },
    {
      label: 'Sign Out',
      icon: LogOut,
      danger: true,
      onClick: logoutUser,
    },
  ];

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
          'fixed inset-y-0 left-0 z-40 w-64 bg-surface border-r border-border flex flex-col transition-transform md:translate-x-0 md:static md:h-screen sticky top-0 shrink-0',
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Brand Header */}
        <div className="h-14 flex items-center px-5 border-b border-border gap-2.5">
          <div className="w-8 h-8 bg-primary text-white rounded-md flex items-center justify-center font-bold text-base shadow-xs">
            S
          </div>
          <div>
            <span className="font-bold text-sm tracking-tight block leading-none">Skillority</span>
            <span className="text-[10px] text-neutral-slate font-medium">{roleTitle}</span>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item, idx) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');

            return (
              <Link
                key={idx}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  'flex items-center justify-between px-3 py-2 rounded-md text-xs font-medium transition-colors',
                  isActive
                    ? 'bg-primary-light text-primary font-semibold'
                    : 'text-neutral-slate hover:bg-neutral-light hover:text-neutral-dark'
                )}
              >
                <div className="flex items-center gap-2.5">
                  {Icon && <Icon className="w-4 h-4 shrink-0" />}
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={cn(
                      'px-1.5 py-0.2 rounded-full text-[10px] font-semibold',
                      isActive ? 'bg-primary text-white' : 'bg-neutral-light text-neutral-slate'
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
                className="w-full flex items-center justify-between p-2 rounded-md hover:bg-surface border border-transparent hover:border-border transition-all text-left"
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
                    <p className="text-[10px] text-neutral-slate truncate">{user?.role || 'Member'}</p>
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
        <header className="h-14 bg-surface border-b border-border px-6 hidden md:flex items-center justify-between sticky top-0 z-20">
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
              <div className="relative w-64">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-muted" />
                <input
                  type="text"
                  placeholder="Search platform..."
                  className="w-full pl-8 pr-3 py-1.5 text-xs bg-canvas border border-border rounded-md text-neutral-dark placeholder-neutral-muted focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
            )}
          </div>

          {/* Action and Notification Bell */}
          <div className="flex items-center gap-3">
            {action}
            <button
              type="button"
              className="p-2 text-neutral-slate hover:text-neutral-dark hover:bg-neutral-light rounded-md relative transition-colors"
            >
              <Bell className="w-4 h-4" />
              <span className="w-2 h-2 rounded-full bg-primary absolute top-1.5 right-1.5 ring-2 ring-surface" />
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 md:p-8 max-w-7xl w-full mx-auto">{children}</main>
      </div>
    </div>
  );
}

export default DashboardShell;
