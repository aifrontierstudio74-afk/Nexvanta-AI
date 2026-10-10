import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { normalizeIndianPhone } from '@/lib/format';

// In-memory rate limiting: 5 requests per 10 minutes per IP
// NOTE: For multi-instance, serverless, or production scale deployments,
// Upstash Redis (@upstash/ratelimit) is recommended.
const rateLimitMap = new Map<string, { count: number; expiresAt: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const windowMs = 10 * 60 * 1000; // 10 minutes
  const maxRequests = 5;

  const current = rateLimitMap.get(ip);
  if (!current || now > current.expiresAt) {
    rateLimitMap.set(ip, { count: 1, expiresAt: now + windowMs });
    return true;
  }

  if (current.count >= maxRequests) {
    return false;
  }

  current.count += 1;
  return true;
}

const LeadSchema = z.object({
  leadId: z.string().max(64).optional(),
  name: z.string().trim().max(100).optional(),
  phone: z.string().trim().max(25).optional(),
  email: z.string().trim().email().max(100).optional().or(z.literal('')),
  company: z.string().trim().max(100).optional(),
  industry: z.string().trim().max(100).optional(),
  interestedIn: z.string().trim().max(150).optional(),
  segment: z.enum(['Service', 'SaaS', 'Digital Product', 'General']).default('General'),
  source: z.string().trim().max(100).optional(),
  message: z.string().trim().max(1000).optional(),
  consent: z.boolean().optional(),
  pageUrl: z.string().trim().max(500).optional(),
  utmSource: z.string().trim().max(100).optional(),
  utmMedium: z.string().trim().max(100).optional(),
  utmCampaign: z.string().trim().max(100).optional(),
  honeypot: z.string().optional(),
  submissionDurationMs: z.number().optional(),
  isHumanRequested: z.boolean().optional(),
});

function calculateLeadStatus(source?: string, phone?: string, isHumanRequested?: boolean): 'HOT' | 'WARM' | 'COLD' {
  if (isHumanRequested) return 'HOT';

  const hotSources = [
    'Quote Request',
    'Demo Request',
    'Talk to Human',
    'Subscribe Intent',
    'Manual Payment Submitted',
  ];
  if (source && hotSources.includes(source)) {
    return 'HOT';
  }

  const warmSources = [
    'Contact Form',
    'Chatbot Completed',
    'WhatsApp Click',
    'Digital Product Purchase',
  ];
  if (source && warmSources.includes(source)) {
    return 'WARM';
  }

  if (source === 'Chatbot Flow' && phone) {
    return 'WARM';
  }

  return 'COLD';
}

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || req.ip || '127.0.0.1';

    // 1. In-memory Rate Limit
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { ok: false, error: 'Too many requests. Please wait a few moments or message us directly on WhatsApp.' },
        { status: 429 }
      );
    }

    const json = await req.json();
    const parsed = LeadSchema.safeParse(json);

    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, error: 'Invalid form input', details: parsed.error.format() },
        { status: 400 }
      );
    }

    const data = parsed.data;

    // 2. Honeypot check
    if (data.honeypot && data.honeypot.trim().length > 0) {
      return NextResponse.json({ ok: false, error: 'Bot submission rejected' }, { status: 400 });
    }

    // 3. Minimum submission time check (reject if submitted under 2 seconds)
    if (data.submissionDurationMs !== undefined && data.submissionDurationMs > 0 && data.submissionDurationMs < 2000) {
      return NextResponse.json({ ok: false, error: 'Submission rejected: completed too quickly.' }, { status: 400 });
    }

    // 4. Normalize phone if provided
    let normalizedPhone = data.phone;
    if (normalizedPhone) {
      normalizedPhone = normalizeIndianPhone(normalizedPhone);
    }

    // 5. Calculate status
    const status = calculateLeadStatus(data.source, normalizedPhone, data.isHumanRequested);

    // 6. Generate or retain Lead ID
    const leadId = data.leadId || `NX-${new Date().toISOString().slice(2, 10).replace(/-/g, '')}-${Math.floor(1000 + Math.random() * 9000)}`;

    const sheetPayload = {
      secret: process.env.GOOGLE_SHEET_SECRET || '',
      leadId,
      name: data.name || '',
      industry: data.industry || '',
      phone: normalizedPhone || '',
      email: data.email || '',
      company: data.company || '',
      status,
      segment: data.segment,
      interestedIn: data.interestedIn || '',
      source: data.source || 'Website Form',
      message: data.message || '',
      pageUrl: data.pageUrl || '',
      utmSource: data.utmSource || '',
      utmMedium: data.utmMedium || '',
      utmCampaign: data.utmCampaign || '',
    };

    const webhookUrl = process.env.GOOGLE_SHEET_WEBHOOK_URL;

    // 7. Mock mode if webhook URL is not configured
    if (!webhookUrl) {
      console.log('[MOCK CRM LEAD RECEIVED]:', sheetPayload);
      return NextResponse.json({ ok: true, leadId, mock: true });
    }

    // 8. Forward to Google Apps Script Webhook with 1 retry
    let webhookSuccess = false;
    let attempt = 0;

    while (attempt < 2 && !webhookSuccess) {
      attempt += 1;
      try {
        const response = await fetch(webhookUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(sheetPayload),
        });

        if (response.ok) {
          webhookSuccess = true;
          break;
        }
      } catch (webhookErr) {
        console.error(`Google Sheet Webhook Attempt ${attempt} failed:`, webhookErr);
      }
    }

    if (!webhookSuccess) {
      // Never lose lead silently: Log to server stdout/stderr
      console.error('[FAILED LEAD DISPATCH - STORED ON SERVER]:', JSON.stringify(sheetPayload));
      return NextResponse.json(
        {
          ok: false,
          leadId,
          error: 'Could not sync lead immediately. Please connect with us directly on WhatsApp or Email.',
          fallbackContact: {
            whatsapp: 'https://wa.me/919713103152',
            email: 'hello.nexvanta56@gmail.com',
          },
        },
        { status: 502 }
      );
    }

    return NextResponse.json({ ok: true, leadId });
  } catch (err: unknown) {
    console.error('Lead API internal error:', err);
    return NextResponse.json({ ok: false, error: 'Internal server error' }, { status: 500 });
  }
}
