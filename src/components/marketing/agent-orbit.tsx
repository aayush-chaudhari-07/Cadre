import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Reveal } from '@/components/motion/reveal';
import { Badge } from '@/components/ui/badge';
import { useReducedMotion } from '@/hooks/use-reduced-motion';
import { Crown, Target, Video, ShieldAlert, Compass, TrendingUp } from 'lucide-react';

interface AgentInfo {
  key: string;
  name: string;
  title: string;
  color: string;
  description: string;
  deliverables: string[];
  cx: number;
  cy: number;
  icon: React.ComponentType<{ className?: string }>;
}

const ORBIT_AGENTS: AgentInfo[] = [
  {
    key: 'sales',
    name: 'Sales Manager',
    title: 'Lead Intelligence & Deal Acceleration',
    color: '#2DE2A6',
    description: 'Continuously scores inbound leads, analyzes buying intent from prospect communications, and drafts personalized follow-up emails.',
    deliverables: ['Lead qualification score (0-100)', 'Objection handling points', 'Next best sales actions'],
    cx: 140,
    cy: 110,
    icon: Target,
  },
  {
    key: 'support',
    name: 'Support Manager',
    title: 'Churn Prevention & Health Monitoring',
    color: '#22D3EE',
    description: 'Monitors customer signals (usage drops, support ticket velocity, contract renewals) to flag churn risk and draft retention plays.',
    deliverables: ['Account health scoring', 'MRR-at-risk calculation', 'Targeted retention plays'],
    cx: 380,
    cy: 110,
    icon: ShieldAlert,
  },
  {
    key: 'marketing',
    name: 'Marketing Manager',
    title: 'Competitor Intelligence & Positioning',
    color: '#A78BFA',
    description: 'Crawls public rival websites to map positioning shifts, price changes, and new features into actionable battlecards.',
    deliverables: ['Competitive battlecards', 'Feature matrices', 'Counter-positioning points'],
    cx: 430,
    cy: 280,
    icon: Compass,
  },
  {
    key: 'operations',
    name: 'Operations Manager',
    title: 'Meeting Intelligence & Action Items',
    color: '#38BDF8',
    description: 'Ingests call recordings and transcripts to produce executive summaries, track commitments with owners, and assess customer sentiment.',
    deliverables: ['Meeting executive summary', 'Action items with owners', 'Deal health trajectory'],
    cx: 260,
    cy: 400,
    icon: Video,
  },
  {
    key: 'finance',
    name: 'Finance Director',
    title: 'Revenue Modeling & Pipeline Forecast',
    color: '#34D399',
    description: 'Applies stage-weighted probability algorithms to active deals to forecast quarterly revenue and explain variance.',
    deliverables: ['Weighted pipeline forecasts', 'Best/expected/worst case models', 'Win rate velocity tracking'],
    cx: 90,
    cy: 280,
    icon: TrendingUp,
  },
];

const CEO_INFO = {
  name: 'AI CEO',
  title: 'Strategic Orchestrator & Coordinator',
  color: '#F5B94A',
  description: 'Takes high-level founder commands and generates multi-phase growth roadmaps, assigning targeted tasks to the other 5 agents.',
  deliverables: ['Coordinated execution plans', 'Cross-agent alignment', 'Strategic daily briefing'],
};

