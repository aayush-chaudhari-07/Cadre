import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { PageHeader, SectionCard, StatCard, Surface } from "@/components/flow/primitives";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  Brain,
  DollarSign,
  Percent,
  Sparkles,
  Target,
  TrendingUp,
  Zap,
  ArrowUpRight,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/_app/revenue")({
  head: () => ({ meta: [{ title: "Revenue Prediction — FlowMind AI" }] }),
  component: Revenue,
});

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const trajectory = months.map((m, i) => {
  const base = 6.2 + i * 0.42;
  return {
    month: m,
    actual: i < 9 ? +(base + Math.sin(i / 2) * 0.35).toFixed(2) : null,
    forecast: +(base + 0.55 + Math.cos(i / 3) * 0.25).toFixed(2),
    bestCase: +(base + 1.4 + Math.sin(i / 4) * 0.2).toFixed(2),
  };
});

const monthlyPredictions = [
  { month: "Jul", predicted: 9.8, lower: 9.1, upper: 10.6, confidence: 92 },
  { month: "Aug", predicted: 10.4, lower: 9.5, upper: 11.3, confidence: 90 },
  { month: "Sep", predicted: 11.2, lower: 10.1, upper: 12.3, confidence: 88 },
  { month: "Oct", predicted: 11.9, lower: 10.6, upper: 13.2, confidence: 86 },
  { month: "Nov", predicted: 12.45, lower: 11.0, upper: 13.9, confidence: 84 },
  { month: "Dec", predicted: 13.6, lower: 11.8, upper: 15.4, confidence: 81 },
];

const insights = [
  {
    icon: TrendingUp,
    tone: "from-indigo-500 to-violet-500",
    title: "Enterprise pipeline accelerating",
    body: "₹3.8Cr of late-stage deals show 2.4× faster sales cycles after pricing v3. Recommend front-loading Q4 capacity.",
    impact: "+₹68L",
  },
  {
    icon: Zap,
    tone: "from-cyan-500 to-blue-500",
    title: "Expansion revenue underweighted",
    body: "47 accounts crossed seat threshold without an upsell motion. Auto-routing to Expansion Agent unlocks compounding ARR.",
    impact: "+₹42L",
  },
  {
    icon: Sparkles,
    tone: "from-fuchsia-500 to-rose-500",
    title: "Discount drag detected",
    body: "Avg. discount widened 6.1% MoM in mid-market. Tightening guardrails preserves margin without hurting win rate.",
    impact: "+₹19L",
  },
];

