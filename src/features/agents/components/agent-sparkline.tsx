import React from 'react';
import { cn } from '@/lib/utils';

export interface AgentSparklineProps {
  data: number[]; // 7 daily counts
  color?: string;
  height?: number;
  width?: number;
  className?: string;
}

export function AgentSparkline({
  data,
  color = '#2DE2A6',
  height = 28,
  width = 84,
  className,
}: AgentSparklineProps) {
  const points = data && data.length > 0 ? data : [0, 0, 0, 0, 0, 0, 0];
  const max = Math.max(...points, 1);
  const min = 0;
  const paddingY = 4;
  const usableHeight = height - paddingY * 2;

  // Build SVG path coordinates
  const stepX = width / Math.max(points.length - 1, 1);
  const coords = points.map((val, idx) => {
    const x = idx * stepX;
    const normalized = (val - min) / (max - min);
    const y = height - paddingY - normalized * usableHeight;
    return { x, y };
  });

  const pathD = coords.reduce(
    (acc, pt, idx) => (idx === 0 ? `M ${pt.x} ${pt.y}` : `${acc} L ${pt.x} ${pt.y}`),
    '',
  );

  const firstCoord = coords[0] ?? { x: 0, y: height };
  const lastCoord = coords[coords.length - 1] ?? { x: width, y: height };
  const fillD = `${pathD} L ${lastCoord.x} ${height} L ${firstCoord.x} ${height} Z`;

  const totalRuns = points.reduce((acc, v) => acc + v, 0);

  return (
    <div
      className={cn('inline-flex flex-col items-end gap-1', className)}
      title={`${totalRuns} runs in the last 7 days`}
    >
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        className="overflow-visible"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id={`sparkline-grad-${color.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.3" />
            <stop offset="100%" stopColor={color} stopOpacity="0.0" />
          </linearGradient>
        </defs>

        {/* Gradient Area Fill */}
        <path
          d={fillD}
          fill={`url(#sparkline-grad-${color.replace('#', '')})`}
        />

        {/* Crisp Line */}
        <path
          d={pathD}
          fill="none"
          stroke={color}
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Latest day point indicator */}
        {coords.length > 0 && lastCoord && (
          <circle
            cx={lastCoord.x}
            cy={lastCoord.y}
            r="2.5"
            fill={color}
            className="animate-pulse"
          />
        )}
      </svg>
    </div>
  );
}
