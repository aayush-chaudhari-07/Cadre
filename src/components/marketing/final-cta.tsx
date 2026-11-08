import React from 'react';
import { Link } from '@tanstack/react-router';
import { ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Magnetic } from '@/components/motion/magnetic';
import { Reveal } from '@/components/motion/reveal';
import { AuroraBackground } from '@/components/motion/aurora-background';

export function FinalCta() {
  return (
    <section className="relative py-24 md:py-36 bg-[var(--bg)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="relative rounded-3xl border border-[var(--border)] overflow-hidden shadow-2xl shadow-[var(--primary)]/5">
            <AuroraBackground className="py-20 md:py-28 px-6 sm:px-12 text-center bg-[var(--surface)]">
              <div className="max-w-3xl mx-auto">
                <Badge
                  variant="outline"
                  className="mb-6 border-[var(--primary)]/40 text-[var(--primary)] bg-[var(--primary)]/10 font-mono text-xs px-3.5 py-1"
                >
                  <Sparkles className="w-3.5 h-3.5 mr-1.5" />
                  Ready in under 2 minutes
                </Badge>

                <h2 className="text-3xl sm:text-5xl lg:text-6xl font-display font-extrabold tracking-tight text-[var(--text)] mb-6">
                  Put your AI team to{' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--primary)] via-[var(--cyan)] to-[var(--secondary)]">
                    work today.
                  </span>
                </h2>

                <p className="text-base sm:text-xl text-[var(--text-2)] max-w-2xl mx-auto mb-10 leading-relaxed">
                  Join forward-looking revenue leaders automating pipeline scoring, customer retention, and strategic battlecards.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
                  <Magnetic strength={12}>
                    <Button
                      asChild
                      size="lg"
                      className="w-full sm:w-auto h-12 px-8 text-base font-semibold bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] text-[var(--primary-ink)] hover:opacity-95 shadow-lg shadow-[var(--primary)]/20 transition-all duration-200"
                    >
                      <Link to="/signup" search={{}}>
                        Start free
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Link>
                    </Button>
                  </Magnetic>
                  <Button
                    asChild
                    variant="ghost"
                    size="lg"
                    className="w-full sm:w-auto h-12 px-6 text-sm text-[var(--text-2)] hover:text-[var(--text)] hover:bg-[var(--surface-2)]"
                  >
                    <a href="#demo">Explore interactive sample</a>
                  </Button>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-[var(--text-3)] font-mono">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-[var(--primary)]" />
                    <span>No credit card required</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-[var(--primary)]" />
                    <span>40 free daily analyses</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-[var(--primary)]" />
                    <span>PostgreSQL RLS security</span>
                  </div>
                </div>
              </div>
            </AuroraBackground>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

