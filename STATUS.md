# Cadre Project Status

Last updated: Prompt 12 (Revenue module and Command Center)

## Done
- [x] Full architectural and codebase audit completed (`PROJECT_INFO.md`).
- [x] Extracted and integrated Cadre specification pack (`AGENTS.md`, `docs/`, `public/`, `supabase/`, `scripts/`, `.github/`, `.env.example`, `.gitignore`).
- [x] Initialized Git repository with clean baseline commit on branch `legacy-snapshot`.
- [x] Created and checked out active working branch `rebuild`.
- [x] Verified `.env` is untracked and strictly ignored by Git (zero credential leaks in git history).
- [x] Relocated legacy source code from `src/` to `legacy/src/` for reference only.
- [x] **Prompt 1: Clean Scaffold:**
  - Executed `scripts/purge-legacy.ps1 -Apply` removing builder configuration and lockfiles.
  - Initialized clean `.env` matching `.env.example`.
  - Replaced `package.json` with clean React 19 SPA manifest (`cadre`).
  - Standardized on `npm`, installed runtime and development dependencies.
  - Setup `index.html`, `vite.config.ts` (TanStack Router plugin with `autoCodeSplitting`), `tsconfig.json`, `eslint.config.js`, `.prettierignore`.
  - Created architectural folder tree with `.gitkeep`.
- [x] **Prompt 2: Design System & Motion Primitives:**
  - Implemented `src/styles/tokens.css` with dark (default) and light themes, gradients, radii, easing curves, and elevation shadows.
  - Implemented `src/styles/globals.css` with Tailwind v4 `@theme`, base styles, Fontsource variable fonts (Space Grotesk, Inter, JetBrains Mono), custom utilities (`.glass`, `.focus-ring`, `.bg-grid`, `.animate-border`, `.tabular-nums`), and reduced-motion overrides.
  - Implemented `ThemeProvider` and `ThemeToggle` (`src/components/theme-provider.tsx`) with instant anti-flash script in `src/main.tsx`.
  - Implemented 21 Radix UI primitives in `src/components/ui/`: `Button`, `Input`, `Textarea`, `Label`, `Checkbox`, `Switch`, `Badge`, `Card`, `Select`, `Dialog`, `Drawer`, `DropdownMenu`, `Tabs`, `Tooltip`, `Table`, `Skeleton`, `Progress`, `Avatar`, `Command`, `Toaster` (Sonner), `Accordion`.
  - Implemented 13 motion components in `src/components/motion/`: `Reveal`, `WordReveal`, `Magnetic`, `SpotlightCard`, `AnimatedBorder`, `CountUp`, `Marquee`, `Tilt`, `AuroraBackground`, `GridSpotlight`, `ScrollProgress`, `PageTransition`, `Burst` (all using shared `useReducedMotion`).
  - Implemented `src/lib/format.ts` (`formatCurrency` in USD via Intl, `formatNumber`, `formatPercent`, `formatRelativeDate`) and `src/lib/utils.ts` (`cn`).
  - Built temporary `/design` showcase route (`src/routes/design.tsx`) verifying all components and animations.
  - Validated with `npm run typecheck`, `npm run lint`, and `npm run build` (all pass with 0 errors).
- [x] **Prompt 3: Database, types and Supabase config:**
  - Initialized clean Supabase configuration (`supabase/config.toml` with `project_id = "cadre"`).
  - Audited and refined `supabase/migrations/0001_init.sql`: added missing indexes for foreign key cascading and RLS lookups (`lead_interactions.org_id`, `deals.lead_id`, `organizations.owner_id`), added idempotent upsert logic to `handle_new_user()`, added client `profiles_insert_own` fallback policy, and secured function grants.
  - Implemented typed browser Supabase client (`src/lib/supabase.ts`) enforcing `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` check on boot (zero service role key exposure).
  - Implemented comprehensive hand-written schema typings in `src/types/database.ts` covering all 14 tables, row/insert/update types, and RPC signatures (`create_organization`, `consume_ai_quota`, `seed_demo_data`, `clear_demo_data`, `is_org_member`).
  - Configured TanStack Query client (`src/lib/query-client.ts`) with sensible defaults (`staleTime: 30s`, `retry: 1`, `refetchOnWindowFocus: false`).
  - Authored multi-tenant RLS isolation test suite in `tests/sql/isolation.md` (SQL impersonation script and Supabase-JS verification snippets).
