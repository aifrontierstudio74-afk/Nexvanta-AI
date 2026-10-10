import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from '@/lib/auth/session';
import { getAutomationModule } from '@/lib/automations/registry';
import { createAdminClient } from '@/lib/supabase/admin';

export async function PATCH(
  req: NextRequest,
  { params }: { params: { slug: string; id: string } }
) {
  try {
    const session = await getServerSession();
    const userId = session?.userId || 'usr_dev_test';

    const autoModule = getAutomationModule(params.slug);
    if (!autoModule) {
      return NextResponse.json({ ok: false, error: 'Unknown automation module' }, { status: 404 });
    }

    const body = await req.json();
    const parsedConfig = autoModule.configSchema.safeParse(body.config);
    if (!parsedConfig.success) {
      return NextResponse.json(
        { ok: false, error: 'Invalid configuration parameters', details: parsedConfig.error.format() },
        { status: 400 }
      );
    }

    const admin = createAdminClient();
    if (!admin) {
      return NextResponse.json({ ok: true, message: 'Instance updated (mock)' });
    }

    const updatePayload: Record<string, unknown> = {
      config: parsedConfig.data,
      updated_at: new Date().toISOString(),
    };
    if (body.name) updatePayload.name = body.name;

    const { error } = await admin
      .from('automation_instances')
      .update(updatePayload)
      .eq('id', params.id)
      .eq('user_id', userId);

    if (error) {
      return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (err: unknown) {
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { slug: string; id: string } }
) {
  try {
    const session = await getServerSession();
    const userId = session?.userId || 'usr_dev_test';

    const admin = createAdminClient();
    if (!admin) {
      return NextResponse.json({ ok: true });
    }

    const { error } = await admin
      .from('automation_instances')
      .delete()
      .eq('id', params.id)
      .eq('user_id', userId);

    if (error) {
      return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (err: unknown) {
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 });
  }
}
