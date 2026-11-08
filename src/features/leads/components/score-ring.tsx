import React from 'react';
import { cn } from '@/lib/utils';

interface ScoreRingProps {
  score: number | null | undefined;
  size?: number;
  strokeWidth?: number;
  className?: string;
}

export function ScoreRing({
  score,
  size = 56,
  strokeWidth = 4,
  className,
}: ScoreRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const safeScore = score !== null && score !== undefined ? Math.max(0, Math.min(100, score)) : null;
  const offset = safeScore !== null ? circumference - (safeScore / 100) * circumference : circumference;

  // Obsidian & Aurora Color grading
  let strokeColor = 'var(--text-3)';
  let bgTint = 'rgba(255,255,255,0.03)';
  if (safeScore !== null) {
    if (safeScore >= 80) {
      strokeColor = 'var(--primary)'; // Mint (Hot)
      bgTint = 'rgba(45,226,166,0.1)';
    } else if (safeScore >= 50) {
      strokeColor = 'var(--secondary)'; // Cyan (Warm)
      bgTint = 'rgba(34,211,238,0.1)';
    } else {
      strokeColor = 'var(--warning)'; // Amber/Gold (Cold)
      bgTint = 'rgba(255,176,32,0.1)';
    }
  }

  return (
    <div
      className={cn('relative inline-flex items-center justify-center font-mono', className)}
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="var(--border)"
          strokeWidth={strokeWidth}
          fill={bgTint}
        />
        {/* Progress stroke */}
        {safeScore !== null && (
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="transition-all duration-700 ease-out"
          />
        )}
      </svg>
      <span
        className={cn(
          'absolute font-bold tabular-nums',
          size <= 44 ? 'text-xs' : 'text-sm',
          safeScore === null ? 'text-[var(--text-3)]' : 'text-[var(--text)]',
        )}
      >
        {safeScore !== null ? safeScore : '—'}
      </span>
    </div>
  );
}
