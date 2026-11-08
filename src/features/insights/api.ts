import { supabase } from '@/lib/supabase';
import type { DailyInsights } from './schemas';

export interface InsightRecord {
  id: string;
  org_id: string;
  for_date: string;
  content: DailyInsights;
  created_at: string;
}

/**
 * Fetches today's executive brief for the workspace if it has already been generated.
 */
export async function fetchTodayInsight(orgId: string): Promise<InsightRecord | null> {
  const today = new Date().toISOString().split('T')[0] ?? '';

  const { data, error } = await supabase
    .from('insights')
    .select('*')
    .eq('org_id', orgId)
    .eq('for_date', today)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  if (!data) return null;

  return {
    id: data.id,
    org_id: data.org_id,
    for_date: data.for_date,
    content: data.content as unknown as DailyInsights,
    created_at: data.created_at,
  };
}

/**
 * Fetches historical daily briefs for the workspace ordered by date descending.
 */
export async function fetchPastInsights(
  orgId: string,
  limit = 30,
): Promise<InsightRecord[]> {
  const { data, error } = await supabase
    .from('insights')
    .select('*')
    .eq('org_id', orgId)
    .order('for_date', { ascending: false })
    .limit(limit);

  if (error) {
    throw new Error(error.message);
  }

  const rows = data ?? [];
  return rows.map((r) => ({
    id: r.id,
    org_id: r.org_id,
    for_date: r.for_date,
    content: r.content as unknown as DailyInsights,
    created_at: r.created_at,
  }));
}
