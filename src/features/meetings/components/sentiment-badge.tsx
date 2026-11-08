import React from 'react';
import { Smile, Meh, Frown } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export interface SentimentBadgeProps {
  sentiment: 'positive' | 'neutral' | 'negative' | string | null | undefined;
  className?: string;
}

export function SentimentBadge({ sentiment, className }: SentimentBadgeProps) {
  if (!sentiment) {
    return (
      <Badge variant="outline" className={cn('text-[var(--text-muted)] border-[var(--border)]', className)}>
        Unanalyzed
      </Badge>
    );
  }

  const s = sentiment.toLowerCase();

  if (s === 'positive') {
    return (
      <Badge
        variant="outline"
        className={cn(
          'bg-[var(--mint)]/10 text-[var(--mint)] border-[var(--mint)]/30 gap-1.5 font-medium',
          className,
        )}
      >
        <Smile className="w-3.5 h-3.5" />
        Positive
      </Badge>
    );
  }

  if (s === 'negative') {
    return (
      <Badge
        variant="outline"
        className={cn(
          'bg-[var(--danger)]/10 text-[var(--danger)] border-[var(--danger)]/30 gap-1.5 font-medium',
          className,
        )}
      >
        <Frown className="w-3.5 h-3.5" />
        Negative
      </Badge>
    );
  }

  return (
    <Badge
      variant="outline"
      className={cn(
        'bg-[var(--cyan)]/10 text-[var(--cyan)] border-[var(--cyan)]/30 gap-1.5 font-medium',
        className,
      )}
    >
      <Meh className="w-3.5 h-3.5" />
      Neutral
    </Badge>
  );
}
