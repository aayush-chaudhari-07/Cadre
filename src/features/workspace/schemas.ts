import { z } from 'zod';

export const workspaceSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Workspace name must be at least 2 characters')
    .max(80, 'Workspace name must be at most 80 characters'),
  startWithSampleData: z.boolean(),
});

export type WorkspaceInput = z.infer<typeof workspaceSchema>;
