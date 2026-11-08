import React, { useState, useEffect } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { Crown, Sparkles, History, Bot } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import {
  useCeoPlans,
  useAskCeo,
  useUpdateCeoPlanStatus,
  CeoCommandBox,
  CeoPlanView,
  CeoPlanHistory,
  type CeoPlanRecord,
  type CeoPlan,
} from '@/features/ceo';
import { toast } from 'sonner';

export const Route = createFileRoute('/app/ceo')({
  component: CeoPage,
});

function CeoPage() {
  const { data: plans = [], isLoading: isLoadingPlans } = useCeoPlans();
  const askCeoMutation = useAskCeo();
  const updateStatusMutation = useUpdateCeoPlanStatus();

  const [activePlan, setActivePlan] = useState<CeoPlanRecord | (CeoPlan & { id?: string; status?: string }) | null>(null);
  const [showHistoryMobile, setShowHistoryMobile] = useState(false);

  // Default to newest plan once loaded if not already selected
  useEffect(() => {
    if (!activePlan && plans.length > 0 && plans[0]) {
      setActivePlan(plans[0]);
    }
  }, [plans, activePlan]);

  const handleCommandSubmit = async (command: string) => {
    toast.loading('AI CEO synthesizing cross-agent execution blueprint...', { id: 'ceo-gen' });
    try {
      const generated = await askCeoMutation.mutateAsync({ command });
      setActivePlan(generated);
      toast.success('Strategic blueprint ready for executive review', { id: 'ceo-gen' });
    } catch (err) {
      toast.error(`Directive execution failed: ${(err as Error).message}`, { id: 'ceo-gen' });
    }
  };

  const handleApprovePlan = async (planId: string) => {
    await updateStatusMutation.mutateAsync({
      id: planId,
      status: 'approved',
    });

    // Update active plan status in state
    if (activePlan) {
      setActivePlan({
        ...activePlan,
        status: 'approved',
      });
    }
  };

  return (
    <div className="space-y-8">
      {/* Executive Gold Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <h1 className="font-heading text-2xl sm:text-3xl font-bold tracking-tight text-[var(--text)]">
              AI CEO Strategic Console
            </h1>
            <Badge variant="gold" className="text-xs gap-1 font-mono">
              <Crown className="w-3.5 h-3.5" />
              <span>Executive Orchestrator</span>
            </Badge>
          </div>
          <p className="text-sm text-[var(--text-muted)] max-w-2xl">
            Give high-level directives to your AI CEO. The CEO digests real sales telemetry,
            diagnoses bottlenecks, and mobilizes your 5 specialized agents with phased execution roadmaps.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowHistoryMobile((prev) => !prev)}
            className="lg:hidden gap-1.5 text-xs"
          >
            <History className="w-3.5 h-3.5" />
            <span>{showHistoryMobile ? 'Hide History' : 'Past Plans'}</span>
          </Button>
        </div>
      </div>

      {/* Directive Command Terminal */}
      <CeoCommandBox
        onSubmit={handleCommandSubmit}
        isSubmitting={askCeoMutation.isPending}
      />

      {/* Main Grid: Active Plan Blueprint & History Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Active Strategic Plan Blueprint (7 or 8 columns on desktop) */}
        <div className="lg:col-span-8 space-y-6">
          {activePlan ? (
            <CeoPlanView
              plan={'plan' in activePlan ? (activePlan as CeoPlanRecord).plan : (activePlan as CeoPlan)}
              planId={activePlan.id}
              status={(activePlan.status as 'draft' | 'approved' | 'done') || 'draft'}
              onApprove={handleApprovePlan}
              isApproving={updateStatusMutation.isPending}
            />
          ) : (
            <Card className="glass border-[var(--border)] p-8 text-center">
              <CardContent className="space-y-3 py-6">
                <div className="w-12 h-12 rounded-2xl bg-[var(--gold)]/10 text-[var(--gold)] border border-[var(--gold)]/20 flex items-center justify-center mx-auto">
                  <Sparkles className="w-6 h-6" />
                </div>
                <h3 className="text-base font-semibold font-heading text-[var(--text)]">
                  No Active Strategic Blueprint
                </h3>
                <p className="text-xs text-[var(--text-muted)] max-w-md mx-auto">
                  Type a command into the directive box above or click on one of the sample directives
                  to synthesize a multi-agent growth plan.
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* History Sidebar (4 columns on desktop, toggled on mobile) */}
        <div
          className={`lg:col-span-4 ${
            showHistoryMobile ? 'block' : 'hidden lg:block'
          } space-y-4`}
        >
          <Card className="glass border-[var(--border)]">
            <CardHeader className="pb-3 border-b border-[var(--border)]">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <History className="w-4 h-4 text-[var(--gold)]" />
                  <span>Strategic Directive History</span>
                </CardTitle>
                <span className="text-[11px] font-mono text-[var(--text-muted)] tabular-nums">
                  {plans.length} {plans.length === 1 ? 'plan' : 'plans'}
                </span>
              </div>
            </CardHeader>
            <CardContent className="p-3 max-h-[600px] overflow-y-auto">
              <CeoPlanHistory
                plans={plans}
                activePlanId={activePlan?.id ?? null}
                onSelectPlan={(p) => {
                  setActivePlan(p);
                  setShowHistoryMobile(false);
                }}
                isLoading={isLoadingPlans}
              />
            </CardContent>
          </Card>

          {/* Agent Capability Guide Card */}
          <Card className="glass border-[var(--border)] p-4 text-xs space-y-2.5">
            <div className="flex items-center gap-2 text-[var(--gold)] font-medium">
              <Bot className="w-4 h-4" />
              <span>Orchestrated Agents</span>
            </div>
            <p className="text-[11px] text-[var(--text-muted)] leading-relaxed">
              Every action in the plan is delegated to one of your active specialists:
              Sales for pipeline, Operations for meeting execution, Support for churn mitigation,
              Marketing for competitive battlecards, and Finance for revenue modeling.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
