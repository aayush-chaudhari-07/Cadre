import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Cpu, Check, ShieldCheck, Zap, FileSpreadsheet } from 'lucide-react';
import { Reveal } from '@/components/motion/reveal';
import { useReducedMotion } from '@/hooks/use-reduced-motion';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface Step {
  step: string;
  badge: string;
  title: string;
  subhead: string;
  description: string;
  bullets: string[];
}

const STEPS: Step[] = [
  {
    step: '01',
    badge: 'Input & Connect',
    title: 'Connect your revenue data',
    subhead: 'Instant ingestion with zero engineering overhead.',
    description:
      'Enter new leads directly into our fast interface, import standard CSV spreadsheets, or stream in call notes. Cadre normalizes and structures your commercial data in seconds.',
    bullets: [
      'Simple CSV bulk upload for contacts and leads',
      'Raw call transcript and note parser',
      'Zero complex CRM migrations required',
    ],
  },
  {
    step: '02',
    badge: 'Autonomous Analysis',
    title: 'Let the specialized agents work',
    subhead: 'Continuous evaluation powered by Google Gemini.',
    description:
      'Six dedicated AI agents analyze your pipeline simultaneously. Leads are intent-scored, customer retention hazards are flagged, call commitments are tracked, and competitors are counter-positioned.',
    bullets: [
      'Sub-15s response latency with Gemini reasoning',
      'Continuous churn signals and sentiment tracking',
      'Automated competitor objection handling scripts',
    ],
  },
  {
    step: '03',
    badge: 'Executive Synthesis',
    title: 'Act on the CEO executive plan',
    subhead: 'Clear tactical directives, ready to execute.',
    description:
      'Review your prioritized daily briefing from the AI CEO. Get actionable battlecards, tailored outreach drafts, and probability-weighted revenue forecasts without digging through messy dashboards.',
    bullets: [
      'Daily AI CEO briefing with prioritized actions',
      'One-click draft responses and battlecard generation',
      'Probability-weighted pipeline velocity forecasts',
    ],
  },
];

