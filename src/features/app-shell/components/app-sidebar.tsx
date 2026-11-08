import React from 'react';
import { Link, useRouterState } from '@tanstack/react-router';
import { motion } from 'motion/react';
import {
  LayoutDashboard,
  Target,
  Video,
  ShieldAlert,
  Compass,
  TrendingUp,
  Bot,
  Crown,
  Lightbulb,
  Settings,
  PanelLeftClose,
  PanelLeftOpen,
  Zap,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { Progress } from '@/components/ui/progress';
import { useWorkspace } from '@/features/workspace';
import { useAiUsage } from '@/hooks/use-ai-usage';
import { useReducedMotion } from '@/hooks/use-reduced-motion';

export interface NavItem {
  title: string;
  to: string;
  icon: React.ComponentType<{ className?: string }>;
}

export const NAV_ITEMS: NavItem[] = [
  { title: 'Command Center', to: '/app', icon: LayoutDashboard },
  { title: 'Leads', to: '/app/leads', icon: Target },
  { title: 'Meetings', to: '/app/meetings', icon: Video },
  { title: 'Churn', to: '/app/churn', icon: ShieldAlert },
  { title: 'Competitors', to: '/app/competitors', icon: Compass },
  { title: 'Revenue', to: '/app/revenue', icon: TrendingUp },
  { title: 'Agents', to: '/app/agents', icon: Bot },
  { title: 'AI CEO', to: '/app/ceo', icon: Crown },
  { title: 'Insights', to: '/app/insights', icon: Lightbulb },
  { title: 'Settings', to: '/app/settings', icon: Settings },
];

interface AppSidebarProps {
  collapsed: boolean;
  onToggleCollapsed: () => void;
  className?: string;
  onItemClick?: () => void; // Used for mobile drawer auto-close
}

export function AppSidebar({
  collapsed,
  onToggleCollapsed,
  className,
  onItemClick,
}: AppSidebarProps) {
  const { workspace } = useWorkspace();
  const { data: aiUsage } = useAiUsage();
  const shouldReduceMotion = useReducedMotion();
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;

  const calls = aiUsage?.calls ?? 0;
  const limit = aiUsage?.limit ?? 40;
  const percentage = aiUsage?.percentage ?? 0;

  return (
    <aside
      className={cn(
        'h-screen flex flex-col justify-between bg-[var(--surface-1)] border-r border-[var(--border)] transition-all duration-300 select-none z-20',
        collapsed ? 'w-[72px]' : 'w-[240px]',
        className,
      )}
      aria-label="Main Navigation"
    >
      {/* Workspace & Header */}
      <div>
        <div className="h-16 flex items-center justify-between px-4 border-b border-[var(--border)]">
          <Link
            to="/app"
            className="flex items-center gap-3 overflow-hidden group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] rounded-lg p-1"
          >
            <img
              src="/logo-mark.svg"
              alt="Cadre mark"
              className="w-8 h-8 rounded-lg shrink-0 transition-transform group-hover:scale-105"
            />
            {!collapsed && (
              <div className="flex flex-col min-w-0">
                <span className="font-heading font-bold text-sm tracking-tight text-[var(--text)] truncate">
                  {workspace?.name || 'Cadre'}
                </span>
                <span className="text-[10px] text-[var(--text-muted)] tracking-wider uppercase font-mono">
                  {workspace?.plan || 'Free'} Plan
                </span>
              </div>
            )}
          </Link>

          {/* Collapse/Expand Toggle Button (Hidden on Mobile) */}
          <button
            type="button"
            onClick={onToggleCollapsed}
            className="hidden md:flex items-center justify-center w-7 h-7 rounded-md text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--surface-2)] focus-ring transition-colors"
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? <PanelLeftOpen className="w-4 h-4" /> : <PanelLeftClose className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation Item List */}
        <nav className="p-2 space-y-1 mt-2">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.to === '/app'
                ? currentPath === '/app' || currentPath === '/app/'
                : currentPath.startsWith(item.to);

            const content = (
              <Link
                to={item.to}
                onClick={onItemClick}
                className={cn(
                  'relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]',
                  isActive
                    ? 'text-[var(--text)] font-semibold'
                    : 'text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--surface-2)]/60',
                  collapsed && 'justify-center px-0',
                )}
              >
                {/* Active Pill with layoutId */}
                {isActive && (
                  <motion.span
                    layoutId={shouldReduceMotion ? undefined : 'sidebar-active-pill'}
                    className="absolute inset-0 rounded-xl bg-[var(--primary)]/10 border border-[var(--primary)]/25"
                    transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                  />
                )}

                <Icon
                  className={cn(
                    'w-4 h-4 shrink-0 relative z-10 transition-colors',
                    isActive ? 'text-[var(--primary)]' : 'text-[var(--text-muted)]',
                  )}
                />

                {!collapsed && <span className="relative z-10 truncate">{item.title}</span>}
              </Link>
            );

            if (collapsed) {
              return (
                <Tooltip key={item.to} delayDuration={150}>
                  <TooltipTrigger asChild>{content}</TooltipTrigger>
                  <TooltipContent side="right" className="font-medium text-xs">
                    {item.title}
                  </TooltipContent>
                </Tooltip>
              );
            }

            return <div key={item.to}>{content}</div>;
          })}
        </nav>
      </div>

      {/* Footer: AI Usage Quota Card */}
      <div className="p-3 border-t border-[var(--border)]">
        {collapsed ? (
          <Tooltip delayDuration={150}>
            <TooltipTrigger asChild>
              <div className="w-10 h-10 mx-auto rounded-xl bg-[var(--surface-2)] flex flex-col items-center justify-center cursor-default">
                <Zap className="w-4 h-4 text-[var(--gold)]" />
                <span className="text-[9px] font-mono text-[var(--text-muted)]">{calls}</span>
              </div>
            </TooltipTrigger>
            <TooltipContent side="right" className="text-xs">
              <p className="font-semibold text-[var(--text)]">Daily AI Quota</p>
              <p className="text-[var(--text-muted)]">
                {calls} / {limit} analyses used today
              </p>
            </TooltipContent>
          </Tooltip>
        ) : (
          <div className="p-3 rounded-xl bg-[var(--surface-2)]/60 border border-[var(--border)] space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-1.5 font-medium text-[var(--text)]">
                <Zap className="w-3.5 h-3.5 text-[var(--gold)]" />
                <span>AI Quota</span>
              </span>
              <span className="font-mono text-[11px] text-[var(--text-muted)] tabular-nums">
                {calls} / {limit}
              </span>
            </div>
            <Progress value={percentage} className="h-1.5" />
            <p className="text-[10px] text-[var(--text-muted)] leading-tight">
              {limit - calls} analyses remaining today
            </p>
          </div>
        )}
      </div>
    </aside>
  );
}
