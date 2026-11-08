import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useWorkspace } from '@/features/workspace';
import {
  fetchAgents,
  updateAgent,
  fetchAgentRuns,
  fetchAgentRunStats,
  type AgentRow,
  type AgentUpdate,
  type AgentRunRow,
  type AgentRunStats,
} from './api';

export function useAgents() {
  const { workspace } = useWorkspace();
  const orgId = workspace?.id;

  return useQuery<AgentRow[]>({
    queryKey: ['agents', orgId],
    queryFn: () => {
      if (!orgId) throw new Error('No active workspace');
      return fetchAgents(orgId);
    },
    enabled: Boolean(orgId),
    staleTime: 30 * 1000,
  });
}

export function useUpdateAgent() {
  const queryClient = useQueryClient();
  const { workspace } = useWorkspace();
  const orgId = workspace?.id;

  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: AgentUpdate }) => {
      if (!orgId) throw new Error('No active workspace');
      return updateAgent(id, orgId, updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agents', orgId] });
    },
  });
}

export function useAgentRuns(agentKey?: string, limit = 50) {
  const { workspace } = useWorkspace();
  const orgId = workspace?.id;

  return useQuery<AgentRunRow[]>({
    queryKey: ['agent_runs', orgId, agentKey, limit],
    queryFn: () => {
      if (!orgId) throw new Error('No active workspace');
      return fetchAgentRuns(orgId, agentKey, limit);
    },
    enabled: Boolean(orgId),
    staleTime: 10 * 1000,
  });
}

export function useAgentRunStats() {
  const { workspace } = useWorkspace();
  const orgId = workspace?.id;

  return useQuery<Record<string, AgentRunStats>>({
    queryKey: ['agent_run_stats', orgId],
    queryFn: () => {
      if (!orgId) throw new Error('No active workspace');
      return fetchAgentRunStats(orgId);
    },
    enabled: Boolean(orgId),
    staleTime: 30 * 1000,
  });
}

export interface AgentGateState {
  agent: AgentRow | undefined;
  isEnabled: boolean;
  autonomy: 'off' | 'suggest' | 'auto';
  disabledReason?: string;
  isLoading: boolean;
}

/**
 * Shared hook to verify if a specific AI agent is currently enabled in the workspace.
 * When disabled, provides a user-facing explanation tooltip message.
 */
export function useAgentGate(agentKey: string): AgentGateState {
  const { data: agents, isLoading } = useAgents();

  const agent = agents?.find((a) => a.key === agentKey);
  const isEnabled = agent ? agent.enabled !== false : true;
  const autonomy = (agent?.autonomy ?? 'suggest') as 'off' | 'suggest' | 'auto';

  const disabledReason = !isEnabled
    ? `${agent?.name || 'This agent'} is currently disabled in your workspace settings. Re-enable it in Agents to run analyses.`
    : undefined;

  return {
    agent,
    isEnabled,
    autonomy,
    disabledReason,
    isLoading,
  };
}

