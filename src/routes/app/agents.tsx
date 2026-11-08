import React, { useState } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { Bot, RefreshCw, AlertCircle, ShieldCheck } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import {
  useAgents,
  useUpdateAgent,
  useAgentRuns,
  useAgentRunStats,
  AgentCard,
  AgentActivityLog,
  type AgentRow,
} from '@/features/agents';
import { toast } from 'sonner';

export const Route = createFileRoute('/app/agents')({
  component: AgentsPage,
});

function AgentsPage() {
  const [selectedAgentFilter, setSelectedAgentFilter] = useState<string>('all');

  const {
    data: agents,
    isLoading: isLoadingAgents,
    isError: isAgentsError,
    error: agentsError,
    refetch: refetchAgents,
  } = useAgents();

  const { data: statsMap } = useAgentRunStats();

  const {
    data: runs,
    isLoading: isLoadingRuns,
    refetch: refetchRuns,
  } = useAgentRuns(selectedAgentFilter, 50);

  const updateAgentMutation = useUpdateAgent();

  const handleUpdateAgent = async (
    agent: AgentRow,
    updates: { enabled?: boolean; autonomy?: 'off' | 'suggest' | 'auto' },
  ) => {
    try {
      await updateAgentMutation.mutateAsync({
        id: agent.id,
        updates,
      });
      toast.success(
        updates.enabled !== undefined
          ? `${agent.name} ${updates.enabled ? 'enabled' : 'disabled'}`
          : `${agent.name} autonomy set to ${updates.autonomy}`,
      );
    } catch (err) {
      toast.error(`Failed to update agent: ${(err as Error).message}`);
    }
  };

  const activeAgentsCount = agents?.filter((a) => a.enabled).length ?? 0;
  const totalRunsAllAgents = Object.values(statsMap ?? {}).reduce(
    (acc, s) => acc + s.totalRuns,
    0,
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <h1 className="font-heading text-2xl sm:text-3xl font-bold tracking-tight text-[var(--text)]">
              Agent Roster &amp; Autonomy
            </h1>
            <Badge variant="default" className="text-xs">
              {activeAgentsCount} of {agents?.length || 6} Active
            </Badge>
            <Badge variant="outline" className="text-xs tabular-nums">
              {totalRunsAllAgents} Total Runs
            </Badge>
          </div>
          <p className="text-sm text-[var(--text-muted)] max-w-2xl">
            Configure agent operating modes (off, suggest, auto) and review the unified audit log.
            Disabling an agent pauses its automated tasks and gates matching buttons in other modules.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              refetchAgents();
              refetchRuns();
            }}
            className="gap-2"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Refresh Roster</span>
          </Button>
        </div>
      </div>

      {/* Agents Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[var(--mint)]" />
            <h2 className="text-base font-semibold font-heading text-[var(--text)]">
              Core Intelligence Roster
            </h2>
          </div>
          <span className="text-xs text-[var(--text-muted)]">
            Changes apply across all workspace operations
          </span>
        </div>

        {isAgentsError ? (
          <Card className="glass border-[var(--danger)]/40 p-6 text-center">
            <AlertCircle className="w-8 h-8 text-[var(--danger)] mx-auto mb-2" />
            <p className="text-sm font-medium text-[var(--text)]">Failed to load agent roster</p>
            <p className="text-xs text-[var(--text-muted)] mt-1 mb-4">
              {(agentsError as Error)?.message || 'Database query failed'}
            </p>
            <Button variant="outline" size="sm" onClick={() => refetchAgents()}>
              Try again
            </Button>
          </Card>
        ) : isLoadingAgents ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="glass p-5 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-[var(--surface-muted)] animate-pulse" />
                  <div className="space-y-1.5 flex-1">
                    <div className="w-32 h-4 rounded bg-[var(--surface-muted)] animate-pulse" />
                    <div className="w-48 h-3 rounded bg-[var(--surface-muted)] animate-pulse" />
                  </div>
                </div>
                <div className="h-8 rounded-xl bg-[var(--surface-muted)] animate-pulse" />
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {agents?.map((agent) => (
              <AgentCard
                key={agent.id}
                agent={agent}
                stats={statsMap?.[agent.key]}
                onUpdate={(updates) => handleUpdateAgent(agent, updates)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Unified Agent Execution Audit Log */}
      <Card className="glass border-[var(--border)]">
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <CardTitle className="text-base flex items-center gap-2">
                <Bot className="w-4 h-4 text-[var(--primary)]" />
                <span>Agent Execution Audit Trail</span>
              </CardTitle>
              <p className="text-xs text-[var(--text-muted)] mt-0.5">
                Every AI reasoning call records its inputs, outputs, and status here.
              </p>
            </div>
            <span className="text-xs font-mono text-[var(--text-muted)]">
              Table: public.agent_runs
            </span>
          </div>
        </CardHeader>
        <CardContent className="pt-2">
          <AgentActivityLog
            runs={runs ?? []}
            isLoading={isLoadingRuns}
            selectedAgent={selectedAgentFilter}
            onSelectAgent={setSelectedAgentFilter}
          />
        </CardContent>
      </Card>
    </div>
  );
}
