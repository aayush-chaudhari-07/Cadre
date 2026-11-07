import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Radar,
  RadarChart,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  Target,
  TrendingUp,
  AlertCircle,
  Globe,
  Search,
  Sparkles,
  Shield,
  Zap,
  CheckCircle2,
  XCircle,
  ArrowUpRight,
} from "lucide-react";
import { PageHeader, SectionCard, Surface, StatCard, Skeleton } from "@/components/flow/primitives";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_app/competitors")({
  head: () => ({ meta: [{ title: "Competitor Analyzer — FlowMind AI" }] }),
  component: Competitors,
});

const competitors = [
  {
    id: "acme",
    name: "Acme AI",
    domain: "acme.ai",
    share: 28,
    trend: "+3.2%",
    score: 82,
    color: "from-indigo-500 to-violet-500",
    pricing: "₹4,999/mo",
    funding: "Series C · $120M",
    strengths: ["Enterprise sales motion", "SOC2 + ISO mature", "Strong VC backing"],
    weaknesses: ["Slow product velocity", "Weak APAC presence", "Legacy UX"],
    moves: ["Launched enterprise tier", "Hired ex-Google VP Sales"],
  },
  {
    id: "brightloop",
    name: "BrightLoop",
    domain: "brightloop.io",
    share: 19,
    trend: "+1.4%",
    score: 71,
    color: "from-violet-500 to-fuchsia-500",
    pricing: "₹2,499/mo",
    funding: "Series A · $18M",
    strengths: ["Aggressive pricing", "Fast G2 reviews growth", "Active community"],
    weaknesses: ["No enterprise SSO", "Thin analytics", "Limited integrations"],
    moves: ["Cut starter price 18%", "G2 reviews +42 this month"],
  },
  {
    id: "synthesis",
    name: "Synthesis",
    domain: "synthesis.co",
    share: 14,
    trend: "−0.8%",
    score: 58,
    color: "from-cyan-500 to-indigo-500",
    pricing: "₹3,799/mo",
    funding: "Seed · $6M",
    strengths: ["Strong R&D", "Best-in-class NLP"],
    weaknesses: ["Lost CMO", "Falling NPS", "Slowing releases"],
    moves: ["Lost CMO", "Product velocity dropping"],
  },
];

const positioning = [
  { axis: "Product depth", you: 88, them: 74 },
  { axis: "Pricing", you: 82, them: 68 },
  { axis: "Brand", you: 64, them: 86 },
  { axis: "Enterprise", you: 78, them: 84 },
  { axis: "Innovation", you: 92, them: 70 },
  { axis: "Support", you: 86, them: 72 },
];

const shareTrend = Array.from({ length: 8 }, (_, i) => ({
  week: `W${i + 1}`,
  you: 22 + i * 1.4 + (i % 2 ? 0.6 : 0),
  acme: 30 - i * 0.3,
  brightloop: 18 + i * 0.5,
  synthesis: 16 - i * 0.4,
}));

const pricingCompare = [
  { tier: "Starter", you: 1499, acme: 2499, brightloop: 1299, synthesis: 1899 },
  { tier: "Growth", you: 4999, acme: 6999, brightloop: 3999, synthesis: 5499 },
  { tier: "Scale", you: 9999, acme: 14999, brightloop: 8499, synthesis: 11999 },
  { tier: "Enterprise", you: 24999, acme: 39999, brightloop: 19999, synthesis: 28999 },
];

const opportunities = [
  { title: "Match BrightLoop Starter pricing", impact: "+14% conv", effort: "Low", body: "Modeled +14% conversion uplift, ₹3.2L monthly margin cost." },
  { title: "Publish enterprise security one-pager", impact: "+₹40L pipeline", effort: "Low", body: "Acme just won a deal citing SOC2 — close the perception gap." },
  { title: "Target Synthesis customer base", impact: "+₹1.2Cr ARR", effort: "Med", body: "Their CMO leaving creates a 60-day ABM window." },
  { title: "Launch APAC partner program", impact: "+18% TAM", effort: "High", body: "Acme & BrightLoop both weak in APAC — open lane for 6 quarters." },
];

