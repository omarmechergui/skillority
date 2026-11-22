'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import DashboardShell from '@/components/layout/DashboardShell';
import { studentNav } from '@/components/layout/navigationConfig';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { coursesApi, learningApi } from '@/lib/api';
import { useAuth } from '@/lib/auth';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  PlayCircle,
  FileText,
  Code,
  ListOrdered,
  HelpCircle,
  Loader2,
  AlertCircle
} from 'lucide-react';

export default function StudentLessonViewerPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();

  const courseId = params?.id || '';
  const chapterId = params?.chapterId || '';
  const lessonId = params?.lessonId || '';

  const [course, setCourse] = useState(null);
  const [enrollment, setEnrollment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [completing, setCompleting] = useState(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  useEffect(() => {
    async function loadLessonData() {
      if (!courseId) return;
      setLoading(true);
      setError(null);
      try {
        const [courseRes, enrollmentsRes] = await Promise.allSettled([
          coursesApi.getCourse(courseId, { includeContent: 'true' }),
          user ? learningApi.getMyEnrollments() : Promise.resolve({ data: [] }),
        ]);

        if (courseRes.status === 'fulfilled' && courseRes.value?.data) {
          setCourse(courseRes.value.data);
        } else {
          setError('Course not found');
        }

        if (enrollmentsRes.status === 'fulfilled' && enrollmentsRes.value?.data) {
          const list = Array.isArray(enrollmentsRes.value.data) ? enrollmentsRes.value.data : [];
          const current = list.find((e) => e.courseId === courseId);
          if (current) setEnrollment(current);
        }
      } catch (err) {
        setError(err?.message || 'Failed to load lesson');
      } finally {
        setLoading(false);
      }
    }

    loadLessonData();
  }, [courseId, user]);

  if (loading) {
    return (
      <DashboardShell roleTitle="Student Portal" navItems={studentNav}>
        <div className="flex flex-col items-center justify-center min-h-[50vh] gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-xs text-slate-500">Loading lesson content...</p>
        </div>
      </DashboardShell>
    );
  }

  if (error || !course) {
    return (
      <DashboardShell roleTitle="Student Portal" navItems={studentNav}>
        <div className="space-y-6 max-w-4xl mx-auto py-12 text-center">
          <Card className="p-8 text-center space-y-4">
            <h2 className="text-lg font-bold text-slate-900">Lesson Not Found</h2>
            <p className="text-sm text-slate-500">{error || 'The requested course lesson could not be found.'}</p>
            <Link href="/student/learn">
              <Button variant="outline" className="text-xs">Back to Learning</Button>
            </Link>
          </Card>
        </div>
      </DashboardShell>
    );
  }

  const chapters = course.chapters || [];
  const chapter = chapters.find((ch) => ch.id === chapterId) || chapters[0] || { lessons: [] };
  const chapterLessons = chapter.lessons || [];
  const currentLessonIndex = chapterLessons.findIndex((l) => l.id === lessonId);
  const lesson = currentLessonIndex >= 0 ? chapterLessons[currentLessonIndex] : chapterLessons[0] || {
    id: lessonId,
    title: 'Lesson Overview',
    content: {},
  };

  const prevLesson = currentLessonIndex > 0 ? chapterLessons[currentLessonIndex - 1] : null;
  const nextLesson = currentLessonIndex >= 0 && currentLessonIndex < chapterLessons.length - 1 ? chapterLessons[currentLessonIndex + 1] : null;

  const completedLessonIds = enrollment?.completedLessonIds || [];
  const isCompleted = completedLessonIds.includes(lesson.id);

  const handleMarkComplete = async () => {
    setCompleting(true);
    try {
      if (user && lesson.id) {
        const res = await learningApi.completeLesson(courseId, lesson.id);
        if (res?.data) {
          setEnrollment(res.data);
        }
      }

      if (nextLesson) {
        router.push(`/student/courses/${course.id}/chapters/${chapter.id}/lessons/${nextLesson.id}`);
      } else {
        router.push(`/student/courses/${course.id}/chapters/${chapter.id}/quiz`);
      }
    } catch (err) {
      alert(err?.message || 'Failed to update lesson completion');
    } finally {
      setCompleting(false);
    }
  };

  return (
    <DashboardShell role="STUDENT" navItems={studentNav}>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Top Header / Breadcrumb Bar */}
        <div className="flex items-center justify-between bg-white px-5 py-3.5 rounded-xl border border-border shadow-sm">
          <div className="flex items-center gap-3">
            <Link
              href={`/student/courses/${course.id}`}
              className="text-slate-400 hover:text-slate-700 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold text-primary uppercase tracking-wider">
                  Chapter {chapter.order !== undefined ? chapter.order : 1}
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
              disabled={completing}
              className="text-xs font-semibold"
            >
              {completing ? (
                <Loader2 className="w-4 h-4 mr-1.5 animate-spin" />
              ) : (
                <CheckCircle2 className="w-4 h-4 mr-1.5 text-emerald-600" />
              )}
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
                <p className="text-xs text-slate-400 mt-1">Interactive Lesson Viewer · {lesson?.duration || 15} mins</p>
              </div>

              {/* Lesson Text & Lead Content */}
              <div className="space-y-4 pt-2">
                <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">Overview & Core Principles</h2>
                <p className="text-sm text-slate-700 leading-relaxed">
                  {lesson?.content?.lead || (typeof lesson?.content === 'string' ? lesson.content : 'This lesson provides practical, guided instructions to master the technical skills in this module.')}
                </p>

                {/* Key Takeaways */}
                {lesson?.content?.keyTakeaways && Array.isArray(lesson.content.keyTakeaways) && (
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
                  <p className="text-sm font-bold text-slate-900">Chapter {chapter.order !== undefined ? chapter.order : 1}</p>
                </div>
                <Badge variant="outline" className="text-[10px]">
                  {chapterLessons.length} Lessons
                </Badge>
              </div>

              <div className="space-y-1.5">
                {chapterLessons.map((item, idx) => {
                  const isActive = item.id === lesson?.id;
                  const itemCompleted = completedLessonIds.includes(item.id);
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
                        {itemCompleted && <CheckCircle2 className="w-3 h-3 text-emerald-600" />}
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
                      <span className="text-[10px] font-bold text-amber-700">+50 Coins</span>
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
