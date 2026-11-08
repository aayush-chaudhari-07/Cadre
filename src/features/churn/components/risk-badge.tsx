import React from 'react';
import { ShieldCheck, AlertCircle, AlertTriangle, ShieldAlert } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { AccountRiskLevel } from '@/types/database';

export interface RiskBadgeProps {
  level: AccountRiskLevel | string | null | undefined;
  className?: string;
  showIcon?: boolean;
}

export function RiskBadge({ level, className, showIcon = true }: RiskBadgeProps) {
  if (!level) {
    return (
      <Badge variant="outline" className={cn('text-[var(--text-muted)] border-[var(--border)]', className)}>
        Unassessed
      </Badge>
    );
  }

  const l = level.toLowerCase();

  if (l === 'low') {
    return (
      <Badge
        variant="outline"
        className={cn(
          'bg-[var(--mint)]/10 text-[var(--mint)] border-[var(--mint)]/30 gap-1 font-medium capitalize',
          className,
        )}
      >
        {showIcon && <ShieldCheck className="w-3 h-3" />}
        <span>Low Risk</span>
      </Badge>
    );
  }

  if (l === 'medium') {
    return (
      <Badge
        variant="outline"
        className={cn(
          'bg-[var(--cyan)]/10 text-[var(--cyan)] border-[var(--cyan)]/30 gap-1 font-medium capitalize',
          className,
        )}
      >
        {showIcon && <AlertCircle className="w-3 h-3" />}
        <span>Medium Risk</span>
      </Badge>
    );
  }

  if (l === 'high') {
    return (
      <Badge
        variant="outline"
        className={cn(
          'bg-[var(--gold)]/10 text-[var(--gold)] border-[var(--gold)]/30 gap-1 font-medium capitalize',
          className,
        )}
      >
        {showIcon && <AlertTriangle className="w-3 h-3" />}
        <span>High Risk</span>
      </Badge>
    );
  }

  // critical
  return (
    <Badge
      variant="outline"
      className={cn(
        'bg-[var(--danger)]/10 text-[var(--danger)] border-[var(--danger)]/30 gap-1 font-medium capitalize',
        className,
      )}
    >
      {showIcon && <ShieldAlert className="w-3 h-3" />}
      <span>Critical Risk</span>
    </Badge>
  );
}
