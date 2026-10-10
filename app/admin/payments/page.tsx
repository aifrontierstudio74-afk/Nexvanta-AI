'use client';

import React, { useState, useEffect } from 'react';
import { formatINR } from '@/lib/format';
import { CheckCircle2, XCircle, Clock, ShieldCheck, QrCode } from 'lucide-react';

interface PaymentClaim {
  id: string;
  user_id: string;
  provider: string;
  amount_inr: number;
  status: string;
  utr: string;
  method: string;
  notes: string;
  created_at: string;
  profiles?: { full_name: string; phone: string };
}

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState<PaymentClaim[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchQueue = () => {
    fetch('/api/admin/payments?status=pending')
      .then((res) => res.json())
      .then((data) => {
        if (data.ok && Array.isArray(data.payments)) {
          setPayments(data.payments);
        }
      })
      .catch(() => {});
  };

  useEffect(() => {
    fetchQueue();
  }, []);

  const handleApprove = async (paymentId: string) => {
    if (!confirm('Verify: Have you confirmed this credit in your bank account / UPI statement?')) {
      return;
    }

    const res = await fetch('/api/admin/payments/approve', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ paymentId }),
    });
    const data = await res.json();
    if (data.ok) {
      alert('Payment approved. 30-day subscription entitlement activated for user.');
      fetchQueue();
    } else {
      alert(data.error || 'Approval failed.');
    }
  };

  const handleReject = async (paymentId: string) => {
    const reason = prompt(
      'Enter reason for rejection (sent to customer email):',
      'Transaction reference not found in bank statement.'
    );
    if (!reason) return;

    const res = await fetch('/api/admin/payments/reject', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ paymentId, reason }),
    });
    const data = await res.json();
    if (data.ok) {
      alert('Payment rejected and customer notified.');
      fetchQueue();
    } else {
      alert(data.error || 'Rejection failed.');
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="border-b border-border pb-6">
        <span className="text-xs font-mono text-gold uppercase tracking-wider block mb-1">
          FINANCE &amp; RECONCILIATION
        </span>
        <h1 className="text-2xl sm:text-3xl font-bold font-heading text-text">
          Manual Payment Approvals Queue
        </h1>
        <p className="text-muted text-xs sm:text-sm mt-1">
          Verify incoming UPI / IMPS transaction references against bank records before granting live access.
        </p>
      </div>

      {/* Queue List */}
      <div className="p-6 rounded-2xl bg-surface border border-border space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold font-heading text-text flex items-center gap-2">
            <QrCode className="w-4 h-4 text-gold" />
            Pending Verification Claims ({payments.length})
          </h2>
          <button
            onClick={fetchQueue}
            className="text-xs font-mono text-gold hover:underline"
          >
            Refresh Queue ↻
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-border text-muted uppercase text-[10px]">
                <th className="py-2.5">User Details</th>
                <th className="py-2.5">Amount</th>
                <th className="py-2.5">Method</th>
                <th className="py-2.5">UTR / Reference</th>
                <th className="py-2.5">Note</th>
                <th className="py-2.5">Claimed At</th>
                <th className="py-2.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {payments.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-muted">
                    No pending payment claims waiting for verification. All clear!
                  </td>
                </tr>
              ) : (
                payments.map((p) => (
                  <tr key={p.id}>
                    <td className="py-3 text-text">
                      <div className="font-bold">{p.profiles?.full_name || 'Customer'}</div>
                      <div className="text-[10px] text-muted">{p.profiles?.phone || p.user_id.slice(0, 8)}</div>
                    </td>
                    <td className="py-3 text-gold font-bold">{formatINR(p.amount_inr)}</td>
                    <td className="py-3">{p.method}</td>
                    <td className="py-3 text-gold font-mono">{p.utr}</td>
                    <td className="py-3 text-muted">{p.notes || '-'}</td>
                    <td className="py-3 text-muted">
                      {new Date(p.created_at).toLocaleDateString('en-IN')}
                    </td>
                    <td className="py-3 text-right space-x-2">
                      <button
                        onClick={() => handleApprove(p.id)}
                        className="px-3 py-1.5 rounded-lg bg-success text-black font-semibold text-xs hover:bg-success/90 transition-colors"
                      >
                        Approve Access
                      </button>
                      <button
                        onClick={() => handleReject(p.id)}
                        className="px-3 py-1.5 rounded-lg bg-surface-2 border border-border hover:border-red-400 text-red-400 text-xs transition-colors"
                      >
                        Reject
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
