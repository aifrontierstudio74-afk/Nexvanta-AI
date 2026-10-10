import React from 'react';
import { z } from 'zod';
import type { InngestFunction } from 'inngest';

export type AutomationSlug =
  | 'lead-capture-crm'
  | 'email-outreach'
  | 'social-auto-posting'
  | 'voice-agent'
  | 'youtube-automation'
  | 'demo-automation';

export interface ModuleContext {
  userId: string;
  instanceId: string;
  slug: AutomationSlug;
  config: unknown;
}

export interface AutomationModule<TConfig = unknown> {
  slug: AutomationSlug;
  title: string;
  configSchema: z.ZodType<TConfig>; // validates instance.config
  defaultConfig: TConfig;
  metrics: { key: string; label: string }[]; // quota metrics shown in usage meters
  SetupWizard: React.ComponentType<{ instanceId: string }>;
  Workspace: React.ComponentType<{ instanceId: string }>; // main UI after setup
  onActivate?: (ctx: ModuleContext) => Promise<void>; // start schedules/webhooks
  onPause?: (ctx: ModuleContext) => Promise<void>; // stop everything cleanly
  inngestFunctions: InngestFunction<any, any, any, any, any>[]; // background work of this module
  apiRouter?: (req: Request, ctx: ModuleContext) => Promise<Response>; // /api/automations/<slug>/*
}

export interface RunRecord {
  id: string;
  userId: string;
  instanceId?: string;
  slug: AutomationSlug;
  type: string;
  status: 'queued' | 'running' | 'succeeded' | 'failed' | 'cancelled';
  idempotencyKey?: string;
  input?: unknown;
  output?: unknown;
  error?: string;
  attempts: number;
  startedAt?: string;
  finishedAt?: string;
  createdAt: string;
}

export interface StartRunParams {
  userId: string;
  instanceId?: string;
  slug: AutomationSlug;
  type: string;
  input?: unknown;
  idempotencyKey?: string;
}

export interface FinishRunParams {
  runId: string;
  status: 'succeeded' | 'failed';
  output?: unknown;
  error?: string;
}
