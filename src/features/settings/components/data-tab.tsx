import React, { useState } from 'react';
import {
  Database,
  Download,
  Trash2,
  Sparkles,
  Loader2,
  HardDrive,
  Cpu,
  RefreshCw,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { useWorkspace } from '@/features/workspace';
import { exportWorkspaceData } from '../api';
import { useAiUsage } from '@/lib/ai';
import { toast } from 'sonner';

export function DataTab() {
  const { workspace, seedDemoData, clearDemoData } = useWorkspace();
  const { callsToday, limit, remaining, isLoading: isUsageLoading, refetch: refetchUsage } = useAiUsage();

  const [isExporting, setIsExporting] = useState(false);
  const [isSeeding, setIsSeeding] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const [clearDialogOpen, setClearDialogOpen] = useState(false);

  const orgId = workspace?.id;
  const orgName = workspace?.name || 'workspace';

  const handleExportJson = async () => {
    if (!orgId) return;
    setIsExporting(true);
    toast.loading('Packaging workspace records into JSON...', { id: 'export-data' });
    try {
      await exportWorkspaceData(orgId, orgName);
      toast.success('Workspace JSON export downloaded', { id: 'export-data' });
    } catch (err) {
      toast.error(`Export failed: ${(err as Error).message}`, { id: 'export-data' });
    } finally {
      setIsExporting(false);
    }
  };

  const handleLoadSample = async () => {
    setIsSeeding(true);
    toast.loading('Populating sample leads, deals, accounts, and meetings...', { id: 'seed-data' });
    try {
      await seedDemoData();
      toast.success('Sample data populated successfully', { id: 'seed-data' });
    } catch (err) {
      toast.error(`Failed to load sample data: ${(err as Error).message}`, { id: 'seed-data' });
    } finally {
      setIsSeeding(false);
    }
  };

  const handleClearSample = async () => {
    setIsClearing(true);
    try {
      await clearDemoData();
      toast.success('Sample demo data removed');
      setClearDialogOpen(false);
    } catch (err) {
      toast.error(`Failed to clear sample data: ${(err as Error).message}`);
    } finally {
      setIsClearing(false);
    }
  };

  const usagePercent = Math.min(Math.round((callsToday / limit) * 100), 100);

  return (
    <div className="space-y-6">
      {/* AI Quota Meter */}
      <Card className="glass border-[var(--border)]">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base flex items-center gap-2">
                <Cpu className="w-4 h-4 text-[var(--gold)]" />
                <span>AI Reasoning Quota Telemetry</span>
              </CardTitle>
              <CardDescription>
                Daily analyses tracked via PostgreSQL atomic counter function <code className="font-mono text-[10px]">consume_ai_quota</code>.
              </CardDescription>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => refetchUsage()}
              className="h-8 text-xs text-[var(--text-muted)] hover:text-[var(--text)] gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Refresh Quota</span>
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 rounded-xl bg-[var(--surface-sunken)] border border-[var(--border)] space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-sm font-semibold text-[var(--text)]">
                  {isUsageLoading ? 'Checking...' : `${callsToday} / ${limit} analyses used today`}
                </span>
                <span className="text-xs text-[var(--text-muted)] block">
                  {remaining} calls remaining before 24h reset
                </span>
              </div>
              <Badge variant="outline" className="text-xs font-mono tabular-nums">
                {usagePercent}% Used
              </Badge>
            </div>

            <Progress value={usagePercent} className="h-2.5" />

            <p className="text-[11px] text-[var(--text-muted)]">
              Quota resets at 00:00 UTC daily. All 6 agents (Lead Scoring, Transcripts, Churn, Battlecards, Forecasts, and AI CEO) share this pool.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Workspace Data Management */}
      <Card className="glass border-[var(--border)]">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <HardDrive className="w-4 h-4 text-[var(--primary)]" />
            <span>Workspace Data &amp; Export</span>
          </CardTitle>
          <CardDescription>
            Export all records or manage sample data fixtures.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* JSON Export Action */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-[var(--surface-sunken)] border border-[var(--border)]">
            <div className="space-y-1">
              <p className="text-sm font-semibold text-[var(--text)] flex items-center gap-2">
                <Download className="w-4 h-4 text-[var(--primary)]" />
                <span>Export Full Workspace Data (JSON)</span>
              </p>
              <p className="text-xs text-[var(--text-muted)] max-w-lg">
                Downloads a unified, machine-readable JSON backup including all leads, interactions,
                deals, customer accounts, meetings, competitors, agent runs, CEO plans, and daily insights.
              </p>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={handleExportJson}
              disabled={isExporting}
              className="gap-2 text-xs shrink-0"
            >
              {isExporting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Packaging JSON...</span>
                </>
              ) : (
                <>
                  <Download className="w-3.5 h-3.5" />
                  <span>Download JSON</span>
                </>
              )}
            </Button>
          </div>

          {/* Sample Data Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-[var(--surface-sunken)] border border-[var(--border)]">
            <div className="space-y-1">
              <p className="text-sm font-semibold text-[var(--text)] flex items-center gap-2">
                <Database className="w-4 h-4 text-[var(--cyan)]" />
                <span>Seed Sample Revenue Data</span>
              </p>
              <p className="text-xs text-[var(--text-muted)] max-w-lg">
                Populates your workspace with representative B2B SaaS accounts, pipeline deals,
                objection transcripts, and competitive radar targets.
              </p>
            </div>

            <Button
              variant="secondary"
              size="sm"
              onClick={handleLoadSample}
              disabled={isSeeding}
              className="gap-2 text-xs shrink-0"
            >
              {isSeeding ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Populating...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5 text-[var(--cyan)]" />
                  <span>Load Sample Data</span>
                </>
              )}
            </Button>
          </div>

          {/* Purge Sample Data Action */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-[var(--surface-sunken)] border border-[var(--border)]">
            <div className="space-y-1">
              <p className="text-sm font-semibold text-[var(--text)] flex items-center gap-2">
                <Trash2 className="w-4 h-4 text-[var(--danger)]" />
                <span>Purge Sample Demo Data</span>
              </p>
              <p className="text-xs text-[var(--text-muted)] max-w-lg">
                Removes all sample records (<code className="font-mono text-[10px]">is_demo = true</code>) without touching any manually created customer rows.
              </p>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setClearDialogOpen(true)}
              className="gap-2 text-xs text-[var(--danger)] border-[var(--danger)]/30 hover:bg-[var(--danger)]/10 shrink-0"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear Sample Data</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Confirm Clear Modal */}
      <Dialog open={clearDialogOpen} onOpenChange={setClearDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-[var(--danger)]">
              <Trash2 className="w-5 h-5" />
              <span>Clear Sample Records</span>
            </DialogTitle>
            <DialogDescription className="text-xs leading-relaxed pt-2">
              Are you sure you want to delete all sample records from this workspace?
              Your real customer leads and deals will not be affected.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setClearDialogOpen(false)}
              disabled={isClearing}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={handleClearSample}
              disabled={isClearing}
              className="gap-1.5"
            >
              {isClearing ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Clearing...</span>
                </>
              ) : (
                <span>Confirm Clear</span>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
