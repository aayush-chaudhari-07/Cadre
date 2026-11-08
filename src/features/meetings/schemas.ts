import { z } from 'zod';

export const meetingFormSchema = z.object({
  title: z.string().min(1, 'Title is required.').max(200, 'Title cannot exceed 200 characters.'),
  company: z.string().max(100, 'Company cannot exceed 100 characters.').optional().or(z.literal('')),
  held_at: z.string().min(1, 'Meeting date is required.'),
  transcript: z
    .string()
    .min(10, 'Transcript must contain at least 10 characters.')
    .max(60000, 'Transcript must not exceed 60,000 characters.'),
  autoAnalyze: z.boolean().default(true),
});

export type MeetingFormData = {
  title: string;
  company?: string;
  held_at: string;
  transcript: string;
  autoAnalyze: boolean;
};

export interface MeetingFilters {
  search?: string;
  sentiment?: 'all' | 'positive' | 'neutral' | 'negative';
}
