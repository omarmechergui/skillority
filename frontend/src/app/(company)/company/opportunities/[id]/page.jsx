'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import DashboardShell from '@/components/layout/DashboardShell';
import { companyNav } from '@/components/layout/navigationConfig';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { mockCompanyOpportunities, mockCandidates } from '@/lib/mockCompanyData';
import {
  Briefcase,
  ArrowLeft,
  Users,
  Edit,
  MapPin,
  Calendar,
  Clock,
  CheckCircle2,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';

export default function OpportunityDetailsPage({ params }) {
  const opp = mockCompanyOpportunities.find((o) => o.id === params.id) || mockCompanyOpportunities[0];
  const applicants = mockCandidates;

  return (
    <DashboardShell roleTitle="Recruiter Portal" navItems={companyNav}>
      <div className="space-y-8 max-w-7xl mx-auto">
        {/* Navigation & Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link href="/company/opportunities">
              <Button variant="ghost" className="p-2 text-slate-500 hover:text-slate-900">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <Badge variant="primary" className="text-[10px]">{opp.type}</Badge>
                <Badge variant="outline" className="text-[10px]">{opp.status}</Badge>
              </div>
              <h1 className="text-2xl font-bold text-slate-900">{opp.title}</h1>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <Link href={`/company/opportunities/${opp.id}/edit`}>
              <Button variant="outline" className="text-xs font-semibold flex items-center gap-1.5">
                <Edit className="w-3.5 h-3.5" />
                Edit Listing
              </Button>
            </Link>
            <Link href="/company/applications">
              <Button className="text-xs font-semibold flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5" />
                Review Applications ({opp.applicantsCount})
              </Button>
            </Link>
          </div>
        </div>

        {/* Opportunity Overview Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="p-5">
            <p className="text-xs text-slate-500 font-medium uppercase">Compensation</p>
            <p className="text-xl font-bold text-slate-900">{opp.stipend}</p>
          </Card>
          <Card className="p-5">
            <p className="text-xs text-slate-500 font-medium uppercase">Duration</p>
            <p className="text-xl font-bold text-slate-900">{opp.duration}</p>
          </Card>
          <Card className="p-5">
            <p className="text-xs text-slate-500 font-medium uppercase">Applicants</p>
            <p className="text-xl font-bold text-blue-600">{opp.applicantsCount} Total</p>
          </Card>
          <Card className="p-5">
            <p className="text-xs text-slate-500 font-medium uppercase">Deadline</p>
            <p className="text-xl font-bold text-slate-900">{opp.deadline}</p>
          </Card>
        </div>

        {/* Two-Column Grid: Details & Inflowing Applicants */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Details (2 cols) */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="p-6 space-y-4">
              <h2 className="text-base font-bold text-slate-900">Job Description</h2>
              <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-line">
                {opp.description}
              </p>
            </Card>

            <Card className="p-6 space-y-4">
              <h2 className="text-base font-bold text-slate-900">Key Responsibilities</h2>
              <ul className="space-y-2 text-xs text-slate-600">
                {opp.responsibilities.map((r, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
            </Card>

            <Card className="p-6 space-y-4">
              <h2 className="text-base font-bold text-slate-900">Target Skill Stack</h2>
              <div className="flex flex-wrap gap-2">
                {opp.requiredSkills.map((s) => (
                  <span key={s} className="px-3 py-1 bg-blue-50 text-blue-700 border border-blue-100 rounded-lg text-xs font-semibold">
                    {s}
                  </span>
                ))}
              </div>
            </Card>
          </div>

          {/* Applicant Queue (1 col) */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-900">Recent Applicants</h2>
              <Link href="/company/applications" className="text-xs text-primary font-semibold hover:underline">
                View All
              </Link>
            </div>

            <div className="space-y-3">
              {applicants.map((cand) => (
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
                      <p className="text-[11px] text-slate-500 truncate">{cand.title}</p>
                    </div>
                    <Badge variant="success" className="text-[10px]">
                      {cand.matchScore}%
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-border text-[11px]">
                    <span className="text-slate-400">Stage: <strong className="text-slate-700">{cand.stage}</strong></span>
                    <Link href={`/company/applications/${cand.id}`} className="text-primary font-semibold hover:underline flex items-center gap-1">
                      Review
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

