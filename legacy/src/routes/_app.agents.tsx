import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  Activity,
  BarChart3,
  Bot,
  Briefcase,
  CheckCircle2,
  Cpu,
  Headphones,
  Megaphone,
  Plus,
  Settings2,
  Sparkles,
  TrendingUp,
  Workflow,
  Zap,
} from "lucide-react";
import { PageHeader, SectionCard, Surface } from "@/components/flow/primitives";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_app/agents")({
  head: () => ({ meta: [{ title: "AI Workforce — FlowMind AI" }] }),
  component: Agents,
});

type AgentStatus = "active" | "thinking" | "idle";

type AgentCard = {
  id: string;
  name: string;
  role: string;
  icon: React.ComponentType<{ className?: string }>;
  status: AgentStatus;
  currentTask: string;
  performance: number;
  tasksCompleted: number;
  successRate: number;
  tone: string;
  ring: string;
  glow: string;
};

const agents: AgentCard[] = [
  {
    id: "sales",
    name: "AI Sales Manager",
    role: "Revenue Operations",
    icon: Briefcase,
    status: "active",
    currentTask: "Qualifying 12 inbound leads from WhatsApp & web",
    performance: 96,
    tasksCompleted: 1842,
    successRate: 92,
    tone: "from-indigo-500 via-violet-500 to-fuchsia-500",
    ring: "ring-indigo-400/40",
    glow: "shadow-[0_0_40px_-10px_oklch(0.6_0.22_280/0.6)]",
  },
  {
    id: "support",
    name: "AI Support Manager",
    role: "Customer Experience",
    icon: Headphones,
    status: "active",
    currentTask: "Resolving 38 priority tickets across 4 channels",
    performance: 94,
    tasksCompleted: 6210,
    successRate: 98,
    tone: "from-cyan-500 via-sky-500 to-blue-500",
    ring: "ring-cyan-400/40",
    glow: "shadow-[0_0_40px_-10px_oklch(0.7_0.16_220/0.6)]",
  },
  {
    id: "marketing",
    name: "AI Marketing Manager",
    role: "Growth & Demand Gen",
    icon: Megaphone,
    status: "thinking",
    currentTask: "Launching Q3 retention campaign across 4 segments",
    performance: 89,
    tasksCompleted: 924,
    successRate: 87,
    tone: "from-fuchsia-500 via-pink-500 to-rose-500",
    ring: "ring-fuchsia-400/40",
    glow: "shadow-[0_0_40px_-10px_oklch(0.65_0.25_340/0.6)]",
  },
  {
    id: "analytics",
    name: "AI Analytics Manager",
    role: "Business Intelligence",
    icon: BarChart3,
    status: "active",
    currentTask: "Detected 3 revenue opportunities worth ₹18.4L",
    performance: 97,
    tasksCompleted: 3120,
    successRate: 95,
    tone: "from-emerald-500 via-teal-500 to-cyan-500",
    ring: "ring-emerald-400/40",
    glow: "shadow-[0_0_40px_-10px_oklch(0.72_0.17_175/0.6)]",
  },
  {
    id: "workflow",
    name: "AI Workflow Manager",
    role: "Operations Orchestrator",
    icon: Workflow,
    status: "idle",
    currentTask: "Monitoring 28 automations across the stack",
    performance: 99,
    tasksCompleted: 8421,
    successRate: 99,
    tone: "from-amber-500 via-orange-500 to-rose-500",
    ring: "ring-amber-400/40",
    glow: "shadow-[0_0_40px_-10px_oklch(0.75_0.18_60/0.6)]",
  },
];

const statusMeta: Record<AgentStatus, { label: string; dot: string; pill: string }> = {
  active: {
    label: "Active",
    dot: "bg-emerald-500",
    pill: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
  },
  thinking: {
    label: "Thinking",
    dot: "bg-amber-500",
    pill: "bg-amber-500/10 text-amber-600 border-amber-500/20",
  },
  idle: {
    label: "Standby",
    dot: "bg-slate-400",
    pill: "bg-slate-500/10 text-slate-600 border-slate-500/20",
  },
};

