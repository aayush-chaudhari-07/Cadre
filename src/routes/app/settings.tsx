import React from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { Settings, User, Building } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { useAuth } from '@/features/auth';
import { useWorkspace } from '@/features/workspace';

export const Route = createFileRoute('/app/settings')({
  component: SettingsPage,
});

function SettingsPage() {
  const { user, profile } = useAuth();
  const { workspace, membership } = useWorkspace();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <h1 className="font-heading text-2xl sm:text-3xl font-bold tracking-tight text-[var(--text)]">
              Settings &amp; Preferences
            </h1>
            <Badge variant="outline">Workspace Admin</Badge>
          </div>
          <p className="text-sm text-[var(--text-muted)]">
            Manage your personal profile, organization settings, team members, and data exports.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="glass border-[var(--border)]">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <User className="w-4 h-4 text-[var(--primary)]" />
              <span>Profile Settings</span>
            </CardTitle>
            <CardDescription>Your personal account details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex justify-between py-1.5 border-b border-[var(--border)]">
              <span className="text-[var(--text-muted)]">Display Name</span>
              <span className="font-medium text-[var(--text)]">{profile?.display_name || user?.user_metadata?.display_name || 'Not set'}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-[var(--border)]">
              <span className="text-[var(--text-muted)]">Email</span>
              <span className="font-mono text-xs text-[var(--text)]">{user?.email}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="glass border-[var(--border)]">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Building className="w-4 h-4 text-[var(--cyan)]" />
              <span>Workspace Details</span>
            </CardTitle>
            <CardDescription>Current revenue organization</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex justify-between py-1.5 border-b border-[var(--border)]">
              <span className="text-[var(--text-muted)]">Workspace Name</span>
              <span className="font-medium text-[var(--text)]">{workspace?.name || 'Loading...'}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-[var(--border)]">
              <span className="text-[var(--text-muted)]">Subscription Plan</span>
              <span className="font-medium uppercase text-[var(--primary)]">{workspace?.plan || 'Free'}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-[var(--border)]">
              <span className="text-[var(--text-muted)]">Your Role</span>
              <span className="capitalize text-[var(--text)]">{membership?.role || 'Owner'}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="glass border-[var(--border)]">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Settings className="w-4 h-4 text-[var(--text-muted)]" />
            <span>Full Settings Suite</span>
          </CardTitle>
          <CardDescription>
            Password change, agent autonomy configuration, data wipe, and account deletion arriving in Prompt 14.
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
}
