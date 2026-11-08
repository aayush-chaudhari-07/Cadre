import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useDeleteLead } from '../hooks';
import type { LeadRecord } from '../api';
import { toast } from 'sonner';

interface DeleteLeadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  orgId: string;
  leadToDelete?: LeadRecord | null;
  onDeleted?: () => void;
}

export function DeleteLeadDialog({
  open,
  onOpenChange,
  orgId,
  leadToDelete,
  onDeleted,
}: DeleteLeadDialogProps) {
  const deleteMutation = useDeleteLead(orgId);

  const handleDelete = async () => {
    if (!leadToDelete) return;
    try {
      await deleteMutation.mutateAsync(leadToDelete.id);
      toast.success(`Deleted lead: ${leadToDelete.name}`);
      onOpenChange(false);
      onDeleted?.();
    } catch (err) {
      toast.error((err as Error).message || 'Failed to delete lead');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-[var(--surface)] border-[var(--border)] text-[var(--text)]">
        <DialogHeader>
          <DialogTitle className="font-display text-xl text-[var(--text)]">
            Delete Commercial Lead
          </DialogTitle>
          <DialogDescription className="text-xs sm:text-sm text-[var(--text-2)] pt-2 leading-relaxed">
            Are you sure you want to permanently delete{' '}
            <strong className="text-[var(--text)]">{leadToDelete?.name || 'this lead'}</strong>
            {leadToDelete?.company ? ` (${leadToDelete.company})` : ''}? All recorded interactions,
            AI scorings, and notes associated with this lead will be removed permanently.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="pt-4 border-t border-[var(--border)]">
          <Button
            type="button"
            variant="ghost"
            onClick={() => onOpenChange(false)}
            disabled={deleteMutation.isPending}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="danger"
            onClick={handleDelete}
            disabled={deleteMutation.isPending}
            className="font-semibold"
          >
            {deleteMutation.isPending ? 'Deleting...' : 'Delete Lead'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
