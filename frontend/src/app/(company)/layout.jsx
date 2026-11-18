'use client';

import { AuthGuard } from '@/components/auth/AuthGuard';

export default function CompanyLayout({ children }) {
  return <AuthGuard allowedRoles={['COMPANY']}>{children}</AuthGuard>;
}
