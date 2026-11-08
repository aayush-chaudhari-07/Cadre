import { z } from 'zod';

export const agentAutonomySchema = z.enum(['off', 'suggest', 'auto']);
export type AgentAutonomy = z.infer<typeof agentAutonomySchema>;

export const updateAgentSchema = z.object({
  enabled: z.boolean().optional(),
  autonomy: agentAutonomySchema.optional(),
  config: z.record(z.unknown()).optional(),
});
export type UpdateAgentInput = z.infer<typeof updateAgentSchema>;

