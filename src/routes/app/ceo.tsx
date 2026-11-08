import React from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { Crown, Sparkles } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

export const Route = createFileRoute('/app/ceo')({
  component: CeoPage,
});

function CeoPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <h1 className="font-heading text-2xl sm:text-3xl font-bold tracking-tight text-[var(--text)]">
              AI CEO Console
            </h1>
            <Badge variant="gold">Chief Executive Intelligence</Badge>
          </div>
          <p className="text-sm text-[var(--text-muted)]">
            Delegate high-level strategic objectives; the AI CEO coordinates all 5 operational agents to execute the plan.
          </p>
        </div>
      </div>

      <Card className="glass border-[var(--border)]">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Crown className="w-4 h-4 text-[var(--gold)]" />
            <span>Strategic Planning Terminal</span>
          </CardTitle>
          <CardDescription>
            Natural language objective execution, inter-agent orchestration plans, and approved plan tracking arriving in Prompt 13.
          </CardDescription>
        </CardHeader>
        <CardContent className="py-12 flex flex-col items-center justify-center text-center">
          <div className="w-12 h-12 rounded-2xl bg-[var(--gold)]/10 border border-[var(--gold)]/20 flex items-center justify-center text-[var(--gold)] mb-3">
            <Sparkles className="w-6 h-6 animate-pulse text-[var(--gold)]" />
          </div>
          <p className="text-sm font-medium text-[var(--text)]">CEO Console Online</p>
          <p className="text-xs text-[var(--text-muted)] max-w-sm mt-1">
            Navigation verified. Ready for full feature implementation in upcoming milestone.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

