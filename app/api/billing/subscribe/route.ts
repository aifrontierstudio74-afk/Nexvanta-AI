import { NextRequest, NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import { getServerSession } from '@/lib/auth/session';
import { createAdminClient } from '@/lib/supabase/admin';
import { env, isRazorpayConfigured } from '@/lib/env';
import { rateLimit } from '@/lib/ratelimit';
import { mockSubscriptionStore } from '@/lib/entitlements';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession();
    const userId = session?.userId || 'usr_dev_test';

    // Rate limit
    const rl = await rateLimit(`sub:${userId}`, 10, 60000);
    if (!rl.success) {
      return NextResponse.json({ ok: false, error: 'Too many requests. Please wait a minute.' }, { status: 429 });
    }

    const { planCode } = await req.json();
    if (!planCode) {
      return NextResponse.json({ ok: false, error: 'Plan code is required' }, { status: 400 });
    }

    const admin = createAdminClient();

    interface PlanRecord {
      id?: string;
      code: string;
      name: string;
      automation_slug: string;
      price_inr: number;
      razorpay_plan_id?: string;
      limits?: Record<string, number>;
    }

    let plan: PlanRecord;

    if (admin) {
      const { data, error } = await admin
        .from('plans')
        .select('*')
        .eq('code', planCode)
        .eq('is_active', true)
        .single();

      if (error || !data) {
        return NextResponse.json({ ok: false, error: 'Plan not found or inactive' }, { status: 404 });
      }
      plan = data as PlanRecord;

      // Ensure user has no live subscription for this automation
      const { data: existingSub } = await admin
        .from('subscriptions')
        .select('id, status')
        .eq('user_id', userId)
        .eq('automation_slug', plan.automation_slug)
        .in('status', ['created', 'active', 'past_due', 'paused'])
        .maybeSingle();

      if (existingSub && existingSub.status === 'active') {
        return NextResponse.json(
          { ok: false, error: 'You already have an active subscription for this automation.' },
          { status: 400 }
        );
      }
    } else {
      // In-memory mock plan fallback
      plan = {
        code: planCode,
        name: planCode.split('-').pop() || 'Plan',
        automation_slug: planCode.split('-').slice(0, -1).join('-') || 'lead-capture-crm',
        price_inr: 3500,
        razorpay_plan_id: 'plan_mock_123',
        limits: { units_per_month: 1000 },
      };
    }

    // 1. If Razorpay keys are not configured or in test mode
    if (!isRazorpayConfigured || !plan.razorpay_plan_id) {
      const mockSubId = `sub_mock_${Date.now()}`;
      if (!admin) {
        mockSubscriptionStore.set(`${userId}:${plan.automation_slug}`, {
          status: 'created',
          plan: {
            code: plan.code,
            name: plan.name,
            price_inr: plan.price_inr,
            limits: plan.limits || {},
          },
          current_period_start: new Date().toISOString(),
          current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        });
      }
      return NextResponse.json({
        ok: true,
        mock: true,
        subscriptionId: mockSubId,
        razorpaySubscriptionId: mockSubId,
        keyId: 'rzp_test_mock',
        plan,
      });
    }

    // 2. Real Razorpay Subscription Creation
    const razorpay = new Razorpay({
      key_id: env.RAZORPAY_KEY_ID!,
      key_secret: env.RAZORPAY_KEY_SECRET!,
    });

    const rzpSubscription = await razorpay.subscriptions.create({
      plan_id: plan.razorpay_plan_id,
      total_count: 120, // 10 years monthly
      customer_notify: 1,
      notes: {
        user_id: userId,
        plan_code: plan.code,
        automation_slug: plan.automation_slug,
      },
    });

    // 3. Insert subscriptions record in DB with status 'created'
    if (admin) {
      await admin.from('subscriptions').insert({
        user_id: userId,
        plan_id: plan.id,
        automation_slug: plan.automation_slug,
        status: 'created',
        provider: 'razorpay',
        razorpay_subscription_id: rzpSubscription.id,
      });
    }

    return NextResponse.json({
      ok: true,
      subscriptionId: rzpSubscription.id,
      razorpaySubscriptionId: rzpSubscription.id,
      keyId: env.NEXT_PUBLIC_RAZORPAY_KEY_ID || env.RAZORPAY_KEY_ID,
      plan,
    });
  } catch (err: unknown) {
    console.error('Subscribe Error:', err);
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 });
  }
}
