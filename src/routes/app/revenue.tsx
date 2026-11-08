import React, { useState, useMemo } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import {
  TrendingUp,
  Plus,
  DollarSign,
  Briefcase,
  Trophy,
  Sparkles,
  AlertCircle,
  Database,
  Loader2,
} from 'lucide-react';
import { useWorkspace } from '@/features/workspace';
import {
  useDeals,
  calculateRevenueMetrics,
  DealDialog,
  DeleteDealDialog,
  DealsKanban,
  ForecastAreaChart,
  PipelineBarChart,
  AiForecastPanel,
  type DealRow,
  type DealStage,
} from '@/features/revenue';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { formatCurrency } from '@/lib/format';
import { toast } from 'sonner';

export const Route = createFileRoute('/app/revenue')({
  component: RevenuePage,
});

function RevenuePage() {
  const { seedDemoData } = useWorkspace();
  const { data: deals = [], isLoading, isError, error, refetch } = useDeals();

  const [dealDialogOpen, setDealDialogOpen] = useState(false);
  const [dealToEdit, setDealToEdit] = useState<DealRow | null>(null);
  const [defaultStage, setDefaultStage] = useState<DealStage>('prospecting');
  const [dealToDelete, setDealToDelete] = useState<DealRow | null>(null);
  const [isSeeding, setIsSeeding] = useState(false);

  // Compute revenue metrics
  const metrics = useMemo(() => {
    return calculateRevenueMetrics(deals);
  }, [deals]);

  const handleOpenAddDeal = (stage: DealStage = 'prospecting') => {
    setDealToEdit(null);
    setDefaultStage(stage);
    setDealDialogOpen(true);
  };

  const handleEditDeal = (deal: DealRow) => {
    setDealToEdit(deal);
    setDealDialogOpen(true);
  };

  const handleLoadSampleData = async () => {
    setIsSeeding(true);
    try {
      await seedDemoData();
      await refetch();
      toast.success('Sample pipeline deals loaded');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to load sample deals';
      toast.error(msg);
    } finally {
      setIsSeeding(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <h1 className="font-heading text-2xl sm:text-3xl font-bold tracking-tight text-[var(--text)]">
              Revenue Forecast &amp; Deals
            </h1>
            <Badge variant="info">AI Finance Director</Badge>
          </div>
          <p className="text-sm text-[var(--text-muted)]">
            Stage-weighted pipeline modeling, three-scenario forecasts, and sales velocity management.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="primary"
            onClick={() => handleOpenAddDeal('prospecting')}
            className="gap-2 shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Add Deal</span>
          </Button>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Open Pipeline */}
        <Card className="glass border-[var(--border)]">
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] flex items-center justify-between">
              <span>Open Pipeline</span>
              <DollarSign className="w-4 h-4 text-[var(--cyan)]" />
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0 space-y-1">
            <p className="font-heading text-2xl font-bold tracking-tight text-[var(--text)]">
              {formatCurrency(metrics.totalPipeline)}
            </p>
            <p className="text-xs text-[var(--text-muted)]">
              {metrics.openCount} open {metrics.openCount === 1 ? 'deal' : 'deals'}
            </p>
          </CardContent>
        </Card>

        {/* Expected Weighted Forecast */}
        <Card className="glass border-[var(--border)]">
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-[var(--mint)] flex items-center justify-between">
              <span>Expected Forecast</span>
              <TrendingUp className="w-4 h-4 text-[var(--mint)]" />
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0 space-y-1">
            <p className="font-heading text-2xl font-bold tracking-tight text-[var(--mint)]">
              {formatCurrency(metrics.weightedPipeline)}
            </p>
            <p className="text-xs text-[var(--text-muted)]">
              Probability-weighted nominal
            </p>
          </CardContent>
        </Card>

        {/* Best Case Upside */}
        <Card className="glass border-[var(--border)]">
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-[var(--cyan)] flex items-center justify-between">
              <span>Best Case Upside</span>
              <Sparkles className="w-4 h-4 text-[var(--cyan)]" />
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0 space-y-1">
            <p className="font-heading text-2xl font-bold tracking-tight text-[var(--cyan)]">
              {formatCurrency(metrics.scenarios.bestCase)}
            </p>
            <p className="text-xs text-[var(--text-muted)]">
              High acceleration ceiling
            </p>
          </CardContent>
        </Card>

        {/* Worst Case Floor */}
        <Card className="glass border-[var(--border)]">
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-[var(--gold)] flex items-center justify-between">
              <span>Worst Case Floor</span>
              <AlertCircle className="w-4 h-4 text-[var(--gold)]" />
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0 space-y-1">
            <p className="font-heading text-2xl font-bold tracking-tight text-[var(--gold)]">
              {formatCurrency(metrics.scenarios.worstCase)}
            </p>
            <p className="text-xs text-[var(--text-muted)]">
              Late-stage baseline floor
            </p>
          </CardContent>
        </Card>

        {/* Historical Win Rate & Deal Size */}
        <Card className="glass border-[var(--border)]">
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] flex items-center justify-between">
              <span>Win Rate</span>
              <Trophy className="w-4 h-4 text-[var(--gold)]" />
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0 space-y-1">
            <p className="font-heading text-2xl font-bold tracking-tight text-[var(--text)]">
              {metrics.winRate}%
            </p>
            <p className="text-xs text-[var(--text-muted)]">
              Avg deal: {formatCurrency(metrics.averageDealSize)}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* AI Explain Forecast Panel */}
      <AiForecastPanel metrics={metrics} deals={deals} />

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ForecastAreaChart deals={deals} />
        <PipelineBarChart deals={deals} />
      </div>

      {/* Kanban Board Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-heading text-lg font-bold text-[var(--text)]">
              Deals Pipeline Board
            </h2>
            <p className="text-xs text-[var(--text-muted)]">
              Drag and drop opportunities between milestones, or use the accessible card menu to transition stages.
            </p>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-6 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-64 rounded-xl border border-[var(--border)] p-3 space-y-2 bg-[var(--surface-raised)]/20">
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-20 rounded-lg w-full" />
                <Skeleton className="h-20 rounded-lg w-full" />
              </div>
            ))}
          </div>
        ) : isError ? (
          <Card className="glass border-[var(--border)] py-12">
            <CardContent className="flex flex-col items-center justify-center text-center space-y-3">
              <AlertCircle className="w-8 h-8 text-[var(--danger)]" />
              <h3 className="font-heading font-semibold text-base text-[var(--text)]">Failed to load deals</h3>
              <p className="text-xs text-[var(--text-muted)] max-w-sm">
                {error?.message || 'An error occurred while loading pipeline deals.'}
              </p>
              <Button variant="secondary" size="sm" onClick={() => refetch()}>
                Retry
              </Button>
            </CardContent>
          </Card>
        ) : deals.length === 0 ? (
          /* Empty Pipeline */
          <Card className="glass border-[var(--border)] py-12">
            <CardContent className="flex flex-col items-center justify-center text-center space-y-4 max-w-md mx-auto">
              <div className="w-12 h-12 rounded-2xl bg-[var(--mint)]/10 text-[var(--mint)] flex items-center justify-center">
                <Briefcase className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="font-heading font-semibold text-base text-[var(--text)]">
                  Pipeline is Empty
                </h3>
                <p className="text-xs text-[var(--text-muted)]">
                  Create your first sales deal or load sample revenue data to test stage weighting, 3-scenario forecasts, and the AI Finance Director.
                </p>
              </div>
              <div className="flex items-center gap-3 pt-1">
                <Button variant="primary" onClick={() => handleOpenAddDeal('prospecting')} className="gap-2">
                  <Plus className="w-4 h-4" />
                  <span>Create Deal</span>
                </Button>
                <Button
                  variant="secondary"
                  onClick={handleLoadSampleData}
                  disabled={isSeeding}
                  className="gap-2"
                >
                  {isSeeding ? <Loader2 className="w-4 h-4 animate-spin text-[var(--cyan)]" /> : <Database className="w-4 h-4 text-[var(--cyan)]" />}
                  <span>Load Sample Data</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <DealsKanban
            deals={deals}
            onAddDeal={handleOpenAddDeal}
            onEditDeal={handleEditDeal}
            onDeleteDeal={(deal) => setDealToDelete(deal)}
          />
        )}
      </div>

      {/* Add / Edit Deal Dialog */}
      <DealDialog
        open={dealDialogOpen}
        onOpenChange={setDealDialogOpen}
        deal={dealToEdit}
        defaultStage={defaultStage}
        onSuccess={() => refetch()}
      />

      {/* Delete Deal Dialog */}
      <DeleteDealDialog
        dealId={dealToDelete?.id || null}
        dealName={dealToDelete?.name}
        open={Boolean(dealToDelete)}
        onOpenChange={(open) => !open && setDealToDelete(null)}
        onDeleted={() => {
          setDealToDelete(null);
          refetch();
        }}
      />
    </div>
  );
}
