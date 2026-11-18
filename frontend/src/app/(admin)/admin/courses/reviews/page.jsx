'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import DashboardShell from '@/components/layout/DashboardShell';
import { adminNav } from '@/components/layout/navigationConfig';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { mockCourseReviews } from '@/lib/mockAdminData';
import { adminApi } from '@/lib/api';
import { FileCheck, ArrowRight, BookOpen, Clock, Loader2, CheckCircle2 } from 'lucide-react';

export default function CourseReviewDashboardPage() {
  const [reviews, setReviews] = useState(mockCourseReviews);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadReviews() {
      setLoading(true);
      try {
        const res = await adminApi.getCourseReviews();
        if (res.data && Array.isArray(res.data) && res.data.length > 0) {
          const liveList = res.data.map((c) => ({
            id: c.id,
            title: c.title,
            instructor: c.instructor?.profile ? `${c.instructor.profile.firstName} ${c.instructor.profile.lastName || ''}`.trim() : c.instructor?.email || 'Instructor',
            submittedDate: new Date(c.updatedAt).toLocaleDateString(),
            category: c.category || 'General',
            status: c.status,
            totalChapters: c.chapters?.length || 0,
            totalLessons: c.chapters?.reduce((acc, ch) => acc + (ch.lessons?.length || 0), 0) || 0,
          }));
          setReviews(liveList);
        } else if (res.data && Array.isArray(res.data) && res.data.length === 0) {
          setReviews([]);
        }
      } catch (err) {
        // Safe fallback
      } finally {
        setLoading(false);
      }
    }
    loadReviews();
  }, []);

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

        {reviews.length === 0 && !loading && (
          <Card className="p-8 text-center space-y-3">
            <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
            <h3 className="text-base font-bold text-slate-900">Review queue is empty</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              All submitted course curriculums have been reviewed and accredited.
            </p>
          </Card>
        )}

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

