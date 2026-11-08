import { describe, it, expect } from 'vitest';
import { formatCurrency, formatNumber, formatPercent, formatRelativeDate } from '@/lib/format';

describe('Formatters (format.ts)', () => {
  describe('formatCurrency', () => {
    it('formats numbers strictly in USD currency format', () => {
      const formatted = formatCurrency(1250);
      expect(formatted).toMatch(/\$1,250/);
    });

    it('formats decimals correctly', () => {
      const formatted = formatCurrency(99.5, { maximumFractionDigits: 2 });
      expect(formatted).toMatch(/\$99.50/);
    });

    it('supports compact notation for large numbers', () => {
      const compact1M = formatCurrency(1200000, { compact: true });
      expect(compact1M).toMatch(/\$1\.2M/);

      const compact10K = formatCurrency(45000, { compact: true });
      expect(compact10K).toMatch(/\$45K/);
    });

    it('handles zero and negative amounts in USD', () => {
      expect(formatCurrency(0)).toMatch(/\$0/);
      expect(formatCurrency(-500)).toMatch(/-\$500/);
    });
  });

  describe('formatNumber', () => {
    it('formats numbers with commas', () => {
      expect(formatNumber(1000000)).toBe('1,000,000');
      expect(formatNumber(42)).toBe('42');
    });
  });

  describe('formatPercent', () => {
    it('formats decimal fractions as percentages', () => {
      expect(formatPercent(0.25)).toBe('25.0%');
      expect(formatPercent(0.3333, 2)).toBe('33.33%');
      expect(formatPercent(1)).toBe('100.0%');
      expect(formatPercent(0)).toBe('0.0%');
    });
  });

  describe('formatRelativeDate', () => {
    it('formats past and future dates', () => {
      const now = new Date();

      const twoHoursAgo = new Date(now.getTime() - 2 * 3600 * 1000);
      expect(formatRelativeDate(twoHoursAgo)).toMatch(/2 hours ago/);

      const threeDaysAgo = new Date(now.getTime() - 3 * 86400 * 1000);
      expect(formatRelativeDate(threeDaysAgo)).toMatch(/3 days ago/);

      const inFiveDays = new Date(now.getTime() + 5 * 86400 * 1000);
      expect(formatRelativeDate(inFiveDays)).toMatch(/in 5 days/);
    });

    it('accepts ISO string input', () => {
      const yesterday = new Date(Date.now() - 86400 * 1000).toISOString();
      const result = formatRelativeDate(yesterday);
      expect(result).toMatch(/1 day ago|yesterday/);
    });
  });
});

