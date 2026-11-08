import React, { useState, useMemo } from 'react';
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import {
  Sparkles,
  DollarSign,
  TrendingUp,
  Flame,
  ShieldAlert,
  Database,
  Bot,
  Loader2,
  ChevronRight,
  Activity,
} from 'lucide-react';
import { useAuth } from '@/features/auth';
import { useWorkspace } from '@/features/workspace';
import { useDeals, calculateRevenueMetrics, ForecastAreaChart, PipelineBarChart } from '@/features/revenue';
import { useLeads } from '@/features/leads';
import { useAccounts, calculateMrrAtRisk, RiskBadge } from '@/features/churn';
import { useGenerateInsights } from '@/features/insights';
import { supabase } from '@/lib/supabase';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { CountUp } from '@/components/motion/count-up';
import { formatCurrency, formatRelativeDate } from '@/lib/format';
import { toast } from 'sonner';

export const Route = createFileRoute('/app/')({
  component: CommandCenterPage,
});

function CommandCenterPage() {
  const { profile, user } = useAuth();
  const { workspace, seedDemoData } = useWorkspace();
  const orgId = workspace?.id;
  const navigate = useNavigate();
  const generateInsightsMutation = useGenerateInsights();

  const [isSeeding, setIsSeeding] = useState(false);

  const displayName =
    profile?.display_name || user?.user_metadata?.display_name || user?.email?.split('@')[0] || 'Leader';

  // 1. Data Queries
  const { data: deals = [], isLoading: dealsLoading, refetch: refetchDeals } = useDeals();
  const { data: leadsData, isLoading: leadsLoading, refetch: refetchLeads } = useLeads(orgId);
  const leads = useMemo(() => leadsData?.leads ?? [], [leadsData]);
  const { data: accounts = [], isLoading: accountsLoading, refetch: refetchAccounts } = useAccounts();

  // 2. Agent Runs Query (Live activity feed)
  const { data: agentRuns = [], isLoading: runsLoading, refetch: refetchRuns } = useQuery({
    queryKey: ['agent_runs_feed', orgId],
    queryFn: async () => {
      if (!orgId) return [];
      const { data, error } = await supabase
        .from('agent_runs')
        .select('*')
        .eq('org_id', orgId)
        .order('created_at', { ascending: false })
        .limit(8);

      if (error) throw new Error(error.message);
      return data ?? [];
    },
    enabled: Boolean(orgId),
    refetchInterval: 10 * 1000, // Refresh activity feed every 10s
  });

  // 3. Computed Metrics
  const revenueMetrics = useMemo(() => calculateRevenueMetrics(deals), [deals]);
  const mrrAtRisk = useMemo(() => calculateMrrAtRisk(accounts), [accounts]);

  const hotLeads = useMemo(() => {
    return leads.filter((l) => l.status === 'hot' || (l.score !== null && l.score >= 80));
  }, [leads]);

  const topLeads = useMemo(() => {
    return [...leads]
      .sort((a, b) => (Number(b.deal_value) || 0) - (Number(a.deal_value) || 0))
      .slice(0, 4);
  }, [leads]);

  const atRiskAccounts = useMemo(() => {
    return accounts
      .filter((a) => a.risk_level === 'high' || a.risk_level === 'critical')
      .slice(0, 4);
  }, [accounts]);

  const isWorkspaceEmpty = deals.length === 0 && leads.length === 0 && accounts.length === 0;

  const handleSeed = async () => {
    setIsSeeding(true);
    try {
      await seedDemoData();
      await Promise.all([refetchDeals(), refetchLeads(), refetchAccounts(), refetchRuns()]);
      toast.success('Sample revenue data and agent activities loaded!');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to seed sample data';
      toast.error(msg);
    } finally {
      setIsSeeding(false);
    }
  };

  const handleRunBrief = async () => {
    toast.loading("Running today's executive brief...", { id: 'cmd-brief' });
    try {
      await generateInsightsMutation.mutateAsync({ forceRefresh: false });
      toast.success("Executive brief ready", { id: 'cmd-brief' });
      navigate({ to: '/app/insights' });
    } catch (err) {
      toast.error(`Failed to run brief: ${(err as Error).message}`, { id: 'cmd-brief' });
    }
  };

  const isInitialLoading = dealsLoading && leadsLoading && accountsLoading;

  return (
    <div className="space-y-6">
      {/* Welcome & Command Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <h1 className="font-heading text-2xl sm:text-3xl font-bold tracking-tight text-[var(--text)]">
              Welcome back, {displayName}
            </h1>
            <Badge variant="outline" className="text-xs bg-[var(--surface-raised)] border-[var(--border)] font-mono">
              {workspace?.name || 'Workspace'}
            </Badge>
          </div>
          <p className="text-sm text-[var(--text-muted)]">
            Autonomous revenue intelligence across pipeline forecasting, customer retention, and commercial execution.
          </p>
        </div>

        {/* Header Actions */}
        <div className="flex items-center gap-2.5">
          <Button
            variant="secondary"
            onClick={handleRunBrief}
            disabled={generateInsightsMutation.isPending}
            className="gap-2 text-xs border-[var(--gold)]/30 text-[var(--gold)] hover:bg-[var(--gold)]/10"
          >
            {generateInsightsMutation.isPending ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin text-[var(--gold)]" />
            ) : (
              <Sparkles className="w-3.5 h-3.5" />
            )}
            <span>Run Today&apos;s Brief</span>
          </Button>

          {isWorkspaceEmpty && (
            <Button
              variant="primary"
              onClick={handleSeed}
              disabled={isSeeding}
              className="gap-2 text-xs"
            >
              {isSeeding ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Database className="w-3.5 h-3.5" />}
              <span>Load Sample Data</span>
            </Button>
          )}
        </div>
      </div>

      {/* Guided Empty State Banner */}
      {isWorkspaceEmpty && !isInitialLoading && (
        <Card className="glass border-[var(--cyan)]/30 bg-[var(--cyan)]/5 p-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <h3 className="font-heading font-semibold text-sm text-[var(--text)] flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[var(--cyan)]" />
                Initialize Your Revenue Engine
              </h3>
              <p className="text-xs text-[var(--text-muted)] leading-relaxed max-w-2xl">
                Your workspace is empty. Load verified sample commercial data to explore real-time forecasting, AI qualification rings, and churn detection, or begin tracking deals manually.
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Button
                variant="primary"
                size="sm"
                onClick={handleSeed}
                disabled={isSeeding}
                className="gap-2 text-xs"
              >
                {isSeeding ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Database className="w-3.5 h-3.5" />}
                <span>Seed Sample Data</span>
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => navigate({ to: '/app/leads' })}
                className="text-xs"
              >
                Add Lead
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* 4 KPI Cards Grid with CountUp (docs/PRD.md 5.2) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Open Pipeline */}
        <Card className="glass border-[var(--border)]">
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] flex items-center justify-between">
              <span>Open Pipeline</span>
              <DollarSign className="w-4 h-4 text-[var(--cyan)]" />
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0 space-y-1">
            <div className="font-heading text-2xl font-bold tracking-tight text-[var(--text)]">
              <CountUp value={revenueMetrics.totalPipeline} prefix="$" />
            </div>
            <p className="text-xs text-[var(--text-muted)]">
              {revenueMetrics.openCount} open {revenueMetrics.openCount === 1 ? 'deal' : 'deals'}
            </p>
          </CardContent>
        </Card>

        {/* Weighted Pipeline */}
        <Card className="glass border-[var(--border)]">
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-[var(--mint)] flex items-center justify-between">
              <span>Weighted Forecast</span>
              <TrendingUp className="w-4 h-4 text-[var(--mint)]" />
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0 space-y-1">
            <div className="font-heading text-2xl font-bold tracking-tight text-[var(--mint)]">
              <CountUp value={revenueMetrics.weightedPipeline} prefix="$" />
            </div>
            <p className="text-xs text-[var(--text-muted)]">
              Probability-adjusted nominal
            </p>
          </CardContent>
        </Card>

        {/* Hot Leads */}
        <Card className="glass border-[var(--border)]">
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-[var(--gold)] flex items-center justify-between">
              <span>Hot Qualified Leads</span>
              <Flame className="w-4 h-4 text-[var(--gold)]" />
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0 space-y-1">
            <div className="font-heading text-2xl font-bold tracking-tight text-[var(--text)]">
              <CountUp value={hotLeads.length} />
            </div>
            <p className="text-xs text-[var(--text-muted)]">
              Score ≥ 80 or high intent
            </p>
          </CardContent>
        </Card>

        {/* MRR at Risk */}
        <Card className="glass border-[var(--border)]">
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-[var(--danger)] flex items-center justify-between">
              <span>MRR at Risk</span>
              <ShieldAlert className="w-4 h-4 text-[var(--danger)]" />
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0 space-y-1">
            <div className="font-heading text-2xl font-bold tracking-tight text-[var(--danger)]">
              <CountUp value={mrrAtRisk} prefix="$" />
            </div>
            <p className="text-xs text-[var(--text-muted)]">
              High + critical risk accounts
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Visualizations: Forecast Area Chart & Stage Pipeline */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ForecastAreaChart deals={deals} />
        <PipelineBarChart deals={deals} />
      </div>

      {/* Operational Grids: Top Leads, At-Risk Accounts, & Agent Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Column 1 & 2: Top Leads & At-Risk Accounts */}
        <div className="lg:col-span-2 space-y-6">
          {/* Top Opportunities Card */}
          <Card className="glass border-[var(--border)]">
            <CardHeader className="p-4 pb-3 flex flex-row items-center justify-between border-b border-[var(--border)]">
              <CardTitle className="text-sm font-semibold flex items-center gap-2 text-[var(--text)]">
                <Flame className="w-4 h-4 text-[var(--gold)]" />
                <span>Priority Lead Opportunities</span>
              </CardTitle>
              <Link
                to="/app/leads"
                className="text-xs font-medium text-[var(--cyan)] hover:underline flex items-center gap-1"
              >
                <span>View all ({leads.length})</span>
                <ChevronRight className="w-3 h-3" />
              </Link>
            </CardHeader>
            <CardContent className="p-0">
              {topLeads.length === 0 ? (
                <div className="p-6 text-center text-xs text-[var(--text-muted)] italic">
                  No leads recorded yet. Add an inbound lead to view AI scoring.
                </div>
              ) : (
                <div className="divide-y divide-[var(--border)]/60">
                  {topLeads.map((lead) => (
                    <div
                      key={lead.id}
                      className="p-3.5 flex items-center justify-between gap-3 hover:bg-[var(--surface-raised)]/40 transition-colors"
                    >
                      <div className="space-y-0.5 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-[var(--text)] truncate">
                            {lead.name}
                          </span>
                          {lead.score !== null && (
                            <Badge
                              variant="outline"
                              className="text-[10px] font-mono bg-[var(--mint)]/10 text-[var(--mint)] border-[var(--mint)]/30"
                            >
                              {lead.score}/100
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-[var(--text-muted)]">
                          {lead.company && <span>{lead.company}</span>}
                          {lead.company && <span>&bull;</span>}
                          <span>{lead.intent || 'unscored'} intent</span>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="font-mono font-bold text-sm text-[var(--text)]">
                          {formatCurrency(Number(lead.deal_value) || 0)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* At-Risk Accounts Card */}
          <Card className="glass border-[var(--border)]">
            <CardHeader className="p-4 pb-3 flex flex-row items-center justify-between border-b border-[var(--border)]">
              <CardTitle className="text-sm font-semibold flex items-center gap-2 text-[var(--danger)]">
                <ShieldAlert className="w-4 h-4" />
                <span>At-Risk Customer Accounts</span>
              </CardTitle>
              <Link
                to="/app/churn"
                className="text-xs font-medium text-[var(--cyan)] hover:underline flex items-center gap-1"
              >
                <span>Churn Hub</span>
                <ChevronRight className="w-3 h-3" />
              </Link>
            </CardHeader>
            <CardContent className="p-0">
              {atRiskAccounts.length === 0 ? (
                <div className="p-6 text-center text-xs text-[var(--text-muted)] italic">
                  Zero critical accounts flagged. Customer retention health is stable.
                </div>
              ) : (
                <div className="divide-y divide-[var(--border)]/60">
                  {atRiskAccounts.map((account) => (
                    <div
                      key={account.id}
                      className="p-3.5 flex items-center justify-between gap-3 hover:bg-[var(--surface-raised)]/40 transition-colors"
                    >
                      <div className="space-y-0.5 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-[var(--text)] truncate">
                            {account.name}
                          </span>
                          <RiskBadge level={account.risk_level} />
                        </div>
                        <p className="text-xs text-[var(--text-muted)]">
                          Renewal: {account.renewal_date || 'None'}
                        </p>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="font-mono font-bold text-sm text-[var(--danger)]">
                          {formatCurrency(Number(account.mrr) || 0)}
                        </span>
                        <p className="text-[11px] text-[var(--text-muted)]">MRR</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Column 3: Live Agent Activity Feed */}
        <Card className="glass border-[var(--border)] flex flex-col">
          <CardHeader className="p-4 pb-3 flex flex-row items-center justify-between border-b border-[var(--border)]">
            <CardTitle className="text-sm font-semibold flex items-center gap-2 text-[var(--cyan)]">
              <Activity className="w-4 h-4" />
              <span>Agent Activity Stream</span>
            </CardTitle>
            <Link
              to="/app/agents"
              className="text-xs font-medium text-[var(--cyan)] hover:underline flex items-center gap-1"
            >
              <span>Agents</span>
              <ChevronRight className="w-3 h-3" />
            </Link>
          </CardHeader>
          <CardContent className="p-0 flex-1 overflow-y-auto max-h-[500px]">
            {runsLoading ? (
              <div className="p-4 space-y-3">
                {[1, 2, 3, 4].map((i) => (
                  <Skeleton key={i} className="h-14 w-full rounded-lg" />
                ))}
              </div>
            ) : agentRuns.length === 0 ? (
              <div className="p-8 text-center space-y-2">
                <Bot className="w-8 h-8 text-[var(--text-muted)] mx-auto opacity-50" />
                <p className="text-xs text-[var(--text-muted)] italic">
                  No automated runs yet. Analyze a lead, meeting, or account to see agent stream.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-[var(--border)]/60">
                {agentRuns.map((run) => (
                  <div
                    key={run.id}
                    className="p-3.5 space-y-1 hover:bg-[var(--surface-raised)]/40 transition-colors"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-[var(--mint)] font-mono">
                        {run.agent_key}
                      </span>
                      <span className="text-[10px] text-[var(--text-muted)]">
                        {formatRelativeDate(run.created_at)}
                      </span>
                    </div>
                    <p className="text-xs text-[var(--text)] line-clamp-2 leading-relaxed">
                      {run.summary || `Executed ${run.action}`}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
