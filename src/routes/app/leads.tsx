import React, { useState, useEffect } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { useWorkspace } from '@/features/workspace';
import {
  useLeads,
  type LeadRecord,
  type LeadStatus,
  type LeadSortField,
  type LeadSortOrder,
  ScoreRing,
  AddEditLeadDialog,
  DeleteLeadDialog,
  CsvImportDialog,
  LeadDrawer,
} from '@/features/leads';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
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
import { formatCurrency, formatRelativeDate } from '@/lib/format';
import { cn } from '@/lib/utils';
import {
  Target,
  Plus,
  Upload,
  Search,
  Sparkles,
  ArrowUpDown,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  Database,
  AlertCircle,
  FileSpreadsheet,
} from 'lucide-react';
import { toast } from 'sonner';

export const Route = createFileRoute('/app/leads')({
  component: LeadsPage,
});

const STATUS_FILTERS: { label: string; value: LeadStatus | 'all' }[] = [
  { label: 'All Leads', value: 'all' },
  { label: 'Hot', value: 'hot' },
  { label: 'Warm', value: 'warm' },
  { label: 'New', value: 'new' },
  { label: 'Cold', value: 'cold' },
  { label: 'Won', value: 'won' },
  { label: 'Lost', value: 'lost' },
];

function LeadsPage() {
  const { workspace, seedDemoData } = useWorkspace();
  const orgId = workspace?.id || '';
  const [seedingSampleData, setSeedingSampleData] = useState(false);

  // Filter & Pagination state
  const [searchInput, setSearchInput] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<LeadStatus | 'all'>('all');
  const [sortField, setSortField] = useState<LeadSortField>('created_at');
  const [sortOrder, setSortOrder] = useState<LeadSortOrder>('desc');
  const [page, setPage] = useState(1);
  const pageSize = 10;

  // Dialog & Drawer state
  const [addEditDialogOpen, setAddEditDialogOpen] = useState(false);
  const [leadToEdit, setLeadToEdit] = useState<LeadRecord | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [leadToDelete, setLeadToDelete] = useState<LeadRecord | null>(null);
  const [csvDialogOpen, setCsvDialogOpen] = useState(false);
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchInput);
      setPage(1); // Reset to page 1 on new search
    }, 300);
    return () => clearTimeout(timer);
  }, [searchInput]);

  // Fetch leads
  const { data, isLoading, isError, error, refetch } = useLeads(orgId, {
    search: debouncedSearch,
    status: selectedStatus,
    sortField,
    sortOrder,
    page,
    pageSize,
  });

  const leads = data?.leads ?? [];
  const totalCount = data?.totalCount ?? 0;
  const totalPages = data?.totalPages ?? 1;

  const handleSort = (field: LeadSortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  const handleSeedSampleData = async () => {
    try {
      setSeedingSampleData(true);
      await seedDemoData();
      toast.success('Sample sales leads loaded successfully!');
      refetch();
    } catch (err) {
      toast.error((err as Error).message || 'Failed to load sample data');
    } finally {
      setSeedingSampleData(false);
    }
  };

  const openDrawer = (leadId: string) => {
    setSelectedLeadId(leadId);
    setDrawerOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-[var(--text)]">
              Lead Intelligence
            </h1>
            <Badge variant="outline" className="border-[var(--primary)]/30 text-[var(--primary)] bg-[var(--primary)]/5 font-mono text-xs">
              <Sparkles className="w-3 h-3 mr-1" />
              AI Sales Manager
            </Badge>
          </div>
          <p className="text-sm text-[var(--text-2)]">
            Score prospects, extract buyer intent, and draft high-converting next actions with Google Gemini.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5">
          <Button
            variant="secondary"
            onClick={() => setCsvDialogOpen(true)}
            className="text-xs font-semibold bg-[var(--surface)] border-[var(--border)]"
          >
            <Upload className="w-3.5 h-3.5 mr-1.5" />
            Import CSV
          </Button>

          <Button
            onClick={() => {
              setLeadToEdit(null);
              setAddEditDialogOpen(true);
            }}
            className="text-xs font-semibold bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] text-[var(--primary-ink)] shadow-md shadow-[var(--primary)]/10"
          >
            <Plus className="w-3.5 h-3.5 mr-1.5" />
            Add Lead
          </Button>
        </div>
      </div>

      {/* Controls: Search & Status Filter Chips */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-3)]" />
          <Input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search by name, company, email..."
            className="pl-9 bg-[var(--surface)] border-[var(--border)] text-xs placeholder:text-[var(--text-3)]"
          />
        </div>

        {/* Status Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
          {STATUS_FILTERS.map((f) => (
            <button
              key={f.value}
              type="button"
              onClick={() => {
                setSelectedStatus(f.value);
                setPage(1);
              }}
              className={cn(
                'px-3 py-1.5 text-xs font-mono rounded-lg transition-all whitespace-nowrap',
                selectedStatus === f.value
                  ? 'bg-[var(--primary)] text-[var(--primary-ink)] font-bold shadow-sm'
                  : 'bg-[var(--surface)] text-[var(--text-2)] hover:text-[var(--text)] border border-[var(--border)] hover:bg-[var(--surface-2)]',
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Leads Table Container */}
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] overflow-hidden shadow-xl shadow-black/20">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-[var(--border)] bg-[var(--surface-2)]/40 hover:bg-transparent">
              <TableHead className="w-[280px] font-mono text-xs uppercase text-[var(--text-3)]">
                Contact & Company
              </TableHead>
              <TableHead className="font-mono text-xs uppercase text-[var(--text-3)]">
                Status
              </TableHead>
              <TableHead
                onClick={() => handleSort('score')}
                className="font-mono text-xs uppercase text-[var(--text-3)] cursor-pointer hover:text-[var(--text)]"
              >
                <div className="flex items-center gap-1">
                  <span>Score</span>
                  <ArrowUpDown className="w-3.5 h-3.5" />
                </div>
              </TableHead>
              <TableHead
                onClick={() => handleSort('deal_value')}
                className="font-mono text-xs uppercase text-[var(--text-3)] cursor-pointer hover:text-[var(--text)]"
              >
                <div className="flex items-center gap-1">
                  <span>Deal Value</span>
                  <ArrowUpDown className="w-3.5 h-3.5" />
                </div>
              </TableHead>
              <TableHead className="font-mono text-xs uppercase text-[var(--text-3)]">
                Intent
              </TableHead>
              <TableHead
                onClick={() => handleSort('created_at')}
                className="font-mono text-xs uppercase text-[var(--text-3)] cursor-pointer hover:text-[var(--text)]"
              >
                <div className="flex items-center gap-1">
                  <span>Contacted</span>
                  <ArrowUpDown className="w-3.5 h-3.5" />
                </div>
              </TableHead>
              <TableHead className="w-[50px] text-right font-mono text-xs uppercase text-[var(--text-3)]">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {isLoading ? (
              /* Loading Skeleton Rows */
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i} className="border-b border-[var(--border)]">
                  <TableCell><Skeleton className="h-5 w-44 bg-[var(--surface-2)]" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-16 bg-[var(--surface-2)]" /></TableCell>
                  <TableCell><Skeleton className="h-8 w-8 rounded-full bg-[var(--surface-2)]" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-20 bg-[var(--surface-2)]" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-16 bg-[var(--surface-2)]" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-24 bg-[var(--surface-2)]" /></TableCell>
                  <TableCell><Skeleton className="h-6 w-6 rounded bg-[var(--surface-2)] ml-auto" /></TableCell>
                </TableRow>
              ))
            ) : isError ? (
              /* Error State */
              <TableRow>
                <TableCell colSpan={7} className="py-12 text-center text-xs text-[var(--danger)]">
                  <AlertCircle className="w-6 h-6 mx-auto mb-2 opacity-80" />
                  <p className="font-medium">Failed to load commercial leads.</p>
                  <p className="text-[var(--text-3)] mt-1 font-mono">{(error as Error)?.message}</p>
                  <Button variant="secondary" size="sm" onClick={() => refetch()} className="mt-4">
                    Retry
                  </Button>
                </TableCell>
              </TableRow>
            ) : leads.length === 0 ? (
              /* Empty State with 3 actions */
              <TableRow>
                <TableCell colSpan={7} className="py-16 text-center">
                  <div className="max-w-md mx-auto space-y-4">
                    <div className="w-12 h-12 rounded-2xl bg-[var(--primary)]/10 border border-[var(--primary)]/20 flex items-center justify-center text-[var(--primary)] mx-auto">
                      <Target className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-base font-display font-bold text-[var(--text)]">
                        No leads found in this view
                      </h3>
                      <p className="text-xs text-[var(--text-2)] mt-1 leading-relaxed">
                        Add prospects manually, import a spreadsheet CSV, or initialize sample commercial data to start running autonomous evaluations.
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center justify-center gap-2.5 pt-2">
                      <Button
                        size="sm"
                        onClick={() => {
                          setLeadToEdit(null);
                          setAddEditDialogOpen(true);
                        }}
                        className="bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] text-[var(--primary-ink)] font-semibold text-xs"
                      >
                        <Plus className="w-3.5 h-3.5 mr-1.5" />
                        Add First Lead
                      </Button>

                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => setCsvDialogOpen(true)}
                        className="text-xs font-semibold bg-[var(--surface-2)]"
                      >
                        <FileSpreadsheet className="w-3.5 h-3.5 mr-1.5 text-[var(--primary)]" />
                        Import CSV
                      </Button>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleSeedSampleData}
                        disabled={seedingSampleData}
                        className="text-xs text-[var(--text-2)] hover:text-[var(--text)]"
                      >
                        <Database className="w-3.5 h-3.5 mr-1.5 text-[var(--gold)]" />
                        {seedingSampleData ? 'Seeding...' : 'Load Sample Data'}
                      </Button>
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              /* Data Rows */
              leads.map((lead) => (
                <TableRow
                  key={lead.id}
                  onClick={() => openDrawer(lead.id)}
                  className="border-b border-[var(--border)] hover:bg-[var(--surface-2)]/60 cursor-pointer transition-colors"
                >
                  {/* Contact & Company */}
                  <TableCell className="py-3.5">
                    <div>
                      <span className="font-medium text-xs text-[var(--text)] block group-hover:text-[var(--primary)]">
                        {lead.name}
                      </span>
                      <div className="flex items-center gap-2 text-[11px] text-[var(--text-3)] font-mono">
                        {lead.company && <span>{lead.company}</span>}
                        {lead.company && lead.email && <span>•</span>}
                        {lead.email && <span className="truncate max-w-[140px]">{lead.email}</span>}
                      </div>
                    </div>
                  </TableCell>

                  {/* Status Badge */}
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={cn('text-[10px] uppercase font-mono font-semibold', {
                        'border-[var(--primary)] text-[var(--primary)] bg-[var(--primary)]/10': lead.status === 'hot',
                        'border-[var(--secondary)] text-[var(--secondary)] bg-[var(--secondary)]/10': lead.status === 'warm',
                        'border-[var(--text-3)] text-[var(--text-3)] bg-[var(--surface-2)]': lead.status === 'cold' || lead.status === 'new',
                        'border-[var(--success)] text-[var(--success)] bg-[var(--success)]/10': lead.status === 'won',
                        'border-[var(--danger)] text-[var(--danger)] bg-[var(--danger)]/10': lead.status === 'lost',
                      })}
                    >
                      {lead.status}
                    </Badge>
                  </TableCell>

                  {/* AI Score */}
                  <TableCell>
                    <ScoreRing score={lead.score} size={36} strokeWidth={3} />
                  </TableCell>

                  {/* Deal Value */}
                  <TableCell className="font-mono text-xs font-semibold text-[var(--text)]">
                    {formatCurrency(Number(lead.deal_value) || 0)}
                  </TableCell>

                  {/* Intent */}
                  <TableCell>
                    {lead.intent ? (
                      <Badge variant="outline" className="text-[10px] font-mono text-[var(--primary)] border-[var(--primary)]/30 uppercase">
                        {lead.intent}
                      </Badge>
                    ) : (
                      <span className="text-xs text-[var(--text-3)] font-mono">—</span>
                    )}
                  </TableCell>

                  {/* Contacted / Created */}
                  <TableCell className="text-xs font-mono text-[var(--text-3)] whitespace-nowrap">
                    {lead.last_contact_at
                      ? formatRelativeDate(lead.last_contact_at)
                      : formatRelativeDate(lead.created_at)}
                  </TableCell>

                  {/* Row Actions Menu */}
                  <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-[var(--text-3)] hover:text-[var(--text)]">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-[var(--surface)] border-[var(--border)] text-xs">
                        <DropdownMenuItem onClick={() => openDrawer(lead.id)}>
                          Inspect & Analyze
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => {
                            setLeadToEdit(lead);
                            setAddEditDialogOpen(true);
                          }}
                        >
                          Edit Lead
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => {
                            setLeadToDelete(lead);
                            setDeleteDialogOpen(true);
                          }}
                          className="text-[var(--danger)] focus:text-[var(--danger)]"
                        >
                          Delete Lead
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        {/* Pagination Footer */}
        {totalCount > 0 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-[var(--border)] bg-[var(--surface-2)]/40 text-xs text-[var(--text-2)] font-mono">
            <span>
              Showing {leads.length > 0 ? (page - 1) * pageSize + 1 : 0} to{' '}
              {Math.min(page * pageSize, totalCount)} of {totalCount} leads
            </span>

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page <= 1}
                className="h-8 px-2 text-xs"
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                Previous
              </Button>
              <span>
                Page {page} of {totalPages}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setPage(Math.min(totalPages, page + 1))}
                disabled={page >= totalPages}
                className="h-8 px-2 text-xs"
              >
                Next
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Add / Edit Modal */}
      <AddEditLeadDialog
        open={addEditDialogOpen}
        onOpenChange={setAddEditDialogOpen}
        orgId={orgId}
        leadToEdit={leadToEdit}
      />

      {/* Delete Confirmation Modal */}
      <DeleteLeadDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        orgId={orgId}
        leadToDelete={leadToDelete}
        onDeleted={() => {
          if (selectedLeadId === leadToDelete?.id) {
            setDrawerOpen(false);
          }
        }}
      />

      {/* CSV Import Modal */}
      <CsvImportDialog
        open={csvDialogOpen}
        onOpenChange={setCsvDialogOpen}
        orgId={orgId}
      />

      {/* Lead Detail & AI Analysis Drawer */}
      <LeadDrawer
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        leadId={selectedLeadId}
        orgId={orgId}
      />
    </div>
  );
}
