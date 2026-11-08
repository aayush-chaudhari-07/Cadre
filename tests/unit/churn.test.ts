import { describe, it, expect } from 'vitest';
import {
  calculateTotalMrr,
  calculateMrrAtRisk,
  countAccountsAtRisk,
  getDaysUntilRenewal,
  countUpcomingRenewals,
  calculateChurnSummaryMetrics,
} from '@/features/churn/metrics';
import type { Tables } from '@/types/database';

type AccountMock = Tables<'accounts'>;

function createMockAccount(overrides: Partial<AccountMock> = {}): AccountMock {
  return {
    id: 'acc-' + Math.random().toString(36).substring(7),
    org_id: 'org-test',
    name: 'Acme Test',
    plan: 'Pro',
    mrr: 1000,
    health_score: 80,
    risk_level: 'low',
    signals: [],
    last_analysis: null,
    renewal_date: '2026-12-01',
    is_demo: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    ...overrides,
  };
}

describe('MRR-at-Risk and Churn Metrics Calculations', () => {
  it('calculates total MRR correctly across varied accounts', () => {
    const accounts = [
      createMockAccount({ mrr: 1200 }),
      createMockAccount({ mrr: 2500 }),
      createMockAccount({ mrr: 800 }),
    ];

    expect(calculateTotalMrr(accounts)).toBe(4500);
  });

  it('calculates MRR at risk strictly for high and critical accounts', () => {
    const accounts = [
      createMockAccount({ mrr: 1000, risk_level: 'low' }),
      createMockAccount({ mrr: 2000, risk_level: 'medium' }),
      createMockAccount({ mrr: 3500, risk_level: 'high' }),
      createMockAccount({ mrr: 5000, risk_level: 'critical' }),
      createMockAccount({ mrr: 1500, risk_level: null }),
    ];

    // Only high (3500) + critical (5000) = 8500
    const mrrAtRisk = calculateMrrAtRisk(accounts);
    expect(mrrAtRisk).toBe(8500);
  });

  it('counts accounts at risk (high + critical only)', () => {
    const accounts = [
      createMockAccount({ risk_level: 'low' }),
      createMockAccount({ risk_level: 'medium' }),
      createMockAccount({ risk_level: 'high' }),
      createMockAccount({ risk_level: 'critical' }),
      createMockAccount({ risk_level: null }),
    ];

    expect(countAccountsAtRisk(accounts)).toBe(2);
  });

  it('calculates human-readable days until renewal', () => {
    const baseDate = new Date(2026, 10, 8); // Nov 8, 2026

    // Today
    expect(getDaysUntilRenewal('2026-11-08', baseDate).label).toBe('Today');

    // Tomorrow
    expect(getDaysUntilRenewal('2026-11-09', baseDate).label).toBe('Tomorrow');

    // in 14 days
    expect(getDaysUntilRenewal('2026-11-22', baseDate).label).toBe('in 14 days');

    // Past renewal
    expect(getDaysUntilRenewal('2026-11-05', baseDate).label).toBe('3 days ago');

    // No date
    expect(getDaysUntilRenewal(null, baseDate).label).toBe('No date');
  });

  it('counts upcoming renewals due within 30 days', () => {
    const baseDate = new Date(2026, 10, 8); // Nov 8, 2026

    const accounts = [
      createMockAccount({ renewal_date: '2026-11-15' }), // in 7 days (included)
      createMockAccount({ renewal_date: '2026-12-05' }), // in 27 days (included)
      createMockAccount({ renewal_date: '2026-12-25' }), // in 47 days (excluded)
      createMockAccount({ renewal_date: '2026-11-01' }), // past date (excluded)
      createMockAccount({ renewal_date: null }),         // no date (excluded)
    ];

    expect(countUpcomingRenewals(accounts, 30, baseDate)).toBe(2);
  });

  it('handles empty account lists with zero metrics and 0% risk', () => {
    const metrics = calculateChurnSummaryMetrics([]);
    expect(metrics.totalMrr).toBe(0);
    expect(metrics.mrrAtRisk).toBe(0);
    expect(metrics.mrrAtRiskPercent).toBe(0);
    expect(metrics.accountsAtRisk).toBe(0);
    expect(metrics.upcomingRenewalsCount).toBe(0);
  });
});
