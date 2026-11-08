import { handleCors } from '../_shared/cors.ts';
import { json, error } from '../_shared/http.ts';
import { requireAuth, HttpError } from '../_shared/auth.ts';
import { checkAndConsumeQuota } from '../_shared/quota.ts';
import { generateJson } from '../_shared/gemini.ts';
import { CEO_COMMAND_PROMPT } from '../_shared/prompts.ts';
import {
  ceoCommandRequestSchema,
  ceoPlanSchema,
  type CeoPlan,
} from '../_shared/schemas.ts';
import { logAgentRun } from '../_shared/run-log.ts';

const deno = (globalThis as unknown as { Deno?: { serve(handler: (req: Request) => Promise<Response>): void } }).Deno;

if (deno && typeof deno.serve === 'function') {
  deno.serve(handler);
}

const VALID_AGENTS = new Set(['ceo', 'sales', 'operations', 'support', 'marketing', 'finance']);

/**
 * Normalizes an agent name string into one of the 6 canonical agent keys.
 */
export function mapAgentKey(raw: string): string {
  if (!raw) return 'ceo';
  const lower = raw.toLowerCase().trim();
  if (VALID_AGENTS.has(lower)) return lower;

  if (lower.includes('sale') || lower.includes('lead') || lower.includes('deal') || lower.includes('pipeline')) {
    return 'sales';
  }
  if (lower.includes('operat') || lower.includes('meet') || lower.includes('task') || lower.includes('action')) {
    return 'operations';
  }
  if (
    lower.includes('support') ||
    lower.includes('churn') ||
    lower.includes('retention') ||
    lower.includes('account') ||
    lower.includes('success') ||
    lower.includes('cs') ||
    lower.includes('health')
  ) {
    return 'support';
  }
  if (
    lower.includes('market') ||
    lower.includes('competit') ||
    lower.includes('battle') ||
    lower.includes('position') ||
    lower.includes('brand')
  ) {
    return 'marketing';
  }
  if (
    lower.includes('financ') ||
    lower.includes('revenue') ||
    lower.includes('forecast') ||
    lower.includes('cfo') ||
    lower.includes('mrr') ||
    lower.includes('metric')
  ) {
    return 'finance';
  }
  if (lower.includes('ceo') || lower.includes('exec') || lower.includes('founder') || lower.includes('strateg')) {
    return 'ceo';
  }

  return 'ceo';
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

    const parseResult = ceoCommandRequestSchema.safeParse(rawBody);
    if (!parseResult.success) {
      const msg = parseResult.error.errors.map((e) => e.message).join(' ');
      return error('invalid_input', msg || 'Input validation failed.', 400, req);
    }
    const body = parseResult.data;

    // 2. Authenticate caller & verify workspace membership
    const { user, supabase } = await requireAuth(req, body.orgId);

    // 3. Respect agent's enabled flag (CEO agent)
    const { data: agent } = await supabase
      .from('agents')
      .select('enabled')
      .eq('org_id', body.orgId)
      .eq('key', 'ceo')
      .maybeSingle();

    if (agent && agent.enabled === false) {
      return error('forbidden', 'The AI CEO agent is currently disabled in your workspace settings.', 403, req);
    }

    // 4. Verify & consume daily user quota
    await checkAndConsumeQuota(supabase);

    // 5. Build compact workspace summary from caller's org only
    const [leadsRes, dealsRes, accountsRes, competitorsRes, recentRunsRes] = await Promise.all([
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
    const recentRuns = recentRunsRes.data ?? [];

    const totalOpenDeals = deals.reduce((acc, d) => acc + (Number(d.amount) || 0), 0);
    const weightedPipeline = deals.reduce(
      (acc, d) => acc + (Number(d.amount) || 0) * ((Number(d.probability) || 0) / 100),
      0,
    );
    const atRiskMrr = atRiskAccounts.reduce((acc, a) => acc + (Number(a.mrr) || 0), 0);
    const hotLeads = leads.filter((l) => (l.score ?? 0) >= 70);

    const topLeadsText = leads
      .slice(0, 3)
      .map((l) => `${l.name} (${l.company || 'Unknown'}, Score: ${l.score ?? 0}, $${Number(l.deal_value || 0).toLocaleString()})`)
      .join('; ') || 'None';

    const topRiskText = atRiskAccounts
      .slice(0, 3)
      .map((a) => `${a.name} ($${Number(a.mrr || 0).toLocaleString()} MRR, Risk: ${a.risk_level})`)
      .join('; ') || 'None';

    const competitorNames = competitors.map((c) => c.name).join(', ') || 'None tracked';
    const recentActionsText = recentRuns
      .slice(0, 3)
      .map((r) => `[${r.agent_key}] ${r.action}: ${r.summary || 'Completed'}`)
      .join('; ') || 'None';

    const workspaceSummary = `
- Leads: ${leads.length} recorded (${hotLeads.length} hot with score >= 70). Top: ${topLeadsText}.
- Pipeline: ${deals.length} open deals totaling $${Math.round(totalOpenDeals).toLocaleString()} ($${Math.round(weightedPipeline).toLocaleString()} weighted).
- Churn Risk: ${atRiskAccounts.length} accounts at high/critical risk totaling $${Math.round(atRiskMrr).toLocaleString()} MRR. Top: ${topRiskText}.
- Competitors: ${competitorNames}.
- Recent Activity: ${recentActionsText}.
    `.trim();

    // 6. Construct prompt for Gemini
    const userPrompt = `
STRATEGIC COMMAND / DIRECTIVE FROM FOUNDER:
"${body.command}"

${body.context ? `ADDITIONAL STRATEGIC CONTEXT:\n${body.context}\n` : ''}
CURRENT WORKSPACE METRICS & INTELLIGENCE:
${workspaceSummary}

EXECUTION MANDATE:
Break this goal down into realistic phases and tactical actions.
Assign every action strictly to one of our 6 agents: 'ceo', 'sales', 'operations', 'support', 'marketing', 'finance'.
Define concrete, measurable success KPIs and surface primary execution risks.
    `.trim();

    // 7. Call Gemini with CEO_COMMAND_PROMPT and temperature 0.6
    const plan = await generateJson<CeoPlan>({
      system: CEO_COMMAND_PROMPT,
      user: userPrompt,
      schema: ceoPlanSchema,
      temperature: 0.6,
    });

    // 8. Validate & normalize that every action's agent is one of our 6 valid keys
    const validatedPhases = plan.phases.map((phase) => ({
      ...phase,
      actions: phase.actions.map((act) => ({
        ...act,
        agent: mapAgentKey(act.agent),
      })),
    }));

    const validatedPlan: CeoPlan = {
      ...plan,
      phases: validatedPhases,
    };

    // 9. Save plan to public.ceo_plans
    const { data: savedPlan, error: insertError } = await supabase
      .from('ceo_plans')
      .insert({
        org_id: body.orgId,
        command: body.command,
        plan: validatedPlan,
        status: 'draft',
      })
      .select()
      .single();

    if (insertError) {
      console.error('[ceo-command] Failed to save plan in ceo_plans:', insertError.message);
      return error('internal_error', 'Failed to save generated CEO plan.', 500, req);
    }

    // 10. Log run in agent_runs table for CEO agent
    await logAgentRun(supabase, {
      orgId: body.orgId,
      agentKey: 'ceo',
      action: 'ceo_command',
      status: 'done',
      summary: `Strategic Directive: "${body.command.slice(0, 60)}${body.command.length > 60 ? '...' : ''}" -> Generated plan with ${validatedPlan.phases.length} phases.`,
      output: validatedPlan,
      createdBy: user.id,
    });

    return json(
      {
        ...validatedPlan,
        id: savedPlan.id,
        status: savedPlan.status,
        created_at: savedPlan.created_at,
      },
      200,
      req,
    );
  } catch (err) {
    if (err instanceof HttpError) {
      return error(err.code, err.message, err.status, req);
    }
    console.error('[ceo-command] Unhandled exception:', err);
    return error('internal_error', 'An unexpected error occurred while executing the CEO command.', 500, req);
  }
}
