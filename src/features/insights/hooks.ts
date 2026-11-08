import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useWorkspace } from '@/features/workspace';
import {
  fetchTodayInsight,
  fetchPastInsights,
  type InsightRecord,
} from './api';
import { generateInsights } from '@/lib/ai';
import type { DailyInsights } from './schemas';

export function useTodayInsight() {
  const { workspace } = useWorkspace();
  const orgId = workspace?.id;

  return useQuery<InsightRecord | null>({
    queryKey: ['today_insight', orgId],
    queryFn: () => {
      if (!orgId) throw new Error('No active workspace');
      return fetchTodayInsight(orgId);
    },
    enabled: Boolean(orgId),
    staleTime: 60 * 1000,
  });
}

export function usePastInsights(limit = 30) {
  const { workspace } = useWorkspace();
  const orgId = workspace?.id;

  return useQuery<InsightRecord[]>({
    queryKey: ['past_insights', orgId, limit],
    queryFn: () => {
      if (!orgId) throw new Error('No active workspace');
      return fetchPastInsights(orgId, limit);
    },
    enabled: Boolean(orgId),
    staleTime: 60 * 1000,
  });
}

export function useGenerateInsights() {
  const queryClient = useQueryClient();
  const { workspace } = useWorkspace();
  const orgId = workspace?.id;

  return useMutation({
    mutationFn: async ({ forceRefresh = false }: { forceRefresh?: boolean } = {}): Promise<DailyInsights & { id?: string; for_date?: string; cached?: boolean }> => {
      if (!orgId) throw new Error('No active workspace');
      return generateInsights({
        orgId,
        forceRefresh,
      }) as Promise<DailyInsights & { id?: string; for_date?: string; cached?: boolean }>;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['today_insight', orgId] });
      queryClient.invalidateQueries({ queryKey: ['past_insights', orgId] });
      queryClient.invalidateQueries({ queryKey: ['agent_runs', orgId] });
      queryClient.invalidateQueries({ queryKey: ['ai_usage'] });
    },
  });
}

