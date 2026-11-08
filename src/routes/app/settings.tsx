import React from 'react';
import { createFileRoute } from '@tanstack/react-router';
import {
  User,
  Building2,
  Bot,
  Palette,
  HardDrive,
  KeyRound,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import {
  ProfileTab,
  WorkspaceTab,
  AgentsTab,
  AppearanceTab,
  DataTab,
  AccountTab,
} from '@/features/settings';
import { useWorkspace } from '@/features/workspace';
import { BrandedErrorBoundary } from '@/components/branded-error-boundary';

export const Route = createFileRoute('/app/settings')({
  component: SettingsPage,
  errorComponent: ({ error, reset }) => <BrandedErrorBoundary error={error} reset={reset} />,
});

function SettingsPage() {
  const { workspace } = useWorkspace();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <h1 className="font-heading text-2xl sm:text-3xl font-bold tracking-tight text-[var(--text)]">
              Workspace Settings
            </h1>
            <Badge variant="outline" className="font-mono text-xs">
              {workspace?.name || 'Workspace'}
            </Badge>
          </div>
          <p className="text-sm text-[var(--text-muted)] max-w-2xl">
            Configure your personal profile identity, workspace preferences, autonomous agents,
            appearance theme, and data management.
          </p>
        </div>
      </div>

      {/* Tabs Navigation */}
      <Tabs defaultValue="profile" className="space-y-6">
        <div className="overflow-x-auto pb-1">
          <TabsList className="h-11 p-1 bg-[var(--surface-raised)] border border-[var(--border)] gap-1 w-full sm:w-auto justify-start">
            <TabsTrigger value="profile" className="gap-2 text-xs">
              <User className="w-3.5 h-3.5" />
              <span>Profile</span>
            </TabsTrigger>
            <TabsTrigger value="workspace" className="gap-2 text-xs">
              <Building2 className="w-3.5 h-3.5" />
              <span>Workspace</span>
            </TabsTrigger>
            <TabsTrigger value="agents" className="gap-2 text-xs">
              <Bot className="w-3.5 h-3.5" />
              <span>Agents</span>
            </TabsTrigger>
            <TabsTrigger value="appearance" className="gap-2 text-xs">
              <Palette className="w-3.5 h-3.5" />
              <span>Appearance</span>
            </TabsTrigger>
            <TabsTrigger value="data" className="gap-2 text-xs">
              <HardDrive className="w-3.5 h-3.5" />
              <span>Data</span>
            </TabsTrigger>
            <TabsTrigger value="account" className="gap-2 text-xs">
              <KeyRound className="w-3.5 h-3.5" />
              <span>Account</span>
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Tab Contents */}
        <TabsContent value="profile" className="mt-0 focus-visible:outline-none">
          <ProfileTab />
        </TabsContent>

        <TabsContent value="workspace" className="mt-0 focus-visible:outline-none">
          <WorkspaceTab />
        </TabsContent>

        <TabsContent value="agents" className="mt-0 focus-visible:outline-none">
          <AgentsTab />
        </TabsContent>

        <TabsContent value="appearance" className="mt-0 focus-visible:outline-none">
          <AppearanceTab />
        </TabsContent>

        <TabsContent value="data" className="mt-0 focus-visible:outline-none">
          <DataTab />
        </TabsContent>

        <TabsContent value="account" className="mt-0 focus-visible:outline-none">
          <AccountTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