export function AgentOrbit() {
  const [selectedAgent, setSelectedAgent] = useState<AgentInfo | typeof CEO_INFO>(CEO_INFO);
  const shouldReduceMotion = useReducedMotion();

  const centerCx = 260;
  const centerCy = 240;

  return (
    <section id="agents" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <Reveal className="text-center max-w-3xl mx-auto space-y-4 mb-16">
        <Badge variant="gold">Autonomous Roster</Badge>
        <h2 className="font-heading text-3xl sm:text-5xl font-bold tracking-tight text-[var(--text)]">
          Six specialized agents. One growth engine.
        </h2>
        <p className="text-sm sm:text-base text-[var(--text-muted)] leading-relaxed">
          Hover or tap any node to inspect that agent&apos;s specific responsibilities and deliverables.
        </p>
      </Reveal>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
        {/* SVG Hub-and-Spoke Canvas (7 Cols) */}
        <div className="lg:col-span-7 flex items-center justify-center relative">
          <div className="relative w-full max-w-[520px] aspect-[520/480]">
            <svg viewBox="0 0 520 480" className="w-full h-full overflow-visible select-none">
              <defs>
                <filter id="orbitGlow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="5" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* Connecting dashed lines with traveling light pulses */}
              {ORBIT_AGENTS.map((agent) => (
                <g key={`spoke-${agent.key}`}>
                  <line
                    x1={centerCx}
                    y1={centerCy}
                    x2={agent.cx}
                    y2={agent.cy}
                    stroke="var(--border)"
                    strokeWidth="1.5"
                    strokeDasharray="4 4"
                  />
                  {!shouldReduceMotion && (
                    <motion.line
                      x1={centerCx}
                      y1={centerCy}
                      x2={agent.cx}
                      y2={agent.cy}
                      stroke={agent.color}
                      strokeWidth="2.5"
                      strokeOpacity="0.8"
                      initial={{ pathLength: 0.2, pathOffset: 0 }}
                      animate={{ pathOffset: [0, 1] }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: 'easeInOut',
                        delay: Math.random() * 2,
                      }}
                    />
                  )}
                </g>
              ))}

              {/* Satellite Agent Nodes */}
              {ORBIT_AGENTS.map((agent) => {
                const isSelected = selectedAgent.name === agent.name;
                return (
                  <g
                    key={agent.key}
                    tabIndex={0}
                    role="button"
                    aria-label={`View details for ${agent.name}`}
                    onClick={() => setSelectedAgent(agent)}
                    onMouseEnter={() => setSelectedAgent(agent)}
                    onFocus={() => setSelectedAgent(agent)}
                    className="cursor-pointer outline-none group"
                  >
                    <motion.circle
                      cx={agent.cx}
                      cy={agent.cy}
                      r={isSelected ? 32 : 26}
                      fill="var(--surface-1)"
                      stroke={agent.color}
                      strokeWidth={isSelected ? 3 : 1.5}
                      filter="url(#orbitGlow)"
                      whileHover={{ scale: 1.15 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                    />
                    <circle cx={agent.cx} cy={agent.cy} r={9} fill={agent.color} />
                    <text
                      x={agent.cx}
                      y={agent.cy + 44}
                      textAnchor="middle"
                      className="fill-[var(--text)] text-xs font-semibold"
                    >
                      {agent.name}
                    </text>
                  </g>
                );
              })}

              {/* Center Core: AI CEO */}
              <g
                tabIndex={0}
                role="button"
                aria-label="View details for AI CEO"
                onClick={() => setSelectedAgent(CEO_INFO)}
                onMouseEnter={() => setSelectedAgent(CEO_INFO)}
                onFocus={() => setSelectedAgent(CEO_INFO)}
                className="cursor-pointer outline-none group"
              >
                {!shouldReduceMotion && (
                  <motion.circle
                    cx={centerCx}
                    cy={centerCy}
                    r={50}
                    fill="none"
                    stroke="#F5B94A"
                    strokeWidth="2"
                    initial={{ scale: 0.9, opacity: 0.3 }}
                    animate={{ scale: [0.95, 1.2, 0.95], opacity: [0.2, 0.8, 0.2] }}
                    transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
                  />
                )}
                <circle
                  cx={centerCx}
                  cy={centerCy}
                  r={40}
                  fill="var(--surface-1)"
                  stroke="#F5B94A"
                  strokeWidth={selectedAgent.name === 'AI CEO' ? 4 : 2}
                  filter="url(#orbitGlow)"
                />
                <circle cx={centerCx} cy={centerCy} r={18} fill="#F5B94A" />
                <circle cx={centerCx} cy={centerCy} r={7} fill="#FFFFFF" />
                <text
                  x={centerCx}
                  y={centerCy - 54}
                  textAnchor="middle"
                  className="fill-[var(--gold)] text-sm font-bold tracking-wider uppercase"
                >
                  AI CEO Core
                </text>
              </g>
            </svg>
          </div>
        </div>

        {/* Detailed Inspector Card (5 Cols) */}
        <div className="lg:col-span-5">
          <div className="glass rounded-3xl p-8 border border-[var(--border)] shadow-xl space-y-6 relative overflow-hidden animate-in fade-in duration-300">
            <div
              className="absolute top-0 left-0 right-0 h-[3px]"
              style={{ backgroundColor: selectedAgent.color }}
            />

            <div className="flex items-center gap-3">
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center font-bold"
                style={{
                  backgroundColor: `${selectedAgent.color}20`,
                  color: selectedAgent.color,
                  border: `1px solid ${selectedAgent.color}40`,
                }}
              >
                {selectedAgent.name === 'AI CEO' ? (
                  <Crown className="w-6 h-6" />
                ) : (
                  <Target className="w-6 h-6" />
                )}
              </div>
              <div>
                <h3 className="font-heading text-xl font-bold text-[var(--text)]">
                  {selectedAgent.name}
                </h3>
                <p className="text-xs font-mono font-medium" style={{ color: selectedAgent.color }}>
                  {selectedAgent.title}
                </p>
              </div>
            </div>

            <p className="text-sm text-[var(--text-muted)] leading-relaxed">
              {selectedAgent.description}
            </p>

            <div className="space-y-2.5 pt-2 border-t border-[var(--border)]/70">
              <span className="text-xs font-semibold uppercase tracking-wider text-[var(--text)] block">
                Primary Deliverables
              </span>
              <ul className="space-y-2 text-xs text-[var(--text-muted)]">
                {selectedAgent.deliverables.map((item, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <span
                      className="w-1.5 h-1.5 rounded-full shrink-0"
                      style={{ backgroundColor: selectedAgent.color }}
                    />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
