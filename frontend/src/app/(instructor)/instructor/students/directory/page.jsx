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
  ArrowLeft,
  ArrowRight,
  Eye,
} from 'lucide-react';

export default function InstructorStudentDirectoryPage() {
  const [students] = useState(mockInstructorStudents);
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = students.filter(
    (s) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DashboardShell roleTitle="Instructor Portal" navItems={instructorNav}>
      <div className="space-y-8 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 sm:p-8 rounded-xl border border-border shadow-sm">
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
              Student Directory
            </h1>
            <p className="text-sm text-slate-500 max-w-xl">
              Directory of all students enrolled across your authored courses.
            </p>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search students..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-border bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>
        </div>

        <div className="space-y-3">
          {filtered.map((st) => (
            <Card key={st.id} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="relative w-11 h-11 rounded-full overflow-hidden border border-border shrink-0">
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
                  <p className="text-xs text-slate-500">{st.enrolledCourses.join(', ')}</p>
                  <p className="text-[11px] text-slate-400">Last active {st.lastActive}</p>
                </div>
              </div>

              <div className="flex items-center gap-5 sm:text-right">
                <div>
                  <div className="text-sm font-bold text-slate-900">{st.progressPercentage}% Completed</div>
                  <div className="text-[10px] text-slate-400">{st.completedLessons} of {st.totalLessons} Lessons</div>
                </div>

                <Link href={`/instructor/students/${st.id}`}>
                  <Button variant="outline" className="text-xs font-semibold flex items-center gap-1">
                    <Eye className="w-3.5 h-3.5" />
                    Inspect
                  </Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </DashboardShell>
  );
}

