export type SurveyAnswers = {
  homeAge?: string;
  hvacAge?: string;
  waterHeaterAge?: string;
  topConcerns?: string[];
  olderApplianceCount?: string;
  recentMajorRepair?: string;
  protectionPreference?: string;
};

export type RecommendedTier = 'good' | 'better' | 'best';

export type SurveyResult = SurveyAnswers & {
  riskScore: number;
  recommendedTier: RecommendedTier;
  completedAt: string;
};

// ─── Score tables ────────────────────────────────────────────────────────────

const HOME_AGE_SCORES: Record<string, number> = {
  under5: 5,
  '5to10': 15,
  '11to20': 25,
  '21to40': 40,
  over40: 55,
  notSure: 20,
};

const SYSTEM_AGE_SCORES: Record<string, number> = {
  under5: 5,
  '5to10': 15,
  '11to15': 30,
  over15: 45,
  notSure: 20,
};

const WATER_HEATER_SCORES: Record<string, number> = {
  under5: 5,
  '5to10': 15,
  '11to15': 25,
  over15: 35,
  notSure: 15,
};

const APPLIANCE_SCORES: Record<string, number> = {
  none: 0,
  '1to2': 10,
  '3to4': 20,
  over5: 30,
  notSure: 10,
};

const PREFERENCE_SCORES: Record<string, number> = {
  lowest: -5,
  balanced: 5,
  maximum: 15,
};

// Max possible raw score: 55 + 45 + 35 + 14 (7 concerns × 2) + 30 + 15 + 15 = 209
const MAX_RAW = 209;

export function calculateRiskScore(answers: SurveyAnswers): number {
  let raw = 0;
  raw += HOME_AGE_SCORES[answers.homeAge ?? 'notSure'] ?? 20;
  raw += SYSTEM_AGE_SCORES[answers.hvacAge ?? 'notSure'] ?? 20;
  raw += WATER_HEATER_SCORES[answers.waterHeaterAge ?? 'notSure'] ?? 15;
  raw += Math.min((answers.topConcerns?.length ?? 0) * 2, 14);
  raw += APPLIANCE_SCORES[answers.olderApplianceCount ?? 'notSure'] ?? 10;
  if (answers.recentMajorRepair === 'yes') raw += 15;
  raw += PREFERENCE_SCORES[answers.protectionPreference ?? 'balanced'] ?? 5;
  return Math.max(1, Math.min(100, Math.round((Math.max(0, raw) / MAX_RAW) * 99) + 1));
}

export function getRecommendedTier(riskScore: number): RecommendedTier {
  if (riskScore <= 35) return 'good';
  if (riskScore <= 65) return 'better';
  return 'best';
}

// ─── Display labels ──────────────────────────────────────────────────────────

export const HOME_AGE_LABELS: Record<string, string> = {
  under5: 'Less than 5 years',
  '5to10': '5–10 years',
  '11to20': '11–20 years',
  '21to40': '21–40 years',
  over40: 'More than 40 years',
  notSure: 'Not sure',
};

export const SYSTEM_AGE_LABELS: Record<string, string> = {
  under5: 'Less than 5 years',
  '5to10': '5–10 years',
  '11to15': '11–15 years',
  over15: '15+ years',
  notSure: 'Not sure',
};

export const APPLIANCE_COUNT_LABELS: Record<string, string> = {
  none: 'None',
  '1to2': '1–2',
  '3to4': '3–4',
  over5: '5 or more',
  notSure: 'Not sure',
};

export const CONCERN_LABELS: Record<string, string> = {
  hvac: 'HVAC breakdown',
  plumbing: 'Plumbing repairs',
  electrical: 'Electrical issues',
  waterHeater: 'Water heater failure',
  kitchen: 'Kitchen appliances',
  laundry: 'Laundry appliances',
  unexpected: 'Unexpected repair bills',
  notSure: 'Not sure',
};

export const PREFERENCE_LABELS: Record<string, string> = {
  lowest: 'Lowest monthly cost',
  balanced: 'Balanced protection and price',
  maximum: 'Maximum protection',
};

// ─── Tier content ────────────────────────────────────────────────────────────

export type TierContent = {
  label: string;
  tagline: string;
  description: string;
  features: string[];
};

export const TIER_CONTENT: Record<RecommendedTier, TierContent> = {
  good: {
    label: 'Good',
    tagline: 'Budget-focused protection',
    description:
      'Best for newer homes and homeowners focused on lower monthly costs.',
    features: [
      'Core system and appliance coverage',
      'Lower annual cost relative to other tiers',
      'Suitable for newer construction with younger systems',
      'Good starting point for first-time warranty buyers',
    ],
  },
  better: {
    label: 'Better',
    tagline: 'Balanced protection and price',
    description:
      'Best for homeowners who want stronger protection without paying for every possible add-on.',
    features: [
      'Broader coverage across systems and appliances',
      'Balanced cost relative to protection level',
      'Handles common mid-life system and appliance issues',
      'Suitable for mixed-age systems or recent repair history',
    ],
  },
  best: {
    label: 'Best',
    tagline: 'Maximum protection',
    description:
      'Best for older homes, aging systems, and homeowners who want the broadest protection available.',
    features: [
      'Most comprehensive system and appliance coverage',
      'Higher coverage limits on major repairs',
      'Built for homes with older systems or significant repair history',
      'Reduces exposure to large unexpected repair bills',
    ],
  },
};
