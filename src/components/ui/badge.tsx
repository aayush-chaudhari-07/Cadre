import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors select-none",
  {
    variants: {
      variant: {
        default:
          "border border-[var(--primary)]/30 bg-[var(--primary)]/10 text-[var(--primary)]",
        secondary:
          "border border-[var(--secondary)]/30 bg-[var(--secondary)]/10 text-[var(--secondary)]",
        gold:
          "border border-[var(--gold)]/30 bg-[var(--gold)]/10 text-[var(--gold)]",
        outline:
          "border border-[var(--border)] text-[var(--text-2)] bg-[var(--surface-2)]",
        danger:
          "border border-[var(--danger)]/30 bg-[var(--danger)]/10 text-[var(--danger)]",
        warning:
          "border border-[var(--warning)]/30 bg-[var(--warning)]/10 text-[var(--warning)]",
        info:
          "border border-[var(--info)]/30 bg-[var(--info)]/10 text-[var(--info)]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}
