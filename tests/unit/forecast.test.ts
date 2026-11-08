import { describe, it, expect } from 'vitest';
import {
  calculateWeightedPipeline,
  calculateForecastScenarios,
  calculateWinRate,
  calculateAverageDealSize,
  calculateAverageSalesCycleDays,
  calculateWeightedPipelineByMonth,
  calculateRevenueMetrics,
  type DealRow,
} from '@/features/revenue/forecast';

function createMockDeal(overrides: Partial<DealRow> = {}): DealRow {
  return {
    id: 'deal-' + Math.random().toString(36).substring(7),
    org_id: 'org-test',
    lead_id: null,
    name: 'Sample Deal',
    amount: 10000,
    stage: 'qualified',
    probability: 30,
    expected_close: '2026-11-30',
    is_demo: false,
    created_at: '2026-10-01T00:00:00Z',
    updated_at: '2026-10-01T00:00:00Z',
    ...overrides,
  };
}

describe('Revenue Forecasting Engine', () => {
  it('calculates weighted pipeline correctly for open deals', () => {
    const deals = [
      createMockDeal({ amount: 10000, probability: 30, stage: 'qualified' }), // 3,000
      createMockDeal({ amount: 50000, probability: 60, stage: 'proposal' }),  // 30,000
      createMockDeal({ amount: 20000, probability: 100, stage: 'won' }),     // excluded (closed)
      createMockDeal({ amount: 15000, probability: 0, stage: 'lost' }),      // excluded (closed)
    ];

    expect(calculateWeightedPipeline(deals)).toBe(33000);
  });

  it('calculates best, expected, and worst case scenarios adhering to stage adjustment rules', () => {
    const deals = [
      createMockDeal({ amount: 20000, stage: 'prospecting', probability: 10 }),
      createMockDeal({ amount: 40000, stage: 'proposal', probability: 60 }),
      createMockDeal({ amount: 100000, stage: 'negotiation', probability: 80 }),
    ];

    const { worstCase, expectedCase, bestCase } = calculateForecastScenarios(deals);

    // Expected Case:
    // 20000*0.1 + 40000*0.6 + 100000*0.8 = 2000 + 24000 + 80000 = 106,000
    expect(expectedCase).toBe(106000);

    // Worst Case:
    // Only proposal (40000 * (60*0.5/100) = 40000*0.3 = 12000)
    // + negotiation (100000 * (80*0.75/100) = 100000*0.6 = 60000) = 72,000
    // Prospecting is excluded (0)
    expect(worstCase).toBe(72000);

    // Best Case:
    // Prospecting: max(10*1.5, 30) = 30% -> 20000 * 0.3 = 6000
    // Proposal: max(60*1.25, 80) = 80% -> 40000 * 0.8 = 32000
    // Negotiation: max(80*1.15, 95) = 95% -> 100000 * 0.95 = 95000
    // Sum = 6000 + 32000 + 95000 = 133,000
    expect(bestCase).toBe(133000);

    // Hierarchy invariant
    expect(bestCase).toBeGreaterThan(expectedCase);
    expect(expectedCase).toBeGreaterThan(worstCase);
  });

  it('calculates historical win rate', () => {
    const deals = [
      createMockDeal({ stage: 'won' }),
      createMockDeal({ stage: 'won' }),
      createMockDeal({ stage: 'lost' }),
      createMockDeal({ stage: 'proposal' }), // open deals do not skew historical win rate
    ];

    // 2 won / (2 won + 1 lost) = 66.7%
    expect(calculateWinRate(deals)).toBe(66.7);

    // No closed deals returns 0%
    expect(calculateWinRate([createMockDeal({ stage: 'qualified' })])).toBe(0);
  });

  it('calculates average deal size for won accounts', () => {
    const deals = [
      createMockDeal({ stage: 'won', amount: 15000 }),
      createMockDeal({ stage: 'won', amount: 45000 }),
      createMockDeal({ stage: 'lost', amount: 90000 }),
      createMockDeal({ stage: 'proposal', amount: 100000 }),
    ];

    // (15000 + 45000) / 2 = 30,000
    expect(calculateAverageDealSize(deals)).toBe(30000);
  });

  it('calculates average sales cycle in days for won deals', () => {
    const deals = [
      createMockDeal({
        stage: 'won',
        created_at: '2026-10-01T00:00:00Z',
        expected_close: '2026-10-31', // 30 days
      }),
      createMockDeal({
        stage: 'won',
        created_at: '2026-09-01T00:00:00Z',
        expected_close: '2026-09-21', // 20 days
      }),
    ];

    // (30 + 20) / 2 = 25 days
    expect(calculateAverageSalesCycleDays(deals)).toBe(25);
  });

  it('groups weighted pipeline by target month', () => {
    const deals = [
      createMockDeal({
        amount: 20000,
        probability: 50,
        expected_close: '2026-11-15',
        stage: 'proposal',
      }),
      createMockDeal({
        amount: 30000,
        probability: 50,
        expected_close: '2026-11-28',
        stage: 'proposal',
      }),
      createMockDeal({
        amount: 40000,
        probability: 25,
        expected_close: '2026-12-10',
        stage: 'qualified',
      }),
    ];

    const monthly = calculateWeightedPipelineByMonth(deals);
    expect(monthly.length).toBe(2);

    const nov = monthly.find((m) => m.monthKey === '2026-11');
    expect(nov).toBeDefined();
    expect(nov?.openAmount).toBe(50000);
    expect(nov?.weightedAmount).toBe(25000); // (20000*0.5) + (30000*0.5)
    expect(nov?.dealCount).toBe(2);

    const dec = monthly.find((m) => m.monthKey === '2026-12');
    expect(dec).toBeDefined();
    expect(dec?.openAmount).toBe(40000);
    expect(dec?.weightedAmount).toBe(10000); // 40000*0.25
  });

  it('handles empty deal sets gracefully', () => {
    const metrics = calculateRevenueMetrics([]);
    expect(metrics.totalPipeline).toBe(0);
    expect(metrics.weightedPipeline).toBe(0);
    expect(metrics.scenarios.expectedCase).toBe(0);
    expect(metrics.winRate).toBe(0);
    expect(metrics.averageDealSize).toBe(0);
    expect(metrics.averageSalesCycleDays).toBe(0);
  });
});

