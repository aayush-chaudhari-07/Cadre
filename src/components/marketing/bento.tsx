import React from 'react';
import { SpotlightCard } from '@/components/motion/spotlight-card';
import { Reveal } from '@/components/motion/reveal';
import { Target, Video, ShieldAlert, Compass, TrendingUp, Crown } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export function Bento() {
  return (
    <section id="features" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <Reveal className="text-center max-w-3xl mx-auto space-y-4 mb-16">
        <Badge variant="default">The Revenue Engine</Badge>
        <h2 className="font-heading text-3xl sm:text-5xl font-bold tracking-tight text-[var(--text)]">
          Every revenue workflow, automated by specialists.
        </h2>
        <p className="text-sm sm:text-base text-[var(--text-muted)] leading-relaxed">
          No generic chatbots or blank prompt windows. Each Cadre agent has a dedicated domain, strict schemas, and automated execution loops.
        </p>
      </Reveal>

      {/* Asymmetric Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* 1. Lead Intelligence */}
        <Reveal delay={0.05}>
          <SpotlightCard className="h-full flex flex-col justify-between p-7 rounded-2xl glass border border-[var(--border)]">
            <div className="space-y-4">
              <div className="w-10 h-10 rounded-xl bg-[var(--primary)]/10 text-[var(--primary)] flex items-center justify-center">
                <Target className="w-5 h-5" />
              </div>
              <h3 className="font-heading text-xl font-bold text-[var(--text)]">
                Lead Intelligence
              </h3>
              <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                Score incoming prospects, analyze buying signals from inbound emails or notes, and generate tailored objection-handling responses.
              </p>
            </div>

            {/* Micro Looping Visual */}
            <div className="mt-8 pt-6 border-t border-[var(--border)]/60 flex items-center justify-center">
              <div className="relative w-28 h-20 flex items-center justify-center">
                <svg viewBox="0 0 100 80" className="w-full h-full overflow-visible">
                  <circle cx="50" cy="40" r="30" fill="none" stroke="var(--border)" strokeWidth="4" />
                  <circle
                    cx="50"
                    cy="40"
                    r="30"
                    fill="none"
                    stroke="#2DE2A6"
                    strokeWidth="4"
                    strokeDasharray="188"
                    strokeDashoffset="45"
                    strokeLinecap="round"
                    className="animate-pulse"
                  />
                  <text x="50" y="45" textAnchor="middle" fill="#2DE2A6" fontSize="13" fontWeight="bold" fontFamily="monospace">
                    92
                  </text>
                  <text x="50" y="56" textAnchor="middle" fill="var(--text-muted)" fontSize="7" fontWeight="bold">
                    HOT LEAD
                  </text>
                </svg>
              </div>
            </div>
          </SpotlightCard>
        </Reveal>

        {/* 2. Meeting Analyzer */}
        <Reveal delay={0.1}>
          <SpotlightCard className="h-full flex flex-col justify-between p-7 rounded-2xl glass border border-[var(--border)]">
            <div className="space-y-4">
              <div className="w-10 h-10 rounded-xl bg-[var(--cyan)]/10 text-[var(--cyan)] flex items-center justify-center">
                <Video className="w-5 h-5" />
              </div>
              <h3 className="font-heading text-xl font-bold text-[var(--text)]">
                Meeting Analyzer
              </h3>
              <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                Upload sales call transcripts (.txt, .vtt, .srt) to automatically extract agreed action items, participant sentiment, and hidden objections.
              </p>
            </div>

            {/* Micro Looping Waveform Visual */}
            <div className="mt-8 pt-6 border-t border-[var(--border)]/60 flex items-center justify-center">
              <div className="flex items-center gap-1.5 h-16">
                {[30, 65, 45, 90, 50, 75, 40, 60, 85, 35].map((height, i) => (
                  <span
                    key={i}
                    style={{ height: `${height}%`, animationDelay: `${i * 0.12}s` }}
                    className="w-1.5 rounded-full bg-[var(--cyan)] opacity-80 animate-pulse"
                  />
                ))}
              </div>
            </div>
          </SpotlightCard>
        </Reveal>

        {/* 3. Churn Guard */}
        <Reveal delay={0.15}>
          <SpotlightCard className="h-full flex flex-col justify-between p-7 rounded-2xl glass border border-[var(--border)]">
            <div className="space-y-4">
              <div className="w-10 h-10 rounded-xl bg-[var(--warning)]/10 text-[var(--warning)] flex items-center justify-center">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <h3 className="font-heading text-xl font-bold text-[var(--text)]">
                Churn Guard
              </h3>
              <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                Track customer health scores, quantify MRR-at-risk across contract renewal windows, and auto-generate executive retention plays.
              </p>
            </div>

            {/* Micro Looping Shield Visual */}
            <div className="mt-8 pt-6 border-t border-[var(--border)]/60 flex items-center justify-center">
              <div className="relative w-24 h-16 flex items-center justify-center">
                <ShieldAlert className="w-12 h-12 text-[var(--warning)] animate-pulse" />
                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--warning)] opacity-75" />
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-[var(--warning)]" />
                </span>
              </div>
            </div>
          </SpotlightCard>
        </Reveal>

        {/* 4. Competitor Radar */}
        <Reveal delay={0.2}>
          <SpotlightCard className="h-full flex flex-col justify-between p-7 rounded-2xl glass border border-[var(--border)]">
            <div className="space-y-4">
              <div className="w-10 h-10 rounded-xl bg-[var(--secondary)]/10 text-[var(--secondary)] flex items-center justify-center">
                <Compass className="w-5 h-5" />
              </div>
              <h3 className="font-heading text-xl font-bold text-[var(--text)]">
                Competitor Radar
              </h3>
              <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                Submit public rival URLs for server-side scraping and competitive positioning. Generate instant battlecards for sales objection handling.
              </p>
            </div>

            {/* Micro Looping Radar Visual */}
            <div className="mt-8 pt-6 border-t border-[var(--border)]/60 flex items-center justify-center">
              <div className="relative w-20 h-20 rounded-full border border-[var(--secondary)]/40 flex items-center justify-center">
                <div className="w-10 h-10 rounded-full border border-[var(--secondary)]/30" />
                <div className="absolute w-2 h-2 rounded-full bg-[var(--secondary)] top-3 left-6 animate-ping" />
                <div className="absolute inset-0 rounded-full border-t-2 border-[var(--secondary)] animate-spin" style={{ animationDuration: '3s' }} />
              </div>
            </div>
          </SpotlightCard>
        </Reveal>

        {/* 5. Revenue Forecast */}
        <Reveal delay={0.25}>
          <SpotlightCard className="h-full flex flex-col justify-between p-7 rounded-2xl glass border border-[var(--border)]">
            <div className="space-y-4">
              <div className="w-10 h-10 rounded-xl bg-[var(--primary)]/10 text-[var(--primary)] flex items-center justify-center">
                <TrendingUp className="w-5 h-5" />
              </div>
              <h3 className="font-heading text-xl font-bold text-[var(--text)]">
                Revenue Forecast
              </h3>
              <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                Deterministic mathematical pipeline weighting by stage paired with AI narrative synthesis. Never hallucinated, strictly calculated.
              </p>
            </div>

            {/* Micro Looping Bar Chart */}
            <div className="mt-8 pt-6 border-t border-[var(--border)]/60 flex items-center justify-center">
              <div className="flex items-end gap-2 h-14 w-28">
                <div className="w-5 bg-[var(--primary)]/30 rounded-t h-[40%]" />
                <div className="w-5 bg-[var(--primary)]/50 rounded-t h-[65%]" />
                <div className="w-5 bg-[var(--primary)]/80 rounded-t h-[80%]" />
                <div className="w-5 bg-[var(--primary)] rounded-t h-[100%] animate-pulse" />
              </div>
            </div>
          </SpotlightCard>
        </Reveal>

        {/* 6. AI CEO Orchestration (Spans Full on mobile, highlighted) */}
        <Reveal delay={0.3} className="md:col-span-1">
          <SpotlightCard className="h-full flex flex-col justify-between p-7 rounded-2xl glass border border-[var(--gold)]/30 relative overflow-hidden">
            <div className="space-y-4">
              <div className="w-10 h-10 rounded-xl bg-[var(--gold)]/10 text-[var(--gold)] flex items-center justify-center">
                <Crown className="w-5 h-5" />
              </div>
              <h3 className="font-heading text-xl font-bold text-[var(--text)] flex items-center gap-2">
                <span>AI CEO Console</span>
                <Badge variant="gold" className="text-[10px]">Orchestrator</Badge>
              </h3>
              <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                State your top strategic objective in natural language. The AI CEO breaks it down into coordinated, actionable phases for all 5 operational agents.
              </p>
            </div>

            {/* Micro Looping Core Visual */}
            <div className="mt-8 pt-6 border-t border-[var(--border)]/60 flex items-center justify-center">
              <div className="relative w-16 h-16 flex items-center justify-center">
                <div className="absolute inset-0 rounded-full bg-[var(--gold)]/20 animate-ping opacity-50" />
                <div className="w-10 h-10 rounded-full bg-[var(--surface-1)] border-2 border-[var(--gold)] flex items-center justify-center text-[var(--gold)] font-bold">
                  <Crown className="w-5 h-5" />
                </div>
              </div>
            </div>
          </SpotlightCard>
        </Reveal>
      </div>
    </section>
  );
}

