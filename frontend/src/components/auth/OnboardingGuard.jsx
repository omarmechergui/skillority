'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { LoadingState } from '@/components/ui/LoadingState';
import {
  isOnboardingComplete,
  ROLE_DASHBOARDS,
  ROLE_ONBOARDING,
} from '@/lib/onboarding';

/**
 * OnboardingGuard Component
 *
 * Wraps individual onboarding pages to enforce:
 * 1. Role match  — a Student cannot access /onboarding/company.
 * 2. Completion  — a user who already completed onboarding is redirected
 *                  to their role dashboard instead of re-entering the wizard.
 *
 * Authentication is already enforced by the (onboarding) layout's AuthGuard;
 * this guard only handles the two concerns above.
 */
export function OnboardingGuard({ requiredRole, children }) {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (loading || !user) return;

    // Wrong role for this onboarding page → redirect to own onboarding or dashboard
    if (requiredRole && user.role !== requiredRole) {
      const ownOnboarding = ROLE_ONBOARDING[user.role];
      if (ownOnboarding && !isOnboardingComplete(user)) {
        router.replace(ownOnboarding);
      } else {
        router.replace(ROLE_DASHBOARDS[user.role] || '/');
      }
      return;
    }

    // Already completed onboarding → go to dashboard
    if (isOnboardingComplete(user)) {
      router.replace(ROLE_DASHBOARDS[user.role] || '/');
    }
  }, [loading, user, requiredRole, router]);

  // While auth is loading (handled by parent AuthGuard, but defensive)
  if (loading || !user) {
    return (
      <div className="min-h-screen bg-canvas flex items-center justify-center">
        <LoadingState message="Loading..." />
      </div>
    );
  }

  // Wrong role — show loading while redirect effect fires
  if (requiredRole && user.role !== requiredRole) {
    return (
      <div className="min-h-screen bg-canvas flex items-center justify-center">
        <LoadingState message="Redirecting..." />
      </div>
    );
  }

  // Already completed — show loading while redirect effect fires
  if (isOnboardingComplete(user)) {
    return (
      <div className="min-h-screen bg-canvas flex items-center justify-center">
        <LoadingState message="Redirecting to dashboard..." />
      </div>
    );
  }

  return children;
}

export default OnboardingGuard;
