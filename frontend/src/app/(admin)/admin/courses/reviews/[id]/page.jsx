'use client';

import { useState } from 'react';
import Link from 'next/link';
import DashboardShell from '@/components/layout/DashboardShell';
import { adminNav } from '@/components/layout/navigationConfig';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { mockCourseReviews } from '@/lib/mockAdminData';
import { ArrowLeft, CheckCircle, XCircle, BookOpen, Layers } from 'lucide-react';

export default function CourseReviewDetailsPage({ params }) {
  const review = mockCourseReviews.find((r) => r.id === params.id) || mockCourseReviews[0];

  return (
    <DashboardShell roleTitle="Platform Admin" navItems={adminNav}>
      <div className="space-y-6 max-w-5xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link href="/admin/courses/reviews">
              <Button variant="ghost" className="p-2 text-slate-500 hover:text-slate-900">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <Badge variant="warning" className="text-[10px]">{review.status}</Badge>
                <span className="text-xs text-slate-500">{review.category}</span>
              </div>
              <h1 className="text-2xl font-bold text-slate-900">{review.title}</h1>
            </div>
          </div>

          <Link href={`/admin/courses/reviews/${review.id}/decide`}>
            <Button className="text-xs font-semibold">
              Make Accreditation Decision
            </Button>
          </Link>
        </div>

        <Card className="p-6 space-y-4">
          <h2 className="text-base font-bold text-slate-900">Submitted Curriculum Structure</h2>
          <div className="space-y-2">
            {review.chapters.map((chap) => (
              <div key={chap.number} className="p-3 bg-slate-50 rounded-lg border border-border flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-slate-800">Chapter {chap.number}: {chap.title}</span>
                </div>
                <Badge variant={chap.free ? 'outline' : 'warning'} className="text-[10px]">
                  {chap.free ? 'Free Chapter' : 'Locked with Coins'}
                </Badge>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </DashboardShell>
  );
}

