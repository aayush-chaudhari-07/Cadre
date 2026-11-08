import { supabase } from '@/lib/supabase';
import type { LeadFilterOptions, LeadFormInput, CsvLeadRow } from './schemas';
import type { Tables, TablesInsert, TablesUpdate } from '@/types/database';

export type LeadRecord = Tables<'leads'>;
export type LeadInteractionRecord = Tables<'lead_interactions'>;

export interface LeadsListResponse {
  leads: LeadRecord[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
}

export async function fetchLeads(
  orgId: string,
  options: LeadFilterOptions = {},
): Promise<LeadsListResponse> {
  const {
    search = '',
    status = 'all',
    sortField = 'created_at',
    sortOrder = 'desc',
    page = 1,
    pageSize = 10,
  } = options;

  let query = supabase
    .from('leads')
    .select('*', { count: 'exact' })
    .eq('org_id', orgId);

  // Status Filter
  if (status && status !== 'all') {
    query = query.eq('status', status);
  }

  // Debounced Search Filter
  const trimmedSearch = search.trim();
  if (trimmedSearch) {
    query = query.or(
      `name.ilike.%${trimmedSearch}%,company.ilike.%${trimmedSearch}%,email.ilike.%${trimmedSearch}%`,
    );
  }

  // Sorting
  const isAsc = sortOrder === 'asc';
  if (sortField === 'score') {
    query = query.order('score', { ascending: isAsc, nullsFirst: false });
  } else if (sortField === 'deal_value') {
    query = query.order('deal_value', { ascending: isAsc });
  } else {
    query = query.order('created_at', { ascending: isAsc });
  }

  // Pagination
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;
  query = query.range(from, to);

  const { data, count, error } = await query;
  if (error) {
    throw new Error(`Failed to fetch leads: ${error.message}`);
  }

  const totalCount = count ?? 0;
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

  return {
    leads: data ?? [],
    totalCount,
    totalPages,
    currentPage: page,
  };
}

export async function fetchLeadById(leadId: string): Promise<LeadRecord> {
  const { data, error } = await supabase
    .from('leads')
    .select('*')
    .eq('id', leadId)
    .single();

  if (error || !data) {
    throw new Error(`Failed to load lead details: ${error?.message || 'Not found'}`);
  }

  return data;
}

export async function fetchLeadInteractions(leadId: string): Promise<LeadInteractionRecord[]> {
  const { data, error } = await supabase
    .from('lead_interactions')
    .select('*')
    .eq('lead_id', leadId)
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch lead interactions: ${error.message}`);
  }

  return data ?? [];
}

export async function createLead(
  orgId: string,
  input: LeadFormInput,
): Promise<LeadRecord> {
  const insertPayload: TablesInsert<'leads'> = {
    org_id: orgId,
    name: input.name,
    company: input.company || null,
    email: input.email || null,
    source: input.source || null,
    status: input.status,
    deal_value: input.dealValue,
  };

  const { data, error } = await supabase
    .from('leads')
    .insert(insertPayload)
    .select()
    .single();

  if (error || !data) {
    throw new Error(`Failed to create lead: ${error?.message || 'Database error'}`);
  }

  return data;
}

export async function updateLead(
  leadId: string,
  input: Partial<LeadFormInput>,
): Promise<LeadRecord> {
  const updatePayload: TablesUpdate<'leads'> = {};

  if (input.name !== undefined) updatePayload.name = input.name;
  if (input.company !== undefined) updatePayload.company = input.company || null;
  if (input.email !== undefined) updatePayload.email = input.email || null;
  if (input.source !== undefined) updatePayload.source = input.source || null;
  if (input.status !== undefined) updatePayload.status = input.status;
  if (input.dealValue !== undefined) updatePayload.deal_value = input.dealValue;

  const { data, error } = await supabase
    .from('leads')
    .update(updatePayload)
    .eq('id', leadId)
    .select()
    .single();

  if (error || !data) {
    throw new Error(`Failed to update lead: ${error?.message || 'Database error'}`);
  }

  return data;
}

export async function deleteLead(leadId: string): Promise<void> {
  const { error } = await supabase
    .from('leads')
    .delete()
    .eq('id', leadId);

  if (error) {
    throw new Error(`Failed to delete lead: ${error.message}`);
  }
}

/**
 * Imports leads in batches of 100 per docs/PRD.md 5.3
 */
export async function importLeadsBatch(
  orgId: string,
  rows: CsvLeadRow[],
): Promise<{ insertedCount: number }> {
  const batchSize = 100;
  let insertedCount = 0;

  for (let i = 0; i < rows.length; i += batchSize) {
    const batch = rows.slice(i, i + batchSize);
    const insertPayload: TablesInsert<'leads'>[] = batch.map((row) => ({
      org_id: orgId,
      name: row.name,
      company: row.company || null,
      email: row.email || null,
      source: row.source || 'CSV Import',
      deal_value: row.dealValue || 0,
      status: 'new',
    }));

    const { data, error } = await supabase
      .from('leads')
      .insert(insertPayload)
      .select('id');

    if (error) {
      throw new Error(`Failed during batch import at rows ${i + 1}-${i + batch.length}: ${error.message}`);
    }

    insertedCount += data?.length ?? 0;
  }

  return { insertedCount };
}

