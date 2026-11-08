import React from 'react';
import { useRouterState, Link, useNavigate } from '@tanstack/react-router';
import {
  Menu,
  Search,
  Zap,
  Settings,
  LogOut,
  ChevronRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { ThemeToggle } from '@/components/theme-provider';
import { useAuth } from '@/features/auth';
import { useAiUsage } from '@/hooks/use-ai-usage';
import { NAV_ITEMS } from './app-sidebar';

interface AppTopbarProps {
  onOpenMobileNav: () => void;
  onOpenCommandPalette: () => void;
}

export function AppTopbar({ onOpenMobileNav, onOpenCommandPalette }: AppTopbarProps) {
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;
  const { user, profile, signOut } = useAuth();
  const { data: aiUsage } = useAiUsage();
  const navigate = useNavigate();

  // Find current active item title
  const activeNav =
    NAV_ITEMS.find((item) =>
      item.to === '/app'
        ? currentPath === '/app' || currentPath === '/app/'
        : currentPath.startsWith(item.to),
    ) ?? { title: 'Dashboard' };

  const displayName =
    profile?.display_name || user?.user_metadata?.display_name || user?.email || 'User';
  const email = user?.email || '';

  const initials = displayName
    .split(' ')
    .map((n: string) => n[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase() || 'U';

  const handleSignOut = async () => {
    await signOut();
    navigate({ to: '/login', search: {} });
  };

  const calls = aiUsage?.calls ?? 0;
  const limit = aiUsage?.limit ?? 40;

  return (
    <header className="h-16 border-b border-[var(--border)] bg-[var(--surface-1)]/80 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between gap-4 sticky top-0 z-10">
      {/* Left: Mobile Toggle & Breadcrumb */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onOpenMobileNav}
          className="md:hidden flex items-center justify-center w-8 h-8 rounded-lg text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--surface-2)] focus-ring"
          aria-label="Open mobile menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs">
          <Link
            to="/app"
            className="text-[var(--text-muted)] hover:text-[var(--text)] transition-colors font-medium"
          >
            Cadre
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-[var(--text-muted)] opacity-60" />
          <span className="text-[var(--text)] font-semibold truncate max-w-[160px] sm:max-w-none">
            {activeNav.title}
          </span>
        </nav>
      </div>

      {/* Right: Search, AI Usage Pill, ThemeToggle, User Menu */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Command Palette Button */}
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={onOpenCommandPalette}
          className="hidden sm:flex items-center gap-2 text-xs text-[var(--text-muted)] bg-[var(--surface-2)]/80 hover:text-[var(--text)] border border-[var(--border)] h-9 px-3"
        >
          <Search className="w-3.5 h-3.5" />
          <span>Jump to...</span>
          <kbd className="pointer-events-none inline-flex h-4 select-none items-center gap-1 rounded bg-[var(--surface-1)] px-1.5 font-mono text-[10px] font-medium text-[var(--text-muted)] border border-[var(--border)]">
            ⌘K
          </kbd>
        </Button>

        {/* AI Usage Pill */}
        <div
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono bg-[var(--surface-2)] border border-[var(--border)] text-[var(--text)]"
          title={`Daily AI usage: ${calls} of ${limit} calls consumed`}
        >
          <Zap className="w-3 h-3 text-[var(--gold)]" />
          <span className="tabular-nums">
            {calls} / {limit}
          </span>
        </div>

        {/* Theme Toggle */}
        <ThemeToggle />

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="flex items-center rounded-full focus-ring focus:outline-none"
              aria-label="User account menu"
            >
              <Avatar className="w-8 h-8 border border-[var(--border)]">
                {profile?.avatar_url && <AvatarImage src={profile.avatar_url} alt={displayName} />}
                <AvatarFallback className="bg-[var(--surface-2)] text-[var(--primary)] text-xs font-semibold">
                  {initials}
                </AvatarFallback>
              </Avatar>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 p-1">
            <DropdownMenuLabel className="font-normal px-2 py-1.5">
              <div className="flex flex-col space-y-0.5">
                <p className="text-xs font-semibold text-[var(--text)] truncate">{displayName}</p>
                <p className="text-[11px] text-[var(--text-muted)] font-mono truncate">{email}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link to="/app/settings" className="flex items-center gap-2 cursor-pointer text-xs">
                <Settings className="w-3.5 h-3.5" />
                <span>Settings</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleSignOut}
              className="flex items-center gap-2 cursor-pointer text-xs text-[var(--danger)] focus:text-[var(--danger)]"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
