'use client';

import { AuthGuard } from '@/components/auth/AuthGuard';

export default function InstructorLayout({ children }) {
  return <AuthGuard allowedRoles={['INSTRUCTOR']}>{children}</AuthGuard>;
}
