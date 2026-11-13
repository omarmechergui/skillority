'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import DashboardShell from '@/components/layout/DashboardShell';
import { studentNav } from '@/components/layout/navigationConfig';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { mockCourses } from '@/lib/mockLearningData';
import {
  ArrowLeft,
  BookOpen,
  Clock,
  PlayCircle,
  CheckCircle2,
  Lock,
  Coins,
  FileQuestion,
  HelpCircle,
  Video,
  FileText,
  Code
} from 'lucide-react';

export default function ChapterDetailsPage() {
  const params = useParams();
  const courseId = params?.id || 'course-1';
  const chapterId = params?.chapterId || 'chap-0';

  const course = mockCourses.find((c) => c.id === courseId) || mockCourses[0];
  const chapter = course.chapters.find((ch) => ch.id === chapterId) || course.chapters[0];

  const getLessonIcon = (type) => {
    switch (type) {
      case 'video':
        return <Video className="w-4 h-4 text-blue-600" />;
      case 'code':
        return <Code className="w-4 h-4 text-purple-600" />;
      default:
        return <FileText className="w-4 h-4 text-slate-600" />;
    }
  };

  return (
    <DashboardShell role="STUDENT" navItems={studentNav}>
      <div className="space-y-8 max-w-5xl mx-auto">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <Link href="/student/learn" className="hover:text-primary transition-colors">
            Learn
          </Link>
          <span>/</span>
          <Link href={`/student/courses/${course.id}`} className="hover:text-primary transition-colors line-clamp-1 max-w-[200px]">
            {course.title}
          </Link>
          <span>/</span>
          <span className="font-semibold text-slate-900">Chapter {chapter.chapterNumber}</span>
        </div>

        {/* Chapter Header Card */}
        <div className="bg-white p-6 sm:p-8 rounded-xl border border-border shadow-sm space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-primary">
                Chapter {chapter.chapterNumber}
              </span>
              {chapter.isFree ? (
                <Badge variant="outline" className="text-emerald-700 bg-emerald-50 border-emerald-200">
                  Free Chapter
                </Badge>
              ) : (
                <Badge variant="warning" className="text-amber-800 bg-amber-50 border-amber-200">
                  {chapter.coinsCost} Coins
                </Badge>
              )}
            </div>

            <div className="flex items-center gap-3 text-xs text-slate-500">
              <span className="flex items-center gap-1">
                <BookOpen className="w-4 h-4 text-slate-400" /> {chapter.lessons.length} Lessons
              </span>
              <span>·</span>
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4 text-slate-400" /> {chapter.duration}
              </span>
            </div>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {chapter.title}
          </h1>

          <p className="text-sm text-slate-600 leading-relaxed max-w-3xl">
            {chapter.description}
          </p>

          <div className="pt-4 border-t border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs text-slate-600">
              <Coins className="w-4 h-4 text-amber-600" />
              <span>
                Earn <strong>+{chapter.quiz?.rewardCoins || 0} Skillority Coins</strong> upon passing the Chapter Quiz (mock reward).
              </span>
            </div>

            {chapter.lessons.length > 0 && (
              <Link href={`/student/courses/${course.id}/chapters/${chapter.id}/lessons/${chapter.lessons[0].id}`}>
                <Button variant="primary" size="md">
                  <PlayCircle className="w-4 h-4 mr-2" /> Start Chapter Lessons
                </Button>
              </Link>
            )}
          </div>
        </div>

        {/* Lessons List Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900">Chapter Lessons</h2>
            <span className="text-xs text-slate-500">{chapter.lessons.length} lessons in this chapter</span>
          </div>

          <div className="space-y-3">
            {chapter.lessons.map((lesson, idx) => (
              <Card
                key={lesson.id}
                className="p-4 sm:p-5 flex items-center justify-between gap-4 hover:border-blue-200 transition-colors"
              >
                <div className="flex items-start sm:items-center gap-4">
                  <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
                    {getLessonIcon(lesson.type)}
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-slate-400">Lesson {idx + 1}</span>
                      {lesson.completed && (
                        <span className="text-xs font-medium text-emerald-600 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Completed
                        </span>
                      )}
                    </div>
                    <h3 className="text-sm font-bold text-slate-900 hover:text-primary transition-colors">
                      <Link href={`/student/courses/${course.id}/chapters/${chapter.id}/lessons/${lesson.id}`}>
                        {lesson.title}
                      </Link>
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-1">{lesson.summary}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 shrink-0">
                  <span className="text-xs text-slate-400 hidden sm:inline">{lesson.duration}</span>
                  <Link href={`/student/courses/${course.id}/chapters/${chapter.id}/lessons/${lesson.id}`}>
                    <Button variant={lesson.completed ? 'secondary' : 'primary'} size="sm">
                      {lesson.completed ? 'Review' : 'Start'}
                    </Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Chapter Quiz Section */}
        {chapter.quiz && (
          <div className="p-6 bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent rounded-xl border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <FileQuestion className="w-5 h-5 text-amber-600" />
                <span className="text-xs font-bold uppercase tracking-wider text-amber-800">
                  Milestone Knowledge Check
                </span>
              </div>
              <h3 className="text-lg font-bold text-slate-900">{chapter.quiz.title}</h3>
              <p className="text-xs text-slate-600 max-w-xl">
                Test your mastery of Chapter {chapter.chapterNumber}. Passing threshold is {chapter.quiz.passingScore}%. Successful completion awards +{chapter.quiz.rewardCoins} Skillority Coins directly to your balance.
              </p>
            </div>

            <div>
              <Link href={`/student/courses/${course.id}/chapters/${chapter.id}/quiz`}>
                <Button variant="primary" size="md" className="bg-amber-600 hover:bg-amber-700 text-white border-0 shadow-sm">
                  <HelpCircle className="w-4 h-4 mr-2" /> Take Chapter Quiz (+{chapter.quiz.rewardCoins} Coins)
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </DashboardShell>
  );
}

