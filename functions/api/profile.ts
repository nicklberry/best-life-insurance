type Env = {
  LEAD_WEBHOOK_URL?: string;
};

type ProfilePayload = {
  riskScore?: number;
  recommendedTier?: string;
  [key: string]: unknown;
};

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

export async function onRequestGet() {
  return json({ ok: true, message: 'Profile endpoint is live' });
}

export async function onRequestPost(context: { request: Request; env: Env }) {
  try {
    const webhookUrl = context.env.LEAD_WEBHOOK_URL;

    if (!webhookUrl) {
      return json({ ok: false, error: 'Missing LEAD_WEBHOOK_URL' }, 500);
    }

    const payload = (await context.request.json()) as ProfilePayload;

    if (payload.riskScore === undefined || !payload.recommendedTier) {
      return json({ ok: false, error: 'Missing riskScore or recommendedTier' }, 400);
    }

    const forwardedPayload = {
      ...payload,
      eventType: 'survey_complete',
      serverReceivedAt: new Date().toISOString(),
    };

    const zapierResponse = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(forwardedPayload),
    });

    if (!zapierResponse.ok) {
      return json(
        { ok: false, error: 'Webhook delivery failed', status: zapierResponse.status },
        502,
      );
    }

    return json({ ok: true, mode: 'webhook' });
  } catch (error) {
    return json(
      {
        ok: false,
        error: error instanceof Error ? error.message : 'Profile submission failed',
      },
      500,
    );
  }
}
