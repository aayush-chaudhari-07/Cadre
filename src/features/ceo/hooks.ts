import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useWorkspace } from '@/features/workspace';
import {
  fetchCeoPlans,
  fetchCeoPlanById,
  updateCeoPlanStatus,
  type CeoPlanRecord,
} from './api';
import { askCeo } from '@/lib/ai';
import type { CeoPlan } from './schemas';

export function useCeoPlans() {
  const { workspace } = useWorkspace();
  const orgId = workspace?.id;

  return useQuery<CeoPlanRecord[]>({
    queryKey: ['ceo_plans', orgId],
    queryFn: () => {
      if (!orgId) throw new Error('No active workspace');
      return fetchCeoPlans(orgId);
    },
    enabled: Boolean(orgId),
    staleTime: 30 * 1000,
  });
}

export function useCeoPlan(planId?: string) {
  const { workspace } = useWorkspace();
  const orgId = workspace?.id;

  return useQuery<CeoPlanRecord | null>({
    queryKey: ['ceo_plan', orgId, planId],
    queryFn: () => {
      if (!orgId || !planId) throw new Error('Missing orgId or planId');
      return fetchCeoPlanById(planId, orgId);
    },
    enabled: Boolean(orgId && planId),
    staleTime: 60 * 1000,
  });
}

export function useUpdateCeoPlanStatus() {
  const queryClient = useQueryClient();
  const { workspace } = useWorkspace();
  const orgId = workspace?.id;

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: 'draft' | 'approved' | 'done' }) => {
      if (!orgId) throw new Error('No active workspace');
      return updateCeoPlanStatus(id, orgId, status);
    },
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: ['ceo_plans', orgId] });
      queryClient.invalidateQueries({ queryKey: ['ceo_plan', orgId, updated.id] });
    },
  });
}

export function useAskCeo() {
  const queryClient = useQueryClient();
  const { workspace } = useWorkspace();
  const orgId = workspace?.id;

  return useMutation({
    mutationFn: async ({ command, context }: { command: string; context?: string }): Promise<CeoPlan & { id?: string; status?: string }> => {
      if (!orgId) throw new Error('No active workspace');
      return askCeo({
        orgId,
        command,
        context,
      }) as Promise<CeoPlan & { id?: string; status?: string }>;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ceo_plans', orgId] });
      queryClient.invalidateQueries({ queryKey: ['agent_runs', orgId] });
      queryClient.invalidateQueries({ queryKey: ['ai_usage'] });
    },
  });
}
