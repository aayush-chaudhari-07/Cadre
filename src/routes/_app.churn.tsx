import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PageHeader, SectionCard, StatCard, Surface } from "@/components/flow/primitives";
import {
  AlertTriangle,
  ShieldCheck,
  TrendingDown,
  Users,
  ArrowUpRight,
  MessageSquareWarning,
  Flame,
  Bell,
  Filter,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  PieChart,
  Pie,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export const Route = createFileRoute("/_app/churn")({
  head: () => ({ meta: [{ title: "AI Churn Detection — FlowMind AI" }] }),
  component: Churn,
});

type Risk = "Low" | "Medium" | "High" | "Critical";

const accounts: {
  name: string;
  industry: string;
  arr: string;
  risk: number;
  level: Risk;
  quote: string;
  signals: string[];
  play: string;
  owner: string;
  renewal: string;
}[] = [
  {
    name: "Acme Corp",
    industry: "Manufacturing · 480 seats",
    arr: "₹48L",
    risk: 92,
    level: "Critical",
    quote: "Not satisfied — support response times are killing us.",
    signals: ["Usage −62%", "Champion left", "No exec touch · 45d"],
    play: "Schedule exec briefing this week",
    owner: "Priya M.",
    renewal: "in 18 days",
  },
  {
    name: "Initech",
    industry: "Fintech · 210 seats",
    arr: "₹32L",
    risk: 84,
    level: "Critical",
    quote: "Too expensive vs. what we're getting today.",
    signals: ["Tickets +3×", "NPS dropped to 4", "Pricing objection"],
    play: "Send ROI report + multi-year offer",
    owner: "Karan S.",
    renewal: "in 32 days",
  },
  {
    name: "Globex Logistics",
    industry: "Logistics · 95 seats",
    arr: "₹19L",
    risk: 71,
    level: "High",
    quote: "Maybe later — we're pausing new tooling spend.",
    signals: ["Renewal in 30d", "Login frequency −41%"],
    play: "Offer phased rollout + success plan",
    owner: "Ananya R.",
    renewal: "in 28 days",
  },
  {
    name: "Soylent Foods",
    industry: "CPG · 64 seats",
    arr: "₹24L",
    risk: 64,
    level: "High",
    quote: "Feature gap on bulk exports is blocking the team.",
    signals: ["Feature gap raised", "Beta opt-out"],
    play: "Loop in product · share roadmap",
    owner: "Rahul V.",
    renewal: "in 47 days",
  },
  {
    name: "Northwind Trading",
    industry: "Retail · 140 seats",
    arr: "₹14L",
    risk: 48,
    level: "Medium",
    quote: "Maybe later, revisit after Diwali planning cycle.",
    signals: ["Stakeholder rotated", "Engagement flat"],
    play: "Re-baseline goals with new champion",
    owner: "Meera D.",
    renewal: "in 61 days",
  },
  {
    name: "Stark Industries",
    industry: "Hardware · 320 seats",
    arr: "₹38L",
    risk: 28,
    level: "Low",
    quote: "Things are good — exploring AI add-on.",
    signals: ["Healthy usage", "Expansion signal"],
    play: "Pitch AI Agents add-on",
    owner: "Arjun T.",
    renewal: "in 84 days",
  },
];

const riskTrend = ["W1", "W2", "W3", "W4", "W5", "W6", "W7", "W8"].map((w, i) => ({
  week: w,
  critical: Math.max(1, 6 + Math.round(Math.sin(i) * 2)),
  high: 9 + Math.round(Math.cos(i / 2) * 3),
  medium: 14 + Math.round(Math.sin(i / 3) * 4),
  low: 28 + Math.round(Math.cos(i / 4) * 3),
}));

const riskMix = [
  { name: "Critical", value: 7, color: "#EF4444" },
  { name: "High", value: 12, color: "#F59E0B" },
  { name: "Medium", value: 21, color: "#6366F1" },
  { name: "Low", value: 34, color: "#10B981" },
];

const levelStyles: Record<Risk, { badge: string; dot: string; ring: string }> = {
  Critical: {
    badge: "bg-rose-50 text-rose-700 ring-rose-200",
    dot: "bg-rose-500",
    ring: "from-rose-500 to-fuchsia-500",
  },
  High: {
    badge: "bg-amber-50 text-amber-700 ring-amber-200",
    dot: "bg-amber-500",
    ring: "from-amber-500 to-rose-500",
  },
  Medium: {
    badge: "bg-indigo-50 text-indigo-700 ring-indigo-200",
    dot: "bg-indigo-500",
    ring: "from-indigo-500 to-violet-500",
  },
  Low: {
    badge: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    dot: "bg-emerald-500",
    ring: "from-emerald-500 to-cyan-500",
  },
};

const filters: (Risk | "All")[] = ["All", "Critical", "High", "Medium", "Low"];

function Churn() {
  const [active, setActive] = useState<Risk | "All">("All");

  const filtered = useMemo(
    () => (active === "All" ? accounts : accounts.filter((a) => a.level === active)),
    [active],
  );

  return (
    <>
      <PageHeader
        eyebrow="AI Churn Detection"
        title="Save revenue before it leaves."
        description="Retention Agent monitors 47 product, sentiment & relationship signals across every account, 24/7."
        actions={
          <button className="inline-flex items-center gap-2 rounded-xl bg-gradient-primary px-4 py-2.5 text-[13px] font-semibold text-white shadow-glow transition hover:-translate-y-0.5">
            <Bell className="size-4" /> Configure alerts
          </button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="At-risk ARR" value="₹1.82Cr" delta={{ value: "−6.1%", trend: "down" }} icon={<AlertTriangle className="size-5" />} tone="violet" index={0} />
        <StatCard label="Saves this Q" value="₹94L" delta={{ value: "+22%", trend: "up" }} icon={<ShieldCheck className="size-5" />} tone="success" index={1} />
        <StatCard label="Net retention" value="118%" delta={{ value: "+3.1%", trend: "up" }} icon={<Users className="size-5" />} tone="primary" index={2} />
        <StatCard label="Churn rate" value="1.8%" delta={{ value: "−0.4%", trend: "down" }} icon={<TrendingDown className="size-5" />} tone="cyan" index={3} />
      </div>

      {/* Alert center */}
      <SectionCard
        title="Alert center"
        description="Customers flagged by sentiment, usage and renewal signals."
        actions={
          <div className="flex items-center gap-1.5 rounded-xl border border-border bg-surface/60 p-1">
            <Filter className="ml-1.5 size-3.5 text-muted-foreground" aria-hidden="true" />
            {filters.map((f) => {
              const isActive = active === f;
              return (
                <button
                  key={f}
                  onClick={() => setActive(f)}
                  className={`rounded-lg px-2.5 py-1 text-[11.5px] font-semibold transition ${
                    isActive
                      ? "bg-gradient-primary text-white shadow-glow"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {f}
                  {f !== "All" && (
                    <span className={`ml-1.5 inline-block size-1.5 rounded-full align-middle ${levelStyles[f].dot}`} />
                  )}
                </button>
              );
            })}
          </div>
        }
      >
        <div className="grid gap-3">
          <AnimatePresence mode="popLayout">
            {filtered.map((a, i) => {
              const s = levelStyles[a.level];
              return (
                <motion.div
                  key={a.name}
                  layout
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.25, delay: i * 0.03 }}
                >
                  <Surface hover className="overflow-hidden p-4">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                      <div className="flex items-start gap-4">
                        <div className="relative grid size-14 shrink-0 place-items-center">
                          <svg viewBox="0 0 36 36" className="size-14 -rotate-90">
                            <circle cx="18" cy="18" r="15" fill="none" stroke="#EEF2FF" strokeWidth="3" />
                            <circle
                              cx="18"
                              cy="18"
                              r="15"
                              fill="none"
                              stroke={`url(#g-${a.name.replace(/\s+/g, "")})`}
                              strokeWidth="3"
                              strokeLinecap="round"
                              strokeDasharray={`${(a.risk / 100) * 94} 94`}
                            />
                            <defs>
                              <linearGradient id={`g-${a.name.replace(/\s+/g, "")}`} x1="0" y1="0" x2="1" y2="1">
                                <stop offset="0%" stopColor="#8B5CF6" />
                                <stop offset="100%" stopColor="#EF4444" />
                              </linearGradient>
                            </defs>
                          </svg>
                          <span className="absolute font-display text-[12px] font-semibold">{a.risk}%</span>
                        </div>
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="font-display text-[15px] font-semibold text-foreground">{a.name}</p>
                            <span
                              className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10.5px] font-semibold ring-1 ring-inset ${s.badge}`}
                            >
                              <span className={`size-1.5 rounded-full ${s.dot}`} /> {a.level}
                            </span>
                          </div>
                          <p className="mt-0.5 text-[12px] text-muted-foreground">
                            {a.industry} · ARR <span className="font-semibold text-foreground">{a.arr}</span> · Renewal {a.renewal}
                          </p>
                          <div className="mt-2 flex items-start gap-2 rounded-lg border border-border bg-surface/60 px-2.5 py-1.5">
                            <MessageSquareWarning className="mt-0.5 size-3.5 shrink-0 text-rose-500" aria-hidden="true" />
                            <p className="text-[12px] italic text-foreground/80">"{a.quote}"</p>
                          </div>
                          <div className="mt-2 flex flex-wrap gap-1.5">
                            {a.signals.map((sig) => (
                              <Badge key={sig} variant="secondary" className="bg-surface-2 text-[10.5px] text-accent-foreground">
                                {sig}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="flex shrink-0 flex-col items-stretch gap-2 md:items-end">
                        <div className="rounded-xl border border-border bg-surface/60 px-3 py-2 text-[12px] md:max-w-[240px]">
                          <p className="flex items-center gap-1.5 font-semibold text-foreground">
                            <Flame className="size-3.5 text-amber-500" aria-hidden="true" /> Recommended play
                          </p>
                          <p className="text-muted-foreground">{a.play}</p>
                          <p className="mt-1 text-[10.5px] text-muted-foreground">Owner · {a.owner}</p>
                        </div>
                        <button className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-gradient-primary px-4 py-2.5 text-[12.5px] font-semibold text-white shadow-glow transition hover:-translate-y-0.5">
                          Approve play <ArrowUpRight className="size-3.5" />
                        </button>
                      </div>
                    </div>
                  </Surface>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </SectionCard>

      {/* Analytics */}
      <div className="grid gap-5 xl:grid-cols-[1.6fr_1fr]">
        <SectionCard title="Risk trend" description="Account count by risk band over the last 8 weeks.">
          <div className="h-72">
            <ResponsiveContainer>
              <AreaChart data={riskTrend} margin={{ left: -10, right: 10, top: 10 }}>
                <defs>
                  {[
                    { id: "c-crit", color: "#EF4444" },
                    { id: "c-high", color: "#F59E0B" },
                    { id: "c-med", color: "#6366F1" },
                    { id: "c-low", color: "#10B981" },
                  ].map((g) => (
                    <linearGradient key={g.id} id={g.id} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={g.color} stopOpacity={0.35} />
                      <stop offset="100%" stopColor={g.color} stopOpacity={0} />
                    </linearGradient>
                  ))}
                </defs>
                <CartesianGrid stroke="#E2E8F0" strokeDasharray="3 6" vertical={false} />
                <XAxis dataKey="week" tickLine={false} axisLine={false} tick={{ fill: "#64748B", fontSize: 11 }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fill: "#64748B", fontSize: 11 }} />
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #E2E8F0", fontSize: 12 }} />
                <Area type="monotone" stackId="1" dataKey="low" stroke="#10B981" strokeWidth={2} fill="url(#c-low)" />
                <Area type="monotone" stackId="1" dataKey="medium" stroke="#6366F1" strokeWidth={2} fill="url(#c-med)" />
                <Area type="monotone" stackId="1" dataKey="high" stroke="#F59E0B" strokeWidth={2} fill="url(#c-high)" />
                <Area type="monotone" stackId="1" dataKey="critical" stroke="#EF4444" strokeWidth={2} fill="url(#c-crit)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>

        <SectionCard title="Portfolio risk mix" description="Distribution of 74 active accounts.">
          <div className="grid items-center gap-2 sm:grid-cols-[1fr_auto]">
            <div className="h-56">
              <ResponsiveContainer>
                <PieChart>
                  <Pie data={riskMix} dataKey="value" innerRadius={48} outerRadius={78} paddingAngle={3} stroke="none">
                    {riskMix.map((r) => (
                      <Cell key={r.name} fill={r.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #E2E8F0", fontSize: 12 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <ul className="space-y-2 pr-2 text-[12.5px]">
              {riskMix.map((r) => (
                <li key={r.name} className="flex items-center justify-between gap-6">
                  <span className="flex items-center gap-2">
                    <span className="size-2.5 rounded-full" style={{ background: r.color }} />
                    <span className="font-medium text-foreground">{r.name}</span>
                  </span>
                  <span className="font-semibold text-foreground">{r.value}</span>
                </li>
              ))}
            </ul>
          </div>
        </SectionCard>
      </div>
    </>
  );
}
