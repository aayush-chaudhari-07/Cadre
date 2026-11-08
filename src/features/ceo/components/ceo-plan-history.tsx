import React from 'react';
import { CheckCircle2, Clock, ChevronRight, History } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { formatRelativeDate } from '@/lib/format';
import { cn } from '@/lib/utils';
import type { CeoPlanRecord } from '../api';

export interface CeoPlanHistoryProps {
  plans: CeoPlanRecord[];
  activePlanId: string | null;
  onSelectPlan: (plan: CeoPlanRecord) => void;
  isLoading?: boolean;
}

export function CeoPlanHistory({
  plans,
  activePlanId,
  onSelectPlan,
  isLoading = false,
}: CeoPlanHistoryProps) {
  if (isLoading) {
    return (
      <div className="space-y-2 p-1">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="p-3 rounded-xl border border-[var(--border)] bg-[var(--surface-sunken)] space-y-2 animate-pulse"
          >
            <div className="w-24 h-3 bg-[var(--surface-muted)] rounded" />
            <div className="w-44 h-4 bg-[var(--surface-muted)] rounded" />
          </div>
        ))}
      </div>
    );
  }

  if (plans.length === 0) {
    return (
      <div className="py-8 px-4 text-center rounded-xl border border-dashed border-[var(--border)]">
        <History className="w-6 h-6 text-[var(--text-muted)] mx-auto mb-2 opacity-50" />
        <p className="text-xs font-medium text-[var(--text)]">No past strategic directives</p>
        <p className="text-[11px] text-[var(--text-muted)] mt-0.5">
          Submit your first command above to generate an executive blueprint.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {plans.map((p) => {
        const isSelected = activePlanId === p.id;
        const isApproved = p.status === 'approved' || p.status === 'done';

        return (
          <button
            key={p.id}
            type="button"
            onClick={() => onSelectPlan(p)}
            className={cn(
              'w-full text-left p-3.5 rounded-xl border transition-all duration-200 flex items-start justify-between gap-3 group',
              isSelected
                ? 'border-[var(--gold)]/60 bg-[var(--gold)]/10 shadow-sm'
                : 'border-[var(--border)] hover:border-[var(--border-strong)] bg-[var(--surface-raised)]/40 hover:bg-[var(--surface-hover)]',
            )}
          >
            <div className="space-y-1.5 min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                {isApproved ? (
                  <Badge variant="outline" className="bg-[var(--mint)]/10 text-[var(--mint)] border-[var(--mint)]/30 text-[10px] py-0 px-1.5 gap-1">
                    <CheckCircle2 className="w-2.5 h-2.5" />
                    Approved
                  </Badge>
                ) : (
                  <Badge variant="outline" className="bg-[var(--gold)]/10 text-[var(--gold)] border-[var(--gold)]/30 text-[10px] py-0 px-1.5">
                    Draft
                  </Badge>
                )}

                <span className="text-[10px] text-[var(--text-muted)] flex items-center gap-1 tabular-nums">
                  <Clock className="w-2.5 h-2.5" />
                  {formatRelativeDate(p.created_at)}
                </span>
              </div>

              <p className="text-xs font-medium text-[var(--text)] line-clamp-2 group-hover:text-[var(--gold)] transition-colors">
                {p.plan?.goal || p.command}
              </p>

              <span className="text-[10px] text-[var(--text-muted)] block font-mono">
                {p.plan?.phases?.length ?? 0} phases &bull; {p.plan?.kpis?.length ?? 0} KPIs
              </span>
            </div>

            <ChevronRight
              className={cn(
                'w-4 h-4 text-[var(--text-muted)] shrink-0 transition-transform mt-1',
                isSelected ? 'text-[var(--gold)] translate-x-0.5' : 'group-hover:translate-x-0.5',
              )}
            />
          </button>
        );
      })}
    </div>
  );
}
