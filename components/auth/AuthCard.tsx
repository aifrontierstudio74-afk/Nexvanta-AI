'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Wordmark } from '@/components/common/Wordmark';
import { submitLead } from '@/lib/submitLead';
import { isValidIndianPhone } from '@/lib/format';
import { Lock, Mail, User, ShieldAlert, ArrowRight, CheckCircle2 } from 'lucide-react';

interface AuthCardProps {
  mode: 'login' | 'signup';
  plan?: string;
}

export const AuthCard: React.FC<AuthCardProps> = ({ mode, plan }) => {
  const isSupabaseConfigured = Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  // States when Supabase is not configured (friendly "Accounts open soon" state)
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // States for when configured
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');

  const handleWaitlistSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError('Please provide your name.');
      return;
    }
    if (!phone.trim() || !isValidIndianPhone(phone)) {
      setError('Please provide a valid 10-digit mobile number.');
      return;
    }

    setLoading(true);
    try {
      const res = await submitLead({
        name,
        phone,
        email,
        company,
        interestedIn: plan ? `Subscription: ${plan}` : 'Account Access',
        segment: 'SaaS',
        source: 'Subscribe Intent',
        message: `User attempted to ${mode}. Plan target: ${plan || 'General'}. Registered for early dashboard onboarding.`,
        consent: true,
      });

      if (res.ok) {
        setSubmitted(true);
      } else {
        setError(res.error || 'Failed to submit request.');
      }
    } catch {
      setError('Network error. Please message us on WhatsApp.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-20 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md bg-surface border border-border-strong rounded-3xl p-8 md:p-10 shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <Wordmark size="md" />
          <h1 className="text-2xl font-bold font-heading text-text pt-2">
            {mode === 'login' ? 'Client Portal Sign In' : 'Create Subscription Account'}
          </h1>
          {plan && (
            <div className="inline-block px-3 py-1 rounded-full bg-gold/10 border border-gold/30 text-gold text-xs font-mono">
              Target Plan: {plan}
            </div>
          )}
        </div>

        {!isSupabaseConfigured ? (
          /* Friendly "Accounts open soon" state with Lead Form */
          <div className="space-y-5">
            <div className="p-4 rounded-2xl bg-gold/5 border border-gold/25 text-center">
              <span className="text-xs font-mono text-gold uppercase tracking-wider block mb-1">
                PRE-RELEASE ACCESS
              </span>
              <p className="text-muted text-xs leading-relaxed">
                Client self-serve accounts are opening soon. Register below to be provisioned with instant priority credentials.
              </p>
            </div>

            {submitted ? (
              <div className="text-center py-6 space-y-4">
                <div className="w-14 h-14 rounded-full bg-success/15 border border-success/40 text-success flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <h3 className="font-heading font-bold text-lg text-text">
                  Priority Access Logged
                </h3>
                <p className="text-muted text-xs leading-relaxed">
                  Our onboarding engineer will contact you via WhatsApp to configure your credentials directly.
                </p>
                <Link
                  href="/app"
                  className="inline-flex items-center gap-2 text-xs font-mono text-gold hover:underline"
                >
                  Preview Dashboard Shell ↗
                </Link>
              </div>
            ) : (
              <form onSubmit={handleWaitlistSubmit} className="space-y-3.5">
                {error && (
                  <div className="p-3 bg-red-500/10 border border-red-500/30 text-red-400 text-xs rounded-xl">
                    {error}
                  </div>
                )}

                <div>
                  <label className="block text-xs font-mono text-muted uppercase mb-1">
                    Full Name <span className="text-gold">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ankit Sharma"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-surface-2 border border-border text-text text-xs focus:border-gold focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-muted uppercase mb-1">
                    Mobile / WhatsApp <span className="text-gold">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="97131 03152"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-surface-2 border border-border text-text text-xs focus:border-gold focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-muted uppercase mb-1">
                    Work Email (Optional)
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="ankit@company.com"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-surface-2 border border-border text-text text-xs focus:border-gold focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-muted uppercase mb-1">
                    Company Name
                  </label>
                  <input
                    type="text"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="Sharma Enterprises"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-surface-2 border border-border text-text text-xs focus:border-gold focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 px-4 rounded-xl bg-gold text-black font-heading font-semibold text-xs uppercase tracking-wide hover:bg-gold-soft transition-all shadow-gold-glow flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {loading ? 'Registering...' : 'Request Priority Account ↗'}
                </button>
              </form>
            )}
          </div>
        ) : (
          /* Live Supabase Auth Form */
          <form className="space-y-4">
            <div>
              <label className="block text-xs font-mono text-muted uppercase mb-1">
                Email Address
              </label>
              <input
                type="email"
                required
                value={authEmail}
                onChange={(e) => setAuthEmail(e.target.value)}
                placeholder="name@company.com"
                className="w-full px-3.5 py-2.5 rounded-xl bg-surface-2 border border-border text-text text-xs focus:border-gold focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-muted uppercase mb-1">
                Password
              </label>
              <input
                type="password"
                required
                value={authPassword}
                onChange={(e) => setAuthPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 rounded-xl bg-surface-2 border border-border text-text text-xs focus:border-gold focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 rounded-xl bg-gold text-black font-heading font-semibold text-xs uppercase tracking-wide hover:bg-gold-soft transition-all shadow-gold-glow"
            >
              {mode === 'login' ? 'Sign In' : 'Create Account'}
            </button>
          </form>
        )}

        <div className="pt-2 text-center text-xs text-muted">
          {mode === 'login' ? (
            <p>
              Don&apos;t have an account?{' '}
              <Link href="/signup" className="text-gold hover:underline">
                Sign up
              </Link>
            </p>
          ) : (
            <p>
              Already have an account?{' '}
              <Link href="/login" className="text-gold hover:underline">
                Sign in
              </Link>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
