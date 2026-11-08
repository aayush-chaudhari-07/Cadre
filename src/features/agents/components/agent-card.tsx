import React, { useTransition } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { AgentAvatar } from './agent-avatar';
import { AgentSparkline } from './agent-sparkline';
import { formatRelativeDate } from '@/lib/format';
import { cn } from '@/lib/utils';
import type { AgentRow } from '../api';
import type { AgentRunStats } from '../api';

export interface AgentCardProps {
  agent: AgentRow;
  stats?: AgentRunStats;
  onUpdate: (updates: { enabled?: boolean; autonomy?: 'off' | 'suggest' | 'auto' }) => Promise<void>;
}

const AGENT_COLORS: Record<string, string> = {
  ceo: '#F5B94A',
  sales: '#2DE2A6',
  operations: '#22D3EE',
  support: '#FB923C',
  marketing: '#A78BFA',
  finance: '#34D399',
};

const AUTONOMY_OPTIONS: Array<{ key: 'off' | 'suggest' | 'auto'; label: string; desc: string }> = [
  { key: 'off', label: 'Off', desc: 'Manual activation only' },
  { key: 'suggest', label: 'Suggest', desc: 'Recommends actions for review' },
  { key: 'auto', label: 'Auto', desc: 'Autonomous execution where supported' },
];

export function AgentCard({ agent, stats, onUpdate }: AgentCardProps) {
  const [isPending, startTransition] = useTransition();
  const color = AGENT_COLORS[agent.key] || '#F5B94A';

  const handleToggleEnabled = (checked: boolean) => {
    startTransition(async () => {
      await onUpdate({ enabled: checked });
    });
  };

  const handleSelectAutonomy = (mode: 'off' | 'suggest' | 'auto') => {
    if (mode === agent.autonomy) return;
    startTransition(async () => {
      await onUpdate({ autonomy: mode });
    });
  };

  const totalRuns = stats?.totalRuns ?? 0;
  const lastRunText = stats?.lastRunAt ? formatRelativeDate(stats.lastRunAt) : 'No runs yet';
  const dailyRuns = stats?.dailyRuns ?? [0, 0, 0, 0, 0, 0, 0];

  return (
    <Card
      className={cn(
        'glass transition-all duration-300 relative overflow-hidden flex flex-col justify-between border-[var(--border)]',
        agent.enabled
          ? 'hover:border-[var(--border-strong)] hover:shadow-lg'
          : 'opacity-60 bg-[var(--surface-muted)]/40',
        isPending && 'pointer-events-none opacity-80',
      )}
    >
      {/* Top ambient color tint */}
      <div
        className="absolute top-0 left-0 right-0 h-1"
        style={{
          background: agent.enabled
            ? `linear-gradient(90deg, transparent, ${color}, transparent)`
            : 'transparent',
        }}
      />

      <CardContent className="p-5 flex flex-col justify-between flex-1 gap-5">
        {/* Header: Avatar, Name, Role, Switch */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <AgentAvatar agentKey={agent.key} size="md" glow={agent.enabled} />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-heading font-semibold text-base text-[var(--text)]">
                  {agent.name}
                </h3>
                {agent.key === 'ceo' && (
                  <Badge variant="gold" className="text-[10px] px-1.5 py-0">
                    Leader
                  </Badge>
                )}
              </div>
              <p className="text-xs text-[var(--text-muted)] line-clamp-2 mt-0.5 max-w-[220px]">
                {agent.role}
              </p>
            </div>
          </div>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div>
                  <Switch
                    checked={agent.enabled}
                    onCheckedChange={handleToggleEnabled}
                    aria-label={`Enable or disable ${agent.name}`}
                  />
                </div>
              </TooltipTrigger>
              <TooltipContent>
                {agent.enabled ? `Disable ${agent.name}` : `Enable ${agent.name}`}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        {/* Autonomy Segmented Control */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-medium tracking-wider uppercase text-[var(--text-muted)]">
              Autonomy Level
            </span>
            <span className="text-[11px] text-[var(--text-muted)] capitalize">
              {agent.autonomy}
            </span>
          </div>

          <div
            role="radiogroup"
            aria-label={`${agent.name} autonomy level`}
            className="grid grid-cols-3 p-1 rounded-xl bg-[var(--surface-subtle)] border border-[var(--border)] gap-1"
          >
            {AUTONOMY_OPTIONS.map((opt) => {
              const active = agent.autonomy === opt.key;
              return (
                <button
                  key={opt.key}
                  type="button"
                  role="radio"
                  aria-checked={active}
                  onClick={() => handleSelectAutonomy(opt.key)}
                  disabled={!agent.enabled}
                  title={opt.desc}
                  className={cn(
                    'py-1 text-xs font-medium rounded-lg transition-all text-center select-none',
                    active
                      ? 'bg-[var(--surface)] text-[var(--text)] shadow-sm font-semibold border border-[var(--border)]'
                      : 'text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--surface-hover)]',
                    !agent.enabled && 'cursor-not-allowed opacity-50',
                  )}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer Metrics & Mini Sparkline */}
        <div className="pt-3 border-t border-[var(--border)]/60 flex items-center justify-between mt-auto">
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-semibold text-[var(--text)] tabular-nums">
                {totalRuns} {totalRuns === 1 ? 'run' : 'runs'}
              </span>
              <span className="text-[10px] text-[var(--text-muted)]">•</span>
              <span className="text-[11px] text-[var(--text-muted)]">
                {lastRunText}
              </span>
            </div>
            <span className="text-[10px] text-[var(--text-muted)] block mt-0.5">
              Activity trend (7 days)
            </span>
          </div>

          <AgentSparkline data={dailyRuns} color={color} />
        </div>
      </CardContent>
    </Card>
  );
}
