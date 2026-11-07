import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  BrainCircuit,
  CheckCircle2,
  Command,
  Cpu,
  Crown,
  Gauge,
  Loader2,
  Megaphone,
  Radar,
  Send,
  Shield,
  Sparkles,
  TrendingUp,
  Workflow,
  Zap,
} from "lucide-react";
import { PageHeader, Surface } from "@/components/flow/primitives";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_app/ceo")({
  head: () => ({ meta: [{ title: "AI CEO — FlowMind AI" }] }),
  component: AICEO,
});

const exampleCommands = [
  { icon: TrendingUp, text: "Increase sales by 20%" },
  { icon: Radar, text: "Recover lost customers" },
  { icon: Megaphone, text: "Launch email campaign" },
  { icon: Shield, text: "Reduce churn rate" },
  { icon: Sparkles, text: "Expand customer retention" },
];

type Phase = {
  id: number;
  title: string;
  agent: string;
  icon: React.ComponentType<{ className?: string }>;
  desc: string;
  steps: string[];
  tone: string;
};

const phases: Phase[] = [
  {
    id: 1,
    title: "Lead Analysis",
    agent: "Analytics Agent",
    icon: BrainCircuit,
    desc: "Score 4,210 leads across pipeline, segment by intent, surface 3 high-leverage cohorts.",
    steps: ["Ingest CRM + web signals", "Run intent model", "Cluster by ICP fit"],
    tone: "from-indigo-500 via-violet-500 to-fuchsia-500",
  },
  {
    id: 2,
    title: "Customer Recovery",
    agent: "Retention Agent",
    icon: Radar,
    desc: "Re-engage 184 dormant accounts with personalized win-back plays and exec briefings.",
    steps: ["Identify at-risk cohort", "Draft personalized outreach", "Schedule exec syncs"],
    tone: "from-cyan-500 via-sky-500 to-blue-500",
  },
  {
    id: 3,
    title: "Marketing Campaign",
    agent: "Marketing Agent",
    icon: Megaphone,
    desc: "Launch 4-segment lifecycle campaign across email, WhatsApp, and LinkedIn.",
    steps: ["Generate creative variants", "A/B test subject lines", "Deploy across 3 channels"],
    tone: "from-fuchsia-500 via-pink-500 to-rose-500",
  },
  {
    id: 4,
    title: "Performance Monitoring",
    agent: "Workflow Agent",
    icon: Gauge,
    desc: "Real-time KPI tracking with auto-optimization loops and weekly board-ready reports.",
    steps: ["Stream KPI telemetry", "Trigger optimizations", "Compile exec summary"],
    tone: "from-emerald-500 via-teal-500 to-cyan-500",
  },
];

const decisions = [
  { label: "Re-route 12 enterprise leads to Closer Agent", confidence: 96 },
  { label: "Approve ₹4.8L retention budget for Q3 win-back", confidence: 92 },
  { label: "Pause underperforming LinkedIn segment 'SMB-IN-04'", confidence: 88 },
  { label: "Escalate Acme Corp churn signal to CSM team", confidence: 94 },
];

const automations = [
  "Sync 4,210 leads → Closer Agent queue",
  "Generate 12 personalized email variants",
  "Schedule 28 discovery calls across regions",
  "Compile attribution model → Analytics dashboard",
  "Notify CSMs of 9 at-risk accounts via Slack",
];

