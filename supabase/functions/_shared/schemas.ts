import { z } from 'zod';

// ============================================================================
// Output Schemas (Enforced per docs/PRD.md Section 7)
// ============================================================================

export const leadAnalysisSchema = z.object({
  score: z.number().int().min(0).max(100),
  intent: z.enum(['high', 'medium', 'low']),
  sentiment: z.enum(['positive', 'neutral', 'negative']).or(z.string()),
  summary: z.string(),
  objections: z.array(z.string()),
  buying_signals: z.array(z.string()),
  close_probability: z.number().int().min(0).max(100),
  next_best_action: z.string(),
  suggested_reply: z.string(),
});
export type LeadAnalysis = z.infer<typeof leadAnalysisSchema>;

export const meetingActionItemSchema = z.object({
  owner: z.string(),
  task: z.string(),
  due: z.string().optional(),
});
export type MeetingActionItem = z.infer<typeof meetingActionItemSchema>;

export const meetingAnalysisSchema = z.object({
  summary: z.string(),
  sentiment: z.enum(['positive', 'neutral', 'negative']),
  key_points: z.array(z.string()),
  action_items: z.array(meetingActionItemSchema),
  objections: z.array(z.string()),
  risks: z.array(z.string()),
  next_steps: z.array(z.string()),
  deal_health: z.number().int().min(0).max(100),
});
export type MeetingAnalysis = z.infer<typeof meetingAnalysisSchema>;

export const retentionPlaySchema = z.object({
  title: z.string(),
  description: z.string(),
  effort: z.enum(['low', 'medium', 'high']),
});
export type RetentionPlay = z.infer<typeof retentionPlaySchema>;

export const churnAnalysisSchema = z.object({
  risk_level: z.enum(['low', 'medium', 'high', 'critical']),
  risk_score: z.number().int().min(0).max(100),
  reasons: z.array(z.string()),
  retention_plays: z.array(retentionPlaySchema),
  suggested_message: z.string(),
});
export type ChurnAnalysis = z.infer<typeof churnAnalysisSchema>;

export const battlecardSchema = z.object({
  win_themes: z.array(z.string()),
  landmines: z.array(z.string()),
  talk_track: z.string(),
});
export type Battlecard = z.infer<typeof battlecardSchema>;

export const competitorScanSchema = z.object({
  positioning: z.string(),
  strengths: z.array(z.string()),
  weaknesses: z.array(z.string()),
  pricing_notes: z.string(),
  recent_signals: z.array(z.string()),
  battlecard: battlecardSchema,
});
export type CompetitorScan = z.infer<typeof competitorScanSchema>;

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

export const dailyInsightsSchema = z.object({
  headline: z.string(),
  highlights: z.array(z.string()),
  risks: z.array(z.string()),
  opportunities: z.array(z.string()),
  recommended_actions: z.array(z.string()),
});
export type DailyInsights = z.infer<typeof dailyInsightsSchema>;

export const forecastNoteSchema = z.object({
  narrative: z.string(),
  risks: z.array(z.string()),
});
export type ForecastNote = z.infer<typeof forecastNoteSchema>;

// ============================================================================
// Request Body Schemas (Enforcing docs/SECURITY.md limits)
// ============================================================================

export const analyzeLeadRequestSchema = z.object({
  orgId: z.string().uuid(),
  leadId: z.string().uuid().optional(),
  channel: z.enum(['email', 'chat', 'call', 'note']).optional().default('note'),
  leadText: z.string().min(1, 'Lead text is required.').max(20000, 'Lead text must not exceed 20,000 characters.'),
  contactName: z.string().max(100).optional(),
  company: z.string().max(100).optional(),
});
export type AnalyzeLeadRequest = z.infer<typeof analyzeLeadRequestSchema>;

export const analyzeMeetingRequestSchema = z.object({
  orgId: z.string().uuid(),
  meetingId: z.string().uuid().optional(),
  title: z.string().min(1).max(200),
  transcript: z.string().min(10, 'Transcript is too short.').max(60000, 'Transcript must not exceed 60,000 characters.'),
  company: z.string().max(100).optional(),
});
export type AnalyzeMeetingRequest = z.infer<typeof analyzeMeetingRequestSchema>;

export const analyzeChurnRequestSchema = z.object({
  orgId: z.string().uuid(),
  accountId: z.string().uuid().optional(),
  accountName: z.string().min(1).max(100),
  mrr: z.number().min(0).default(0),
  signals: z.array(z.string().max(500)).max(20).optional().default([]),
  contextNotes: z.string().max(10000).optional(),
});
export type AnalyzeChurnRequest = z.infer<typeof analyzeChurnRequestSchema>;

export const scanCompetitorRequestSchema = z.object({
  orgId: z.string().uuid(),
  competitorId: z.string().uuid().optional(),
  name: z.string().min(1).max(100),
  url: z.string().url('Invalid website URL.').max(2048, 'URL must not exceed 2,048 characters.'),
});
export type ScanCompetitorRequest = z.infer<typeof scanCompetitorRequestSchema>;

export const explainForecastRequestSchema = z.object({
  orgId: z.string().uuid(),
  quarter: z.string().max(50).default('Current Quarter'),
  target: z.number(),
  weightedTotal: z.number(),
  dealsSummary: z.string().max(10000).optional().default(''),
});
export type ExplainForecastRequest = z.infer<typeof explainForecastRequestSchema>;

export const ceoCommandRequestSchema = z.object({
  orgId: z.string().uuid(),
  command: z.string().min(3, 'Command is too short.').max(2000, 'Command must not exceed 2,000 characters.'),
  context: z.string().max(5000).optional(),
});
export type CeoCommandRequest = z.infer<typeof ceoCommandRequestSchema>;

export const dailyInsightsRequestSchema = z.object({
  orgId: z.string().uuid(),
  forceRefresh: z.boolean().optional().default(false),
});
export type DailyInsightsRequest = z.infer<typeof dailyInsightsRequestSchema>;

