'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import DashboardShell from '@/components/layout/DashboardShell';
import { studentNav } from '@/components/layout/navigationConfig';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { mockProgressData } from '@/lib/mockStudentData';
import { mockStudentProfile } from '@/lib/mockLearningData';
import {
  TrendingUp,
  Clock,
  Flame,
  Award,
  BookOpen,
  CheckCircle2,
  Trophy,
  Zap,
  GraduationCap,
  ArrowRight,
  ExternalLink,
  Target,
  BarChart2,
  Calendar,
} from 'lucide-react';

export default function StudentProgressPage() {
  const [filter, setFilter] = useState('ALL');
  const { overallCompletion, hoursLearned, currentStreak, longestStreak, totalXp, weeklyActivity, skillMastery, courseProgress, milestones } = mockProgressData;

  const filteredCourses = courseProgress.filter((c) => {
    if (filter === 'IN_PROGRESS') return c.badge === 'In Progress';
    if (filter === 'COMPLETED') return c.badge === 'Completed';
    return true;
  });

  return (
    <DashboardShell role="STUDENT" navItems={studentNav}>
      <div className="space-y-8 max-w-7xl mx-auto">
        {/* Header Banner */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 sm:p-8 rounded-xl border border-border shadow-sm">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-primary">Performance & Mastery</span>
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
              Learning Progress & Analytics
            </h1>
            <p className="text-sm text-slate-500 max-w-xl">
              Track your course completion rate, mastery milestones, learning velocity, and credential progress.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/student/learn">
              <Button variant="outline" className="text-xs font-medium">
                Browse More Courses
              </Button>
            </Link>
            <Link href="/student/wallet">
              <Button className="text-xs font-medium flex items-center gap-1.5">
                <Zap className="w-4 h-4 fill-white" />
                View Wallet & Rewards
              </Button>
            </Link>
          </div>
        </div>

        {/* Top Metric Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="p-5 flex items-center gap-4">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Overall Completion</p>
              <p className="text-2xl font-extrabold text-slate-900">{overallCompletion}%</p>
            </div>
          </Card>

          <Card className="p-5 flex items-center gap-4">
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Hours Learned</p>
              <p className="text-2xl font-extrabold text-slate-900">{hoursLearned} hrs</p>
            </div>
          </Card>

          <Card className="p-5 flex items-center gap-4">
            <div className="p-3 bg-orange-50 text-orange-600 rounded-xl">
              <Flame className="w-6 h-6 fill-orange-500" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Active Streak</p>
              <p className="text-2xl font-extrabold text-slate-900">{currentStreak} Days</p>
            </div>
          </Card>

          <Card className="p-5 flex items-center gap-4">
            <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Total XP Earned</p>
              <p className="text-2xl font-extrabold text-slate-900">{totalXp.toLocaleString()} XP</p>
            </div>
          </Card>
        </div>

        {/* Main Grid: Weekly Activity + Skill Mastery */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Weekly Learning Velocity (2 cols) */}
          <Card className="lg:col-span-2 p-6 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Weekly Study Velocity</h2>
                <p className="text-xs text-slate-500">Hours spent learning over the past 7 days</p>
              </div>
              <Badge variant="outline" className="text-xs">
                Goal: 15 hrs / week
              </Badge>
            </div>

            {/* Weekly Bar Graph Representation */}
            <div className="pt-4 grid grid-cols-7 gap-3 items-end h-48 border-b border-border pb-4">
              {weeklyActivity.map((day) => {
                const heightPercent = Math.min(100, Math.round((day.hours / 5) * 100));
                return (
                  <div key={day.day} className="flex flex-col items-center gap-2 h-full justify-end group">
                    <span className="text-[11px] font-semibold text-slate-600 group-hover:text-primary transition-colors">
                      {day.hours}h
                    </span>
                    <div className="w-full max-w-[42px] bg-slate-100 rounded-t-lg h-full max-h-[140px] flex items-end">
                      <div
                        className="w-full bg-primary hover:bg-blue-700 transition-all rounded-t-lg"
                        style={{ height: `${heightPercent}%` }}
                      ></div>
                    </div>
                    <span className="text-xs font-medium text-slate-500">{day.day}</span>
                  </div>
                );
              })}
            </div>

            <div className="flex items-center justify-between text-xs text-slate-500 pt-2">
              <span className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-sm bg-primary"></span>
                Daily Recorded Study Time
              </span>
              <span>Longest streak: <strong className="text-slate-800">{longestStreak} days</strong></span>
            </div>
          </Card>

          {/* Skill Mastery Breakdown (1 col) */}
          <Card className="p-6 space-y-5">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Skill Competency</h2>
              <p className="text-xs text-slate-500">Evaluated from quizzes & assignments</p>
            </div>

            <div className="space-y-4">
              {skillMastery.map((skill) => (
                <div key={skill.name} className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="font-semibold text-slate-800">{skill.name}</span>
                    <span className="text-slate-500 font-medium">{skill.progress}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${skill.color}`}
                      style={{ width: `${skill.progress}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-[11px] text-slate-400">
                    <span>Level</span>
                    <span className="font-medium text-slate-600">{skill.level}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Enrolled Courses Progress */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Enrolled Course Progress</h2>
              <p className="text-xs text-slate-500">Detailed breakdown of active learning curricula</p>
            </div>

            {/* Filter Tabs */}
            <div className="inline-flex rounded-lg border border-border p-1 bg-slate-50 text-xs">
              <button
                type="button"
                onClick={() => setFilter('ALL')}
                className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                  filter === 'ALL' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                All Tracks ({courseProgress.length})
              </button>
              <button
                type="button"
                onClick={() => setFilter('IN_PROGRESS')}
                className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                  filter === 'IN_PROGRESS' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                In Progress (2)
              </button>
              <button
                type="button"
                onClick={() => setFilter('COMPLETED')}
                className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                  filter === 'COMPLETED' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Completed (1)
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {filteredCourses.map((course) => (
              <Card key={course.id} className="overflow-hidden flex flex-col justify-between hover:shadow-md transition-shadow">
                <div>
                  <div className="relative h-40 w-full bg-slate-100">
                    <Image
                      src={course.thumbnail}
                      alt={course.title}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                    <div className="absolute top-3 right-3">
                      <Badge variant={course.badge === 'Completed' ? 'success' : 'primary'}>
                        {course.badge}
                      </Badge>
                    </div>
                  </div>

                  <div className="p-5 space-y-3">
                    <h3 className="font-bold text-slate-900 text-base leading-snug line-clamp-2">
                      {course.title}
                    </h3>
                    <p className="text-xs text-slate-500">Instructor: {course.instructor}</p>

                    {/* Progress Bar */}
                    <div className="space-y-1 pt-2">
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-500 font-medium">Progress</span>
                        <span className="font-bold text-slate-900">{course.progress}%</span>
                      </div>
                      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary rounded-full"
                          style={{ width: `${course.progress}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs text-slate-500 pt-2 border-t border-border">
                      <div>
                        <span className="block text-slate-400 text-[11px]">Lessons</span>
                        <span className="font-semibold text-slate-700">
                          {course.completedLessons}/{course.totalLessons}
                        </span>
                      </div>
                      <div>
                        <span className="block text-slate-400 text-[11px]">Chapters</span>
                        <span className="font-semibold text-slate-700">
                          {course.completedChapters}/{course.totalChapters}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-5 pt-0">
                  <Link href={`/student/courses/${course.id}`}>
                    <Button variant="outline" className="w-full text-xs font-semibold flex items-center justify-center gap-1.5">
                      {course.badge === 'Completed' ? 'Review Course' : 'Resume Learning'}
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Milestone Badges & Achievements */}
        <Card className="p-6 sm:p-8 space-y-6">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Mastery Milestones</h2>
            <p className="text-xs text-slate-500">Track and unlock platform learning achievements</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {milestones.map((m) => (
              <div
                key={m.id}
                className={`p-4 rounded-xl border flex flex-col items-center text-center space-y-2 transition-all ${
                  m.unlocked
                    ? 'border-emerald-200 bg-emerald-50/40 text-emerald-950'
                    : 'border-slate-200 bg-slate-50/50 text-slate-400 opacity-60'
                }`}
              >
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    m.unlocked ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-200 text-slate-400'
                  }`}
                >
                  {m.unlocked ? <CheckCircle2 className="w-6 h-6" /> : <Target className="w-6 h-6" />}
                </div>
                <h4 className="font-bold text-xs leading-snug">{m.title}</h4>
                <p className="text-[10px] text-slate-500">{m.date}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </DashboardShell>
  );
}

