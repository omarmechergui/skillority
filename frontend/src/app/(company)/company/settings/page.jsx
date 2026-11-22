'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import DashboardShell from '@/components/layout/DashboardShell';
import { companyNav } from '@/components/layout/navigationConfig';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { useAuth } from '@/lib/auth';
import { profileApi } from '@/lib/api/profiles';
import {
  User,
  Building,
  Save,
  Check,
  AlertCircle,
  Loader2,
  Globe,
  Briefcase,
} from 'lucide-react';

export default function RecruiterSettingsPage() {
  const { user, refreshUser, loginUser } = useAuth();
  const [activeTab, setActiveTab] = useState('COMPANY');
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    avatar: '',
    companyName: '',
    companyDescription: '',
    industry: '',
    companySize: '',
    website: '',
    bio: '',
  });

  useEffect(() => {
    if (user?.profile) {
      const p = user.profile;
      setForm({
        firstName: p.firstName || '',
        lastName: p.lastName || '',
        avatar: p.avatar || '',
        companyName: p.companyName || '',
        companyDescription: p.companyDescription || '',
        industry: p.industry || '',
        companySize: p.companySize || '',
        website: p.website || '',
        bio: p.bio || '',
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

    // Client-side mandatory field checks for company onboarding requirements
    const trimmedCompanyName = form.companyName.trim();
    const trimmedIndustry = form.industry.trim();
    const trimmedCompanySize = form.companySize.trim();

    if (trimmedCompanyName.length < 2) {
      setErrorMessage('Company Name must be at least 2 characters.');
      return;
    }

    if (!trimmedIndustry) {
      setErrorMessage('Industry cannot be empty.');
      return;
    }

    if (!trimmedCompanySize) {
      setErrorMessage('Company Size cannot be empty.');
      return;
    }

    if (form.companyDescription && form.companyDescription.length > 1000) {
      setErrorMessage('Company description cannot exceed 1000 characters.');
      return;
    }

    if (form.bio && form.bio.length > 500) {
      setErrorMessage('Culture / Bio cannot exceed 500 characters.');
      return;
    }

    const payload = {
      firstName: form.firstName.trim() || undefined,
      lastName: form.lastName.trim() || undefined,
      avatar: form.avatar.trim(),
      companyName: trimmedCompanyName,
      companyDescription: form.companyDescription.trim(),
      industry: trimmedIndustry,
      companySize: trimmedCompanySize,
      website: form.website.trim(),
      bio: form.bio.trim(),
    };

    setIsSaving(true);

    try {
      const res = await profileApi.updateMyProfile(payload);

      if (res.error) {
        let msg = res.error.message || 'Failed to update company settings';
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
    <DashboardShell roleTitle="Recruiter Portal" navItems={companyNav}>
      <div className="space-y-8 max-w-4xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 sm:p-8 rounded-xl border border-border shadow-sm">
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
              Recruiter & Company Settings
            </h1>
            <p className="text-sm text-slate-500 max-w-xl">
              Manage your employer profile, corporate branding, and recruitment representative credentials.
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

        {/* Tabs */}
        <div className="flex border-b border-border text-sm font-medium gap-6">
          <button
            type="button"
            onClick={() => setActiveTab('COMPANY')}
            className={`pb-3 border-b-2 -mb-px transition-colors flex items-center gap-2 ${
              activeTab === 'COMPANY'
                ? 'border-primary text-primary font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Building className="w-4 h-4" />
            Company Profile Info
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('ACCOUNT')}
            className={`pb-3 border-b-2 -mb-px transition-colors flex items-center gap-2 ${
              activeTab === 'ACCOUNT'
                ? 'border-primary text-primary font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <User className="w-4 h-4" />
            Recruiter Representative
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          {activeTab === 'COMPANY' && (
            <Card className="p-6 sm:p-8 space-y-6">
              <div>
                <h2 className="text-base font-bold text-slate-900">Organization Information</h2>
                <p className="text-xs text-slate-500">Public profile presented to student applicants and talent pools</p>
              </div>

              {/* Logo / Avatar */}
              <div className="flex flex-col sm:flex-row items-center gap-6 p-4 bg-slate-50/70 border border-border rounded-xl">
                <div className="relative w-16 h-16 rounded-xl overflow-hidden border-2 border-primary/20 bg-slate-100 flex items-center justify-center shrink-0">
                  {form.avatar ? (
                    <Image
                      src={form.avatar}
                      alt="Logo Preview"
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  ) : (
                    <Building className="w-7 h-7 text-primary" />
                  )}
                </div>
                <div className="space-y-1.5 flex-1 w-full text-center sm:text-left">
                  <p className="text-xs font-bold text-slate-900">Company Logo URL</p>
                  <Input
                    name="avatar"
                    type="url"
                    placeholder="https://example.com/logo.png"
                    value={form.avatar}
                    onChange={handleChange}
                    className="text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2 space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">
                    Company Name <span className="text-rose-500">*</span>
                  </label>
                  <Input
                    name="companyName"
                    value={form.companyName}
                    onChange={handleChange}
                    required
                    placeholder="e.g. Genesis Technologies Inc."
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">
                    Industry Domain <span className="text-rose-500">*</span>
                  </label>
                  <Input
                    name="industry"
                    value={form.industry}
                    onChange={handleChange}
                    required
                    placeholder="e.g. Technology & Cloud Computing"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">
                    Company Size <span className="text-rose-500">*</span>
                  </label>
                  <select
                    name="companySize"
                    value={form.companySize}
                    onChange={handleChange}
                    required
                    className="w-full rounded-lg border border-border p-2.5 text-xs bg-white text-slate-800 focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  >
                    <option value="">Select Company Size</option>
                    <option value="1-10">1-10 employees (Startup)</option>
                    <option value="11-50">11-50 employees (Early Growth)</option>
                    <option value="51-200">51-200 employees (Mid-sized)</option>
                    <option value="201-500">201-500 employees (Scale-up)</option>
                    <option value="500+">500+ employees (Enterprise)</option>
                  </select>
                </div>

                <div className="sm:col-span-2 space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">Official Website URL</label>
                  <Input
                    name="website"
                    type="url"
                    value={form.website}
                    onChange={handleChange}
                    placeholder="https://company.com"
                  />
                </div>

                <div className="sm:col-span-2 space-y-1.5">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-semibold text-slate-700">Company Description</label>
                    <span className="text-[10px] text-slate-400">{form.companyDescription.length} / 1000</span>
                  </div>
                  <textarea
                    name="companyDescription"
                    rows={4}
                    maxLength={1000}
                    value={form.companyDescription}
                    onChange={handleChange}
                    placeholder="Describe your organization's mission and engineering products..."
                    className="w-full rounded-lg border border-border p-3 text-xs focus:ring-2 focus:ring-primary/20 focus:border-primary resize-y"
                  />
                </div>

                <div className="sm:col-span-2 space-y-1.5">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-semibold text-slate-700">Engineering & Learning Culture</label>
                    <span className="text-[10px] text-slate-400">{form.bio.length} / 500</span>
                  </div>
                  <textarea
                    name="bio"
                    rows={3}
                    maxLength={500}
                    value={form.bio}
                    onChange={handleChange}
                    placeholder="Highlight your mentoring culture, internship support, and tech stack..."
                    className="w-full rounded-lg border border-border p-3 text-xs focus:ring-2 focus:ring-primary/20 focus:border-primary resize-y"
                  />
                </div>
              </div>
            </Card>
          )}

          {activeTab === 'ACCOUNT' && (
            <Card className="p-6 sm:p-8 space-y-4">
              <div>
                <h2 className="text-base font-bold text-slate-900">Recruiter Details</h2>
                <p className="text-xs text-slate-500">Personal contact details for candidate communications</p>
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
                    <label className="text-xs font-semibold text-slate-700">Work Email</label>
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
              </div>
            </Card>
          )}

          <div className="flex items-center justify-end gap-3 pt-2">
            <Link href="/company/profile">
              <Button type="button" variant="outline" className="text-xs">
                View Company Profile
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
