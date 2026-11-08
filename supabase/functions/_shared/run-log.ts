import type { SupabaseClient } from '@supabase/supabase-js';

export interface LogAgentRunParams {
  orgId: string;
  agentKey: string;
  action: string;
  status?: 'done' | 'failed';
  summary?: string;
  output?: unknown;
  createdBy?: string;
}

/**
 * Writes an agent execution audit row to the `agent_runs` table.
 * Gracefully logs a warning on failure so primary user responses are never blocked.
 */
export async function logAgentRun(
  supabase: SupabaseClient,
  params: LogAgentRunParams,
): Promise<void> {
  try {
    const { error } = await supabase.from('agent_runs').insert({
      org_id: params.orgId,
      agent_key: params.agentKey,
      action: params.action,
      status: params.status || 'done',
      summary: params.summary || null,
      output: params.output ? (params.output as Record<string, unknown>) : null,
      created_by: params.createdBy || null,
    });

    if (error) {
      console.warn('[run-log] Failed to write agent_runs row:', error.message);
    }
  } catch (err) {
    console.warn('[run-log] Exception while recording agent_run:', (err as Error).message);
  }
}
