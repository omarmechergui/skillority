'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import DashboardShell from '@/components/layout/DashboardShell';
import { companyNav } from '@/components/layout/navigationConfig';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { Briefcase, ArrowLeft, Save, Sparkles } from 'lucide-react';

export default function CreateOpportunityPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: '',
    department: '',
    location: '',
    type: 'Internship',
    stipend: '',
    duration: '',
    deadline: '',
    description: '',
    skills: '',
    responsibilities: '',
    requirements: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    router.push('/company/opportunities');
  };

  return (
    <DashboardShell roleTitle="Recruiter Portal" navItems={companyNav}>
      <div className="space-y-6 max-w-4xl mx-auto">
        <div className="flex items-center gap-3">
          <Link href="/company/opportunities">
            <Button variant="ghost" className="p-2 text-slate-500 hover:text-slate-900">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Post New Opportunity</h1>
            <p className="text-xs text-slate-500">Publish a role to attract top-performing Skillority candidates</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card className="p-6 sm:p-8 space-y-5">
            <h2 className="text-base font-bold text-slate-900">Role Basics</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2 space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">Role Title</label>
                <Input
                  name="title"
                  placeholder="e.g. Junior Frontend Developer Intern"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">Department</label>
                <Input
                  name="department"
                  placeholder="e.g. Core Engineering"
                  value={formData.department}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">Opportunity Type</label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-border p-2.5 text-xs bg-white text-slate-900"
                >
                  <option value="Internship">Internship</option>
                  <option value="Full-Time">Full-Time</option>
                  <option value="Part-Time">Part-Time</option>
                  <option value="Apprenticeship">Apprenticeship</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">Location / Workplace</label>
                <Input
                  name="location"
                  placeholder="e.g. Remote · San Francisco, CA"
                  value={formData.location}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">Compensation / Stipend</label>
                <Input
                  name="stipend"
                  placeholder="e.g. $3,800/mo or $85,000/yr"
                  value={formData.stipend}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">Duration</label>
                <Input
                  name="duration"
                  placeholder="e.g. 3 Months (June – August 2026)"
                  value={formData.duration}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">Application Deadline</label>
                <Input
                  type="date"
                  name="deadline"
                  value={formData.deadline}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </Card>

          <Card className="p-6 sm:p-8 space-y-5">
            <h2 className="text-base font-bold text-slate-900">Job Description & Skill Requirements</h2>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">Role Summary</label>
                <textarea
                  name="description"
                  rows={4}
                  placeholder="Describe the mission, team context, and growth opportunities..."
                  value={formData.description}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-border p-3 text-xs focus:ring-2 focus:ring-primary/20 focus:border-primary resize-y"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">Required Skills (comma separated)</label>
                <Input
                  name="skills"
                  placeholder="e.g. React.js, Next.js, Tailwind CSS, TypeScript"
                  value={formData.skills}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">Key Responsibilities (one per line)</label>
                <textarea
                  name="responsibilities"
                  rows={3}
                  placeholder="Collaborate on UI design...&#10;Implement Server Actions..."
                  value={formData.responsibilities}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-border p-3 text-xs focus:ring-2 focus:ring-primary/20 focus:border-primary resize-y"
                />
              </div>
            </div>
          </Card>

          <div className="flex justify-end gap-3">
            <Link href="/company/opportunities">
              <Button type="button" variant="outline" className="text-xs">
                Cancel
              </Button>
            </Link>
            <Button type="submit" className="text-xs flex items-center gap-1.5">
              <Save className="w-4 h-4" />
              Publish Opportunity
            </Button>
          </div>
        </form>
      </div>
    </DashboardShell>
  );
}

