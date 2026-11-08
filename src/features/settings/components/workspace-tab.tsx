import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Building2, Save, Loader2, Sparkles, AlertTriangle, Trash2 } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { useWorkspace } from '@/features/workspace';
import { updateWorkspaceName } from '../api';
import { workspaceFormSchema, type WorkspaceFormValues } from '../schemas';
import { toast } from 'sonner';

export function WorkspaceTab() {
  const { workspace, refreshWorkspace, clearDemoData } = useWorkspace();
  const [isSaving, setIsSaving] = useState(false);
  const [clearDialogOpen, setClearDialogOpen] = useState(false);
  const [isClearing, setIsClearing] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<WorkspaceFormValues>({
    resolver: zodResolver(workspaceFormSchema),
    defaultValues: {
      name: workspace?.name || '',
    },
  });

  const onSubmit = async (values: WorkspaceFormValues) => {
    if (!workspace) return;
    setIsSaving(true);
    try {
      await updateWorkspaceName(workspace.id, values.name.trim());
      await refreshWorkspace();
      toast.success('Workspace name updated successfully');
    } catch (err) {
      toast.error(`Failed to update workspace name: ${(err as Error).message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleClearDemoData = async () => {
    setIsClearing(true);
    try {
      await clearDemoData();
      toast.success('Sample data removed from workspace');
      setClearDialogOpen(false);
    } catch (err) {
      toast.error(`Failed to clear sample data: ${(err as Error).message}`);
    } finally {
      setIsClearing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Workspace Profile & Name */}
      <Card className="glass border-[var(--border)]">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <CardTitle className="text-base flex items-center gap-2">
                <Building2 className="w-4 h-4 text-[var(--cyan)]" />
                <span>Workspace Information</span>
              </CardTitle>
              <CardDescription>
                Configure your commercial organization details and subscription tier.
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="default" className="text-xs uppercase font-mono">
                {workspace?.plan || 'Free'} Tier
              </Badge>
              <span className="text-xs text-[var(--text-muted)] font-mono">
                $0 USD / mo
              </span>
            </div>
          </div>
        </CardHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <div className="space-y-2 max-w-md">
              <Label htmlFor="workspace-name" className="text-xs">
                Organization Name <span className="text-[var(--danger)]">*</span>
              </Label>
              <Input
                id="workspace-name"
                {...register('name')}
                placeholder="e.g. Acme Revenue Ops"
                className="text-sm"
              />
              {errors.name && (
                <p className="text-xs text-[var(--danger)]">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div className="p-4 rounded-xl bg-[var(--surface-sunken)] border border-[var(--border)] space-y-2 text-xs text-[var(--text-muted)] max-w-lg">
              <div className="flex items-center gap-2 text-[var(--text)] font-semibold">
                <Sparkles className="w-3.5 h-3.5 text-[var(--cyan)]" />
                <span>Subscription Limits (Free Tier)</span>
              </div>
              <ul className="space-y-1 list-disc list-inside">
                <li>1 active commercial workspace organization</li>
                <li>40 AI analyses per day (shared across all 6 specialized agents)</li>
                <li>Full access to all 8 revenue intelligence modules</li>
                <li>Isolated multi-tenant row level security (PostgreSQL RLS)</li>
              </ul>
            </div>
          </CardContent>

          <CardFooter className="pt-4 border-t border-[var(--border)] flex justify-end">
            <Button
              type="submit"
              disabled={isSaving || !isDirty}
              className="gap-2 text-xs"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Workspace Name</span>
                </>
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>

      {/* Danger Zone: Clear Sample Data */}
      <Card className="glass border-[var(--danger)]/30">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2 text-[var(--danger)]">
            <AlertTriangle className="w-4 h-4" />
            <span>Workspace Danger Zone</span>
          </CardTitle>
          <CardDescription>
            Actions here affect sample records across your leads, deals, accounts, and meetings.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-[var(--surface-sunken)] border border-[var(--border)]">
            <div className="space-y-1">
              <p className="text-sm font-semibold text-[var(--text)]">
                Purge Sample Demo Data
              </p>
              <p className="text-xs text-[var(--text-muted)]">
                Deletes all records tagged as sample demo data (<code className="font-mono text-[10px]">is_demo = true</code>).
                Real commercial rows remain intact.
              </p>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setClearDialogOpen(true)}
              className="gap-2 text-xs border-[var(--danger)]/40 text-[var(--danger)] hover:bg-[var(--danger)]/10 shrink-0"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear Sample Data</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Confirm Clear Modal */}
      <Dialog open={clearDialogOpen} onOpenChange={setClearDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-[var(--danger)]">
              <AlertTriangle className="w-5 h-5" />
              <span>Confirm Demo Data Purge</span>
            </DialogTitle>
            <DialogDescription className="text-xs leading-relaxed pt-2">
              Are you sure you want to remove all sample leads, deals, meetings, and at-risk accounts?
              This operation executes the secure database RPC <code className="font-mono text-[11px]">clear_demo_data</code> and cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setClearDialogOpen(false)}
              disabled={isClearing}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={handleClearDemoData}
              disabled={isClearing}
              className="gap-1.5"
            >
              {isClearing ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Purging...</span>
                </>
              ) : (
                <>
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Yes, Purge Sample Data</span>
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