- [x] **Prompt 4: Authentication, onboarding and route guards:**
  - Implemented `AuthProvider` and `useAuth()` in `src/features/auth/` subscribing to `onAuthStateChange`, managing session/user/profile state, and exposing API helpers (`signUp`, `signIn`, `signOut`, `signInWithGoogle`, `requestPasswordReset`, `updatePassword`, `resendConfirmationEmail`).
  - Implemented split layout auth pages matching Obsidian & Aurora aesthetic: `/login`, `/signup`, `/forgot-password`, `/reset-password` with glass cards, accessible validation (Zod + React Hook Form), show/hide passwords, Google OAuth button, and the animated SVG agent-node motif (`AgentOrbitVisual`).
  - Added user-friendly error translations for all common Supabase authentication error strings and a post-signup "Check your email" confirmation screen with resend cooldown timer.
  - Implemented `WorkspaceProvider` and `useWorkspace()` in `src/features/workspace/` loading primary organization membership and wrapping `create_organization`, `seed_demo_data`, and `clear_demo_data` RPCs.
  - Created `/onboarding` page with workspace name input, "Start with sample data" switch (default true), and celebratory `Burst` animation before transitioning to `/app`.
  - Configured route guard in `src/routes/app/route.tsx`: `beforeLoad` checks session and membership, redirecting unauthenticated visitors to `/login?redirect=...` and workspace-less users to `/onboarding`.
  - Validated safe relative redirect paths with `validateRedirectPath` protecting against open redirects and scheme injections.
  - Created `/app/index.tsx` Command Center placeholder displaying real user profile name, active workspace badge, sign-out button, and RPC demo data trigger controls.
  - Added unit test suites `tests/unit/redirect.test.ts` (6 tests) and `tests/unit/auth-schemas.test.ts` (12 tests) — all 18 passing in Vitest.
  - Validated: `npm run lint` (0 errors), `npm run typecheck` (0 errors), `npm run test` (18/18 passing), `npm run build` (built in 4.10s).
- [x] **Prompt 5: App shell:**
  - Implemented signed-in shell layout in `src/routes/app/route.tsx` with collapsible sidebar (240px / 72px) and mobile sheet drawer (`DrawerContent side="left"`).
  - Added all 10 sidebar navigation items in exact design doc order with Lucide icons, active mint pill sliding via `layoutId="sidebar-active-pill"`, workspace name/plan header, and real-time AI quota footer card read from `ai_usage`.
  - Implemented sticky top bar (`AppTopbar`) with dynamic breadcrumbs, AI usage pill (`useAiUsage`), `ThemeToggle`, `Ctrl/Cmd+K` palette trigger, and user profile menu (display name, email, settings link, sign-out handler).
  - Built global Command Palette (`CommandPalette`) with keyboard shortcuts (⌘K/Ctrl+K, ⌘N), module jump navigation, theme switcher, and sign-out action.
  - Implemented all 9 module route placeholders: `/app/leads`, `/app/meetings`, `/app/churn`, `/app/competitors`, `/app/revenue`, `/app/agents`, `/app/ceo`, `/app/insights`, `/app/settings`.
  - Implemented branded 404 page (`src/components/branded-not-found.tsx` and `src/routes/$.tsx`) and Error Boundary (`src/components/branded-error-boundary.tsx`), both featuring the custom agent-node motif.
  - Added accessibility features: visible skip-to-content landmark link, keyboard navigation across sidebar and command palette, and persisted sidebar collapsed state in `localStorage` under `cadre.sidebar_collapsed`.
  - Validated: `npm run lint` (0 errors, 0 warnings), `npm run typecheck` (0 errors), `npm run test` (18/18 passing), `npm run build` (built in 4.31s).
