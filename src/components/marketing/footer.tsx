import React from 'react';
import { Link } from '@tanstack/react-router';
import { Heart } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-[var(--border)] bg-[var(--surface)] text-[var(--text-2)] text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8">
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-4">
            <Link
              to="/"
              className="inline-flex items-center gap-3 focus-ring rounded-lg"
            >
              <img src="/logo-mark.svg" alt="Cadre logo" className="w-8 h-8 rounded-xl" />
              <span className="font-display font-bold text-xl tracking-tight text-[var(--text)]">
                Cadre
              </span>
            </Link>
            <p className="text-sm text-[var(--text-2)] max-w-sm leading-relaxed">
              The AI team that runs your revenue. Autonomous agents that score leads, analyze meetings, spot churn, track competitors, forecast revenue, and plan growth.
            </p>
            <div className="flex items-center gap-2 pt-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono font-medium bg-[var(--primary)]/10 text-[var(--primary)] border border-[var(--primary)]/20">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--primary)] animate-pulse" />
                Gemini 2.5 Engine Online
              </span>
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h3 className="font-display text-xs font-semibold uppercase tracking-wider text-[var(--text)] mb-4">
              Product
            </h3>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              <li>
                <a href="/#features" className="hover:text-[var(--text)] transition-colors focus-ring rounded-sm">
                  Feature Bento
                </a>
              </li>
              <li>
                <a href="/#agents" className="hover:text-[var(--text)] transition-colors focus-ring rounded-sm">
                  Autonomous Agents
                </a>
              </li>
              <li>
                <a href="/#demo" className="hover:text-[var(--text)] transition-colors focus-ring rounded-sm">
                  Interactive Demo
                </a>
              </li>
              <li>
                <a href="/#how-it-works" className="hover:text-[var(--text)] transition-colors focus-ring rounded-sm">
                  How It Works
                </a>
              </li>
              <li>
                <Link to="/pricing" className="hover:text-[var(--text)] transition-colors focus-ring rounded-sm">
                  Pricing Plans
                </Link>
              </li>
              <li>
                <a href="/#faq" className="hover:text-[var(--text)] transition-colors focus-ring rounded-sm">
                  Frequently Asked Questions
                </a>
              </li>
            </ul>
          </div>

          {/* Specialized Agents */}
          <div>
            <h3 className="font-display text-xs font-semibold uppercase tracking-wider text-[var(--text)] mb-4">
              AI Agents
            </h3>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              <li className="text-[var(--text-3)]">AI Sales (Lead Qualification)</li>
              <li className="text-[var(--text-3)]">AI Support (Churn Detection)</li>
              <li className="text-[var(--text-3)]">AI Operations (Meeting Intel)</li>
              <li className="text-[var(--text-3)]">AI Marketing (Competitors)</li>
              <li className="text-[var(--text-3)]">AI Finance (Revenue Flow)</li>
              <li className="text-[var(--text-3)]">AI CEO (Executive Synthesis)</li>
            </ul>
          </div>

          {/* Legal & Security */}
          <div>
            <h3 className="font-display text-xs font-semibold uppercase tracking-wider text-[var(--text)] mb-4">
              Trust & Legal
            </h3>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              <li>
                <Link to="/terms" className="hover:text-[var(--text)] transition-colors focus-ring rounded-sm">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-[var(--text)] transition-colors focus-ring rounded-sm">
                  Privacy Policy
                </Link>
              </li>
              <li className="text-[var(--text-3)]">PostgreSQL RLS Security</li>
              <li className="text-[var(--text-3)]">Serverless Edge Isolation</li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-[var(--border)] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[var(--text-3)]">
          <p>© {currentYear} Cadre. All rights reserved.</p>
          <p className="flex items-center gap-1.5 font-mono">
            <span>Made with care in India</span>
            <Heart className="w-3.5 h-3.5 text-[var(--danger)] fill-[var(--danger)]" />
          </p>
        </div>
      </div>
    </footer>
  );
}

