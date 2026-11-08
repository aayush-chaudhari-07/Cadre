import React from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { Compass, Sparkles } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

export const Route = createFileRoute('/app/competitors')({
  component: CompetitorsPage,
});

function CompetitorsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <h1 className="font-heading text-2xl sm:text-3xl font-bold tracking-tight text-[var(--text)]">
              Competitor Radar
            </h1>
            <Badge variant="secondary">AI Marketing Manager</Badge>
          </div>
          <p className="text-sm text-[var(--text-muted)]">
            Scan competitors, track pricing shifts, and produce instant battlecards with SSRF-safe analysis.
          </p>
        </div>
      </div>

      <Card className="glass border-[var(--border)]">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Compass className="w-4 h-4 text-[var(--secondary)]" />
            <span>Market Intelligence &amp; Battlecards</span>
          </CardTitle>
          <CardDescription>
            Live public site crawler with strict SSRF defense, automated feature matrices, and counter-positioning arriving in Prompt 11.
          </CardDescription>
        </CardHeader>
        <CardContent className="py-12 flex flex-col items-center justify-center text-center">
          <div className="w-12 h-12 rounded-2xl bg-[var(--secondary)]/10 border border-[var(--secondary)]/20 flex items-center justify-center text-[var(--secondary)] mb-3">
            <Sparkles className="w-6 h-6 animate-pulse" />
          </div>
          <p className="text-sm font-medium text-[var(--text)]">Marketing Intelligence Agent Ready</p>
          <p className="text-xs text-[var(--text-muted)] max-w-sm mt-1">
            Navigation verified. Ready for full feature implementation in upcoming milestone.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

