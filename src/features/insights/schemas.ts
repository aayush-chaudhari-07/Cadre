import { z } from 'zod';

export const dailyInsightsSchema = z.object({
  headline: z.string(),
  highlights: z.array(z.string()),
  risks: z.array(z.string()),
  opportunities: z.array(z.string()),
  recommended_actions: z.array(z.string()),
});
export type DailyInsights = z.infer<typeof dailyInsightsSchema>;

export const dailyInsightsRequestSchema = z.object({
  orgId: z.string().uuid(),
  forceRefresh: z.boolean().optional().default(false),
});
export type DailyInsightsRequest = z.infer<typeof dailyInsightsRequestSchema>;

/**
 * Maps a recommended action string to the most relevant internal module route.
 */
export function getRelatedModuleForAction(action: string): { label: string; path: string } {
  const lower = action.toLowerCase();
  if (lower.includes('lead') || lower.includes('qualif') || lower.includes('inbound') || lower.includes('prospect')) {
    return { label: 'Open Leads', path: '/app/leads' };
  }
  if (lower.includes('meet') || lower.includes('transcript') || lower.includes('call note')) {
    return { label: 'Open Meetings', path: '/app/meetings' };
  }
  if (lower.includes('churn') || lower.includes('retention') || lower.includes('account') || lower.includes('renewal')) {
    return { label: 'Open Churn Guard', path: '/app/churn' };
  }
  if (lower.includes('competit') || lower.includes('battlecard') || lower.includes('rival') || lower.includes('pricing move')) {
    return { label: 'Open Competitors', path: '/app/competitors' };
  }
  if (lower.includes('forecast') || lower.includes('deal') || lower.includes('pipeline') || lower.includes('quota') || lower.includes('variance')) {
    return { label: 'Open Revenue', path: '/app/revenue' };
  }
  if (lower.includes('agent') || lower.includes('autonomy')) {
    return { label: 'Open Agents', path: '/app/agents' };
  }
  return { label: 'Open AI CEO', path: '/app/ceo' };
}

