import { describe, it, expect, beforeEach } from 'vitest';
import {
  consume,
  mockSubscriptionStore,
  mockUsageStore,
} from '../lib/entitlements';

describe('Quota Consumption & Concurrency Limits', () => {
  const userId = 'usr_quota_test';
  const slug = 'lead-capture-crm';
  const metric = 'leads';

  beforeEach(() => {
    mockSubscriptionStore.clear();
    mockUsageStore.clear();

    // Setup active subscription with limit of 10
    mockSubscriptionStore.set(`${userId}:${slug}`, {
      status: 'active',
      plan: {
        code: 'lead-capture-test',
        name: 'Test Plan',
        price_inr: 3500,
        limits: { leads_per_month: 10 },
      },
      current_period_start: new Date().toISOString(),
      current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    });
  });

  it('consumes units normally when under plan quota', async () => {
    const res = await consume(userId, slug, metric, 2);
    expect(res.allowed).toBe(true);
    expect(res.used).toBe(2);
    expect(res.remaining).toBe(8);
  });

  it('blocks consumption when quota is reached', async () => {
    // Consume 10 of 10
    await consume(userId, slug, metric, 10);

    // Next consumption should be blocked
    const overflow = await consume(userId, slug, metric, 1);
    expect(overflow.allowed).toBe(false);
    expect(overflow.remaining).toBe(0);
  });

  it('handles concurrent requests without exceeding the plan limit', async () => {
    // Plan limit is 10. Fire 25 concurrent requests of 1 unit each.
    const concurrentRequests = Array.from({ length: 25 }, () =>
      consume(userId, slug, metric, 1)
    );

    const results = await Promise.all(concurrentRequests);

    const successful = results.filter((r) => r.allowed);
    const blocked = results.filter((r) => !r.allowed);

    // Exactly 10 must succeed, and 15 must be blocked
    expect(successful.length).toBe(10);
    expect(blocked.length).toBe(15);
  });
});
