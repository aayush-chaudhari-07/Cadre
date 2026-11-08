import React from 'react';
import { Moon, Sun, Laptop, Palette, Check } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { useTheme, type Theme } from '@/components/theme-provider';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface ThemeOption {
  key: Theme;
  label: string;
  desc: string;
  icon: React.ComponentType<{ className?: string }>;
  previewBg: string;
  previewBorder: string;
  previewText: string;
  previewAccents: string[];
}

const THEME_OPTIONS: ThemeOption[] = [
  {
    key: 'dark',
    label: 'Dark (Obsidian & Aurora)',
    desc: 'Default obsidian background with Mint and Cyan neon accents. Optimized for high focus.',
    icon: Moon,
    previewBg: 'bg-[#05060A]',
    previewBorder: 'border-[#1E293B]',
    previewText: 'text-[#F1F5F9]',
    previewAccents: ['#2DE2A6', '#22D3EE', '#F5B94A'],
  },
  {
    key: 'light',
    label: 'Light (Clean Paper)',
    desc: 'High-contrast, crisp white and light grey canvas with emerald accents.',
    icon: Sun,
    previewBg: 'bg-[#FFFFFF]',
    previewBorder: 'border-[#E2E8F0]',
    previewText: 'text-[#0F172A]',
    previewAccents: ['#059669', '#0284C7', '#D97706'],
  },
  {
    key: 'system',
    label: 'System Preference',
    desc: 'Automatically synchronizes appearance with your operating system settings.',
    icon: Laptop,
    previewBg: 'bg-gradient-to-r from-[#05060A] to-[#F8FAFC]',
    previewBorder: 'border-[#64748B]/40',
    previewText: 'text-[#94A3B8]',
    previewAccents: ['#2DE2A6', '#059669'],
  },
];

export function AppearanceTab() {
  const { theme, setTheme, resolvedTheme } = useTheme();

  const handleSelectTheme = (selected: Theme) => {
    setTheme(selected);
    toast.success(`Theme switched to ${selected}`);
  };

  return (
    <Card className="glass border-[var(--border)]">
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <Palette className="w-4 h-4 text-[var(--secondary)]" />
          <span>Interface Appearance</span>
        </CardTitle>
        <CardDescription>
          Customize theme preferences with instant live preview. Active mode: <strong className="capitalize">{theme}</strong> ({resolvedTheme} active).
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {THEME_OPTIONS.map((opt) => {
            const isSelected = theme === opt.key;
            const Icon = opt.icon;

            return (
              <button
                key={opt.key}
                type="button"
                onClick={() => handleSelectTheme(opt.key)}
                className={cn(
                  'p-4 rounded-2xl border text-left transition-all duration-200 flex flex-col justify-between gap-4 group relative overflow-hidden',
                  isSelected
                    ? 'border-[var(--primary)] bg-[var(--primary)]/5 shadow-md ring-1 ring-[var(--primary)]/30'
                    : 'border-[var(--border)] hover:border-[var(--border-strong)] bg-[var(--surface-sunken)] hover:bg-[var(--surface-hover)]',
                )}
              >
                {/* Visual Palette Preview Tile */}
                <div
                  className={cn(
                    'w-full h-24 rounded-xl border p-3 flex flex-col justify-between overflow-hidden shadow-inner',
                    opt.previewBg,
                    opt.previewBorder,
                  )}
                >
                  <div className="flex items-center justify-between">
                    <span className={cn('text-[11px] font-semibold', opt.previewText)}>
                      Cadre UI
                    </span>
                    <div className="flex items-center gap-1.5">
                      {opt.previewAccents.map((c, i) => (
                        <span
                          key={i}
                          className="w-2.5 h-2.5 rounded-full shadow-sm"
                          style={{ backgroundColor: c }}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="w-16 h-2 rounded bg-current opacity-20" />
                    <div className="w-24 h-1.5 rounded bg-current opacity-10" />
                  </div>
                </div>

                {/* Option Details */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-[var(--text)] flex items-center gap-1.5">
                      <Icon className="w-4 h-4 text-[var(--primary)]" />
                      {opt.label}
                    </span>
                    {isSelected && (
                      <span className="w-5 h-5 rounded-full bg-[var(--primary)] text-black flex items-center justify-center shrink-0">
                        <Check className="w-3 h-3 stroke-[2.5]" />
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                    {opt.desc}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

