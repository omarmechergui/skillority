'use client';

import { useState } from 'react';
import Link from 'next/link';
import DashboardShell from '@/components/layout/DashboardShell';
import { instructorNav } from '@/components/layout/navigationConfig';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { ArrowLeft, CheckCircle2, Clock } from 'lucide-react';

export default function StudentCourseProgressDrilldownPage({ params }) {
  return (
    <DashboardShell roleTitle="Instructor Portal" navItems={instructorNav}>
      <div className="space-y-6 max-w-4xl mx-auto">
        <div className="flex items-center gap-3">
          <Link href={`/instructor/students/${params.id}`}>
            <Button variant="ghost" className="p-2 text-slate-500 hover:text-slate-900">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div>
            <Badge variant="primary" className="text-[10px]">Course Progress Drilldown</Badge>
            <h1 className="text-2xl font-bold text-slate-900">Modern Full-Stack Web Development</h1>
          </div>
        </div>

        <Card className="p-6 space-y-4">
          <div className="flex justify-between items-center border-b border-border pb-3">
            <div>
              <h3 className="font-bold text-sm text-slate-900">Chapter Breakdown & Submissions</h3>
              <p className="text-xs text-slate-500">Student ID: {params.id}</p>
            </div>
            <Badge variant="success" className="text-xs">42% Overall Complete</Badge>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3 bg-slate-50 rounded-lg border border-border flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span className="font-semibold text-slate-900">Chapter 0: Course Orientation & Environment Setup</span>
              </div>
              <span className="font-bold text-emerald-600">Quiz: 100% Passed</span>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg border border-border flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span className="font-semibold text-slate-900">Chapter 1: Next.js App Router Architecture</span>
              </div>
              <span className="font-bold text-emerald-600">Quiz: 95% Passed</span>
            </div>

            <div className="p-3 bg-blue-50/50 rounded-lg border border-blue-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-primary" />
                <span className="font-semibold text-slate-900">Chapter 2: Full-Stack Database Modeling with Prisma</span>
              </div>
              <span className="font-semibold text-primary">In Progress</span>
            </div>
          </div>
        </Card>
      </div>
    </DashboardShell>
  );
}

