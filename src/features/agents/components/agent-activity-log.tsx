import React, { useState } from 'react';
import {
  ChevronDown,
  ChevronRight,
  Copy,
  Check,
  CheckCircle2,
  XCircle,
  Clock,
  Filter,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { AgentAvatar } from './agent-avatar';
import { formatRelativeDate } from '@/lib/format';
import { cn } from '@/lib/utils';
import type { AgentRunRow } from '../api';

export interface AgentActivityLogProps {
  runs: AgentRunRow[];
  isLoading?: boolean;
  selectedAgent: string;
  onSelectAgent: (agentKey: string) => void;
}

const AGENT_FILTERS = [
  { key: 'all', label: 'All Agents' },
  { key: 'ceo', label: 'CEO' },
  { key: 'sales', label: 'Sales' },
  { key: 'operations', label: 'Operations' },
  { key: 'support', label: 'Support' },
  { key: 'marketing', label: 'Marketing' },
  { key: 'finance', label: 'Finance' },
];

export function AgentActivityLog({
  runs,
  isLoading = false,
  selectedAgent,
  onSelectAgent,
}: AgentActivityLogProps) {
  const [expandedRunId, setExpandedRunId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedRunId((prev) => (prev === id ? null : id));
  };

  const handleCopy = (id: string, output: unknown) => {
    navigator.clipboard.writeText(JSON.stringify(output, null, 2));
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-4">
      {/* Filter Chips Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-[var(--border)]">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-[var(--text-muted)]" />
          <span className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
            Filter Log:
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          {AGENT_FILTERS.map((f) => {
            const active = selectedAgent === f.key;
            return (
              <button
                key={f.key}
                type="button"
                onClick={() => onSelectAgent(f.key)}
                className={cn(
                  'px-3 py-1 text-xs rounded-lg font-medium transition-colors border',
                  active
                    ? 'bg-[var(--primary)] text-black border-[var(--primary)] shadow-sm'
                    : 'bg-[var(--surface-subtle)] text-[var(--text-muted)] border-[var(--border)] hover:text-[var(--text)] hover:bg-[var(--surface-hover)]',
                )}
              >
                {f.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Log Entries */}
      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="p-4 rounded-xl border border-[var(--border)] glass flex items-center justify-between gap-4"
            >
              <div className="flex items-center gap-3">
                <Skeleton className="w-9 h-9 rounded-xl" />
                <div className="space-y-1.5">
                  <Skeleton className="w-48 h-4" />
                  <Skeleton className="w-72 h-3" />
                </div>
              </div>
              <Skeleton className="w-20 h-4" />
            </div>
          ))}
        </div>
      ) : runs.length === 0 ? (
        <div className="py-12 text-center rounded-2xl border border-[var(--border)] glass p-6">
          <Clock className="w-8 h-8 text-[var(--text-muted)] mx-auto mb-2 opacity-50" />
          <p className="text-sm font-medium text-[var(--text)]">No agent runs recorded</p>
          <p className="text-xs text-[var(--text-muted)] mt-1 max-w-sm mx-auto">
            {selectedAgent === 'all'
              ? 'Agent activity will appear here as leads are scored, transcripts parsed, churn analyzed, or CEO plans created.'
              : `No activity found for the ${selectedAgent} agent.`}
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {runs.map((run) => {
            const isExpanded = expandedRunId === run.id;
            const isDone = run.status === 'done';

            return (
              <div
                key={run.id}
                className={cn(
                  'rounded-xl border transition-all glass overflow-hidden',
                  isExpanded
                    ? 'border-[var(--primary)]/40 shadow-md bg-[var(--surface-hover)]/40'
                    : 'border-[var(--border)] hover:border-[var(--border-strong)]',
                )}
              >
                <div
                  role="button"
                  tabIndex={0}
                  onClick={() => toggleExpand(run.id)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      toggleExpand(run.id);
                    }
                  }}
                  className="p-4 flex items-center justify-between gap-4 cursor-pointer select-none"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <AgentAvatar agentKey={run.agent_key} size="sm" />
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-semibold text-[var(--text)] capitalize">
                          {run.agent_key} Agent
                        </span>
                        <Badge variant="outline" className="text-[10px] font-mono py-0 px-1.5">
                          {run.action.replace('_', ' ')}
                        </Badge>
                        {isDone ? (
                          <span className="inline-flex items-center gap-1 text-[11px] text-[var(--mint)]">
                            <CheckCircle2 className="w-3 h-3" />
                            Success
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] text-[var(--danger)]">
                            <XCircle className="w-3 h-3" />
                            Failed
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-[var(--text-muted)] truncate mt-0.5 max-w-md sm:max-w-xl">
                        {run.summary || 'Operation completed.'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-xs text-[var(--text-muted)] tabular-nums hidden sm:inline-block">
                      {formatRelativeDate(run.created_at)}
                    </span>
                    <button
                      type="button"
                      aria-label={isExpanded ? 'Collapse output' : 'Expand output'}
                      className="text-[var(--text-muted)] hover:text-[var(--text)] p-1 rounded-lg"
                    >
                      {isExpanded ? (
                        <ChevronDown className="w-4 h-4" />
                      ) : (
                        <ChevronRight className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Expandable JSON Output */}
                {isExpanded && (
                  <div className="px-4 pb-4 pt-1 border-t border-[var(--border)]/60 bg-black/30">
                    <div className="flex items-center justify-between py-2">
                      <span className="text-[11px] font-mono text-[var(--text-muted)]">
                        Payload Output (JSON)
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCopy(run.id, run.output);
                        }}
                        className="h-7 text-xs gap-1.5"
                      >
                        {copiedId === run.id ? (
                          <>
                            <Check className="w-3 h-3 text-[var(--mint)]" />
                            <span>Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Copy Output</span>
                          </>
                        )}
                      </Button>
                    </div>
                    <pre className="p-3 rounded-lg bg-black/60 border border-[var(--border)] text-xs font-mono text-[var(--text-muted)] overflow-x-auto max-h-64">
                      {JSON.stringify(run.output, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
