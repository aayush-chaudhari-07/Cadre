import { handleCors } from '../_shared/cors.ts';
import { json, error } from '../_shared/http.ts';
import { requireAuth, HttpError } from '../_shared/auth.ts';
import { checkAndConsumeQuota } from '../_shared/quota.ts';
import { generateJson } from '../_shared/gemini.ts';
import { CHURN_ANALYSIS_PROMPT } from '../_shared/prompts.ts';
import {
  analyzeChurnRequestSchema,
  churnAnalysisSchema,
  type ChurnAnalysis,
} from '../_shared/schemas.ts';
import { logAgentRun } from '../_shared/run-log.ts';

const deno = (globalThis as unknown as { Deno?: { serve(handler: (req: Request) => Promise<Response>): void } }).Deno;

if (deno && typeof deno.serve === 'function') {
  deno.serve(handler);
}

export async function handler(req: Request): Promise<Response> {
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;

  if (req.method !== 'POST') {
    return error('invalid_input', 'Method not allowed. Only POST is accepted.', 405, req);
  }

  try {
    // 1. Validate request body
    let rawBody: unknown;
    try {
      rawBody = await req.json();
    } catch {
      return error('invalid_input', 'Invalid JSON payload.', 400, req);
    }

    const parseResult = analyzeChurnRequestSchema.safeParse(rawBody);
    if (!parseResult.success) {
      const msg = parseResult.error.errors.map((e) => e.message).join(' ');
      return error('invalid_input', msg || 'Input validation failed.', 400, req);
    }
    const body = parseResult.data;

    // 2. Authenticate caller & verify workspace membership
    const { user, supabase } = await requireAuth(req, body.orgId);

    // 3. Respect agent's enabled flag (Support agent)
    const { data: agent } = await supabase
      .from('agents')
      .select('enabled')
      .eq('org_id', body.orgId)
      .eq('key', 'support')
      .maybeSingle();

    if (agent && agent.enabled === false) {
      return error('forbidden', 'The AI Support agent is currently disabled in your workspace settings.', 403, req);
    }

    // 4. Check & consume daily user quota
    await checkAndConsumeQuota(supabase);

    // 5. Construct prompt for Gemini
    const signalsList = body.signals && body.signals.length > 0
      ? body.signals.map((s) => `- ${s}`).join('\n')
      : 'None explicitly recorded';

    const userPrompt = `
ACCOUNT NAME: ${body.accountName}
MONTHLY RECURRING REVENUE (MRR): $${body.mrr}

ACTIVE CHURN / DISSATISFACTION SIGNALS:
${signalsList}

ACCOUNT NOTES & RECENT CONTEXT:
${body.contextNotes || 'No additional account notes provided.'}
    `.trim();

    // 6. Call Gemini reasoning engine
    const analysis = await generateJson<ChurnAnalysis>({
      system: CHURN_ANALYSIS_PROMPT,
      user: userPrompt,
      schema: churnAnalysisSchema,
      temperature: 0.3,
    });

    // 7. If accountId provided, update account row
    if (body.accountId) {
      const healthScore = Math.max(0, Math.min(100, 100 - analysis.risk_score));

      const { error: updateError } = await supabase
        .from('accounts')
        .update({
          risk_level: analysis.risk_level,
          health_score: healthScore,
          last_analysis: analysis,
          updated_at: new Date().toISOString(),
        })
        .eq('id', body.accountId)
        .eq('org_id', body.orgId);

      if (updateError) {
        console.warn('[analyze-churn] Failed to update account row:', updateError.message);
      }
    }

    // 8. Log run in agent_runs table for Support agent
    await logAgentRun(supabase, {
      orgId: body.orgId,
      agentKey: 'support',
      action: 'analyze_churn',
      status: 'done',
      summary: `Evaluated ${body.accountName} risk: ${analysis.risk_level.toUpperCase()} (${analysis.risk_score}% churn risk)`,
      output: analysis,
      createdBy: user.id,
    });

    return json(analysis, 200, req);
  } catch (err) {
    if (err instanceof HttpError) {
      return error(err.code, err.message, err.status, req);
    }
    console.error('[analyze-churn] Unhandled exception:', err);
    return error('internal_error', 'An unexpected error occurred while analyzing account churn risk.', 500, req);
  }
}
