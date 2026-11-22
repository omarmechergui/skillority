'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import DashboardShell from '@/components/layout/DashboardShell';
import { instructorNav } from '@/components/layout/navigationConfig';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { useAuth } from '@/lib/auth';
import { profileApi } from '@/lib/api/profiles';
import {
  Save,
  Check,
  AlertCircle,
  Loader2,
  GraduationCap,
  Globe,
  Sparkles,
} from 'lucide-react';

export default function InstructorSettingsPage() {
  const { user, refreshUser, loginUser } = useAuth();
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    avatar: '',
    experience: '',
    expertise: '',
    bio: '',
    website: '',
  });

  useEffect(() => {
    if (user?.profile) {
      const p = user.profile;
      setForm({
        firstName: p.firstName || '',
        lastName: p.lastName || '',
        avatar: p.avatar || '',
        experience: p.experience || '',
        expertise: Array.isArray(p.expertise) ? p.expertise.join(', ') : '',
        bio: p.bio || '',
        website: p.website || '',
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errorMessage) setErrorMessage('');
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSavedSuccess(false);

    // Client-side mandatory onboarding validation for instructor
    const trimmedExperience = form.experience.trim();
    const trimmedExpertise = form.expertise.trim();

    if (!trimmedExperience) {
      setErrorMessage('Professional Headline / Experience cannot be empty.');
      return;
    }

    if (!trimmedExpertise) {
      setErrorMessage('At least one Domain Expertise item is required.');
      return;
    }

    if (form.experience && form.experience.length > 500) {
      setErrorMessage('Experience cannot exceed 500 characters.');
      return;
    }

    if (form.bio && form.bio.length > 500) {
      setErrorMessage('Biography cannot exceed 500 characters.');
      return;
    }

    const payload = {
      firstName: form.firstName.trim() || undefined,
      lastName: form.lastName.trim() || undefined,
      avatar: form.avatar.trim(),
      experience: trimmedExperience,
      expertise: trimmedExpertise,
      bio: form.bio.trim(),
      website: form.website.trim(),
    };

    setIsSaving(true);

    try {
      const res = await profileApi.updateMyProfile(payload);

      if (res.error) {
        let msg = res.error.message || 'Failed to update instructor settings';
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
      setErrorMessage(err.message || 'An unexpected error occurred while saving.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <DashboardShell roleTitle="Instructor Portal" navItems={instructorNav}>
      <div className="space-y-8 max-w-4xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 sm:p-8 rounded-xl border border-border shadow-sm">
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
              Instructor Settings
            </h1>
            <p className="text-sm text-slate-500 max-w-xl">
              Configure your educator credentials, domain expertise, teaching biography, and portfolio details.
            </p>
          </div>

          {savedSuccess && (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg text-xs font-semibold">
              <Check className="w-4 h-4 text-emerald-600" />
              Settings saved successfully!
            </div>
          )}

          {errorMessage && (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-rose-50 text-rose-800 border border-rose-200 rounded-lg text-xs font-semibold">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          <Card className="p-6 sm:p-8 space-y-6">
            <div>
              <h2 className="text-base font-bold text-slate-900">Educator Information</h2>
              <p className="text-xs text-slate-500">Public profile details shown to enrolled students and course browsers</p>
            </div>

            {/* Avatar URL & Preview */}
            <div className="flex flex-col sm:flex-row items-center gap-6 p-4 bg-slate-50/70 border border-border rounded-xl">
              <div className="relative w-16 h-16 rounded-xl overflow-hidden border-2 border-primary/20 bg-slate-100 flex items-center justify-center shrink-0">
                {form.avatar ? (
                  <Image
                    src={form.avatar}
                    alt="Instructor Avatar Preview"
                    fill
                    className="object-cover"
                    unoptimized
                  />
                ) : (
                  <GraduationCap className="w-7 h-7 text-primary" />
                )}
              </div>
              <div className="space-y-1.5 flex-1 w-full text-center sm:text-left">
                <p className="text-xs font-bold text-slate-900">Profile Picture URL</p>
                <Input
                  name="avatar"
                  type="url"
                  placeholder="https://example.com/sarah-photo.jpg"
                  value={form.avatar}
                  onChange={handleChange}
                  className="text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">First Name</label>
                <Input name="firstName" value={form.firstName} onChange={handleChange} required />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">Last Name</label>
                <Input name="lastName" value={form.lastName} onChange={handleChange} required />
              </div>

              <div className="sm:col-span-2 space-y-1.5">
                <div className="flex justify-between items-center">
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
                  <label className="text-xs font-semibold text-slate-700">
                    Professional Headline / Experience <span className="text-rose-500">*</span>
                  </label>
                  <span className="text-[10px] text-slate-400">{form.experience.length} / 500</span>
                </div>
                <Input
                  name="experience"
                  value={form.experience}
                  onChange={handleChange}
                  required
                  placeholder="e.g. Principal Systems Architect · 12+ years building enterprise distributed platforms"
                />
              </div>

              <div className="sm:col-span-2 space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">
                  Domain Expertise (comma-separated, up to 20) <span className="text-rose-500">*</span>
                </label>
                <Input
                  name="expertise"
                  value={form.expertise}
                  onChange={handleChange}
                  required
                  placeholder="Distributed Systems, Cloud Architecture, Kubernetes, High-Performance Databases"
                />
              </div>

              <div className="sm:col-span-2 space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">Personal Website / Academic Portfolio</label>
                <Input
                  name="website"
                  type="url"
                  value={form.website}
                  onChange={handleChange}
                  placeholder="https://instructor-portfolio.com"
                />
              </div>

              <div className="sm:col-span-2 space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-semibold text-slate-700">Biography</label>
                  <span className="text-[10px] text-slate-400">{form.bio.length} / 500</span>
                </div>
                <textarea
                  name="bio"
                  rows={4}
                  maxLength={500}
                  value={form.bio}
                  onChange={handleChange}
                  placeholder="Share your software engineering background, teaching philosophy, and what students will learn from you..."
                  className="w-full rounded-lg border border-border p-3 text-xs focus:ring-2 focus:ring-primary/20 focus:border-primary resize-y"
                />
              </div>
            </div>
          </Card>

          <div className="flex items-center justify-end gap-3 pt-2">
            <Link href="/instructor/profile">
              <Button type="button" variant="outline" className="text-xs">
                View Instructor Profile
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
                  <span>Save Settings</span>
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </DashboardShell>
  );
}
