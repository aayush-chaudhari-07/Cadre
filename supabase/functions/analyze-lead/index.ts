import { handleCors } from '../_shared/cors.ts';
import { json, error } from '../_shared/http.ts';
import { requireAuth, HttpError } from '../_shared/auth.ts';
import { checkAndConsumeQuota } from '../_shared/quota.ts';
import { generateJson } from '../_shared/gemini.ts';
import { LEAD_ANALYSIS_PROMPT } from '../_shared/prompts.ts';
import {
  analyzeLeadRequestSchema,
  leadAnalysisSchema,
  type LeadAnalysis,
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

    const parseResult = analyzeLeadRequestSchema.safeParse(rawBody);
    if (!parseResult.success) {
      const msg = parseResult.error.errors.map((e) => e.message).join(' ');
      return error('invalid_input', msg || 'Input validation failed.', 400, req);
    }
    const body = parseResult.data;

    // 2. Authenticate user & verify workspace membership
    const { user, supabase } = await requireAuth(req, body.orgId);

    // 3. Respect agent's enabled flag
    const { data: agent } = await supabase
      .from('agents')
      .select('enabled')
      .eq('org_id', body.orgId)
      .eq('key', 'sales')
      .maybeSingle();

    if (agent && agent.enabled === false) {
      return error('forbidden', 'The AI Sales agent is currently disabled in your workspace settings.', 403, req);
    }

    // 4. Verify & consume daily user quota
    await checkAndConsumeQuota(supabase);

    // 5. Construct sanitized prompt for Gemini
    const userPrompt = `
LEAD CONTACT: ${body.contactName || 'Not specified'}
COMPANY: ${body.company || 'Not specified'}
CHANNEL: ${body.channel || 'note'}

RAW LEAD COMMUNICATION / CONTENT:
${body.leadText}
    `.trim();

    // 6. Call Gemini reasoning engine
    const analysis = await generateJson<LeadAnalysis>({
      system: LEAD_ANALYSIS_PROMPT,
      user: userPrompt,
      schema: leadAnalysisSchema,
      temperature: 0.3,
    });

    // 7. If leadId provided, persist updates & interaction history
    if (body.leadId) {
      const derivedStatus = analysis.score >= 80 ? 'hot' : analysis.score >= 50 ? 'warm' : 'cold';

      // Update lead metrics
      const { error: updateError } = await supabase
        .from('leads')
        .update({
          score: analysis.score,
          intent: analysis.intent,
          summary: analysis.summary,
          objections: analysis.objections,
          next_action: analysis.next_best_action,
          probability: analysis.close_probability,
          last_contact_at: new Date().toISOString(),
          status: derivedStatus,
        })
        .eq('id', body.leadId)
        .eq('org_id', body.orgId);

      if (updateError) {
        console.warn('[analyze-lead] Failed to update lead row:', updateError.message);
      }

      // Record lead interaction entry
      const { error: interactionError } = await supabase.from('lead_interactions').insert({
        org_id: body.orgId,
        lead_id: body.leadId,
        channel: body.channel || 'note',
        content: body.leadText,
        analysis,
      });

      if (interactionError) {
        console.warn('[analyze-lead] Failed to record lead_interaction:', interactionError.message);
      }
    }

    // 8. Log run in agent_runs table
    await logAgentRun(supabase, {
      orgId: body.orgId,
      agentKey: 'sales',
      action: 'analyze_lead',
      status: 'done',
      summary: `Scored ${body.contactName || body.company || 'lead'}: ${analysis.score}/100 (${analysis.intent} intent)`,
      output: analysis,
      createdBy: user.id,
    });

    return json(analysis, 200, req);
  } catch (err) {
    if (err instanceof HttpError) {
      return error(err.code, err.message, err.status, req);
    }
    console.error('[analyze-lead] Unhandled exception:', err);
    return error('internal_error', 'An unexpected error occurred while analyzing the lead.', 500, req);
  }
}

