'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import DashboardShell from '@/components/layout/DashboardShell';
import { companyNav } from '@/components/layout/navigationConfig';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { careerApi } from '@/lib/api';
import {
  Users,
  Search,
  Filter,
  CheckCircle,
  Clock,
  ArrowRight,
  Eye,
  FileCheck,
  Sparkles,
  BarChart3,
  Calendar,
  GraduationCap,
  Loader2,
} from 'lucide-react';

const STAGES = ['ALL', 'PENDING', 'REVIEWING', 'SHORTLISTED', 'INTERVIEW', 'OFFERED', 'ACCEPTED', 'REJECTED'];

export default function ApplicationsInboxPage() {
  const searchParams = useSearchParams();
  const initialOppId = searchParams.get('opportunityId') || '';

  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [stageFilter, setStageFilter] = useState('ALL');

  useEffect(() => {
    async function loadApplications() {
      setLoading(true);
      try {
        const params = {};
        if (initialOppId) params.opportunityId = initialOppId;
        if (stageFilter !== 'ALL') params.status = stageFilter;
        if (searchQuery.trim()) params.search = searchQuery.trim();

        const res = await careerApi.getCompanyApplications(params);
        if (Array.isArray(res.data)) {
          setCandidates(res.data);
        }
      } catch (err) {
        console.error('Failed to load applications:', err);
      } finally {
        setLoading(false);
      }
    }
    loadApplications();
  }, [initialOppId, stageFilter, searchQuery]);

  return (
    <DashboardShell roleTitle="Recruiter Portal" navItems={companyNav}>
      <div className="space-y-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 sm:p-8 rounded-xl border border-border shadow-sm">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-primary">Hiring Inbox</span>
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
              Applications Inbox
            </h1>
            <p className="text-sm text-slate-500 max-w-xl">
              Screen candidate resumes, verified course credentials, assessment scores, and move applicants through your recruitment pipeline.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/company/pipeline">
              <Button variant="outline" className="text-xs font-semibold flex items-center gap-1.5">
                <BarChart3 className="w-4 h-4 text-primary" />
                Pipeline Kanban
              </Button>
            </Link>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-xl border border-border shadow-sm">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search candidate name or role..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-border bg-slate-50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
            {STAGES.map((st) => (
              <button
                key={st}
                onClick={() => setStageFilter(st)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                  stageFilter === st
                    ? 'bg-primary text-white shadow-xs'
                    : 'bg-slate-50 border border-border text-slate-600 hover:bg-slate-100'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Candidate Feed */}
        {loading ? (
          <div className="p-16 text-center space-y-3 bg-white rounded-xl border border-border">
            <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto" />
            <p className="text-xs text-slate-500">Loading applicants...</p>
          </div>
        ) : candidates.length === 0 ? (
          <Card className="p-12 text-center space-y-3 border-border">
            <Users className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="text-base font-bold text-slate-800">No applicants found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              No candidates match your current search query or stage filter.
            </p>
          </Card>
        ) : (
          <div className="space-y-4">
            {candidates.map((app) => {
              const candidateName = [app.student?.profile?.firstName, app.student?.profile?.lastName]
                .filter(Boolean)
                .join(' ') || app.student?.email || 'Candidate';
              const certsCount = app.student?.certificates?.length || 0;
              const completedCoursesCount = app.student?.enrollments?.length || 0;
              const matchScore = app.matchScore || 85;

              return (
                <Card
                  key={app.id}
                  className="p-6 bg-white border-border hover:shadow-xs transition-all space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700 font-bold text-base shrink-0">
                        {candidateName.charAt(0).toUpperCase()}
                      </div>

                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-base font-bold text-slate-900">{candidateName}</span>
                          <Badge
                            variant={
                              app.status === 'ACCEPTED'
                                ? 'success'
                                : app.status === 'OFFERED'
                                ? 'primary'
                                : app.status === 'INTERVIEW'
                                ? 'warning'
                                : app.status === 'REJECTED' || app.status === 'WITHDRAWN'
                                ? 'outline'
                                : 'primary'
                            }
                            className="text-[10px] font-bold"
                          >
                            {app.status}
                          </Badge>
                        </div>

                        <div className="text-xs text-slate-600 font-medium">
                          Applied for:{' '}
                          <span className="font-bold text-slate-900">
                            {app.opportunity?.title || 'Open Role'}
                          </span>
                        </div>

                        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 pt-0.5">
                          <span>{app.student?.profile?.university || 'Skillority Student'}</span>
                          <span>·</span>
                          <span>
                            {certsCount} Certificate(s) · {completedCoursesCount} Course(s) Completed
                          </span>
                          <span>·</span>
                          <span>Applied {new Date(app.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <div className="text-right px-3 py-1.5 bg-emerald-50 border border-emerald-200 rounded-lg">
                        <div className="text-sm font-extrabold text-emerald-700 flex items-center gap-1 justify-end">
                          <Sparkles className="w-3.5 h-3.5" /> {matchScore}%
                        </div>
                        <div className="text-[10px] text-emerald-600">Match Score</div>
                      </div>

                      <Link href={`/company/applications/${app.id}`}>
                        <Button variant="primary" size="sm" className="text-xs flex items-center gap-1.5">
                          <Eye className="w-3.5 h-3.5" />
                          Screen Profile
                        </Button>
                      </Link>
                    </div>
                  </div>

                  {app.coverLetter && (
                    <p className="text-xs text-slate-600 line-clamp-2 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                      <span className="font-semibold text-slate-700">Statement: </span>
                      {app.coverLetter}
                    </p>
                  )}
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </DashboardShell>
  );
}
