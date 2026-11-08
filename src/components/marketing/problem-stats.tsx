import React from 'react';
import { CountUp } from '@/components/motion/count-up';
import { Reveal } from '@/components/motion/reveal';
import { Bot, Layers, Zap } from 'lucide-react';

export function ProblemStats() {
  return (
    <section className="py-24 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <Reveal className="text-center max-w-3xl mx-auto space-y-4 mb-16">
        <h2 className="font-heading text-3xl sm:text-4xl font-bold tracking-tight text-[var(--text)]">
          Why small teams struggle to scale revenue
        </h2>
        <p className="text-sm sm:text-base text-[var(--text-muted)] leading-relaxed">
          Traditional revenue operations require six-figure budgets: dedicated RevOps leads, sales enablement reps, and enterprise BI subscriptions. Cadre consolidates that entire stack into autonomous AI agents.
        </p>
      </Reveal>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <Reveal delay={0.1}>
          <div className="glass rounded-2xl p-8 border border-[var(--border)] text-center relative overflow-hidden group hover:border-[var(--primary)]/40 transition-colors">
            <div className="w-12 h-12 mx-auto rounded-xl bg-[var(--primary)]/10 text-[var(--primary)] flex items-center justify-center mb-5">
              <Bot className="w-6 h-6" />
            </div>
            <div className="font-heading font-bold text-5xl text-[var(--text)] mb-2 font-mono">
              <CountUp value={6} duration={1.2} />
            </div>
            <h3 className="font-heading font-semibold text-base text-[var(--text)] mb-2">
              Autonomous AI Agents
            </h3>
            <p className="text-xs text-[var(--text-muted)] leading-relaxed">
              CEO, Sales, Support, Operations, Marketing, and Finance agents working in concert around your live database.
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.2}>
          <div className="glass rounded-2xl p-8 border border-[var(--border)] text-center relative overflow-hidden group hover:border-[var(--cyan)]/40 transition-colors">
            <div className="w-12 h-12 mx-auto rounded-xl bg-[var(--cyan)]/10 text-[var(--cyan)] flex items-center justify-center mb-5">
              <Layers className="w-6 h-6" />
            </div>
            <div className="font-heading font-bold text-5xl text-[var(--text)] mb-2 font-mono">
              <CountUp value={8} duration={1.2} />
            </div>
            <h3 className="font-heading font-semibold text-base text-[var(--text)] mb-2">
              Integrated Modules
            </h3>
            <p className="text-xs text-[var(--text-muted)] leading-relaxed">
              Leads, Meetings, Churn Guard, Competitor Radar, Revenue Forecast, Agent Roster, CEO Console, and Daily Briefing.
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.3}>
          <div className="glass rounded-2xl p-8 border border-[var(--border)] text-center relative overflow-hidden group hover:border-[var(--gold)]/40 transition-colors">
            <div className="w-12 h-12 mx-auto rounded-xl bg-[var(--gold)]/10 text-[var(--gold)] flex items-center justify-center mb-5">
              <Zap className="w-6 h-6" />
            </div>
            <div className="font-heading font-bold text-5xl text-[var(--text)] mb-2 font-mono flex items-center justify-center">
              <span>&lt;</span>
              <CountUp value={15} suffix="s" duration={1.2} />
            </div>
            <h3 className="font-heading font-semibold text-base text-[var(--text)] mb-2">
              Turnaround Per Analysis
            </h3>
            <p className="text-xs text-[var(--text-muted)] leading-relaxed">
              Powered by Google Gemini Flash via serverless Edge Functions for instant responses without queue latency.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

