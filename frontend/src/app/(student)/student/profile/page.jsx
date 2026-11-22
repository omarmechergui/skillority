'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import DashboardShell from '@/components/layout/DashboardShell';
import { studentNav } from '@/components/layout/navigationConfig';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { LoadingState } from '@/components/ui/LoadingState';
import { useAuth } from '@/lib/auth';
import { profileApi } from '@/lib/api/profiles';
import {
  MapPin,
  Mail,
  Calendar,
  Coins,
  Flame,
  Award,
  Briefcase,
  GraduationCap,
  Edit3,
  Share2,
  CheckCircle,
  ExternalLink,
  Target,
  Sparkles,
} from 'lucide-react';

export default function StudentProfilePage() {
  const { user } = useAuth();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('ABOUT');

  // Load real profile from backend on mount
  useEffect(() => {
    let isMounted = true;
    async function loadLiveProfile() {
      try {
        const res = await profileApi.getMyProfile();
        if (isMounted && res.data) {
          setProfileData(res.data);
        }
      } catch {
        // Fall back safely to AuthContext profile
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadLiveProfile();
    return () => {
      isMounted = false;
    };
  }, []);

  // Merge live profile data with AuthContext state
  const live = profileData || user?.profile || {};
  const firstName = live.firstName || user?.profile?.firstName || '';
  const lastName = live.lastName || user?.profile?.lastName || '';
  const fullName = `${firstName} ${lastName}`.trim() || user?.email || 'Student Learner';
  const email = user?.email || '';
  const avatar = live.avatar || user?.profile?.avatar || null;
  const bio = live.bio || user?.profile?.bio || '';
  const university = live.university || user?.profile?.university || '';
  const major = live.major || user?.profile?.major || '';
  const graduationYear = live.graduationYear || user?.profile?.graduationYear || null;
  const skills = Array.isArray(live.skills) ? live.skills : user?.profile?.skills || [];
  const interests = Array.isArray(live.interests) ? live.interests : user?.profile?.interests || [];
  const learningGoals = live.learningGoals || user?.profile?.learningGoals || '';
  const coinsBalance = user?.wallet?.balance ?? 0;
  const joinedDate = user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Recently';

  const headline = major && university
    ? `${major} Student at ${university}`
    : major
    ? `${major} Student`
    : 'Learner on Skillority';

  return (
    <DashboardShell role="STUDENT" navItems={studentNav}>
      <div className="space-y-8 max-w-7xl mx-auto">
        {/* Cover Photo & Hero Header */}
        <div className="relative rounded-2xl overflow-hidden bg-white border border-border shadow-sm">
          {/* Cover Banner */}
          <div className="relative h-48 sm:h-64 w-full bg-slate-900 flex items-center justify-center">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-900/60 via-slate-900 to-indigo-950/80" />
            <div className="relative text-slate-400 font-semibold text-sm flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-400" />
              <span>Student Academic & Skill Portfolio</span>
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
          </div>

          {/* Profile Overview Bar */}
          <div className="px-6 sm:px-8 pb-6 pt-0 relative">
            <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between -mt-16 sm:-mt-20 gap-4 mb-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-end gap-5">
                {/* Avatar */}
                <div className="relative w-28 h-28 sm:w-36 sm:h-36 rounded-2xl overflow-hidden border-4 border-white shadow-lg bg-white flex items-center justify-center">
                  {avatar ? (
                    <Image
                      src={avatar}
                      alt={fullName}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  ) : (
                    <div className="w-full h-full bg-primary/10 flex items-center justify-center text-primary font-bold text-3xl">
                      {firstName ? firstName[0].toUpperCase() : 'S'}
                    </div>
                  )}
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                      {fullName}
                    </h1>
                    <span className="p-0.5 rounded-full bg-blue-500 text-white" title="Verified Learner">
                      <CheckCircle className="w-4 h-4 fill-blue-500 text-white" />
                    </span>
                  </div>
                  <p className="text-sm font-medium text-slate-600 max-w-xl">
                    {headline}
                  </p>
                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-1">
                    {university && (
                      <span className="flex items-center gap-1 font-medium text-slate-700">
                        <GraduationCap className="w-3.5 h-3.5 text-primary" />
                        {university}
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      Joined {joinedDate}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2.5 w-full sm:w-auto">
                <Link href="/student/settings" className="flex-1 sm:flex-initial">
                  <Button variant="outline" className="w-full text-xs font-semibold flex items-center gap-1.5">
                    <Edit3 className="w-3.5 h-3.5" />
                    Edit Profile
                  </Button>
                </Link>
                <Button variant="secondary" className="text-xs font-semibold flex items-center gap-1.5">
                  <Share2 className="w-3.5 h-3.5" />
                  Share
                </Button>
              </div>
            </div>

            {/* Quick Stats Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-border">
              <div className="p-3 bg-amber-50/70 border border-amber-200/60 rounded-xl flex items-center gap-3">
                <div className="p-2 bg-amber-500/20 text-amber-700 rounded-lg">
                  <Coins className="w-4 h-4 fill-amber-500 text-amber-700" />
                </div>
                <div>
                  <p className="text-[11px] font-medium text-amber-800 uppercase tracking-wider">Coin Balance</p>
                  <p className="text-base font-extrabold text-amber-950">{coinsBalance} Coins</p>
                </div>
              </div>

              <div className="p-3 bg-orange-50/70 border border-orange-200/60 rounded-xl flex items-center gap-3">
                <div className="p-2 bg-orange-500/20 text-orange-700 rounded-lg">
                  <Flame className="w-4 h-4 fill-orange-500 text-orange-700" />
                </div>
                <div>
                  <p className="text-[11px] font-medium text-orange-800 uppercase tracking-wider">Study Streak</p>
                  <p className="text-base font-extrabold text-orange-950">Active Streak</p>
                </div>
              </div>

              <div className="p-3 bg-blue-50/70 border border-blue-200/60 rounded-xl flex items-center gap-3">
                <div className="p-2 bg-blue-500/20 text-blue-700 rounded-lg">
                  <Award className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-[11px] font-medium text-blue-800 uppercase tracking-wider">Verified Skills</p>
                  <p className="text-base font-extrabold text-blue-950">{skills.length} Skills</p>
                </div>
              </div>

              <div className="p-3 bg-emerald-50/70 border border-emerald-200/60 rounded-xl flex items-center gap-3">
                <div className="p-2 bg-emerald-500/20 text-emerald-700 rounded-lg">
                  <Briefcase className="w-4 h-4 text-emerald-600" />
                </div>
                <div>
                  <p className="text-[11px] font-medium text-emerald-800 uppercase tracking-wider">Status</p>
                  <p className="text-base font-extrabold text-emerald-950">Active Candidate</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-border text-sm font-medium gap-6">
          <button
            type="button"
            onClick={() => setActiveTab('ABOUT')}
            className={`pb-3 transition-colors border-b-2 -mb-px ${
              activeTab === 'ABOUT'
                ? 'border-primary text-primary font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Overview & Goals
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('PORTFOLIO')}
            className={`pb-3 transition-colors border-b-2 -mb-px ${
              activeTab === 'PORTFOLIO'
                ? 'border-primary text-primary font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Skills & Interests
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('EDUCATION')}
            className={`pb-3 transition-colors border-b-2 -mb-px ${
              activeTab === 'EDUCATION'
                ? 'border-primary text-primary font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Education & Academic Info
          </button>
        </div>

        {/* Tab Contents */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Column (2 cols) */}
          <div className="lg:col-span-2 space-y-6">
            {activeTab === 'ABOUT' && (
              <>
                {/* Bio Card */}
                <Card className="p-6 space-y-4">
                  <h2 className="text-lg font-bold text-slate-900">About Me</h2>
                  {bio ? (
                    <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                      {bio}
                    </p>
                  ) : (
                    <div className="p-6 text-center text-xs text-slate-400 bg-slate-50 rounded-xl border border-dashed border-border">
                      <p>No bio provided yet.</p>
                      <Link href="/student/settings" className="text-primary font-semibold hover:underline mt-1 inline-block">
                        Add a bio in Account Settings
                      </Link>
                    </div>
                  )}
                </Card>

                {/* Learning Goals Card */}
                <Card className="p-6 space-y-4">
                  <div className="flex items-center gap-2">
                    <Target className="w-5 h-5 text-primary" />
                    <h2 className="text-lg font-bold text-slate-900">Learning Goals & Aspirations</h2>
                  </div>
                  {learningGoals ? (
                    <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line bg-blue-50/40 p-4 rounded-xl border border-blue-100">
                      {learningGoals}
                    </p>
                  ) : (
                    <div className="p-6 text-center text-xs text-slate-400 bg-slate-50 rounded-xl border border-dashed border-border">
                      <p>No learning goals specified yet.</p>
                      <Link href="/student/settings" className="text-primary font-semibold hover:underline mt-1 inline-block">
                        Set your goals in Account Settings
                      </Link>
                    </div>
                  )}
                </Card>
              </>
            )}

            {activeTab === 'PORTFOLIO' && (
              <Card className="p-6 space-y-6">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Technical Skills</h2>
                  <p className="text-xs text-slate-500">Skills certified through course completions and profile updates</p>
                </div>

                {skills.length === 0 ? (
                  <div className="p-6 text-center text-xs text-slate-400 bg-slate-50 rounded-xl border border-dashed border-border">
                    <p>No skills added yet.</p>
                    <Link href="/student/settings" className="text-primary font-semibold hover:underline mt-1 inline-block">
                      Add skills in Account Settings
                    </Link>
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {skills.map((skill) => (
                      <span
                        key={skill}
                        className="px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 text-xs font-semibold border border-blue-100"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                )}

                <div className="pt-4 border-t border-border space-y-3">
                  <h3 className="text-sm font-bold text-slate-900">Areas of Interest</h3>
                  {interests.length === 0 ? (
                    <p className="text-xs text-slate-400">No areas of interest added yet.</p>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {interests.map((interest) => (
                        <Badge key={interest} variant="outline" className="text-xs font-medium">
                          {interest}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </Card>
            )}

            {activeTab === 'EDUCATION' && (
              <Card className="p-6 space-y-6">
                <div className="flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-primary" />
                  <div>
                    <h2 className="text-lg font-bold text-slate-900">Academic Education</h2>
                    <p className="text-xs text-slate-500">Verified higher education credentials</p>
                  </div>
                </div>

                {university || major ? (
                  <div className="p-5 rounded-xl border border-slate-200 bg-slate-50/60 space-y-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-bold text-slate-900 text-base">{university || 'University not specified'}</h3>
                        <p className="text-sm font-semibold text-primary">{major || 'Major not specified'}</p>
                      </div>
                      {graduationYear && (
                        <Badge variant="secondary" className="text-xs font-semibold">
                          Class of {graduationYear}
                        </Badge>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="p-6 text-center text-xs text-slate-400 bg-slate-50 rounded-xl border border-dashed border-border">
                    <p>No educational credentials recorded yet.</p>
                    <Link href="/student/settings" className="text-primary font-semibold hover:underline mt-1 inline-block">
                      Update your education in Account Settings
                    </Link>
                  </div>
                )}
              </Card>
            )}
          </div>

          {/* Sidebar (1 col): Contact Details */}
          <div className="space-y-6">
            <Card className="p-6 space-y-4">
              <h2 className="text-base font-bold text-slate-900">Account & Identity</h2>

              <div className="space-y-3 text-xs">
                <div className="flex items-center gap-3 text-slate-600">
                  <Mail className="w-4 h-4 text-slate-400" />
                  <span className="font-medium text-slate-900">{email}</span>
                </div>
                {university && (
                  <div className="flex items-center gap-3 text-slate-600">
                    <GraduationCap className="w-4 h-4 text-slate-400" />
                    <span>{university}</span>
                  </div>
                )}
                {graduationYear && (
                  <div className="flex items-center gap-3 text-slate-600">
                    <Calendar className="w-4 h-4 text-slate-400" />
                    <span>Graduation: {graduationYear}</span>
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-border">
                <Link href="/student/settings">
                  <Button variant="outline" className="w-full text-xs font-semibold">
                    Manage Settings
                  </Button>
                </Link>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
