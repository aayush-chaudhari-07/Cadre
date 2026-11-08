import type { SupabaseClient } from '@supabase/supabase-js';
import { HttpError } from './auth.ts';

export async function checkAndConsumeQuota(supabase: SupabaseClient): Promise<void> {
  const deno = (globalThis as unknown as { Deno?: { env: { get(k: string): string | undefined } } }).Deno;
  const limitStr = (deno ? deno.env.get('AI_DAILY_LIMIT_PER_USER') : process.env.AI_DAILY_LIMIT_PER_USER) || '40';
  const limit = parseInt(limitStr, 10) || 40;

  const { data: allowed, error } = await supabase.rpc('consume_ai_quota', {
    p_limit: limit,
  });

  if (error) {
    console.error('[quota] Failed to consume quota:', error.message);
    throw new HttpError('internal_error', 'Failed to verify AI analysis quota.', 500);
  }

  if (allowed !== true) {
    throw new HttpError(
      'quota_exceeded',
      `You have reached your daily AI analysis limit (${limit} analyses/day). Quota resets daily at midnight UTC.`,
      429,
    );
  }
}
