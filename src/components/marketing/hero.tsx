import React, { useState, useEffect } from 'react';
import { Link } from '@tanstack/react-router';
import { Sparkles, ArrowRight, Play, CheckCircle2, Bot, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { WordReveal } from '@/components/motion/word-reveal';
import { Magnetic } from '@/components/motion/magnetic';
import { Tilt } from '@/components/motion/tilt';
import { CountUp } from '@/components/motion/count-up';
import { AuroraBackground } from '@/components/motion/aurora-background';
import { GridSpotlight } from '@/components/motion/grid-spotlight';

interface ActivityItem {
  id: string;
  agent: string;
  color: string;
  action: string;
  time: string;
}

const INITIAL_ACTIVITIES: ActivityItem[] = [
  {
    id: '1',
    agent: 'AI Sales',
    color: 'text-[var(--primary)]',
    action: 'Scored Maya Chen (Northwind Labs) → 92 Hot • High Intent',
    time: 'Just now',
  },
  {
    id: '2',
    agent: 'AI Support',
    color: 'text-[var(--cyan)]',
    action: 'Detected login drop on Vantage Health → Critical Churn Flag',
    time: '2m ago',
  },
  {
    id: '3',
    agent: 'AI Operations',
    color: 'text-[var(--primary)]',
    action: 'Analyzed Lumen Retail call → 2 urgent action items extracted',
    time: '5m ago',
  },
  {
    id: '4',
    agent: 'AI Marketing',
    color: 'text-[var(--secondary)]',
    action: 'Scanned Rivalytics pricing change → Battlecard refreshed',
    time: '8m ago',
  },
];

const NEW_ACTIVITIES: Omit<ActivityItem, 'id' | 'time'>[] = [
  {
    agent: 'AI Finance',
    color: 'text-[var(--primary)]',
    action: 'Re-weighted Q3 pipeline velocity → Expected close +$48,000',
  },
  {
    agent: 'AI CEO',
    color: 'text-[var(--gold)]',
    action: 'Formulated 3-phase growth sprint for enterprise sales pilot',
  },
  {
    agent: 'AI Sales',
    color: 'text-[var(--primary)]',
    action: 'Drafted security review reply for Daniel Okafor (Brightpath)',
  },
  {
    agent: 'AI Support',
    color: 'text-[var(--cyan)]',
    action: 'Scheduled proactive check-in play for Orbit Media renewal',
  },
];

export function Hero() {
  const [activities, setActivities] = useState<ActivityItem[]>(INITIAL_ACTIVITIES);

  // Ticking live activity feed
  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      const template = NEW_ACTIVITIES[index % NEW_ACTIVITIES.length];
      if (template) {
        const newItem: ActivityItem = {
          id: String(Date.now()),
          agent: template.agent,
          color: template.color,
          action: template.action,
          time: 'Just now',
        };
        setActivities((prev) => [newItem, ...prev.slice(0, 3)]);
        index++;
      }
    }, 3800);

    return () => clearInterval(interval);
  }, []);

  const handleScrollToDemo = (e: React.MouseEvent) => {
    e.preventDefault();
    document.getElementById('demo')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-[92vh] pt-32 pb-20 overflow-hidden flex flex-col items-center justify-center">
      {/* Background Lighting & Grid */}
      <AuroraBackground className="absolute inset-0 opacity-40 pointer-events-none" />
      <GridSpotlight className="absolute inset-0 pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
        {/* Top Feature Pill */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-medium bg-[var(--surface-1)] border border-[var(--border)] shadow-md animate-in fade-in">
          <Sparkles className="w-3.5 h-3.5 text-[var(--gold)]" />
          <span className="text-[var(--text)]">Powered by Google Gemini</span>
          <span className="text-[var(--text-muted)]">•</span>
          <span className="text-[var(--primary)] font-semibold">Free to start</span>
        </div>

        {/* Word Reveal Headline */}
        <div className="max-w-4xl mx-auto">
          <h1 className="font-heading text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-[var(--text)] leading-[1.08]">
            <WordReveal text="The AI team that runs your revenue." />
          </h1>
        </div>

        {/* One-Sentence Subhead */}
        <p className="max-w-2xl mx-auto text-base sm:text-lg text-[var(--text-muted)] leading-relaxed">
          Six autonomous AI agents that score leads, analyze sales calls, catch churn before it happens,
          and forecast pipeline — running on your real data.
        </p>

        {/* Magnetic CTAs */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          <Magnetic strength={0.25}>
            <Link to="/signup" search={{}}>
              <Button
                variant="primary"
                size="lg"
                className="h-12 px-7 text-sm font-semibold shadow-lg shadow-[var(--primary)]/20"
              >
                <span>Start free</span>
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </Magnetic>

          <Magnetic strength={0.2}>
            <a href="#demo" onClick={handleScrollToDemo}>
              <Button
                variant="secondary"
                size="lg"
                className="h-12 px-6 text-sm font-medium border border-[var(--border)]"
              >
                <Play className="w-3.5 h-3.5 mr-2 fill-current" />
                <span>Watch it work</span>
              </Button>
            </a>
          </Magnetic>
        </div>

        <div className="flex items-center justify-center gap-6 text-xs text-[var(--text-muted)] pt-1">
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-[var(--primary)]" />
            40 free analyses daily
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-[var(--primary)]" />
            No credit card needed
          </span>
          <span className="hidden sm:flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-[var(--primary)]" />
            Preloaded sample data
          </span>
        </div>

        {/* Tilting Product Dashboard Preview */}
        <div className="pt-8 sm:pt-12 w-full max-w-4xl mx-auto perspective-1000">
          <Tilt maxAngle={5} glare={true} className="w-full">
            <div className="glass rounded-2xl border border-[var(--border)] shadow-2xl p-4 sm:p-6 text-left relative overflow-hidden">
              {/* Subtle Aurora Border Accent */}
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[var(--primary)] via-[var(--cyan)] to-[var(--gold)] opacity-70" />

              {/* Mock Window Controls & Top Pill */}
              <div className="flex items-center justify-between pb-4 border-b border-[var(--border)] text-xs text-[var(--text-muted)]">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/70" />
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500/70" />
                  <span className="ml-3 font-mono text-[11px] text-[var(--text)]">Cadre Command Center</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[var(--primary)] animate-pulse" />
                  <span className="text-[11px] font-mono text-[var(--primary)]">6 AGENTS RUNNING</span>
                </div>
              </div>

              {/* KPI Cards Row */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 my-4">
                <div className="p-3.5 rounded-xl bg-[var(--surface-2)]/80 border border-[var(--border)]">
                  <span className="text-[11px] text-[var(--text-muted)] block font-medium">Weighted Pipeline</span>
                  <div className="text-xl sm:text-2xl font-bold font-mono text-[var(--text)] mt-1 flex items-baseline gap-1">
                    <CountUp value={142000} prefix="$" duration={1.6} />
                  </div>
                  <span className="text-[10px] text-[var(--primary)] flex items-center gap-1 mt-1 font-mono">
                    <TrendingUp className="w-3 h-3" /> +14.2% vs last month
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-[var(--surface-2)]/80 border border-[var(--border)]">
                  <span className="text-[11px] text-[var(--text-muted)] block font-medium">Hot Leads Qualified</span>
                  <div className="text-xl sm:text-2xl font-bold font-mono text-[var(--text)] mt-1">
                    <CountUp value={48} duration={1.4} />
                  </div>
                  <span className="text-[10px] text-[var(--text-muted)] font-mono mt-1 block">
                    Avg score: <strong className="text-[var(--primary)]">86/100</strong>
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-[var(--surface-2)]/80 border border-[var(--border)]">
                  <span className="text-[11px] text-[var(--text-muted)] block font-medium">At-Risk MRR Guarded</span>
                  <div className="text-xl sm:text-2xl font-bold font-mono text-[var(--text)] mt-1">
                    <CountUp value={38400} prefix="$" duration={1.5} />
                  </div>
                  <span className="text-[10px] text-[var(--cyan)] font-mono mt-1 block">
                    4 retention plays drafted
                  </span>
                </div>
              </div>

              {/* Live Ticking Agent Feed */}
              <div className="p-4 rounded-xl bg-[var(--surface-1)] border border-[var(--border)] space-y-2.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-[var(--text)] flex items-center gap-2">
                    <Bot className="w-4 h-4 text-[var(--primary)]" />
                    Autonomous Agent Activity Stream
                  </span>
                  <Badge variant="outline" className="text-[10px] font-mono">
                    Live Feed
                  </Badge>
                </div>

                <div className="space-y-1.5 pt-1">
                  {activities.map((item) => (
                    <div
                      key={item.id}
                      className="p-2 rounded-lg bg-[var(--surface-2)]/50 border border-[var(--border)]/60 flex items-center justify-between gap-3 text-xs transition-all animate-in fade-in slide-in-from-top-1 duration-300"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <span className={`font-semibold shrink-0 ${item.color}`}>
                          {item.agent}:
                        </span>
                        <span className="text-[var(--text)] truncate">{item.action}</span>
                      </div>
                      <span className="text-[10px] font-mono text-[var(--text-muted)] shrink-0">
                        {item.time}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Tilt>
        </div>
      </div>
    </section>
  );
}
