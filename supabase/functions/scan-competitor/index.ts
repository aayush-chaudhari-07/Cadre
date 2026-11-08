import { handleCors } from '../_shared/cors.ts';
import { json, error } from '../_shared/http.ts';
import { requireAuth, HttpError } from '../_shared/auth.ts';
import { checkAndConsumeQuota } from '../_shared/quota.ts';
import { generateJson } from '../_shared/gemini.ts';
import { COMPETITOR_SCAN_PROMPT } from '../_shared/prompts.ts';
import {
  scanCompetitorRequestSchema,
  competitorScanSchema,
  type CompetitorScan,
} from '../_shared/schemas.ts';
import { fetchPublicPage } from '../_shared/safe-url.ts';
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

    const parseResult = scanCompetitorRequestSchema.safeParse(rawBody);
    if (!parseResult.success) {
      const msg = parseResult.error.errors.map((e) => e.message).join(' ');
      return error('invalid_input', msg || 'Input validation failed.', 400, req);
    }
    const body = parseResult.data;

    // 2. Authenticate caller & verify workspace membership
    const { user, supabase } = await requireAuth(req, body.orgId);

    // 3. Respect agent's enabled flag (Marketing agent)
    const { data: agent } = await supabase
      .from('agents')
      .select('enabled')
      .eq('org_id', body.orgId)
      .eq('key', 'marketing')
      .maybeSingle();

    if (agent && agent.enabled === false) {
      return error('forbidden', 'The AI Marketing agent is currently disabled in your workspace settings.', 403, req);
    }

    // 4. Verify & consume daily user quota
    await checkAndConsumeQuota(supabase);

    // 5. Fetch public page content with SSRF protection
    let pageContent: { text: string; finalUrl: string };
    try {
      pageContent = await fetchPublicPage(body.url);
    } catch (err) {
      if (err instanceof HttpError) {
        return error(err.code, err.message, err.status, req);
      }
      return error('blocked_url', `Could not securely fetch competitor website: ${(err as Error).message}`, 400, req);
    }

    if (!pageContent.text || pageContent.text.length < 20) {
      return error('blocked_url', 'Competitor website returned insufficient visible text for analysis.', 400, req);
    }

    // 6. Construct prompt for Gemini
    const userPrompt = `
COMPETITOR NAME: ${body.name}
TARGET WEBSITE: ${body.url} (Resolved: ${pageContent.finalUrl})

EXTRACTED PUBLIC WEBSITE TEXT:
${pageContent.text}
    `.trim();

    // 7. Call Gemini reasoning engine
    const analysis = await generateJson<CompetitorScan>({
      system: COMPETITOR_SCAN_PROMPT,
      user: userPrompt,
      schema: competitorScanSchema,
      temperature: 0.3,
    });

    // 8. If competitorId provided, update competitor record
    if (body.competitorId) {
      const { error: updateError } = await supabase
        .from('competitors')
        .update({
          analysis,
          last_scanned_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq('id', body.competitorId)
        .eq('org_id', body.orgId);

      if (updateError) {
        console.warn('[scan-competitor] Failed to update competitor row:', updateError.message);
      }
    }

    // 9. Log run in agent_runs table for Marketing agent
    await logAgentRun(supabase, {
      orgId: body.orgId,
      agentKey: 'marketing',
      action: 'scan_competitor',
      status: 'done',
      summary: `Scanned competitor "${body.name}" (${body.url})`,
      output: analysis,
      createdBy: user.id,
    });

    return json(analysis, 200, req);
  } catch (err) {
    if (err instanceof HttpError) {
      return error(err.code, err.message, err.status, req);
    }
    console.error('[scan-competitor] Unhandled exception:', err);
    return error('internal_error', 'An unexpected error occurred while scanning the competitor.', 500, req);
  }
}
