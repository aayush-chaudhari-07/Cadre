import React from 'react';
import { Marquee } from '@/components/motion/marquee';
import { Cpu, Database, Atom, Globe, Code2, ShieldCheck, Zap } from 'lucide-react';

interface TechItem {
  name: string;
  category: string;
  icon: React.ComponentType<{ className?: string }>;
}

const TECHNOLOGIES: TechItem[] = [
  { name: 'Google Gemini', category: 'Reasoning Engine', icon: Cpu },
  { name: 'Supabase PostgreSQL', category: 'Row Level Security', icon: Database },
  { name: 'React 19', category: 'Interface Core', icon: Atom },
  { name: 'Cloudflare Pages', category: 'Edge CDN', icon: Globe },
  { name: 'TypeScript Strict', category: 'Type Safety', icon: Code2 },
  { name: 'TanStack Router', category: 'SPA Client Routing', icon: Zap },
  { name: 'TanStack Query', category: 'Data Fetching Cache', icon: ShieldCheck },
];

export function BuiltWith() {
  return (
    <section className="py-14 border-y border-[var(--border)] bg-[var(--surface-1)]/40 overflow-hidden select-none">
      <div className="max-w-7xl mx-auto px-4 text-center mb-6">
        <p className="text-xs uppercase tracking-widest font-mono font-medium text-[var(--text-muted)]">
          Built on a modern, transparent tech stack • No proprietary vendor lock-in
        </p>
      </div>

      <Marquee speed={32} pauseOnHover={true}>
        {TECHNOLOGIES.map((tech) => {
          const Icon = tech.icon;
          return (
            <div
              key={tech.name}
              className="flex items-center gap-3 px-5 py-2.5 rounded-xl bg-[var(--surface-2)]/60 border border-[var(--border)]/70 hover:border-[var(--primary)]/40 transition-colors shadow-sm"
            >
              <div className="w-8 h-8 rounded-lg bg-[var(--surface-1)] flex items-center justify-center text-[var(--primary)] shrink-0">
                <Icon className="w-4 h-4" />
              </div>
              <div className="text-left">
                <span className="font-heading font-semibold text-xs text-[var(--text)] block">
                  {tech.name}
                </span>
                <span className="text-[10px] text-[var(--text-muted)] font-mono block">
                  {tech.category}
                </span>
              </div>
            </div>
          );
        })}
      </Marquee>
    </section>
  );
}
