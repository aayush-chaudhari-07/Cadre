import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PageHeader, SectionCard, Surface, StatCard, Skeleton } from "@/components/flow/primitives";
import {
  Upload,
  Mic,
  Video,
  FileAudio,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
  FileText,
  Clock,
  Users,
  Play,
  Download,
  Share2,
  MessageSquare,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_app/meetings")({
  head: () => ({ meta: [{ title: "Meeting Analyzer — FlowMind AI" }] }),
  component: Meetings,
});

type UploadKind = "audio" | "video" | "recording";

const uploadTiles: { kind: UploadKind; title: string; subtitle: string; icon: typeof Mic; tone: string }[] = [
  { kind: "audio", title: "Upload Audio", subtitle: "MP3 · WAV · M4A up to 500MB", icon: Mic, tone: "from-indigo-500 to-violet-500" },
  { kind: "video", title: "Upload Video", subtitle: "MP4 · MOV · WebM with auto-transcription", icon: Video, tone: "from-violet-500 to-fuchsia-500" },
  { kind: "recording", title: "Meeting Recording", subtitle: "Zoom · Meet · Teams direct import", icon: FileAudio, tone: "from-cyan-500 to-indigo-500" },
];

const recentMeeting = {
  title: "Acme Corp — Q4 Expansion Discovery",
  participants: ["Priya Mehta (You)", "Daniel Cho — VP Ops, Acme", "Sara Lin — CFO, Acme"],
  duration: "47:12",
  date: "Today · 10:30 AM IST",
  sentiment: 0.82,
  outcome: "Positive",
};

const summary = `Acme Corp is replacing their legacy automation vendor by Q1. Daniel confirmed an annual budget of ₹48L and emphasized SOC2 + Indian data residency as deal-breakers. Sara (CFO) needs a 14-month ROI model before sign-off. Strong fit on workflow automation; mild concern on onboarding velocity given their 9-region rollout.`;

const actionItems = [
  { owner: "Priya", task: "Send SOC2 attestation + DPA draft", due: "Today", priority: "high" },
  { owner: "Priya", task: "Build 14-month ROI model with Sara's CFO template", due: "Wed", priority: "high" },
  { owner: "Solutions", task: "Scope 9-region rollout — phased onboarding plan", due: "Fri", priority: "med" },
  { owner: "Priya", task: "Loop in Daniel's security lead for technical deep-dive", due: "Mon", priority: "med" },
];

const opportunities = [
  { title: "Multi-region expansion", value: "₹48L ARR", confidence: 84, note: "Daniel volunteered the budget unprompted — strong intent signal." },
  { title: "Cross-sell: Analytics Agent", value: "₹12L ARR", confidence: 67, note: "Sara asked twice about predictive churn — open lane." },
  { title: "Reference customer", value: "Strategic", confidence: 72, note: "Acme open to a joint case study post-launch." },
];

const risks = [
  { title: "CFO ROI gate", severity: "high", note: "Without a defensible 14-month ROI model, Sara will block at procurement." },
  { title: "SOC2 timing", severity: "med", note: "Our Type II audit completes Feb 14 — close to their Q1 freeze date." },
  { title: "Onboarding bandwidth", severity: "med", note: "9 regions in 60 days is aggressive; risk of CSAT dip." },
];

