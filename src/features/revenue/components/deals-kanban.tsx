import React, { useState } from 'react';
import {
  MoreVertical,
  Edit2,
  Trash2,
  Calendar,
  Plus,
  ArrowRight,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import { formatCurrency, formatRelativeDate } from '@/lib/format';
import { STAGE_CONFIG, type DealStage, type DealRow } from '../forecast';
import { useUpdateDeal } from '../hooks';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export interface DealsKanbanProps {
  deals: DealRow[];
  onAddDeal: (stage: DealStage) => void;
  onEditDeal: (deal: DealRow) => void;
  onDeleteDeal: (deal: DealRow) => void;
}

const STAGES: DealStage[] = [
  'prospecting',
  'qualified',
  'proposal',
  'negotiation',
  'won',
  'lost',
];

export function DealsKanban({
  deals,
  onAddDeal,
  onEditDeal,
  onDeleteDeal,
}: DealsKanbanProps) {
  const updateMutation = useUpdateDeal();
  const [draggedDealId, setDraggedDealId] = useState<string | null>(null);
  const [dragOverStage, setDragOverStage] = useState<DealStage | null>(null);

  const handleMoveStage = async (deal: DealRow, targetStage: DealStage) => {
    if (deal.stage === targetStage) return;

    let targetProb = deal.probability;
    if (targetStage === 'won') {
      targetProb = 100;
    } else if (targetStage === 'lost') {
      targetProb = 0;
    } else if (deal.stage === 'won' || deal.stage === 'lost') {
      targetProb = STAGE_CONFIG[targetStage].defaultProb;
    }

    try {
      await updateMutation.mutateAsync({
        id: deal.id,
        updates: {
          stage: targetStage,
          probability: targetProb,
        },
      });

      if (targetStage === 'won') {
        toast.success(`🎉 Closed Won! "${deal.name}" moved to revenue.`);
      } else if (targetStage === 'lost') {
        toast.info(`"${deal.name}" moved to Closed Lost.`);
      } else {
        toast.success(`"${deal.name}" progressed to ${STAGE_CONFIG[targetStage].label}.`);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to update deal stage';
      toast.error(msg);
    }
  };

  const onDragStart = (e: React.DragEvent, dealId: string) => {
    e.dataTransfer.setData('text/plain', dealId);
    setDraggedDealId(dealId);
  };

  const onDragOver = (e: React.DragEvent, stage: DealStage) => {
    e.preventDefault();
    if (dragOverStage !== stage) {
      setDragOverStage(stage);
    }
  };

  const onDragLeave = () => {
    setDragOverStage(null);
  };

  const onDrop = async (e: React.DragEvent, targetStage: DealStage) => {
    e.preventDefault();
    setDragOverStage(null);
    const dealId = e.dataTransfer.getData('text/plain') || draggedDealId;
    setDraggedDealId(null);

    if (!dealId) return;
    const deal = deals.find((d) => d.id === dealId);
    if (!deal) return;

    await handleMoveStage(deal, targetStage);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 overflow-x-auto pb-4">
      {STAGES.map((stage) => {
        const config = STAGE_CONFIG[stage];
        const stageDeals = deals.filter((d) => d.stage === stage);
        const stageTotal = stageDeals.reduce((sum, d) => sum + (Number(d.amount) || 0), 0);
        const isTarget = dragOverStage === stage;

        return (
          <div
            key={stage}
            onDragOver={(e) => onDragOver(e, stage)}
            onDragLeave={onDragLeave}
            onDrop={(e) => onDrop(e, stage)}
            className={cn(
              'flex flex-col rounded-xl border bg-[var(--surface-raised)]/40 p-3 min-w-[240px] transition-all duration-200',
              isTarget
                ? 'border-[var(--mint)] bg-[var(--mint)]/5 ring-1 ring-[var(--mint)]'
                : 'border-[var(--border)]',
            )}
          >
            {/* Column Header */}
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-[var(--border)]">
              <div className="flex items-center gap-2">
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: config.color }}
                />
                <span className="font-heading font-semibold text-xs text-[var(--text)]">
                  {config.label}
                </span>
                <span className="text-[11px] font-mono text-[var(--text-muted)] bg-[var(--surface-muted)] px-1.5 py-0.2 rounded">
                  {stageDeals.length}
                </span>
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => onAddDeal(stage)}
                className="h-6 w-6 p-0 text-[var(--text-muted)] hover:text-[var(--text)]"
                title={`Add deal to ${config.label}`}
              >
                <Plus className="w-3.5 h-3.5" />
              </Button>
            </div>

            {/* Column Total Volume */}
            <div className="text-[11px] font-mono font-medium text-[var(--text-muted)] mb-3">
              {formatCurrency(stageTotal)}
            </div>

            {/* Deal Cards Container */}
            <div className="space-y-2.5 flex-1 min-h-[140px]">
              {stageDeals.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center p-4 rounded-lg border border-dashed border-[var(--border)]/60 text-center">
                  <p className="text-[11px] text-[var(--text-muted)] italic">
                    Drop deals here
                  </p>
                </div>
              ) : (
                stageDeals.map((deal) => (
                  <Card
                    key={deal.id}
                    draggable
                    onDragStart={(e) => onDragStart(e, deal.id)}
                    className="p-3 bg-[var(--surface)] border-[var(--border)] hover:border-[var(--cyan)]/40 cursor-grab active:cursor-grabbing transition-all duration-200 shadow-xs space-y-2 group"
                  >
                    {/* Top Row: Name and Actions Menu */}
                    <div className="flex items-start justify-between gap-1">
                      <p className="font-semibold text-xs text-[var(--text)] line-clamp-2 leading-tight">
                        {deal.name}
                      </p>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0 text-[var(--text-muted)] hover:text-[var(--text)] shrink-0"
                            aria-label="Deal actions"
                          >
                            <MoreVertical className="w-3 h-3" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="text-xs">
                          <DropdownMenuItem
                            onClick={() => onEditDeal(deal)}
                            className="gap-2 cursor-pointer"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                            <span>Edit Deal</span>
                          </DropdownMenuItem>

                          <DropdownMenuSeparator />
                          <DropdownMenuLabel className="text-[10px] uppercase font-mono tracking-wider text-[var(--text-muted)]">
                            Move Stage (Accessible)
                          </DropdownMenuLabel>
                          {STAGES.map((s) => (
                            <DropdownMenuItem
                              key={s}
                              disabled={s === deal.stage}
                              onClick={() => handleMoveStage(deal, s)}
                              className="gap-2 cursor-pointer capitalize text-xs"
                            >
                              <ArrowRight className="w-3 h-3 text-[var(--cyan)]" />
                              <span>{STAGE_CONFIG[s].label}</span>
                            </DropdownMenuItem>
                          ))}

                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => onDeleteDeal(deal)}
                            className="gap-2 text-[var(--danger)] focus:text-[var(--danger)] cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Delete Deal</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    {/* Amount & Probability */}
                    <div className="flex items-center justify-between text-xs pt-1">
                      <span className="font-mono font-bold text-[var(--text)]">
                        {formatCurrency(Number(deal.amount) || 0)}
                      </span>
                      <Badge
                        variant="outline"
                        className={cn(
                          'text-[10px] font-mono px-1.5 py-0',
                          deal.stage === 'won'
                            ? 'bg-[var(--mint)]/10 text-[var(--mint)] border-[var(--mint)]/30'
                            : deal.stage === 'lost'
                              ? 'bg-[var(--danger)]/10 text-[var(--danger)] border-[var(--danger)]/30'
                              : 'bg-[var(--surface-raised)] text-[var(--text-muted)] border-[var(--border)]',
                        )}
                      >
                        {deal.probability}%
                      </Badge>
                    </div>

                    {/* Close Date */}
                    {deal.expected_close && (
                      <div className="text-[10px] text-[var(--text-muted)] flex items-center gap-1 pt-1 border-t border-[var(--border)]/40">
                        <Calendar className="w-2.5 h-2.5 text-[var(--cyan)]" />
                        <span>Close: {formatRelativeDate(deal.expected_close)}</span>
                      </div>
                    )}
                  </Card>
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
