'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import DashboardShell from '@/components/layout/DashboardShell';
import { studentNav } from '@/components/layout/navigationConfig';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { careerApi } from '@/lib/api';
import {
  Target,
  Compass,
  Briefcase,
  TrendingUp,
  CheckCircle2,
  Clock,
  Sparkles,
  BookOpen,
  ArrowRight,
  AlertCircle,
  FileCheck2,
  Layers,
  ChevronRight,
  Loader2,
} from 'lucide-react';

export default function StudentCareerDashboardPage() {
  const [goals, setGoals] = useState([]);
  const [recommendedOpportunities, setRecommendedOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      setLoading(true);
      try {
        const [goalsRes, oppsRes] = await Promise.all([
          careerApi.getMyCareerGoals(),
          careerApi.getOpportunities({ limit: 4 }),
        ]);

        if (goalsRes?.data) {
          setGoals(Array.isArray(goalsRes.data) ? goalsRes.data : []);
        }
        if (oppsRes?.data?.opportunities) {
          setRecommendedOpportunities(oppsRes.data.opportunities);
        } else if (Array.isArray(oppsRes?.data)) {
          setRecommendedOpportunities(oppsRes.data);
        }
      } catch (err) {
        console.error('Failed to load career dashboard:', err);
      } finally {
        setLoading(false);
      }
    }
    loadDashboard();
  }, []);

  const primaryGoal = goals.find((g) => g.isPrimary) || goals[0];
  const progress = primaryGoal?.progress || null;

  return (
    <DashboardShell role="STUDENT" navItems={studentNav}>
      <div className="space-y-8 max-w-7xl mx-auto">
        {/* Navigation Tabs Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Link href="/student/dashboard" className="hover:text-primary transition-colors">
              Student Workspace
            </Link>
            <span>/</span>
            <span className="font-semibold text-slate-900">Career Development</span>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
            <Link href="/student/careers">
              <Button variant="outline" size="sm" className="text-xs">
                <Briefcase className="w-3.5 h-3.5 mr-1.5 text-slate-500" />
                Internship Marketplace
              </Button>
            </Link>
            <Link href="/student/careers/paths">
              <Button variant="outline" size="sm" className="text-xs">
                <Compass className="w-3.5 h-3.5 mr-1.5 text-slate-500" />
                Career Paths
              </Button>
            </Link>
            <Link href="/student/careers/dashboard">
              <Button variant="primary" size="sm" className="text-xs">
                <Target className="w-3.5 h-3.5 mr-1.5" />
                My Career Dashboard
              </Button>
            </Link>
            <Link href="/student/careers/applications">
              <Button variant="outline" size="sm" className="text-xs">
                <CheckCircle2 className="w-3.5 h-3.5 mr-1.5 text-slate-500" />
                My Applications
              </Button>
            </Link>
          </div>
        </div>

        {/* Hero Banner */}
        <div className="bg-white p-6 sm:p-8 rounded-xl border border-border shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <Badge variant="primary" className="text-xs">
                Career Command Center
              </Badge>
              <span className="text-xs text-slate-400">Data-Driven Preparation</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              My Career Development Dashboard
            </h1>
            <p className="text-sm text-slate-600 leading-relaxed">
              Track your trajectory towards your chosen profession, bridge critical skill gaps, and discover partner internships matching your verified coursework.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Link href="/student/careers/paths">
              <Button variant="outline" size="sm" className="text-xs">
                <Compass className="w-3.5 h-3.5 mr-1.5 text-primary" />
                Browse All 13 Paths
              </Button>
            </Link>
            <Link href="/student/careers">
              <Button variant="primary" size="sm" className="text-xs">
                <Briefcase className="w-3.5 h-3.5 mr-1.5" />
                Find Internships
              </Button>
            </Link>
          </div>
        </div>

        {loading ? (
          <div className="p-16 text-center space-y-3">
            <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto" />
            <p className="text-xs text-slate-500">Calculating your career metrics...</p>
          </div>
        ) : !primaryGoal ? (
          /* Empty State: No Target Career Selected Yet */
          <Card className="p-12 text-center space-y-4 max-w-xl mx-auto border-border">
            <div className="p-3 bg-blue-50 text-primary w-fit mx-auto rounded-xl">
              <Target className="w-8 h-8" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Select Your Target Profession</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
              Choose from 13 industry-standard career paths (Frontend, Backend, AI/ML, DevOps, Data Science, and more) to unlock personalized skill gap analytics and internship recommendations.
            </p>
            <Link href="/student/careers/paths">
              <Button variant="primary" size="sm" className="text-xs">
                Explore Career Paths Catalog <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
              </Button>
            </Link>
          </Card>
        ) : (
          /* Active Target Career Dashboard */
          <div className="space-y-8">
            {/* Top Overview Strip */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Primary Goal Card */}
              <Card className="p-6 space-y-4 lg:col-span-2 border-border bg-white flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Badge variant="primary" className="text-xs">
                      Primary Target Goal
                    </Badge>
                    <Link
                      href={`/student/careers/paths/${primaryGoal.careerPath?.slug}`}
                      className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
                    >
                      View Blueprint <ChevronRight className="w-3 h-3" />
                    </Link>
                  </div>

                  <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                    {primaryGoal.careerPath?.title}
                  </h2>
                  <p className="text-xs text-slate-600 line-clamp-2">
                    {primaryGoal.careerPath?.description}
                  </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-3 border-t border-border text-xs">
                  <div>
                    <span className="text-slate-400 block text-[11px]">Domain</span>
                    <span className="font-bold text-slate-800">{primaryGoal.careerPath?.category}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Difficulty</span>
                    <span className="font-bold text-slate-800">{primaryGoal.careerPath?.difficultyLevel}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Hiring Demand</span>
                    <span className="font-bold text-emerald-600">
                      {primaryGoal.careerPath?.jobOutlook || 'High Demand'}
                    </span>
                  </div>
                </div>
              </Card>

              {/* Real Career Readiness Meter Card */}
              <Card className="p-6 space-y-4 border-border bg-white flex flex-col justify-between text-center">
                <div className="space-y-1">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Career Readiness Score
                  </h3>
                  <div className="text-4xl font-extrabold text-emerald-600 py-1">
                    {progress?.readinessScore || 0}%
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-emerald-600 h-full rounded-full transition-all duration-500"
                      style={{ width: `${progress?.readinessScore || 0}%` }}
                    />
                  </div>
                  <p className="text-[11px] text-slate-400 pt-1">
                    Based on verified skills & curriculum completion
                  </p>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-600 border-t border-border pt-3">
                  <span>Verified Skills:</span>
                  <span className="font-bold text-slate-900">
                    {progress?.stats?.verifiedSkillsCount || 0} / {progress?.stats?.totalRequiredSkills || 0}
                  </span>
                </div>
              </Card>
            </div>

            {/* 2-Column: Skill Gap Analysis & Learning Roadmap */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Skill Gap Analysis */}
              <Card className="p-6 space-y-5 border-border">
                <div className="flex items-center justify-between pb-3 border-b border-border">
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <Layers className="w-4 h-4 text-primary" /> Skill Gap Analysis
                  </h3>
                  <span className="text-xs font-semibold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                    {progress?.skillGaps?.length || 0} Pending Competencies
                  </span>
                </div>

                {progress?.skillGaps?.length === 0 ? (
                  <div className="p-6 text-center space-y-2 bg-emerald-50/50 rounded-xl border border-emerald-200">
                    <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                    <p className="text-xs font-bold text-emerald-900">All Core Technical Skills Verified!</p>
                    <p className="text-[11px] text-emerald-700">
                      You have acquired and verified all required competencies for this career blueprint.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {progress?.skillGaps?.map((gap, i) => (
                      <div
                        key={i}
                        className="p-3.5 rounded-xl border border-border bg-slate-50/60 flex items-start justify-between gap-4"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-slate-900">{gap.name}</span>
                            <Badge variant="outline" className="text-[10px] py-0">
                              {gap.proficiency || 'Intermediate'}
                            </Badge>
                          </div>
                          <p className="text-[11px] text-slate-500">{gap.description || gap.suggestedAction}</p>
                        </div>

                        <Link href="/student/learn">
                          <Button variant="outline" size="sm" className="text-[11px] shrink-0 bg-white">
                            Take Course
                          </Button>
                        </Link>
                      </div>
                    ))}
                  </div>
                )}
              </Card>

              {/* Verified Competencies */}
              <Card className="p-6 space-y-5 border-border">
                <div className="flex items-center justify-between pb-3 border-b border-border">
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Verified Competencies
                  </h3>
                  <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                    {progress?.verifiedSkills?.length || 0} Verified
                  </span>
                </div>

                {progress?.verifiedSkills?.length === 0 ? (
                  <div className="p-6 text-center space-y-2 bg-slate-50 rounded-xl border border-border">
                    <Clock className="w-8 h-8 text-slate-300 mx-auto" />
                    <p className="text-xs font-bold text-slate-800">No Verified Skills Yet</p>
                    <p className="text-[11px] text-slate-500">
                      Update your student profile skills and complete course quizzes to verify competencies.
                    </p>
                    <Link href="/student/profile">
                      <Button variant="outline" size="sm" className="text-xs mt-2">
                        Update Profile Skills
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {progress?.verifiedSkills?.map((skill, i) => (
                      <div
                        key={i}
                        className="p-3.5 rounded-xl border border-emerald-100 bg-emerald-50/40 flex items-center justify-between gap-4"
                      >
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span className="text-xs font-bold text-slate-900">{skill.name}</span>
                          <span className="text-[11px] text-slate-500">({skill.proficiency})</span>
                        </div>
                        <Badge variant="success" className="text-[10px] py-0">
                          Active & Verified
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            </div>

            {/* Recommended Internships Tailored to Target Goal */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    Recommended Opportunities for {primaryGoal.careerPath?.title}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Live openings from partner companies seeking verified student profiles
                  </p>
                </div>
                <Link href="/student/careers">
                  <Button variant="outline" size="sm" className="text-xs">
                    View All in Marketplace <ArrowRight className="w-3.5 h-3.5 ml-1" />
                  </Button>
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {recommendedOpportunities.map((opp) => (
                  <Card key={opp.id} className="p-5 hover:shadow-xs border-border space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <span className="text-xs font-semibold text-slate-500">
                          {typeof opp.company === 'object' ? opp.company?.companyName : 'TechCorp Labs'}
                        </span>
                        <h4 className="text-sm font-bold text-slate-900 hover:text-primary transition-colors">
                          <Link href={`/student/careers/${opp.id}`}>{opp.title}</Link>
                        </h4>
                      </div>
                      <Badge variant="primary" className="text-[10px]">
                        {opp.workplaceType || 'Remote'}
                      </Badge>
                    </div>

                    <p className="text-xs text-slate-600 line-clamp-2">{opp.description}</p>

                    <div className="pt-2 border-t border-border flex items-center justify-between text-xs">
                      <span className="font-bold text-emerald-600 flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5" /> {opp.matchScore || 85}% Match
                      </span>
                      <Link href={`/student/careers/${opp.id}`}>
                        <Button variant="outline" size="sm" className="text-xs">
                          View Details
                        </Button>
                      </Link>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardShell>
  );
}
