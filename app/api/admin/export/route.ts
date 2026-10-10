import { NextRequest, NextResponse } from 'next/server';
import { requireAdminSession } from '@/lib/auth/session';
import { createAdminClient } from '@/lib/supabase/admin';

export async function GET(req: NextRequest) {
  try {
    await requireAdminSession();
    const admin = createAdminClient();
    if (!admin) {
      return new NextResponse('id,name,email,created_at\n', {
        headers: { 'Content-Type': 'text/csv' },
      });
    }

    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type') || 'users';

    if (type === 'users') {
      const { data: users } = await admin
        .from('profiles')
        .select('id, full_name, phone, company, role, created_at')
        .order('created_at', { ascending: false });

      let csv = 'User ID,Full Name,Phone,Company,Role,Created At\n';
      for (const u of users || []) {
        csv += `"${u.id}","${u.full_name || ''}","${u.phone || ''}","${u.company || ''}","${u.role}","${u.created_at}"\n`;
      }

      return new NextResponse(csv, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': 'attachment; filename="nexvanta_users.csv"',
        },
      });
    }

    if (type === 'subscriptions') {
      const { data: subs } = await admin
        .from('subscriptions')
        .select(`
          id,
          user_id,
          automation_slug,
          status,
          provider,
          current_period_start,
          current_period_end,
          plans ( name, price_inr )
        `)
        .order('created_at', { ascending: false });

      let csv = 'Subscription ID,User ID,Automation,Plan,Price (INR),Status,Provider,Period Start,Period End\n';
      for (const s of subs || []) {
        const plan = Array.isArray(s.plans) ? s.plans[0] : s.plans;
        csv += `"${s.id}","${s.user_id}","${s.automation_slug}","${plan?.name || ''}","${plan?.price_inr || ''}","${s.status}","${s.provider}","${s.current_period_start || ''}","${s.current_period_end || ''}"\n`;
      }

      return new NextResponse(csv, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': 'attachment; filename="nexvanta_subscriptions.csv"',
        },
      });
    }

    return NextResponse.json({ ok: false, error: 'Unknown export type' }, { status: 400 });
  } catch (err: unknown) {
    return NextResponse.json({ ok: false, error: String(err) }, { status: 403 });
  }
}
