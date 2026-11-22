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

export default function StudentOnboardingPage() {
  const router = useRouter();
  const { user, refreshUser, loginUser } = useAuth();
  const [formData, setFormData] = useState({
    university: '',
    major: '',
    graduationYear: '2026',
    learningGoals: '',
    skills: '',
    bio: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Pre-fill existing partial profile data if available
  useEffect(() => {
    if (user?.profile) {
      setFormData((prev) => ({
        university: prev.university || user.profile.university || '',
        major: prev.major || user.profile.major || '',
        graduationYear:
          prev.graduationYear ||
          (user.profile.graduationYear ? String(user.profile.graduationYear) : '2026'),
        learningGoals: prev.learningGoals || user.profile.learningGoals || '',
        skills:
          prev.skills ||
          (Array.isArray(user.profile.skills) ? user.profile.skills.join(', ') : ''),
        bio: prev.bio || user.profile.bio || '',
      }));
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    setError('');

    const university = formData.university.trim();
    const major = formData.major.trim();

    if (!university) {
      setError('University or School is required.');
      return;
    }

    if (!major) {
      setError('Field of Study / Major is required.');
      return;
    }

    const gradYearNum = parseInt(formData.graduationYear, 10);
    if (isNaN(gradYearNum) || gradYearNum < 2000 || gradYearNum > 2040) {
      setError('Please select a valid graduation year between 2000 and 2040.');
      return;
    }

    const skillsArray = formData.skills
      ? formData.skills
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean)
      : [];

    if (skillsArray.length > 20) {
      setError('You can enter a maximum of 20 skills.');
      return;
    }

    const payload = {
      university,
      major,
      graduationYear: gradYearNum,
      skills: skillsArray,
      learningGoals: formData.learningGoals.trim() || undefined,
      bio: formData.bio ? formData.bio.trim() || undefined : undefined,
    };

    setLoading(true);

    try {
      const res = await profileApi.completeStudentOnboarding(payload);

      if (res.error) {
        const backendDetails = res.error.details?.error?.details;
        let errorMsg = res.error.message || 'Failed to complete onboarding';
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

      // Navigate to student dashboard
      router.replace('/student/dashboard');
    } catch (err) {
      setError(err.message || 'An unexpected error occurred while saving profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <OnboardingGuard requiredRole="STUDENT">
      <AuthCard
        title="Complete student profile"
        subtitle="Help instructors and recruiters get to know your background"
      >
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-xs rounded-md">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          <Input
            label="University or School"
            id="university"
            required
            placeholder="Stanford University"
            value={formData.university}
            onChange={(e) => setFormData({ ...formData, university: e.target.value })}
          />

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Field of Study / Major"
              id="major"
              required
              placeholder="Computer Science"
              value={formData.major}
              onChange={(e) => setFormData({ ...formData, major: e.target.value })}
            />

            <Select
              label="Graduation Year"
              id="graduationYear"
              required
              options={[
                { value: '2024', label: '2024' },
                { value: '2025', label: '2025' },
                { value: '2026', label: '2026' },
                { value: '2027', label: '2027' },
                { value: '2028', label: '2028' },
              ]}
              value={formData.graduationYear}
              onChange={(e) => setFormData({ ...formData, graduationYear: e.target.value })}
            />
          </div>

          <Input
            label="Key Technical Skills (comma separated)"
            id="skills"
            placeholder="React, Node.js, Python, PostgreSQL"
            helperText="These skills will be showcased on your candidate talent profile."
            value={formData.skills}
            onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
          />

          <Textarea
            label="Learning Goals & Aspirations"
            id="learningGoals"
            placeholder="Describe what skills you hope to master on Skillority..."
            rows={3}
            value={formData.learningGoals}
            onChange={(e) => setFormData({ ...formData, learningGoals: e.target.value })}
          />

          <Button type="submit" disabled={loading} className="w-full mt-4">
            {loading ? 'Saving profile...' : 'Complete Setup & Go to Dashboard'}
          </Button>
        </form>
      </AuthCard>
    </OnboardingGuard>
  );
}

