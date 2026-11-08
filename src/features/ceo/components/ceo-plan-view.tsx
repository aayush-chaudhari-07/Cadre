import React, { useState } from 'react';
import {
  Crown,
  CheckCircle2,
  Copy,
  Check,
  AlertTriangle,
  Target,
  CalendarCheck,
  ShieldAlert,
  Compass,
  TrendingUp,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Burst } from '@/components/motion/burst';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import type { CeoPlan } from '../schemas';

export interface CeoPlanViewProps {
  plan: CeoPlan;
  planId?: string;
  status?: 'draft' | 'approved' | 'done';
  onApprove?: (id: string) => Promise<void>;
  isApproving?: boolean;
}

const AGENT_META: Record<
  string,
  { label: string; color: string; border: string; bg: string; icon: React.ComponentType<{ className?: string }> }
> = {
  ceo: {
    label: 'AI CEO',
    color: 'text-[#F5B94A]',
    border: 'border-[#F5B94A]/40',
    bg: 'bg-[#F5B94A]/10',
    icon: Crown,
  },
  sales: {
    label: 'Sales Agent',
    color: 'text-[#2DE2A6]',
    border: 'border-[#2DE2A6]/40',
    bg: 'bg-[#2DE2A6]/10',
    icon: Target,
  },
  operations: {
    label: 'Operations Agent',
    color: 'text-[#22D3EE]',
    border: 'border-[#22D3EE]/40',
    bg: 'bg-[#22D3EE]/10',
    icon: CalendarCheck,
  },
  support: {
    label: 'Support Agent',
    color: 'text-[#FB923C]',
    border: 'border-[#FB923C]/40',
    bg: 'bg-[#FB923C]/10',
    icon: ShieldAlert,
  },
  marketing: {
    label: 'Marketing Agent',
    color: 'text-[#A78BFA]',
    border: 'border-[#A78BFA]/40',
    bg: 'bg-[#A78BFA]/10',
    icon: Compass,
  },
  finance: {
    label: 'Finance Agent',
    color: 'text-[#34D399]',
    border: 'border-[#34D399]/40',
    bg: 'bg-[#34D399]/10',
    icon: TrendingUp,
  },
};

