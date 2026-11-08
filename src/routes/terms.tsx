import React from 'react';
import { createFileRoute, Link } from '@tanstack/react-router';
import { ArrowLeft } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export const Route = createFileRoute('/terms')({
  component: TermsPage,
});

function TermsPage() {
  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] selection:bg-[var(--primary)]/20 selection:text-[var(--primary)]">
      {/* Top Bar */}
      <header className="border-b border-[var(--border)] bg-[var(--surface)]/80 backdrop-blur-xl sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-[var(--text-2)] hover:text-[var(--text)] transition-colors focus-ring rounded-lg px-2 py-1"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Cadre</span>
          </Link>
          <div className="flex items-center gap-2">
            <img src="/logo-mark.svg" alt="Cadre" className="w-6 h-6 rounded-md" />
            <span className="font-display font-bold text-sm">Cadre</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-12 md:py-20">
        <div className="space-y-4 mb-10">
          <Badge variant="outline" className="border-[var(--primary)]/30 text-[var(--primary)] bg-[var(--primary)]/5 font-mono text-xs">
            Legal Agreement
          </Badge>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold tracking-tight text-[var(--text)]">
            Terms of Service
          </h1>
          <p className="text-sm font-mono text-[var(--text-3)]">
            Last updated: November 8, 2026 • Effective immediately
          </p>
        </div>

        <div className="prose prose-invert max-w-none space-y-10 text-sm sm:text-base text-[var(--text-2)] leading-relaxed">
          <section className="space-y-3 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6 md:p-8">
            <h2 className="text-xl font-display font-semibold text-[var(--text)] flex items-center gap-2">
              <span className="text-[var(--primary)] font-mono text-sm">01.</span>
              Acceptance of Terms
            </h2>
            <p>
              By accessing or using Cadre (&ldquo;the Service&rdquo;), operated by <span className="text-[var(--gold)] font-mono">Cadre TA</span> (&ldquo;we&rdquo;, &ldquo;us&rdquo;, or &ldquo;our&rdquo;), you agree to be bound by these Terms of Service. If you are entering into these terms on behalf of a company, organization, or other legal entity, you represent and warrant that you possess the authority to bind such entity. If you do not agree to these terms, you must not access or use the Service.
            </p>
          </section>

          <section className="space-y-3 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6 md:p-8">
            <h2 className="text-xl font-display font-semibold text-[var(--text)] flex items-center gap-2">
              <span className="text-[var(--primary)] font-mono text-sm">02.</span>
              The Cadre Service & Autonomous AI Agents
            </h2>
            <p>
              Cadre is an autonomous revenue intelligence software platform designed to assist sales, commercial, and executive teams. Our services include automated lead intent scoring, churn risk detection, meeting transcription analysis, competitor battlecards, pipeline forecasting, and executive synthesis powered by Google Gemini foundation models.
            </p>
            <p className="text-xs sm:text-sm text-[var(--text-3)] bg-[var(--surface-2)] p-4 rounded-lg border border-[var(--border)]">
              <strong className="text-[var(--text)]">AI Output Disclaimer:</strong> Outputs produced by Cadre&apos;s AI agents represent algorithmic probability models and predictive suggestions. They are provided as decision-support tooling. You and your organization maintain sole responsibility for business decisions, contractual negotiations, customer communications, and financial decisions based upon agent recommendations.
            </p>
          </section>

          <section className="space-y-3 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6 md:p-8">
            <h2 className="text-xl font-display font-semibold text-[var(--text)] flex items-center gap-2">
              <span className="text-[var(--primary)] font-mono text-sm">03.</span>
              User Accounts & Multi-Tenant Isolation
            </h2>
            <p>
              You must register for an account using valid credentials to access the Service. You are responsible for safeguarding your authentication credentials and maintaining the confidentiality of your workspace. Each Cadre workspace is partitioned with PostgreSQL Row-Level Security (RLS) to enforce tenant boundary isolation. You agree not to attempt to circumvent, probe, or compromise tenant isolation mechanisms.
            </p>
          </section>

          <section className="space-y-3 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6 md:p-8">
            <h2 className="text-xl font-display font-semibold text-[var(--text)] flex items-center gap-2">
              <span className="text-[var(--primary)] font-mono text-sm">04.</span>
              Acceptable Use Policy
            </h2>
            <p>You agree not to use the Service to:</p>
            <ul className="list-disc pl-6 space-y-1.5 text-xs sm:text-sm">
              <li>Transmit unlawful, defamatory, harassing, or fraudulent commercial materials.</li>
              <li>Perform adversarial prompt injection attacks or attempt to extract underlying system prompts.</li>
              <li>Reverse engineer, decompile, or copy proprietary application code, heuristics, or database schemas.</li>
              <li>Exceed, bypass, or spoof rate limiting or daily AI usage quotas.</li>
              <li>Scrape or harvest data from Cadre without prior written authorization.</li>
            </ul>
          </section>

          <section className="space-y-3 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6 md:p-8">
            <h2 className="text-xl font-display font-semibold text-[var(--text)] flex items-center gap-2">
              <span className="text-[var(--primary)] font-mono text-sm">05.</span>
              Quotas, Usage Limits & Subscriptions
            </h2>
            <p>
              The Free tier provides 40 autonomous AI analyses per calendar day (resetting daily at 00:00 UTC). Usage beyond this tier requires an active paid subscription once commercial billing is enabled. We reserve the right to throttle abusive or automated denial-of-service traffic that compromises service stability.
            </p>
          </section>

          <section className="space-y-3 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6 md:p-8">
            <h2 className="text-xl font-display font-semibold text-[var(--text)] flex items-center gap-2">
              <span className="text-[var(--primary)] font-mono text-sm">06.</span>
              Data Ownership & Intellectual Property
            </h2>
            <p>
              <strong className="text-[var(--text)]">Your Data:</strong> You retain complete ownership of all customer records, lead data, call transcripts, notes, and metrics you upload or ingest into Cadre. We claim zero ownership over your proprietary pipeline data.
            </p>
            <p>
              <strong className="text-[var(--text)]">Our IP:</strong> The Cadre interface, agent workflows, algorithms, logos, designs, and software are the exclusive intellectual property of <span className="text-[var(--gold)] font-mono">Cadre TA</span> and its licensors.
            </p>
          </section>

          <section className="space-y-3 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6 md:p-8">
            <h2 className="text-xl font-display font-semibold text-[var(--text)] flex items-center gap-2">
              <span className="text-[var(--primary)] font-mono text-sm">07.</span>
              Termination & Account Deletion
            </h2>
            <p>
              You may terminate your account at any time via your workspace settings. Upon termination or written deletion request, your workspace database records are purged in accordance with our cascading PostgreSQL database rules. We reserve the right to suspend accounts that violate our Acceptable Use policy.
            </p>
          </section>

          <section className="space-y-3 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6 md:p-8">
            <h2 className="text-xl font-display font-semibold text-[var(--text)] flex items-center gap-2">
              <span className="text-[var(--primary)] font-mono text-sm">08.</span>
              Limitation of Liability
            </h2>
            <p>
              To the maximum extent permitted by applicable law, in no event shall <span className="text-[var(--gold)] font-mono">Cadre TA</span>, its directors, employees, or partners be liable for any indirect, incidental, special, consequential, or punitive damages, including loss of profits, data, goodwill, or revenue resulting from your use of or inability to use the Service.
            </p>
          </section>

          <section className="space-y-3 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6 md:p-8">
            <h2 className="text-xl font-display font-semibold text-[var(--text)] flex items-center gap-2">
              <span className="text-[var(--primary)] font-mono text-sm">09.</span>
              Contact Information
            </h2>
            <p>
              Questions, concerns, or notices regarding these Terms of Service should be directed to:
            </p>
            <div className="mt-3 p-4 rounded-lg bg-[var(--surface-2)] border border-[var(--border)] font-mono text-xs text-[var(--text)] space-y-1">
              <p><strong className="text-[var(--primary)]">Legal Entity:</strong> <span className="text-[var(--gold)]">Cadre TA</span></p>
              <p><strong className="text-[var(--primary)]">Email:</strong> <span className="text-[var(--gold)]">ayushchaudhari2603@gmail.com</span></p>
              <p><strong className="text-[var(--primary)]">Address:</strong> <span className="text-[var(--gold)]">Nagpur, Maharashtra, India</span></p>
            </div>
          </section>
        </div>

        {/* Bottom Navigation */}
        <div className="mt-12 pt-8 border-t border-[var(--border)] flex items-center justify-between">
          <Link
            to="/privacy"
            className="text-xs sm:text-sm text-[var(--primary)] hover:underline focus-ring rounded-sm"
          >
            Read our Privacy Policy →
          </Link>
          <Link
            to="/"
            className="text-xs sm:text-sm text-[var(--text-3)] hover:text-[var(--text)] transition-colors focus-ring rounded-sm"
          >
            Return to Cadre Home
          </Link>
        </div>
      </main>
    </div>
  );
}
