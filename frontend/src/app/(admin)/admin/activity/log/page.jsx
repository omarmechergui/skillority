'use client';

import { useState } from 'react';
import Link from 'next/link';
import DashboardShell from '@/components/layout/DashboardShell';
import { adminNav } from '@/components/layout/navigationConfig';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
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
            <p className="text-slate-400"># System Audit Log Stream</p>
            <p className="text-slate-500">No active security incident or transaction trace selected.</p>
          </div>
        </Card>
      </div>
    </DashboardShell>
  );
}
