import { NextRequest, NextResponse } from 'next/server';
import { requireAdminSession } from '@/lib/auth/session';
import { createAdminClient } from '@/lib/supabase/admin';

export async function GET(req: NextRequest) {
  try {
    await requireAdminSession();
    const admin = createAdminClient();
    if (!admin) {
      return NextResponse.json({ ok: true, users: [] });
    }

    const { searchParams } = new URL(req.url);
    const search = searchParams.get('q');

    let query = admin
      .from('profiles')
      .select('id, full_name, phone, company, role, created_at')
      .order('created_at', { ascending: false });

    if (search) {
      query = query.or(`full_name.ilike.%${search}%,phone.ilike.%${search}%,company.ilike.%${search}%`);
    }

    const { data: users, error } = await query.limit(50);

    if (error) {
      return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true, users: users || [] });
  } catch (err: unknown) {
    return NextResponse.json({ ok: false, error: String(err) }, { status: 403 });
  }
}
