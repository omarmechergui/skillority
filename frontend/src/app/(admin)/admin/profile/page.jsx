'use client';

import { useState } from 'react';
import Image from 'next/image';
import DashboardShell from '@/components/layout/DashboardShell';
import { adminNav } from '@/components/layout/navigationConfig';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import { useAuth } from '@/lib/auth';
import { ShieldCheck, Mail, Calendar, Key } from 'lucide-react';

export default function AdminPersonalProfilePage() {
  const { user } = useAuth();
  const profile = {
    name: user?.profile ? `${user.profile.firstName || ''} ${user.profile.lastName || ''}`.trim() || user.email : user?.email || 'Platform Administrator',
    email: user?.email || '',
    role: 'Platform Superadministrator',
    department: 'Platform Governance & Accreditation',
    joinedDate: user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A',
    avatar: user?.profile?.avatarUrl || null,
  };

  return (
    <DashboardShell roleTitle="Platform Admin" navItems={adminNav}>
      <div className="space-y-8 max-w-4xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 sm:p-8 rounded-xl border border-border shadow-sm">
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
              Admin Personal Profile
            </h1>
            <p className="text-sm text-slate-500 max-w-xl">
              Superadministrator credentials, authorization keys, and accreditation oversight authority.
            </p>
          </div>
        </div>

        <Card className="p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center gap-6">
          <div className="relative w-20 h-20 rounded-2xl overflow-hidden border-2 border-rose-500/20 bg-slate-100 flex items-center justify-center shrink-0">
            {profile.avatar ? (
              <Image
                src={profile.avatar}
                alt={profile.name}
                fill
                className="object-cover"
                unoptimized
              />
            ) : (
              <ShieldCheck className="w-8 h-8 text-rose-600" />
            )}
          </div>

          <div className="space-y-1.5 flex-1">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-slate-900">{profile.name}</h2>
              <Badge variant="primary" className="text-[10px] bg-rose-600 text-white">Superadmin</Badge>
            </div>
            <p className="text-xs font-semibold text-slate-600">{profile.role}</p>
            <p className="text-xs text-slate-400">{profile.department}</p>

            <div className="flex flex-wrap gap-4 text-xs text-slate-500 pt-2 border-t border-border">
              <span className="flex items-center gap-1">
                <Mail className="w-3.5 h-3.5" />
                {profile.email}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                Admin since {profile.joinedDate}
              </span>
            </div>
          </div>
        </Card>
      </div>
    </DashboardShell>
  );
}

