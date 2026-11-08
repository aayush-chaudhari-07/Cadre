import React, { useState, useEffect } from 'react';
import { Link } from '@tanstack/react-router';
import { Mail, CheckCircle2, Loader2, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { resendConfirmationEmail } from '../api';
import { getFriendlyAuthErrorMessage } from '../schemas';

interface CheckEmailCardProps {
  email: string;
}

export function CheckEmailCard({ email }: CheckEmailCardProps) {
  const [isResending, setIsResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  const [resendError, setResendError] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState(60);

  useEffect(() => {
    if (cooldown > 0) {
      const timer = setInterval(() => setCooldown((prev) => prev - 1), 1000);
      return () => clearInterval(timer);
    }
  }, [cooldown]);

  const handleResend = async () => {
    try {
      setIsResending(true);
      setResendError(null);
      await resendConfirmationEmail(email);
      setResendSuccess(true);
      setCooldown(60);
    } catch (err) {
      setResendError(getFriendlyAuthErrorMessage(err));
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="text-center space-y-5 animate-in fade-in duration-300">
      <div className="w-14 h-14 mx-auto rounded-2xl bg-[var(--primary)]/15 border border-[var(--primary)]/30 flex items-center justify-center text-[var(--primary)]">
        <Mail className="w-7 h-7" />
      </div>

      <div className="space-y-2">
        <h2 className="font-heading text-xl font-bold text-[var(--text)]">Check your email</h2>
        <p className="text-sm text-[var(--text-muted)] leading-relaxed">
          We sent a verification link to{' '}
          <span className="font-semibold text-[var(--text)]">{email}</span>. Please click the link
          to activate your account and start your revenue workspace.
        </p>
      </div>

      {resendSuccess && (
        <div className="p-3 rounded-lg bg-[var(--primary)]/10 border border-[var(--primary)]/20 text-xs text-[var(--primary)] flex items-center justify-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>New verification link dispatched to your inbox.</span>
        </div>
      )}

      {resendError && (
        <div className="p-3 rounded-lg bg-[var(--danger)]/10 border border-[var(--danger)]/20 text-xs text-[var(--danger)]">
          {resendError}
        </div>
      )}

      <div className="pt-2 flex flex-col gap-3">
        <Button
          type="button"
          variant="secondary"
          onClick={handleResend}
          disabled={isResending || cooldown > 0}
          className="w-full text-xs font-medium"
        >
          {isResending ? (
            <>
              <Loader2 className="w-3.5 h-3.5 mr-2 animate-spin" />
              Sending link...
            </>
          ) : cooldown > 0 ? (
            `Resend email in ${cooldown}s`
          ) : (
            'Resend confirmation email'
          )}
        </Button>

        <Link
          to="/login"
          search={{}}
          className="inline-flex items-center justify-center gap-1.5 text-xs text-[var(--primary)] hover:underline pt-2"
        >
          <span>Back to sign in</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
