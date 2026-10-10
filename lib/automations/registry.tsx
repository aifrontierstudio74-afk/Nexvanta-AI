'use client';

import React, { useState } from 'react';
import { z } from 'zod';
import { AutomationModule, AutomationSlug, ModuleContext } from '@/lib/automations/types';
import { Sparkles, Play, CheckCircle2, AlertTriangle, Layers, Settings, Activity } from 'lucide-react';

// Default / Connected Placeholder Workspace for Prompts 2-6
function PlaceholderSetupWizard({
  instanceId,
  title,
}: {
  instanceId: string;
  title: string;
}) {
  return (
    <div className="p-8 rounded-2xl bg-surface border border-border space-y-4">
      <div className="flex items-center gap-2 text-xs font-mono text-gold uppercase">
        <Settings className="w-4 h-4" />
        Configuration Wizard
      </div>
      <h3 className="text-xl font-bold font-heading text-text">{title} Setup</h3>
      <p className="text-muted text-sm leading-relaxed max-w-xl">
        This automation module is currently provisioned and waiting for pipeline connection (to be plugged in via subsequent automation prompts).
      </p>
      <div className="p-4 rounded-xl bg-surface-2 border border-border text-xs font-mono text-muted">
        Instance Identifier: <span className="text-gold">{instanceId}</span>
      </div>
    </div>
  );
}

function PlaceholderWorkspace({
  instanceId,
  title,
}: {
  instanceId: string;
  title: string;
}) {
  return (
    <div className="p-8 rounded-2xl bg-surface border border-border space-y-6">
      <div className="flex items-center gap-2 text-xs font-mono text-gold uppercase">
        <Activity className="w-4 h-4" />
        Active Workspace
      </div>
      <h3 className="text-2xl font-bold font-heading text-text">{title}</h3>
      <p className="text-muted text-sm leading-relaxed max-w-xl">
        The core SaaS platform is fully managing subscription entitlements, usage meters, credentials, and background queues for this automation. Full logic for this module will connect in Prompts 2 through 6.
      </p>
      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gold/10 border border-gold/30 text-gold text-xs font-mono">
        <CheckCircle2 className="w-4 h-4 text-success" />
        Platform Entitlement &amp; Runtime Ready
      </div>
    </div>
  );
}

// Built-in DEMO MODULE: interactive test run + quota consumer
function DemoSetupWizard({ instanceId }: { instanceId: string }) {
  return (
    <div className="p-6 rounded-2xl bg-surface border border-border space-y-4">
      <h3 className="text-lg font-bold font-heading text-text">Demo Configuration</h3>
      <p className="text-muted text-xs leading-relaxed">
        Instance: <span className="font-mono text-gold">{instanceId}</span>
      </p>
      <div className="p-4 rounded-xl bg-surface-2 border border-border text-xs text-muted">
        Configure demo execution intervals and mock ingestion parameters.
      </div>
    </div>
  );
}

function DemoWorkspace({ instanceId }: { instanceId: string }) {
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const handleTestRun = async () => {
    setRunning(true);
    setResult(null);
    try {
      const res = await fetch('/api/automations/demo-automation/x/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ instanceId, payload: { timestamp: Date.now() } }),
      });
      const data = await res.json();
      if (data.ok) {
        setResult(`Success! Run ID: ${data.runId}. Consumed 1 unit. Remaining: ${data.remaining}`);
      } else {
        setResult(`Failed: ${data.error || 'Execution blocked'}`);
      }
    } catch {
      setResult('Failed to execute test run.');
    } finally {
      setRunning(false);
    }
  };

  return (
    <div className="p-8 rounded-2xl bg-surface border border-border space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-xs font-mono text-gold uppercase tracking-wider block mb-1">
            TESTING BENCHMARK
          </span>
          <h3 className="text-2xl font-bold font-heading text-text">
            Demo Platform Automation
          </h3>
        </div>
        <button
          onClick={handleTestRun}
          disabled={running}
          className="px-5 py-2.5 rounded-xl bg-gold text-black font-heading font-bold text-xs uppercase tracking-wide hover:bg-gold-soft transition-all shadow-gold-glow flex items-center gap-2 disabled:opacity-50"
        >
          <Play className="w-3.5 h-3.5 fill-black" />
          {running ? 'Executing Run...' : 'Execute Test Run (Consumes 1 Unit)'}
        </button>
      </div>

      <p className="text-muted text-sm leading-relaxed">
        Click the button above to test end-to-end quota consumption, entitlement verification, background run insertion, and usage meter tracking.
      </p>

      {result && (
        <div className="p-4 rounded-xl bg-surface-2 border border-gold/40 text-xs font-mono text-text">
          {result}
        </div>
      )}
    </div>
  );
}

