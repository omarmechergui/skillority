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
  mockInstructorProfile,
  mockInstructorCourses,
  mockInstructorStudents,
} from '@/lib/mockInstructorData';
import {
  BookOpen,
  Users,
  Award,
  Star,
  Plus,
  ArrowRight,
  TrendingUp,
  GraduationCap,
} from 'lucide-react';

export default function InstructorDashboardPage() {
  const [profile] = useState(mockInstructorProfile);
  const courses = mockInstructorCourses;
  const recentStudents = mockInstructorStudents;

  return (
    <DashboardShell roleTitle="Instructor Portal" navItems={instructorNav}>
      <div className="space-y-8 max-w-7xl mx-auto">
        {/* Welcome Banner */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 sm:p-8 rounded-xl border border-border shadow-sm">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-primary">Instructor Workspace</span>
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
              Welcome back, {profile.name}
            </h1>
            <p className="text-sm text-slate-500 max-w-xl">
              Track student enrollment velocity, manage your course curriculums, and review quiz submissions.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/instructor/courses/create">
              <Button className="text-xs font-semibold flex items-center gap-1.5">
                <Plus className="w-4 h-4" />
                Create New Course
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="p-5 flex items-center gap-4">
            <div className="p-3 bg-blue-50 text-primary rounded-xl">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Total Enrolled</p>
              <p className="text-2xl font-extrabold text-slate-900">{profile.stats.totalStudents}</p>
            </div>
          </Card>

          <Card className="p-5 flex items-center gap-4">
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Active Courses</p>
              <p className="text-2xl font-extrabold text-slate-900">{profile.stats.activeCourses}</p>
            </div>
          </Card>

          <Card className="p-5 flex items-center gap-4">
            <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
              <Star className="w-6 h-6 fill-amber-500" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Average Rating</p>
              <p className="text-2xl font-extrabold text-slate-900">{profile.stats.averageRating} ★</p>
            </div>
          </Card>

          <Card className="p-5 flex items-center gap-4">
            <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Completion Rate</p>
              <p className="text-2xl font-extrabold text-slate-900">{profile.stats.completionRate}</p>
            </div>
          </Card>
        </div>

        {/* Two-Column Grid: Courses & Students */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900">My Author Courses</h2>
              <Link href="/instructor/courses">
                <Button variant="ghost" className="text-xs text-primary font-semibold">
                  View All
                </Button>
              </Link>
            </div>

            <div className="space-y-3">
              {courses.map((course) => (
                <Card key={course.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:shadow-sm transition-shadow">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Badge variant="primary" className="text-[10px]">{course.level}</Badge>
                      <Badge variant={course.status === 'PUBLISHED' ? 'success' : 'warning'} className="text-[10px]">
                        {course.status}
                      </Badge>
                    </div>
                    <h3 className="font-bold text-slate-900 text-base">{course.title}</h3>
                    <p className="text-xs text-slate-500">{course.totalChapters} Chapters · {course.totalLessons} Lessons</p>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-base font-extrabold text-slate-900">{course.enrolledStudents}</div>
                      <div className="text-[10px] text-slate-400">Students</div>
                    </div>
                    <Link href={`/instructor/courses/${course.id}`}>
                      <Button variant="outline" className="text-xs font-semibold flex items-center gap-1">
                        Manage
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Button>
                    </Link>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900">Enrolled Students</h2>
              <Link href="/instructor/students">
                <Button variant="ghost" className="text-xs text-primary font-semibold">
                  Directory
                </Button>
              </Link>
            </div>

            <div className="space-y-3">
              {recentStudents.map((st) => (
                <Card key={st.id} className="p-4 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="relative w-10 h-10 rounded-full overflow-hidden border border-border">
                      <Image
                        src={st.avatar}
                        alt={st.name}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                    <div>
                      <h4 className="font-bold text-xs text-slate-900">{st.name}</h4>
                      <p className="text-[10px] text-slate-500">{st.progressPercentage}% track progress</p>
                    </div>
                  </div>

                  <Link href={`/instructor/students/${st.id}`}>
                    <Button variant="outline" className="text-xs py-1 h-auto">
                      View
                    </Button>
                  </Link>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}

