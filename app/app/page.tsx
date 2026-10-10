'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { saasAutomations } from '@/data/saas';
import {
  Activity,
  ArrowRight,
  ShieldCheck,
  Cpu,
  CheckCircle2,
  AlertTriangle,
  Play,
  Layers,
  Clock,
  Sparkles,
} from 'lucide-react';

interface AutomationCardState {
  slug: string;
  title: string;
  number: string;
  status: 'active' | 'past_due' | 'paused' | 'unsubscribed';
  planName?: string;
}

export default function DashboardOverviewPage() {
  const [activeTab, setActiveTab] = useState<'all' | 'active'>('all');
  const [recentRuns, setRecentRuns] = useState<
    { id: string; slug: string; type: string; status: string; createdAt: string }[]
  >([
    {
      id: 'run_init_1',
      slug: 'demo-automation',
      type: 'benchmark_execution',
      status: 'succeeded',
      createdAt: new Date().toLocaleTimeString('en-IN'),
    },
  ]);

  const [cardStates, setCardStates] = useState<AutomationCardState[]>([
    { slug: 'lead-capture-crm', title: 'Lead Capture & CRM', number: '01', status: 'unsubscribed' },
    { slug: 'email-outreach', title: 'Cold Email Outreach', number: '02', status: 'unsubscribed' },
    { slug: 'social-auto-posting', title: 'Social Auto-Posting', number: '03', status: 'unsubscribed' },
    { slug: 'voice-agent', title: 'Voice AI Receptionist', number: '04', status: 'unsubscribed' },
    { slug: 'youtube-automation', title: 'YouTube Automation', number: '05', status: 'unsubscribed' },
    { slug: 'demo-automation', title: 'Demo Benchmark', number: '00', status: 'active', planName: 'Platform Test Plan' },
  ]);

  useEffect(() => {
    // Check subscription status for automations
    fetch('/api/billing/status?slug=demo-automation')
      .then((res) => res.json())
      .then((data) => {
        if (data.ok && data.active) {
          // Keep demo active
        }
      })
      .catch(() => {});
  }, []);

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <span className="text-xs font-mono text-gold uppercase tracking-wider block mb-1">
            CONTROL CENTER
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold font-heading text-text">
            Client Automation Dashboard
          </h1>
          <p className="text-muted text-xs sm:text-sm mt-1">
            Monitor background pipelines, inspect execution runs, and manage quota entitlements.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3 py-1.5 rounded-full border border-border bg-surface-2 text-xs font-mono text-muted flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-success animate-pulse"></span>
            <span>All Background Workers Active</span>
          </div>
        </div>
      </div>

      {/* Quota Usage Metric Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Leads Processed', used: 0, limit: 500, metric: 'leads' },
          { label: 'Outreach Sent', used: 0, limit: 1500, metric: 'emails' },
          { label: 'Social Posts', used: 0, limit: 60, metric: 'posts' },
          { label: 'Benchmark Units', used: 1, limit: 1000, metric: 'units' },
        ].map((m, idx) => {
          const pct = Math.round((m.used / m.limit) * 100);
          return (
            <div key={idx} className="p-4 rounded-2xl bg-surface border border-border space-y-2">
              <span className="text-[10px] font-mono text-muted uppercase block">
                {m.label}
              </span>
              <div className="text-lg font-mono font-bold text-text">
                {m.used} <span className="text-xs text-muted font-normal">/ {m.limit}</span>
              </div>
              <div className="w-full h-1.5 bg-surface-2 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gold rounded-full transition-all duration-500"
                  style={{ width: `${Math.max(5, pct)}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Automations Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold font-heading text-text flex items-center gap-2">
            <Layers className="w-4 h-4 text-gold" />
            Automation Fleet
          </h2>
          <Link
            href="/saas"
            className="text-xs font-mono text-gold hover:underline flex items-center gap-1"
          >
            Explore all plans ↗
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cardStates.map((item) => (
            <div
              key={item.slug}
              className="rounded-2xl bg-surface border border-border p-6 flex flex-col justify-between hover:border-gold/50 transition-all duration-300"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="font-mono text-xs text-muted">MODULE {item.number}</span>
                  {item.status === 'active' ? (
                    <span className="px-2.5 py-0.5 rounded-full bg-success/15 border border-success/30 text-[10px] font-mono text-success flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-success"></span>
                      ACTIVE
                    </span>
                  ) : item.status === 'past_due' ? (
                    <span className="px-2.5 py-0.5 rounded-full bg-gold/15 border border-gold/30 text-[10px] font-mono text-gold">
                      PAST DUE (GRACE)
                    </span>
                  ) : (
                    <span className="px-2.5 py-0.5 rounded-full bg-surface-2 border border-border text-[10px] font-mono text-muted">
                      NOT SUBSCRIBED
                    </span>
                  )}
                </div>

                <h3 className="text-lg font-bold font-heading text-text mb-1">
                  {item.title}
                </h3>
                <p className="text-muted text-xs leading-relaxed mb-6">
                  {item.slug === 'demo-automation'
                    ? 'Built-in platform testing benchmark. Dispatches dummy pipeline runs and tests quota consumption.'
                    : 'Autonomous cloud pipeline connected with state management, webhooks, and retry engines.'}
                </p>
              </div>

              <div className="pt-4 border-t border-border flex items-center justify-between">
                <span className="text-xs font-mono text-gold">
                  {item.planName || 'From ₹999/mo'}
                </span>
                <Link
                  href={`/app/${item.slug}`}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-2 hover:bg-gold hover:text-black border border-border hover:border-gold text-xs font-heading font-semibold transition-all"
                >
                  {item.status === 'active' ? 'Open Workspace' : 'View Plans'}
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activity Table */}
      <div className="p-6 rounded-2xl bg-surface border border-border space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold font-heading text-text flex items-center gap-2">
            <Activity className="w-4 h-4 text-gold" />
            Recent Platform Runs
          </h3>
          <span className="text-xs font-mono text-muted">Live Pipeline Stream</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-border text-muted font-mono uppercase text-[10px]">
                <th className="py-2.5">Run ID</th>
                <th className="py-2.5">Automation</th>
                <th className="py-2.5">Type</th>
                <th className="py-2.5">Status</th>
                <th className="py-2.5">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {recentRuns.map((r) => (
                <tr key={r.id} className="font-mono text-text/80">
                  <td className="py-3 text-gold font-bold">{r.id}</td>
                  <td className="py-3">{r.slug}</td>
                  <td className="py-3">{r.type}</td>
                  <td className="py-3">
                    <span className="px-2 py-0.5 rounded bg-success/15 border border-success/30 text-success text-[10px]">
                      {r.status}
                    </span>
                  </td>
                  <td className="py-3 text-muted">{r.createdAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
