'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import DashboardShell from '@/components/layout/DashboardShell';
import { studentNav } from '@/components/layout/navigationConfig';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { mockProfileDetails } from '@/lib/mockStudentData';
import {
  User,
  Bell,
  Lock,
  Shield,
  Coins,
  Check,
  Save,
  Trash2,
  Eye,
  EyeOff,
  AlertTriangle,
} from 'lucide-react';

export default function StudentSettingsPage() {
  const [activeTab, setActiveTab] = useState('ACCOUNT');
  const [profileForm, setProfileForm] = useState({
    name: mockProfileDetails.name,
    email: mockProfileDetails.email,
    headline: mockProfileDetails.headline,
    bio: mockProfileDetails.bio,
    phone: mockProfileDetails.phone,
    location: mockProfileDetails.location,
    website: mockProfileDetails.website,
    github: mockProfileDetails.github,
    linkedin: mockProfileDetails.linkedin,
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailCourseUpdates: true,
    emailJobMatches: true,
    emailWeeklyDigest: false,
    inAppRewards: true,
    inAppMessages: true,
    inAppMentions: true,
  });

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleToggleNotification = (key) => {
    setNotificationSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <DashboardShell role="STUDENT" navItems={studentNav}>
      <div className="space-y-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 sm:p-8 rounded-xl border border-border shadow-sm">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-primary">Preferences & Security</span>
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
              Account Settings
            </h1>
            <p className="text-sm text-slate-500 max-w-xl">
              Manage your personal information, notification preferences, security settings, and platform credentials.
            </p>
          </div>

          {savedSuccess && (
            <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-semibold animate-fade-in">
              <Check className="w-4 h-4 text-emerald-600" />
              Settings saved successfully!
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
            General Profile
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

        {/* Tab 1: General Profile */}
        {activeTab === 'ACCOUNT' && (
          <form onSubmit={handleSave} className="space-y-6">
            <Card className="p-6 sm:p-8 space-y-6">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Personal Information</h2>
                <p className="text-xs text-slate-500">Update your public student profile and bio details</p>
              </div>

              {/* Avatar Uploader Preview */}
              <div className="flex flex-col sm:flex-row items-center gap-6 p-4 bg-slate-50/70 border border-border rounded-xl">
                <div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-primary bg-white shadow-sm">
                  <Image
                    src={mockProfileDetails.avatar}
                    alt={profileForm.name}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
                <div className="space-y-1 text-center sm:text-left">
                  <p className="text-sm font-bold text-slate-900">Profile Picture</p>
                  <p className="text-xs text-slate-500">PNG, JPG or WebP up to 5MB. 400x400 recommended.</p>
                  <div className="flex gap-2 pt-1 justify-center sm:justify-start">
                    <Button type="button" variant="outline" className="text-xs py-1.5 h-auto">
                      Change Photo
                    </Button>
                    <Button type="button" variant="ghost" className="text-xs py-1.5 h-auto text-rose-600 hover:bg-rose-50">
                      Remove
                    </Button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">Full Name</label>
                  <Input
                    name="name"
                    value={profileForm.name}
                    onChange={handleProfileChange}
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">Email Address</label>
                  <Input
                    name="email"
                    type="email"
                    value={profileForm.email}
                    onChange={handleProfileChange}
                    required
                  />
                </div>

                <div className="sm:col-span-2 space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">Professional Headline</label>
                  <Input
                    name="headline"
                    value={profileForm.headline}
                    onChange={handleProfileChange}
                  />
                </div>

                <div className="sm:col-span-2 space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">Bio</label>
                  <textarea
                    name="bio"
                    rows={4}
                    value={profileForm.bio}
                    onChange={handleProfileChange}
                    className="w-full rounded-lg border border-border p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-y"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">Phone</label>
                  <Input
                    name="phone"
                    value={profileForm.phone}
                    onChange={handleProfileChange}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">Location</label>
                  <Input
                    name="location"
                    value={profileForm.location}
                    onChange={handleProfileChange}
                  />
                </div>
              </div>
            </Card>

            <Card className="p-6 sm:p-8 space-y-6">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Online & Social Links</h2>
                <p className="text-xs text-slate-500">Provide links so recruiters and peers can connect with you</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">Portfolio / Website</label>
                  <Input
                    name="website"
                    value={profileForm.website}
                    onChange={handleProfileChange}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">GitHub Profile</label>
                  <Input
                    name="github"
                    value={profileForm.github}
                    onChange={handleProfileChange}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">LinkedIn Profile</label>
                  <Input
                    name="linkedin"
                    value={profileForm.linkedin}
                    onChange={handleProfileChange}
                  />
                </div>
              </div>
            </Card>

            <div className="flex justify-end gap-3">
              <Button type="button" variant="outline" className="text-xs">
                Cancel
              </Button>
              <Button type="submit" className="text-xs flex items-center gap-1.5">
                <Save className="w-4 h-4" />
                Save Changes
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
                <p className="text-xs text-slate-500">Choose when Skillority sends updates to your inbox</p>
              </div>

              <div className="space-y-4 divide-y divide-border">
                <div className="pt-4 first:pt-0 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">Course & Chapter Updates</p>
                    <p className="text-xs text-slate-500">Receive announcements when instructors release new lessons.</p>
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
                    <p className="text-xs text-slate-500">Alert me when new career roles match my certified skill score.</p>
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
                <h2 className="text-lg font-bold text-slate-900">In-App Alerts</h2>
                <p className="text-xs text-slate-500">Manage bell notifications inside the application workspace</p>
              </div>

              <div className="space-y-4 divide-y divide-border">
                <div className="pt-4 first:pt-0 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">Coins & Reward Notifications</p>
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
                <h2 className="text-lg font-bold text-slate-900">Change Password</h2>
                <p className="text-xs text-slate-500">Ensure your account uses a strong, unique password</p>
              </div>

              <div className="max-w-md space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">Current Password</label>
                  <Input type="password" placeholder="••••••••" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">New Password</label>
                  <Input type="password" placeholder="At least 8 characters" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">Confirm New Password</label>
                  <Input type="password" placeholder="Confirm new password" />
                </div>

                <Button type="button" className="text-xs">
                  Update Password
                </Button>
              </div>
            </Card>

            <Card className="p-6 sm:p-8 space-y-4 border-rose-200 bg-rose-50/20">
              <h2 className="text-base font-bold text-rose-900 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-rose-600" />
                Danger Zone
              </h2>
              <p className="text-xs text-rose-700">
                Permanently delete your Skillority student account, active enrollments, coin balance, and certificates.
              </p>
              <Button type="button" variant="outline" className="text-xs text-rose-600 border-rose-300 hover:bg-rose-50">
                Delete Account
              </Button>
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
                  <p className="text-xs text-slate-500">Allow verified companies on Skillority to view your profile and contact you.</p>
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

