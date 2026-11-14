'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import DashboardShell from '@/components/layout/DashboardShell';
import { instructorNav } from '@/components/layout/navigationConfig';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { mockInstructorStudents } from '@/lib/mockInstructorData';
import {
  Users,
  Search,
  Filter,
  Eye,
  Award,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';

export default function InstructorStudentManagementPage() {
  const [students] = useState(mockInstructorStudents);

  return (
    <DashboardShell roleTitle="Instructor Portal" navItems={instructorNav}>
      <div className="space-y-8 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 sm:p-8 rounded-xl border border-border shadow-sm">
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
              Student Management Dashboard
            </h1>
            <p className="text-sm text-slate-500 max-w-xl">
              Monitor active enrollments, course progression percentages, and quiz performance.
            </p>
          </div>

          <Link href="/instructor/students/directory">
            <Button className="text-xs font-semibold flex items-center gap-1.5">
              <Users className="w-4 h-4" />
              Full Student Directory
            </Button>
          </Link>
        </div>

        {/* Student Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {students.map((st) => (
            <Card key={st.id} className="p-5 space-y-4">
              <div className="flex items-center gap-3">
                <div className="relative w-12 h-12 rounded-xl overflow-hidden border border-border">
                  <Image
                    src={st.avatar}
                    alt={st.name}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900">{st.name}</h3>
                  <p className="text-[11px] text-slate-500">{st.email}</p>
                </div>
              </div>

              <div className="space-y-1.5 pt-2 border-t border-border">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">Progress:</span>
                  <span className="font-bold text-slate-900">{st.progressPercentage}%</span>
                </div>
                <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full" style={{ width: `${st.progressPercentage}%` }} />
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                <span>Quiz Avg: <strong className="text-emerald-600">{st.quizScoreAvg}</strong></span>
                <span>Streak: <strong className="text-orange-600">{st.streak}d</strong></span>
              </div>

              <Link href={`/instructor/students/${st.id}`}>
                <Button variant="outline" className="w-full text-xs font-semibold flex items-center justify-center gap-1">
                  View Student Profile
                  <ArrowRight className="w-3.5 h-3.5" />
                </Button>
              </Link>
            </Card>
          ))}
        </div>
      </div>
    </DashboardShell>
  );
}

