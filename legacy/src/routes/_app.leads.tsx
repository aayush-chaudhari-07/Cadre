import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  PageHeader,
  SectionCard,
  Surface,
} from "@/components/flow/primitives";
import { Badge } from "@/components/ui/badge";
import {
  Upload,
  MessageSquare,
  Mail,
  Phone,
  Search,
  Filter,
  Download,
  ArrowUpDown,
  Sparkles,
  TrendingUp,
  Clock,
  CheckCircle2,
  Flame,
  Snowflake,
  Thermometer,
  XCircle,
  ChevronRight,
  FileCheck2,
  Loader2,
  Inbox,
  Building2,
  Zap,
  Target,
  ArrowUpRight,
  Activity,
} from "lucide-react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

export const Route = createFileRoute("/_app/leads")({
  head: () => ({ meta: [{ title: "Lead Intelligence — FlowMind AI" }] }),
  component: Leads,
});

type Category = "Hot" | "Warm" | "Cold" | "Lost";

type Lead = {
  name: string;
  company: string;
  title: string;
  score: number;
  revenue: number;
  status: Category;
  lastActivity: string;
  lastActivityHours: number;
  probability: number;
  source: "WhatsApp" | "Email" | "Call";
  reasons: string[];
  summary: string;
  signals: { label: string; weight: number }[];
  region: string;
};

const LEADS: Lead[] = [
  {
    name: "Rahul Sharma", company: "Sharma Textiles Pvt Ltd", title: "Director of Operations",
    score: 95, revenue: 45000, status: "Hot", lastActivity: "2 hours ago", lastActivityHours: 2,
    probability: 87, source: "WhatsApp", region: "Mumbai",
    reasons: ["Asked pricing", "Asked delivery timeline", "Visited website 3 times"],
    signals: [{ label: "Pricing intent", weight: 32 }, { label: "Timeline urgency", weight: 28 }, { label: "Repeat visits", weight: 22 }, { label: "ICP fit", weight: 13 }],
    summary: "Requested enterprise quote and onboarding timelines twice this week. Director-level buyer with budget authority.",
  },
  {
    name: "Priya Mehta", company: "Mehta Logistics", title: "VP Finance",
    score: 92, revenue: 68000, status: "Hot", lastActivity: "45 min ago", lastActivityHours: 1,
    probability: 84, source: "Email", region: "Delhi NCR",
    reasons: ["Replied within 5 minutes", "Forwarded to CFO", "Requested security docs"],
    signals: [{ label: "Response velocity", weight: 30 }, { label: "Exec involvement", weight: 28 }, { label: "Security review", weight: 20 }, { label: "Account size", weight: 14 }],
    summary: "CFO looped in — security & compliance materials shared, awaiting MSA review by Friday.",
  },
  {
    name: "Arjun Kapoor", company: "BrightWave SaaS", title: "Head of Growth",
    score: 88, revenue: 52000, status: "Hot", lastActivity: "5 hours ago", lastActivityHours: 5,
    probability: 79, source: "Call", region: "Bengaluru",
    reasons: ["30-min discovery call", "Mentioned competitor switch", "Asked for trial"],
    signals: [{ label: "Discovery depth", weight: 28 }, { label: "Switch intent", weight: 26 }, { label: "Trial request", weight: 22 }, { label: "Champion identified", weight: 12 }],
    summary: "Evaluating against 2 vendors. Strong interest in automation playbooks. POC starts Monday.",
  },
  {
    name: "Neha Iyer", company: "Iyer Capital Partners", title: "Investment Associate",
    score: 76, revenue: 38000, status: "Warm", lastActivity: "1 day ago", lastActivityHours: 24,
    probability: 61, source: "Email", region: "Mumbai",
    reasons: ["Downloaded case study", "Opened 4 emails", "Booked demo"],
    signals: [{ label: "Content engagement", weight: 24 }, { label: "Demo booked", weight: 22 }, { label: "Open rate", weight: 18 }, { label: "ICP fit", weight: 12 }],
    summary: "Demo scheduled for Thursday. Currently mapping ROI internally with finance team.",
  },
  {
    name: "Vikram Singh", company: "Singh Realty Group", title: "Sales Director",
    score: 71, revenue: 28000, status: "Warm", lastActivity: "2 days ago", lastActivityHours: 48,
    probability: 54, source: "WhatsApp", region: "Pune",
    reasons: ["Asked about integrations", "Shared internal team", "Compared plans"],
    signals: [{ label: "Integration needs", weight: 22 }, { label: "Team expansion", weight: 20 }, { label: "Plan comparison", weight: 18 }, { label: "Budget signals", weight: 11 }],
    summary: "Decision committee of 4. Needs HubSpot integration confirmed before signing.",
  },
  {
    name: "Ananya Rao", company: "Rao & Co. Consultants", title: "Partner",
    score: 64, revenue: 19000, status: "Warm", lastActivity: "3 days ago", lastActivityHours: 72,
    probability: 47, source: "Call", region: "Hyderabad",
    reasons: ["Attended webinar", "Asked one follow-up", "Budget Q3"],
    signals: [{ label: "Webinar attendance", weight: 18 }, { label: "Follow-up", weight: 16 }, { label: "Future budget", weight: 16 }, { label: "Authority", weight: 14 }],
    summary: "Budget unlocks next quarter. Nurture cadence active. High potential for Q3 close.",
  },
  {
    name: "Karan Verma", company: "Verma Industries", title: "Marketing Manager",
    score: 48, revenue: 12000, status: "Cold", lastActivity: "8 days ago", lastActivityHours: 192,
    probability: 22, source: "Email", region: "Ahmedabad",
    reasons: ["Single page visit", "No replies in 2 weeks", "Junior contact"],
    signals: [{ label: "Low engagement", weight: 14 }, { label: "Stale thread", weight: 12 }, { label: "Junior buyer", weight: 12 }, { label: "Weak ICP", weight: 10 }],
    summary: "No engagement signals. Recommend re-engagement campaign with new case study.",
  },
  {
    name: "Sneha Pillai", company: "Pillai Foods", title: "Owner",
    score: 41, revenue: 9000, status: "Cold", lastActivity: "12 days ago", lastActivityHours: 288,
    probability: 16, source: "WhatsApp", region: "Kochi",
    reasons: ["Asked one question", "No follow-up", "Out of ICP"],
    signals: [{ label: "Single touch", weight: 12 }, { label: "Silent", weight: 12 }, { label: "Below ICP", weight: 10 }, { label: "Small team", weight: 7 }],
    summary: "Outside ICP — small ops team, low automation need. Park in long-term nurture.",
  },
  {
    name: "Manish Gupta", company: "Gupta Motors", title: "GM",
    score: 18, revenue: 0, status: "Lost", lastActivity: "21 days ago", lastActivityHours: 504,
    probability: 4, source: "Email", region: "Jaipur",
    reasons: ["Chose competitor", "Cited price", "Closed loop"],
    signals: [{ label: "Lost to comp.", weight: 8 }, { label: "Price sensitive", weight: 6 }, { label: "Closed", weight: 4 }],
    summary: "Closed-lost to incumbent vendor on price. Revisit in 6 months with renewal trigger.",
  },
  {
    name: "Aditi Bose", company: "Bose Pharmaceuticals", title: "Director, Digital",
    score: 90, revenue: 84000, status: "Hot", lastActivity: "30 min ago", lastActivityHours: 1,
    probability: 82, source: "Call", region: "Kolkata",
    reasons: ["Procurement intro", "Signed NDA", "Asked for SOW"],
    signals: [{ label: "Procurement", weight: 30 }, { label: "NDA signed", weight: 26 }, { label: "SOW request", weight: 22 }, { label: "Enterprise size", weight: 12 }],
    summary: "Procurement-stage. SOW drafted, legal review ongoing. Likely close within 14 days.",
  },
  {
    name: "Devansh Patel", company: "Patel & Sons Exports", title: "CEO",
    score: 69, revenue: 31000, status: "Warm", lastActivity: "4 days ago", lastActivityHours: 96,
    probability: 49, source: "Email", region: "Surat",
    reasons: ["Founder reply", "Asked references", "Compared 2 tools"],
    signals: [{ label: "Founder engaged", weight: 22 }, { label: "Reference call", weight: 18 }, { label: "Bake-off", weight: 16 }, { label: "Mid-market", weight: 13 }],
    summary: "Founder-led eval. Reference call requested with similar exporter customer.",
  },
];

