'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import DashboardShell from '@/components/layout/DashboardShell';
import { companyNav } from '@/components/layout/navigationConfig';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import {
  mockCompanyProfile,
  mockRecruiterUser,
  mockCompanyOpportunities,
  mockCandidates,
} from '@/lib/mockCompanyData';
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
} from 'lucide-react';

export default function CompanyDashboardPage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(mockCompanyProfile);
  const [recruiter, setRecruiter] = useState(mockRecruiterUser);
  const [opportunities, setOpportunities] = useState(mockCompanyOpportunities);
  const [recentApplicants, setRecentApplicants] = useState(mockCandidates.slice(0, 3));

  useEffect(() => {
    async function loadCompanyData() {
      try {
        const [profRes, appsRes] = await Promise.allSettled([
          profileApi.getMyProfile(),
          careerApi.getCompanyApplications()
        ]);

        if (profRes.status === 'fulfilled' && profRes.value?.data?.profile) {
          const live = profRes.value.data.profile;
          setProfile(prev => ({
            ...prev,
            name: live.companyName || prev.name,
            industry: live.industry || prev.industry,
            location: live.location || prev.location
          }));
        }

        if (user) {
          setRecruiter(prev => ({
            ...prev,
            name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email || prev.name,
            role: user.role === 'COMPANY' ? 'Lead Technical Recruiter' : prev.role
          }));
        }

        if (appsRes.status === 'fulfilled' && appsRes.value?.data?.applications?.length > 0) {
          const liveApps = appsRes.value.data.applications.map(a => ({
            id: a.id,
            name: `${a.applicant?.firstName || 'Candidate'} ${a.applicant?.lastName || ''}`.trim(),
            role: a.opportunity?.title || 'Applicant',
            matchScore: 92,
            avatar: a.applicant?.avatarUrl || '/images/avatar-default.png',
            status: a.status,
            appliedDate: new Date(a.createdAt).toLocaleDateString()
          }));
          setRecentApplicants(liveApps.slice(0, 3));
        }
      } catch {
        // Safe fallback
      }
    }
    loadCompanyData();
  }, [user]);

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
              Welcome back, {recruiter.name}
            </h1>
            <p className="text-sm text-slate-500 max-w-xl">
              Track your active job listings, review newly submitted candidate applications, and discover verified learners.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/company/talent">
              <Button variant="outline" className="text-xs font-semibold flex items-center gap-1.5">
                <Users className="w-4 h-4 text-slate-500" />
                Discover Talent
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

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="p-5 flex items-center gap-4">
            <div className="p-3 bg-blue-50 text-primary rounded-xl">
              <Briefcase className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Active Listings</p>
              <p className="text-2xl font-extrabold text-slate-900">{profile.stats.activeListings}</p>
            </div>
          </Card>

          <Card className="p-5 flex items-center gap-4">
            <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Total Applicants</p>
              <p className="text-2xl font-extrabold text-slate-900">{profile.stats.totalApplicants}</p>
            </div>
          </Card>

          <Card className="p-5 flex items-center gap-4">
            <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Interviews</p>
              <p className="text-2xl font-extrabold text-slate-900">{profile.stats.interviewsScheduled}</p>
            </div>
          </Card>

          <Card className="p-5 flex items-center gap-4">
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Offers Extended</p>
              <p className="text-2xl font-extrabold text-slate-900">{profile.stats.offersExtended}</p>
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
                  View All ({opportunities.length})
                </Button>
              </Link>
            </div>

            <div className="space-y-3">
              {opportunities.map((opp) => (
                <Card key={opp.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:shadow-sm transition-shadow">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Badge variant="primary" className="text-[10px]">
                        {opp.type}
                      </Badge>
                      <span className="text-xs text-slate-400">•</span>
                      <span className="text-xs text-slate-500 font-medium">{opp.location}</span>
                    </div>
                    <h3 className="font-bold text-slate-900 text-base leading-snug">
                      {opp.title}
                    </h3>
                    <p className="text-xs text-slate-500">{opp.department}</p>
                  </div>

                  <div className="flex items-center gap-5 sm:text-right">
                    <div>
                      <div className="text-base font-extrabold text-slate-900">
                        {opp.applicantsCount}
                      </div>
                      <div className="text-[11px] text-slate-400">Total Applicants</div>
                    </div>
                    <Link href={`/company/opportunities/${opp.id}`}>
                      <Button variant="outline" className="text-xs font-semibold flex items-center gap-1">
                        Manage
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Button>
                    </Link>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Recent Candidate Applications (1 col) */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Recent Applicants</h2>
                <p className="text-xs text-slate-500">Skillority certified candidates</p>
              </div>
              <Link href="/company/applications">
                <Button variant="ghost" className="text-xs text-primary font-semibold">
                  Inbox
                </Button>
              </Link>
            </div>

            <div className="space-y-3">
              {recentApplicants.map((cand) => (
                <Card key={cand.id} className="p-4 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="relative w-10 h-10 rounded-full overflow-hidden border border-border">
                      <Image
                        src={cand.avatar}
                        alt={cand.name}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="font-bold text-xs text-slate-900 truncate">{cand.name}</h4>
                      <p className="text-[11px] text-slate-500 truncate">{cand.appliedRole}</p>
                    </div>
                    <Badge variant="success" className="text-[10px]">
                      {cand.matchScore}% Match
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-border text-[11px]">
                    <span className="text-slate-400">Stage: <strong className="text-slate-700">{cand.stage}</strong></span>
                    <Link href={`/company/talent/${cand.id}`} className="text-primary font-semibold hover:underline flex items-center gap-1">
                      Review Profile
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}

