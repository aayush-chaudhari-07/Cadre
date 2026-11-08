# Cadre

**The AI team that runs your revenue.**

Cadre is an autonomous B2B revenue operations platform powered by specialized Google Gemini agents. A collaborative team of six AI employees continuously monitors your commercial pipeline, scores inbound leads, extracts intelligence from sales meetings, flags churn hazards, reverse-engineers competitor offerings, generates mathematically grounded three-scenario forecasts, and drafts cross-functional strategic CEO directives.

---

## What Cadre Does

| Agent / Module | Role | Core Capability |
|---|---|---|
| **AI CEO** (`/app/ceo`) | Strategic Orchestration | Synthesizes workspace telemetry into phased execution blueprints assigned across agents with quantifiable KPIs and risk mitigations. |
| **Sales Agent** (`/app/leads`) | Lead Qualification & Scoring | Analyzes inbound communications (email, chat, call notes) to calculate score (0–100), intent, objections, next best actions, and suggested replies. |
| **Operations Agent** (`/app/meetings`) | Meeting Intelligence | Ingests `.vtt`, `.srt`, or raw call transcripts (up to 60k chars) to extract key points, deliverables checklist, objections, and deal health meters. |
| **Support Agent** (`/app/churn`) | Churn Prevention | Computes total MRR and high+critical MRR-at-risk, tracks health scores, categorizes risk tiers, and generates targeted customer retention plays. |
| **Marketing Agent** (`/app/competitors`) | Competitor Radar | Scans public competitor URLs via SSRF-defended crawler to generate real-time positioning battlecards, win themes, landmines, and sales talk tracks. |
| **Finance Agent** (`/app/revenue`) | Revenue Forecasting | Mathematical three-scenario revenue forecasting (Expected, Best Case upside, Worst Case floor) paired with Gemini executive variance explanations. |
| **Executive Daily Brief** (`/app/insights`) | Morning Revenue Brief | Automated daily workspace briefing caching commercial momentum, churn hazards, and tactical expansion opportunities. |

---

## Architecture & Technology Stack

- **Frontend:** React 19 SPA, TypeScript 5.8 (Strict Mode), Vite 6, Tailwind CSS v4, Motion (Framer Motion v12).
- **Routing & State:** TanStack Router (file-based routing with code-splitting), TanStack Query v5.
- **Visuals & Charts:** Recharts (isolated Rollup vendor chunk), Lucide React, Radix UI accessible primitives.
- **Backend & Database:** Supabase (PostgreSQL with 100% Row Level Security, Auth, Deno Edge Functions).
- **Artificial Intelligence:** Google Gemini 2.5 Flash via `@google/genai` (strictly isolated in Supabase Edge Functions with quota enforcement and model fallback).
- **Hosting & Edge:** Cloudflare Pages (Static Assets) & Supabase Edge Functions (Serverless Deno Runtime).

---

## Screenshots Placeholder

```
+-----------------------------------------------------------------------+
|  [Screenshot: Executive Command Center & Cross-Agent Telemetry]       |
|  ./docs/screenshots/command-center.png                                |
+-----------------------------------------------------------------------+
|  [Screenshot: AI CEO Phased Strategic Directive Console]             |
|  ./docs/screenshots/ceo-command.png                                   |
+-----------------------------------------------------------------------+
|  [Screenshot: Three-Scenario Revenue Forecast Area & Pipeline Kanban] |
|  ./docs/screenshots/revenue-forecast.png                              |
+-----------------------------------------------------------------------+
```

---

## Getting Started Locally

### 1. Prerequisites
- Node.js 22 LTS or later
- npm (do not use bun, yarn, or pnpm)
- Supabase CLI (`npm i -g supabase` optional, or use hosted Supabase dashboard)

### 2. Environment Configuration
Clone the repository and create your local environment file:

```bash
git clone https://github.com/your-org/cadre.git
cd cadre
npm ci
cp .env.example .env
```

Configure the following variables in `.env`:
```ini
# Supabase Configuration (Browser uses publishable key ONLY)
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-supabase-publishable-key

# Production Domain Base
VITE_SITE_URL=http://localhost:5173

# Optional Sentry Telemetry (Strict PII scrubbing enforced)
# VITE_SENTRY_DSN=https://public@sentry.example.com/1
```

