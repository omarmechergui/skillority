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
  Briefcase,
  Search,
  MapPin,
  Clock,
  DollarSign,
  Bookmark,
  BookmarkCheck,
  ChevronRight,
  Filter,
  CheckCircle2,
  Sparkles,
  Building2,
  TrendingUp,
  FileCheck2,
  ArrowRight,
  ShieldCheck,
  Compass,
  Target,
  Loader2,
} from 'lucide-react';

const FILTER_TYPES = ['All Types', 'INTERNSHIP', 'FULL_TIME', 'PART_TIME', 'CONTRACT'];
const WORKPLACE_FILTERS = ['All Workplaces', 'REMOTE', 'HYBRID', 'ONSITE'];

export default function StudentCareersPage() {
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('All Types');
  const [selectedWorkplace, setSelectedWorkplace] = useState('All Workplaces');
  const [savedIds, setSavedIds] = useState([]);
  const [stats, setStats] = useState({
    activeApplicationsCount: 0,
    interviewInvitesCount: 0,
  });

  useEffect(() => {
    async function loadCareers() {
      setLoading(true);
      try {
        const [oppsRes, appsRes] = await Promise.all([
          careerApi.getOpportunities({
            search: searchQuery.trim() || undefined,
            type: selectedType !== 'All Types' ? selectedType : undefined,
            workplaceType: selectedWorkplace !== 'All Workplaces' ? selectedWorkplace : undefined,
          }),
          careerApi.getMyApplications().catch(() => ({ data: [] })),
        ]);

        if (oppsRes?.data?.opportunities) {
          setOpportunities(oppsRes.data.opportunities);
        } else if (Array.isArray(oppsRes?.data)) {
          setOpportunities(oppsRes.data);
        }

        const myApps = Array.isArray(appsRes?.data) ? appsRes.data : [];
        const interviewCount = myApps.filter((a) => a.status === 'INTERVIEW').length;
        setStats({
          activeApplicationsCount: myApps.length,
          interviewInvitesCount: interviewCount,
        });
      } catch (err) {
        console.error('Failed to load opportunities:', err);
      } finally {
        setLoading(false);
      }
    }
    loadCareers();
  }, [searchQuery, selectedType, selectedWorkplace]);

  const toggleSave = (id) => {
    setSavedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

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
            <span className="font-semibold text-slate-900">Internship Marketplace</span>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
            <Link href="/student/careers">
              <Button variant="primary" size="sm" className="text-xs">
                <Briefcase className="w-3.5 h-3.5 mr-1.5" />
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
              <Button variant="outline" size="sm" className="text-xs">
                <Target className="w-3.5 h-3.5 mr-1.5 text-slate-500" />
                My Career Dashboard
              </Button>
            </Link>
            <Link href="/student/careers/applications">
              <Button variant="outline" size="sm" className="text-xs">
                <FileCheck2 className="w-3.5 h-3.5 mr-1.5 text-primary" />
                My Applications ({stats.activeApplicationsCount})
              </Button>
            </Link>
          </div>
        </div>

        {/* Hero Banner */}
        <div className="bg-white p-6 sm:p-8 rounded-xl border border-border shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <Badge variant="primary" className="text-xs">
                Career Discovery
              </Badge>
              <span className="text-xs text-slate-400">Verified Hiring Partners</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Internship & Career Opportunities
            </h1>
            <p className="text-sm text-slate-600 leading-relaxed">
              Explore vetted positions from technology companies seeking talent with verified coursework. Requirements and candidate selection are managed directly by hiring organizations.
            </p>
          </div>

          {/* Quick Metrics Strip */}
          <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-xl border border-border shrink-0">
            <div className="text-center px-2">
              <div className="text-xl font-bold text-slate-900">{opportunities.length}</div>
              <div className="text-xs text-slate-500">Open Roles</div>
            </div>
            <div className="h-8 w-px bg-slate-200" />
            <div className="text-center px-2">
              <div className="text-xl font-bold text-emerald-600">
                {stats.interviewInvitesCount}
              </div>
              <div className="text-xs text-slate-500">Interviews</div>
            </div>
            <div className="h-8 w-px bg-slate-200" />
            <div className="text-center px-2">
              <div className="text-xl font-bold text-primary">{savedIds.length}</div>
              <div className="text-xs text-slate-500">Saved</div>
            </div>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="bg-white p-4 rounded-xl border border-border shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by role title, technology stack, or location..."
                className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              />
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <select
                value={selectedWorkplace}
                onChange={(e) => setSelectedWorkplace(e.target.value)}
                className="text-xs bg-slate-50 border border-border rounded-lg px-3 py-2 text-slate-700 focus:outline-none focus:ring-1 focus:ring-primary"
              >
                {WORKPLACE_FILTERS.map((w) => (
                  <option key={w} value={w}>
                    {w === 'All Workplaces' ? 'All Workplaces' : w}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Type Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            <span className="text-xs font-semibold text-slate-500 mr-1 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" /> Type:
            </span>
            {FILTER_TYPES.map((type) => (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={`px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                  selectedType === type
                    ? 'bg-primary text-white shadow-xs'
                    : 'bg-slate-50 border border-border text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                {type === 'All Types' ? 'All Types' : type}
              </button>
            ))}
          </div>
        </div>

        {/* 2-Column Layout: Opportunities Feed + Sidebar Info */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Opportunities Feed */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
              <span>Showing {opportunities.length} opportunities</span>
              <span>Direct hiring by verified partners</span>
            </div>

            {loading ? (
              <div className="p-16 text-center space-y-3 bg-white rounded-xl border border-border">
                <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto" />
                <p className="text-xs text-slate-500">Loading live opportunities...</p>
              </div>
            ) : opportunities.length === 0 ? (
              <Card className="p-10 text-center space-y-3 border-border">
                <Briefcase className="w-10 h-10 text-slate-300 mx-auto" />
                <h3 className="text-sm font-bold text-slate-800">No matching opportunities found</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Try adjusting your search criteria or resetting filters to see all available openings.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedType('All Types');
                    setSelectedWorkplace('All Workplaces');
                  }}
                >
                  Reset Filters
                </Button>
              </Card>
            ) : (
              <div className="space-y-4">
                {opportunities.map((opp) => {
                  const isSaved = savedIds.includes(opp.id);
                  const companyName =
                    typeof opp.company === 'object'
                      ? opp.company?.companyName || 'Verified Partner'
                      : opp.company || 'Verified Partner';
                  const skills = Array.isArray(opp.skills) ? opp.skills : [];
                  const matchScore = opp.matchScore || 85;

                  return (
                    <Card
                      key={opp.id}
                      className="p-5 hover:shadow-md hover:border-blue-200 transition-all border-border space-y-4 bg-white"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-3.5">
                          {/* Company Icon Avatar */}
                          <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-primary shrink-0">
                            <Building2 className="w-6 h-6" />
                          </div>

                          <div className="space-y-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="text-xs font-semibold text-slate-600">{companyName}</span>
                              <Badge variant="outline" className="text-[10px] py-0">
                                {opp.type || 'INTERNSHIP'}
                              </Badge>
                              <Badge variant="outline" className="text-[10px] py-0">
                                {opp.workplaceType || 'REMOTE'}
                              </Badge>
                            </div>

                            <h3 className="text-base font-bold text-slate-900 hover:text-primary transition-colors">
                              <Link href={`/student/careers/${opp.id}`}>{opp.title}</Link>
                            </h3>

                            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 pt-0.5">
                              <span className="flex items-center gap-1">
                                <MapPin className="w-3.5 h-3.5 text-slate-400" /> {opp.location || 'Remote'}
                              </span>
                              <span>·</span>
                              <span className="flex items-center gap-1 font-semibold text-slate-800">
                                <DollarSign className="w-3.5 h-3.5 text-emerald-600" />{' '}
                                {opp.stipend || 'Competitive'}
                              </span>
                              <span>·</span>
                              <span className="flex items-center gap-1">
                                <Clock className="w-3.5 h-3.5 text-slate-400" />{' '}
                                {opp.duration || '3-6 months'}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Save Bookmark Button */}
                        <button
                          type="button"
                          onClick={() => toggleSave(opp.id)}
                          aria-label={isSaved ? 'Unsave opportunity' : 'Save opportunity'}
                          className={`p-2 rounded-lg border transition-colors ${
                            isSaved
                              ? 'bg-blue-50 text-primary border-blue-200'
                              : 'bg-white text-slate-400 border-border hover:text-slate-700 hover:bg-slate-50'
                          }`}
                        >
                          {isSaved ? (
                            <BookmarkCheck className="w-4 h-4 fill-primary" />
                          ) : (
                            <Bookmark className="w-4 h-4" />
                          )}
                        </button>
                      </div>

                      <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                        {opp.description}
                      </p>

                      {/* Skills Badges */}
                      {skills.length > 0 && (
                        <div className="flex flex-wrap items-center gap-1.5 pt-1">
                          <span className="text-[11px] font-semibold text-slate-500 mr-1">Skills:</span>
                          {skills.slice(0, 5).map((skill, i) => (
                            <span
                              key={i}
                              className="text-[11px] px-2 py-0.5 bg-blue-50 text-blue-800 border border-blue-200/80 rounded-md font-medium"
                            >
                              {skill}
                            </span>
                          ))}
                          {skills.length > 5 && (
                            <span className="text-[10px] text-slate-400 font-medium">
                              +{skills.length - 5} more
                            </span>
                          )}
                        </div>
                      )}

                      {/* Card Footer: Match Score & Action */}
                      <div className="pt-3 border-t border-border flex items-center justify-between">
                        <div className="flex items-center gap-1.5 text-xs">
                          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                          <span className="font-bold text-emerald-700">{matchScore}% Match</span>
                          <span className="text-slate-400 text-[11px]">
                            {opp.matchExplanation?.matchedSkills?.length
                              ? `(${opp.matchExplanation.matchedSkills.length} skills matched)`
                              : '(Profile compatibility)'}
                          </span>
                        </div>

                        <Link href={`/student/careers/${opp.id}`}>
                          <Button variant="primary" size="sm" className="text-xs">
                            View Opportunity <ChevronRight className="w-3.5 h-3.5 ml-1" />
                          </Button>
                        </Link>
                      </div>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>

          {/* Sidebar Column */}
          <div className="space-y-6">
            {/* My Career Activity Card */}
            <Card className="p-5 space-y-4 bg-white border-border">
              <div className="flex items-center justify-between pb-2 border-b border-border">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-primary" /> My Career Activity
                </h3>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg text-xs">
                  <span className="text-slate-600">Active Applications:</span>
                  <span className="font-bold text-slate-900">{stats.activeApplicationsCount}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg text-xs">
                  <span className="text-slate-600">Saved Opportunities:</span>
                  <span className="font-bold text-slate-900">{savedIds.length}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg text-xs">
                  <span className="text-slate-600">Interview Invitations:</span>
                  <span className="font-bold text-emerald-600">{stats.interviewInvitesCount}</span>
                </div>
              </div>

              <Link href="/student/careers/applications">
                <Button variant="outline" size="sm" className="w-full text-xs">
                  Open Applications Tracker <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </Button>
              </Link>
            </Card>

            {/* How Recruitment Works */}
            <Card className="p-5 space-y-3 bg-slate-50/70 border-border">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-primary" /> Recruitment Principles
              </h4>
              <ul className="space-y-2 text-xs text-slate-600 leading-relaxed">
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                  <span>Partner companies manage their own hiring specifications and interviews.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                  <span>Verified course completions and assessment badges boost match scores.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                  <span>Direct offers and status changes appear in real-time in your tracker.</span>
                </li>
              </ul>
            </Card>

            {/* Quick Link to Career Paths */}
            <div className="p-4 bg-blue-50/80 rounded-xl border border-blue-200 text-xs text-blue-900 space-y-2">
              <p className="font-bold flex items-center gap-1.5">
                <Compass className="w-4 h-4 text-primary" /> Target Career Blueprints
              </p>
              <p className="text-blue-800 leading-relaxed text-[11px]">
                Not sure which role to target? Explore 13 defined career blueprints with salary insights and required skills.
              </p>
              <Link href="/student/careers/paths">
                <Button variant="outline" size="sm" className="w-full text-xs bg-white text-primary mt-1">
                  Explore Career Paths
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
