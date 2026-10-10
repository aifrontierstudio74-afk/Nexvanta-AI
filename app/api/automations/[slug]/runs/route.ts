import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from '@/lib/auth/session';
import { listRuns } from '@/lib/automations/runs';
import { AutomationSlug } from '@/lib/automations/types';

export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const session = await getServerSession();
    const userId = session?.userId || 'usr_dev_test';

    const url = new URL(req.url);
    const instanceId = url.searchParams.get('instanceId') || undefined;
    const page = parseInt(url.searchParams.get('page') || '1', 10);
    const limit = parseInt(url.searchParams.get('limit') || '20', 10);

    const data = await listRuns(
      userId,
      params.slug as AutomationSlug,
      instanceId,
      page,
      limit
    );

    return NextResponse.json({ ok: true, runs: data.runs, total: data.total });
  } catch (err: unknown) {
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 });
  }
}
