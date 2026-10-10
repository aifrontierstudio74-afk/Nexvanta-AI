import { NextRequest, NextResponse } from 'next/server';
import { requireAdminSession } from '@/lib/auth/session';
import { createAdminClient } from '@/lib/supabase/admin';

export async function GET(req: NextRequest) {
  try {
    await requireAdminSession();
    const admin = createAdminClient();
    if (!admin) return NextResponse.json({ ok: true, subscriptions: [] });

    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const slug = searchParams.get('slug');

    let query = admin
      .from('subscriptions')
      .select(`
        id,
        user_id,
        automation_slug,
        status,
        provider,
        current_period_start,
        current_period_end,
        grace_until,
        created_at,
        plans ( code, name, price_inr ),
        profiles:user_id ( full_name, phone )
      `)
      .order('created_at', { ascending: false });

    if (status) query = query.eq('status', status);
    if (slug) query = query.eq('automation_slug', slug);

    const { data: subscriptions, error } = await query.limit(50);

    if (error) {
      return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true, subscriptions: subscriptions || [] });
  } catch (err: unknown) {
    return NextResponse.json({ ok: false, error: String(err) }, { status: 403 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const adminSession = await requireAdminSession();
    const admin = createAdminClient();
    if (!admin) return NextResponse.json({ ok: true, mock: true });

    const body = await req.json();
    const { subscriptionId, action, days } = body;

    if (!subscriptionId || !action) {
      return NextResponse.json({ ok: false, error: 'Subscription ID and action required' }, { status: 400 });
    }

    const { data: sub } = await admin
      .from('subscriptions')
      .select('*')
      .eq('id', subscriptionId)
      .single();

    if (!sub) {
      return NextResponse.json({ ok: false, error: 'Subscription not found' }, { status: 404 });
    }

    if (action === 'extend') {
      const extendDays = Number(days) || 30;
      const currentEnd = sub.current_period_end ? new Date(sub.current_period_end) : new Date();
      const newEnd = new Date(currentEnd.getTime() + extendDays * 24 * 60 * 60 * 1000).toISOString();

      await admin
        .from('subscriptions')
        .update({
          status: 'active',
          current_period_end: newEnd,
          grace_until: null,
        })
        .eq('id', subscriptionId);

      await admin.from('audit_log').insert({
        actor_id: adminSession.userId,
        action: 'subscription.extended',
        target: subscriptionId,
        meta: { days: extendDays, previousEnd: sub.current_period_end, newEnd },
      });

      return NextResponse.json({ ok: true, message: `Extended by ${extendDays} days`, newEnd });
    }

    if (action === 'cancel') {
      await admin
        .from('subscriptions')
        .update({ status: 'cancelled' })
        .eq('id', subscriptionId);

      await admin
        .from('automation_instances')
        .update({ status: 'paused' })
        .eq('user_id', sub.user_id)
        .eq('automation_slug', sub.automation_slug);

      await admin.from('audit_log').insert({
        actor_id: adminSession.userId,
        action: 'subscription.cancelled',
        target: subscriptionId,
        meta: { previousStatus: sub.status },
      });

      return NextResponse.json({ ok: true, message: 'Subscription cancelled' });
    }

    return NextResponse.json({ ok: false, error: 'Invalid action' }, { status: 400 });
  } catch (err: unknown) {
    return NextResponse.json({ ok: false, error: String(err) }, { status: 403 });
  }
}
