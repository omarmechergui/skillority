'use client';

import { useState } from 'react';
import { AuthCard } from '@/components/auth/AuthCard';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { api } from '@/lib/apiClient';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      const res = await api.post('/auth/forgot-password', { email }, { requiresAuth: false });
      if (res.error) throw new Error(res.error.message || 'Request failed');

      setMessage(res.data?.message || 'Password reset link sent if account exists.');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCard
      title="Reset your password"
      subtitle="Enter your email to receive password reset instructions"
      footerText="Remember your password?"
      footerLinkText="Sign in"
      footerLinkHref="/auth/signin"
    >
      {message ? (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-md text-left">
          <p className="font-semibold mb-1">Check your inbox</p>
          <p>{message}</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-600 text-xs rounded-md">
              {error}
            </div>
          )}

          <Input
            label="Email Address"
            id="email"
            type="email"
            required
            placeholder="name@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? 'Sending link...' : 'Send Reset Link'}
          </Button>
        </form>
      )}
    </AuthCard>
  );
}
