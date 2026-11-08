import React, { useState } from 'react';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AlertCircle, Loader2, Sparkles, Database } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Burst } from '@/components/motion/burst';
import { AuroraBackground } from '@/components/motion/aurora-background';
import { useAuth } from '@/features/auth';
import { useWorkspace, workspaceSchema, type WorkspaceInput } from '@/features/workspace';

export const Route = createFileRoute('/onboarding')({
  component: OnboardingPage,
});

function OnboardingPage() {
  const { user, profile, loading: authLoading } = useAuth();
  const { workspace, createWorkspace, loading: wsLoading } = useWorkspace();
  const navigate = useNavigate();

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showBurst, setShowBurst] = useState(false);

  // If already authenticated and already has a workspace, redirect to /app
  React.useEffect(() => {
    if (!authLoading && !wsLoading) {
      if (!user) {
        navigate({ to: '/login', search: { redirect: '/onboarding' } });
      } else if (workspace) {
        navigate({ to: '/app' });
      }
    }
  }, [user, workspace, authLoading, wsLoading, navigate]);

  const defaultName = profile?.display_name
    ? `${profile.display_name.split(' ')[0]}'s Workspace`
    : 'My Revenue Workspace';

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<WorkspaceInput>({
    resolver: zodResolver(workspaceSchema),
    defaultValues: {
      name: defaultName,
      startWithSampleData: true,
    },
  });

  const onSubmit = async (data: WorkspaceInput) => {
    try {
      setErrorMessage(null);
      await createWorkspace(data.name, data.startWithSampleData);
      setShowBurst(true);
      setTimeout(() => {
        navigate({ to: '/app' });
      }, 800);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to create workspace. Please try again.';
      setErrorMessage(msg);
    }
  };

  return (
    <div className="min-h-screen w-full relative flex items-center justify-center p-6 bg-[var(--background)] text-[var(--text)] overflow-hidden">
      <AuroraBackground className="absolute inset-0 opacity-40 pointer-events-none" />

      {/* Burst confetti animation on successful creation */}
      {showBurst && <Burst />}

      <div className="relative z-10 w-full max-w-lg">
        <div className="glass rounded-3xl p-8 sm:p-10 border border-[var(--border)] shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[var(--primary)] via-[var(--cyan)] to-[var(--gold)]" />

          {/* Logo & Badge */}
          <div className="flex items-center gap-3 mb-6">
            <img src="/logo-mark.svg" alt="Cadre logo" className="w-10 h-10 rounded-xl" />
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-[var(--surface-2)] text-[var(--primary)] border border-[var(--border)]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Step 1 of 1: Workspace setup</span>
            </div>
          </div>

          <div className="mb-7">
            <h1 className="font-heading text-2xl sm:text-3xl font-bold tracking-tight text-[var(--text)]">
              Name your revenue workspace
            </h1>
            <p className="text-sm text-[var(--text-muted)] mt-2 leading-relaxed">
              Your autonomous AI agents will be provisioned inside this workspace to coordinate
              sales, marketing, customer success, and forecasting.
            </p>
          </div>

          {errorMessage && (
            <div
              role="alert"
              className="mb-6 p-3.5 rounded-xl bg-[var(--danger)]/10 border border-[var(--danger)]/25 text-xs text-[var(--danger)] flex items-start gap-2.5 animate-in fade-in"
            >
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span className="leading-relaxed">{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
            <div className="space-y-2">
              <Label htmlFor="workspace-name" className="text-sm font-semibold">
                Workspace name
              </Label>
              <Input
                id="workspace-name"
                placeholder="e.g. Northwind Growth"
                aria-invalid={Boolean(errors.name)}
                aria-describedby={errors.name ? 'ws-name-error' : undefined}
                className="h-11 text-base"
                {...register('name')}
              />
              {errors.name && (
                <p id="ws-name-error" className="text-xs text-[var(--danger)]">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div className="p-4 rounded-2xl bg-[var(--surface-2)]/60 border border-[var(--border)] space-y-3">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2.5">
                  <Database className="w-4 h-4 text-[var(--primary)] shrink-0" />
                  <Label htmlFor="sample-data-switch" className="text-sm font-medium cursor-pointer">
                    Start with sample data
                  </Label>
                </div>
                <Controller
                  control={control}
                  name="startWithSampleData"
                  render={({ field }) => (
                    <Switch
                      id="sample-data-switch"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  )}
                />
              </div>
              <p className="text-xs text-[var(--text-muted)] leading-relaxed pl-6">
                Pre-populates sample leads, pipeline deals, at-risk accounts, and competitor radar
                entries so you can immediately experience all 6 agents in action. (You can clear this anytime).
              </p>
            </div>

            <Button
              type="submit"
              variant="primary"
              disabled={isSubmitting || showBurst}
              className="w-full h-11 text-base font-semibold"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Provisioning AI team...
                </>
              ) : showBurst ? (
                'Workspace Ready!'
              ) : (
                'Launch workspace'
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
