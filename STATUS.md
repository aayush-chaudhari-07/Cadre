# Cadre Project Status

Last updated: Prompt 3 (Database, types and Supabase config)

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

## How to generate types from your remote Supabase project
Once you have created your Supabase project in the Supabase Dashboard:
1. Log in with the Supabase CLI:
   ```bash
   npx supabase login
   ```
2. Link your local project to your remote Supabase project:
   ```bash
   npx supabase link --project-ref <your-project-ref>
   ```
3. Push the migration to your database:
   ```bash
   npx supabase db push
   ```
4. Regenerate TypeScript definitions from the live remote schema:
   ```bash
   npx supabase gen types typescript --project-id <your-project-ref> > src/types/database.ts
   ```
*(Note: If using local Docker development instead, run `npx supabase start` followed by `npm run types`).*

- [x] **Prompt 5: App shell:**
  - Implemented signed-in shell layout in `src/routes/app/route.tsx` with collapsible sidebar (240px / 72px) and mobile sheet drawer (`DrawerContent side="left"`).
  - Added all 10 sidebar navigation items in exact design doc order with Lucide icons, active mint pill sliding via `layoutId="sidebar-active-pill"`, workspace name/plan header, and real-time AI quota footer card read from `ai_usage`.
  - Implemented sticky top bar (`AppTopbar`) with dynamic breadcrumbs, AI usage pill (`useAiUsage`), `ThemeToggle`, `Ctrl/Cmd+K` palette trigger, and user profile menu (display name, email, settings link, sign-out handler).
  - Built global Command Palette (`CommandPalette`) with keyboard shortcuts (⌘K/Ctrl+K, ⌘N), module jump navigation, theme switcher, and sign-out action.
  - Implemented all 9 module route placeholders: `/app/leads`, `/app/meetings`, `/app/churn`, `/app/competitors`, `/app/revenue`, `/app/agents`, `/app/ceo`, `/app/insights`, `/app/settings`.
  - Implemented branded 404 page (`src/components/branded-not-found.tsx` and `src/routes/$.tsx`) and Error Boundary (`src/components/branded-error-boundary.tsx`), both featuring the custom agent-node motif.
  - Added accessibility features: visible skip-to-content landmark link, keyboard navigation across sidebar and command palette, and persisted sidebar collapsed state in `localStorage` under `cadre.sidebar_collapsed`.
  - Validated: `npm run lint` (0 errors, 0 warnings), `npm run typecheck` (0 errors), `npm run test` (18/18 passing), `npm run build` (built in 4.31s).

## How to generate types from your remote Supabase project
Once you have created your Supabase project in the Supabase Dashboard:
1. Log in with the Supabase CLI:
   ```bash
   npx supabase login
   ```
2. Link your local project to your remote Supabase project:
   ```bash
   npx supabase link --project-ref <your-project-ref>
   ```
3. Push the migration to your database:
   ```bash
   npx supabase db push
   ```
4. Regenerate TypeScript definitions from the live remote schema:
   ```bash
   npx supabase gen types typescript --project-id <your-project-ref> > src/types/database.ts
   ```
*(Note: If using local Docker development instead, run `npx supabase start` followed by `npm run types`).*

## In progress
- Ready to proceed with **Prompt 6: Landing page, pricing and legal pages**.

## Next
1. **Prompt 6: Landing page, pricing and legal pages**
   - Build marketing sections in `src/components/marketing`: Hero, BuiltWith, ProblemStats, Bento, AgentOrbit, Demo, HowItWorks, Pricing, Faq, FinalCta, Footer.
   - Word-reveal headline, tilting dashboard preview, Lenis smooth scroll on landing, ScrollProgress bar.
   - Standalone `/pricing`, `/terms`, `/privacy` pages.
   - Generate `public/og-image.png` (1200x630) with script.
2. **Prompt 7: Edge Function infrastructure and Gemini client**
   - Scaffold `supabase/functions/_shared/` (cors, http, auth, quota, gemini, schemas, prompts, safe-url).
   - Setup client-side `src/lib/ai.ts` helpers and write Deno tests.
5. **Prompt 8: Leads module**
   - Build `/app/leads` table, CSV import, drawer, and `analyze-lead` Edge Function.
6. **Prompt 9: Meetings module**
   - Build `/app/meetings` list, VTT/SRT transcript upload, and `analyze-meeting` Edge Function.
7. **Prompt 10: Churn module**
   - Build `/app/churn` account table, MRR-at-risk metrics, and `analyze-churn` Edge Function.
8. **Prompt 11: Competitors module**
   - Build `/app/competitors` radar, battlecards, and `scan-competitor` Edge Function with SSRF controls.
9. **Prompt 12: Revenue and Command Center**
   - Build `/app/revenue` forecast models, kanban board, and `explain-forecast` Edge Function.
   - Wire `/app` Command Center with live aggregates.
10. **Prompt 13: Agents and AI CEO**
    - Build `/app/agents` roster and `/app/ceo` strategic planner with `ceo-command` Edge Function.
11. **Prompt 14: Insights and Settings**
    - Build `/app/insights` daily brief (`daily-insights` Edge Function) and `/app/settings` with `delete-account`.
12. **Prompt 15: Polish, accessibility and performance**
    - Full WCAG 2.2 AA audit, code-splitting, responsive polish, and motion QA.
13. **Prompt 16: Tests and CI**
    - Implement Vitest unit/component tests and Playwright E2E flows; verify CI pipeline.
14. **Prompt 17: Deployment prep, final cleanup and QA**
    - Delete `legacy/`, run clean string checks, audit security checklist, and report final metrics.

## Decisions
- **SPA Architecture:** Abandoned TanStack Start SSR / Nitro server in favor of a clean, static React 19 SPA deployable to Cloudflare Pages.
- **AI Boundary:** Google Gemini API keys are isolated strictly within Supabase Edge Functions. Frontend only uses Supabase publishable key and user JWT.
- **Data Layer:** Dropped Drizzle ORM in favor of standard PostgreSQL migrations (`supabase/migrations/0001_init.sql`) with mandatory Row Level Security (RLS) policies.
- **Package Management:** Standardized on `npm` (`package-lock.json`), removing Bun and Yarn artifacts.
- **Design Language:** Obsidian & Aurora theme (near-black `#05060A`, mint `#2DE2A6`, cyan `#22D3EE`, gold `#F5B94A`) replacing previous Indigo light aesthetic.
- **Currency:** Exclusively USD ($), formatted with `Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })`.

## Blocked
- None currently.
