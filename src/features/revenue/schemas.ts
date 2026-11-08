import { z } from 'zod';

export const dealStageEnum = z.enum([
  'prospecting',
  'qualified',
  'proposal',
  'negotiation',
  'won',
  'lost',
]);

export const dealFormSchema = z.object({
  name: z.string().min(1, 'Deal name is required.').max(200, 'Name cannot exceed 200 characters.'),
  amount: z.number().min(0, 'Amount must be positive.'),
  stage: dealStageEnum,
  probability: z.number().int().min(0).max(100),
  expected_close: z.string().optional().or(z.literal('')),
  lead_id: z.string().uuid().optional().or(z.literal('')),
});

export type DealFormData = z.infer<typeof dealFormSchema>;

export interface RevenueFilters {
  quarter?: string;
  stage?: string;
}