- [x] **Prompt 6: Landing page, pricing and legal pages:**
  - Implemented all 12 marketing components in `src/components/marketing/`:
    - `Nav`: Glass bar, logo mark lockup, scroll shrink state (border + background), desktop nav links, mobile menu overlay, magnetic CTAs.
    - `Hero`: Headline word-reveal ("The AI team that runs your revenue."), Aurora background, cursor-tracking GridSpotlight, tilting 3D dashboard preview with CountUp KPIs and live ticking agent feed.
    - `BuiltWith`: Marquee strip displaying verified technologies (Gemini, Supabase, React 19, Cloudflare Pages, Tailwind, TypeScript) with zero fabricated logos.
    - `ProblemStats`: 3 true product facts with CountUp ("6 AI Agents", "8 Revenue Modules", "< 15s Analysis Time").
    - `Bento`: Asymmetric 6-card spotlight grid with looping SVG micro-animations for all 6 commercial workflows.
    - `AgentOrbit`: Interactive SVG hub-and-spoke with the AI CEO at the gold core, 5 satellite agents, light pulses, and full inspector card on hover/focus.
    - `Demo`: Scripted typewriter simulator qualifying a lead, animated progress bar, and staggered Gemini analysis results (clearly marked with "Sample Data" badge).
    - `HowItWorks`: Pinned 3-step story (Connect data, Autonomous agents work, Act on CEO plan) morphing visuals on desktop, collapsing to stacked view on mobile and when reduced motion is preferred.
    - `PricingSection`: Free ($0), Pro ($49/mo, $39/mo billed yearly), Scale ($149/mo, $119/mo billed yearly). Monthly/yearly toggle saving 2 months. Pro highlighted with `AnimatedBorder` and gold "Most Popular" badge. Formatted via `formatCurrency` in USD.
    - `Faq`: Radix Accordion with 5 real answers on free tier quotas, RLS security, Gemini 2.5 Flash models, CSV export, and roadmap integrations.
    - `FinalCta`: Aurora background panel with magnetic "Start free" button and trust points.
    - `Footer`: Brand lockup, product module links, legal links, copyright, and "Made with care in India".
  - Created standalone `/pricing` route (`src/routes/pricing.tsx`).
  - Created plain-English, readable, responsive legal pages with back links:
    - `/terms` (`src/routes/terms.tsx`): 9 comprehensive sections detailing service scope, AI output disclaimer, multi-tenant isolation, acceptable use, and data ownership.
    - `/privacy` (`src/routes/privacy.tsx`): 8 clear sections covering data categories, zero model training policy, PostgreSQL RLS tenant isolation, retention, and GDPR/CCPA rights.
  - Implemented Node script `scripts/generate-og-image.mjs` generating a branded 1200x630 OpenGraph PNG (`public/og-image.png`) with aurora blobs and agent node geometries, automatically triggered during `npm run build`.
  - Added JSON-LD `SoftwareApplication` structured data snippet to landing page `<head>`.
  - Verified bundle performance: Initial gzipped JS bundle size is **208.17 KB** (well within the 250 KB performance budget).
  - Validated: `npm run lint` (0 errors, 0 warnings), `npm run typecheck` (0 errors), `npm run test` (18/18 passing), `npm run build` (built in 8.57s).

## Legal Page Placeholders to Fill in
The legal pages in `src/routes/terms.tsx` and `src/routes/privacy.tsx` contain standard company placeholders. Please review and replace the following strings when deploying to production:
- `[YOUR COMPANY NAME]` (e.g. "Cadre Technologies Inc.")
- `[YOUR EMAIL]` (e.g. "legal@cadre.ai" or "privacy@cadre.ai")
- `[YOUR ADDRESS]` (e.g. your registered corporate address)

