'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AuthCard } from '@/components/auth/AuthCard';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/lib/auth';
import { api } from '@/lib/apiClient';

export default function SignInPage() {
  const router = useRouter();
  const { loginUser } = useAuth();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await api.post('/auth/login', formData, { requiresAuth: false });

      if (res.error) {
        throw new Error(res.error.message || 'Failed to sign in');
      }

      loginUser(res.data.user, res.data.accessToken);

      // Redirect by role
      const role = res.data.user.role;
      if (role === 'STUDENT') router.push('/onboarding/student');
      else if (role === 'COMPANY') router.push('/onboarding/company');
      else if (role === 'INSTRUCTOR') router.push('/instructor/dashboard');
      else if (role === 'ADMIN') router.push('/admin/dashboard');
      else router.push('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCard
      title="Welcome back"
      subtitle="Sign in to your Skillority account"
      footerText="Don't have an account?"
      footerLinkText="Sign up"
      footerLinkHref="/auth/signup"
    >
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-xs rounded-md">
          {error}
        </div>
      )}

      {/* Google Sign-in Inactive Placeholder */}
      <button
        type="button"
        disabled
        className="w-full flex items-center justify-center gap-2 py-2.5 px-4 mb-4 border border-border rounded-md text-xs font-medium text-neutral-slate bg-neutral-50 cursor-not-allowed opacity-75"
        title="Google Sign-In is an inactive placeholder"
      >
        <svg className="w-4 h-4" viewBox="0 0 24 24">
          <path
            fill="#EA4335"
            d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.4 9 5 12 5z"
          />
          <path
            fill="#4285F4"
            d="M23.5 12.3c0-.8-.1-1.7-.2-2.3H12v4.6h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.9z"
          />
          <path
            fill="#FBBC05"
            d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 12.3 0 15.1s.7 5.4 1.9 7.8l3.7-2.9z"
          />
          <path
            fill="#34A853"
            d="M12 23.5c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.4-6.4-5.2L1.9 16.5C3.7 20.3 7.5 23.5 12 23.5z"
          />
        </svg>
        Sign in with Google (Placeholder)
      </button>

      <div className="relative my-4">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border"></div>
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="bg-card px-2 text-neutral-slate">or sign in with email</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Email Address"
          id="email"
          type="email"
          required
          placeholder="name@company.com"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />

        <div className="space-y-1">
          <div className="flex justify-between items-center">
            <label htmlFor="password" className="text-xs font-semibold text-neutral-slate">
              Password *
            </label>
            <Link
              href="/auth/forgot-password"
              className="text-xs text-primary hover:text-primary-hover font-medium"
            >
              Forgot password?
            </Link>
          </div>
          <Input
            id="password"
            type="password"
            required
            placeholder="••••••••"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          />
        </div>

        <Button type="submit" disabled={loading} className="w-full mt-2">
          {loading ? 'Signing in...' : 'Sign In'}
        </Button>
      </form>
    </AuthCard>
  );
}
