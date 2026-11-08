import { describe, it, expect } from 'vitest';
import { leadFormSchema } from '@/features/leads/schemas';
import { meetingFormSchema } from '@/features/meetings/schemas';
import { accountFormSchema } from '@/features/churn/schemas';
import { competitorFormSchema } from '@/features/competitors/schemas';
import { dealFormSchema } from '@/features/revenue/schemas';

describe('Zod Domain Validation Schemas', () => {
  describe('leadFormSchema', () => {
    it('validates a valid lead form submission', () => {
      const valid = {
        name: 'Jordan Lee',
        company: 'Vanguard Dynamics',
        email: 'jordan@vanguard.io',
        dealValue: 35000,
        source: 'Website',
        status: 'new' as const,
      };
      const parsed = leadFormSchema.safeParse(valid);
      expect(parsed.success).toBe(true);
    });

    it('rejects empty name', () => {
      const invalid = {
        name: '',
        company: 'Vanguard',
        email: 'jordan@vanguard.io',
        dealValue: 10000,
        source: 'Website',
        status: 'new' as const,
      };
      const parsed = leadFormSchema.safeParse(invalid);
      expect(parsed.success).toBe(false);
    });

    it('rejects invalid email if provided', () => {
      const invalid = {
        name: 'Jordan',
        company: 'Vanguard',
        email: 'not-an-email',
        dealValue: 10000,
        source: 'Website',
        status: 'new' as const,
      };
      const parsed = leadFormSchema.safeParse(invalid);
      expect(parsed.success).toBe(false);
    });
  });

  describe('meetingFormSchema', () => {
    it('validates a meeting with transcript', () => {
      const valid = {
        title: 'Q4 Renewal Alignment',
        company: 'Acorn Logistics',
        held_at: '2026-11-08',
        transcript: 'Speaker 1: Hello. Speaker 2: We would like to expand our license.',
        autoAnalyze: true,
      };
      const parsed = meetingFormSchema.safeParse(valid);
      expect(parsed.success).toBe(true);
    });

    it('rejects transcripts exceeding 60,000 characters', () => {
      const invalid = {
        title: 'Huge Meeting',
        held_at: '2026-11-08',
        transcript: 'a'.repeat(60001),
        autoAnalyze: true,
      };
      const parsed = meetingFormSchema.safeParse(invalid);
      expect(parsed.success).toBe(false);
    });

    it('rejects transcripts shorter than 10 characters', () => {
      const invalid = {
        title: 'Too short',
        held_at: '2026-11-08',
        transcript: 'Hi',
        autoAnalyze: true,
      };
      const parsed = meetingFormSchema.safeParse(invalid);
      expect(parsed.success).toBe(false);
    });
  });

  describe('accountFormSchema', () => {
    it('validates account with MRR in USD', () => {
      const valid = {
        name: 'Helios Media',
        plan: 'Enterprise',
        mrr: 4500,
        renewal_date: '2026-12-31',
        signals: ['Reduced DAU', 'Executive sponsor left'],
        notes: 'Needs executive outreach',
      };
      const parsed = accountFormSchema.safeParse(valid);
      expect(parsed.success).toBe(true);
    });

    it('rejects negative MRR values', () => {
      const invalid = {
        name: 'Helios Media',
        plan: 'Standard',
        mrr: -100,
        renewal_date: '2026-12-31',
      };
      const parsed = accountFormSchema.safeParse(invalid);
      expect(parsed.success).toBe(false);
    });
  });

  describe('competitorFormSchema', () => {
    it('validates public competitor HTTP/HTTPS URL', () => {
      const valid = {
        name: 'Rival AI',
        url: 'https://rival.ai/pricing',
      };
      const parsed = competitorFormSchema.safeParse(valid);
      expect(parsed.success).toBe(true);
    });

    it('rejects internal loopback and private hosts', () => {
      const localhost = {
        name: 'Local test',
        url: 'http://localhost:3000',
      };
      expect(competitorFormSchema.safeParse(localhost).success).toBe(false);

      const loopbackIp = {
        name: 'Ip test',
        url: 'http://127.0.0.1/admin',
      };
      expect(competitorFormSchema.safeParse(loopbackIp).success).toBe(false);

      const metadataIp = {
        name: 'Metadata test',
        url: 'http://169.254.169.254/latest',
      };
      expect(competitorFormSchema.safeParse(metadataIp).success).toBe(false);
    });

    it('rejects non-http schemes (e.g. ftp, javascript, file)', () => {
      const ftp = { name: 'Ftp', url: 'ftp://files.rival.com' };
      expect(competitorFormSchema.safeParse(ftp).success).toBe(false);

      const js = { name: 'Js', url: 'javascript:alert(1)' };
      expect(competitorFormSchema.safeParse(js).success).toBe(false);
    });
  });

  describe('dealFormSchema', () => {
    it('validates deal with valid stage and value', () => {
      const valid = {
        name: 'Global Expansion Deal',
        stage: 'negotiation' as const,
        amount: 120000,
        probability: 70,
        expected_close: '2026-12-15',
      };
      const parsed = dealFormSchema.safeParse(valid);
      expect(parsed.success).toBe(true);
    });

    it('rejects probability outside 0-100', () => {
      const over100 = {
        name: 'Over 100 Deal',
        stage: 'proposal' as const,
        amount: 10000,
        probability: 101,
      };
      expect(dealFormSchema.safeParse(over100).success).toBe(false);

      const under0 = {
        name: 'Under 0 Deal',
        stage: 'proposal' as const,
        amount: 10000,
        probability: -5,
      };
      expect(dealFormSchema.safeParse(under0).success).toBe(false);
    });

    it('rejects negative amount', () => {
      const negative = {
        name: 'Negative Deal',
        stage: 'qualified' as const,
        amount: -500,
        probability: 50,
      };
      expect(dealFormSchema.safeParse(negative).success).toBe(false);
    });
  });
});
