import { NextRequest, NextResponse } from 'next/server';
import { requireAdminSession } from '@/lib/auth/session';
import { createAdminClient } from '@/lib/supabase/admin';

export async function GET() {
  try {
    await requireAdminSession();
    const admin = createAdminClient();

    if (!admin) {
      return NextResponse.json({ ok: true, plans: [] });
    }

    const { data: plans } = await admin
      .from('plans')
      .select('*')
      .order('sort_order', { ascending: true });

    return NextResponse.json({ ok: true, plans: plans || [] });
  } catch (err: unknown) {
    return NextResponse.json({ ok: false, error: String(err) }, { status: 403 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const adminSession = await requireAdminSession();
    const admin = createAdminClient();
    if (!admin) return NextResponse.json({ ok: true, mock: true });

    const body = await req.json();
    const { id, name, price_inr, limits, is_active } = body;

    const updates: Record<string, unknown> = {};
    if (name !== undefined) updates.name = name;
    if (price_inr !== undefined) updates.price_inr = Number(price_inr);
    if (limits !== undefined) updates.limits = limits;
    if (is_active !== undefined) updates.is_active = Boolean(is_active);

    const { data: updated, error } = await admin
      .from('plans')
      .update(updates)
      .eq('id', id)
      .select('*')
      .single();

    if (error) {
      return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
    }

    // Write audit log
    await admin.from('audit_log').insert({
      actor_id: adminSession.userId,
      action: 'plan.updated',
      target: id,
      meta: updates,
    });

    return NextResponse.json({ ok: true, plan: updated });
  } catch (err: unknown) {
    return NextResponse.json({ ok: false, error: String(err) }, { status: 403 });
  }
}
