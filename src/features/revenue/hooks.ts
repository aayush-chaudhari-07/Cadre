import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useWorkspace } from '@/features/workspace';
import {
  fetchDeals,
  fetchDealById,
  createDeal,
  updateDeal,
  deleteDeal,
  type DealRow,
  type DealInsert,
  type DealUpdate,
} from './api';
import { explainForecast } from '@/lib/ai';
import type { ForecastNote } from '@/types/ai';

export function useDeals() {
  const { workspace } = useWorkspace();
  const orgId = workspace?.id;

  return useQuery<DealRow[]>({
    queryKey: ['deals', orgId],
    queryFn: () => {
      if (!orgId) throw new Error('No active workspace');
      return fetchDeals(orgId);
    },
    enabled: Boolean(orgId),
    staleTime: 30 * 1000,
  });
}

export function useDeal(dealId?: string) {
  const { workspace } = useWorkspace();
  const orgId = workspace?.id;

  return useQuery<DealRow | null>({
    queryKey: ['deal', orgId, dealId],
    queryFn: () => {
      if (!orgId || !dealId) throw new Error('Missing workspace or deal ID');
      return fetchDealById(dealId, orgId);
    },
    enabled: Boolean(orgId && dealId),
    staleTime: 60 * 1000,
  });
}

export function useCreateDeal() {
  const queryClient = useQueryClient();
  const { workspace } = useWorkspace();
  const orgId = workspace?.id;

  return useMutation({
    mutationFn: (deal: Omit<DealInsert, 'org_id'>) => {
      if (!orgId) throw new Error('No active workspace');
      return createDeal({
        ...deal,
        org_id: orgId,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['deals', orgId] });
    },
  });
}

export function useUpdateDeal() {
  const queryClient = useQueryClient();
  const { workspace } = useWorkspace();
  const orgId = workspace?.id;

  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: DealUpdate }) => {
      if (!orgId) throw new Error('No active workspace');
      return updateDeal(id, orgId, updates);
    },
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: ['deals', orgId] });
      queryClient.invalidateQueries({ queryKey: ['deal', orgId, updated.id] });
    },
  });
}

export function useDeleteDeal() {
  const queryClient = useQueryClient();
  const { workspace } = useWorkspace();
  const orgId = workspace?.id;

  return useMutation({
    mutationFn: (id: string) => {
      if (!orgId) throw new Error('No active workspace');
      return deleteDeal(id, orgId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['deals', orgId] });
    },
  });
}

export function useExplainForecast() {
  const queryClient = useQueryClient();
  const { workspace } = useWorkspace();
  const orgId = workspace?.id;

  return useMutation<
    ForecastNote,
    Error,
    { quarter?: string; target: number; weightedTotal: number; dealsSummary?: string }
  >({
    mutationFn: async ({ quarter, target, weightedTotal, dealsSummary }) => {
      if (!orgId) throw new Error('No active workspace');
      return explainForecast({
        orgId,
        quarter: quarter || 'Current Quarter',
        target,
        weightedTotal,
        dealsSummary,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ai_usage'] });
    },
  });
}
