import React from 'react';
import { createRootRoute, Outlet } from '@tanstack/react-router';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/lib/query-client';
import { ThemeProvider } from '@/components/theme-provider';
import { AuthProvider } from '@/features/auth';
import { WorkspaceProvider } from '@/features/workspace';
import { Toaster } from '@/components/ui/sonner';

import { BrandedNotFound } from '@/components/branded-not-found';
import { BrandedErrorBoundary } from '@/components/branded-error-boundary';

export const Route = createRootRoute({
  component: RootComponent,
  notFoundComponent: BrandedNotFound,
  errorComponent: ({ error, reset }) => <BrandedErrorBoundary error={error} reset={reset} />,
});

function RootComponent() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <WorkspaceProvider>
            <Outlet />
            <Toaster />
          </WorkspaceProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
