import { z } from 'zod';

export const competitorFormSchema = z.object({
  name: z.string().min(1, 'Competitor name is required.').max(100, 'Name cannot exceed 100 characters.'),
  url: z
    .string()
    .min(1, 'Website URL is required.')
    .max(2048, 'URL must not exceed 2,048 characters.')
    .url('Please enter a valid website URL starting with https:// or http://')
    .refine((val) => {
      try {
        const parsed = new URL(val);
        const host = parsed.hostname.toLowerCase();
        if (
          host === 'localhost' ||
          host.endsWith('.localhost') ||
          host.endsWith('.local') ||
          host.endsWith('.internal') ||
          host.startsWith('127.') ||
          host.startsWith('10.') ||
          host.startsWith('192.168.') ||
          host === '169.254.169.254'
        ) {
          return false;
        }
        return true;
      } catch {
        return false;
      }
    }, 'Internal, private, and loopback URLs are prohibited for security.'),
});

export type CompetitorFormData = z.infer<typeof competitorFormSchema>;

export interface CompetitorFilters {
  search?: string;
}

