'use client';

import { useState } from 'react';
import Link from 'next/link';
import DashboardShell from '@/components/layout/DashboardShell';
import { adminNav } from '@/components/layout/navigationConfig';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { Activity, ShieldCheck, Database, ArrowRight } from 'lucide-react';

export default function PlatformActivityDashboardPage() {
  const [logs] = useState([]);

  return (
    <DashboardShell roleTitle="Platform Admin" navItems={adminNav}>
      <div className="space-y-8 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 sm:p-8 rounded-xl border border-border shadow-sm">
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
              Platform Activity Dashboard
            </h1>
            <p className="text-sm text-slate-500 max-w-xl">
              Real-time audit log of security events, coin economy debits/credits, and course state changes.
            </p>
          </div>

          <Link href="/admin/activity/log">
            <Button variant="outline" className="text-xs font-semibold">
              Full System Event Log
            </Button>
          </Link>
        </div>

        <div className="space-y-3">
          {logs.length === 0 ? (
            <Card className="p-8 text-center text-slate-500 text-xs">
              No platform activity logs recorded yet.
            </Card>
          ) : (
            logs.map((log) => (
              <Card key={log.id} className="p-4 sm:p-5 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                    <Activity className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-slate-900">{log.user}</span>
                      <Badge variant="outline" className="text-[10px]">{log.type}</Badge>
                    </div>
                    <p className="text-xs text-slate-600 pt-0.5">{log.action}</p>
                    <p className="text-[11px] text-slate-400">{log.details}</p>
                  </div>
                </div>

                <span className="text-[11px] text-slate-400 shrink-0">{log.timestamp}</span>
              </Card>
            ))
          )}
        </div>
      </div>
    </DashboardShell>
  );
}

