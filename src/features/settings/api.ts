import { supabase } from '@/lib/supabase';
import type { TablesUpdate } from '@/types/database';

export async function updateProfile(
  userId: string,
  updates: TablesUpdate<'profiles'>,
): Promise<void> {
  const { error } = await supabase
    .from('profiles')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', userId);

  if (error) {
    throw new Error(error.message);
  }
}

export async function updateWorkspaceName(
  orgId: string,
  name: string,
): Promise<void> {
  const { error } = await supabase
    .from('organizations')
    .update({ name })
    .eq('id', orgId);

  if (error) {
    throw new Error(error.message);
  }
}

export interface WorkspaceExportPayload {
  exportedAt: string;
  orgId: string;
  version: string;
  data: {
    organization: unknown;
    leads: unknown[];
    leadInteractions: unknown[];
    deals: unknown[];
    accounts: unknown[];
    meetings: unknown[];
    competitors: unknown[];
    agents: unknown[];
    agentRuns: unknown[];
    ceoPlans: unknown[];
    insights: unknown[];
  };
}

/**
 * Extracts and downloads all workspace data as a structured JSON file.
 */
export async function exportWorkspaceData(
  orgId: string,
  orgName = 'workspace',
): Promise<void> {
  const [
    orgRes,
    leadsRes,
    interactionsRes,
    dealsRes,
    accountsRes,
    meetingsRes,
    competitorsRes,
    agentsRes,
    runsRes,
    plansRes,
    insightsRes,
  ] = await Promise.all([
    supabase.from('organizations').select('*').eq('id', orgId).single(),
    supabase.from('leads').select('*').eq('org_id', orgId),
    supabase.from('lead_interactions').select('*').eq('org_id', orgId),
    supabase.from('deals').select('*').eq('org_id', orgId),
    supabase.from('accounts').select('*').eq('org_id', orgId),
    supabase.from('meetings').select('*').eq('org_id', orgId),
    supabase.from('competitors').select('*').eq('org_id', orgId),
    supabase.from('agents').select('*').eq('org_id', orgId),
    supabase.from('agent_runs').select('*').eq('org_id', orgId),
    supabase.from('ceo_plans').select('*').eq('org_id', orgId),
    supabase.from('insights').select('*').eq('org_id', orgId),
  ]);

  const payload: WorkspaceExportPayload = {
    exportedAt: new Date().toISOString(),
    orgId,
    version: '1.0.0',
    data: {
      organization: orgRes.data ?? null,
      leads: leadsRes.data ?? [],
      leadInteractions: interactionsRes.data ?? [],
      deals: dealsRes.data ?? [],
      accounts: accountsRes.data ?? [],
      meetings: meetingsRes.data ?? [],
      competitors: competitorsRes.data ?? [],
      agents: agentsRes.data ?? [],
      agentRuns: runsRes.data ?? [],
      ceoPlans: plansRes.data ?? [],
      insights: insightsRes.data ?? [],
    },
  };

  const jsonString = JSON.stringify(payload, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const sanitizedName = orgName.toLowerCase().replace(/[^a-z0-9]/g, '-');
  const dateStr = new Date().toISOString().split('T')[0];

  const a = document.createElement('a');
  a.href = url;
  a.download = `cadre-${sanitizedName}-export-${dateStr}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Permanently deletes user account through the delete-account Edge Function.
 */
export async function deleteAccountRequest(confirmation: string): Promise<void> {
  const { data, error } = await supabase.functions.invoke('delete-account', {
    body: { confirmation },
  });

  if (error) {
    let msg = error.message;
    try {
      const errContext = (error as unknown as { context?: Response }).context;
      if (errContext && typeof errContext.json === 'function') {
        const jsonBody = await errContext.json();
        if (jsonBody?.error?.message) {
          msg = jsonBody.error.message;
        }
      }
    } catch {
      // Ignore JSON error parse failure
    }
    throw new Error(msg || 'Failed to delete account.');
  }

  if (data && typeof data === 'object' && 'error' in data) {
    const errObj = (data as { error: { message?: string } }).error;
    throw new Error(errObj?.message || 'Failed to delete account.');
  }
}