const CATEGORY_META: Record<
  Category,
  { label: string; subtitle: string; icon: typeof Flame; bg: string; ring: string; text: string; dot: string }
> = {
  Hot:  { label: "Hot Leads",  subtitle: "Closing this week",  icon: Flame,      bg: "from-rose-500/15 via-orange-400/10 to-amber-300/10",  ring: "ring-rose-500/25",  text: "text-rose-600",  dot: "bg-rose-500" },
  Warm: { label: "Warm Leads", subtitle: "Active nurture",     icon: Thermometer, bg: "from-amber-400/15 via-yellow-300/10 to-orange-300/10", ring: "ring-amber-500/25", text: "text-amber-600", dot: "bg-amber-500" },
  Cold: { label: "Cold Leads", subtitle: "Re-engage",          icon: Snowflake,   bg: "from-sky-500/15 via-cyan-400/10 to-blue-300/10",       ring: "ring-sky-500/25",   text: "text-sky-600",   dot: "bg-sky-500" },
  Lost: { label: "Lost Leads", subtitle: "Revisit in 6 months", icon: XCircle,    bg: "from-slate-400/10 via-slate-300/5 to-slate-200/5",     ring: "ring-slate-400/25", text: "text-slate-500", dot: "bg-slate-400" },
};

const TREND = [
  { d: "Mon", hot: 4,  warm: 6,  cold: 3, revenue: 1.2 },
  { d: "Tue", hot: 6,  warm: 5,  cold: 4, revenue: 1.8 },
  { d: "Wed", hot: 8,  warm: 7,  cold: 5, revenue: 2.4 },
  { d: "Thu", hot: 7,  warm: 9,  cold: 4, revenue: 2.1 },
  { d: "Fri", hot: 11, warm: 8,  cold: 6, revenue: 3.2 },
  { d: "Sat", hot: 9,  warm: 7,  cold: 3, revenue: 2.6 },
  { d: "Sun", hot: 12, warm: 10, cold: 5, revenue: 3.8 },
];

const SOURCE_SPLIT = [
  { name: "WhatsApp", value: 42, color: "#22c55e" },
  { name: "Email",    value: 33, color: "#6366f1" },
  { name: "Call",     value: 25, color: "#8b5cf6" },
];

const SCORE_DIST = [
  { bucket: "0–20",   n: 6  },
  { bucket: "21–40",  n: 14 },
  { bucket: "41–60",  n: 22 },
  { bucket: "61–80",  n: 31 },
  { bucket: "81–100", n: 19 },
];

