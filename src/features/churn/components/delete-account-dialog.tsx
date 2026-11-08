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
import { useDeleteAccount } from '../hooks';
import { toast } from 'sonner';

export interface DeleteAccountDialogProps {
  accountId: string | null;
  accountName?: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDeleted?: () => void;
}

export function DeleteAccountDialog({
  accountId,
  accountName,
  open,
  onOpenChange,
  onDeleted,
}: DeleteAccountDialogProps) {
  const deleteMutation = useDeleteAccount();

  const handleDelete = async () => {
    if (!accountId) return;

    try {
      await deleteMutation.mutateAsync(accountId);
      toast.success('Account deleted successfully');
      onOpenChange(false);
      onDeleted?.();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to delete account';
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
          <DialogTitle className="font-heading text-lg">Delete Customer Account?</DialogTitle>
          <DialogDescription className="text-sm">
            Are you sure you want to delete{' '}
            <span className="font-medium text-[var(--text)]">
              &quot;{accountName || 'this account'}&quot;
            </span>
            ? This will remove its recurring revenue and churn risk analysis. This action cannot be undone.
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
                Delete Account
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
