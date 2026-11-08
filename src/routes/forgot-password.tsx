import React, { useState } from 'react';
import { createFileRoute, Link } from '@tanstack/react-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AlertCircle, CheckCircle2, Loader2, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AuthLayout } from '@/features/auth/components/auth-layout';
import { useAuth } from '@/features/auth';
import {
  forgotPasswordSchema,
  getFriendlyAuthErrorMessage,
  type ForgotPasswordInput,
} from '@/features/auth/schemas';

export const Route = createFileRoute('/forgot-password')({
  component: ForgotPasswordPage,
});

function ForgotPasswordPage() {
  const { requestPasswordReset } = useAuth();
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (data: ForgotPasswordInput) => {
    try {
      setErrorMessage(null);
      await requestPasswordReset(data.email);
      setIsSuccess(true);
    } catch (err) {
      setErrorMessage(getFriendlyAuthErrorMessage(err));
    }
  };

  return (
    <AuthLayout
      title="Reset your password"
      subtitle="Enter your work email and we'll send you recovery instructions."
      footer={
        <Link
          to="/login"
          search={{}}
          className="inline-flex items-center justify-center gap-2 text-sm text-[var(--text-muted)] hover:text-[var(--text)] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to sign in</span>
        </Link>
      }
    >
      {isSuccess ? (
        <div className="space-y-5 animate-in fade-in duration-300">
          <div className="p-4 rounded-xl bg-[var(--primary)]/10 border border-[var(--primary)]/20 text-sm text-[var(--text)] space-y-2">
            <div className="flex items-center gap-2 text-[var(--primary)] font-medium">
              <CheckCircle2 className="w-5 h-5 shrink-0" />
              <span>Reset link dispatched</span>
            </div>
            <p className="text-xs text-[var(--text-muted)] leading-relaxed">
              If an account exists for <span className="text-[var(--text)] font-semibold">{getValues('email')}</span>, you will receive an email shortly with a link to reset your password.
            </p>
          </div>

          <Button
            type="button"
            variant="secondary"
            onClick={() => setIsSuccess(false)}
            className="w-full text-xs"
          >
            Try another email address
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
            <Label htmlFor="forgot-email">Work email</Label>
            <Input
              id="forgot-email"
              type="email"
              autoComplete="email"
              placeholder="you@company.com"
              aria-invalid={Boolean(errors.email)}
              aria-describedby={errors.email ? 'forgot-email-error' : undefined}
              {...register('email')}
            />
            {errors.email && (
              <p id="forgot-email-error" className="text-xs text-[var(--danger)]">
                {errors.email.message}
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
                Sending instructions...
              </>
            ) : (
              'Send reset link'
            )}
          </Button>
        </form>
      )}
    </AuthLayout>
  );
}
