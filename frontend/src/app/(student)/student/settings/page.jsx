'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import DashboardShell from '@/components/layout/DashboardShell';
import { studentNav } from '@/components/layout/navigationConfig';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { useAuth } from '@/lib/auth';
import { profileApi } from '@/lib/api/profiles';
import {
  User,
  GraduationCap,
  Bell,
  Lock,
  Shield,
  Check,
  Save,
  AlertCircle,
  Loader2,
  Sparkles,
} from 'lucide-react';

export default function StudentSettingsPage() {
  const { user, refreshUser, loginUser } = useAuth();
  const [activeTab, setActiveTab] = useState('ACCOUNT');

  // Form state initialized from live user profile
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    bio: '',
    avatar: '',
    university: '',
    major: '',
    graduationYear: '',
    skills: '',
    interests: '',
    learningGoals: '',
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailCourseUpdates: true,
    emailJobMatches: true,
    emailWeeklyDigest: false,
    inAppRewards: true,
    inAppMessages: true,
    inAppMentions: true,
  });

  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Hydrate form whenever user data becomes available
  useEffect(() => {
    if (user?.profile) {
      const p = user.profile;
      setForm({
        firstName: p.firstName || '',
        lastName: p.lastName || '',
        bio: p.bio || '',
        avatar: p.avatar || '',
        university: p.university || '',
        major: p.major || '',
        graduationYear: p.graduationYear ? String(p.graduationYear) : '',
        skills: Array.isArray(p.skills) ? p.skills.join(', ') : '',
        interests: Array.isArray(p.interests) ? p.interests.join(', ') : '',
        learningGoals: p.learningGoals || '',
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errorMessage) setErrorMessage('');
  };

  const handleToggleNotification = (key) => {
    setNotificationSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSavedSuccess(false);

    // Client-side validation for required student onboarding fields
    const trimmedUniversity = form.university.trim();
    const trimmedMajor = form.major.trim();

    if (!trimmedUniversity) {
      setErrorMessage('University or College cannot be empty.');
      return;
    }

    if (!trimmedMajor) {
      setErrorMessage('Major or Field of Study cannot be empty.');
      return;
    }

    let gradYearNum = undefined;
    if (form.graduationYear && form.graduationYear.trim()) {
      gradYearNum = parseInt(form.graduationYear.trim(), 10);
      if (isNaN(gradYearNum) || gradYearNum < 1980 || gradYearNum > 2040) {
        setErrorMessage('Graduation year must be a valid year between 1980 and 2040.');
        return;
      }
    }

    if (form.bio && form.bio.length > 500) {
      setErrorMessage('Bio cannot exceed 500 characters.');
      return;
    }

    if (form.learningGoals && form.learningGoals.length > 500) {
      setErrorMessage('Learning goals cannot exceed 500 characters.');
      return;
    }

    const payload = {
      firstName: form.firstName.trim() || undefined,
      lastName: form.lastName.trim() || undefined,
      bio: form.bio.trim(),
      avatar: form.avatar.trim(),
      university: trimmedUniversity,
      major: trimmedMajor,
      graduationYear: gradYearNum,
      skills: form.skills,
      interests: form.interests,
      learningGoals: form.learningGoals.trim(),
    };

    setIsSaving(true);

    try {
      const res = await profileApi.updateMyProfile(payload);

      if (res.error) {
        let msg = res.error.message || 'Failed to update profile';
        const details = res.error.details?.error?.details || res.error.details;
        if (Array.isArray(details) && details.length > 0) {
          msg = details.map((d) => d.message).join('. ');
        }
        setErrorMessage(msg);
        return;
      }

      // Synchronize session with backend
      try {
        const freshUser = await refreshUser();
        if (!freshUser && res.data && user) {
          loginUser({ ...user, profile: res.data });
        }
      } catch {
        if (res.data && user) {
          loginUser({ ...user, profile: res.data });
        }
      }

      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 4000);
    } catch (err) {
      setErrorMessage(err.message || 'An unexpected error occurred while saving profile.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <DashboardShell role="STUDENT" navItems={studentNav}>
      <div className="space-y-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 sm:p-8 rounded-xl border border-border shadow-sm">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-primary">Student Account</span>
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
              Account Settings
            </h1>
            <p className="text-sm text-slate-500 max-w-xl">
              Manage your personal student information, academic credentials, and learning preferences.
            </p>
          </div>

          {savedSuccess && (
            <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-semibold animate-fade-in">
              <Check className="w-4 h-4 text-emerald-600" />
              Profile updated and synchronized successfully!
            </div>
          )}

          {errorMessage && (
            <div className="flex items-center gap-2 px-4 py-2 bg-rose-50 text-rose-800 border border-rose-200 rounded-xl text-xs font-semibold animate-fade-in">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}
        </div>

        {/* Tab Selection */}
        <div className="flex flex-wrap border-b border-border text-sm font-medium gap-4">
          <button
            type="button"
            onClick={() => setActiveTab('ACCOUNT')}
            className={`flex items-center gap-2 pb-3 transition-colors border-b-2 -mb-px ${
              activeTab === 'ACCOUNT'
                ? 'border-primary text-primary font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <User className="w-4 h-4" />
            General Profile & Education
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('NOTIFICATIONS')}
            className={`flex items-center gap-2 pb-3 transition-colors border-b-2 -mb-px ${
              activeTab === 'NOTIFICATIONS'
                ? 'border-primary text-primary font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Bell className="w-4 h-4" />
            Notifications
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('SECURITY')}
            className={`flex items-center gap-2 pb-3 transition-colors border-b-2 -mb-px ${
              activeTab === 'SECURITY'
                ? 'border-primary text-primary font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Lock className="w-4 h-4" />
            Password & Security
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('PRIVACY')}
            className={`flex items-center gap-2 pb-3 transition-colors border-b-2 -mb-px ${
              activeTab === 'PRIVACY'
                ? 'border-primary text-primary font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Shield className="w-4 h-4" />
            Privacy & Visibility
          </button>
        </div>

        {/* Tab 1: General Profile & Education */}
        {activeTab === 'ACCOUNT' && (
          <form onSubmit={handleSaveProfile} className="space-y-6">
            {/* Identity Card */}
            <Card className="p-6 sm:p-8 space-y-6">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Personal Information</h2>
                <p className="text-xs text-slate-500">Update your public identity details</p>
              </div>

              {/* Avatar Preview & URL */}
              <div className="flex flex-col sm:flex-row items-center gap-6 p-4 bg-slate-50/70 border border-border rounded-xl">
                <div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-primary bg-slate-100 shadow-sm flex items-center justify-center shrink-0">
                  {form.avatar ? (
                    <Image
                      src={form.avatar}
                      alt="Avatar Preview"
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  ) : (
                    <User className="w-8 h-8 text-slate-400" />
                  )}
                </div>
                <div className="space-y-1.5 flex-1 w-full text-center sm:text-left">
                  <p className="text-sm font-bold text-slate-900">Profile Picture URL</p>
                  <p className="text-xs text-slate-500">Enter a direct image link (PNG, JPG, WebP) to display as your avatar</p>
                  <Input
                    name="avatar"
                    type="url"
                    placeholder="https://example.com/avatar.jpg"
                    value={form.avatar}
                    onChange={handleChange}
                    className="text-xs mt-1"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">First Name</label>
                  <Input
                    name="firstName"
                    value={form.firstName}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">Last Name</label>
                  <Input
                    name="lastName"
                    value={form.lastName}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="sm:col-span-2 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-slate-700">Email Address</label>
                    <span className="text-[10px] text-slate-400 bg-slate-100 px-2 py-0.5 rounded font-medium">
                      Managed by account security (Read-only)
                    </span>
                  </div>
                  <Input
                    type="email"
                    value={user?.email || ''}
                    disabled
                    className="bg-slate-100/70 cursor-not-allowed text-slate-500"
                  />
                </div>

                <div className="sm:col-span-2 space-y-1.5">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-semibold text-slate-700">Bio</label>
                    <span className="text-[10px] text-slate-400">{form.bio.length} / 500</span>
                  </div>
                  <textarea
                    name="bio"
                    rows={3}
                    maxLength={500}
                    value={form.bio}
                    onChange={handleChange}
                    placeholder="Tell peers and recruiters about your engineering journey..."
                    className="w-full rounded-lg border border-border p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-y"
                  />
                </div>
              </div>
            </Card>

            {/* Academic Education Card */}
            <Card className="p-6 sm:p-8 space-y-6">
              <div className="flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-primary" />
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Academic Education</h2>
                  <p className="text-xs text-slate-500">Your university degree and expected graduation</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <div className="sm:col-span-2 space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">
                    University / College <span className="text-rose-500">*</span>
                  </label>
                  <Input
                    name="university"
                    value={form.university}
                    onChange={handleChange}
                    required
                    placeholder="e.g. Stanford University"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">Expected Graduation</label>
                  <Input
                    name="graduationYear"
                    type="number"
                    min={1980}
                    max={2040}
                    value={form.graduationYear}
                    onChange={handleChange}
                    placeholder="e.g. 2026"
                  />
                </div>

                <div className="sm:col-span-3 space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">
                    Field of Study / Major <span className="text-rose-500">*</span>
                  </label>
                  <Input
                    name="major"
                    value={form.major}
                    onChange={handleChange}
                    required
                    placeholder="e.g. Computer Science & Software Engineering"
                  />
                </div>
              </div>
            </Card>

            {/* Skills & Goals Card */}
            <Card className="p-6 sm:p-8 space-y-6">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary" />
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Skills & Career Interests</h2>
                  <p className="text-xs text-slate-500">Highlight competencies and learning targets</p>
                </div>
              </div>

              <div className="space-y-5">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">
                    Technical Skills (comma-separated, up to 30)
                  </label>
                  <Input
                    name="skills"
                    value={form.skills}
                    onChange={handleChange}
                    placeholder="React, TypeScript, Node.js, Python, PostgreSQL, Docker"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">
                    Areas of Interest (comma-separated, up to 20)
                  </label>
                  <Input
                    name="interests"
                    value={form.interests}
                    onChange={handleChange}
                    placeholder="Distributed Systems, Machine Learning, Cloud Architecture"
                  />
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-semibold text-slate-700">Learning Goals</label>
                    <span className="text-[10px] text-slate-400">{form.learningGoals.length} / 500</span>
                  </div>
                  <textarea
                    name="learningGoals"
                    rows={3}
                    maxLength={500}
                    value={form.learningGoals}
                    onChange={handleChange}
                    placeholder="What specific engineering goals are you aiming to master next?"
                    className="w-full rounded-lg border border-border p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-y"
                  />
                </div>
              </div>
            </Card>

            <div className="flex items-center justify-end gap-3 pt-2">
              <Link href="/student/profile">
                <Button type="button" variant="outline" className="text-xs">
                  View Profile
                </Button>
              </Link>
              <Button
                type="submit"
                disabled={isSaving}
                className="text-xs flex items-center gap-1.5 min-w-[140px] justify-center"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Save Changes</span>
                  </>
                )}
              </Button>
            </div>
          </form>
        )}

        {/* Tab 2: Notifications */}
        {activeTab === 'NOTIFICATIONS' && (
          <div className="space-y-6">
            <Card className="p-6 sm:p-8 space-y-6">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Email Notifications</h2>
                <p className="text-xs text-slate-500">Configure what updates Skillority sends to your inbox</p>
              </div>

              <div className="space-y-4 divide-y divide-border">
                <div className="pt-4 first:pt-0 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">Course & Chapter Updates</p>
                    <p className="text-xs text-slate-500">Receive announcements when new lessons or chapters unlock.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={notificationSettings.emailCourseUpdates}
                    onChange={() => handleToggleNotification('emailCourseUpdates')}
                    className="w-4 h-4 text-primary rounded border-border focus:ring-primary"
                  />
                </div>

                <div className="pt-4 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">Job Matches & Opportunities</p>
                    <p className="text-xs text-slate-500">Alert me when new internship roles match my certified skills.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={notificationSettings.emailJobMatches}
                    onChange={() => handleToggleNotification('emailJobMatches')}
                    className="w-4 h-4 text-primary rounded border-border focus:ring-primary"
                  />
                </div>

                <div className="pt-4 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">Weekly Progress Digest</p>
                    <p className="text-xs text-slate-500">Summary of weekly study hours, streak status, and coin totals.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={notificationSettings.emailWeeklyDigest}
                    onChange={() => handleToggleNotification('emailWeeklyDigest')}
                    className="w-4 h-4 text-primary rounded border-border focus:ring-primary"
                  />
                </div>
              </div>
            </Card>

            <Card className="p-6 sm:p-8 space-y-6">
              <div>
                <h2 className="text-lg font-bold text-slate-900">In-App Notifications</h2>
                <p className="text-xs text-slate-500">Manage alerts inside the application workspace</p>
              </div>

              <div className="space-y-4 divide-y divide-border">
                <div className="pt-4 first:pt-0 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">Coins & Reward Alerts</p>
                    <p className="text-xs text-slate-500">Show alerts when daily missions, streaks, or quiz coins are claimed.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={notificationSettings.inAppRewards}
                    onChange={() => handleToggleNotification('inAppRewards')}
                    className="w-4 h-4 text-primary rounded border-border focus:ring-primary"
                  />
                </div>

                <div className="pt-4 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">Direct Chat Messages</p>
                    <p className="text-xs text-slate-500">Receive notifications when an instructor or peer messages you.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={notificationSettings.inAppMessages}
                    onChange={() => handleToggleNotification('inAppMessages')}
                    className="w-4 h-4 text-primary rounded border-border focus:ring-primary"
                  />
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Tab 3: Password & Security */}
        {activeTab === 'SECURITY' && (
          <div className="space-y-6">
            <Card className="p-6 sm:p-8 space-y-6">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Account Credentials & Security</h2>
                <p className="text-xs text-slate-500">Credential and session management</p>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-border space-y-2 text-xs text-slate-600">
                <p className="font-semibold text-slate-800">Primary Account Email</p>
                <p>{user?.email || 'Authenticated student session'}</p>
                <p className="text-[11px] text-slate-500 pt-1">
                  Password changes and security token management are handled through the authenticated authentication gateway.
                </p>
              </div>
            </Card>
          </div>
        )}

        {/* Tab 4: Privacy */}
        {activeTab === 'PRIVACY' && (
          <Card className="p-6 sm:p-8 space-y-6">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Profile Visibility & Talent Discovery</h2>
              <p className="text-xs text-slate-500">Configure how recruiters and other students discover you</p>
            </div>

            <div className="space-y-4 divide-y divide-border">
              <div className="pt-4 first:pt-0 flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-900">Recruiter Talent Discovery</p>
                  <p className="text-xs text-slate-500">Allow verified companies on Skillority to view your student profile and invite you to roles.</p>
                </div>
                <input
                  type="checkbox"
                  defaultChecked
                  className="w-4 h-4 text-primary rounded border-border focus:ring-primary"
                />
              </div>

              <div className="pt-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-900">Public Leaderboard Visibility</p>
                  <p className="text-xs text-slate-500">Display your study streak and XP on community study leaderboards.</p>
                </div>
                <input
                  type="checkbox"
                  defaultChecked
                  className="w-4 h-4 text-primary rounded border-border focus:ring-primary"
                />
              </div>
            </div>
          </Card>
        )}
      </div>
    </DashboardShell>
  );
}
