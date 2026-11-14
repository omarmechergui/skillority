'use client';

import { useState } from 'react';
import Link from 'next/link';
import DashboardShell from '@/components/layout/DashboardShell';
import { adminNav } from '@/components/layout/navigationConfig';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { mockActivityLogs } from '@/lib/mockAdminData';
import { ArrowLeft, Activity } from 'lucide-react';

export default function ActivityLogEventDetailsPage() {
  return (
    <DashboardShell roleTitle="Platform Admin" navItems={adminNav}>
      <div className="space-y-6 max-w-5xl mx-auto">
        <div className="flex items-center gap-3">
          <Link href="/admin/activity">
            <Button variant="ghost" className="p-2 text-slate-500 hover:text-slate-900">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Event Details & Security Log</h1>
            <p className="text-xs text-slate-500">Immutable ledger events captured by system monitors</p>
          </div>
        </div>

        <Card className="p-6 space-y-4">
          <div className="p-4 bg-slate-900 text-slate-100 rounded-xl font-mono text-xs space-y-2 overflow-x-auto">
            <p className="text-emerald-400"># System Event Trace ACT-1</p>
            <p>Timestamp: 2026-11-14T11:45:00.120Z</p>
            <p>Actor: usr-student-01 (Alex Rivera)</p>
            <p>Action: UNLOCK_CHAPTER</p>
            <p>Payload: {"{ courseId: 'course-1', chapter: 6, coinsCharged: 250, priorBalance: 730 }"}</p>
            <p className="text-blue-400">Status: TRANSACTION_CONFIRMED_200_OK</p>
          </div>
        </Card>
      </div>
    </DashboardShell>
  );
}
