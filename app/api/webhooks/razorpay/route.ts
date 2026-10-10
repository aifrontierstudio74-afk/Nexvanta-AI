import { NextRequest, NextResponse } from 'next/server';
import { env } from '@/lib/env';
import { verifyRazorpayWebhookSignature, memoryWebhookEvents } from '@/lib/billing/webhook-verify';
import { createAdminClient } from '@/lib/supabase/admin';
import { sendEmail, getEmailTemplate } from '@/lib/email';
import { mockSubscriptionStore } from '@/lib/entitlements';

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get('x-razorpay-signature');
    const eventId = req.headers.get('x-razorpay-event-id') || `evt_${Date.now()}`;

    // 1. Signature Verification
    const webhookSecret = env.RAZORPAY_WEBHOOK_SECRET;
    if (webhookSecret) {
      const isValid = verifyRazorpayWebhookSignature(rawBody, signature, webhookSecret);
      if (!isValid) {
        return NextResponse.json({ ok: false, error: 'Invalid webhook signature' }, { status: 400 });
      }
    }

    // 2. Idempotency Check
    const admin = createAdminClient();
    if (!admin) {
      if (memoryWebhookEvents.has(eventId)) {
        return NextResponse.json({ ok: true, duplicate: true });
      }
      memoryWebhookEvents.add(eventId);
    } else {
      const { data: existing } = await admin
        .from('webhook_events')
        .select('id')
        .eq('id', eventId)
        .maybeSingle();

      if (existing) {
        return NextResponse.json({ ok: true, duplicate: true });
      }

      await admin.from('webhook_events').insert({
        id: eventId,
        provider: 'razorpay',
      });
    }

    const payload = JSON.parse(rawBody);
    const event = payload.event;
    const subEntity = payload.payload?.subscription?.entity;
    const paymentEntity = payload.payload?.payment?.entity;

    const rzpSubId = subEntity?.id;
    if (!rzpSubId) {
      return NextResponse.json({ ok: true, message: 'Non-subscription event ignored' });
    }

    const currentStart = subEntity.current_start
      ? new Date(subEntity.current_start * 1000).toISOString()
      : new Date().toISOString();
    const currentEnd = subEntity.current_end
      ? new Date(subEntity.current_end * 1000).toISOString()
      : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();

    const graceUntil = new Date(Date.now() + env.GRACE_DAYS * 24 * 60 * 60 * 1000).toISOString();

    // In-memory fallback update
    if (!admin) {
      for (const [key, sub] of Array.from(mockSubscriptionStore.entries())) {
        if (event === 'subscription.activated' || event === 'subscription.charged') {
          sub.status = 'active';
          sub.current_period_start = currentStart;
          sub.current_period_end = currentEnd;
          delete sub.grace_until;
        } else if (event === 'subscription.pending' || event === 'payment.failed') {
          sub.status = 'past_due';
          sub.grace_until = graceUntil;
        } else if (event === 'subscription.halted' || event === 'subscription.cancelled' || event === 'subscription.completed') {
          sub.status = 'cancelled';
        }
        mockSubscriptionStore.set(key, sub);
      }
      return NextResponse.json({ ok: true, processed: true, mock: true });
    }

    // Database lookup
    const { data: sub } = await admin
      .from('subscriptions')
      .select('id, user_id, automation_slug, plans(name, price_inr)')
      .eq('razorpay_subscription_id', rzpSubId)
      .maybeSingle();

    if (!sub) {
      return NextResponse.json({ ok: true, note: 'Subscription record not found yet' });
    }

    const plan = Array.isArray(sub.plans) ? sub.plans[0] : sub.plans;
    const { data: userRecord } = await admin.auth.admin.getUserById(sub.user_id);
    const userEmail = userRecord?.user?.email;

    // Process event types
    if (event === 'subscription.activated' || event === 'subscription.charged') {
      await admin
        .from('subscriptions')
        .update({
          status: 'active',
          current_period_start: currentStart,
          current_period_end: currentEnd,
          grace_until: null,
        })
        .eq('id', sub.id);

      // Upsert payment record
      if (paymentEntity?.id) {
        await admin.from('payments').upsert({
          user_id: sub.user_id,
          subscription_id: sub.id,
          provider: 'razorpay',
          amount_inr: Math.round((paymentEntity.amount || 0) / 100),
          status: 'captured',
          razorpay_payment_id: paymentEntity.id,
          method: paymentEntity.method || 'card/upi',
        });
      }

      if (userEmail) {
        const tpl = getEmailTemplate('payment_success', {
          planName: plan?.name || sub.automation_slug,
          amount: plan?.price_inr || 0,
          slug: sub.automation_slug,
        });
        await sendEmail({ to: userEmail, subject: tpl.subject, html: tpl.html });
      }
    } else if (event === 'subscription.pending' || event === 'payment.failed') {
      await admin
        .from('subscriptions')
        .update({
          status: 'past_due',
          grace_until: graceUntil,
        })
        .eq('id', sub.id);

      await admin.from('notifications').insert({
        user_id: sub.user_id,
        title: 'Payment Failed - Grace Period Active',
        body: `Recurring payment for ${plan?.name || sub.automation_slug} failed. Workflows will remain active for ${env.GRACE_DAYS} days.`,
      });

      if (userEmail) {
        const tpl = getEmailTemplate('payment_failed', {
          planName: plan?.name || sub.automation_slug,
          graceDays: env.GRACE_DAYS,
        });
        await sendEmail({ to: userEmail, subject: tpl.subject, html: tpl.html });
      }
    } else if (
      event === 'subscription.halted' ||
      event === 'subscription.cancelled' ||
      event === 'subscription.completed'
    ) {
      await admin
        .from('subscriptions')
        .update({
          status: 'cancelled',
        })
        .eq('id', sub.id);

      // Pause instances of this automation
      await admin
        .from('automation_instances')
        .update({ status: 'paused' })
        .eq('user_id', sub.user_id)
        .eq('automation_slug', sub.automation_slug);

      if (userEmail) {
        const tpl = getEmailTemplate('subscription_cancelled', {
          planName: plan?.name || sub.automation_slug,
          periodEnd: new Date().toLocaleDateString('en-IN'),
        });
        await sendEmail({ to: userEmail, subject: tpl.subject, html: tpl.html });
      }
    } else if (event === 'subscription.paused') {
      await admin.from('subscriptions').update({ status: 'paused' }).eq('id', sub.id);
      await admin
        .from('automation_instances')
        .update({ status: 'paused' })
        .eq('user_id', sub.user_id)
        .eq('automation_slug', sub.automation_slug);
    } else if (event === 'subscription.resumed') {
      await admin.from('subscriptions').update({ status: 'active' }).eq('id', sub.id);
    }

    return NextResponse.json({ ok: true });
  } catch (err: unknown) {
    console.error('Razorpay Webhook Error:', err);
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 });
  }
}
