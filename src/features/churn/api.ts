import { supabase } from '@/lib/supabase';
import type { Tables, TablesInsert, TablesUpdate } from '@/types/database';
import type { AccountFilterOptions } from './schemas';

export type AccountRow = Tables<'accounts'>;
export type AccountInsert = TablesInsert<'accounts'>;
export type AccountUpdate = TablesUpdate<'accounts'>;

export async function fetchAccounts(
  orgId: string,
  options: AccountFilterOptions = {},
): Promise<AccountRow[]> {
  const { search, riskTier, sortField = 'mrr', sortOrder = 'desc' } = options;

  let query = supabase
    .from('accounts')
    .select('*')
    .eq('org_id', orgId);

  // Filter by risk tier
  if (riskTier && riskTier !== 'all') {
    query = query.eq('risk_level', riskTier);
  }

  // Filter by search term
  if (search && search.trim()) {
    const term = search.trim();
    query = query.or(`name.ilike.%${term}%,plan.ilike.%${term}%`);
  }

  // Sort by field
  query = query.order(sortField, { ascending: sortOrder === 'asc', nullsFirst: false });

  const { data, error } = await query;
  if (error) {
    throw new Error(error.message);
  }
  return data ?? [];
}

export async function fetchAccountById(
  id: string,
  orgId: string,
): Promise<AccountRow | null> {
  const { data, error } = await supabase
    .from('accounts')
    .select('*')
    .eq('id', id)
    .eq('org_id', orgId)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }
  return data;
}

export async function createAccount(
  account: AccountInsert,
): Promise<AccountRow> {
  const { data, error } = await supabase
    .from('accounts')
    .insert(account)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }
  return data;
}

export async function updateAccount(
  id: string,
  orgId: string,
  updates: AccountUpdate,
): Promise<AccountRow> {
  const { data, error } = await supabase
    .from('accounts')
    .update(updates)
    .eq('id', id)
    .eq('org_id', orgId)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }
  return data;
}

export async function deleteAccount(
  id: string,
  orgId: string,
): Promise<void> {
  const { error } = await supabase
    .from('accounts')
    .delete()
    .eq('id', id)
    .eq('org_id', orgId);

  if (error) {
    throw new Error(error.message);
  }
}