function fmtINR(n: number) {
  if (n >= 100000) return `₹${(n / 100000).toFixed(2)}L`;
  if (n >= 1000)   return `₹${(n / 1000).toFixed(0)}K`;
  return `₹${n}`;
}

function initials(name: string) {
  return name.split(" ").map((p) => p[0]).join("").slice(0, 2).toUpperCase();
}

/* ---------- Score Ring ---------- */
function ScoreRing({ value, size = 72, stroke = 7 }: { value: number; size?: number; stroke?: number }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (value / 100) * c;
  const color = value >= 80 ? "#f43f5e" : value >= 60 ? "#f59e0b" : value >= 40 ? "#0ea5e9" : "#94a3b8";
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <defs>
          <linearGradient id={`ring-${value}`} x1="0" x2="1" y1="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.9" />
            <stop offset="100%" stopColor="#6366f1" stopOpacity="0.9" />
          </linearGradient>
        </defs>
        <circle cx={size / 2} cy={size / 2} r={r} stroke="hsl(var(--border))" strokeOpacity="0.4" strokeWidth={stroke} fill="none" />
        <motion.circle
          cx={size / 2} cy={size / 2} r={r}
          stroke={`url(#ring-${value})`} strokeWidth={stroke} strokeLinecap="round" fill="none"
          initial={{ strokeDasharray: c, strokeDashoffset: c }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.1, ease: "easeOut" }}
        />
      </svg>
      <div className="absolute inset-0 grid place-items-center">
        <div className="text-center leading-tight">
          <div className="font-display text-base font-bold tabular-nums">{value}</div>
          <div className="text-[8px] font-semibold uppercase tracking-wider text-muted-foreground">/100</div>
        </div>
      </div>
    </div>
  );
}

