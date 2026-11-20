'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AuthCard } from '@/components/auth/AuthCard';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { OnboardingGuard } from '@/components/auth/OnboardingGuard';

export default function StudentOnboardingPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    university: '',
    major: '',
    graduationYear: '2026',
    learningGoals: '',
    skills: '',
    bio: '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      router.push('/student/dashboard');
    }, 1000);
  };

  return (
    <OnboardingGuard requiredRole="STUDENT">
      <AuthCard
        title="Complete student profile"
        subtitle="Help instructors and recruiters get to know your background"
      >
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

