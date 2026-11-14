'use client';

import { useState } from 'react';
import DashboardShell from '@/components/layout/DashboardShell';
import { instructorNav } from '@/components/layout/navigationConfig';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { mockInstructorProfile } from '@/lib/mockInstructorData';
import { Save, Check } from 'lucide-react';

export default function InstructorSettingsPage() {
  const [form, setForm] = useState({
    name: mockInstructorProfile.name,
    email: mockInstructorProfile.email,
    title: mockInstructorProfile.title,
    bio: mockInstructorProfile.bio,
    phone: mockInstructorProfile.phone,
    website: mockInstructorProfile.website,
  });
  const [saved, setSaved] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
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
              Configure your educator credentials, payout wallet preferences, and notification channels.
            </p>
          </div>

          {saved && (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg text-xs font-semibold">
              <Check className="w-4 h-4 text-emerald-600" />
              Settings saved!
            </div>
          )}
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          <Card className="p-6 sm:p-8 space-y-4">
            <h2 className="text-base font-bold text-slate-900">Educator Information</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">Full Name</label>
                <Input name="name" value={form.name} onChange={handleChange} required />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">Email Address</label>
                <Input name="email" value={form.email} onChange={handleChange} required />
              </div>
              <div className="sm:col-span-2 space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">Title / Designation</label>
                <Input name="title" value={form.title} onChange={handleChange} />
              </div>
              <div className="sm:col-span-2 space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">Bio</label>
                <textarea
                  name="bio"
                  rows={4}
                  value={form.bio}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-border p-3 text-xs focus:ring-2 focus:ring-primary/20 focus:border-primary resize-y"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">Website / Portfolio</label>
                <Input name="website" value={form.website} onChange={handleChange} />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">Phone</label>
                <Input name="phone" value={form.phone} onChange={handleChange} />
              </div>
            </div>
          </Card>

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

