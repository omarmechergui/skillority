'use client';

import { useState } from 'react';
import DashboardShell from '@/components/layout/DashboardShell';
import { companyNav } from '@/components/layout/navigationConfig';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { useAuth } from '@/lib/auth';
import {
  User,
  Building,
  Bell,
  Lock,
  Save,
  Check,
} from 'lucide-react';

export default function RecruiterSettingsPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('ACCOUNT');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const [form, setForm] = useState({
    name: user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email : '',
    email: user?.email || '',
    phone: '',
    role: 'Lead Technical Recruiter',
    companyName: user?.companyName || user?.profile?.companyName || '',
    tagline: '',
    website: '',
    headquarters: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
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
              Manage your employer profile, team recruitment preferences, and notifications.
            </p>
          </div>

          {savedSuccess && (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg text-xs font-semibold">
              <Check className="w-4 h-4 text-emerald-600" />
              Settings saved!
            </div>
          )}
        </div>

        {/* Tabs */}
        <div className="flex border-b border-border text-sm font-medium gap-6">
          <button
            type="button"
            onClick={() => setActiveTab('ACCOUNT')}
            className={`pb-3 border-b-2 -mb-px transition-colors ${
              activeTab === 'ACCOUNT' ? 'border-primary text-primary font-bold' : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Personal Recruiter Info
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('COMPANY')}
            className={`pb-3 border-b-2 -mb-px transition-colors ${
              activeTab === 'COMPANY' ? 'border-primary text-primary font-bold' : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Company Profile Info
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          {activeTab === 'ACCOUNT' && (
            <Card className="p-6 sm:p-8 space-y-4">
              <h2 className="text-base font-bold text-slate-900">Recruiter Details</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">Full Name</label>
                  <Input name="name" value={form.name} onChange={handleChange} required />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">Work Email</label>
                  <Input name="email" value={form.email} onChange={handleChange} required />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">Phone</label>
                  <Input name="phone" value={form.phone} onChange={handleChange} />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">Job Title</label>
                  <Input name="role" value={form.role} onChange={handleChange} />
                </div>
              </div>
            </Card>
          )}

          {activeTab === 'COMPANY' && (
            <Card className="p-6 sm:p-8 space-y-4">
              <h2 className="text-base font-bold text-slate-900">Organization Information</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2 space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">Company Name</label>
                  <Input name="companyName" value={form.companyName} onChange={handleChange} required />
                </div>
                <div className="sm:col-span-2 space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">Tagline / Mission</label>
                  <Input name="tagline" value={form.tagline} onChange={handleChange} />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">Website</label>
                  <Input name="website" value={form.website} onChange={handleChange} />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">Headquarters</label>
                  <Input name="headquarters" value={form.headquarters} onChange={handleChange} />
                </div>
              </div>
            </Card>
          )}

          <div className="flex justify-end gap-3">
            <Button type="submit" className="text-xs flex items-center gap-1.5">
              <Save className="w-4 h-4" />
              Save Settings
            </Button>
          </div>
        </form>
      </div>
    </DashboardShell>
  );
}

