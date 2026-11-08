import { handleCors } from '../_shared/cors.ts';
import { json, error } from '../_shared/http.ts';
import { requireAuth, HttpError } from '../_shared/auth.ts';
import { checkAndConsumeQuota } from '../_shared/quota.ts';
import { generateJson } from '../_shared/gemini.ts';
import { FORECAST_EXPLAIN_PROMPT } from '../_shared/prompts.ts';
import {
  explainForecastRequestSchema,
  forecastNoteSchema,
  type ForecastNote,
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

    const parseResult = explainForecastRequestSchema.safeParse(rawBody);
    if (!parseResult.success) {
      const msg = parseResult.error.errors.map((e) => e.message).join(' ');
      return error('invalid_input', msg || 'Input validation failed.', 400, req);
    }
    const body = parseResult.data;

    // 2. Authenticate caller & verify workspace membership
    const { user, supabase } = await requireAuth(req, body.orgId);

    // 3. Respect agent's enabled flag (Finance agent)
    const { data: agent } = await supabase
      .from('agents')
      .select('enabled')
      .eq('org_id', body.orgId)
      .eq('key', 'finance')
      .maybeSingle();

    if (agent && agent.enabled === false) {
      return error('forbidden', 'The AI Finance Director is currently disabled in your workspace settings.', 403, req);
    }

    // 4. Verify & consume daily user quota
    await checkAndConsumeQuota(supabase);

    // 5. Construct sanitized prompt for Gemini
    const userPrompt = `
REPORTING PERIOD: ${body.quarter || 'Current Quarter'}
REVENUE TARGET: $${body.target.toLocaleString()}
EXPECTED WEIGHTED PIPELINE: $${body.weightedTotal.toLocaleString()}

DEALS BREAKDOWN & STAGE SUMMARY:
${body.dealsSummary || 'No individual deal summary supplied.'}
    `.trim();

    // 6. Call Gemini reasoning engine
    const analysis = await generateJson<ForecastNote>({
      system: FORECAST_EXPLAIN_PROMPT,
      user: userPrompt,
      schema: forecastNoteSchema,
      temperature: 0.2,
    });

    // 7. Log run in agent_runs table for Finance agent
    await logAgentRun(supabase, {
      orgId: body.orgId,
      agentKey: 'finance',
      action: 'explain_forecast',
      status: 'done',
      summary: `Forecast explained for ${body.quarter}: Target $${body.target.toLocaleString()} vs Weighted $${body.weightedTotal.toLocaleString()}`,
      output: analysis,
      createdBy: user.id,
    });

    return json(analysis, 200, req);
  } catch (err) {
    if (err instanceof HttpError) {
      return error(err.code, err.message, err.status, req);
    }
    console.error('[explain-forecast] Unhandled exception:', err);
    return error('internal_error', 'An unexpected error occurred while explaining the revenue forecast.', 500, req);
  }
}