### 3. Supabase Database & Security Setup
1. Create a new Supabase project at [database.new](https://database.new).
2. Apply the PostgreSQL database migration script [`supabase/migrations/0001_init.sql`](supabase/migrations/0001_init.sql) in the Supabase SQL Editor.
3. This sets up all 14 database tables, composite performance indexes, RPC stored procedures (`create_organization`, `consume_ai_quota`, `seed_demo_data`, `clear_demo_data`), and Row Level Security (RLS) policies.

### 4. Supabase Edge Functions & Gemini Secrets
The Gemini API key is isolated server-side and never exposed to client browsers:

```bash
supabase link --project-ref your-project-id
supabase secrets set GEMINI_API_KEY="your-gemini-api-key"
supabase secrets set ALLOWED_ORIGINS="http://localhost:5173,https://your-domain.com"
supabase functions deploy
```

### 5. Launch Local Dev Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## Available Scripts

| Command | Purpose |
|---|---|
| `npm run dev` | Launch local Vite development server with HMR |
| `npm run build` | Compile optimized production bundle to `dist/` and generate OG image |
| `npm run preview` | Locally preview compiled production `dist/` build |
| `npm run lint` | Execute ESLint across entire codebase (0 errors, 0 warnings enforced) |
| `npm run typecheck` | Execute TypeScript strict mode compiler verification (`tsc --noEmit`) |
| `npm test` | Run Vitest unit and component test suite (17 suites, 117 tests) |
| `npm run test:e2e` | Run Playwright end-to-end integration test suite |
| `npm run format` | Enforce code formatting via Prettier |

---

## Folder Layout Summary

```
.
├── .github/                  # GitHub Actions CI workflow & Dependabot configuration
├── docs/                     # Product specs (PRD, DESIGN, ARCHITECTURE, SECURITY, DEPLOYMENT)
├── public/                   # Static public assets (robots.txt, sitemap.xml, favicon)
├── src/
│   ├── components/
│   │   ├── marketing/        # Landing page sections (Nav, Hero, Orbit, Demo, Bento, Pricing)
│   │   ├── motion/           # Motion primitives (Reveal, CountUp, Tilt, Aurora, Burst)
│   │   └── ui/               # Radix UI design tokens & accessible primitives
│   ├── features/
│   │   ├── agents/           # Agent roster, sparklines, autonomy controls, audit logs
│   │   ├── auth/             # Authentication, session state, route guards
│   │   ├── ceo/              # AI CEO directive synthesizer, phased plan views
│   │   ├── churn/            # Churn intelligence, MRR-at-risk, retention plays
│   │   ├── competitors/      # Competitor radar, battlecards, safe URL scanner
│   │   ├── insights/         # Morning brief generation, executive summaries
│   │   ├── leads/            # Inbound lead scoring, CSV batch import, drawer
│   │   ├── meetings/         # Transcript parser (VTT/SRT), sentiment, action items
│   │   ├── revenue/          # 3-scenario forecasting models, Kanban, Recharts
│   │   ├── settings/         # Profile, workspace data export, quota tracking
│   │   └── workspace/        # Multi-tenant workspace provider & demo data RPCs
│   ├── lib/                  # Formatters (USD), Supabase client, AI client, Sentry
│   ├── routes/               # TanStack Router route tree with per-route error boundaries
│   └── styles/               # Design tokens (tokens.css) & Tailwind theme (globals.css)
├── supabase/
│   ├── functions/            # Deno Edge Functions (shared auth, quota, Gemini client)
│   └── migrations/           # PostgreSQL schema, composite indexes, RLS policies
└── tests/
    ├── e2e/                  # Playwright integration flows (auth, analysis, route guards)
    └── unit/                 # Vitest unit & React component test suites
```

---

## Deployment Guide

Cadre is architected to deploy entirely on zero-cost free tiers (Cloudflare Pages for static frontend hosting, Supabase for PostgreSQL/Auth/Edge Functions, and Google Gemini 2.5 Flash for AI inference).

For step-by-step production deployment instructions, domain setup, environment variable configuration, and monitoring, refer to [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md).

---

## Security & Privacy Note

- **Untrusted Input Isolation:** All user-provided transcripts, lead messages, and URLs are treated as untrusted data with strict character limits and edge validation (Zod).
- **SSRF Defense:** Competitor web scans resolve DNS and block private RFC 1918, loopback, and cloud metadata IP ranges (`169.254.169.254`).
- **Zero API Key Leakage:** The Gemini API key and Supabase service role key never touch the browser client.
- **Row Level Security:** Every PostgreSQL query enforces tenant isolation via RLS policies linked to validated user JWT memberships.
- **PII Scrubbing:** If Sentry is enabled (`VITE_SENTRY_DSN`), emails, bearer tokens, passwords, and IP addresses are scrubbed prior to transmission.

---

## License

MIT License. Copyright (c) 2026 Cadre Technologies.
