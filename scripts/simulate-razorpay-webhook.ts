import crypto from 'crypto';

/**
 * Script: Simulate Razorpay Webhook
 * Fires a cryptographically signed test webhook to local or remote endpoint.
 * Run with: npx ts-node scripts/simulate-razorpay-webhook.ts [event] [endpoint]
 */
async function simulateWebhook() {
  const event = process.argv[2] || 'subscription.charged';
  const targetUrl = process.argv[3] || 'http://localhost:3000/api/webhooks/razorpay';
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET || 'nx_test_webhook_secret_2026';

  const mockPayload = {
    entity: 'event',
    account_id: 'acc_nexvanta_test',
    event,
    contains: ['subscription', 'payment'],
    payload: {
      subscription: {
        entity: {
          id: 'sub_test_12345',
          plan_id: 'plan_test_lead_basic',
          status: event === 'subscription.charged' ? 'active' : 'halted',
          current_start: Math.floor(Date.now() / 1000),
          current_end: Math.floor((Date.now() + 30 * 24 * 60 * 60 * 1000) / 1000),
        },
      },
      payment: {
        entity: {
          id: `pay_test_${Date.now()}`,
          amount: 350000, // in paise = ₹3,500
          currency: 'INR',
          status: 'captured',
          method: 'upi',
        },
      },
    },
    created_at: Math.floor(Date.now() / 1000),
  };

  const rawBody = JSON.stringify(mockPayload);
  const eventId = `evt_${Date.now()}_test`;

  const signature = crypto
    .createHmac('sha256', secret)
    .update(rawBody)
    .digest('hex');

  console.log(`Firing signed webhook [${event}] -> ${targetUrl}`);
  console.log(`Event ID: ${eventId}`);
  console.log(`Signature: ${signature}`);

  try {
    const res = await fetch(targetUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-razorpay-signature': signature,
        'x-razorpay-event-id': eventId,
      },
      body: rawBody,
    });

    const resData = await res.json();
    console.log('✓ Response Status:', res.status, resData);
  } catch (err) {
    console.error('Failed to dispatch simulated webhook:', err);
  }
}

if (require.main === module) {
  simulateWebhook().catch(console.error);
}

export { simulateWebhook };
