import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { isSupabaseConfigured, isRazorpayConfigured, isResendConfigured } from '@/lib/env';

export async function GET() {
  const timestamp = new Date().toISOString();
  let dbStatus = 'unconfigured';

  if (isSupabaseConfigured) {
    try {
      const admin = createAdminClient();
      if (admin) {
        const { error } = await admin.from('plans').select('id').limit(1);
        dbStatus = error ? `error: ${error.message}` : 'healthy';
      }
    } catch (e) {
      dbStatus = `exception: ${String(e)}`;
    }
  }

  return NextResponse.json({
    status: dbStatus === 'healthy' || dbStatus === 'unconfigured' ? 'ok' : 'degraded',
    service: 'Nexvanta.AI SaaS Platform',
    timestamp,
    checks: {
      database: dbStatus,
      razorpay: isRazorpayConfigured ? 'configured' : 'fallback_mode',
      resend: isResendConfigured ? 'configured' : 'mock_mode',
    },
  });
}
