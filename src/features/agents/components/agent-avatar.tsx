import React from 'react';
import { Crown, Target, CalendarCheck, ShieldAlert, Compass, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface AgentAvatarProps {
  agentKey: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  glow?: boolean;
}

interface AgentVisualMeta {
  color: string;
  gradient: string;
  border: string;
  bgGlow: string;
  icon: React.ComponentType<{ className?: string }>;
  accentColor: string;
}

const AGENT_VISUALS: Record<string, AgentVisualMeta> = {
  ceo: {
    color: '#F5B94A',
    accentColor: 'text-[#F5B94A]',
    gradient: 'from-[#F5B94A]/25 to-[#F5B94A]/5',
    border: 'border-[#F5B94A]/40',
    bgGlow: 'rgba(245, 185, 74, 0.25)',
    icon: Crown,
  },
  sales: {
    color: '#2DE2A6',
    accentColor: 'text-[#2DE2A6]',
    gradient: 'from-[#2DE2A6]/25 to-[#2DE2A6]/5',
    border: 'border-[#2DE2A6]/40',
    bgGlow: 'rgba(45, 226, 166, 0.25)',
    icon: Target,
  },
  operations: {
    color: '#22D3EE',
    accentColor: 'text-[#22D3EE]',
    gradient: 'from-[#22D3EE]/25 to-[#22D3EE]/5',
    border: 'border-[#22D3EE]/40',
    bgGlow: 'rgba(34, 211, 238, 0.25)',
    icon: CalendarCheck,
  },
  support: {
    color: '#FB923C',
    accentColor: 'text-[#FB923C]',
    gradient: 'from-[#FB923C]/25 to-[#FB923C]/5',
    border: 'border-[#FB923C]/40',
    bgGlow: 'rgba(251, 146, 60, 0.25)',
    icon: ShieldAlert,
  },
  marketing: {
    color: '#A78BFA',
    accentColor: 'text-[#A78BFA]',
    gradient: 'from-[#A78BFA]/25 to-[#A78BFA]/5',
    border: 'border-[#A78BFA]/40',
    bgGlow: 'rgba(167, 139, 250, 0.25)',
    icon: Compass,
  },
  finance: {
    color: '#34D399',
    accentColor: 'text-[#34D399]',
    gradient: 'from-[#34D399]/25 to-[#34D399]/5',
    border: 'border-[#34D399]/40',
    bgGlow: 'rgba(52, 211, 153, 0.25)',
    icon: TrendingUp,
  },
};

const SIZE_MAP = {
  sm: {
    box: 'w-8 h-8',
    iconSize: 'w-4 h-4',
    nodes: 'w-1 h-1',
  },
  md: {
    box: 'w-11 h-11',
    iconSize: 'w-5 h-5',
    nodes: 'w-1.5 h-1.5',
  },
  lg: {
    box: 'w-14 h-14',
    iconSize: 'w-6 h-6',
    nodes: 'w-2 h-2',
  },
  xl: {
    box: 'w-16 h-16',
    iconSize: 'w-7 h-7',
    nodes: 'w-2.5 h-2.5',
  },
};

export function AgentAvatar({
  agentKey,
  size = 'md',
  className,
  glow = true,
}: AgentAvatarProps) {
  const defaultMeta = AGENT_VISUALS.ceo as AgentVisualMeta;
  const meta = AGENT_VISUALS[agentKey.toLowerCase()] ?? defaultMeta;
  const sizeConfig = SIZE_MAP[size];
  const Icon = meta.icon;

  return (
    <div
      className={cn(
        'relative flex items-center justify-center rounded-2xl border transition-all duration-300 select-none group',
        sizeConfig.box,
        meta.border,
        className,
      )}
      style={{
        background: `linear-gradient(135deg, ${meta.color}15 0%, rgba(15, 23, 42, 0.6) 100%)`,
        boxShadow: glow ? `0 0 16px -2px ${meta.bgGlow}` : undefined,
      }}
      aria-hidden="true"
    >
      {/* Subtle orbital node decoration in corner */}
      <div
        className={cn(
          'absolute -top-1 -right-1 rounded-full shadow-sm animate-pulse',
          sizeConfig.nodes,
        )}
        style={{ backgroundColor: meta.color }}
      />
      <div
        className={cn(
          'absolute -bottom-1 -left-1 rounded-full opacity-60',
          sizeConfig.nodes,
        )}
        style={{ backgroundColor: meta.color }}
      />

      {/* Centered agent icon */}
      <Icon className={cn(sizeConfig.iconSize, meta.accentColor, 'transition-transform duration-200 group-hover:scale-110')} />
    </div>
  );
}
