import React, { createContext, useContext, useEffect, useState, useMemo, useCallback } from 'react';
import { useAuth } from '@/features/auth';
import * as workspaceApi from './api';
import type { Organization, Membership } from './api';

interface WorkspaceContextValue {
  workspace: Organization | null;
  membership: Membership | null;
  loading: boolean;
  createWorkspace: (name: string, seedSampleData?: boolean) => Promise<string>;
  seedDemoData: () => Promise<void>;
  clearDemoData: () => Promise<void>;
  refreshWorkspace: () => Promise<void>;
}

const WorkspaceContext = createContext<WorkspaceContextValue | undefined>(undefined);

export function WorkspaceProvider({ children }: { children: React.ReactNode }) {
  const { user, loading: authLoading } = useAuth();
  const [workspace, setWorkspace] = useState<Organization | null>(null);
  const [membership, setMembership] = useState<Membership | null>(null);
  const [loading, setLoading] = useState(true);

  const loadWorkspace = useCallback(async (userId: string) => {
    try {
      setLoading(true);
      const result = await workspaceApi.fetchUserPrimaryWorkspace(userId);
      if (result) {
        setWorkspace(result.organization);
        setMembership(result.membership);
      } else {
        setWorkspace(null);
        setMembership(null);
      }
    } catch (err) {
      console.error('Failed to load user workspace:', err);
      setWorkspace(null);
      setMembership(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshWorkspace = useCallback(async () => {
    if (user?.id) {
      await loadWorkspace(user.id);
    }
  }, [user?.id, loadWorkspace]);

  useEffect(() => {
    if (authLoading) {
      return;
    }

    if (!user) {
      setWorkspace(null);
      setMembership(null);
      setLoading(false);
      return;
    }

    loadWorkspace(user.id);
  }, [user, authLoading, loadWorkspace]);

  const createWorkspace = useCallback(
    async (name: string, seedSampleData: boolean = true) => {
      const orgId = await workspaceApi.createWorkspace(name, seedSampleData);
      if (user?.id) {
        await loadWorkspace(user.id);
      }
      return orgId;
    },
    [user?.id, loadWorkspace],
  );

  const seedDemoData = useCallback(async () => {
    if (!workspace?.id) throw new Error('No active workspace selected');
    await workspaceApi.seedWorkspaceDemoData(workspace.id);
  }, [workspace?.id]);

  const clearDemoData = useCallback(async () => {
    if (!workspace?.id) throw new Error('No active workspace selected');
    await workspaceApi.clearWorkspaceDemoData(workspace.id);
  }, [workspace?.id]);

  const value = useMemo<WorkspaceContextValue>(
    () => ({
      workspace,
      membership,
      loading: authLoading || loading,
      createWorkspace,
      seedDemoData,
      clearDemoData,
      refreshWorkspace,
    }),
    [
      workspace,
      membership,
      authLoading,
      loading,
      createWorkspace,
      seedDemoData,
      clearDemoData,
      refreshWorkspace,
    ],
  );

  return <WorkspaceContext.Provider value={value}>{children}</WorkspaceContext.Provider>;
}

export function useWorkspace(): WorkspaceContextValue {
  const context = useContext(WorkspaceContext);
  if (!context) {
    throw new Error('useWorkspace must be used within a WorkspaceProvider');
  }
  return context;
}
