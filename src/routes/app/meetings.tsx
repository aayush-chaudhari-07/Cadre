import React, { useState, useEffect } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import {
  Video,
  Plus,
  Search,
  Sparkles,
  Building2,
  Calendar,
  ChevronRight,
  MoreVertical,
  Trash2,
  ListCheck,
  AlertCircle,
  Database,
  Loader2,
} from 'lucide-react';
import { useWorkspace } from '@/features/workspace';
import {
  useMeetings,
  useMeeting,
  NewMeetingDialog,
  DeleteMeetingDialog,
  MeetingDetailView,
  SentimentBadge,
  DealHealthRing,
  type MeetingRow,
} from '@/features/meetings';
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
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { formatRelativeDate } from '@/lib/format';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface MeetingsSearch {
  meetingId?: string;
}

export const Route = createFileRoute('/app/meetings')({
  validateSearch: (search: Record<string, unknown>): MeetingsSearch => {
    return {
      meetingId: typeof search.meetingId === 'string' ? search.meetingId : undefined,
    };
  },
  component: MeetingsPage,
});

function MeetingsPage() {
  const { meetingId } = Route.useSearch();
  const navigate = Route.useNavigate();
  const { seedDemoData } = useWorkspace();

  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [sentimentFilter, setSentimentFilter] = useState<'all' | 'positive' | 'neutral' | 'negative'>('all');

  const [newMeetingOpen, setNewMeetingOpen] = useState(false);
  const [meetingToDelete, setMeetingToDelete] = useState<MeetingRow | null>(null);
  const [isSeeding, setIsSeeding] = useState(false);

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  // Query for meetings list
  const {
    data: meetings,
    isLoading: isListLoading,
    isError: isListError,
    error: listError,
    refetch: refetchMeetings,
  } = useMeetings(debouncedSearch);

  // Query for individual meeting detail when meetingId is present in URL
  const {
    data: selectedMeeting,
    isLoading: isDetailLoading,
    isError: isDetailError,
    error: detailError,
  } = useMeeting(meetingId);

  // Load sample data helper
  const handleLoadSampleData = async () => {
    setIsSeeding(true);
    try {
      await seedDemoData();
      await refetchMeetings();
      toast.success('Sample meetings data loaded successfully');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to load sample data';
      toast.error(msg);
    } finally {
      setIsSeeding(false);
    }
  };

  // 1. DETAIL VIEW RENDERING (Persisted results loaded with zero AI calls)
  if (meetingId) {
    if (isDetailLoading) {
      return (
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <Skeleton className="h-9 w-28 rounded-lg" />
            <Skeleton className="h-6 w-20 rounded-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-8 w-2/3" />
            <Skeleton className="h-4 w-1/3" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Skeleton className="h-44 rounded-xl" />
            <Skeleton className="h-44 rounded-xl md:col-span-2" />
          </div>
          <Skeleton className="h-64 rounded-xl" />
        </div>
      );
    }

    if (isDetailError || !selectedMeeting) {
      return (
        <Card className="glass border-[var(--border)] py-12">
          <CardContent className="flex flex-col items-center justify-center text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-[var(--danger)]/10 text-[var(--danger)] flex items-center justify-center">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="font-heading font-semibold text-lg text-[var(--text)]">Meeting Not Found</h3>
              <p className="text-sm text-[var(--text-muted)] max-w-sm">
                {detailError?.message || 'The requested meeting record could not be found or you lack permission to view it.'}
              </p>
            </div>
            <Button
              variant="secondary"
              onClick={() => navigate({ search: {} })}
            >
              Back to all meetings
            </Button>
          </CardContent>
        </Card>
      );
    }

    return (
      <MeetingDetailView
        meeting={selectedMeeting}
        onBack={() => navigate({ search: {} })}
        onDeleted={() => navigate({ search: {} })}
      />
    );
  }

  // Filter meetings by sentiment
  const filteredMeetings = (meetings || []).filter((m) => {
    if (sentimentFilter === 'all') return true;
    return m.sentiment?.toLowerCase() === sentimentFilter;
  });

  // 2. LIST VIEW RENDERING
  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <h1 className="font-heading text-2xl sm:text-3xl font-bold tracking-tight text-[var(--text)]">
              Meeting Analyzer
            </h1>
            <Badge variant="info">AI Operations Manager</Badge>
          </div>
          <p className="text-sm text-[var(--text-muted)]">
            Transcripts analyzed for executive decisions, assigned action items, and deal health momentum.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="primary"
            onClick={() => setNewMeetingOpen(true)}
            className="gap-2 shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>New Meeting</span>
          </Button>
        </div>
      </div>

      {/* Search and Sentiment Filter Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-[var(--text-muted)] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <Input
            placeholder="Search meetings by title or company..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 text-sm"
          />
        </div>

        {/* Sentiment Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {(['all', 'positive', 'neutral', 'negative'] as const).map((filter) => (
            <button
              key={filter}
              type="button"
              onClick={() => setSentimentFilter(filter)}
              className={cn(
                'px-3 py-1.5 rounded-lg text-xs font-medium transition-all capitalize whitespace-nowrap',
                sentimentFilter === filter
                  ? 'bg-[var(--surface-raised)] text-[var(--text)] border border-[var(--border)] shadow-xs'
                  : 'text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--surface-muted)]',
              )}
            >
              {filter === 'all' ? 'All Sentiments' : filter}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content: Loading, Error, Empty or List */}
      {isListLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="glass border-[var(--border)] p-4 space-y-3">
              <div className="flex justify-between items-start">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-5 w-16 rounded-full" />
              </div>
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-12 w-full" />
              <div className="flex justify-between items-center pt-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-8 w-16 rounded-lg" />
              </div>
            </Card>
          ))}
        </div>
      ) : isListError ? (
        <Card className="glass border-[var(--border)] py-12">
          <CardContent className="flex flex-col items-center justify-center text-center space-y-3">
            <AlertCircle className="w-8 h-8 text-[var(--danger)]" />
            <h3 className="font-heading font-semibold text-base text-[var(--text)]">Failed to load meetings</h3>
            <p className="text-xs text-[var(--text-muted)] max-w-sm">
              {listError?.message || 'An error occurred while fetching your meeting records.'}
            </p>
            <Button variant="secondary" size="sm" onClick={() => refetchMeetings()}>
              Retry
            </Button>
          </CardContent>
        </Card>
      ) : filteredMeetings.length === 0 ? (
        /* Empty State */
        <Card className="glass border-[var(--border)] py-16">
          <CardContent className="flex flex-col items-center justify-center text-center space-y-4 max-w-md mx-auto">
            <div className="w-14 h-14 rounded-2xl bg-[var(--cyan)]/10 border border-[var(--cyan)]/20 flex items-center justify-center text-[var(--cyan)]">
              <Video className="w-7 h-7" />
            </div>

            <div className="space-y-1">
              <h3 className="font-heading font-semibold text-lg text-[var(--text)]">
                {searchTerm || sentimentFilter !== 'all'
                  ? 'No matching meetings'
                  : 'No meetings analyzed yet'}
              </h3>
              <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                {searchTerm || sentimentFilter !== 'all'
                  ? 'Try adjusting your search criteria or resetting the sentiment filter.'
                  : 'Upload a sales call transcript (.vtt, .srt, .txt) or paste meeting notes. The AI Operations Manager automatically extracts action items, objections, and deal health momentum.'}
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <Button
                variant="primary"
                onClick={() => setNewMeetingOpen(true)}
                className="gap-2"
              >
                <Plus className="w-4 h-4" />
                <span>New Meeting</span>
              </Button>

              {!searchTerm && sentimentFilter === 'all' && (
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
        /* Grid of Meeting Cards */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredMeetings.map((meeting) => {
            const analysis = meeting.analysis as Record<string, unknown> | null;
            const dealHealth = typeof analysis?.deal_health === 'number' ? analysis.deal_health : null;
            const actionItems = Array.isArray(meeting.action_items) ? meeting.action_items : [];

            return (
              <Card
                key={meeting.id}
                className="glass border-[var(--border)] hover:border-[var(--cyan)]/40 transition-all duration-200 flex flex-col justify-between group cursor-pointer"
                onClick={() => navigate({ search: { meetingId: meeting.id } })}
              >
                <CardHeader className="p-4 pb-2 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-1 flex-1 min-w-0">
                      <CardTitle className="text-base font-semibold text-[var(--text)] group-hover:text-[var(--cyan)] transition-colors truncate">
                        {meeting.title}
                      </CardTitle>
                      {meeting.company && (
                        <p className="text-xs text-[var(--text-muted)] flex items-center gap-1 truncate">
                          <Building2 className="w-3 h-3 text-[var(--cyan)] shrink-0" />
                          <span>{meeting.company}</span>
                        </p>
                      )}
                    </div>

                    <div className="shrink-0">
                      <SentimentBadge sentiment={meeting.sentiment} />
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="p-4 pt-1 space-y-3 flex-1 flex flex-col justify-between">
                  {/* Summary Snippet */}
                  <p className="text-xs text-[var(--text-muted)] line-clamp-2 leading-relaxed">
                    {meeting.summary || 'Transcript stored. Click to run AI operations analysis.'}
                  </p>

                  {/* Badges / Metrics Row */}
                  <div className="pt-2 border-t border-[var(--border)]/50 flex items-center justify-between gap-2 text-xs text-[var(--text-muted)]">
                    <div className="flex items-center gap-3">
                      {dealHealth !== null ? (
                        <div className="flex items-center gap-1.5" title={`Deal Health Score: ${dealHealth}/100`}>
                          <DealHealthRing score={dealHealth} size={30} strokeWidth={3} showLabel={false} />
                          <span className="font-mono text-[11px] font-medium text-[var(--text)]">
                            {dealHealth}%
                          </span>
                        </div>
                      ) : (
                        <span className="text-[11px] font-mono text-[var(--text-muted)] italic">
                          No score
                        </span>
                      )}

                      {actionItems.length > 0 && (
                        <span className="flex items-center gap-1 text-[11px] text-[var(--mint)] bg-[var(--mint)]/10 px-2 py-0.5 rounded-full">
                          <ListCheck className="w-3 h-3" />
                          <span>{actionItems.length} actions</span>
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1 text-[11px]">
                      <Calendar className="w-3 h-3 text-[var(--text-muted)]" />
                      <span>{formatRelativeDate(meeting.held_at)}</span>
                    </div>
                  </div>

                  {/* Card Footer Actions */}
                  <div className="pt-2 flex items-center justify-between">
                    <span className="text-xs font-medium text-[var(--cyan)] flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                      <span>View Analysis</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </span>

                    <DropdownMenu>
                      <DropdownMenuTrigger
                        asChild
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 w-7 p-0 text-[var(--text-muted)] hover:text-[var(--text)]"
                          aria-label="Meeting actions"
                        >
                          <MoreVertical className="w-3.5 h-3.5" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
                        <DropdownMenuItem
                          onClick={() => navigate({ search: { meetingId: meeting.id } })}
                          className="gap-2 cursor-pointer"
                        >
                          <Sparkles className="w-3.5 h-3.5 text-[var(--cyan)]" />
                          <span>Open Details</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => setMeetingToDelete(meeting)}
                          className="gap-2 text-[var(--danger)] focus:text-[var(--danger)] cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Delete</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* New Meeting Modal */}
      <NewMeetingDialog
        open={newMeetingOpen}
        onOpenChange={setNewMeetingOpen}
        onSuccess={(id) => {
          navigate({ search: { meetingId: id } });
        }}
      />

      {/* Delete Meeting Dialog */}
      <DeleteMeetingDialog
        meetingId={meetingToDelete?.id || null}
        meetingTitle={meetingToDelete?.title}
        open={Boolean(meetingToDelete)}
        onOpenChange={(open) => !open && setMeetingToDelete(null)}
        onDeleted={() => {
          setMeetingToDelete(null);
          refetchMeetings();
        }}
      />
    </div>
  );
}
