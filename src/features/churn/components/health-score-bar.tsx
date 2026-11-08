import React from 'react';
import { cn } from '@/lib/utils';

export interface HealthScoreBarProps {
  score: number | null | undefined;
  className?: string;
  showText?: boolean;
}

export function HealthScoreBar({
  score,
  className,
  showText = true,
}: HealthScoreBarProps) {
  if (score == null) {
    return (
      <div className={cn('flex items-center gap-2', className)}>
        <div className="h-2 w-20 bg-[var(--surface-raised)] border border-[var(--border)] rounded-full overflow-hidden" />
        {showText && <span className="text-xs font-mono text-[var(--text-muted)]">—</span>}
      </div>
    );
  }

  const safeScore = Math.max(0, Math.min(100, score));

  const barColor =
    safeScore >= 75
      ? 'bg-[var(--mint)]'
      : safeScore >= 50
        ? 'bg-[var(--cyan)]'
        : 'bg-[var(--danger)]';

  const textColor =
    safeScore >= 75
      ? 'text-[var(--mint)]'
      : safeScore >= 50
        ? 'text-[var(--cyan)]'
        : 'text-[var(--danger)]';

  return (
    <div className={cn('flex items-center gap-2.5', className)}>
      <div className="h-2 w-20 sm:w-24 bg-[var(--surface-raised)] border border-[var(--border)] rounded-full overflow-hidden relative">
        <div
          className={cn('h-full transition-all duration-500 ease-out rounded-full', barColor)}
          style={{ width: `${safeScore}%` }}
        />
      </div>
      {showText && (
        <span className={cn('text-xs font-mono font-semibold', textColor)}>
          {safeScore}%
        </span>
      )}
    </div>
  );
}

