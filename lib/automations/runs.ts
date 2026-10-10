import { createAdminClient } from '@/lib/supabase/admin';
import { requireEntitlement } from '@/lib/entitlements';
import { inngest } from '@/lib/inngest/client';
import {
  AutomationSlug,
  StartRunParams,
  FinishRunParams,
  RunRecord,
} from '@/lib/automations/types';

// In-memory run store for tests or when Supabase is not connected
const memoryRunsStore = new Map<string, RunRecord>();

/**
 * Initiate an execution run for an automation.
 * Verifies active entitlement before starting.
 */
export async function startRun(params: StartRunParams): Promise<{ runId: string }> {
  // 1. Verify user is entitled
  await requireEntitlement(params.userId, params.slug);

  const admin = createAdminClient();
  const runId = `run_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

  if (!admin) {
    // In-memory execution
    if (params.idempotencyKey) {
      const existing = Array.from(memoryRunsStore.values()).find(
        (r) => r.slug === params.slug && r.idempotencyKey === params.idempotencyKey
      );
      if (existing) {
        return { runId: existing.id };
      }
    }

    const run: RunRecord = {
      id: runId,
      userId: params.userId,
      instanceId: params.instanceId,
      slug: params.slug,
      type: params.type,
      status: 'running',
      idempotencyKey: params.idempotencyKey,
      input: params.input,
      attempts: 1,
      startedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };
    memoryRunsStore.set(runId, run);
    return { runId };
  }

  // Idempotency check in DB
  if (params.idempotencyKey) {
    const { data: existing } = await admin
      .from('runs')
      .select('id, status')
      .eq('automation_slug', params.slug)
      .eq('idempotency_key', params.idempotencyKey)
      .maybeSingle();

    if (existing) {
      return { runId: existing.id };
    }
  }

  const { data, error } = await admin
    .from('runs')
    .insert({
      user_id: params.userId,
      instance_id: params.instanceId || null,
      automation_slug: params.slug,
      type: params.type,
      status: 'running',
      idempotency_key: params.idempotencyKey || null,
      input: params.input || null,
      attempts: 1,
      started_at: new Date().toISOString(),
    })
    .select('id')
    .single();

  if (error || !data) {
    throw new Error(`Failed to initialize run record: ${error?.message}`);
  }

  return { runId: data.id };
}

/**
 * Record run completion or failure.
 */
export async function finishRun(params: FinishRunParams): Promise<void> {
  const admin = createAdminClient();

  if (!admin) {
    const run = memoryRunsStore.get(params.runId);
    if (run) {
      run.status = params.status;
      run.output = params.output;
      run.error = params.error;
      run.finishedAt = new Date().toISOString();
      memoryRunsStore.set(params.runId, run);
    }
    return;
  }

  const { data: updated } = await admin
    .from('runs')
    .update({
      status: params.status,
      output: params.output || null,
      error: params.error || null,
      finished_at: new Date().toISOString(),
    })
    .eq('id', params.runId)
    .select('id, user_id, instance_id, automation_slug')
    .single();

  if (params.status === 'failed' && updated) {
    // Send event to Inngest for failure streak monitoring
    try {
      await inngest.send({
        name: 'nexvanta/run.failed',
        data: {
          runId: params.runId,
          userId: updated.user_id,
          instanceId: updated.instance_id,
          slug: updated.automation_slug,
          error: params.error,
        },
      });
    } catch (e) {
      console.warn('Inngest failure event dispatch skipped:', e);
    }
  }
}

/**
 * Retrieve paginated runs for dashboard activity view.
 */
export async function listRuns(
  userId: string,
  slug?: AutomationSlug,
  instanceId?: string,
  page: number = 1,
  limit: number = 20
): Promise<{ runs: RunRecord[]; total: number }> {
  const admin = createAdminClient();

  if (!admin) {
    let all = Array.from(memoryRunsStore.values()).filter((r) => r.userId === userId);
    if (slug) all = all.filter((r) => r.slug === slug);
    if (instanceId) all = all.filter((r) => r.instanceId === instanceId);
    const total = all.length;
    const start = (page - 1) * limit;
    const runs = all.slice(start, start + limit);
    return { runs, total };
  }

  let query = admin
    .from('runs')
    .select('*', { count: 'exact' })
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (slug) query = query.eq('automation_slug', slug);
  if (instanceId) query = query.eq('instance_id', instanceId);

  const start = (page - 1) * limit;
  const { data, count, error } = await query.range(start, start + limit - 1);

  if (error || !data) return { runs: [], total: 0 };

  const runs: RunRecord[] = data.map((r) => ({
    id: r.id,
    userId: r.user_id,
    instanceId: r.instance_id,
    slug: r.automation_slug as AutomationSlug,
    type: r.type,
    status: r.status,
    idempotencyKey: r.idempotency_key,
    input: r.input,
    output: r.output,
    error: r.error,
    attempts: r.attempts,
    startedAt: r.started_at,
    finishedAt: r.finished_at,
    createdAt: r.created_at,
  }));

  return { runs, total: count || runs.length };
}
