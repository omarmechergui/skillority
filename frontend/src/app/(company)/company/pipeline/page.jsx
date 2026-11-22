'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import DashboardShell from '@/components/layout/DashboardShell';
import { companyNav } from '@/components/layout/navigationConfig';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { careerApi } from '@/lib/api';
import {
  FileCheck,
  ChevronRight,
  ArrowRight,
  User,
  Clock,
  CheckCircle,
  Sparkles,
  Loader2,
} from 'lucide-react';

const STAGES = ['PENDING', 'REVIEWING', 'SHORTLISTED', 'INTERVIEW', 'OFFERED', 'ACCEPTED'];

export default function RecruitmentPipelinePage() {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadPipeline = async () => {
    setLoading(true);
    try {
      const res = await careerApi.getCompanyApplications();
      const rawApps = Array.isArray(res?.data) ? res.data : (res?.data?.data || []);
      if (rawApps.length > 0) {
        const liveApps = rawApps.map((app) => ({
          id: app.id,
          name:
            [app.student?.profile?.firstName, app.student?.profile?.lastName]
              .filter(Boolean)
              .join(' ') || app.student?.email || 'Candidate',
          appliedRole: app.opportunity?.title || 'Position',
          stage: app.status || 'PENDING',
          matchScore: app.matchScore || 85,
        }));
        setCandidates(liveApps);
      } else {
        setCandidates([]);
      }
    } catch (err) {
      console.error('Failed to load recruitment pipeline:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPipeline();
  }, []);

  const moveCandidate = async (id, newStage) => {
    // Optimistic update
    setCandidates((prev) =>
      prev.map((c) => (c.id === id ? { ...c, stage: newStage } : c))
    );

    try {
      await careerApi.updateApplicationStatus(id, newStage);
    } catch {
      await loadPipeline();
    }
  };

  return (
    <DashboardShell roleTitle="Recruiter Portal" navItems={companyNav}>
      <div className="space-y-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 sm:p-8 rounded-xl border border-border shadow-sm">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-primary">Kanban Workflow</span>
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
              Recruitment Pipeline
            </h1>
            <p className="text-sm text-slate-500 max-w-xl">
              Track candidate progression across hiring stages from initial application to final offer acceptance.
            </p>
          </div>

          <Link href="/company/applications">
            <Button variant="outline" className="text-xs font-semibold">
              List View
            </Button>
          </Link>
        </div>

        {/* Kanban Board */}
        {loading ? (
          <div className="p-16 text-center space-y-3 bg-white rounded-xl border border-border">
            <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto" />
            <p className="text-xs text-slate-500">Loading pipeline board...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-6 gap-3 overflow-x-auto pb-4">
            {STAGES.map((st) => {
              const stageCandidates = candidates.filter((c) => c.stage === st);
              return (
                <div key={st} className="bg-slate-50/70 border border-border rounded-xl p-3 flex flex-col min-w-[200px]">
                  {/* Column Header */}
                  <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-border">
                    <h3 className="font-bold text-[11px] text-slate-800 tracking-wider truncate">{st}</h3>
                    <span className="w-5 h-5 rounded-full bg-white text-slate-600 text-[10px] font-bold flex items-center justify-center border border-border">
                      {stageCandidates.length}
                    </span>
                  </div>

                  {/* Candidate Cards */}
                  <div className="space-y-2 flex-1">
                    {stageCandidates.map((c) => (
                      <Card key={c.id} className="p-3 space-y-2 bg-white hover:shadow-xs transition-shadow border-border">
                        <div>
                          <h4 className="font-bold text-xs text-slate-900 truncate">{c.name}</h4>
                          <p className="text-[10px] text-slate-500 truncate">{c.appliedRole}</p>
                        </div>

                        <div className="flex items-center justify-between text-[10px] pt-1 border-t border-slate-100">
                          <span className="text-emerald-700 font-bold">{c.matchScore}% Match</span>
                          <Link href={`/company/applications/${c.id}`} className="text-primary hover:underline font-semibold">
                            Review
                          </Link>
                        </div>

                        {/* Move to next stage button */}
                        {st !== 'ACCEPTED' && (
                          <button
                            type="button"
                            onClick={() => {
                              const nextIdx = STAGES.indexOf(st) + 1;
                              if (nextIdx < STAGES.length) {
                                moveCandidate(c.id, STAGES[nextIdx]);
                              }
                            }}
                            className="w-full py-1 text-[10px] font-semibold text-slate-600 hover:text-primary bg-slate-50 hover:bg-blue-50 rounded border border-border transition-colors flex items-center justify-center gap-1"
                          >
                            Advance <ArrowRight className="w-2.5 h-2.5" />
                          </button>
                        )}
                      </Card>
                    ))}

                    {stageCandidates.length === 0 && (
                      <div className="text-center py-6 text-[10px] text-slate-400">
                        No candidates
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </DashboardShell>
  );
}
