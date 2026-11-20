'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import DashboardShell from '@/components/layout/DashboardShell';
import { instructorNav } from '@/components/layout/navigationConfig';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import {
  ArrowLeft,
  Mail,
  Award,
  BookOpen,
  Flame,
  ArrowRight,
  CheckCircle,
} from 'lucide-react';

export default function StudentLearningProgressPage({ params }) {
  const [student] = useState(null);

  if (!student) {
    return (
      <DashboardShell roleTitle="Instructor Portal" navItems={instructorNav}>
        <div className="space-y-6 max-w-4xl mx-auto py-12 text-center">
          <Card className="p-8 text-center space-y-4">
            <h2 className="text-lg font-bold text-slate-900">Student Not Found</h2>
            <p className="text-sm text-slate-500">The requested student learning record could not be found or has not been loaded.</p>
            <Link href="/instructor/students">
              <Button variant="outline" className="text-xs">Back to Students</Button>
            </Link>
          </Card>
        </div>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell roleTitle="Instructor Portal" navItems={instructorNav}>
      <div className="space-y-8 max-w-4xl mx-auto">
        <div className="flex items-center gap-3">
          <Link href="/instructor/students">
            <Button variant="ghost" className="p-2 text-slate-500 hover:text-slate-900">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div>
            <Badge variant="primary" className="text-[10px]">Student Progress Audit</Badge>
            <h1 className="text-2xl font-bold text-slate-900">{student.name}</h1>
          </div>
        </div>

        <Card className="p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center gap-6">
          <div className="relative w-20 h-20 rounded-2xl overflow-hidden border border-border shrink-0">
            <Image
              src={student.avatar}
              alt={student.name}
              fill
              className="object-cover"
              unoptimized
            />
          </div>

          <div className="space-y-1 flex-1">
            <h2 className="text-xl font-bold text-slate-900">{student.name}</h2>
            <p className="text-xs text-slate-500">{student.email}</p>
            <div className="flex flex-wrap gap-4 pt-2 text-xs text-slate-600">
              <span className="flex items-center gap-1 font-semibold text-orange-600">
                <Flame className="w-4 h-4 fill-orange-500" />
                {student.streak}-Day Study Streak
              </span>
              <span className="flex items-center gap-1 font-semibold text-emerald-600">
                <Award className="w-4 h-4" />
                {student.quizScoreAvg} Quiz Average
              </span>
            </div>
          </div>
        </Card>

        {/* Course Progress Breakdown */}
        <div className="space-y-4">
          <h3 className="text-base font-bold text-slate-900">Enrolled Courses & Milestones</h3>
          <Card className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-bold text-sm text-slate-900">Modern Full-Stack Web Development</h4>
                <p className="text-xs text-slate-500">Instructor: Dr. Sarah Jenkins</p>
              </div>
              <Link href={`/instructor/students/${student.id}/courses/course-1`}>
                <Button variant="outline" className="text-xs font-semibold flex items-center gap-1">
                  Drill Down
                  <ArrowRight className="w-3.5 h-3.5" />
                </Button>
              </Link>
            </div>

            <div className="space-y-1.5 pt-2 border-t border-border">
              <div className="flex justify-between text-xs">
                <span className="text-slate-500">Curriculum Completion:</span>
                <span className="font-bold text-slate-900">{student.progressPercentage}%</span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-primary rounded-full" style={{ width: `${student.progressPercentage}%` }} />
              </div>
            </div>
          </Card>
        </div>
      </div>
    </DashboardShell>
  );
}

