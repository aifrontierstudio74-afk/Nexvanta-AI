import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { env } from '@/lib/env';

export async function POST(req: NextRequest) {
  try {
    const { razorpay_payment_id, razorpay_subscription_id, razorpay_signature } =
      await req.json();

    if (!razorpay_payment_id || !razorpay_subscription_id) {
      return NextResponse.json({ ok: false, error: 'Missing payment identifiers' }, { status: 400 });
    }

    const keySecret = env.RAZORPAY_KEY_SECRET;
    if (!keySecret) {
      // Mock mode
      return NextResponse.json({ ok: true, verified: true, mock: true });
    }

    // Verify HMAC-SHA256 signature
    const payload = `${razorpay_payment_id}|${razorpay_subscription_id}`;
    const expectedSignature = crypto
      .createHmac('sha256', keySecret)
      .update(payload)
      .digest('hex');

    const isValid = expectedSignature === razorpay_signature;

    return NextResponse.json({
      ok: true,
      verified: isValid,
      note: 'Payment received. Awaiting webhook confirmation for entitlement grant.',
    });
  } catch (err: unknown) {
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 });
  }
}