export function CeoPlanView({
  plan,
  planId,
  status = 'draft',
  onApprove,
  isApproving = false,
}: CeoPlanViewProps) {
  const [copied, setCopied] = useState(false);
  const [showBurst, setShowBurst] = useState(false);

  const isApproved = status === 'approved' || status === 'done';

  const handleApprove = async () => {
    if (!planId || !onApprove || isApproved) return;
    try {
      await onApprove(planId);
      setShowBurst(true);
      toast.success('Strategic plan approved and locked into execution');
    } catch (err) {
      toast.error(`Failed to approve plan: ${(err as Error).message}`);
    }
  };

  const handleCopyMarkdown = async () => {
    const md = `
# Strategic Plan: ${plan.goal}
Status: ${status.toUpperCase()}

## Executive Summary
${plan.summary}

## Phased Execution Roadmap
${plan.phases
  .map(
    (p, i) => `### Phase ${i + 1}: ${p.name} (${p.duration})
${p.actions.map((a) => `- [${a.agent.toUpperCase()}] **${a.task}**\n  *Impact:* ${a.expected_impact}`).join('\n')}`,
  )
  .join('\n\n')}

## Success KPIs
${plan.kpis.map((k) => `- ${k}`).join('\n')}

## Critical Execution Risks
${plan.risks.map((r) => `- ${r}`).join('\n')}
    `.trim();

    try {
      await navigator.clipboard.writeText(md);
      setCopied(true);
      toast.success('Strategic plan copied as Markdown');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Failed to copy plan');
    }
  };

  return (
    <div className="space-y-6 relative">
      {/* Burst Animation on Approval */}
      {showBurst && <Burst count={24} onComplete={() => setShowBurst(false)} />}

      {/* Goal & Header Banner */}
      <div className="p-5 sm:p-6 rounded-2xl glass border border-[var(--gold)]/30 bg-gradient-to-r from-[var(--gold)]/10 via-[var(--surface-raised)] to-[var(--surface)] space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="space-y-1.5 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant="gold" className="gap-1 font-mono text-xs">
                <Crown className="w-3.5 h-3.5" />
                <span>AI CEO Blueprint</span>
              </Badge>
              {isApproved ? (
                <Badge variant="outline" className="bg-[var(--mint)]/10 text-[var(--mint)] border-[var(--mint)]/30 gap-1 text-xs">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Approved &amp; Active</span>
                </Badge>
              ) : (
                <Badge variant="outline" className="bg-[var(--gold)]/10 text-[var(--gold)] border-[var(--gold)]/30 text-xs">
                  Proposed Draft
                </Badge>
              )}
            </div>

            <h2 className="text-xl sm:text-2xl font-heading font-bold text-[var(--text)] tracking-tight">
              {plan.goal}
            </h2>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 shrink-0">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopyMarkdown}
              className="gap-1.5 text-xs h-9 border-[var(--border)] hover:border-[var(--gold)]/40"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-[var(--mint)]" />
                  <span>Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Brief</span>
                </>
              )}
            </Button>

            {!isApproved && onApprove && planId && (
              <Button
                variant="primary"
                size="sm"
                onClick={handleApprove}
                disabled={isApproving}
                className="gap-1.5 text-xs h-9 bg-[var(--gold)] hover:bg-[#E5AA3A] text-black shadow-md shadow-[var(--gold)]/20 font-semibold"
              >
                <ShieldCheck className="w-4 h-4 text-black" />
                <span>{isApproving ? 'Approving...' : 'Approve Plan'}</span>
              </Button>
            )}
          </div>
        </div>

        {/* Executive Summary Narrative */}
        <div className="p-4 rounded-xl bg-[var(--surface-sunken)] border border-[var(--border)] text-sm text-[var(--text)] leading-relaxed select-text font-sans">
          <p className="text-xs font-semibold uppercase tracking-wider text-[var(--gold)] mb-1.5 flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-[var(--gold)]" />
            Executive Synthesis &amp; Strategic Leverage
          </p>
          {plan.summary}
        </div>
      </div>

      {/* Phased Execution Roadmap */}
      <div className="space-y-4">
        <div className="flex items-center justify-between pb-1 border-b border-[var(--border)]">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[var(--gold)]" />
            <h3 className="text-base font-semibold font-heading text-[var(--text)]">
              Phased Execution Timeline
            </h3>
          </div>
          <span className="text-xs text-[var(--text-muted)] font-mono">
            {plan.phases.length} Phases Defined
          </span>
        </div>

        <div className="space-y-6 relative before:absolute before:inset-0 before:left-5 before:w-0.5 before:bg-gradient-to-b before:from-[var(--gold)] before:via-[var(--cyan)] before:to-transparent before:hidden sm:before:block">
          {plan.phases.map((phase, pIdx) => (
            <div key={pIdx} className="relative sm:pl-12 space-y-3">
              {/* Timeline Marker Node */}
              <div className="hidden sm:flex absolute left-3 top-2.5 -translate-x-1/2 w-5 h-5 rounded-full border-2 border-[var(--gold)] bg-[var(--surface-raised)] items-center justify-center text-[10px] font-bold text-[var(--gold)] shadow-sm">
                {pIdx + 1}
              </div>

              {/* Phase Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-4 p-3 rounded-xl bg-[var(--surface-raised)] border border-[var(--border)]">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-[var(--gold)] px-2 py-0.5 rounded bg-[var(--gold)]/10">
                    Phase {pIdx + 1}
                  </span>
                  <h4 className="text-sm font-semibold font-heading text-[var(--text)]">
                    {phase.name}
                  </h4>
                </div>
                <Badge variant="outline" className="text-xs font-mono text-[var(--text-muted)] w-fit">
                  Duration: {phase.duration}
                </Badge>
              </div>

              {/* Action Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {phase.actions.map((action, aIdx) => {
                  const defaultMeta = AGENT_META.ceo!;
                  const meta = AGENT_META[action.agent.toLowerCase()] ?? defaultMeta;
                  const Icon = meta.icon;

                  return (
                    <Card
                      key={aIdx}
                      className={cn(
                        'glass border transition-all duration-200 hover:shadow-md flex flex-col justify-between',
                        meta.border,
                      )}
                    >
                      <CardContent className="p-4 space-y-2.5 flex-1 flex flex-col justify-between">
                        <div>
                          {/* Owning Agent Tag */}
                          <div className="flex items-center justify-between gap-2 mb-2">
                            <span
                              className={cn(
                                'inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-xs font-medium border',
                                meta.bg,
                                meta.border,
                                meta.color,
                              )}
                            >
                              <Icon className="w-3.5 h-3.5" />
                              <span>{meta.label}</span>
                            </span>
                            <span className="text-[10px] font-mono text-[var(--text-muted)]">
                              Action {aIdx + 1}
                            </span>
                          </div>

                          {/* Task Description */}
                          <p className="text-xs sm:text-sm font-medium text-[var(--text)] leading-relaxed select-text">
                            {action.task}
                          </p>
                        </div>

                        {/* Expected Commercial Impact */}
                        <div className="pt-2 border-t border-[var(--border)]/50 mt-auto">
                          <p className="text-[11px] text-[var(--text-muted)] flex items-start gap-1">
                            <ArrowRight className="w-3 h-3 text-[var(--mint)] shrink-0 mt-0.5" />
                            <span className="select-text">
                              <strong className="text-[var(--text)]">Impact:</strong>{' '}
                              {action.expected_impact}
                            </span>
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Target KPIs & Execution Risks Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 pt-2">
        {/* Success KPIs Card */}
        <Card className="glass border-[var(--mint)]/30">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold flex items-center gap-2 text-[var(--mint)]">
              <Target className="w-4 h-4" />
              <span>Target Commercial KPIs</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {plan.kpis.map((kpi, idx) => (
              <div
                key={idx}
                className="flex items-start gap-2.5 p-2.5 rounded-lg bg-[var(--surface-sunken)] border border-[var(--border)] text-xs text-[var(--text)] font-sans"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-[var(--mint)] mt-0.5 shrink-0" />
                <span className="select-text font-medium">{kpi}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Execution Risks Card */}
        <Card className="glass border-[var(--warning)]/30">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold flex items-center gap-2 text-[var(--warning)]">
              <AlertTriangle className="w-4 h-4" />
              <span>Critical Execution Risks</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {plan.risks.map((risk, idx) => (
              <div
                key={idx}
                className="flex items-start gap-2.5 p-2.5 rounded-lg bg-[var(--surface-sunken)] border border-[var(--border)] text-xs text-[var(--text)] font-sans"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--warning)] mt-1.5 shrink-0" />
                <span className="select-text leading-relaxed">{risk}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
