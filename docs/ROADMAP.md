# ROADMAP: Cadre

Update the checkboxes as work completes. `STATUS.md` holds the day-to-day log.

## Phase 0: Foundation
- [ ] Backup, `git init`, `legacy-snapshot` branch, `rebuild` branch
- [ ] Legacy builder files and packages removed (`docs/LEGACY_CLEANUP.md`)
- [ ] Clean Vite + React + TanStack Router scaffold builds
- [ ] New Supabase project created, `0001_init.sql` applied
- [ ] `.env` created from `.env.example`, Gemini key set as a function secret

## Phase 1: Design system and shell
- [ ] Tokens, fonts, Tailwind theme, dark and light themes
- [ ] UI primitives and motion primitives
- [ ] App shell: sidebar, top bar, command palette, page transitions

## Phase 2: Public site and auth
- [ ] Landing page with all 12 sections and animations
- [ ] Pricing, Terms, Privacy, 404
- [ ] Login, signup, forgot and reset password, Google sign-in
- [ ] Route guard and onboarding (workspace plus sample data)
- [ ] SEO: meta, OG image, JSON-LD, robots, sitemap

## Phase 3: Working product
- [ ] Shared Edge Function infrastructure (auth, quota, Gemini client, errors)
- [ ] Leads (CRUD, CSV import, AI analysis)
- [ ] Meetings (upload, AI analysis)
- [ ] Churn (accounts, AI risk analysis)
- [ ] Competitors (safe fetch, AI scan)
- [ ] Revenue (forecast math, kanban, AI narrative)
- [ ] Command Center
- [ ] Agents and AI CEO
- [ ] Insights and Settings (export, delete account, sample data)

## Phase 4: Quality and launch
- [ ] Accessibility pass (keyboard, screen reader, contrast)
- [ ] Performance pass (bundle split, Lighthouse targets)
- [ ] Unit, component and e2e tests, CI green
- [ ] Security checklist in `SECURITY.md` complete
- [ ] Deployed to Cloudflare Pages on your domain
- [ ] Monitoring, uptime check, backup routine

## Phase 5: After launch (v1.1)
- [ ] Waitlist table and form for Pro
- [ ] Pre-render `/` and `/pricing` for stronger SEO
- [ ] Email notifications for hot leads and critical churn risk
- [ ] Audio transcription for meetings (Gemini audio input, size limited)
- [ ] Onboarding checklist and product tour

## Phase 6: Growth (v2)
- [ ] Stripe billing and plan limits
- [ ] Team invitations and roles
- [ ] Integrations: Google Sheets, HubSpot, Gmail, Slack, webhooks
- [ ] Scheduled agent runs (Supabase cron)
- [ ] Public API and audit log
- [ ] Move to a paid Gemini key and a stronger model for CEO plans
