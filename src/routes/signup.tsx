import React, { useState } from 'react';
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { AuthLayout } from '@/features/auth/components/auth-layout';
import { GoogleButton } from '@/features/auth/components/google-button';
import { CheckEmailCard } from '@/features/auth/components/check-email-card';
import { useAuth } from '@/features/auth';
import { signupSchema, getFriendlyAuthErrorMessage, type SignupInput } from '@/features/auth/schemas';
import { validateRedirectPath } from '@/features/auth/utils';

export const Route = createFileRoute('/signup')({
  validateSearch: (search: Record<string, unknown>) => ({
    redirect: typeof search.redirect === 'string' ? search.redirect : undefined,
  }),
  component: SignupPage,
});

function SignupPage() {
  const { redirect } = Route.useSearch();
  const targetPath = validateRedirectPath(redirect);
  const { signUp, user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [registeredEmail, setRegisteredEmail] = useState<string | null>(null);

  React.useEffect(() => {
    if (!authLoading && user && !registeredEmail) {
      navigate({ to: targetPath });
    }
  }, [user, authLoading, navigate, targetPath, registeredEmail]);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<SignupInput>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      displayName: '',
      email: '',
      password: '',
      terms: false,
    },
  });

  const onSubmit = async (data: SignupInput) => {
    try {
      setErrorMessage(null);
      const res = await signUp({
        displayName: data.displayName,
        email: data.email,
        password: data.password,
      });

      // If user session was not automatically established (email confirmation required)
      if (res.user && !res.session) {
        setRegisteredEmail(data.email);
      } else {
        // Auto-confirmed or session active
        navigate({ to: '/onboarding' });
      }
    } catch (err) {
      setErrorMessage(getFriendlyAuthErrorMessage(err));
    }
  };

  if (registeredEmail) {
    return (
      <AuthLayout
        title="Verification required"
        subtitle="One last step to initialize your workspace."
      >
        <CheckEmailCard email={registeredEmail} />
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Start your autonomous revenue team in 60 seconds."
      footer={
        <p>
          Already have an account?{' '}
          <Link
            to="/login"
            search={{ redirect }}
            className="text-[var(--primary)] font-medium hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] rounded px-1"
          >
            Sign in
          </Link>
        </p>
      }
    >
      <div className="space-y-5">
        <GoogleButton redirectPath="/onboarding" onError={setErrorMessage} />

        <div className="relative flex items-center justify-center">
          <div className="w-full border-t border-[var(--border)]" />
          <span className="bg-[var(--surface-1)] px-3 text-xs text-[var(--text-muted)] uppercase tracking-wider relative">
            or continue with email
          </span>
        </div>

        {errorMessage && (
          <div
            role="alert"
            className="p-3.5 rounded-xl bg-[var(--danger)]/10 border border-[var(--danger)]/25 text-xs text-[var(--danger)] flex items-start gap-2.5 animate-in fade-in"
          >
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span className="leading-relaxed">{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          <div className="space-y-1.5">
            <Label htmlFor="signup-name">Full name</Label>
            <Input
              id="signup-name"
              type="text"
              autoComplete="name"
              placeholder="Alex Miller"
              aria-invalid={Boolean(errors.displayName)}
              aria-describedby={errors.displayName ? 'name-error' : undefined}
              {...register('displayName')}
            />
            {errors.displayName && (
              <p id="name-error" className="text-xs text-[var(--danger)]">
                {errors.displayName.message}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="signup-email">Work email</Label>
            <Input
              id="signup-email"
              type="email"
              autoComplete="email"
              placeholder="alex@acmecorp.com"
              aria-invalid={Boolean(errors.email)}
              aria-describedby={errors.email ? 'signup-email-error' : undefined}
              {...register('email')}
            />
            {errors.email && (
              <p id="signup-email-error" className="text-xs text-[var(--danger)]">
                {errors.email.message}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="signup-password">Password</Label>
            <div className="relative">
              <Input
                id="signup-password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
                placeholder="At least 8 characters"
                className="pr-10"
                aria-invalid={Boolean(errors.password)}
                aria-describedby={errors.password ? 'signup-password-error' : undefined}
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
              <p id="signup-password-error" className="text-xs text-[var(--danger)]">
                {errors.password.message}
              </p>
            )}
          </div>

          <div className="pt-1">
            <div className="flex items-start gap-2.5">
              <Controller
                control={control}
                name="terms"
                render={({ field }) => (
                  <Checkbox
                    id="signup-terms"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    className="mt-0.5"
                    aria-invalid={Boolean(errors.terms)}
                    aria-describedby={errors.terms ? 'terms-error' : undefined}
                  />
                )}
              />
              <Label
                htmlFor="signup-terms"
                className="text-xs font-normal text-[var(--text-muted)] leading-relaxed cursor-pointer select-none"
              >
                I agree to the{' '}
                <Link
                  to="/terms"
                  target="_blank"
                  className="text-[var(--text)] underline hover:text-[var(--primary)]"
                >
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link
                  to="/privacy"
                  target="_blank"
                  className="text-[var(--text)] underline hover:text-[var(--primary)]"
                >
                  Privacy Policy
                </Link>
                .
              </Label>
            </div>
            {errors.terms && (
              <p id="terms-error" className="text-xs text-[var(--danger)] mt-1.5 ml-6">
                {errors.terms.message}
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
                Creating account...
              </>
            ) : (
              'Create account'
            )}
          </Button>
        </form>
      </div>
    </AuthLayout>
  );
}