- [x] **Prompt 7: Edge Function infrastructure and Gemini client:**
  - Implemented `supabase/functions/deno.json` with Deno import mappings (`@google/genai`, `@supabase/supabase-js`, `zod`, `@std/assert`).
  - Created `supabase/functions/_shared/cors.ts`: allowlist from `ALLOWED_ORIGINS` (defaults to `http://localhost:5173`), handles preflight `OPTIONS` (204), never reflects `*`.
  - Created `supabase/functions/_shared/http.ts`: type-safe `json()` and `error()` helpers returning `{ error: { code, message } }` with codes `unauthorized`, `forbidden`, `invalid_input`, `quota_exceeded`, `bad_model_output`, `upstream_unavailable`, `blocked_url`, `internal_error`.
  - Created `supabase/functions/_shared/auth.ts`: creates user-scoped Supabase client from incoming `Authorization: Bearer <jwt>`, validates active session (`getUser()`), verifies caller organization membership via RLS on `memberships`.
  - Created `supabase/functions/_shared/quota.ts`: calls `consume_ai_quota` RPC with `AI_DAILY_LIMIT_PER_USER` (default 40); on quota exceeded returns HTTP 429 `quota_exceeded`.
  - Created `supabase/functions/_shared/gemini.ts`: wrapper around `@google/genai` using `GEMINI_API_KEY`. Implements `generateJson({ system, user, schema, temperature, timeoutMs })` trying `GEMINI_MODEL`, falling back to `GEMINI_FALLBACK_MODEL` on 429/503. Strict 30s timeout, retries once on invalid JSON, never logs prompt or user content.
  - Created `supabase/functions/_shared/schemas.ts`: Zod request schemas enforcing `docs/SECURITY.md` input size limits (transcript: 60k chars, lead: 20k chars, command: 2k chars, URL: 2048 chars) and response schemas for all 7 agent modules (`LeadAnalysis`, `MeetingAnalysis`, `ChurnAnalysis`, `CompetitorScan`, `CeoPlan`, `DailyInsights`, `ForecastNote`).
  - Created `supabase/functions/_shared/prompts.ts`: system prompts for all 7 modules enforcing role definition, strict untrusted data clauses, JSON-only output constraints, and numerical integrity rules (*"use ONLY numbers provided in inputs"*).
  - Created `supabase/functions/_shared/run-log.ts`: audit helper `logAgentRun()` recording execution rows to `public.agent_runs` with non-blocking error handling.
  - Created `supabase/functions/_shared/safe-url.ts`: SSRF defense with `isPrivateOrBlockedIp()` (blocking 127/8, 10/8, 172.16/12, 192.168/16, 169.254/16, ::1, unique local, multicast), `isSafeUrl()` (restricting scheme to http/https, ports to 80/443, local hostnames, and resolving DNS), and `fetchPublicPage()` (following max 3 redirects, 8s timeout, 500KB stream cap, HTML text extraction truncated to 12,000 chars).
  - Created Deno tests:
    - `supabase/functions/_shared/tests/gemini_test.ts`: tests markdown JSON code fence cleaning and 429/503 fallback error classification.
    - `supabase/functions/_shared/tests/safe_url_test.ts`: tests private IP blocking, port restrictions, metadata IP denial, and HTML text sanitization.
  - Implemented client layer `src/lib/ai.ts`: typed wrappers (`analyzeLead`, `analyzeMeeting`, `analyzeChurn`, `scanCompetitor`, `explainForecast`, `askCeo`, `generateInsights`) with user-friendly error translations and `useAiUsage` hook.
  - Added unit test suites `tests/unit/safe-url.test.ts` (3 tests) and `tests/unit/ai-client.test.ts` (2 tests) — all 23 project tests passing in Vitest.
  - Validated: `npm run lint` (0 errors), `npm run typecheck` (0 errors), `npm run test` (23/23 passing), `npm run build` (built in 6.90s).

- [x] **Prompt 8: Leads module:**
  - Implemented `supabase/functions/analyze-lead/index.ts` with CORS, JWT authentication, Sales agent enabled check, daily quota validation, Gemini reasoning with `LEAD_ANALYSIS_PROMPT`, automatic lead metrics update (score, intent, summary, objections, next_action, probability, last_contact_at), interaction timeline logging in `lead_interactions`, and audit entry in `agent_runs`.
  - Implemented `src/features/leads/`:
    - `schemas.ts`: validation for lead creation/updates and CSV batch row mapping.
    - `api.ts`: Supabase database queries for leads filtering, sorting, pagination, and batch import.
    - `hooks.ts`: React Query hooks (`useLeads`, `useLead`, `useLeadInteractions`, `useCreateLead`, `useUpdateLead`, `useDeleteLead`, `useImportLeads`).
    - `components/score-ring.tsx`: SVG circular score indicator styled with mint/cyan/gold thresholds.
    - `components/add-edit-lead-dialog.tsx`: React Hook Form + Zod modal.
    - `components/delete-lead-dialog.tsx`: confirmation modal.
    - `components/csv-import-dialog.tsx`: Papa Parse CSV picker, column auto-mapping, row-level validation list, batching in sets of 100.
    - `components/lead-drawer.tsx`: full lead drawer with timeline, copyable suggested replies and next actions, live analysis box with channel selector, character counter, and celebratory `Burst` animation on first qualification.
  - Implemented `/app/leads` page with debounced search, status filter chips, sortable table headers, pagination, skeleton loading, empty state (with Add lead, Import CSV, and Load sample data), and error states.
  - Created unit tests in `tests/unit/leads.test.ts` (10 tests) covering CSV parsing and table filtering/sorting logic.
  - Validated: `npm run lint` (0 errors), `npm run typecheck` (0 errors), `npm run test` (33/33 passing), `npm run build` (built in 7.08s).

