'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import DashboardShell from '@/components/layout/DashboardShell';
import { studentNav } from '@/components/layout/navigationConfig';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { mockOpportunities, mockCareerHubStats } from '@/lib/mockCareerData';
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
  ExternalLink,
  ShieldCheck
} from 'lucide-react';

const FILTER_TYPES = ['All Types', 'Internship', 'Apprenticeship', 'Full-Time Junior'];
const WORKPLACE_FILTERS = ['All Workplaces', 'Remote', 'Hybrid', 'On-Site'];

export default function StudentCareersPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('All Types');
  const [selectedWorkplace, setSelectedWorkplace] = useState('All Workplaces');
  const [savedIds, setSavedIds] = useState(
    mockOpportunities.filter(o => o.isSaved).map(o => o.id)
  );

  const toggleSave = (id) => {
    setSavedIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const filteredOpportunities = mockOpportunities.filter(opp => {
    const matchesSearch =
      opp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      opp.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      opp.matchedSkills.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesType = selectedType === 'All Types' || opp.type === selectedType;
    const matchesWorkplace =
      selectedWorkplace === 'All Workplaces' || opp.workplaceType === selectedWorkplace;

    return matchesSearch && matchesType && matchesWorkplace;
  });

  return (
    <DashboardShell role="STUDENT" navItems={studentNav}>
      <div className="space-y-8 max-w-7xl mx-auto">
        {/* Breadcrumb & Context Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Link href="/student/dashboard" className="hover:text-primary transition-colors">
              Student Workspace
            </Link>
            <span>/</span>
            <span className="font-semibold text-slate-900">Career & Internships</span>
          </div>

          <div className="flex items-center gap-2">
            <Link href="/student/careers/applications">
              <Button variant="outline" size="sm" className="text-xs">
                <FileCheck2 className="w-4 h-4 mr-1.5 text-primary" />
                My Applications ({mockCareerHubStats.activeApplicationsCount})
              </Button>
            </Link>
          </div>
        </div>

        {/* Hero Banner (Stitch Screen 21 reference) */}
        <div className="bg-white p-6 sm:p-8 rounded-xl border border-border shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <Badge variant="primary" className="text-xs">
                Career Discovery
              </Badge>
              <span className="text-xs text-slate-400">Verified Hiring Partners</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Career & Internship Opportunities
            </h1>
            <p className="text-sm text-slate-600 leading-relaxed">
              Explore vetted roles from technology companies looking for talent with verified coursework. Requirements and candidate selection are managed directly by hiring organizations.
            </p>
          </div>

          {/* Quick Metrics Strip */}
          <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-xl border border-border shrink-0">
            <div className="text-center px-2">
              <div className="text-xl font-bold text-slate-900">{mockOpportunities.length}</div>
              <div className="text-xs text-slate-500">Open Roles</div>
            </div>
            <div className="h-8 w-px bg-slate-200" />
            <div className="text-center px-2">
              <div className="text-xl font-bold text-emerald-600">
                {mockCareerHubStats.interviewInvitesCount}
              </div>
              <div className="text-xs text-slate-500">Interviews</div>
            </div>
            <div className="h-8 w-px bg-slate-200" />
            <div className="text-center px-2">
              <div className="text-xl font-bold text-primary">
                {mockCareerHubStats.savedOpportunitiesCount}
              </div>
              <div className="text-xs text-slate-500">Saved</div>
            </div>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="bg-white p-4 rounded-xl border border-border shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search by role title, company name, or technology skill..."
                className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              />
            </div>

            {/* Workplace selector */}
            <div className="flex items-center gap-2 shrink-0">
              <select
                value={selectedWorkplace}
                onChange={e => setSelectedWorkplace(e.target.value)}
                className="text-xs bg-slate-50 border border-border rounded-lg px-3 py-2 text-slate-700 focus:outline-none focus:ring-1 focus:ring-primary"
              >
                {WORKPLACE_FILTERS.map(w => (
                  <option key={w} value={w}>{w}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Type Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            <span className="text-xs font-semibold text-slate-500 mr-1 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" /> Type:
            </span>
            {FILTER_TYPES.map(type => (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={`px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                  selectedType === type
                    ? 'bg-primary text-white shadow-xs'
                    : 'bg-slate-50 border border-border text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* 2-Column Layout: Opportunities List (Main) + Sidebar Info */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Opportunities Feed */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
              <span>Showing {filteredOpportunities.length} opportunities</span>
              <span>Updated daily by partner companies</span>
            </div>

            {filteredOpportunities.length === 0 ? (
              <Card className="p-8 text-center space-y-3">
                <Briefcase className="w-10 h-10 text-slate-300 mx-auto" />
                <h3 className="text-sm font-bold text-slate-800">No matching opportunities found</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Try adjusting your search criteria or resetting filters to see all available roles.
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
                {filteredOpportunities.map(opp => {
                  const isSaved = savedIds.includes(opp.id);

                  return (
                    <Card
                      key={opp.id}
                      className="p-5 hover:shadow-md hover:border-blue-200 transition-all border-border space-y-4"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-3.5">
                          {/* Company Logo Thumbnail */}
                          <div className="relative w-12 h-12 rounded-xl overflow-hidden border border-slate-200 bg-slate-50 shrink-0">
                            <Image
                              src={opp.companyLogo}
                              alt={opp.company}
                              fill
                              sizes="48px"
                              className="object-cover"
                              unoptimized
                            />
                          </div>

                          <div className="space-y-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="text-xs font-semibold text-slate-500">{opp.company}</span>
                              <Badge variant="outline" className="text-[10px] py-0">
                                {opp.type}
                              </Badge>
                              {opp.featured && (
                                <Badge variant="warning" className="text-[10px] py-0 bg-amber-50 text-amber-800 border-amber-200">
                                  Featured
                                </Badge>
                              )}
                            </div>

                            <h3 className="text-base font-bold text-slate-900 hover:text-primary transition-colors">
                              <Link href={`/student/careers/${opp.id}`}>
                                {opp.title}
                              </Link>
                            </h3>

                            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 pt-0.5">
                              <span className="flex items-center gap-1">
                                <MapPin className="w-3.5 h-3.5 text-slate-400" /> {opp.location}
                              </span>
                              <span>·</span>
                              <span className="flex items-center gap-1 font-semibold text-slate-800">
                                <DollarSign className="w-3.5 h-3.5 text-slate-400" /> {opp.stipend}
                              </span>
                              <span>·</span>
                              <span className="flex items-center gap-1">
                                <Clock className="w-3.5 h-3.5 text-slate-400" /> Posted {opp.postedAt}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Save Button */}
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
                          {isSaved ? <BookmarkCheck className="w-4 h-4 fill-primary" /> : <Bookmark className="w-4 h-4" />}
                        </button>
                      </div>

                      <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                        {opp.description}
                      </p>

                      {/* Matching Skills Badges */}
                      <div className="flex flex-wrap items-center gap-1.5 pt-1">
                        <span className="text-[11px] font-semibold text-slate-500 mr-1">Skills:</span>
                        {opp.matchedSkills.map((skill, i) => (
                          <span
                            key={i}
                            className="text-[11px] px-2 py-0.5 bg-blue-50 text-blue-800 border border-blue-200/80 rounded-md font-medium"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>

                      {/* Card Footer */}
                      <div className="pt-3 border-t border-border flex items-center justify-between">
                        <div className="flex items-center gap-1.5 text-xs">
                          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                          <span className="font-bold text-emerald-700">{opp.skillsMatchPercentage}% Profile Match</span>
                          <span className="text-slate-400 text-[11px]">(Demonstration indicator)</span>
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

          {/* Sidebar Info: Career Hub & Transparency Notice */}
          <div className="space-y-6">
            {/* My Career Hub Card */}
            <Card className="p-5 space-y-4 bg-white border-border">
              <div className="flex items-center justify-between pb-2 border-b border-border">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-primary" /> My Career Activity
                </h3>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg text-xs">
                  <span className="text-slate-600">Active Applications:</span>
                  <span className="font-bold text-slate-900">{mockCareerHubStats.activeApplicationsCount}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg text-xs">
                  <span className="text-slate-600">Saved Opportunities:</span>
                  <span className="font-bold text-slate-900">{savedIds.length}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg text-xs">
                  <span className="text-slate-600">Interview Invitations:</span>
                  <span className="font-bold text-emerald-600">{mockCareerHubStats.interviewInvitesCount}</span>
                </div>
              </div>

              <Link href="/student/careers/applications">
                <Button variant="outline" size="sm" className="w-full text-xs">
                  Open Applications Tracker <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </Button>
              </Link>
            </Card>

            {/* How Career Matching Works (from Stitch design screen 21) */}
            <Card className="p-5 space-y-3 bg-slate-50/70 border-border">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-primary" /> How Opportunities Work
              </h4>
              <ul className="space-y-2 text-xs text-slate-600 leading-relaxed">
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                  <span>Company partners define all internship prerequisites and job specifications.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                  <span>Completing Skillority curriculum chapters strengthens your applicant profile.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                  <span>All hiring interviews and offers are conducted transparently by the employer.</span>
                </li>
              </ul>
            </Card>

            {/* Mentorship Support Callout */}
            <div className="p-4 bg-blue-50/80 rounded-xl border border-blue-200 text-xs text-blue-900 space-y-1.5">
              <p className="font-bold">Career Mentorship Support</p>
              <p className="text-blue-800 leading-relaxed">
                Need review on your technical portfolio? Connect during instructor office hours or attend community review circles.
              </p>
            </div>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}

