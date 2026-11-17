'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AuthCard } from '@/components/auth/AuthCard';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { api } from '@/lib/apiClient';

export default function ResetPasswordPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ token: '', newPassword: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.newPassword !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      const res = await api.post(
        '/auth/reset-password',
        {
          token: formData.token,
          newPassword: formData.newPassword,
        },
        { requiresAuth: false }
      );
      if (res.error) throw new Error(res.error.message || 'Password reset failed');

      setSuccess(true);
      setTimeout(() => router.push('/auth/signin'), 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCard
      title="Set new password"
      subtitle="Enter the reset token sent to your email and create a new password"
      footerText="Return to"
      footerLinkText="Sign in"
      footerLinkHref="/auth/signin"
    >
      {success ? (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-md text-left">
          <p className="font-semibold mb-1">Password reset successfully!</p>
          <p>All active sessions have been invalidated. Redirecting to sign in...</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-600 text-xs rounded-md">
              {error}
            </div>
          )}

          <Input
            label="Reset Token"
            id="token"
            required
            placeholder="Paste token from email"
            value={formData.token}
            onChange={(e) => setFormData({ ...formData, token: e.target.value })}
          />

          <Input
            label="New Password"
            id="newPassword"
            type="password"
            required
            placeholder="••••••••"
            value={formData.newPassword}
            onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
          />

          <Input
            label="Confirm New Password"
            id="confirmPassword"
            type="password"
            required
            placeholder="••••••••"
            value={formData.confirmPassword}
            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
          />

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? 'Updating password...' : 'Update Password'}
          </Button>
        </form>
      )}
    </AuthCard>
  );
}
