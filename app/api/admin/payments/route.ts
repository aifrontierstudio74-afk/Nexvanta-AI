import { NextRequest, NextResponse } from 'next/server';
import { requireAdminSession } from '@/lib/auth/session';
import { createAdminClient } from '@/lib/supabase/admin';

export async function GET(req: NextRequest) {
  try {
    await requireAdminSession();
    const admin = createAdminClient();
    if (!admin) return NextResponse.json({ ok: true, payments: [] });

    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status') || 'pending';

    const { data: payments, error } = await admin
      .from('payments')
      .select(`
        id,
        user_id,
        provider,
        amount_inr,
        status,
        utr,
        method,
        notes,
        created_at,
        profiles:user_id ( full_name, phone )
      `)
      .eq('status', status)
      .order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true, payments: payments || [] });
  } catch (err: unknown) {
    return NextResponse.json({ ok: false, error: String(err) }, { status: 403 });
  }
}