function StatusPill({ status }: { status: AgentStatus }) {
  const m = statusMeta[status];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10.5px] font-semibold uppercase tracking-wider",
        m.pill,
      )}
    >
      <span className="relative flex size-1.5">
        <span className={cn("absolute inline-flex h-full w-full rounded-full opacity-75", m.dot, status === "active" && "animate-ping")} />
        <span className={cn("relative inline-flex size-1.5 rounded-full", m.dot)} />
      </span>
      {m.label}
    </span>
  );
}

function PerformanceRing({ value, gradient }: { value: number; gradient: string }) {
  const r = 26;
  const c = 2 * Math.PI * r;
  const offset = c - (value / 100) * c;
  return (
    <div className="relative grid size-16 place-items-center">
      <svg className="absolute inset-0 -rotate-90" viewBox="0 0 64 64">
        <defs>
          <linearGradient id={`ring-${gradient}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="oklch(0.65 0.22 280)" />
            <stop offset="100%" stopColor="oklch(0.72 0.18 200)" />
          </linearGradient>
        </defs>
        <circle cx="32" cy="32" r={r} stroke="oklch(0.92 0.01 260)" strokeWidth="5" fill="none" />
        <motion.circle
          cx="32"
          cy="32"
          r={r}
          stroke={`url(#ring-${gradient})`}
          strokeWidth="5"
          strokeLinecap="round"
          fill="none"
          strokeDasharray={c}
          initial={{ strokeDashoffset: c }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        />
      </svg>
      <span className="font-display text-sm font-semibold text-foreground">{value}</span>
    </div>
  );
}

function AgentCardView({ agent, index }: { agent: AgentCard; index: number }) {
  const Icon = agent.icon;
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: index * 0.07, ease: "easeOut" }}
    >
      <Surface
        hover
        className={cn(
          "group relative overflow-hidden p-5 transition-shadow duration-500 hover:ring-2",
          agent.ring,
          `hover:${agent.glow}`,
        )}
      >
        <div className={cn("absolute -right-16 -top-16 size-48 rounded-full bg-gradient-to-br opacity-30 blur-3xl transition-opacity duration-500 group-hover:opacity-60", agent.tone)} />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/60 to-transparent" />

        <div className="relative flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className={cn("relative grid size-12 place-items-center rounded-2xl bg-gradient-to-br text-white shadow-glow", agent.tone)}>
              <Icon className="size-6" />
              {agent.status === "active" && (
                <motion.span
                  className="absolute inset-0 rounded-2xl ring-2 ring-white/60"
                  initial={{ opacity: 0.8, scale: 1 }}
                  animate={{ opacity: 0, scale: 1.35 }}
                  transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut" }}
                />
              )}
            </div>
            <div>
              <p className="font-display text-[15px] font-semibold leading-tight">{agent.name}</p>
              <Badge variant="secondary" className="mt-1 bg-accent text-[10.5px] text-accent-foreground">
                {agent.role}
              </Badge>
            </div>
          </div>
          <StatusPill status={agent.status} />
        </div>

        <div className="relative mt-4 rounded-xl border border-border/60 bg-surface/60 p-3">
          <div className="flex items-center gap-2 text-[10.5px] font-semibold uppercase tracking-wider text-muted-foreground">
            <Cpu className="size-3" /> Current task
          </div>
          <p className="mt-1 text-[13px] leading-snug text-foreground">{agent.currentTask}</p>
        </div>

        <div className="relative mt-4 flex items-center gap-4">
          <PerformanceRing value={agent.performance} gradient={agent.id} />
          <div className="grid flex-1 grid-cols-2 gap-2">
            <div className="rounded-xl bg-surface/60 p-2.5">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Completed</p>
              <p className="font-display text-[15px] font-semibold">{agent.tasksCompleted.toLocaleString()}</p>
            </div>
            <div className="rounded-xl bg-surface/60 p-2.5">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Success</p>
              <p className="font-display text-[15px] font-semibold">{agent.successRate}%</p>
            </div>
          </div>
        </div>

        <div className="relative mt-4 flex items-center justify-between border-t border-border/60 pt-3">
          <div className="flex items-center gap-3">
            <Switch defaultChecked={agent.status !== "idle"} />
            <span className="text-[11.5px] font-medium text-muted-foreground">Autonomy on</span>
          </div>
          <div className="flex items-center gap-1.5">
            <button className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[11.5px] font-semibold text-primary hover:bg-primary/10">
              <Sparkles className="size-3.5" /> Inspect
            </button>
            <button className="inline-flex items-center gap-1.5 rounded-lg border border-border px-2.5 py-1.5 text-[11.5px] font-semibold text-foreground hover:bg-surface">
              <Settings2 className="size-3.5" /> Tune
            </button>
          </div>
        </div>
      </Surface>
    </motion.div>
  );
}

