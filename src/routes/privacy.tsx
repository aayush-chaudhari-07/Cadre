import React from 'react';
import { createFileRoute, Link } from '@tanstack/react-router';
import { ArrowLeft } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export const Route = createFileRoute('/privacy')({
  component: PrivacyPage,
});

function PrivacyPage() {
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
            Privacy & Trust
          </Badge>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold tracking-tight text-[var(--text)]">
            Privacy Policy
          </h1>
          <p className="text-sm font-mono text-[var(--text-3)]">
            Last updated: November 8, 2026 • Effective immediately
          </p>
        </div>

        <div className="prose prose-invert max-w-none space-y-10 text-sm sm:text-base text-[var(--text-2)] leading-relaxed">
          <section className="space-y-3 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6 md:p-8">
            <h2 className="text-xl font-display font-semibold text-[var(--text)] flex items-center gap-2">
              <span className="text-[var(--primary)] font-mono text-sm">01.</span>
              Our Privacy Commitment
            </h2>
            <p>
              At Cadre, operated by <span className="text-[var(--gold)] font-mono">[YOUR COMPANY NAME]</span> (&ldquo;we&rdquo;, &ldquo;us&rdquo;, or &ldquo;our&rdquo;), we believe enterprise privacy is not optional. This Privacy Policy details the exact types of data we collect, how it is processed by our autonomous AI agents, and how your proprietary sales pipeline remains strictly isolated under PostgreSQL Row-Level Security.
            </p>
          </section>

          <section className="space-y-3 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6 md:p-8">
            <h2 className="text-xl font-display font-semibold text-[var(--text)] flex items-center gap-2">
              <span className="text-[var(--primary)] font-mono text-sm">02.</span>
              Information We Collect
            </h2>
            <p>We collect and process the following categories of data when you utilize Cadre:</p>
            <ul className="list-disc pl-6 space-y-2 text-xs sm:text-sm">
              <li>
                <strong className="text-[var(--text)]">Authentication Data:</strong> Your name, business email address, hashed passwords, and authentication tokens provided via Supabase Auth or Google OAuth.
              </li>
              <li>
                <strong className="text-[var(--text)]">Commercial Pipeline Data:</strong> Ingested leads, contact emails, deal stages, contract amounts, meeting notes, call transcripts, and customer interaction logs that you manually submit or import via CSV.
              </li>
              <li>
                <strong className="text-[var(--text)]">AI Execution Metrics:</strong> Daily analysis counts, processing latencies, and token usage stored in your workspace&apos;s <code className="font-mono text-xs text-[var(--primary)]">ai_usage</code> ledger.
              </li>
              <li>
                <strong className="text-[var(--text)]">Device & Log Telemetry:</strong> Anonymized HTTP request headers, IP addresses, browser types, and system logs necessary to maintain infrastructure stability and mitigate abuse.
              </li>
            </ul>
          </section>

          <section className="space-y-3 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6 md:p-8">
            <h2 className="text-xl font-display font-semibold text-[var(--text)] flex items-center gap-2">
              <span className="text-[var(--primary)] font-mono text-sm">03.</span>
              AI Processing & Zero Model Training Policy
            </h2>
            <p className="font-medium text-[var(--primary)]">
              Your proprietary customer data is NEVER used to train, retrain, or improve public foundation models.
            </p>
            <p>
              When an agent executes an analysis (such as lead scoring or meeting summarization), the necessary contextual data is transmitted over TLS-encrypted connections directly to Google Gemini 2.5 Flash via our isolated Supabase Edge Functions. The Gemini API key is isolated server-side. Per Google Cloud&apos;s Enterprise AI Terms, zero customer inputs sent through paid or enterprise API endpoints are retained for foundation model training.
            </p>
          </section>

          <section className="space-y-3 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6 md:p-8">
            <h2 className="text-xl font-display font-semibold text-[var(--text)] flex items-center gap-2">
              <span className="text-[var(--primary)] font-mono text-sm">04.</span>
              Database Multi-Tenancy & Row-Level Security
            </h2>
            <p>
              Cadre is architected with strict multi-tenant boundary isolation. Every business database table (<code className="font-mono text-xs text-[var(--primary)]">leads</code>, <code className="font-mono text-xs text-[var(--primary)]">lead_interactions</code>, <code className="font-mono text-xs text-[var(--primary)]">deals</code>, <code className="font-mono text-xs text-[var(--primary)]">competitors</code>, <code className="font-mono text-xs text-[var(--primary)]">meetings</code>, <code className="font-mono text-xs text-[var(--primary)]">ai_usage</code>) is governed by PostgreSQL Row-Level Security (RLS) policies.
            </p>
            <p>
              Every database read or write strictly verifies the authenticated user&apos;s active organization membership. It is mathematically and architecturally impossible for a query from Organization A to read or modify records belonging to Organization B.
            </p>
          </section>

          <section className="space-y-3 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6 md:p-8">
            <h2 className="text-xl font-display font-semibold text-[var(--text)] flex items-center gap-2">
              <span className="text-[var(--primary)] font-mono text-sm">05.</span>
              Data Retention, Export & Permanent Deletion
            </h2>
            <p>
              You maintain total data sovereignty. You can export all leads, interactions, and forecasts at any time in CSV format. If you delete a lead, meeting, or an entire organization, our database enforces immediate, cascading deletion of all associated child records. Backups are rotated and purged on a standard 30-day lifecycle.
            </p>
          </section>

          <section className="space-y-3 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6 md:p-8">
            <h2 className="text-xl font-display font-semibold text-[var(--text)] flex items-center gap-2">
              <span className="text-[var(--primary)] font-mono text-sm">06.</span>
              Cookies & Local Storage
            </h2>
            <p>
              Cadre does not use tracking cookies or third-party marketing ad pixels. We utilize standard browser <code className="font-mono text-xs text-[var(--primary)]">localStorage</code> strictly for functional application preferences:
            </p>
            <ul className="list-disc pl-6 space-y-1 text-xs sm:text-sm">
              <li><code className="font-mono text-xs">cadre-theme</code>: Your chosen visual theme (dark, light, or system).</li>
              <li><code className="font-mono text-xs">cadre.sidebar_collapsed</code>: Your preference for the navigation sidebar collapse state.</li>
              <li>Supabase Auth session tokens: Secure session tokens for user authentication.</li>
            </ul>
          </section>

          <section className="space-y-3 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6 md:p-8">
            <h2 className="text-xl font-display font-semibold text-[var(--text)] flex items-center gap-2">
              <span className="text-[var(--primary)] font-mono text-sm">07.</span>
              Data Subject Rights (GDPR / CCPA)
            </h2>
            <p>
              Depending on your location, you may have rights under applicable privacy legislation (such as the GDPR or CCPA), including the right to request access, rectification, portability, or erasure of your personal data. To exercise any of these rights, please contact our Data Protection Officer below.
            </p>
          </section>

          <section className="space-y-3 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6 md:p-8">
            <h2 className="text-xl font-display font-semibold text-[var(--text)] flex items-center gap-2">
              <span className="text-[var(--primary)] font-mono text-sm">08.</span>
              Contact Information
            </h2>
            <p>
              If you have any questions, audit inquiries, or data privacy requests, please reach out to:
            </p>
            <div className="mt-3 p-4 rounded-lg bg-[var(--surface-2)] border border-[var(--border)] font-mono text-xs text-[var(--text)] space-y-1">
              <p><strong className="text-[var(--primary)]">Entity:</strong> <span className="text-[var(--gold)]">[YOUR COMPANY NAME]</span></p>
              <p><strong className="text-[var(--primary)]">Privacy Inquiries:</strong> <span className="text-[var(--gold)]">[YOUR EMAIL]</span></p>
              <p><strong className="text-[var(--primary)]">Postal Address:</strong> <span className="text-[var(--gold)]">[YOUR ADDRESS]</span></p>
            </div>
          </section>
        </div>

        {/* Bottom Navigation */}
        <div className="mt-12 pt-8 border-t border-[var(--border)] flex items-center justify-between">
          <Link
            to="/terms"
            className="text-xs sm:text-sm text-[var(--primary)] hover:underline focus-ring rounded-sm"
          >
            Read our Terms of Service →
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
