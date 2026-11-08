import React from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { Video, Sparkles } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

export const Route = createFileRoute('/app/meetings')({
  component: MeetingsPage,
});

function MeetingsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <h1 className="font-heading text-2xl sm:text-3xl font-bold tracking-tight text-[var(--text)]">
              Meeting Analyzer
            </h1>
            <Badge variant="info">AI Operations Manager</Badge>
          </div>
          <p className="text-sm text-[var(--text-muted)]">
            Extract action items, objection analysis, sentiment, and deal health from sales calls.
          </p>
        </div>
      </div>

      <Card className="glass border-[var(--border)]">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Video className="w-4 h-4 text-[var(--cyan)]" />
            <span>Meeting Intelligence Workspace</span>
          </CardTitle>
          <CardDescription>
            Transcript upload (.vtt, .srt, .txt), objection detection, and automatic action item assignment arriving in Prompt 9.
          </CardDescription>
        </CardHeader>
        <CardContent className="py-12 flex flex-col items-center justify-center text-center">
          <div className="w-12 h-12 rounded-2xl bg-[var(--cyan)]/10 border border-[var(--cyan)]/20 flex items-center justify-center text-[var(--cyan)] mb-3">
            <Sparkles className="w-6 h-6 animate-pulse" />
          </div>
          <p className="text-sm font-medium text-[var(--text)]">Operations Agent Ready</p>
          <p className="text-xs text-[var(--text-muted)] max-w-sm mt-1">
            Navigation verified. Ready for full feature implementation in upcoming milestone.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
