import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Globe,
  Building2,
  AlertCircle,
  Loader2,
  Sparkles,
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
import { toast } from 'sonner';
import { competitorFormSchema, type CompetitorFormData } from '../schemas';
import { useCreateCompetitor } from '../hooks';
import type { CompetitorRow } from '../api';

export interface AddCompetitorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: (competitor: CompetitorRow) => void;
}

export function AddCompetitorDialog({
  open,
  onOpenChange,
  onSuccess,
}: AddCompetitorDialogProps) {
  const createMutation = useCreateCompetitor();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CompetitorFormData>({
    resolver: zodResolver(competitorFormSchema),
    defaultValues: {
      name: '',
      url: '',
    },
  });

  const onSubmit = async (values: CompetitorFormData) => {
    try {
      let normalizedUrl = values.url.trim();
      if (!normalizedUrl.startsWith('http://') && !normalizedUrl.startsWith('https://')) {
        normalizedUrl = 'https://' + normalizedUrl;
      }

      const created = await createMutation.mutateAsync({
        name: values.name.trim(),
        url: normalizedUrl,
      });

      toast.success(`Competitor "${created.name}" added to radar.`);
      reset();
      onOpenChange(false);
      onSuccess?.(created);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to add competitor.';
      toast.error(msg);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="font-heading text-lg flex items-center gap-2">
            <Globe className="w-5 h-5 text-[var(--cyan)]" />
            Track New Competitor
          </DialogTitle>
          <DialogDescription>
            Enter competitor name and public website URL. The AI Marketing Agent will scan their landing pages to extract market positioning and sales battlecards.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2">
          {/* Competitor Name */}
          <div className="space-y-1.5">
            <Label htmlFor="comp-name" className="text-xs font-semibold flex items-center gap-1">
              <Building2 className="w-3.5 h-3.5 text-[var(--text-muted)]" />
              Competitor Name <span className="text-[var(--danger)]">*</span>
            </Label>
            <Input
              id="comp-name"
              placeholder="e.g. Gong, Clari, Apollo"
              {...register('name')}
              disabled={createMutation.isPending}
              className={errors.name ? 'border-[var(--danger)]' : ''}
            />
            {errors.name && (
              <p className="text-xs text-[var(--danger)] flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors.name.message}
              </p>
            )}
          </div>

          {/* Website URL */}
          <div className="space-y-1.5">
            <Label htmlFor="comp-url" className="text-xs font-semibold flex items-center gap-1">
              <Globe className="w-3.5 h-3.5 text-[var(--text-muted)]" />
              Public Website URL <span className="text-[var(--danger)]">*</span>
            </Label>
            <Input
              id="comp-url"
              placeholder="https://competitor.com"
              {...register('url')}
              disabled={createMutation.isPending}
              className={errors.url ? 'border-[var(--danger)]' : ''}
            />
            {errors.url ? (
              <p className="text-xs text-[var(--danger)] flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors.url.message}
              </p>
            ) : (
              <p className="text-[11px] text-[var(--text-muted)]">
                Must be a publicly accessible HTTP/HTTPS domain (ports 80/443). Local and private IP ranges are blocked.
              </p>
            )}
          </div>

          <DialogFooter className="gap-2 pt-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
              disabled={createMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={createMutation.isPending}
              className="gap-2"
            >
              {createMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Adding...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Add to Radar
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

