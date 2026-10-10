'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Wordmark } from '@/components/common/Wordmark';
import { createClient } from '@/lib/supabase/client';
import { Mail, CheckCircle2 } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (resetError) {
        setError(resetError.message);
      } else {
        setSubmitted(true);
      }
    } catch {
      setError('Failed to send reset link. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-20 px-4">
      <div className="w-full max-w-md bg-surface border border-border-strong rounded-3xl p-8 md:p-10 shadow-2xl space-y-6 text-center">
        <Wordmark size="md" />
        <h1 className="text-2xl font-bold font-heading text-text">Reset Password</h1>

        {submitted ? (
          <div className="space-y-4">
            <div className="w-14 h-14 rounded-full bg-success/15 border border-success/40 text-success flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <p className="text-muted text-xs leading-relaxed">
              We sent password reset instructions to <strong className="text-text">{email}</strong>. Check your inbox and spam folder.
            </p>
            <Link
              href="/login"
              className="inline-block text-xs font-mono text-gold hover:underline mt-4"
            >
              Back to Sign In ↗
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-left">
            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/30 text-red-400 text-xs rounded-xl">
                {error}
              </div>
            )}
            <div>
              <label className="block text-xs font-mono text-muted uppercase mb-1">
                Account Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-muted absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-surface-2 border border-border text-text text-xs focus:border-gold focus:outline-none"
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl bg-gold text-black font-heading font-semibold text-xs uppercase tracking-wide hover:bg-gold-soft transition-all shadow-gold-glow disabled:opacity-50"
            >
              {loading ? 'Sending link...' : 'Send Password Reset Link ↗'}
            </button>
            <div className="text-center pt-2">
              <Link href="/login" className="text-xs text-muted hover:text-gold transition-colors">
                Cancel and return to Sign In
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
