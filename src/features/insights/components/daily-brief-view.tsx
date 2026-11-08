import React from 'react';
import { Link } from '@tanstack/react-router';
import {
  Sparkles,
  AlertTriangle,
  Lightbulb,
  CheckCircle2,
  RefreshCw,
  Calendar,
  ExternalLink,
  Loader2,
  Zap,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { getRelatedModuleForAction, type DailyInsights } from '../schemas';

export interface DailyBriefViewProps {
  insights: DailyInsights;
  forDate: string;
  isToday?: boolean;
  onRegenerate?: () => Promise<void>;
  isRegenerating?: boolean;
}

export function DailyBriefView({
  insights,
  forDate,
  isToday = true,
  onRegenerate,
  isRegenerating = false,
}: DailyBriefViewProps) {
  const formattedDate = new Date(`${forDate}T00:00:00`).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="space-y-6" aria-live="polite">
      {/* Top Headline Banner */}
      <div className="p-6 sm:p-8 rounded-2xl glass border border-[var(--primary)]/30 bg-gradient-to-b from-[var(--primary)]/10 via-[var(--surface-raised)] to-[var(--surface)] space-y-4 shadow-xl shadow-[var(--primary)]/5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="default" className="gap-1 font-mono text-xs">
              <Zap className="w-3.5 h-3.5 text-black" />
              <span>Executive Morning Brief</span>
            </Badge>

            <span className="text-xs text-[var(--text-muted)] flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {formattedDate}
            </span>

            {isToday && (
              <Badge variant="outline" className="text-[10px] bg-[var(--cyan)]/10 text-[var(--cyan)] border-[var(--cyan)]/30">
                Today
              </Badge>
            )}
          </div>

          {isToday && onRegenerate && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={onRegenerate}
                      disabled={isRegenerating}
                      className="gap-1.5 text-xs h-8 border-[var(--border)] hover:border-[var(--primary)]/50"
                    >
                      {isRegenerating ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin text-[var(--primary)]" />
                          <span>Regenerating...</span>
                        </>
                      ) : (
                        <>
                          <RefreshCw className="w-3.5 h-3.5" />
                          <span>Regenerate Brief</span>
                        </>
                      )}
                    </Button>
                  </span>
                </TooltipTrigger>
                <TooltipContent>
                  Regenerating creates a fresh analysis and counts against your daily AI quota.
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>

        {/* Gradient Headline */}
        <h2 className="text-2xl sm:text-3xl font-heading font-extrabold tracking-tight leading-snug bg-gradient-to-r from-[var(--mint)] via-[var(--cyan)] to-[var(--gold)] bg-clip-text text-transparent">
          &ldquo;{insights.headline}&rdquo;
        </h2>
      </div>

      {/* Highlights & Risks Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Commercial Highlights Card */}
        <Card className="glass border-[var(--mint)]/30">
          <CardHeader className="pb-3 border-b border-[var(--border)] bg-[var(--surface-raised)]/40">
            <CardTitle className="text-sm font-semibold flex items-center gap-2 text-[var(--mint)]">
              <Sparkles className="w-4 h-4" />
              <span>Commercial Highlights &amp; Momentum</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 space-y-2.5">
            {insights.highlights.map((item, idx) => (
              <div
                key={idx}
                className="flex items-start gap-2.5 p-3 rounded-xl bg-[var(--surface-sunken)] border border-[var(--border)] text-xs sm:text-sm text-[var(--text)] leading-relaxed select-text"
              >
                <CheckCircle2 className="w-4 h-4 text-[var(--mint)] mt-0.5 shrink-0" />
                <span>{item}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Commercial Risks Card */}
        <Card className="glass border-[var(--warning)]/30">
          <CardHeader className="pb-3 border-b border-[var(--border)] bg-[var(--surface-raised)]/40">
            <CardTitle className="text-sm font-semibold flex items-center gap-2 text-[var(--warning)]">
              <AlertTriangle className="w-4 h-4" />
              <span>Vulnerabilities &amp; Churn Hazards</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 space-y-2.5">
            {insights.risks.map((item, idx) => (
              <div
                key={idx}
                className="flex items-start gap-2.5 p-3 rounded-xl bg-[var(--surface-sunken)] border border-[var(--border)] text-xs sm:text-sm text-[var(--text)] leading-relaxed select-text"
              >
                <span className="w-2 h-2 rounded-full bg-[var(--warning)] mt-1.5 shrink-0" />
                <span>{item}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Opportunities & Action Recommendations Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Tactical Opportunities Card */}
        <Card className="glass border-[var(--cyan)]/30">
          <CardHeader className="pb-3 border-b border-[var(--border)] bg-[var(--surface-raised)]/40">
            <CardTitle className="text-sm font-semibold flex items-center gap-2 text-[var(--cyan)]">
              <Lightbulb className="w-4 h-4" />
              <span>Growth &amp; Expansion Opportunities</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 space-y-2.5">
            {insights.opportunities.map((item, idx) => (
              <div
                key={idx}
                className="flex items-start gap-2.5 p-3 rounded-xl bg-[var(--surface-sunken)] border border-[var(--border)] text-xs sm:text-sm text-[var(--text)] leading-relaxed select-text"
              >
                <span className="w-2 h-2 rounded-full bg-[var(--cyan)] mt-1.5 shrink-0" />
                <span>{item}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recommended Actions Card with Open related page links */}
        <Card className="glass border-[var(--gold)]/30">
          <CardHeader className="pb-3 border-b border-[var(--border)] bg-[var(--surface-raised)]/40">
            <CardTitle className="text-sm font-semibold flex items-center gap-2 text-[var(--gold)]">
              <Zap className="w-4 h-4" />
              <span>Top Recommended Actions Today</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 space-y-2.5">
            {insights.recommended_actions.map((actionText, idx) => {
              const link = getRelatedModuleForAction(actionText);

              return (
                <div
                  key={idx}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 p-3 rounded-xl bg-[var(--surface-sunken)] border border-[var(--border)]"
                >
                  <p className="text-xs sm:text-sm text-[var(--text)] leading-relaxed select-text flex-1">
                    {actionText}
                  </p>

                  <Link
                    to={link.path}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-lg bg-[var(--surface-subtle)] hover:bg-[var(--gold)]/10 text-[var(--gold)] border border-[var(--gold)]/30 hover:border-[var(--gold)]/60 transition-colors shrink-0 w-fit"
                  >
                    <span>{link.label}</span>
                    <ExternalLink className="w-3 h-3" />
                  </Link>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

