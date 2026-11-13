'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import DashboardShell from '@/components/layout/DashboardShell';
import { studentNav } from '@/components/layout/navigationConfig';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Modal from '@/components/ui/Modal';
import { mockCourses, mockStudentProfile } from '@/lib/mockLearningData';
import {
  BookOpen,
  Clock,
  Star,
  Users,
  CheckCircle2,
  Lock,
  Unlock,
  Coins,
  PlayCircle,
  HelpCircle,
  Award,
  ChevronRight,
  ArrowLeft,
  FileText
} from 'lucide-react';

export default function CourseDetailsPage() {
  const params = useParams();
  const courseId = params?.id || 'course-1';
  const course = mockCourses.find((c) => c.id === courseId) || mockCourses[0];

  const [studentCoins, setStudentCoins] = useState(mockStudentProfile.coinsBalance);
  const [unlockedChapters, setUnlockedChapters] = useState(
    course.chapters.reduce((acc, chap) => {
      acc[chap.id] = chap.isUnlocked;
      return acc;
    }, {})
  );

  // Modal State for Coins Unlock
  const [isUnlockModalOpen, setIsUnlockModalOpen] = useState(false);
  const [selectedChapterToUnlock, setSelectedChapterToUnlock] = useState(null);

  const handleOpenUnlockModal = (chapter) => {
    setSelectedChapterToUnlock(chapter);
    setIsUnlockModalOpen(true);
  };

  const handleConfirmUnlock = () => {
    if (!selectedChapterToUnlock) return;
    if (studentCoins >= selectedChapterToUnlock.coinsCost) {
      setStudentCoins((prev) => prev - selectedChapterToUnlock.coinsCost);
      setUnlockedChapters((prev) => ({
        ...prev,
        [selectedChapterToUnlock.id]: true,
      }));
      setIsUnlockModalOpen(false);
      setSelectedChapterToUnlock(null);
    }
  };

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

                <div className="pt-2">
                  <Link href={`/student/courses/${course.id}/chapters/${course.chapters[0]?.id || 'chap-0'}`}>
                    <Button variant="primary" size="lg" className="w-full">
                      <PlayCircle className="w-5 h-5 mr-2" /> Start / Continue Course
                    </Button>
                  </Link>
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
              const isUnlocked = unlockedChapters[chapter.id];

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
                        {chapter.isFree ? (
                          <Badge variant="outline" className="text-[10px] bg-emerald-50 text-emerald-700 border-emerald-200">
                            Free Chapter
                          </Badge>
                        ) : (
                          <Badge variant="warning" className="text-[10px] bg-amber-50 text-amber-800 border-amber-200">
                            {chapter.coinsCost} Coins Required
                          </Badge>
                        )}
                        {chapter.completed && (
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
                          <BookOpen className="w-3.5 h-3.5 text-slate-400" /> {chapter.lessons.length} Lessons
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
                        <Link href={`/student/courses/${course.id}/chapters/${chapter.id}`}>
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
                disabled={studentCoins < selectedChapterToUnlock.coinsCost}
                onClick={handleConfirmUnlock}
              >
                Confirm & Unlock
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </DashboardShell>
  );
}

