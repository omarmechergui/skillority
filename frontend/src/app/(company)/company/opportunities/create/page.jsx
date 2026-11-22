'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import DashboardShell from '@/components/layout/DashboardShell';
import { companyNav } from '@/components/layout/navigationConfig';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { careerApi } from '@/lib/api';
import {
  Briefcase,
  ArrowLeft,
  Save,
  Sparkles,
  AlertCircle,
  Loader2,
  Building2,
  CheckCircle2,
} from 'lucide-react';

const CATEGORIES = [
  'Software Engineering',
  'Mobile Engineering',
  'Product Design',
  'Data & Analytics',
  'Artificial Intelligence',
  'Security & Operations',
  'Cloud & Infrastructure',
  'Quality Assurance',
  'Product & Strategy',
];

export default function CreateOpportunityPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    category: 'Software Engineering',
    industry: 'Technology',
    type: 'INTERNSHIP',
    workplaceType: 'REMOTE',
    location: 'Remote',
    duration: '3-6 months',
    positions: 1,
    stipend: '$1,200 / month',
    startDate: '',
    deadline: '',
    description: '',
    skills: 'JavaScript, React, Tailwind CSS',
    optionalSkills: 'Next.js, Git & GitHub',
    responsibilities: 'Collaborate with senior engineers to implement UI components\nParticipate in daily agile standups and code reviews\nWrite clean, documented, and tested code',
    benefits: 'Flexible remote working hours\n1-on-1 mentorship with principal engineers\nFull-time conversion opportunity upon completion',
    educationalRequirements: 'Enrolled in or recent graduate of Computer Science, Software Engineering, or related degree',
    status: 'PUBLISHED',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (submitStatus = 'PUBLISHED') => {
    setLoading(true);
    setError(null);

    try {
      const skillsArray = formData.skills
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);

      const optionalSkillsArray = formData.optionalSkills
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);

      const respArray = formData.responsibilities
        .split('\n')
        .map((r) => r.trim())
        .filter(Boolean);

      const benefitsArray = formData.benefits
        .split('\n')
        .map((b) => b.trim())
        .filter(Boolean);

      await careerApi.createOpportunity({
        title: formData.title.trim(),
        description: formData.description.trim(),
        category: formData.category,
        industry: formData.industry,
        type: formData.type,
        workplaceType: formData.workplaceType,
        location: formData.location.trim() || 'Remote',
        duration: formData.duration.trim(),
        positions: Number(formData.positions) || 1,
        stipend: formData.stipend.trim(),
        startDate: formData.startDate ? new Date(formData.startDate).toISOString() : undefined,
        deadline: formData.deadline ? new Date(formData.deadline).toISOString() : undefined,
        skills: skillsArray.length > 0 ? skillsArray : ['General Engineering'],
        optionalSkills: optionalSkillsArray,
        responsibilities: respArray,
        benefits: benefitsArray,
        educationalRequirements: formData.educationalRequirements.trim(),
        status: submitStatus,
      });

      router.push('/company/opportunities');
    } catch (err) {
      setError(err?.message || 'Failed to post opportunity. Please check your inputs.');
    } finally {
      setLoading(false);
    }
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
            <h1 className="text-2xl font-bold text-slate-900">Post New Internship / Opportunity</h1>
            <p className="text-xs text-slate-500">
              Publish a role to attract top-performing Skillority candidates with verified coursework credentials
            </p>
          </div>
        </div>

        {error && (
          <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit('PUBLISHED');
          }}
          className="space-y-6"
        >
          {/* Card 1: Role Overview & Categorization */}
          <Card className="p-6 sm:p-8 space-y-5 bg-white border-border">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-primary" /> Role Overview
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2 space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">Role Title *</label>
                <Input
                  name="title"
                  required
                  placeholder="e.g. Junior React Frontend Engineering Intern"
                  value={formData.title}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">Career Domain *</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full p-2.5 rounded-lg border border-border bg-slate-50 text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">Opportunity Type *</label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="w-full p-2.5 rounded-lg border border-border bg-slate-50 text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                >
                  <option value="INTERNSHIP">Internship</option>
                  <option value="FULL_TIME">Full-Time Junior</option>
                  <option value="PART_TIME">Part-Time</option>
                  <option value="CONTRACT">Contract</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">Work Arrangement *</label>
                <select
                  name="workplaceType"
                  value={formData.workplaceType}
                  onChange={handleChange}
                  className="w-full p-2.5 rounded-lg border border-border bg-slate-50 text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                >
                  <option value="REMOTE">Remote</option>
                  <option value="HYBRID">Hybrid</option>
                  <option value="ONSITE">On-Site</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">Location *</label>
                <Input
                  name="location"
                  required
                  placeholder="e.g. Remote (Global), Tunis, New York"
                  value={formData.location}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">Open Positions Capacity *</label>
                <Input
                  name="positions"
                  type="number"
                  min="1"
                  max="100"
                  required
                  value={formData.positions}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">Monthly Stipend / Compensation</label>
                <Input
                  name="stipend"
                  placeholder="e.g. $1,200 / month, Competitive, Unpaid"
                  value={formData.stipend}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">Duration</label>
                <Input
                  name="duration"
                  placeholder="e.g. 3 months, 6 months"
                  value={formData.duration}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">Application Deadline (Optional)</label>
                <Input
                  name="deadline"
                  type="date"
                  value={formData.deadline}
                  onChange={handleChange}
                />
              </div>
            </div>
          </Card>

          {/* Card 2: Description & Detailed Responsibilities */}
          <Card className="p-6 sm:p-8 space-y-4 bg-white border-border">
            <h2 className="text-base font-bold text-slate-900">Job Description & Responsibilities</h2>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">Overview Description *</label>
              <textarea
                name="description"
                required
                rows={4}
                value={formData.description}
                onChange={handleChange}
                placeholder="Provide a compelling overview of the role, team culture, and the project the intern will work on..."
                className="w-full p-3 rounded-lg border border-border bg-slate-50 text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">Key Responsibilities (One per line)</label>
              <textarea
                name="responsibilities"
                rows={3}
                value={formData.responsibilities}
                onChange={handleChange}
                placeholder="One responsibility per line..."
                className="w-full p-3 rounded-lg border border-border bg-slate-50 text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">Benefits & Perks (One per line)</label>
              <textarea
                name="benefits"
                rows={3}
                value={formData.benefits}
                onChange={handleChange}
                placeholder="One benefit per line..."
                className="w-full p-3 rounded-lg border border-border bg-slate-50 text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>
          </Card>

          {/* Card 3: Skills & Candidate Qualifications */}
          <Card className="p-6 sm:p-8 space-y-4 bg-white border-border">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-600" /> Technical Skills & Qualifications
            </h2>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">
                Required Technical Skills (Comma-separated) *
              </label>
              <Input
                name="skills"
                required
                placeholder="e.g. JavaScript, React, Tailwind CSS, REST APIs"
                value={formData.skills}
                onChange={handleChange}
              />
              <p className="text-[11px] text-slate-400">
                Candidates will be deterministically scored based on these skills and their verified coursework.
              </p>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">
                Optional / Nice-to-Have Skills (Comma-separated)
              </label>
              <Input
                name="optionalSkills"
                placeholder="e.g. Next.js, Docker, TypeScript, Figma"
                value={formData.optionalSkills}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">Educational Requirements</label>
              <Input
                name="educationalRequirements"
                placeholder="e.g. Enrolled in Bachelor or Master of Computer Science, or equivalent bootcamp"
                value={formData.educationalRequirements}
                onChange={handleChange}
              />
            </div>
          </Card>

          {/* Bottom Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              disabled={loading}
              onClick={() => handleSubmit('DRAFT')}
              className="text-xs"
            >
              <Save className="w-4 h-4 mr-1.5" />
              Save as Draft
            </Button>

            <Button
              type="submit"
              variant="primary"
              disabled={loading}
              className="text-xs font-semibold"
            >
              {loading ? (
                <span className="flex items-center gap-1.5">
                  <Loader2 className="w-3.5 h-3.5 animate-spin" /> Publishing...
                </span>
              ) : (
                'Publish Opportunity'
              )}
            </Button>
          </div>
        </form>
      </div>
    </DashboardShell>
  );
}
