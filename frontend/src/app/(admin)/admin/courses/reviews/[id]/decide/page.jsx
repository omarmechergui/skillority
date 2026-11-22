'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import DashboardShell from '@/components/layout/DashboardShell';
import { adminNav } from '@/components/layout/navigationConfig';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { adminApi, coursesApi } from '@/lib/api';
import { ArrowLeft, CheckCircle, XCircle, AlertCircle, Loader2 } from 'lucide-react';

export default function CourseApprovalDecisionPage() {
  const router = useRouter();
  const params = useParams();
  const courseId = params?.id || '';

  const [review, setReview] = useState(null);
  const [decisionNotes, setDecisionNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    async function loadCourse() {
      if (!courseId) return;
      setFetching(true);
      try {
        const res = await coursesApi.getCourse(courseId);
        if (res?.data) {
          const raw = res.data;
          setReview({
            id: raw.id,
            title: raw.title,
            instructor: raw.instructor?.profile ? `${raw.instructor.profile.firstName} ${raw.instructor.profile.lastName || ''}`.trim() : raw.instructor?.email || 'Instructor',
            totalChapters: raw.chapters?.length || 0,
            status: raw.status,
          });
        } else {
          setError('Course review not found');
        }
      } catch (err) {
        setError(err?.message || 'Failed to load course review');
      } finally {
        setFetching(false);
      }
    }
    loadCourse();
  }, [courseId]);

  const handleDecision = async (outcome) => {
    setLoading(true);
    setError(null);
    try {
      await adminApi.decideCourseReview(courseId, outcome, decisionNotes.trim() || undefined);
      setSubmitted(outcome);
      setTimeout(() => {
        router.push('/admin/courses/reviews');
      }, 1500);
    } catch (err) {
      setError(err?.message || 'Failed to submit accreditation decision. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <DashboardShell roleTitle="Platform Admin" navItems={adminNav}>
        <div className="flex flex-col items-center justify-center min-h-[50vh] gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-xs text-slate-500">Loading accreditation decision portal...</p>
        </div>
      </DashboardShell>
    );
  }

  if (error && !review) {
    return (
      <DashboardShell roleTitle="Platform Admin" navItems={adminNav}>
        <div className="space-y-6 max-w-3xl mx-auto py-12 text-center">
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
      <div className="space-y-6 max-w-3xl mx-auto">
        <div className="flex items-center gap-3">
          <Link href={`/admin/courses/reviews/${courseId}`}>
            <Button variant="ghost" className="p-2 text-slate-500 hover:text-slate-900" disabled={loading}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div>
            <Badge variant="primary" className="text-[10px]">Accreditation Panel</Badge>
            <h1 className="text-2xl font-bold text-slate-900">Approve / Reject Decision</h1>
          </div>
        </div>

        {error && (
          <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {submitted && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-600" />
            Decision recorded: Course has been marked {submitted}! Redirecting...
          </div>
        )}

        <Card className="p-6 sm:p-8 space-y-4">
          <div className="p-4 bg-slate-50 border border-border rounded-xl space-y-1">
            <h2 className="text-base font-bold text-slate-900">{review.title}</h2>
            <p className="text-xs text-slate-500">Instructor: {review.instructor} · Total Chapters: {review.totalChapters}</p>
          </div>

          <div className="space-y-1.5 pt-2">
            <label className="text-xs font-semibold text-slate-700">Official Decision Comments & Feedback</label>
            <textarea
              rows={4}
              placeholder="Provide constructive feedback or compliance confirmation..."
              value={decisionNotes}
              onChange={(e) => setDecisionNotes(e.target.value)}
              disabled={loading || Boolean(submitted)}
              className="w-full rounded-lg border border-border p-3 text-xs focus:ring-2 focus:ring-primary/20 focus:border-primary resize-y"
            />
          </div>

          <div className="pt-4 border-t border-border flex flex-col sm:flex-row justify-end gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleDecision('REJECTED')}
              disabled={loading || Boolean(submitted)}
              className="text-xs border-rose-300 text-rose-700 hover:bg-rose-50 hover:text-rose-800"
            >
              <XCircle className="w-4 h-4 mr-1 text-rose-600" />
              Reject with Feedback
            </Button>

            <Button
              variant="primary"
              size="sm"
              onClick={() => handleDecision('APPROVED')}
              disabled={loading || Boolean(submitted)}
              className="text-xs bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin mr-1" /> : <CheckCircle className="w-4 h-4 mr-1" />}
              Approve & Authorize Publishing
            </Button>
          </div>
        </Card>
      </div>
    </DashboardShell>
  );
}
