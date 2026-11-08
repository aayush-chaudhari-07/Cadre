import React from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { Nav } from '@/components/marketing/nav';
import { PricingSection } from '@/components/marketing/pricing-section';
import { Faq } from '@/components/marketing/faq';
import { FinalCta } from '@/components/marketing/final-cta';
import { Footer } from '@/components/marketing/footer';
import { ScrollProgress } from '@/components/motion/scroll-progress';

export const Route = createFileRoute('/pricing')({
  component: PricingPage,
});

function PricingPage() {
  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] selection:bg-[var(--primary)]/20 selection:text-[var(--primary)] flex flex-col">
      <ScrollProgress />
      <Nav />
      <main id="main-content" className="flex-1 pt-16">
        <PricingSection />
        <Faq />
        <FinalCta />
      </main>
      <Footer />
    </div>
  );
}

