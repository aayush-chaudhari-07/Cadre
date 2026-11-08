import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  DollarSign,
  Briefcase,
  Calendar,
  Percent,
  Layers,
  AlertCircle,
  Loader2,
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
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { dealFormSchema, type DealFormData } from '../schemas';
import { STAGE_CONFIG, type DealStage } from '../forecast';
import { useCreateDeal, useUpdateDeal } from '../hooks';
import type { DealRow } from '../api';

export interface DealDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  deal?: DealRow | null;
  defaultStage?: DealStage;
  onSuccess?: (deal: DealRow) => void;
}

export function DealDialog({
  open,
  onOpenChange,
  deal,
  defaultStage = 'prospecting',
  onSuccess,
}: DealDialogProps) {
  const isEditing = Boolean(deal);
  const createMutation = useCreateDeal();
  const updateMutation = useUpdateDeal();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<DealFormData>({
    resolver: zodResolver(dealFormSchema),
    defaultValues: {
      name: '',
      amount: 15000,
      stage: defaultStage,
      probability: STAGE_CONFIG[defaultStage].defaultProb,
      expected_close: '',
    },
  });

  const selectedStage = watch('stage');

  useEffect(() => {
    if (deal) {
      reset({
        name: deal.name,
        amount: Number(deal.amount) || 0,
        stage: deal.stage as DealStage,
        probability: deal.probability,
        expected_close: deal.expected_close || '',
      });
    } else {
      reset({
        name: '',
        amount: 15000,
        stage: defaultStage,
        probability: STAGE_CONFIG[defaultStage].defaultProb,
        expected_close: '',
      });
    }
  }, [deal, defaultStage, reset, open]);

  // When stage changes on creation, suggest default probability
  const handleStageChange = (stage: DealStage) => {
    setValue('stage', stage);
    if (!isEditing) {
      setValue('probability', STAGE_CONFIG[stage].defaultProb);
    }
  };

  const onSubmit = async (values: DealFormData) => {
    try {
      if (isEditing && deal) {
        const updated = await updateMutation.mutateAsync({
          id: deal.id,
          updates: {
            name: values.name.trim(),
            amount: values.amount,
            stage: values.stage,
            probability: values.probability,
            expected_close: values.expected_close || null,
          },
        });
        toast.success(`Deal "${updated.name}" updated successfully.`);
        onOpenChange(false);
        onSuccess?.(updated);
      } else {
        const created = await createMutation.mutateAsync({
          name: values.name.trim(),
          amount: values.amount,
          stage: values.stage,
          probability: values.probability,
          expected_close: values.expected_close || null,
        });
        toast.success(`Deal "${created.name}" created successfully.`);
        onOpenChange(false);
        onSuccess?.(created);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to save deal.';
      toast.error(msg);
    }
  };

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="font-heading text-lg flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-[var(--mint)]" />
            {isEditing ? 'Edit Commercial Deal' : 'New Pipeline Deal'}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? 'Update deal value, sales stage progression, and target close date.'
              : 'Add an opportunity to your sales pipeline to model weighted revenue and scenarios.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2">
          {/* Deal Name */}
          <div className="space-y-1.5">
            <Label htmlFor="deal-name" className="text-xs font-semibold">
              Opportunity / Account Name <span className="text-[var(--danger)]">*</span>
            </Label>
            <Input
              id="deal-name"
              placeholder="e.g. Acme Corp Enterprise Expansion"
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

          {/* Amount & Probability Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="deal-amount" className="text-xs font-semibold flex items-center gap-1">
                <DollarSign className="w-3.5 h-3.5 text-[var(--mint)]" />
                Deal Value (USD) <span className="text-[var(--danger)]">*</span>
              </Label>
              <Input
                id="deal-amount"
                type="number"
                min="0"
                step="100"
                placeholder="25000"
                {...register('amount', { valueAsNumber: true })}
                disabled={isSubmitting}
                className={errors.amount ? 'border-[var(--danger)]' : ''}
              />
              {errors.amount && (
                <p className="text-xs text-[var(--danger)] flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.amount.message}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="deal-prob" className="text-xs font-semibold flex items-center gap-1">
                <Percent className="w-3.5 h-3.5 text-[var(--cyan)]" />
                Probability (0-100)
              </Label>
              <Input
                id="deal-prob"
                type="number"
                min="0"
                max="100"
                placeholder="50"
                {...register('probability', { valueAsNumber: true })}
                disabled={isSubmitting}
                className={errors.probability ? 'border-[var(--danger)]' : ''}
              />
            </div>
          </div>

          {/* Stage Selector */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold flex items-center gap-1">
              <Layers className="w-3.5 h-3.5 text-[var(--text-muted)]" />
              Sales Stage
            </Label>
            <Select
              value={selectedStage}
              onValueChange={(val) => handleStageChange(val as DealStage)}
              disabled={isSubmitting}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select pipeline stage" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(STAGE_CONFIG).map(([key, config]) => (
                  <SelectItem key={key} value={key}>
                    <div className="flex items-center gap-2">
                      <span
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: config.color }}
                      />
                      <span>{config.label}</span>
                      <span className="text-xs text-[var(--text-muted)] font-mono">
                        ({config.defaultProb}%)
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Target Close Date */}
          <div className="space-y-1.5">
            <Label htmlFor="deal-close" className="text-xs font-semibold flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-[var(--cyan)]" />
              Expected Close Date
            </Label>
            <Input
              id="deal-close"
              type="date"
              {...register('expected_close')}
              disabled={isSubmitting}
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
                <span>{isEditing ? 'Save Changes' : 'Create Deal'}</span>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

