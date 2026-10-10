import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from '@/lib/auth/session';
import { createAdminClient } from '@/lib/supabase/admin';
import { mockSubscriptionStore } from '@/lib/entitlements';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession();
    const userId = session?.userId || 'usr_dev_test';

    const url = new URL(req.url);
    const subscriptionId = url.searchParams.get('subscriptionId');
    const slug = url.searchParams.get('slug');

    const admin = createAdminClient();

    if (!admin) {
      if (slug) {
        const memSub = mockSubscriptionStore.get(`${userId}:${slug}`);
        if (memSub) {
          return NextResponse.json({
            ok: true,
            status: memSub.status,
            active: memSub.status === 'active',
            slug,
          });
        }
      }
      return NextResponse.json({ ok: true, status: 'active', active: true, slug: slug || 'lead-capture-crm' });
    }

    let query = admin.from('subscriptions').select('id, status, automation_slug').eq('user_id', userId);

    if (subscriptionId) {
      query = query.or(`id.eq.${subscriptionId},razorpay_subscription_id.eq.${subscriptionId}`);
    } else if (slug) {
      query = query.eq('automation_slug', slug).order('created_at', { ascending: false }).limit(1);
    }

    const { data: sub } = await query.maybeSingle();

    if (!sub) {
      return NextResponse.json({ ok: false, error: 'Subscription not found' }, { status: 404 });
    }

    return NextResponse.json({
      ok: true,
      status: sub.status,
      active: sub.status === 'active',
      slug: sub.automation_slug,
    });
  } catch (err: unknown) {
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 });
  }
}
