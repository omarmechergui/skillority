'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import DashboardShell from '@/components/layout/DashboardShell';
import { instructorNav } from '@/components/layout/navigationConfig';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { mockInstructorCourses } from '@/lib/mockInstructorData';
import { coursesApi } from '@/lib/api';
import { BookOpen, Plus, Users, Star, Eye, Edit, ArrowRight } from 'lucide-react';

export default function InstructorCoursesPage() {
  const [courses, setCourses] = useState(mockInstructorCourses);

  useEffect(() => {
    async function loadInstructorCourses() {
      try {
        const res = await coursesApi.getCourses();
        if (res.data?.courses && res.data.courses.length > 0) {
          const liveList = res.data.courses.map(c => ({
            id: c.id,
            title: c.title,
            category: c.category || 'Engineering',
            level: c.level || 'Intermediate',
            status: c.isPublished ? 'PUBLISHED' : (c.reviewStatus || 'DRAFT'),
            chaptersCount: c.chapters?.length || 0,
            lessonsCount: c._count?.lessons || 12,
            enrolledCount: c._count?.enrollments || 0,
            rating: 4.8
          }));
          setCourses(liveList);
        }
      } catch {
        // Safe fallback
      }
    }
    loadInstructorCourses();
  }, []);

  return (
    <DashboardShell roleTitle="Instructor Portal" navItems={instructorNav}>
      <div className="space-y-8 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 sm:p-8 rounded-xl border border-border shadow-sm">
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
              My Author Courses
            </h1>
            <p className="text-sm text-slate-500 max-w-xl">
              Design curriculums, organize chapters, author lessons, and submit for Admin publishing approval.
            </p>
          </div>

          <Link href="/instructor/courses/create">
            <Button className="text-xs font-semibold flex items-center gap-1.5">
              <Plus className="w-4 h-4" />
              Create New Course
            </Button>
          </Link>
        </div>

        <div className="space-y-4">
          {courses.map((course) => (
            <Card key={course.id} className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:shadow-sm transition-shadow">
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-2.5">
                  <Badge variant="primary" className="text-[10px]">{course.level}</Badge>
                  <Badge variant={course.status === 'PUBLISHED' ? 'success' : 'warning'} className="text-[10px]">
                    {course.status}
                  </Badge>
                  <span className="text-xs text-slate-400">•</span>
                  <span className="text-xs text-slate-500 font-medium">{course.category}</span>
                </div>

                <h3 className="text-lg font-bold text-slate-900">{course.title}</h3>
                <p className="text-xs text-slate-500 line-clamp-2">{course.description}</p>

                <div className="flex items-center gap-4 text-xs text-slate-600 pt-1">
                  <span>{course.totalChapters} Chapters</span>
                  <span>•</span>
                  <span>{course.totalLessons} Lessons</span>
                  <span>•</span>
                  <span className="text-emerald-600 font-semibold">{course.completionRate} Completion Rate</span>
                </div>
              </div>

              <div className="flex items-center gap-4 border-t md:border-t-0 md:border-l border-border pt-4 md:pt-0 md:pl-6">
                <div className="text-right">
                  <div className="text-xl font-bold text-slate-900">{course.enrolledStudents}</div>
                  <div className="text-[11px] text-slate-400">Students</div>
                </div>

                <div className="flex items-center gap-2">
                  <Link href={`/instructor/courses/${course.id}`}>
                    <Button variant="outline" className="text-xs font-semibold">
                      Manage
                    </Button>
                  </Link>
                  <Link href={`/instructor/courses/${course.id}/curriculum`}>
                    <Button className="text-xs font-semibold">
                      Curriculum
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </DashboardShell>
  );
}

