'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { GraduationCap, ArrowRight, ArrowLeft } from 'lucide-react';
import { OnboardingGuard } from '@/components/auth/OnboardingGuard';
import { useAuth } from '@/lib/auth';
import { profileApi } from '@/lib/api/profiles';

export default function InstructorOnboardingPage() {
  const router = useRouter();
  const { user, refreshUser, loginUser } = useAuth();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    name: '',
    headline: '',
    bio: '',
    expertise: '',
    courseIdea: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Pre-fill existing instructor profile/name if available from auth
  useEffect(() => {
    if (user) {
      const existingName = user.profile?.firstName
        ? `${user.profile.firstName} ${user.profile.lastName || ''}`.trim()
        : '';
      setForm((prev) => ({
        ...prev,
        name: prev.name || existingName || (user.email ? user.email.split('@')[0] : ''),
        headline: prev.headline || user.profile?.experience || '',
        expertise:
          prev.expertise ||
          (Array.isArray(user.profile?.expertise) && user.profile.expertise.length > 0
            ? user.profile.expertise.join(', ')
            : ''),
        bio: prev.bio || user.profile?.bio || '',
      }));
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleNext = async (e) => {
    e.preventDefault();
    if (loading) return;
    setError('');

    if (step === 1) {
      const name = form.name.trim();
      const headline = form.headline.trim();
      const items = form.expertise.split(',').map((s) => s.trim()).filter(Boolean);

      if (!name) {
        setError('Instructor Name is required.');
        return;
      }
      if (name.length < 2 || name.length > 100) {
        setError('Instructor Name must be between 2 and 100 characters.');
        return;
      }
      if (!headline) {
        setError('Professional Headline is required.');
        return;
      }
      if (headline.length < 2 || headline.length > 500) {
        setError('Professional Headline must be between 2 and 500 characters.');
        return;
      }
      if (items.length === 0) {
        setError('Primary Domain Expertise is required (at least one skill).');
        return;
      }
      if (items.length > 20) {
        setError('Primary Domain Expertise cannot exceed 20 skills.');
        return;
      }

      setStep(2);
      return;
    }

    // Step 2 submission
    const name = form.name.trim();
    const headline = form.headline.trim();
    const items = form.expertise.split(',').map((s) => s.trim()).filter(Boolean);

    if (!name || !headline || items.length === 0) {
      setError('Please complete all required fields from Step 1.');
      setStep(1);
      return;
    }

    const bio = form.bio.trim();
    if (bio.length > 500) {
      setError('Instructor Bio cannot exceed 500 characters.');
      return;
    }

    const courseIdea = form.courseIdea.trim();
    if (courseIdea.length > 200) {
      setError('First Course Curriculum Title Idea cannot exceed 200 characters.');
      return;
    }

    const payload = {
      name,
      headline,
      expertise: Array.from(new Set(items)),
      bio: bio || undefined,
      courseIdea: courseIdea || undefined,
    };

    setLoading(true);

    try {
      const res = await profileApi.completeInstructorOnboarding(payload);

      if (res.error) {
        const backendDetails = res.error.details?.error?.details;
        let errorMsg = res.error.message || 'Failed to complete instructor onboarding';
        if (Array.isArray(backendDetails) && backendDetails.length > 0) {
          errorMsg = backendDetails
            .map((d) => (d.field ? `${d.field}: ${d.message}` : d.message))
            .join(', ');
        }
        setError(errorMsg);
        return;
      }

      // Synchronize session state with fresh data from /auth/me
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

      // Navigate to Instructor Dashboard
      router.replace('/instructor/dashboard');
    } catch (err) {
      setError(err.message || 'An unexpected error occurred while saving instructor profile.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <OnboardingGuard requiredRole="INSTRUCTOR">
      <div className="min-h-screen bg-canvas flex flex-col justify-center items-center p-4 sm:p-6">
        <div className="w-full max-w-xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mx-auto mb-2">
              <GraduationCap className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Instructor Onboarding</h1>
            <p className="text-xs text-slate-500">Step {step} of 2 — Set up your teaching profile and course roadmap</p>
          </div>

          <Card className="p-6 sm:p-8">
            <form onSubmit={handleNext} className="space-y-5">
              {error && (
                <div
                  className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-lg font-medium"
                  role="alert"
                >
                  {error}
                </div>
              )}

              {step === 1 ? (
                <>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700">Instructor Name</label>
                    <Input
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="Dr. Sarah Jenkins"
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700">Professional Headline</label>
                    <Input
                      name="headline"
                      value={form.headline}
                      onChange={handleChange}
                      placeholder="Principal Engineer & Systems Architect"
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700">Primary Domain Expertise</label>
                    <Input
                      name="expertise"
                      value={form.expertise}
                      onChange={handleChange}
                      placeholder="Web Development, Distributed Systems, Next.js"
                      required
                    />
                  </div>
                </>
              ) : (
                <>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700">Your Instructor Bio</label>
                    <textarea
                      name="bio"
                      rows={4}
                      placeholder="Share your industry experience, previous projects, and teaching style (max 500 characters)..."
                      value={form.bio}
                      onChange={handleChange}
                      maxLength={500}
                      className="w-full rounded-lg border border-border p-3 text-xs focus:ring-2 focus:ring-primary/20 focus:border-primary resize-y"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-semibold text-slate-700">First Course Curriculum Title Idea</label>
                      <span className="text-[10px] text-slate-400 font-normal">Optional — Course setup continues in Hub</span>
                    </div>
                    <Input
                      name="courseIdea"
                      value={form.courseIdea}
                      onChange={handleChange}
                      placeholder="e.g. Building Enterprise Micro-Frontends with React 19"
                    />
                    <p className="text-[11px] text-slate-400">
                      Draft curriculum ideas can be officially created and published anytime from your Instructor Course Studio.
                    </p>
                  </div>
                </>
              )}

              <div className="pt-2 space-y-3">
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full text-xs font-bold py-2.5 flex items-center justify-center gap-1.5"
                >
                  {loading ? (
                    'Saving Profile...'
                  ) : (
                    <>
                      {step === 1 ? 'Continue to Course Setup' : 'Complete Setup & Go to Hub'}
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </Button>

                {step === 2 && !loading && (
                  <button
                    type="button"
                    onClick={() => {
                      setError('');
                      setStep(1);
                    }}
                    className="w-full text-center text-xs text-slate-500 hover:text-slate-800 flex items-center justify-center gap-1 font-medium transition-colors"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    Back to Profile Details
                  </button>
                )}
              </div>
            </form>
          </Card>
        </div>
      </div>
    </OnboardingGuard>
  );
}
