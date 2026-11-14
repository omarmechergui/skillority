'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import {
  BookOpen,
  Briefcase,
  Users,
  Award,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Coins,
  Flame,
  ShieldCheck,
  Star,
  ChevronRight,
  Compass,
} from 'lucide-react';

export default function PublicLandingPage() {
  return (
    <div className="min-h-screen bg-canvas text-neutral-dark font-sans flex flex-col selection:bg-primary-light selection:text-primary">
      {/* Navigation Header */}
      <header className="sticky top-0 z-50 bg-surface/90 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-primary text-white rounded-lg flex items-center justify-center font-bold text-base shadow-xs">
              S
            </div>
            <span className="font-extrabold text-base tracking-tight text-slate-900">
              Skillority
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-slate-600">
            <a href="#tracks" className="hover:text-primary transition-colors">Course Tracks</a>
            <a href="#how-it-works" className="hover:text-primary transition-colors">How It Works</a>
            <a href="#hiring" className="hover:text-primary transition-colors">For Employers</a>
            <a href="#instructors" className="hover:text-primary transition-colors">For Educators</a>
          </nav>

          <div className="flex items-center gap-3">
            <Link href="/auth/signin">
              <Button variant="ghost" className="text-xs font-semibold">
                Sign In
              </Button>
            </Link>
            <Link href="/onboarding/role">
              <Button className="text-xs font-semibold flex items-center gap-1">
                Get Started
                <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 relative overflow-hidden bg-gradient-to-b from-white to-canvas border-b border-border">
        <div className="max-w-5xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-primary text-xs font-semibold">
            <Sparkles className="w-4 h-4 fill-primary text-primary" />
            Verified Learning & Direct Recruiter Pipeline
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-slate-900 tracking-tight leading-tight">
            Turn Your Skills Into <br className="hidden sm:inline" />
            <span className="text-primary">Real Opportunities.</span>
          </h1>

          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Master production-grade full-stack engineering, complete chapter quizzes, earn utility coins, and get matched directly with hiring tech teams.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
            <Link href="/onboarding/student">
              <Button className="w-full sm:w-auto text-sm px-6 py-3 h-auto font-bold flex items-center justify-center gap-2">
                Join as Student
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link href="/onboarding/company">
              <Button variant="outline" className="w-full sm:w-auto text-sm px-6 py-3 h-auto font-bold flex items-center justify-center gap-2">
                <Briefcase className="w-4 h-4 text-slate-600" />
                Hire Verified Talent
              </Button>
            </Link>
          </div>

          {/* Social Proof Bar */}
          <div className="pt-10 flex flex-wrap items-center justify-center gap-8 text-xs text-slate-500 font-semibold border-t border-border/60 max-w-3xl mx-auto">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>Chapters 0–5 100% Free</span>
            </div>
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-primary" />
              <span>Admin Verified Accreditation</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Award className="w-4 h-4 text-amber-500" />
              <span>Merit-Based Skillority Coins</span>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Tracks Section */}
      <section id="tracks" className="py-16 px-4 sm:px-6 max-w-7xl mx-auto w-full space-y-10">
        <div className="text-center space-y-2 max-w-xl mx-auto">
          <Badge variant="primary" className="text-xs">Curriculums</Badge>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Engineered For The Modern Industry
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Project-based tracks structured into Chapters, Lessons, Quizzes, and Final Assessments.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6 space-y-4 hover:shadow-md transition-shadow">
            <div className="p-3 bg-blue-50 text-primary rounded-xl w-fit">
              <BookOpen className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <Badge variant="primary" className="text-[10px]">Intermediate</Badge>
              <h3 className="text-lg font-bold text-slate-900">Modern Full-Stack Web Development</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Next.js 14 App Router, React Server Components, Prisma ORM, and high-availability database modeling.
              </p>
            </div>
            <div className="pt-2 border-t border-border text-xs text-slate-500 flex justify-between">
              <span>8 Chapters · 24 Lessons</span>
              <span className="font-bold text-emerald-600">Free to Start</span>
            </div>
          </Card>

          <Card className="p-6 space-y-4 hover:shadow-md transition-shadow">
            <div className="p-3 bg-purple-50 text-purple-600 rounded-xl w-fit">
              <Sparkles className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <Badge variant="primary" className="text-[10px]">Advanced</Badge>
              <h3 className="text-lg font-bold text-slate-900">TypeScript Enterprise Architecture</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Domain-driven design, compiler AST plugins, type gymnastics, and scalable frontend architectural boundaries.
              </p>
            </div>
            <div className="pt-2 border-t border-border text-xs text-slate-500 flex justify-between">
              <span>6 Chapters · 18 Lessons</span>
              <span className="font-bold text-emerald-600">Free to Start</span>
            </div>
          </Card>

          <Card className="p-6 space-y-4 hover:shadow-md transition-shadow">
            <div className="p-3 bg-amber-50 text-amber-600 rounded-xl w-fit">
              <Award className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <Badge variant="primary" className="text-[10px]">Intermediate</Badge>
              <h3 className="text-lg font-bold text-slate-900">PostgreSQL & Distributed Databases</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Indexing optimizations, connection pooling, multi-tenant schemas, and Prisma ORM migrations.
              </p>
            </div>
            <div className="pt-2 border-t border-border text-xs text-slate-500 flex justify-between">
              <span>7 Chapters · 21 Lessons</span>
              <span className="font-bold text-emerald-600">Free to Start</span>
            </div>
          </Card>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-16 px-4 sm:px-6 bg-white border-y border-border">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center space-y-2 max-w-xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              The Skillority Merit Engine
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              A transparent, self-sustaining learning and talent placement cycle.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            <div className="p-5 rounded-2xl bg-slate-50 border border-border space-y-3">
              <div className="w-8 h-8 rounded-full bg-primary text-white font-bold text-xs flex items-center justify-center">
                1
              </div>
              <h3 className="font-bold text-sm text-slate-900">Learn Free Chapters</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Access Chapters 0 through 5 completely free with zero credit cards or paywalls.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-border space-y-3">
              <div className="w-8 h-8 rounded-full bg-amber-500 text-white font-bold text-xs flex items-center justify-center">
                2
              </div>
              <h3 className="font-bold text-sm text-slate-900">Earn Skillority Coins</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Score 80%+ on chapter quizzes to earn 50 Coins. Maintain daily study streaks for reward bonuses.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-border space-y-3">
              <div className="w-8 h-8 rounded-full bg-purple-500 text-white font-bold text-xs flex items-center justify-center">
                3
              </div>
              <h3 className="font-bold text-sm text-slate-900">Unlock Master Chapters</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Redeem earned coins to unlock advanced Chapter 6 and Chapter 7 production modules.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-border space-y-3">
              <div className="w-8 h-8 rounded-full bg-emerald-500 text-white font-bold text-xs flex items-center justify-center">
                4
              </div>
              <h3 className="font-bold text-sm text-slate-900">Land Partner Roles</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Get discovered by verified partner tech companies seeking candidates with authenticated skills.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Role Gateways: Employer & Educator Cards */}
      <section id="hiring" className="py-16 px-4 sm:px-6 max-w-7xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="p-8 space-y-4 bg-gradient-to-br from-white to-blue-50/50">
          <Badge variant="primary" className="text-xs">For Companies</Badge>
          <h3 className="text-2xl font-bold text-slate-900">Hire Engineers By Proof Of Work</h3>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Stop filtering resumes on pedigree. Search candidate portfolios, verified assessment scores, and invite pre-evaluated talent directly into your pipeline.
          </p>
          <Link href="/onboarding/company">
            <Button className="text-xs font-semibold">
              Post an Opportunity
            </Button>
          </Link>
        </Card>

        <Card id="instructors" className="p-8 space-y-4 bg-gradient-to-br from-white to-purple-50/50">
          <Badge variant="primary" className="text-xs bg-purple-600 text-white">For Instructors</Badge>
          <h3 className="text-2xl font-bold text-slate-900">Teach With The Hybrid Lesson Builder</h3>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Author rich, interactive curriculums using text, code snippets, videos, and quizzes. Monetize through platform coin allocations upon admin accreditation.
          </p>
          <Link href="/onboarding/instructor">
            <Button variant="outline" className="text-xs font-semibold">
              Become an Educator
            </Button>
          </Link>
        </Card>
      </section>

      {/* Footer */}
      <footer className="mt-auto bg-white border-t border-border py-12 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-primary text-white rounded flex items-center justify-center font-bold text-xs">
              S
            </div>
            <span className="font-bold text-slate-900">Skillority Platform</span>
            <span>© 2026. All rights reserved.</span>
          </div>

          <div className="flex items-center gap-6 font-medium">
            <Link href="/auth/signin" className="hover:text-primary">Sign In</Link>
            <Link href="/onboarding/role" className="hover:text-primary">Get Started</Link>
            <Link href="/student/dashboard" className="hover:text-primary">Student Portal</Link>
            <Link href="/company/dashboard" className="hover:text-primary">Company Portal</Link>
            <Link href="/instructor/dashboard" className="hover:text-primary">Instructor Hub</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
