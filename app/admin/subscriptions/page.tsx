'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Download } from 'lucide-react';

interface SubRow {
  id: string;
  user_id: string;
  automation_slug: string;
  status: string;
  provider: string;
  current_period_end: string;
  plans?: { code: string; name: string; price_inr: number };
  profiles?: { full_name: string; phone: string };
}

export default function AdminSubscriptionsPage() {
  const [subscriptions, setSubscriptions] = useState<SubRow[]>([]);
  const [statusFilter, setStatusFilter] = useState('');

  const fetchSubs = useCallback(() => {
    fetch(`/api/admin/subscriptions?status=${statusFilter}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.ok && Array.isArray(data.subscriptions)) {
          setSubscriptions(data.subscriptions);
        }
      })
      .catch(() => {});
  }, [statusFilter]);

  useEffect(() => {
    fetchSubs();
  }, [fetchSubs]);

  const handleExtend = async (subId: string) => {
    const days = prompt('Enter number of days to extend subscription:', '30');
    if (!days) return;

    const res = await fetch('/api/admin/subscriptions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ subscriptionId: subId, action: 'extend', days }),
    });
    const data = await res.json();
    if (data.ok) {
      alert(`Subscription extended by ${days} days.`);
      fetchSubs();
    } else {
      alert(data.error || 'Failed to extend subscription.');
    }
  };

  const handleCancel = async (subId: string) => {
    if (!confirm('Are you sure you want to immediately cancel this subscription?')) return;

    const res = await fetch('/api/admin/subscriptions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ subscriptionId: subId, action: 'cancel' }),
    });
    const data = await res.json();
    if (data.ok) {
      alert('Subscription cancelled.');
      fetchSubs();
    } else {
      alert(data.error || 'Failed to cancel subscription.');
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <span className="text-xs font-mono text-gold uppercase tracking-wider block mb-1">
            ENTITLEMENT CONTROL
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold font-heading text-text">
            Subscriptions Management
          </h1>
          <p className="text-muted text-xs sm:text-sm mt-1">
            Audit recurring entitlements, manually extend access, and cancel subscriptions.
          </p>
        </div>

        <a
          href="/api/admin/export?type=subscriptions"
          download
          className="px-4 py-2 rounded-xl bg-gold text-black font-semibold text-xs font-mono uppercase tracking-wide hover:bg-gold-soft transition-all shadow-gold-glow flex items-center gap-2 self-start sm:self-auto"
        >
          <Download className="w-4 h-4" />
          Export Subscriptions (CSV) ↗
        </a>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {['', 'active', 'past_due', 'paused', 'cancelled', 'expired'].map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-mono uppercase transition-colors ${
              statusFilter === s
                ? 'bg-gold text-black font-bold'
                : 'bg-surface border border-border text-muted hover:text-text'
            }`}
          >
            {s || 'All Statuses'}
          </button>
        ))}
      </div>

      {/* Subscriptions Table */}
      <div className="p-6 rounded-2xl bg-surface border border-border space-y-4">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-border text-muted uppercase text-[10px]">
                <th className="py-2.5">User</th>
                <th className="py-2.5">Automation</th>
                <th className="py-2.5">Plan</th>
                <th className="py-2.5">Provider</th>
                <th className="py-2.5">Status</th>
                <th className="py-2.5">Current End</th>
                <th className="py-2.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {subscriptions.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-6 text-center text-muted">
                    No subscriptions found.
                  </td>
                </tr>
              ) : (
                subscriptions.map((s) => (
                  <tr key={s.id}>
                    <td className="py-3 text-text">
                      <div className="font-bold">{s.profiles?.full_name || 'User'}</div>
                      <div className="text-[10px] text-muted">{s.profiles?.phone || s.user_id.slice(0, 8)}</div>
                    </td>
                    <td className="py-3 text-gold">{s.automation_slug}</td>
                    <td className="py-3">{s.plans?.name || 'Standard'}</td>
                    <td className="py-3 text-muted uppercase text-[10px]">{s.provider}</td>
                    <td className="py-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] ${
                          s.status === 'active'
                            ? 'bg-success/15 border border-success/30 text-success'
                            : 'bg-gold/15 border border-gold/30 text-gold'
                        }`}
                      >
                        {s.status}
                      </span>
                    </td>
                    <td className="py-3 text-muted">
                      {s.current_period_end
                        ? new Date(s.current_period_end).toLocaleDateString('en-IN')
                        : 'N/A'}
                    </td>
                    <td className="py-3 text-right space-x-2">
                      <button
                        onClick={() => handleExtend(s.id)}
                        className="px-2.5 py-1 rounded bg-surface-2 border border-border hover:border-gold text-[11px] text-gold transition-colors"
                      >
                        Extend +30d
                      </button>
                      <button
                        onClick={() => handleCancel(s.id)}
                        className="px-2.5 py-1 rounded bg-surface-2 border border-border hover:border-red-400 text-[11px] text-red-400 transition-colors"
                      >
                        Cancel
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
