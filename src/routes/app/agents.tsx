import React from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { Bot, Sparkles } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

export const Route = createFileRoute('/app/agents')({
  component: AgentsPage,
});

function AgentsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <h1 className="font-heading text-2xl sm:text-3xl font-bold tracking-tight text-[var(--text)]">
              Agent Roster &amp; Activity
            </h1>
            <Badge variant="default">6 Agents Active</Badge>
          </div>
          <p className="text-sm text-[var(--text-muted)]">
            Configure autonomy levels (off, suggest, auto) and review the unified audit log of agent runs.
          </p>
        </div>
      </div>

      <Card className="glass border-[var(--border)]">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Bot className="w-4 h-4 text-[var(--primary)]" />
            <span>Agent Operations Center</span>
          </CardTitle>
          <CardDescription>
            Autonomy sliders, individual agent prompt guidelines, and full audit logs from agent_runs arriving in Prompt 13.
          </CardDescription>
        </CardHeader>
        <CardContent className="py-12 flex flex-col items-center justify-center text-center">
          <div className="w-12 h-12 rounded-2xl bg-[var(--primary)]/10 border border-[var(--primary)]/20 flex items-center justify-center text-[var(--primary)] mb-3">
            <Sparkles className="w-6 h-6 animate-pulse" />
          </div>
          <p className="text-sm font-medium text-[var(--text)]">Cadre Roster Initialized</p>
          <p className="text-xs text-[var(--text-muted)] max-w-sm mt-1">
            Navigation verified. Ready for full feature implementation in upcoming milestone.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

