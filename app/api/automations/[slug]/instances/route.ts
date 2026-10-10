import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from '@/lib/auth/session';
import { getAutomationModule } from '@/lib/automations/registry';
import { createAdminClient } from '@/lib/supabase/admin';

export async function POST(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const session = await getServerSession();
    const userId = session?.userId || 'usr_dev_test';

    const autoModule = getAutomationModule(params.slug);
    if (!autoModule) {
      return NextResponse.json({ ok: false, error: 'Unknown automation module' }, { status: 404 });
    }

    const body = await req.json().catch(() => ({}));
    const name = body.name || `My ${autoModule.title}`;
    const config = body.config || autoModule.defaultConfig;

    const admin = createAdminClient();
    const instanceId = `inst_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

    if (!admin) {
      return NextResponse.json({ ok: true, instance: { id: instanceId, name, config, status: 'draft' } });
    }

    const { data, error } = await admin
      .from('automation_instances')
      .insert({
        user_id: userId,
        automation_slug: params.slug,
        name,
        config,
        status: 'draft',
      })
      .select('id, name, config, status')
      .single();

    if (error) {
      return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true, instance: data });
  } catch (err: unknown) {
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 });
  }
}
