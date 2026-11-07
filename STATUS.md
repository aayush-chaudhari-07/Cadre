# Cadre Project Status

Last updated: Prompt 2 (Design System and Motion Primitives)

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

## In progress
- Ready to proceed with **Prompt 3: Database, types and Supabase config**.

## Next
1. **Prompt 3: Database, types and Supabase config**
   - Review and verify `supabase/migrations/0001_init.sql`.
   - Setup `src/lib/supabase.ts` and generate `src/types/database.ts`.
   - Document RLS isolation test in `tests/sql/isolation.md`.
2. **Prompt 4: Authentication, onboarding and route guards**
   - Implement `AuthProvider`, `/login`, `/signup`, `/forgot-password`, `/reset-password`.
   - Build `WorkspaceProvider` and `/onboarding`.
   - Enforce route protection on `/app/*`.
3. **Prompt 5: App shell**
   - Build `src/routes/app/route.tsx` with collapsible sidebar, top bar, Cmd+K palette.
   - Stub module routes with branded 404 and error boundaries.
4. **Prompt 6: Landing page, pricing and legal pages**
   - Build marketing sections: Hero, BuiltWith, Bento, AgentOrbit, Interactive Demo, HowItWorks, Pricing, FAQ, Final CTA, Footer.
   - Add `/pricing`, `/terms`, `/privacy` routes and generate `og-image.png`.
5. **Prompt 7: Edge Function infrastructure and Gemini client**
   - Scaffold `supabase/functions/_shared/` (cors, http, auth, quota, gemini, schemas, prompts, safe-url).
   - Setup client-side `src/lib/ai.ts` helpers and write Deno tests.
6. **Prompt 8: Leads module**
   - Build `/app/leads` table, CSV import, drawer, and `analyze-lead` Edge Function.
7. **Prompt 9: Meetings module**
   - Build `/app/meetings` list, VTT/SRT transcript upload, and `analyze-meeting` Edge Function.
8. **Prompt 10: Churn module**
   - Build `/app/churn` account table, MRR-at-risk metrics, and `analyze-churn` Edge Function.
9. **Prompt 11: Competitors module**
   - Build `/app/competitors` radar, battlecards, and `scan-competitor` Edge Function with SSRF controls.
10. **Prompt 12: Revenue and Command Center**
    - Build `/app/revenue` forecast models, kanban board, and `explain-forecast` Edge Function.
    - Wire `/app` Command Center with live aggregates.
11. **Prompt 13: Agents and AI CEO**
    - Build `/app/agents` roster and `/app/ceo` strategic planner with `ceo-command` Edge Function.
12. **Prompt 14: Insights and Settings**
    - Build `/app/insights` daily brief (`daily-insights` Edge Function) and `/app/settings` with `delete-account`.
13. **Prompt 15: Polish, accessibility and performance**
    - Full WCAG 2.2 AA audit, code-splitting, responsive polish, and motion QA.
14. **Prompt 16: Tests and CI**
    - Implement Vitest unit/component tests and Playwright E2E flows; verify CI pipeline.
15. **Prompt 17: Deployment prep, final cleanup and QA**
    - Delete `legacy/`, run clean string checks, audit security checklist, and report final metrics.

## Decisions
- **SPA Architecture:** Abandoned TanStack Start SSR / Nitro server in favor of a clean, static React 19 SPA deployable to Cloudflare Pages.
- **AI Boundary:** Google Gemini API keys are isolated strictly within Supabase Edge Functions. Frontend only uses Supabase publishable key and user JWT.
- **Data Layer:** Dropped Drizzle ORM in favor of standard PostgreSQL migrations (`supabase/migrations/0001_init.sql`) with mandatory Row Level Security (RLS) policies.
- **Package Management:** Standardized on `npm` (`package-lock.json`), removing Bun and Yarn artifacts.
- **Design Language:** Obsidian & Aurora theme (near-black `#05060A`, mint `#2DE2A6`, cyan `#22D3EE`, gold `#F5B94A`) replacing previous Indigo light aesthetic.
- **Currency:** Exclusively USD ($), formatted with `Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })`.

## Blocked
- None currently. (User will need to supply Supabase project credentials and a Gemini API key prior to testing Edge Functions in Prompt 7+).
