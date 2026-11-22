'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import DashboardShell from '@/components/layout/DashboardShell';
import { studentNav } from '@/components/layout/navigationConfig';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Modal from '@/components/ui/Modal';
import { coursesApi, learningApi, walletApi } from '@/lib/api';
import { useAuth } from '@/lib/auth';
import {
  BookOpen,
  Clock,
  Star,
  Users,
  CheckCircle2,
  Lock,
  Coins,
  PlayCircle,
  Award,
  ChevronRight,
  ArrowLeft,
  FileText,
  Loader2,
  AlertCircle
} from 'lucide-react';

export default function CourseDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params?.id || '';
  const { user } = useAuth();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [enrollment, setEnrollment] = useState(null);
  const [enrolling, setEnrolling] = useState(false);
  const [studentCoins, setStudentCoins] = useState(0);

  // Modal State for Coins Unlock
  const [isUnlockModalOpen, setIsUnlockModalOpen] = useState(false);
  const [selectedChapterToUnlock, setSelectedChapterToUnlock] = useState(null);
  const [unlocking, setUnlocking] = useState(false);
  const [unlockError, setUnlockError] = useState(null);

  useEffect(() => {
    async function loadCourseData() {
      if (!courseId) return;
      setLoading(true);
      setError(null);
      try {
        const [courseRes, enrollmentsRes, walletRes] = await Promise.allSettled([
          coursesApi.getCourse(courseId),
          user ? learningApi.getMyEnrollments() : Promise.resolve({ data: [] }),
          user ? walletApi.getBalance() : Promise.resolve({ data: { balance: 0 } }),
        ]);

        if (courseRes.status === 'fulfilled' && courseRes.value?.data) {
          const rawCourse = courseRes.value.data;
          setCourse({
            id: rawCourse.id,
            title: rawCourse.title,
            description: rawCourse.description,
            category: rawCourse.category || 'General',
            difficulty: rawCourse.level || 'Intermediate',
            duration: '12 Hours',
            rating: 4.8,
            reviewsCount: 142,
            totalChapters: rawCourse.chapters?.length || 0,
            learningObjectives: rawCourse.tags && rawCourse.tags.length > 0 ? rawCourse.tags : [
              'Understand core architectural patterns and methodologies',
              'Implement hands-on code solutions with industry best practices',
              'Complete chapter knowledge checkpoints and earn completion credit',
            ],
            instructor: {
              name: rawCourse.instructor?.profile ? `${rawCourse.instructor.profile.firstName} ${rawCourse.instructor.profile.lastName || ''}`.trim() : rawCourse.instructor?.email || 'Lead Architect',
              title: rawCourse.instructor?.profile?.experience || 'Verified Industry Educator',
              avatar: rawCourse.instructor?.profile?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
              studentsCount: 2450,
              bio: rawCourse.instructor?.profile?.bio || 'Passionate about engineering excellence and empowering the next generation of engineers.',
            },
            chapters: (rawCourse.chapters || []).map((ch, idx) => ({
              id: ch.id,
              chapterNumber: ch.order !== undefined ? ch.order : idx,
              order: ch.order !== undefined ? ch.order : idx,
              title: ch.title,
              description: `Master technical competencies and practical workflows for ${ch.title}.`,
              isFree: ch.isFree !== undefined ? ch.isFree : (ch.order <= 5),
              coinsCost: ch.coinsCost || (ch.order <= 5 ? 0 : 50),
              lessons: ch.lessons || [],
              duration: `${(ch.lessons?.length || 3) * 15} mins`,
              quiz: ch.quiz || { rewardCoins: 50 },
            })),
            finalAssessment: rawCourse.finalAssessment || {
              title: `${rawCourse.title} Comprehensive Final Assessment`,
            },
          });
        } else {
          setError('Course not found');
        }

        // Set Enrollment
        if (enrollmentsRes.status === 'fulfilled' && enrollmentsRes.value?.data) {
          const enrollmentsList = Array.isArray(enrollmentsRes.value.data) ? enrollmentsRes.value.data : [];
          const current = enrollmentsList.find((e) => e.courseId === courseId);
          if (current) {
            setEnrollment(current);
          }
        }

        // Set Balance
        if (walletRes.status === 'fulfilled' && walletRes.value?.data) {
          setStudentCoins(walletRes.value.data.balance || user?.profile?.coinsBalance || 0);
        } else if (user?.profile?.coinsBalance !== undefined) {
          setStudentCoins(user.profile.coinsBalance);
        }
      } catch (err) {
        setError(err?.message || 'Failed to load course details');
      } finally {
        setLoading(false);
      }
    }

    loadCourseData();
  }, [courseId, user]);

  const handleEnroll = async () => {
    if (!user) {
      router.push('/login');
      return;
    }
    setEnrolling(true);
    try {
      const res = await learningApi.enroll(courseId);
      if (res?.data) {
        setEnrollment(res.data);
      }
    } catch (err) {
      alert(err?.message || 'Failed to enroll in course');
    } finally {
      setEnrolling(false);
    }
  };

  const handleOpenUnlockModal = (chapter) => {
    setSelectedChapterToUnlock(chapter);
    setUnlockError(null);
    setIsUnlockModalOpen(true);
  };

  const handleConfirmUnlock = async () => {
    if (!selectedChapterToUnlock) return;
    setUnlocking(true);
    setUnlockError(null);
    try {
      const res = await learningApi.unlockChapter(courseId, selectedChapterToUnlock.id);
      if (res?.data) {
        setStudentCoins(prev => Math.max(0, prev - selectedChapterToUnlock.coinsCost));
        setEnrollment(prev => ({
          ...prev,
          unlockedChapterIds: [...(prev?.unlockedChapterIds || []), selectedChapterToUnlock.id],
        }));
        setIsUnlockModalOpen(false);
        setSelectedChapterToUnlock(null);
      }
    } catch (err) {
      setUnlockError(err?.message || 'Failed to unlock chapter with coins');
    } finally {
      setUnlocking(false);
    }
  };

  if (loading) {
    return (
      <DashboardShell role="STUDENT" navItems={studentNav}>
        <div className="flex flex-col items-center justify-center min-h-[50vh] gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-xs text-slate-500">Loading course syllabus...</p>
        </div>
      </DashboardShell>
    );
  }

  if (error || !course) {
    return (
      <DashboardShell role="STUDENT" navItems={studentNav}>
        <div className="space-y-6 max-w-7xl mx-auto py-12 text-center">
          <Card className="p-8 text-center space-y-4">
            <h2 className="text-lg font-bold text-slate-900">Course Not Found</h2>
            <p className="text-sm text-slate-500">{error || 'The requested course could not be found.'}</p>
            <Link href="/student/learn">
              <Button variant="outline" className="text-xs">Back to Learning Hub</Button>
            </Link>
          </Card>
        </div>
      </DashboardShell>
    );
  }

  const isEnrolled = Boolean(enrollment);
  const unlockedChapterIds = enrollment?.unlockedChapterIds || [];
  const completedLessonIds = enrollment?.completedLessonIds || [];

  return (
    <DashboardShell role="STUDENT" navItems={studentNav}>
      <div className="space-y-8 max-w-7xl mx-auto">
        {/* Back navigation */}
        <div>
          <Link
            href="/student/learn"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-primary transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Learning Hub
          </Link>
        </div>

        {/* Hero Course Overview */}
        <div className="bg-white rounded-xl border border-border p-6 sm:p-8 shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="primary">{course.category}</Badge>
                <Badge variant="outline">{course.difficulty}</Badge>
                <span className="text-xs text-slate-500 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" /> {course.duration}
                </span>
                <span className="text-xs text-amber-600 font-semibold flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" /> {course.rating} ({course.reviewsCount} reviews)
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                {course.title}
              </h1>

              <p className="text-sm text-slate-600 leading-relaxed">
                {course.description}
              </p>

              {/* Learning Objectives */}
              <div className="pt-4 border-t border-border space-y-2">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">What you will master:</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {course.learningObjectives.map((obj, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-slate-600">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{obj}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Card: Instructor & Enrollment Actions */}
            <div className="flex flex-col justify-between p-6 bg-slate-50 rounded-xl border border-border space-y-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="relative w-12 h-12 rounded-full overflow-hidden border border-slate-200">
                    <Image
                      src={course.instructor.avatar}
                      alt={course.instructor.name}
                      fill
                      sizes="48px"
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">{course.instructor.name}</h4>
                    <p className="text-xs text-slate-500">{course.instructor.title}</p>
                    <p className="text-[11px] text-slate-400">{course.instructor.studentsCount.toLocaleString()} students taught</p>
                  </div>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed italic bg-white p-3 rounded-lg border border-border">
                  &ldquo;{course.instructor.bio}&rdquo;
                </p>
              </div>

              <div className="space-y-3 pt-4 border-t border-slate-200">
                <div className="flex items-center justify-between text-xs text-slate-600 font-medium">
                  <span>Chapters Included:</span>
                  <span className="font-bold text-slate-900">{course.totalChapters} Chapters</span>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-600 font-medium">
                  <span>Free Chapters:</span>
                  <span className="font-bold text-emerald-600">Chapters 0–5 Free</span>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-600 font-medium">
                  <span>Your Balance:</span>
                  <span className="font-bold text-amber-700 flex items-center gap-1">
                    <Coins className="w-3.5 h-3.5" /> {studentCoins} Coins
                  </span>
                </div>

                {isEnrolled && enrollment?.progressPercent !== undefined && (
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs text-slate-600">
                      <span>Progress</span>
                      <span className="font-bold text-primary">{Math.round(enrollment.progressPercent)}%</span>
                    </div>
                    <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-primary h-full transition-all duration-300"
                        style={{ width: `${enrollment.progressPercent}%` }}
                      />
                    </div>
                  </div>
                )}

                <div className="pt-2">
                  {!isEnrolled ? (
                    <Button
                      variant="primary"
                      size="lg"
                      className="w-full"
                      onClick={handleEnroll}
                      disabled={enrolling}
                    >
                      {enrolling ? (
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      ) : (
                        <PlayCircle className="w-5 h-5 mr-2" />
                      )}
                      Enroll in Course (Free)
                    </Button>
                  ) : (
                    <Link href={`/student/courses/${course.id}/chapters/${course.chapters[0]?.id || ''}/lessons/${course.chapters[0]?.lessons[0]?.id || ''}`}>
                      <Button variant="primary" size="lg" className="w-full">
                        <PlayCircle className="w-5 h-5 mr-2" /> Continue Learning
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Syllabus / Chapter Breakdown */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Curriculum Syllabus</h2>
              <p className="text-xs text-slate-500">
                Structured progressively: Complete lessons, pass chapter quizzes, unlock advanced chapters with coins.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-md font-semibold">
                Chapters 0–5 Free
              </span>
              <span className="text-xs px-2.5 py-1 bg-amber-50 text-amber-800 border border-amber-200 rounded-md font-semibold">
                Chapters 6+ Coin Unlocked
              </span>
            </div>
          </div>

          <div className="space-y-3">
            {course.chapters.map((chapter) => {
              const isChapterFree = chapter.order <= 5 || chapter.isFree;
              const isUnlocked = isChapterFree || unlockedChapterIds.includes(chapter.id);
              const chapterLessons = chapter.lessons || [];
              const allLessonsComplete = chapterLessons.length > 0 && chapterLessons.every(l => completedLessonIds.includes(l.id));

              return (
                <div
                  key={chapter.id}
                  className={`p-5 rounded-xl border transition-all ${
                    isUnlocked
                      ? 'bg-white border-border hover:border-blue-200'
                      : 'bg-slate-50/70 border-slate-200'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-primary">
                          Chapter {chapter.chapterNumber}
                        </span>
                        {isChapterFree ? (
                          <Badge variant="outline" className="text-[10px] bg-emerald-50 text-emerald-700 border-emerald-200">
                            Free Chapter
                          </Badge>
                        ) : (
                          <Badge variant="warning" className="text-[10px] bg-amber-50 text-amber-800 border-amber-200">
                            {chapter.coinsCost} Coins Required
                          </Badge>
                        )}
                        {allLessonsComplete && (
                          <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Completed
                          </span>
                        )}
                      </div>

                      <h3 className="text-base font-bold text-slate-900">
                        {chapter.title}
                      </h3>
                      <p className="text-xs text-slate-500 max-w-2xl">
                        {chapter.description}
                      </p>

                      <div className="flex items-center gap-4 text-xs text-slate-500 pt-1">
                        <span className="flex items-center gap-1">
                          <BookOpen className="w-3.5 h-3.5 text-slate-400" /> {chapterLessons.length} Lessons
                        </span>
                        <span>·</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-slate-400" /> {chapter.duration}
                        </span>
                        {chapter.quiz?.rewardCoins > 0 && (
                          <>
                            <span>·</span>
                            <span className="flex items-center gap-1 text-amber-700 font-medium">
                              <Coins className="w-3.5 h-3.5 text-amber-600" /> +{chapter.quiz.rewardCoins} Coins Quiz Reward
                            </span>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {isUnlocked ? (
                        <Link href={`/student/courses/${course.id}/chapters/${chapter.id}/lessons/${chapterLessons[0]?.id || ''}`}>
                          <Button variant="primary" size="sm">
                            View Chapter <ChevronRight className="w-4 h-4 ml-1" />
                          </Button>
                        </Link>
                      ) : (
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => handleOpenUnlockModal(chapter)}
                          className="bg-amber-100 hover:bg-amber-200 text-amber-900 border-amber-300"
                        >
                          <Lock className="w-3.5 h-3.5 mr-1.5 text-amber-700" />
                          Unlock with {chapter.coinsCost} Coins
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Final Assessment Banner */}
        {course.finalAssessment && (
          <div className="p-6 bg-gradient-to-r from-slate-900 to-indigo-950 text-white rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-md">
            <div className="space-y-2 max-w-xl">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-400" />
                <span className="text-xs font-bold uppercase tracking-wider text-amber-300">
                  Course Certification
                </span>
              </div>
              <h3 className="text-xl font-bold">{course.finalAssessment.title}</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Complete all course chapters to qualify for the final assessment. Achieving passing criteria unlocks your course evaluation certificate.
              </p>
            </div>

            <div>
              <Link href={`/student/courses/${course.id}/assessment`}>
                <Button variant="primary" size="md" className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold border-0">
                  <FileText className="w-4 h-4 mr-1.5" /> Open Assessment
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Unlock Confirmation Modal */}
      <Modal
        isOpen={isUnlockModalOpen}
        onClose={() => setIsUnlockModalOpen(false)}
        title="Unlock Advanced Chapter"
      >
        {selectedChapterToUnlock && (
          <div className="space-y-4">
            <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 flex items-center gap-3">
              <div className="p-2.5 bg-amber-100 rounded-lg text-amber-700">
                <Coins className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs text-amber-800 font-medium">Chapter Unlock Cost</p>
                <p className="text-lg font-bold text-amber-950">
                  {selectedChapterToUnlock.coinsCost} Skillority Coins
                </p>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-bold text-slate-900">
                Chapter {selectedChapterToUnlock.chapterNumber}: {selectedChapterToUnlock.title}
              </h4>
              <p className="text-xs text-slate-500 mt-1">
                {selectedChapterToUnlock.description}
              </p>
            </div>

            <div className="pt-2 border-t border-border flex justify-between items-center text-xs text-slate-600">
              <span>Your Current Balance:</span>
              <span className="font-bold text-slate-900">{studentCoins} Coins</span>
            </div>
            <div className="flex justify-between items-center text-xs text-slate-600">
              <span>Balance After Unlock:</span>
              <span className={`font-bold ${studentCoins >= selectedChapterToUnlock.coinsCost ? 'text-emerald-600' : 'text-rose-600'}`}>
                {studentCoins - selectedChapterToUnlock.coinsCost} Coins
              </span>
            </div>

            {unlockError && (
              <div className="p-2.5 bg-rose-50 text-rose-700 rounded-lg border border-rose-200 text-xs">
                {unlockError}
              </div>
            )}

            {studentCoins < selectedChapterToUnlock.coinsCost && (
              <p className="text-xs text-rose-600 bg-rose-50 p-2.5 rounded-lg border border-rose-200">
                Insufficient coins. Complete daily learning missions or chapter quizzes to earn more coins.
              </p>
            )}

            <div className="flex justify-end gap-3 pt-4 border-t border-border">
              <Button variant="outline" size="sm" onClick={() => setIsUnlockModalOpen(false)}>
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                disabled={studentCoins < selectedChapterToUnlock.coinsCost || unlocking}
                onClick={handleConfirmUnlock}
              >
                {unlocking ? <Loader2 className="w-4 h-4 mr-1 animate-spin" /> : null}
                Confirm & Unlock
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </DashboardShell>
  );
}
