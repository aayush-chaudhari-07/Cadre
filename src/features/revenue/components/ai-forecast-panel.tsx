import React, { useState } from 'react';
import {
  Sparkles,
  Loader2,
  Copy,
  Check,
  AlertTriangle,
  TrendingUp,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useExplainForecast } from '../hooks';
import type { RevenueMetrics, DealRow } from '../forecast';
import type { ForecastNote } from '@/types/ai';
import { toast } from 'sonner';

export interface AiForecastPanelProps {
  metrics: RevenueMetrics;
  deals: DealRow[];
}

export function AiForecastPanel({ metrics, deals }: AiForecastPanelProps) {
  const explainMutation = useExplainForecast();
  const [copied, setCopied] = useState(false);
  const [forecastNote, setForecastNote] = useState<ForecastNote | null>(null);

  const handleExplain = async () => {
    // Build a compact summary of deals for the model
    const openDeals = deals.filter((d) => d.stage !== 'won' && d.stage !== 'lost');
    const topDeals = openDeals
      .sort((a, b) => (Number(b.amount) || 0) - (Number(a.amount) || 0))
      .slice(0, 5)
      .map((d) => `- ${d.name}: $${Number(d.amount).toLocaleString()} (${d.stage}, ${d.probability}%)`)
      .join('\n');

    const dealsSummary = `
Total Open Deals: ${openDeals.length}
Total Pipeline: $${metrics.totalPipeline.toLocaleString()}
Worst Case Floor: $${metrics.scenarios.worstCase.toLocaleString()}
Best Case Upside: $${metrics.scenarios.bestCase.toLocaleString()}
Historical Win Rate: ${metrics.winRate}%

Top Open Opportunities:
${topDeals || 'None'}
    `.trim();

    // Quarterly target baseline (e.g. 1.25x of weighted pipeline or $100k)
    const target = Math.max(100000, Math.round(metrics.weightedPipeline * 1.2));

    toast.loading('Finance Director analyzing pipeline variance...', { id: 'explain-fc' });
    try {
      const res = await explainMutation.mutateAsync({
        quarter: 'Current Quarter',
        target,
        weightedTotal: metrics.weightedPipeline,
        dealsSummary,
      });

      setForecastNote(res);
      toast.success('Revenue forecast analysis synthesized!', { id: 'explain-fc' });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Analysis failed';
      toast.error(msg, { id: 'explain-fc' });
    }
  };

  const handleCopy = async () => {
    if (!forecastNote) return;
    const text = `FORECAST COMMENTARY:\n${forecastNote.narrative}\n\nRISKS:\n${forecastNote.risks.map((r) => `- ${r}`).join('\n')}`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast.success('Forecast explanation copied to clipboard');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Failed to copy to clipboard');
    }
  };

  const isPending = explainMutation.isPending;

  return (
    <Card className="glass border-[var(--border)] overflow-hidden">
      <CardHeader className="p-4 pb-3 flex flex-row items-center justify-between border-b border-[var(--border)] bg-[var(--surface-raised)]/40">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[var(--cyan)]/10 text-[var(--cyan)] flex items-center justify-center">
            <TrendingUp className="w-4 h-4" />
          </div>
          <div>
            <CardTitle className="text-sm font-semibold text-[var(--text)]">
              AI Finance Director &bull; Forecast Intelligence
            </CardTitle>
            <p className="text-[11px] text-[var(--text-muted)]">
              Objective narrative on pipeline pacing, stage velocity, and deal concentration risks
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {forecastNote && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCopy}
              className="h-8 text-xs gap-1.5 text-[var(--text-muted)] hover:text-[var(--text)]"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-[var(--mint)]" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </Button>
          )}

          <Button
            variant="secondary"
            size="sm"
            onClick={handleExplain}
            disabled={isPending}
            className="h-8 text-xs gap-1.5 text-[var(--cyan)] hover:text-[var(--cyan)]"
          >
            {isPending ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Analyzing...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5" />
                <span>{forecastNote ? 'Re-analyze' : 'Explain Forecast'}</span>
              </>
            )}
          </Button>
        </div>
      </CardHeader>

      <CardContent className="p-4">
        {forecastNote ? (
          <div className="space-y-4">
            {/* Executive Narrative */}
            <div className="p-3.5 rounded-lg bg-[var(--surface-sunken)] border border-[var(--border)] text-sm text-[var(--text)] leading-relaxed select-text font-sans">
              {forecastNote.narrative}
            </div>

            {/* Identified Risks */}
            {forecastNote.risks && forecastNote.risks.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-wider text-[var(--gold)] flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  Key Revenue Risks & Vulnerabilities
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
                  {forecastNote.risks.map((risk, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-lg bg-[var(--surface-raised)] border border-[var(--border)] text-xs text-[var(--text)] flex items-start gap-2"
                    >
                      <span className="font-mono text-xs font-bold text-[var(--gold)] mt-0.5">
                        #{idx + 1}
                      </span>
                      <span>{risk}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="py-6 flex flex-col items-center justify-center text-center space-y-3">
            <p className="text-xs text-[var(--text-muted)] max-w-md">
              Click &quot;Explain Forecast&quot; to synthesize an executive financial brief on expected pipeline closure, coverage gaps, and deal slippage hazards.
            </p>
            <Button
              variant="primary"
              size="sm"
              onClick={handleExplain}
              disabled={isPending}
              className="gap-1.5"
            >
              {isPending ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Analyzing Pacing...
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  Generate Financial Brief
                </>
              )}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
