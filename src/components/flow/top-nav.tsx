import { useState } from "react";
import { Bell, Search, Command, Plus, Sparkles, Menu, Check } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";

const notifications = [
  { title: "Closer Agent booked 3 new demos", time: "2m ago", tone: "success" },
  { title: "Churn risk detected: Acme Corp", time: "18m ago", tone: "warning" },
  { title: "Revenue forecast updated +12%", time: "1h ago", tone: "info" },
  { title: "Competitor priced down by 8%", time: "3h ago", tone: "warning" },
];

export function TopNav({ onMenuClick }: { onMenuClick?: () => void }) {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-2 border-b border-border bg-background/80 px-3 backdrop-blur-xl md:gap-3 md:px-6">
      <button
        onClick={onMenuClick}
        className="grid size-9 shrink-0 place-items-center rounded-lg border border-border lg:hidden"
        aria-label="Open navigation menu"
      >
        <Menu className="size-4" aria-hidden />
      </button>

      {/* Search */}
      <button
        onClick={() => setOpen(true)}
        aria-label="Open search palette"
        className="group flex h-10 min-w-0 flex-1 items-center gap-3 rounded-xl border border-border bg-surface/70 px-3.5 text-left text-sm text-muted-foreground transition hover:border-border-strong hover:bg-surface md:max-w-md"
      >
        <Search className="size-4 shrink-0 text-muted-foreground" aria-hidden />
        <span className="hidden truncate md:inline">Search insights, leads, agents…</span>
        <span className="truncate md:hidden">Search…</span>
        <span className="ml-auto hidden items-center gap-1 rounded-md border border-border bg-background px-1.5 py-0.5 text-[10.5px] font-medium text-muted-foreground md:flex">
          <Command className="size-3" aria-hidden /> K
        </span>
      </button>

      {/* New button */}
      <button className="hidden h-10 shrink-0 items-center gap-2 rounded-xl bg-gradient-primary px-4 text-[13px] font-semibold text-white shadow-glow transition hover:opacity-95 md:flex">
        <Plus className="size-4" aria-hidden />
        New workflow
      </button>

      {/* Notifications */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            aria-label="Notifications"
            className="relative grid size-10 shrink-0 place-items-center rounded-xl border border-border bg-card transition hover:bg-surface"
          >
            <Bell className="size-[17px] text-foreground" aria-hidden />
            <span className="absolute right-2 top-2 size-2 rounded-full bg-gradient-primary ring-2 ring-background" />
          </button>

        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-80 p-0">
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <div>
              <p className="font-display text-sm font-semibold">Notifications</p>
              <p className="text-[11.5px] text-muted-foreground">{notifications.length} new updates</p>
            </div>
            <Badge variant="secondary" className="bg-accent text-accent-foreground">Live</Badge>
          </div>
          <div className="max-h-80 overflow-y-auto py-1">
            {notifications.map((n, i) => (
              <button
                key={i}
                className="flex w-full items-start gap-3 px-4 py-3 text-left transition hover:bg-surface"
              >
                <span
                  className={
                    "mt-1 size-2 shrink-0 rounded-full " +
                    (n.tone === "success"
                      ? "bg-emerald-500"
                      : n.tone === "warning"
                      ? "bg-amber-500"
                      : "bg-primary")
                  }
                />
                <div className="min-w-0">
                  <p className="truncate text-[13px] font-medium text-foreground">{n.title}</p>
                  <p className="text-[11.5px] text-muted-foreground">{n.time}</p>
                </div>
              </button>
            ))}
          </div>
          <div className="border-t border-border px-4 py-2.5">
            <button className="text-[12.5px] font-semibold text-primary hover:underline">
              Mark all as read
            </button>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* User */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            aria-label="Open user menu"
            className="flex shrink-0 items-center gap-2.5 rounded-xl border border-border bg-card py-1 pl-1 pr-2 transition hover:bg-surface md:pr-3"
          >
            <Avatar className="size-8">
              <AvatarFallback className="bg-gradient-primary text-[12px] font-semibold text-white">
                AM
              </AvatarFallback>
            </Avatar>
            <div className="hidden text-left leading-tight md:block">
              <p className="text-[12.5px] font-semibold text-foreground">Alex Morgan</p>
              <p className="text-[10.5px] text-muted-foreground">Pro · Acme Inc.</p>
            </div>
          </button>

        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>My account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Profile</DropdownMenuItem>
          <DropdownMenuItem>Workspace</DropdownMenuItem>
          <DropdownMenuItem>Billing</DropdownMenuItem>
          <DropdownMenuItem>Keyboard shortcuts</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Switch organization</DropdownMenuItem>
          <DropdownMenuItem className="text-destructive">Sign out</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <SearchPalette open={open} onOpenChange={setOpen} />
    </header>
  );
}

function SearchPalette({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const results = [
    { group: "Suggested", items: ["Ask AI CEO: where should we focus this quarter?", "Show churn-risk accounts", "Forecast Q4 revenue"] },
    { group: "Leads", items: ["Acme Corporation", "Northwind Trading", "Initech"] },
    { group: "Agents", items: ["Closer Agent", "Researcher Agent", "Outreach Agent"] },
  ];
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 grid place-items-start justify-items-center bg-foreground/30 px-4 pt-[15vh] backdrop-blur-sm"
          onClick={() => onOpenChange(false)}
        >
          <motion.div
            initial={{ y: -16, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: -16, opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-xl overflow-hidden rounded-2xl border border-border bg-card shadow-elegant"
          >
            <div className="flex items-center gap-3 border-b border-border px-4">
              <Search className="size-4 text-muted-foreground" />
              <input
                autoFocus
                placeholder="Search anything across FlowMind…"
                className="h-12 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              />
              <kbd className="text-[10.5px] text-muted-foreground">ESC</kbd>
            </div>
            <div className="max-h-[420px] overflow-y-auto p-2">
              {results.map((g) => (
                <div key={g.group} className="px-1 pb-2">
                  <p className="px-2 py-1.5 text-[10.5px] font-semibold uppercase tracking-wider text-muted-foreground">
                    {g.group}
                  </p>
                  {g.items.map((r, i) => (
                    <button
                      key={i}
                      className="flex w-full items-center gap-2.5 rounded-lg px-2 py-2 text-left text-[13px] text-foreground transition hover:bg-surface"
                    >
                      <Sparkles className="size-3.5 text-primary" />
                      <span className="flex-1 truncate">{r}</span>
                      <Check className="size-3.5 opacity-0" />
                    </button>
                  ))}
                </div>
              ))}
            </div>
            <div className="flex items-center justify-between border-t border-border bg-surface/60 px-4 py-2.5 text-[11px] text-muted-foreground">
              <span>↑↓ to navigate · ↵ to select</span>
              <span>Powered by FlowMind</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
