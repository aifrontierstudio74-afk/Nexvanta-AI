'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Wordmark } from '@/components/common/Wordmark';
import { createClient } from '@/lib/supabase/client';
import { Lock, CheckCircle2 } from 'lucide-react';

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const supabase = createClient();

  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      const { error: updateError } = await supabase.auth.updateUser({
        password,
      });

      if (updateError) {
        setError(updateError.message);
      } else {
        setSubmitted(true);
      }
    } catch {
      setError('Failed to update password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-20 px-4">
      <div className="w-full max-w-md bg-surface border border-border-strong rounded-3xl p-8 md:p-10 shadow-2xl space-y-6 text-center">
        <Wordmark size="md" />
        <h1 className="text-2xl font-bold font-heading text-text">Set New Password</h1>

        {submitted ? (
          <div className="space-y-4">
            <div className="w-14 h-14 rounded-full bg-success/15 border border-success/40 text-success flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <p className="text-muted text-xs leading-relaxed">
              Your password has been successfully updated. You can now access your dashboard.
            </p>
            <Link
              href="/app"
              className="inline-block px-5 py-2.5 rounded-xl bg-gold text-black font-semibold text-xs uppercase tracking-wide hover:bg-gold-soft transition-colors mt-4"
            >
              Go to Dashboard ↗
            </Link>
          </div>
        ) : (
          <form onSubmit={handleResetSubmit} className="space-y-4 text-left">
            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/30 text-red-400 text-xs rounded-xl">
                {error}
              </div>
            )}
            <div>
              <label className="block text-xs font-mono text-muted uppercase mb-1">
                New Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-muted absolute left-3 top-3" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-surface-2 border border-border text-text text-xs focus:border-gold focus:outline-none"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-mono text-muted uppercase mb-1">
                Confirm New Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-muted absolute left-3 top-3" />
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-surface-2 border border-border text-text text-xs focus:border-gold focus:outline-none"
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl bg-gold text-black font-heading font-semibold text-xs uppercase tracking-wide hover:bg-gold-soft transition-all shadow-gold-glow disabled:opacity-50"
            >
              {loading ? 'Updating...' : 'Update Password ↗'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
