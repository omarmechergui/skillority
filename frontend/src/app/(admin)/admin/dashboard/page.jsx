'use client';

import { useState } from 'react';
import Link from 'next/link';
import DashboardShell from '@/components/layout/DashboardShell';
import { adminNav } from '@/components/layout/navigationConfig';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import {
  ShieldCheck,
  Users,
  BookOpen,
  FileCheck,
  Activity,
  ArrowRight,
  TrendingUp,
  AlertTriangle,
  Coins,
} from 'lucide-react';

export default function AdminDashboardPage() {
  const [stats] = useState({
    totalUsers: 0,
    activeStudents: 0,
    registeredInstructors: 0,
    partnerCompanies: 0,
    totalCourses: 0,
    pendingCourseReviews: 0,
    approvedCourses: 0,
    rejectedCourses: 0,
    totalCoinsCirculating: '0',
    totalTransactions: 0,
    flaggedReports: 0,
    monthlyActiveGrowth: '0%',
  });
  const [reviews] = useState([]);
  const [activity] = useState([]);

  return (
    <DashboardShell roleTitle="Platform Admin" navItems={adminNav}>
      <div className="space-y-8 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 sm:p-8 rounded-xl border border-border shadow-sm">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-rose-600">Superadmin Control Center</span>
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
              Admin Platform Overview
            </h1>
            <p className="text-sm text-slate-500 max-w-xl">
              Platform governance, course accreditation reviews, user moderation, and economy audits.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/admin/courses/reviews">
              <Button className="text-xs font-semibold flex items-center gap-1.5">
                <FileCheck className="w-4 h-4" />
                Review Courses ({stats.pendingCourseReviews})
              </Button>
            </Link>
          </div>
        </div>

        {/* Top Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="p-5 flex items-center gap-4">
            <div className="p-3 bg-blue-50 text-primary rounded-xl">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500 uppercase">Total Users</p>
              <p className="text-2xl font-extrabold text-slate-900">{stats.totalUsers.toLocaleString()}</p>
            </div>
          </Card>

          <Card className="p-5 flex items-center gap-4">
            <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
              <FileCheck className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500 uppercase">Pending Reviews</p>
              <p className="text-2xl font-extrabold text-slate-900">{stats.pendingCourseReviews}</p>
            </div>
          </Card>

          <Card className="p-5 flex items-center gap-4">
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500 uppercase">Monthly Growth</p>
              <p className="text-2xl font-extrabold text-slate-900">{stats.monthlyActiveGrowth}</p>
            </div>
          </Card>

          <Card className="p-5 flex items-center gap-4">
            <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
              <Coins className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500 uppercase">Circulating Coins</p>
              <p className="text-2xl font-extrabold text-slate-900">{stats.totalCoinsCirculating}</p>
            </div>
          </Card>
        </div>

        {/* Course Approval Queue & Platform Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900">Pending Course Accreditations</h2>
              <Link href="/admin/courses/reviews" className="text-xs text-primary font-semibold hover:underline">
                Review Queue
              </Link>
            </div>

            <div className="space-y-3">
              {reviews.length === 0 ? (
                <Card className="p-8 text-center text-slate-500 text-xs">
                  No pending course accreditations in the queue.
                </Card>
              ) : (
                reviews.map((rev) => (
                  <Card key={rev.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Badge variant="warning" className="text-[10px]">{rev.status}</Badge>
                        <span className="text-xs text-slate-400">•</span>
                        <span className="text-xs text-slate-500">{rev.category}</span>
                      </div>
                      <h3 className="font-bold text-slate-900 text-sm leading-snug">{rev.title}</h3>
                      <p className="text-xs text-slate-500">Instructor: {rev.instructor} · Submitted {rev.submittedDate}</p>
                    </div>

                    <Link href={`/admin/courses/reviews/${rev.id}`}>
                      <Button variant="outline" className="text-xs font-semibold flex items-center gap-1">
                        Inspect Syllabus
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Button>
                    </Link>
                  </Card>
                ))
              )}
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900">Live Platform Activity</h2>
              <Link href="/admin/activity" className="text-xs text-primary font-semibold hover:underline">
                Audit Log
              </Link>
            </div>

            <div className="space-y-3">
              {activity.length === 0 ? (
                <Card className="p-8 text-center text-slate-500 text-xs">
                  No recent platform events recorded.
                </Card>
              ) : (
                activity.map((act) => (
                  <Card key={act.id} className="p-4 space-y-1">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-bold text-slate-900">{act.user}</span>
                      <span className="text-slate-400">{act.timestamp}</span>
                    </div>
                    <p className="text-xs text-slate-700 font-medium">{act.action}</p>
                    <p className="text-[11px] text-slate-500">{act.details}</p>
                  </Card>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}

