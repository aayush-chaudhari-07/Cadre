import { supabase } from '@/lib/supabase';
import type { Tables, TablesInsert, TablesUpdate } from '@/types/database';

export type CompetitorRow = Tables<'competitors'>;
export type CompetitorInsert = TablesInsert<'competitors'>;
export type CompetitorUpdate = TablesUpdate<'competitors'>;

export async function fetchCompetitors(
  orgId: string,
  search?: string,
): Promise<CompetitorRow[]> {
  let query = supabase
    .from('competitors')
    .select('*')
    .eq('org_id', orgId)
    .order('created_at', { ascending: false });

  if (search && search.trim()) {
    const term = search.trim();
    query = query.or(`name.ilike.%${term}%,url.ilike.%${term}%`);
  }

  const { data, error } = await query;
  if (error) {
    throw new Error(error.message);
  }
  return data ?? [];
}

export async function fetchCompetitorById(
  id: string,
  orgId: string,
): Promise<CompetitorRow | null> {
  const { data, error } = await supabase
    .from('competitors')
    .select('*')
    .eq('id', id)
    .eq('org_id', orgId)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }
  return data;
}

export async function createCompetitor(
  competitor: CompetitorInsert,
): Promise<CompetitorRow> {
  const { data, error } = await supabase
    .from('competitors')
    .insert(competitor)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }
  return data;
}

export async function updateCompetitor(
  id: string,
  orgId: string,
  updates: CompetitorUpdate,
): Promise<CompetitorRow> {
  const { data, error } = await supabase
    .from('competitors')
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

export async function deleteCompetitor(
  id: string,
  orgId: string,
): Promise<void> {
  const { error } = await supabase
    .from('competitors')
    .delete()
    .eq('id', id)
    .eq('org_id', orgId);

  if (error) {
    throw new Error(error.message);
  }
}

