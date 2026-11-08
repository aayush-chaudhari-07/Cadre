import React from 'react';
import { Calendar, ChevronRight, History } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { InsightRecord } from '../api';

export interface PastBriefsListProps {
  briefs: InsightRecord[];
  activeDate: string;
  onSelectDate: (brief: InsightRecord) => void;
  isLoading?: boolean;
}

export function PastBriefsList({
  briefs,
  activeDate,
  onSelectDate,
  isLoading = false,
}: PastBriefsListProps) {
  if (isLoading) {
    return (
      <div className="space-y-2 p-1">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="p-3 rounded-xl border border-[var(--border)] bg-[var(--surface-sunken)] space-y-2 animate-pulse"
          >
            <div className="w-24 h-3 bg-[var(--surface-muted)] rounded" />
            <div className="w-48 h-4 bg-[var(--surface-muted)] rounded" />
          </div>
        ))}
      </div>
    );
  }

  if (briefs.length === 0) {
    return (
      <div className="py-8 px-4 text-center rounded-xl border border-dashed border-[var(--border)]">
        <History className="w-6 h-6 text-[var(--text-muted)] mx-auto mb-2 opacity-50" />
        <p className="text-xs font-medium text-[var(--text)]">No past briefs archived</p>
        <p className="text-[11px] text-[var(--text-muted)] mt-0.5">
          Daily briefs will be archived here as they are generated.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {briefs.map((b) => {
        const isSelected = activeDate === b.for_date;
        const formattedDate = new Date(`${b.for_date}T00:00:00`).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        });

        return (
          <button
            key={b.id}
            type="button"
            onClick={() => onSelectDate(b)}
            className={cn(
              'w-full text-left p-3 rounded-xl border transition-all duration-200 flex items-start justify-between gap-3 group',
              isSelected
                ? 'border-[var(--primary)] bg-[var(--primary)]/10 shadow-sm'
                : 'border-[var(--border)] hover:border-[var(--border-strong)] bg-[var(--surface-raised)]/40 hover:bg-[var(--surface-hover)]',
            )}
          >
            <div className="space-y-1 min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-[var(--text)] flex items-center gap-1.5">
                  <Calendar className="w-3 h-3 text-[var(--primary)]" />
                  {formattedDate}
                </span>
                {isSelected && (
                  <Badge variant="default" className="text-[9px] py-0 px-1 font-mono">
                    Viewing
                  </Badge>
                )}
              </div>

              <p className="text-xs text-[var(--text-muted)] line-clamp-2 group-hover:text-[var(--text)] transition-colors">
                &ldquo;{b.content?.headline || 'Daily Brief'}&rdquo;
              </p>
            </div>

            <ChevronRight
              className={cn(
                'w-4 h-4 text-[var(--text-muted)] shrink-0 transition-transform mt-1',
                isSelected ? 'text-[var(--primary)] translate-x-0.5' : 'group-hover:translate-x-0.5',
              )}
            />
          </button>
        );
      })}
    </div>
  );
}