function AICEO() {
  const [input, setInput] = useState("");
  const [executed, setExecuted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [command, setCommand] = useState("");

  const run = (text: string) => {
    if (!text.trim()) return;
    setCommand(text);
    setLoading(true);
    setExecuted(false);
    setTimeout(() => {
      setLoading(false);
      setExecuted(true);
    }, 1400);
  };

  return (
    <>
      <PageHeader
        eyebrow="AI CEO"
        title="The autonomous executive layer."
        description="One command. Five specialist agents. A complete strategic plan modeled, approved, and executed in seconds."
        actions={
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-gradient-soft px-3 py-1.5 text-[11.5px] font-semibold text-accent-foreground">
            <Crown className="size-3.5 text-primary" /> Reasoning model: FlowMind-CEO v3
          </span>
        }
      />

      {/* ============ COMMAND INTERFACE ============ */}
      <div className="relative overflow-hidden rounded-3xl border border-border bg-[oklch(0.16_0.04_270)] p-6 text-white shadow-elegant md:p-10">
        {/* animated mesh background */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,oklch(0.55_0.25_280/0.6),transparent_45%),radial-gradient(circle_at_80%_30%,oklch(0.6_0.22_330/0.5),transparent_45%),radial-gradient(circle_at_50%_90%,oklch(0.6_0.2_220/0.5),transparent_50%)]" />
          <svg className="absolute inset-0 size-full opacity-[0.08]" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
          {/* floating orbs */}
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="absolute size-64 rounded-full blur-3xl"
              style={{
                background: ["oklch(0.6 0.25 280 / 0.35)", "oklch(0.7 0.2 200 / 0.3)", "oklch(0.65 0.25 340 / 0.3)"][i],
                top: ["-10%", "30%", "60%"][i],
                left: ["60%", "-10%", "70%"][i],
              }}
              animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
              transition={{ duration: 8 + i * 2, repeat: Infinity, ease: "easeInOut" }}
            />
          ))}
        </div>

        <div className="relative mx-auto max-w-3xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mx-auto mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/80 backdrop-blur"
          >
            <span className="relative flex size-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex size-1.5 rounded-full bg-emerald-400" />
            </span>
            CEO console online · 5 agents standing by
          </motion.div>

          <h2 className="font-display text-3xl font-semibold leading-tight tracking-tight md:text-[2.6rem]">
            <span className="bg-gradient-to-r from-white via-white to-white/70 bg-clip-text text-transparent">
              Tell your AI company
            </span>
            <br />
            <span className="bg-gradient-to-r from-violet-300 via-fuchsia-300 to-cyan-300 bg-clip-text text-transparent">
              what to achieve.
            </span>
          </h2>

          {/* command input */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="relative mx-auto mt-8 max-w-2xl"
          >
            <div className="absolute -inset-px rounded-2xl bg-gradient-to-r from-violet-500 via-fuchsia-500 to-cyan-500 opacity-70 blur" />
            <div className="relative flex items-center gap-2 rounded-2xl border border-white/15 bg-[oklch(0.18_0.04_270)]/90 p-2 backdrop-blur-xl">
              <Command className="ml-2 size-5 text-white/60" />
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && run(input)}
                placeholder="Tell your AI company what to achieve..."
                className="flex-1 bg-transparent px-2 py-3 text-[15px] text-white placeholder:text-white/40 focus:outline-none"
              />
              <button
                onClick={() => run(input)}
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-500 to-fuchsia-500 px-4 py-2.5 text-[13px] font-semibold text-white shadow-[0_0_30px_-5px_oklch(0.6_0.25_320/0.8)] transition-transform hover:scale-[1.02]"
              >
                {loading ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
                Execute
              </button>
            </div>

            {/* example commands */}
            <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
              {exampleCommands.map((c, i) => {
                const Icon = c.icon;
                return (
                  <motion.button
                    key={c.text}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, delay: 0.2 + i * 0.05 }}
                    onClick={() => {
                      setInput(c.text);
                      run(c.text);
                    }}
                    className="group inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-[12px] font-medium text-white/80 backdrop-blur transition-all hover:border-white/30 hover:bg-white/10 hover:text-white"
                  >
                    <Icon className="size-3.5 text-violet-300 transition-transform group-hover:scale-110" />
                    {c.text}
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        </div>
      </div>

      {/* ============ STRATEGIC PLAN OUTPUT ============ */}
      <AnimatePresence mode="wait">
        {loading && (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid place-items-center rounded-3xl border border-border bg-card p-12"
          >
            <div className="flex flex-col items-center gap-3 text-center">
              <div className="relative grid size-14 place-items-center rounded-2xl bg-gradient-primary text-white shadow-glow">
                <BrainCircuit className="size-7" />
                <motion.span
                  className="absolute inset-0 rounded-2xl ring-2 ring-primary/60"
                  animate={{ scale: [1, 1.4], opacity: [0.6, 0] }}
                  transition={{ duration: 1.4, repeat: Infinity }}
                />
              </div>
              <p className="font-display text-sm font-semibold">CEO is synthesizing the plan…</p>
              <p className="text-xs text-muted-foreground">Coordinating 5 agents · modeling 12 outcomes</p>
            </div>
          </motion.div>
        )}

        {executed && (
          <motion.div
            key="plan"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-5"
          >
            {/* KPI strip */}
            <div className="grid gap-3 md:grid-cols-4">
              {[
                { label: "Estimated revenue impact", value: "₹48.2L", delta: "+28%", icon: TrendingUp, tone: "from-emerald-500 to-teal-500" },
                { label: "Expected growth", value: "+32%", delta: "QoQ", icon: Gauge, tone: "from-indigo-500 to-violet-500" },
                { label: "Automation tasks", value: "184", delta: "queued", icon: Workflow, tone: "from-cyan-500 to-blue-500" },
                { label: "AI decisions made", value: "27", delta: "auto-approved", icon: Cpu, tone: "from-fuchsia-500 to-rose-500" },
              ].map((k, i) => {
                const Icon = k.icon;
                return (
                  <motion.div
                    key={k.label}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: i * 0.08 }}
                  >
                    <Surface className="relative overflow-hidden p-4">
                      <div className={cn("absolute -right-10 -top-10 size-32 rounded-full bg-gradient-to-br opacity-30 blur-2xl", k.tone)} />
                      <div className="relative flex items-start justify-between">
                        <div>
                          <p className="text-[10.5px] font-semibold uppercase tracking-wider text-muted-foreground">{k.label}</p>
                          <p className="mt-1 font-display text-2xl font-semibold">{k.value}</p>
                          <p className="text-[11px] font-medium text-emerald-600">{k.delta}</p>
                        </div>
                        <div className={cn("grid size-9 place-items-center rounded-xl bg-gradient-to-br text-white shadow-glow", k.tone)}>
                          <Icon className="size-4.5" />
                        </div>
                      </div>
                    </Surface>
                  </motion.div>
                );
              })}
            </div>

            {/* Plan header */}
            <Surface className="p-6">
              <div className="flex flex-col gap-1 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-[10.5px] font-semibold uppercase tracking-wider text-primary">AI Strategic Plan</p>
                  <h3 className="mt-1 font-display text-xl font-semibold">
                    “{command}”
                  </h3>
                  <p className="text-sm text-muted-foreground">4-phase autonomous execution · est. completion 6 days</p>
                </div>
                <button className="inline-flex items-center gap-2 self-start rounded-xl bg-gradient-primary px-4 py-2.5 text-[13px] font-semibold text-white shadow-glow md:self-auto">
                  <Zap className="size-4" /> Approve & deploy
                </button>
              </div>

              {/* Phases timeline */}
              <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                {phases.map((p, i) => {
                  const Icon = p.icon;
                  return (
                    <motion.div
                      key={p.id}
                      initial={{ opacity: 0, y: 14 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.15 + i * 0.1 }}
                      className="group relative"
                    >
                      <div className="relative overflow-hidden rounded-2xl border border-border bg-card p-4 transition-all hover:-translate-y-0.5 hover:shadow-elegant">
                        <div className={cn("absolute -right-12 -top-12 size-36 rounded-full bg-gradient-to-br opacity-25 blur-3xl", p.tone)} />
                        <div className="relative flex items-center justify-between">
                          <span className="text-[10.5px] font-semibold uppercase tracking-wider text-muted-foreground">Phase {p.id}</span>
                          <div className={cn("grid size-9 place-items-center rounded-xl bg-gradient-to-br text-white shadow-glow", p.tone)}>
                            <Icon className="size-4.5" />
                          </div>
                        </div>
                        <p className="relative mt-2 font-display text-[15px] font-semibold">{p.title}</p>
                        <p className="relative text-[11px] font-medium text-primary">{p.agent}</p>
                        <p className="relative mt-2 text-[12.5px] leading-snug text-muted-foreground">{p.desc}</p>
                        <ul className="relative mt-3 space-y-1.5">
                          {p.steps.map((s, si) => (
                            <li key={s} className="flex items-center gap-2 text-[11.5px] text-foreground">
                              <motion.span
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.4 + i * 0.1 + si * 0.08 }}
                                className={cn("grid size-4 place-items-center rounded-full bg-gradient-to-br text-white", p.tone)}
                              >
                                <CheckCircle2 className="size-3" />
                              </motion.span>
                              {s}
                            </li>
                          ))}
                        </ul>
                      </div>
                      {i < phases.length - 1 && (
                        <ArrowRight className="absolute -right-3 top-1/2 z-10 hidden size-5 -translate-y-1/2 text-muted-foreground xl:block" />
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </Surface>

            {/* Decisions + Automations */}
            <div className="grid gap-5 lg:grid-cols-2">
              <Surface className="p-6">
                <div className="mb-4 flex items-center gap-2">
                  <BrainCircuit className="size-4 text-primary" />
                  <h3 className="font-display text-base font-semibold">AI Decisions</h3>
                  <span className="ml-auto rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10.5px] font-semibold text-emerald-600">Auto-approved</span>
                </div>
                <ul className="space-y-3">
                  {decisions.map((d, i) => (
                    <motion.li
                      key={d.label}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + i * 0.08 }}
                      className="rounded-xl border border-border bg-surface/50 p-3"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <p className="text-[13px] font-medium leading-snug">{d.label}</p>
                        <span className="shrink-0 rounded-md bg-primary/10 px-2 py-0.5 text-[11px] font-semibold text-primary">
                          {d.confidence}%
                        </span>
                      </div>
                      <div className="mt-2 h-1 overflow-hidden rounded-full bg-surface-2">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${d.confidence}%` }}
                          transition={{ duration: 0.8, delay: 0.4 + i * 0.08 }}
                          className="h-full bg-gradient-to-r from-violet-500 to-fuchsia-500"
                        />
                      </div>
                    </motion.li>
                  ))}
                </ul>
              </Surface>

              <Surface className="p-6">
                <div className="mb-4 flex items-center gap-2">
                  <Workflow className="size-4 text-primary" />
                  <h3 className="font-display text-base font-semibold">Automation Tasks</h3>
                  <span className="ml-auto inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 px-2 py-0.5 text-[10.5px] font-semibold text-amber-600">
                    <motion.span animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }}>
                      <Loader2 className="size-3" />
                    </motion.span>
                    Running
                  </span>
                </div>
                <ul className="space-y-2.5">
                  {automations.map((a, i) => (
                    <motion.li
                      key={a}
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + i * 0.08 }}
                      className="flex items-center gap-3 rounded-xl border border-border bg-surface/50 p-3"
                    >
                      <div className="grid size-8 place-items-center rounded-lg bg-gradient-primary text-white shadow-glow">
                        <Cpu className="size-4" />
                      </div>
                      <p className="flex-1 text-[13px] font-medium">{a}</p>
                      <CheckCircle2 className="size-4 text-emerald-500" />
                    </motion.li>
                  ))}
                </ul>
              </Surface>
            </div>
          </motion.div>
        )}

        {!executed && !loading && (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="rounded-3xl border border-dashed border-border bg-card/60 p-10 text-center"
          >
            <div className="mx-auto grid size-12 place-items-center rounded-2xl bg-gradient-soft text-primary">
              <Sparkles className="size-6" />
            </div>
            <p className="mt-3 font-display text-base font-semibold">Awaiting your directive</p>
            <p className="mt-1 text-sm text-muted-foreground">Run a command above to generate a complete strategic plan with phases, decisions, and live automation tasks.</p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
