'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { LoadingState } from '@/components/ui/LoadingState';

const ROLE_DASHBOARDS = {
  STUDENT: '/student/dashboard',
  COMPANY: '/company/dashboard',
  INSTRUCTOR: '/instructor/dashboard',
  ADMIN: '/admin/dashboard',
};

/**
 * AuthGuard Component
 * 
 * Enforces frontend route-level authorization:
 * 1. Shows full-page loading state while session verification/restoration is in progress.
 * 2. Redirects unauthenticated users to /auth/signin?redirect=<safe_path>.
 * 3. Redirects authenticated users with unauthorized roles to their own role's dashboard.
 * 4. Renders protected children only when user is authenticated and authorized.
 */
export function AuthGuard({ allowedRoles = [], children }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, loading, isAuthenticated } = useAuth();

  useEffect(() => {
    if (loading) return;

    if (!isAuthenticated || !user) {
      // Safe local path redirect only - prevent open redirects
      const safeRedirect = pathname && pathname.startsWith('/') && !pathname.startsWith('//')
        ? encodeURIComponent(pathname)
        : '';
      const dest = safeRedirect ? `/auth/signin?redirect=${safeRedirect}` : '/auth/signin';
      router.replace(dest);
      return;
    }

    if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
      // User is authenticated but unauthorized for this route group
      const targetDashboard = ROLE_DASHBOARDS[user.role] || '/';
      router.replace(targetDashboard);
    }
  }, [loading, isAuthenticated, user, allowedRoles, pathname, router]);

  // While checking auth, show full-page loading state to prevent flash of content/mock data
  if (loading) {
    return (
      <div className="min-h-screen bg-canvas flex items-center justify-center">
        <LoadingState message="Verifying authentication..." />
      </div>
    );
  }

  // If not authenticated or not authorized, don't render children while redirecting
  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-canvas flex items-center justify-center">
        <LoadingState message="Redirecting to sign in..." />
      </div>
    );
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return (
      <div className="min-h-screen bg-canvas flex items-center justify-center">
        <LoadingState message="Redirecting to your dashboard..." />
      </div>
    );
  }

  return children;
}

export default AuthGuard;
