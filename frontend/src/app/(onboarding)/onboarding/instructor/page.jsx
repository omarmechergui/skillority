'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { GraduationCap, ArrowRight, CheckCircle2 } from 'lucide-react';
import { OnboardingGuard } from '@/components/auth/OnboardingGuard';

export default function InstructorOnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    name: 'Dr. Sarah Jenkins',
    headline: 'Principal Engineer & Systems Architect',
    bio: '',
    expertise: 'Web Development, Distributed Systems, Next.js',
    courseIdea: 'Building Enterprise Micro-Frontends with React 19',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleNext = (e) => {
    e.preventDefault();
    if (step < 2) {
      setStep(step + 1);
    } else {
      router.push('/instructor/dashboard');
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
            {step === 1 ? (
              <>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">Instructor Name</label>
                  <Input name="name" value={form.name} onChange={handleChange} required />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">Professional Headline</label>
                  <Input name="headline" value={form.headline} onChange={handleChange} required />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">Primary Domain Expertise</label>
                  <Input name="expertise" value={form.expertise} onChange={handleChange} required />
                </div>
              </>
            ) : (
              <>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">Your Instructor Bio</label>
                  <textarea
                    name="bio"
                    rows={4}
                    placeholder="Share your industry experience, previous projects, and teaching style..."
                    value={form.bio}
                    onChange={handleChange}
                    required
                    className="w-full rounded-lg border border-border p-3 text-xs focus:ring-2 focus:ring-primary/20 focus:border-primary resize-y"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">First Course Curriculum Title Idea</label>
                  <Input name="courseIdea" value={form.courseIdea} onChange={handleChange} required />
                </div>
              </>
            )}

            <div className="pt-2">
              <Button type="submit" className="w-full text-xs font-bold py-2.5 flex items-center justify-center gap-1.5">
                {step === 1 ? 'Continue to Course Setup' : 'Complete Setup & Go to Hub'}
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
    </OnboardingGuard>
  );
}

