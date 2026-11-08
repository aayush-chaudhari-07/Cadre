import React from 'react';
import { motion } from 'motion/react';
import { useReducedMotion } from '@/hooks/use-reduced-motion';

interface AgentNode {
  key: string;
  name: string;
  role: string;
  color: string;
  cx: number;
  cy: number;
}

const AGENTS: AgentNode[] = [
  { key: 'sales', name: 'Sales Manager', role: 'Lead scoring', color: '#2DE2A6', cx: 100, cy: 90 },
  { key: 'support', name: 'Support Lead', role: 'Churn prevention', color: '#22D3EE', cx: 300, cy: 90 },
  { key: 'marketing', name: 'Marketing Lead', role: 'Competitor radar', color: '#A78BFA', cx: 340, cy: 230 },
  { key: 'operations', name: 'Operations', role: 'Meeting intelligence', color: '#38BDF8', cx: 200, cy: 320 },
  { key: 'finance', name: 'Finance Director', role: 'Revenue forecasting', color: '#34D399', cx: 60, cy: 230 },
];

export function AgentOrbitVisual() {
  const shouldReduceMotion = useReducedMotion();

  const centerCx = 200;
  const centerCy = 190;

  return (
    <div className="relative w-full max-w-[420px] aspect-square flex items-center justify-center select-none" aria-hidden="true">
      {/* Background ambient radial glow */}
      <div className="absolute inset-0 bg-radial from-[var(--primary)]/15 via-transparent to-transparent rounded-full blur-2xl pointer-events-none" />

      <svg viewBox="0 0 400 380" className="w-full h-full overflow-visible">
        <defs>
          <linearGradient id="auroraLine" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#2DE2A6" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#22D3EE" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#F5B94A" stopOpacity="0.9" />
          </linearGradient>

          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Connecting Lines */}
        {AGENTS.map((agent) => (
          <g key={`conn-${agent.key}`}>
            <line
              x1={centerCx}
              y1={centerCy}
              x2={agent.cx}
              y2={agent.cy}
              stroke="var(--border)"
              strokeWidth="1.5"
              strokeDasharray="4 4"
            />
            {/* Animated signal line */}
            {!shouldReduceMotion && (
              <motion.line
                x1={centerCx}
                y1={centerCy}
                x2={agent.cx}
                y2={agent.cy}
                stroke={agent.color}
                strokeWidth="2"
                strokeOpacity="0.7"
                initial={{ pathLength: 0, pathOffset: 0 }}
                animate={{
                  pathLength: [0.1, 0.4, 0.1],
                  pathOffset: [0, 1],
                }}
                transition={{
                  duration: 3.5,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: Math.random() * 2,
                }}
              />
            )}
          </g>
        ))}

        {/* Satellite Agent Nodes */}
        {AGENTS.map((agent) => (
          <g key={agent.key}>
            <motion.circle
              cx={agent.cx}
              cy={agent.cy}
              r={24}
              fill="var(--surface-2)"
              stroke={agent.color}
              strokeWidth="2"
              filter="url(#glow)"
              whileHover={{ scale: 1.15 }}
              transition={{ type: 'spring', stiffness: 400, damping: 20 }}
            />
            <circle cx={agent.cx} cy={agent.cy} r={8} fill={agent.color} />
            <text
              x={agent.cx}
              y={agent.cy + 38}
              textAnchor="middle"
              className="fill-[var(--text)] text-[11px] font-medium"
            >
              {agent.name}
            </text>
            <text
              x={agent.cx}
              y={agent.cy + 51}
              textAnchor="middle"
              className="fill-[var(--text-muted)] text-[9.5px]"
            >
              {agent.role}
            </text>
          </g>
        ))}

        {/* Central Core: AI CEO */}
        <g>
          {/* Pulsing ring around CEO */}
          {!shouldReduceMotion && (
            <motion.circle
              cx={centerCx}
              cy={centerCy}
              r={38}
              fill="none"
              stroke="#F5B94A"
              strokeWidth="2"
              initial={{ opacity: 0.8, scale: 0.95 }}
              animate={{ opacity: [0.3, 0.9, 0.3], scale: [0.95, 1.15, 0.95] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            />
          )}

          <circle
            cx={centerCx}
            cy={centerCy}
            r={32}
            fill="var(--surface-1)"
            stroke="#F5B94A"
            strokeWidth="3"
            filter="url(#glow)"
          />
          <circle cx={centerCx} cy={centerCy} r={14} fill="#F5B94A" />
          <circle cx={centerCx} cy={centerCy} r={6} fill="#FFFFFF" />

          <text
            x={centerCx}
            y={centerCy - 44}
            textAnchor="middle"
            className="fill-[var(--gold)] text-[12px] font-semibold tracking-wide uppercase"
          >
            AI CEO
          </text>
        </g>
      </svg>
    </div>
  );
}
