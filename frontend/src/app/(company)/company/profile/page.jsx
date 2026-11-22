'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import DashboardShell from '@/components/layout/DashboardShell';
import { companyNav } from '@/components/layout/navigationConfig';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { useAuth } from '@/lib/auth';
import { profileApi } from '@/lib/api/profiles';
import {
  Globe,
  Users,
  CheckCircle,
  Briefcase,
  Edit,
  Building,
  Mail,
  Calendar,
  Sparkles,
} from 'lucide-react';

export default function CompanyPublicProfilePage() {
  const { user } = useAuth();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function loadLiveCompanyProfile() {
      try {
        const res = await profileApi.getMyProfile();
        if (isMounted && res.data) {
          setProfileData(res.data);
        }
      } catch {
        // Fall back safely to cached profile in AuthContext
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadLiveCompanyProfile();
    return () => {
      isMounted = false;
    };
  }, []);

  const live = profileData || user?.profile || {};
  const companyName = live.companyName || user?.profile?.companyName || 'Company Profile';
  const industry = live.industry || user?.profile?.industry || 'Technology';
  const companySize = live.companySize || user?.profile?.companySize || 'Size not specified';
  const website = live.website || user?.profile?.website || '';
  const companyDescription = live.companyDescription || user?.profile?.companyDescription || '';
  const bio = live.bio || user?.profile?.bio || '';
  const avatar = live.avatar || user?.profile?.avatar || null;
  const recruiterName = `${live.firstName || user?.profile?.firstName || ''} ${live.lastName || user?.profile?.lastName || ''}`.trim();
  const email = user?.email || '';
  const joinedDate = user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Active Member';

  return (
    <DashboardShell roleTitle="Recruiter Portal" navItems={companyNav}>
      <div className="space-y-8 max-w-7xl mx-auto">
        {/* Cover Photo & Brand Header */}
        <div className="relative rounded-2xl overflow-hidden bg-white border border-border shadow-sm">
          <div className="relative h-48 sm:h-64 w-full bg-slate-900 flex items-center justify-center">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 opacity-90" />
            <div className="relative text-slate-400 font-semibold text-sm flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-400" />
              <span>Verified Employer Organization</span>
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
          </div>

          <div className="px-6 sm:px-8 pb-6 pt-0 relative">
            <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between -mt-14 sm:-mt-16 gap-4 mb-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-end gap-5">
                <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden border-4 border-white shadow-lg bg-white flex items-center justify-center">
                  {avatar ? (
                    <Image
                      src={avatar}
                      alt={companyName}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  ) : (
                    <div className="w-full h-full bg-primary/10 flex items-center justify-center text-primary font-bold text-3xl">
                      {companyName ? companyName[0].toUpperCase() : 'C'}
                    </div>
                  )}
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                      {companyName}
                    </h1>
                    <span className="p-0.5 rounded-full bg-blue-500 text-white" title="Verified Employer">
                      <CheckCircle className="w-4 h-4 fill-blue-500 text-white" />
                    </span>
                  </div>
                  <p className="text-sm font-medium text-slate-600 max-w-xl">
                    {industry} · {companySize}
                  </p>
                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-1">
                    <span className="flex items-center gap-1 font-medium text-slate-700">
                      <Building className="w-3.5 h-3.5 text-primary" />
                      {industry}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-slate-400" />
                      {companySize}
                    </span>
                    {website && (
                      <span className="flex items-center gap-1">
                        <Globe className="w-3.5 h-3.5 text-slate-400" />
                        <a href={website} target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
                          {website.replace(/^https?:\/\//, '')}
                        </a>
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <Link href="/company/settings">
                  <Button variant="outline" className="text-xs font-semibold flex items-center gap-1.5">
                    <Edit className="w-3.5 h-3.5" />
                    Edit Company Profile
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Two-Column Grid: About, Culture & Organization Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card className="p-6 space-y-3">
              <h2 className="text-base font-bold text-slate-900">About Our Company</h2>
              {companyDescription ? (
                <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-line">
                  {companyDescription}
                </p>
              ) : (
                <div className="p-6 text-center text-xs text-slate-400 bg-slate-50 rounded-xl border border-dashed border-border">
                  <p>No company description provided yet.</p>
                  <Link href="/company/settings" className="text-primary font-semibold hover:underline mt-1 inline-block">
                    Add description in Recruiter Settings
                  </Link>
                </div>
              )}
            </Card>

            <Card className="p-6 space-y-3">
              <h2 className="text-base font-bold text-slate-900">Engineering & Learning Culture</h2>
              {bio ? (
                <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-line">
                  {bio}
                </p>
              ) : (
                <div className="p-6 text-center text-xs text-slate-400 bg-slate-50 rounded-xl border border-dashed border-border">
                  <p>No culture description added yet.</p>
                  <Link href="/company/settings" className="text-primary font-semibold hover:underline mt-1 inline-block">
                    Add culture details in Recruiter Settings
                  </Link>
                </div>
              )}
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="p-6 space-y-4">
              <h3 className="text-base font-bold text-slate-900">Company Overview</h3>
              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between border-b border-border pb-2">
                  <span className="text-slate-500">Industry:</span>
                  <span className="font-semibold text-slate-800">{industry}</span>
                </div>
                <div className="flex justify-between border-b border-border pb-2">
                  <span className="text-slate-500">Company Size:</span>
                  <span className="font-semibold text-slate-800">{companySize}</span>
                </div>
                {recruiterName && (
                  <div className="flex justify-between border-b border-border pb-2">
                    <span className="text-slate-500">Lead Recruiter:</span>
                    <span className="font-semibold text-slate-800">{recruiterName}</span>
                  </div>
                )}
                <div className="flex justify-between border-b border-border pb-2">
                  <span className="text-slate-500">Contact Email:</span>
                  <span className="font-medium text-slate-800">{email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Member Since:</span>
                  <span className="font-medium text-slate-700">{joinedDate}</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
