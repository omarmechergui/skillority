'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import DashboardShell from '@/components/layout/DashboardShell';
import { studentNav } from '@/components/layout/navigationConfig';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { careerApi } from '@/lib/api';
import {
  Compass,
  ArrowLeft,
  Target,
  CheckCircle2,
  Clock,
  DollarSign,
  TrendingUp,
  BookOpen,
  Award,
  Layers,
  Sparkles,
  ExternalLink,
  AlertCircle,
  Loader2,
  Check,
} from 'lucide-react';

export default function CareerPathDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug;

  const [path, setPath] = useState(null);
  const [progress, setProgress] = useState(null);
  const [myGoals, setMyGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savingGoal, setSavingGoal] = useState(false);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    async function loadData() {
      if (!slug) return;
      setLoading(true);
      try {
        const [pathRes, goalsRes] = await Promise.all([
          careerApi.getCareerPath(slug),
          careerApi.getMyCareerGoals().catch(() => ({ data: [] })),
        ]);

        const pathData = pathRes?.data || null;
        setPath(pathData);

        const goals = Array.isArray(goalsRes?.data) ? goalsRes.data : [];
        setMyGoals(goals);

        if (pathData?.id) {
          try {
            const progRes = await careerApi.getCareerProgress(pathData.id);
            setProgress(progRes?.data || null);
          } catch {
            // Safe fallback if progress calculation encounters cold start
          }
        }
      } catch (err) {
        console.error('Failed to load career path details:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [slug]);

  const isPrimaryGoal = myGoals.some((g) => g.careerPathId === path?.id && g.isPrimary);
  const isGoal = myGoals.some((g) => g.careerPathId === path?.id);

  const handleSetPrimaryGoal = async () => {
    if (!path?.id) return;
    setSavingGoal(true);
    try {
      await careerApi.setCareerGoal({
        careerPathId: path.id,
        isPrimary: true,
        notes: `Targeting ${path.title} profession`,
      });
      setNotification({ type: 'success', message: `Target career goal set to ${path.title}!` });
      // Refresh goals
      const goalsRes = await careerApi.getMyCareerGoals();
      setMyGoals(Array.isArray(goalsRes?.data) ? goalsRes.data : []);
      const progRes = await careerApi.getCareerProgress(path.id);
      setProgress(progRes?.data || null);
    } catch (err) {
      setNotification({ type: 'error', message: err.message || 'Failed to update career goal.' });
    } finally {
      setSavingGoal(false);
    }
  };

  if (loading) {
    return (
      <DashboardShell role="STUDENT" navItems={studentNav}>
        <div className="p-16 text-center space-y-3 max-w-4xl mx-auto">
          <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto" />
          <p className="text-xs text-slate-500">Loading career blueprint...</p>
        </div>
      </DashboardShell>
    );
  }

  if (!path) {
    return (
      <DashboardShell role="STUDENT" navItems={studentNav}>
        <div className="p-12 text-center space-y-4 max-w-xl mx-auto">
          <AlertCircle className="w-12 h-12 text-rose-500 mx-auto" />
          <h2 className="text-lg font-bold text-slate-900">Career Path Not Found</h2>
          <p className="text-xs text-slate-500">
            The requested career path blueprint does not exist or may have been updated.
          </p>
          <Link href="/student/careers/paths">
            <Button variant="outline" size="sm" className="text-xs">
              Back to Career Catalog
            </Button>
          </Link>
        </div>
      </DashboardShell>
    );
  }

  const requiredSkills = Array.isArray(path.requiredSkills) ? path.requiredSkills : [];
  const recommendedSkills = Array.isArray(path.recommendedSkills) ? path.recommendedSkills : [];
  const learningResources = Array.isArray(path.learningResources) ? path.learningResources : [];

  return (
    <DashboardShell role="STUDENT" navItems={studentNav}>
      <div className="space-y-8 max-w-6xl mx-auto">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <Link href="/student/careers/paths" className="hover:text-primary transition-colors flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Career Paths
          </Link>
          <span>/</span>
          <span className="font-semibold text-slate-900">{path.title}</span>
        </div>

        {notification && (
          <div
            className={`p-4 rounded-xl text-xs font-semibold flex items-center justify-between border ${
              notification.type === 'success'
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                : 'bg-rose-50 text-rose-800 border-rose-200'
            }`}
          >
            <span>{notification.message}</span>
            <button onClick={() => setNotification(null)} className="text-slate-400 hover:text-slate-700">
              ✕
            </button>
          </div>
        )}

        {/* Blueprint Hero Card */}
        <div className="bg-white p-6 sm:p-8 rounded-xl border border-border shadow-sm space-y-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-2 max-w-3xl">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="primary" className="text-xs">
                  {path.category}
                </Badge>
                <Badge
                  variant={
                    path.difficultyLevel === 'BEGINNER'
                      ? 'success'
                      : path.difficultyLevel === 'ADVANCED'
                      ? 'warning'
                      : 'primary'
                  }
                  className="text-xs"
                >
                  {path.difficultyLevel} Level
                </Badge>
                {path.industry && <span className="text-xs text-slate-400">· {path.industry}</span>}
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                {path.title} Career Blueprint
              </h1>
              <p className="text-sm text-slate-600 leading-relaxed">
                {path.description}
              </p>
            </div>

            {/* Action CTA: Target Goal Button */}
            <div className="shrink-0 flex flex-col gap-2">
              {isPrimaryGoal ? (
                <div className="flex items-center gap-2 px-4 py-2.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-bold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Your Primary Target Profession</span>
                </div>
              ) : (
                <Button
                  variant="primary"
                  onClick={handleSetPrimaryGoal}
                  disabled={savingGoal}
                  className="text-xs font-semibold flex items-center gap-1.5"
                >
                  {savingGoal ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Target className="w-4 h-4" />
                  )}
                  Set as Target Career Goal
                </Button>
              )}

              <Link href="/student/careers/dashboard">
                <Button variant="outline" size="sm" className="w-full text-xs">
                  View Career Dashboard
                </Button>
              </Link>
            </div>
          </div>

          {/* Quick Stats Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-slate-50 rounded-xl border border-border text-xs">
            <div>
              <span className="text-slate-400 block text-[11px]">Preparation Duration</span>
              <span className="font-bold text-slate-800 text-sm flex items-center gap-1 mt-0.5">
                <Clock className="w-4 h-4 text-slate-400" /> {path.estimatedDuration || '6-9 months'}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Salary Expectation</span>
              <span className="font-bold text-slate-800 text-sm flex items-center gap-1 mt-0.5">
                <DollarSign className="w-4 h-4 text-emerald-600" /> {path.salaryRange || 'Competitive'}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Hiring Demand</span>
              <span className="font-bold text-slate-800 text-sm flex items-center gap-1 mt-0.5">
                <TrendingUp className="w-4 h-4 text-primary" /> {path.jobOutlook || 'High Demand'}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Your Readiness</span>
              <span className="font-bold text-emerald-700 text-sm flex items-center gap-1 mt-0.5">
                <Sparkles className="w-4 h-4 text-emerald-600" /> {progress?.readinessScore || 0}% Ready
              </span>
            </div>
          </div>
        </div>

        {/* 2-Column Content: Skills Roadmap & Skill Gap Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Column: Required & Recommended Skills */}
          <div className="lg:col-span-2 space-y-6">
            {/* Core Required Skills */}
            <Card className="p-6 space-y-5 border-border">
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-primary" /> Core Technical Skill Requirements
                </h2>
                <span className="text-xs text-slate-500 font-medium">
                  {requiredSkills.length} Core Competencies
                </span>
              </div>

              <div className="space-y-4">
                {requiredSkills.map((skill, index) => {
                  const isVerified = progress?.verifiedSkills?.some((vs) => vs.name === skill.name);

                  return (
                    <div
                      key={index}
                      className="p-4 rounded-xl border border-border bg-slate-50/60 hover:bg-white hover:shadow-xs transition-all space-y-2"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-slate-900">{skill.name}</span>
                            <Badge
                              variant="outline"
                              className="text-[10px] py-0 border-blue-200 bg-blue-50 text-blue-800"
                            >
                              {skill.proficiency || 'Intermediate'}
                            </Badge>
                            <Badge
                              variant={skill.importance === 'CORE' ? 'primary' : 'outline'}
                              className="text-[10px] py-0"
                            >
                              {skill.importance || 'CORE'}
                            </Badge>
                          </div>
                          <p className="text-xs text-slate-600 leading-relaxed">
                            {skill.description || 'Core engineering proficiency required for daily responsibilities.'}
                          </p>
                        </div>

                        <div className="shrink-0">
                          {isVerified ? (
                            <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full flex items-center gap-1">
                              <Check className="w-3.5 h-3.5" /> Verified
                            </span>
                          ) : (
                            <span className="text-[11px] font-medium text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-full">
                              Skill Gap
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>

            {/* Recommended & Emerging Skills */}
            {recommendedSkills.length > 0 && (
              <Card className="p-6 space-y-4 border-border">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-600" /> Recommended & Emerging Competencies
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {recommendedSkills.map((skill, i) => (
                    <div key={i} className="p-3 rounded-lg border border-border bg-slate-50 text-xs space-y-1">
                      <div className="font-bold text-slate-800">{skill.name}</div>
                      <div className="text-slate-500 text-[11px]">{skill.proficiency || 'Intermediate'} recommended</div>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Employment Opportunities */}
            {path.employmentOpportunities && (
              <Card className="p-6 space-y-3 border-border">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Target className="w-4 h-4 text-emerald-600" /> Target Job Titles in the Industry
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Graduates and interns following this blueprint qualify for roles such as:
                </p>
                <div className="flex flex-wrap gap-2 pt-1">
                  {path.employmentOpportunities.split(',').map((title, i) => (
                    <span
                      key={i}
                      className="text-xs font-semibold px-3 py-1 bg-slate-100 text-slate-800 rounded-lg border border-border"
                    >
                      {title.trim()}
                    </span>
                  ))}
                </div>
              </Card>
            )}
          </div>

          {/* Sidebar Column: Readiness Progress & Skill Gap Analysis */}
          <div className="space-y-6">
            {/* Readiness Score Breakdown */}
            <Card className="p-6 space-y-5 bg-white border-border">
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-600" /> Your Readiness Meter
                </h3>
              </div>

              <div className="text-center space-y-2 py-2">
                <div className="text-4xl font-extrabold text-slate-900">
                  {progress?.readinessScore || 0}%
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div
                    className="bg-emerald-600 h-full transition-all duration-500 rounded-full"
                    style={{ width: `${progress?.readinessScore || 0}%` }}
                  />
                </div>
                <p className="text-xs text-slate-500">
                  Calculated from your verified profile skills and completed course assessments.
                </p>
              </div>

              <div className="space-y-2 text-xs text-slate-600 border-t border-border pt-3">
                <div className="flex items-center justify-between">
                  <span>Verified Core Skills:</span>
                  <span className="font-bold text-slate-900">
                    {progress?.stats?.verifiedSkillsCount || 0} / {requiredSkills.length}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Remaining Skill Gaps:</span>
                  <span className="font-bold text-amber-600">
                    {progress?.stats?.skillGapsCount || 0}
                  </span>
                </div>
              </div>

              <Link href="/student/learn">
                <Button variant="primary" size="sm" className="w-full text-xs">
                  <BookOpen className="w-3.5 h-3.5 mr-1.5" />
                  Browse Relevant Courses
                </Button>
              </Link>
            </Card>

            {/* Learning Milestones Roadmap */}
            {progress?.milestones && (
              <Card className="p-6 space-y-4 border-border">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-primary" /> Preparation Milestones
                </h3>

                <div className="space-y-3">
                  {progress.milestones.map((ms, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-xs">
                      {ms.completed ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      ) : (
                        <div className="w-4 h-4 rounded-full border-2 border-slate-300 shrink-0 mt-0.5" />
                      )}
                      <div>
                        <div className={`font-semibold ${ms.completed ? 'text-slate-900' : 'text-slate-600'}`}>
                          {ms.title}
                        </div>
                        <div className="text-[11px] text-slate-400">{ms.description}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Curated External Resources */}
            {learningResources.length > 0 && (
              <Card className="p-6 space-y-3 border-border">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Recommended Learning Resources
                </h4>
                <div className="space-y-2">
                  {learningResources.map((res, i) => (
                    <a
                      key={i}
                      href={res.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2.5 rounded-lg border border-border bg-slate-50 hover:bg-blue-50/50 flex items-center justify-between text-xs text-slate-700 hover:text-primary transition-colors block"
                    >
                      <span className="font-medium truncate max-w-[200px]">{res.title}</span>
                      <ExternalLink className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    </a>
                  ))}
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
