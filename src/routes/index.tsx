import React, { useEffect } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import Lenis from 'lenis';
import { useReducedMotion } from '@/hooks/use-reduced-motion';
import { ScrollProgress } from '@/components/motion/scroll-progress';
import {
  Nav,
  Hero,
  BuiltWith,
  ProblemStats,
  Bento,
  AgentOrbit,
  Demo,
  HowItWorks,
  PricingSection,
  Faq,
  FinalCta,
  Footer,
} from '@/components/marketing';

export const Route = createFileRoute('/')({
  component: LandingPage,
});

function LandingPage() {
  const shouldReduce = useReducedMotion();

  // Initialize Lenis smooth scroll on landing page only; destroy on unmount; bypass if reduced motion
  useEffect(() => {
    if (shouldReduce) return;

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    let animationFrameId: number;

    function raf(time: number) {
      lenis.raf(time);
      animationFrameId = requestAnimationFrame(raf);
    }

    animationFrameId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(animationFrameId);
      lenis.destroy();
    };
  }, [shouldReduce]);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Cadre',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    description:
      'The AI team that runs your revenue. Autonomous agents that score leads, analyze meetings, spot churn, track competitors, forecast revenue and plan growth.',
  };

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] selection:bg-[var(--primary)]/20 selection:text-[var(--primary)] flex flex-col">
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Top 2px Scroll Progress Bar */}
      <ScrollProgress />

      {/* Fixed Sticky Nav Bar */}
      <Nav />

      {/* Landing Main Sections */}
      <main id="main-content" className="flex-1">
        <Hero />
        <BuiltWith />
        <ProblemStats />
        <Bento />
        <AgentOrbit />
        <Demo />
        <HowItWorks />
        <PricingSection />
        <Faq />
        <FinalCta />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