export function HowItWorks() {
  const shouldReduce = useReducedMotion();
  const [activeStep, setActiveStep] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Track scroll position to update active step on desktop when not reduced-motion
  useEffect(() => {
    if (shouldReduce) return;

    const handleScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight * 0.45;
      stepRefs.current.forEach((el, index) => {
        if (!el) return;
        const top = el.getBoundingClientRect().top + window.scrollY;
        const height = el.offsetHeight;
        if (scrollPosition >= top && scrollPosition < top + height) {
          setActiveStep(index);
        }
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [shouldReduce]);

  return (
    <section id="how-it-works" className="relative py-24 md:py-36 border-t border-[var(--border)] bg-[var(--bg)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 md:mb-24">
          <Reveal>
            <Badge variant="outline" className="mb-4 border-[var(--primary)]/30 text-[var(--primary)] bg-[var(--primary)]/5">
              <Zap className="w-3.5 h-3.5 mr-1.5" />
              How It Works
            </Badge>
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold tracking-tight text-[var(--text)]">
              From raw pipeline to{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)]">
                autonomous revenue actions
              </span>
            </h2>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="mt-4 text-base sm:text-lg text-[var(--text-2)] max-w-2xl mx-auto">
              Three streamlined steps that replace manual triage, disjointed spreadsheets, and guesswork with an coordinated AI team.
            </p>
          </Reveal>
        </div>

        {/* Desktop / Pinned Experience vs Mobile / Reduced Motion */}
        {shouldReduce ? (
          /* Stacked view for reduced motion */
          <div className="space-y-16">
            {STEPS.map((step, idx) => (
              <div
                key={step.step}
                className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-8"
              >
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <span className="font-mono text-sm font-semibold text-[var(--primary)] px-2.5 py-1 rounded-md bg-[var(--primary)]/10 border border-[var(--primary)]/20">
                      Step {step.step}
                    </span>
                    <Badge variant="outline" className="text-xs text-[var(--text-3)]">
                      {step.badge}
                    </Badge>
                  </div>
                  <h3 className="text-2xl font-display font-semibold text-[var(--text)] mb-3">{step.title}</h3>
                  <p className="text-sm font-medium text-[var(--primary)] mb-3">{step.subhead}</p>
                  <p className="text-sm text-[var(--text-2)] mb-6 leading-relaxed">{step.description}</p>
                  <ul className="space-y-2.5">
                    {step.bullets.map((b) => (
                      <li key={b} className="flex items-center text-sm text-[var(--text-2)]">
                        <Check className="w-4 h-4 text-[var(--primary)] mr-2.5 shrink-0" />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-2)] p-6">
                  <StepVisual index={idx} />
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Pinned / Scroll Story on Desktop with Mobile fallback */
          <div ref={containerRef} className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            {/* Left Steps List */}
            <div className="lg:col-span-6 space-y-12 lg:space-y-28 py-4 lg:py-12">
              {STEPS.map((step, idx) => {
                const isActive = activeStep === idx;
                return (
                  <div
                    key={step.step}
                    ref={(el) => {
                      stepRefs.current[idx] = el;
                    }}
                    onClick={() => setActiveStep(idx)}
                    className={cn(
                      'cursor-pointer transition-all duration-300 rounded-2xl p-6 md:p-8 border',
                      isActive
                        ? 'border-[var(--primary)]/40 bg-[var(--surface)] shadow-lg shadow-[var(--primary)]/5 ring-1 ring-[var(--primary)]/20'
                        : 'border-[var(--border)]/60 bg-[var(--surface)]/40 hover:border-[var(--border)] hover:bg-[var(--surface)]/70 opacity-70 hover:opacity-100'
                    )}
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <span
                        className={cn(
                          'font-mono text-xs font-semibold px-2.5 py-1 rounded-md transition-colors',
                          isActive
                            ? 'bg-[var(--primary)]/20 text-[var(--primary)] border border-[var(--primary)]/30'
                            : 'bg-[var(--surface-2)] text-[var(--text-3)] border border-[var(--border)]'
                        )}
                      >
                        Step {step.step}
                      </span>
                      <Badge variant="outline" className="text-xs text-[var(--text-3)] border-[var(--border)]">
                        {step.badge}
                      </Badge>
                    </div>

                    <h3 className="text-xl md:text-2xl font-display font-semibold text-[var(--text)] mb-2">
                      {step.title}
                    </h3>

                    <p className="text-sm font-medium text-[var(--primary)] mb-3">
                      {step.subhead}
                    </p>

                    <p className="text-sm text-[var(--text-2)] leading-relaxed mb-6">
                      {step.description}
                    </p>

                    <ul className="space-y-2.5">
                      {step.bullets.map((bullet) => (
                        <li key={bullet} className="flex items-start text-xs sm:text-sm text-[var(--text-2)]">
                          <Check className={cn('w-4 h-4 mr-2.5 shrink-0 mt-0.5', isActive ? 'text-[var(--primary)]' : 'text-[var(--text-3)]')} />
                          <span>{bullet}</span>
                        </li>
                      ))}
                    </ul>

                    {/* Mobile visual inline preview */}
                    <div className="mt-6 block lg:hidden rounded-xl border border-[var(--border)] bg-[var(--surface-2)] p-4">
                      <StepVisual index={idx} />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Right Pinned Visual (Desktop Only) */}
            <div className="hidden lg:block lg:col-span-6 sticky top-28">
              <div className="relative rounded-2xl border border-[var(--border)] bg-[var(--surface)]/90 backdrop-blur-xl p-8 shadow-2xl shadow-black/40 overflow-hidden">
                <div className="absolute top-0 right-0 w-80 h-80 bg-[var(--primary)]/5 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-80 h-80 bg-[var(--secondary)]/5 rounded-full blur-3xl pointer-events-none" />

                <div className="flex items-center justify-between border-b border-[var(--border)] pb-4 mb-6">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[var(--primary)] animate-pulse" />
                    <span className="text-xs font-mono font-medium text-[var(--text-2)] uppercase tracking-wider">
                      Cadre Live Engine • Step 0{activeStep + 1}
                    </span>
                  </div>
                  <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
                    <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
                    <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
                  </div>
                </div>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeStep}
                    initial={{ opacity: 0, y: 12, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -12, scale: 0.98 }}
                    transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                    className="min-h-[380px] flex flex-col justify-center"
                  >
                    <StepVisual index={activeStep} />
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function StepVisual({ index }: { index: number }) {
  if (index === 0) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between p-3.5 rounded-lg border border-[var(--border)] bg-[var(--surface-2)]">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-md bg-[var(--primary)]/10 text-[var(--primary)]">
              <FileSpreadsheet className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-mono font-medium text-[var(--text)]">q3_inbound_leads_final.csv</p>
              <p className="text-[11px] text-[var(--text-3)] font-mono">148 rows • 8 columns detected</p>
            </div>
          </div>
          <Badge variant="outline" className="text-[10px] text-[var(--primary)] border-[var(--primary)]/30">
            Parsed 100%
          </Badge>
        </div>

        <div className="rounded-lg border border-[var(--border)] bg-[var(--surface-2)] p-4 space-y-2.5">
          <div className="flex justify-between text-[11px] font-mono text-[var(--text-3)] border-b border-[var(--border)] pb-2">
            <span>CONTACT</span>
            <span>COMPANY</span>
            <span>INTENT SIGNAL</span>
          </div>
          <div className="flex justify-between items-center text-xs font-mono text-[var(--text-2)]">
            <span className="text-[var(--text)]">sarah.v@apex.io</span>
            <span>Apex Systems</span>
            <span className="text-[var(--primary)]">Demo requested</span>
          </div>
          <div className="flex justify-between items-center text-xs font-mono text-[var(--text-2)]">
            <span className="text-[var(--text)]">j.reyes@stride.co</span>
            <span>Stride Global</span>
            <span className="text-[var(--secondary)]">Pricing review</span>
          </div>
          <div className="flex justify-between items-center text-xs font-mono text-[var(--text-2)]">
            <span className="text-[var(--text)]">d.miller@vault.net</span>
            <span>Vault Security</span>
            <span className="text-[var(--text-3)]">Whitepaper</span>
          </div>
        </div>

        <div className="flex items-center gap-2 p-3 rounded-lg border border-[var(--border)] bg-[var(--surface)] text-xs text-[var(--text-2)]">
          <ShieldCheck className="w-4 h-4 text-[var(--primary)] shrink-0" />
          <span>Tenant isolation enforced with PostgreSQL Row-Level Security</span>
        </div>
      </div>
    );
  }

  if (index === 1) {
    return (
      <div className="space-y-3.5">
        <div className="grid grid-cols-2 gap-2.5">
          <div className="p-3 rounded-lg border border-[var(--primary)]/30 bg-[var(--primary)]/5">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-mono text-[var(--primary)] font-semibold">Lead Agent</span>
              <span className="w-2 h-2 rounded-full bg-[var(--primary)] animate-pulse" />
            </div>
            <p className="text-[11px] text-[var(--text-2)]">Evaluating 12 new inbound leads for buyer urgency</p>
          </div>

          <div className="p-3 rounded-lg border border-[var(--secondary)]/30 bg-[var(--secondary)]/5">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-mono text-[var(--secondary)] font-semibold">Churn Agent</span>
              <span className="w-2 h-2 rounded-full bg-[var(--secondary)] animate-pulse" />
            </div>
            <p className="text-[11px] text-[var(--text-2)]">Calculated health drop on 3 accounts (&gt;35% risk)</p>
          </div>

          <div className="p-3 rounded-lg border border-[var(--border)] bg-[var(--surface-2)]">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-mono text-[var(--text)] font-semibold">Meeting Agent</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--primary)]" />
            </div>
            <p className="text-[11px] text-[var(--text-3)]">Extracted 4 actionable commitments from sales call</p>
          </div>

          <div className="p-3 rounded-lg border border-[var(--border)] bg-[var(--surface-2)]">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-mono text-[var(--text)] font-semibold">Competitor Agent</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--primary)]" />
            </div>
            <p className="text-[11px] text-[var(--text-3)]">Updated battlecard vs RivalCorp feature release</p>
          </div>
        </div>

        <div className="p-3.5 rounded-lg border border-[var(--border)] bg-[var(--surface-2)] flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-[var(--secondary)]" />
            <span className="font-mono text-[var(--text)]">Google Gemini 2.5 Flash</span>
          </div>
          <span className="font-mono text-[var(--primary)] font-medium">1.4s response latency</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3.5">
      <div className="p-4 rounded-xl border border-[var(--gold)]/30 bg-[var(--gold)]/5">
        <div className="flex items-center justify-between mb-2">
          <Badge className="bg-[var(--gold)]/20 text-[var(--gold)] border-[var(--gold)]/40 hover:bg-[var(--gold)]/30 text-[10px]">
            AI CEO Morning Synthesis
          </Badge>
          <span className="text-[10px] font-mono text-[var(--text-3)]">08:00 AM UTC</span>
        </div>
        <h4 className="text-sm font-display font-bold text-[var(--text)] mb-1">
          3 Critical Commercial Priorities for Today
        </h4>
        <p className="text-xs text-[var(--text-2)] leading-relaxed">
          &ldquo;Maya Chen (Northwind) has a 92% close probability if counter-proposal is sent by 2 PM. Two at-risk accounts require proactive check-ins.&rdquo;
        </p>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between p-3 rounded-lg border border-[var(--border)] bg-[var(--surface-2)] text-xs">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-md bg-[var(--primary)]/10 text-[var(--primary)] flex items-center justify-center font-bold text-xs font-mono">
              1
            </div>
            <span className="font-medium text-[var(--text)]">Send Northwind Labs Battlecard</span>
          </div>
          <span className="font-mono text-xs text-[var(--primary)] font-semibold">+$48,000 Pipeline</span>
        </div>

        <div className="flex items-center justify-between p-3 rounded-lg border border-[var(--border)] bg-[var(--surface-2)] text-xs">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-md bg-[var(--warning)]/10 text-[var(--warning)] flex items-center justify-center font-bold text-xs font-mono">
              2
            </div>
            <span className="font-medium text-[var(--text)]">Vantage Health retention outreach</span>
          </div>
          <span className="font-mono text-xs text-[var(--warning)] font-semibold">-$24,000 Churn Risk</span>
        </div>
      </div>
    </div>
  );
}
