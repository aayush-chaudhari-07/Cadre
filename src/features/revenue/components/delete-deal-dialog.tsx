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
import { useDeleteDeal } from '../hooks';
import { toast } from 'sonner';

export interface DeleteDealDialogProps {
  dealId: string | null;
  dealName?: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDeleted?: () => void;
}

export function DeleteDealDialog({
  dealId,
  dealName,
  open,
  onOpenChange,
  onDeleted,
}: DeleteDealDialogProps) {
  const deleteMutation = useDeleteDeal();

  const handleDelete = async () => {
    if (!dealId) return;

    try {
      await deleteMutation.mutateAsync(dealId);
      toast.success('Deal deleted from pipeline');
      onOpenChange(false);
      onDeleted?.();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to delete deal';
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
          <DialogTitle className="font-heading text-lg">Delete Pipeline Deal?</DialogTitle>
          <DialogDescription className="text-sm">
            Are you sure you want to delete{' '}
            <span className="font-medium text-[var(--text)]">
              &quot;{dealName || 'this deal'}&quot;
            </span>
            ? This will remove its value from the sales pipeline and revenue forecast. This action cannot be undone.
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
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="w-4 h-4" />
                Delete Deal
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
