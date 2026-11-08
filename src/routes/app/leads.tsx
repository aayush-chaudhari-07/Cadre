import React from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { Target, Sparkles } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

export const Route = createFileRoute('/app/leads')({
  component: LeadsPage,
});

function LeadsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <h1 className="font-heading text-2xl sm:text-3xl font-bold tracking-tight text-[var(--text)]">
              Lead Intelligence
            </h1>
            <Badge variant="default">AI Sales Manager</Badge>
          </div>
          <p className="text-sm text-[var(--text-muted)]">
            Score leads, analyze buying intent, and draft personalized follow-ups with Gemini.
          </p>
        </div>
      </div>

      <Card className="glass border-[var(--border)]">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Target className="w-4 h-4 text-[var(--primary)]" />
            <span>Lead Intelligence Workspace</span>
          </CardTitle>
          <CardDescription>
            The full interactive table, CSV importer, lead drawer, and Gemini lead scoring will be activated in Prompt 8.
          </CardDescription>
        </CardHeader>
        <CardContent className="py-12 flex flex-col items-center justify-center text-center">
          <div className="w-12 h-12 rounded-2xl bg-[var(--primary)]/10 border border-[var(--primary)]/20 flex items-center justify-center text-[var(--primary)] mb-3">
            <Sparkles className="w-6 h-6 animate-pulse" />
          </div>
          <p className="text-sm font-medium text-[var(--text)]">Sales Agent Ready</p>
          <p className="text-xs text-[var(--text-muted)] max-w-sm mt-1">
            Navigation verified. Ready for full feature implementation in upcoming milestone.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
