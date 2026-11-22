'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import DashboardShell from '@/components/layout/DashboardShell';
import { instructorNav } from '@/components/layout/navigationConfig';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { coursesApi } from '@/lib/api';
import { useAuth } from '@/lib/auth';
import { BookOpen, Plus, Users, Star, Eye, Edit, ArrowRight, Loader2, AlertCircle } from 'lucide-react';

export default function InstructorCoursesPage() {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadInstructorCourses() {
      setLoading(true);
      setError(null);
      try {
        const params = { status: 'ALL' };
        if (user?.id) params.instructorId = user.id;
        const res = await coursesApi.getCourses(params);
        const rawList = Array.isArray(res.data)
          ? res.data
          : Array.isArray(res.data?.courses)
          ? res.data.courses
          : [];

        if (rawList.length > 0) {
          const liveList = rawList.map((c) => ({
            id: c.id,
            title: c.title,
            description: c.description || 'No description provided.',
            category: c.category || 'Web Development',
            level: c.level || 'Intermediate',
            status: c.status || 'DRAFT',
            totalChapters: c.chapters?.length || c._count?.chapters || 0,
            totalLessons: c._count?.lessons || 0,
            completionRate: '0%',
            enrolledStudents: c._count?.enrollments || 0,
          }));
          setCourses(liveList);
        } else {
          setCourses([]);
        }
      } catch (err) {
        // Safe fallback
      } finally {
        setLoading(false);
      }
    }
    loadInstructorCourses();
  }, [user]);

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

        {courses.length === 0 && !loading && (
          <Card className="p-8 text-center space-y-3">
            <BookOpen className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="text-base font-bold text-slate-900">No courses created yet</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Get started by clicking &quot;Create New Course&quot; to author chapters and lessons.
            </p>
            <Link href="/instructor/courses/create">
              <Button size="sm" className="text-xs">Create Your First Course</Button>
            </Link>
          </Card>
        )}

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

