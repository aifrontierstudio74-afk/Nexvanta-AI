import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { digitalProducts } from '@/data/digital-products';
import { createDownloadToken } from '@/lib/token';

export async function POST(req: NextRequest) {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      slug,
      customerName,
      customerEmail,
      customerPhone,
    } = await req.json();

    const product = digitalProducts.find((p) => p.slug === slug);
    if (!product) {
      return NextResponse.json({ ok: false, error: 'Product not found' }, { status: 404 });
    }

    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!keySecret) {
      // In mock/test without keys, return a token for testing
      const token = createDownloadToken(slug);
      return NextResponse.json({
        ok: true,
        mock: true,
        token,
        redirectUrl: `/thank-you?product=${slug}&token=${token}`,
      });
    }

    const generatedSignature = crypto
      .createHmac('sha256', keySecret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    if (generatedSignature !== razorpay_signature) {
      return NextResponse.json({ ok: false, error: 'Invalid payment signature' }, { status: 400 });
    }

    // Generate secure download token
    const token = createDownloadToken(slug);

    // Forward lead entry directly to lead API or sheet
    const webhookUrl = process.env.GOOGLE_SHEET_WEBHOOK_URL;
    if (webhookUrl) {
      const sheetPayload = {
        secret: process.env.GOOGLE_SHEET_SECRET || '',
        name: customerName || '',
        phone: customerPhone || '',
        email: customerEmail || '',
        status: 'WARM',
        segment: 'Digital Product',
        interestedIn: product.title,
        source: 'Digital Product Purchase',
        message: `Order ID: ${razorpay_order_id}, Payment ID: ${razorpay_payment_id}, Amount: ₹${product.price}`,
        pageUrl: `/digital-products/${slug}`,
      };

      try {
        await fetch(webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(sheetPayload),
        });
      } catch (sheetErr) {
        console.error('Failed to log purchase to sheet:', sheetErr);
      }
    }

    return NextResponse.json({
      ok: true,
      token,
      redirectUrl: `/thank-you?product=${slug}&token=${token}`,
    });
  } catch (err: unknown) {
    console.error('Verify Payment Error:', err);
    return NextResponse.json({ ok: false, error: 'Verification failed' }, { status: 500 });
  }
}
