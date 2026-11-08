import React, { useState } from 'react';
import { Link } from '@tanstack/react-router';
import { Check, Sparkles, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AnimatedBorder } from '@/components/motion/animated-border';
import { Reveal } from '@/components/motion/reveal';
import { formatCurrency } from '@/lib/format';
import { cn } from '@/lib/utils';

export function PricingSection() {
  const [isYearly, setIsYearly] = useState(false);

  const tiers = [
    {
      name: 'Free',
      badge: 'Starter',
      priceMonthly: 0,
      priceYearly: 0,
      periodText: 'forever',
      description: 'Everything an early-stage founder or solo revenue operator needs to start scoring pipeline.',
      features: [
        '40 daily AI agent analyses',
        'All 6 specialized revenue agents',
        'Up to 100 leads & accounts',
        'CSV spreadsheet upload & manual entry',
        'Community discussion support',
      ],
      ctaText: 'Start free',
      ctaHref: '/signup',
      isPopular: false,
      isComingSoon: false,
    },
    {
      name: 'Pro',
      badge: 'Most Popular',
      priceMonthly: 49,
      priceYearly: 39,
      periodText: isYearly ? '/ month (billed yearly)' : '/ month',
      description: 'Autonomous revenue intelligence for high-conviction sales teams closing deals faster.',
      features: [
        'Unlimited daily AI analyses',
        'Priority Google Gemini reasoning queue',
        'Unlimited active leads, deals & accounts',
        'Custom competitor battlecard exports',
        'Daily AI CEO morning synthesis briefing',
        'Priority email response (< 4 hours)',
      ],
      ctaText: 'Coming soon',
      ctaHref: '#',
      isPopular: true,
      isComingSoon: true,
    },
    {
      name: 'Scale',
      badge: 'Enterprise',
      priceMonthly: 149,
      priceYearly: 119,
      periodText: isYearly ? '/ month (billed yearly)' : '/ month',
      description: 'Maximum velocity and customized multi-agent workflows for revenue organizations.',
      features: [
        'Everything in Pro plan',
        'Multi-seat workspace (up to 15 members)',
        'Automated CRM & webhook synchronization',
        'Custom agent calibration & prompt directives',
        'Dedicated onboarding engineer',
        '99.9% uptime service level agreement',
      ],
      ctaText: 'Coming soon',
      ctaHref: '#',
      isPopular: false,
      isComingSoon: true,
    },
  ];

  return (
    <section id="pricing" className="relative py-24 md:py-36 border-t border-[var(--border)] bg-[var(--bg)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
          <Reveal>
            <Badge variant="outline" className="mb-4 border-[var(--primary)]/30 text-[var(--primary)] bg-[var(--primary)]/5">
              <Zap className="w-3.5 h-3.5 mr-1.5" />
              Simple, Predictable Pricing
            </Badge>
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold tracking-tight text-[var(--text)]">
              Start free. Upgrade as your{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--primary)] via-[var(--cyan)] to-[var(--secondary)]">
                revenue scales.
              </span>
            </h2>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="mt-4 text-base sm:text-lg text-[var(--text-2)] max-w-2xl mx-auto">
              No hidden platform fees, no complex enterprise contracts. Start using your AI team today with zero card required.
            </p>
          </Reveal>

          {/* Monthly / Yearly Switch */}
          <Reveal delay={0.3} className="mt-8 flex items-center justify-center gap-3">
            <span
              className={cn(
                'text-sm font-medium transition-colors cursor-pointer',
                !isYearly ? 'text-[var(--text)]' : 'text-[var(--text-3)]'
              )}
              onClick={() => setIsYearly(false)}
            >
              Monthly billing
            </span>
            <button
              type="button"
              role="switch"
              aria-checked={isYearly}
              onClick={() => setIsYearly(!isYearly)}
              className="relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-[var(--surface-2)] ring-1 ring-[var(--border)] transition-colors duration-200 ease-in-out focus-ring"
            >
              <span
                className={cn(
                  'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-[var(--primary)] shadow-md ring-0 transition duration-200 ease-in-out',
                  isYearly ? 'translate-x-5' : 'translate-x-0'
                )}
              />
            </button>
            <span
              className={cn(
                'text-sm font-medium transition-colors cursor-pointer flex items-center gap-1.5',
                isYearly ? 'text-[var(--text)]' : 'text-[var(--text-3)]'
              )}
              onClick={() => setIsYearly(true)}
            >
              Yearly billing
              <Badge variant="outline" className="text-[10px] text-[var(--primary)] border-[var(--primary)]/30 bg-[var(--primary)]/10 font-mono">
                Save 2 months
              </Badge>
            </span>
          </Reveal>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch max-w-6xl mx-auto">
          {tiers.map((tier, idx) => {
            const price = isYearly ? tier.priceYearly : tier.priceMonthly;
            const formattedPrice = formatCurrency(price, { maximumFractionDigits: 0 });

            if (tier.isPopular) {
              return (
                <Reveal key={tier.name} delay={idx * 0.1} className="h-full">
                  <AnimatedBorder containerClassName="h-full rounded-2xl shadow-xl shadow-[var(--primary)]/5" className="h-full p-8 flex flex-col justify-between bg-[var(--surface)]">
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <span className="font-display text-lg font-bold text-[var(--text)]">{tier.name}</span>
                        <Badge className="bg-[var(--gold)]/20 text-[var(--gold)] border-[var(--gold)]/40 text-xs font-semibold">
                          <Sparkles className="w-3 h-3 mr-1" />
                          {tier.badge}
                        </Badge>
                      </div>

                      <div className="mb-4">
                        <div className="flex items-baseline gap-1">
                          <span className="text-4xl sm:text-5xl font-display font-extrabold text-[var(--text)] font-mono tabular-nums">
                            {formattedPrice}
                          </span>
                          <span className="text-xs text-[var(--text-3)] font-mono">{tier.periodText}</span>
                        </div>
                        {isYearly && (
                          <p className="text-[11px] font-mono text-[var(--primary)] mt-1">
                            Billed as {formatCurrency(tier.priceYearly * 12, { maximumFractionDigits: 0 })} annually
                          </p>
                        )}
                      </div>

                      <p className="text-xs text-[var(--text-2)] mb-6 leading-relaxed">{tier.description}</p>

                      <div className="border-t border-[var(--border)] pt-6 mb-8">
                        <p className="text-xs font-mono font-medium text-[var(--text-3)] uppercase tracking-wider mb-3">
                          Included capabilities
                        </p>
                        <ul className="space-y-3">
                          {tier.features.map((feature) => (
                            <li key={feature} className="flex items-start text-xs sm:text-sm text-[var(--text-2)]">
                              <Check className="w-4 h-4 text-[var(--primary)] mr-2.5 shrink-0 mt-0.5" />
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div>
                      <Button
                        variant="secondary"
                        disabled={tier.isComingSoon}
                        className="w-full font-semibold bg-[var(--surface-2)] text-[var(--text-3)] border-[var(--border)] cursor-not-allowed opacity-80"
                      >
                        {tier.ctaText}
                      </Button>
                      <p className="text-[11px] text-center text-[var(--text-3)] mt-2.5 font-mono">
                        Billing infrastructure releasing in Q1
                      </p>
                    </div>
                  </AnimatedBorder>
                </Reveal>
              );
            }

            return (
              <Reveal key={tier.name} delay={idx * 0.1} className="h-full">
                <div className="h-full rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-8 flex flex-col justify-between hover:border-[var(--border)]/80 transition-all duration-200">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="font-display text-lg font-bold text-[var(--text)]">{tier.name}</span>
                      <Badge variant="outline" className="text-xs text-[var(--text-3)] border-[var(--border)]">
                        {tier.badge}
                      </Badge>
                    </div>

                    <div className="mb-4">
                      <div className="flex items-baseline gap-1">
                        <span className="text-4xl sm:text-5xl font-display font-extrabold text-[var(--text)] font-mono tabular-nums">
                          {formattedPrice}
                        </span>
                        <span className="text-xs text-[var(--text-3)] font-mono">{tier.periodText}</span>
                      </div>
                      {isYearly && tier.priceYearly > 0 && (
                        <p className="text-[11px] font-mono text-[var(--primary)] mt-1">
                          Billed as {formatCurrency(tier.priceYearly * 12, { maximumFractionDigits: 0 })} annually
                        </p>
                      )}
                    </div>

                    <p className="text-xs text-[var(--text-2)] mb-6 leading-relaxed">{tier.description}</p>

                    <div className="border-t border-[var(--border)] pt-6 mb-8">
                      <p className="text-xs font-mono font-medium text-[var(--text-3)] uppercase tracking-wider mb-3">
                        Included capabilities
                      </p>
                      <ul className="space-y-3">
                        {tier.features.map((feature) => (
                          <li key={feature} className="flex items-start text-xs sm:text-sm text-[var(--text-2)]">
                            <Check className="w-4 h-4 text-[var(--primary)] mr-2.5 shrink-0 mt-0.5" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div>
                    {tier.isComingSoon ? (
                      <div>
                        <Button
                          variant="secondary"
                          disabled
                          className="w-full font-semibold bg-[var(--surface-2)] text-[var(--text-3)] border-[var(--border)] cursor-not-allowed opacity-80"
                        >
                          {tier.ctaText}
                        </Button>
                        <p className="text-[11px] text-center text-[var(--text-3)] mt-2.5 font-mono">
                          Billing infrastructure releasing in Q1
                        </p>
                      </div>
                    ) : (
                      <div>
                        <Button asChild className="w-full font-semibold bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] text-[var(--primary-ink)] hover:opacity-90 transition-opacity">
                          <Link to="/signup" search={{}}>
                            {tier.ctaText}
                          </Link>
                        </Button>
                        <p className="text-[11px] text-center text-[var(--text-3)] mt-2.5 font-mono">
                          No credit card required
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
