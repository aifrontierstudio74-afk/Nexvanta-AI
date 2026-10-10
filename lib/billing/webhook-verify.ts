import crypto from 'crypto';

// In-memory webhook event idempotency store for testing & fallback
export const memoryWebhookEvents = new Set<string>();

export function verifyRazorpayWebhookSignature(
  rawBody: string,
  signature: string | null,
  secret: string
): boolean {
  if (!signature || !secret) return false;

  const expected = crypto
    .createHmac('sha256', secret)
    .update(rawBody)
    .digest('hex');

  return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature));
}