function Revenue() {
  return (
    <>
      <PageHeader
        eyebrow="Revenue Intelligence"
        title="AI Revenue Predictor"
        description="An ensemble of time-series, pipeline and product-usage models continuously re-forecasts revenue with 92% historical accuracy."
        actions={
          <button className="inline-flex items-center gap-2 rounded-xl bg-gradient-primary px-4 py-2.5 text-[13px] font-semibold text-white shadow-glow transition hover:-translate-y-0.5">
            <Brain className="size-4" /> Run new forecast
          </button>
        }
      />

      {/* Hero predictor */}
      <Surface className="relative overflow-hidden p-6 md:p-8">
        <div className="absolute -right-24 -top-24 size-72 rounded-full bg-gradient-mesh opacity-70 blur-3xl" />
        <div className="absolute -left-20 bottom-0 size-56 rounded-full bg-[radial-gradient(circle,#06B6D4_0%,transparent_70%)] opacity-20 blur-3xl" />
        <div className="relative grid gap-6 lg:grid-cols-3">
          {[
            {
              label: "Predicted Revenue",
              value: "₹12,45,000",
              sub: "Next 30 days · ensemble model",
              tone: "from-indigo-500 to-violet-500",
              icon: DollarSign,
              meta: "92% model accuracy",
            },
            {
              label: "Conversion Probability",
              value: "84%",
              sub: "Across 312 open opportunities",
              tone: "from-violet-500 to-fuchsia-500",
              icon: Target,
              meta: "+6.2 pts MoM",
            },
            {
              label: "Expected Growth",
              value: "+32%",
              sub: "QoQ on closed-won revenue",
              tone: "from-cyan-500 to-blue-500",
              icon: TrendingUp,
              meta: "Best quarter on record",
            },
          ].map((card, i) => (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.06 }}
              className="rounded-2xl border border-border bg-card/80 p-5 backdrop-blur"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                    {card.label}
                  </p>
                  <p className="mt-2 font-display text-[28px] font-semibold leading-none text-foreground">
                    {card.value}
                  </p>
                  <p className="mt-2 text-[12px] text-muted-foreground">{card.sub}</p>
                </div>
                <div
                  className={`grid size-10 place-items-center rounded-xl bg-linear-to-br ${card.tone} text-white shadow-glow`}
                >
                  <card.icon className="size-5" />
                </div>
              </div>
              <div className="mt-4 flex items-center gap-2 text-[11.5px] font-medium text-emerald-600">
                <span className="size-1.5 rounded-full bg-emerald-500" /> {card.meta}
              </div>
            </motion.div>
          ))}
        </div>
      </Surface>

      {/* KPI strip */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Predicted Q4" value="₹4.8Cr" delta={{ value: "+12.6%", trend: "up" }} icon={<DollarSign className="size-5" />} tone="primary" index={0} />
        <StatCard label="Attainment" value="112%" delta={{ value: "+4.1%", trend: "up" }} icon={<Target className="size-5" />} tone="violet" index={1} />
        <StatCard label="Win rate" value="34.2%" delta={{ value: "+2.4%", trend: "up" }} icon={<Percent className="size-5" />} tone="cyan" index={2} />
        <StatCard label="ARR growth" value="38%" delta={{ value: "+5.8%", trend: "up" }} icon={<TrendingUp className="size-5" />} tone="success" index={3} />
      </div>

      {/* Forecast + Insights */}
      <div className="grid gap-5 xl:grid-cols-[1.65fr_1fr]">
        <SectionCard
          title="Revenue forecast"
          description="Actual vs predicted vs best-case · ₹ crores"
          actions={
            <div className="hidden items-center gap-3 text-[11px] text-muted-foreground sm:flex">
              <LegendDot color="#4F46E5" label="Actual" />
              <LegendDot color="#8B5CF6" label="Forecast" dashed />
              <LegendDot color="#06B6D4" label="Best case" dashed />
            </div>
          }
        >
          <div className="h-80">
            <ResponsiveContainer>
              <AreaChart data={trajectory} margin={{ left: -10, right: 10, top: 10 }}>
                <defs>
                  <linearGradient id="rev-a" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#4F46E5" stopOpacity={0.45} />
                    <stop offset="100%" stopColor="#4F46E5" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="rev-b" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#8B5CF6" stopOpacity={0.25} />
                    <stop offset="100%" stopColor="#8B5CF6" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="rev-c" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#06B6D4" stopOpacity={0.18} />
                    <stop offset="100%" stopColor="#06B6D4" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#E2E8F0" strokeDasharray="3 6" vertical={false} />
                <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fill: "#64748B", fontSize: 11 }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fill: "#64748B", fontSize: 11 }} tickFormatter={(v) => `₹${v}Cr`} />
                <Tooltip
                  contentStyle={{ borderRadius: 12, border: "1px solid #E2E8F0", fontSize: 12 }}
                  formatter={(v: number) => [`₹${v}Cr`, ""]}
                />
                <Area type="monotone" dataKey="bestCase" stroke="#06B6D4" strokeWidth={2} strokeDasharray="4 4" fill="url(#rev-c)" />
                <Area type="monotone" dataKey="forecast" stroke="#8B5CF6" strokeWidth={2} strokeDasharray="6 4" fill="url(#rev-b)" />
                <Area type="monotone" dataKey="actual" stroke="#4F46E5" strokeWidth={3} fill="url(#rev-a)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>

        <SectionCard
          title="AI insights"
          description="Auto-generated by Revenue Agent."
          actions={<Badge variant="secondary" className="bg-surface-2 text-[10.5px] text-accent-foreground">3 new</Badge>}
        >
          <div className="space-y-3">
            {insights.map((ins, i) => (
              <motion.div
                key={ins.title}
                initial={{ opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.35, delay: i * 0.06 }}
                className="group rounded-xl border border-border bg-surface/60 p-3.5 transition hover:border-primary/40 hover:bg-card"
              >
                <div className="flex items-start gap-3">
                  <div className={`grid size-9 shrink-0 place-items-center rounded-lg bg-linear-to-br ${ins.tone} text-white shadow-glow`}>
                    <ins.icon className="size-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <p className="font-display text-[13px] font-semibold leading-tight text-foreground">{ins.title}</p>
                      <span className="shrink-0 rounded-full bg-emerald-50 px-2 py-0.5 text-[10.5px] font-semibold text-emerald-700">
                        {ins.impact}
                      </span>
                    </div>
                    <p className="mt-1 text-[12px] leading-relaxed text-muted-foreground">{ins.body}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </SectionCard>
      </div>

      {/* Monthly predictions */}
      <SectionCard
        title="Monthly predictions"
        description="Per-month forecast with confidence band · ₹ lakhs"
      >
        <div className="grid gap-5 lg:grid-cols-[1.2fr_1fr]">
          <div className="h-64">
            <ResponsiveContainer>
              <BarChart data={monthlyPredictions} margin={{ left: -10, right: 10, top: 10 }}>
                <defs>
                  <linearGradient id="bar-p" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#6366F1" />
                    <stop offset="100%" stopColor="#8B5CF6" />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#E2E8F0" strokeDasharray="3 6" vertical={false} />
                <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fill: "#64748B", fontSize: 11 }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fill: "#64748B", fontSize: 11 }} tickFormatter={(v) => `₹${v}L`} />
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #E2E8F0", fontSize: 12 }} formatter={(v: number) => [`₹${v}L`, "Predicted"]} />
                <Bar dataKey="predicted" fill="url(#bar-p)" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="overflow-hidden rounded-xl border border-border">
            <table className="w-full text-[12.5px]">
              <thead className="bg-surface-2/60 text-[11px] uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="px-3 py-2 text-left font-medium">Month</th>
                  <th className="px-3 py-2 text-right font-medium">Predicted</th>
                  <th className="px-3 py-2 text-right font-medium">Range</th>
                  <th className="px-3 py-2 text-right font-medium">Confidence</th>
                </tr>
              </thead>
              <tbody>
                {monthlyPredictions.map((m) => (
                  <tr key={m.month} className="border-t border-border transition hover:bg-surface-2/40">
                    <td className="px-3 py-2.5 font-medium text-foreground">{m.month}</td>
                    <td className="px-3 py-2.5 text-right font-semibold text-foreground">₹{m.predicted}L</td>
                    <td className="px-3 py-2.5 text-right text-muted-foreground">₹{m.lower}–{m.upper}L</td>
                    <td className="px-3 py-2.5 text-right">
                      <span className="inline-flex items-center gap-1.5">
                        <span className="h-1.5 w-12 overflow-hidden rounded-full bg-surface-2">
                          <span className="block h-full bg-gradient-primary" style={{ width: `${m.confidence}%` }} />
                        </span>
                        <span className="text-[11.5px] font-semibold text-foreground">{m.confidence}%</span>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </SectionCard>

      <div className="grid gap-5 lg:grid-cols-2">
        <SectionCard title="Scenario planner" description="Tune assumptions to model outcomes.">
          <div className="space-y-4">
            {[
              { label: "Outbound capacity", value: 70 },
              { label: "Pricing uplift", value: 25 },
              { label: "Retention boost", value: 60 },
              { label: "Expansion motion", value: 45 },
            ].map((s) => (
              <div key={s.label}>
                <div className="mb-1.5 flex justify-between text-[12.5px]">
                  <span className="font-medium text-foreground">{s.label}</span>
                  <span className="text-muted-foreground">{s.value}%</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-surface-2">
                  <div className="h-full bg-gradient-primary" style={{ width: `${s.value}%` }} />
                </div>
              </div>
            ))}
            <button className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-primary py-2.5 text-[13px] font-semibold text-white shadow-glow transition hover:-translate-y-0.5">
              Recalculate forecast <ArrowUpRight className="size-3.5" />
            </button>
          </div>
        </SectionCard>
        <SectionCard title="Forecast confidence" description="Rolling model confidence by month.">
          <div className="h-52">
            <ResponsiveContainer>
              <LineChart data={trajectory}>
                <CartesianGrid stroke="#E2E8F0" strokeDasharray="3 6" vertical={false} />
                <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fill: "#64748B", fontSize: 11 }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fill: "#64748B", fontSize: 11 }} />
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #E2E8F0", fontSize: 12 }} />
                <Line type="monotone" dataKey="forecast" stroke="#6366F1" strokeWidth={2.5} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>
      </div>
    </>
  );
}

function LegendDot({ color, label, dashed }: { color: string; label: string; dashed?: boolean }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span
        className="inline-block h-[3px] w-5 rounded-full"
        style={{
          background: dashed
            ? `repeating-linear-gradient(90deg, ${color} 0 4px, transparent 4px 7px)`
            : color,
        }}
      />
      {label}
    </span>
  );
}
