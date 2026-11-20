'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AuthCard } from '@/components/auth/AuthCard';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { OnboardingGuard } from '@/components/auth/OnboardingGuard';

export default function CompanyOnboardingPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    companyName: '',
    industry: 'Technology',
    companySize: '51-200 employees',
    website: '',
    description: '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    router.push('/company/dashboard');
  };

  return (
    <OnboardingGuard requiredRole="COMPANY">
      <AuthCard
        title="Company profile setup"
        subtitle="Establish your organization profile to attract qualified students"
      >
      <form onSubmit={handleSubmit} className="space-y-4 text-left">
        <Input
          label="Company Name"
          id="companyName"
          required
          placeholder="Stripe, Inc."
          value={formData.companyName}
          onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
        />

        <div className="grid grid-cols-2 gap-3">
          <Select
            label="Industry"
            id="industry"
            required
            options={[
              { value: 'Technology', label: 'Technology / Software' },
              { value: 'Finance', label: 'Finance & Banking' },
              { value: 'Healthcare', label: 'Healthcare & Biotech' },
              { value: 'E-commerce', label: 'E-commerce & Retail' },
              { value: 'Education', label: 'Education' },
            ]}
            value={formData.industry}
            onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
          />

          <Select
            label="Company Size"
            id="companySize"
            required
            options={[
              { value: '1-10', label: '1-10 employees' },
              { value: '11-50', label: '11-50 employees' },
              { value: '51-200', label: '51-200 employees' },
              { value: '201-1000', label: '201-1000 employees' },
              { value: '1000+', label: '1000+ employees' },
            ]}
            value={formData.companySize}
            onChange={(e) => setFormData({ ...formData, companySize: e.target.value })}
          />
        </div>

        <Input
          label="Company Website"
          id="website"
          placeholder="https://company.com"
          value={formData.website}
          onChange={(e) => setFormData({ ...formData, website: e.target.value })}
        />

        <Textarea
          label="Company Overview"
          id="description"
          placeholder="Tell prospective candidates about your company mission and culture..."
          rows={3}
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        />

        <Button type="submit" disabled={loading} className="w-full mt-4">
          {loading ? 'Finalizing profile...' : 'Launch Recruiter Dashboard'}
        </Button>
      </form>
    </AuthCard>
    </OnboardingGuard>
  );
}

