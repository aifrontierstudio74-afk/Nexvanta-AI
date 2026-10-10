import { createAdminClient } from '@/lib/supabase/admin';

export class EntitlementError extends Error {
  code: string;
  slug: string;
  reason: string;

  constructor(code: string, slug: string, reason: string) {
    super(`Entitlement Error [${slug}]: ${reason}`);
    this.name = 'EntitlementError';
    this.code = code;
    this.slug = slug;
    this.reason = reason;
  }
}

export interface EntitlementResult {
  allowed: boolean;
  plan?: {
    id?: string;
    code: string;
    name: string;
    price_inr: number;
    limits: Record<string, number>;
  };
  subscriptionId?: string;
  status?: string;
  periodStart?: string;
  periodEnd?: string;
  graceUntil?: string;
  reason?: string;
}

// In-memory fallback mock subscription and usage store for testing
export const mockSubscriptionStore = new Map<
  string,
  {
    status: 'created' | 'active' | 'past_due' | 'paused' | 'cancelled' | 'expired';
    plan: { code: string; name: string; price_inr: number; limits: Record<string, number> };
    current_period_start: string;
    current_period_end: string;
    grace_until?: string;
  }
>();

export const mockUsageStore = new Map<string, number>();

/**
 * Check if user has active entitlement for the given automation slug.
 */
export async function getEntitlement(
  userId: string,
  slug: string
): Promise<EntitlementResult> {
  const admin = createAdminClient();

  if (!admin) {
    const key = `${userId}:${slug}`;
    const sub = mockSubscriptionStore.get(key);

    if (!sub) {
      return {
        allowed: false,
        reason: 'No subscription found for this automation. Please select a plan to activate.',
      };
    }

    const now = new Date();
    if (sub.status === 'active') {
      return {
        allowed: true,
        plan: sub.plan,
        status: sub.status,
        periodStart: sub.current_period_start,
        periodEnd: sub.current_period_end,
      };
    }

    if (sub.status === 'past_due' && sub.grace_until) {
      if (now < new Date(sub.grace_until)) {
        return {
          allowed: true,
          plan: sub.plan,
          status: sub.status,
          periodStart: sub.current_period_start,
          periodEnd: sub.current_period_end,
          graceUntil: sub.grace_until,
          reason: 'Subscription is past due, but currently operating under grace period.',
        };
      }
      return {
        allowed: false,
        status: sub.status,
        reason: 'Subscription is past due and grace period has expired. Please update payment.',
      };
    }

    return {
      allowed: false,
      status: sub.status,
      reason: `Subscription is currently ${sub.status}. Active subscription required.`,
    };
  }

  // Query database via Supabase admin
  const { data: sub, error } = await admin
    .from('subscriptions')
    .select(
      `
      id,
      status,
      current_period_start,
      current_period_end,
      grace_until,
      plans (
        id,
        code,
        name,
        price_inr,
        limits
      )
    `
    )
    .eq('user_id', userId)
    .eq('automation_slug', slug)
    .in('status', ['created', 'active', 'past_due', 'paused'])
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error || !sub) {
    return {
      allowed: false,
      reason: 'No subscription found for this automation.',
    };
  }

  const plan = Array.isArray(sub.plans) ? sub.plans[0] : sub.plans;
  const now = new Date();

  if (sub.status === 'active') {
    return {
      allowed: true,
      subscriptionId: sub.id,
      plan: plan as EntitlementResult['plan'],
      status: sub.status,
      periodStart: sub.current_period_start,
      periodEnd: sub.current_period_end,
    };
  }

  if (sub.status === 'past_due' && sub.grace_until) {
    if (now < new Date(sub.grace_until)) {
      return {
        allowed: true,
        subscriptionId: sub.id,
        plan: plan as EntitlementResult['plan'],
        status: sub.status,
        periodStart: sub.current_period_start,
        periodEnd: sub.current_period_end,
        graceUntil: sub.grace_until,
        reason: 'Subscription past due within grace period.',
      };
    }
    return {
      allowed: false,
      subscriptionId: sub.id,
      status: sub.status,
      reason: 'Subscription past due and grace period expired.',
    };
  }

  return {
    allowed: false,
    subscriptionId: sub.id,
    status: sub.status,
    reason: `Subscription is ${sub.status}.`,
  };
}

