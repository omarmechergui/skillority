'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import DashboardShell from '@/components/layout/DashboardShell';
import { studentNav } from '@/components/layout/navigationConfig';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Input from '@/components/ui/Input';
import { coursesApi, learningApi } from '@/lib/api';
import { useAuth } from '@/lib/auth';
import {
  Search,
  BookOpen,
  Clock,
  Star,
  Users,
  CheckCircle,
  Filter,
  Sparkles,
  ArrowRight,
  PlayCircle,
  Loader2,
} from 'lucide-react';

const CATEGORIES = [
  'All Tracks',
  'Web Development',
  'Software Engineering',
  'Data & Analytics',
  'UI/UX Design',
  'AI & Machine Learning',
];

export default function LearnHubPage() {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [enrolledMap, setEnrolledMap] = useState({});
  const [selectedCategory, setSelectedCategory] = useState('All Tracks');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCatalog() {
      setLoading(true);
      try {
        const [catalogRes, enrollmentsRes] = await Promise.allSettled([
          coursesApi.getCourses({ status: 'PUBLISHED' }),
          user ? learningApi.getMyEnrollments() : Promise.resolve({ data: [] }),
        ]);

        const map = {};
        if (enrollmentsRes.status === 'fulfilled' && enrollmentsRes.value?.data) {
          const enrollmentsList = Array.isArray(enrollmentsRes.value.data) ? enrollmentsRes.value.data : [];
          enrollmentsList.forEach((e) => {
            map[e.courseId] = e;
          });
          setEnrolledMap(map);
        }

        if (catalogRes.status === 'fulfilled') {
          const rawCourses = Array.isArray(catalogRes.value?.data)
            ? catalogRes.value.data
            : Array.isArray(catalogRes.value?.data?.courses)
            ? catalogRes.value.data.courses
            : [];

          if (rawCourses.length > 0) {
            const liveCourses = rawCourses.map((c) => ({
              id: c.id,
              title: c.title,
              description: c.description || 'Comprehensive curriculum with practical exercises.',
              category: c.category || 'Web Development',
              level: c.level || 'Intermediate',
              duration: '12 Hours',
              rating: 4.8,
              enrolledCount: c._count?.enrollments || 0,
              totalChapters: c.chapters?.length || c._count?.chapters || 6,
              thumbnail: c.thumbnail || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&auto=format&fit=crop&q=80',
              isEnrolled: Boolean(map[c.id]),
              instructor: {
                name: c.instructor?.profile ? `${c.instructor.profile.firstName} ${c.instructor.profile.lastName || ''}`.trim() : c.instructor?.email || 'Lead Architect',
                title: 'Verified Instructor',
                avatar: c.instructor?.profile?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
              },
            }));
            setCourses(liveCourses);
          } else {
            setCourses([]);
          }
        }
      } catch (err) {
        // Safe fallback
      } finally {
        setLoading(false);
      }
    }
    loadCatalog();
  }, [user]);

  const filteredCourses = courses.filter((course) => {
    const matchesCategory =
      selectedCategory === 'All Tracks' || course.category === selectedCategory;
    const matchesSearch =
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.instructor?.name?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const enrolledCourses = courses.filter((c) => Boolean(enrolledMap[c.id]) || c.isEnrolled);

  return (
    <DashboardShell role="STUDENT" navItems={studentNav}>
      <div className="space-y-8 max-w-7xl mx-auto">
        {/* Hub Header */}
        <div className="bg-white p-6 sm:p-8 rounded-xl border border-border shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <Badge variant="primary" className="text-xs">Learning Catalog</Badge>
              <span className="text-xs text-slate-500">Verified Technical Curricula</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
              Explore Industry Learning Tracks
            </h1>
            <p className="text-sm text-slate-500 leading-relaxed">
              Step-by-step masteries designed by verified tech leads. Learn foundation chapters for free, unlock advanced deep dives with coins, and earn industry credentials.
            </p>
          </div>

          <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-xl border border-border">
            <div className="text-center px-2">
              <div className="text-xl font-bold text-slate-900">4</div>
              <div className="text-xs text-slate-500">Active Tracks</div>
            </div>
            <div className="h-8 w-px bg-slate-200" />
            <div className="text-center px-2">
              <div className="text-xl font-bold text-emerald-600">Free</div>
              <div className="text-xs text-slate-500">Chapters 0–5</div>
            </div>
            <div className="h-8 w-px bg-slate-200" />
            <div className="text-center px-2">
              <div className="text-xl font-bold text-primary">100%</div>
              <div className="text-xs text-slate-500">Verified</div>
            </div>
          </div>
        </div>

        {/* Continue Learning Strip (if enrolled courses exist) */}
        {enrolledCourses.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-900">Continue Learning</h2>
              <span className="text-xs text-slate-500">{enrolledCourses.length} in progress</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {enrolledCourses.map(course => (
                <Card key={`enrolled-${course.id}`} className="p-4 flex items-center justify-between gap-4 border-l-4 border-l-primary">
                  <div className="space-y-1">
                    <span className="text-[11px] font-semibold text-primary uppercase tracking-wide">
                      {course.category}
                    </span>
                    <h3 className="text-sm font-bold text-slate-900 line-clamp-1">
                      {course.title}
                    </h3>
                    <div className="flex items-center gap-3 text-xs text-slate-500">
                      <span>{course.progressPercentage}% completed</span>
                      <span>·</span>
                      <span>Chapter 2 of {course.totalChapters}</span>
                    </div>
                  </div>
                  <Link href={`/student/courses/${course.id}`}>
                    <Button variant="primary" size="sm" className="whitespace-nowrap">
                      <PlayCircle className="w-4 h-4 mr-1.5" /> Continue
                    </Button>
                  </Link>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Filter Bar & Search */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-stretch sm:items-center">
          {/* Categories Tab Pill Strip */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 sm:pb-0 scrollbar-none">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                  selectedCategory === cat
                    ? 'bg-primary text-white shadow-sm'
                    : 'bg-white border border-border text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative min-w-[260px]">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search courses, instructors..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs bg-white border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            />
          </div>
        </div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.length === 0 && !loading ? (
            <div className="col-span-full">
              <Card className="p-12 text-center text-slate-500 text-xs">
                No courses found matching your criteria.
              </Card>
            </div>
          ) : (
            filteredCourses.map((course) => (
            <Card
              key={course.id}
              className="overflow-hidden flex flex-col justify-between hover:shadow-lg transition-all duration-200 border-border group"
            >
              <div>
                {/* Thumbnail Header */}
                <div className="relative h-44 w-full bg-slate-100 overflow-hidden">
                  <Image
                    src={course.thumbnail}
                    alt={course.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    unoptimized
                  />
                  <div className="absolute top-3 left-3 flex gap-2">
                    <Badge variant="primary" className="bg-slate-900/80 backdrop-blur-sm text-white border-0 text-[11px]">
                      {course.category}
                    </Badge>
                    {course.badge && (
                      <Badge variant="warning" className="bg-amber-500 text-white border-0 text-[11px] font-semibold">
                        {course.badge}
                      </Badge>
                    )}
                  </div>
                  {course.isEnrolled && (
                    <div className="absolute top-3 right-3">
                      <span className="px-2 py-1 rounded bg-emerald-600 text-white text-[10px] font-bold shadow-sm flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" /> Enrolled
                      </span>
                    </div>
                  )}
                </div>

                {/* Content Body */}
                <div className="p-5 space-y-3">
                  <div className="flex items-center gap-3 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" /> {course.duration}
                    </span>
                    <span>·</span>
                    <span className="flex items-center gap-1 text-amber-600 font-semibold">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" /> {course.rating}
                    </span>
                    <span>·</span>
                    <span className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-slate-400" /> {course.enrolledCount.toLocaleString()}
                    </span>
                  </div>

                  <h3 className="font-bold text-slate-900 text-base group-hover:text-primary transition-colors line-clamp-1">
                    {course.title}
                  </h3>

                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                    {course.description}
                  </p>

                  {/* Instructor brief */}
                  <div className="pt-2 flex items-center gap-2.5">
                    <div className="relative w-7 h-7 rounded-full overflow-hidden border border-slate-200">
                      <Image
                        src={course.instructor.avatar}
                        alt={course.instructor.name}
                        fill
                        sizes="28px"
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                    <div className="text-xs">
                      <div className="font-medium text-slate-800 leading-none">{course.instructor.name}</div>
                      <div className="text-[11px] text-slate-400 truncate max-w-[170px]">{course.instructor.title}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card Footer */}
              <div className="p-5 pt-0">
                <div className="pt-3 border-t border-border flex items-center justify-between">
                  <div className="text-xs">
                    <span className="font-semibold text-slate-900">{course.totalChapters} Chapters</span>
                    <span className="text-slate-400 ml-1.5">(0–5 Free)</span>
                  </div>

                  <Link href={`/student/courses/${course.id}`}>
                    <Button variant={course.isEnrolled ? 'outline' : 'primary'} size="sm" className="text-xs">
                      {course.isEnrolled ? 'Continue' : 'View Course'}
                      <ArrowRight className="w-3.5 h-3.5 ml-1" />
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          )))}
        </div>
      </div>
    </DashboardShell>
  );
}

