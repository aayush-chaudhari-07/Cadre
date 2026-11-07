import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, SectionCard, Surface } from "@/components/flow/primitives";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export const Route = createFileRoute("/_app/settings")({
  head: () => ({ meta: [{ title: "Settings — FlowMind AI" }] }),
  component: Settings,
});

const settings = [
  { title: "Autonomous mode", desc: "Allow agents to execute high-confidence actions without your approval.", on: true },
  { title: "Slack notifications", desc: "Daily digest + critical alerts in #flowmind.", on: true },
  { title: "Auto-publish insights", desc: "Push briefs to leadership channels each morning.", on: false },
  { title: "Anonymous benchmarking", desc: "Compare your metrics to peer companies.", on: true },
];

function Settings() {
  return (
    <>
      <PageHeader
        eyebrow="Settings"
        title="Workspace & preferences."
        description="Tune how aggressively your AI workforce operates."
      />
      <div className="grid gap-5 lg:grid-cols-[1fr_1.4fr]">
        <SectionCard title="Profile">
          <div className="flex items-center gap-4">
            <Avatar className="size-16">
              <AvatarFallback className="bg-gradient-primary text-base font-semibold text-white">AM</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-display text-[15px] font-semibold">Alex Morgan</p>
              <p className="text-[12px] text-muted-foreground">Co-founder, Acme Inc.</p>
              <button className="mt-2 text-[12px] font-semibold text-primary hover:underline">Change avatar</button>
            </div>
          </div>
          <div className="mt-5 space-y-3">
            <div>
              <Label className="text-[12px]">Display name</Label>
              <Input defaultValue="Alex Morgan" className="mt-1.5 h-10" />
            </div>
            <div>
              <Label className="text-[12px]">Work email</Label>
              <Input defaultValue="alex@acme.com" className="mt-1.5 h-10" />
            </div>
            <div>
              <Label className="text-[12px]">Company</Label>
              <Input defaultValue="Acme Inc." className="mt-1.5 h-10" />
            </div>
            <button className="mt-2 w-full rounded-xl bg-gradient-primary py-2.5 text-[13px] font-semibold text-white shadow-glow">
              Save changes
            </button>
          </div>
        </SectionCard>

        <div className="space-y-5">
          <SectionCard title="Agent behavior">
            <div className="space-y-3">
              {settings.map((s) => (
                <Surface key={s.title} className="flex items-start justify-between gap-4 p-4">
                  <div>
                    <p className="text-[13.5px] font-semibold">{s.title}</p>
                    <p className="mt-0.5 text-[12px] text-muted-foreground">{s.desc}</p>
                  </div>
                  <Switch defaultChecked={s.on} />
                </Surface>
              ))}
            </div>
          </SectionCard>
          <SectionCard title="Plan" description="You're on the Pro plan.">
            <div className="rounded-2xl bg-gradient-primary p-5 text-white shadow-glow">
              <p className="text-[11px] font-semibold uppercase tracking-wider opacity-80">Pro</p>
              <p className="mt-1 font-display text-2xl font-semibold">$249<span className="text-sm font-medium opacity-80"> / month</span></p>
              <p className="mt-1.5 text-[12.5px] opacity-90">Unlimited agents, AI CEO, priority compute.</p>
              <button className="mt-4 rounded-xl bg-white/15 px-3 py-2 text-[12.5px] font-semibold backdrop-blur hover:bg-white/25">
                Manage subscription
              </button>
            </div>
          </SectionCard>
        </div>
      </div>
    </>
  );
}
