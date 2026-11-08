import React from 'react';
import { Link } from '@tanstack/react-router';
import { ArrowLeft, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function BrandedNotFound() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 text-center select-none">
      {/* Node Motif Visual */}
      <div className="relative w-36 h-36 mb-6 flex items-center justify-center">
        <div className="absolute inset-0 bg-radial from-[var(--primary)]/20 via-transparent to-transparent rounded-full blur-xl" />
        <svg viewBox="0 0 120 120" className="w-full h-full">
          <circle cx="60" cy="60" r="44" fill="none" stroke="var(--border)" strokeWidth="1.5" strokeDasharray="3 3" />
          <line x1="60" y1="60" x2="25" y2="35" stroke="var(--border)" strokeWidth="1.5" />
          <line x1="60" y1="60" x2="95" y2="35" stroke="var(--border)" strokeWidth="1.5" />
          <line x1="60" y1="60" x2="60" y2="100" stroke="var(--border)" strokeWidth="1.5" strokeDasharray="2 4" />

          {/* Satellite nodes */}
          <circle cx="25" cy="35" r="8" fill="var(--surface-2)" stroke="#2DE2A6" strokeWidth="2" />
          <circle cx="95" cy="35" r="8" fill="var(--surface-2)" stroke="#22D3EE" strokeWidth="2" />
          <circle cx="60" cy="100" r="8" fill="var(--surface-2)" stroke="var(--text-muted)" strokeWidth="1.5" />

          {/* Central disconnected core */}
          <circle cx="60" cy="60" r="16" fill="var(--surface-1)" stroke="#F5B94A" strokeWidth="2.5" />
          <text x="60" y="65" textAnchor="middle" fill="#F5B94A" fontSize="13" fontWeight="bold">
            ?
          </text>
        </svg>
      </div>

      <div className="space-y-2 max-w-md">
        <h1 className="font-heading text-3xl font-bold tracking-tight text-[var(--text)]">
          Coordinate Not Found (404)
        </h1>
        <p className="text-sm text-[var(--text-muted)] leading-relaxed">
          The destination you requested does not exist or has been shifted in your revenue architecture.
        </p>
      </div>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Link to="/app">
          <Button variant="primary">
            <Home className="w-4 h-4 mr-2" />
            Command Center
          </Button>
        </Link>
        <Link to="/">
          <Button variant="secondary">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Cadre Home
          </Button>
        </Link>
      </div>
    </div>
  );
}

