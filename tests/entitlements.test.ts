import { describe, it, expect, beforeEach } from 'vitest';
import {
  getEntitlement,
  requireEntitlement,
  EntitlementError,
  mockSubscriptionStore,
} from '../lib/entitlements';

describe('Entitlements Engine', () => {
  const userId = 'usr_entitlement_test';
  const slug = 'lead-capture-crm';

  beforeEach(() => {
    mockSubscriptionStore.clear();
  });

  it('denies access when no subscription exists', async () => {
    const res = await getEntitlement(userId, slug);
    expect(res.allowed).toBe(false);
    expect(res.reason).toContain('No subscription found');

    await expect(requireEntitlement(userId, slug)).rejects.toThrow(EntitlementError);
  });

  it('grants access when subscription is active', async () => {
    mockSubscriptionStore.set(`${userId}:${slug}`, {
      status: 'active',
      plan: {
        code: 'lead-capture-basic',
        name: 'Basic',
        price_inr: 3500,
        limits: { leads_per_month: 500 },
      },
      current_period_start: new Date().toISOString(),
      current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    });

    const res = await getEntitlement(userId, slug);
    expect(res.allowed).toBe(true);
    expect(res.status).toBe('active');
    expect(res.plan?.code).toBe('lead-capture-basic');

    const required = await requireEntitlement(userId, slug);
    expect(required.allowed).toBe(true);
  });

  it('grants access during past_due grace period', async () => {
    const futureGrace = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString();
    mockSubscriptionStore.set(`${userId}:${slug}`, {
      status: 'past_due',
      plan: {
        code: 'lead-capture-basic',
        name: 'Basic',
        price_inr: 3500,
        limits: { leads_per_month: 500 },
      },
      current_period_start: new Date().toISOString(),
      current_period_end: new Date().toISOString(),
      grace_until: futureGrace,
    });

    const res = await getEntitlement(userId, slug);
    expect(res.allowed).toBe(true);
    expect(res.reason).toContain('grace period');
  });

  it('denies access when past_due grace period has expired', async () => {
    const pastGrace = new Date(Date.now() - 1000).toISOString(); // 1 second ago
    mockSubscriptionStore.set(`${userId}:${slug}`, {
      status: 'past_due',
      plan: {
        code: 'lead-capture-basic',
        name: 'Basic',
        price_inr: 3500,
        limits: { leads_per_month: 500 },
      },
      current_period_start: new Date().toISOString(),
      current_period_end: new Date().toISOString(),
      grace_until: pastGrace,
    });

    const res = await getEntitlement(userId, slug);
    expect(res.allowed).toBe(false);
    expect(res.reason).toContain('grace period has expired');
  });

  it('denies access when subscription is cancelled or paused', async () => {
    mockSubscriptionStore.set(`${userId}:${slug}`, {
      status: 'cancelled',
      plan: {
        code: 'lead-capture-basic',
        name: 'Basic',
        price_inr: 3500,
        limits: { leads_per_month: 500 },
      },
      current_period_start: new Date().toISOString(),
      current_period_end: new Date().toISOString(),
    });

    const res = await getEntitlement(userId, slug);
    expect(res.allowed).toBe(false);
  });
});
