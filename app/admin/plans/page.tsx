'use client';

import React, { useState, useEffect } from 'react';
import { formatINR } from '@/lib/format';
import { Sliders, Save, CheckCircle2, AlertTriangle } from 'lucide-react';

interface PlanRow {
  id: string;
  automation_slug: string;
  code: string;
  name: string;
  price_inr: number;
  limits: Record<string, number>;
  is_active: boolean;
  razorpay_plan_id?: string;
}

export default function AdminPlansPage() {
  const [plans, setPlans] = useState<PlanRow[]>([]);
  const [editingPlan, setEditingPlan] = useState<PlanRow | null>(null);
  const [limitsJson, setLimitsJson] = useState('{}');
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const fetchPlans = () => {
    fetch('/api/admin/plans')
      .then((res) => res.json())
      .then((data) => {
        if (data.ok && Array.isArray(data.plans)) {
          setPlans(data.plans);
        }
      })
      .catch(() => {});
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  const handleEdit = (p: PlanRow) => {
    setEditingPlan({ ...p });
    setLimitsJson(JSON.stringify(p.limits || {}, null, 2));
    setMsg(null);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPlan) return;

    let parsedLimits = {};
    try {
      parsedLimits = JSON.parse(limitsJson);
    } catch {
      alert('Invalid JSON in limits field.');
      return;
    }

    setSaving(true);
    try {
      const res = await fetch('/api/admin/plans', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editingPlan.id,
          name: editingPlan.name,
          price_inr: editingPlan.price_inr,
          limits: parsedLimits,
          is_active: editingPlan.is_active,
        }),
      });
      const data = await res.json();
      if (data.ok) {
        setMsg('Plan configuration updated successfully.');
        fetchPlans();
        setTimeout(() => setEditingPlan(null), 1500);
      } else {
        alert(data.error || 'Failed to update plan.');
      }
    } catch {
      alert('Network error saving plan.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="border-b border-border pb-6">
        <span className="text-xs font-mono text-gold uppercase tracking-wider block mb-1">
          CATALOG CONFIGURATION
        </span>
        <h1 className="text-2xl sm:text-3xl font-bold font-heading text-text">
          Plans &amp; Quota Limits
        </h1>
        <p className="text-muted text-xs sm:text-sm mt-1">
          Edit tier pricing, monthly quota limits, and availability flags across all 5 automations.
        </p>
      </div>

      {editingPlan && (
        <div className="p-6 md:p-8 rounded-3xl bg-surface border border-gold/40 shadow-2xl space-y-4 max-w-xl">
          <div className="flex items-center justify-between">
            <h3 className="font-heading font-bold text-lg text-text">
              Editing Plan: {editingPlan.code}
            </h3>
            <button
              onClick={() => setEditingPlan(null)}
              className="text-xs font-mono text-muted hover:text-text"
            >
              Cancel
            </button>
          </div>

          {msg && (
            <div className="p-3 bg-success/10 border border-success/30 text-success text-xs rounded-xl flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              {msg}
            </div>
          )}

          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block text-xs font-mono text-muted uppercase mb-1">
                Display Name
              </label>
              <input
                type="text"
                value={editingPlan.name}
                onChange={(e) => setEditingPlan({ ...editingPlan, name: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-surface-2 border border-border text-text text-xs focus:border-gold focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-muted uppercase mb-1">
                Price (INR / Month)
              </label>
              <input
                type="number"
                value={editingPlan.price_inr}
                onChange={(e) =>
                  setEditingPlan({ ...editingPlan, price_inr: Number(e.target.value) })
                }
                className="w-full px-3.5 py-2.5 rounded-xl bg-surface-2 border border-border text-text text-xs focus:border-gold focus:outline-none font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-muted uppercase mb-1">
                Quota Limits (JSON)
              </label>
              <textarea
                rows={4}
                value={limitsJson}
                onChange={(e) => setLimitsJson(e.target.value)}
                className="w-full p-3 rounded-xl bg-surface-2 border border-border text-text text-xs font-mono focus:border-gold focus:outline-none"
              />
            </div>

            <label className="flex items-center gap-2 text-xs font-mono text-text cursor-pointer">
              <input
                type="checkbox"
                checked={editingPlan.is_active}
                onChange={(e) => setEditingPlan({ ...editingPlan, is_active: e.target.checked })}
                className="rounded border-border text-gold focus:ring-gold"
              />
              <span>Plan is Active for New Checkouts</span>
            </label>

            <button
              type="submit"
              disabled={saving}
              className="py-2.5 px-5 rounded-xl bg-gold text-black font-semibold text-xs uppercase hover:bg-gold-soft transition-colors shadow-gold-glow flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              {saving ? 'Saving...' : 'Save Plan Configuration'}
            </button>
          </form>
        </div>
      )}

      {/* Plans List */}
      <div className="p-6 rounded-2xl bg-surface border border-border space-y-4">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-border text-muted uppercase text-[10px]">
                <th className="py-2.5">Code</th>
                <th className="py-2.5">Automation</th>
                <th className="py-2.5">Name</th>
                <th className="py-2.5">Price / mo</th>
                <th className="py-2.5">Limits</th>
                <th className="py-2.5">Active</th>
                <th className="py-2.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {plans.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-6 text-center text-muted">
                    No plans found in database. Seed SQL to populate default plans.
                  </td>
                </tr>
              ) : (
                plans.map((p) => (
                  <tr key={p.id}>
                    <td className="py-3 text-gold font-bold">{p.code}</td>
                    <td className="py-3 text-text">{p.automation_slug}</td>
                    <td className="py-3">{p.name}</td>
                    <td className="py-3 text-text font-bold">{formatINR(p.price_inr)}</td>
                    <td className="py-3 text-muted">{JSON.stringify(p.limits || {})}</td>
                    <td className="py-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] ${
                          p.is_active
                            ? 'bg-success/15 border border-success/30 text-success'
                            : 'bg-surface-2 text-muted'
                        }`}
                      >
                        {p.is_active ? 'YES' : 'NO'}
                      </span>
                    </td>
                    <td className="py-3 text-right">
                      <button
                        onClick={() => handleEdit(p)}
                        className="px-2.5 py-1 rounded bg-surface-2 border border-border hover:border-gold text-[11px] text-gold"
                      >
                        Edit
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
