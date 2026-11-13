'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AuthCard } from '@/components/auth/AuthCard';
import { Button } from '@/components/ui/Button';
import { GraduationCap, Building2, BookOpen } from 'lucide-react';

export default function RoleSelectionPage() {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState('STUDENT');

  const roles = [
    {
      id: 'STUDENT',
      title: 'Student / Career Seeker',
      description: 'Learn modern skills, earn certificates, and connect with tech companies.',
      icon: GraduationCap,
    },
    {
      id: 'COMPANY',
      title: 'Company / Recruiter',
      description: 'Discover vetted candidates, post job opportunities, and hire top graduates.',
      icon: Building2,
    },
    {
      id: 'INSTRUCTOR',
      title: 'Instructor (Invite Only)',
      description: 'Publish interactive curriculum and mentor the next generation of engineers.',
      icon: BookOpen,
      disabled: true,
      badge: 'Admin Invite Only',
    },
  ];

  const handleContinue = () => {
    if (selectedRole === 'STUDENT') {
      router.push('/onboarding/student');
    } else if (selectedRole === 'COMPANY') {
      router.push('/onboarding/company');
    }
  };

  return (
    <AuthCard
      title="Choose your platform role"
      subtitle="Select how you plan to use Skillority to personalize your experience"
    >
      <div className="space-y-3 mb-6">
        {roles.map((r) => {
          const Icon = r.icon;
          const isSelected = selectedRole === r.id;

          return (
            <div
              key={r.id}
              onClick={() => !r.disabled && setSelectedRole(r.id)}
              className={`p-4 rounded-DEFAULT border text-left transition-all flex items-start gap-3.5 ${
                r.disabled
                  ? 'opacity-60 bg-neutral-light/50 border-border cursor-not-allowed'
                  : isSelected
                  ? 'border-primary bg-primary-light ring-1 ring-primary cursor-pointer'
                  : 'border-border bg-surface hover:border-neutral-slate/40 cursor-pointer'
              }`}
            >
              <div
                className={`p-2 rounded-md ${
                  isSelected ? 'bg-primary text-white' : 'bg-canvas text-neutral-slate'
                }`}
              >
                <Icon className="w-5 h-5" />
              </div>

              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-neutral-dark">{r.title}</h3>
                  {r.badge && (
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-neutral-200 text-neutral-slate">
                      {r.badge}
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-neutral-slate mt-0.5 leading-relaxed">
                  {r.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <Button type="button" onClick={handleContinue} className="w-full">
        Continue to Profile Setup
      </Button>
    </AuthCard>
  );
}

