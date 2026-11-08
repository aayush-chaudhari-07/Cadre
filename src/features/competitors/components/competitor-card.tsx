import React, { useState } from 'react';
import {
  Globe,
  ExternalLink,
  Sparkles,
  Loader2,
  Calendar,
  MoreVertical,
  Trash2,
  ChevronRight,
  Shield,
  Layers,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { formatRelativeDate } from '@/lib/format';
import { useScanCompetitor } from '../hooks';
import { toast } from 'sonner';
import type { CompetitorRow } from '../api';
import type { CompetitorScan } from '@/types/ai';

export interface CompetitorCardProps {
  competitor: CompetitorRow;
  onClick: () => void;
  onDeleteClick: (competitor: CompetitorRow) => void;
}

export function CompetitorCard({
  competitor,
  onClick,
  onDeleteClick,
}: CompetitorCardProps) {
  const [scanStep, setScanStep] = useState<'idle' | 'fetching' | 'analyzing'>('idle');
  const scanMutation = useScanCompetitor();

  // Extract clean domain
  const domain = (() => {
    try {
      const u = new URL(competitor.url);
      return u.hostname.replace(/^www\./, '');
    } catch {
      return competitor.url;
    }
  })();

  const analysis = competitor.analysis as unknown as Partial<CompetitorScan> | null;
  const isScanned = Boolean(analysis && (analysis.positioning || analysis.strengths));

  const handleScan = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setScanStep('fetching');

    const timer = setTimeout(() => {
      setScanStep('analyzing');
    }, 1800);

    toast.loading(`Scanning ${competitor.name}...`, { id: `scan-${competitor.id}` });
    try {
      await scanMutation.mutateAsync({
        competitorId: competitor.id,
        name: competitor.name,
        url: competitor.url,
      });
      clearTimeout(timer);
      toast.success(`Competitive analysis refreshed for ${competitor.name}!`, {
        id: `scan-${competitor.id}`,
      });
    } catch (err: unknown) {
      clearTimeout(timer);
      const msg = err instanceof Error ? err.message : 'Scan failed';
      toast.error(msg, { id: `scan-${competitor.id}` });
    } finally {
      setScanStep('idle');
    }
  };

  const isScanning = scanStep !== 'idle' || scanMutation.isPending;

  return (
    <Card
      onClick={onClick}
      className="glass border-[var(--border)] hover:border-[var(--cyan)]/40 transition-all duration-200 flex flex-col justify-between group cursor-pointer"
    >
      <CardHeader className="p-4 pb-2 space-y-2">
        <div className="flex items-start justify-between gap-2">
          <div className="space-y-1 flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <CardTitle className="text-base font-semibold text-[var(--text)] group-hover:text-[var(--cyan)] transition-colors truncate">
                {competitor.name}
              </CardTitle>
              {competitor.is_demo && (
                <Badge variant="outline" className="text-[10px] bg-[var(--cyan)]/10 text-[var(--cyan)] border-[var(--cyan)]/30">
                  Sample
                </Badge>
              )}
            </div>

            <a
              href={competitor.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="text-xs text-[var(--text-muted)] hover:text-[var(--cyan)] flex items-center gap-1 truncate w-fit transition-colors"
            >
              <Globe className="w-3 h-3 shrink-0" />
              <span>{domain}</span>
              <ExternalLink className="w-2.5 h-2.5 opacity-60" />
            </a>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger
              asChild
              onClick={(e) => e.stopPropagation()}
            >
              <Button
                variant="ghost"
                size="sm"
                className="h-7 w-7 p-0 text-[var(--text-muted)] hover:text-[var(--text)]"
                aria-label="Options"
              >
                <MoreVertical className="w-3.5 h-3.5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
              <DropdownMenuItem
                onClick={onClick}
                className="gap-2 cursor-pointer"
              >
                <Layers className="w-3.5 h-3.5 text-[var(--cyan)]" />
                <span>View Battlecard</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onDeleteClick(competitor)}
                className="gap-2 text-[var(--danger)] focus:text-[var(--danger)] cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Remove</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      <CardContent className="p-4 pt-1 space-y-3 flex-1 flex flex-col justify-between">
        {/* Positioning Summary or Unscanned State */}
        <p className="text-xs text-[var(--text-muted)] line-clamp-2 leading-relaxed">
          {analysis?.positioning || 'Website not scanned yet. Click "Scan" to extract real positioning and sales battlecards.'}
        </p>

        {/* Scan metadata and pill indicators */}
        <div className="pt-2 border-t border-[var(--border)]/50 space-y-2.5">
          <div className="flex items-center justify-between text-xs text-[var(--text-muted)]">
            <span className="flex items-center gap-1 text-[11px]">
              <Calendar className="w-3 h-3" />
              {competitor.last_scanned_at
                ? `Scanned ${formatRelativeDate(competitor.last_scanned_at)}`
                : 'Never scanned'}
            </span>

            {isScanned && (
              <Badge
                variant="outline"
                className="text-[10px] bg-[var(--mint)]/10 text-[var(--mint)] border-[var(--mint)]/30 gap-1 font-mono"
              >
                <Shield className="w-2.5 h-2.5" />
                Battlecard Ready
              </Badge>
            )}
          </div>

          {/* Action Row */}
          <div className="flex items-center justify-between pt-1">
            <span className="text-xs font-medium text-[var(--cyan)] flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
              <span>View Intel</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </span>

            <Button
              variant={isScanned ? 'secondary' : 'primary'}
              size="sm"
              onClick={handleScan}
              disabled={isScanning}
              className="h-8 text-xs gap-1.5 shrink-0"
            >
              {isScanning ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>{scanStep === 'fetching' ? 'Fetching page...' : 'Analyzing...'}</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5 text-[var(--cyan)]" />
                  <span>{isScanned ? 'Re-scan' : 'Scan Page'}</span>
                </>
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

