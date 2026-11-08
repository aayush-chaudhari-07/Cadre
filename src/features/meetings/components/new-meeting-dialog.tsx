import React, { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Upload,
  FileText,
  Sparkles,
  AlertCircle,
  Loader2,
  Calendar,
  Building2,
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
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { stripSubtitleTimestamps, MAX_TRANSCRIPT_LENGTH } from '../parser';
import { useCreateMeeting, useAnalyzeMeeting } from '../hooks';
import { cn } from '@/lib/utils';

const newMeetingSchema = z.object({
  title: z.string().min(1, 'Meeting title is required.').max(200, 'Title cannot exceed 200 characters.'),
  company: z.string().max(100, 'Company cannot exceed 100 characters.').optional(),
  held_at: z.string().min(1, 'Meeting date is required.'),
  transcript: z
    .string()
    .min(10, 'Transcript must contain at least 10 characters.')
    .max(MAX_TRANSCRIPT_LENGTH, `Transcript must not exceed ${MAX_TRANSCRIPT_LENGTH.toLocaleString()} characters.`),
  autoAnalyze: z.boolean(),
});

type NewMeetingFormValues = z.infer<typeof newMeetingSchema>;

export interface NewMeetingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: (meetingId: string) => void;
}

export function NewMeetingDialog({
  open,
  onOpenChange,
  onSuccess,
}: NewMeetingDialogProps) {
  const [activeTab, setActiveTab] = useState<'paste' | 'upload'>('paste');
  const [fileName, setFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const createMutation = useCreateMeeting();
  const analyzeMutation = useAnalyzeMeeting();

  const todayStr = new Date().toISOString().split('T')[0];

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<NewMeetingFormValues>({
    resolver: zodResolver(newMeetingSchema),
    defaultValues: {
      title: '',
      company: '',
      held_at: todayStr,
      transcript: '',
      autoAnalyze: true,
    },
  });

  const transcript = watch('transcript') || '';
  const autoAnalyze = watch('autoAnalyze');
  const transcriptLength = transcript.length;
  const isNearLimit = transcriptLength > 50000;
  const isOverLimit = transcriptLength > MAX_TRANSCRIPT_LENGTH;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    const reader = new FileReader();

    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (!content) return;

      const lowerName = file.name.toLowerCase();
      let cleanedText = content;

      if (lowerName.endsWith('.vtt') || lowerName.endsWith('.srt')) {
        cleanedText = stripSubtitleTimestamps(content);
        toast.info(`Stripped subtitle timestamps from ${file.name}`);
      }

      if (cleanedText.length > MAX_TRANSCRIPT_LENGTH) {
        toast.warning(
          `Transcript exceeds ${MAX_TRANSCRIPT_LENGTH.toLocaleString()} characters. It has been truncated.`,
        );
        cleanedText = cleanedText.slice(0, MAX_TRANSCRIPT_LENGTH);
      }

      setValue('transcript', cleanedText, { shouldValidate: true });
      setActiveTab('paste'); // Switch to view/edit after upload
    };

    reader.onerror = () => {
      toast.error('Failed to read transcript file.');
    };

    reader.readAsText(file);
  };

  const onSubmit = async (values: NewMeetingFormValues) => {
    try {
      // 1. Create meeting in database
      const newMeeting = await createMutation.mutateAsync({
        title: values.title.trim(),
        company: values.company?.trim() || null,
        held_at: new Date(values.held_at).toISOString(),
        transcript: values.transcript.trim(),
      });

      // 2. Trigger Operations agent analysis if requested
      if (values.autoAnalyze) {
        toast.loading('Analyzing transcript with AI Operations Manager...', { id: 'meeting-analyze' });
        try {
          await analyzeMutation.mutateAsync({
            meetingId: newMeeting.id,
            title: newMeeting.title,
            transcript: newMeeting.transcript,
            company: newMeeting.company || undefined,
          });
          toast.success('Meeting analyzed and key actions extracted!', { id: 'meeting-analyze' });
        } catch (err: unknown) {
          const message = err instanceof Error ? err.message : 'Analysis failed';
          toast.error(`Meeting saved, but analysis failed: ${message}`, { id: 'meeting-analyze' });
        }
      } else {
        toast.success('Meeting saved successfully.');
      }

      reset();
      setFileName(null);
      onOpenChange(false);
      onSuccess?.(newMeeting.id);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to save meeting.';
      toast.error(message);
    }
  };

  const isSubmitting = createMutation.isPending || analyzeMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-heading text-lg flex items-center gap-2">
            <FileText className="w-5 h-5 text-[var(--cyan)]" />
            New Meeting Transcript
          </DialogTitle>
          <DialogDescription>
            Add a sales or team call transcript. The AI Operations Manager extracts action items, objections, and deal health.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2">
          {/* Title & Company Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="meeting-title" className="text-xs font-semibold">
                Meeting Title <span className="text-[var(--danger)]">*</span>
              </Label>
              <Input
                id="meeting-title"
                placeholder="e.g. Q3 Cadre Platform Demo"
                {...register('title')}
                disabled={isSubmitting}
                className={errors.title ? 'border-[var(--danger)]' : ''}
              />
              {errors.title && (
                <p className="text-xs text-[var(--danger)] flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.title.message}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="meeting-company" className="text-xs font-semibold flex items-center gap-1">
                <Building2 className="w-3.5 h-3.5 text-[var(--text-muted)]" />
                Company / Prospect
              </Label>
              <Input
                id="meeting-company"
                placeholder="e.g. Acme Corp"
                {...register('company')}
                disabled={isSubmitting}
              />
            </div>
          </div>

          {/* Date Picker */}
          <div className="space-y-1.5">
            <Label htmlFor="meeting-date" className="text-xs font-semibold flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-[var(--text-muted)]" />
              Date Held
            </Label>
            <Input
              id="meeting-date"
              type="date"
              {...register('held_at')}
              disabled={isSubmitting}
              className={errors.held_at ? 'border-[var(--danger)]' : ''}
            />
          </div>

          {/* Transcript Tabs & Upload */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="meeting-transcript" className="text-xs font-semibold">
                Transcript Content <span className="text-[var(--danger)]">*</span>
              </Label>
              <div className="flex items-center gap-1 bg-[var(--surface-raised)] p-0.5 rounded-lg border border-[var(--border)] text-xs">
                <button
                  type="button"
                  onClick={() => setActiveTab('paste')}
                  className={cn(
                    'px-2.5 py-1 rounded font-medium transition-colors',
                    activeTab === 'paste'
                      ? 'bg-[var(--surface)] text-[var(--text)] shadow-xs'
                      : 'text-[var(--text-muted)] hover:text-[var(--text)]',
                  )}
                >
                  Paste
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('upload');
                    fileInputRef.current?.click();
                  }}
                  className={cn(
                    'px-2.5 py-1 rounded font-medium flex items-center gap-1 transition-colors',
                    activeTab === 'upload'
                      ? 'bg-[var(--surface)] text-[var(--text)] shadow-xs'
                      : 'text-[var(--text-muted)] hover:text-[var(--text)]',
                  )}
                >
                  <Upload className="w-3 h-3" />
                  Upload .vtt / .srt / .txt
                </button>
              </div>
            </div>

            {/* Hidden File Input */}
            <input
              ref={fileInputRef}
              type="file"
              accept=".vtt,.srt,.txt,text/vtt,text/plain"
              className="hidden"
              onChange={handleFileUpload}
            />

            {/* Upload status pill if loaded */}
            {fileName && (
              <div className="flex items-center justify-between px-3 py-1.5 rounded-md bg-[var(--cyan)]/10 border border-[var(--cyan)]/20 text-xs text-[var(--cyan)]">
                <span className="truncate">Loaded: {fileName}</span>
                <button
                  type="button"
                  onClick={() => {
                    setFileName(null);
                    setValue('transcript', '', { shouldValidate: true });
                  }}
                  className="text-xs hover:underline ml-2"
                >
                  Clear
                </button>
              </div>
            )}

            {/* Textarea */}
            <div className="relative">
              <Textarea
                id="meeting-transcript"
                placeholder="Paste conversational dialogue, Zoom or Google Meet transcript here..."
                rows={8}
                {...register('transcript')}
                disabled={isSubmitting}
                className={cn(
                  'font-mono text-xs resize-y',
                  errors.transcript ? 'border-[var(--danger)]' : '',
                  isOverLimit ? 'border-[var(--danger)] focus:ring-[var(--danger)]' : '',
                )}
              />
            </div>

            {/* Live Character Counter & Notice */}
            <div className="flex items-center justify-between text-xs text-[var(--text-muted)]">
              <span className="text-[11px]">Don&apos;t paste passwords, payment cards or sensitive health data.</span>
              <span
                className={cn(
                  'font-mono text-xs',
                  isOverLimit
                    ? 'text-[var(--danger)] font-bold'
                    : isNearLimit
                      ? 'text-[var(--gold)]'
                      : 'text-[var(--text-muted)]',
                )}
              >
                {transcriptLength.toLocaleString()} / {MAX_TRANSCRIPT_LENGTH.toLocaleString()} chars
              </span>
            </div>

            {errors.transcript && (
              <p className="text-xs text-[var(--danger)] flex items-center gap-1 mt-1">
                <AlertCircle className="w-3 h-3" />
                {errors.transcript.message}
              </p>
            )}
          </div>

          {/* Auto-Analyze Switch */}
          <div className="flex items-center justify-between p-3 rounded-lg bg-[var(--surface-raised)] border border-[var(--border)]">
            <div className="space-y-0.5">
              <Label htmlFor="auto-analyze-switch" className="text-sm font-medium flex items-center gap-2 cursor-pointer">
                <Sparkles className="w-4 h-4 text-[var(--mint)]" />
                Analyze with Operations Agent now
              </Label>
              <p className="text-xs text-[var(--text-muted)]">
                Generates executive summary, action items with owners, risks, and deal health score immediately.
              </p>
            </div>
            <Switch
              id="auto-analyze-switch"
              checked={autoAnalyze}
              onCheckedChange={(checked) => setValue('autoAnalyze', checked)}
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
              disabled={isSubmitting || isOverLimit}
              className="gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  {analyzeMutation.isPending ? 'Analyzing with AI...' : 'Saving...'}
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  {autoAnalyze ? 'Save & Analyze' : 'Save Meeting'}
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
