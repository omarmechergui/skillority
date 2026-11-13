'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AuthCard } from '@/components/auth/AuthCard';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/lib/auth';

export default function SignUpPage() {
  const router = useRouter();
  const { loginUser } = useAuth();
  const [role, setRole] = useState('STUDENT'); // STUDENT | COMPANY
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    companyName: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const endpoint =
      role === 'STUDENT'
        ? 'http://localhost:5000/api/auth/signup/student'
        : 'http://localhost:5000/api/auth/signup/company';

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error?.message || 'Registration failed');
      }

      loginUser(data.data.user, data.data.accessToken);

      if (role === 'STUDENT') {
        router.push('/onboarding/student');
      } else {
        router.push('/onboarding/company');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCard
      title="Create your account"
      subtitle="Join Skillority to learn, hire, or accelerate your career"
      footerText="Already have an account?"
      footerLinkText="Sign in"
      footerLinkHref="/auth/signin"
    >
      {/* Role Selector Tabs */}
      <div className="grid grid-cols-2 gap-2 p-1 bg-canvas border border-border rounded-md mb-6 text-xs font-semibold">
        <button
          type="button"
          onClick={() => setRole('STUDENT')}
          className={`py-2 rounded-sm transition-all ${
            role === 'STUDENT'
              ? 'bg-card text-primary shadow-xs'
              : 'text-neutral-slate hover:text-neutral-dark'
          }`}
        >
          I am a Student
        </button>
        <button
          type="button"
          onClick={() => setRole('COMPANY')}
          className={`py-2 rounded-sm transition-all ${
            role === 'COMPANY'
              ? 'bg-card text-primary shadow-xs'
              : 'text-neutral-slate hover:text-neutral-dark'
          }`}
        >
          I am a Company / Recruiter
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-xs rounded-md">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3.5">
        <div className="grid grid-cols-2 gap-3">
          <Input
            label="First Name"
            id="firstName"
            required
            placeholder="John"
            value={formData.firstName}
            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
          />
          <Input
            label="Last Name"
            id="lastName"
            required
            placeholder="Doe"
            value={formData.lastName}
            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
          />
        </div>

        {role === 'COMPANY' && (
          <Input
            label="Company Name"
            id="companyName"
            required
            placeholder="Acme Corporation"
            value={formData.companyName}
            onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
          />
        )}

        <Input
          label={role === 'STUDENT' ? 'Student / Personal Email' : 'Work Email'}
          id="email"
          type="email"
          required
          placeholder={role === 'STUDENT' ? 'student@university.edu' : 'recruiter@company.com'}
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />

        <Input
          label="Password (min 8 chars, 1 uppercase, 1 number)"
          id="password"
          type="password"
          required
          placeholder="••••••••"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
        />

        <div className="p-3 bg-neutral-50 border border-border rounded-md text-[11px] text-neutral-slate">
          <strong>Note:</strong> Instructors must be invited by an Administrator and cannot register independently.
        </div>

        <Button type="submit" disabled={loading} className="w-full mt-2">
          {loading ? 'Creating account...' : `Sign Up as ${role === 'STUDENT' ? 'Student' : 'Company'}`}
        </Button>
      </form>
    </AuthCard>
  );
}
