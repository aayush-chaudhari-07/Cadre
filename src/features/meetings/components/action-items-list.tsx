import React, { useState, useEffect } from 'react';
import { Copy, Check, Calendar, User, CheckSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import type { MeetingActionItem } from '@/types/ai';

export interface ActionItemsListProps {
  meetingId: string;
  items: MeetingActionItem[] | null | undefined;
  className?: string;
}

export function ActionItemsList({ meetingId, items, className }: ActionItemsListProps) {
  const [completedMap, setCompletedMap] = useState<Record<number, boolean>>({});
  const [copied, setCopied] = useState(false);

  const storageKey = `cadre_meeting_actions_${meetingId}`;

  // Load completed state from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        setCompletedMap(JSON.parse(saved));
      }
    } catch {
      // LocalStorage unavailable
    }
  }, [storageKey]);

  const toggleItem = (idx: number) => {
    const next = { ...completedMap, [idx]: !completedMap[idx] };
    setCompletedMap(next);
    try {
      localStorage.setItem(storageKey, JSON.stringify(next));
    } catch {
      // LocalStorage write failed
    }
  };

  const handleCopyAll = async () => {
    if (!items || items.length === 0) return;

    const formatted = items
      .map((item, idx) => {
        const check = completedMap[idx] ? '[x]' : '[ ]';
        const dueText = item.due ? ` (Due: ${item.due})` : '';
        return `${check} ${item.owner}: ${item.task}${dueText}`;
      })
      .join('\n');

    try {
      await navigator.clipboard.writeText(formatted);
      setCopied(true);
      toast.success('Action items copied to clipboard');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Failed to copy to clipboard');
    }
  };

  if (!items || items.length === 0) {
    return (
      <Card className={cn('glass border-[var(--border)]', className)}>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold flex items-center gap-2 text-[var(--text)]">
            <CheckSquare className="w-4 h-4 text-[var(--mint)]" />
            Action Items & Deliverables
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-[var(--text-muted)] italic">
            No action items recorded for this meeting.
          </p>
        </CardContent>
      </Card>
    );
  }

  const completedCount = items.filter((_, idx) => completedMap[idx]).length;

  return (
    <Card className={cn('glass border-[var(--border)]', className)}>
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <div className="space-y-1">
          <CardTitle className="text-sm font-semibold flex items-center gap-2 text-[var(--text)]">
            <CheckSquare className="w-4 h-4 text-[var(--mint)]" />
            Action Items & Deliverables
          </CardTitle>
          <p className="text-xs text-[var(--text-muted)]">
            {completedCount} of {items.length} completed &bull; Saved locally
          </p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleCopyAll}
          className="text-xs gap-1.5 h-8 text-[var(--text-muted)] hover:text-[var(--text)]"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-[var(--mint)]" /> : <Copy className="w-3.5 h-3.5" />}
          {copied ? 'Copied' : 'Copy all'}
        </Button>
      </CardHeader>
      <CardContent className="space-y-2.5">
        {items.map((item, idx) => {
          const isDone = Boolean(completedMap[idx]);
          return (
            <div
              key={idx}
              className={cn(
                'flex items-start gap-3 p-3 rounded-lg border transition-all duration-200',
                isDone
                  ? 'bg-[var(--surface-muted)]/50 border-[var(--border)]/50 opacity-60'
                  : 'bg-[var(--surface-raised)] border-[var(--border)] hover:border-[var(--mint)]/30',
              )}
            >
              <div className="pt-0.5">
                <Checkbox
                  checked={isDone}
                  onCheckedChange={() => toggleItem(idx)}
                  aria-label={`Mark task by ${item.owner} as complete`}
                />
              </div>
              <div className="flex-1 min-w-0 space-y-1">
                <p
                  className={cn(
                    'text-sm font-medium leading-snug break-words',
                    isDone ? 'line-through text-[var(--text-muted)]' : 'text-[var(--text)]',
                  )}
                >
                  {item.task}
                </p>
                <div className="flex flex-wrap items-center gap-3 text-xs text-[var(--text-muted)]">
                  <span className="flex items-center gap-1">
                    <User className="w-3 h-3 text-[var(--mint)]" />
                    <span className="font-medium text-[var(--text)]">{item.owner}</span>
                  </span>
                  {item.due && (
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-[var(--cyan)]" />
                      <span>Due: {item.due}</span>
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
