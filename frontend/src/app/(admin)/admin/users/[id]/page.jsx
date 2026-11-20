'use client';

import { useState } from 'react';
import Link from 'next/link';
import DashboardShell from '@/components/layout/DashboardShell';
import { adminNav } from '@/components/layout/navigationConfig';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import {
  ArrowLeft,
  Mail,
  ShieldAlert,
  Coins,
  Calendar,
  CheckCircle,
} from 'lucide-react';

export default function UserDetailsAccountOverviewPage({ params }) {
  const [user] = useState(null);

  if (!user) {
    return (
      <DashboardShell roleTitle="Platform Admin" navItems={adminNav}>
        <div className="space-y-6 max-w-4xl mx-auto py-12 text-center">
          <Card className="p-8 text-center space-y-4">
            <h2 className="text-lg font-bold text-slate-900">User Not Found</h2>
            <p className="text-sm text-slate-500">The requested user account could not be found or has not been loaded.</p>
            <Link href="/admin/users">
              <Button variant="outline" className="text-xs">Back to Users</Button>
            </Link>
          </Card>
        </div>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell roleTitle="Platform Admin" navItems={adminNav}>
      <div className="space-y-6 max-w-4xl mx-auto">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/admin/users">
              <Button variant="ghost" className="p-2 text-slate-500 hover:text-slate-900">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div>
              <Badge variant="primary" className="text-[10px]">{user.role}</Badge>
              <h1 className="text-2xl font-bold text-slate-900">{user.name}</h1>
            </div>
          </div>

          <Link href={`/admin/users/${user.id}/manage`}>
            <Button variant="outline" className="text-xs font-semibold text-rose-600 border-rose-200 hover:bg-rose-50">
              Manage / Suspend Account
            </Button>
          </Link>
        </div>

        <Card className="p-6 sm:p-8 space-y-6">
          <div className="flex justify-between items-center border-b border-border pb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">Account Identity</h2>
              <p className="text-xs text-slate-500">System identifier: {user.id}</p>
            </div>
            <Badge variant={user.status === 'ACTIVE' ? 'success' : 'danger'}>{user.status}</Badge>
          </div>

          <div className="grid grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-slate-400 block uppercase text-[10px]">Email Address</span>
              <span className="font-semibold text-slate-800">{user.email}</span>
            </div>
            <div>
              <span className="text-slate-400 block uppercase text-[10px]">Registration Date</span>
              <span className="font-semibold text-slate-800">{user.joinedDate}</span>
            </div>
            <div>
              <span className="text-slate-400 block uppercase text-[10px]">Platform Coins Ledger</span>
              <span className="font-bold text-amber-600">{user.coinsBalance} Coins</span>
            </div>
            <div>
              <span className="text-slate-400 block uppercase text-[10px]">Activity Summary</span>
              <span className="font-semibold text-slate-800">{user.activityCount}</span>
            </div>
          </div>
        </Card>
      </div>
    </DashboardShell>
  );
}

