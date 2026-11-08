import { z } from 'zod';

export const accountFormSchema = z.object({
  name: z.string().min(1, 'Account name is required.').max(100, 'Account name cannot exceed 100 characters.'),
  plan: z.string().max(50).optional().or(z.literal('')),
  mrr: z.number().min(0, 'MRR cannot be negative.'),
  renewal_date: z.string().optional().or(z.literal('')),
  signals: z.array(z.string().min(1).max(200)).default([]),
  notes: z.string().max(5000).optional().or(z.literal('')),
});

export type AccountFormData = {
  name: string;
  plan?: string;
  mrr: number;
  renewal_date?: string;
  signals: string[];
  notes?: string;
};

export type ChurnRiskTierFilter = 'all' | 'low' | 'medium' | 'high' | 'critical';
export type ChurnSortField = 'mrr' | 'renewal_date' | 'name' | 'health_score';
export type ChurnSortOrder = 'asc' | 'desc';

export interface AccountFilterOptions {
  search?: string;
  riskTier?: ChurnRiskTierFilter;
  sortField?: ChurnSortField;
  sortOrder?: ChurnSortOrder;
}
