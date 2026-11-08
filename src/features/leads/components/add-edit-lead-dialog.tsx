import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { leadFormSchema, type LeadFormInput, type LeadStatus } from '../schemas';
import type { LeadRecord } from '../api';
import { useCreateLead, useUpdateLead } from '../hooks';
import { toast } from 'sonner';

interface AddEditLeadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  orgId: string;
  leadToEdit?: LeadRecord | null;
}

export function AddEditLeadDialog({
  open,
  onOpenChange,
  orgId,
  leadToEdit,
}: AddEditLeadDialogProps) {
  const isEditing = Boolean(leadToEdit);
  const createLeadMutation = useCreateLead(orgId);
  const updateLeadMutation = useUpdateLead(orgId);

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isSubmitting },
  } = useForm<LeadFormInput>({
    resolver: zodResolver(leadFormSchema),
    defaultValues: {
      name: '',
      company: '',
      email: '',
      source: '',
      status: 'new',
      dealValue: 0,
    },
  });

  useEffect(() => {
    if (leadToEdit) {
      reset({
        name: leadToEdit.name,
        company: leadToEdit.company || '',
        email: leadToEdit.email || '',
        source: leadToEdit.source || '',
        status: (leadToEdit.status as LeadStatus) || 'new',
        dealValue: Number(leadToEdit.deal_value) || 0,
      });
    } else {
      reset({
        name: '',
        company: '',
        email: '',
        source: '',
        status: 'new',
        dealValue: 0,
      });
    }
  }, [leadToEdit, reset, open]);

  const onSubmit = async (data: LeadFormInput) => {
    try {
      if (isEditing && leadToEdit) {
        await updateLeadMutation.mutateAsync({
          leadId: leadToEdit.id,
          input: data,
        });
        toast.success(`Updated lead: ${data.name}`);
      } else {
        await createLeadMutation.mutateAsync(data);
        toast.success(`Created lead: ${data.name}`);
      }
      onOpenChange(false);
    } catch (err) {
      toast.error((err as Error).message || 'Failed to save lead');
    }
  };

  const isPending = createLeadMutation.isPending || updateLeadMutation.isPending || isSubmitting;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-[var(--surface)] border-[var(--border)] text-[var(--text)]">
        <DialogHeader>
          <DialogTitle className="font-display text-xl text-[var(--text)]">
            {isEditing ? 'Edit Commercial Lead' : 'Add New Commercial Lead'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-2">
          {/* Name */}
          <div className="space-y-1.5">
            <Label htmlFor="lead-name" className="text-xs text-[var(--text-2)] font-medium">
              Contact Name <span className="text-[var(--danger)]">*</span>
            </Label>
            <Input
              id="lead-name"
              placeholder="e.g. Maya Chen"
              {...register('name')}
              className="bg-[var(--surface-2)] border-[var(--border)]"
            />
            {errors.name && (
              <p className="text-xs text-[var(--danger)]">{errors.name.message}</p>
            )}
          </div>

          {/* Company */}
          <div className="space-y-1.5">
            <Label htmlFor="lead-company" className="text-xs text-[var(--text-2)] font-medium">
              Company
            </Label>
            <Input
              id="lead-company"
              placeholder="e.g. Northwind Labs"
              {...register('company')}
              className="bg-[var(--surface-2)] border-[var(--border)]"
            />
            {errors.company && (
              <p className="text-xs text-[var(--danger)]">{errors.company.message}</p>
            )}
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <Label htmlFor="lead-email" className="text-xs text-[var(--text-2)] font-medium">
              Email Address
            </Label>
            <Input
              id="lead-email"
              type="email"
              placeholder="e.g. maya@northwind.io"
              {...register('email')}
              className="bg-[var(--surface-2)] border-[var(--border)]"
            />
            {errors.email && (
              <p className="text-xs text-[var(--danger)]">{errors.email.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* Deal Value */}
            <div className="space-y-1.5">
              <Label htmlFor="lead-value" className="text-xs text-[var(--text-2)] font-medium">
                Deal Value (USD)
              </Label>
              <Input
                id="lead-value"
                type="number"
                step="100"
                placeholder="48000"
                {...register('dealValue', { valueAsNumber: true })}
                className="bg-[var(--surface-2)] border-[var(--border)] font-mono"
              />
              {errors.dealValue && (
                <p className="text-xs text-[var(--danger)]">{errors.dealValue.message}</p>
              )}
            </div>

            {/* Source */}
            <div className="space-y-1.5">
              <Label htmlFor="lead-source" className="text-xs text-[var(--text-2)] font-medium">
                Source
              </Label>
              <Input
                id="lead-source"
                placeholder="e.g. Inbound Demo"
                {...register('source')}
                className="bg-[var(--surface-2)] border-[var(--border)]"
              />
            </div>
          </div>

          {/* Status */}
          <div className="space-y-1.5">
            <Label htmlFor="lead-status" className="text-xs text-[var(--text-2)] font-medium">
              Pipeline Status
            </Label>
            <Controller
              control={control}
              name="status"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger id="lead-status" className="bg-[var(--surface-2)] border-[var(--border)]">
                    <SelectValue placeholder="Select pipeline status" />
                  </SelectTrigger>
                  <SelectContent className="bg-[var(--surface)] border-[var(--border)]">
                    <SelectItem value="new">New</SelectItem>
                    <SelectItem value="hot">Hot (High Urgency)</SelectItem>
                    <SelectItem value="warm">Warm (Engaged)</SelectItem>
                    <SelectItem value="cold">Cold (Low Urgency)</SelectItem>
                    <SelectItem value="won">Won (Closed)</SelectItem>
                    <SelectItem value="lost">Lost</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          <DialogFooter className="pt-4 border-t border-[var(--border)]">
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              className="bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] text-[var(--primary-ink)] font-semibold"
            >
              {isPending ? 'Saving...' : isEditing ? 'Save Changes' : 'Create Lead'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
