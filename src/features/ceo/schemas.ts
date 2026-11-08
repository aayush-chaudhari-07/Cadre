import { z } from 'zod';

export const ceoPlanActionSchema = z.object({
  agent: z.string(),
  task: z.string(),
  expected_impact: z.string(),
});
export type CeoPlanAction = z.infer<typeof ceoPlanActionSchema>;

export const ceoPlanPhaseSchema = z.object({
  name: z.string(),
  duration: z.string(),
  actions: z.array(ceoPlanActionSchema),
});
export type CeoPlanPhase = z.infer<typeof ceoPlanPhaseSchema>;

export const ceoPlanSchema = z.object({
  goal: z.string(),
  summary: z.string(),
  phases: z.array(ceoPlanPhaseSchema),
  kpis: z.array(z.string()),
  risks: z.array(z.string()),
});
export type CeoPlan = z.infer<typeof ceoPlanSchema>;

export const ceoCommandFormSchema = z.object({
  command: z
    .string()
    .min(3, 'Strategic directive must be at least 3 characters.')
    .max(2000, 'Strategic directive must not exceed 2,000 characters.'),
  context: z.string().max(5000).optional(),
});
export type CeoCommandFormValues = z.infer<typeof ceoCommandFormSchema>;

export const VALID_CANONICAL_AGENTS = [
  'ceo',
  'sales',
  'operations',
  'support',
  'marketing',
  'finance',
] as const;

export type CanonicalAgent = typeof VALID_CANONICAL_AGENTS[number];

/**
 * Normalizes an arbitrary agent name string into one of the 6 canonical agent keys.
 */
export function normalizeAgentKey(raw?: string | null): CanonicalAgent {
  if (!raw) return 'ceo';
  const lower = raw.toLowerCase().trim();

  if (VALID_CANONICAL_AGENTS.includes(lower as CanonicalAgent)) {
    return lower as CanonicalAgent;
  }

  if (lower.includes('sale') || lower.includes('lead') || lower.includes('deal') || lower.includes('pipeline')) {
    return 'sales';
  }
  if (lower.includes('operat') || lower.includes('meet') || lower.includes('task') || lower.includes('action')) {
    return 'operations';
  }
  if (
    lower.includes('support') ||
    lower.includes('churn') ||
    lower.includes('retention') ||
    lower.includes('account') ||
    lower.includes('success') ||
    lower.includes('cs') ||
    lower.includes('health')
  ) {
    return 'support';
  }
  if (
    lower.includes('market') ||
    lower.includes('competit') ||
    lower.includes('battle') ||
    lower.includes('position') ||
    lower.includes('brand')
  ) {
    return 'marketing';
  }
  if (
    lower.includes('financ') ||
    lower.includes('revenue') ||
    lower.includes('forecast') ||
    lower.includes('cfo') ||
    lower.includes('mrr') ||
    lower.includes('metric')
  ) {
    return 'finance';
  }
  if (lower.includes('ceo') || lower.includes('exec') || lower.includes('founder') || lower.includes('strateg')) {
    return 'ceo';
  }

  return 'ceo';
}