- [x] **Prompt 9: Meetings module:**
  - Implemented `supabase/functions/analyze-meeting/index.ts` with CORS, JWT authentication, Operations agent enabled check, quota validation, Gemini reasoning with `MEETING_ANALYSIS_PROMPT`, persisting results on `meetings` table (summary, sentiment, action_items, objections, analysis), and writing an audit row in `agent_runs` for the Operations agent.
  - Implemented `src/features/meetings/`:
    - `parser.ts`: subtitle cleaner utility (`stripSubtitleTimestamps`) stripping WebVTT/SRT timestamps, cue numbering, and voice tags (`<v Speaker>`), and deduplicating live transcription repeats, plus `validateTranscriptLength` (60,000 char cap).
    - `schemas.ts`: form validation schemas and filter types.
    - `api.ts`: Supabase queries for meetings list, fetch by ID, create, update, and delete.
    - `hooks.ts`: React Query hooks (`useMeetings`, `useMeeting`, `useCreateMeeting`, `useUpdateMeeting`, `useDeleteMeeting`, `useAnalyzeMeeting`).
    - `components/sentiment-badge.tsx`: Positive, Neutral, Negative sentiment badge with icons.
    - `components/deal-health-ring.tsx`: circular SVG deal health meter (0-100) with dynamic glow and color tokens.
    - `components/action-items-list.tsx`: deliverables checklist with local completion persistence (`localStorage`) and "Copy all" clipboard button.
    - `components/new-meeting-dialog.tsx`: modal with title, company, date, live character counter (60,000 max), drag-and-drop or file upload for `.vtt`, `.srt`, `.txt` stripping timestamps immediately, and instant AI analysis toggle.
    - `components/delete-meeting-dialog.tsx`: confirmation modal.
    - `components/meeting-detail-view.tsx`: full meeting intelligence view rendering persisted analysis with zero redundant AI calls, key discussion points, action items, objections, deal risks, recommended next steps, deal health ring, and expandable raw transcript.
  - Implemented `/app/meetings` route page supporting list view with debounced search, sentiment filter chips, sample data loader, and detail view via `?meetingId=...`.
  - Created unit tests in `tests/unit/meetings.test.ts` (6 tests) verifying VTT, SRT, formatting stripping, deduplication, and character length validation.
  - Validated: `npm run lint` (0 errors), `npm run typecheck` (0 errors), `npm run test` (39/39 passing), `npm run build` (built in 7.08s).

- [x] **Prompt 10: Churn module:**
  - Implemented `supabase/functions/analyze-churn/index.ts` with CORS, JWT authentication, Support agent enabled check, daily quota validation, Gemini reasoning with `CHURN_ANALYSIS_PROMPT`, automatic account metrics update (`risk_level`, `health_score = 100 - risk_score`, `last_analysis`), and audit entry in `agent_runs` for the Support agent.
  - Implemented `src/features/churn/`:
    - `metrics.ts`: pure functions for `calculateTotalMrr`, `calculateMrrAtRisk` (high + critical risk), `countAccountsAtRisk`, `getDaysUntilRenewal` ("in N days", "Today", "Tomorrow"), `countUpcomingRenewals` (30-day window), and `calculateChurnSummaryMetrics`.
    - `schemas.ts`: account validation schemas, filter options, and sort types.
    - `api.ts`: Supabase queries for accounts filtering by risk tier, searching by name/plan, and sorting by MRR, renewal date, health score, or name.
    - `hooks.ts`: React Query hooks (`useAccounts`, `useAccount`, `useCreateAccount`, `useUpdateAccount`, `useDeleteAccount`, `useAnalyzeChurn`).
    - `components/risk-badge.tsx`: color-tokenized badge for Low (mint), Medium (cyan), High (gold), and Critical (danger) risk tiers.
    - `components/health-score-bar.tsx`: visual health progress bar (0–100) with color states.
    - `components/add-edit-account-dialog.tsx`: dialog with account name, plan, MRR (USD), renewal date, editable signals tag list (add, remove, quick suggestion chips), and context notes.
    - `components/delete-account-dialog.tsx`: confirmation modal.
    - `components/analyze-risk-drawer.tsx`: right sheet drawer displaying account stats, health score, signals, AI evaluation banner with re-analyze button, identified root causes/reasons, retention plays with low/medium/high effort badges, and a draft check-in message with copy button.
  - Implemented `/app/churn` route page with 4 KPI summary cards (Total MRR, MRR at Risk, Accounts at Risk, Next Renewals), search, risk tier filter chips, sortable table, empty states with sample data loader, and error states.
  - Created unit tests in `tests/unit/churn.test.ts` (6 tests) verifying total MRR, high+critical MRR-at-risk, account counts, renewal date calculations, and empty array handling.
  - Validated: `npm run lint` (0 errors), `npm run typecheck` (0 errors), `npm run test` (45/45 passing), `npm run build` (built in 6.92s).

