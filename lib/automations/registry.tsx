'use client';

import React from 'react';
import { AutomationModule } from './types';
import { Cpu, ShieldCheck } from 'lucide-react';

function createModulePlaceholder(title: string): React.ComponentType {
  return function PlaceholderComponent() {
    return (
      <div className="p-8 md:p-12 border border-border rounded-2xl bg-surface/80 backdrop-blur-md text-center max-w-2xl mx-auto">
        <div className="w-16 h-16 rounded-2xl bg-gold/10 border border-gold/30 flex items-center justify-center mx-auto mb-6 text-gold">
          <Cpu className="w-8 h-8 animate-pulse" />
        </div>
        <h3 className="text-2xl font-bold font-heading text-text mb-3">{title}</h3>
        <p className="text-muted text-sm leading-relaxed mb-6">
          Module engine being connected. This automation engine will launch in the upcoming platform release.
          Your subscription unlocks immediate priority access upon rollout.
        </p>
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-gold/20 bg-surface-2 text-xs font-mono text-gold">
          <ShieldCheck className="w-4 h-4 text-success" />
          <span>PROVISIONING ENGINE SANDBOX</span>
        </div>
      </div>
    );
  };
}

export const automationRegistry: Record<string, AutomationModule> = {
  'lead-capture-crm': {
    slug: 'lead-capture-crm',
    title: 'Lead Capture + CRM Engine',
    Component: createModulePlaceholder('Lead Capture + CRM Engine'),
  },
  'email-outreach': {
    slug: 'email-outreach',
    title: 'Email Outreach Sequences Engine',
    Component: createModulePlaceholder('Email Outreach Sequences Engine'),
  },
  'social-auto-posting': {
    slug: 'social-auto-posting',
    title: 'Social Media Auto-Posting Engine',
    Component: createModulePlaceholder('Social Media Auto-Posting Engine'),
  },
  'voice-agent': {
    slug: 'voice-agent',
    title: 'Voice Agent (AI Receptionist) Engine',
    Component: createModulePlaceholder('Voice Agent (AI Receptionist) Engine'),
  },
  'youtube-automation': {
    slug: 'youtube-automation',
    title: 'YouTube Automation Engine',
    Component: createModulePlaceholder('YouTube Automation Engine'),
  },
};
