'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import DashboardShell from '@/components/layout/DashboardShell';
import { instructorNav } from '@/components/layout/navigationConfig';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Input from '@/components/ui/Input';
import Modal from '@/components/ui/Modal';
import { coursesApi } from '@/lib/api';
import {
  ArrowLeft,
  Plus,
  Layers,
  FileText,
  HelpCircle,
  Award,
  Loader2,
  AlertCircle,
  CheckCircle,
} from 'lucide-react';

export default function CourseCurriculumBuilderPage() {
  const params = useParams();
  const courseId = params?.id || '';

  const [course, setCourse] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Add Chapter Modal state
  const [showAddChapterModal, setShowAddChapterModal] = useState(false);
  const [newChapterTitle, setNewChapterTitle] = useState('');
  const [addingChapter, setAddingChapter] = useState(false);

  // Add Lesson Modal state
  const [selectedChapterForLesson, setSelectedChapterForLesson] = useState(null);
  const [newLessonTitle, setNewLessonTitle] = useState('');
  const [newLessonDuration, setNewLessonDuration] = useState(15);
  const [addingLesson, setAddingLesson] = useState(false);

  async function loadCourseCurriculum() {
    if (!courseId) return;
    setLoading(true);
    setError(null);
    try {
      const res = await coursesApi.getCourse(courseId, { includeContent: 'true' });
      if (res?.data) {
        setCourse(res.data);
        const rawChapters = res.data.chapters || [];
        setChapters(rawChapters.map((ch, idx) => ({
          id: ch.id,
          chapterNumber: ch.order !== undefined ? ch.order : idx,
          order: ch.order !== undefined ? ch.order : idx,
          title: ch.title,
          isFree: ch.isFree !== undefined ? ch.isFree : (ch.order <= 5),
          coinCost: ch.coinsCost || (ch.order <= 5 ? 0 : 50),
          lessons: ch.lessons || [],
        })));
      } else {
        setError('Course not found');
      }
    } catch (err) {
      setError(err?.message || 'Failed to load curriculum');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCourseCurriculum();
  }, [courseId]);

  const handleCreateChapter = async (e) => {
    e.preventDefault();
    if (!newChapterTitle.trim()) return;
    setAddingChapter(true);
    try {
      const nextOrder = chapters.length;
      const isFree = nextOrder <= 5;
      const coinsCost = isFree ? 0 : 50;

      const res = await coursesApi.addChapter(courseId, {
        title: newChapterTitle.trim(),
        order: nextOrder,
        isFree,
        coinsCost,
      });

      if (res?.data) {
        setChapters((prev) => [
          ...prev,
          {
            id: res.data.id,
            chapterNumber: res.data.order,
            order: res.data.order,
            title: res.data.title,
            isFree: res.data.isFree,
            coinCost: res.data.coinsCost,
            lessons: [],
          },
        ]);
        setNewChapterTitle('');
        setShowAddChapterModal(false);
      }
    } catch (err) {
      alert(err?.message || 'Failed to add chapter');
    } finally {
      setAddingChapter(false);
    }
  };

  const handleCreateLesson = async (e) => {
    e.preventDefault();
    if (!selectedChapterForLesson || !newLessonTitle.trim()) return;
    setAddingLesson(true);
    try {
      const targetChapter = chapters.find((ch) => ch.id === selectedChapterForLesson.id);
      const nextLessonOrder = targetChapter?.lessons?.length || 0;

      const res = await coursesApi.addLesson(selectedChapterForLesson.id, {
        title: newLessonTitle.trim(),
        order: nextLessonOrder,
        duration: Number(newLessonDuration) || 15,
        content: {
          lead: 'Overview and conceptual walkthrough of the topic.',
          keyTakeaways: ['Core concept review', 'Implementation standard'],
        },
      });

      if (res?.data) {
        setChapters((prev) =>
          prev.map((ch) =>
            ch.id === selectedChapterForLesson.id
              ? { ...ch, lessons: [...ch.lessons, res.data] }
              : ch
          )
        );
        setNewLessonTitle('');
        setSelectedChapterForLesson(null);
      }
    } catch (err) {
      alert(err?.message || 'Failed to add lesson');
    } finally {
      setAddingLesson(false);
    }
  };

  if (loading) {
    return (
      <DashboardShell roleTitle="Instructor Portal" navItems={instructorNav}>
        <div className="flex flex-col items-center justify-center min-h-[50vh] gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-xs text-slate-500">Loading curriculum builder...</p>
        </div>
      </DashboardShell>
    );
  }

  if (error || !course) {
    return (
      <DashboardShell roleTitle="Instructor Portal" navItems={instructorNav}>
        <div className="space-y-6 max-w-5xl mx-auto py-12 text-center">
          <Card className="p-8 text-center space-y-4">
            <h2 className="text-lg font-bold text-slate-900">Curriculum Not Found</h2>
            <p className="text-sm text-slate-500">{error || 'The requested course curriculum could not be found.'}</p>
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
      <div className="space-y-8 max-w-5xl mx-auto">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link href={`/instructor/courses/${courseId}`}>
              <Button variant="ghost" className="p-2 text-slate-500 hover:text-slate-900">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <Badge variant="primary" className="text-[10px]">Curriculum Architecture</Badge>
                <span className="text-xs text-slate-500 font-medium">{course.title}</span>
              </div>
              <h1 className="text-2xl font-bold text-slate-900">Course Curriculum Builder</h1>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <Link href={`/instructor/courses/${courseId}/assessment/edit`}>
              <Button variant="outline" className="text-xs font-semibold flex items-center gap-1.5">
                <Award className="w-4 h-4 text-purple-600" />
                Final Course Assessment
              </Button>
            </Link>
            <Button
              onClick={() => setShowAddChapterModal(true)}
              className="text-xs font-semibold flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              Add Chapter
            </Button>
          </div>
        </div>

        {/* Course Architecture Banner Note */}
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-900 space-y-1">
          <p className="font-bold">Architectural Hierarchy: Course → Chapters → Lessons → Chapter Quiz</p>
          <p className="text-blue-700">
            Chapters 0 through 5 are free for all enrolled students. Chapter 6+ unlock with Skillority Coins.
          </p>
        </div>

        {/* Chapter List */}
        <div className="space-y-6">
          {chapters.length === 0 ? (
            <Card className="p-8 text-center space-y-3">
              <Layers className="w-10 h-10 text-slate-300 mx-auto" />
              <h3 className="text-base font-bold text-slate-900">No chapters added yet</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Every course requires at least one chapter before submitting for Admin accreditation review.
              </p>
              <Button
                size="sm"
                className="text-xs"
                onClick={() => setShowAddChapterModal(true)}
              >
                Add Chapter 0 (Orientation)
              </Button>
            </Card>
          ) : (
            chapters.map((chap) => (
              <Card key={chap.id} className="p-6 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold uppercase text-primary">Chapter {chap.chapterNumber}</span>
                      <Badge variant={chap.isFree ? 'outline' : 'warning'} className="text-[10px]">
                        {chap.isFree ? 'Free (Ch 0–5)' : `${chap.coinCost} Coins (Ch 6+)`}
                      </Badge>
                    </div>
                    <h3 className="font-bold text-base text-slate-900">{chap.title}</h3>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      className="text-xs font-semibold flex items-center gap-1"
                      onClick={() => setSelectedChapterForLesson(chap)}
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Add Lesson
                    </Button>
                  </div>
                </div>

                {/* Lessons within Chapter */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Lessons ({chap.lessons.length})</h4>
                  {chap.lessons.length === 0 ? (
                    <p className="text-xs text-slate-400 italic py-2">No lessons added to this chapter yet. Click &quot;Add Lesson&quot; above.</p>
                  ) : (
                    chap.lessons.map((les) => (
                      <div key={les.id} className="p-3 bg-slate-50 rounded-lg border border-border flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2.5">
                          <FileText className="w-4 h-4 text-slate-400" />
                          <span className="font-semibold text-slate-900">{les.title}</span>
                          <span className="text-slate-400 text-[11px]">({les.duration || 15} mins)</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <Link href={`/instructor/courses/${courseId}/lessons/${les.id}/edit`}>
                            <Button variant="ghost" className="text-xs py-1 h-auto text-primary font-medium">
                              Hybrid Builder
                            </Button>
                          </Link>
                        </div>
                      </div>
                    ))
                  )}

                  {/* Chapter Quiz Item */}
                  <div className="p-3 bg-purple-50/70 rounded-lg border border-purple-200 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2.5 text-purple-900 font-bold">
                      <HelpCircle className="w-4 h-4 text-purple-600" />
                      Chapter {chap.chapterNumber} Knowledge Quiz (50 Coins Reward)
                    </div>
                    <Badge variant="outline" className="text-[10px]">Quiz Active</Badge>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>

      {/* Add Chapter Modal */}
      <Modal
        isOpen={showAddChapterModal}
        onClose={() => setShowAddChapterModal(false)}
        title={`Add Chapter ${chapters.length}`}
      >
        <form onSubmit={handleCreateChapter} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700">Chapter Title</label>
            <Input
              placeholder="e.g. Fundamental Concepts and Runtime Architecture"
              value={newChapterTitle}
              onChange={(e) => setNewChapterTitle(e.target.value)}
              required
              disabled={addingChapter}
            />
          </div>

          <div className="p-3 bg-slate-50 rounded-lg border border-border text-xs text-slate-600 space-y-1">
            <p className="font-medium">
              Chapter Position: <span className="font-bold text-slate-900">Chapter {chapters.length}</span>
            </p>
            <p>
              Access Tier:{' '}
              {chapters.length <= 5 ? (
                <span className="text-emerald-700 font-bold">Free Access (Freemium Chapter 0–5)</span>
              ) : (
                <span className="text-amber-800 font-bold">Coin Unlock Required (50 Coins)</span>
              )}
            </p>
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-border">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setShowAddChapterModal(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              disabled={addingChapter || !newChapterTitle.trim()}
            >
              {addingChapter ? <Loader2 className="w-4 h-4 animate-spin mr-1" /> : null}
              Create Chapter
            </Button>
          </div>
        </form>
      </Modal>

      {/* Add Lesson Modal */}
      <Modal
        isOpen={Boolean(selectedChapterForLesson)}
        onClose={() => setSelectedChapterForLesson(null)}
        title={selectedChapterForLesson ? `Add Lesson to Chapter ${selectedChapterForLesson.chapterNumber}` : 'Add Lesson'}
      >
        <form onSubmit={handleCreateLesson} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700">Lesson Title</label>
            <Input
              placeholder="e.g. Architecture Overview & Component Tree"
              value={newLessonTitle}
              onChange={(e) => setNewLessonTitle(e.target.value)}
              required
              disabled={addingLesson}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700">Estimated Duration (minutes)</label>
            <Input
              type="number"
              min="1"
              max="180"
              value={newLessonDuration}
              onChange={(e) => setNewLessonDuration(e.target.value)}
              required
              disabled={addingLesson}
            />
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-border">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setSelectedChapterForLesson(null)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              disabled={addingLesson || !newLessonTitle.trim()}
            >
              {addingLesson ? <Loader2 className="w-4 h-4 animate-spin mr-1" /> : null}
              Create Lesson
            </Button>
          </div>
        </form>
      </Modal>
    </DashboardShell>
  );
}
