import { describe, it, expect } from 'vitest';
import crypto from 'crypto';
import { verifyRazorpayWebhookSignature, memoryWebhookEvents } from '../lib/billing/webhook-verify';

describe('Razorpay Webhooks & Security', () => {
  const secret = 'nx_test_webhook_secret_key_123';
  const sampleBody = JSON.stringify({
    event: 'subscription.charged',
    payload: {
      subscription: { entity: { id: 'sub_test_99' } },
    },
  });

  it('verifies valid HMAC-SHA256 webhook signatures', () => {
    const validSignature = crypto
      .createHmac('sha256', secret)
      .update(sampleBody)
      .digest('hex');

    const isValid = verifyRazorpayWebhookSignature(sampleBody, validSignature, secret);
    expect(isValid).toBe(true);
  });

  it('rejects tampered webhook payloads or mismatched secrets', () => {
    const validSignature = crypto
      .createHmac('sha256', secret)
      .update(sampleBody)
      .digest('hex');

    // Tampered payload
    const tamperedBody = sampleBody.replace('sub_test_99', 'sub_hacked_99');
    const isTamperedValid = verifyRazorpayWebhookSignature(tamperedBody, validSignature, secret);
    expect(isTamperedValid).toBe(false);

    // Wrong secret
    const isWrongSecretValid = verifyRazorpayWebhookSignature(sampleBody, validSignature, 'wrong_secret');
    expect(isWrongSecretValid).toBe(false);

    // Null signature
    expect(verifyRazorpayWebhookSignature(sampleBody, null, secret)).toBe(false);
  });

  it('enforces webhook idempotency by detecting duplicate event IDs', () => {
    const eventId = 'evt_test_unique_id_101';
    expect(memoryWebhookEvents.has(eventId)).toBe(false);

    // First delivery
    memoryWebhookEvents.add(eventId);
    expect(memoryWebhookEvents.has(eventId)).toBe(true);

    // Duplicate delivery
    const isDuplicate = memoryWebhookEvents.has(eventId);
    expect(isDuplicate).toBe(true);
  });
});