function Competitors() {
  const [url, setUrl] = useState("");
  const [scanning, setScanning] = useState(false);
  const [selected, setSelected] = useState(competitors[0]);

  const runScan = () => {
    if (!url.trim()) return;
    setScanning(true);
    setTimeout(() => setScanning(false), 1400);
  };

  return (
    <>
      <PageHeader
        eyebrow="Competitor Analyzer"
        title="Outflank the market in real time."
        description="Drop any competitor URL — we map their pricing, positioning, hiring, reviews, and ad spend, then translate it into your next move."
        actions={<Button size="sm" className="gap-1.5 bg-gradient-primary"><Sparkles className="size-3.5" /> Run weekly scan</Button>}
      />

      {/* URL Input */}
      <SectionCard
        title="Analyze a competitor"
        description="Enter any competitor website — full intelligence report in 30 seconds."
      >
        <div className="flex flex-col gap-2 sm:flex-row">
          <div className="relative flex-1">
            <Globe className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://competitor.com"
              className="h-11 pl-9"
              onKeyDown={(e) => e.key === "Enter" && runScan()}
            />
          </div>
          <Button onClick={runScan} disabled={scanning} className="h-11 gap-1.5 bg-gradient-primary px-5">
            {scanning ? <><div className="size-2 animate-pulse rounded-full bg-white" /> Scanning…</> : <><Search className="size-4" /> Analyze</>}
          </Button>
        </div>
        <AnimatePresence>
          {scanning && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="mt-3 grid grid-cols-2 gap-2 md:grid-cols-4">
              {["Crawling site", "Pricing intel", "Review mining", "Hiring signals"].map((s) => (
                <div key={s} className="flex items-center gap-2 rounded-lg border border-border bg-surface-2/60 p-2.5 text-[11.5px]">
                  <div className="size-1.5 animate-pulse rounded-full bg-primary" />
                  <span>{s}</span>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </SectionCard>

      {/* KPIs */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Market position" value="#2" delta={{ value: "+1", trend: "up" }} icon={<Target className="size-5" />} tone="primary" index={0} />
        <StatCard label="Win rate vs them" value="62%" delta={{ value: "+4%", trend: "up" }} icon={<TrendingUp className="size-5" />} tone="violet" index={1} />
        <StatCard label="Mentions tracked" value="14,820" icon={<Globe className="size-5" />} tone="cyan" index={2} />
        <StatCard label="Active threats" value="3" delta={{ value: "+1", trend: "up" }} icon={<AlertCircle className="size-5" />} tone="success" index={3} />
      </div>

      {/* Scorecards */}
      <SectionCard title="Competitor Scorecards" description="Click a competitor for full breakdown">
        <div className="grid gap-3 lg:grid-cols-3">
          {competitors.map((c) => {
            const isActive = selected.id === c.id;
            return (
              <motion.button
                key={c.id}
                onClick={() => setSelected(c)}
                whileHover={{ y: -2 }}
                className={cn(
                  "group relative overflow-hidden rounded-2xl border bg-card p-5 text-left transition-all",
                  isActive ? "border-primary/40 shadow-glow" : "border-border hover:border-primary/30",
                )}
              >
                <div className="absolute -right-12 -top-12 size-32 rounded-full bg-gradient-mesh opacity-50 blur-2xl" />
                <div className="relative flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={cn("grid size-11 place-items-center rounded-xl bg-gradient-to-br text-[12px] font-semibold text-white shadow-glow", c.color)}>
                      {c.name.slice(0, 2)}
                    </div>
                    <div>
                      <p className="font-display text-[14px] font-semibold">{c.name}</p>
                      <p className="text-[11.5px] text-muted-foreground">{c.domain}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-display text-2xl font-semibold tabular-nums">{c.score}</p>
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Threat</p>
                  </div>
                </div>
                <div className="relative mt-4 grid grid-cols-3 gap-2 text-[11px]">
                  <div>
                    <p className="text-muted-foreground">Share</p>
                    <p className="font-display text-[13px] font-semibold">{c.share}%</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">QoQ</p>
                    <p className={cn("font-display text-[13px] font-semibold", c.trend.startsWith("+") ? "text-emerald-600" : "text-rose-600")}>{c.trend}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Pricing</p>
                    <p className="font-display text-[13px] font-semibold">{c.pricing}</p>
                  </div>
                </div>
                <div className="relative mt-3 h-1.5 overflow-hidden rounded-full bg-surface-2">
                  <div className={cn("h-full bg-gradient-to-r", c.color)} style={{ width: `${c.score}%` }} />
                </div>
              </motion.button>
            );
          })}
        </div>
      </SectionCard>

      {/* Selected breakdown */}
      <div className="grid gap-5 xl:grid-cols-[1fr_1.1fr]">
        <SectionCard
          title={`${selected.name} — Strengths & Weaknesses`}
          description={`${selected.funding} · ${selected.domain}`}
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-4">
              <div className="flex items-center gap-2 text-emerald-700">
                <Shield className="size-4" />
                <p className="font-display text-[13px] font-semibold uppercase tracking-wider">Strengths</p>
              </div>
              <ul className="mt-3 space-y-2">
                {selected.strengths.map((s) => (
                  <li key={s} className="flex items-start gap-2 text-[12.5px]">
                    <CheckCircle2 className="mt-0.5 size-3.5 shrink-0 text-emerald-600" />
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-xl border border-rose-500/30 bg-rose-500/5 p-4">
              <div className="flex items-center gap-2 text-rose-700">
                <Zap className="size-4" />
                <p className="font-display text-[13px] font-semibold uppercase tracking-wider">Weaknesses</p>
              </div>
              <ul className="mt-3 space-y-2">
                {selected.weaknesses.map((w) => (
                  <li key={w} className="flex items-start gap-2 text-[12.5px]">
                    <XCircle className="mt-0.5 size-3.5 shrink-0 text-rose-600" />
                    <span>{w}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="mt-4">
            <p className="mb-2 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Recent moves</p>
            <div className="flex flex-wrap gap-1.5">
              {selected.moves.map((m) => (
                <Badge key={m} variant="secondary" className="bg-surface-2 text-[10.5px] text-accent-foreground">{m}</Badge>
              ))}
            </div>
          </div>
        </SectionCard>

        <SectionCard title="Market Positioning" description="Multi-axis scoring vs selected competitor">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={positioning} outerRadius="78%">
                <PolarGrid stroke="hsl(var(--border))" />
                <PolarAngleAxis dataKey="axis" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
                <PolarRadiusAxis tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} angle={30} />
                <Radar name="You" dataKey="you" stroke="#6366F1" fill="#6366F1" fillOpacity={0.35} />
                <Radar name={selected.name} dataKey="them" stroke="#8B5CF6" fill="#8B5CF6" fillOpacity={0.2} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid hsl(var(--border))", fontSize: 12 }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>
      </div>

      {/* Charts */}
      <div className="grid gap-5 xl:grid-cols-2">
        <SectionCard title="Market share trend" description="8-week rolling — % of category mentions">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={shareTrend} margin={{ left: -10, right: 8, top: 8 }}>
                <defs>
                  <linearGradient id="gradYou" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#6366F1" stopOpacity={0.45} />
                    <stop offset="100%" stopColor="#6366F1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="hsl(var(--border))" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="week" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid hsl(var(--border))", fontSize: 12 }} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Area type="monotone" dataKey="you" stroke="#6366F1" strokeWidth={2.4} fill="url(#gradYou)" />
                <Area type="monotone" dataKey="acme" stroke="#8B5CF6" strokeWidth={1.6} fill="transparent" />
                <Area type="monotone" dataKey="brightloop" stroke="#06B6D4" strokeWidth={1.6} fill="transparent" />
                <Area type="monotone" dataKey="synthesis" stroke="#F59E0B" strokeWidth={1.6} fill="transparent" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>

        <SectionCard title="Pricing comparison" description="By tier · INR / month">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={pricingCompare} margin={{ left: -10, right: 8, top: 8 }}>
                <CartesianGrid stroke="hsl(var(--border))" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="tier" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${v / 1000}k`} />
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid hsl(var(--border))", fontSize: 12 }} formatter={(v: number) => `₹${v.toLocaleString("en-IN")}`} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Bar dataKey="you" fill="#6366F1" radius={[6, 6, 0, 0]} />
                <Bar dataKey="acme" fill="#8B5CF6" radius={[6, 6, 0, 0]} />
                <Bar dataKey="brightloop" fill="#06B6D4" radius={[6, 6, 0, 0]} />
                <Bar dataKey="synthesis" fill="#F59E0B" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>
      </div>

      {/* Comparison table */}
      <SectionCard title="Feature & pricing matrix" description="Side-by-side capability comparison">
        <div className="overflow-x-auto">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="border-b border-border text-left text-[11px] uppercase tracking-wider text-muted-foreground">
                <th className="py-3 pr-4 font-medium">Capability</th>
                <th className="py-3 pr-4 font-medium text-primary">You</th>
                {competitors.map((c) => (
                  <th key={c.id} className="py-3 pr-4 font-medium">{c.name}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {[
                { f: "Starting price", you: "₹1,499", v: ["₹2,499", "₹1,299", "₹1,899"] },
                { f: "AI agents included", you: "12", v: ["6", "4", "8"] },
                { f: "SOC 2 Type II", you: true, v: [true, false, false] },
                { f: "Indian data residency", you: true, v: [false, false, true] },
                { f: "Custom workflows", you: true, v: [true, false, true] },
                { f: "24×7 dedicated CSM", you: true, v: [true, false, false] },
                { f: "API rate limit", you: "Unlimited", v: ["10k/min", "2k/min", "5k/min"] },
                { f: "G2 rating", you: "4.8", v: ["4.5", "4.6", "4.2"] },
              ].map((row) => (
                <tr key={row.f} className="hover:bg-surface-2/40">
                  <td className="py-3 pr-4 font-medium">{row.f}</td>
                  <td className="py-3 pr-4">
                    {typeof row.you === "boolean" ? (
                      row.you ? <CheckCircle2 className="size-4 text-emerald-600" /> : <XCircle className="size-4 text-rose-500" />
                    ) : (
                      <span className="inline-flex items-center gap-1.5 rounded-md bg-primary/10 px-2 py-0.5 font-semibold text-primary">{row.you}</span>
                    )}
                  </td>
                  {row.v.map((val, i) => (
                    <td key={i} className="py-3 pr-4 text-muted-foreground">
                      {typeof val === "boolean" ? (
                        val ? <CheckCircle2 className="size-4 text-emerald-600/70" /> : <XCircle className="size-4 text-rose-400" />
                      ) : (
                        val
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>

      {/* Opportunities */}
      <SectionCard title="Market Opportunities" description="Recommended by the Strategy Agent">
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {opportunities.map((m, i) => (
            <motion.div key={m.title} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <Surface hover className="p-4">
                <div className="flex items-center justify-between">
                  <Badge className="bg-gradient-primary text-white text-[10px]">{m.impact}</Badge>
                  <Badge variant="outline" className="text-[10px]">{m.effort}</Badge>
                </div>
                <p className="mt-3 font-display text-[13.5px] font-semibold">{m.title}</p>
                <p className="mt-1.5 text-[12px] leading-snug text-muted-foreground">{m.body}</p>
                <button className="mt-3 inline-flex items-center gap-1 text-[12px] font-semibold text-primary hover:underline">
                  Run play <ArrowUpRight className="size-3" />
                </button>
              </Surface>
            </motion.div>
          ))}
        </div>
      </SectionCard>
    </>
  );
}
