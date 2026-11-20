'use client';

import { useState } from 'react';
import Link from 'next/link';
import DashboardShell from '@/components/layout/DashboardShell';
import { instructorNav } from '@/components/layout/navigationConfig';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import {
  ArrowLeft,
  BookOpen,
  Users,
  Award,
  Layers,
  Edit,
  Send,
  Eye,
  CheckCircle,
} from 'lucide-react';

export default function CourseManagementOverviewPage({ params }) {
  const [course] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmitForReview = () => {
    setSubmitted(true);
  };

  if (!course) {
    return (
      <DashboardShell roleTitle="Instructor Portal" navItems={instructorNav}>
        <div className="space-y-6 max-w-7xl mx-auto py-12 text-center">
          <Card className="p-8 text-center space-y-4">
            <h2 className="text-lg font-bold text-slate-900">Course Not Found</h2>
            <p className="text-sm text-slate-500">The requested course could not be found or has not been loaded.</p>
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
                <Badge variant={submitted ? 'warning' : course.status === 'PUBLISHED' ? 'success' : 'warning'} className="text-[10px]">
                  {submitted ? 'PENDING_ADMIN_REVIEW' : course.status}
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
              disabled={submitted || course.status === 'PUBLISHED'}
              className="text-xs font-semibold flex items-center gap-1.5"
            >
              <Send className="w-4 h-4" />
              {submitted ? 'Submitted to Admin' : 'Submit for Admin Review'}
            </Button>
          </div>
        </div>

        {submitted && (
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
            {course.chapters.map((chap) => (
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
            ))}
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}

