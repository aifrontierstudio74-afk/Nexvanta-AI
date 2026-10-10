import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from '@/lib/auth/session';
import { getAutomationModule } from '@/lib/automations/registry';
import { createAdminClient } from '@/lib/supabase/admin';

export async function POST(
  req: NextRequest,
  { params }: { params: { slug: string; id: string } }
) {
  try {
    const session = await getServerSession();
    const userId = session?.userId || 'usr_dev_test';

    const autoModule = getAutomationModule(params.slug);
    if (!autoModule) {
      return NextResponse.json({ ok: false, error: 'Module not found' }, { status: 404 });
    }

    const admin = createAdminClient();
    if (admin) {
      const { data: instance } = await admin
        .from('automation_instances')
        .select('*')
        .eq('id', params.id)
        .eq('user_id', userId)
        .single();

      if (autoModule.onPause) {
        await autoModule.onPause({
          userId,
          instanceId: params.id,
          slug: autoModule.slug,
          config: instance?.config || {},
        });
      }

      await admin
        .from('automation_instances')
        .update({ status: 'paused', updated_at: new Date().toISOString() })
        .eq('id', params.id);
    } else {
      if (autoModule.onPause) {
        await autoModule.onPause({
          userId,
          instanceId: params.id,
          slug: autoModule.slug,
          config: {},
        });
      }
    }

    return NextResponse.json({ ok: true, status: 'paused' });
  } catch (err: unknown) {
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 });
  }
}
