'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import DashboardShell from '@/components/layout/DashboardShell';
import { instructorNav } from '@/components/layout/navigationConfig';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { coursesApi } from '@/lib/api';
import {
  ArrowLeft,
  BookOpen,
  Users,
  Layers,
  Send,
  CheckCircle,
  Loader2,
  AlertCircle
} from 'lucide-react';

export default function CourseManagementOverviewPage() {
  const params = useParams();
  const courseId = params?.id || '';

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadCourse() {
      if (!courseId) return;
      setLoading(true);
      setError(null);
      try {
        const res = await coursesApi.getCourse(courseId);
        if (res?.data) {
          const raw = res.data;
          setCourse({
            id: raw.id,
            title: raw.title,
            description: raw.description,
            category: raw.category || 'General',
            level: raw.level || 'Intermediate',
            status: raw.status || 'DRAFT',
            totalChapters: raw.chapters?.length || 0,
            totalLessons: raw.chapters?.reduce((acc, ch) => acc + (ch.lessons?.length || 0), 0) || 0,
            enrolledStudents: raw._count?.enrollments || 0,
            completionRate: '0%',
            chapters: (raw.chapters || []).map((ch, idx) => ({
              id: ch.id,
              chapterNumber: ch.order !== undefined ? ch.order : idx,
              title: ch.title,
              isFree: ch.isFree !== undefined ? ch.isFree : (ch.order <= 5),
              coinCost: ch.coinsCost || (ch.order <= 5 ? 0 : 50),
              lessonsCount: ch.lessons?.length || 0,
            })),
          });
          if (raw.status === 'PENDING_REVIEW') {
            setSubmitted(true);
          }
        } else {
          setError('Course not found');
        }
      } catch (err) {
        setError(err?.message || 'Failed to load course details');
      } finally {
        setLoading(false);
      }
    }

    loadCourse();
  }, [courseId]);

  const handleSubmitForReview = async () => {
    if (!courseId) return;
    setSubmitting(true);
    setError(null);
    try {
      const res = await coursesApi.submitForReview(courseId);
      if (res?.data) {
        setSubmitted(true);
        setCourse((prev) => prev ? { ...prev, status: 'PENDING_REVIEW' } : null);
      }
    } catch (err) {
      setError(err?.message || 'Failed to submit course for review. Ensure course has at least one chapter.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <DashboardShell roleTitle="Instructor Portal" navItems={instructorNav}>
        <div className="flex flex-col items-center justify-center min-h-[50vh] gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-xs text-slate-500">Loading course overview...</p>
        </div>
      </DashboardShell>
    );
  }

  if (error && !course) {
    return (
      <DashboardShell roleTitle="Instructor Portal" navItems={instructorNav}>
        <div className="space-y-6 max-w-7xl mx-auto py-12 text-center">
          <Card className="p-8 text-center space-y-4">
            <h2 className="text-lg font-bold text-slate-900">Course Not Found</h2>
            <p className="text-sm text-slate-500">{error || 'The requested course could not be found.'}</p>
            <Link href="/instructor/courses">
              <Button variant="outline" className="text-xs">Back to Courses</Button>
            </Link>
          </Card>
        </div>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell roleTitle="Instructor Portal" navItems={instructorNav}>
      <div className="space-y-8 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link href="/instructor/courses">
              <Button variant="ghost" className="p-2 text-slate-500 hover:text-slate-900">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <Badge variant="primary" className="text-[10px]">{course.level}</Badge>
                <Badge variant={submitted || course.status === 'PENDING_REVIEW' ? 'warning' : course.status === 'PUBLISHED' ? 'success' : 'outline'} className="text-[10px]">
                  {submitted ? 'PENDING_REVIEW' : course.status}
                </Badge>
              </div>
              <h1 className="text-2xl font-bold text-slate-900">{course.title}</h1>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <Link href={`/instructor/courses/${course.id}/curriculum`}>
              <Button variant="outline" className="text-xs font-semibold flex items-center gap-1.5">
                <Layers className="w-4 h-4" />
                Curriculum Builder
              </Button>
            </Link>
            <Button
              onClick={handleSubmitForReview}
              disabled={submitting || submitted || course.status === 'PUBLISHED' || course.status === 'PENDING_REVIEW'}
              className="text-xs font-semibold flex items-center gap-1.5"
            >
              {submitting ? (
                <Loader2 className="w-4 h-4 animate-spin mr-1" />
              ) : (
                <Send className="w-4 h-4" />
              )}
              {submitted || course.status === 'PENDING_REVIEW' ? 'Submitted to Admin' : 'Submit for Admin Review'}
            </Button>
          </div>
        </div>

        {error && (
          <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {(submitted || course.status === 'PENDING_REVIEW') && (
          <div className="p-4 bg-amber-50 border border-amber-200 text-amber-800 rounded-xl text-xs font-semibold flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-amber-600" />
            Course submitted to Admin review queue! Published upon administrator approval.
          </div>
        )}

        {/* Course Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="p-5">
            <p className="text-xs text-slate-500 font-medium uppercase">Total Chapters</p>
            <p className="text-xl font-bold text-slate-900">{course.totalChapters} Chapters</p>
            <p className="text-[10px] text-slate-400">Chapters 0–5 Free</p>
          </Card>
          <Card className="p-5">
            <p className="text-xs text-slate-500 font-medium uppercase">Total Lessons</p>
            <p className="text-xl font-bold text-slate-900">{course.totalLessons} Lessons</p>
          </Card>
          <Card className="p-5">
            <p className="text-xs text-slate-500 font-medium uppercase">Active Students</p>
            <p className="text-xl font-bold text-blue-600">{course.enrolledStudents}</p>
          </Card>
          <Card className="p-5">
            <p className="text-xs text-slate-500 font-medium uppercase">Completion Rate</p>
            <p className="text-xl font-bold text-emerald-600">{course.completionRate}</p>
          </Card>
        </div>

        {/* Chapters Overview List */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-slate-900">Curriculum Chapter Structure</h2>
          <div className="space-y-3">
            {course.chapters.length === 0 ? (
              <Card className="p-8 text-center space-y-3">
                <BookOpen className="w-8 h-8 text-slate-300 mx-auto" />
                <p className="text-xs text-slate-500">No chapters added yet. Use Curriculum Builder to add chapters and lessons.</p>
                <Link href={`/instructor/courses/${course.id}/curriculum`}>
                  <Button size="sm" className="text-xs">Open Curriculum Builder</Button>
                </Link>
              </Card>
            ) : (
              course.chapters.map((chap) => (
                <Card key={chap.id} className="p-5 flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-500">Chapter {chap.chapterNumber}</span>
                      <Badge variant={chap.isFree ? 'outline' : 'warning'} className="text-[10px]">
                        {chap.isFree ? 'Free (Chapters 0–5)' : `${chap.coinCost} Coins (Chapter 6+)`}
                      </Badge>
                    </div>
                    <h4 className="font-bold text-sm text-slate-900">{chap.title}</h4>
                    <p className="text-xs text-slate-500">{chap.lessonsCount} Lessons · Chapter Quiz included</p>
                  </div>

                  <Link href={`/instructor/courses/${course.id}/curriculum`}>
                    <Button variant="outline" className="text-xs font-semibold">
                      Edit Chapter
                    </Button>
                  </Link>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
