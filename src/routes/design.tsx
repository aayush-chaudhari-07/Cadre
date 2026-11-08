import * as React from "react";
import { createFileRoute, notFound } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import { ThemeToggle } from "@/components/theme-provider";

import { Reveal } from "@/components/motion/reveal";
import { WordReveal } from "@/components/motion/word-reveal";
import { Magnetic } from "@/components/motion/magnetic";
import { SpotlightCard } from "@/components/motion/spotlight-card";
import { AnimatedBorder } from "@/components/motion/animated-border";
import { CountUp } from "@/components/motion/count-up";
import { Marquee } from "@/components/motion/marquee";
import { Tilt } from "@/components/motion/tilt";
import { AuroraBackground } from "@/components/motion/aurora-background";
import { GridSpotlight } from "@/components/motion/grid-spotlight";
import { ScrollProgress } from "@/components/motion/scroll-progress";
import { Burst } from "@/components/motion/burst";

import { formatCurrency, formatNumber, formatPercent, formatRelativeDate } from "@/lib/format";
import { Sparkles, ArrowRight, ShieldAlert, CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/design")({
  beforeLoad: () => {
    if (!import.meta.env.DEV) {
      throw notFound();
    }
  },
  component: DesignShowcasePage,
});

function DesignShowcasePage() {
  const [burstActive, setBurstActive] = React.useState(false);
  const [progressVal] = React.useState(68);

  return (
    <TooltipProvider>
      <ScrollProgress />
      <Toaster />
      <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] transition-colors">
        {/* Header Bar */}
        <header className="sticky top-0 z-40 border-b border-[var(--border)] bg-[var(--surface)]/80 px-6 py-4 backdrop-blur-md">
          <div className="mx-auto flex max-w-7xl items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="h-8 w-8">
                <AvatarImage src="/favicon.svg" alt="Cadre" />
                <AvatarFallback>CD</AvatarFallback>
              </Avatar>
              <div>
                <h1 className="font-display text-base font-semibold">Cadre Design System</h1>
                <p className="text-xs text-[var(--text-3)]">Obsidian & Aurora Specification</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="gold">
                <Sparkles className="h-3 w-3" />
                Dev Mode
              </Badge>
              <ThemeToggle />
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-7xl space-y-16 px-6 py-12">
          {/* Section: Typography & Colors */}
          <Reveal>
            <section className="space-y-6">
              <div className="border-b border-[var(--border)] pb-2">
                <h2 className="font-display text-2xl font-bold">1. Typography & Tokens</h2>
                <p className="text-sm text-[var(--text-2)]">Space Grotesk (Headings), Inter (Body), JetBrains Mono (Data)</p>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Font Styles</CardTitle>
                    <CardDescription>Variables loaded via Fontsource (no Google link tags)</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <span className="text-xs text-[var(--text-3)]">Display (Space Grotesk)</span>
                      <p className="font-display text-3xl font-bold tracking-tight">The AI team that runs your revenue</p>
                    </div>
                    <div>
                      <span className="text-xs text-[var(--text-3)]">Body (Inter)</span>
                      <p className="text-sm text-[var(--text-2)] leading-relaxed">
                        Autonomous agents analyze meetings, leads, churn risk, and competitive signals in real-time.
                      </p>
                    </div>
                    <div>
                      <span className="text-xs text-[var(--text-3)]">Data (JetBrains Mono tabular-nums)</span>
                      <p className="font-mono text-base font-semibold text-[var(--primary)] tabular-nums">
                        $4,820,500.00 ARR · +24.8% MoM · Q4_DEAL_981
                      </p>
                    </div>
                  </CardContent>
                  <CardFooter className="text-xs text-[var(--text-3)]">
                    All numbers strictly tabular-nums for vertical alignment
                  </CardFooter>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Color Palette Tokens</CardTitle>
                    <CardDescription>Obsidian & Aurora system with WCAG 2.2 AA contrast</CardDescription>
                  </CardHeader>
                  <CardContent className="grid grid-cols-3 gap-3 text-xs">
                    <div className="rounded p-2.5 bg-[var(--primary)] text-[var(--primary-ink)] font-semibold text-center">Primary (Mint)</div>
                    <div className="rounded p-2.5 bg-[var(--secondary)] text-[#04110C] font-semibold text-center">Secondary (Cyan)</div>
                    <div className="rounded p-2.5 bg-[var(--gold)] text-[#04110C] font-semibold text-center">Gold (CEO/Pro)</div>
                    <div className="rounded p-2.5 bg-[var(--surface-2)] text-[var(--text)] border border-[var(--border)] text-center">Surface-2</div>
                    <div className="rounded p-2.5 bg-[var(--danger)] text-white font-semibold text-center">Danger</div>
                    <div className="rounded p-2.5 bg-[var(--warning)] text-white font-semibold text-center">Warning</div>
                  </CardContent>
                  <CardFooter className="flex items-center gap-2 text-xs text-[var(--text-3)]">
                    <CheckCircle2 className="h-4 w-4 text-[var(--success)]" /> Dark theme default · Light theme supported
                  </CardFooter>
                </Card>
              </div>
            </section>
          </Reveal>

          {/* Section: Buttons & Variants */}
          <section className="space-y-6">
            <div className="border-b border-[var(--border)] pb-2">
              <h2 className="font-display text-2xl font-bold">2. Buttons & Variants</h2>
              <p className="text-sm text-[var(--text-2)]">Primary Aurora, Secondary, Ghost, Danger, Gold, and Loading states</p>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <Button variant="primary">
                <Sparkles className="h-4 w-4" />
                Primary Aurora
              </Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost Action</Button>
              <Button variant="gold">Gold Pro</Button>
              <Button variant="danger">
                <ShieldAlert className="h-4 w-4" />
                Critical Action
              </Button>
              <Button variant="primary" loading>Loading State</Button>
              <Button
                variant="primary"
                onClick={() => toast.success("Action completed successfully")}
              >
                Trigger Toast
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </section>

          {/* Section: Form Controls */}
          <section className="space-y-6">
            <div className="border-b border-[var(--border)] pb-2">
              <h2 className="font-display text-2xl font-bold">3. Form Primitives</h2>
              <p className="text-sm text-[var(--text-2)]">Inputs, Textarea, Select, Checkbox, Switch, and Labels</p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="demo-input">Lead Email</Label>
                <Input id="demo-input" placeholder="founder@acme.com" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="demo-select">Agent Autonomy Level</Label>
                <Select defaultValue="auto">
                  <SelectTrigger id="demo-select">
                    <SelectValue placeholder="Select autonomy" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="off">Off (Manual approval)</SelectItem>
                    <SelectItem value="suggest">Suggest actions</SelectItem>
                    <SelectItem value="auto">Autonomous execution</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col justify-end space-y-4 pb-1">
                <div className="flex items-center space-x-2">
                  <Checkbox id="terms" defaultChecked />
                  <label htmlFor="terms" className="text-sm text-[var(--text-2)] cursor-pointer">
                    Enable real-time Gemini analysis
                  </label>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[var(--text-2)]">Weekly CEO Briefing</span>
                  <Switch defaultChecked />
                </div>
              </div>

              <div className="space-y-2 md:col-span-3">
                <Label htmlFor="demo-textarea">Sales Notes / Transcript Segment</Label>
                <Textarea id="demo-textarea" placeholder="Paste call recording transcript or email thread..." />
              </div>
            </div>
          </section>

          {/* Section: Overlays & Modals */}
          <section className="space-y-6">
            <div className="border-b border-[var(--border)] pb-2">
              <h2 className="font-display text-2xl font-bold">4. Overlays, Dialogs & Drawers</h2>
              <p className="text-sm text-[var(--text-2)]">Radix Dialog, Side Drawer, DropdownMenu, and Tooltips</p>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="secondary">Open Modal Dialog</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Configure AI Sales Agent</DialogTitle>
                    <DialogDescription>
                      Set ICP qualification criteria and scoring thresholds.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-3 py-2">
                    <Label htmlFor="icp-threshold">Minimum Deal Score (0-100)</Label>
                    <Input id="icp-threshold" defaultValue="85" />
                  </div>
                </DialogContent>
              </Dialog>

              <Drawer>
                <DrawerTrigger asChild>
                  <Button variant="outline">Open Side Drawer (Leads)</Button>
                </DrawerTrigger>
                <DrawerContent>
                  <DrawerHeader>
                    <DrawerTitle>Lead Intelligence Detail</DrawerTitle>
                    <DrawerDescription>
                      Full buyer intent analysis and AI commentary.
                    </DrawerDescription>
                  </DrawerHeader>
                  <div className="py-4 space-y-4">
                    <div className="rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--surface-2)] p-4">
                      <p className="font-semibold text-sm">Signal Confidence: 94%</p>
                      <p className="text-xs text-[var(--text-2)] mt-1">
                        Buyer asked for pricing tiers and security compliance documentation within 15 minutes of demo.
                      </p>
                    </div>
                  </div>
                </DrawerContent>
              </Drawer>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost">Open Dropdown ▾</Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel>Workspace Actions</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Generate Daily Brief</DropdownMenuItem>
                  <DropdownMenuItem>Import Leads CSV</DropdownMenuItem>
                  <DropdownMenuItem className="text-[var(--danger)]">Reset Demo Data</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="cursor-pointer text-xs underline text-[var(--primary)]">
                    Hover for AI quota tooltip
                  </span>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Daily limit: 40 analyses per user</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </section>

          {/* Section: Data Displays */}
          <section className="space-y-6">
            <div className="border-b border-[var(--border)] pb-2">
              <h2 className="font-display text-2xl font-bold">5. Data Components: Tables, Badges, Tabs</h2>
              <p className="text-sm text-[var(--text-2)]">Clean table styling, Progress, Skeletons, and Accordions</p>
            </div>

            <Tabs defaultValue="table" className="w-full">
              <TabsList>
                <TabsTrigger value="table">Table View</TabsTrigger>
                <TabsTrigger value="accordion">Accordion (FAQ)</TabsTrigger>
                <TabsTrigger value="formatters">Formatters Check</TabsTrigger>
                <TabsTrigger value="skeletons">Skeletons</TabsTrigger>
              </TabsList>

              <TabsContent value="table">
                <Card>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Account / Lead</TableHead>
                        <TableHead>Risk Tier</TableHead>
                        <TableHead>MRR</TableHead>
                        <TableHead>Health Score</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-medium">Acme Corporation</TableCell>
                        <TableCell><Badge variant="danger">Critical</Badge></TableCell>
                        <TableCell>{formatCurrency(48000)}</TableCell>
                        <TableCell>
                          <div className="w-24">
                            <Progress value={28} indicatorClassName="bg-[var(--danger)]" />
                          </div>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">BrightWave SaaS</TableCell>
                        <TableCell><Badge variant="default">Healthy</Badge></TableCell>
                        <TableCell>{formatCurrency(52000)}</TableCell>
                        <TableCell>
                          <div className="w-24">
                            <Progress value={progressVal} />
                          </div>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </Card>
              </TabsContent>

              <TabsContent value="accordion">
                <Card className="p-6">
                  <Accordion type="single" collapsible>
                    <AccordionItem value="item-1">
                      <AccordionTrigger>How does Cadre prevent customer churn?</AccordionTrigger>
                      <AccordionContent>
                        Our Churn Guard analyzes seat usage drop-offs, support ticket sentiments, and contract renewal dates to calculate an early risk score.
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-2">
                      <AccordionTrigger>Is my sales data private?</AccordionTrigger>
                      <AccordionContent>
                        Every organization operates inside an isolated PostgreSQL schema protected by Row-Level Security (RLS). Gemini calls process text statelessly.
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </Card>
              </TabsContent>

              <TabsContent value="formatters">
                <Card className="p-6">
                  <div className="grid grid-cols-2 gap-4 text-sm font-mono">
                    <div>formatCurrency(1254300): <span className="text-[var(--primary)] font-bold">{formatCurrency(1254300)}</span></div>
                    <div>formatCurrency(1254300, compact): <span className="text-[var(--secondary)] font-bold">{formatCurrency(1254300, { compact: true })}</span></div>
                    <div>formatNumber(98421): <span className="text-[var(--text)] font-bold">{formatNumber(98421)}</span></div>
                    <div>formatPercent(0.248): <span className="text-[var(--gold)] font-bold">{formatPercent(0.248)}</span></div>
                    <div>formatRelativeDate(-3600s): <span className="text-[var(--text-2)]">{formatRelativeDate(Date.now() - 3600000)}</span></div>
                  </div>
                </Card>
              </TabsContent>

              <TabsContent value="skeletons">
                <Card className="p-6 space-y-4">
                  <div className="flex items-center space-x-4">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-[250px]" />
                      <Skeleton className="h-4 w-[200px]" />
                    </div>
                  </div>
                  <Skeleton className="h-24 w-full" />
                </Card>
              </TabsContent>
            </Tabs>
          </section>

          {/* Section: Motion Primitives */}
          <section className="space-y-6">
            <div className="border-b border-[var(--border)] pb-2">
              <h2 className="font-display text-2xl font-bold">6. Motion Primitives Catalog</h2>
              <p className="text-sm text-[var(--text-2)]">Framer Motion components respecting prefers-reduced-motion</p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              <Card className="p-6 space-y-3">
                <span className="text-xs uppercase tracking-wider text-[var(--text-3)] font-semibold">WordReveal</span>
                <div className="font-display text-xl font-bold">
                  <WordReveal text="Six autonomous revenue agents ready to deploy." />
                </div>
              </Card>

              <Card className="p-6 space-y-3 flex flex-col justify-between">
                <span className="text-xs uppercase tracking-wider text-[var(--text-3)] font-semibold">Magnetic Button</span>
                <div className="py-2">
                  <Magnetic>
                    <Button variant="primary">Hover Cursor Magnet</Button>
                  </Magnetic>
                </div>
              </Card>

              <Card className="p-6 space-y-3">
                <span className="text-xs uppercase tracking-wider text-[var(--text-3)] font-semibold">CountUp Numbers</span>
                <div className="font-display text-3xl font-bold text-[var(--primary)]">
                  <CountUp value={4250000} prefix="$" duration={1.5} />
                </div>
                <p className="text-xs text-[var(--text-3)]">Eases into view over 1.4s</p>
              </Card>

              <AnimatedBorder className="p-6 space-y-2">
                <span className="text-xs uppercase tracking-wider text-[var(--gold)] font-semibold">Animated Border (@property)</span>
                <h4 className="font-display text-base font-bold">Pro Agentic Tier</h4>
                <p className="text-xs text-[var(--text-2)]">Continuous 6s gradient loop around border.</p>
              </AnimatedBorder>

              <SpotlightCard className="space-y-2">
                <span className="text-xs uppercase tracking-wider text-[var(--primary)] font-semibold">Spotlight Card</span>
                <h4 className="font-display text-base font-bold">Move cursor over card</h4>
                <p className="text-xs text-[var(--text-2)]">Radial spotlight tracks mouse coordinates in real-time.</p>
              </SpotlightCard>

              <Tilt className="rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface)] p-6 space-y-2 shadow-lg">
                <span className="text-xs uppercase tracking-wider text-[var(--secondary)] font-semibold">3D Tilt Component</span>
                <h4 className="font-display text-base font-bold">Interactive Gyro Tilt</h4>
                <p className="text-xs text-[var(--text-2)]">Tilts up to 6 degrees toward mouse location.</p>
              </Tilt>
            </div>

            <div className="space-y-2">
              <span className="text-xs uppercase tracking-wider text-[var(--text-3)] font-semibold">Marquee (Built With)</span>
              <div className="rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface)] py-4">
                <Marquee speed={30}>
                  <span className="text-sm font-semibold tracking-wider text-[var(--text-2)]">GOOGLE GEMINI</span>
                  <span className="text-sm font-semibold tracking-wider text-[var(--text-2)]">SUPABASE</span>
                  <span className="text-sm font-semibold tracking-wider text-[var(--text-2)]">CLOUDFLARE</span>
                  <span className="text-sm font-semibold tracking-wider text-[var(--text-2)]">REACT 19</span>
                  <span className="text-sm font-semibold tracking-wider text-[var(--text-2)]">TAILWIND CSS V4</span>
                  <span className="text-sm font-semibold tracking-wider text-[var(--text-2)]">TANSTACK ROUTER</span>
                </Marquee>
              </div>
            </div>

            <GridSpotlight className="rounded-[var(--radius-lg)] border border-[var(--border)] p-8">
              <AuroraBackground className="rounded-[var(--radius-md)] py-12">
                <div className="text-center space-y-4">
                  <h3 className="font-display text-2xl font-bold">Ambient Aurora Drift & Grid Spotlight</h3>
                  <p className="text-sm text-[var(--text-2)] max-w-md mx-auto">
                    Three layered radial blobs in mint, cyan and gold looping seamlessly in CSS, inside a reactive grid.
                  </p>
                  <div className="relative inline-block">
                    <Button
                      variant="primary"
                      onClick={() => setBurstActive(true)}
                    >
                      Trigger Particle Burst
                    </Button>
                    <Burst active={burstActive} onComplete={() => setBurstActive(false)} />
                  </div>
                </div>
              </AuroraBackground>
            </GridSpotlight>
          </section>
        </main>
      </div>
    </TooltipProvider>
  );
}
