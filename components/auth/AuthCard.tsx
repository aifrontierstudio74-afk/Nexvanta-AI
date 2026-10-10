'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Wordmark } from '@/components/common/Wordmark';
import { submitLead } from '@/lib/submitLead';
import { isValidIndianPhone } from '@/lib/format';
import { createClient } from '@/lib/supabase/client';
import { Lock, Mail, User, Phone, Building, CheckCircle2, ArrowRight } from 'lucide-react';

interface AuthCardProps {
  mode: 'login' | 'signup';
  plan?: string;
}

export const AuthCard: React.FC<AuthCardProps> = ({ mode, plan: initialPlan }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const plan = initialPlan || searchParams.get('plan') || undefined;
  const redirectTarget = searchParams.get('redirect') || (plan ? `/app/checkout?plan=${plan}` : '/app');

  // Form Fields
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [company, setCompany] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [needsVerification, setNeedsVerification] = useState(false);

  const supabase = createClient();

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (mode === 'signup') {
      if (!fullName.trim()) {
        setError('Please provide your full name.');
        return;
      }
      if (!phone.trim() || !isValidIndianPhone(phone)) {
        setError('Please enter a valid 10-digit mobile number.');
        return;
      }
      if (!acceptedTerms) {
        setError('You must accept the terms of service and privacy policy to continue.');
        return;
      }
    }

    if (!email.trim() || !password) {
      setError('Please provide your email and password.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    try {
      if (mode === 'signup') {
        const { data, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
              phone,
              company,
              accepted_terms_at: new Date().toISOString(),
            },
            emailRedirectTo: `${window.location.origin}/auth/callback?redirect=${encodeURIComponent(
              redirectTarget
            )}`,
          },
        });

        if (signUpError) {
          setError(signUpError.message);
          setLoading(false);
          return;
        }

        // Forward lead to Google Sheet CRM
        await submitLead({
          name: fullName,
          phone,
          email,
          company,
          interestedIn: plan ? `SaaS Plan: ${plan}` : 'SaaS Account',
          segment: 'SaaS',
          source: 'Signup',
          message: `New account signed up. Plan choice: ${plan || 'None'}. Accepted terms: Yes.`,
          consent: true,
        });

        if (data.session) {
          // Direct login (email verification disabled in Supabase)
          router.push(redirectTarget);
        } else {
          // Email verification required
          setNeedsVerification(true);
        }
      } else {
        // Sign In
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (signInError) {
          setError(signInError.message);
          setLoading(false);
          return;
        }

        router.push(redirectTarget);
      }
    } catch {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleOAuth = async () => {
    try {
      const { error: oAuthError } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback?redirect=${encodeURIComponent(
            redirectTarget
          )}`,
        },
      });
      if (oAuthError) setError(oAuthError.message);
    } catch {
      setError('Failed to initiate Google sign-in.');
    }
  };

  if (needsVerification) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center py-20 px-4">
        <div className="w-full max-w-md bg-surface border border-border-strong rounded-3xl p-8 text-center space-y-5">
          <div className="w-16 h-16 rounded-full bg-success/15 border border-success/40 text-success flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold font-heading text-text">Verify Your Email</h2>
          <p className="text-muted text-xs leading-relaxed">
            We sent a verification link to <strong className="text-text">{email}</strong>.
            Click the link in your inbox to confirm your account and proceed to dashboard.
          </p>
          <div className="p-3 bg-surface-2 rounded-xl border border-border text-xs font-mono text-gold">
            Target Plan: {plan || 'General Access'}
          </div>
          <Link
            href="/login"
            className="inline-block text-xs font-mono text-muted hover:text-gold transition-colors"
          >
            Return to Login ↗
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-20 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md bg-surface border border-border-strong rounded-3xl p-8 md:p-10 shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <Wordmark size="md" />
          <h1 className="text-2xl font-bold font-heading text-text pt-2">
            {mode === 'login' ? 'Client Portal Sign In' : 'Create SaaS Account'}
          </h1>
          {plan && (
            <div className="inline-block px-3 py-1 rounded-full bg-gold/10 border border-gold/30 text-gold text-xs font-mono">
              Target Plan: {plan}
            </div>
          )}
        </div>

        {error && (
          <div className="p-3 bg-red-500/10 border border-red-500/30 text-red-400 text-xs rounded-xl">
            {error}
          </div>
        )}

        {/* Google OAuth Button */}
        <button
          type="button"
          onClick={handleGoogleOAuth}
          className="w-full py-3 px-4 rounded-xl bg-surface-2 border border-border hover:border-gold text-text text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.65v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.14z"
            />
            <path
              fill="#34A853"
              d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.26v3.13C3.27 21.36 7.33 24 12 24z"
            />
            <path
              fill="#FBBC05"
              d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.6H1.26C.46 8.21 0 10.05 0 12s.46 3.79 1.26 5.4l4.02-3.13z"
            />
            <path
              fill="#EA4335"
              d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.27 2.64 1.26 6.6l4.02 3.13c.95-2.83 3.6-4.98 6.72-4.98z"
            />
          </svg>
          Continue with Google
        </button>

        <div className="relative flex items-center justify-center">
          <div className="border-t border-border w-full" />
          <span className="bg-surface px-3 text-[11px] font-mono text-muted uppercase">or email</span>
          <div className="border-t border-border w-full" />
        </div>

        <form onSubmit={handleAuthSubmit} className="space-y-3.5">
          {mode === 'signup' && (
            <>
              <div>
                <label className="block text-xs font-mono text-muted uppercase mb-1">
                  Full Name <span className="text-gold">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-muted absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Aditya Sharma"
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-surface-2 border border-border text-text text-xs focus:border-gold focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-muted uppercase mb-1">
                  Mobile / WhatsApp <span className="text-gold">*</span>
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-muted absolute left-3 top-3" />
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="97131 03152"
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-surface-2 border border-border text-text text-xs focus:border-gold focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-muted uppercase mb-1">
                  Company Name (Optional)
                </label>
                <div className="relative">
                  <Building className="w-4 h-4 text-muted absolute left-3 top-3" />
                  <input
                    type="text"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="Sharma Enterprises"
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-surface-2 border border-border text-text text-xs focus:border-gold focus:outline-none"
                  />
                </div>
              </div>
            </>
          )}

          <div>
            <label className="block text-xs font-mono text-muted uppercase mb-1">
              Email Address <span className="text-gold">*</span>
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

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-mono text-muted uppercase">
                Password <span className="text-gold">*</span>
              </label>
              {mode === 'login' && (
                <Link
                  href="/forgot-password"
                  className="text-[11px] font-mono text-gold hover:underline"
                >
                  Forgot?
                </Link>
              )}
            </div>
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

          {mode === 'signup' && (
            <div className="flex items-start gap-2.5 pt-1">
              <input
                type="checkbox"
                id="terms"
                checked={acceptedTerms}
                onChange={(e) => setAcceptedTerms(e.target.checked)}
                className="mt-0.5 rounded border-border text-gold focus:ring-gold"
              />
              <label htmlFor="terms" className="text-[11px] text-muted leading-relaxed cursor-pointer">
                I agree to the{' '}
                <Link href="/terms" className="text-gold hover:underline">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link href="/privacy" className="text-gold hover:underline">
                  Privacy Policy
                </Link>
                .
              </label>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 rounded-xl bg-gold text-black font-heading font-semibold text-xs uppercase tracking-wide hover:bg-gold-soft transition-all shadow-gold-glow flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading
              ? 'Processing...'
              : mode === 'login'
              ? 'Sign In to Dashboard ↗'
              : 'Create Account & Continue ↗'}
          </button>
        </form>

        <div className="pt-2 text-center text-xs text-muted">
          {mode === 'login' ? (
            <p>
              Don&apos;t have an account?{' '}
              <Link
                href={plan ? `/signup?plan=${plan}` : '/signup'}
                className="text-gold hover:underline font-semibold"
              >
                Sign up
              </Link>
            </p>
          ) : (
            <p>
              Already have an account?{' '}
              <Link
                href={plan ? `/login?plan=${plan}` : '/login'}
                className="text-gold hover:underline font-semibold"
              >
                Sign in
              </Link>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
