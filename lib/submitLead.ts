export interface LeadPayload {
  leadId?: string;
  name?: string;
  phone?: string;
  email?: string;
  company?: string;
  industry?: string;
  interestedIn?: string;
  segment?: 'Service' | 'SaaS' | 'Digital Product' | 'General';
  source?: string;
  message?: string;
  consent?: boolean;
  honeypot?: string;
  submissionDurationMs?: number;
  isHumanRequested?: boolean;
}

export interface LeadResponse {
  ok: boolean;
  leadId?: string;
  error?: string;
  mock?: boolean;
}

const LEAD_STORAGE_KEY = 'nx_lead_id';
const UTM_STORAGE_KEY = 'nx_utm_params';

/**
 * Initializes and captures UTM parameters from URL if present
 */
export function initUtmCapture(): void {
  if (typeof window === 'undefined') return;
  try {
    const params = new URLSearchParams(window.location.search);
    const utmSource = params.get('utm_source');
    const utmMedium = params.get('utm_medium');
    const utmCampaign = params.get('utm_campaign');

    if (utmSource || utmMedium || utmCampaign) {
      sessionStorage.setItem(
        UTM_STORAGE_KEY,
        JSON.stringify({
          utmSource: utmSource || '',
          utmMedium: utmMedium || '',
          utmCampaign: utmCampaign || '',
        })
      );
    }
  } catch {
    // ignore sessionStorage errors
  }
}

export function getStoredLeadId(): string | null {
  if (typeof window === 'undefined') return null;
  try {
    return sessionStorage.getItem(LEAD_STORAGE_KEY);
  } catch {
    return null;
  }
}

export function setStoredLeadId(id: string): void {
  if (typeof window === 'undefined') return;
  try {
    sessionStorage.setItem(LEAD_STORAGE_KEY, id);
  } catch {
    // ignore
  }
}

export async function submitLead(payload: LeadPayload): Promise<LeadResponse> {
  const currentLeadId = payload.leadId || getStoredLeadId() || undefined;

  let utmData: { utmSource?: string; utmMedium?: string; utmCampaign?: string } = {};
  if (typeof window !== 'undefined') {
    try {
      const stored = sessionStorage.getItem(UTM_STORAGE_KEY);
      if (stored) utmData = JSON.parse(stored);
    } catch {
      // ignore
    }
  }

  const pageUrl = typeof window !== 'undefined' ? window.location.href : '';

  const body = {
    ...payload,
    leadId: currentLeadId,
    pageUrl,
    utmSource: utmData.utmSource || '',
    utmMedium: utmData.utmMedium || '',
    utmCampaign: utmData.utmCampaign || '',
  };

  const res = await fetch('/api/lead', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  const data: LeadResponse = await res.json();
  if (data.ok && data.leadId) {
    setStoredLeadId(data.leadId);
  }
  return data;
}
