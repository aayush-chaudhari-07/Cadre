import React, { useState, useEffect } from 'react';
import { createFileRoute, Outlet, redirect, useRouterState } from '@tanstack/react-router';
import { supabase } from '@/lib/supabase';
import { AppSidebar } from '@/features/app-shell/components/app-sidebar';
import { AppTopbar } from '@/features/app-shell/components/app-topbar';
import { CommandPalette } from '@/features/app-shell/components/command-palette';
import { Drawer, DrawerContent } from '@/components/ui/drawer';
import { PageTransition } from '@/components/motion/page-transition';
import { BrandedErrorBoundary } from '@/components/branded-error-boundary';

export const Route = createFileRoute('/app')({
  beforeLoad: async ({ location }) => {
    // 1. Enforce authentication
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session?.user) {
      throw redirect({
        to: '/login',
        search: {
          redirect: location.href,
        },
      });
    }

    // 2. Enforce active workspace membership
    const { data: membership } = await supabase
      .from('memberships')
      .select('org_id')
      .eq('user_id', session.user.id)
      .limit(1)
      .maybeSingle();

    if (!membership) {
      throw redirect({
        to: '/onboarding',
      });
    }
  },
  errorComponent: ({ error, reset }) => <BrandedErrorBoundary error={error} reset={reset} />,
  component: AppShellLayout,
});

function AppShellLayout() {
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;

  // Persist sidebar collapsed state in localStorage
  const [collapsed, setCollapsed] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('cadre.sidebar_collapsed') === 'true';
    }
    return false;
  });

  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);

  const handleToggleCollapsed = () => {
    setCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem('cadre.sidebar_collapsed', String(next));
      return next;
    });
  };

  // Close mobile navigation on route change
  useEffect(() => {
    setMobileNavOpen(false);
  }, [currentPath]);

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--text)] flex flex-row overflow-hidden">
      {/* Accessibility Skip-to-content Link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-[var(--primary)] focus:text-[var(--primary-ink)] focus:rounded-lg focus:font-semibold focus:shadow-2xl focus-ring"
      >
        Skip to main content
      </a>

      {/* Desktop Collapsible Sidebar */}
      <div className="hidden md:flex shrink-0">
        <AppSidebar
          collapsed={collapsed}
          onToggleCollapsed={handleToggleCollapsed}
        />
      </div>

      {/* Mobile Sidebar Drawer */}
      <Drawer open={mobileNavOpen} onOpenChange={setMobileNavOpen}>
        <DrawerContent side="left" className="p-0 w-[260px] max-w-[85vw] border-r border-[var(--border)]">
          <AppSidebar
            collapsed={false}
            onToggleCollapsed={() => setMobileNavOpen(false)}
            onItemClick={() => setMobileNavOpen(false)}
            className="w-full h-full border-r-0"
          />
        </DrawerContent>
      </Drawer>

      {/* Main App Workspace */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Sticky Topbar */}
        <AppTopbar
          onOpenMobileNav={() => setMobileNavOpen(true)}
          onOpenCommandPalette={() => setCommandPaletteOpen(true)}
        />

        {/* Dynamic Route Content with Animated Page Transition */}
        <main
          id="main-content"
          className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8"
          tabIndex={-1}
        >
          <div className="max-w-[1440px] mx-auto w-full">
            <PageTransition routeKey={currentPath}>
              <Outlet />
            </PageTransition>
          </div>
        </main>
      </div>

      {/* Global Command Palette (Ctrl/Cmd+K) */}
      <CommandPalette open={commandPaletteOpen} onOpenChange={setCommandPaletteOpen} />
    </div>
  );
}
