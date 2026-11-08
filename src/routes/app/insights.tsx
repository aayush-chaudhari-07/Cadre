import React, { useState } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { Lightbulb, Sparkles, History, Loader2, ArrowLeft } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import {
  useTodayInsight,
  usePastInsights,
  useGenerateInsights,
  DailyBriefView,
  PastBriefsList,
  type InsightRecord,
} from '@/features/insights';
import { useAgentGate } from '@/features/agents';
import { toast } from 'sonner';
import { BrandedErrorBoundary } from '@/components/branded-error-boundary';

export const Route = createFileRoute('/app/insights')({
  component: InsightsPage,
  errorComponent: ({ error, reset }) => <BrandedErrorBoundary error={error} reset={reset} />,
});

function InsightsPage() {
  const { data: todayRecord, isLoading: isLoadingToday } = useTodayInsight();
  const { data: pastBriefs = [], isLoading: isLoadingPast } = usePastInsights();
  const generateMutation = useGenerateInsights();
  const { isEnabled: isCeoEnabled, disabledReason: ceoDisabledReason } = useAgentGate('ceo');

  const [selectedBrief, setSelectedBrief] = useState<InsightRecord | null>(null);
  const [showHistoryMobile, setShowHistoryMobile] = useState(false);

  const today = new Date().toISOString().split('T')[0] ?? '';
  const activeRecord = selectedBrief || todayRecord;

  const handleGenerateToday = async (forceRefresh = false) => {
    toast.loading('Synthesizing executive morning brief across all revenue streams...', {
      id: 'insights-gen',
    });
    try {
      const result = await generateMutation.mutateAsync({ forceRefresh });
      setSelectedBrief(null);
      toast.success(
        result.cached ? 'Loaded cached daily brief' : "Today's executive brief synthesized",
        { id: 'insights-gen' },
      );
    } catch (err) {
      toast.error(`Failed to generate brief: ${(err as Error).message}`, { id: 'insights-gen' });
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <h1 className="font-heading text-2xl sm:text-3xl font-bold tracking-tight text-[var(--text)]">
              Executive Daily Brief
            </h1>
            <Badge variant="default" className="text-xs">
              Executive Synthesis
            </Badge>
          </div>
          <p className="text-sm text-[var(--text-muted)] max-w-2xl">
            A unified morning commercial summary across deals, leads, at-risk accounts, and competitive moves.
            Archived once per day to keep executive focus clear.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {selectedBrief && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelectedBrief(null)}
              className="gap-1.5 text-xs"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Today</span>
            </Button>
          )}

          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowHistoryMobile((prev) => !prev)}
            className="lg:hidden gap-1.5 text-xs"
          >
            <History className="w-3.5 h-3.5" />
            <span>{showHistoryMobile ? 'Hide Archive' : 'Past Briefs'}</span>
          </Button>
        </div>
      </div>

      {/* Main Grid: Active Brief & Past Briefs Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Main Content Area (8 cols on desktop) */}
        <div className="lg:col-span-8 space-y-6">
          {isLoadingToday ? (
            <Card className="glass border-[var(--border)] p-8 text-center">
              <CardContent className="space-y-4 py-8">
                <Loader2 className="w-8 h-8 animate-spin text-[var(--primary)] mx-auto" />
                <p className="text-sm font-medium text-[var(--text)]">
                  Loading executive briefing...
                </p>
              </CardContent>
            </Card>
          ) : activeRecord ? (
            <DailyBriefView
              insights={activeRecord.content}
              forDate={activeRecord.for_date}
              isToday={activeRecord.for_date === today}
              onRegenerate={() => handleGenerateToday(true)}
              isRegenerating={generateMutation.isPending}
            />
          ) : (
            /* Unanalyzed State for Today */
            <Card className="glass border-[var(--primary)]/30 p-8 text-center bg-gradient-to-b from-[var(--primary)]/5 via-[var(--surface-raised)] to-[var(--surface)]">
              <CardContent className="space-y-4 py-8 max-w-lg mx-auto">
                <div className="w-14 h-14 rounded-2xl bg-[var(--primary)]/15 border border-[var(--primary)]/30 text-[var(--primary)] flex items-center justify-center mx-auto shadow-lg shadow-[var(--primary)]/10">
                  <Sparkles className="w-7 h-7" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-xl font-heading font-bold text-[var(--text)]">
                    Today&apos;s Brief Has Not Been Run Yet
                  </h3>
                  <p className="text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed">
                    Synthesize today&apos;s commercial signals into one concise executive briefing with
                    highlights, risk flags, expansion opportunities, and prioritized actions.
                  </p>
                </div>

                <Button
                  onClick={() => handleGenerateToday(false)}
                  disabled={generateMutation.isPending || !isCeoEnabled}
                  size="lg"
                  className="font-semibold gap-2 mt-2 bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] text-[var(--primary-ink)] shadow-md shadow-[var(--primary)]/20"
                >
                  {generateMutation.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-[var(--primary-ink)]" />
                      <span>Synthesizing Morning Brief...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Generate Today&apos;s Brief</span>
                    </>
                  )}
                </Button>

                {!isCeoEnabled && (
                  <p className="text-xs text-[var(--warning)] mt-1">
                    {ceoDisabledReason}
                  </p>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Past Briefs History Sidebar (4 cols on desktop) */}
        <div
          className={`lg:col-span-4 ${
            showHistoryMobile ? 'block' : 'hidden lg:block'
          } space-y-4`}
        >
          <Card className="glass border-[var(--border)]">
            <CardHeader className="pb-3 border-b border-[var(--border)]">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <History className="w-4 h-4 text-[var(--primary)]" />
                  <span>Briefing Archive</span>
                </CardTitle>
                <span className="text-[11px] font-mono text-[var(--text-muted)] tabular-nums">
                  {pastBriefs.length} {pastBriefs.length === 1 ? 'brief' : 'briefs'}
                </span>
              </div>
            </CardHeader>
            <CardContent className="p-3 max-h-[600px] overflow-y-auto">
              <PastBriefsList
                briefs={pastBriefs}
                activeDate={activeRecord?.for_date || today}
                onSelectDate={(b) => {
                  setSelectedBrief(b);
                  setShowHistoryMobile(false);
                }}
                isLoading={isLoadingPast}
              />
            </CardContent>
          </Card>

          <Card className="glass border-[var(--border)] p-4 text-xs space-y-2">
            <div className="flex items-center gap-2 text-[var(--primary)] font-medium">
              <Lightbulb className="w-4 h-4" />
              <span>Single Daily Brief</span>
            </div>
            <p className="text-[11px] text-[var(--text-muted)] leading-relaxed">
              To keep execution focused and conserve AI usage, Cadre caches one definitive brief per day.
              You can regenerate it if major pipeline changes occurred today.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
