import React, { useState, useEffect } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import {
  Compass,
  Plus,
  Search,
  AlertCircle,
  Database,
  Loader2,
} from 'lucide-react';
import { useWorkspace } from '@/features/workspace';
import {
  useCompetitors,
  useCompetitor,
  AddCompetitorDialog,
  DeleteCompetitorDialog,
  CompetitorCard,
  CompetitorDetailView,
  type CompetitorRow,
} from '@/features/competitors';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';

interface CompetitorsSearch {
  competitorId?: string;
}

export const Route = createFileRoute('/app/competitors')({
  validateSearch: (search: Record<string, unknown>): CompetitorsSearch => {
    return {
      competitorId: typeof search.competitorId === 'string' ? search.competitorId : undefined,
    };
  },
  component: CompetitorsPage,
});

function CompetitorsPage() {
  const { competitorId } = Route.useSearch();
  const navigate = Route.useNavigate();
  const { seedDemoData } = useWorkspace();

  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [competitorToDelete, setCompetitorToDelete] = useState<CompetitorRow | null>(null);
  const [isSeeding, setIsSeeding] = useState(false);

  // Debounce search
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  // List query
  const {
    data: competitors = [],
    isLoading: isListLoading,
    isError: isListError,
    error: listError,
    refetch: refetchCompetitors,
  } = useCompetitors(debouncedSearch);

  // Detail query for active competitor
  const {
    data: selectedCompetitor,
    isLoading: isDetailLoading,
    isError: isDetailError,
    error: detailError,
  } = useCompetitor(competitorId);

  const handleLoadSampleData = async () => {
    setIsSeeding(true);
    try {
      await seedDemoData();
      await refetchCompetitors();
      toast.success('Sample competitors and battlecards loaded');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to load sample data';
      toast.error(msg);
    } finally {
      setIsSeeding(false);
    }
  };

  // 1. DETAIL VIEW RENDERING (Zero redundant AI calls)
  if (competitorId) {
    if (isDetailLoading) {
      return (
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <Skeleton className="h-9 w-28 rounded-lg" />
            <Skeleton className="h-6 w-32 rounded-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-8 w-1/3" />
            <Skeleton className="h-4 w-1/4" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Skeleton className="h-48 rounded-xl" />
            <Skeleton className="h-48 rounded-xl" />
          </div>
          <Skeleton className="h-64 rounded-xl" />
        </div>
      );
    }

    if (isDetailError || !selectedCompetitor) {
      return (
        <Card className="glass border-[var(--border)] py-12">
          <CardContent className="flex flex-col items-center justify-center text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-[var(--danger)]/10 text-[var(--danger)] flex items-center justify-center">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="font-heading font-semibold text-lg text-[var(--text)]">Competitor Not Found</h3>
              <p className="text-sm text-[var(--text-muted)] max-w-sm">
                {detailError?.message || 'The requested competitor could not be found or you lack permission to view it.'}
              </p>
            </div>
            <Button
              variant="secondary"
              onClick={() => navigate({ search: {} })}
            >
              Back to Radar
            </Button>
          </CardContent>
        </Card>
      );
    }

    return (
      <CompetitorDetailView
        competitor={selectedCompetitor}
        onBack={() => navigate({ search: {} })}
        onDeleted={() => navigate({ search: {} })}
      />
    );
  }

  // 2. GRID LIST VIEW RENDERING
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <h1 className="font-heading text-2xl sm:text-3xl font-bold tracking-tight text-[var(--text)]">
              Competitor Radar
            </h1>
            <Badge variant="secondary">AI Marketing Manager</Badge>
          </div>
          <p className="text-sm text-[var(--text-muted)]">
            Scan public competitor sites, extract positioning shifts, and arm your revenue team with live battlecards.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="primary"
            onClick={() => setAddDialogOpen(true)}
            className="gap-2 shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Track Competitor</span>
          </Button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-[var(--text-muted)] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        <Input
          placeholder="Search competitors by name or website domain..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-9 text-sm"
        />
      </div>

      {/* Content Area */}
      {isListLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="glass border-[var(--border)] p-4 space-y-3">
              <div className="flex justify-between items-start">
                <Skeleton className="h-5 w-1/2" />
                <Skeleton className="h-5 w-6 rounded-full" />
              </div>
              <Skeleton className="h-4 w-1/3" />
              <Skeleton className="h-12 w-full" />
              <div className="flex justify-between items-center pt-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-8 w-20 rounded-lg" />
              </div>
            </Card>
          ))}
        </div>
      ) : isListError ? (
        <Card className="glass border-[var(--border)] py-12">
          <CardContent className="flex flex-col items-center justify-center text-center space-y-3">
            <AlertCircle className="w-8 h-8 text-[var(--danger)]" />
            <h3 className="font-heading font-semibold text-base text-[var(--text)]">Failed to load competitors</h3>
            <p className="text-xs text-[var(--text-muted)] max-w-sm">
              {listError?.message || 'An error occurred while fetching tracked competitors.'}
            </p>
            <Button variant="secondary" size="sm" onClick={() => refetchCompetitors()}>
              Retry
            </Button>
          </CardContent>
        </Card>
      ) : competitors.length === 0 ? (
        /* Empty State */
        <Card className="glass border-[var(--border)] py-16">
          <CardContent className="flex flex-col items-center justify-center text-center space-y-4 max-w-md mx-auto">
            <div className="w-14 h-14 rounded-2xl bg-[var(--cyan)]/10 border border-[var(--cyan)]/20 flex items-center justify-center text-[var(--cyan)]">
              <Compass className="w-7 h-7" />
            </div>

            <div className="space-y-1">
              <h3 className="font-heading font-semibold text-lg text-[var(--text)]">
                {searchTerm ? 'No matching competitors' : 'No competitors tracked yet'}
              </h3>
              <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                {searchTerm
                  ? 'Try searching with a different competitor name or domain.'
                  : 'Add competitor websites to your radar. The AI Marketing Agent crawls their public pages and synthesizes positioning, weaknesses, and sales battlecards.'}
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <Button
                variant="primary"
                onClick={() => setAddDialogOpen(true)}
                className="gap-2"
              >
                <Plus className="w-4 h-4" />
                <span>Track Competitor</span>
              </Button>

              {!searchTerm && (
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
          </CardContent>
        </Card>
      ) : (
        /* Grid of Competitor Cards */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {competitors.map((competitor) => (
            <CompetitorCard
              key={competitor.id}
              competitor={competitor}
              onClick={() => navigate({ search: { competitorId: competitor.id } })}
              onDeleteClick={(comp) => setCompetitorToDelete(comp)}
            />
          ))}
        </div>
      )}

      {/* Add Competitor Dialog */}
      <AddCompetitorDialog
        open={addDialogOpen}
        onOpenChange={setAddDialogOpen}
        onSuccess={(newComp) => {
          navigate({ search: { competitorId: newComp.id } });
        }}
      />

      {/* Delete Competitor Dialog */}
      <DeleteCompetitorDialog
        competitorId={competitorToDelete?.id || null}
        competitorName={competitorToDelete?.name}
        open={Boolean(competitorToDelete)}
        onOpenChange={(open) => !open && setCompetitorToDelete(null)}
        onDeleted={() => {
          setCompetitorToDelete(null);
          refetchCompetitors();
        }}
      />
    </div>
  );
}
