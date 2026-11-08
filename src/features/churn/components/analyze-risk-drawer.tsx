import React, { useState } from 'react';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { RiskBadge } from './risk-badge';
import { HealthScoreBar } from './health-score-bar';
import { formatCurrency } from '@/lib/format';
import { getDaysUntilRenewal } from '../metrics';
import { useAccount, useAnalyzeChurn } from '../hooks';
import type { ChurnAnalysis } from '@/types/ai';
import {
  Sparkles,
  Copy,
  Check,
  AlertTriangle,
  Lightbulb,
  Mail,
  Loader2,
  Calendar,
  Tag,
  ShieldAlert,
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export interface AnalyzeRiskDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  accountId: string | null;
  onSuccess?: (analysis: ChurnAnalysis) => void;
}

export function AnalyzeRiskDrawer({
  open,
  onOpenChange,
  accountId,
  onSuccess,
}: AnalyzeRiskDrawerProps) {
  const { data: account, isLoading: accountLoading } = useAccount(accountId || undefined);
  const analyzeMutation = useAnalyzeChurn();

  const [contextNotes, setContextNotes] = useState('');
  const [copiedMessage, setCopiedMessage] = useState(false);

  // Safely extract analysis from account record or latest mutation
  const analysis: ChurnAnalysis | null =
    (analyzeMutation.data as ChurnAnalysis | undefined) ||
    (account?.last_analysis as unknown as ChurnAnalysis | null) ||
    null;

  const handleRunAnalysis = async () => {
    if (!account) return;

    toast.loading('Support Agent analyzing churn hazard signals...', { id: 'churn-eval' });
    try {
      const signals = Array.isArray(account.signals) ? (account.signals as string[]) : [];
      const res = await analyzeMutation.mutateAsync({
        accountId: account.id,
        accountName: account.name,
        mrr: Number(account.mrr) || 0,
        signals,
        contextNotes: contextNotes.trim() || undefined,
      });

      toast.success('Retention plays & churn risk evaluation updated!', { id: 'churn-eval' });
      onSuccess?.(res);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Analysis failed';
      toast.error(msg, { id: 'churn-eval' });
    }
  };

  const handleCopyMessage = async (msg: string) => {
    try {
      await navigator.clipboard.writeText(msg);
      setCopiedMessage(true);
      toast.success('Retention message copied to clipboard');
      setTimeout(() => setCopiedMessage(false), 2000);
    } catch {
      toast.error('Failed to copy to clipboard');
    }
  };

  if (!accountId || accountLoading || !account) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent className="max-w-xl w-full p-6 space-y-4">
          <div className="flex items-center gap-2 text-sm text-[var(--text-muted)]">
            <Loader2 className="w-4 h-4 animate-spin text-[var(--cyan)]" />
            <span>Loading account intelligence...</span>
          </div>
        </DrawerContent>
      </Drawer>
    );
  }

  const signals = Array.isArray(account.signals) ? (account.signals as string[]) : [];
  const renewalInfo = getDaysUntilRenewal(account.renewal_date);

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="max-w-2xl w-full p-0 flex flex-col max-h-[100dvh]">
        {/* Drawer Header */}
        <DrawerHeader className="p-6 pb-4 border-b border-[var(--border)] bg-[var(--surface-raised)]/60">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div className="space-y-1 min-w-0">
              <div className="flex items-center gap-2">
                <DrawerTitle className="font-heading text-xl font-bold text-[var(--text)] truncate">
                  {account.name}
                </DrawerTitle>
                {account.plan && (
                  <Badge variant="outline" className="text-xs bg-[var(--surface)] border-[var(--border)]">
                    {account.plan}
                  </Badge>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-3 text-xs text-[var(--text-muted)]">
                <span className="font-mono font-medium text-[var(--text)]">
                  {formatCurrency(Number(account.mrr) || 0)} MRR
                </span>
                <span>&bull;</span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-[var(--cyan)]" />
                  Renewal: {renewalInfo.label}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <RiskBadge level={analysis?.risk_level || account.risk_level} />
            </div>
          </div>
        </DrawerHeader>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Account Health Metric Card */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-[var(--surface-raised)] border border-[var(--border)]">
            <div className="space-y-1.5">
              <p className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                Account Health Score
              </p>
              <div className="flex items-center gap-3">
                <HealthScoreBar score={account.health_score} showText={true} />
              </div>
              <p className="text-[11px] text-[var(--text-muted)]">
                {account.health_score != null
                  ? account.health_score >= 75
                    ? 'Account engagement is healthy'
                    : account.health_score >= 50
                      ? 'Moderate risk signals observed'
                      : 'Severe churn probability flagged'
                  : 'Run analysis to compute health'}
              </p>
            </div>

            <div className="space-y-1.5 sm:border-l sm:border-[var(--border)] sm:pl-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                Active Churn Signals ({signals.length})
              </p>
              {signals.length === 0 ? (
                <p className="text-xs text-[var(--text-muted)] italic">No warning signals tagged.</p>
              ) : (
                <div className="flex flex-wrap gap-1">
                  {signals.map((sig, idx) => (
                    <Badge
                      key={idx}
                      variant="outline"
                      className="bg-[var(--gold)]/10 text-[var(--gold)] border-[var(--gold)]/30 text-[11px]"
                    >
                      <Tag className="w-2.5 h-2.5 mr-1" />
                      {sig}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* AI Analysis Section */}
          {analysis ? (
            <div className="space-y-6">
              {/* Risk Level Banner */}
              <div className={cn(
                'p-4 rounded-xl border flex items-center justify-between gap-4',
                analysis.risk_level === 'critical'
                  ? 'bg-[var(--danger)]/10 border-[var(--danger)]/30 text-[var(--danger)]'
                  : analysis.risk_level === 'high'
                    ? 'bg-[var(--gold)]/10 border-[var(--gold)]/30 text-[var(--gold)]'
                    : 'bg-[var(--mint)]/10 border-[var(--mint)]/30 text-[var(--mint)]',
              )}>
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4" />
                    <span className="font-heading font-bold text-sm uppercase tracking-wide">
                      {analysis.risk_level} Churn Risk ({analysis.risk_score}% Churn Probability)
                    </span>
                  </div>
                  <p className="text-xs opacity-90">
                    Evaluated by Support Agent using active customer signals and contract timeline.
                  </p>
                </div>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleRunAnalysis}
                  disabled={analyzeMutation.isPending}
                  className="h-8 text-xs shrink-0 gap-1.5"
                >
                  {analyzeMutation.isPending ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Sparkles className="w-3.5 h-3.5 text-[var(--cyan)]" />
                  )}
                  <span>Re-analyze</span>
                </Button>
              </div>

              {/* Reasons Card */}
              {analysis.reasons && analysis.reasons.length > 0 && (
                <Card className="glass border-[var(--border)]">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-semibold flex items-center gap-2 text-[var(--gold)]">
                      <AlertTriangle className="w-4 h-4" />
                      Root Causes & Hazard Factors
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {analysis.reasons.map((reason, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm text-[var(--text)]">
                          <span className="w-1.5 h-1.5 rounded-full bg-[var(--gold)] mt-2 shrink-0" />
                          <span>{reason}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}

              {/* Retention Plays Card */}
              {analysis.retention_plays && analysis.retention_plays.length > 0 && (
                <Card className="glass border-[var(--border)]">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-semibold flex items-center gap-2 text-[var(--mint)]">
                      <Lightbulb className="w-4 h-4" />
                      Prescribed Retention Plays
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {analysis.retention_plays.map((play, idx) => {
                      const effortColor =
                        play.effort === 'low'
                          ? 'bg-[var(--mint)]/10 text-[var(--mint)] border-[var(--mint)]/30'
                          : play.effort === 'medium'
                            ? 'bg-[var(--cyan)]/10 text-[var(--cyan)] border-[var(--cyan)]/30'
                            : 'bg-[var(--gold)]/10 text-[var(--gold)] border-[var(--gold)]/30';

                      return (
                        <div
                          key={idx}
                          className="p-3 rounded-lg bg-[var(--surface-raised)] border border-[var(--border)] space-y-1.5"
                        >
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-sm font-semibold text-[var(--text)]">
                              {play.title}
                            </span>
                            <Badge variant="outline" className={cn('text-[10px] uppercase font-mono px-2 py-0.5', effortColor)}>
                              {play.effort} Effort
                            </Badge>
                          </div>
                          <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                            {play.description}
                          </p>
                        </div>
                      );
                    })}
                  </CardContent>
                </Card>
              )}

              {/* Suggested Message Card with Copy Button */}
              {analysis.suggested_message && (
                <Card className="glass border-[var(--border)]">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-semibold flex items-center gap-2 text-[var(--cyan)]">
                      <Mail className="w-4 h-4" />
                      Draft Check-in Outreach
                    </CardTitle>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleCopyMessage(analysis.suggested_message)}
                      className="text-xs h-7 gap-1.5 text-[var(--text-muted)] hover:text-[var(--text)]"
                    >
                      {copiedMessage ? <Check className="w-3.5 h-3.5 text-[var(--mint)]" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedMessage ? 'Copied' : 'Copy message'}</span>
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <div className="p-3.5 rounded-lg bg-[var(--surface-sunken)] border border-[var(--border)] text-xs text-[var(--text)] whitespace-pre-wrap leading-relaxed select-text font-sans">
                      {analysis.suggested_message}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          ) : (
            /* Unanalyzed State */
            <Card className="glass border-[var(--border)] py-8">
              <CardContent className="flex flex-col items-center justify-center text-center space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-[var(--mint)]/10 text-[var(--mint)] flex items-center justify-center">
                  <ShieldAlert className="w-6 h-6" />
                </div>
                <div className="space-y-1 max-w-sm">
                  <h4 className="font-heading font-semibold text-sm text-[var(--text)]">
                    No Risk Evaluation Yet
                  </h4>
                  <p className="text-xs text-[var(--text-muted)]">
                    Evaluate this account with the AI Support Manager to uncover churn causes, calculate risk tier, and generate tailored retention plays.
                  </p>
                </div>

                <div className="w-full max-w-md pt-2 space-y-2 text-left">
                  <Label htmlFor="drawer-notes" className="text-xs text-[var(--text-muted)]">
                    Add recent context or support notes before analyzing:
                  </Label>
                  <Textarea
                    id="drawer-notes"
                    placeholder="e.g. Weekly active seats dropped 40% after key contact moved to another team..."
                    rows={2}
                    value={contextNotes}
                    onChange={(e) => setContextNotes(e.target.value)}
                    className="text-xs"
                  />
                </div>

                <Button
                  variant="primary"
                  onClick={handleRunAnalysis}
                  disabled={analyzeMutation.isPending}
                  className="gap-2 mt-2"
                >
                  {analyzeMutation.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Analyzing Churn Hazard...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      Analyze Churn Risk
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </DrawerContent>
    </Drawer>
  );
}
