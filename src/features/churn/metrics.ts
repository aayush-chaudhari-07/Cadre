import type { AccountRow } from './api';

export interface ChurnSummaryMetrics {
  totalMrr: number;
  mrrAtRisk: number;
  mrrAtRiskPercent: number;
  accountsAtRisk: number;
  upcomingRenewalsCount: number;
}

/**
 * Calculates total MRR across all accounts.
 */
export function calculateTotalMrr(accounts: Array<Pick<AccountRow, 'mrr'>>): number {
  return accounts.reduce((sum, acc) => sum + (Number(acc.mrr) || 0), 0);
}

/**
 * Calculates MRR at risk, defined strictly as MRR for accounts with 'high' or 'critical' risk tiers.
 */
export function calculateMrrAtRisk(
  accounts: Array<Pick<AccountRow, 'mrr' | 'risk_level'>>,
): number {
  return accounts.reduce((sum, acc) => {
    const risk = acc.risk_level?.toLowerCase();
    if (risk === 'high' || risk === 'critical') {
      return sum + (Number(acc.mrr) || 0);
    }
    return sum;
  }, 0);
}

/**
 * Counts total accounts currently in 'high' or 'critical' risk tiers.
 */
export function countAccountsAtRisk(
  accounts: Array<Pick<AccountRow, 'risk_level'>>,
): number {
  return accounts.filter((acc) => {
    const risk = acc.risk_level?.toLowerCase();
    return risk === 'high' || risk === 'critical';
  }).length;
}

/**
 * Calculates days until renewal and returns human-readable relative label.
 */
export function getDaysUntilRenewal(
  renewalDateStr: string | null | undefined,
  baseDate: Date = new Date(),
): { days: number; isPast: boolean; isToday: boolean; label: string } {
  if (!renewalDateStr) {
    return { days: 0, isPast: false, isToday: false, label: 'No date' };
  }

  // Parse YYYY-MM-DD safely
  const [yearStr, monthStr, dayStr] = renewalDateStr.split('-');
  if (!yearStr || !monthStr || !dayStr) {
    return { days: 0, isPast: false, isToday: false, label: 'Invalid date' };
  }

  const renewalDate = new Date(
    parseInt(yearStr, 10),
    parseInt(monthStr, 10) - 1,
    parseInt(dayStr, 10),
  );

  const startOfBase = new Date(
    baseDate.getFullYear(),
    baseDate.getMonth(),
    baseDate.getDate(),
  );

  const diffTime = renewalDate.getTime() - startOfBase.getTime();
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return { days: 0, isPast: false, isToday: true, label: 'Today' };
  }
  if (diffDays === 1) {
    return { days: 1, isPast: false, isToday: false, label: 'Tomorrow' };
  }
  if (diffDays > 1) {
    return { days: diffDays, isPast: false, isToday: false, label: `in ${diffDays} days` };
  }
  const pastDays = Math.abs(diffDays);
  return {
    days: diffDays,
    isPast: true,
    isToday: false,
    label: pastDays === 1 ? '1 day ago' : `${pastDays} days ago`,
  };
}

/**
 * Counts accounts with renewals due within a specified day threshold (default 30 days).
 */
export function countUpcomingRenewals(
  accounts: Array<Pick<AccountRow, 'renewal_date'>>,
  daysThreshold: number = 30,
  baseDate: Date = new Date(),
): number {
  return accounts.filter((acc) => {
    if (!acc.renewal_date) return false;
    const { days, isPast } = getDaysUntilRenewal(acc.renewal_date, baseDate);
    return !isPast && days >= 0 && days <= daysThreshold;
  }).length;
}

/**
 * Computes full summary KPI metrics for the Churn Command dashboard.
 */
export function calculateChurnSummaryMetrics(
  accounts: AccountRow[],
  baseDate: Date = new Date(),
): ChurnSummaryMetrics {
  const totalMrr = calculateTotalMrr(accounts);
  const mrrAtRisk = calculateMrrAtRisk(accounts);
  const mrrAtRiskPercent = totalMrr > 0 ? (mrrAtRisk / totalMrr) * 100 : 0;
  const accountsAtRisk = countAccountsAtRisk(accounts);
  const upcomingRenewalsCount = countUpcomingRenewals(accounts, 30, baseDate);

  return {
    totalMrr,
    mrrAtRisk,
    mrrAtRiskPercent,
    accountsAtRisk,
    upcomingRenewalsCount,
  };
}