// Registry definition
export const automationRegistry: Record<AutomationSlug, AutomationModule> = {
  'lead-capture-crm': {
    slug: 'lead-capture-crm',
    title: 'Lead Capture & Instant AI Qualification CRM',
    configSchema: z.object({ webhookUrl: z.string().optional() }),
    defaultConfig: {},
    metrics: [{ key: 'leads', label: 'Leads Qualified' }],
    SetupWizard: ({ instanceId }) => (
      <PlaceholderSetupWizard instanceId={instanceId} title="Lead Capture CRM" />
    ),
    Workspace: ({ instanceId }) => (
      <PlaceholderWorkspace instanceId={instanceId} title="Lead Capture CRM" />
    ),
    inngestFunctions: [],
  },
  'email-outreach': {
    slug: 'email-outreach',
    title: 'Cold Email AI Outreach & Warm Follow-up',
    configSchema: z.object({ dailyLimit: z.number().optional() }),
    defaultConfig: {},
    metrics: [{ key: 'emails', label: 'Outreach Emails Sent' }],
    SetupWizard: ({ instanceId }) => (
      <PlaceholderSetupWizard instanceId={instanceId} title="Cold Email Outreach" />
    ),
    Workspace: ({ instanceId }) => (
      <PlaceholderWorkspace instanceId={instanceId} title="Cold Email Outreach" />
    ),
    inngestFunctions: [],
  },
  'social-auto-posting': {
    slug: 'social-auto-posting',
    title: 'Social Media Auto-Repurposing & Multi-Platform Posting',
    configSchema: z.object({ platforms: z.array(z.string()).optional() }),
    defaultConfig: {},
    metrics: [{ key: 'posts', label: 'Social Posts Published' }],
    SetupWizard: ({ instanceId }) => (
      <PlaceholderSetupWizard instanceId={instanceId} title="Social Auto-Posting" />
    ),
    Workspace: ({ instanceId }) => (
      <PlaceholderWorkspace instanceId={instanceId} title="Social Auto-Posting" />
    ),
    inngestFunctions: [],
  },
  'voice-agent': {
    slug: 'voice-agent',
    title: 'Voice AI Receptionist & Inbound Qualification',
    configSchema: z.object({ forwardingNumber: z.string().optional() }),
    defaultConfig: {},
    metrics: [{ key: 'minutes', label: 'Voice Call Minutes' }],
    SetupWizard: ({ instanceId }) => (
      <PlaceholderSetupWizard instanceId={instanceId} title="Voice AI Agent" />
    ),
    Workspace: ({ instanceId }) => (
      <PlaceholderWorkspace instanceId={instanceId} title="Voice AI Agent" />
    ),
    inngestFunctions: [],
  },
  'youtube-automation': {
    slug: 'youtube-automation',
    title: 'Faceless YouTube & Shorts Content Pipeline',
    configSchema: z.object({ niche: z.string().optional() }),
    defaultConfig: {},
    metrics: [{ key: 'videos', label: 'Videos Rendered' }],
    SetupWizard: ({ instanceId }) => (
      <PlaceholderSetupWizard instanceId={instanceId} title="YouTube Automation" />
    ),
    Workspace: ({ instanceId }) => (
      <PlaceholderWorkspace instanceId={instanceId} title="YouTube Automation" />
    ),
    inngestFunctions: [],
  },
  'demo-automation': {
    slug: 'demo-automation',
    title: 'Demo Platform Automation Benchmark',
    configSchema: z.object({ speed: z.string().default('standard') }),
    defaultConfig: { speed: 'standard' },
    metrics: [{ key: 'units', label: 'Benchmark Units' }],
    SetupWizard: DemoSetupWizard,
    Workspace: DemoWorkspace,
    inngestFunctions: [],
  },
};

export function getAutomationModule(slug: string): AutomationModule | undefined {
  return automationRegistry[slug as AutomationSlug];
}

export function getAllAutomationModules(): AutomationModule[] {
  return Object.values(automationRegistry);
}
