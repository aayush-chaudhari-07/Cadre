import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Building2,
  DollarSign,
  Calendar,
  Tag,
  Plus,
  X,
  AlertCircle,
  Loader2,
  FileText,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { useCreateAccount, useUpdateAccount } from '../hooks';
import type { AccountRow } from '../api';

const accountSchema = z.object({
  name: z.string().min(1, 'Account name is required.').max(100, 'Name cannot exceed 100 characters.'),
  plan: z.string().max(50).optional(),
  mrr: z.number().min(0, 'MRR cannot be negative.'),
  renewal_date: z.string().optional(),
  notes: z.string().max(5000).optional(),
});

type AccountFormValues = z.infer<typeof accountSchema>;

export interface AddEditAccountDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  account?: AccountRow | null;
  onSuccess?: (account: AccountRow) => void;
}

const COMMON_SIGNALS = [
  'Champion left company',
  'Weekly usage drop >30%',
  'Unresponsive to QBR outreach',
  'Pricing pushback during renewal',
  'Executive leadership change',
  'Support tickets surge',
];

export function AddEditAccountDialog({
  open,
  onOpenChange,
  account,
  onSuccess,
}: AddEditAccountDialogProps) {
  const isEditing = Boolean(account);
  const createMutation = useCreateAccount();
  const updateMutation = useUpdateAccount();

  const [signals, setSignals] = useState<string[]>([]);
  const [signalInput, setSignalInput] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AccountFormValues>({
    resolver: zodResolver(accountSchema),
    defaultValues: {
      name: '',
      plan: 'Pro',
      mrr: 1000,
      renewal_date: '',
      notes: '',
    },
  });

  // Populate form when editing or resetting
  useEffect(() => {
    if (account) {
      reset({
        name: account.name,
        plan: account.plan || '',
        mrr: Number(account.mrr) || 0,
        renewal_date: account.renewal_date || '',
        notes: (account.last_analysis as { contextNotes?: string } | null)?.contextNotes || '',
      });
      const existingSignals = Array.isArray(account.signals) ? (account.signals as string[]) : [];
      setSignals(existingSignals);
    } else {
      reset({
        name: '',
        plan: 'Pro',
        mrr: 1000,
        renewal_date: '',
        notes: '',
      });
      setSignals([]);
    }
  }, [account, reset, open]);

  const addSignal = (signalText: string) => {
    const trimmed = signalText.trim();
    if (!trimmed) return;
    if (signals.includes(trimmed)) {
      toast.info('Signal is already added');
      return;
    }
    setSignals([...signals, trimmed]);
    setSignalInput('');
  };

  const removeSignal = (indexToRemove: number) => {
    setSignals(signals.filter((_, idx) => idx !== indexToRemove));
  };

  const onSubmit = async (values: AccountFormValues) => {
    try {
      if (isEditing && account) {
        const updated = await updateMutation.mutateAsync({
          id: account.id,
          updates: {
            name: values.name.trim(),
            plan: values.plan?.trim() || null,
            mrr: values.mrr,
            renewal_date: values.renewal_date || null,
            signals,
          },
        });
        toast.success(`Account "${updated.name}" updated successfully.`);
        onOpenChange(false);
        onSuccess?.(updated);
      } else {
        const created = await createMutation.mutateAsync({
          name: values.name.trim(),
          plan: values.plan?.trim() || null,
          mrr: values.mrr,
          renewal_date: values.renewal_date || null,
          signals,
        });
        toast.success(`Account "${created.name}" created successfully.`);
        onOpenChange(false);
        onSuccess?.(created);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to save account.';
      toast.error(msg);
    }
  };

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-heading text-lg flex items-center gap-2">
            <Building2 className="w-5 h-5 text-[var(--mint)]" />
            {isEditing ? 'Edit Account' : 'New Customer Account'}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? 'Update account plan, recurring revenue, renewal timeline, and churn hazard signals.'
              : 'Add an active customer account to monitor retention health and detect churn warning signals.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2">
          {/* Account Name */}
          <div className="space-y-1.5">
            <Label htmlFor="account-name" className="text-xs font-semibold">
              Account / Company Name <span className="text-[var(--danger)]">*</span>
            </Label>
            <Input
              id="account-name"
              placeholder="e.g. Acme Corporation"
              {...register('name')}
              disabled={isSubmitting}
              className={errors.name ? 'border-[var(--danger)]' : ''}
            />
            {errors.name && (
              <p className="text-xs text-[var(--danger)] flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors.name.message}
              </p>
            )}
          </div>

          {/* Plan & MRR Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="account-plan" className="text-xs font-semibold">
                Subscription Plan
              </Label>
              <Input
                id="account-plan"
                placeholder="e.g. Enterprise, Pro, Scale"
                {...register('plan')}
                disabled={isSubmitting}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="account-mrr" className="text-xs font-semibold flex items-center gap-1">
                <DollarSign className="w-3.5 h-3.5 text-[var(--mint)]" />
                Monthly Recurring Revenue (USD) <span className="text-[var(--danger)]">*</span>
              </Label>
              <Input
                id="account-mrr"
                type="number"
                min="0"
                step="0.01"
                placeholder="1000"
                {...register('mrr', { valueAsNumber: true })}
                disabled={isSubmitting}
                className={errors.mrr ? 'border-[var(--danger)]' : ''}
              />
              {errors.mrr && (
                <p className="text-xs text-[var(--danger)] flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.mrr.message}
                </p>
              )}
            </div>
          </div>

          {/* Renewal Date */}
          <div className="space-y-1.5">
            <Label htmlFor="account-renewal" className="text-xs font-semibold flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-[var(--cyan)]" />
              Contract Renewal Date
            </Label>
            <Input
              id="account-renewal"
              type="date"
              {...register('renewal_date')}
              disabled={isSubmitting}
            />
          </div>

          {/* Churn Signals Tag Editor */}
          <div className="space-y-2">
            <Label className="text-xs font-semibold flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-[var(--gold)]" />
              Active Churn & Retention Signals
            </Label>

            {/* Existing Signals Tags */}
            <div className="flex flex-wrap gap-1.5 min-h-8 p-2 rounded-lg bg-[var(--surface-raised)] border border-[var(--border)]">
              {signals.length === 0 ? (
                <span className="text-xs text-[var(--text-muted)] italic">
                  No signals added yet. Add warning indicators or disengagement flags below.
                </span>
              ) : (
                signals.map((sig, idx) => (
                  <Badge
                    key={idx}
                    variant="outline"
                    className="bg-[var(--gold)]/10 text-[var(--gold)] border-[var(--gold)]/30 gap-1.5 pr-1 font-normal text-xs"
                  >
                    <span>{sig}</span>
                    <button
                      type="button"
                      onClick={() => removeSignal(idx)}
                      className="hover:bg-[var(--gold)]/20 rounded p-0.5"
                      title="Remove signal"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))
              )}
            </div>

            {/* Signal Input Row */}
            <div className="flex items-center gap-2">
              <Input
                placeholder="Type a warning signal (e.g. Budget cut, Champion left)..."
                value={signalInput}
                onChange={(e) => setSignalInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addSignal(signalInput);
                  }
                }}
                disabled={isSubmitting}
                className="text-xs"
              />
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => addSignal(signalInput)}
                disabled={!signalInput.trim() || isSubmitting}
                className="gap-1 shrink-0 h-9"
              >
                <Plus className="w-3.5 h-3.5" />
                Add
              </Button>
            </div>

            {/* Quick Suggestion Chips */}
            <div className="space-y-1 pt-1">
              <p className="text-[11px] text-[var(--text-muted)]">Common churn indicators:</p>
              <div className="flex flex-wrap gap-1">
                {COMMON_SIGNALS.map((suggestion, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => addSignal(suggestion)}
                    className="text-[11px] px-2 py-0.5 rounded-full bg-[var(--surface-muted)] text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--surface-raised)] border border-[var(--border)] transition-colors"
                  >
                    + {suggestion}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Context Notes */}
          <div className="space-y-1.5">
            <Label htmlFor="account-notes" className="text-xs font-semibold flex items-center gap-1">
              <FileText className="w-3.5 h-3.5 text-[var(--text-muted)]" />
              Account Context & CSM Notes
            </Label>
            <Textarea
              id="account-notes"
              placeholder="Recent customer interactions, executive meetings, or support ticket context..."
              rows={3}
              {...register('notes')}
              disabled={isSubmitting}
              className="text-xs resize-y"
            />
          </div>

          <DialogFooter className="gap-2 pt-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={isSubmitting}
              className="gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <span>{isEditing ? 'Save Changes' : 'Create Account'}</span>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