/**
 * Throw EntitlementError if user lacks active entitlement.
 */
export async function requireEntitlement(
  userId: string,
  slug: string
): Promise<EntitlementResult> {
  const entitlement = await getEntitlement(userId, slug);
  if (!entitlement.allowed) {
    throw new EntitlementError(
      entitlement.status || 'NO_ENTITLEMENT',
      slug,
      entitlement.reason || 'Active plan entitlement is required to run this operation.'
    );
  }
  return entitlement;
}

/**
 * Atomic quota consumption.
 * Checks limit from plan.limits[<metric>_per_month].
 * Returns allowed: false when limit reached.
 */
export async function consume(
  userId: string,
  slug: string,
  metric: string,
  amount: number = 1
): Promise<{ allowed: boolean; used: number; limit: number; remaining: number }> {
  const entitlement = await requireEntitlement(userId, slug);
  const limitKey = `${metric}_per_month`;
  const limits = entitlement.plan?.limits || {};
  const limit = limits[limitKey] ?? limits[metric] ?? 1000;

  const periodStart = entitlement.periodStart || new Date().toISOString();
  const admin = createAdminClient();

  if (!admin) {
    const key = `${userId}:${slug}:${metric}:${periodStart.slice(0, 10)}`;
    const currentUsed = mockUsageStore.get(key) || 0;
    if (currentUsed + amount > limit) {
      return {
        allowed: false,
        used: currentUsed,
        limit,
        remaining: Math.max(0, limit - currentUsed),
      };
    }
    const newUsed = currentUsed + amount;
    mockUsageStore.set(key, newUsed);
    return {
      allowed: true,
      used: newUsed,
      limit,
      remaining: Math.max(0, limit - newUsed),
    };
  }

  const { data: success, error } = await admin.rpc('consume_quota', {
    p_user: userId,
    p_slug: slug,
    p_metric: metric,
    p_amount: amount,
    p_limit: limit,
    p_period_start: periodStart,
  });

  if (error || !success) {
    return {
      allowed: false,
      used: limit,
      limit,
      remaining: 0,
    };
  }

  // Fetch updated count
  const { data: counter } = await admin
    .from('usage_counters')
    .select('used')
    .eq('user_id', userId)
    .eq('automation_slug', slug)
    .eq('metric', metric)
    .eq('period_start', periodStart)
    .maybeSingle();

  const used = counter?.used || amount;
  return {
    allowed: true,
    used,
    limit,
    remaining: Math.max(0, limit - used),
  };
}

/**
 * Fetch usage summary for all metrics of an automation.
 */
export async function getUsageSummary(
  userId: string,
  slug: string
): Promise<Record<string, { used: number; limit: number; percentage: number }>> {
  const entitlement = await getEntitlement(userId, slug);
  if (!entitlement.plan) return {};

  const limits = entitlement.plan.limits;
  const result: Record<string, { used: number; limit: number; percentage: number }> = {};
  const periodStart = entitlement.periodStart || new Date().toISOString();
  const admin = createAdminClient();

  for (const [key, limitVal] of Object.entries(limits)) {
    const metricName = key.replace('_per_month', '');
    let used = 0;

    if (!admin) {
      const memKey = `${userId}:${slug}:${metricName}:${periodStart.slice(0, 10)}`;
      used = mockUsageStore.get(memKey) || 0;
    } else {
      const { data } = await admin
        .from('usage_counters')
        .select('used')
        .eq('user_id', userId)
        .eq('automation_slug', slug)
        .eq('metric', metricName)
        .eq('period_start', periodStart)
        .maybeSingle();
      used = data?.used || 0;
    }

    const pct = limitVal > 0 ? Math.min(100, Math.round((used / limitVal) * 100)) : 0;
    result[metricName] = { used, limit: limitVal, percentage: pct };
  }

  return result;
}
