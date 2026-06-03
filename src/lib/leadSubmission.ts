export type LeadPayload = {
  timestamp: string;

  firstName: string;
  lastName: string;
  email: string;
  phone: string;

  address: string;
  city: string;
  state: string;
  zip: string;

  tcpaConsent: boolean;
  tcpaConsentText: string;
  tcpaConsentVersion: string;
  tcpaConsentTimestamp: string;

  eligibilityStatus: 'eligible' | 'ineligible';
  eligibleState: 'IA' | 'IL' | '';
  leadType: 'coverage_lead' | 'expansion_waitlist' | 'home_protection_gap_check';

  // Survey / profile fields (optional for gap-check and profile flows)
  homeAge?: string;
  hvacAge?: string;
  waterHeaterAge?: string;
  topConcerns?: string[];
  olderApplianceCount?: string;
  recentMajorRepair?: string;
  protectionPreference?: string;
  riskScore?: number;
  recommendedTier?: string;

  // Anti-spam fields
  companyWebsite?: string;
  timeToSubmitMs?: number;
  spamCheckStatus?: 'pass' | 'suspect';

  website: 'besthomewarrantynearme.com';
  pageUrl: string;
  pagePath: string;
  pageTitle: string;
  referrer: string;

  utmSource: string;
  utmMedium: string;
  utmCampaign: string;
  utmTerm: string;
  utmContent: string;

  userAgent: string;
};

export async function submitLead(payload: LeadPayload) {
  try {
    const response = await fetch('/api/leads', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });
    const data = await response.json().catch(() => ({}));

    return {
      ok: response.ok,
      mode: 'function',
      status: response.status,
      error: typeof data.error === 'string' ? data.error : ''
    };
  } catch (error) {
    console.error('Lead function submission failed:', error);

    return {
      ok: false,
      mode: 'function',
      status: 0,
      error: error instanceof Error ? error.message : 'Lead submission failed'
    };
  }
}
