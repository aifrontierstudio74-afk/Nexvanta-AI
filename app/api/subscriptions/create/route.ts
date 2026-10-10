import { NextRequest, NextResponse } from 'next/server';

/**
 * Razorpay Subscriptions API Route Skeleton (Phase 2)
 * 
 * TODO: Implement automated recurring mandate creation once owner enables Razorpay Subscriptions.
 * 1. Verify user session via Supabase Auth
 * 2. Lookup plan ID from Razorpay Dashboard (plan_id: e.g. plan_Nxxxx)
 * 3. Invoke razorpay.subscriptions.create({ plan_id, total_count: 12, customer_notify: 1 })
 * 4. Return subscription_id to client for checkout authorization
 */

export async function POST(req: NextRequest) {
  try {
    const { planSlug, tierName, customerEmail } = await req.json();

    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keyId || !keySecret) {
      return NextResponse.json({
        ok: true,
        mock: true,
        message: 'Razorpay Subscriptions are currently in preview mode. No live charges will occur.',
        plan: {
          planSlug,
          tierName,
          customerEmail,
        },
      });
    }

    // TODO: Connect live razorpay instance when plan IDs are provisioned
    return NextResponse.json({
      ok: true,
      pendingConfiguration: true,
      message: 'Subscription plan provisioning is being finalized for this tier.',
    });
  } catch (err: unknown) {
    console.error('Subscription API Error:', err);
    return NextResponse.json({ ok: false, error: 'Internal server error' }, { status: 500 });
  }
}