- [x] **Prompt 11: Competitors module:**
  - Implemented `supabase/functions/scan-competitor/index.ts` with CORS, JWT authentication, Marketing agent enabled check, quota validation, safe URL page fetch (`fetchPublicPage`) with SSRF defense (blocking loopback, private RFC 1918, link-local, cloud metadata IPs, DNS re-resolution, 3-redirect cap, 8s timeout, 500KB cap, HTML visible text extraction capped at 12,000 chars), Gemini reasoning with `COMPETITOR_SCAN_PROMPT`, updating `competitors` row (`analysis`, `last_scanned_at`), and logging audit row in `agent_runs` for the Marketing agent.
  - Implemented `src/features/competitors/`:
    - `schemas.ts`: validation schema enforcing valid HTTP/HTTPS URLs and client-side blocking of internal/private hosts.
    - `api.ts`: Supabase queries for competitors list, fetch by ID, create, update, and delete.
    - `hooks.ts`: React Query hooks (`useCompetitors`, `useCompetitor`, `useCreateCompetitor`, `useUpdateCompetitor`, `useDeleteCompetitor`, `useScanCompetitor`).
    - `components/add-competitor-dialog.tsx`: dialog with client-side URL validation.
    - `components/delete-competitor-dialog.tsx`: confirmation modal.
    - `components/competitor-card.tsx`: card with competitor name, clean domain link, last scanned date, and Scan button with multi-step progress indicators ("Fetching page...", "Analyzing...").
    - `components/competitor-detail-view.tsx`: tabbed intelligence view showing market positioning statement, operational strengths vs weaknesses, pricing models, recent signals, and a sales battlecard tab with win themes, landmines to defuse, and a copyable executive sales talk track. Friendly error banner for blocked URLs or fetch failures (never a blank screen).
  - Implemented `/app/competitors` route page supporting responsive grid layout, debounced search, sample data loader, and detail view via `?competitorId=...`.
  - Created unit tests in `tests/unit/safe-url.test.ts` (5 tests) and Deno tests in `supabase/functions/_shared/tests/safe_url_test.ts` verifying blocked cases (`http://localhost`, `http://127.0.0.1`, `http://169.254.169.254`, `http://10.0.0.1`, redirect to private IP, non-HTTP scheme, huge response handling).
  - Validated: `npm run lint` (0 errors), `npm run typecheck` (0 errors), `npm run test` (47/47 passing), `npm run build` (built in 7.18s).
