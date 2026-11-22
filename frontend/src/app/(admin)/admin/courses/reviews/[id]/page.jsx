'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import DashboardShell from '@/components/layout/DashboardShell';
import { adminNav } from '@/components/layout/navigationConfig';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { coursesApi } from '@/lib/api';
import { ArrowLeft, BookOpen, Layers, Loader2, AlertCircle } from 'lucide-react';

export default function CourseReviewDetailsPage() {
  const params = useParams();
  const courseId = params?.id || '';

  const [review, setReview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadReview() {
      if (!courseId) return;
      setLoading(true);
      setError(null);
      try {
        const res = await coursesApi.getCourse(courseId, { includeContent: 'true' });
        if (res?.data) {
          const raw = res.data;
          setReview({
            id: raw.id,
            title: raw.title,
            category: raw.category || 'General',
            status: raw.status,
            description: raw.description,
            instructor: raw.instructor?.profile ? `${raw.instructor.profile.firstName} ${raw.instructor.profile.lastName || ''}`.trim() : raw.instructor?.email || 'Instructor',
            chapters: (raw.chapters || []).map((ch, idx) => ({
              id: ch.id,
              number: ch.order !== undefined ? ch.order : idx,
              title: ch.title,
              free: ch.isFree !== undefined ? ch.isFree : (ch.order <= 5),
              lessonsCount: ch.lessons?.length || 0,
              lessons: ch.lessons || [],
            })),
          });
        } else {
          setError('Course review not found');
        }
      } catch (err) {
        setError(err?.message || 'Failed to load course review');
      } finally {
        setLoading(false);
      }
    }

    loadReview();
  }, [courseId]);

  if (loading) {
    return (
      <DashboardShell roleTitle="Platform Admin" navItems={adminNav}>
        <div className="flex flex-col items-center justify-center min-h-[50vh] gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-xs text-slate-500">Loading syllabus for accreditation inspection...</p>
        </div>
      </DashboardShell>
    );
  }

  if (error || !review) {
    return (
      <DashboardShell roleTitle="Platform Admin" navItems={adminNav}>
        <div className="space-y-6 max-w-5xl mx-auto py-12 text-center">
          <Card className="p-8 text-center space-y-4">
            <h2 className="text-lg font-bold text-slate-900">Course Review Not Found</h2>
            <p className="text-sm text-slate-500">{error || 'The requested course review could not be found.'}</p>
            <Link href="/admin/courses/reviews">
              <Button variant="outline" className="text-xs">Back to Reviews</Button>
            </Link>
          </Card>
        </div>
      </DashboardShell>
    );
  }

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
              <p className="text-xs text-slate-500">Instructor: <strong>{review.instructor}</strong></p>
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
          <div className="space-y-3">
            {review.chapters.length === 0 ? (
              <p className="text-xs text-slate-500 italic">No chapters in this curriculum.</p>
            ) : (
              review.chapters.map((chap) => (
                <div key={chap.id || chap.number} className="p-4 bg-slate-50 rounded-lg border border-border space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 text-sm">Chapter {chap.number}: {chap.title}</span>
                    <Badge variant={chap.free ? 'outline' : 'warning'} className="text-[10px]">
                      {chap.free ? 'Free Chapter (0–5)' : 'Coin Unlocked (6+)'}
                    </Badge>
                  </div>
                  {chap.lessons && chap.lessons.length > 0 && (
                    <div className="pl-3 border-l-2 border-slate-200 space-y-1">
                      {chap.lessons.map((les) => (
                        <div key={les.id} className="text-slate-600 flex items-center justify-between">
                          <span>{les.title}</span>
                          <span className="text-slate-400 text-[10px]">{les.duration || 15} mins</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </Card>
      </div>
    </DashboardShell>
  );
}