function Meetings() {
  const [active, setActive] = useState<UploadKind | null>(null);
  const [processing, setProcessing] = useState(false);
  const [analyzed, setAnalyzed] = useState(true);

  const handleUpload = (kind: UploadKind) => {
    setActive(kind);
    setProcessing(true);
    setAnalyzed(false);
    setTimeout(() => {
      setProcessing(false);
      setAnalyzed(true);
    }, 1600);
  };

  return (
    <>
      <PageHeader
        eyebrow="Meeting Analyzer"
        title="Every call, decoded into deals."
        description="Upload any recording — we transcribe, summarize, extract action items, and surface revenue & risk signals in under 60 seconds."
        actions={
          <>
            <Button variant="outline" size="sm" className="gap-1.5"><Share2 className="size-3.5" /> Share report</Button>
            <Button size="sm" className="gap-1.5 bg-gradient-primary"><Download className="size-3.5" /> Export PDF</Button>
          </>
        }
      />

      {/* Upload */}
      <SectionCard
        title="Upload a meeting"
        description="Drop a file or connect your conferencing tool — analysis runs automatically."
      >
        <div className="grid gap-3 md:grid-cols-3">
          {uploadTiles.map((t) => {
            const Icon = t.icon;
            const isActive = active === t.kind;
            return (
              <motion.button
                key={t.kind}
                onClick={() => handleUpload(t.kind)}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.99 }}
                className={cn(
                  "group relative overflow-hidden rounded-2xl border bg-card p-5 text-left transition-all",
                  isActive ? "border-primary/40 shadow-glow" : "border-border hover:border-primary/30 hover:shadow-elegant",
                )}
              >
                <div className="absolute -right-10 -top-10 size-28 rounded-full bg-gradient-mesh opacity-60 blur-2xl" />
                <div className={cn("relative grid size-11 place-items-center rounded-xl bg-gradient-to-br text-white shadow-glow", t.tone)}>
                  <Icon className="size-5" />
                </div>
                <p className="relative mt-3 font-display text-[14px] font-semibold">{t.title}</p>
                <p className="relative mt-0.5 text-[12px] text-muted-foreground">{t.subtitle}</p>
                <div className="relative mt-3 flex items-center gap-1.5 text-[11.5px] font-medium text-primary opacity-0 transition group-hover:opacity-100">
                  <Upload className="size-3" /> Drop file or browse
                </div>
              </motion.button>
            );
          })}
        </div>
        <AnimatePresence>
          {processing && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-4 flex items-center gap-3 rounded-xl border border-border bg-surface-2/60 p-3 text-[12.5px]"
            >
              <div className="size-2 animate-pulse rounded-full bg-primary" />
              <span className="font-medium">Transcribing & analyzing…</span>
              <span className="text-muted-foreground">Whisper-3 → GPT reasoning → action extraction</span>
            </motion.div>
          )}
        </AnimatePresence>
      </SectionCard>

      {/* Meeting header card */}
      <SectionCard>
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-start gap-4">
            <div className="grid size-12 shrink-0 place-items-center rounded-xl bg-gradient-primary text-white shadow-glow">
              <Play className="size-5" fill="currentColor" />
            </div>
            <div className="min-w-0">
              <p className="font-display text-[16px] font-semibold">{recentMeeting.title}</p>
              <div className="mt-1 flex flex-wrap items-center gap-3 text-[12px] text-muted-foreground">
                <span className="inline-flex items-center gap-1"><Clock className="size-3" /> {recentMeeting.date}</span>
                <span>{recentMeeting.duration}</span>
                <span className="inline-flex items-center gap-1"><Users className="size-3" /> {recentMeeting.participants.length} attendees</span>
                <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-700">{recentMeeting.outcome}</Badge>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-[10.5px] font-medium uppercase tracking-wider text-muted-foreground">Sentiment</p>
              <p className="font-display text-xl font-semibold">{Math.round(recentMeeting.sentiment * 100)}%</p>
            </div>
            <div className="h-12 w-px bg-border" />
            <div className="text-right">
              <p className="text-[10.5px] font-medium uppercase tracking-wider text-muted-foreground">AI Confidence</p>
              <p className="font-display text-xl font-semibold">94%</p>
            </div>
          </div>
        </div>
      </SectionCard>

      {/* Results grid */}
      <div className="grid gap-5 xl:grid-cols-[1.4fr_1fr]">
        <div className="space-y-5">
          {/* Executive summary */}
          <SectionCard
            title="Executive Summary"
            description="Generated by FlowMind Reasoning · 12s"
            actions={<Badge className="bg-gradient-primary text-white"><Sparkles className="mr-1 size-3" /> AI</Badge>}
          >
            {!analyzed ? (
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-11/12" />
                <Skeleton className="h-4 w-9/12" />
              </div>
            ) : (
              <p className="text-[14px] leading-relaxed text-foreground/90">{summary}</p>
            )}
            <div className="mt-4 flex flex-wrap gap-2">
              {["Budget confirmed", "SOC2 critical", "Q1 deadline", "CFO sign-off needed"].map((t) => (
                <Badge key={t} variant="secondary" className="bg-surface-2 text-[11px] text-accent-foreground">{t}</Badge>
              ))}
            </div>
          </SectionCard>

          {/* Action items */}
          <SectionCard title="Action Items" description="Auto-assigned with due dates">
            <div className="divide-y divide-border">
              {actionItems.map((a, i) => (
                <motion.div
                  key={a.task}
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="flex items-start gap-3 py-3 first:pt-0 last:pb-0"
                >
                  <div className={cn(
                    "mt-0.5 grid size-6 place-items-center rounded-full",
                    a.priority === "high" ? "bg-rose-500/10 text-rose-600" : "bg-amber-500/10 text-amber-600",
                  )}>
                    <CheckCircle2 className="size-3.5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[13.5px] font-medium">{a.task}</p>
                    <p className="mt-0.5 text-[11.5px] text-muted-foreground">Owner: <span className="font-medium text-foreground/80">{a.owner}</span> · Due {a.due}</p>
                  </div>
                  <Badge variant="outline" className={cn(
                    "text-[10.5px]",
                    a.priority === "high" ? "border-rose-500/30 text-rose-700" : "border-amber-500/30 text-amber-700",
                  )}>{a.priority === "high" ? "High" : "Medium"}</Badge>
                </motion.div>
              ))}
            </div>
          </SectionCard>
        </div>

        <div className="space-y-5">
          {/* Sales opportunities */}
          <SectionCard title="Sales Opportunities" actions={<TrendingUp className="size-4 text-emerald-600" />}>
            <div className="space-y-3">
              {opportunities.map((o) => (
                <Surface key={o.title} hover className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="font-display text-[13.5px] font-semibold">{o.title}</p>
                      <p className="mt-0.5 text-[11.5px] text-muted-foreground leading-snug">{o.note}</p>
                    </div>
                    <Badge className="bg-gradient-to-br from-emerald-500 to-cyan-500 text-white">{o.value}</Badge>
                  </div>
                  <div className="mt-3">
                    <div className="mb-1 flex justify-between text-[10.5px] text-muted-foreground">
                      <span>Confidence</span>
                      <span className="font-medium text-foreground/80">{o.confidence}%</span>
                    </div>
                    <div className="h-1.5 overflow-hidden rounded-full bg-surface-2">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${o.confidence}%` }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500"
                      />
                    </div>
                  </div>
                </Surface>
              ))}
            </div>
          </SectionCard>

          {/* Risk points */}
          <SectionCard title="Risk Points" actions={<AlertTriangle className="size-4 text-rose-600" />}>
            <div className="space-y-3">
              {risks.map((r) => (
                <div key={r.title} className={cn(
                  "rounded-xl border p-3.5",
                  r.severity === "high" ? "border-rose-500/30 bg-rose-500/5" : "border-amber-500/30 bg-amber-500/5",
                )}>
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-display text-[13px] font-semibold">{r.title}</p>
                    <Badge variant="outline" className={cn(
                      "text-[10px] uppercase",
                      r.severity === "high" ? "border-rose-500/40 text-rose-700" : "border-amber-500/40 text-amber-700",
                    )}>{r.severity}</Badge>
                  </div>
                  <p className="mt-1 text-[12px] leading-snug text-muted-foreground">{r.note}</p>
                </div>
              ))}
            </div>
          </SectionCard>

          <SectionCard title="Coaching tip" description="From the Closer Agent">
            <div className="rounded-xl bg-gradient-primary p-4 text-white shadow-glow">
              <MessageSquare className="size-5 opacity-90" />
              <p className="mt-2 text-[13px] font-semibold leading-snug">
                You spoke 58% of the time. Top closers stay at 42%. Try mirroring Sara's ROI language back to her on the next call.
              </p>
            </div>
          </SectionCard>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Meetings analyzed" value="148" delta={{ value: "+22", trend: "up" }} icon={<FileText className="size-5" />} tone="primary" index={0} />
        <StatCard label="Action items shipped" value="1,204" delta={{ value: "+18%", trend: "up" }} icon={<CheckCircle2 className="size-5" />} tone="violet" index={1} />
        <StatCard label="Opportunities surfaced" value="₹3.2Cr" delta={{ value: "+34%", trend: "up" }} icon={<TrendingUp className="size-5" />} tone="success" index={2} />
        <StatCard label="Avg analysis time" value="42s" icon={<Clock className="size-5" />} tone="cyan" index={3} />
      </div>
    </>
  );
}
