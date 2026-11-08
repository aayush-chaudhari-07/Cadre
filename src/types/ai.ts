/**
 * AI Module Type Definitions per docs/PRD.md Section 7 & docs/SECURITY.md
 */

export interface LeadAnalysis {
  score: number;
  intent: 'high' | 'medium' | 'low';
  sentiment: string;
  summary: string;
  objections: string[];
  buying_signals: string[];
  close_probability: number;
  next_best_action: string;
  suggested_reply: string;
}

export interface AnalyzeLeadRequest {
  orgId: string;
  leadId?: string;
  leadText: string;
  contactName?: string;
  company?: string;
}

export interface MeetingActionItem {
  owner: string;
  task: string;
  due?: string;
}

export interface MeetingAnalysis {
  summary: string;
  sentiment: 'positive' | 'neutral' | 'negative';
  key_points: string[];
  action_items: MeetingActionItem[];
  objections: string[];
  risks: string[];
  next_steps: string[];
  deal_health: number;
}

export interface AnalyzeMeetingRequest {
  orgId: string;
  meetingId?: string;
  title: string;
  transcript: string;
  company?: string;
}

export interface RetentionPlay {
  title: string;
  description: string;
  effort: 'low' | 'medium' | 'high';
}

export interface ChurnAnalysis {
  risk_level: 'low' | 'medium' | 'high' | 'critical';
  risk_score: number;
  reasons: string[];
  retention_plays: RetentionPlay[];
  suggested_message: string;
}

export interface AnalyzeChurnRequest {
  orgId: string;
  accountId?: string;
  accountName: string;
  mrr: number;
  signals?: string[];
  contextNotes?: string;
}

export interface Battlecard {
  win_themes: string[];
  landmines: string[];
  talk_track: string;
}

export interface CompetitorScan {
  positioning: string;
  strengths: string[];
  weaknesses: string[];
  pricing_notes: string;
  recent_signals: string[];
  battlecard: Battlecard;
}

export interface ScanCompetitorRequest {
  orgId: string;
  competitorId?: string;
  name: string;
  url: string;
}

export interface ForecastNote {
  narrative: string;
  risks: string[];
}

export interface ExplainForecastRequest {
  orgId: string;
  quarter: string;
  target: number;
  weightedTotal: number;
  dealsSummary?: string;
}

export interface CeoPlanAction {
  agent: string;
  task: string;
  expected_impact: string;
}

export interface CeoPlanPhase {
  name: string;
  duration: string;
  actions: CeoPlanAction[];
}

export interface CeoPlan {
  goal: string;
  summary: string;
  phases: CeoPlanPhase[];
  kpis: string[];
  risks: string[];
}

export interface CeoCommandRequest {
  orgId: string;
  command: string;
  context?: string;
}

export interface DailyInsights {
  headline: string;
  highlights: string[];
  risks: string[];
  opportunities: string[];
  recommended_actions: string[];
}

export interface DailyInsightsRequest {
  orgId: string;
  forceRefresh?: boolean;
}
