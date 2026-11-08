import { supabase } from '@/lib/supabase';
import type { Tables, TablesUpdate } from '@/types/database';

export type AgentRow = Tables<'agents'>;
export type AgentUpdate = TablesUpdate<'agents'>;
export type AgentRunRow = Tables<'agent_runs'>;

export const CANONICAL_AGENT_KEYS = [
  'ceo',
  'sales',
  'operations',
  'support',
  'marketing',
  'finance',
] as const;

export type CanonicalAgentKey = typeof CANONICAL_AGENT_KEYS[number];

export interface AgentRunStats {
  totalRuns: number;
  lastRunAt: string | null;
  dailyRuns: number[]; // Counts across the last 7 days (oldest to newest)
}

/**
 * Fetches all agents belonging to the workspace, ordered in canonical sequence.
 */
export async function fetchAgents(orgId: string): Promise<AgentRow[]> {
  const { data, error } = await supabase
    .from('agents')
    .select('*')
    .eq('org_id', orgId);

  if (error) {
    throw new Error(error.message);
  }

  const agents = data ?? [];

  // Sort by canonical agent key order
  return [...agents].sort((a, b) => {
    const aIdx = CANONICAL_AGENT_KEYS.indexOf(a.key as CanonicalAgentKey);
    const bIdx = CANONICAL_AGENT_KEYS.indexOf(b.key as CanonicalAgentKey);
    return (aIdx === -1 ? 99 : aIdx) - (bIdx === -1 ? 99 : bIdx);
  });
}

/**
 * Updates agent autonomy or enabled switch.
 */
export async function updateAgent(
  id: string,
  orgId: string,
  updates: AgentUpdate,
): Promise<AgentRow> {
  const { data, error } = await supabase
    .from('agents')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .eq('org_id', orgId)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }
  return data;
}

/**
 * Fetches recent agent execution logs from agent_runs.
 */
export async function fetchAgentRuns(
  orgId: string,
  agentKey?: string,
  limit = 50,
): Promise<AgentRunRow[]> {
  let query = supabase
    .from('agent_runs')
    .select('*')
    .eq('org_id', orgId)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (agentKey && agentKey !== 'all') {
    query = query.eq('agent_key', agentKey);
  }

  const { data, error } = await query;
  if (error) {
    throw new Error(error.message);
  }
  return data ?? [];
}

/**
 * Computes run counts, last execution timestamp, and 7-day sparkline arrays for each agent.
 */
export async function fetchAgentRunStats(
  orgId: string,
): Promise<Record<string, AgentRunStats>> {
  // Fetch up to 500 recent runs for this org
  const { data, error } = await supabase
    .from('agent_runs')
    .select('id, agent_key, created_at')
    .eq('org_id', orgId)
    .order('created_at', { ascending: false })
    .limit(500);

  if (error) {
    throw new Error(error.message);
  }

  const runs = data ?? [];

  // Initialize stats for each canonical agent
  const statsMap: Record<string, AgentRunStats> = {};
  for (const key of CANONICAL_AGENT_KEYS) {
    statsMap[key] = {
      totalRuns: 0,
      lastRunAt: null,
      dailyRuns: [0, 0, 0, 0, 0, 0, 0], // 7 days
    };
  }

  // Calculate day boundaries for the last 7 days (0 = 6 days ago, ..., 6 = today)
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const oneDayMs = 24 * 60 * 60 * 1000;

  for (const run of runs) {
    const key = run.agent_key;
    if (!statsMap[key]) {
      statsMap[key] = {
        totalRuns: 0,
        lastRunAt: null,
        dailyRuns: [0, 0, 0, 0, 0, 0, 0],
      };
    }

    const stat = statsMap[key];
    stat.totalRuns += 1;

    if (!stat.lastRunAt || new Date(run.created_at) > new Date(stat.lastRunAt)) {
      stat.lastRunAt = run.created_at;
    }

    const runTime = new Date(run.created_at).getTime();
    const daysAgo = Math.floor((todayStart + oneDayMs - 1 - runTime) / oneDayMs);

    if (daysAgo >= 0 && daysAgo < 7) {
      const dayIndex = 6 - daysAgo; // 0 is 6 days ago, 6 is today
      const currentCount = stat.dailyRuns[dayIndex] ?? 0;
      stat.dailyRuns[dayIndex] = currentCount + 1;
    }
  }

  return statsMap;
}
