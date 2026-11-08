# ROADMAP: Cadre

Update the checkboxes as work completes. `STATUS.md` holds the day-to-day log.

## Phase 0: Foundation
- [x] Backup, clean Git baseline, `rebuild` branch
- [x] Legacy builder files and packages removed (`docs/LEGACY_CLEANUP.md`)
- [x] Clean Vite + React + TanStack Router scaffold builds
- [x] New Supabase project created, `0001_init.sql` applied
- [x] `.env` created from `.env.example`, Gemini key set as a function secret

## Phase 1: Design system and shell
- [x] Tokens, fonts, Tailwind theme, dark and light themes
- [x] UI primitives and motion primitives
- [x] App shell: sidebar, top bar, command palette, page transitions

## Phase 2: Public site and auth
- [x] Landing page with all 12 sections and animations
- [x] Pricing, Terms, Privacy, 404
- [x] Login, signup, forgot and reset password, Google sign-in
- [x] Route guard and onboarding (workspace plus sample data)
- [x] SEO: meta, OG image, JSON-LD, robots, sitemap

## Phase 3: Working product
- [x] Shared Edge Function infrastructure (auth, quota, Gemini client, errors)
- [x] Leads (CRUD, CSV import, AI analysis)
- [x] Meetings (upload, AI analysis)
- [x] Churn (accounts, AI risk analysis)
- [x] Competitors (safe fetch, AI scan)
- [x] Revenue (forecast math, kanban, AI narrative)
- [x] Command Center
- [x] Agents and AI CEO
- [x] Insights and Settings (export, delete account, sample data)

## Phase 4: Quality and launch
- [x] Accessibility pass (keyboard, screen reader, contrast)
- [x] Performance pass (bundle split, Lighthouse targets)
- [x] Unit, component and e2e tests, CI green
- [x] Security checklist in `SECURITY.md` complete
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
