'use client';

import { AuthGuard } from '@/components/auth/AuthGuard';

export default function AdminLayout({ children }) {
  return <AuthGuard allowedRoles={['ADMIN']}>{children}</AuthGuard>;
}
