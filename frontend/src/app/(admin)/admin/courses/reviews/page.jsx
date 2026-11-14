'use client';

import { useState } from 'react';
import Link from 'next/link';
import DashboardShell from '@/components/layout/DashboardShell';
import { adminNav } from '@/components/layout/navigationConfig';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { mockCourseReviews } from '@/lib/mockAdminData';
import { FileCheck, ArrowRight, BookOpen, Clock } from 'lucide-react';

export default function CourseReviewDashboardPage() {
  const [reviews] = useState(mockCourseReviews);

  return (
    <DashboardShell roleTitle="Platform Admin" navItems={adminNav}>
      <div className="space-y-8 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 sm:p-8 rounded-xl border border-border shadow-sm">
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
              Course Review & Accreditation Queue
            </h1>
            <p className="text-sm text-slate-500 max-w-xl">
              Inspect submitted curriculums, lesson block structures, and chapter quizzes before authorizing platform publication.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {reviews.map((rev) => (
            <Card key={rev.id} className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:shadow-sm transition-shadow">
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-2">
                  <Badge variant="warning" className="text-[10px]">{rev.status}</Badge>
                  <span className="text-xs text-slate-400">•</span>
                  <span className="text-xs text-slate-500 font-semibold">{rev.category}</span>
                </div>
                <h3 className="text-lg font-bold text-slate-900">{rev.title}</h3>
                <p className="text-xs text-slate-500">Instructor: <strong>{rev.instructor}</strong> · Submitted: {rev.submittedDate}</p>
                <div className="flex items-center gap-4 text-xs text-slate-600 pt-1">
                  <span>{rev.totalChapters} Chapters</span>
                  <span>•</span>
                  <span>{rev.totalLessons} Lessons</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Link href={`/admin/courses/reviews/${rev.id}`}>
                  <Button variant="outline" className="text-xs font-semibold">
                    Inspect Syllabus
                  </Button>
                </Link>
                <Link href={`/admin/courses/reviews/${rev.id}/decide`}>
                  <Button className="text-xs font-semibold">
                    Approve / Reject
                  </Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </DashboardShell>
  );
}

