import { Link, useRouterState } from "@tanstack/react-router";
import {
  Sparkles,
  Users,
  TrendingUp,
  AlertTriangle,
  Video,
  Target,
  Bot,
  LineChart,
  Crown,
  Settings as SettingsIcon,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const nav = [
  { to: "/", label: "AI Command Center", icon: Sparkles },
  { to: "/leads", label: "Lead Intelligence", icon: Users },
  { to: "/revenue", label: "Revenue Prediction", icon: TrendingUp },
  { to: "/churn", label: "Churn Detection", icon: AlertTriangle },
  { to: "/meetings", label: "Meeting Analyzer", icon: Video },
  { to: "/competitors", label: "Competitor Analyzer", icon: Target },
  { to: "/agents", label: "AI Agents", icon: Bot },
  { to: "/insights", label: "Business Insights", icon: LineChart },
  { to: "/ceo", label: "AI CEO", icon: Crown },
  { to: "/settings", label: "Settings", icon: SettingsIcon },
] as const;

export function AppSidebar() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <aside className="hidden h-screen w-[260px] shrink-0 flex-col border-r border-sidebar-border bg-sidebar lg:flex">
      <div className="flex h-16 items-center gap-2.5 px-5">
        <div className="grid size-9 place-items-center rounded-xl bg-gradient-primary shadow-glow">
          <Zap className="size-5 text-white" strokeWidth={2.5} />
        </div>
        <div className="flex flex-col leading-tight">
          <span className="font-display text-[15px] font-semibold tracking-tight text-foreground">
            FlowMind AI
          </span>
          <span className="text-[10.5px] font-medium uppercase tracking-wider text-muted-foreground">
            Growth Engine
          </span>
        </div>
      </div>

      <div className="px-3 pb-2 pt-1">
        <div className="rounded-xl border border-sidebar-border bg-gradient-soft p-3">
          <div className="flex items-center gap-2">
            <div className="relative size-2">
              <span className="absolute inset-0 animate-ping rounded-full bg-emerald-500/70" />
              <span className="absolute inset-0 rounded-full bg-emerald-500" />
            </div>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-foreground">
              All systems autonomous
            </span>
          </div>
          <p className="mt-1.5 text-[11px] leading-snug text-muted-foreground">
            12 AI agents running · $48.2K influenced this week
          </p>
        </div>
      </div>

      <nav className="flex-1 space-y-0.5 overflow-y-auto px-3 py-3">
        <p className="px-3 pb-2 pt-1 text-[10.5px] font-semibold uppercase tracking-wider text-muted-foreground">
          Workspace
        </p>
        {nav.map((item) => {
          const active =
            item.to === "/" ? pathname === "/" : pathname.startsWith(item.to);
          const Icon = item.icon;
          return (
            <Link
              key={item.to}
              to={item.to}
              className={cn(
                "group relative flex items-center gap-3 rounded-lg px-3 py-2 text-[13.5px] font-medium transition-all",
                active
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground",
              )}
            >
              {active && (
                <motion.span
                  layoutId="nav-active"
                  className="absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-r-full bg-gradient-primary"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
              <Icon
                className={cn(
                  "size-[17px] transition-colors",
                  active ? "text-primary" : "text-muted-foreground group-hover:text-primary",
                )}
                strokeWidth={2}
              />
              <span className="truncate">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-3">
        <div className="relative overflow-hidden rounded-xl bg-gradient-primary p-4 text-white shadow-glow">
          <div className="absolute -right-6 -top-6 size-20 rounded-full bg-white/15 blur-xl" />
          <p className="text-[11px] font-semibold uppercase tracking-wider text-white/80">
            Pro plan
          </p>
          <p className="mt-1 font-display text-sm font-semibold leading-tight">
            Unlock the AI CEO suite
          </p>
          <p className="mt-1 text-[11.5px] leading-snug text-white/80">
            Autonomous strategy, finance & ops agents.
          </p>
          <button className="mt-3 w-full rounded-lg bg-white/15 px-3 py-1.5 text-[12px] font-semibold text-white backdrop-blur transition hover:bg-white/25">
            Upgrade →
          </button>
        </div>
      </div>
    </aside>
  );
}
