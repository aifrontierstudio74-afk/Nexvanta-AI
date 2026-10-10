import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from '@/lib/auth/session';
import { createAdminClient } from '@/lib/supabase/admin';
import { sendEmail, getEmailTemplate } from '@/lib/email';
import { submitLead } from '@/lib/submitLead';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession();
    const userId = session?.userId || 'usr_dev_test';
    const email = session?.email || '';

    const body = await req.json();
    const { planCode, amount, method, utr, notes } = body;

    if (!utr || !amount) {
      return NextResponse.json({ ok: false, error: 'UTR and Amount are required' }, { status: 400 });
    }

    const admin = createAdminClient();
    if (admin) {
      // Find plan
      const { data: plan } = await admin
        .from('plans')
        .select('*')
        .eq('code', planCode)
        .maybeSingle();

      const { data: payment, error } = await admin
        .from('payments')
        .insert({
          user_id: userId,
          provider: 'manual',
          amount_inr: Number(amount),
          status: 'pending',
          utr,
          method: method || 'UPI',
          notes: notes || `Plan: ${planCode}`,
        })
        .select('id')
        .single();

      if (error) {
        return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
      }

      // Also forward to Google Sheets CRM
      await submitLead({
        name: session?.fullName || 'User',
        phone: '9713103152',
        email,
        segment: 'SaaS',
        interestedIn: plan?.name || planCode,
        source: 'Manual SaaS Payment Claim',
        message: `Manual payment claim submitted: ₹${amount} via ${method}, UTR: ${utr}`,
        consent: true,
      });

      // Send confirmation email
      if (email) {
        const tpl = getEmailTemplate('manual_received', {
          utr,
          amount,
        });
        await sendEmail({ to: email, subject: tpl.subject, html: tpl.html });
      }

      return NextResponse.json({ ok: true, paymentId: payment?.id });
    }

    // Mock fallback
    return NextResponse.json({ ok: true, paymentId: `pay_mock_${Date.now()}` });
  } catch (err: unknown) {
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 });
  }
}
