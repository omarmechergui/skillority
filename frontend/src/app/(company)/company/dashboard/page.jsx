'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import DashboardShell from '@/components/layout/DashboardShell';
import { companyNav } from '@/components/layout/navigationConfig';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { useAuth } from '@/lib/auth';
import { profileApi, careerApi } from '@/lib/api';
import {
  Briefcase,
  Users,
  CheckCircle2,
  Clock,
  ArrowRight,
  TrendingUp,
  Plus,
  Eye,
  Calendar,
  Sparkles,
  MapPin,
  Building2,
  Loader2,
} from 'lucide-react';

export default function CompanyDashboardPage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState({
    name: 'Your Company',
    industry: 'Technology',
    location: '',
  });
  const [metrics, setMetrics] = useState({
    totalOpportunities: 0,
    publishedOpportunities: 0,
    totalApplications: 0,
    pendingReviewCount: 0,
    shortlistedCount: 0,
    upcomingInterviewsCount: 0,
    acceptedCount: 0,
  });
  const [opportunities, setOpportunities] = useState([]);
  const [recentApplicants, setRecentApplicants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCompanyData() {
      setLoading(true);
      try {
        const [profRes, metricsRes, oppsRes, appsRes] = await Promise.allSettled([
          profileApi.getMyProfile(),
          careerApi.getCompanyDashboardMetrics(),
          careerApi.getOpportunities({ companyId: user?.id, limit: 5 }),
          careerApi.getCompanyApplications({ limit: 5 }),
        ]);

        const liveProf = profRes.value?.data?.profile || profRes.value?.data;
        if (profRes.status === 'fulfilled' && liveProf) {
          setProfile({
            name: liveProf.companyName || 'Your Company',
            industry: liveProf.industry || 'Technology',
            location: liveProf.location || '',
          });
        }

        if (metricsRes.status === 'fulfilled' && metricsRes.value?.data) {
          setMetrics(metricsRes.value.data);
        }

        if (oppsRes.status === 'fulfilled') {
          const rawOpps = oppsRes.value?.data?.opportunities || oppsRes.value?.data;
          setOpportunities(Array.isArray(rawOpps) ? rawOpps : []);
        }

        if (appsRes.status === 'fulfilled') {
          const rawApps = appsRes.value?.data || [];
          setRecentApplicants(Array.isArray(rawApps) ? rawApps.slice(0, 4) : []);
        }
      } catch (err) {
        console.error('Failed to load company dashboard:', err);
      } finally {
        setLoading(false);
      }
    }
    loadCompanyData();
  }, [user]);

  const recruiterName = user
    ? `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email
    : 'Recruiter';

  return (
    <DashboardShell roleTitle="Recruiter Portal" navItems={companyNav}>
      <div className="space-y-8 max-w-7xl mx-auto">
        {/* Welcome Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 sm:p-8 rounded-xl border border-border shadow-sm">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-primary">
                {profile.name}
              </span>
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
              Welcome back, {recruiterName}
            </h1>
            <p className="text-sm text-slate-500 max-w-xl">
              Track your active job listings, review newly submitted candidate applications, and discover verified learners.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/company/applications">
              <Button variant="outline" className="text-xs font-semibold flex items-center gap-1.5">
                <Users className="w-4 h-4 text-slate-500" />
                Applications Inbox
              </Button>
            </Link>
            <Link href="/company/opportunities/create">
              <Button className="text-xs font-semibold flex items-center gap-1.5">
                <Plus className="w-4 h-4" />
                Post Opportunity
              </Button>
            </Link>
          </div>
        </div>

        {/* Real Data Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="p-5 flex items-center gap-4 bg-white border-border">
            <div className="p-3 bg-blue-50 text-primary rounded-xl">
              <Briefcase className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Active Listings</p>
              <p className="text-2xl font-extrabold text-slate-900">
                {metrics.publishedOpportunities}
              </p>
            </div>
          </Card>

          <Card className="p-5 flex items-center gap-4 bg-white border-border">
            <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Total Applicants</p>
              <p className="text-2xl font-extrabold text-slate-900">{metrics.totalApplications}</p>
            </div>
          </Card>

          <Card className="p-5 flex items-center gap-4 bg-white border-border">
            <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Interviews</p>
              <p className="text-2xl font-extrabold text-slate-900">
                {metrics.upcomingInterviewsCount}
              </p>
            </div>
          </Card>

          <Card className="p-5 flex items-center gap-4 bg-white border-border">
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Hires Accepted</p>
              <p className="text-2xl font-extrabold text-slate-900">{metrics.acceptedCount}</p>
            </div>
          </Card>
        </div>

        {/* Two-Column Grid: Active Opportunities & Recent Candidates */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Active Opportunities (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Active Job & Internship Listings</h2>
                <p className="text-xs text-slate-500">Manage candidate inflows and view vacancy status</p>
              </div>
              <Link href="/company/opportunities">
                <Button variant="ghost" className="text-xs text-primary font-semibold">
                  View All ({metrics.totalOpportunities})
                </Button>
              </Link>
            </div>

            <div className="space-y-3">
              {opportunities.length === 0 ? (
                <Card className="p-8 text-center text-slate-500 text-xs border-border">
                  No active job or internship listings posted yet. Post your first opportunity to receive verified applicants.
                </Card>
              ) : (
                opportunities.map((opp) => (
                  <Card
                    key={opp.id}
                    className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:shadow-xs transition-shadow bg-white border-border"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-[10px]">
                          {opp.type || 'INTERNSHIP'}
                        </Badge>
                        <Badge
                          variant={opp.isOpen ? 'success' : 'error'}
                          className="text-[10px]"
                        >
                          {opp.isOpen ? 'OPEN' : 'CLOSED'}
                        </Badge>
                        <span className="text-xs text-slate-400">· {opp.workplaceType || 'Remote'}</span>
                      </div>
                      <h3 className="text-sm font-bold text-slate-900 hover:text-primary transition-colors">
                        <Link href={`/company/opportunities/${opp.id}`}>{opp.title}</Link>
                      </h3>
                      <div className="flex items-center gap-3 text-xs text-slate-500">
                        <span>{opp.location || 'Remote'}</span>
                        <span>·</span>
                        <span>Capacity: {opp.filledPositions || 0} / {opp.positions || 1} filled</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <div className="text-right">
                        <div className="text-sm font-bold text-slate-900">
                          {opp._count?.applications || 0}
                        </div>
                        <div className="text-[11px] text-slate-400">Applicants</div>
                      </div>
                      <Link href={`/company/applications?opportunityId=${opp.id}`}>
                        <Button variant="outline" size="sm" className="text-xs">
                          Review
                        </Button>
                      </Link>
                    </div>
                  </Card>
                ))
              )}
            </div>
          </div>

          {/* Recent Candidates (1 col) */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Recent Applicants</h3>
                <p className="text-xs text-slate-500">Candidates awaiting screening</p>
              </div>
              <Link href="/company/applications">
                <Button variant="ghost" className="text-xs text-primary font-semibold">
                  Inbox
                </Button>
              </Link>
            </div>

            <div className="space-y-3">
              {recentApplicants.length === 0 ? (
                <Card className="p-6 text-center text-slate-500 text-xs border-border">
                  No applicants received yet.
                </Card>
              ) : (
                recentApplicants.map((app) => {
                  const candidateName = [app.student?.profile?.firstName, app.student?.profile?.lastName]
                    .filter(Boolean)
                    .join(' ') || app.student?.email || 'Candidate';

                  return (
                    <Card key={app.id} className="p-4 space-y-2 bg-white border-border hover:shadow-xs transition-shadow">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="font-bold text-xs text-slate-900">{candidateName}</div>
                          <div className="text-[11px] text-slate-500 truncate max-w-[180px]">
                            {app.opportunity?.title || 'Applied Position'}
                          </div>
                        </div>
                        <Badge variant="outline" className="text-[10px]">
                          {app.status}
                        </Badge>
                      </div>

                      <div className="pt-2 border-t border-border flex items-center justify-between text-[11px]">
                        <span className="font-bold text-emerald-600">
                          {app.matchScore || 85}% Match
                        </span>
                        <Link href={`/company/applications/${app.id}`}>
                          <span className="text-primary hover:underline font-semibold flex items-center gap-0.5">
                            Screen <ArrowRight className="w-3 h-3" />
                          </span>
                        </Link>
                      </div>
                    </Card>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
