import { supabase } from '@/lib/supabase';
import type { Tables, TablesInsert, TablesUpdate } from '@/types/database';

export type MeetingRow = Tables<'meetings'>;
export type MeetingInsert = TablesInsert<'meetings'>;
export type MeetingUpdate = TablesUpdate<'meetings'>;

export async function fetchMeetings(
  orgId: string,
  search?: string,
): Promise<MeetingRow[]> {
  let query = supabase
    .from('meetings')
    .select('*')
    .eq('org_id', orgId)
    .order('held_at', { ascending: false });

  if (search && search.trim()) {
    const term = search.trim();
    query = query.or(`title.ilike.%${term}%,company.ilike.%${term}%`);
  }

  const { data, error } = await query;
  if (error) {
    throw new Error(error.message);
  }
  return data ?? [];
}

export async function fetchMeetingById(
  id: string,
  orgId: string,
): Promise<MeetingRow | null> {
  const { data, error } = await supabase
    .from('meetings')
    .select('*')
    .eq('id', id)
    .eq('org_id', orgId)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }
  return data;
}

export async function createMeeting(
  meeting: MeetingInsert,
): Promise<MeetingRow> {
  const { data, error } = await supabase
    .from('meetings')
    .insert(meeting)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }
  return data;
}

export async function updateMeeting(
  id: string,
  orgId: string,
  updates: MeetingUpdate,
): Promise<MeetingRow> {
  const { data, error } = await supabase
    .from('meetings')
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

export async function deleteMeeting(
  id: string,
  orgId: string,
): Promise<void> {
  const { error } = await supabase
    .from('meetings')
    .delete()
    .eq('id', id)
    .eq('org_id', orgId);

  if (error) {
    throw new Error(error.message);
  }
}