/* ---------- Mini score bar (table) ---------- */
function ScoreBar({ value }: { value: number }) {
  const tone = value >= 80 ? "from-rose-500 to-orange-400" : value >= 60 ? "from-amber-500 to-yellow-400" : value >= 40 ? "from-sky-500 to-cyan-400" : "from-slate-400 to-slate-300";
  return (
    <div className="flex items-center gap-2.5">
      <div className="relative h-2 w-20 overflow-hidden rounded-full bg-surface-2">
        <motion.div
          initial={{ width: 0 }} animate={{ width: `${value}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className={`h-full rounded-full bg-linear-to-r ${tone}`}
        />
      </div>
      <span className="font-display text-[13px] font-bold tabular-nums">
        {value}<span className="text-muted-foreground font-medium">/100</span>
      </span>
    </div>
  );
}

/* ---------- Upload tile ---------- */
function UploadTile({
  label, hint, icon: Icon, tone, count, onAdd,
}: {
  label: string; hint: string; icon: typeof MessageSquare; tone: string;
  count: number; onAdd: () => void;
}) {
  const [dragOver, setDragOver] = useState(false);
  const [progress, setProgress] = useState<number | null>(null);

  const start = () => {
    setProgress(0);
    const id = setInterval(() => {
      setProgress((p) => {
        if (p === null) return null;
        if (p >= 100) { clearInterval(id); setTimeout(() => setProgress(null), 600); onAdd(); return 100; }
        return Math.min(100, p + 8 + Math.random() * 14);
      });
    }, 90);
  };

  return (
    <motion.div whileHover={{ y: -3 }} transition={{ type: "spring", stiffness: 320, damping: 22 }}>
      <button
        onClick={start}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => { e.preventDefault(); setDragOver(false); start(); }}
        className={`group relative flex w-full flex-col overflow-hidden rounded-2xl border bg-card p-5 text-left transition-all duration-300 ${
          dragOver ? "border-primary ring-4 ring-primary/15 scale-[1.01]" : "border-dashed border-border hover:border-primary/50 hover:shadow-elegant"
        }`}
      >
        <div className="pointer-events-none absolute -right-12 -top-12 size-40 rounded-full bg-gradient-mesh opacity-60 blur-2xl transition group-hover:opacity-100" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-linear-to-r from-transparent via-primary/30 to-transparent opacity-0 transition group-hover:opacity-100" />

        <div className="relative flex items-start gap-3.5">
          <motion.div
            animate={dragOver ? { scale: 1.08, rotate: -4 } : { scale: 1, rotate: 0 }}
            className={`grid size-12 place-items-center rounded-2xl ${tone} text-white shadow-glow`}
          >
            <Icon className="size-5" />
          </motion.div>
          <div className="min-w-0 flex-1">
            <p className="font-display text-[15px] font-semibold text-foreground">{label}</p>
            <p className="mt-0.5 text-[12px] text-muted-foreground">{hint}</p>
          </div>
          {count > 0 && (
            <span className="shrink-0 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[11px] font-bold text-emerald-700 ring-1 ring-emerald-500/20">
              {count}
            </span>
          )}
        </div>

        <div className="relative mt-4 flex items-center justify-between gap-3">
          <span className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-primary">
            {progress !== null ? <Loader2 className="size-3.5 animate-spin" /> : <Upload className="size-3.5" />}
            {progress !== null ? `Processing ${Math.round(progress)}%` : dragOver ? "Drop to upload" : "Drop files or click"}
          </span>
          <span className="text-[11px] font-medium text-muted-foreground">~90s</span>
        </div>

        <AnimatePresence>
          {progress !== null && (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="relative mt-3 h-1.5 overflow-hidden rounded-full bg-surface-2"
            >
              <motion.div
                className="h-full rounded-full bg-gradient-primary"
                initial={{ width: 0 }} animate={{ width: `${progress}%` }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </button>
    </motion.div>
  );
}

function Leads() {
  const [uploads, setUploads] = useState({ chats: 0, emails: 0, calls: 0 });
  const [filter, setFilter] = useState<Category | "All">("All");
  const [query, setQuery] = useState("");
  const [sortKey, setSortKey] = useState<"score" | "revenue" | "probability" | "recent">("score");
  const [selected, setSelected] = useState<Lead>(LEADS[0]);
  const [loading, setLoading] = useState(true);
  const didMount = useRef(false);

  // initial skeleton
  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 750);
    return () => clearTimeout(t);
  }, []);

  // re-trigger skeleton when uploads happen for that "AI is processing" feel
  useEffect(() => {
    if (!didMount.current) { didMount.current = true; return; }
    setLoading(true);
    const t = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(t);
  }, [uploads.chats, uploads.emails, uploads.calls]);

  const filtered = useMemo(() => {
    let rows = [...LEADS];
    if (filter !== "All") rows = rows.filter((r) => r.status === filter);
    if (query.trim()) {
      const q = query.toLowerCase();
      rows = rows.filter((r) => r.name.toLowerCase().includes(q) || r.company.toLowerCase().includes(q));
    }
    rows.sort((a, b) => {
      if (sortKey === "score") return b.score - a.score;
      if (sortKey === "revenue") return b.revenue - a.revenue;
      if (sortKey === "probability") return b.probability - a.probability;
      return a.lastActivityHours - b.lastActivityHours;
    });
    return rows;
  }, [filter, query, sortKey]);

  const counts = useMemo(() => {
    const c: Record<Category, number> = { Hot: 0, Warm: 0, Cold: 0, Lost: 0 };
    LEADS.forEach((l) => (c[l.status] += 1));
    return c;
  }, []);

  const pipelineValue = useMemo(
    () => LEADS.reduce((acc, l) => acc + l.revenue * (l.probability / 100), 0),
    [],
  );

  const hasUploads = uploads.chats + uploads.emails + uploads.calls > 0;
  const totalUploads = uploads.chats + uploads.emails + uploads.calls;

  return (
    <>
      <PageHeader
        eyebrow="Lead Intelligence"
        title="AI-scored leads across every channel."
        description="Drop WhatsApp chats, email threads, or call recordings. The Researcher Agent extracts intent signals, scores accounts, and explains every decision in plain English."
        actions={
          <>
            <button className="inline-flex h-10 items-center gap-2 rounded-xl border border-border bg-card px-4 text-[13px] font-semibold text-foreground shadow-xs transition hover:-translate-y-0.5 hover:shadow-soft">
              <Filter className="size-4" /> Saved views
            </button>
            <button className="group inline-flex h-10 items-center gap-2 rounded-xl bg-gradient-primary px-4 text-[13px] font-semibold text-white shadow-glow transition hover:-translate-y-0.5">
              <Download className="size-4" /> Export CSV
              <ArrowUpRight className="size-3.5 opacity-70 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </button>
          </>
        }
      />

      {/* Upload section */}
      <SectionCard
        title="Upload conversations"
        description="Drop in raw exports — we'll parse, redact PII, and score in under 90 seconds."
        actions={
          hasUploads ? (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-1 text-[11.5px] font-bold text-emerald-700 ring-1 ring-emerald-500/20">
              <CheckCircle2 className="size-3.5" /> {totalUploads} file{totalUploads > 1 ? "s" : ""} processed
            </span>
          ) : (
            <span className="hidden items-center gap-1.5 rounded-full border border-border bg-surface/60 px-2.5 py-1 text-[11.5px] font-medium text-muted-foreground sm:inline-flex">
              <Sparkles className="size-3.5 text-primary" /> AI parsing ready
            </span>
          )
        }
      >
        <div className="grid gap-3 sm:gap-4 md:grid-cols-3">
          <UploadTile label="Upload Chats"          hint="WhatsApp · Telegram · Slack · .txt / .zip" icon={MessageSquare} tone="bg-gradient-primary" count={uploads.chats}  onAdd={() => setUploads((s) => ({ ...s, chats:  s.chats  + 1 }))} />
          <UploadTile label="Upload Emails"         hint="Gmail · Outlook · .eml / .mbox"            icon={Mail}          tone="bg-gradient-violet"  count={uploads.emails} onAdd={() => setUploads((s) => ({ ...s, emails: s.emails + 1 }))} />
          <UploadTile label="Upload Call Recordings" hint="MP3 · WAV · M4A — auto-transcribed"        icon={Phone}         tone="bg-gradient-cyan"    count={uploads.calls}  onAdd={() => setUploads((s) => ({ ...s, calls:  s.calls  + 1 }))} />
        </div>
      </SectionCard>

      {/* Category cards */}
      <div className="grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-4">
        {(Object.keys(CATEGORY_META) as Category[]).map((c, i) => {
          const meta = CATEGORY_META[c];
          const Icon = meta.icon;
          const isActive = filter === c;
          const pct = Math.round((counts[c] / LEADS.length) * 100);
          return (
            <motion.button
              key={c}
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06, type: "spring", stiffness: 240, damping: 22 }}
              onClick={() => setFilter(isActive ? "All" : c)}
              className={`group relative overflow-hidden rounded-2xl border bg-card p-4 sm:p-5 text-left shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-elegant ${
                isActive ? "border-primary/50 ring-2 ring-primary/20" : "border-border"
              }`}
            >
              <div className={`absolute inset-0 -z-0 bg-linear-to-br ${meta.bg} opacity-90 transition group-hover:opacity-100`} />
              <div className="absolute -right-8 -top-8 size-24 rounded-full bg-white/40 blur-2xl transition group-hover:scale-110" />
              <div className="relative">
                <div className="flex items-start justify-between">
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className={`size-1.5 rounded-full ${meta.dot} animate-pulse`} />
                      <p className="text-[10.5px] font-bold uppercase tracking-wider text-muted-foreground">{meta.label}</p>
                    </div>
                    <p className="mt-1.5 font-display text-3xl font-bold text-foreground sm:text-4xl">{counts[c]}</p>
                    <p className={`mt-0.5 text-[11.5px] font-medium ${meta.text} truncate`}>{meta.subtitle}</p>
                  </div>
                  <div className={`grid size-9 sm:size-10 shrink-0 place-items-center rounded-xl bg-white/80 ring-1 ${meta.ring} ${meta.text} backdrop-blur transition group-hover:scale-110`}>
                    <Icon className="size-4 sm:size-5" />
                  </div>
                </div>
                <div className="mt-3 flex items-center gap-2">
                  <div className="h-1 flex-1 overflow-hidden rounded-full bg-white/50">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ delay: 0.2 + i * 0.05, duration: 0.7 }} className={`h-full ${meta.dot}`} />
                  </div>
                  <span className="text-[10.5px] font-semibold tabular-nums text-muted-foreground">{pct}%</span>
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Pipeline KPIs */}
      <div className="grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-4">
        {[
          { l: "Pipeline value",        v: fmtINR(pipelineValue), trend: "+23.4%", icon: TrendingUp,  tone: "bg-gradient-primary" },
          { l: "Avg. AI score",         v: Math.round(LEADS.reduce((a, l) => a + l.score, 0) / LEADS.length).toString(), trend: "+4.2", icon: Sparkles, tone: "bg-gradient-violet" },
          { l: "Avg. win probability",  v: `${Math.round(LEADS.reduce((a, l) => a + l.probability, 0) / LEADS.length)}%`, trend: "+6.1%", icon: Target, tone: "bg-gradient-cyan" },
          { l: "Median response time",  v: "4m 12s",              trend: "-18%",  icon: Zap,         tone: "bg-[linear-gradient(135deg,#10b981,#06b6d4)]" },
        ].map((k, i) => (
          <motion.div key={k.l} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.05 }}>
            <Surface hover className="group relative overflow-hidden p-4 sm:p-5">
              <div className="absolute -right-10 -top-10 size-28 rounded-full bg-gradient-mesh opacity-50 blur-2xl transition group-hover:opacity-80" />
              <div className="relative grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
                <div className="min-w-0">
                  <p className="text-[10.5px] font-bold uppercase tracking-wider text-muted-foreground truncate">{k.l}</p>
                  <p className="mt-1 font-display text-xl sm:text-2xl font-bold tabular-nums truncate">{k.v}</p>
                  <p className="mt-1 inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600">
                    <TrendingUp className="size-3" /> {k.trend} <span className="font-normal text-muted-foreground">7d</span>
                  </p>
                </div>
                <div className={`grid size-9 sm:size-10 shrink-0 place-items-center rounded-xl ${k.tone} text-white shadow-glow transition group-hover:scale-110 group-hover:rotate-3`}>
                  <k.icon className="size-4 sm:size-5" />
                </div>
              </div>
            </Surface>
          </motion.div>
        ))}
      </div>

      {/* Analytics */}
      <div className="grid gap-4 lg:gap-5 lg:grid-cols-3">
        <SectionCard
          title="Lead flow this week"
          description="New scored leads by temperature · ₹ in lakhs"
          actions={
            <div className="hidden items-center gap-3 text-[11px] sm:flex">
              {[{ k: "Hot", c: "bg-rose-500" }, { k: "Warm", c: "bg-amber-500" }, { k: "Cold", c: "bg-sky-500" }].map((x) => (
                <span key={x.k} className="inline-flex items-center gap-1.5 font-medium text-muted-foreground">
                  <span className={`size-2 rounded-full ${x.c}`} /> {x.k}
                </span>
              ))}
            </div>
          }
          className="lg:col-span-2"
        >
          <div className="h-56 sm:h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={TREND} margin={{ top: 10, right: 8, left: -22, bottom: 0 }}>
                <defs>
                  <linearGradient id="g-hot"  x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#f43f5e" stopOpacity={0.55} /><stop offset="100%" stopColor="#f43f5e" stopOpacity={0} /></linearGradient>
                  <linearGradient id="g-warm" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#f59e0b" stopOpacity={0.5} /><stop offset="100%" stopColor="#f59e0b" stopOpacity={0} /></linearGradient>
                  <linearGradient id="g-cold" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#0ea5e9" stopOpacity={0.45} /><stop offset="100%" stopColor="#0ea5e9" stopOpacity={0} /></linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 6" stroke="hsl(var(--border))" vertical={false} opacity={0.6} />
                <XAxis dataKey="d" stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} dy={6} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip
                  cursor={{ stroke: "hsl(var(--primary))", strokeWidth: 1, strokeDasharray: "4 4", opacity: 0.4 }}
                  contentStyle={{ borderRadius: 14, border: "1px solid hsl(var(--border))", fontSize: 12, boxShadow: "0 10px 30px -10px rgba(15,23,42,0.2)" }}
                />
                <Area type="monotone" dataKey="hot"  stroke="#f43f5e" fill="url(#g-hot)"  strokeWidth={2.2} />
                <Area type="monotone" dataKey="warm" stroke="#f59e0b" fill="url(#g-warm)" strokeWidth={2.2} />
                <Area type="monotone" dataKey="cold" stroke="#0ea5e9" fill="url(#g-cold)" strokeWidth={2.2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>

        <SectionCard title="Channel mix" description="Where leads originate">
          <div className="flex h-56 sm:h-64 items-center gap-4">
            <div className="relative h-full flex-1">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={SOURCE_SPLIT} dataKey="value" innerRadius={48} outerRadius={78} paddingAngle={4} stroke="none">
                    {SOURCE_SPLIT.map((s) => <Cell key={s.name} fill={s.color} />)}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: 14, border: "1px solid hsl(var(--border))", fontSize: 12 }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="pointer-events-none absolute inset-0 grid place-items-center">
                <div className="text-center">
                  <div className="font-display text-2xl font-bold">{LEADS.length}</div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Leads</div>
                </div>
              </div>
            </div>
            <div className="space-y-2 pr-1">
              {SOURCE_SPLIT.map((s) => (
                <div key={s.name} className="flex items-center gap-2 text-[12.5px]">
                  <span className="size-2.5 rounded-full" style={{ background: s.color }} />
                  <span className="font-semibold text-foreground">{s.name}</span>
                  <span className="font-bold tabular-nums text-muted-foreground">{s.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </SectionCard>
      </div>

      {/* Table + Explanation */}
      <div className="grid gap-4 lg:gap-5 lg:grid-cols-[1.65fr_1fr]">
        <SectionCard
          title="Scored leads"
          description={`${filtered.length} of ${LEADS.length} accounts · click a row to inspect`}
          actions={
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-2 rounded-lg border border-border bg-background px-2.5 py-1.5 transition focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/15">
                <Search className="size-3.5 text-muted-foreground" />
                <input
                  value={query} onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search accounts…"
                  className="w-32 bg-transparent text-[12.5px] outline-none placeholder:text-muted-foreground sm:w-40"
                />
              </div>
              <div className="hidden items-center gap-1 rounded-lg border border-border bg-background p-1 text-[12px] sm:flex">
                {(["All", "Hot", "Warm", "Cold", "Lost"] as const).map((f) => (
                  <button
                    key={f} onClick={() => setFilter(f)}
                    className={`rounded-md px-2.5 py-1 font-semibold transition ${
                      filter === f ? "bg-gradient-primary text-white shadow-glow" : "text-muted-foreground hover:bg-surface hover:text-foreground"
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
              <select
                value={sortKey} onChange={(e) => setSortKey(e.target.value as typeof sortKey)}
                className="rounded-lg border border-border bg-background px-2 py-1.5 text-[12.5px] font-semibold text-foreground outline-none transition hover:border-primary/50"
              >
                <option value="score">Sort: AI score</option>
                <option value="revenue">Sort: Revenue</option>
                <option value="probability">Sort: Probability</option>
                <option value="recent">Sort: Most recent</option>
              </select>
            </div>
          }
        >
          {/* Mobile category chips */}
          <div className="mb-3 hidden items-center gap-1.5 overflow-x-auto rounded-lg border border-border bg-background p-1 text-[12px] max-sm:flex">
            {(["All", "Hot", "Warm", "Cold", "Lost"] as const).map((f) => (
              <button
                key={f} onClick={() => setFilter(f)}
                className={`shrink-0 rounded-md px-2.5 py-1 font-semibold transition ${
                  filter === f ? "bg-gradient-primary text-white shadow-glow" : "text-muted-foreground"
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="space-y-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3 rounded-xl border border-border bg-surface/40 p-3">
                  <div className="size-10 animate-pulse rounded-xl bg-surface-2" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3 w-1/3 animate-pulse rounded bg-surface-2" />
                    <div className="h-2 w-1/2 animate-pulse rounded bg-surface-2" />
                  </div>
                  <div className="h-2 w-20 animate-pulse rounded bg-surface-2" />
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-3 py-14 text-center">
              <div className="grid size-14 place-items-center rounded-2xl bg-gradient-mesh">
                <Inbox className="size-6 text-primary" />
              </div>
              <div>
                <p className="font-display text-sm font-semibold">No leads match your filters</p>
                <p className="mt-0.5 text-[12.5px] text-muted-foreground">Try clearing the search or switching category.</p>
              </div>
              <button onClick={() => { setQuery(""); setFilter("All"); }} className="rounded-lg border border-border bg-card px-3 py-1.5 text-[12px] font-semibold hover:bg-surface">
                Reset filters
              </button>
            </div>
          ) : (
            <>
              {/* Desktop table */}
              <div className="hidden overflow-x-auto md:block">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-[10.5px] font-bold uppercase tracking-wider text-muted-foreground">
                      <th className="pb-3">Account</th>
                      <th className="pb-3"><span className="inline-flex items-center gap-1">Score <ArrowUpDown className="size-3" /></span></th>
                      <th className="pb-3">Expected revenue</th>
                      <th className="pb-3">Status</th>
                      <th className="pb-3">Last activity</th>
                      <th className="pb-3">Probability</th>
                      <th className="pb-3"></th>
                    </tr>
                  </thead>
                  <tbody>
                    <AnimatePresence initial={false}>
                      {filtered.map((l, idx) => {
                        const meta = CATEGORY_META[l.status];
                        const Icon = meta.icon;
                        const active = selected.name === l.name;
                        return (
                          <motion.tr
                            key={l.name}
                            layout
                            initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                            transition={{ delay: idx * 0.025 }}
                            onClick={() => setSelected(l)}
                            className={`group cursor-pointer border-t border-border transition-all hover:bg-linear-to-r hover:from-primary/[0.04] hover:to-transparent ${
                              active ? "bg-linear-to-r from-primary/[0.06] to-transparent" : ""
                            }`}
                          >
                            <td className="py-3.5 pr-3">
                              <div className="flex items-center gap-3">
                                <div className={`relative grid size-10 shrink-0 place-items-center rounded-xl bg-gradient-primary text-[12px] font-bold text-white shadow-glow ${active ? "ring-2 ring-primary/40 ring-offset-2 ring-offset-card" : ""}`}>
                                  {initials(l.name)}
                                  <span className={`absolute -bottom-0.5 -right-0.5 size-3 rounded-full ${meta.dot} ring-2 ring-card`} />
                                </div>
                                <div className="min-w-0">
                                  <p className="truncate font-semibold text-foreground">{l.name}</p>
                                  <p className="truncate text-[11.5px] text-muted-foreground">{l.company} · {l.region}</p>
                                </div>
                              </div>
                            </td>
                            <td className="pr-3"><ScoreBar value={l.score} /></td>
                            <td className="pr-3 font-display text-[13px] font-bold tabular-nums text-foreground">{fmtINR(l.revenue)}</td>
                            <td className="pr-3">
                              <Badge variant="secondary" className={`gap-1 ${meta.text} bg-white ring-1 ${meta.ring}`}>
                                <Icon className="size-3" /> {l.status} Lead
                              </Badge>
                            </td>
                            <td className="pr-3 whitespace-nowrap text-[12.5px] text-muted-foreground">
                              <span className="inline-flex items-center gap-1.5"><Clock className="size-3" /> {l.lastActivity}</span>
                            </td>
                            <td className="pr-3">
                              <div className="flex items-center gap-2">
                                <span className="font-display text-[13px] font-bold tabular-nums">{l.probability}%</span>
                                <Activity className={`size-3.5 ${l.probability >= 75 ? "text-emerald-500" : l.probability >= 50 ? "text-amber-500" : "text-muted-foreground"}`} />
                              </div>
                            </td>
                            <td className="text-right">
                              <ChevronRight className={`size-4 text-muted-foreground transition group-hover:translate-x-0.5 group-hover:text-primary ${active ? "text-primary" : ""}`} />
                            </td>
                          </motion.tr>
                        );
                      })}
                    </AnimatePresence>
                  </tbody>
                </table>
              </div>

              {/* Mobile cards */}
              <div className="space-y-2.5 md:hidden">
                <AnimatePresence initial={false}>
                  {filtered.map((l, idx) => {
                    const meta = CATEGORY_META[l.status];
                    const Icon = meta.icon;
                    const active = selected.name === l.name;
                    return (
                      <motion.button
                        key={l.name}
                        layout
                        initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                        transition={{ delay: idx * 0.03 }}
                        onClick={() => setSelected(l)}
                        className={`w-full rounded-2xl border p-3.5 text-left transition ${active ? "border-primary/40 bg-primary/[0.04] shadow-soft" : "border-border bg-card hover:border-primary/30"}`}
                      >
                        <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3">
                          <div className="relative grid size-10 shrink-0 place-items-center rounded-xl bg-gradient-primary text-[12px] font-bold text-white shadow-glow">
                            {initials(l.name)}
                            <span className={`absolute -bottom-0.5 -right-0.5 size-3 rounded-full ${meta.dot} ring-2 ring-card`} />
                          </div>
                          <div className="min-w-0">
                            <p className="truncate text-[13.5px] font-semibold">{l.name}</p>
                            <p className="truncate text-[11.5px] text-muted-foreground">{l.company}</p>
                          </div>
                          <Badge variant="secondary" className={`shrink-0 gap-1 ${meta.text} bg-white ring-1 ${meta.ring}`}>
                            <Icon className="size-3" /> {l.status}
                          </Badge>
                        </div>
                        <div className="mt-3 flex items-center justify-between gap-3">
                          <ScoreBar value={l.score} />
                          <div className="text-right">
                            <p className="font-display text-[13px] font-bold tabular-nums">{fmtINR(l.revenue)}</p>
                            <p className="text-[10.5px] font-medium text-muted-foreground">{l.probability}% · {l.lastActivity}</p>
                          </div>
                        </div>
                      </motion.button>
                    );
                  })}
                </AnimatePresence>
              </div>
            </>
          )}
        </SectionCard>

        {/* AI Explanation */}
        <SectionCard
          title="AI explanation"
          description="Why this lead scored what it did"
          actions={<span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-1 text-[11px] font-bold text-primary ring-1 ring-primary/15"><Sparkles className="size-3" /> GPT-4 reasoning</span>}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={selected.name}
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.28, ease: "easeOut" }}
              className="space-y-4"
            >
              {/* Header */}
              <div className="flex items-center gap-3">
                <div className="relative grid size-12 shrink-0 place-items-center rounded-2xl bg-gradient-primary text-sm font-bold text-white shadow-glow">
                  {initials(selected.name)}
                  <span className={`absolute -bottom-0.5 -right-0.5 size-3.5 rounded-full ${CATEGORY_META[selected.status].dot} ring-2 ring-card animate-pulse`} />
                </div>
                <div className="min-w-0">
                  <p className="truncate font-display text-base font-bold">{selected.name}</p>
                  <p className="truncate text-[11.5px] text-muted-foreground">
                    <Building2 className="mr-1 inline size-3" />{selected.company} · {selected.title}
                  </p>
                </div>
              </div>

              {/* Score hero */}
              <div className="relative overflow-hidden rounded-2xl border border-border bg-linear-to-br from-primary/10 via-violet-500/5 to-cyan-500/10 p-4">
                <div className="absolute -right-8 -top-8 size-32 rounded-full bg-gradient-mesh opacity-60 blur-2xl" />
                <div className="relative flex items-center gap-4">
                  <ScoreRing value={selected.score} size={80} stroke={8} />
                  <div className="min-w-0 flex-1">
                    <p className="text-[10.5px] font-bold uppercase tracking-wider text-muted-foreground">Lead Score</p>
                    <p className="font-display text-2xl font-bold leading-tight">
                      {selected.score >= 80 ? "Exceptional" : selected.score >= 60 ? "Promising" : selected.score >= 40 ? "Developing" : "Low"}
                    </p>
                    <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                      <Badge className={`gap-1 bg-white text-[10.5px] ring-1 ${CATEGORY_META[selected.status].ring} ${CATEGORY_META[selected.status].text}`}>
                        {selected.status} Lead
                      </Badge>
                      <span className="rounded-full bg-white/70 px-2 py-0.5 text-[10.5px] font-semibold text-muted-foreground ring-1 ring-border">
                        via {selected.source}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Reasons */}
              <div>
                <p className="mb-2 text-[10.5px] font-bold uppercase tracking-wider text-muted-foreground">Why this score</p>
                <ul className="space-y-2">
                  {selected.reasons.map((r, i) => (
                    <motion.li
                      key={r}
                      initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.05 + i * 0.06 }}
                      className="flex items-start gap-2.5 rounded-xl border border-border bg-surface/60 px-3 py-2.5 text-[13px] transition hover:border-primary/30 hover:bg-surface"
                    >
                      <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-emerald-600" />
                      <span className="text-foreground">{r}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>

              {/* Signal weights */}
              <div>
                <p className="mb-2 text-[10.5px] font-bold uppercase tracking-wider text-muted-foreground">Signal contribution</p>
                <div className="space-y-2">
                  {selected.signals.map((s, i) => (
                    <div key={s.label} className="space-y-1">
                      <div className="flex items-center justify-between text-[11.5px]">
                        <span className="font-medium text-foreground">{s.label}</span>
                        <span className="font-bold tabular-nums text-muted-foreground">+{s.weight}</span>
                      </div>
                      <div className="h-1.5 overflow-hidden rounded-full bg-surface-2">
                        <motion.div
                          initial={{ width: 0 }} animate={{ width: `${(s.weight / 35) * 100}%` }}
                          transition={{ delay: 0.1 + i * 0.08, duration: 0.7, ease: "easeOut" }}
                          className="h-full rounded-full bg-gradient-primary"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Summary */}
              <div className="rounded-xl border border-border bg-card p-3">
                <p className="text-[10.5px] font-bold uppercase tracking-wider text-muted-foreground">AI Summary</p>
                <p className="mt-1 text-[13px] leading-relaxed text-foreground">{selected.summary}</p>
              </div>

              {/* Metrics */}
              <div className="grid grid-cols-2 gap-2">
                <div className="rounded-xl border border-border bg-surface/50 p-3 transition hover:border-primary/30">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Expected revenue</p>
                  <p className="font-display text-lg font-bold tabular-nums">{fmtINR(selected.revenue)}</p>
                </div>
                <div className="rounded-xl border border-border bg-surface/50 p-3 transition hover:border-primary/30">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Win probability</p>
                  <p className="font-display text-lg font-bold tabular-nums">{selected.probability}%</p>
                </div>
              </div>

              <button className="group inline-flex w-full items-center justify-center gap-1.5 rounded-xl bg-gradient-primary px-4 py-2.5 text-[13px] font-semibold text-white shadow-glow transition hover:-translate-y-0.5 hover:shadow-elegant">
                Assign to Closer Agent
                <ChevronRight className="size-4 transition group-hover:translate-x-0.5" />
              </button>
            </motion.div>
          </AnimatePresence>
        </SectionCard>
      </div>

      {/* Score distribution */}
      <SectionCard
        title="Score distribution"
        description="How the entire pipeline is scored today"
        actions={<span className="hidden rounded-full border border-border bg-surface/60 px-2.5 py-1 text-[11px] font-medium text-muted-foreground sm:inline-flex">Updated 2 min ago</span>}
      >
        <div className="h-48 sm:h-56">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={SCORE_DIST} margin={{ top: 10, right: 8, left: -22, bottom: 0 }} barSize={48}>
              <defs>
                <linearGradient id="bar" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6366f1" />
                  <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0.7} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 6" stroke="hsl(var(--border))" vertical={false} opacity={0.6} />
              <XAxis dataKey="bucket" stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} dy={6} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} />
              <Tooltip
                cursor={{ fill: "hsl(var(--primary))", opacity: 0.06 }}
                contentStyle={{ borderRadius: 14, border: "1px solid hsl(var(--border))", fontSize: 12, boxShadow: "0 10px 30px -10px rgba(15,23,42,0.2)" }}
              />
              <Bar dataKey="n" fill="url(#bar)" radius={[10, 10, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </SectionCard>
    </>
  );
}
