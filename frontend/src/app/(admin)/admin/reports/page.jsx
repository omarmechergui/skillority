'use client';

import { useState } from 'react';
import DashboardShell from '@/components/layout/DashboardShell';
import { adminNav } from '@/components/layout/navigationConfig';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { mockAdminStats } from '@/lib/mockAdminData';
import { BarChart3, TrendingUp, Users, Coins, Download } from 'lucide-react';

export default function ReportsAnalyticsPage() {
  const stats = mockAdminStats;

  return (
    <DashboardShell roleTitle="Platform Admin" navItems={adminNav}>
      <div className="space-y-8 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 sm:p-8 rounded-xl border border-border shadow-sm">
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
              Platform Reports & Analytics
            </h1>
            <p className="text-sm text-slate-500 max-w-xl">
              Platform-wide completion rates, coin economy velocity, learner engagement, and partner hires.
            </p>
          </div>

          <Button variant="outline" className="text-xs font-semibold flex items-center gap-1.5">
            <Download className="w-4 h-4" />
            Export Monthly Audit CSV
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6 space-y-3">
            <h3 className="font-bold text-sm text-slate-900">Learner Retention</h3>
            <p className="text-3xl font-black text-slate-900">84.2%</p>
            <p className="text-xs text-emerald-600 font-semibold">+3.8% over last quarter</p>
          </Card>

          <Card className="p-6 space-y-3">
            <h3 className="font-bold text-sm text-slate-900">Total Coins Minted (Quizzes)</h3>
            <p className="text-3xl font-black text-amber-600">+192,400</p>
            <p className="text-xs text-slate-500">Earned across 3,848 quiz passes</p>
          </Card>

          <Card className="p-6 space-y-3">
            <h3 className="font-bold text-sm text-slate-900">Coins Burned (Chapter 6+ Unlocks)</h3>
            <p className="text-3xl font-black text-rose-600">-118,500</p>
            <p className="text-xs text-slate-500">474 advanced chapters unlocked</p>
          </Card>
        </div>
      </div>
    </DashboardShell>
  );
}

