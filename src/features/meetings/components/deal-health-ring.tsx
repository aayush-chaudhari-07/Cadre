import React from 'react';
import { cn } from '@/lib/utils';

export interface DealHealthRingProps {
  score: number | null | undefined;
  size?: number;
  strokeWidth?: number;
  className?: string;
  showLabel?: boolean;
}

export function DealHealthRing({
  score,
  size = 80,
  strokeWidth = 6,
  className,
  showLabel = true,
}: DealHealthRingProps) {
  const safeScore = score == null ? 0 : Math.max(0, Math.min(100, score));
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (safeScore / 100) * circumference;

  const colorClass =
    safeScore >= 75
      ? 'text-[var(--mint)] stroke-[var(--mint)]'
      : safeScore >= 50
        ? 'text-[var(--cyan)] stroke-[var(--cyan)]'
        : 'text-[var(--danger)] stroke-[var(--danger)]';

  const glowStyle =
    safeScore >= 75
      ? 'rgba(45, 226, 166, 0.25)'
      : safeScore >= 50
        ? 'rgba(34, 211, 238, 0.25)'
        : 'rgba(239, 68, 68, 0.25)';

  return (
    <div className={cn('inline-flex flex-col items-center justify-center relative', className)}>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="rotate-[-90deg] transition-all duration-700 ease-out"
        style={{ filter: `drop-shadow(0 0 6px ${glowStyle})` }}
      >
        {/* Background Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="var(--border)"
          strokeWidth={strokeWidth}
          fill="none"
          className="opacity-40"
        />
        {/* Animated Progress Indicator */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className={cn('transition-all duration-1000 ease-out', colorClass)}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <span className="font-heading font-bold text-lg tracking-tight text-[var(--text)]">
          {score == null ? '—' : safeScore}
        </span>
        {showLabel && (
          <span className="text-[10px] uppercase font-mono tracking-wider text-[var(--text-muted)] -mt-1">
            Health
          </span>
        )}
      </div>
    </div>
  );
}

