import React from 'react';
import { HelpCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion';
import { Reveal } from '@/components/motion/reveal';

const FAQS = [
  {
    id: 'free-tier',
    question: 'What are the limits of the Free tier?',
    answer:
      'Every user on the Free tier receives 40 autonomous AI analyses each day at zero cost. This grants full access to all six specialized revenue agents (Lead qualification, Churn risk, Meeting analysis, Competitor battlecards, Cash flow velocity, and AI CEO daily syntheses). The 40-credit quota resets automatically every day at midnight UTC.',
  },
  {
    id: 'data-privacy',
    question: 'How does Cadre protect our business and customer data?',
    answer:
      'Multi-tenant security is enforced at the PostgreSQL database engine level using strict Row-Level Security (RLS). Every query is cryptographically bound to your authenticated organization ID, ensuring zero cross-tenant data leakage. Additionally, your proprietary pipeline data is never shared with third parties or used to train public foundation models.',
  },
  {
    id: 'ai-models',
    question: 'Which AI foundation models power the agents?',
    answer:
      'Cadre is built on Google Gemini 2.5 Flash through isolated serverless Supabase Edge Functions. Gemini provides high-reasoning commercial synthesis with sub-15s response latency. The Gemini API key resides solely within encrypted Edge secrets and is never exposed in browser bundles or git repositories.',
  },
  {
    id: 'export-data',
    question: 'Can I export or delete my organization data at any time?',
    answer:
      'Yes, 100%. You maintain full ownership of all ingested leads, transcripts, notes, and agent outputs. You can export leads and analyses to CSV at any time. When you remove a contact or close an organization, PostgreSQL foreign key constraints ensure complete, irreversible cascading deletion.',
  },
  {
    id: 'roadmap',
    question: 'What CRM integrations and roadmap features are coming next?',
    answer:
      'Direct two-way synchronization with HubSpot, Salesforce, and Apollo is in active development, alongside automated Slack alerts for high-priority CEO action items. We are also rolling out custom agent instruction tuning so your agents reflect your exact tone and qualification criteria.',
  },
];

export function Faq() {
  return (
    <section id="faq" className="relative py-24 md:py-36 border-t border-[var(--border)] bg-[var(--bg)]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <Reveal>
            <Badge variant="outline" className="mb-4 border-[var(--primary)]/30 text-[var(--primary)] bg-[var(--primary)]/5">
              <HelpCircle className="w-3.5 h-3.5 mr-1.5" />
              Frequently Asked Questions
            </Badge>
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold tracking-tight text-[var(--text)]">
              Everything you need to know about{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)]">
                Cadre
              </span>
            </h2>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="mt-4 text-base sm:text-lg text-[var(--text-2)] max-w-2xl mx-auto">
              Real answers about security, quotas, AI execution, and data sovereignty.
            </p>
          </Reveal>
        </div>

        {/* Accordion */}
        <Reveal delay={0.3}>
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 md:p-8">
            <Accordion type="single" collapsible className="w-full space-y-2">
              {FAQS.map((faq) => (
                <AccordionItem key={faq.id} value={faq.id} className="border-[var(--border)]/70 last:border-b-0">
                  <AccordionTrigger className="text-base sm:text-lg font-display font-semibold text-[var(--text)] py-5 hover:no-underline">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-sm sm:text-base text-[var(--text-2)] leading-relaxed pb-6">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

