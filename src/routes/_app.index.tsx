import { createFileRoute } from "@tanstack/react-router";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useEffect, useState } from "react";
import {
  Sparkles,
  TrendingUp,
  Users,
  DollarSign,
  Bot,
  ArrowUpRight,
  Activity,
  Zap,
  Heart,
  ShieldCheck,
  Megaphone,
  HeadphonesIcon,
  LineChart as LineIcon,
  Briefcase,
  CheckCircle2,
  Cpu,
} from "lucide-react";
import {
  AreaChart,
  Area,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
  LineChart,
  Line,
  RadialBarChart,
  RadialBar,
  PolarAngleAxis,
} from "recharts";
import { PageHeader, SectionCard, Surface } from "@/components/flow/primitives";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_app/")({
  head: () => ({
    meta: [
      { title: "AI Command Center — FlowMind AI" },
      { name: "description", content: "Monitor every AI employee, business metric, and growth opportunity from one intelligent dashboard." },
    ],
  }),
  component: CommandCenter,
});

// ===== Mock data =====
const revenueTrend = [
  { month: "Jan", revenue: 142, forecast: 138 },
  { month: "Feb", revenue: 168, forecast: 160 },
  { month: "Mar", revenue: 192, forecast: 184 },
  { month: "Apr", revenue: 224, forecast: 210 },
  { month: "May", revenue: 261, forecast: 246 },
  { month: "Jun", revenue: 298, forecast: 280 },
  { month: "Jul", revenue: 342, forecast: 318 },
  { month: "Aug", revenue: 388, forecast: 360 },
  { month: "Sep", revenue: 431, forecast: 402 },
  { month: "Oct", revenue: 478, forecast: 444 },
  { month: "Nov", revenue: 524, forecast: 488 },
  { month: "Dec", revenue: 612, forecast: 540 },
];

const leadFunnel = [
  { stage: "Visitors", value: 24820, pct: 100 },
  { stage: "Leads", value: 8410, pct: 34 },
  { stage: "Qualified", value: 3128, pct: 13 },
  { stage: "Demos", value: 1284, pct: 5.2 },
  { stage: "Customers", value: 412, pct: 1.7 },
];

const retentionData = [
  { week: "W1", cohort: 100, current: 100 },
  { week: "W2", cohort: 92, current: 96 },
  { week: "W3", cohort: 84, current: 91 },
  { week: "W4", cohort: 78, current: 88 },
  { week: "W5", cohort: 71, current: 85 },
  { week: "W6", cohort: 66, current: 83 },
  { week: "W7", cohort: 62, current: 81 },
  { week: "W8", cohort: 58, current: 80 },
];

const conversionData = [
  { channel: "Organic", rate: 6.8, volume: 4210 },
  { channel: "Outbound", rate: 11.2, volume: 2840 },
  { channel: "Paid", rate: 4.4, volume: 6120 },
  { channel: "Referral", rate: 18.6, volume: 1240 },
  { channel: "Content", rate: 8.1, volume: 3380 },
  { channel: "Partner", rate: 14.2, volume: 980 },
];

const healthScore = [{ name: "score", value: 92, fill: "url(#health-grad)" }];

const activityFeed = [
  { icon: Briefcase, agent: "Sales Agent", text: "Qualified 12 new leads from enterprise outbound sequence", time: "2m ago", tone: "primary" as const },
  { icon: HeadphonesIcon, agent: "Support Agent", text: "Resolved 38 tickets — average response time 47 seconds", time: "6m ago", tone: "cyan" as const },
  { icon: Megaphone, agent: "Marketing Agent", text: "Launched 'Q4 Velocity' campaign across LinkedIn & email", time: "14m ago", tone: "violet" as const },
  { icon: LineIcon, agent: "Analytics Agent", text: "Detected $42K expansion opportunity in mid-market cohort", time: "22m ago", tone: "success" as const },
  { icon: ShieldCheck, agent: "Retention Agent", text: "Saved Acme Corp from churn with executive briefing flow", time: "38m ago", tone: "violet" as const },
  { icon: Bot, agent: "Closer Agent", text: "Auto-booked 7 product demos for next week", time: "1h ago", tone: "primary" as const },
  { icon: Cpu, agent: "Researcher Agent", text: "Enriched 284 new accounts with firmographic & intent data", time: "1h ago", tone: "cyan" as const },
];

