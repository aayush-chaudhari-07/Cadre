import React from 'react';
import { Link } from '@tanstack/react-router';
import { AuroraBackground } from '@/components/motion/aurora-background';
import { AgentOrbitVisual } from './agent-orbit-visual';

interface AuthLayoutProps {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export function AuthLayout({ title, subtitle, children, footer }: AuthLayoutProps) {
  return (
    <div className="min-h-screen w-full flex bg-[var(--background)] text-[var(--text)]">
      {/* Left Column: Form & Action */}
      <div className="w-full lg:w-1/2 flex flex-col justify-between p-6 sm:p-10 lg:p-14 z-10 relative">
        {/* Top Header / Logo */}
        <header className="flex items-center justify-between">
          <Link
            to="/"
            className="flex items-center gap-3 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] rounded-lg p-1"
          >
            <img
              src="/logo-mark.svg"
              alt="Cadre logo"
              className="w-9 h-9 rounded-xl transition-transform group-hover:scale-105"
            />
            <span className="font-heading font-bold text-xl tracking-tight text-[var(--text)]">
              Cadre
            </span>
          </Link>
        </header>

        {/* Center: Glass Card with Form */}
        <main className="my-auto py-8 flex flex-col items-center justify-center">
          <div className="w-full max-w-md">
            <div className="glass rounded-2xl p-7 sm:p-9 shadow-2xl border border-[var(--border)] relative overflow-hidden">
              {/* Subtle top aurora highlight bar */}
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[var(--primary)] via-[var(--cyan)] to-[var(--gold)] opacity-80" />

              <div className="mb-6">
                <h1 className="font-heading text-2xl sm:text-3xl font-bold tracking-tight text-[var(--text)]">
                  {title}
                </h1>
                <p className="text-sm text-[var(--text-muted)] mt-1.5 leading-relaxed">
                  {subtitle}
                </p>
              </div>

              {children}

              {footer && (
                <div className="mt-6 pt-6 border-t border-[var(--border)] text-center text-sm text-[var(--text-muted)]">
                  {footer}
                </div>
              )}
            </div>
          </div>
        </main>

        {/* Bottom Micro Footer */}
        <footer className="text-xs text-[var(--text-muted)] text-center lg:text-left flex items-center justify-center lg:justify-between flex-wrap gap-4">
          <span>&copy; {new Date().getFullYear()} Cadre Inc. All rights reserved.</span>
          <div className="flex gap-4">
            <Link to="/terms" className="hover:text-[var(--text)] underline-offset-4 hover:underline">
              Terms
            </Link>
            <Link to="/privacy" className="hover:text-[var(--text)] underline-offset-4 hover:underline">
              Privacy
            </Link>
          </div>
        </footer>
      </div>

      {/* Right Column: Visual Showcase (hidden on mobile, visible lg+) */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-[var(--surface-1)] border-l border-[var(--border)] overflow-hidden items-center justify-center p-12">
        <AuroraBackground className="absolute inset-0 opacity-40 pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center text-center max-w-lg">
          <AgentOrbitVisual />

          <div className="mt-8 space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-[var(--surface-2)] border border-[var(--border)] text-[var(--primary)]">
              <span className="w-2 h-2 rounded-full bg-[var(--primary)] animate-pulse" />
              Autonomous Revenue Engine
            </div>

            <h2 className="font-heading text-2xl font-bold tracking-tight text-[var(--text)]">
              The AI team that runs your revenue
            </h2>

            <p className="text-sm text-[var(--text-muted)] leading-relaxed">
              Six specialized AI agents working around the clock to qualify leads, analyze meetings,
              guard against churn, and forecast growth.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
