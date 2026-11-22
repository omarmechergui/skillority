'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AuthCard } from '@/components/auth/AuthCard';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { OnboardingGuard } from '@/components/auth/OnboardingGuard';
import { useAuth } from '@/lib/auth';
import { profileApi } from '@/lib/api';

export default function CompanyOnboardingPage() {
  const router = useRouter();
  const { user, refreshUser, loginUser } = useAuth();
  const [formData, setFormData] = useState({
    companyName: '',
    industry: 'Technology',
    companySize: '51-200',
    website: '',
    description: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Pre-fill existing partial company profile if available (e.g. companyName from registration)
  useEffect(() => {
    if (user?.profile) {
      setFormData((prev) => ({
        companyName: prev.companyName || user.profile.companyName || '',
        industry: prev.industry || user.profile.industry || 'Technology',
        companySize: prev.companySize || user.profile.companySize || '51-200',
        website: prev.website || user.profile.website || '',
        description: prev.description || user.profile.companyDescription || user.profile.bio || '',
      }));
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    setError('');

    const companyName = formData.companyName.trim();
    const industry = formData.industry.trim();
    const companySize = formData.companySize.trim();

    if (!companyName) {
      setError('Company Name is required.');
      return;
    }

    if (companyName.length < 2 || companyName.length > 100) {
      setError('Company Name must be between 2 and 100 characters.');
      return;
    }

    if (!industry) {
      setError('Industry is required.');
      return;
    }

    if (!companySize) {
      setError('Company Size is required.');
      return;
    }

    let website = formData.website.trim();
    if (website) {
      if (!/^https?:\/\//i.test(website)) {
        website = `https://${website}`;
      }
      try {
        new URL(website);
      } catch {
        setError('Please enter a valid company website URL (e.g. https://company.com).');
        return;
      }
    }

    const description = formData.description.trim();
    if (description.length > 1000) {
      setError('Company Overview cannot exceed 1000 characters.');
      return;
    }

    const payload = {
      companyName,
      industry,
      companySize,
      website: website || '',
      companyDescription: description || undefined,
      bio: description ? description.slice(0, 500) : undefined,
    };

    setLoading(true);

    try {
      const res = await profileApi.completeCompanyOnboarding(payload);

      if (res.error) {
        const backendDetails = res.error.details?.error?.details;
        let errorMsg = res.error.message || 'Failed to complete company profile setup';
        if (Array.isArray(backendDetails) && backendDetails.length > 0) {
          errorMsg = backendDetails
            .map((d) => (d.field ? `${d.field}: ${d.message}` : d.message))
            .join(', ');
        }
        setError(errorMsg);
        return;
      }

      // Synchronize authenticated session state with fresh data from /auth/me
      try {
        const freshUser = await refreshUser();
        if (!freshUser && res.data?.profile && user) {
          loginUser({ ...user, profile: res.data.profile });
        }
      } catch {
        if (res.data?.profile && user) {
          loginUser({ ...user, profile: res.data.profile });
        }
      }

      // Navigate to Company Dashboard
      router.replace('/company/dashboard');
    } catch (err) {
      setError(err.message || 'An unexpected error occurred while saving company profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <OnboardingGuard requiredRole="COMPANY">
      <AuthCard
        title="Company profile setup"
        subtitle="Establish your organization profile to attract qualified students"
      >
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-xs rounded-md">
            {error}
          </div>
        )}
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