const toneToBg: Record<string, string> = {
  primary: "bg-gradient-primary",
  violet: "bg-gradient-violet",
  cyan: "bg-gradient-cyan",
  success: "bg-[linear-gradient(135deg,#10b981,#06b6d4)]",
};

// ===== Animated number =====
function AnimatedNumber({
  value,
  prefix = "",
  suffix = "",
  decimals = 0,
}: {
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
}) {
  const mv = useMotionValue(0);
  const spring = useSpring(mv, { stiffness: 60, damping: 18 });
  const display = useTransform(spring, (latest) =>
    `${prefix}${latest.toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}${suffix}`,
  );
  useEffect(() => {
    mv.set(value);
  }, [value, mv]);
  return <motion.span>{display}</motion.span>;
}

type Kpi = {
  label: string;
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  delta: string;
  trend: "up" | "down";
  icon: typeof DollarSign;
  tone: keyof typeof toneToBg;
  spark: number[];
};

const initialKpis: Kpi[] = [
  { label: "Revenue Growth", value: 28, suffix: "%", delta: "+4.2% WoW", trend: "up", icon: TrendingUp, tone: "primary", spark: [12, 14, 13, 18, 20, 24, 26, 28] },
  { label: "Lead Conversion", value: 19, suffix: "%", delta: "+2.1% WoW", trend: "up", icon: Users, tone: "violet", spark: [11, 13, 12, 15, 16, 17, 18, 19] },
  { label: "Customer Satisfaction", value: 96, suffix: "%", delta: "+1.4% WoW", trend: "up", icon: Heart, tone: "cyan", spark: [88, 89, 91, 92, 93, 94, 95, 96] },
  { label: "Automation Savings", value: 2.4, prefix: "₹", suffix: "L", decimals: 1, delta: "+0.3L WoW", trend: "up", icon: Zap, tone: "success", spark: [1.1, 1.3, 1.5, 1.7, 1.9, 2.0, 2.2, 2.4] },
];

