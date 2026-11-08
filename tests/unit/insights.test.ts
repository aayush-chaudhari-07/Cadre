import { describe, it, expect } from 'vitest';
import {
  dailyInsightsSchema,
  dailyInsightsRequestSchema,
  getRelatedModuleForAction,
} from '@/features/insights/schemas';

describe('Daily Insights Schemas & Module Routing', () => {
  describe('dailyInsightsSchema', () => {
    it('validates a complete and structured DailyInsights payload', () => {
      const validBrief = {
        headline: 'Pipeline coverage surged 18% as Northwind Labs entered security review.',
        highlights: [
          'Maya Chen (Northwind Labs) requested a 40-seat enterprise quote.',
          'Win rate improved to 67% over the last 30 days.',
        ],
        risks: [
          'Saffron Foods renewal in 20 days has zero logins over the past 3 weeks.',
          'Deal concentration: 52% of Q4 forecast sits in 2 enterprise accounts.',
        ],
        opportunities: [
          'Orbit Media usage increased 18%; prime candidate for 4 additional seats expansion.',
        ],
        recommended_actions: [
          'Follow up with Maya Chen on SOC 2 security compliance package',
          'Deploy proactive customer retention play for Saffron Foods',
          'Refresh sales battlecards against new rival packaging moves',
        ],
      };

      const result = dailyInsightsSchema.safeParse(validBrief);
      expect(result.success).toBe(true);
    });

    it('rejects payloads missing mandatory sections', () => {
      const incomplete = {
        headline: 'Only headline present',
        highlights: [],
      };
      expect(dailyInsightsSchema.safeParse(incomplete).success).toBe(false);
    });
  });

  describe('dailyInsightsRequestSchema', () => {
    it('validates UUID orgId and defaults forceRefresh to false', () => {
      const valid = dailyInsightsRequestSchema.safeParse({
        orgId: '11111111-1111-1111-1111-111111111111',
      });
      expect(valid.success).toBe(true);
      if (valid.success) {
        expect(valid.data.forceRefresh).toBe(false);
      }
    });

    it('rejects invalid non-UUID orgId', () => {
      const invalid = dailyInsightsRequestSchema.safeParse({
        orgId: 'invalid-not-uuid',
      });
      expect(invalid.success).toBe(false);
    });
  });

  describe('getRelatedModuleForAction', () => {
    it('accurately maps action descriptions to internal application routes', () => {
      expect(getRelatedModuleForAction('Qualify inbound website prospect Maya Chen')).toEqual({
        label: 'Open Leads',
        path: '/app/leads',
      });

      expect(getRelatedModuleForAction('Review action items from discovery call transcript')).toEqual({
        label: 'Open Meetings',
        path: '/app/meetings',
      });

      expect(getRelatedModuleForAction('Execute churn retention outreach for Saffron Foods')).toEqual({
        label: 'Open Churn Guard',
        path: '/app/churn',
      });

      expect(getRelatedModuleForAction('Update competitor battlecard with pricing talking points')).toEqual({
        label: 'Open Competitors',
        path: '/app/competitors',
      });

      expect(getRelatedModuleForAction('Analyze pipeline variance against quarterly forecast target')).toEqual({
        label: 'Open Revenue',
        path: '/app/revenue',
      });

      expect(getRelatedModuleForAction('Configure agent autonomy modes')).toEqual({
        label: 'Open Agents',
        path: '/app/agents',
      });

      expect(getRelatedModuleForAction('General strategic alignment directive')).toEqual({
        label: 'Open AI CEO',
        path: '/app/ceo',
      });
    });
  });
});
