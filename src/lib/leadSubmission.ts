export type LeadPayload = {
  timestamp: string;

  firstName: string;
  lastName: string;
  email: string;
  phone: string;

  address?: string;
  city?: string;
  state?: string;
  zip: string;

  tcpaConsent: boolean;
  tcpaConsentText: string;
  tcpaConsentVersion: string;
  tcpaConsentTimestamp: string;

  submission_type: 'life_insurance_lead';
  leadType: 'family_protection_check' | 'life_quote_request' | 'expansion_waitlist';

  // Family Protection Check fields
  ageRange?: string;
  maritalStatus?: string;
  numberOfChildren?: string;
  homeownerStatus?: string;
  annualIncome?: string;
  existingLifeInsurance?: string;
  protectionGapScore?: number;
  recommendationLevel?: string;

  // Anti-spam fields
  companyWebsite?: string;
  timeToSubmitMs?: number;
  spamCheckStatus?: 'pass' | 'suspect';

  website: 'bestlifeinsurancenearme.com';
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
