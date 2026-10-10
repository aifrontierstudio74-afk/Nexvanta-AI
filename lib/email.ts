import { Resend } from 'resend';
import { env, isResendConfigured } from '@/lib/env';

let resendClient: Resend | null = null;
if (isResendConfigured) {
  resendClient = new Resend(env.RESEND_API_KEY!);
}

export interface SendEmailParams {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export async function sendEmail({ to, subject, html, text }: SendEmailParams) {
  if (!resendClient) {
    console.log(`[Email Mock] To: ${to} | Subject: ${subject}`);
    return { ok: true, mock: true, id: `mock_${Date.now()}` };
  }

  try {
    const res = await resendClient.emails.send({
      from: env.EMAIL_FROM,
      to,
      subject,
      html,
      text: text || html.replace(/<[^>]+>/g, ''),
    });

    if (res.error) {
      console.error('Resend error:', res.error);
      return { ok: false, error: res.error.message };
    }

    return { ok: true, id: res.data?.id };
  } catch (err: unknown) {
    console.error('Email sending exception:', err);
    return { ok: false, error: String(err) };
  }
}

// Transactional Email Templates
export function getEmailTemplate(
  type:
    | 'welcome'
    | 'payment_success'
    | 'payment_failed'
    | 'renewal_reminder'
    | 'subscription_cancelled'
    | 'usage_80'
    | 'failure_alert'
    | 'manual_received'
    | 'manual_approved'
    | 'manual_rejected',
  data: Record<string, string | number>
) {
  const brandGold = '#F5C518';
  const brandDark = '#0A0B14';

  const baseWrap = (content: string) => `
    <!DOCTYPE html>
    <html>
      <body style="background-color: ${brandDark}; color: #F4F4F6; font-family: sans-serif; padding: 32px 16px; margin: 0;">
        <div style="max-width: 560px; margin: 0 auto; background-color: #11131F; border: 1px solid rgba(245,197,24,0.3); border-radius: 16px; padding: 32px;">
          <div style="margin-bottom: 24px;">
            <span style="font-size: 20px; font-weight: bold; color: #FFFFFF;">Nexvanta<span style="color: ${brandGold};">.AI</span></span>
          </div>
          ${content}
          <div style="margin-top: 32px; border-top: 1px solid rgba(245,197,24,0.15); padding-top: 16px; font-size: 11px; color: #9AA0B4;">
            Nexvanta.AI Automation Studio · +91 97131 03152 · hello.nexvanta56@gmail.com
          </div>
        </div>
      </body>
    </html>
  `;

  switch (type) {
    case 'welcome':
      return {
        subject: 'Welcome to Nexvanta.AI Automation Platform',
        html: baseWrap(`
          <h2 style="color: #F4F4F6; margin-top: 0;">Welcome aboard, ${data.name || 'Partner'}!</h2>
          <p style="color: #9AA0B4; font-size: 14px; line-height: 1.6;">
            Your Nexvanta.AI account is ready. You now have access to high-performance AI automations engineered to run your business autonomously.
          </p>
          <a href="${env.NEXT_PUBLIC_SITE_URL}/app" style="display: inline-block; background-color: ${brandGold}; color: #000000; font-weight: bold; font-size: 13px; text-decoration: none; padding: 12px 24px; border-radius: 8px; margin-top: 16px;">
            Open Your Dashboard ↗
          </a>
        `),
      };

    case 'payment_success':
      return {
        subject: `Payment Confirmed: ${data.planName || 'Automation Plan'} (₹${data.amount})`,
        html: baseWrap(`
          <h2 style="color: #2ECC8F; margin-top: 0;">Payment Successful</h2>
          <p style="color: #9AA0B4; font-size: 14px; line-height: 1.6;">
            We received your payment of <strong>₹${data.amount}</strong> for <strong>${data.planName}</strong>. Your automation entitlement is active.
          </p>
          <a href="${env.NEXT_PUBLIC_SITE_URL}/app/${data.slug || ''}" style="display: inline-block; background-color: ${brandGold}; color: #000000; font-weight: bold; font-size: 13px; text-decoration: none; padding: 12px 24px; border-radius: 8px; margin-top: 16px;">
            Launch Automation ↗
          </a>
        `),
      };

    case 'payment_failed':
      return {
        subject: `Action Required: Payment Failed for ${data.planName || 'Subscription'}`,
        html: baseWrap(`
          <h2 style="color: #EF4444; margin-top: 0;">Payment Incomplete</h2>
          <p style="color: #9AA0B4; font-size: 14px; line-height: 1.6;">
            We were unable to process your recurring payment for <strong>${data.planName}</strong>. Your subscription is past due.
            You have a <strong>${data.graceDays || 3}-day grace period</strong> before background workflows pause.
          </p>
          <a href="${env.NEXT_PUBLIC_SITE_URL}/app/billing" style="display: inline-block; background-color: ${brandGold}; color: #000000; font-weight: bold; font-size: 13px; text-decoration: none; padding: 12px 24px; border-radius: 8px; margin-top: 16px;">
            Update Payment Method ↗
          </a>
        `),
      };

    case 'renewal_reminder':
      return {
        subject: `Upcoming Renewal: ${data.planName || 'Automation'} (₹${data.amount})`,
        html: baseWrap(`
          <h2 style="color: ${brandGold}; margin-top: 0;">Subscription Renewal Notice</h2>
          <p style="color: #9AA0B4; font-size: 14px; line-height: 1.6;">
            Your automation plan <strong>${data.planName}</strong> will renew on <strong>${data.date}</strong>. Amount: ₹${data.amount}.
          </p>
        `),
      };

    case 'subscription_cancelled':
      return {
        subject: `Subscription Cancelled: ${data.planName}`,
        html: baseWrap(`
          <h2 style="color: #9AA0B4; margin-top: 0;">Subscription Cancelled</h2>
          <p style="color: #9AA0B4; font-size: 14px; line-height: 1.6;">
            Your subscription to <strong>${data.planName}</strong> has been cancelled. You retain active access until the end of your billing cycle on <strong>${data.periodEnd}</strong>.
          </p>
        `),
      };

    case 'usage_80':
      return {
        subject: `⚠️ 80% Quota Warning: ${data.metric} on ${data.automationTitle}`,
        html: baseWrap(`
          <h2 style="color: ${brandGold}; margin-top: 0;">80% Plan Limit Reached</h2>
          <p style="color: #9AA0B4; font-size: 14px; line-height: 1.6;">
            You have consumed <strong>${data.used} of ${data.limit} ${data.metric}</strong> for this billing cycle.
            To prevent automatic throttling at 100%, consider upgrading your tier.
          </p>
          <a href="${env.NEXT_PUBLIC_SITE_URL}/app/billing" style="display: inline-block; background-color: ${brandGold}; color: #000000; font-weight: bold; font-size: 13px; text-decoration: none; padding: 12px 24px; border-radius: 8px; margin-top: 16px;">
            Upgrade Tier ↗
          </a>
        `),
      };

    case 'failure_alert':
      return {
        subject: `🚨 Automation Alert: Multiple Run Failures on ${data.instanceName}`,
        html: baseWrap(`
          <h2 style="color: #EF4444; margin-top: 0;">Automation Needs Attention</h2>
          <p style="color: #9AA0B4; font-size: 14px; line-height: 1.6;">
            Your automation instance <strong>${data.instanceName}</strong> encountered 3 consecutive errors. The workflow has been safely paused to prevent quota waste.
          </p>
          <div style="background-color: #161827; border: 1px solid rgba(239,68,68,0.3); padding: 12px; border-radius: 8px; font-family: monospace; font-size: 12px; color: #FCA5A5;">
            ${data.lastError || 'Unknown execution error'}
          </div>
          <a href="${env.NEXT_PUBLIC_SITE_URL}/app/${data.slug}?tab=activity" style="display: inline-block; background-color: ${brandGold}; color: #000000; font-weight: bold; font-size: 13px; text-decoration: none; padding: 12px 24px; border-radius: 8px; margin-top: 16px;">
            View Error Log ↗
          </a>
        `),
      };

    case 'manual_received':
      return {
        subject: `Payment Verification Submitted: UTR ${data.utr}`,
        html: baseWrap(`
          <h2 style="color: #F4F4F6; margin-top: 0;">Payment Claim Received</h2>
          <p style="color: #9AA0B4; font-size: 14px; line-height: 1.6;">
            We received your manual payment claim of ₹${data.amount} (UTR: ${data.utr}). Our billing team is reviewing it and your access will be activated shortly.
          </p>
        `),
      };

    case 'manual_approved':
      return {
        subject: `Access Activated: ${data.planName}`,
        html: baseWrap(`
          <h2 style="color: #2ECC8F; margin-top: 0;">Payment Approved &amp; Access Active!</h2>
          <p style="color: #9AA0B4; font-size: 14px; line-height: 1.6;">
            Your manual payment of ₹${data.amount} has been verified and approved. Your entitlement for <strong>${data.planName}</strong> is now live for 30 days.
          </p>
          <a href="${env.NEXT_PUBLIC_SITE_URL}/app/${data.slug}" style="display: inline-block; background-color: ${brandGold}; color: #000000; font-weight: bold; font-size: 13px; text-decoration: none; padding: 12px 24px; border-radius: 8px; margin-top: 16px;">
            Start Automation ↗
          </a>
        `),
      };

    case 'manual_rejected':
      return {
        subject: `Payment Verification Notice: UTR ${data.utr}`,
        html: baseWrap(`
          <h2 style="color: #EF4444; margin-top: 0;">Payment Verification Unsuccessful</h2>
          <p style="color: #9AA0B4; font-size: 14px; line-height: 1.6;">
            Our finance team could not verify the transaction with UTR <strong>${data.utr}</strong>.
            Reason: ${data.reason || 'Transaction could not be matched with bank statements.'}
          </p>
          <p style="color: #9AA0B4; font-size: 13px;">
            Please reply to this email or message us on WhatsApp (+91 97131 03152) with your payment screenshot.
          </p>
        `),
      };
  }
}
