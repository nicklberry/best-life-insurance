type Env = {
  LEAD_WEBHOOK_URL?: string;
};

type LeadPayload = {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  leadType?: string;
  submission_type?: string;
  eligibilityStatus?: string;
  tcpaConsent?: boolean;
  tcpaConsentText?: string;
  tcpaConsentVersion?: string;
  tcpaConsentTimestamp?: string;
  [key: string]: unknown;
};

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json'
    }
  });
}

function isPresent(value: unknown) {
  return typeof value === 'string' && value.trim().length > 0;
}

function isTerritoryInquiry(payload: LeadPayload): boolean {
  return payload.submission_type === 'territory_inquiry' || payload.leadType === 'territory_inquiry';
}

function getLeadValidationErrors(payload: LeadPayload) {
  const errors: string[] = [];

  if (isTerritoryInquiry(payload)) {
    const requiredFields = ['name', 'email', 'phone'] as const;
    const missingFields = requiredFields.filter((f) => !isPresent(payload[f]));
    if (missingFields.length > 0) {
      errors.push(`Missing required fields: ${missingFields.join(', ')}`);
    }
    if (payload.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(payload.email))) {
      errors.push('Invalid email format');
    }
    if (payload.phone && String(payload.phone).replace(/\D/g, '').length < 10) {
      errors.push('Invalid phone format');
    }
    return errors;
  }

  const requiredFields: Array<keyof LeadPayload> = [
    'firstName',
    'lastName',
    'email',
    'phone',
    'address',
    'city',
    'zip',
    'leadType',
    'eligibilityStatus'
  ];
  const missingFields = requiredFields.filter((field) => !isPresent(payload[field]));

  if (missingFields.length > 0) {
    errors.push(`Missing required fields: ${missingFields.join(', ')}`);
  }

  if (payload.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(payload.email))) {
    errors.push('Invalid email format');
  }

  if (payload.phone && String(payload.phone).replace(/\D/g, '').length < 10) {
    errors.push('Invalid phone format');
  }

  if (payload.zip && !/^\d{5}$/.test(String(payload.zip))) {
    errors.push('Invalid ZIP code format');
  }

  const hasTcpaConsent =
    payload.tcpaConsent === true &&
    isPresent(payload.tcpaConsentText) &&
    isPresent(payload.tcpaConsentVersion) &&
    isPresent(payload.tcpaConsentTimestamp);

  if (!hasTcpaConsent) {
    errors.push('TCPA consent is missing or incomplete');
  }

  return errors;
}

export async function onRequestGet() {
  return json({
    ok: true,
    message: 'Lead endpoint is live'
  });
}

export async function onRequestPost(context: {
  request: Request;
  env: Env;
}) {
  try {
    const webhookUrl = context.env.LEAD_WEBHOOK_URL;

    if (!webhookUrl) {
      return json(
        {
          ok: false,
          error: 'Missing LEAD_WEBHOOK_URL'
        },
        500
      );
    }

    const payload = (await context.request.json()) as LeadPayload;
    const validationErrors = getLeadValidationErrors(payload);
    const tcpaConsentValid = !validationErrors.some((error) => error.includes('TCPA consent'));
    const forwardedPayload = {
      ...payload,
      serverReceivedAt: new Date().toISOString(),
      tcpaConsentValid,
      validationStatus: validationErrors.length === 0 ? 'valid' : 'needs_review',
      validationErrors
    };

    const zapierResponse = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(forwardedPayload)
    });

    const zapierText = await zapierResponse.text();

    if (!zapierResponse.ok) {
      return json(
        {
          ok: false,
          error: 'Zapier webhook failed',
          status: zapierResponse.status,
          response: zapierText
        },
        502
      );
    }

    return json({
      ok: true,
      mode: 'webhook',
      validationStatus: forwardedPayload.validationStatus,
      validationErrors
    });
  } catch (error) {
    return json(
      {
        ok: false,
        error:
          error instanceof Error
            ? error.message
            : 'Lead submission failed'
      },
      500
    );
  }
}
