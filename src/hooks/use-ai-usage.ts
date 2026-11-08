import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/features/auth';

export const AI_DAILY_LIMIT = 40;

export interface AiUsageData {
  calls: number;
  limit: number;
  remaining: number;
  percentage: number;
}

export function useAiUsage() {
  const { user } = useAuth();
  const todayStr = new Date().toISOString().slice(0, 10);

  return useQuery<AiUsageData>({
    queryKey: ['ai_usage', user?.id, todayStr],
    queryFn: async () => {
      if (!user?.id) {
        return { calls: 0, limit: AI_DAILY_LIMIT, remaining: AI_DAILY_LIMIT, percentage: 0 };
      }

      const { data, error } = await supabase
        .from('ai_usage')
        .select('calls')
        .eq('user_id', user.id)
        .eq('usage_date', todayStr)
        .maybeSingle();

      if (error) {
        console.warn('Could not read ai_usage for user:', error.message);
        return { calls: 0, limit: AI_DAILY_LIMIT, remaining: AI_DAILY_LIMIT, percentage: 0 };
      }

      const calls = data?.calls ?? 0;
      const remaining = Math.max(0, AI_DAILY_LIMIT - calls);
      const percentage = Math.min(100, Math.round((calls / AI_DAILY_LIMIT) * 100));

      return {
        calls,
        limit: AI_DAILY_LIMIT,
        remaining,
        percentage,
      };
    },
    enabled: Boolean(user?.id),
    staleTime: 15 * 1000,
  });
}
