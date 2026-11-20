'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import DashboardShell from '@/components/layout/DashboardShell';
import { companyNav } from '@/components/layout/navigationConfig';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { Briefcase, ArrowLeft, Save } from 'lucide-react';

export default function EditOpportunityPage({ params }) {
  const router = useRouter();
  const [existing] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    department: '',
    location: '',
    type: 'INTERNSHIP',
    stipend: '',
    duration: '',
    deadline: '',
    description: '',
    skills: '',
  });

  if (!existing) {
    return (
      <DashboardShell roleTitle="Recruiter Portal" navItems={companyNav}>
        <div className="space-y-6 max-w-4xl mx-auto py-12 text-center">
          <Card className="p-8 text-center space-y-4">
            <h2 className="text-lg font-bold text-slate-900">Opportunity Not Found</h2>
            <p className="text-sm text-slate-500">The requested opportunity listing could not be found or has not been loaded.</p>
            <Link href="/company/opportunities">
              <Button variant="outline" className="text-xs">Back to Opportunities</Button>
            </Link>
          </Card>
        </div>
      </DashboardShell>
    );
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    router.push(`/company/opportunities/${params.id}`);
  };

  return (
    <DashboardShell roleTitle="Recruiter Portal" navItems={companyNav}>
      <div className="space-y-6 max-w-4xl mx-auto">
        <div className="flex items-center gap-3">
          <Link href={`/company/opportunities/${params.id}`}>
            <Button variant="ghost" className="p-2 text-slate-500 hover:text-slate-900">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Edit Opportunity</h1>
            <p className="text-xs text-slate-500">Update listing details, deadline, or compensation</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card className="p-6 sm:p-8 space-y-5">
            <h2 className="text-base font-bold text-slate-900">Listing Details</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2 space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">Role Title</label>
                <Input
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">Department</label>
                <Input
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">Type</label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-border p-2.5 text-xs bg-white text-slate-900"
                >
                  <option value="Internship">Internship</option>
                  <option value="Full-Time">Full-Time</option>
                  <option value="Apprenticeship">Apprenticeship</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">Location</label>
                <Input
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">Compensation</label>
                <Input
                  name="stipend"
                  value={formData.stipend}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5 pt-2">
              <label className="text-xs font-semibold text-slate-700">Description</label>
              <textarea
                name="description"
                rows={4}
                value={formData.description}
                onChange={handleChange}
                className="w-full rounded-lg border border-border p-3 text-xs focus:ring-2 focus:ring-primary/20 focus:border-primary resize-y"
              />
            </div>
          </Card>

          <div className="flex justify-end gap-3">
            <Link href={`/company/opportunities/${params.id}`}>
              <Button type="button" variant="outline" className="text-xs">
                Cancel
              </Button>
            </Link>
            <Button type="submit" className="text-xs flex items-center gap-1.5">
              <Save className="w-4 h-4" />
              Save Changes
            </Button>
          </div>
        </form>
      </div>
    </DashboardShell>
  );
}

