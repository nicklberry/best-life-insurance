export type ProfilePayload = {
  email?: string;
  firstName?: string;
  homeAge?: string;
  hvacAge?: string;
  waterHeaterAge?: string;
  topConcerns?: string[];
  olderApplianceCount?: string;
  recentMajorRepair?: string;
  protectionPreference?: string;
  riskScore?: number;
  recommendedTier?: string;
  completedAt?: string;
  pageUrl?: string;
  pageTitle?: string;
  referrer?: string;
  [key: string]: unknown;
};

export async function submitProfile(payload: ProfilePayload) {
  try {
    const response = await fetch('/api/profile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await response.json().catch(() => ({}));
    return {
      ok: response.ok,
      error: typeof data.error === 'string' ? data.error : '',
    };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : 'Profile submission failed',
    };
  }
}
