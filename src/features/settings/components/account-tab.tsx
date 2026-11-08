import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { KeyRound, ShieldAlert, Loader2, AlertTriangle, Trash2, Check } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { useAuth } from '@/features/auth';
import { supabase } from '@/lib/supabase';
import { deleteAccountRequest } from '../api';
import {
  passwordChangeSchema,
  type PasswordChangeFormValues,
} from '../schemas';
import { toast } from 'sonner';
import { useNavigate } from '@tanstack/react-router';

export function AccountTab() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);

  const {
    register: registerPassword,
    handleSubmit: handleSubmitPassword,
    reset: resetPasswordForm,
    formState: { errors: passwordErrors },
  } = useForm<PasswordChangeFormValues>({
    resolver: zodResolver(passwordChangeSchema),
  });

  const onChangePassword = async (values: PasswordChangeFormValues) => {
    setIsChangingPassword(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: values.password,
      });

      if (error) {
        throw new Error(error.message);
      }

      toast.success('Password updated successfully');
      resetPasswordForm();
    } catch (err) {
      toast.error(`Failed to change password: ${(err as Error).message}`);
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmText !== 'DELETE') return;

    setIsDeletingAccount(true);
    toast.loading('Deleting account and cascading workspace data...', { id: 'delete-acc' });
    try {
      await deleteAccountRequest('DELETE');
      toast.success('Your account and workspace data have been permanently removed.', {
        id: 'delete-acc',
      });
      await signOut();
      navigate({ to: '/login' });
    } catch (err) {
      toast.error(`Deletion failed: ${(err as Error).message}`, { id: 'delete-acc' });
      setIsDeletingAccount(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Change Password Card */}
      <Card className="glass border-[var(--border)]">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <KeyRound className="w-4 h-4 text-[var(--primary)]" />
            <span>Security &amp; Password</span>
          </CardTitle>
          <CardDescription>
            Update your account password. Must contain at least 8 characters.
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmitPassword(onChangePassword)}>
          <CardContent className="space-y-4 max-w-md">
            <div className="space-y-2">
              <Label htmlFor="new-password" className="text-xs">
                New Password
              </Label>
              <Input
                id="new-password"
                type="password"
                {...registerPassword('password')}
                placeholder="••••••••••••"
                className="text-sm"
              />
              {passwordErrors.password && (
                <p className="text-xs text-[var(--danger)]">
                  {passwordErrors.password.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirm-password" className="text-xs">
                Confirm New Password
              </Label>
              <Input
                id="confirm-password"
                type="password"
                {...registerPassword('confirmPassword')}
                placeholder="••••••••••••"
                className="text-sm"
              />
              {passwordErrors.confirmPassword && (
                <p className="text-xs text-[var(--danger)]">
                  {passwordErrors.confirmPassword.message}
                </p>
              )}
            </div>
          </CardContent>

          <CardFooter className="pt-4 border-t border-[var(--border)] flex justify-end">
            <Button
              type="submit"
              disabled={isChangingPassword}
              className="gap-2 text-xs"
            >
              {isChangingPassword ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Updating...</span>
                </>
              ) : (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Update Password</span>
                </>
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>

      {/* Account Deletion Danger Zone */}
      <Card className="glass border-[var(--danger)]/40 bg-[var(--danger)]/5">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2 text-[var(--danger)]">
            <ShieldAlert className="w-4 h-4" />
            <span>Delete Personal Account</span>
          </CardTitle>
          <CardDescription>
            Permanently remove your login, personal profile, and all organizations you own.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-[var(--surface-sunken)] border border-[var(--danger)]/30">
            <div className="space-y-1">
              <p className="text-sm font-semibold text-[var(--text)]">
                Permanent Account Termination
              </p>
              <p className="text-xs text-[var(--text-muted)] max-w-lg leading-relaxed">
                Deleting your account will irreversibly erase your credentials (<span className="font-mono text-[11px] text-[var(--text)]">{user?.email}</span>),
                workspace memberships, and all proprietary customer intelligence. This cannot be undone.
              </p>
            </div>

            <Button
              variant="danger"
              size="sm"
              onClick={() => {
                setDeleteConfirmText('');
                setDeleteDialogOpen(true);
              }}
              className="gap-2 text-xs shrink-0"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete Account</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Confirmation Modal */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-[var(--danger)]">
              <AlertTriangle className="w-5 h-5" />
              <span>Are You Absolutely Sure?</span>
            </DialogTitle>
            <DialogDescription className="text-xs leading-relaxed pt-2 text-[var(--text-muted)]">
              This action is permanent and immediate. Your account and all workspace data will be deleted
              via administrative API.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-2">
            <Label htmlFor="confirm-delete-input" className="text-xs text-[var(--text)]">
              To proceed, please type <strong className="text-[var(--danger)] font-mono">DELETE</strong> below:
            </Label>
            <Input
              id="confirm-delete-input"
              value={deleteConfirmText}
              onChange={(e) => setDeleteConfirmText(e.target.value)}
              placeholder="DELETE"
              className="font-mono text-sm"
              autoFocus
            />
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setDeleteDialogOpen(false)}
              disabled={isDeletingAccount}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={handleDeleteAccount}
              disabled={deleteConfirmText !== 'DELETE' || isDeletingAccount}
              className="gap-1.5"
            >
              {isDeletingAccount ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Deleting...</span>
                </>
              ) : (
                <span>Permanently Delete</span>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
