'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import DashboardShell from '@/components/layout/DashboardShell';
import { studentNav } from '@/components/layout/navigationConfig';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { mockCourses } from '@/lib/mockLearningData';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  PlayCircle,
  FileText,
  Code,
  Video,
  ListOrdered,
  BookOpen,
  HelpCircle,
  ChevronRight,
  Menu,
  X
} from 'lucide-react';

export default function StudentLessonViewerPage() {
  const params = useParams();
  const router = useRouter();

  const courseId = params?.id || 'course-1';
  const chapterId = params?.chapterId || 'chap-0';
  const lessonId = params?.lessonId || 'les-0-1';

  const course = mockCourses.find((c) => c.id === courseId) || mockCourses[0];
  const chapter = course.chapters.find((ch) => ch.id === chapterId) || course.chapters[0];
  const currentLessonIndex = chapter.lessons.findIndex((l) => l.id === lessonId);
  const lesson = chapter.lessons[currentLessonIndex] || chapter.lessons[0];

  const prevLesson = currentLessonIndex > 0 ? chapter.lessons[currentLessonIndex - 1] : null;
  const nextLesson = currentLessonIndex < chapter.lessons.length - 1 ? chapter.lessons[currentLessonIndex + 1] : null;

  const [isCompleted, setIsCompleted] = useState(lesson?.completed || false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  const handleMarkComplete = () => {
    setIsCompleted(true);
    if (nextLesson) {
      router.push(`/student/courses/${course.id}/chapters/${chapter.id}/lessons/${nextLesson.id}`);
    } else {
      router.push(`/student/courses/${course.id}/chapters/${chapter.id}/quiz`);
    }
  };

  return (
    <DashboardShell role="STUDENT" navItems={studentNav}>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Top Header / Breadcrumb Bar */}
        <div className="flex items-center justify-between bg-white px-5 py-3.5 rounded-xl border border-border shadow-sm">
          <div className="flex items-center gap-3">
            <Link
              href={`/student/courses/${course.id}/chapters/${chapter.id}`}
              className="text-slate-400 hover:text-slate-700 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold text-primary uppercase tracking-wider">
                  Chapter {chapter.chapterNumber}
                </span>
                <span className="text-slate-300">·</span>
                <span className="text-xs text-slate-500 truncate max-w-[200px] sm:max-w-md">
                  {chapter.title}
                </span>
              </div>
              <h1 className="text-sm sm:text-base font-bold text-slate-900 truncate max-w-sm sm:max-w-xl">
                {lesson?.title}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="lg:hidden text-xs"
              onClick={() => setMobileDrawerOpen(!mobileDrawerOpen)}
            >
              <ListOrdered className="w-4 h-4 mr-1" /> Curriculum
            </Button>

            <Button
              variant={isCompleted ? 'secondary' : 'primary'}
              size="sm"
              onClick={handleMarkComplete}
              className="text-xs font-semibold"
            >
              <CheckCircle2 className="w-4 h-4 mr-1.5 text-emerald-600" />
              {isCompleted ? 'Completed' : 'Mark as Complete'}
            </Button>
          </div>
        </div>

        {/* 2-Column Layout: Lesson Reader Main + Sidebar Curriculum */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
          {/* Main Lesson Body */}
          <div className="lg:col-span-3 space-y-6">
            <Card className="p-6 sm:p-8 space-y-6 bg-white border-border shadow-sm">
              {/* Media Player / Simulated Video Frame */}
              <div className="relative aspect-video w-full bg-slate-900 rounded-xl overflow-hidden flex flex-col items-center justify-center text-white shadow-inner">
                <div className="p-4 bg-primary/20 backdrop-blur-md rounded-full border border-primary/40 text-primary mb-3">
                  <PlayCircle className="w-12 h-12 text-white fill-primary" />
                </div>
                <h3 className="text-base font-bold text-white px-4 text-center">{lesson?.title}</h3>
                <p className="text-xs text-slate-400 mt-1">Interactive Lesson Viewer · {lesson?.duration}</p>
              </div>

              {/* Lesson Text & Lead Content */}
              <div className="space-y-4 pt-2">
                <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">Overview & Core Principles</h2>
                <p className="text-sm text-slate-700 leading-relaxed">
                  {lesson?.content?.lead}
                </p>

                {/* Key Takeaways */}
                {lesson?.content?.keyTakeaways && (
                  <div className="p-4 bg-slate-50 rounded-xl border border-border space-y-2">
                    <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Key Takeaways</h4>
                    <ul className="space-y-1.5 text-xs text-slate-600">
                      {lesson.content.keyTakeaways.map((point, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Code Snippet Viewer */}
                {lesson?.content?.codeSnippet && (
                  <div className="space-y-2 pt-2">
                    <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
                      <span className="flex items-center gap-1.5">
                        <Code className="w-4 h-4 text-primary" /> Reference Implementation
                      </span>
                      <span className="text-[11px] text-slate-400 font-mono">JavaScript / Node.js</span>
                    </div>
                    <pre className="p-4 bg-slate-900 text-slate-100 rounded-xl font-mono text-xs overflow-x-auto leading-relaxed border border-slate-800">
                      <code>{lesson.content.codeSnippet}</code>
                    </pre>
                  </div>
                )}
              </div>

              {/* Bottom Pagination & Navigation */}
              <div className="pt-6 border-t border-border flex items-center justify-between">
                <div>
                  {prevLesson ? (
                    <Link href={`/student/courses/${course.id}/chapters/${chapter.id}/lessons/${prevLesson.id}`}>
                      <Button variant="outline" size="sm" className="text-xs">
                        <ArrowLeft className="w-3.5 h-3.5 mr-1" /> Previous Lesson
                      </Button>
                    </Link>
                  ) : (
                    <span />
                  )}
                </div>

                <div>
                  {nextLesson ? (
                    <Link href={`/student/courses/${course.id}/chapters/${chapter.id}/lessons/${nextLesson.id}`}>
                      <Button variant="primary" size="sm" className="text-xs">
                        Next Lesson <ArrowRight className="w-3.5 h-3.5 ml-1" />
                      </Button>
                    </Link>
                  ) : (
                    <Link href={`/student/courses/${course.id}/chapters/${chapter.id}/quiz`}>
                      <Button variant="primary" size="sm" className="text-xs bg-amber-600 hover:bg-amber-700 text-white">
                        <HelpCircle className="w-3.5 h-3.5 mr-1" /> Take Chapter Quiz
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            </Card>
          </div>

          {/* Sidebar Drawer: Chapter Curriculum */}
          <div className={`lg:col-span-1 lg:block ${mobileDrawerOpen ? 'block' : 'hidden lg:block'}`}>
            <Card className="p-4 space-y-4 bg-white border-border shadow-sm sticky top-24">
              <div className="flex items-center justify-between pb-2 border-b border-border">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">Curriculum</h3>
                  <p className="text-sm font-bold text-slate-900">Chapter {chapter.chapterNumber}</p>
                </div>
                <Badge variant="outline" className="text-[10px]">
                  {chapter.lessons.length} Lessons
                </Badge>
              </div>

              <div className="space-y-1.5">
                {chapter.lessons.map((item, idx) => {
                  const isActive = item.id === lesson?.id;
                  return (
                    <Link
                      key={item.id}
                      href={`/student/courses/${course.id}/chapters/${chapter.id}/lessons/${item.id}`}
                      className={`block p-2.5 rounded-lg text-xs transition-colors ${
                        isActive
                          ? 'bg-blue-50 text-primary font-bold border border-blue-200'
                          : 'text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] text-slate-400">Lesson {idx + 1}</span>
                        {item.completed && <CheckCircle2 className="w-3 h-3 text-emerald-600" />}
                      </div>
                      <p className="line-clamp-2 leading-tight">{item.title}</p>
                    </Link>
                  );
                })}

                {/* Quiz link in curriculum */}
                {chapter.quiz && (
                  <div className="pt-2 border-t border-border mt-3">
                    <Link
                      href={`/student/courses/${course.id}/chapters/${chapter.id}/quiz`}
                      className="flex items-center justify-between p-2.5 rounded-lg text-xs bg-amber-50 text-amber-900 border border-amber-200 font-semibold hover:bg-amber-100 transition-colors"
                    >
                      <span className="flex items-center gap-1.5">
                        <HelpCircle className="w-3.5 h-3.5 text-amber-600" /> Chapter Quiz
                      </span>
                      {chapter.quiz.rewardCoins > 0 && (
                        <span className="text-[10px] font-bold text-amber-700">+{chapter.quiz.rewardCoins} Coins</span>
                      )}
                    </Link>
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}

