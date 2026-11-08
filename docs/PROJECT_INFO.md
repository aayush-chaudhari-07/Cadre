# PROJECT_INFO.md: Architectural Audit & Codebase Specification

> **Audit Date:** November 2026  
> **Auditor:** Senior Software Architect  
> **Project Root:** `.`  
> **Repository Mode:** Read-Only Full Audit  

---

## 1. Project Overview

### 1.1 Current Name & Summary
* **Current Working Name:** **FlowMind AI** (also identified as *FlowMind AI Growth Engine(ORG-03)* in [`README.md`](file:///README.md#L1) and `tanstack_start_ts` in [`package.json`](file:///package.json#L2)).
* **Tagline:** *"A team of AI employees that grows your business automatically."* ([`README.md`](file:///README.md#L8), [`src/routes/__root.tsx`](file:///src/routes/__root.tsx#L82)).
* **Plain Language Description:** FlowMind AI is pitched as an autonomous B2B revenue and business growth engine. It presents a centralized dashboard where virtual "AI employees" (AI Sales Manager, Support Manager, Marketing Manager, Operations Manager, Finance Director, and an "AI CEO") supposedly automate lead qualification, churn risk detection, revenue forecasting, meeting intelligence, and competitor monitoring.
* **Target Audience:** B2B SaaS founders, revenue operations (RevOps) leaders, growth managers, and executive leadership teams seeking unified sales intelligence and workflow automation.
* **The Problem It Aims to Solve:** Solves fragmented sales tooling, slow lead follow-ups, unexpected customer churn, blind spots in competitor pricing, and unanalyzed customer sales recordings by aggregating telemetry into actionable, AI-driven workflows.

### 1.2 Current Development Status: Prototype / UI Mockup
**Verdict: Early-Stage Prototype / Interactive Frontend Mockup.**  
While the user interface features high polish, sophisticated animations, and responsive layouts, the application has **no working AI engine, no database data persistence, and no real API backend**. 

**Direct Code Evidence:**
1. **Mock Data Everywhere:** The main dashboard [`src/routes/_app.index.tsx`](file:///src/routes/_app.index.tsx#L52) explicitly annotates all visual metrics with `// ===== Mock data =====`. All metrics, lead funnels, and revenue curves are hardcoded static JavaScript arrays.
2. **Fake Async Simulations:**
   * In [`src/routes/_app.leads.tsx`](file:///src/routes/_app.leads.tsx#L338-L349), uploading WhatsApp/email/call files triggers a fake `setInterval` that increments a progress percentage counter to 100% without reading or transferring files.
   * In [`src/routes/_app.ceo.tsx`](file:///src/routes/_app.ceo.tsx#L108-L117), sending commands to the "AI CEO" triggers a `setTimeout(..., 1400)` that toggles a boolean flag to render a hardcoded execution plan.
   * In [`src/routes/_app.meetings.tsx`](file:///src/routes/_app.meetings.tsx#L74-L83), file and recording uploads run a `setTimeout` timer for 1.4 seconds before rendering pre-written meeting transcripts.
   * In [`src/routes/_app.competitors.tsx`](file:///src/routes/_app.competitors.tsx#L143-L151), the URL competitor scanner sets a boolean delay before displaying static competitor stats.
3. **Unprotected Dashboard Routes:** While auth screens exist, [`src/routes/_app.tsx`](file:///src/routes/_app.tsx) does not verify credentials or tokens. Any unauthenticated browser can access all dashboard screens directly.
4. **Blank Database Schema:** [`drizzle/schema.ts`](file:///drizzle/schema.ts#L1) contains only `// auto-generated and intentionally left blank, do not edit`, and [`drizzle/migrations/meta/_journal.json`](file:///drizzle/migrations/meta/_journal.json#L4) contains zero migration entries.
5. **Disconnected Auth State:** An authentication provider [`src/components/auth/auth-session-provider.tsx`](file:///src/components/auth/auth-session-provider.tsx) was scaffolded but is **never imported or mounted** in [`src/routes/__root.tsx`](file:///src/routes/__root.tsx) or [`src/router.tsx`](file:///src/router.tsx).
6. **Roadmap State:** [`roadmap.md`](file:///roadmap.md#L1-L3) contains three unchecked tasks confirming incomplete auth and route protection:
   * `[ ] Build branded sign-in, sign-up, and password-recovery screens.` (Screens were created, but session wiring is incomplete)
   * `[ ] Protect the dashboard and connect the signed-in account menu.` (Unimplemented)
   * `[ ] Verify public auth screens and protected-route redirects in the preview.` (Unimplemented)

### 1.3 Existing README Summary
[`README.md`](file:///README.md) defines the design prompt used to generate the application via [Lovable.dev](https://lovable.dev) (Project ID: `490d7f0a-aafc-4e25-a53c-23bc5ca4a4bd`). It mandates:
* A Silicon Valley startup aesthetic ("Stripe + Notion + Linear + OpenAI combined").
* Specific brand colors: Primary `#4F46E5`, `#6366F1`; Secondary `#06B6D4`, `#8B5CF6`; Backgrounds `#FFFFFF`, `#F8FAFC`, `#EEF2FF`; Text `#0F172A`, `#334155`, `#64748B`.
* Typography: Inter and Poppins fonts.
* Nine dashboard modules: AI Command Center, Lead Intelligence, Revenue Prediction, Churn Detection, Meeting Analyzer, Competitor Analyzer, AI Agents, Business Insights, AI CEO, and Settings.
* Standard local clone and run commands (`npm i`, `npm run dev`).

---

## 2. Tech Stack

### 2.1 Dependencies & Versions (from [`package.json`](file:///package.json))

| Layer | Technology | Version | Purpose |
| :--- | :--- | :--- | :--- |
| **Language** | TypeScript | `^5.8.3` | Type-safe JavaScript application code |
| **UI Library** | React / React DOM | `^19.2.0` | Frontend UI rendering |
| **Meta-Framework** | TanStack Start | `1.168.60` | Fullstack SSR framework |
| **Client Routing** | TanStack Router | `1.170.41` | Type-safe client-side routing |
| **Router Plugin** | `@tanstack/router-plugin` | `1.168.42` | Route code-generation during build |
| **Bundler / Server** | Vite / Nitro | Vite `^8.0.16` / Nitro `3.0.260603-beta` | Build pipeline and SSR execution |
| **Vite Config** | `@lovable.dev/vite-tanstack-config` | `2.26.5` | Lovable-managed Vite & Nitro configuration |
| **Styling** | Tailwind CSS v4 | `^4.2.1` | Utility-first CSS styling via `@tailwindcss/vite` |
| **Animation CSS** | `tw-animate-css` | `^1.3.4` | CSS keyframe utilities |
| **Motion** | Framer Motion | `^12.40.0` | Declarative UI animations & transitions |
| **Primitive UI** | Radix UI | Various (`^1.1` - `^2.2`) | Headless accessibility components |
| **Icon Library** | Lucide React | `^0.575.0` | Vector icons |
| **Charts** | Recharts | `^2.15.4` | SVG charting library |
| **Data Fetching** | TanStack React Query | `^5.83.0` | Server state manager (configured, unused) |
| **BaaS / Auth** | Supabase JS | `^2.119.0` | Client authentication and PostgreSQL client |
| **OAuth Broker** | `@lovable.dev/cloud-auth-js` | `^1.1.2` | Lovable OAuth helper |
| **ORM / Database** | Drizzle ORM / Postgres | Drizzle `0.x`, `postgres` `^4.1.0` | PostgreSQL client & ORM (schema unwritten) |
| **Validation** | Zod | `^3.24.2` | Schema parsing & search param validation |
| **Forms** | React Hook Form | `^7.71.2` | Form management (installed, unused) |
| **Notifications** | Sonner | `^2.0.7` | Toast notification system |
| **Carousel** | Embla Carousel React | `^8.6.0` | Touch-enabled carousel component |
| **Date Utilities** | `date-fns` / `react-day-picker` | `^4.1.0` / `^9.14.0` | Date formatting and calendar picker |
| **Drawer** | Vaul | `^1.1.2` | Mobile drawer component |
| **OTP Input** | `input-otp` | `^1.4.2` | One-time password inputs |
| **Command Palette** | `cmdk` | `^1.1.1` | Headless command menu |
| **Linter / Formatter** | ESLint 9 / Prettier | `^9.32.0` / `^3.7.3` | Code quality and syntax formatting |

### 2.2 Package Manager & Supply Chain
* **Configured Package Manager:** Bun (present via [`bun.lock`](file:///bun.lock) and [`bunfig.toml`](file:///bunfig.toml)).
* **Supply Chain Guard:** [`bunfig.toml`](file:///bunfig.toml#L1-L6) enforces a 24-hour publication delay (`minimumReleaseAge = 86400`) except for whitelisted Lovable internal packages (`@lovable.dev/vite-tanstack-config`, `@lovable.dev/mcp-js`, `@lovable.dev/vite-plugin-dev-server-bridge`, `@lovable.dev/vite-plugin-hmr-gate`).
* **Installed System Runtimes:** Node.js `v24.20.0`, npm `11.19.0`, Git `2.56.0.windows.2`. `bun` CLI is not installed locally on this host.

---

## 3. Folder and File Structure

### 3.1 Repository Tree
```
AI Models/
├── .lovable/
│   └── project.json                     # Lovable project metadata and template version
├── drizzle/
│   ├── migrations/
│   │   └── meta/
│   │       └── _journal.json            # Drizzle migration journal (0 entries)
│   └── schema.ts                        # Drizzle database schema (empty placeholder)
├── src/
│   ├── components/
│   │   ├── auth/
│   │   │   ├── auth-session-provider.tsx# React Context for auth state (unused/unmounted)
│   │   │   └── auth-shell.tsx           # Split-screen branding layout & Google OAuth button
│   │   ├── flow/
│   │   │   ├── app-sidebar.tsx          # Main dashboard navigation sidebar
│   │   │   ├── primitives.tsx           # Shared UI cards, headers, stat badges, background orbs
│   │   │   └── top-nav.tsx              # Top navigation bar, search modal, user dropdown
│   │   └── ui/                          # 46 shadcn/radix UI wrapper components (see Section 5)
│   ├── hooks/
│   │   └── use-mobile.tsx               # Viewport breakpoint detection hook (<768px)
│   ├── integrations/
│   │   ├── lovable/
│   │   │   └── index.ts                 # Lovable OAuth provider helper
│   │   └── supabase/
│   │       ├── auth-attacher.ts         # Middleware attaching JWT to RPCs
│   │       ├── auth-middleware.ts       # Server middleware verifying JWT claims
│   │       ├── client.server.ts         # Supabase service-role client (RLS bypass)
│   │       ├── client.ts                # Supabase browser client with brokered storage
│   │       ├── cron-auth.ts             # Timing-safe HMAC auth for scheduled jobs
│   │       ├── previewAuthStorage.ts    # postMessage auth storage sync for Lovable iframe
│   │       └── types.ts                 # TypeScript types generated from Supabase DB
│   ├── lib/
│   │   ├── auth-session.ts              # Remember-me & tab-only session helpers
│   │   ├── error-capture.ts             # Global error capture listener for Nitro/H3
│   │   ├── error-page.ts                # Pure HTML fallback error page renderer
│   │   ├── lovable-error-reporting.ts   # In-editor error boundary telemetry
│   │   └── utils.ts                     # cn() clsx + tailwind-merge helper
│   ├── routes/
│   │   ├── README.md                    # Routing conventions guide
│   │   ├── __root.tsx                   # App shell, SEO meta, TanStack Query provider, 404/Error
│   │   ├── _app.tsx                     # Dashboard layout route (sidebar, topnav, main outlet)
│   │   ├── _app.agents.tsx              # /agents: AI agent workforce overview cards
│   │   ├── _app.ceo.tsx                 # /ceo: Executive AI command prompt simulator
│   │   ├── _app.churn.tsx               # /churn: Customer retention risk matrix
│   │   ├── _app.competitors.tsx         # /competitors: Competitive intelligence & feature radar
│   │   ├── _app.index.tsx               # /: Main AI Command Center dashboard
│   │   ├── _app.insights.tsx            # /insights: Narrative daily business digest
│   │   ├── _app.leads.tsx               # /leads: Lead intelligence table & simulator
│   │   ├── _app.meetings.tsx            # /meetings: Sales meeting transcript analyzer
│   │   ├── _app.revenue.tsx             # /revenue: ARR forecasting and pipeline models
│   │   ├── _app.settings.tsx            # /settings: Workspace and agent sensitivity settings
│   │   ├── auth.tsx                     # /auth: Email and password sign-in screen
│   │   ├── forgot-password.tsx          # /forgot-password: Password recovery link request
│   │   ├── reset-password.tsx           # /reset-password: Password update completion form
│   │   └── signup.tsx                   # /signup: User account registration screen
│   ├── router.tsx                       # TanStack Router instance & QueryClient factory
│   ├── routeTree.gen.ts                 # Auto-generated routing manifest
│   ├── server.ts                        # Nitro SSR entry point & error normalizer
│   ├── start.ts                         # TanStack Start instance & middleware pipeline
│   └── styles.css                       # Tailwind v4 theme, OKLCH design tokens & utilities
├── supabase/
│   └── config.toml                      # Supabase CLI project identifier
├── .env                                 # Local environment variables (Supabase keys)
├── .gitignore                           # Git ignore rules (omits .env!)
├── .prettierignore                      # Prettier exclusions
├── .prettierrc                          # Prettier configuration
├── AGENTS.md                            # Lovable AI agent directives & history rules
├── bun.lock                             # Bun dependency lockfile
├── bunfig.toml                          # Bun install and supply-chain configuration
├── components.json                      # shadcn/ui configuration file
├── drizzle.config.ts                    # Drizzle ORM migration configuration
├── eslint.config.js                     # ESLint 9 configuration
├── package.json                         # Node.js project manifest & scripts
├── README.md                            # Project prompt description and requirements
├── roadmap.md                           # Authentication rollout checklist
├── tsconfig.json                        # TypeScript compiler configuration
└── vite.config.ts                       # Vite build configuration delegating to Lovable
```

### 3.2 Entry Points & Boot Sequence
1. **Server Boot (`SSR`):** Nitro invokes [`src/server.ts`](file:///src/server.ts). It imports [`src/lib/error-capture.ts`](file:///src/lib/error-capture.ts) to intercept unhandled promise rejections. Incoming HTTP requests are passed to TanStack Start's `getServerEntry().fetch()`. If Nitro or H3 catches a catastrophic unhandled 500 error, it intercepts the JSON error and returns a standalone fallback HTML document from [`src/lib/error-page.ts`](file:///src/lib/error-page.ts).
2. **Start Pipeline:** [`src/start.ts`](file:///src/start.ts) configures `createStart()` with `attachSupabaseAuth` (which adds the active Supabase JWT to server requests) and `errorMiddleware`.
3. **Router Creation:** [`src/router.tsx`](file:///src/router.tsx) instantiates a fresh `QueryClient` and calls `createRouter()` with [`src/routeTree.gen.ts`](file:///src/routeTree.gen.ts), enabling scroll restoration and preloading.
4. **Root Mounting:** [`src/routes/__root.tsx`](file:///src/routes/__root.tsx) renders the HTML `<head>` (Google Fonts `Inter` and `Poppins`, OpenGraph tags, styles), wraps children in `QueryClientProvider`, and renders `<Outlet />`.
5. **Layout Route:** Requests to `/` or any dashboard route load [`src/routes/_app.tsx`](file:///src/routes/_app.tsx), rendering `FloatingOrbs`, `AppSidebar`, `TopNav`, and the nested page component inside `<Outlet />`.

---

## 4. Features

### 4.1 Implemented & Functional Features
* **Client-Side Authentication Interface:**
  * Email + password sign-in ([`src/routes/auth.tsx`](file:///src/routes/auth.tsx)) and registration ([`src/routes/signup.tsx`](file:///src/routes/signup.tsx)) wired to `supabase.auth`.
  * Password recovery email dispatch ([`src/routes/forgot-password.tsx`](file:///src/routes/forgot-password.tsx)) and password reset hash verification ([`src/routes/reset-password.tsx`](file:///src/routes/reset-password.tsx)).
  * OAuth authentication trigger for Google and Lovable via `@lovable.dev/cloud-auth-js`.
  * Configurable session persistence: Remember-me toggles between permanent `localStorage` and tab-scoped `sessionStorage` ([`src/lib/auth-session.ts`](file:///src/lib/auth-session.ts)).
* **Client-Side Data Filtering & Interactivity:**
  * **Lead Filtering:** [`src/routes/_app.leads.tsx`](file:///src/routes/_app.leads.tsx) allows full-text search, status filtering ("Hot", "Warm", "Cold", "Lost"), sorting (by score, revenue, probability, recency), and opening individual lead profiles in an interactive drawer.
  * **Churn Risk Matrix:** [`src/routes/_app.churn.tsx`](file:///src/routes/_app.churn.tsx) filters accounts by threat tier ("Critical", "High", "Medium", "Low").
  * **Competitor Profiler:** [`src/routes/_app.competitors.tsx`](file:///src/routes/_app.competitors.tsx) toggles dynamic feature radars and strengths/weaknesses between 4 preset competitor profiles.
  * **Global Search Palette:** [`src/components/flow/top-nav.tsx`](file:///src/components/flow/top-nav.tsx#L143-L210) provides a modal dialog opened via `Cmd+K` / `Ctrl+K`.
  * **Responsive Navigation Drawer:** Mobile hamburger menu toggles a responsive sliding drawer on small screens ([`src/routes/_app.tsx`](file:///src/routes/_app.tsx#L21-L42)).

### 4.2 Half-Built Features, Placeholders & Dead Code
* **Unprotected Application Shell:** [`src/routes/_app.tsx`](file:///src/routes/_app.tsx) has **no session gate or redirect logic**. Anyone can browse all business metrics without signing in.
* **Orphaned Auth Session Provider:** [`src/components/auth/auth-session-provider.tsx`](file:///src/components/auth/auth-session-provider.tsx) contains complete logic for `useAuthSession()` and `onAuthStateChange`, but it is **not imported anywhere in the project**.
* **Mocked Lead & Meeting Uploads:** File upload inputs do not read files; they execute dummy timer loops.
* **Simulated AI CEO:** The console takes text input but renders a pre-written static execution plan after a 1.4s delay regardless of prompt.
* **Static Notifications & User Menu:**
  * The bell menu in [`src/components/flow/top-nav.tsx`](file:///src/components/flow/top-nav.tsx#L15-L20) displays four hardcoded notifications. "Mark all as read" has no click handler.
  * The user profile avatar is hardcoded to "Alex Morgan" (`AM`, "Pro · Acme Inc."). "Sign out", "Profile", and "Billing" items have no event handlers.
* **Dead Settings Form:** The settings form in [`src/routes/_app.settings.tsx`](file:///src/routes/_app.settings.tsx#L53-L55) contains a "Save changes" button with no `onClick` or `onSubmit` handler.
* **Unused shadcn Components:** 34 UI components in [`src/components/ui/`](file:///src/components/ui/) are completely unreferenced (e.g., [`sidebar.tsx`](file:///src/components/ui/sidebar.tsx) is 24KB of dead code).
* **Unused Backend Artifacts:**
  * [`drizzle/schema.ts`](file:///drizzle/schema.ts): Completely blank.
  * [`src/integrations/supabase/auth-middleware.ts`](file:///src/integrations/supabase/auth-middleware.ts): Exports `requireSupabaseAuth`, but no server routes or server functions import it.
  * [`src/integrations/supabase/cron-auth.ts`](file:///src/integrations/supabase/cron-auth.ts): Exports `authenticateCronRequest`, but no cron endpoints exist.

### 4.3 User Roles and Permissions
* **Current State:** No Role-Based Access Control (RBAC).
* **Observed UI Badges:** The UI displays a hardcoded "Pro" tier badge ([`src/components/flow/app-sidebar.tsx`](file:///src/components/flow/app-sidebar.tsx#L110), [`src/routes/_app.settings.tsx`](file:///src/routes/_app.settings.tsx#L75)), but there is no subscription check, organization switcher, or role enforcement.

---

## 5. Frontend Inventory

### 5.1 Route Inventory

| Route Path | File Path | Title & Description | Auth Required? | Data Source |
| :--- | :--- | :--- | :--- | :--- |
| `/` | [`src/routes/_app.index.tsx`](file:///src/routes/_app.index.tsx) | **AI Command Center**: Real-time revenue velocity, funnel charts, and agent activities. | No (Public) | Hardcoded JavaScript objects |
| `/leads` | [`src/routes/_app.leads.tsx`](file:///src/routes/_app.leads.tsx) | **Lead Intelligence**: ICP scoring, WhatsApp/call signal ingestion, and deal sizing. | No (Public) | Hardcoded `LEADS` array (9 items) |
| `/revenue` | [`src/routes/_app.revenue.tsx`](file:///src/routes/_app.revenue.tsx) | **Revenue Prediction**: ARR trajectories, confidence bands, and deal-expansion alerts. | No (Public) | Mathematical `Math.sin/cos` formula |
| `/churn` | [`src/routes/_app.churn.tsx`](file:///src/routes/_app.churn.tsx) | **Churn Detection**: At-risk customer accounts, customer sentiment quotes, retention plays. | No (Public) | Hardcoded `accounts` array (7 items) |
| `/meetings` | [`src/routes/_app.meetings.tsx`](file:///src/routes/_app.meetings.tsx) | **Meeting Analyzer**: Discovery call transcription summary, action items, objections. | No (Public) | Hardcoded "Acme Corp" meeting record |
| `/competitors`| [`src/routes/_app.competitors.tsx`](file:///src/routes/_app.competitors.tsx) | **Competitor Analyzer**: Feature matrix, market share trajectory, win/loss battlecards. | No (Public) | Hardcoded `competitors` array (4 items) |
| `/agents` | [`src/routes/_app.agents.tsx`](file:///src/routes/_app.agents.tsx) | **AI Workforce**: Status, compute loads, and success rates for 5 department agents. | No (Public) | Hardcoded `agents` array (5 items) |
| `/insights` | [`src/routes/_app.insights.tsx`](file:///src/routes/_app.insights.tsx) | **Business Insights**: Segment distribution charts, channel performance, daily brief. | No (Public) | Hardcoded `channels` & `mix` arrays |
| `/ceo` | [`src/routes/_app.ceo.tsx`](file:///src/routes/_app.ceo.tsx) | **AI CEO**: High-level command console orchestrating cross-agent strategic plays. | No (Public) | Hardcoded 4-phase execution plan |
| `/settings` | [`src/routes/_app.settings.tsx`](file:///src/routes/_app.settings.tsx) | **Settings**: Profile fields, agent autonomy toggles, subscription status. | No (Public) | Hardcoded form default values |
| `/auth` | [`src/routes/auth.tsx`](file:///src/routes/auth.tsx) | **Sign In**: Email/password authentication and OAuth redirects. | Public | Supabase Auth API |
| `/signup` | [`src/routes/signup.tsx`](file:///src/routes/signup.tsx) | **Sign Up**: Account creation with display name and email verification. | Public | Supabase Auth API |
| `/forgot-password`| [`src/routes/forgot-password.tsx`](file:///src/routes/forgot-password.tsx) | **Account Recovery**: Triggers reset password link dispatch. | Public | Supabase Auth API |
| `/reset-password` | [`src/routes/reset-password.tsx`](file:///src/routes/reset-password.tsx) | **Set Password**: Validates recovery session token and updates password. | Public / Token | Supabase Auth API |

### 5.2 State Management & Data Fetching
* **Client State:** Handled exclusively via component-level React hooks (`useState`, `useMemo`, `useRef`).
* **Server State:** `@tanstack/react-query` is registered on the root router ([`src/router.tsx`](file:///src/router.tsx#L6), [`src/routes/__root.tsx`](file:///src/routes/__root.tsx#L124)), but **zero `useQuery` or `useMutation` hooks exist in the entire application**.
* **Form Handling:** Controlled inputs with `useState`. No integration with `react-hook-form` or `@hookform/resolvers` despite both being present in `package.json`. Zod is used only for URL search parameter validation (`/auth` and `/signup`).

### 5.3 Design System & Aesthetics
* **Theme Specification:** Configured in [`src/styles.css`](file:///src/styles.css) using Tailwind CSS v4 `@theme inline` and OKLCH color values:
  * **Brand Primary:** `#4F46E5` / `oklch(0.515 0.225 277)` (Indigo 600)
  * **Primary Glow / Accent:** `#6366F1` / `oklch(0.585 0.215 277)` (Indigo 500)
  * **Secondary Brand Accents:** Violet `#8B5CF6` (`oklch(0.62 0.205 295)`), Cyan `#06B6D4` (`oklch(0.72 0.13 210)`)
  * **Surfaces:** Clean White `#FFFFFF`, Surface `#F8FAFC`, Surface-2 `#EEF2FF`
  * **Text:** Headings `#0F172A` (`oklch(0.205 0.04 265)`), Muted `#64748B` (`oklch(0.55 0.03 257)`)
  * **Border Radius:** Default `--radius: 0.875rem` (14px).
* **Typography:** Loaded from Google Fonts in [`src/routes/__root.tsx`](file:///src/routes/__root.tsx#L97):
  * Headings: `Poppins`, `Inter`, sans-serif (`--font-display`)
  * Body: `Inter`, ui-sans-serif, system-ui (`--font-sans`)
* **Dark Mode:** Dark mode CSS color overrides exist under `.dark` in [`src/styles.css`](file:///src/styles.css#L135-L154). However, **there is no dark mode toggle or theme-switching provider** implemented in the UI.
* **Custom Visual Utilities:** Defined in `src/styles.css`: `.glass`, `.glass-strong`, `.text-gradient`, `.bg-gradient-primary`, `.bg-gradient-mesh`, `.shadow-elegant`, `.shadow-glow`, `.animate-float`, `.animate-blob`, `.animate-shimmer`.
* **Currency Formatting Inconsistency:** The application mixes currencies without configuration:
  * [`src/routes/_app.leads.tsx`](file:///src/routes/_app.leads.tsx#L137), [`src/routes/_app.revenue.tsx`](file:///src/routes/_app.revenue.tsx#L60), and [`src/routes/_app.churn.tsx`](file:///src/routes/_app.churn.tsx#L52) use Indian Rupees (INR `₹`, Lakhs `L`, Crores `Cr`).
  * [`src/routes/_app.settings.tsx`](file:///src/routes/_app.settings.tsx#L76) and [`src/routes/_app.insights.tsx`](file:///src/routes/_app.insights.tsx#L83) use US Dollars (`$249 / month`, `$100K`).

### 5.4 Images & Static Assets
* **Public Directory:** **Does not exist.** The project has no `public/` directory.
* **Favicon:** Missing. No `favicon.ico` or SVG icon is declared in `<head>`.
* **Logo:** No logo image file exists. The logo is rendered dynamically using a Lucide `<Zap />` icon inside a CSS gradient block ([`src/components/flow/app-sidebar.tsx`](file:///src/components/flow/app-sidebar.tsx#L37-L47)).
* **Social Preview Image:** Hardcoded in [`src/routes/__root.tsx`](file:///src/routes/__root.tsx#L90-L91) to an external Cloudflare R2 bucket:
  `https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/ff9465a7-836f-48cf-8bb3-f2af62be1db1/id-preview-87fba1d4--b58fc6ca-5bd6-4275-8817-8998b59fef2c.lovable.app-1782730543369.png`

### 5.5 Responsiveness & Accessibility
* **Responsiveness:** Excellent responsive layout implementation. Mobile breakpoint `<768px` is handled cleanly with `useIsMobile()`, collapsible sidebar drawers, touch-friendly navigation bars, and responsive Recharts wrappers.
* **Accessibility Deficits:**
  * Interactive cards and notification rows are rendered as non-semantic `<div>` or `<button>` elements lacking `aria-expanded`, `aria-controls`, or live regions.
  * Contrast ratio issues: Several secondary badges use white text over light cyan/purple gradients.
  * Form inputs on `/settings` lack associated `<label>` IDs (`htmlFor` attribute is omitted).

---

## 6. Backend and API

### 6.1 Server Endpoints
* **API Routes:** **Zero (`0`) REST or RPC endpoints are declared.**
* There are no file-based API routes in `src/routes/api/` and no TanStack `createServerFn` instances in the codebase.

### 6.2 Server Runtime Architecture
* **SSR Request Handler:** Handled by [`src/server.ts`](file:///src/server.ts) exporting a default object with an `async fetch(request, env, ctx)` handler for Nitro.
* **Catastrophic Error Interception:** [`src/server.ts`](file:///src/server.ts#L23-L38) contains `normalizeCatastrophicSsrResponse()` to detect when Nitro/H3 converts an internal runtime crash into an unhandled JSON error (`{"unhandled":true,"message":"HTTPError"}`). When detected, it substitutes the JSON with the static HTML error page from [`src/lib/error-page.ts`](file:///src/lib/error-page.ts).
* **Middleware Functions:**
  1. [`src/integrations/supabase/auth-attacher.ts`](file:///src/integrations/supabase/auth-attacher.ts): Registered as client-side function middleware in [`src/start.ts`](file:///src/start.ts#L22). Retrieves the session access token from Supabase browser storage and appends `Authorization: Bearer <token>` to outbound server calls.
  2. [`src/integrations/supabase/auth-middleware.ts`](file:///src/integrations/supabase/auth-middleware.ts): Server middleware `requireSupabaseAuth` that verifies bearer tokens, decodes JWT claims, and extracts `userId`. *(Status: Dead code, not attached to any handler).*
  3. [`src/integrations/supabase/cron-auth.ts`](file:///src/integrations/supabase/cron-auth.ts): Helper `authenticateCronRequest(request)` that validates bearer tokens against `LOVABLE_CRON_SECRET` using `crypto.timingSafeEqual`. *(Status: Dead code, no cron jobs exist).*
* **Rate Limiting & Request Throttling:** None.
* **Logging:** No structured logging library (Winston/Pino) is installed; uses standard `console.error()`.

---

## 7. Database and Data

### 7.1 Database Models & Schemas
* **Database Provider:** Configured for PostgreSQL via Supabase and Drizzle ORM.
* **Drizzle ORM Status:** Unused. [`drizzle/schema.ts`](file:///drizzle/schema.ts) is empty, and [`drizzle.config.ts`](file:///drizzle.config.ts) points to an empty migration directory.
* **Supabase Types ([`src/integrations/supabase/types.ts`](file:///src/integrations/supabase/types.ts)):**
  Defines exactly **one** table in the public schema:

```typescript
// Table: public.profiles
interface Profile {
  id: string;              // UUID primary key
  user_id: string;         // References auth.users.id
  display_name: string;    // User display name
  avatar_url: string | null;
  created_at: string;      // ISO timestamp
  updated_at: string;      // ISO timestamp
}
```

* **Missing Domain Models:**
  There are **no database tables, columns, or relations** defined for the core application domains:
  * `leads` (contact info, ICP scores, sentiment, revenue attribution)
  * `deals` / `revenue_forecasts`
  * `churn_signals` / `accounts`
  * `meeting_transcripts` / `action_items`
  * `competitor_profiles`
  * `agent_configurations` / `tasks`

### 7.2 Migrations & Data Access
* **Migrations:** Zero SQL migration scripts exist in the repository.
* **Seed Data:** No SQL or JSON seed files exist.
* **Active Data Access:** Neither `supabase.from('profiles')` nor any Drizzle query is executed anywhere in the codebase. All displayed data is in-memory mock objects.

---

## 8. Authentication and Security

### 8.1 Authentication Architecture
* **Auth Provider:** Supabase Auth (GoTrue).
* **Storage Broker:** [`src/integrations/supabase/previewAuthStorage.ts`](file:///src/integrations/supabase/previewAuthStorage.ts) provides a custom storage adapter. When running inside an iframe on a Lovable preview domain (`lovable.app`, `lovableproject.com`), it synchronizes the session across frames using `window.parent.postMessage`. Outside preview frames, it falls back to standard browser `localStorage`.
* **Session Lifecycle:** [`src/lib/auth-session.ts`](file:///src/lib/auth-session.ts) manages session mode:
  * When `remember = true`, credentials persist in `localStorage`.
  * When `remember = false`, a sentinel key (`flowmind.session-mode = tab-only`) is written to `localStorage` and verified against `sessionStorage`. If the tab closes, `getAuthenticatedUser()` signs out the user upon reopening.

### 8.2 Security Findings & Vulnerabilities

| Severity | Issue | Location | Impact |
| :--- | :--- | :--- | :--- |
| **CRITICAL** | **Unprotected Dashboard Routes** | [`src/routes/_app.tsx`](file:///src/routes/_app.tsx) | Any visitor can access all dashboard routes without authenticating. No redirect or auth check is enforced. |
| **HIGH** | **`.env` Missing from `.gitignore`** | [`.gitignore`](file:///gitignore) | `.env` is omitted from `.gitignore`. Anyone committing files could accidentally push production database and Supabase keys to git. |
| **HIGH** | **Dangling Service-Role Client** | [`src/integrations/supabase/client.server.ts`](file:///src/integrations/supabase/client.server.ts) | Exports `supabaseAdmin` using `SUPABASE_SERVICE_ROLE_KEY` (bypassing all RLS). If imported into a client-shipped module, it would leak root database access. |
| **MEDIUM** | **Unrestricted `postMessage` Listener** | [`src/integrations/supabase/previewAuthStorage.ts`](file:///src/integrations/supabase/previewAuthStorage.ts#L61-L95) | Custom auth storage listens for window message events to sync tokens. If origin checks fail or regex matches are overly broad, tokens could be intercepted by malicious parent frames. |
| **MEDIUM** | **Hardcoded External Asset Origins** | [`src/routes/__root.tsx`](file:///src/routes/__root.tsx#L90) | Social sharing images link to an arbitrary Cloudflare R2 bucket outside the repository's control. |
| **LOW** | **Missing Content Security Policy (CSP)** | [`src/routes/__root.tsx`](file:///src/routes/__root.tsx#L76-L104) | No CSP headers or meta tags exist, leaving the app open to XSS via unescaped third-party script injections. |

---

## 9. Configuration and Environment

### 9.1 Environment Variables
All referenced environment variables across the project are listed below. *(Values omitted per architectural security policy)*:

| Variable Name | Found In | Purpose | Exposure |
| :--- | :--- | :--- | :--- |
| `SUPABASE_URL` | [`src/integrations/supabase/client.ts`](file:///src/integrations/supabase/client.ts#L52), `client.server.ts`, `.env` | Supabase API project endpoint | Server & SSR fallback |
| `SUPABASE_PUBLISHABLE_KEY` | [`src/integrations/supabase/client.ts`](file:///src/integrations/supabase/client.ts#L53), `.env` | Supabase public anonymous API key | Server & Client |
| `SUPABASE_PROJECT_ID` | [`.env`](file:///env), [`supabase/config.toml`](file:///supabase/config.toml#L1) | Supabase project identifier string | Config / CLI |
| `VITE_SUPABASE_URL` | [`src/integrations/supabase/client.ts`](file:///src/integrations/supabase/client.ts#L52), `.env` | Client-injected Supabase API endpoint | Client bundle |
| `VITE_SUPABASE_PUBLISHABLE_KEY`| [`src/integrations/supabase/client.ts`](file:///src/integrations/supabase/client.ts#L53), `.env` | Client-injected Supabase publishable key | Client bundle |
| `VITE_SUPABASE_PROJECT_ID` | [`.env`](file:///env) | Vite client-accessible project ID | Client bundle |
| `SUPABASE_SERVICE_ROLE_KEY` | [`src/integrations/supabase/client.server.ts`](file:///src/integrations/supabase/client.server.ts#L34) | Root administrative key (bypasses RLS) | Server-only (Private) |
| `LOVABLE_CRON_SECRET` | [`src/integrations/supabase/cron-auth.ts`](file:///src/integrations/supabase/cron-auth.ts#L5) | Secret for authenticating cron jobs | Server-only (Private) |
| `LOVABLE_CRON_SECRET_PREVIOUS`| [`src/integrations/supabase/cron-auth.ts`](file:///src/integrations/supabase/cron-auth.ts#L6) | Roll-over secret for rotating cron keys | Server-only (Private) |
| `LOVABLE_DB_MIGRATION_URL` | [`drizzle.config.ts`](file:///drizzle.config.ts#L8) | Direct PostgreSQL connection string for migrations | Server/CLI only |

### 9.2 Package Scripts ([`package.json`](file:///package.json#L6-L13))
* `npm run dev`: Starts local development server via `vite dev`.
* `npm run build`: Bundles the application for production via `vite build`.
* `npm run build:dev`: Bundles the application in development mode (`vite build --mode development`).
* `npm run preview`: Boots local production preview via `vite preview`.
* `npm run lint`: Runs ESLint 9 across all files (`eslint .`).
* `npm run format`: Runs Prettier formatter across the repo (`prettier --write .`).

### 9.3 Local Installation & Execution
```bash
# 1. Clone repository and navigate to root
git clone <repo-url>
cd "AI Models"

# 2. Install dependencies (Node 20+ required)
npm install

# 3. Create .env file with Supabase credentials:
# VITE_SUPABASE_URL=https://<your-project>.supabase.co
# VITE_SUPABASE_PUBLISHABLE_KEY=<your-anon-key>

# 4. Start the local development server
npm run dev
```
* **Execution Verification:** The development server starts Vite and TanStack Router. Client-side routes compile and render immediately. Note that all dashboard metrics display mock values, and auth actions require valid Supabase credentials.

---

## 10. Testing, CI/CD and Deployment

* **Test Suites & Coverage:** **Zero (`0`) tests found.**
  * No test runner is installed (no Vitest, Jest, Playwright, or Cypress).
  * No `*.test.ts`, `*.spec.ts`, or test fixtures exist in the codebase.
  * Code coverage is **0%**.
* **CI/CD Pipelines:**
  * No GitHub Actions (`.github/workflows/`), GitLab CI, or CircleCI configuration files exist.
  * Code quality checks (linting/typechecks) are not automated upon push.
* **Containerization:**
  * No `Dockerfile`, `.dockerignore`, or `docker-compose.yml` exists.
* **Current Hosting:**
  * Connected to Lovable Cloud and deployed to Cloudflare Edge / Worker runtime targets via `@lovable.dev/vite-tanstack-config`.

---

## 11. Code Quality Review

### 11.1 Architectural Deficits
1. **Proprietary Vendor Lock-in:** The project's build toolchain is heavily dependent on `@lovable.dev/vite-tanstack-config`, `@lovable.dev/cloud-auth-js`, and Lovable-specific preview broker scripts. Migrating to standard independent hosting (e.g., standard Vite + Netlify/Vercel/Cloudflare Workers) requires detangling these plugins.
2. **Disconnected Architectural Layers:**
   * TanStack Query is initialized in [`src/router.tsx`](file:///src/router.tsx) but completely unused across all 14 routes.
   * Drizzle ORM is installed and configured in [`drizzle.config.ts`](file:///drizzle.config.ts) but has no tables or migrations.
   * React Hook Form and resolvers are installed in [`package.json`](file:///package.json) but ignored in favor of manual `useState` inputs.

### 11.2 File Size & Modularity Hotspots
* [`src/routes/_app.leads.tsx`](file:///src/routes/_app.leads.tsx): **922 lines (50.5 KB)**. Mixes data structures, SVG math calculations, UI layout, chart generation, mock data, and state inside a single monolithic route file.
* [`src/routes/_app.index.tsx`](file:///src/routes/_app.index.tsx): **539 lines (25.1 KB)**. Houses 6 large mock data arrays, multiple inline SVG definitions, and 5 separate charts in one file.
* [`src/routes/_app.ceo.tsx`](file:///src/routes/_app.ceo.tsx): **453 lines (21.3 KB)**. Contains massive inline SVG background patterns, particle animations, and command structures.

### 11.3 Dead Code & Bloat
* **34 Unused UI Components:** The following components in [`src/components/ui/`](file:///src/components/ui/) were auto-generated but never imported:
  `accordion`, `alert-dialog`, `alert`, `aspect-ratio`, `breadcrumb`, `calendar`, `card`, `carousel`, `chart`, `collapsible`, `command`, `context-menu`, `drawer`, `form`, `hover-card`, `input-otp`, `menubar`, `navigation-menu`, `pagination`, `popover`, `progress`, `radio-group`, `resizable`, `scroll-area`, `select`, `sidebar` (24KB!), `slider`, `sonner`, `table`, `tabs`, `textarea`, `toggle-group`.
* **Duplicate Sidebar Implementations:** The app uses custom [`src/components/flow/app-sidebar.tsx`](file:///src/components/flow/app-sidebar.tsx) while leaving the 24KB shadcn [`src/components/ui/sidebar.tsx`](file:///src/components/ui/sidebar.tsx) dead in the repository.

### 11.4 Performance & SEO Gaps
* **Missing Dynamic Metadata:** Routes under `_app.*.tsx` declare static titles, but lack OpenGraph descriptions, canonical URLs, or Twitter card metadata.
* **External Font Loading:** Inter and Poppins are loaded via render-blocking external Google Fonts `<link>` tags in [`src/routes/__root.tsx`](file:///src/routes/__root.tsx#L97) rather than being self-hosted, causing layout shifts (CLS) on slow connections.

---

## 12. Production-Readiness Gap List

| Production Requirement | Current Status | Notes & Gaps |
| :--- | :--- | :--- |
| **Authentication & Gatekeeping** | **Partial** | Auth forms work, but dashboard routes (`/_app/*`) are completely unprotected. |
| **Database & Schema Modeling** | **Missing** | Only `profiles` table defined; 0 tables for leads, agents, revenue, or meetings. |
| **Backend API & Server Functions** | **Missing** | Zero real endpoints or server actions. All actions are simulated client-side. |
| **Environment Variable Safety** | **Partial** | `.env` exists locally but is dangerously omitted from `.gitignore`. |
| **Error Pages & Fallbacks** | **Done** | Comprehensive 404 and SSR 500 error boundaries implemented in `src/routes/__root.tsx`. |
| **Form Validation** | **Partial** | Basic HTML5 and Zod search params. No schema validation on settings or uploads. |
| **Automated Testing (Unit/E2E)** | **Missing** | Zero tests, zero test runners, 0% test coverage. |
| **CI/CD Pipeline** | **Missing** | No automated linting, type-checking, testing, or building on git push. |
| **Observability & Monitoring** | **Missing** | No Sentry, PostHog, or structured logging. Only local `console.error`. |
| **Production Assets & Branding** | **Missing** | No `public/` directory, no favicon, no manifest.json, no local logo asset. |
| **SEO, Sitemap & Robots.txt** | **Missing** | No `sitemap.xml`, no `robots.txt`, hardcoded external preview image. |
| **Accessibility (WCAG 2.1)** | **Partial** | High visual contrast, but lacks ARIA roles, tab indexing, and input associations. |
| **Legal & Compliance Pages** | **Missing** | No Terms of Service, Privacy Policy, Cookie Banner, or GDPR compliance flows. |
| **Dark Mode Implementation** | **Partial** | CSS classes exist in `styles.css`, but no switcher or state persistence exists. |

---

## 13. Branding Inputs (For Redesign & Renaming)

### 13.1 Brand Essence & Target Profile
* **One-Sentence Pitch:** An autonomous AI executive workforce that analyzes sales signals, prevents customer churn, and executes revenue growth plays without manual overhead.
* **Target Audience:** Modern B2B SaaS founders, Revenue Operations (RevOps) leaders, VP of Sales, and growth-stage startup executives.
* **Brand Tone:** Ultra-modern, commanding, data-driven, executive, and highly polished (balancing Stripe's precision, Notion's utility, and Linear's dark/glow tech aesthetic).
* **Keywords & Themes:** Autonomous Growth, Revenue Intelligence, Executive AI, Agentic Workforce, Signal Synthesis, Churn Guard, Deal Acceleration, Command Center.

### 13.2 Visual Identity & Current Palette
* **Current Colors:**
  * Primary Accent: Electric Indigo (`#4F46E5` / `#6366F1`)
  * Secondary Accent: Cyan / Teal (`#06B6D4`) and Purple (`#8B5CF6`)
  * Light Surfaces: Pure White (`#FFFFFF`), Soft Slate (`#F8FAFC`), Ice Indigo (`#EEF2FF`)
  * Deep Elements: Dark Slate (`#0F172A`), Navy Indigo (`oklch(0.16 0.04 270)`)
* **Weaknesses of Existing Brand:**
  * **Generic Name:** "FlowMind AI" is an overused compound of standard AI cliches ("Flow" + "Mind" + "AI") with low trademark viability and search differentiation.
  * **Generic Logo:** The existing logo is simply the default Lucide `Zap` lightning bolt inside a gradient square, lacking any proprietary or recognizable identity.
  * **Tagline Cliché:** *"A team of AI employees that grows your business automatically"* sounds like generic marketing copy rather than a specialized enterprise-grade tool.
  * **Currency Mismatch:** Confusingly flips between Indian Rupees (`₹3.8Cr`, `₹48L`) on operational screens and US Dollars (`$249/mo`, `$100K`) on account screens.

### 13.3 Market Landscape & Comparable Products
* **Competitive Category:** AI Revenue Operations & Agentic Sales Platforms.
* **Key Benchmarks & Competitors:**
  * **Apollo.io / Clay.com:** Inbound lead enrichment, automated sequencing, and pipeline intelligence.
  * **Gong.io / Chorus.ai:** Conversation intelligence, meeting recording analysis, and deal risk alerts.
  * **11x.ai / Artisan.co:** "Digital Workers" / AI BDRs and sales development agents.
  * **Clari / BoostUp.ai:** Predictive revenue forecasting and pipeline inspection.

---

## 14. Git History Summary

* **Repository Status:** **`.git` metadata directory was NOT found.**
* **Investigation Details:**
  * Executed `Test-Path .git` and `git status` inside `C:\Users\Ayush\Desktop\Project\AI Models`. Both returned negative (`fatal: not a git repository`).
  * Checked parent folder `C:\Users\Ayush\Desktop\Project` — no parent git root detected.
* **Commit History & Authors:** Locally unavailable because git version control was either not initialized or the directory was exported without `.git` history.
* **Platform Linkage:** Per [`README.md`](file:///README.md#L125) and [`AGENTS.md`](file:///AGENTS.md#L1), this project was created and synced through Lovable project `490d7f0a-aafc-4e25-a53c-23bc5ca4a4bd`.

---

## 15. Open Questions for the Project Owner

1. **Target Market & Currency Standard:** Is the initial market focus India (evidenced by INR `₹`, Lakhs, and Crores in the lead/revenue mock data) or global B2B SaaS (evidenced by USD `$249/mo` in settings)?
2. **AI Provider Strategy:** Which LLM or multimodal API is planned for the agent layer (e.g., Anthropic Claude 3.5 Sonnet, OpenAI GPT-4o, Google Gemini 1.5 Pro, or open-source Ollama/DeepSeek)?
3. **Data Source Integration:** How will real data ingest into the engine (e.g., direct webhooks from Stripe, HubSpot, Salesforce, Zoom, and WhatsApp Business API)?
4. **Hosting & Deployment Destination:** Will the production app remain hosted on Lovable/Cloudflare, or will it be migrated to an independent free/low-cost stack (e.g., standard Vite + Vercel/Netlify + Supabase Free Tier)?
5. **Database ORM Direction:** The project has both Supabase JS client and Drizzle ORM dependencies. Should Drizzle be retained for schema migrations, or should Supabase's native migration tooling be used directly?

---

## Recommended Next Steps (Priority Ordered)

1. **Security Fixes (Immediate):**
   * Add `.env` and `.env.*` to [`.gitignore`](file:///gitignore) immediately to prevent credential leaks.
   * Protect all dashboard routes: Update [`src/routes/_app.tsx`](file:///src/routes/_app.tsx) to inspect Supabase session state and redirect unauthenticated users to `/auth`.
   * Mount [`src/components/auth/auth-session-provider.tsx`](file:///src/components/auth/auth-session-provider.tsx) in [`src/routes/__root.tsx`](file:///src/routes/__root.tsx) and link the TopNav user menu to a functional `supabase.auth.signOut()` handler.

2. **Decouple from Proprietary Dependencies:**
   * Replace `@lovable.dev/cloud-auth-js` with standard `@supabase/supabase-js` OAuth calls (`supabase.auth.signInWithOAuth({ provider: 'google' })`).
   * Replace `@lovable.dev/vite-tanstack-config` with standard Vite plugins (`@vitejs/plugin-react`, `@tailwindcss/vite`, `vite-tsconfig-paths`) for independent builds anywhere.

3. **Database Schema Design & Migration:**
   * Write real PostgreSQL schemas in `drizzle/schema.ts` (or Supabase SQL migrations) for `organizations`, `leads`, `deals`, `transcripts`, `competitors`, and `agent_logs`.
   * Apply Row Level Security (RLS) policies ensuring users can only read their organization's records.

4. **Connect Real Backend Data Fetching:**
   * Replace hardcoded arrays in `src/routes/_app.*.tsx` with TanStack React Query hooks (`useQuery`) calling Supabase client queries or TanStack Start server functions.

5. **Rebrand & Redesign (Using Free Tools):**
   * Select a distinct, trademark-friendly brand name.
   * Design a bespoke vector SVG logo (e.g., via Figma free tier) and export proper `favicon.ico`, `logo.svg`, and OpenGraph assets into a new `public/` directory.
   * Implement a clean Dark Mode toggle using Tailwind's `dark` variant and `localStorage`.

6. **Codebase Cleanup:**
   * Delete the 34 unused components in `src/components/ui/` to eliminate ~80KB of dead code.
   * Split monolithic route files ([`_app.leads.tsx`](file:///src/routes/_app.leads.tsx), [`_app.ceo.tsx`](file:///src/routes/_app.ceo.tsx)) into modular feature components under `src/features/`.

7. **Testing & CI/CD Setup:**
   * Set up Vitest and React Testing Library for component and unit testing.
   * Create a free GitHub Actions workflow (`.github/workflows/ci.yml`) to automatically run `lint`, `typecheck`, and `test` on every commit.

