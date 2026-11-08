import React, { useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
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
  PlusCircle,
  Sun,
  Moon,
  Laptop,
  LogOut,
} from 'lucide-react';
import {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandSeparator,
  CommandShortcut,
} from '@/components/ui/command';
import { useTheme } from '@/components/theme-provider';
import { useAuth } from '@/features/auth';

interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CommandPalette({ open, onOpenChange }: CommandPaletteProps) {
  const navigate = useNavigate();
  const { setTheme } = useTheme();
  const { signOut } = useAuth();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if ((e.key === 'k' || e.key === 'K') && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        onOpenChange(!open);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, [open, onOpenChange]);

  const runCommand = (command: () => void) => {
    onOpenChange(false);
    command();
  };

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput placeholder="Type a command or search modules..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>

        <CommandGroup heading="Navigation">
          <CommandItem
            onSelect={() => runCommand(() => navigate({ to: '/app' }))}
            className="cursor-pointer"
          >
            <LayoutDashboard className="mr-2 h-4 w-4 text-[var(--primary)]" />
            <span>Command Center</span>
          </CommandItem>
          <CommandItem
            onSelect={() => runCommand(() => navigate({ to: '/app/leads' }))}
            className="cursor-pointer"
          >
            <Target className="mr-2 h-4 w-4 text-[var(--primary)]" />
            <span>Lead Intelligence</span>
          </CommandItem>
          <CommandItem
            onSelect={() => runCommand(() => navigate({ to: '/app/meetings' }))}
            className="cursor-pointer"
          >
            <Video className="mr-2 h-4 w-4 text-[var(--cyan)]" />
            <span>Meeting Analyzer</span>
          </CommandItem>
          <CommandItem
            onSelect={() => runCommand(() => navigate({ to: '/app/churn' }))}
            className="cursor-pointer"
          >
            <ShieldAlert className="mr-2 h-4 w-4 text-[var(--warning)]" />
            <span>Churn Guard</span>
          </CommandItem>
          <CommandItem
            onSelect={() => runCommand(() => navigate({ to: '/app/competitors' }))}
            className="cursor-pointer"
          >
            <Compass className="mr-2 h-4 w-4 text-[var(--secondary)]" />
            <span>Competitor Radar</span>
          </CommandItem>
          <CommandItem
            onSelect={() => runCommand(() => navigate({ to: '/app/revenue' }))}
            className="cursor-pointer"
          >
            <TrendingUp className="mr-2 h-4 w-4 text-[var(--primary)]" />
            <span>Revenue Forecast</span>
          </CommandItem>
          <CommandItem
            onSelect={() => runCommand(() => navigate({ to: '/app/agents' }))}
            className="cursor-pointer"
          >
            <Bot className="mr-2 h-4 w-4 text-[var(--text-muted)]" />
            <span>Agent Roster</span>
          </CommandItem>
          <CommandItem
            onSelect={() => runCommand(() => navigate({ to: '/app/ceo' }))}
            className="cursor-pointer"
          >
            <Crown className="mr-2 h-4 w-4 text-[var(--gold)]" />
            <span>AI CEO Console</span>
          </CommandItem>
          <CommandItem
            onSelect={() => runCommand(() => navigate({ to: '/app/insights' }))}
            className="cursor-pointer"
          >
            <Lightbulb className="mr-2 h-4 w-4 text-[var(--primary)]" />
            <span>Daily Brief</span>
          </CommandItem>
          <CommandItem
            onSelect={() => runCommand(() => navigate({ to: '/app/settings' }))}
            className="cursor-pointer"
          >
            <Settings className="mr-2 h-4 w-4 text-[var(--text-muted)]" />
            <span>Settings</span>
          </CommandItem>
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Quick Actions">
          <CommandItem
            onSelect={() => runCommand(() => navigate({ to: '/app/leads' }))}
            className="cursor-pointer"
          >
            <PlusCircle className="mr-2 h-4 w-4 text-[var(--primary)]" />
            <span>Create new lead</span>
            <CommandShortcut>⌘N</CommandShortcut>
          </CommandItem>
          <CommandItem
            onSelect={() => runCommand(() => navigate({ to: '/app/insights' }))}
            className="cursor-pointer"
          >
            <Lightbulb className="mr-2 h-4 w-4 text-[var(--gold)]" />
            <span>Run daily revenue brief</span>
          </CommandItem>
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Theme">
          <CommandItem onSelect={() => runCommand(() => setTheme('dark'))} className="cursor-pointer">
            <Moon className="mr-2 h-4 w-4" />
            <span>Dark mode</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => setTheme('light'))} className="cursor-pointer">
            <Sun className="mr-2 h-4 w-4" />
            <span>Light mode</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => setTheme('system'))} className="cursor-pointer">
            <Laptop className="mr-2 h-4 w-4" />
            <span>System preference</span>
          </CommandItem>
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Account">
          <CommandItem
            onSelect={() =>
              runCommand(async () => {
                await signOut();
                navigate({ to: '/login', search: {} });
              })
            }
            className="cursor-pointer text-[var(--danger)]"
          >
            <LogOut className="mr-2 h-4 w-4" />
            <span>Sign out</span>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}

