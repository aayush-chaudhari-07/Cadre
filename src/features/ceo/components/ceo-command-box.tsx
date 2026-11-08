import React, { useState } from 'react';
import { Crown, Sparkles, Loader2, CornerDownLeft, Lightbulb } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useAgentGate } from '@/features/agents';
import { cn } from '@/lib/utils';

export interface CeoCommandBoxProps {
  onSubmit: (command: string) => Promise<void>;
  isSubmitting?: boolean;
}

const EXAMPLE_DIRECTIVES = [
  'Increase demo-to-close rate by 20% this quarter',
  'Launch proactive retention blitz for at-risk accounts',
  'Audit competitor positioning and refresh battlecards',
  'Accelerate sales pipeline velocity & eliminate stalled deals',
];

export function CeoCommandBox({
  onSubmit,
  isSubmitting = false,
}: CeoCommandBoxProps) {
  const [command, setCommand] = useState('');
  const { isEnabled: isCeoEnabled, disabledReason: ceoDisabledReason } = useAgentGate('ceo');

  const maxLength = 2000;
  const charCount = command.length;
  const canSubmit = command.trim().length >= 3 && !isSubmitting && isCeoEnabled;

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!canSubmit) return;
    await onSubmit(command.trim());
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleSelectExample = (example: string) => {
    setCommand(example);
  };

  return (
    <div className="relative rounded-2xl border border-[var(--gold)]/30 bg-gradient-to-b from-[var(--gold)]/5 via-[var(--surface-raised)] to-[var(--surface)] p-5 sm:p-6 shadow-xl shadow-[var(--gold)]/5 overflow-hidden transition-all duration-300">
      {/* Decorative Gold Header Bar */}
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-[var(--gold)]/20">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-[var(--gold)]/15 border border-[var(--gold)]/30 flex items-center justify-center text-[var(--gold)] shadow-sm">
            <Crown className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-semibold font-heading text-[var(--gold)] tracking-wide">
              Executive Strategic Directive
            </h2>
            <p className="text-[11px] text-[var(--text-muted)]">
              Delegate goals to the AI CEO. Your directive will be cross-referenced with pipeline, churn signals, and competitive telemetry.
            </p>
          </div>
        </div>

        <span className="text-[11px] font-mono text-[var(--text-muted)] tabular-nums hidden sm:inline-block">
          {charCount} / {maxLength}
        </span>
      </div>

      {/* Form Input */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <Textarea
            value={command}
            onChange={(e) => setCommand(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="e.g. Increase demo-to-close conversion rate by 20% before end of Q4 through tighter qualification and competitor win themes..."
            maxLength={maxLength}
            rows={3}
            disabled={isSubmitting || !isCeoEnabled}
            className="w-full text-sm font-sans bg-[var(--surface-sunken)] border-[var(--border)] focus:border-[var(--gold)] focus:ring-[var(--gold)]/20 resize-none p-3.5 pr-10 text-[var(--text)] leading-relaxed rounded-xl"
            aria-label="Strategic directive for the AI CEO"
          />

          <div className="absolute right-3 bottom-3 flex items-center gap-1.5 text-[11px] text-[var(--text-muted)] font-mono pointer-events-none select-none">
            <kbd className="px-1.5 py-0.5 rounded bg-[var(--surface-muted)] border border-[var(--border)] text-[10px]">
              Ctrl+Enter
            </kbd>
            <CornerDownLeft className="w-3 h-3 opacity-60" />
          </div>
        </div>

        {/* Example Directives Chips */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-1.5 text-[11px] text-[var(--text-muted)]">
            <Lightbulb className="w-3.5 h-3.5 text-[var(--gold)]" />
            <span>Suggested strategic directives:</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {EXAMPLE_DIRECTIVES.map((ex, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectExample(ex)}
                disabled={isSubmitting || !isCeoEnabled}
                className="text-xs px-2.5 py-1 rounded-lg bg-[var(--surface-subtle)] hover:bg-[var(--gold)]/10 text-[var(--text-muted)] hover:text-[var(--gold)] border border-[var(--border)] hover:border-[var(--gold)]/30 transition-colors text-left"
              >
                {ex}
              </button>
            ))}
          </div>
        </div>

        {/* Action Button & Status Bar */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-[var(--gold)]/15">
          <span className="text-xs text-[var(--text-muted)] flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--gold)] animate-pulse" />
            Coordinates: Sales, Support, Operations, Marketing &amp; Finance
          </span>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <span>
                  <Button
                    type="submit"
                    disabled={!canSubmit}
                    className={cn(
                      'font-semibold gap-2 transition-all px-5 shadow-lg',
                      canSubmit
                        ? 'bg-[var(--gold)] hover:bg-[#E5AA3A] text-black shadow-[var(--gold)]/20'
                        : 'opacity-50 cursor-not-allowed',
                    )}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-black" />
                        <span>Synthesizing CeoPlan...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 text-black" />
                        <span>Deploy Strategic Command</span>
                      </>
                    )}
                  </Button>
                </span>
              </TooltipTrigger>
              {!isCeoEnabled && (
                <TooltipContent>
                  {ceoDisabledReason}
                </TooltipContent>
              )}
            </Tooltip>
          </TooltipProvider>
        </div>
      </form>
    </div>
  );
}
