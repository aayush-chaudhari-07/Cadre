import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useWorkspace } from '@/features/workspace';
import {
  fetchAccounts,
  fetchAccountById,
  createAccount,
  updateAccount,
  deleteAccount,
  type AccountRow,
  type AccountInsert,
  type AccountUpdate,
} from './api';
import type { AccountFilterOptions } from './schemas';
import { analyzeChurn } from '@/lib/ai';
import type { ChurnAnalysis } from '@/types/ai';

export function useAccounts(options: AccountFilterOptions = {}) {
  const { workspace } = useWorkspace();
  const orgId = workspace?.id;

  return useQuery<AccountRow[]>({
    queryKey: ['accounts', orgId, options],
    queryFn: () => {
      if (!orgId) throw new Error('No active workspace');
      return fetchAccounts(orgId, options);
    },
    enabled: Boolean(orgId),
    staleTime: 20 * 1000,
  });
}

export function useAccount(accountId?: string) {
  const { workspace } = useWorkspace();
  const orgId = workspace?.id;

  return useQuery<AccountRow | null>({
    queryKey: ['account', orgId, accountId],
    queryFn: () => {
      if (!orgId || !accountId) throw new Error('Missing workspace or account ID');
      return fetchAccountById(accountId, orgId);
    },
    enabled: Boolean(orgId && accountId),
    staleTime: 60 * 1000,
  });
}

export function useCreateAccount() {
  const queryClient = useQueryClient();
  const { workspace } = useWorkspace();
  const orgId = workspace?.id;

  return useMutation({
    mutationFn: (account: Omit<AccountInsert, 'org_id'>) => {
      if (!orgId) throw new Error('No active workspace');
      return createAccount({
        ...account,
        org_id: orgId,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accounts', orgId] });
    },
  });
}

export function useUpdateAccount() {
  const queryClient = useQueryClient();
  const { workspace } = useWorkspace();
  const orgId = workspace?.id;

  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: AccountUpdate }) => {
      if (!orgId) throw new Error('No active workspace');
      return updateAccount(id, orgId, updates);
    },
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: ['accounts', orgId] });
      queryClient.invalidateQueries({ queryKey: ['account', orgId, updated.id] });
    },
  });
}

export function useDeleteAccount() {
  const queryClient = useQueryClient();
  const { workspace } = useWorkspace();
  const orgId = workspace?.id;

  return useMutation({
    mutationFn: (id: string) => {
      if (!orgId) throw new Error('No active workspace');
      return deleteAccount(id, orgId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accounts', orgId] });
    },
  });
}

export function useAnalyzeChurn() {
  const queryClient = useQueryClient();
  const { workspace } = useWorkspace();
  const orgId = workspace?.id;

  return useMutation<
    ChurnAnalysis,
    Error,
    {
      accountId?: string;
      accountName: string;
      mrr: number;
      signals?: string[];
      contextNotes?: string;
    }
  >({
    mutationFn: async ({ accountId, accountName, mrr, signals, contextNotes }) => {
      if (!orgId) throw new Error('No active workspace');
      return analyzeChurn({
        orgId,
        accountId,
        accountName,
        mrr,
        signals,
        contextNotes,
      });
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['accounts', orgId] });
      if (variables.accountId) {
        queryClient.invalidateQueries({ queryKey: ['account', orgId, variables.accountId] });
      }
      queryClient.invalidateQueries({ queryKey: ['ai_usage'] });
    },
  });
}