// ────────────────────────────────────────────────────────────
// Workflow diagram
// ────────────────────────────────────────────────────────────

const flowNodes = [
  { id: "sales", label: "Sales Agent", icon: Briefcase, sub: "Qualifies & books", tone: "from-indigo-500 to-violet-500" },
  { id: "support", label: "Support Agent", icon: Headphones, sub: "Onboards & retains", tone: "from-cyan-500 to-blue-500" },
  { id: "marketing", label: "Marketing Agent", icon: Megaphone, sub: "Nurtures & expands", tone: "from-fuchsia-500 to-rose-500" },
  { id: "analytics", label: "Analytics Agent", icon: BarChart3, sub: "Learns & optimizes", tone: "from-emerald-500 to-teal-500" },
];

const handoffs = [
  { from: "Sales", to: "Support", msg: "Handing off 12 closed-won accounts for onboarding" },
  { from: "Support", to: "Marketing", msg: "5 delighted customers flagged for advocacy program" },
  { from: "Marketing", to: "Analytics", msg: "Campaign data ready for attribution modeling" },
  { from: "Analytics", to: "Sales", msg: "Detected 3 high-intent accounts — routing to closers" },
];

function WorkflowDiagram() {
  return (
    <SectionCard
      title="Live agent orchestration"
      description="Agents collaborate autonomously — passing context, signals, and approvals down the pipeline."
      actions={
        <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 text-[10.5px] font-semibold uppercase tracking-wider text-emerald-600">
          <Activity className="size-3" /> Live
        </span>
      }
    >
      <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
        {/* Diagram */}
        <div className="relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-surface to-surface-2/60 p-6">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,oklch(0.7_0.2_280/0.12),transparent_60%)]" />
          <div className="relative flex flex-col gap-3">
            {flowNodes.map((node, i) => {
              const Icon = node.icon;
              return (
                <div key={node.id} className="flex flex-col items-stretch">
                  <motion.div
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: i * 0.12 }}
                    className="relative flex items-center gap-3 rounded-2xl border border-border bg-card p-3 shadow-soft"
                  >
                    <div className={cn("grid size-11 place-items-center rounded-xl bg-gradient-to-br text-white shadow-glow", node.tone)}>
                      <Icon className="size-5" />
                    </div>
                    <div className="flex-1">
                      <p className="font-display text-[14px] font-semibold">{node.label}</p>
                      <p className="text-[11.5px] text-muted-foreground">{node.sub}</p>
                    </div>
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-emerald-600">
                      <span className="size-1.5 animate-pulse rounded-full bg-emerald-500" />
                      Online
                    </span>
                    {/* pulse halo */}
                    <motion.span
                      className={cn("pointer-events-none absolute inset-0 rounded-2xl ring-1", "ring-primary/30")}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: [0, 0.6, 0] }}
                      transition={{ duration: 2.4, repeat: Infinity, delay: i * 0.4 }}
                    />
                  </motion.div>

                  {i < flowNodes.length - 1 && (
                    <div className="relative mx-auto h-12 w-px">
                      <div className="absolute inset-0 bg-gradient-to-b from-primary/40 via-primary/20 to-primary/40" />
                      <motion.div
                        className="absolute left-1/2 size-2 -translate-x-1/2 rounded-full bg-primary shadow-[0_0_12px_oklch(0.6_0.22_280)]"
                        initial={{ top: "-4px" }}
                        animate={{ top: "calc(100% - 4px)" }}
                        transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut", delay: i * 0.2 }}
                      />
                      <motion.div
                        className="absolute left-1/2 size-1.5 -translate-x-1/2 rounded-full bg-cyan-400 shadow-[0_0_10px_oklch(0.7_0.16_220)]"
                        initial={{ top: "-4px" }}
                        animate={{ top: "calc(100% - 4px)" }}
                        transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut", delay: i * 0.2 + 0.6 }}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Handoff feed */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            <Zap className="size-3.5 text-primary" /> Inter-agent messages
          </div>
          {handoffs.map((h, i) => (
            <motion.div
              key={`${h.from}-${h.to}-${i}`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 + i * 0.12 }}
              className="relative overflow-hidden rounded-xl border border-border bg-card p-3"
            >
              <div className="flex items-center gap-2 text-[11px] font-semibold">
                <span className="rounded-md bg-primary/10 px-2 py-0.5 text-primary">{h.from}</span>
                <motion.span
                  initial={{ x: -2, opacity: 0.5 }}
                  animate={{ x: 2, opacity: 1 }}
                  transition={{ duration: 0.8, repeat: Infinity, repeatType: "reverse" }}
                  className="text-muted-foreground"
                >
                  →
                </motion.span>
                <span className="rounded-md bg-violet-500/10 px-2 py-0.5 text-violet-600">{h.to}</span>
              </div>
              <p className="mt-1.5 text-[12.5px] leading-snug text-foreground">{h.msg}</p>
              <div className="mt-2 flex items-center gap-2 text-[10.5px] text-muted-foreground">
                <CheckCircle2 className="size-3 text-emerald-500" /> Delivered · just now
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </SectionCard>
  );
}

// ────────────────────────────────────────────────────────────

function Agents() {
  const totalTasks = agents.reduce((s, a) => s + a.tasksCompleted, 0);
  const avgSuccess = Math.round(agents.reduce((s, a) => s + a.successRate, 0) / agents.length);
  const active = agents.filter((a) => a.status === "active").length;

  return (
    <>
      <PageHeader
        eyebrow="Multi-Agent AI Workforce"
        title="Five specialists. One autonomous team."
        description="Your AI managers run sales, support, marketing, analytics, and operations — collaborating in real time so revenue compounds while you sleep."
        actions={
          <button className="inline-flex h-10 items-center gap-2 rounded-xl bg-gradient-primary px-4 text-[13px] font-semibold text-white shadow-glow">
            <Plus className="size-4" /> Hire new agent
          </button>
        }
      />

      <div className="grid gap-3 sm:grid-cols-3">
        <Surface className="p-4">
          <p className="text-[10.5px] font-semibold uppercase tracking-wider text-muted-foreground">Agents online</p>
          <p className="mt-1 font-display text-2xl font-semibold">{active}<span className="text-base text-muted-foreground">/{agents.length}</span></p>
        </Surface>
        <Surface className="p-4">
          <p className="text-[10.5px] font-semibold uppercase tracking-wider text-muted-foreground">Tasks completed (30d)</p>
          <p className="mt-1 font-display text-2xl font-semibold">{totalTasks.toLocaleString()}</p>
        </Surface>
        <Surface className="p-4">
          <p className="text-[10.5px] font-semibold uppercase tracking-wider text-muted-foreground">Avg success rate</p>
          <p className="mt-1 font-display text-2xl font-semibold flex items-center gap-2">
            {avgSuccess}% <TrendingUp className="size-4 text-emerald-500" />
          </p>
        </Surface>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {agents.map((a, i) => (
          <AgentCardView key={a.id} agent={a} index={i} />
        ))}
      </div>

      <WorkflowDiagram />
    </>
  );
}
