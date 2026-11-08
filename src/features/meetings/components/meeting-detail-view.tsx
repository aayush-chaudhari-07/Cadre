import React, { useState } from 'react';
import {
  ArrowLeft,
  Sparkles,
  Building2,
  Calendar,
  AlertTriangle,
  ShieldAlert,
  ArrowRightCircle,
  ListCheck,
  FileText,
  Copy,
  Check,
  Trash2,
  Loader2,
  HelpCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import { SentimentBadge } from './sentiment-badge';
import { DealHealthRing } from './deal-health-ring';
import { ActionItemsList } from './action-items-list';
import { DeleteMeetingDialog } from './delete-meeting-dialog';
import { useAnalyzeMeeting } from '../hooks';
import { useAgentGate } from '@/features/agents';
import { formatRelativeDate } from '@/lib/format';
import { toast } from 'sonner';
import type { MeetingRow } from '../api';
import type { MeetingAnalysis, MeetingActionItem } from '@/types/ai';

export interface MeetingDetailViewProps {
  meeting: MeetingRow;
  onBack: () => void;
  onDeleted?: () => void;
}

export function MeetingDetailView({
  meeting,
  onBack,
  onDeleted,
}: MeetingDetailViewProps) {
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [copiedTranscript, setCopiedTranscript] = useState(false);

  const analyzeMutation = useAnalyzeMeeting();
  const { isEnabled: isOpsEnabled, disabledReason: opsDisabledReason } = useAgentGate('operations');

  // Safely extract analysis JSON if available
  const rawAnalysis = meeting.analysis as unknown as Partial<MeetingAnalysis> | null;
  const analysis: Partial<MeetingAnalysis> | null = rawAnalysis || (meeting.summary ? {
    summary: meeting.summary,
    sentiment: (meeting.sentiment as 'positive' | 'neutral' | 'negative') || 'neutral',
    action_items: (Array.isArray(meeting.action_items) ? meeting.action_items : []) as unknown as MeetingActionItem[],
    objections: (Array.isArray(meeting.objections) ? meeting.objections : []) as unknown as string[],
    key_points: [],
    risks: [],
    next_steps: [],
    deal_health: 50,
  } : null);

  const isAnalyzed = Boolean(analysis && (analysis.summary || analysis.deal_health !== undefined));

  const handleReanalyze = async () => {
    toast.loading('Operations Agent analyzing transcript...', { id: 'meeting-reanalyze' });
    try {
      await analyzeMutation.mutateAsync({
        meetingId: meeting.id,
        title: meeting.title,
        transcript: meeting.transcript,
        company: meeting.company || undefined,
      });
      toast.success('Meeting analysis refreshed!', { id: 'meeting-reanalyze' });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Analysis failed';
      toast.error(msg, { id: 'meeting-reanalyze' });
    }
  };

  const handleCopyTranscript = async () => {
    try {
      await navigator.clipboard.writeText(meeting.transcript);
      setCopiedTranscript(true);
      toast.success('Transcript copied to clipboard');
      setTimeout(() => setCopiedTranscript(false), 2000);
    } catch {
      toast.error('Failed to copy transcript');
    }
  };

  const formattedDate = new Date(meeting.held_at).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="space-y-6">
      {/* Top Navigation Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[var(--border)]">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="text-[var(--text-muted)] hover:text-[var(--text)] gap-1.5 pl-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>All Meetings</span>
          </Button>

          <div className="h-4 w-px bg-[var(--border)] hidden sm:block" />

          <div className="flex items-center gap-2">
            <SentimentBadge sentiment={analysis?.sentiment || meeting.sentiment} />
            {meeting.is_demo && (
              <Badge variant="outline" className="text-xs bg-[var(--cyan)]/10 text-[var(--cyan)] border-[var(--cyan)]/30">
                Sample Data
              </Badge>
            )}
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <span>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={handleReanalyze}
                    disabled={analyzeMutation.isPending || !isOpsEnabled}
                    className="gap-1.5 text-xs h-9"
                  >
                    {analyzeMutation.isPending ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-[var(--cyan)]" />
                    ) : (
                      <Sparkles className="w-3.5 h-3.5 text-[var(--cyan)]" />
                    )}
                    <span>{isAnalyzed ? 'Re-analyze' : 'Analyze Now'}</span>
                  </Button>
                </span>
              </TooltipTrigger>
              {!isOpsEnabled && (
                <TooltipContent>
                  {opsDisabledReason}
                </TooltipContent>
              )}
            </Tooltip>
          </TooltipProvider>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setDeleteOpen(true)}
            className="text-[var(--text-muted)] hover:text-[var(--danger)] h-9 w-9 p-0"
            title="Delete meeting"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Meeting Header */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
        <div className="space-y-2 max-w-3xl">
          <h1 className="font-heading text-2xl sm:text-3xl font-bold tracking-tight text-[var(--text)]">
            {meeting.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-xs text-[var(--text-muted)]">
            {meeting.company && (
              <span className="flex items-center gap-1.5 font-medium text-[var(--text)]">
                <Building2 className="w-3.5 h-3.5 text-[var(--cyan)]" />
                {meeting.company}
              </span>
            )}
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-[var(--mint)]" />
              Held {formattedDate} ({formatRelativeDate(meeting.held_at)})
            </span>
            <span className="text-[var(--text-muted)]">
              &bull; {meeting.transcript.length.toLocaleString()} characters
            </span>
          </div>
        </div>

        {/* Deal Health Ring Summary Card */}
        {isAnalyzed && analysis?.deal_health !== undefined && (
          <div className="flex items-center gap-4 p-4 rounded-xl bg-[var(--surface-raised)] border border-[var(--border)] shrink-0">
            <DealHealthRing score={analysis.deal_health} size={76} strokeWidth={6} />
            <div className="space-y-1">
              <p className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                Deal Health
              </p>
              <p className="text-sm font-medium text-[var(--text)]">
                {analysis.deal_health >= 75
                  ? 'Strong Momentum'
                  : analysis.deal_health >= 50
                    ? 'Moderate Alignment'
                    : 'At-Risk / High Friction'}
              </p>
              <p className="text-[11px] text-[var(--text-muted)]">
                Evaluated by Operations Agent
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Main Analysis Content */}
      {isAnalyzed ? (
        <div className="space-y-6">
          {/* Executive Summary Card */}
          <Card className="glass border-[var(--border)]">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold flex items-center gap-2 text-[var(--text)]">
                <Sparkles className="w-4 h-4 text-[var(--mint)]" />
                Executive Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-[var(--text)] leading-relaxed">
                {analysis?.summary || 'No summary generated yet.'}
              </p>
            </CardContent>
          </Card>

          {/* Key Points & Strategic Insights */}
          {analysis?.key_points && analysis.key_points.length > 0 && (
            <Card className="glass border-[var(--border)]">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold flex items-center gap-2 text-[var(--text)]">
                  <ListCheck className="w-4 h-4 text-[var(--cyan)]" />
                  Key Discussion Points & Commercial Agreements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {analysis.key_points.map((pt, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-sm text-[var(--text)]">
                      <span className="w-1.5 h-1.5 rounded-full bg-[var(--cyan)] mt-2 shrink-0" />
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {/* Action Items Component (with local storage check state + copy all) */}
          <ActionItemsList
            meetingId={meeting.id}
            items={analysis?.action_items}
          />

          {/* Objections & Risks Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Objections Card */}
            <Card className="glass border-[var(--border)]">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold flex items-center gap-2 text-[var(--gold)]">
                  <AlertTriangle className="w-4 h-4" />
                  Prospect Objections Raised
                </CardTitle>
              </CardHeader>
              <CardContent>
                {analysis?.objections && analysis.objections.length > 0 ? (
                  <ul className="space-y-2">
                    {analysis.objections.map((obj, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-sm text-[var(--text)]">
                        <span className="w-1.5 h-1.5 rounded-full bg-[var(--gold)] mt-2 shrink-0" />
                        <span>{obj}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-[var(--text-muted)] italic">
                    No explicit objections raised during this call.
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Deal Risks Card */}
            <Card className="glass border-[var(--border)]">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold flex items-center gap-2 text-[var(--danger)]">
                  <ShieldAlert className="w-4 h-4" />
                  Identified Commercial Risks
                </CardTitle>
              </CardHeader>
              <CardContent>
                {analysis?.risks && analysis.risks.length > 0 ? (
                  <ul className="space-y-2">
                    {analysis.risks.map((risk, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-sm text-[var(--text)]">
                        <span className="w-1.5 h-1.5 rounded-full bg-[var(--danger)] mt-2 shrink-0" />
                        <span>{risk}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-[var(--text-muted)] italic">
                    No critical commercial risks flagged.
                  </p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Next Steps Card */}
          {analysis?.next_steps && analysis.next_steps.length > 0 && (
            <Card className="glass border-[var(--border)]">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold flex items-center gap-2 text-[var(--mint)]">
                  <ArrowRightCircle className="w-4 h-4" />
                  Recommended Next Steps
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {analysis.next_steps.map((step, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-lg bg-[var(--surface-raised)] border border-[var(--border)] text-sm text-[var(--text)] flex items-start gap-2"
                    >
                      <span className="font-mono text-xs font-bold text-[var(--mint)] mt-0.5">
                        #{idx + 1}
                      </span>
                      <span>{step}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      ) : (
        /* Empty Analysis State */
        <Card className="glass border-[var(--border)] py-12">
          <CardContent className="flex flex-col items-center justify-center text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-[var(--cyan)]/10 border border-[var(--cyan)]/20 flex items-center justify-center text-[var(--cyan)]">
              <HelpCircle className="w-6 h-6" />
            </div>
            <div className="space-y-1 max-w-md">
              <h3 className="font-heading font-semibold text-base text-[var(--text)]">
                Meeting Not Analyzed Yet
              </h3>
              <p className="text-xs text-[var(--text-muted)]">
                Run the AI Operations Manager to extract key discussion points, assign action items with owners, detect objections, and estimate deal health.
              </p>
            </div>
            <Button
              variant="primary"
              onClick={handleReanalyze}
              disabled={analyzeMutation.isPending}
              className="gap-2"
            >
              {analyzeMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Analyzing Transcript...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Analyze with Operations Agent
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Full Transcript Accordion */}
      <Card className="glass border-[var(--border)]">
        <Accordion type="single" collapsible defaultValue="">
          <AccordionItem value="transcript" className="border-none">
            <AccordionTrigger className="px-6 py-4 hover:no-underline">
              <div className="flex items-center gap-2 text-sm font-semibold text-[var(--text)]">
                <FileText className="w-4 h-4 text-[var(--text-muted)]" />
                <span>Full Original Transcript ({meeting.transcript.length.toLocaleString()} chars)</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-6 pb-6 pt-0 space-y-3">
              <div className="flex justify-end">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCopyTranscript}
                  className="text-xs h-8 gap-1.5 text-[var(--text-muted)] hover:text-[var(--text)]"
                >
                  {copiedTranscript ? <Check className="w-3.5 h-3.5 text-[var(--mint)]" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedTranscript ? 'Copied' : 'Copy transcript'}
                </Button>
              </div>
              <div className="p-4 rounded-lg bg-[var(--surface-sunken)] border border-[var(--border)] font-mono text-xs text-[var(--text-muted)] whitespace-pre-wrap max-h-96 overflow-y-auto leading-relaxed select-text">
                {meeting.transcript}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </Card>

      {/* Delete Dialog */}
      <DeleteMeetingDialog
        meetingId={meeting.id}
        meetingTitle={meeting.title}
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onDeleted={() => {
          onDeleted?.();
          onBack();
        }}
      />
    </div>
  );
}

