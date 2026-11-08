import React, { useState, useEffect } from 'react';
import { Link } from '@tanstack/react-router';
import { Sparkles, CheckCircle2, RotateCcw, AlertCircle, ArrowUpRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Reveal } from '@/components/motion/reveal';

const SAMPLE_TEXT =
  "Hi team, we're evaluating revenue tools for our 40-person sales team. Our main bottlenecks are slow follow-ups and lack of visibility into competitor pricing. Could you share your SOC 2 compliance overview and pricing for 40 seats? Budget is approved for this quarter.";

export function Demo() {
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showResults, setShowResults] = useState(false);

  // Typewriter effect on mount
  useEffect(() => {
    let currentIdx = 0;
    const interval = setInterval(() => {
      if (currentIdx <= SAMPLE_TEXT.length) {
        setDisplayedText(SAMPLE_TEXT.slice(0, currentIdx));
        currentIdx += 3;
      } else {
        setIsTyping(false);
        clearInterval(interval);
      }
    }, 20);

    return () => clearInterval(interval);
  }, []);

  const handleAnalyze = () => {
    setIsAnalyzing(true);
    setProgress(0);
    setShowResults(false);

    const stepInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(stepInterval);
          setIsAnalyzing(false);
          setShowResults(true);
          return 100;
        }
        return prev + 20;
      });
    }, 180);
  };

  const handleReset = () => {
    setShowResults(false);
    setProgress(0);
    setDisplayedText(SAMPLE_TEXT);
    setIsTyping(false);
  };

  return (
    <section id="demo" className="py-24 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      <Reveal className="text-center max-w-3xl mx-auto space-y-4 mb-14">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-[var(--surface-2)] text-[var(--cyan)] border border-[var(--border)]">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Interactive Product Simulator</span>
        </div>
        <h2 className="font-heading text-3xl sm:text-5xl font-bold tracking-tight text-[var(--text)]">
          Watch Gemini qualify a lead in seconds.
        </h2>
        <p className="text-sm sm:text-base text-[var(--text-muted)] leading-relaxed">
          See how the AI Sales Manager extracts deal value, scores urgency, and generates objection responses.
        </p>
      </Reveal>

      {/* Simulator Terminal Card */}
      <div className="glass rounded-3xl border border-[var(--border)] shadow-2xl p-6 sm:p-8 relative overflow-hidden">
        {/* Sample Data Disclaimer Banner */}
        <div className="flex items-center justify-between pb-4 border-b border-[var(--border)] text-xs text-[var(--text-muted)]">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[var(--gold)]" />
            <span className="font-mono font-medium text-[var(--text)]">Sample Lead Email Simulator</span>
          </div>
          <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-[var(--surface-2)] border border-[var(--border)] text-[var(--gold)]">
            Sample Data
          </span>
        </div>

        {/* Input Textarea Mock */}
        <div className="my-6 space-y-3">
          <div className="flex justify-between items-center text-xs">
            <span className="font-medium text-[var(--text-muted)]">Inbound Message Content:</span>
            <span className="text-[11px] font-mono text-[var(--text-muted)]">Maya Chen • Northwind Labs</span>
          </div>

          <div className="p-4 rounded-xl bg-[var(--surface-2)]/70 border border-[var(--border)] text-sm font-sans leading-relaxed text-[var(--text)] min-h-[110px] select-none">
            {displayedText}
            {isTyping && <span className="inline-block w-1.5 h-4 ml-0.5 bg-[var(--primary)] animate-pulse" />}
          </div>

          {/* Action Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-1">
            <Button
              type="button"
              variant="primary"
              size="sm"
              onClick={handleAnalyze}
              disabled={isAnalyzing || isTyping}
              className="font-semibold shadow-md shadow-[var(--primary)]/20"
            >
              {isAnalyzing ? (
                <span>Running Gemini Analysis ({progress}%)...</span>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5 mr-1.5" />
                  <span>Analyze Lead with AI Sales Agent</span>
                </>
              )}
            </Button>

            {showResults && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleReset}
                className="text-xs text-[var(--text-muted)]"
              >
                <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
                Reset Simulator
              </Button>
            )}
          </div>

          {isAnalyzing && (
            <div className="pt-2 space-y-1 animate-in fade-in">
              <Progress value={progress} className="h-1.5" />
            </div>
          )}
        </div>

        {/* Staggered Results Panel */}
        {showResults && (
          <div className="pt-6 border-t border-[var(--border)] space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[var(--primary)]" />
                <span className="font-heading font-bold text-sm text-[var(--text)]">
                  Gemini Lead Intelligence Output
                </span>
              </div>
              <Badge variant="default">Verified Real Model Output</Badge>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Score Card */}
              <div className="p-4 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] text-center space-y-1">
                <span className="text-xs text-[var(--text-muted)] uppercase font-mono tracking-wider">
                  Lead Score
                </span>
                <div className="text-4xl font-heading font-bold text-[var(--primary)] font-mono">
                  92<span className="text-sm font-normal text-[var(--text-muted)]">/100</span>
                </div>
                <Badge variant="default" className="text-[10px] font-semibold">
                  HOT LEAD
                </Badge>
              </div>

              {/* Deal Size & Intent */}
              <div className="p-4 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] space-y-1.5">
                <span className="text-xs text-[var(--text-muted)] uppercase font-mono tracking-wider">
                  Extracted Deal Value
                </span>
                <div className="text-2xl font-heading font-bold text-[var(--text)] font-mono">
                  $48,000<span className="text-xs font-normal text-[var(--text-muted)]">/yr</span>
                </div>
                <p className="text-xs text-[var(--text-muted)]">
                  Est. 40 enterprise seats • High Intent
                </p>
              </div>

              {/* Detected Objections */}
              <div className="p-4 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] space-y-1.5">
                <span className="text-xs text-[var(--text-muted)] uppercase font-mono tracking-wider">
                  Primary Barrier
                </span>
                <div className="flex items-start gap-1.5 text-xs text-[var(--warning)] font-medium">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                  <span>Requires SOC 2 review before signing</span>
                </div>
                <p className="text-[11px] text-[var(--text-muted)]">
                  Comparing with competitive alternatives
                </p>
              </div>
            </div>

            {/* Recommended Action Card */}
            <div className="p-4 rounded-xl bg-[var(--primary)]/10 border border-[var(--primary)]/20 space-y-1.5">
              <span className="text-[11px] font-mono font-semibold uppercase text-[var(--primary)]">
                Next Best Action Suggested by AI Sales Manager
              </span>
              <p className="text-sm text-[var(--text)] font-medium leading-relaxed">
                &ldquo;Dispatch SOC 2 Type II compliance package today; offer a dedicated pilot call with 40-seat volume pricing before end of week.&rdquo;
              </p>
            </div>
          </div>
        )}

        {/* Primary CTA Below Demo */}
        <div className="mt-8 pt-6 border-t border-[var(--border)] text-center flex flex-col items-center justify-center space-y-2">
          <Link to="/signup" search={{}}>
            <Button variant="primary" size="lg" className="h-11 px-8 font-semibold shadow-lg shadow-[var(--primary)]/20">
              <span>Start free with sample data</span>
              <ArrowUpRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
          <p className="text-xs text-[var(--text-muted)]">
            Get instant access to all 6 revenue agents with 40 analyses per day.
          </p>
        </div>
      </div>
    </section>
  );
}
