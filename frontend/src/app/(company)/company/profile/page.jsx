'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import DashboardShell from '@/components/layout/DashboardShell';
import { companyNav } from '@/components/layout/navigationConfig';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { useAuth } from '@/lib/auth';
import {
  Globe,
  MapPin,
  Calendar,
  Users,
  CheckCircle,
  Briefcase,
  Edit,
  ExternalLink,
} from 'lucide-react';

export default function CompanyPublicProfilePage() {
  const { user } = useAuth();
  const [company] = useState({
    name: user?.companyName || user?.profile?.companyName || 'Your Company',
    tagline: 'Technology & Innovation',
    description: 'Empowering future technical leaders through accredited internships and careers.',
    culture: 'Collaborative, engineering-first environment focused on mentoring and growth.',
    industry: 'Technology',
    headquarters: 'Remote / Global',
    founded: '2024',
    size: '50-200 employees',
    website: 'https://skillority.com',
    coverPhoto: null,
    logo: null,
    benefits: ['Accredited Skill Certifications', 'Flexible Working Hours', 'Mentorship Opportunities', 'Competitive Stipend'],
    stats: {
      activeListings: 0,
    },
  });

  return (
    <DashboardShell roleTitle="Recruiter Portal" navItems={companyNav}>
      <div className="space-y-8 max-w-7xl mx-auto">
        {/* Cover Photo & Brand Header */}
        <div className="relative rounded-2xl overflow-hidden bg-white border border-border shadow-sm">
          <div className="relative h-48 sm:h-64 w-full bg-slate-800 flex items-center justify-center">
            {company.coverPhoto ? (
              <Image
                src={company.coverPhoto}
                alt={company.name}
                fill
                className="object-cover opacity-80"
                unoptimized
              />
            ) : (
              <div className="text-slate-500 font-bold text-sm">Company Cover Banner</div>
            )}
          </div>

          <div className="px-6 sm:px-8 pb-6 pt-0 relative">
            <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between -mt-14 sm:-mt-16 gap-4 mb-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-end gap-5">
                <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden border-4 border-white shadow-lg bg-white flex items-center justify-center">
                  {company.logo ? (
                    <Image
                      src={company.logo}
                      alt={company.name}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  ) : (
                    <Briefcase className="w-10 h-10 text-primary" />
                  )}
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                      {company.name}
                    </h1>
                    <span className="p-0.5 rounded-full bg-blue-500 text-white" title="Verified Employer">
                      <CheckCircle className="w-4 h-4 fill-blue-500 text-white" />
                    </span>
                  </div>
                  <p className="text-sm font-medium text-slate-600 max-w-xl">
                    {company.tagline}
                  </p>
                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-1">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      {company.headquarters}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-slate-400" />
                      {company.size}
                    </span>
                    <span className="flex items-center gap-1">
                      <Globe className="w-3.5 h-3.5 text-slate-400" />
                      <a href={company.website} target="_blank" rel="noopener noreferrer" className="hover:text-primary">
                        {company.website.replace('https://', '')}
                      </a>
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <Link href="/company/settings">
                  <Button variant="outline" className="text-xs font-semibold flex items-center gap-1.5">
                    <Edit className="w-3.5 h-3.5" />
                    Edit Profile
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Two-Column Grid: About, Culture & Benefits */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card className="p-6 space-y-3">
              <h2 className="text-base font-bold text-slate-900">About Our Company</h2>
              <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-line">
                {company.description}
              </p>
            </Card>

            <Card className="p-6 space-y-3">
              <h2 className="text-base font-bold text-slate-900">Engineering & Learning Culture</h2>
              <p className="text-xs text-slate-600 leading-relaxed">
                {company.culture}
              </p>
            </Card>

            <Card className="p-6 space-y-3">
              <h2 className="text-base font-bold text-slate-900">Employee Benefits & Perks</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600">
                {company.benefits.map((b, i) => (
                  <div key={i} className="flex items-center gap-2 p-2 bg-slate-50 rounded-lg border border-border">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span>{b}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="p-6 space-y-4">
              <h3 className="text-base font-bold text-slate-900">Company Overview</h3>
              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between border-b border-border pb-2">
                  <span className="text-slate-500">Industry:</span>
                  <span className="font-semibold text-slate-800">{company.industry}</span>
                </div>
                <div className="flex justify-between border-b border-border pb-2">
                  <span className="text-slate-500">Company Size:</span>
                  <span className="font-semibold text-slate-800">{company.size}</span>
                </div>
                <div className="flex justify-between border-b border-border pb-2">
                  <span className="text-slate-500">Founded:</span>
                  <span className="font-semibold text-slate-800">{company.founded}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Active Roles:</span>
                  <span className="font-bold text-blue-600">{company.stats.activeListings} Openings</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}

