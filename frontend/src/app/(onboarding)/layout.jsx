'use client';

import { AuthGuard } from '@/components/auth/AuthGuard';

export default function OnboardingLayout({ children }) {
  // Onboarding requires an authenticated user of any recognized role
  return <AuthGuard allowedRoles={['STUDENT', 'COMPANY', 'INSTRUCTOR', 'ADMIN']}>{children}</AuthGuard>;
}
