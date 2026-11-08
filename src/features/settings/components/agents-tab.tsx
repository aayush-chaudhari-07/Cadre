import React from 'react';
import { Link } from '@tanstack/react-router';
import { Bot, ArrowRight, ShieldCheck, Cpu } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export function AgentsTab() {
  return (
    <Card className="glass border-[var(--border)]">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base flex items-center gap-2">
              <Bot className="w-4 h-4 text-[var(--primary)]" />
              <span>Autonomous Agent Roster &amp; Autonomy</span>
            </CardTitle>
            <CardDescription>
              Configure autonomy levels (off, suggest, auto) and review execution audit logs.
            </CardDescription>
          </div>
          <Badge variant="default" className="text-xs">
            6 Specialized Agents
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="p-5 rounded-2xl bg-[var(--surface-sunken)] border border-[var(--border)] space-y-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-[var(--primary)]/10 text-[var(--primary)] border border-[var(--primary)]/20 flex items-center justify-center shrink-0">
              <Cpu className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-semibold text-[var(--text)]">
                Dedicated Agent Management Console
              </h4>
              <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                Agent configuration, autonomy controls, and activity run logs have been consolidated into the
                dedicated <strong>Agent Roster</strong> workspace module. You can toggle each specialist on/off,
                calibrate autonomy, and inspect the real-time execution audit stream.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-2">
            {[
              { name: 'AI CEO', role: 'Strategic Alignment', color: 'text-[var(--gold)]' },
              { name: 'Sales Manager', role: 'Lead Qualification', color: 'text-[var(--mint)]' },
              { name: 'Operations', role: 'Meeting Intelligence', color: 'text-[var(--cyan)]' },
              { name: 'Support Manager', role: 'Churn Risk Defense', color: 'text-[var(--warning)]' },
              { name: 'Marketing', role: 'Competitor Battlecards', color: 'text-[#A78BFA]' },
              { name: 'Finance Director', role: 'Revenue Forecasting', color: 'text-[#34D399]' },
            ].map((a, idx) => (
              <div key={idx} className="p-2.5 rounded-lg bg-[var(--surface-raised)] border border-[var(--border)] text-xs">
                <span className={`font-semibold block ${a.color}`}>{a.name}</span>
                <span className="text-[11px] text-[var(--text-muted)]">{a.role}</span>
              </div>
            ))}
          </div>

          <div className="pt-2 flex justify-end">
            <Link to="/app/agents">
              <Button className="gap-2 text-xs font-semibold">
                <ShieldCheck className="w-4 h-4" />
                <span>Open Agent Operations Console</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
