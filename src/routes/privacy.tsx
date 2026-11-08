import React from 'react';
import { createFileRoute, Link } from '@tanstack/react-router';
import { ArrowLeft } from 'lucide-react';

export const Route = createFileRoute('/privacy')({
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--text)] p-6 sm:p-12 max-w-3xl mx-auto">
      <Link to="/" className="inline-flex items-center gap-2 text-sm text-[var(--text-muted)] hover:text-[var(--text)] mb-8">
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Home</span>
      </Link>
      <h1 className="font-heading text-3xl font-bold mb-4">Privacy Policy</h1>
      <p className="text-sm text-[var(--text-muted)] leading-relaxed">
        Cadre Privacy Policy placeholder. Full legal document will be assembled in Prompt 6.
      </p>
    </div>
  );
}
