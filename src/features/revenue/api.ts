import { supabase } from '@/lib/supabase';
import type { TablesInsert, TablesUpdate } from '@/types/database';
import type { DealRow } from './forecast';

export type { DealRow };
export type DealInsert = TablesInsert<'deals'>;
export type DealUpdate = TablesUpdate<'deals'>;

export async function fetchDeals(orgId: string): Promise<DealRow[]> {
  const { data, error } = await supabase
    .from('deals')
    .select('*')
    .eq('org_id', orgId)
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(error.message);
  }
  return data ?? [];
}

export async function fetchDealById(
  id: string,
  orgId: string,
): Promise<DealRow | null> {
  const { data, error } = await supabase
    .from('deals')
    .select('*')
    .eq('id', id)
    .eq('org_id', orgId)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }
  return data;
}

export async function createDeal(deal: DealInsert): Promise<DealRow> {
  const { data, error } = await supabase
    .from('deals')
    .insert(deal)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }
  return data;
}

export async function updateDeal(
  id: string,
  orgId: string,
  updates: DealUpdate,
): Promise<DealRow> {
  const { data, error } = await supabase
    .from('deals')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .eq('org_id', orgId)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }
  return data;
}

export async function deleteDeal(
  id: string,
  orgId: string,
): Promise<void> {
  const { error } = await supabase
    .from('deals')
    .delete()
    .eq('id', id)
    .eq('org_id', orgId);

  if (error) {
    throw new Error(error.message);
  }
}
