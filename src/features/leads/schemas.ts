import { z } from 'zod';

export const leadStatusSchema = z.enum(['new', 'hot', 'warm', 'cold', 'won', 'lost']);
export type LeadStatus = z.infer<typeof leadStatusSchema>;

export const leadIntentSchema = z.enum(['high', 'medium', 'low']);
export type LeadIntent = z.infer<typeof leadIntentSchema>;

export const leadInteractionChannelSchema = z.enum(['email', 'chat', 'call', 'note']);
export type LeadInteractionChannel = z.infer<typeof leadInteractionChannelSchema>;

export const leadFormSchema = z.object({
  name: z.string().min(1, 'Lead contact name is required.').max(100),
  company: z.string().max(100),
  email: z.string().email('Please enter a valid email address.').or(z.literal('')),
  source: z.string().max(50),
  status: leadStatusSchema,
  dealValue: z.number().min(0, 'Deal value cannot be negative.'),
});
export type LeadFormInput = z.infer<typeof leadFormSchema>;

export const csvRowSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  company: z.string().optional().default(''),
  email: z.string().email().or(z.literal('')).optional().default(''),
  source: z.string().optional().default('CSV Import'),
  dealValue: z.number().min(0).optional().default(0),
});
export type CsvLeadRow = z.infer<typeof csvRowSchema>;

export type LeadSortField = 'score' | 'deal_value' | 'created_at';
export type LeadSortOrder = 'asc' | 'desc';

export interface LeadFilterOptions {
  search?: string;
  status?: LeadStatus | 'all';
  sortField?: LeadSortField;
  sortOrder?: LeadSortOrder;
  page?: number;
  pageSize?: number;
}
