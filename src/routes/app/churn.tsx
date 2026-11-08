import React, { useState, useEffect, useMemo } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import {
  ShieldAlert,
  Plus,
  Search,
  Sparkles,
  DollarSign,
  TrendingDown,
  Calendar,
  AlertCircle,
  MoreVertical,
  Edit2,
  Trash2,
  ArrowUpDown,
  Building2,
  Database,
  Loader2,
  ShieldCheck,
} from 'lucide-react';
import { useWorkspace } from '@/features/workspace';
import {
  useAccounts,
  AddEditAccountDialog,
  DeleteAccountDialog,
  AnalyzeRiskDrawer,
  RiskBadge,
  HealthScoreBar,
  calculateChurnSummaryMetrics,
  getDaysUntilRenewal,
  type AccountRow,
  type ChurnRiskTierFilter,
  type ChurnSortField,
  type ChurnSortOrder,
} from '@/features/churn';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '@/components/ui/card';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { formatCurrency } from '@/lib/format';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export const Route = createFileRoute('/app/churn')({
  component: ChurnPage,
});

function ChurnPage() {
  const { seedDemoData } = useWorkspace();

  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [riskTierFilter, setRiskTierFilter] = useState<ChurnRiskTierFilter>('all');
  const [sortField, setSortField] = useState<ChurnSortField>('mrr');
  const [sortOrder, setSortOrder] = useState<ChurnSortOrder>('desc');

  // Modals / Drawers state
  const [addEditOpen, setAddEditOpen] = useState(false);
  const [accountToEdit, setAccountToEdit] = useState<AccountRow | null>(null);
  const [accountToDelete, setAccountToDelete] = useState<AccountRow | null>(null);
  const [analyzingAccountId, setAnalyzingAccountId] = useState<string | null>(null);
  const [isSeeding, setIsSeeding] = useState(false);

  // Debounce search
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  // Fetch accounts query
  const {
    data: accounts = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useAccounts({
    search: debouncedSearch,
    riskTier: riskTierFilter,
    sortField,
    sortOrder,
  });

  // Query all accounts (unfiltered) to compute summary KPI metrics
  const { data: allAccounts = [] } = useAccounts({
    search: undefined,
    riskTier: 'all',
  });

  // Calculate summary metrics strictly using the pure function
  const summary = useMemo(() => {
    return calculateChurnSummaryMetrics(allAccounts);
  }, [allAccounts]);

  const handleSort = (field: ChurnSortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  const handleLoadSampleData = async () => {
    setIsSeeding(true);
    try {
      await seedDemoData();
      await refetch();
      toast.success('Sample accounts and retention signals loaded');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to load sample data';
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
              Churn Guard
            </h1>
            <Badge variant="warning">AI Support Manager</Badge>
          </div>
          <p className="text-sm text-[var(--text-muted)]">
            Detect early account degradation, calculate MRR at risk, and execute AI retention plays.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="primary"
            onClick={() => {
              setAccountToEdit(null);
              setAddEditOpen(true);
            }}
            className="gap-2 shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Add Account</span>
          </Button>
        </div>
      </div>

      {/* Summary KPI Cards Grid (Prompt 10 Requirement) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total MRR Card */}
        <Card className="glass border-[var(--border)]">
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] flex items-center justify-between">
              <span>Total Active MRR</span>
              <DollarSign className="w-4 h-4 text-[var(--mint)]" />
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0 space-y-1">
            <p className="font-heading text-2xl font-bold tracking-tight text-[var(--text)]">
              {formatCurrency(summary.totalMrr)}
            </p>
            <p className="text-xs text-[var(--text-muted)]">
              Across {allAccounts.length} customer {allAccounts.length === 1 ? 'account' : 'accounts'}
            </p>
          </CardContent>
        </Card>

        {/* MRR at Risk Card */}
        <Card className="glass border-[var(--border)]">
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-[var(--danger)] flex items-center justify-between">
              <span>MRR at Risk</span>
              <TrendingDown className="w-4 h-4 text-[var(--danger)]" />
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0 space-y-1">
            <div className="flex items-baseline gap-2">
              <p className="font-heading text-2xl font-bold tracking-tight text-[var(--danger)]">
                {formatCurrency(summary.mrrAtRisk)}
              </p>
              {summary.totalMrr > 0 && (
                <span className="text-xs font-mono font-medium text-[var(--danger)]">
                  ({summary.mrrAtRiskPercent.toFixed(1)}%)
                </span>
              )}
            </div>
            <p className="text-xs text-[var(--text-muted)]">
              High + critical risk accounts
            </p>
          </CardContent>
        </Card>

        {/* Accounts at Risk Card */}
        <Card className="glass border-[var(--border)]">
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-[var(--gold)] flex items-center justify-between">
              <span>Accounts at Risk</span>
              <ShieldAlert className="w-4 h-4 text-[var(--gold)]" />
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0 space-y-1">
            <p className="font-heading text-2xl font-bold tracking-tight text-[var(--text)]">
              {summary.accountsAtRisk}
            </p>
            <p className="text-xs text-[var(--text-muted)]">
              Require proactive retention action
            </p>
          </CardContent>
        </Card>

        {/* Upcoming Renewals Card */}
        <Card className="glass border-[var(--border)]">
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-[var(--cyan)] flex items-center justify-between">
              <span>Next Renewals (30d)</span>
              <Calendar className="w-4 h-4 text-[var(--cyan)]" />
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0 space-y-1">
            <p className="font-heading text-2xl font-bold tracking-tight text-[var(--text)]">
              {summary.upcomingRenewalsCount}
            </p>
            <p className="text-xs text-[var(--text-muted)]">
              Upcoming contract milestones
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-[var(--text-muted)] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <Input
            placeholder="Search accounts by name or plan..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 text-sm"
          />
        </div>

        {/* Risk Tier Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {(['all', 'low', 'medium', 'high', 'critical'] as const).map((tier) => (
            <button
              key={tier}
              type="button"
              onClick={() => setRiskTierFilter(tier)}
              className={cn(
                'px-3 py-1.5 rounded-lg text-xs font-medium transition-all capitalize whitespace-nowrap',
                riskTierFilter === tier
                  ? 'bg-[var(--surface-raised)] text-[var(--text)] border border-[var(--border)] shadow-xs font-semibold'
                  : 'text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--surface-muted)]',
              )}
            >
              {tier === 'all' ? 'All Tiers' : `${tier} Risk`}
            </button>
          ))}
        </div>
      </div>

      {/* Accounts Table Content */}
      <Card className="glass border-[var(--border)] overflow-hidden">
        {isLoading ? (
          <div className="p-6 space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center justify-between gap-4">
                <Skeleton className="h-6 w-1/4" />
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-6 w-28" />
              </div>
            ))}
          </div>
        ) : isError ? (
          <div className="py-12 flex flex-col items-center justify-center text-center space-y-3">
            <AlertCircle className="w-8 h-8 text-[var(--danger)]" />
            <h3 className="font-heading font-semibold text-base text-[var(--text)]">Failed to load accounts</h3>
            <p className="text-xs text-[var(--text-muted)] max-w-sm">
              {error?.message || 'An error occurred while fetching customer accounts.'}
            </p>
            <Button variant="secondary" size="sm" onClick={() => refetch()}>
              Retry
            </Button>
          </div>
        ) : accounts.length === 0 ? (
          /* Empty State */
          <div className="py-16 flex flex-col items-center justify-center text-center space-y-4 max-w-md mx-auto p-4">
            <div className="w-14 h-14 rounded-2xl bg-[var(--mint)]/10 border border-[var(--mint)]/20 flex items-center justify-center text-[var(--mint)]">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <div className="space-y-1">
              <h3 className="font-heading font-semibold text-lg text-[var(--text)]">
                {searchTerm || riskTierFilter !== 'all'
                  ? 'No matching accounts found'
                  : 'No customer accounts tracked yet'}
              </h3>
              <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                {searchTerm || riskTierFilter !== 'all'
                  ? 'Try adjusting your search criteria or resetting the risk tier filter.'
                  : 'Track your recurring revenue base, tag churn warning signals, and let the AI Support Manager generate proactive retention playbooks.'}
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <Button
                variant="primary"
                onClick={() => {
                  setAccountToEdit(null);
                  setAddEditOpen(true);
                }}
                className="gap-2"
              >
                <Plus className="w-4 h-4" />
                <span>Add Account</span>
              </Button>

              {!searchTerm && riskTierFilter === 'all' && (
                <Button
                  variant="secondary"
                  onClick={handleLoadSampleData}
                  disabled={isSeeding}
                  className="gap-2"
                >
                  {isSeeding ? (
                    <Loader2 className="w-4 h-4 animate-spin text-[var(--cyan)]" />
                  ) : (
                    <Database className="w-4 h-4 text-[var(--cyan)]" />
                  )}
                  <span>Load Sample Data</span>
                </Button>
              )}
            </div>
          </div>
        ) : (
          /* Data Table */
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-b border-[var(--border)] hover:bg-transparent">
                  <TableHead
                    className="cursor-pointer hover:text-[var(--text)] font-semibold text-xs"
                    onClick={() => handleSort('name')}
                  >
                    <div className="flex items-center gap-1.5">
                      <span>Account</span>
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </TableHead>
                  <TableHead
                    className="cursor-pointer hover:text-[var(--text)] font-semibold text-xs"
                    onClick={() => handleSort('mrr')}
                  >
                    <div className="flex items-center gap-1.5">
                      <span>MRR (USD)</span>
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </TableHead>
                  <TableHead
                    className="cursor-pointer hover:text-[var(--text)] font-semibold text-xs"
                    onClick={() => handleSort('health_score')}
                  >
                    <div className="flex items-center gap-1.5">
                      <span>Health Score</span>
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </TableHead>
                  <TableHead className="font-semibold text-xs">
                    Risk Tier
                  </TableHead>
                  <TableHead
                    className="cursor-pointer hover:text-[var(--text)] font-semibold text-xs"
                    onClick={() => handleSort('renewal_date')}
                  >
                    <div className="flex items-center gap-1.5">
                      <span>Renewal</span>
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </TableHead>
                  <TableHead className="font-semibold text-xs">
                    Churn Signals
                  </TableHead>
                  <TableHead className="text-right font-semibold text-xs">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {accounts.map((account) => {
                  const renewalInfo = getDaysUntilRenewal(account.renewal_date);
                  const signals = Array.isArray(account.signals) ? (account.signals as string[]) : [];

                  return (
                    <TableRow
                      key={account.id}
                      className="border-b border-[var(--border)]/60 hover:bg-[var(--surface-raised)]/50 transition-colors"
                    >
                      {/* Name & Plan */}
                      <TableCell className="font-medium text-sm text-[var(--text)]">
                        <div className="flex items-center gap-2">
                          <Building2 className="w-4 h-4 text-[var(--text-muted)] shrink-0" />
                          <div className="flex flex-col">
                            <span className="font-semibold text-[var(--text)]">
                              {account.name}
                            </span>
                            {account.plan && (
                              <span className="text-[11px] text-[var(--text-muted)]">
                                {account.plan}
                              </span>
                            )}
                          </div>
                        </div>
                      </TableCell>

                      {/* MRR */}
                      <TableCell className="font-mono text-sm font-semibold text-[var(--text)]">
                        {formatCurrency(Number(account.mrr) || 0)}
                      </TableCell>

                      {/* Health Score Bar */}
                      <TableCell>
                        <HealthScoreBar score={account.health_score} />
                      </TableCell>

                      {/* Risk Badge */}
                      <TableCell>
                        <RiskBadge level={account.risk_level} />
                      </TableCell>

                      {/* Renewal Date with "in N days" */}
                      <TableCell className="text-xs">
                        {account.renewal_date ? (
                          <div className="flex flex-col">
                            <span className="font-medium text-[var(--text)]">
                              {account.renewal_date}
                            </span>
                            <span className={cn(
                              'text-[11px]',
                              renewalInfo.isPast
                                ? 'text-[var(--danger)]'
                                : renewalInfo.days <= 30
                                  ? 'text-[var(--gold)] font-medium'
                                  : 'text-[var(--text-muted)]',
                            )}>
                              {renewalInfo.label}
                            </span>
                          </div>
                        ) : (
                          <span className="text-[var(--text-muted)] italic text-xs">No date set</span>
                        )}
                      </TableCell>

                      {/* Signals Tag List */}
                      <TableCell>
                        {signals.length === 0 ? (
                          <span className="text-xs text-[var(--text-muted)] italic">None</span>
                        ) : (
                          <div className="flex flex-wrap gap-1 max-w-xs">
                            {signals.slice(0, 2).map((sig, idx) => (
                              <Badge
                                key={idx}
                                variant="outline"
                                className="text-[10px] bg-[var(--gold)]/10 text-[var(--gold)] border-[var(--gold)]/30 px-1.5 py-0"
                              >
                                {sig}
                              </Badge>
                            ))}
                            {signals.length > 2 && (
                              <Badge variant="outline" className="text-[10px] text-[var(--text-muted)] border-[var(--border)] px-1.5 py-0">
                                +{signals.length - 2} more
                              </Badge>
                            )}
                          </div>
                        )}
                      </TableCell>

                      {/* Actions */}
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => setAnalyzingAccountId(account.id)}
                            className="h-8 text-xs gap-1.5 text-[var(--cyan)] hover:text-[var(--cyan)]"
                          >
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>Analyze Risk</span>
                          </Button>

                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 text-[var(--text-muted)] hover:text-[var(--text)]"
                                aria-label="Account options"
                              >
                                <MoreVertical className="w-3.5 h-3.5" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() => {
                                  setAccountToEdit(account);
                                  setAddEditOpen(true);
                                }}
                                className="gap-2 cursor-pointer"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                                <span>Edit Account</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => setAccountToDelete(account)}
                                className="gap-2 text-[var(--danger)] focus:text-[var(--danger)] cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                <span>Delete Account</span>
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </Card>

      {/* Add / Edit Account Dialog */}
      <AddEditAccountDialog
        open={addEditOpen}
        onOpenChange={setAddEditOpen}
        account={accountToEdit}
        onSuccess={() => {
          refetch();
        }}
      />

      {/* Delete Account Dialog */}
      <DeleteAccountDialog
        accountId={accountToDelete?.id || null}
        accountName={accountToDelete?.name}
        open={Boolean(accountToDelete)}
        onOpenChange={(open) => !open && setAccountToDelete(null)}
        onDeleted={() => {
          setAccountToDelete(null);
          refetch();
        }}
      />

      {/* Analyze Risk Drawer */}
      <AnalyzeRiskDrawer
        open={Boolean(analyzingAccountId)}
        onOpenChange={(open) => !open && setAnalyzingAccountId(null)}
        accountId={analyzingAccountId}
        onSuccess={() => {
          refetch();
        }}
      />
    </div>
  );
}
