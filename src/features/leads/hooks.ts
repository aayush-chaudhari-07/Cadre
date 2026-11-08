import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  fetchLeads,
  fetchLeadById,
  fetchLeadInteractions,
  createLead,
  updateLead,
  deleteLead,
  importLeadsBatch,
} from './api';
import type { LeadFilterOptions, LeadFormInput, CsvLeadRow } from './schemas';

export function useLeads(orgId: string | undefined, options: LeadFilterOptions = {}) {
  return useQuery({
    queryKey: ['leads', orgId, options],
    queryFn: () => {
      if (!orgId) throw new Error('No active organization');
      return fetchLeads(orgId, options);
    },
    enabled: Boolean(orgId),
    staleTime: 10 * 1000,
  });
}

export function useLead(leadId: string | undefined) {
  return useQuery({
    queryKey: ['lead', leadId],
    queryFn: () => {
      if (!leadId) throw new Error('No lead specified');
      return fetchLeadById(leadId);
    },
    enabled: Boolean(leadId),
  });
}

export function useLeadInteractions(leadId: string | undefined) {
  return useQuery({
    queryKey: ['lead_interactions', leadId],
    queryFn: () => {
      if (!leadId) throw new Error('No lead specified');
      return fetchLeadInteractions(leadId);
    },
    enabled: Boolean(leadId),
  });
}

export function useCreateLead(orgId: string | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: LeadFormInput) => {
      if (!orgId) throw new Error('No active organization');
      return createLead(orgId, input);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads', orgId] });
    },
  });
}

export function useUpdateLead(orgId: string | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ leadId, input }: { leadId: string; input: Partial<LeadFormInput> }) => {
      return updateLead(leadId, input);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['leads', orgId] });
      queryClient.invalidateQueries({ queryKey: ['lead', variables.leadId] });
    },
  });
}

export function useDeleteLead(orgId: string | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (leadId: string) => {
      return deleteLead(leadId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads', orgId] });
    },
  });
}

export function useImportLeads(orgId: string | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (rows: CsvLeadRow[]) => {
      if (!orgId) throw new Error('No active organization');
      return importLeadsBatch(orgId, rows);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads', orgId] });
    },
  });
}

