import { NextRequest, NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import { digitalProducts } from '@/data/digital-products';

export async function POST(req: NextRequest) {
  try {
    const { slug } = await req.json();
    const product = digitalProducts.find((p) => p.slug === slug && p.isActive);

    if (!product) {
      return NextResponse.json({ ok: false, error: 'Product not found' }, { status: 404 });
    }

    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keyId || !keySecret) {
      // Mock / fallback mode when keys are not configured
      return NextResponse.json({
        ok: true,
        fallback: true,
        message: 'Razorpay keys not configured. Use manual payment or contact form.',
        product: {
          slug: product.slug,
          title: product.title,
          price: product.price,
        },
      });
    }

    const razorpay = new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    });

    const amountInPaise = Math.round(product.price * 100);

    const order = await razorpay.orders.create({
      amount: amountInPaise,
      currency: 'INR',
      receipt: `nx_${product.slug.slice(0, 15)}_${Date.now()}`,
      notes: {
        productSlug: product.slug,
        productTitle: product.title,
      },
    });

    return NextResponse.json({
      ok: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || keyId,
      productTitle: product.title,
    });
  } catch (err: unknown) {
    console.error('Create Order Error:', err);
    return NextResponse.json({ ok: false, error: 'Failed to create order' }, { status: 500 });
  }
}
