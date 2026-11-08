import React, { useState } from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Sparkles, Loader2, Copy, Check, AlertTriangle, ShieldCheck } from 'lucide-react';

interface AiAnalysisResult {
  headline: string;
  narrative: string;
  risks: string[];
  recommendations: string[];
}

interface MockAiPanelProps {
  isLoading: boolean;
  result: AiAnalysisResult | null;
  onAnalyze: () => void;
  disabled?: boolean;
}

function MockAiResultPanel({ isLoading, result, onAnalyze, disabled }: MockAiPanelProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!result) return;
    navigator.clipboard.writeText(result.narrative);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <Card className="glass border-mint">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-semibold flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-emerald-400" />
          <span>AI Intelligence Synthesis</span>
        </CardTitle>
        <Button
          size="sm"
          onClick={onAnalyze}
          disabled={isLoading || disabled}
          aria-label={isLoading ? 'Analyzing data...' : 'Run Analysis'}
        >
          {isLoading ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin mr-1" />
              <span>Analyzing...</span>
            </>
          ) : (
            'Run Analysis'
          )}
        </Button>
      </CardHeader>

      <CardContent aria-live="polite">
        {isLoading ? (
          <div data-testid="ai-loading-state" className="space-y-3 py-4">
            <div className="h-4 bg-muted animate-pulse rounded w-3/4" />
            <div className="h-4 bg-muted animate-pulse rounded w-1/2" />
          </div>
        ) : !result ? (
          <div data-testid="ai-empty-state" className="py-6 text-center text-muted-foreground">
            <ShieldCheck className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p>No analysis generated yet. Click &quot;Run Analysis&quot; to synthesize data.</p>
          </div>
        ) : (
          <div data-testid="ai-result-state" className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-sm">{result.headline}</h4>
              <Button size="sm" variant="ghost" onClick={handleCopy} aria-label="Copy analysis">
                {copied ? <Check className="w-3.5 h-3.5 mr-1" /> : <Copy className="w-3.5 h-3.5 mr-1" />}
                {copied ? 'Copied' : 'Copy'}
              </Button>
            </div>

            <p className="text-sm leading-relaxed">{result.narrative}</p>

            {result.risks.length > 0 && (
              <div className="space-y-1">
                <span className="text-xs font-semibold uppercase tracking-wider text-amber-400 flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" />
                  Identified Risks
                </span>
                <ul className="list-disc pl-5 text-xs space-y-1">
                  {result.risks.map((risk, idx) => (
                    <li key={idx}>{risk}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

describe('Component: AI Result Panel States', () => {
  it('renders unanalyzed empty state with call to action', () => {
    render(<MockAiResultPanel isLoading={false} result={null} onAnalyze={vi.fn()} />);

    expect(screen.getByTestId('ai-empty-state')).toBeInTheDocument();
    expect(screen.getByText(/no analysis generated yet/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /run analysis/i })).toBeEnabled();
  });

  it('renders loading state when synthesis is in progress', () => {
    render(<MockAiResultPanel isLoading={true} result={null} onAnalyze={vi.fn()} />);

    expect(screen.getByTestId('ai-loading-state')).toBeInTheDocument();
    const btn = screen.getByRole('button', { name: /analyzing data/i });
    expect(btn).toBeDisabled();
    expect(screen.getByText(/analyzing\.\.\./i)).toBeInTheDocument();
  });

  it('renders populated result state with polite aria-live container', () => {
    const mockResult: AiAnalysisResult = {
      headline: 'Strong Early Stage Velocity',
      narrative: 'Pipeline expansion indicates a 32% upside above baseline.',
      risks: ['High deal concentration in negotiation stage', 'Extended cycle time on enterprise accounts'],
      recommendations: ['Accelerate legal review for top 2 deals'],
    };

    render(<MockAiResultPanel isLoading={false} result={mockResult} onAnalyze={vi.fn()} />);

    expect(screen.getByTestId('ai-result-state')).toBeInTheDocument();
    expect(screen.getByText('Strong Early Stage Velocity')).toBeInTheDocument();
    expect(screen.getByText(/pipeline expansion indicates a 32% upside/i)).toBeInTheDocument();
    expect(screen.getByText(/high deal concentration in negotiation stage/i)).toBeInTheDocument();

    // Verify aria-live is present on the container
    const content = screen.getByText('Strong Early Stage Velocity').closest('[aria-live="polite"]');
    expect(content).toBeInTheDocument();
  });

  it('copies narrative to clipboard on copy button click', async () => {
    const writeTextMock = vi.fn().mockResolvedValue(undefined);
    Object.assign(navigator, {
      clipboard: { writeText: writeTextMock },
    });

    const mockResult: AiAnalysisResult = {
      headline: 'Executive Summary',
      narrative: 'Full executive synthesis ready for distribution.',
      risks: [],
      recommendations: [],
    };

    render(<MockAiResultPanel isLoading={false} result={mockResult} onAnalyze={vi.fn()} />);

    const copyBtn = screen.getByRole('button', { name: /copy analysis/i });
    fireEvent.click(copyBtn);

    await waitFor(() => {
      expect(writeTextMock).toHaveBeenCalledWith('Full executive synthesis ready for distribution.');
      expect(screen.getByText('Copied')).toBeInTheDocument();
    });
  });
});

