import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from '@/lib/auth/session';
import { getAutomationModule } from '@/lib/automations/registry';
import { requireEntitlement, consume } from '@/lib/entitlements';
import { startRun, finishRun } from '@/lib/automations/runs';

async function handleCustomRoute(
  req: NextRequest,
  params: { slug: string; path: string[] }
) {
  try {
    const session = await getServerSession();
    const userId = session?.userId || 'usr_dev_test';
    const subpath = params.path.join('/');

    // Handle built-in demo-automation test execution
    if (params.slug === 'demo-automation' && subpath === 'run' && req.method === 'POST') {
      const body = await req.json().catch(() => ({}));
      const instanceId = body.instanceId;

      // 1. Verify entitlement
      await requireEntitlement(userId, 'demo-automation');

      // 2. Consume 1 unit
      const consumeRes = await consume(userId, 'demo-automation', 'units', 1);
      if (!consumeRes.allowed) {
        return NextResponse.json(
          { ok: false, error: 'Quota limit reached. Please upgrade your plan.' },
          { status: 403 }
        );
      }

      // 3. Record run
      const { runId } = await startRun({
        userId,
        instanceId,
        slug: 'demo-automation',
        type: 'benchmark_execution',
        input: body.payload || {},
      });

      await finishRun({
        runId,
        status: 'succeeded',
        output: { processed: 1, durationMs: 142, executedAt: new Date().toISOString() },
      });

      return NextResponse.json({
        ok: true,
        runId,
        consumed: 1,
        remaining: consumeRes.remaining,
      });
    }

    const autoModule = getAutomationModule(params.slug);
    if (!autoModule) {
      return NextResponse.json({ ok: false, error: 'Module not found' }, { status: 404 });
    }

    if (!autoModule.apiRouter) {
      return NextResponse.json(
        { ok: false, error: `No custom API router registered for module ${params.slug}` },
        { status: 404 }
      );
    }

    return await autoModule.apiRouter(req, {
      userId,
      instanceId: '',
      slug: autoModule.slug,
      config: {},
    });
  } catch (err: unknown) {
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : String(err) },
      { status: 403 }
    );
  }
}

export async function GET(req: NextRequest, { params }: { params: { slug: string; path: string[] } }) {
  return handleCustomRoute(req, params);
}

export async function POST(req: NextRequest, { params }: { params: { slug: string; path: string[] } }) {
  return handleCustomRoute(req, params);
}

export async function PUT(req: NextRequest, { params }: { params: { slug: string; path: string[] } }) {
  return handleCustomRoute(req, params);
}

export async function DELETE(req: NextRequest, { params }: { params: { slug: string; path: string[] } }) {
  return handleCustomRoute(req, params);
}
