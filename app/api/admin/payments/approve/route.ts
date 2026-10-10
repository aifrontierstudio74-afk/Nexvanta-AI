import { NextRequest, NextResponse } from 'next/server';
import { requireAdminSession } from '@/lib/auth/session';
import { createAdminClient } from '@/lib/supabase/admin';
import { sendEmail, getEmailTemplate } from '@/lib/email';

export async function POST(req: NextRequest) {
  try {
    const adminSession = await requireAdminSession();
    const { paymentId, planCode } = await req.json();

    if (!paymentId) {
      return NextResponse.json({ ok: false, error: 'Payment ID is required' }, { status: 400 });
    }

    const admin = createAdminClient();
    if (!admin) {
      return NextResponse.json({ ok: true, mock: true });
    }

    // 1. Fetch payment
    const { data: payment, error: pErr } = await admin
      .from('payments')
      .select('*')
      .eq('id', paymentId)
      .single();

    if (pErr || !payment) {
      return NextResponse.json({ ok: false, error: 'Payment not found' }, { status: 404 });
    }

    // 2. Fetch plan
    const code = planCode || (payment.notes && payment.notes.replace('Plan: ', '').trim()) || 'lead-capture-basic';
    const { data: plan } = await admin
      .from('plans')
      .select('*')
      .eq('code', code)
      .maybeSingle();

    if (!plan) {
      return NextResponse.json({ ok: false, error: 'Associated plan not found' }, { status: 404 });
    }

    // 3. Mark payment captured
    await admin
      .from('payments')
      .update({
        status: 'captured',
        verified_by: adminSession.userId,
        verified_at: new Date().toISOString(),
      })
      .eq('id', paymentId);

    // 4. Create or extend subscription
    const { data: existingSub } = await admin
      .from('subscriptions')
      .select('*')
      .eq('user_id', payment.user_id)
      .eq('automation_slug', plan.automation_slug)
      .in('status', ['created', 'active', 'past_due', 'paused'])
      .maybeSingle();

    let startDate = new Date().toISOString();
    let endDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();

    if (existingSub && existingSub.status === 'active' && existingSub.current_period_end) {
      // Extend by 30 days from current end
      const currentEnd = new Date(existingSub.current_period_end);
      endDate = new Date(currentEnd.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString();
    }

    if (existingSub) {
      await admin
        .from('subscriptions')
        .update({
          status: 'active',
          plan_id: plan.id,
          provider: 'manual',
          current_period_start: startDate,
          current_period_end: endDate,
          grace_until: null,
        })
        .eq('id', existingSub.id);
    } else {
      await admin.from('subscriptions').insert({
        user_id: payment.user_id,
        plan_id: plan.id,
        automation_slug: plan.automation_slug,
        status: 'active',
        provider: 'manual',
        current_period_start: startDate,
        current_period_end: endDate,
      });
    }

    // 5. Audit log
    await admin.from('audit_log').insert({
      actor_id: adminSession.userId,
      action: 'payment.approved',
      target: paymentId,
      meta: { userId: payment.user_id, planCode: plan.code, amount: payment.amount_inr },
    });

    // 6. Notify user
    const { data: userRecord } = await admin.auth.admin.getUserById(payment.user_id);
    if (userRecord?.user?.email) {
      const tpl = getEmailTemplate('manual_approved', {
        planName: plan.name,
        amount: payment.amount_inr,
        slug: plan.automation_slug,
      });
      await sendEmail({ to: userRecord.user.email, subject: tpl.subject, html: tpl.html });
    }

    return NextResponse.json({ ok: true });
  } catch (err: unknown) {
    return NextResponse.json({ ok: false, error: String(err) }, { status: 403 });
  }
}
