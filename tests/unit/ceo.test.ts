import { describe, it, expect } from 'vitest';
import {
  normalizeAgentKey,
  ceoPlanSchema,
  ceoCommandFormSchema,
  VALID_CANONICAL_AGENTS,
} from '@/features/ceo/schemas';
import { agentAutonomySchema, updateAgentSchema } from '@/features/agents/schemas';

describe('AI CEO Strategic Planning & Agent Normalization', () => {
  describe('normalizeAgentKey', () => {
    it('preserves exact canonical agent keys', () => {
      for (const key of VALID_CANONICAL_AGENTS) {
        expect(normalizeAgentKey(key)).toBe(key);
      }
    });

    it('maps case-insensitive and whitespace variations', () => {
      expect(normalizeAgentKey('  SALES  ')).toBe('sales');
      expect(normalizeAgentKey('Operations')).toBe('operations');
      expect(normalizeAgentKey('SUPPORT')).toBe('support');
      expect(normalizeAgentKey('Marketing')).toBe('marketing');
      expect(normalizeAgentKey('FINANCE')).toBe('finance');
      expect(normalizeAgentKey('Ceo')).toBe('ceo');
    });

    it('maps natural language agent roles to canonical keys', () => {
      expect(normalizeAgentKey('AI Sales Manager')).toBe('sales');
      expect(normalizeAgentKey('Lead Qualification Specialist')).toBe('sales');
      expect(normalizeAgentKey('Pipeline Manager')).toBe('sales');
      expect(normalizeAgentKey('Deal Architect')).toBe('sales');

      expect(normalizeAgentKey('Operations Coordinator')).toBe('operations');
      expect(normalizeAgentKey('Meeting Action Tracker')).toBe('operations');

      expect(normalizeAgentKey('Customer Churn Prevention')).toBe('support');
      expect(normalizeAgentKey('Customer Success Sentinel')).toBe('support');
      expect(normalizeAgentKey('Account Health Watcher')).toBe('support');

      expect(normalizeAgentKey('Competitive Intelligence')).toBe('marketing');
      expect(normalizeAgentKey('Battlecard Creator')).toBe('marketing');
      expect(normalizeAgentKey('Market Positioning')).toBe('marketing');

      expect(normalizeAgentKey('Revenue Forecaster')).toBe('finance');
      expect(normalizeAgentKey('Financial Director')).toBe('finance');
      expect(normalizeAgentKey('MRR Variance Analyst')).toBe('finance');

      expect(normalizeAgentKey('Executive Strategy')).toBe('ceo');
      expect(normalizeAgentKey('Founder Liaison')).toBe('ceo');
    });

    it('gracefully falls back to ceo for unknown or empty input', () => {
      expect(normalizeAgentKey('')).toBe('ceo');
      expect(normalizeAgentKey(null)).toBe('ceo');
      expect(normalizeAgentKey(undefined)).toBe('ceo');
      expect(normalizeAgentKey('Unknown Department')).toBe('ceo');
      expect(normalizeAgentKey('random_noise_12345')).toBe('ceo');
    });
  });

  describe('ceoPlanSchema', () => {
    it('validates a complete and structured CEO plan', () => {
      const validPlan = {
        goal: 'Increase demo-to-close rate by 20% this quarter',
        summary: 'Targeted operational overhaul aligning sales qualification with competitive battlecards.',
        phases: [
          {
            name: 'Phase 1: Diagnostics',
            duration: '2 Weeks',
            actions: [
              {
                agent: 'sales',
                task: 'Audit past 50 lost deals for common objection patterns',
                expected_impact: 'Identify primary qualification leak',
              },
              {
                agent: 'marketing',
                task: 'Update competitor battlecards with pricing counter-arguments',
                expected_impact: 'Equip reps with real-time objection responses',
              },
            ],
          },
        ],
        kpis: [
          'Demo-to-close rate increases from 18% to 22%',
          'Sales cycle drops by 6 days on average',
        ],
        risks: [
          'Rep adoption of new battlecards may lag without coaching',
          'Competitor launches unexpected summer discounting campaign',
        ],
      };

      const result = ceoPlanSchema.safeParse(validPlan);
      expect(result.success).toBe(true);
    });

    it('rejects incomplete plans missing required fields', () => {
      const missingGoal = {
        summary: 'Plan without a goal',
        phases: [],
        kpis: [],
        risks: [],
      };
      expect(ceoPlanSchema.safeParse(missingGoal).success).toBe(false);

      const missingPhases = {
        goal: 'Improve retention',
        summary: 'Short summary',
        kpis: ['Zero churn'],
        risks: ['High workload'],
      };
      expect(ceoPlanSchema.safeParse(missingPhases).success).toBe(false);
    });
  });

  describe('ceoCommandFormSchema', () => {
    it('accepts valid commands between 3 and 2000 characters', () => {
      expect(ceoCommandFormSchema.safeParse({ command: 'Grow MRR by 15%' }).success).toBe(true);
      expect(ceoCommandFormSchema.safeParse({ command: 'AB' }).success).toBe(false); // too short
      expect(ceoCommandFormSchema.safeParse({ command: 'a'.repeat(2001) }).success).toBe(false); // too long
    });
  });

  describe('Agents Autonomy & Configuration Schemas', () => {
    it('enforces canonical autonomy values: off, suggest, auto', () => {
      expect(agentAutonomySchema.safeParse('off').success).toBe(true);
      expect(agentAutonomySchema.safeParse('suggest').success).toBe(true);
      expect(agentAutonomySchema.safeParse('auto').success).toBe(true);
      expect(agentAutonomySchema.safeParse('manual').success).toBe(false);
      expect(agentAutonomySchema.safeParse('unrestricted').success).toBe(false);
    });

    it('validates partial agent update payloads', () => {
      expect(updateAgentSchema.safeParse({ enabled: true }).success).toBe(true);
      expect(updateAgentSchema.safeParse({ autonomy: 'auto' }).success).toBe(true);
      expect(updateAgentSchema.safeParse({ enabled: false, autonomy: 'off' }).success).toBe(true);
      expect(updateAgentSchema.safeParse({ autonomy: 'invalid' }).success).toBe(false);
    });
  });
});

