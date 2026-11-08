import React from 'react';
import { Trash2, AlertTriangle, Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useDeleteCompetitor } from '../hooks';
import { toast } from 'sonner';

export interface DeleteCompetitorDialogProps {
  competitorId: string | null;
  competitorName?: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDeleted?: () => void;
}

export function DeleteCompetitorDialog({
  competitorId,
  competitorName,
  open,
  onOpenChange,
  onDeleted,
}: DeleteCompetitorDialogProps) {
  const deleteMutation = useDeleteCompetitor();

  const handleDelete = async () => {
    if (!competitorId) return;

    try {
      await deleteMutation.mutateAsync(competitorId);
      toast.success('Competitor removed from radar');
      onOpenChange(false);
      onDeleted?.();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to delete competitor';
      toast.error(message);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="w-10 h-10 rounded-full bg-[var(--danger)]/10 text-[var(--danger)] flex items-center justify-center mb-2">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <DialogTitle className="font-heading text-lg">Remove Competitor?</DialogTitle>
          <DialogDescription className="text-sm">
            Are you sure you want to remove{' '}
            <span className="font-medium text-[var(--text)]">
              &quot;{competitorName || 'this competitor'}&quot;
            </span>
            ? All scanned positioning insights, strengths/weaknesses, and sales battlecards will be permanently deleted.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="gap-2 pt-2">
          <Button
            variant="ghost"
            onClick={() => onOpenChange(false)}
            disabled={deleteMutation.isPending}
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={handleDelete}
            disabled={deleteMutation.isPending}
            className="gap-2"
          >
            {deleteMutation.isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Removing...
              </>
            ) : (
              <>
                <Trash2 className="w-4 h-4" />
                Remove Competitor
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
