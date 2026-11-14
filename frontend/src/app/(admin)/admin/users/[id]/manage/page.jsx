'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import DashboardShell from '@/components/layout/DashboardShell';
import { adminNav } from '@/components/layout/navigationConfig';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { mockAdminUsers } from '@/lib/mockAdminData';
import { ArrowLeft, AlertTriangle, ShieldCheck, Check } from 'lucide-react';

export default function UserAccountManagePage({ params }) {
  const router = useRouter();
  const user = mockAdminUsers.find((u) => u.id === params.id) || mockAdminUsers[0];
  const [status, setStatus] = useState(user.status);
  const [reason, setReason] = useState('');
  const [updated, setUpdated] = useState(false);

  const handleUpdateStatus = (newStatus) => {
    setStatus(newStatus);
    setUpdated(true);
    setTimeout(() => setUpdated(false), 3000);
  };

  return (
    <DashboardShell roleTitle="Platform Admin" navItems={adminNav}>
      <div className="space-y-6 max-w-3xl mx-auto">
        <div className="flex items-center gap-3">
          <Link href={`/admin/users/${user.id}`}>
            <Button variant="ghost" className="p-2 text-slate-500 hover:text-slate-900">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div>
            <Badge variant="primary" className="text-[10px]">User Account Moderation</Badge>
            <h1 className="text-2xl font-bold text-slate-900">{user.name}</h1>
          </div>
        </div>

        {updated && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-600" />
            User account status updated to {status}!
          </div>
        )}

        <Card className="p-6 space-y-4">
          <h2 className="text-base font-bold text-slate-900">Status Governance</h2>
          <div className="p-4 bg-slate-50 border border-border rounded-xl space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-500">Current Status:</span>
              <Badge variant={status === 'ACTIVE' ? 'success' : 'danger'}>{status}</Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Account Role:</span>
              <span className="font-bold text-slate-800">{user.role}</span>
            </div>
          </div>

          <div className="space-y-1.5 pt-2">
            <label className="text-xs font-semibold text-slate-700">Audit / Moderation Reason</label>
            <textarea
              rows={3}
              placeholder="State justification for suspension, unsuspend, or privilege update..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full rounded-lg border border-border p-3 text-xs focus:ring-2 focus:ring-primary/20 focus:border-primary resize-y"
            />
          </div>

          <div className="flex flex-wrap gap-3 pt-3 border-t border-border">
            {status !== 'ACTIVE' ? (
              <Button
                onClick={() => handleUpdateStatus('ACTIVE')}
                className="text-xs bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                Reactivate Account
              </Button>
            ) : (
              <Button
                onClick={() => handleUpdateStatus('SUSPENDED')}
                variant="outline"
                className="text-xs text-rose-600 border-rose-300 hover:bg-rose-50"
              >
                Suspend User Account
              </Button>
            )}

            <Button
              onClick={() => handleUpdateStatus('BANNED')}
              variant="outline"
              className="text-xs text-slate-700 border-slate-300 hover:bg-slate-100"
            >
              Permanent Ban
            </Button>
          </div>
        </Card>
      </div>
    </DashboardShell>
  );
}

