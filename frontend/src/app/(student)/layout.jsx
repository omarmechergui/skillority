'use client';

import { AuthGuard } from '@/components/auth/AuthGuard';

export default function StudentLayout({ children }) {
  return <AuthGuard allowedRoles={['STUDENT']}>{children}</AuthGuard>;
}
