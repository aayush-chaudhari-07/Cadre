import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { formatCurrency } from '@/lib/format';
import type { DealRow } from '../forecast';

export interface ForecastAreaChartProps {
  deals: DealRow[];
}

export function ForecastAreaChart({ deals }: ForecastAreaChartProps) {
  // Aggregate monthly open pipeline and project three scenarios
  const monthlyData = React.useMemo(() => {
    const monthlyMap: Record<string, { expected: number; best: number; worst: number; monthName: string }> = {};

    for (const deal of deals) {
      if (deal.stage === 'won' || deal.stage === 'lost') continue;

      const amount = Number(deal.amount) || 0;
      const prob = Math.max(0, Math.min(100, deal.probability));
      const expected = amount * (prob / 100);

      // Best multiplier
      let bestProb = prob;
      if (deal.stage === 'prospecting') bestProb = Math.max(prob * 1.5, 30);
      else if (deal.stage === 'qualified') bestProb = Math.max(prob * 1.4, 55);
      else if (deal.stage === 'proposal') bestProb = Math.max(prob * 1.25, 80);
      else if (deal.stage === 'negotiation') bestProb = Math.max(prob * 1.15, 95);
      const best = amount * (Math.min(100, bestProb) / 100);

      // Worst multiplier (only negotiation & proposal)
      let worst = 0;
      if (deal.stage === 'negotiation') worst = amount * ((prob * 0.75) / 100);
      else if (deal.stage === 'proposal') worst = amount * ((prob * 0.5) / 100);

      const dateStr = deal.expected_close || deal.created_at;
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) continue;

      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      const monthName = d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });

      if (!monthlyMap[key]) {
        monthlyMap[key] = { expected: 0, best: 0, worst: 0, monthName };
      }

      monthlyMap[key].expected += expected;
      monthlyMap[key].best += best;
      monthlyMap[key].worst += worst;
    }

    const sortedKeys = Object.keys(monthlyMap).sort();
    return sortedKeys.map((k) => ({
      name: monthlyMap[k]!.monthName,
      'Worst Case': Math.round(monthlyMap[k]!.worst),
      'Expected': Math.round(monthlyMap[k]!.expected),
      'Best Case': Math.round(monthlyMap[k]!.best),
    }));
  }, [deals]);

  if (monthlyData.length === 0) {
    return (
      <Card className="glass border-[var(--border)]">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold text-[var(--text)]">
            Revenue Scenario Forecast
          </CardTitle>
        </CardHeader>
        <CardContent className="h-64 flex flex-col items-center justify-center text-center">
          <p className="text-xs text-[var(--text-muted)] italic">
            Add open deals with target close dates to generate 3-scenario forecasting.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass border-[var(--border)]">
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-sm font-semibold text-[var(--text)]">
            Revenue Scenario Forecast
          </CardTitle>
          <p className="text-xs text-[var(--text-muted)]">
            Best (upside), Expected (nominal), and Worst (downside floor) trajectories
          </p>
        </div>
      </CardHeader>
      <CardContent className="pt-2">
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={monthlyData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="bestCaseGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2DE2A6" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#2DE2A6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="expectedGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22D3EE" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#22D3EE" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="worstCaseGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#F5B94A" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#F5B94A" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.4} />
              <XAxis
                dataKey="name"
                stroke="var(--text-muted)"
                fontSize={11}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="var(--text-muted)"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                tickFormatter={(val) => `$${(val / 1000).toFixed(0)}k`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--surface-raised)',
                  borderColor: 'var(--border)',
                  borderRadius: '8px',
                  fontSize: '12px',
                  color: 'var(--text)',
                }}
                formatter={(val: number) => [formatCurrency(val), '']}
              />
              <Legend
                verticalAlign="top"
                align="right"
                wrapperStyle={{ paddingBottom: '10px', fontSize: '11px' }}
              />
              <Area
                type="monotone"
                dataKey="Best Case"
                stroke="#2DE2A6"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#bestCaseGrad)"
                animationDuration={1200}
              />
              <Area
                type="monotone"
                dataKey="Expected"
                stroke="#22D3EE"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#expectedGrad)"
                animationDuration={1200}
              />
              <Area
                type="monotone"
                dataKey="Worst Case"
                stroke="#F5B94A"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#worstCaseGrad)"
                animationDuration={1200}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
