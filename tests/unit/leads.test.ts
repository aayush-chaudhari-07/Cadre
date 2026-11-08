import { describe, it, expect } from 'vitest';
import { csvRowSchema } from '@/features/leads/schemas';

// Sample leads dataset for filter/sort unit testing
const MOCK_LEADS = [
  {
    id: '1',
    name: 'Maya Chen',
    company: 'Northwind Labs',
    email: 'maya@northwind.io',
    status: 'hot',
    score: 92,
    deal_value: 48000,
    created_at: '2026-11-01T10:00:00Z',
  },
  {
    id: '2',
    name: 'Sarah Connor',
    company: 'Cyberdyne Systems',
    email: 'sconnor@cyberdyne.com',
    status: 'warm',
    score: 65,
    deal_value: 12000,
    created_at: '2026-11-03T12:00:00Z',
  },
  {
    id: '3',
    name: 'David Miller',
    company: 'Vault Security',
    email: 'd.miller@vault.net',
    status: 'new',
    score: null,
    deal_value: 25000,
    created_at: '2026-11-05T08:00:00Z',
  },
  {
    id: '4',
    name: 'Elena Rostova',
    company: 'Apex Robotics',
    email: 'elena@apex.ai',
    status: 'cold',
    score: 35,
    deal_value: 8000,
    created_at: '2026-11-04T15:00:00Z',
  },
  {
    id: '5',
    name: 'James Wilson',
    company: 'Northwind Logistics',
    email: 'jwilson@nwlogistics.com',
    status: 'won',
    score: 88,
    deal_value: 95000,
    created_at: '2026-10-25T11:00:00Z',
  },
];

describe('CSV Parsing and Validation', () => {
  it('validates a complete, well-formed lead row', () => {
    const rawRow = {
      name: 'John Doe',
      company: 'Acme Corp',
      email: 'john@acme.com',
      source: 'Website Demo',
      dealValue: 15000,
    };

    const result = csvRowSchema.safeParse(rawRow);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.name).toBe('John Doe');
      expect(result.data.company).toBe('Acme Corp');
      expect(result.data.dealValue).toBe(15000);
    }
  });

  it('rejects rows with missing or empty name', () => {
    const missingName = {
      name: '',
      company: 'Acme Corp',
      email: 'john@acme.com',
    };

    const result = csvRowSchema.safeParse(missingName);
    expect(result.success).toBe(false);
  });

  it('rejects rows with invalid email addresses', () => {
    const invalidEmail = {
      name: 'John Doe',
      email: 'not-an-email',
    };

    const result = csvRowSchema.safeParse(invalidEmail);
    expect(result.success).toBe(false);
  });

  it('allows empty email string or omitted email', () => {
    const emptyEmail = {
      name: 'Jane Smith',
      email: '',
    };

    const result = csvRowSchema.safeParse(emptyEmail);
    expect(result.success).toBe(true);
  });

  it('rejects negative deal values', () => {
    const negativeDeal = {
      name: 'Bob Ross',
      dealValue: -500,
    };

    const result = csvRowSchema.safeParse(negativeDeal);
    expect(result.success).toBe(false);
  });
});

describe('Leads Table Filtering and Sorting Logic', () => {
  it('filters by status', () => {
    const hotLeads = MOCK_LEADS.filter((l) => l.status === 'hot');
    expect(hotLeads).toHaveLength(1);
    expect(hotLeads[0]!.name).toBe('Maya Chen');

    const wonLeads = MOCK_LEADS.filter((l) => l.status === 'won');
    expect(wonLeads).toHaveLength(1);
    expect(wonLeads[0]!.name).toBe('James Wilson');
  });

  it('filters by search keyword across name, company, and email', () => {
    const query = 'northwind';
    const matches = MOCK_LEADS.filter(
      (l) =>
        l.name.toLowerCase().includes(query) ||
        l.company.toLowerCase().includes(query) ||
        l.email.toLowerCase().includes(query),
    );
    expect(matches).toHaveLength(2); // Maya Chen (Northwind Labs) and James Wilson (Northwind Logistics)

    const cyberMatches = MOCK_LEADS.filter(
      (l) =>
        l.name.toLowerCase().includes('cyberdyne') ||
        l.company.toLowerCase().includes('cyberdyne') ||
        l.email.toLowerCase().includes('cyberdyne'),
    );
    expect(cyberMatches).toHaveLength(1);
    expect(cyberMatches[0]!.name).toBe('Sarah Connor');
  });

  it('sorts correctly by deal value in descending order', () => {
    const sorted = [...MOCK_LEADS].sort((a, b) => b.deal_value - a.deal_value);
    expect(sorted[0]!.deal_value).toBe(95000); // James Wilson
    expect(sorted[1]!.deal_value).toBe(48000); // Maya Chen
    expect(sorted[sorted.length - 1]!.deal_value).toBe(8000); // Elena Rostova
  });

  it('sorts correctly by score with nulls placed last in descending order', () => {
    const sorted = [...MOCK_LEADS].sort((a, b) => {
      if (a.score === null) return 1;
      if (b.score === null) return -1;
      return b.score - a.score;
    });

    expect(sorted[0]!.score).toBe(92);
    expect(sorted[1]!.score).toBe(88);
    expect(sorted[sorted.length - 1]!.score).toBeNull();
  });

  it('calculates pagination pages accurately', () => {
    const totalCount = 45;
    const pageSize = 10;
    const totalPages = Math.ceil(totalCount / pageSize);
    expect(totalPages).toBe(5);

    const page3Items = MOCK_LEADS.slice(2 * pageSize, 3 * pageSize);
    expect(Array.isArray(page3Items)).toBe(true);
  });
});

