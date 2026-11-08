import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  CartesianGrid,
} from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { formatCurrency } from '@/lib/format';
import { STAGE_CONFIG, type DealStage, type DealRow } from '../forecast';

export interface PipelineBarChartProps {
  deals: DealRow[];
}

const STAGE_ORDER: DealStage[] = [
  'prospecting',
  'qualified',
  'proposal',
  'negotiation',
  'won',
  'lost',
];

const STAGE_HEX: Record<DealStage, string> = {
  prospecting: '#94A3B8',
  qualified: '#22D3EE',
  proposal: '#F5B94A',
  negotiation: '#FB923C',
  won: '#2DE2A6',
  lost: '#EF4444',
};

export function PipelineBarChart({ deals }: PipelineBarChartProps) {
  const chartData = React.useMemo(() => {
    return STAGE_ORDER.map((stage) => {
      const stageDeals = deals.filter((d) => d.stage === stage);
      const totalAmount = stageDeals.reduce((sum, d) => sum + (Number(d.amount) || 0), 0);
      return {
        stage,
        label: STAGE_CONFIG[stage].label,
        amount: Math.round(totalAmount),
        count: stageDeals.length,
        color: STAGE_HEX[stage],
      };
    });
  }, [deals]);

  return (
    <Card className="glass border-[var(--border)]">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold text-[var(--text)]">
          Pipeline Volume by Stage
        </CardTitle>
        <p className="text-xs text-[var(--text-muted)]">
          Total deal value currently progressing through each sales milestone
        </p>
      </CardHeader>
      <CardContent className="pt-2">
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.4} />
              <XAxis
                dataKey="label"
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
                formatter={(val: number) => [formatCurrency(val), 'Volume']}
              />
              <Bar dataKey="amount" radius={[4, 4, 0, 0]} animationDuration={1000}>
                {chartData.map((entry) => (
                  <Cell key={entry.stage} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
