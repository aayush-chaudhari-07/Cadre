/**
 * Format currency in USD strictly using Intl.NumberFormat per AGENTS.md.
 */
export function formatCurrency(
  amount: number,
  options: { compact?: boolean; maximumFractionDigits?: number } = {},
): string {
  const { compact = false, maximumFractionDigits = 2 } = options;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    notation: compact ? "compact" : "standard",
    maximumFractionDigits,
  }).format(amount);
}

/**
 * Format plain numbers with grouping separators.
 */
export function formatNumber(
  value: number,
  options: Intl.NumberFormatOptions = {},
): string {
  return new Intl.NumberFormat("en-US", options).format(value);
}

/**
 * Format percentages (e.g. 0.125 -> 12.5% or raw 12.5% with decimals).
 */
export function formatPercent(value: number, decimals = 1): string {
  return new Intl.NumberFormat("en-US", {
    style: "percent",
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

/**
 * Human readable relative date formatting (e.g. "2 hours ago", "in 3 days").
 */
export function formatRelativeDate(dateInput: Date | string | number): string {
  const date = typeof dateInput === "object" ? dateInput : new Date(dateInput);
  const now = new Date();
  const diffInSeconds = Math.round((date.getTime() - now.getTime()) / 1000);

  const units: { unit: Intl.RelativeTimeFormatUnit; seconds: number }[] = [
    { unit: "year", seconds: 31536000 },
    { unit: "month", seconds: 2592000 },
    { unit: "week", seconds: 604800 },
    { unit: "day", seconds: 86400 },
    { unit: "hour", seconds: 3600 },
    { unit: "minute", seconds: 60 },
    { unit: "second", seconds: 1 },
  ];

  const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

  for (const { unit, seconds } of units) {
    if (Math.abs(diffInSeconds) >= seconds || unit === "second") {
      const count = Math.round(diffInSeconds / seconds);
      return rtf.format(count, unit);
    }
  }

  return "just now";
}
