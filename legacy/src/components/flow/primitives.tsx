import { type ReactNode } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between"
    >
      <div className="space-y-2">
        {eyebrow && (
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface-2/60 px-3 py-1 text-xs font-medium text-accent-foreground">
            <span className="size-1.5 rounded-full bg-gradient-primary" />
            {eyebrow}
          </span>
        )}
        <h1 className="font-display text-3xl font-semibold tracking-tight text-foreground md:text-[2.25rem]">
          {title}
        </h1>
        {description && (
          <p className="max-w-2xl text-sm text-muted-foreground md:text-[15px]">
            {description}
          </p>
        )}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </motion.div>
  );
}

export function Surface({
  children,
  className,
  hover = false,
}: {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-border bg-card shadow-soft",
        hover && "transition-all duration-300 hover:-translate-y-0.5 hover:shadow-elegant",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function StatCard({
  label,
  value,
  delta,
  icon,
  tone = "primary",
  index = 0,
}: {
  label: string;
  value: string;
  delta?: { value: string; trend: "up" | "down" };
  icon: ReactNode;
  tone?: "primary" | "violet" | "cyan" | "success";
  index?: number;
}) {
  const toneBg: Record<string, string> = {
    primary: "bg-gradient-primary",
    violet: "bg-gradient-violet",
    cyan: "bg-gradient-cyan",
    success: "bg-[linear-gradient(135deg,#10b981,#06b6d4)]",
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05, ease: "easeOut" }}
    >
      <Surface hover className="relative overflow-hidden p-5">
        <div className="absolute -right-12 -top-12 size-32 rounded-full bg-gradient-mesh opacity-60 blur-2xl" />
        <div className="relative flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              {label}
            </p>
            <p className="font-display text-2xl font-semibold text-foreground">{value}</p>
            {delta && (
              <p
                className={cn(
                  "text-xs font-medium",
                  delta.trend === "up" ? "text-emerald-600" : "text-rose-600",
                )}
              >
                {delta.trend === "up" ? "▲" : "▼"} {delta.value} vs last week
              </p>
            )}
          </div>
          <div
            className={cn(
              "grid size-10 place-items-center rounded-xl text-white shadow-glow",
              toneBg[tone],
            )}
          >
            {icon}
          </div>
        </div>
      </Surface>
    </motion.div>
  );
}

export function SectionCard({
  title,
  description,
  actions,
  children,
  className,
}: {
  title?: string;
  description?: string;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <Surface className={cn("p-6", className)}>
      {(title || actions) && (
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            {title && (
              <h3 className="font-display text-base font-semibold text-foreground">{title}</h3>
            )}
            {description && (
              <p className="mt-1 text-sm text-muted-foreground">{description}</p>
            )}
          </div>
          {actions}
        </div>
      )}
      {children}
    </Surface>
  );
}

export function Skeleton({ className }: { className?: string }) {
  return (
    <div className={cn("relative overflow-hidden rounded-md bg-surface-2", className)}>
      <div className="absolute inset-0 animate-shimmer" />
    </div>
  );
}

export function FloatingOrbs() {
  return (
    <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <div className="absolute -left-24 top-10 size-72 rounded-full bg-[radial-gradient(circle,#6366F1_0%,transparent_70%)] opacity-20 animate-blob" />
      <div className="absolute right-0 top-1/3 size-80 rounded-full bg-[radial-gradient(circle,#8B5CF6_0%,transparent_70%)] opacity-15 animate-blob" style={{ animationDelay: "-6s" }} />
      <div className="absolute bottom-0 left-1/3 size-72 rounded-full bg-[radial-gradient(circle,#06B6D4_0%,transparent_70%)] opacity-15 animate-blob" style={{ animationDelay: "-12s" }} />
    </div>
  );
}
