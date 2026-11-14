'use client';

import { useState } from 'react';
import DashboardShell from '@/components/layout/DashboardShell';
import { adminNav } from '@/components/layout/navigationConfig';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { Save, Check, Shield } from 'lucide-react';

export default function AdminSettingsPage() {
  const [form, setForm] = useState({
    platformName: 'Skillority Educational Infrastructure',
    supportEmail: 'ops@skillority.com',
    maxDailyMissions: 3,
    chapterUnlockPriceBase: 250,
  });
  const [saved, setSaved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <DashboardShell roleTitle="Platform Admin" navItems={adminNav}>
      <div className="space-y-8 max-w-4xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 sm:p-8 rounded-xl border border-border shadow-sm">
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
              Admin Platform Settings
            </h1>
            <p className="text-sm text-slate-500 max-w-xl">
              Configure platform-level variables, system audit rules, and operational contact emails.
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
            <h2 className="text-base font-bold text-slate-900">Platform Environment Defaults</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">Platform Title</label>
                <Input value={form.platformName} onChange={(e) => setForm({ ...form, platformName: e.target.value })} />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">Operations Email</label>
                <Input value={form.supportEmail} onChange={(e) => setForm({ ...form, supportEmail: e.target.value })} />
              </div>
            </div>
          </Card>

          <div className="flex justify-end gap-3">
            <Button type="submit" className="text-xs flex items-center gap-1.5">
              <Save className="w-4 h-4" />
              Save Platform Configuration
            </Button>
          </div>
        </form>
      </div>
    </DashboardShell>
  );
}

