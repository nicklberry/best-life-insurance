export type SurveyAnswers = {
  ageRange?: string;
  maritalStatus?: string;
  numberOfChildren?: string;
  homeownerStatus?: string;
  annualIncome?: string;
  existingLifeInsurance?: string;
};

export type RecommendationLevel = 'basic' | 'recommended' | 'enhanced';

export type SurveyResult = SurveyAnswers & {
  protectionGapScore: number;
  recommendationLevel: RecommendationLevel;
  completedAt: string;
};

// ─── Score tables ─────────────────────────────────────────────────────────────

const AGE_SCORES: Record<string, number> = {
  '18-24': 10,
  '25-34': 20,
  '35-44': 30,
  '45-54': 35,
  '55-64': 25,
  '65+': 15,
};

const MARITAL_SCORES: Record<string, number> = {
  Married: 20,
  Single: 5,
  Divorced: 10,
  Widowed: 8,
};

const CHILDREN_SCORES: Record<string, number> = {
  '0': 0,
  '1': 15,
  '2': 22,
  '3': 28,
  '4+': 32,
};

const HOMEOWNER_SCORES: Record<string, number> = {
  Yes: 15,
  No: 5,
  'Not Sure': 8,
};

const INCOME_SCORES: Record<string, number> = {
  'Under $30,000': 10,
  '$30,000–$59,999': 15,
  '$60,000–$99,999': 20,
  '$100,000–$149,999': 22,
  '$150,000+': 25,
};

const EXISTING_COVERAGE_SCORES: Record<string, number> = {
  Yes: -20,
  No: 20,
  'Not Sure': 10,
};

// Max possible raw score: 35 + 20 + 32 + 15 + 25 + 20 = 147
const MAX_RAW = 147;

export function calculateProtectionGapScore(answers: SurveyAnswers): number {
  let raw = 0;
  raw += AGE_SCORES[answers.ageRange ?? '35-44'] ?? 20;
  raw += MARITAL_SCORES[answers.maritalStatus ?? 'Single'] ?? 10;
  raw += CHILDREN_SCORES[answers.numberOfChildren ?? '0'] ?? 0;
  raw += HOMEOWNER_SCORES[answers.homeownerStatus ?? 'Not Sure'] ?? 8;
  raw += INCOME_SCORES[answers.annualIncome ?? '$60,000–$99,999'] ?? 15;
  raw += EXISTING_COVERAGE_SCORES[answers.existingLifeInsurance ?? 'Not Sure'] ?? 10;
  return Math.max(1, Math.min(100, Math.round((Math.max(0, raw) / MAX_RAW) * 99) + 1));
}

export function getRecommendationLevel(score: number): RecommendationLevel {
  if (score <= 35) return 'basic';
  if (score <= 65) return 'recommended';
  return 'enhanced';
}

// ─── Display labels ───────────────────────────────────────────────────────────

export const AGE_RANGE_LABELS: Record<string, string> = {
  '18-24': '18–24',
  '25-34': '25–34',
  '35-44': '35–44',
  '45-54': '45–54',
  '55-64': '55–64',
  '65+': '65 or older',
};

export const MARITAL_STATUS_LABELS: Record<string, string> = {
  Married: 'Married',
  Single: 'Single',
  Divorced: 'Divorced',
  Widowed: 'Widowed',
};

export const CHILDREN_LABELS: Record<string, string> = {
  '0': 'No children',
  '1': '1 child',
  '2': '2 children',
  '3': '3 children',
  '4+': '4 or more children',
};

export const INCOME_LABELS: Record<string, string> = {
  'Under $30,000': 'Under $30,000',
  '$30,000–$59,999': '$30,000–$59,999',
  '$60,000–$99,999': '$60,000–$99,999',
  '$100,000–$149,999': '$100,000–$149,999',
  '$150,000+': '$150,000 or more',
};

// ─── Recommendation level content ────────────────────────────────────────────

export type LevelContent = {
  label: string;
  tagline: string;
  description: string;
  features: string[];
};

export const LEVEL_CONTENT: Record<RecommendationLevel, LevelContent> = {
  basic: {
    label: 'Basic',
    tagline: 'Foundational coverage',
    description:
      'A starting point for individuals with fewer dependents or existing coverage already in place.',
    features: [
      'Term life coverage for income replacement',
      'Lower premium cost relative to other options',
      'Good starting point for younger or single individuals',
      'Helps ensure final expenses are covered',
    ],
  },
  recommended: {
    label: 'Recommended',
    tagline: 'Balanced family protection',
    description:
      'Designed for households with dependents, income to protect, and financial obligations to consider.',
    features: [
      'Broader coverage for income and debt obligations',
      'Sized to support dependents through key milestones',
      'May include living benefits depending on policy type',
      'Appropriate for growing families and homeowners',
    ],
  },
  enhanced: {
    label: 'Enhanced',
    tagline: 'Comprehensive household protection',
    description:
      'For households with significant financial responsibilities, multiple dependents, or long-term wealth planning needs.',
    features: [
      'Higher benefit amounts for full income replacement',
      'Covers mortgage, debt, education, and income gaps',
      'May include permanent coverage components',
      'Built for households with complex protection needs',
    ],
  },
};
