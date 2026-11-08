import { handleCors } from '../_shared/cors.ts';
import { json, error } from '../_shared/http.ts';
import { requireAuth, HttpError } from '../_shared/auth.ts';
import { checkAndConsumeQuota } from '../_shared/quota.ts';
import { generateJson } from '../_shared/gemini.ts';
import { MEETING_ANALYSIS_PROMPT } from '../_shared/prompts.ts';
import {
  analyzeMeetingRequestSchema,
  meetingAnalysisSchema,
  type MeetingAnalysis,
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

    const parseResult = analyzeMeetingRequestSchema.safeParse(rawBody);
    if (!parseResult.success) {
      const msg = parseResult.error.errors.map((e) => e.message).join(' ');
      return error('invalid_input', msg || 'Input validation failed.', 400, req);
    }
    const body = parseResult.data;

    // 2. Authenticate user & verify workspace membership
    const { user, supabase } = await requireAuth(req, body.orgId);

    // 3. Respect agent's enabled flag (Operations agent)
    const { data: agent } = await supabase
      .from('agents')
      .select('enabled')
      .eq('org_id', body.orgId)
      .eq('key', 'operations')
      .maybeSingle();

    if (agent && agent.enabled === false) {
      return error('forbidden', 'The AI Operations agent is currently disabled in your workspace settings.', 403, req);
    }

    // 4. Verify & consume daily user quota
    await checkAndConsumeQuota(supabase);

    // 5. Construct prompt for Gemini
    const userPrompt = `
MEETING TITLE: ${body.title}
COMPANY: ${body.company || 'Not specified'}

RAW MEETING TRANSCRIPT:
${body.transcript}
    `.trim();

    // 6. Call Gemini reasoning engine
    const analysis = await generateJson<MeetingAnalysis>({
      system: MEETING_ANALYSIS_PROMPT,
      user: userPrompt,
      schema: meetingAnalysisSchema,
      temperature: 0.2,
    });

    // 7. If meetingId is provided, persist updates directly to the meetings table
    if (body.meetingId) {
      const { error: updateError } = await supabase
        .from('meetings')
        .update({
          summary: analysis.summary,
          sentiment: analysis.sentiment,
          action_items: analysis.action_items,
          objections: analysis.objections,
          analysis,
        })
        .eq('id', body.meetingId)
        .eq('org_id', body.orgId);

      if (updateError) {
        console.warn('[analyze-meeting] Failed to update meeting row:', updateError.message);
      }
    }

    // 8. Log run in agent_runs table for Operations agent
    await logAgentRun(supabase, {
      orgId: body.orgId,
      agentKey: 'operations',
      action: 'analyze_meeting',
      status: 'done',
      summary: `Analyzed meeting "${body.title}" (Deal Health: ${analysis.deal_health}/100, Sentiment: ${analysis.sentiment})`,
      output: analysis,
      createdBy: user.id,
    });

    return json(analysis, 200, req);
  } catch (err) {
    if (err instanceof HttpError) {
      return error(err.code, err.message, err.status, req);
    }
    console.error('[analyze-meeting] Unhandled exception:', err);
    return error('internal_error', 'An unexpected error occurred while analyzing the meeting transcript.', 500, req);
  }
}
