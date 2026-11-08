import React from 'react';
import { createFileRoute, Outlet, redirect } from '@tanstack/react-router';
import { supabase } from '@/lib/supabase';

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
  component: AppShellLayout,
});

function AppShellLayout() {
  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--text)]">
      <Outlet />
    </div>
  );
}
