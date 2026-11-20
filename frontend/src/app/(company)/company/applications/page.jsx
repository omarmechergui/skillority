'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
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
} from 'lucide-react';

export default function ApplicationsInboxPage() {
  const [candidates, setCandidates] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [stageFilter, setStageFilter] = useState('ALL');

  useEffect(() => {
    async function loadApplications() {
      try {
        const res = await careerApi.getCompanyApplications();
        if (res.data?.data && res.data.data.length > 0) {
          const liveApps = res.data.data.map(app => ({
            id: app.id,
            name: [app.student?.profile?.firstName, app.student?.profile?.lastName].filter(Boolean).join(' ') || 'Candidate',
            avatar: app.student?.profile?.avatar || null,
            appliedRole: app.opportunity?.title || 'Position',
            education: 'Skillority Student',
            appliedDate: new Date(app.createdAt).toLocaleDateString(),
            stage: app.status === 'PENDING' ? 'APPLIED' : app.status,
            matchScore: 85,
          }));
          setCandidates(liveApps);
        }
      } catch {
        // Safe fallback
      }
    }
    loadApplications();
  }, []);

  const filtered = candidates.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.appliedRole.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStage = stageFilter === 'ALL' || c.stage === stageFilter;
    return matchesSearch && matchesStage;
  });

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
              Screen candidate resumes, verified course credentials, assessment scores, and move applicants through your pipeline.
            </p>
          </div>

          <Link href="/company/pipeline">
            <Button variant="outline" className="text-xs font-semibold flex items-center gap-1.5">
              <FileCheck className="w-4 h-4 text-primary" />
              Pipeline Kanban
            </Button>
          </Link>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search candidate name or role..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-border bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>

          <div className="inline-flex rounded-lg border border-border p-1 bg-slate-50 text-xs w-full sm:w-auto">
            {['ALL', 'APPLIED', 'SCREENING', 'INTERVIEW', 'OFFER'].map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => setStageFilter(st)}
                className={`flex-1 sm:flex-initial px-3 py-1.5 rounded-md font-medium transition-colors ${
                  stageFilter === st ? 'bg-white shadow-sm text-slate-900' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Candidate Applications Table / Card List */}
        <div className="space-y-3">
          {filtered.length === 0 ? (
            <Card className="p-8 text-center text-slate-500 text-xs">
              No candidate applications found matching the selected filter.
            </Card>
          ) : (
            filtered.map((c) => (
              <Card key={c.id} className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-5 hover:shadow-sm transition-shadow">
                <div className="flex items-center gap-4 min-w-0">
                  <div className="relative w-12 h-12 rounded-full overflow-hidden border border-border flex-shrink-0 bg-slate-100 flex items-center justify-center">
                    {c.avatar ? (
                      <Image
                        src={c.avatar}
                        alt={c.name}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    ) : (
                      <span className="text-slate-400 font-bold text-sm">
                        {c.name ? c.name.charAt(0) : 'C'}
                      </span>
                    )}
                  </div>

                  <div className="min-w-0 space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-slate-900 text-sm truncate">{c.name}</h3>
                      <Badge variant="success" className="text-[10px]">
                        {c.matchScore}% Match
                      </Badge>
                    </div>
                    <p className="text-xs text-slate-500 truncate">
                      Applied for: <strong className="text-slate-700">{c.appliedRole}</strong>
                    </p>
                    <p className="text-[11px] text-slate-400">
                      {c.education} · Applied {c.appliedDate}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between md:justify-end gap-6 pt-3 md:pt-0 border-t md:border-t-0 border-border">
                  <div className="text-left md:text-right">
                    <div className="text-xs font-bold text-slate-800 uppercase tracking-wider">{c.stage}</div>
                    <div className="text-[10px] text-slate-400">Current Pipeline Stage</div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Link href={`/company/applications/${c.id}`}>
                      <Button variant="outline" className="text-xs font-semibold flex items-center gap-1">
                        <Eye className="w-3.5 h-3.5" />
                        Review
                      </Button>
                    </Link>
                    <Link href={`/company/talent/${c.id}/evaluate`}>
                      <Button className="text-xs font-semibold">
                        Evaluate
                      </Button>
                    </Link>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </DashboardShell>
  );
}

