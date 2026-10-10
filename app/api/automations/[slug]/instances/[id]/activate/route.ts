import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from '@/lib/auth/session';
import { getAutomationModule } from '@/lib/automations/registry';
import { requireEntitlement } from '@/lib/entitlements';
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

    // 1. MUST verify entitlement on the server before activation
    await requireEntitlement(userId, params.slug);

    const admin = createAdminClient();
    let config: unknown = {};

    if (admin) {
      const { data: instance, error } = await admin
        .from('automation_instances')
        .select('*')
        .eq('id', params.id)
        .eq('user_id', userId)
        .single();

      if (error || !instance) {
        return NextResponse.json({ ok: false, error: 'Instance not found' }, { status: 404 });
      }
      config = instance.config;

      // 2. Call module onActivate if registered
      if (autoModule.onActivate) {
        await autoModule.onActivate({
          userId,
          instanceId: params.id,
          slug: autoModule.slug,
          config,
        });
      }

      // 3. Mark active in DB
      await admin
        .from('automation_instances')
        .update({ status: 'active', updated_at: new Date().toISOString() })
        .eq('id', params.id);
    } else {
      // Mock mode
      if (autoModule.onActivate) {
        await autoModule.onActivate({
          userId,
          instanceId: params.id,
          slug: autoModule.slug,
          config: {},
        });
      }
    }

    return NextResponse.json({ ok: true, status: 'active' });
  } catch (err: unknown) {
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : String(err) },
      { status: 403 }
    );
  }
}
