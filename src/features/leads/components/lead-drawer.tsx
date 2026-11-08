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
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { ScoreRing } from './score-ring';
import { Burst } from '@/components/motion/burst';
import { formatCurrency, formatRelativeDate } from '@/lib/format';
import { analyzeLead, type LeadAnalysis } from '@/lib/ai';
import { useLead, useLeadInteractions } from '../hooks';
import { useAgentGate } from '@/features/agents';
import type { LeadInteractionChannel } from '../schemas';
import { useQueryClient } from '@tanstack/react-query';
import {
  Sparkles,
  Bot,
  Copy,
  Check,
  Mail,
  MessageSquare,
  Phone,
  FileText,
  AlertCircle,
  Clock,
  TrendingUp,
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface LeadDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  leadId: string | null;
  orgId: string;
}

export function LeadDrawer({
  open,
  onOpenChange,
  leadId,
  orgId,
}: LeadDrawerProps) {
  const queryClient = useQueryClient();
  const { data: lead, isLoading: leadLoading } = useLead(leadId || undefined);
  const { data: interactions = [] } = useLeadInteractions(leadId || undefined);
  const { isEnabled: isSalesEnabled, disabledReason: salesDisabledReason } = useAgentGate('sales');

  // Analysis form state
  const [channel, setChannel] = useState<LeadInteractionChannel>('email');
  const [leadText, setLeadText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [latestAnalysis, setLatestAnalysis] = useState<LeadAnalysis | null>(null);
  const [copiedAction, setCopiedAction] = useState(false);
  const [copiedReply, setCopiedReply] = useState(false);
  const [showBurst, setShowBurst] = useState(false);

  const characterCount = leadText.length;
  const maxCharacters = 20000;

  const handleCopy = async (text: string, type: 'action' | 'reply') => {
    try {
      await navigator.clipboard.writeText(text);
      if (type === 'action') {
        setCopiedAction(true);
        setTimeout(() => setCopiedAction(false), 2000);
      } else {
        setCopiedReply(true);
        setTimeout(() => setCopiedReply(false), 2000);
      }
      toast.success('Copied to clipboard');
    } catch {
      toast.error('Failed to copy text');
    }
  };

  const handleRunAnalysis = async () => {
    if (!lead || !leadText.trim()) return;

    setIsAnalyzing(true);
    setLatestAnalysis(null);

    try {
      const result = await analyzeLead({
        orgId,
        leadId: lead.id,
        channel,
        leadText: leadText.trim(),
        contactName: lead.name,
        company: lead.company || undefined,
      });

      setLatestAnalysis(result);
      setShowBurst(true);
      setTimeout(() => setShowBurst(false), 1500);

      // Invalidate cache so lead row and interactions are refreshed
      queryClient.invalidateQueries({ queryKey: ['leads', orgId] });
      queryClient.invalidateQueries({ queryKey: ['lead', lead.id] });
      queryClient.invalidateQueries({ queryKey: ['lead_interactions', lead.id] });

      setLeadText('');
      toast.success(`AI Sales Agent scored lead: ${result.score}/100 (${result.intent} intent)`);
    } catch (err) {
      toast.error((err as Error).message || 'Analysis failed');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const activeObjections = (latestAnalysis?.objections ||
    (Array.isArray(lead?.objections) ? (lead.objections as string[]) : [])) as string[];
  const activeSummary = latestAnalysis?.summary || lead?.summary;
  const activeNextAction = latestAnalysis?.next_best_action || lead?.next_action;
  const activeScore = latestAnalysis ? latestAnalysis.score : lead?.score;
  const activeIntent = latestAnalysis ? latestAnalysis.intent : lead?.intent;

  const getChannelIcon = (c: string) => {
    switch (c) {
      case 'email':
        return <Mail className="w-3.5 h-3.5" />;
      case 'chat':
        return <MessageSquare className="w-3.5 h-3.5" />;
      case 'call':
        return <Phone className="w-3.5 h-3.5" />;
      default:
        return <FileText className="w-3.5 h-3.5" />;
    }
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent side="right" className="w-full sm:max-w-2xl bg-[var(--surface)] border-l border-[var(--border)] p-0 overflow-hidden flex flex-col">
        {/* Header Bar */}
        <DrawerHeader className="p-6 border-b border-[var(--border)] bg-[var(--surface-2)]/60">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1.5 flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <DrawerTitle className="text-xl font-display font-bold text-[var(--text)] truncate">
                  {lead?.name || 'Lead Details'}
                </DrawerTitle>
                {lead?.status && (
                  <Badge variant="outline" className={cn('text-xs uppercase font-mono font-semibold', {
                    'border-[var(--primary)] text-[var(--primary)] bg-[var(--primary)]/10': lead.status === 'hot',
                    'border-[var(--secondary)] text-[var(--secondary)] bg-[var(--secondary)]/10': lead.status === 'warm',
                    'border-[var(--text-3)] text-[var(--text-3)] bg-[var(--surface-2)]': lead.status === 'cold' || lead.status === 'new',
                    'border-[var(--success)] text-[var(--success)] bg-[var(--success)]/10': lead.status === 'won',
                    'border-[var(--danger)] text-[var(--danger)] bg-[var(--danger)]/10': lead.status === 'lost',
                  })}>
                    {lead.status}
                  </Badge>
                )}
                {activeIntent && (
                  <Badge variant="outline" className="text-xs font-mono text-[var(--primary)] border-[var(--primary)]/30">
                    {activeIntent} Intent
                  </Badge>
                )}
              </div>

              <div className="flex items-center gap-4 text-xs text-[var(--text-2)] font-mono flex-wrap">
                {lead?.company && <span className="font-medium text-[var(--text)]">{lead.company}</span>}
                {lead?.email && (
                  <a href={`mailto:${lead.email}`} className="hover:text-[var(--primary)] transition-colors underline underline-offset-2">
                    {lead.email}
                  </a>
                )}
                <span>
                  Value: <strong className="text-[var(--text)]">{formatCurrency(Number(lead?.deal_value) || 0)}</strong>
                </span>
              </div>
            </div>

            {/* Score Ring */}
            <div className="relative shrink-0 flex items-center justify-center">
              <ScoreRing score={activeScore} size={54} strokeWidth={4.5} />
              <Burst active={showBurst} count={16} onComplete={() => setShowBurst(false)} />
            </div>
          </div>
        </DrawerHeader>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6" aria-live="polite">
          {leadLoading ? (
            <div className="space-y-4 py-8">
              <div className="h-12 rounded-lg bg-[var(--surface-2)] animate-pulse" />
              <div className="h-28 rounded-lg bg-[var(--surface-2)] animate-pulse" />
              <div className="h-40 rounded-lg bg-[var(--surface-2)] animate-pulse" />
            </div>
          ) : (
            <>
              {/* AI Agent Commercial Synthesis */}
              {activeSummary && (
                <div className="p-4 rounded-xl border border-[var(--primary)]/30 bg-[var(--primary)]/5 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Bot className="w-4 h-4 text-[var(--primary)]" />
                      <span className="text-xs font-mono font-semibold uppercase tracking-wider text-[var(--primary)]">
                        AI Sales Intelligence
                      </span>
                    </div>
                    {lead?.last_contact_at && (
                      <span className="text-[11px] font-mono text-[var(--text-3)]">
                        Scored {formatRelativeDate(lead.last_contact_at)}
                      </span>
                    )}
                  </div>
                  <p className="text-xs sm:text-sm text-[var(--text)] leading-relaxed">
                    {activeSummary}
                  </p>
                </div>
              )}

              {/* Next Best Action Card */}
              {activeNextAction && (
                <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--surface-2)] space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono uppercase tracking-wider text-[var(--text-3)] font-semibold flex items-center gap-1.5">
                      <TrendingUp className="w-3.5 h-3.5 text-[var(--secondary)]" />
                      Next Best Action
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleCopy(activeNextAction, 'action')}
                      className="h-7 text-xs text-[var(--text-2)] hover:text-[var(--text)]"
                    >
                      {copiedAction ? (
                        <>
                          <Check className="w-3.5 h-3.5 mr-1 text-[var(--primary)]" />
                          Copied
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 mr-1" />
                          Copy Action
                        </>
                      )}
                    </Button>
                  </div>
                  <p className="text-xs sm:text-sm font-medium text-[var(--text)]">
                    {activeNextAction}
                  </p>
                </div>
              )}

              {/* Objections List */}
              {activeObjections && activeObjections.length > 0 && (
                <div className="space-y-2">
                  <span className="text-xs font-mono uppercase tracking-wider text-[var(--text-3)] font-semibold">
                    Identified Objections & Buying Barriers
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {activeObjections.map((obj, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 rounded-md text-xs font-mono bg-[var(--surface-2)] border border-[var(--border)] text-[var(--text-2)]"
                      >
                        {obj}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Suggested Reply (If fresh analysis) */}
              {latestAnalysis?.suggested_reply && (
                <div className="p-4 rounded-xl border border-[var(--secondary)]/30 bg-[var(--secondary)]/5 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono uppercase tracking-wider text-[var(--secondary)] font-semibold flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-[var(--secondary)]" />
                      AI Suggested Email Reply
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleCopy(latestAnalysis.suggested_reply, 'reply')}
                      className="h-7 text-xs text-[var(--text-2)] hover:text-[var(--text)]"
                    >
                      {copiedReply ? (
                        <>
                          <Check className="w-3.5 h-3.5 mr-1 text-[var(--primary)]" />
                          Copied
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 mr-1" />
                          Copy Draft
                        </>
                      )}
                    </Button>
                  </div>
                  <pre className="text-xs font-mono text-[var(--text)] whitespace-pre-wrap leading-relaxed p-3 rounded-lg bg-[var(--surface)]/80 border border-[var(--border)]">
                    {latestAnalysis.suggested_reply}
                  </pre>
                </div>
              )}

              {/* Interactive Analysis Input Box */}
              <div className="p-4 rounded-2xl border border-[var(--border)] bg-[var(--surface-2)]/60 space-y-3.5">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <span className="text-xs font-display font-bold text-[var(--text)] flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[var(--primary)]" />
                    Analyze Prospect Communication
                  </span>
                  <span className="text-[11px] font-mono text-[var(--text-3)]">
                    {characterCount} / {maxCharacters.toLocaleString()} chars
                  </span>
                </div>

                {/* Channel Switcher */}
                <div className="flex items-center gap-1.5 p-1 rounded-lg bg-[var(--surface)] border border-[var(--border)]">
                  {(['email', 'chat', 'call', 'note'] as LeadInteractionChannel[]).map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setChannel(c)}
                      className={cn(
                        'flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-mono uppercase font-medium rounded-md transition-all',
                        channel === c
                          ? 'bg-[var(--primary)]/15 text-[var(--primary)] font-bold shadow-sm'
                          : 'text-[var(--text-3)] hover:text-[var(--text)] hover:bg-[var(--surface-2)]',
                      )}
                    >
                      {getChannelIcon(c)}
                      <span>{c}</span>
                    </button>
                  ))}
                </div>

                {/* Input Textarea */}
                <Textarea
                  value={leadText}
                  onChange={(e) => setLeadText(e.target.value)}
                  placeholder="Paste prospect email, call notes, or transcript to qualify intent, evaluate budget urgency, and generate battlecard recommendations..."
                  maxLength={maxCharacters}
                  rows={4}
                  className="bg-[var(--surface)] border-[var(--border)] text-xs font-mono resize-none focus-ring"
                />

                {/* Privacy Safeguard Notice per docs/PRD.md 5.3 & docs/SECURITY.md */}
                <div className="flex items-center gap-2 text-[11px] text-[var(--text-3)] font-mono">
                  <AlertCircle className="w-3.5 h-3.5 text-[var(--warning)] shrink-0" />
                  <span>Notice: Do not paste passwords, payment card numbers, or health data.</span>
                </div>

                {/* Submit Action */}
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span className="w-full">
                        <Button
                          onClick={handleRunAnalysis}
                          disabled={!leadText.trim() || isAnalyzing || !isSalesEnabled}
                          className="w-full font-semibold bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] text-[var(--primary-ink)] shadow-md shadow-[var(--primary)]/10"
                        >
                          {isAnalyzing ? (
                            <span className="flex items-center gap-2">
                              <span className="w-3.5 h-3.5 border-2 border-[var(--primary-ink)] border-t-transparent rounded-full animate-spin" />
                              Gemini Qualifying Lead...
                            </span>
                          ) : (
                            <span className="flex items-center gap-1.5">
                              <Sparkles className="w-4 h-4 mr-1" />
                              Run AI Sales Qualification
                            </span>
                          )}
                        </Button>
                      </span>
                    </TooltipTrigger>
                    {!isSalesEnabled && (
                      <TooltipContent>
                        {salesDisabledReason}
                      </TooltipContent>
                    )}
                  </Tooltip>
                </TooltipProvider>
              </div>

              {/* Interaction History Timeline */}
              <div className="space-y-3 pt-2">
                <span className="text-xs font-mono uppercase tracking-wider text-[var(--text-3)] font-semibold flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  Interaction Timeline ({interactions.length})
                </span>

                {interactions.length === 0 ? (
                  <p className="text-xs text-[var(--text-3)] font-mono py-4 text-center border border-dashed border-[var(--border)] rounded-xl">
                    No past interactions recorded for this lead yet.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {interactions.map((interaction) => (
                      <div
                        key={interaction.id}
                        className="p-3.5 rounded-xl border border-[var(--border)] bg-[var(--surface-2)]/40 space-y-2 text-xs"
                      >
                        <div className="flex items-center justify-between text-[11px] font-mono text-[var(--text-3)]">
                          <span className="flex items-center gap-1.5 uppercase font-medium text-[var(--text-2)]">
                            {getChannelIcon(interaction.channel)}
                            {interaction.channel}
                          </span>
                          <span>{formatRelativeDate(interaction.created_at)}</span>
                        </div>
                        <p className="text-xs text-[var(--text-2)] font-mono line-clamp-3 leading-relaxed">
                          {interaction.content}
                        </p>
                        {interaction.analysis && typeof interaction.analysis === 'object' && 'summary' in interaction.analysis && (
                          <div className="pt-1 border-t border-[var(--border)]/60 text-[11px] text-[var(--primary)] font-mono">
                            ↳ AI Summary: {(interaction.analysis as { summary: string }).summary}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </DrawerContent>
    </Drawer>
  );
}
