import React, { useState } from 'react';
import { createFileRoute, useNavigate, Link } from '@tanstack/react-router';
import { LogOut, Database, Trash2, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/features/auth';
import { useWorkspace } from '@/features/workspace';

export const Route = createFileRoute('/app/')({
  component: AppDashboardPlaceholder,
});

function AppDashboardPlaceholder() {
  const { user, profile, signOut } = useAuth();
  const { workspace, membership, seedDemoData, clearDemoData } = useWorkspace();
  const navigate = useNavigate();

  const [actionStatus, setActionStatus] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);

  const displayName = profile?.display_name || user?.user_metadata?.display_name || user?.email || 'User';

  const handleSignOut = async () => {
    try {
      setIsSigningOut(true);
      await signOut();
      navigate({ to: '/login', search: {} });
    } catch (err: unknown) {
      setIsSigningOut(false);
      setActionError(err instanceof Error ? err.message : 'Sign out failed');
    }
  };

  const handleSeed = async () => {
    try {
      setIsProcessing(true);
      setActionStatus(null);
      setActionError(null);
      await seedDemoData();
      setActionStatus('Sample revenue data successfully seeded!');
    } catch (err: unknown) {
      setActionError(err instanceof Error ? err.message : 'Failed to seed sample data');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClear = async () => {
    try {
      setIsProcessing(true);
      setActionStatus(null);
      setActionError(null);
      await clearDemoData();
      setActionStatus('Sample demo records successfully cleared.');
    } catch (err: unknown) {
      setActionError(err instanceof Error ? err.message : 'Failed to clear sample data');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen p-6 sm:p-10 flex flex-col justify-between max-w-5xl mx-auto">
      {/* Top Bar */}
      <header className="flex items-center justify-between border-b border-[var(--border)] pb-6">
        <div className="flex items-center gap-3">
          <img src="/logo-mark.svg" alt="Cadre" className="w-9 h-9 rounded-xl" />
          <div>
            <div className="flex items-center gap-2">
              <span className="font-heading font-bold text-lg text-[var(--text)]">
                {workspace?.name || 'Workspace'}
              </span>
              <Badge variant="default">
                {workspace?.plan?.toUpperCase() || 'FREE'}
              </Badge>
            </div>
            <p className="text-xs text-[var(--text-muted)]">
              Role: <span className="capitalize font-medium">{membership?.role || 'owner'}</span>
            </p>
          </div>
        </div>

        <Button
          type="button"
          variant="ghost"
          onClick={handleSignOut}
          disabled={isSigningOut}
          className="text-xs text-[var(--text-muted)] hover:text-[var(--danger)]"
        >
          {isSigningOut ? (
            <Loader2 className="w-4 h-4 mr-1.5 animate-spin" />
          ) : (
            <LogOut className="w-4 h-4 mr-1.5" />
          )}
          Sign out
        </Button>
      </header>

      {/* Main Content */}
      <main className="my-auto py-12 space-y-8">
        <div className="space-y-3">
          <Badge variant="gold">
            Command Center • Prompt 4 Placeholder
          </Badge>
          <h1 className="font-heading text-3xl sm:text-4xl font-bold tracking-tight text-[var(--text)]">
            Welcome, {displayName}
          </h1>
          <p className="text-sm text-[var(--text-muted)] max-w-xl leading-relaxed">
            Your account and workspace are initialized and verified. The full signed-in shell,
            sidebar navigation, and AI module integrations will be assembled in Prompt 5.
          </p>
        </div>

        {actionStatus && (
          <div className="p-4 rounded-xl bg-[var(--primary)]/10 border border-[var(--primary)]/20 text-xs text-[var(--primary)] flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{actionStatus}</span>
          </div>
        )}

        {actionError && (
          <div className="p-4 rounded-xl bg-[var(--danger)]/10 border border-[var(--danger)]/20 text-xs text-[var(--danger)] flex items-center gap-2 animate-in fade-in">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{actionError}</span>
          </div>
        )}

        {/* Action Card */}
        <div className="glass rounded-2xl p-6 border border-[var(--border)] space-y-4">
          <h2 className="font-heading text-base font-semibold text-[var(--text)]">
            Demo Data Controls
          </h2>
          <p className="text-xs text-[var(--text-muted)]">
            Test the PostgreSQL RPC procedures for populating and purging sample revenue records.
          </p>

          <div className="flex flex-wrap gap-3 pt-2">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={handleSeed}
              disabled={isProcessing}
            >
              <Database className="w-3.5 h-3.5 mr-1.5 text-[var(--primary)]" />
              Seed sample records
            </Button>

            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleClear}
              disabled={isProcessing}
              className="text-[var(--danger)] hover:bg-[var(--danger)]/10"
            >
              <Trash2 className="w-3.5 h-3.5 mr-1.5" />
              Clear sample records
            </Button>
          </div>
        </div>

        {import.meta.env.DEV && (
          <div className="text-xs text-[var(--text-muted)]">
            Developer tools:{' '}
            <Link to="/design" className="text-[var(--primary)] underline hover:text-[var(--cyan)]">
              View Design System Showcase (/design)
            </Link>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="text-xs text-[var(--text-muted)] border-t border-[var(--border)] pt-4 flex justify-between items-center">
        <span>Cadre v1.0.0</span>
        <span>Obsidian &amp; Aurora Theme</span>
      </footer>
    </div>
  );
}
