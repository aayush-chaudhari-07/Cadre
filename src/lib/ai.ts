import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/features/auth';
import type {
  LeadAnalysis,
  AnalyzeLeadRequest,
  MeetingAnalysis,
  AnalyzeMeetingRequest,
  ChurnAnalysis,
  AnalyzeChurnRequest,
  CompetitorScan,
  ScanCompetitorRequest,
  ForecastNote,
  ExplainForecastRequest,
  CeoPlan,
  CeoCommandRequest,
  DailyInsights,
  DailyInsightsRequest,
} from '@/types/ai';

// Export output and request types for client features
export type {
  LeadAnalysis,
  AnalyzeLeadRequest,
  MeetingAnalysis,
  AnalyzeMeetingRequest,
  ChurnAnalysis,
  AnalyzeChurnRequest,
  CompetitorScan,
  ScanCompetitorRequest,
  ForecastNote,
  ExplainForecastRequest,
  CeoPlan,
  CeoCommandRequest,
  DailyInsights,
  DailyInsightsRequest,
};

export class AiError extends Error {
  constructor(
    public readonly code: string,
    message: string,
    public readonly status?: number,
  ) {
    super(message);
    this.name = 'AiError';
  }
}

export const ERROR_MESSAGES: Record<string, string> = {
  unauthorized: 'Please sign in to run AI analyses.',
  forbidden: 'You do not have permission to execute analyses in this workspace.',
  invalid_input: 'The input provided was invalid or exceeded maximum allowed length.',
  quota_exceeded: 'You have reached your daily limit of 40 AI analyses. Quota resets daily at midnight UTC.',
  bad_model_output: 'The AI model generated an invalid response structure. Please try again.',
  upstream_unavailable: 'The AI service is temporarily unavailable or overloaded. Please try again shortly.',
  blocked_url: 'The competitor website URL is restricted, invalid, or could not be reached safely.',
  internal_error: 'An internal server error occurred while executing the AI agent.',
};

/**
 * Generic invoke wrapper that unwraps { error: { code, message } } and throws a friendly AiError.
 */
async function invokeAiFunction<TReq extends object, TRes>(
  functionName: string,
  body: TReq,
): Promise<TRes> {
  const { data, error } = await supabase.functions.invoke<TRes | { error: { code: string; message: string } }>(
    functionName,
    { body: body as Record<string, unknown> },
  );

  if (error) {
    // Attempt to extract structured error response if available from context
    let parsedCode = 'upstream_unavailable';
    let rawMessage = error.message;

    // Check if error context body is available
    const errorContext = (error as unknown as { context?: { json?: () => Promise<{ error?: { code?: string; message?: string } }> } }).context;
    if (errorContext && typeof errorContext.json === 'function') {
      try {
        const errJson = await errorContext.json();
        if (errJson?.error?.code) {
          parsedCode = errJson.error.code;
          rawMessage = errJson.error.message || rawMessage;
        }
      } catch {
        // Ignore JSON extraction failure and use default error message
      }
    }

    const friendlyMessage = ERROR_MESSAGES[parsedCode] || rawMessage || 'AI analysis request failed.';
    throw new AiError(parsedCode, friendlyMessage);
  }

  // Check if response body itself carries an error shape
  if (data && typeof data === 'object' && 'error' in data) {
    const errObj = (data as { error: { code?: string; message?: string } }).error;
    const code = errObj?.code || 'internal_error';
    const msg = ERROR_MESSAGES[code] || errObj?.message || 'AI analysis failed.';
    throw new AiError(code, msg);
  }

  return data as TRes;
}

// ============================================================================
// Typed AI Agent Helpers
// ============================================================================

/**
 * Analyzes an inbound lead email or notes with the AI Sales Manager.
 */
export async function analyzeLead(params: AnalyzeLeadRequest): Promise<LeadAnalysis> {
  return invokeAiFunction<AnalyzeLeadRequest, LeadAnalysis>('analyze-lead', params);
}

/**
 * Analyzes a meeting transcript with the AI Operations Manager.
 */
export async function analyzeMeeting(params: AnalyzeMeetingRequest): Promise<MeetingAnalysis> {
  return invokeAiFunction<AnalyzeMeetingRequest, MeetingAnalysis>('analyze-meeting', params);
}

/**
 * Evaluates account churn signals with the AI Support Manager.
 */
export async function analyzeChurn(params: AnalyzeChurnRequest): Promise<ChurnAnalysis> {
  return invokeAiFunction<AnalyzeChurnRequest, ChurnAnalysis>('analyze-churn', params);
}

/**
 * Scrapes and analyzes a competitor website with the AI Marketing Manager.
 */
export async function scanCompetitor(params: ScanCompetitorRequest): Promise<CompetitorScan> {
  return invokeAiFunction<ScanCompetitorRequest, CompetitorScan>('scan-competitor', params);
}

/**
 * Explains pipeline forecast variance with the AI Finance Director.
 */
export async function explainForecast(params: ExplainForecastRequest): Promise<ForecastNote> {
  return invokeAiFunction<ExplainForecastRequest, ForecastNote>('explain-forecast', params);
}

/**
 * Translates strategic founder directives into cross-agent growth plans with the AI CEO.
 */
export async function askCeo(params: CeoCommandRequest): Promise<CeoPlan> {
  return invokeAiFunction<CeoCommandRequest, CeoPlan>('ceo-command', params);
}

/**
 * Generates or regenerates daily executive intelligence with the AI CEO.
 */
export async function generateInsights(params: DailyInsightsRequest): Promise<DailyInsights> {
  return invokeAiFunction<DailyInsightsRequest, DailyInsights>('daily-insights', params);
}

// ============================================================================
// useAiUsage Hook
// ============================================================================

export interface AiUsageState {
  callsToday: number;
  limit: number;
  remaining: number;
  isLoading: boolean;
  refetch: () => Promise<void>;
}

export function useAiUsage(): AiUsageState {
  const { user } = useAuth();
  const [callsToday, setCallsToday] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const limit = 40;

  const fetchUsage = useCallback(async () => {
    if (!user) {
      setCallsToday(0);
      setIsLoading(false);
      return;
    }

    try {
      const today = new Date().toISOString().slice(0, 10);
      const { data, error } = await supabase
        .from('ai_usage')
        .select('calls')
        .eq('user_id', user.id)
        .eq('usage_date', today)
        .maybeSingle();

      if (!error && data) {
        setCallsToday(data.calls || 0);
      } else {
        setCallsToday(0);
      }
    } catch {
      setCallsToday(0);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchUsage();
  }, [fetchUsage]);

  return {
    callsToday,
    limit,
    remaining: Math.max(0, limit - callsToday),
    isLoading,
    refetch: fetchUsage,
  };
}
