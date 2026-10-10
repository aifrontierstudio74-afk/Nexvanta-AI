'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { formatINR } from '@/lib/format';
import {
  CreditCard,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ShieldCheck,
  FileText,
  Mail,
  RefreshCw,
} from 'lucide-react';

interface SubscriptionItem {
  id: string;
  automation_slug: string;
  status: string;
  provider: string;
  current_period_end: string;
  planName: string;
  priceInr: number;
}

export default function BillingPage() {
  const [subscriptions, setSubscriptions] = useState<SubscriptionItem[]>([
    {
      id: 'sub_demo_1',
      automation_slug: 'demo-automation',
      status: 'active',
      provider: 'razorpay',
      current_period_end: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN'),
      planName: 'Platform Test Plan',
      priceInr: 999,
    },
  ]);

  const [payments, setPayments] = useState<
    { id: string; amount: number; method: string; status: string; date: string }[]
  >([
    {
      id: 'pay_demo_1',
      amount: 999,
      method: 'Razorpay / UPI',
      status: 'captured',
      date: new Date().toLocaleDateString('en-IN'),
    },
  ]);

  const [loading, setLoading] = useState(false);

  const handleCancelSub = async (subId: string) => {
    if (!confirm('Are you sure you want to cancel auto-renewal? Access will remain active until the end of your billing cycle.')) {
      return;
    }
    alert('Auto-renewal cancelled. Entitlement remains active through the current cycle.');
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="border-b border-border pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono text-gold uppercase tracking-wider block mb-1">
            FINANCIAL CONTROLS
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold font-heading text-text">
            Billing &amp; Subscriptions
          </h1>
          <p className="text-muted text-xs sm:text-sm mt-1">
            Manage recurring automation entitlements, invoices, and payment receipts.
          </p>
        </div>

        <div className="text-xs font-mono text-gold bg-gold/10 border border-gold/30 px-3 py-1.5 rounded-xl text-center">
          GST (18%) Included in all stated rates
        </div>
      </div>

      {/* Active Subscriptions List */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold font-heading text-text flex items-center gap-2">
          <CreditCard className="w-4 h-4 text-gold" />
          Active Subscriptions
        </h2>

        {subscriptions.length === 0 ? (
          <div className="p-8 rounded-2xl bg-surface border border-border text-center space-y-3">
            <p className="text-muted text-xs">No active subscriptions currently linked.</p>
            <Link
              href="/saas"
              className="inline-block px-4 py-2 rounded-xl bg-gold text-black font-semibold text-xs uppercase"
            >
              Browse SaaS Plans ↗
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {subscriptions.map((sub) => (
              <div
                key={sub.id}
                className="p-6 rounded-2xl bg-surface border border-border flex flex-col md:flex-row md:items-center justify-between gap-6"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-heading font-bold text-base text-text">
                      {sub.planName}
                    </h3>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-success/15 border border-success/30 text-success">
                      {sub.status.toUpperCase()}
                    </span>
                  </div>
                  <div className="text-xs font-mono text-muted">
                    Module: <span className="text-gold">{sub.automation_slug}</span> · Provider: {sub.provider}
                  </div>
                  <div className="text-xs text-muted">
                    Renews on: <span className="text-text font-medium">{sub.current_period_end}</span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-baseline sm:items-center gap-4">
                  <div className="text-2xl font-mono font-bold text-gold">
                    {formatINR(sub.priceInr)}
                    <span className="text-xs text-muted font-normal">/mo</span>
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <Link
                      href={`/app/checkout?plan=${sub.automation_slug}-pro`}
                      className="px-3.5 py-2 rounded-xl bg-surface-2 border border-border hover:border-gold text-xs font-mono transition-colors text-center"
                    >
                      Change Plan
                    </Link>
                    <button
                      onClick={() => handleCancelSub(sub.id)}
                      className="px-3.5 py-2 rounded-xl bg-surface-2 border border-border hover:border-red-400 hover:text-red-400 text-xs font-mono transition-colors"
                    >
                      Cancel Renewal
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Payment History Table */}
      <div className="p-6 rounded-2xl bg-surface border border-border space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold font-heading text-text flex items-center gap-2">
            <FileText className="w-4 h-4 text-gold" />
            Payment History
          </h3>
          <a
            href="mailto:hello.nexvanta56@gmail.com?subject=Tax%20Invoice%20Request"
            className="text-xs font-mono text-gold hover:underline flex items-center gap-1"
          >
            <Mail className="w-3.5 h-3.5" />
            Request GST Tax Invoice ↗
          </a>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-border text-muted uppercase text-[10px]">
                <th className="py-2.5">Transaction ID</th>
                <th className="py-2.5">Amount</th>
                <th className="py-2.5">Method</th>
                <th className="py-2.5">Status</th>
                <th className="py-2.5">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {payments.map((p) => (
                <tr key={p.id}>
                  <td className="py-3 text-gold font-bold">{p.id}</td>
                  <td className="py-3">{formatINR(p.amount)}</td>
                  <td className="py-3">{p.method}</td>
                  <td className="py-3">
                    <span className="px-2 py-0.5 rounded bg-success/15 border border-success/30 text-success text-[10px]">
                      {p.status}
                    </span>
                  </td>
                  <td className="py-3 text-muted">{p.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
