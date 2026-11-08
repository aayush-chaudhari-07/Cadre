import React, { useState } from 'react';
import {
  ArrowLeft,
  Globe,
  ExternalLink,
  Sparkles,
  Loader2,
  Trash2,
  Calendar,
  ShieldCheck,
  AlertTriangle,
  DollarSign,
  Radio,
  Copy,
  Check,
  Flame,
  MessageSquare,
  Trophy,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { DeleteCompetitorDialog } from './delete-competitor-dialog';
import { useScanCompetitor } from '../hooks';
import { formatRelativeDate } from '@/lib/format';
import { toast } from 'sonner';
import type { CompetitorRow } from '../api';
import type { CompetitorScan } from '@/types/ai';

export interface CompetitorDetailViewProps {
  competitor: CompetitorRow;
  onBack: () => void;
  onDeleted?: () => void;
}

export function CompetitorDetailView({
  competitor,
  onBack,
  onDeleted,
}: CompetitorDetailViewProps) {
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [scanStep, setScanStep] = useState<'idle' | 'fetching' | 'analyzing'>('idle');
  const [copiedTrack, setCopiedTrack] = useState(false);
  const [scanError, setScanError] = useState<string | null>(null);

  const scanMutation = useScanCompetitor();

  const analysis = competitor.analysis as unknown as Partial<CompetitorScan> | null;
  const isScanned = Boolean(analysis && (analysis.positioning || analysis.battlecard));

  const domain = (() => {
    try {
      const u = new URL(competitor.url);
      return u.hostname.replace(/^www\./, '');
    } catch {
      return competitor.url;
    }
  })();

  const handleScan = async () => {
    setScanError(null);
    setScanStep('fetching');

    const timer = setTimeout(() => {
      setScanStep('analyzing');
    }, 1800);

    toast.loading(`Fetching and analyzing ${competitor.name}...`, { id: 'scan-detail' });
    try {
      await scanMutation.mutateAsync({
        competitorId: competitor.id,
        name: competitor.name,
        url: competitor.url,
      });
      clearTimeout(timer);
      toast.success(`Competitive intel refreshed for ${competitor.name}!`, { id: 'scan-detail' });
    } catch (err: unknown) {
      clearTimeout(timer);
      const msg = err instanceof Error ? err.message : 'Scan request failed';
      setScanError(msg);
      toast.error(msg, { id: 'scan-detail' });
    } finally {
      setScanStep('idle');
    }
  };

  const handleCopyTalkTrack = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedTrack(true);
      toast.success('Talk track copied to clipboard');
      setTimeout(() => setCopiedTrack(false), 2000);
    } catch {
      toast.error('Failed to copy to clipboard');
    }
  };

  const isScanning = scanStep !== 'idle' || scanMutation.isPending;

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
            <span>All Competitors</span>
          </Button>

          <div className="h-4 w-px bg-[var(--border)] hidden sm:block" />

          <a
            href={competitor.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-[var(--text-muted)] hover:text-[var(--cyan)] flex items-center gap-1.5 transition-colors"
          >
            <Globe className="w-3.5 h-3.5 text-[var(--cyan)]" />
            <span>{domain}</span>
            <ExternalLink className="w-3 h-3 opacity-70" />
          </a>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={handleScan}
            disabled={isScanning}
            className="gap-1.5 text-xs h-9"
          >
            {isScanning ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin text-[var(--cyan)]" />
                <span>{scanStep === 'fetching' ? 'Fetching page...' : 'Analyzing...'}</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5 text-[var(--cyan)]" />
                <span>{isScanned ? 'Re-scan Page' : 'Scan Page'}</span>
              </>
            )}
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setDeleteOpen(true)}
            className="text-[var(--text-muted)] hover:text-[var(--danger)] h-9 w-9 p-0"
            title="Remove competitor"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Header Info */}
      <div className="space-y-1.5">
        <div className="flex items-center gap-3">
          <h1 className="font-heading text-2xl sm:text-3xl font-bold tracking-tight text-[var(--text)]">
            {competitor.name}
          </h1>
          {competitor.is_demo && (
            <Badge variant="outline" className="text-xs bg-[var(--cyan)]/10 text-[var(--cyan)] border-[var(--cyan)]/30">
              Sample Data
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-2 text-xs text-[var(--text-muted)]">
          <Calendar className="w-3.5 h-3.5 text-[var(--mint)]" />
          <span>
            {competitor.last_scanned_at
              ? `Last scanned ${formatRelativeDate(competitor.last_scanned_at)}`
              : 'Never scanned yet'}
          </span>
          <span>&bull;</span>
          <span className="font-mono">{competitor.url}</span>
        </div>
      </div>

      {/* Friendly Error Banner if Scan Failed (Never Blank Screen) */}
      {scanError && (
        <div className="p-4 rounded-xl bg-[var(--danger)]/10 border border-[var(--danger)]/30 text-[var(--danger)] text-xs flex items-start gap-3">
          <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
          <div className="space-y-1 flex-1">
            <p className="font-semibold">Scan could not be completed securely</p>
            <p className="opacity-90">{scanError}</p>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      {isScanned && analysis ? (
        <Tabs defaultValue="intel" className="space-y-6">
          <TabsList className="bg-[var(--surface-raised)] border border-[var(--border)] p-1">
            <TabsTrigger value="intel" className="text-xs gap-1.5 font-medium">
              <Globe className="w-3.5 h-3.5" />
              <span>Positioning & Intel</span>
            </TabsTrigger>
            <TabsTrigger value="battlecard" className="text-xs gap-1.5 font-medium">
              <Trophy className="w-3.5 h-3.5 text-[var(--gold)]" />
              <span>Sales Battlecard</span>
            </TabsTrigger>
          </TabsList>

          {/* TAB 1: INTEL & POSITIONING */}
          <TabsContent value="intel" className="space-y-6 mt-0">
            {/* Market Positioning Statement */}
            <Card className="glass border-[var(--border)]">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold flex items-center gap-2 text-[var(--cyan)]">
                  <Sparkles className="w-4 h-4" />
                  Market Positioning & Core Value Prop
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-[var(--text)] leading-relaxed italic bg-[var(--surface-sunken)] p-3.5 rounded-lg border border-[var(--border)]">
                  &ldquo;{analysis.positioning || 'No positioning statement synthesized.'}&rdquo;
                </p>
              </CardContent>
            </Card>

            {/* Strengths vs Weaknesses Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Strengths */}
              <Card className="glass border-[var(--border)]">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-semibold flex items-center gap-2 text-[var(--mint)]">
                    <ShieldCheck className="w-4 h-4" />
                    Operational Strengths
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {analysis.strengths && analysis.strengths.length > 0 ? (
                    <ul className="space-y-2">
                      {analysis.strengths.map((str, idx) => (
                        <li key={idx} className="flex items-start gap-2.5 text-sm text-[var(--text)]">
                          <span className="w-1.5 h-1.5 rounded-full bg-[var(--mint)] mt-2 shrink-0" />
                          <span>{str}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-xs text-[var(--text-muted)] italic">No explicit strengths identified.</p>
                  )}
                </CardContent>
              </Card>

              {/* Weaknesses */}
              <Card className="glass border-[var(--border)]">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-semibold flex items-center gap-2 text-[var(--danger)]">
                    <AlertTriangle className="w-4 h-4" />
                    Vulnerabilities & Limitations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {analysis.weaknesses && analysis.weaknesses.length > 0 ? (
                    <ul className="space-y-2">
                      {analysis.weaknesses.map((weak, idx) => (
                        <li key={idx} className="flex items-start gap-2.5 text-sm text-[var(--text)]">
                          <span className="w-1.5 h-1.5 rounded-full bg-[var(--danger)] mt-2 shrink-0" />
                          <span>{weak}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-xs text-[var(--text-muted)] italic">No critical weaknesses noted.</p>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Pricing Notes & Recent Signals Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Pricing Notes */}
              <Card className="glass border-[var(--border)]">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-semibold flex items-center gap-2 text-[var(--gold)]">
                    <DollarSign className="w-4 h-4" />
                    Pricing Models & Commercial Terms
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-[var(--text)] leading-relaxed">
                    {analysis.pricing_notes || 'No public pricing details published on homepage.'}
                  </p>
                </CardContent>
              </Card>

              {/* Recent Signals */}
              <Card className="glass border-[var(--border)]">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-semibold flex items-center gap-2 text-[var(--cyan)]">
                    <Radio className="w-4 h-4" />
                    Recent Signals & Feature Shifts
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {analysis.recent_signals && analysis.recent_signals.length > 0 ? (
                    <ul className="space-y-2">
                      {analysis.recent_signals.map((sig, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-xs text-[var(--text)]">
                          <span className="w-1.5 h-1.5 rounded-full bg-[var(--cyan)] mt-1.5 shrink-0" />
                          <span>{sig}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-xs text-[var(--text-muted)] italic">No recent movements detected.</p>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* TAB 2: BATTLECARD */}
          <TabsContent value="battlecard" className="space-y-6 mt-0">
            {/* Win Themes */}
            <Card className="glass border-[var(--border)]">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold flex items-center gap-2 text-[var(--mint)]">
                  <Trophy className="w-4 h-4" />
                  Key Win Themes (How Cadre Wins)
                </CardTitle>
              </CardHeader>
              <CardContent>
                {analysis.battlecard?.win_themes && analysis.battlecard.win_themes.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {analysis.battlecard.win_themes.map((theme, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-lg bg-[var(--surface-raised)] border border-[var(--border)] flex items-start gap-2 text-sm text-[var(--text)]"
                      >
                        <ShieldCheck className="w-4 h-4 text-[var(--mint)] shrink-0 mt-0.5" />
                        <span>{theme}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-[var(--text-muted)] italic">No win themes generated.</p>
                )}
              </CardContent>
            </Card>

            {/* Landmines to Avoid */}
            <Card className="glass border-[var(--border)]">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold flex items-center gap-2 text-[var(--danger)]">
                  <Flame className="w-4 h-4" />
                  Landmines & Competitor FUD to Defuse
                </CardTitle>
              </CardHeader>
              <CardContent>
                {analysis.battlecard?.landmines && analysis.battlecard.landmines.length > 0 ? (
                  <ul className="space-y-2">
                    {analysis.battlecard.landmines.map((mine, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-sm text-[var(--text)]">
                        <AlertTriangle className="w-4 h-4 text-[var(--gold)] shrink-0 mt-0.5" />
                        <span>{mine}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-xs text-[var(--text-muted)] italic">No competitor landmines flagged.</p>
                )}
              </CardContent>
            </Card>

            {/* Sales Rep Talk Track with Copy Button */}
            {analysis.battlecard?.talk_track && (
              <Card className="glass border-[var(--border)]">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-semibold flex items-center gap-2 text-[var(--cyan)]">
                    <MessageSquare className="w-4 h-4" />
                    Executive Sales Talk Track
                  </CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleCopyTalkTrack(analysis.battlecard!.talk_track)}
                    className="text-xs h-7 gap-1.5 text-[var(--text-muted)] hover:text-[var(--text)]"
                  >
                    {copiedTrack ? <Check className="w-3.5 h-3.5 text-[var(--mint)]" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedTrack ? 'Copied' : 'Copy talk track'}</span>
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="p-4 rounded-lg bg-[var(--surface-sunken)] border border-[var(--border)] text-sm text-[var(--text)] whitespace-pre-wrap leading-relaxed select-text font-sans">
                    {analysis.battlecard.talk_track}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      ) : (
        /* Unscanned Empty State */
        <Card className="glass border-[var(--border)] py-12">
          <CardContent className="flex flex-col items-center justify-center text-center space-y-4 max-w-md mx-auto">
            <div className="w-12 h-12 rounded-2xl bg-[var(--cyan)]/10 text-[var(--cyan)] flex items-center justify-center">
              <Globe className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="font-heading font-semibold text-base text-[var(--text)]">
                Competitor Not Scanned Yet
              </h3>
              <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                Run the AI Marketing Agent to securely fetch and analyze {competitor.name}&apos;s public website, extract strategic positioning, and synthesize sales battlecards.
              </p>
            </div>
            <Button
              variant="primary"
              onClick={handleScan}
              disabled={isScanning}
              className="gap-2"
            >
              {isScanning ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>{scanStep === 'fetching' ? 'Fetching page...' : 'Analyzing...'}</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Scan Competitor Page</span>
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Delete Confirmation Dialog */}
      <DeleteCompetitorDialog
        competitorId={competitor.id}
        competitorName={competitor.name}
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
