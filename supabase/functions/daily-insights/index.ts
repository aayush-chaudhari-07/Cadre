import { handleCors } from '../_shared/cors.ts';
import { json, error } from '../_shared/http.ts';
import { requireAuth, HttpError } from '../_shared/auth.ts';
import { checkAndConsumeQuota } from '../_shared/quota.ts';
import { generateJson } from '../_shared/gemini.ts';
import { DAILY_INSIGHTS_PROMPT } from '../_shared/prompts.ts';
import {
  dailyInsightsRequestSchema,
  dailyInsightsSchema,
  type DailyInsights,
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

    const parseResult = dailyInsightsRequestSchema.safeParse(rawBody);
    if (!parseResult.success) {
      const msg = parseResult.error.errors.map((e) => e.message).join(' ');
      return error('invalid_input', msg || 'Input validation failed.', 400, req);
    }
    const body = parseResult.data;

    // 2. Authenticate caller & verify workspace membership
    const { user, supabase } = await requireAuth(req, body.orgId);

    // 3. Format current date for single-brief-per-day caching (ISO YYYY-MM-DD)
    const today = new Date().toISOString().split('T')[0];

    // 4. If not forced refresh, check cache in public.insights first
    if (!body.forceRefresh) {
      const { data: cachedRow } = await supabase
        .from('insights')
        .select('*')
        .eq('org_id', body.orgId)
        .eq('for_date', today)
        .maybeSingle();

      if (cachedRow && cachedRow.content) {
        return json(
          {
            ...(cachedRow.content as DailyInsights),
            id: cachedRow.id,
            for_date: cachedRow.for_date,
            cached: true,
          },
          200,
          req,
        );
      }
    }

    // 5. Check and consume daily user quota before calling AI
    await checkAndConsumeQuota(supabase);

    // 6. Gather numerical & high-level telemetry AGGREGATES only (never raw transcripts per PRD 5.10)
    const [leadsRes, dealsRes, accountsRes, competitorsRes, meetingsRes, recentRunsRes] =
      await Promise.all([
        supabase
          .from('leads')
          .select('name, company, score, status, deal_value')
          .eq('org_id', body.orgId)
          .order('score', { ascending: false })
          .limit(10),
        supabase
          .from('deals')
          .select('name, amount, stage, probability')
          .eq('org_id', body.orgId)
          .not('stage', 'in', '("won","lost")')
          .limit(20),
        supabase
          .from('accounts')
          .select('name, mrr, health_score, risk_level, signals')
          .eq('org_id', body.orgId)
          .in('risk_level', ['high', 'critical'])
          .limit(10),
        supabase
          .from('competitors')
          .select('name')
          .eq('org_id', body.orgId)
          .limit(5),
        supabase
          .from('meetings')
          .select('title, held_at, sentiment')
          .eq('org_id', body.orgId)
          .order('held_at', { ascending: false })
          .limit(5),
        supabase
          .from('agent_runs')
          .select('agent_key, action, summary, created_at')
          .eq('org_id', body.orgId)
          .order('created_at', { ascending: false })
          .limit(5),
      ]);

    const leads = leadsRes.data ?? [];
    const deals = dealsRes.data ?? [];
    const atRiskAccounts = accountsRes.data ?? [];
    const competitors = competitorsRes.data ?? [];
    const meetings = meetingsRes.data ?? [];
    const recentRuns = recentRunsRes.data ?? [];

    const totalOpenDeals = deals.reduce((acc, d) => acc + (Number(d.amount) || 0), 0);
    const weightedPipeline = deals.reduce(
      (acc, d) => acc + (Number(d.amount) || 0) * ((Number(d.probability) || 0) / 100),
      0,
    );
    const atRiskMrr = atRiskAccounts.reduce((acc, a) => acc + (Number(a.mrr) || 0), 0);
    const hotLeads = leads.filter((l) => (l.score ?? 0) >= 70);

    const telemetrySummary = `
DATE: ${today}
SALES PIPELINE:
- Total Open Deals: ${deals.length}
- Nominal Pipeline: $${Math.round(totalOpenDeals).toLocaleString()}
- Weighted Forecast: $${Math.round(weightedPipeline).toLocaleString()}

LEAD ACQUISITION:
- Total Leads Active: ${leads.length}
- High-Intent Hot Leads (score >= 70): ${hotLeads.length}
- Notable Prospects: ${leads.slice(0, 3).map((l) => `${l.name} (${l.company || 'Unknown'}, Score: ${l.score ?? 0})`).join(', ') || 'None'}

CHURN & ACCOUNT HEALTH:
- At-Risk Accounts (High/Critical): ${atRiskAccounts.length}
- MRR at Risk: $${Math.round(atRiskMrr).toLocaleString()}
- Vulnerable Accounts: ${atRiskAccounts.slice(0, 3).map((a) => `${a.name} ($${Number(a.mrr || 0).toLocaleString()} MRR, Risk: ${a.risk_level})`).join(', ') || 'None'}

OPERATIONS & COMPETITIVE:
- Recent Meetings Held: ${meetings.length} (${meetings.filter((m) => m.sentiment === 'positive').length} positive)
- Tracked Competitors: ${competitors.map((c) => c.name).join(', ') || 'None'}
- Latest Agent Actions: ${recentRuns.slice(0, 3).map((r) => `[${r.agent_key}] ${r.action}`).join(', ') || 'None'}
    `.trim();

    // 7. Call Gemini with DAILY_INSIGHTS_PROMPT
    const analysis = await generateJson<DailyInsights>({
      system: DAILY_INSIGHTS_PROMPT,
      user: telemetrySummary,
      schema: dailyInsightsSchema,
      temperature: 0.3,
    });

    // 8. Upsert into public.insights for today
    const { data: savedRow, error: upsertError } = await supabase
      .from('insights')
      .upsert(
        {
          org_id: body.orgId,
          for_date: today,
          content: analysis,
        },
        { onConflict: 'org_id,for_date' },
      )
      .select()
      .single();

    if (upsertError) {
      console.warn('[daily-insights] Upsert into insights table warning:', upsertError.message);
    }

    // 9. Record audit run in agent_runs
    await logAgentRun(supabase, {
      orgId: body.orgId,
      agentKey: 'ceo',
      action: 'daily_insights',
      status: 'done',
      summary: `Daily Executive Brief generated for ${today}: "${analysis.headline.slice(0, 60)}"`,
      output: analysis,
      createdBy: user.id,
    });

    return json(
      {
        ...analysis,
        id: savedRow?.id,
        for_date: today,
        cached: false,
      },
      200,
      req,
    );
  } catch (err) {
    if (err instanceof HttpError) {
      return error(err.code, err.message, err.status, req);
    }
    console.error('[daily-insights] Unhandled exception:', err);
    return error('internal_error', 'An unexpected error occurred while generating daily insights.', 500, req);
  }
}
