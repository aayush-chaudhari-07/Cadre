import type { Tables } from '@/types/database';

export type DealRow = Tables<'deals'>;
export type DealStage = 'prospecting' | 'qualified' | 'proposal' | 'negotiation' | 'won' | 'lost';

export interface MonthlyPipelinePoint {
  month: string; // e.g. "Jan 2026"
  monthKey: string; // "2026-01"
  openAmount: number;
  weightedAmount: number;
  dealCount: number;
}

export interface ForecastScenarios {
  worstCase: number;
  expectedCase: number;
  bestCase: number;
}

export interface RevenueMetrics {
  totalPipeline: number;
  weightedPipeline: number;
  scenarios: ForecastScenarios;
  winRate: number;
  averageDealSize: number;
  averageSalesCycleDays: number;
  wonTotal: number;
  lostTotal: number;
  wonCount: number;
  lostCount: number;
  openCount: number;
}

/**
 * ============================================================================
 * FORECASTING MATHEMATICAL FORMULAS & METHODOLOGY
 * ============================================================================
 *
 * 1. Expected Case (Nominal Weighted Pipeline):
 *    Standard commercial weighting reflecting rep-estimated probability:
 *    Expected = sum(deal.amount * (deal.probability / 100))
 *    for all open deals (stage not in 'won', 'lost').
 *
 * 2. Best Case (Optimistic Pipeline Velocity):
 *    Upside scenario where deals accelerate and close at stage-adjusted high probabilities:
 *    - Prospecting: max(prob * 1.5, 30%)
 *    - Qualified:   max(prob * 1.4, 55%)
 *    - Proposal:    max(prob * 1.25, 80%)
 *    - Negotiation: max(prob * 1.15, 95%)
 *    Best = sum(deal.amount * (adjustedHighProb / 100))
 *
 * 3. Worst Case (High-Friction Downside Scenario):
 *    Stress-tested scenario considering ONLY late-stage negotiation & proposal deals:
 *    - Prospecting & Qualified: 0% credit (assumed slipped/delayed to future periods)
 *    - Proposal:    prob * 0.5
 *    - Negotiation: prob * 0.75
 *    Worst = sum(lateStageDeal.amount * (discountedLowProb / 100))
 *
 * 4. Win Rate:
 *    Closed Deals = Won Deals + Lost Deals
 *    Win Rate = Closed Deals > 0 ? (Won Deals Count / Closed Deals Count) * 100 : 0
 *
 * 5. Average Deal Size:
 *    Won Count > 0 ? (Sum of Won Deals Amount / Won Count) : 0
 *
 * 6. Average Sales Cycle (Days):
 *    Average duration between created_at and close date for closed Won deals.
 */

export const STAGE_CONFIG: Record<
  DealStage,
  { label: string; defaultProb: number; color: string }
> = {
  prospecting: { label: 'Prospecting', defaultProb: 10, color: 'var(--text-muted)' },
  qualified: { label: 'Qualified', defaultProb: 30, color: 'var(--cyan)' },
  proposal: { label: 'Proposal', defaultProb: 60, color: 'var(--gold)' },
  negotiation: { label: 'Negotiation', defaultProb: 80, color: 'var(--warning)' },
  won: { label: 'Closed Won', defaultProb: 100, color: 'var(--mint)' },
  lost: { label: 'Closed Lost', defaultProb: 0, color: 'var(--danger)' },
};

export function isOpenDeal(stage: string): boolean {
  return stage !== 'won' && stage !== 'lost';
}

/**
 * Calculates nominal weighted pipeline sum for open deals.
 */
export function calculateWeightedPipeline(deals: DealRow[]): number {
  return deals.reduce((sum, deal) => {
    if (!isOpenDeal(deal.stage)) return sum;
    const amount = Number(deal.amount) || 0;
    const prob = Math.max(0, Math.min(100, deal.probability));
    return sum + amount * (prob / 100);
  }, 0);
}

/**
 * Calculates Best, Expected, and Worst Case scenario valuations for all open deals.
 */
export function calculateForecastScenarios(deals: DealRow[]): ForecastScenarios {
  let expectedCase = 0;
  let bestCase = 0;
  let worstCase = 0;

  for (const deal of deals) {
    if (!isOpenDeal(deal.stage)) continue;

    const amount = Number(deal.amount) || 0;
    const prob = Math.max(0, Math.min(100, deal.probability));

    // 1. Expected Case
    expectedCase += amount * (prob / 100);

    // 2. Best Case (Stage-adjusted high probability ceiling)
    let bestProb = prob;
    switch (deal.stage as DealStage) {
      case 'prospecting':
        bestProb = Math.max(prob * 1.5, 30);
        break;
      case 'qualified':
        bestProb = Math.max(prob * 1.4, 55);
        break;
      case 'proposal':
        bestProb = Math.max(prob * 1.25, 80);
        break;
      case 'negotiation':
        bestProb = Math.max(prob * 1.15, 95);
        break;
      default:
        bestProb = Math.min(100, prob * 1.2);
    }
    bestCase += amount * (Math.min(100, bestProb) / 100);

    // 3. Worst Case (Only negotiation and proposal deals at discounted probabilities)
    if (deal.stage === 'negotiation') {
      const discountedProb = prob * 0.75;
      worstCase += amount * (discountedProb / 100);
    } else if (deal.stage === 'proposal') {
      const discountedProb = prob * 0.5;
      worstCase += amount * (discountedProb / 100);
    }
    // Early stages (prospecting, qualified) contribute 0 to worst-case floor
  }

  return {
    worstCase: Math.round(worstCase),
    expectedCase: Math.round(expectedCase),
    bestCase: Math.round(bestCase),
  };
}

