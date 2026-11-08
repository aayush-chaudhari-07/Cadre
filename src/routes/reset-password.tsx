import React, { useState } from 'react';
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, AlertCircle, CheckCircle2, Loader2, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AuthLayout } from '@/features/auth/components/auth-layout';
import { useAuth } from '@/features/auth';
import {
  resetPasswordSchema,
  getFriendlyAuthErrorMessage,
  type ResetPasswordInput,
} from '@/features/auth/schemas';

export const Route = createFileRoute('/reset-password')({
  component: ResetPasswordPage,
});

function ResetPasswordPage() {
  const { updatePassword } = useAuth();
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data: ResetPasswordInput) => {
    try {
      setErrorMessage(null);
      await updatePassword(data.password);
      setIsSuccess(true);
    } catch (err) {
      setErrorMessage(getFriendlyAuthErrorMessage(err));
    }
  };

  return (
    <AuthLayout
      title="Create new password"
      subtitle="Ensure your account is protected with a secure password."
      footer={
        <Link
          to="/login"
          search={{}}
          className="inline-flex items-center justify-center gap-1.5 text-xs text-[var(--primary)] hover:underline"
        >
          <span>Back to sign in</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      }
    >
      {isSuccess ? (
        <div className="space-y-5 animate-in fade-in duration-300">
          <div className="p-4 rounded-xl bg-[var(--primary)]/10 border border-[var(--primary)]/20 text-sm text-[var(--text)] space-y-2">
            <div className="flex items-center gap-2 text-[var(--primary)] font-medium">
              <CheckCircle2 className="w-5 h-5 shrink-0" />
              <span>Password updated</span>
            </div>
            <p className="text-xs text-[var(--text-muted)] leading-relaxed">
              Your password has been changed successfully. You can now use your new password to sign in.
            </p>
          </div>

          <Button
            type="button"
            variant="primary"
            onClick={() => navigate({ to: '/login', search: {} })}
            className="w-full h-10 font-semibold"
          >
            Continue to sign in
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          {errorMessage && (
            <div
              role="alert"
              className="p-3.5 rounded-xl bg-[var(--danger)]/10 border border-[var(--danger)]/25 text-xs text-[var(--danger)] flex items-start gap-2.5 animate-in fade-in"
            >
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span className="leading-relaxed">{errorMessage}</span>
            </div>
          )}

          <div className="space-y-1.5">
            <Label htmlFor="reset-new-password">New password</Label>
            <div className="relative">
              <Input
                id="reset-new-password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
                placeholder="At least 8 characters"
                className="pr-10"
                aria-invalid={Boolean(errors.password)}
                aria-describedby={errors.password ? 'reset-pwd-error' : undefined}
                {...register('password')}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text)] focus-visible:outline-none focus-visible:text-[var(--primary)]"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.password && (
              <p id="reset-pwd-error" className="text-xs text-[var(--danger)]">
                {errors.password.message}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="reset-confirm-password">Confirm new password</Label>
            <div className="relative">
              <Input
                id="reset-confirm-password"
                type={showConfirmPassword ? 'text' : 'password'}
                autoComplete="new-password"
                placeholder="Repeat password"
                className="pr-10"
                aria-invalid={Boolean(errors.confirmPassword)}
                aria-describedby={errors.confirmPassword ? 'confirm-pwd-error' : undefined}
                {...register('confirmPassword')}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text)] focus-visible:outline-none focus-visible:text-[var(--primary)]"
                aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
              >
                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p id="confirm-pwd-error" className="text-xs text-[var(--danger)]">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <Button
            type="submit"
            variant="primary"
            disabled={isSubmitting}
            className="w-full mt-2 h-10 font-semibold"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Updating password...
              </>
            ) : (
              'Reset password'
            )}
          </Button>
        </form>
      )}
    </AuthLayout>
  );
}
