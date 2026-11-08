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
import { useDeleteMeeting } from '../hooks';
import { toast } from 'sonner';

export interface DeleteMeetingDialogProps {
  meetingId: string | null;
  meetingTitle?: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDeleted?: () => void;
}

export function DeleteMeetingDialog({
  meetingId,
  meetingTitle,
  open,
  onOpenChange,
  onDeleted,
}: DeleteMeetingDialogProps) {
  const deleteMutation = useDeleteMeeting();

  const handleDelete = async () => {
    if (!meetingId) return;

    try {
      await deleteMutation.mutateAsync(meetingId);
      toast.success('Meeting deleted successfully');
      onOpenChange(false);
      onDeleted?.();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to delete meeting';
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
          <DialogTitle className="font-heading text-lg">Delete Meeting Record?</DialogTitle>
          <DialogDescription className="text-sm">
            Are you sure you want to delete{' '}
            <span className="font-medium text-[var(--text)]">
              &quot;{meetingTitle || 'this meeting'}&quot;
            </span>
            ? This will permanently remove its transcript, summary, and action items. This action cannot be undone.
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
                Delete Meeting
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