/**
 * Calculates win rate percentage based on historical closed deals.
 */
export function calculateWinRate(deals: DealRow[]): number {
  let won = 0;
  let lost = 0;

  for (const deal of deals) {
    if (deal.stage === 'won') won += 1;
    if (deal.stage === 'lost') lost += 1;
  }

  const closed = won + lost;
  if (closed === 0) return 0;
  return Math.round((won / closed) * 1000) / 10; // e.g. 66.7%
}

/**
 * Calculates average deal size for closed won deals (or all deals if none won yet).
 */
export function calculateAverageDealSize(deals: DealRow[]): number {
  const wonDeals = deals.filter((d) => d.stage === 'won');
  if (wonDeals.length > 0) {
    const sum = wonDeals.reduce((acc, d) => acc + (Number(d.amount) || 0), 0);
    return Math.round(sum / wonDeals.length);
  }

  const allDeals = deals.filter((d) => (Number(d.amount) || 0) > 0);
  if (allDeals.length === 0) return 0;
  const sum = allDeals.reduce((acc, d) => acc + (Number(d.amount) || 0), 0);
  return Math.round(sum / allDeals.length);
}

/**
 * Calculates average sales cycle in calendar days for closed won deals.
 */
export function calculateAverageSalesCycleDays(deals: DealRow[]): number {
  const wonDeals = deals.filter((d) => d.stage === 'won');
  if (wonDeals.length === 0) return 0;

  let totalDays = 0;
  let validCount = 0;

  for (const deal of wonDeals) {
    const created = new Date(deal.created_at).getTime();
    const closed = deal.expected_close
      ? new Date(deal.expected_close).getTime()
      : new Date(deal.updated_at).getTime();

    if (!isNaN(created) && !isNaN(closed) && closed >= created) {
      const days = Math.round((closed - created) / (1000 * 60 * 60 * 24));
      totalDays += Math.max(1, days);
      validCount += 1;
    }
  }

  if (validCount === 0) return 0;
  return Math.round(totalDays / validCount);
}

/**
 * Aggregates weighted pipeline grouped by target month for time-series charts.
 */
export function calculateWeightedPipelineByMonth(deals: DealRow[]): MonthlyPipelinePoint[] {
  const monthlyMap: Record<string, { openAmount: number; weightedAmount: number; count: number; date: Date }> = {};

  for (const deal of deals) {
    if (!isOpenDeal(deal.stage)) continue;

    const amount = Number(deal.amount) || 0;
    const prob = Math.max(0, Math.min(100, deal.probability));
    const weighted = amount * (prob / 100);

    const dateStr = deal.expected_close || deal.created_at;
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) continue;

    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;

    if (!monthlyMap[key]) {
      monthlyMap[key] = {
        openAmount: 0,
        weightedAmount: 0,
        count: 0,
        date: new Date(d.getFullYear(), d.getMonth(), 1),
      };
    }

    monthlyMap[key].openAmount += amount;
    monthlyMap[key].weightedAmount += weighted;
    monthlyMap[key].count += 1;
  }

  const sortedKeys = Object.keys(monthlyMap).sort();

  return sortedKeys.map((key) => {
    const item = monthlyMap[key]!;
    const monthName = item.date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    return {
      monthKey: key,
      month: monthName,
      openAmount: Math.round(item.openAmount),
      weightedAmount: Math.round(item.weightedAmount),
      dealCount: item.count,
    };
  });
}

/**
 * Computes full executive revenue metrics summary.
 */
export function calculateRevenueMetrics(deals: DealRow[]): RevenueMetrics {
  let totalPipeline = 0;
  let wonTotal = 0;
  let lostTotal = 0;
  let wonCount = 0;
  let lostCount = 0;
  let openCount = 0;

  for (const deal of deals) {
    const amount = Number(deal.amount) || 0;
    if (deal.stage === 'won') {
      wonTotal += amount;
      wonCount += 1;
    } else if (deal.stage === 'lost') {
      lostTotal += amount;
      lostCount += 1;
    } else {
      totalPipeline += amount;
      openCount += 1;
    }
  }

  const weightedPipeline = Math.round(calculateWeightedPipeline(deals));
  const scenarios = calculateForecastScenarios(deals);
  const winRate = calculateWinRate(deals);
  const averageDealSize = calculateAverageDealSize(deals);
  const averageSalesCycleDays = calculateAverageSalesCycleDays(deals);

  return {
    totalPipeline,
    weightedPipeline,
    scenarios,
    winRate,
    averageDealSize,
    averageSalesCycleDays,
    wonTotal,
    lostTotal,
    wonCount,
    lostCount,
    openCount,
  };
}
