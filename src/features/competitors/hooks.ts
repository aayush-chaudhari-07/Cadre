import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useWorkspace } from '@/features/workspace';
import {
  fetchCompetitors,
  fetchCompetitorById,
  createCompetitor,
  updateCompetitor,
  deleteCompetitor,
  type CompetitorRow,
  type CompetitorInsert,
  type CompetitorUpdate,
} from './api';
import { scanCompetitor } from '@/lib/ai';
import type { CompetitorScan } from '@/types/ai';

export function useCompetitors(search?: string) {
  const { workspace } = useWorkspace();
  const orgId = workspace?.id;

  return useQuery<CompetitorRow[]>({
    queryKey: ['competitors', orgId, search],
    queryFn: () => {
      if (!orgId) throw new Error('No active workspace');
      return fetchCompetitors(orgId, search);
    },
    enabled: Boolean(orgId),
    staleTime: 30 * 1000,
  });
}

export function useCompetitor(competitorId?: string) {
  const { workspace } = useWorkspace();
  const orgId = workspace?.id;

  return useQuery<CompetitorRow | null>({
    queryKey: ['competitor', orgId, competitorId],
    queryFn: () => {
      if (!orgId || !competitorId) throw new Error('Missing workspace or competitor ID');
      return fetchCompetitorById(competitorId, orgId);
    },
    enabled: Boolean(orgId && competitorId),
    staleTime: 60 * 1000,
  });
}

export function useCreateCompetitor() {
  const queryClient = useQueryClient();
  const { workspace } = useWorkspace();
  const orgId = workspace?.id;

  return useMutation({
    mutationFn: (competitor: Omit<CompetitorInsert, 'org_id'>) => {
      if (!orgId) throw new Error('No active workspace');
      return createCompetitor({
        ...competitor,
        org_id: orgId,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['competitors', orgId] });
    },
  });
}

export function useUpdateCompetitor() {
  const queryClient = useQueryClient();
  const { workspace } = useWorkspace();
  const orgId = workspace?.id;

  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: CompetitorUpdate }) => {
      if (!orgId) throw new Error('No active workspace');
      return updateCompetitor(id, orgId, updates);
    },
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: ['competitors', orgId] });
      queryClient.invalidateQueries({ queryKey: ['competitor', orgId, updated.id] });
    },
  });
}

export function useDeleteCompetitor() {
  const queryClient = useQueryClient();
  const { workspace } = useWorkspace();
  const orgId = workspace?.id;

  return useMutation({
    mutationFn: (id: string) => {
      if (!orgId) throw new Error('No active workspace');
      return deleteCompetitor(id, orgId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['competitors', orgId] });
    },
  });
}

export function useScanCompetitor() {
  const queryClient = useQueryClient();
  const { workspace } = useWorkspace();
  const orgId = workspace?.id;

  return useMutation<
    CompetitorScan,
    Error,
    { competitorId?: string; name: string; url: string }
  >({
    mutationFn: async ({ competitorId, name, url }) => {
      if (!orgId) throw new Error('No active workspace');
      return scanCompetitor({
        orgId,
        competitorId,
        name,
        url,
      });
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['competitors', orgId] });
      if (variables.competitorId) {
        queryClient.invalidateQueries({ queryKey: ['competitor', orgId, variables.competitorId] });
      }
      queryClient.invalidateQueries({ queryKey: ['ai_usage'] });
    },
  });
}

