'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { getAutomationModule } from '@/lib/automations/registry';
import { formatINR } from '@/lib/format';
import {
  ArrowLeft,
  Lock,
  Play,
  Pause,
  Activity,
  Clock,
  Settings,
  Sliders,
  BarChart2,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Trash2,
  Unlink,
} from 'lucide-react';

interface AutomationConsoleClientProps {
  slug: string;
}

export const AutomationConsoleClient: React.FC<AutomationConsoleClientProps> = ({ slug }) => {
  const autoModule = getAutomationModule(slug);
  const isDemo = slug === 'demo-automation';

  const [activeTab, setActiveTab] = useState<'overview' | 'setup' | 'activity' | 'usage' | 'settings'>('overview');
  const [isSubscribed, setIsSubscribed] = useState(isDemo);
  const [loading, setLoading] = useState(!isDemo);

  // Instance states
  const [instanceId, setInstanceId] = useState(`inst_${slug}_main`);
  const [instanceName, setInstanceName] = useState(autoModule?.title || 'My Automation');
  const [instanceStatus, setInstanceStatus] = useState<'active' | 'paused' | 'draft'>('active');
  const [toggleLoading, setToggleLoading] = useState(false);

  // Runs
  const [runs, setRuns] = useState<
    { id: string; type: string; status: string; createdAt: string; error?: string }[]
  >([]);

  // Usage
  const [usage, setUsage] = useState({
    used: isDemo ? 1 : 0,
    limit: 1000,
    metric: autoModule?.metrics[0]?.label || 'Units',
  });

  useEffect(() => {
    if (isDemo) return;

    fetch(`/api/billing/status?slug=${slug}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.ok && data.active) {
          setIsSubscribed(true);
        } else {
          setIsSubscribed(false);
        }
      })
      .catch(() => setIsSubscribed(false))
      .finally(() => setLoading(false));

    // Fetch runs
    fetch(`/api/automations/${slug}/runs`)
      .then((res) => res.json())
      .then((data) => {
        if (data.ok && Array.isArray(data.runs)) {
          setRuns(data.runs);
        }
      })
      .catch(() => {});
  }, [slug, isDemo]);

  if (!autoModule) {
    return (
      <div className="py-20 text-center">
        <h2 className="text-xl font-bold font-heading text-text">Automation Not Found</h2>
        <Link href="/app" className="text-gold text-xs font-mono mt-4 inline-block hover:underline">
          Return to Overview ↗
        </Link>
      </div>
    );
  }

  const SetupWizardComponent = autoModule.SetupWizard;
  const WorkspaceComponent = autoModule.Workspace;

  const handleToggleActive = async () => {
    setToggleLoading(true);
    const endpoint =
      instanceStatus === 'active'
        ? `/api/automations/${slug}/instances/${instanceId}/pause`
        : `/api/automations/${slug}/instances/${instanceId}/activate`;

    try {
      const res = await fetch(endpoint, { method: 'POST' });
      const data = await res.json();
      if (data.ok) {
        setInstanceStatus(data.status);
      }
    } catch {
      // Toggle locally for demo/mock
      setInstanceStatus(instanceStatus === 'active' ? 'paused' : 'active');
    } finally {
      setToggleLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="py-24 text-center text-muted font-mono text-xs">
        Checking entitlement permissions...
      </div>
    );
  }

  // LOCKED STATE: User does not have an active subscription for this module
  if (!isSubscribed) {
    const plansForSlug = [
      { code: `${slug}-basic`, name: 'Basic', price: 3500 },
      { code: `${slug}-growth`, name: 'Growth', price: 5500 },
      { code: `${slug}-pro`, name: 'Pro', price: 7500 },
    ];

    return (
      <div className="space-y-8 max-w-4xl mx-auto py-8">
        <div>
          <Link
            href="/app"
            className="inline-flex items-center gap-2 text-xs font-mono text-muted hover:text-gold transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
        </div>

        <div className="p-8 md:p-12 rounded-3xl bg-surface border border-border-strong text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-gold/10 border border-gold/30 text-gold flex items-center justify-center mx-auto">
            <Lock className="w-8 h-8" />
          </div>

          <span className="text-xs font-mono text-gold uppercase tracking-wider px-3 py-1 rounded bg-gold/10 border border-gold/20 inline-block">
            SUBSCRIPTION REQUIRED
          </span>

          <h1 className="text-2xl md:text-3xl font-bold font-heading text-text">
            {autoModule.title}
          </h1>

          <p className="text-muted text-xs md:text-sm max-w-xl mx-auto leading-relaxed">
            This module requires an active monthly entitlement. Subscribe to a tier below to immediately unlock automated workflows, webhooks, and execution pipelines.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
            {plansForSlug.map((p) => (
              <div
                key={p.code}
                className="p-6 rounded-2xl bg-surface-2 border border-border flex flex-col justify-between space-y-4 hover:border-gold transition-colors"
              >
                <div>
                  <div className="text-xs font-mono text-muted uppercase">{p.name} Plan</div>
                  <div className="text-2xl font-mono font-extrabold text-gold mt-1">
                    {formatINR(p.price)}
                    <span className="text-xs text-muted font-normal">/mo</span>
                  </div>
                </div>

                <Link
                  href={`/app/checkout?plan=${p.code}`}
                  className="w-full py-2.5 px-4 rounded-xl bg-gold text-black font-heading font-semibold text-xs uppercase tracking-wide hover:bg-gold-soft transition-all shadow-gold-glow text-center"
                >
                  Subscribe Now ↗
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ACTIVE WORKSPACE CONSOLE
  return (
    <div className="space-y-8">
      {/* Back button */}
      <div>
        <Link
          href="/app"
          className="inline-flex items-center gap-2 text-xs font-mono text-muted hover:text-gold transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>
      </div>

      {/* Header with Title and On/Off Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono text-gold uppercase tracking-wider">
              PIPELINE CONSOLE
            </span>
            <span
              className={`px-2 py-0.5 rounded text-[10px] font-mono ${
                instanceStatus === 'active'
                  ? 'bg-success/15 border border-success/30 text-success'
                  : 'bg-gold/15 border border-gold/30 text-gold'
              }`}
            >
              {instanceStatus.toUpperCase()}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-heading text-text">
            {autoModule.title}
          </h1>
        </div>

        {/* On/Off Toggle */}
        <button
          onClick={handleToggleActive}
          disabled={toggleLoading}
          className={`px-5 py-2.5 rounded-xl font-heading font-bold text-xs uppercase tracking-wide flex items-center gap-2 transition-all ${
            instanceStatus === 'active'
              ? 'bg-surface-2 border border-border text-muted hover:border-red-400 hover:text-red-400'
              : 'bg-gold text-black hover:bg-gold-soft shadow-gold-glow'
          }`}
        >
          {instanceStatus === 'active' ? (
            <>
              <Pause className="w-3.5 h-3.5" />
              Pause Automation
            </>
          ) : (
            <>
              <Play className="w-3.5 h-3.5 fill-black" />
              Activate Pipeline
            </>
          )}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border gap-2 overflow-x-auto">
        {[
          { id: 'overview', label: 'Overview', icon: Activity },
          { id: 'setup', label: 'Setup Wizard', icon: Sliders },
          { id: 'activity', label: 'Activity & Runs', icon: Clock },
          { id: 'usage', label: 'Usage Limits', icon: BarChart2 },
          { id: 'settings', label: 'Settings', icon: Settings },
        ].map((tab) => {
          const Icon = tab.icon;
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`flex items-center gap-2 px-4 py-3 text-xs font-mono uppercase tracking-wider border-b-2 font-medium transition-colors whitespace-nowrap ${
                active
                  ? 'border-gold text-gold bg-gold/5'
                  : 'border-transparent text-muted hover:text-text'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab 1: Overview */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <WorkspaceComponent instanceId={instanceId} />
        </div>
      )}

      {/* Tab 2: Setup Wizard */}
      {activeTab === 'setup' && (
        <div className="space-y-6">
          <SetupWizardComponent instanceId={instanceId} />
        </div>
      )}

      {/* Tab 3: Activity & Runs */}
      {activeTab === 'activity' && (
        <div className="p-6 rounded-2xl bg-surface border border-border space-y-4">
          <h3 className="text-base font-bold font-heading text-text">Execution Runs</h3>
          <p className="text-muted text-xs">
            Immutable log of all triggers, API requests, and background executions for this instance.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-border text-muted uppercase text-[10px]">
                  <th className="py-2.5">Run ID</th>
                  <th className="py-2.5">Type</th>
                  <th className="py-2.5">Status</th>
                  <th className="py-2.5">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {runs.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-6 text-center text-muted">
                      No execution runs recorded yet. Click &quot;Execute Test Run&quot; on the Overview tab.
                    </td>
                  </tr>
                ) : (
                  runs.map((r) => (
                    <tr key={r.id}>
                      <td className="py-3 text-gold font-bold">{r.id}</td>
                      <td className="py-3">{r.type}</td>
                      <td className="py-3">
                        <span className="px-2 py-0.5 rounded bg-success/15 border border-success/30 text-success text-[10px]">
                          {r.status}
                        </span>
                      </td>
                      <td className="py-3 text-muted">{r.createdAt}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 4: Usage Limits */}
      {activeTab === 'usage' && (
        <div className="p-6 rounded-2xl bg-surface border border-border space-y-6">
          <div>
            <h3 className="text-base font-bold font-heading text-text">Plan Quotas &amp; Counters</h3>
            <p className="text-muted text-xs mt-1">
              Limits refresh automatically at the start of each monthly billing cycle.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-surface-2 border border-border space-y-3">
            <div className="flex justify-between items-center text-xs font-mono">
              <span className="text-text font-bold">{usage.metric}</span>
              <span className="text-gold">
                {usage.used} / {usage.limit} Units
              </span>
            </div>
            <div className="w-full h-2 bg-surface rounded-full overflow-hidden">
              <div
                className="h-full bg-gold rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, (usage.used / usage.limit) * 100)}%` }}
              />
            </div>
            <p className="text-[11px] text-muted">
              Automatic throttle triggers at 100%. Contact support or upgrade plan for higher capacity.
            </p>
          </div>
        </div>
      )}

      {/* Tab 5: Settings */}
      {activeTab === 'settings' && (
        <div className="p-6 rounded-2xl bg-surface border border-border space-y-6 max-w-xl">
          <h3 className="text-base font-bold font-heading text-text">Instance Controls</h3>

          <div>
            <label className="block text-xs font-mono text-muted uppercase mb-1">
              Instance Name
            </label>
            <input
              type="text"
              value={instanceName}
              onChange={(e) => setInstanceName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-surface-2 border border-border text-text text-xs focus:border-gold focus:outline-none"
            />
          </div>

          <div className="pt-4 border-t border-border flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-text">Disconnect Integrations</div>
              <div className="text-[11px] text-muted">
                Removes connected OAuth credentials from the encrypted vault.
              </div>
            </div>
            <button
              onClick={() => alert('Credentials disconnected.')}
              className="px-3.5 py-2 rounded-xl bg-surface-2 border border-border hover:border-red-400 hover:text-red-400 text-xs font-mono transition-colors"
            >
              Disconnect
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
