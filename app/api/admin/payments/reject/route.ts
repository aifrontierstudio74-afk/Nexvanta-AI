import { NextRequest, NextResponse } from 'next/server';
import { requireAdminSession } from '@/lib/auth/session';
import { createAdminClient } from '@/lib/supabase/admin';
import { sendEmail, getEmailTemplate } from '@/lib/email';

export async function POST(req: NextRequest) {
  try {
    const adminSession = await requireAdminSession();
    const { paymentId, reason } = await req.json();

    if (!paymentId) {
      return NextResponse.json({ ok: false, error: 'Payment ID is required' }, { status: 400 });
    }

    const admin = createAdminClient();
    if (!admin) {
      return NextResponse.json({ ok: true, mock: true });
    }

    const { data: payment, error } = await admin
      .from('payments')
      .update({
        status: 'rejected',
        notes: reason || 'Payment could not be verified with bank statements.',
        verified_by: adminSession.userId,
        verified_at: new Date().toISOString(),
      })
      .eq('id', paymentId)
      .select('*')
      .single();

    if (error || !payment) {
      return NextResponse.json({ ok: false, error: 'Payment not found' }, { status: 404 });
    }

    // Audit log
    await admin.from('audit_log').insert({
      actor_id: adminSession.userId,
      action: 'payment.rejected',
      target: paymentId,
      meta: { userId: payment.user_id, reason },
    });

    // Notify user
    const { data: userRecord } = await admin.auth.admin.getUserById(payment.user_id);
    if (userRecord?.user?.email) {
      const tpl = getEmailTemplate('manual_rejected', {
        utr: payment.utr || 'N/A',
        reason: reason || 'Unable to confirm transaction.',
      });
      await sendEmail({ to: userRecord.user.email, subject: tpl.subject, html: tpl.html });
    }

    return NextResponse.json({ ok: true });
  } catch (err: unknown) {
    return NextResponse.json({ ok: false, error: String(err) }, { status: 403 });
  }
}
