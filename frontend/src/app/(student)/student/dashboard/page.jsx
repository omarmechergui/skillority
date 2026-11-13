'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import DashboardShell from '@/components/layout/DashboardShell';
import { studentNav } from '@/components/layout/navigationConfig';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { mockStudentProfile, mockCourses } from '@/lib/mockLearningData';
import {
  Coins,
  Flame,
  BookOpen,
  Trophy,
  ArrowRight,
  PlayCircle,
  Clock,
  CheckCircle2,
  Calendar,
  Briefcase,
  ChevronRight,
  Sparkles,
  Lock,
  ExternalLink
} from 'lucide-react';

export default function StudentDashboardPage() {
  const [profile] = useState(mockStudentProfile);
  const enrolledCourses = mockCourses.filter(c => c.isEnrolled);
  const activeCourse = enrolledCourses[0] || mockCourses[0];

  return (
    <DashboardShell role="STUDENT" navItems={studentNav}>
      <div className="space-y-8 max-w-7xl mx-auto">
        {/* Top Header / Welcome Banner */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 sm:p-8 rounded-xl border border-border shadow-sm">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-primary">Student Workspace</span>
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
              Welcome back, {profile.name}
            </h1>
            <p className="text-sm text-slate-500 max-w-xl">
              You are on a <span className="font-semibold text-slate-900">{profile.currentStreakDays}-day learning streak</span>. Complete your daily missions to earn bonus Skillority Coins.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Streak Counter */}
            <div className="flex items-center gap-2 px-4 py-2.5 bg-orange-50/80 border border-orange-200/60 rounded-xl text-orange-800">
              <Flame className="w-5 h-5 text-orange-600 fill-orange-500 animate-pulse" />
              <div>
                <div className="text-xs font-medium text-orange-600 uppercase tracking-wider">Streak</div>
                <div className="text-base font-bold leading-tight">{profile.currentStreakDays} Days</div>
              </div>
            </div>

            {/* Skillority Coins Balance Widget */}
            <div className="flex items-center gap-3 px-4 py-2.5 bg-amber-50/80 border border-amber-200/80 rounded-xl text-amber-900 shadow-sm">
              <div className="w-9 h-9 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-700">
                <Coins className="w-5 h-5 fill-amber-500 text-amber-700" />
              </div>
              <div>
                <div className="text-xs font-medium text-amber-700 uppercase tracking-wider">Coin Balance</div>
                <div className="text-base font-extrabold leading-tight text-amber-950">
                  {profile.coinsBalance} <span className="text-xs font-normal text-amber-800">Coins</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="p-4 sm:p-5 flex items-center gap-4">
            <div className="p-3 bg-blue-50 text-primary rounded-xl">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500">In Progress</p>
              <p className="text-xl font-bold text-slate-900">{enrolledCourses.length} Courses</p>
            </div>
          </Card>

          <Card className="p-4 sm:p-5 flex items-center gap-4">
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500">Completed</p>
              <p className="text-xl font-bold text-slate-900">{profile.coursesCompleted} Tracks</p>
            </div>
          </Card>

          <Card className="p-4 sm:p-5 flex items-center gap-4">
            <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500">Learning Time</p>
              <p className="text-xl font-bold text-slate-900">{profile.hoursLearned} hrs</p>
            </div>
          </Card>

          <Card className="p-4 sm:p-5 flex items-center gap-4">
            <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500">Certifications</p>
              <p className="text-xl font-bold text-slate-900">{profile.certificatesEarned} Earned</p>
            </div>
          </Card>
        </div>

        {/* Hero Section: Continue Learning Active Course */}
        {activeCourse && (
          <div className="relative overflow-hidden bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-md">
            <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="space-y-3 max-w-2xl">
                <div className="flex items-center gap-2">
                  <Badge variant="primary" className="bg-primary/30 text-blue-200 border border-blue-400/30">
                    Active Course
                  </Badge>
                  <span className="text-xs text-slate-300">
                    Chapter 2: React Fundamentals & Component Architecture
                  </span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
                  {activeCourse.title}
                </h2>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Next Up: <span className="text-white font-medium">Lesson 2.1 — Thinking in React: Atomic Design & State Lifting</span>
                </p>

                {/* Progress bar */}
                <div className="pt-2 space-y-1.5">
                  <div className="flex justify-between text-xs text-slate-300 font-medium">
                    <span>Course Progress</span>
                    <span>{activeCourse.progressPercentage}% Completed</span>
                  </div>
                  <div className="w-full bg-slate-700/80 rounded-full h-2.5 overflow-hidden">
                    <div
                      className="bg-primary h-2.5 rounded-full transition-all duration-500"
                      style={{ width: `${activeCourse.progressPercentage}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2 lg:pt-0">
                <Link href={`/student/courses/${activeCourse.id}/chapters/chap-2/lessons/les-2-1`}>
                  <Button variant="primary" size="lg" className="w-full sm:w-auto shadow-md">
                    <PlayCircle className="w-5 h-5 mr-2" />
                    Resume Lesson
                  </Button>
                </Link>
                <Link href={`/student/courses/${activeCourse.id}`}>
                  <Button variant="secondary" size="lg" className="w-full sm:w-auto bg-slate-800 hover:bg-slate-700 text-white border-slate-700">
                    View Syllabus
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* 2-Column Grid: Daily Missions & Upcoming Schedule */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Column: Daily Missions + Enrolled Courses */}
          <div className="lg:col-span-2 space-y-8">
            {/* Daily Missions */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Daily Learning Missions</h3>
                  <p className="text-xs text-slate-500">Complete tasks to earn coins and accelerate chapter unlocks</p>
                </div>
                <Badge variant="warning" className="bg-amber-50 text-amber-800 border-amber-200">
                  <Coins className="w-3.5 h-3.5 mr-1 text-amber-600 inline" /> Daily Rewards
                </Badge>
              </div>

              <div className="space-y-3">
                {profile.dailyMissions.map((mission) => (
                  <div
                    key={mission.id}
                    className={`flex items-center justify-between p-3.5 rounded-xl border transition-colors ${
                      mission.completed
                        ? 'bg-slate-50/80 border-slate-200 text-slate-400'
                        : 'bg-white border-border hover:border-blue-200'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={mission.completed ? 'text-emerald-500' : 'text-slate-300'}>
                        <CheckCircle2 className="w-5 h-5" />
                      </div>
                      <span className={`text-sm font-medium ${mission.completed ? 'line-through text-slate-400' : 'text-slate-800'}`}>
                        {mission.title}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 rounded-lg text-amber-800 text-xs font-semibold">
                      <Coins className="w-3.5 h-3.5 text-amber-600" />
                      +{mission.reward}
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Enrolled Courses / Continue Learning List */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">My Enrolled Courses</h3>
                  <p className="text-xs text-slate-500">Pick up right where you left off</p>
                </div>
                <Link href="/student/learn" className="text-xs font-semibold text-primary hover:underline flex items-center gap-1">
                  Browse All Courses <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {mockCourses.map((course) => (
                  <Card key={course.id} className="p-5 flex flex-col justify-between hover:shadow-md transition-shadow border-border">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Badge variant="outline" className="text-xs font-medium text-slate-600">
                          {course.category}
                        </Badge>
                        <span className="text-xs text-slate-500 flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" /> {course.duration}
                        </span>
                      </div>

                      <h4 className="font-bold text-slate-900 line-clamp-1 hover:text-primary transition-colors">
                        <Link href={`/student/courses/${course.id}`}>{course.title}</Link>
                      </h4>
                      <p className="text-xs text-slate-500 line-clamp-2">{course.description}</p>

                      <div className="pt-2">
                        <div className="flex justify-between text-xs text-slate-500 mb-1">
                          <span>{course.isEnrolled ? `${course.progressPercentage}% complete` : 'Not enrolled'}</span>
                          <span>{course.totalChapters} chapters</span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-1.5">
                          <div
                            className="bg-primary h-1.5 rounded-full"
                            style={{ width: `${course.progressPercentage}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 mt-2 border-t border-border flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="relative w-6 h-6 rounded-full overflow-hidden border border-slate-200">
                          <Image
                            src={course.instructor.avatar}
                            alt={course.instructor.name}
                            fill
                            sizes="24px"
                            className="object-cover"
                            unoptimized
                          />
                        </div>
                        <span className="text-xs text-slate-600 truncate max-w-[120px]">{course.instructor.name}</span>
                      </div>

                      <Link href={`/student/courses/${course.id}`}>
                        <Button variant="outline" size="sm" className="text-xs">
                          {course.isEnrolled ? 'Continue' : 'Details'}
                        </Button>
                      </Link>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar Column: Schedule, Career Recommendations & Notifications */}
          <div className="space-y-6">
            {/* Upcoming Activities / Live Mentorship */}
            <Card className="p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-primary" /> Upcoming Activities
                </h3>
              </div>

              <div className="space-y-3">
                {profile.upcomingActivities.map((act) => (
                  <div key={act.id} className="p-3 bg-slate-50 rounded-xl border border-border/80 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-slate-900">{act.title}</span>
                      {act.comingSoon ? (
                        <Badge variant="secondary" className="text-[10px] py-0 px-1.5 bg-slate-200/80 text-slate-700">
                          Coming Soon
                        </Badge>
                      ) : (
                        <Badge variant="primary" className="text-[10px] py-0 px-1.5">
                          Open
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-slate-500">{act.date}</p>
                    <p className="text-[11px] text-slate-400">Host: {act.host} · {act.type}</p>
                  </div>
                ))}
              </div>
            </Card>

            {/* Career Opportunities Match */}
            <Card className="p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-emerald-600" /> Career Matches
                </h3>
                <span className="text-xs text-slate-400">Based on skills</span>
              </div>

              <div className="space-y-3">
                {profile.recentOpportunities.map((opp) => (
                  <div key={opp.id} className="p-3 border border-border rounded-xl hover:border-blue-200 transition-colors">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-slate-900">{opp.role}</span>
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        {opp.match}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600">{opp.company} · {opp.location}</p>
                    <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                      <span>Stipend: <strong className="text-slate-800">{opp.stipend}</strong></span>
                      <span className="text-primary font-medium flex items-center gap-0.5">
                        View <ChevronRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Skillority Rule Banner */}
            <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50/50 rounded-xl border border-blue-100 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-blue-900">
                <Lock className="w-4 h-4 text-primary" /> Chapter Unlock System
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Chapters 0–5 are completely free for all enrolled students. Chapter 6+ can be unlocked anytime using your earned Skillority Coins!
              </p>
            </div>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}

