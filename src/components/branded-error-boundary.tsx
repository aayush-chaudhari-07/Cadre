import React from 'react';
import { Link } from '@tanstack/react-router';
import { RotateCcw, Home, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface BrandedErrorBoundaryProps {
  error?: Error | unknown;
  reset?: () => void;
}

export function BrandedErrorBoundary({ error, reset }: BrandedErrorBoundaryProps) {
  const errorMessage =
    error instanceof Error ? error.message : 'An unexpected application error occurred.';

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center select-none">
      {/* Node Motif Error Visual */}
      <div className="relative w-36 h-36 mb-6 flex items-center justify-center">
        <div className="absolute inset-0 bg-radial from-[var(--danger)]/20 via-transparent to-transparent rounded-full blur-xl" />
        <svg viewBox="0 0 120 120" className="w-full h-full">
          <circle cx="60" cy="60" r="44" fill="none" stroke="var(--danger)" strokeOpacity="0.4" strokeWidth="1.5" strokeDasharray="3 3" />
          <line x1="60" y1="60" x2="25" y2="35" stroke="var(--danger)" strokeOpacity="0.6" strokeWidth="1.5" />
          <line x1="60" y1="60" x2="95" y2="35" stroke="var(--danger)" strokeOpacity="0.6" strokeWidth="1.5" />
          <line x1="60" y1="60" x2="60" y2="100" stroke="var(--danger)" strokeOpacity="0.6" strokeWidth="1.5" />

          <circle cx="25" cy="35" r="7" fill="var(--surface-2)" stroke="var(--danger)" strokeWidth="2" />
          <circle cx="95" cy="35" r="7" fill="var(--surface-2)" stroke="var(--danger)" strokeWidth="2" />
          <circle cx="60" cy="100" r="7" fill="var(--surface-2)" stroke="var(--danger)" strokeWidth="2" />

          {/* Core warning icon */}
          <circle cx="60" cy="60" r="18" fill="var(--surface-1)" stroke="var(--danger)" strokeWidth="2.5" />
          <text x="60" y="66" textAnchor="middle" fill="var(--danger)" fontSize="16" fontWeight="bold">
            !
          </text>
        </svg>
      </div>

      <div className="space-y-2 max-w-md">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-[var(--danger)]/10 text-[var(--danger)] border border-[var(--danger)]/20">
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>Execution Interrupted</span>
        </div>
        <h1 className="font-heading text-2xl sm:text-3xl font-bold tracking-tight text-[var(--text)]">
          Application Error
        </h1>
        <p className="text-sm text-[var(--text-muted)] leading-relaxed">
          {errorMessage}
        </p>
      </div>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        {reset && (
          <Button variant="primary" onClick={reset}>
            <RotateCcw className="w-4 h-4 mr-2" />
            Try again
          </Button>
        )}
        <Link to="/app">
          <Button variant="secondary">
            <Home className="w-4 h-4 mr-2" />
            Command Center
          </Button>
        </Link>
      </div>
    </div>
  );
}

