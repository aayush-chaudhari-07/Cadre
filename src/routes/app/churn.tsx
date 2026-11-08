import React from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { ShieldAlert, Sparkles } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

export const Route = createFileRoute('/app/churn')({
  component: ChurnPage,
});

function ChurnPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <h1 className="font-heading text-2xl sm:text-3xl font-bold tracking-tight text-[var(--text)]">
              Churn Guard
            </h1>
            <Badge variant="warning">AI Support Manager</Badge>
          </div>
          <p className="text-sm text-[var(--text-muted)]">
            Detect early account degradation, calculate MRR-at-risk, and generate retention battle plans.
          </p>
        </div>
      </div>

      <Card className="glass border-[var(--border)]">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-[var(--warning)]" />
            <span>Customer Health &amp; Retention Hub</span>
          </CardTitle>
          <CardDescription>
            Account risk tiers, real-time MRR-at-risk calculations, and automated retention messaging arriving in Prompt 10.
          </CardDescription>
        </CardHeader>
        <CardContent className="py-12 flex flex-col items-center justify-center text-center">
          <div className="w-12 h-12 rounded-2xl bg-[var(--warning)]/10 border border-[var(--warning)]/20 flex items-center justify-center text-[var(--warning)] mb-3">
            <Sparkles className="w-6 h-6 animate-pulse" />
          </div>
          <p className="text-sm font-medium text-[var(--text)]">Customer Success Agent Ready</p>
          <p className="text-xs text-[var(--text-muted)] max-w-sm mt-1">
            Navigation verified. Ready for full feature implementation in upcoming milestone.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
