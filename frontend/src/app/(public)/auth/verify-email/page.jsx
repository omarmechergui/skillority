'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AuthCard } from '@/components/auth/AuthCard';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

export default function VerifyEmailPage() {
  const router = useRouter();
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [verified, setVerified] = useState(false);

  const handleDigitChange = (index, value) => {
    if (value.length > 1) value = value.slice(-1);
    const updated = [...code];
    updated[index] = value;
    setCode(updated);

    // Auto focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`digit-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleVerify = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setVerified(true);
      setTimeout(() => router.push('/onboarding/role'), 1500);
    }, 1000);
  };

  return (
    <AuthCard
      title="Verify your email"
      subtitle="We sent a 6-digit verification code to your email address"
      footerText="Didn't receive the code?"
      footerLinkText="Resend code"
      footerLinkHref="#"
    >
      {verified ? (
        <div className="p-4 bg-success-light border border-success-border text-success text-xs rounded-md text-center">
          <p className="font-semibold mb-1">Email verified successfully!</p>
          <p>Redirecting to role selection...</p>
        </div>
      ) : (
        <form onSubmit={handleVerify} className="space-y-6">
          <div className="flex justify-center gap-2">
            {code.map((digit, idx) => (
              <input
                key={idx}
                id={`digit-${idx}`}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleDigitChange(idx, e.target.value)}
                className="w-11 h-12 text-center text-lg font-bold bg-surface border border-border rounded-md focus:ring-2 focus:ring-primary focus:outline-none"
              />
            ))}
          </div>

          <Button type="submit" disabled={loading || code.some((d) => !d)} className="w-full">
            {loading ? 'Verifying...' : 'Verify Email'}
          </Button>
        </form>
      )}
    </AuthCard>
  );
}