function CommandCenter() {
  const [kpis, setKpis] = useState(initialKpis);
  const [pulse, setPulse] = useState(0);

  // Live updates — subtly jitter KPI values so the dashboard feels alive.
  useEffect(() => {
    const id = setInterval(() => {
      setKpis((prev) =>
        prev.map((k) => {
          const jitter = (Math.random() - 0.5) * (k.decimals ? 0.08 : 0.6);
          const next = Math.max(0, +(k.value + jitter).toFixed(k.decimals ?? 0));
          return { ...k, value: next };
        }),
      );
      setPulse((p) => p + 1);
    }, 3200);
    return () => clearInterval(id);
  }, []);

  return (
    <>
      <PageHeader
        eyebrow="AI Command Center"
        title="Your AI Workforce Is Working"
        description="Monitor every AI employee, business metric, and growth opportunity from one intelligent dashboard."
        actions={
          <>
            <button className="inline-flex h-10 items-center gap-2 rounded-xl border border-border bg-card px-4 text-[13px] font-semibold text-foreground transition hover:bg-surface">
              <Activity className="size-4" /> Live activity
            </button>
            <button className="inline-flex h-10 items-center gap-2 rounded-xl bg-gradient-primary px-4 text-[13px] font-semibold text-white shadow-glow transition hover:opacity-95">
              <Sparkles className="size-4" /> Ask AI CEO
            </button>
          </>
        }
      />

      {/* Hero: live status + business health */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative overflow-hidden rounded-3xl border border-border bg-card p-6 shadow-soft md:p-8"
      >
        <div className="absolute inset-0 -z-10 bg-gradient-mesh opacity-80" />
        <div className="grid gap-8 md:grid-cols-[1.5fr_1fr] md:items-center">
          <div className="space-y-5">
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-background/70 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-accent-foreground backdrop-blur">
              <span className="relative grid size-2 place-items-center">
                <span className="absolute inset-0 animate-ping rounded-full bg-emerald-500/70" />
                <span className="absolute inset-0 rounded-full bg-emerald-500" />
              </span>
              12 agents online · autonomous mode
            </div>
            <h2 className="font-display text-xl font-semibold tracking-tight text-foreground sm:text-2xl md:text-[30px] md:leading-[1.15]">
              Right now, FlowMind is closing deals, resolving tickets, and shipping growth experiments —{" "}
              <span className="text-gradient">all without you lifting a finger.</span>
            </h2>

            {/* Floating live agent chips */}
            <div className="flex flex-wrap gap-2 pt-1">
              {[
                { name: "Sales", status: "Closing" },
                { name: "Support", status: "Replying" },
                { name: "Marketing", status: "Publishing" },
                { name: "Analytics", status: "Forecasting" },
                { name: "Retention", status: "Reaching out" },
              ].map((a, i) => (
                <motion.div
                  key={a.name}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.05 }}
                  className="group inline-flex items-center gap-2 rounded-full border border-border bg-background/70 px-3 py-1.5 text-[11.5px] font-medium text-foreground backdrop-blur transition hover:border-border-strong hover:bg-background"
                >
                  <span className="relative grid size-2 place-items-center">
                    <span className="absolute inset-0 animate-ping rounded-full bg-emerald-400/70" />
                    <span className="absolute inset-0 rounded-full bg-emerald-500" />
                  </span>
                  <span className="font-semibold">{a.name} Agent</span>
                  <span className="text-muted-foreground">· {a.status}</span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Business Health Score */}
          <Surface className="relative overflow-hidden p-5">
            <div className="absolute -right-10 -top-10 size-32 rounded-full bg-gradient-primary opacity-20 blur-2xl" />
            <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Business Health Score
            </p>
            <div className="relative mt-2 grid place-items-center">
              <div className="h-44 w-full">
                <ResponsiveContainer>
                  <RadialBarChart innerRadius="72%" outerRadius="100%" data={healthScore} startAngle={210} endAngle={-30}>
                    <defs>
                      <linearGradient id="health-grad" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="#06B6D4" />
                        <stop offset="50%" stopColor="#6366F1" />
                        <stop offset="100%" stopColor="#8B5CF6" />
                      </linearGradient>
                    </defs>
                    <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
                    <RadialBar dataKey="value" cornerRadius={12} background={{ fill: "rgba(99,102,241,0.08)" }} />
                  </RadialBarChart>
                </ResponsiveContainer>
              </div>
              <div className="pointer-events-none absolute inset-0 grid place-items-center">
                <div className="text-center">
                  <p className="font-display text-4xl font-semibold text-foreground">
                    <AnimatedNumber value={92} />
                  </p>
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-emerald-600">Excellent</p>
                </div>
              </div>
            </div>
            <div className="mt-3 grid grid-cols-3 gap-2 text-center">
              {[
                { l: "Revenue", v: "A+" },
                { l: "Pipeline", v: "A" },
                { l: "Retention", v: "A−" },
              ].map((s) => (
                <div key={s.l} className="rounded-lg bg-surface-2/70 px-2 py-1.5">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{s.l}</p>
                  <p className="font-display text-sm font-semibold text-foreground">{s.v}</p>
                </div>
              ))}
            </div>
          </Surface>
        </div>
      </motion.div>

      {/* Animated KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {kpis.map((k, i) => (
          <motion.div
            key={k.label}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.06, ease: "easeOut" }}
          >
            <Surface hover className="group relative overflow-hidden p-5">
              <div className="absolute -right-12 -top-12 size-32 rounded-full bg-gradient-mesh opacity-60 blur-2xl" />
              <div className="relative flex items-start justify-between">
                <div className="space-y-1">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                    {k.label}
                  </p>
                  <p className="font-display text-[28px] font-semibold leading-none text-foreground">
                    <AnimatedNumber
                      value={k.value}
                      prefix={k.prefix}
                      suffix={k.suffix}
                      decimals={k.decimals ?? 0}
                    />
                  </p>
                  <p className="text-[11.5px] font-medium text-emerald-600">
                    ▲ {k.delta}
                  </p>
                </div>
                <div className={cn("grid size-10 place-items-center rounded-xl text-white shadow-glow", toneToBg[k.tone])}>
                  <k.icon className="size-5" />
                </div>
              </div>

              {/* Sparkline */}
              <div className="relative mt-4 h-12 w-full">
                <ResponsiveContainer>
                  <LineChart data={k.spark.map((v, idx) => ({ i: idx, v }))} margin={{ top: 2, right: 2, left: 2, bottom: 2 }}>
                    <defs>
                      <linearGradient id={`spark-${i}`} x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#06B6D4" />
                        <stop offset="100%" stopColor="#8B5CF6" />
                      </linearGradient>
                    </defs>
                    <Line type="monotone" dataKey="v" stroke={`url(#spark-${i})`} strokeWidth={2.2} dot={false} isAnimationActive />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Live pulse */}
              <div className="mt-1 flex items-center gap-1.5 text-[10.5px] font-medium text-muted-foreground">
                <span key={pulse} className="relative grid size-1.5 place-items-center">
                  <span className="absolute inset-0 animate-ping rounded-full bg-emerald-500/70" />
                  <span className="absolute inset-0 rounded-full bg-emerald-500" />
                </span>
                Updating live
              </div>
            </Surface>
          </motion.div>
        ))}
      </div>

      {/* Revenue Trend (wide) + Lead Funnel */}
      <div className="grid gap-5 lg:grid-cols-3">
        <SectionCard
          title="Revenue Trend"
          description="12-month actuals vs AI-forecast model."
          className="lg:col-span-2"
          actions={
            <div className="flex items-center gap-1 rounded-lg border border-border bg-background p-1 text-[11.5px]">
              {["3M", "6M", "12M", "YTD"].map((t, i) => (
                <button
                  key={t}
                  className={cn(
                    "rounded-md px-2 py-1 font-medium",
                    i === 2 ? "bg-gradient-primary text-white shadow-glow" : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {t}
                </button>
              ))}
            </div>
          }
        >
          <div className="h-72 w-full">
            <ResponsiveContainer>
              <AreaChart data={revenueTrend} margin={{ top: 10, right: 10, left: -12, bottom: 0 }}>
                <defs>
                  <linearGradient id="rev-grad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#6366F1" stopOpacity={0.5} />
                    <stop offset="100%" stopColor="#6366F1" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="fc-grad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#8B5CF6" stopOpacity={0.25} />
                    <stop offset="100%" stopColor="#8B5CF6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#E2E8F0" strokeDasharray="3 6" vertical={false} />
                <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fill: "#64748B", fontSize: 11 }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fill: "#64748B", fontSize: 11 }} tickFormatter={(v) => `₹${v}K`} />
                <Tooltip
                  contentStyle={{
                    borderRadius: 12,
                    border: "1px solid #E2E8F0",
                    boxShadow: "0 10px 40px -10px rgba(79,70,229,0.2)",
                    fontSize: 12,
                  }}
                  formatter={(v: number) => `₹${v}K`}
                />
                <Area type="monotone" dataKey="forecast" stroke="#8B5CF6" strokeWidth={2} strokeDasharray="4 4" fill="url(#fc-grad)" />
                <Area type="monotone" dataKey="revenue" stroke="#4F46E5" strokeWidth={2.5} fill="url(#rev-grad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>

        <SectionCard title="Lead Funnel" description="Top-of-funnel through closed-won.">
          <div className="space-y-3">
            {leadFunnel.map((row, i) => (
              <motion.div
                key={row.stage}
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.05 * i }}
                className="space-y-1.5"
              >
                <div className="flex items-center justify-between text-[12.5px]">
                  <span className="font-medium text-foreground">{row.stage}</span>
                  <span className="tabular-nums text-muted-foreground">
                    {row.value.toLocaleString()} <span className="text-[11px] text-muted-foreground/70">· {row.pct}%</span>
                  </span>
                </div>
                <div className="relative h-2.5 w-full overflow-hidden rounded-full bg-surface-2">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${row.pct}%` }}
                    transition={{ duration: 0.9, delay: 0.1 + i * 0.08, ease: "easeOut" }}
                    className="h-full rounded-full bg-linear-to-r from-cyan-400 via-indigo-500 to-violet-500 shadow-glow"
                  />
                </div>
              </motion.div>
            ))}
            <div className="mt-2 rounded-xl border border-dashed border-border bg-surface/50 p-3 text-[12px] text-muted-foreground">
              <span className="font-semibold text-foreground">AI insight:</span> Demos → Customers converts 32% — 2.4× the industry benchmark.
            </div>
          </div>
        </SectionCard>
      </div>

      {/* Customer Retention + Conversion Analytics */}
      <div className="grid gap-5 lg:grid-cols-2">
        <SectionCard
          title="Customer Retention"
          description="Weekly cohort retention — original vs current."
          actions={<Badge variant="secondary" className="bg-emerald-500/10 text-emerald-700">+18% YoY</Badge>}
        >
          <div className="h-64 w-full">
            <ResponsiveContainer>
              <LineChart data={retentionData} margin={{ top: 10, right: 10, left: -16, bottom: 0 }}>
                <CartesianGrid stroke="#E2E8F0" strokeDasharray="3 6" vertical={false} />
                <XAxis dataKey="week" tickLine={false} axisLine={false} tick={{ fill: "#64748B", fontSize: 11 }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fill: "#64748B", fontSize: 11 }} tickFormatter={(v) => `${v}%`} />
                <Tooltip
                  contentStyle={{ borderRadius: 12, border: "1px solid #E2E8F0", fontSize: 12 }}
                  formatter={(v: number) => `${v}%`}
                />
                <Line type="monotone" dataKey="cohort" stroke="#94A3B8" strokeWidth={2} strokeDasharray="4 4" dot={false} name="Q1 cohort" />
                <Line type="monotone" dataKey="current" stroke="#6366F1" strokeWidth={2.5} dot={{ r: 3, fill: "#6366F1" }} name="Current cohort" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>

        <SectionCard
          title="Conversion Analytics"
          description="Channel performance — conversion rate × volume."
          actions={<Badge variant="secondary" className="whitespace-nowrap bg-violet-500/10 text-violet-700">Top: Referral</Badge>}
        >
          <div className="h-64 w-full">
            <ResponsiveContainer>
              <BarChart data={conversionData} margin={{ top: 10, right: 10, left: -16, bottom: 0 }}>
                <defs>
                  <linearGradient id="conv-grad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#06B6D4" />
                    <stop offset="100%" stopColor="#6366F1" />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#E2E8F0" strokeDasharray="3 6" vertical={false} />
                <XAxis dataKey="channel" tickLine={false} axisLine={false} tick={{ fill: "#334155", fontSize: 11 }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fill: "#64748B", fontSize: 11 }} tickFormatter={(v) => `${v}%`} />
                <Tooltip
                  cursor={{ fill: "rgba(99,102,241,0.06)" }}
                  contentStyle={{ borderRadius: 12, border: "1px solid #E2E8F0", fontSize: 12 }}
                  formatter={(v: number, n: string) => (n === "rate" ? `${v}%` : v.toLocaleString())}
                />
                <Bar dataKey="rate" fill="url(#conv-grad)" radius={[10, 10, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>
      </div>

      {/* AI Activity Feed */}
      <SectionCard
        title="AI Activity Feed"
        description="Every action your AI workforce takes — streamed in real time."
        actions={
          <div className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-2.5 py-1 text-[11px] font-semibold text-emerald-700">
            <span className="relative grid size-1.5 place-items-center">
              <span className="absolute inset-0 animate-ping rounded-full bg-emerald-500/70" />
              <span className="absolute inset-0 rounded-full bg-emerald-500" />
            </span>
            Live
          </div>
        }
      >
        <ol className="relative space-y-4 before:absolute before:left-[19px] before:top-2 before:h-[calc(100%-1rem)] before:w-px before:bg-border">
          {activityFeed.map((a, i) => (
            <motion.li
              key={i}
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.05 * i }}
              className="relative flex gap-4"
            >
              <div className={cn("relative z-10 grid size-10 shrink-0 place-items-center rounded-xl text-white shadow-glow", toneToBg[a.tone])}>
                <a.icon className="size-4" aria-hidden="true" />
                {i === 0 && (
                  <span className="absolute inset-0 animate-ping rounded-xl bg-white/30" />
                )}
              </div>
              <div className="flex flex-1 items-start justify-between gap-3 rounded-xl border border-border bg-surface/40 p-3 transition hover:border-border-strong hover:bg-surface">
                <div className="min-w-0">
                  <p className="text-[13px] font-semibold text-foreground">
                    {a.agent}
                    <span className="ml-2 inline-flex items-center gap-1 text-[10.5px] font-medium text-emerald-700">
                      <CheckCircle2 className="size-3" /> completed
                    </span>
                  </p>
                  <p className="mt-0.5 text-[12.5px] leading-snug text-muted-foreground">{a.text}</p>
                </div>
                <span className="shrink-0 text-[11px] font-medium text-muted-foreground">{a.time}</span>
              </div>
            </motion.li>
          ))}
        </ol>
      </SectionCard>
    </>
  );
}
