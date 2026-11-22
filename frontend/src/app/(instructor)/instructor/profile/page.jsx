'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import DashboardShell from '@/components/layout/DashboardShell';
import { instructorNav } from '@/components/layout/navigationConfig';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { useAuth } from '@/lib/auth';
import { profileApi } from '@/lib/api/profiles';
import {
  Globe,
  Mail,
  Calendar,
  Award,
  BookOpen,
  Edit,
  CheckCircle,
  GraduationCap,
  Sparkles,
} from 'lucide-react';

export default function InstructorMyProfilePage() {
  const { user } = useAuth();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function loadLiveInstructorProfile() {
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
    loadLiveInstructorProfile();
    return () => {
      isMounted = false;
    };
  }, []);

  const live = profileData || user?.profile || {};
  const firstName = live.firstName || user?.profile?.firstName || '';
  const lastName = live.lastName || user?.profile?.lastName || '';
  const name = `${firstName} ${lastName}`.trim() || user?.email || 'Educator on Skillority';
  const experience = live.experience || user?.profile?.experience || 'Accredited Instructor';
  const expertise = Array.isArray(live.expertise) ? live.expertise : user?.profile?.expertise || [];
  const bio = live.bio || user?.profile?.bio || '';
  const website = live.website || user?.profile?.website || '';
  const avatar = live.avatar || user?.profile?.avatar || null;
  const email = user?.email || '';
  const joinedDate = user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A';

  return (
    <DashboardShell roleTitle="Instructor Portal" navItems={instructorNav}>
      <div className="space-y-8 max-w-5xl mx-auto">
        {/* Cover Photo & Header */}
        <div className="relative rounded-2xl overflow-hidden bg-white border border-border shadow-sm">
          <div className="relative h-48 sm:h-64 w-full bg-slate-900 flex items-center justify-center">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-950 via-slate-900 to-blue-950 opacity-90" />
            <div className="relative text-slate-400 font-semibold text-sm flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-400" />
              <span>Certified Platform Instructor</span>
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
                      alt={name}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  ) : (
                    <div className="w-full h-full bg-primary/10 flex items-center justify-center text-primary font-bold text-3xl">
                      {firstName ? firstName[0].toUpperCase() : 'I'}
                    </div>
                  )}
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">{name}</h1>
                    <span className="p-0.5 rounded-full bg-blue-500 text-white" title="Verified Instructor">
                      <CheckCircle className="w-4 h-4 fill-blue-500 text-white" />
                    </span>
                  </div>
                  <p className="text-sm font-medium text-slate-600 max-w-xl">{experience}</p>
                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-1">
                    <span className="flex items-center gap-1">
                      <Mail className="w-3.5 h-3.5 text-slate-400" />
                      {email}
                    </span>
                    {website && (
                      <span className="flex items-center gap-1">
                        <Globe className="w-3.5 h-3.5 text-slate-400" />
                        <a href={website} target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
                          {website.replace(/^https?:\/\//, '')}
                        </a>
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      Joined {joinedDate}
                    </span>
                  </div>
                </div>
              </div>

              <Link href="/instructor/settings">
                <Button variant="outline" className="text-xs font-semibold flex items-center gap-1.5">
                  <Edit className="w-3.5 h-3.5" />
                  Edit Profile
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Bio & Expertise Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="md:col-span-2 p-6 space-y-4">
            <h2 className="text-base font-bold text-slate-900">Instructor Biography</h2>
            {bio ? (
              <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-line">{bio}</p>
            ) : (
              <div className="p-6 text-center text-xs text-slate-400 bg-slate-50 rounded-xl border border-dashed border-border">
                <p>No biography provided yet.</p>
                <Link href="/instructor/settings" className="text-primary font-semibold hover:underline mt-1 inline-block">
                  Add a bio in Instructor Settings
                </Link>
              </div>
            )}
          </Card>

          <Card className="p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-900">Domain Expertise</h3>
            {expertise.length === 0 ? (
              <p className="text-xs text-slate-400">No domain expertise listed.</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {expertise.map((exp) => (
                  <span
                    key={exp}
                    className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 text-xs font-semibold border border-blue-100"
                  >
                    {exp}
                  </span>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>
    </DashboardShell>
  );
}