- [x] **Prompt 12: Revenue module and Command Center:**
  - Implemented `src/features/revenue/forecast.ts`: pure mathematical models with comprehensive formulas and JSDoc documentation for 3-scenario forecasts (Expected, Best Case with stage-adjusted upside multipliers, Worst Case with mature-deal discounting and early stage elimination), weighted pipeline by month, win rate calculation, average deal size, and average sales cycle in days.
  - Authored unit test suite `tests/unit/forecast.test.ts` with 7 comprehensive tests covering scenario calculations, month grouping, cycle calculation, and edge cases (all 7 passing).
  - Implemented `supabase/functions/explain-forecast/index.ts` with CORS, JWT auth, Finance agent enabled check, daily quota check, Gemini 2.5 Flash invocation using `FORECAST_EXPLAIN_PROMPT`, and audit log in `agent_runs` for the Finance agent.
  - Implemented `src/features/revenue/`:
    - `api.ts`, `hooks.ts`, `schemas.ts` for deals CRUD and forecast explanation.
    - `components/deal-dialog.tsx`: Zod + React Hook Form dialog for adding and editing deals.
    - `components/delete-deal-dialog.tsx`: confirm dialog for deleting deals.
    - `components/deals-kanban.tsx`: responsive Kanban board across 6 stages (Prospecting, Qualified, Proposal, Negotiation, Won, Lost) with drag-and-drop support, accessible fallback dropdowns, and immediate optimistic updates on stage transitions.
    - `components/forecast-area-chart.tsx`: animated AreaChart rendering Best, Expected, and Worst scenarios with Aurora gradients.
    - `components/pipeline-bar-chart.tsx`: animated volume and deal-count bar chart by stage.
    - `components/ai-forecast-panel.tsx`: AI Finance Director narrative and risk factor evaluation panel with one-click copy.
  - Implemented `/app/revenue` route page featuring 5 top KPI summary cards (Open Pipeline, Expected Forecast, Best Case, Worst Case, Historical Win Rate), AI forecast panel, interactive forecast and pipeline charts, and full Kanban board.
  - Rewrote `/app/index.tsx` Command Center dashboard into a live executive cockpit:
    - 4 primary KPI cards with `CountUp` animations: Open Pipeline, Expected Forecast, Hot Leads count (score >= 70), and MRR at Risk.
    - Forecast scenario area chart and pipeline distribution bar chart.
    - Top leads table with score badges and one-click drawer preview.
    - At-risk customer accounts list with risk badges and MRR at risk.
    - Real-time agent activity feed sourced from `agent_runs` (newest first).
    - Top action bar with "Run today's brief" button and tooltip.
    - Sample data loader banner when workspace has no data.
  - Validated: `npm run lint` (0 errors), `npm run typecheck` (0 errors), `npm run test` (54/54 passing), `npm run build` (built in 27.46s).

## In progress
- Ready to proceed with **Prompt 13: Agents and AI CEO**.

## Next
1. **Prompt 13: Agents and AI CEO**
   - Build `/app/agents` roster and `/app/ceo` strategic planner with `ceo-command` Edge Function.
2. **Prompt 14: Insights and Settings**
   - Build `/app/insights` daily brief (`daily-insights` Edge Function) and `/app/settings` with `delete-account`.
3. **Prompt 15: Polish, accessibility and performance**
   - Full WCAG 2.2 AA audit, code-splitting, responsive polish, and motion QA.
4. **Prompt 16: Tests and CI**
   - Implement Vitest unit/component tests and Playwright E2E flows; verify CI pipeline.
5. **Prompt 17: Deployment prep, final cleanup and QA**
   - Delete `legacy/`, run clean string checks, audit security checklist, and report final metrics.

## Decisions
- **SPA Architecture:** Abandoned TanStack Start SSR / Nitro server in favor of a clean, static React 19 SPA deployable to Cloudflare Pages.
- **AI Boundary:** Google Gemini API keys are isolated strictly within Supabase Edge Functions. Frontend only uses Supabase publishable key and user JWT.
- **Data Layer:** Dropped Drizzle ORM in favor of standard PostgreSQL migrations (`supabase/migrations/0001_init.sql`) with mandatory Row Level Security (RLS) policies.
- **Package Management:** Standardized on `npm` (`package-lock.json`), removing Bun and Yarn artifacts.
- **Design Language:** Obsidian & Aurora theme (near-black `#05060A`, mint `#2DE2A6`, cyan `#22D3EE`, gold `#F5B94A`) replacing previous Indigo light aesthetic.
- **Currency:** Exclusively USD ($), formatted with `Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })`.
- **Zero Synthetic Claims:** All landing metrics, tech logos, and product statements reflect verified architectural realities; sample product simulator explicitly labeled with "Sample Data" banner.
- **Edge Architecture:** Shared Edge Function infrastructure (`_shared/`) standardizes CORS, JWT verification, tenant isolation, daily AI quotas, Gemini model fallback, and SSRF defenses.

## Blocked
- None currently.
