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
  Plus,
  Layers,
  FileText,
  HelpCircle,
  Award,
  Edit,
  Eye,
  Lock,
  Unlock,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

export default function CourseCurriculumBuilderPage({ params }) {
  const [course] = useState(null);
  const [chapters, setChapters] = useState([]);

  if (!course) {
    return (
      <DashboardShell roleTitle="Instructor Portal" navItems={instructorNav}>
        <div className="space-y-6 max-w-5xl mx-auto py-12 text-center">
          <Card className="p-8 text-center space-y-4">
            <h2 className="text-lg font-bold text-slate-900">Curriculum Not Found</h2>
            <p className="text-sm text-slate-500">The requested course curriculum could not be found or has not been loaded.</p>
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
            <Link href={`/instructor/courses/${params.id}`}>
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
            <Link href={`/instructor/courses/${params.id}/assessment/edit`}>
              <Button variant="outline" className="text-xs font-semibold flex items-center gap-1.5">
                <Award className="w-4 h-4 text-purple-600" />
                Final Course Assessment
              </Button>
            </Link>
            <Button className="text-xs font-semibold flex items-center gap-1.5">
              <Plus className="w-4 h-4" />
              Add Chapter
            </Button>
          </div>
        </div>

        {/* Course Architecture Banner Note */}
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-900 space-y-1">
          <p className="font-bold">Architectural Hierarchy: Course → Chapters → Lessons → Chapter Quiz</p>
          <p className="text-blue-700">
            Chapters 0 through 5 are free for all enrolled students. Chapter 6+ unlock with Skillority Coins (250 coins for Ch.6, 300 coins for Ch.7).
          </p>
        </div>

        {/* Chapter List */}
        <div className="space-y-6">
          {chapters.map((chap) => (
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
                  <Link href={`/instructor/courses/${params.id}/lessons/create`}>
                    <Button variant="outline" className="text-xs font-semibold flex items-center gap-1">
                      <Plus className="w-3.5 h-3.5" />
                      Add Lesson
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Lessons within Chapter */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Lessons ({chap.lessons.length})</h4>
                {chap.lessons.map((les) => (
                  <div key={les.id} className="p-3 bg-slate-50 rounded-lg border border-border flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2.5">
                      <FileText className="w-4 h-4 text-slate-400" />
                      <span className="font-semibold text-slate-900">{les.title}</span>
                      <span className="text-slate-400 text-[11px]">({les.duration})</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Link href={`/instructor/courses/${params.id}/lessons/${les.id}/edit`}>
                        <Button variant="ghost" className="text-xs py-1 h-auto text-primary">
                          Hybrid Builder
                        </Button>
                      </Link>
                      <Link href={`/instructor/courses/${params.id}/lessons/${les.id}/preview`}>
                        <Button variant="ghost" className="text-xs py-1 h-auto text-slate-500">
                          Preview
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}

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
          ))}
        </div>
      </div>
    </DashboardShell>
  );
}

