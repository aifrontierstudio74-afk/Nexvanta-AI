'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { formatINR } from '@/lib/format';
import { paymentConfig } from '@/data/payment';
import {
  CreditCard,
  QrCode,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  Building,
  Loader2,
  Copy,
  Check,
} from 'lucide-react';

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => { open: () => void };
  }
}

function CheckoutClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const planCode = searchParams.get('plan') || 'lead-capture-basic';

  const [method, setMethod] = useState<'razorpay' | 'manual'>('razorpay');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Polling state
  const [polling, setPolling] = useState(false);
  const [pollTargetSlug, setPollTargetSlug] = useState('lead-capture-crm');

  // Manual payment form
  const [utrNumber, setUtrNumber] = useState('');
  const [manualAmount, setManualAmount] = useState('3500');
  const [manualMethod, setManualMethod] = useState<'UPI' | 'Bank Transfer'>('UPI');
  const [manualNotes, setManualNotes] = useState('');
  const [manualSubmitted, setManualSubmitted] = useState(false);
  const [copiedUpi, setCopiedUpi] = useState(false);

  // Pre-load Razorpay script
  useEffect(() => {
    if (typeof window.Razorpay === 'undefined') {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  // Poll for subscription status until active
  useEffect(() => {
    if (!polling) return;

    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/billing/status?slug=${pollTargetSlug}`);
        const data = await res.json();
        if (data.ok && data.active) {
          clearInterval(interval);
          router.push(`/app/${data.slug}`);
        }
      } catch {
        // continue polling
      }
    }, 2500);

    const timeout = setTimeout(() => {
      clearInterval(interval);
      setPolling(false);
      setError('Confirmation timeout. Please check dashboard in a moment.');
    }, 60000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [polling, pollTargetSlug, router]);

  const handleRazorpaySubscribe = async () => {
    setError(null);
    setLoading(true);

    try {
      const subRes = await fetch('/api/billing/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planCode }),
      });
      const subData = await subRes.json();

      if (!subData.ok) {
        setError(subData.error || 'Failed to initialize subscription.');
        setLoading(false);
        return;
      }

      setPollTargetSlug(subData.plan?.automation_slug || 'lead-capture-crm');

      if (subData.mock) {
        // In local mock mode
        setPolling(true);
        setTimeout(() => {
          router.push(`/app/${subData.plan?.automation_slug || 'lead-capture-crm'}`);
        }, 1500);
        return;
      }

      const options = {
        key: subData.keyId,
        subscription_id: subData.razorpaySubscriptionId,
        name: 'Nexvanta.AI',
        description: `Subscription: ${subData.plan?.name}`,
        theme: { color: '#F5C518' },
        handler: async (response: Record<string, string>) => {
          setLoading(false);
          setPolling(true);
          try {
            await fetch('/api/billing/confirm', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(response),
            });
          } catch {
            // Webhook is authoritative
          }
        },
      };

      if (window.Razorpay) {
        const rzp = new window.Razorpay(options);
        rzp.open();
      } else {
        setError('Payment gateway SDK is loading. Please retry in a second.');
      }
    } catch {
      setError('Could not connect to billing server.');
    } finally {
      setLoading(false);
    }
  };

  const handleManualClaim = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!utrNumber.trim()) {
      setError('Please provide the UTR / Reference ID.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/billing/manual-claim', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planCode,
          amount: manualAmount,
          method: manualMethod,
          utr: utrNumber,
          notes: manualNotes,
        }),
      });
      const data = await res.json();
      if (data.ok) {
        setManualSubmitted(true);
      } else {
        setError(data.error || 'Failed to submit payment claim.');
      }
    } catch {
      setError('Network error submitting claim.');
    } finally {
      setLoading(false);
    }
  };

  if (polling) {
    return (
      <div className="py-24 text-center max-w-md mx-auto space-y-5 px-4">
        <Loader2 className="w-12 h-12 text-gold animate-spin mx-auto" />
        <h2 className="text-2xl font-bold font-heading text-text">
          Confirming Your Subscription...
        </h2>
        <p className="text-muted text-xs leading-relaxed">
          Verifying authorization webhook and granting live automation entitlement. You will be redirected in just a moment.
        </p>
      </div>
    );
  }

  return (
    <div className="py-12 md:py-20 px-4 max-w-2xl mx-auto space-y-8">
      <div>
        <span className="text-xs font-mono text-gold uppercase tracking-wider block mb-1">
          SUBSCRIBE &amp; ACTIVATE
        </span>
        <h1 className="text-3xl font-bold font-heading text-text">
          Activate Subscription
        </h1>
        <p className="text-muted text-xs font-mono mt-1">
          Selected Plan Code: <span className="text-gold font-bold">{planCode}</span>
        </p>
      </div>

      {error && (
        <div className="p-3.5 bg-red-500/10 border border-red-500/30 text-red-400 text-xs rounded-xl">
          {error}
        </div>
      )}

      {/* Payment Method Selector */}
      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => setMethod('razorpay')}
          className={`p-4 rounded-2xl border flex flex-col items-center gap-2 text-xs font-mono transition-all ${
            method === 'razorpay'
              ? 'border-gold bg-gold/10 text-gold font-bold shadow-gold-glow'
              : 'border-border bg-surface-2 text-muted hover:text-text'
          }`}
        >
          <CreditCard className="w-6 h-6" />
          <span>Auto-Renew (Razorpay)</span>
        </button>
        <button
          type="button"
          onClick={() => setMethod('manual')}
          className={`p-4 rounded-2xl border flex flex-col items-center gap-2 text-xs font-mono transition-all ${
            method === 'manual'
              ? 'border-gold bg-gold/10 text-gold font-bold shadow-gold-glow'
              : 'border-border bg-surface-2 text-muted hover:text-text'
          }`}
        >
          <QrCode className="w-6 h-6" />
          <span>UPI / Bank Transfer (Manual)</span>
        </button>
      </div>

      {method === 'razorpay' ? (
        <div className="p-8 rounded-3xl bg-surface border border-border-strong space-y-6">
          <div className="space-y-2">
            <h3 className="font-heading font-bold text-lg text-text">
              Automated Monthly Subscription
            </h3>
            <p className="text-muted text-xs leading-relaxed">
              Recurring monthly billing via Cards, Net Banking, or UPI AutoPay. Cancel anytime from your billing dashboard with zero penalty.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-surface-2 border border-border flex items-center justify-between">
            <div>
              <div className="text-[11px] font-mono text-muted uppercase">BILLING CYCLE</div>
              <div className="text-sm font-mono font-bold text-text">Monthly (Auto-Renew)</div>
            </div>
            <div className="text-right">
              <div className="text-[11px] font-mono text-muted uppercase">TAX INCLUDED</div>
              <div className="text-xs font-mono text-gold">18% GST Compliant</div>
            </div>
          </div>

          <button
            onClick={handleRazorpaySubscribe}
            disabled={loading}
            className="w-full py-4 px-6 rounded-xl bg-gold text-black font-heading font-bold text-sm uppercase tracking-wide hover:bg-gold-soft transition-all shadow-gold-glow flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? 'Initializing Gateway...' : 'Subscribe Now with Razorpay ↗'}
          </button>

          <p className="text-[11px] text-muted text-center flex items-center justify-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-success" />
            256-bit Encrypted SSL · Instant Webhook Entitlement Activation
          </p>
        </div>
      ) : (
        <div className="p-8 rounded-3xl bg-surface border border-border-strong space-y-6">
          {manualSubmitted ? (
            <div className="text-center py-6 space-y-4">
              <div className="w-14 h-14 rounded-full bg-success/15 border border-success/40 text-success flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold font-heading text-text">
                Payment Verification Claim Submitted
              </h3>
              <p className="text-muted text-xs leading-relaxed max-w-md mx-auto">
                Our accounts team has received your UTR (<strong>{utrNumber}</strong>). Your subscription will be approved and active for 30 days within a few hours.
              </p>
              <Link
                href="/app"
                className="inline-block px-6 py-2.5 rounded-xl bg-gold text-black font-semibold text-xs hover:bg-gold-soft transition-colors mt-2"
              >
                Go to Dashboard ↗
              </Link>
            </div>
          ) : (
            <form onSubmit={handleManualClaim} className="space-y-4">
              <div className="space-y-1">
                <h3 className="font-heading font-bold text-lg text-text">
                  Direct UPI / Bank Wire Details
                </h3>
                <p className="text-muted text-xs">
                  Pay directly to our company account and record your UTR for instant manual approval.
                </p>
              </div>

              {/* UPI ID box */}
              <div className="p-3.5 bg-surface-2 rounded-xl border border-border flex items-center justify-between">
                <div>
                  <div className="text-[10px] font-mono text-muted uppercase">UPI ID</div>
                  <div className="text-xs font-mono font-bold text-text">
                    {paymentConfig.upi.upiId}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(paymentConfig.upi.upiId);
                    setCopiedUpi(true);
                    setTimeout(() => setCopiedUpi(false), 2000);
                  }}
                  className="p-1.5 rounded-lg bg-surface border border-border text-xs text-muted hover:text-gold flex items-center gap-1"
                >
                  {copiedUpi ? <Check className="w-3.5 h-3.5 text-success" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedUpi ? 'Copied' : 'Copy'}</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono text-muted uppercase mb-1">
                    Amount Paid (₹) <span className="text-gold">*</span>
                  </label>
                  <input
                    type="number"
                    required
                    value={manualAmount}
                    onChange={(e) => setManualAmount(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-surface-2 border border-border text-text text-xs focus:border-gold focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-muted uppercase mb-1">
                    Method
                  </label>
                  <select
                    value={manualMethod}
                    onChange={(e) => setManualMethod(e.target.value as 'UPI' | 'Bank Transfer')}
                    className="w-full px-3 py-2 rounded-xl bg-surface-2 border border-border text-text text-xs focus:border-gold focus:outline-none"
                  >
                    <option value="UPI">UPI (GPay / PhonePe / Paytm)</option>
                    <option value="Bank Transfer">NEFT / IMPS Bank Transfer</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-muted uppercase mb-1">
                  UTR / Transaction Ref ID <span className="text-gold">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={utrNumber}
                  onChange={(e) => setUtrNumber(e.target.value)}
                  placeholder="12-digit UTR reference"
                  className="w-full px-3 py-2 rounded-xl bg-surface-2 border border-border text-text text-xs focus:border-gold focus:outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-muted uppercase mb-1">
                  Note (Optional)
                </label>
                <input
                  type="text"
                  value={manualNotes}
                  onChange={(e) => setManualNotes(e.target.value)}
                  placeholder="e.g. Paid via company GPay account"
                  className="w-full px-3 py-2 rounded-xl bg-surface-2 border border-border text-text text-xs focus:border-gold focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-4 rounded-xl bg-gold text-black font-heading font-semibold text-xs uppercase tracking-wide hover:bg-gold-soft transition-all shadow-gold-glow disabled:opacity-50"
              >
                {loading ? 'Submitting...' : 'Submit Payment Proof for Approval ↗'}
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense
      fallback={
        <div className="py-24 text-center text-muted font-mono text-sm">
          Loading checkout...
        </div>
      }
    >
      <CheckoutClient />
    </Suspense>
  );
}
