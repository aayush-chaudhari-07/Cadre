# PRD: Cadre

**Tagline (primary):** The AI team that runs your revenue.
**Alternates:** Your revenue team, on autopilot. / Six AI agents. One growth engine.
**Market:** Global. **Currency:** USD. **AI provider:** Google Gemini (free tier first).
**Previously:** FlowMind AI, a UI-only prototype. Cadre keeps the idea and rebuilds everything so it actually works.

---

## 1. Vision
Small B2B teams cannot afford a full revenue operations team. Cadre gives them a "cadre" of AI agents, each with one job, that read their real sales data and tell them what to do next: who to call, which customer is about to leave, what a competitor changed, and what the pipeline will look like next quarter.

## 2. Users
| Persona | Needs | Main screens |
|---|---|---|
| Founder / CEO (primary) | One place to see what matters today, and a way to ask for a plan | Command Center, AI CEO, Insights |
| Sales lead / AE | Know which leads to chase and what to say | Leads, Meetings |
| Customer success lead | Spot at-risk accounts early | Churn |
| Marketer / PMM | Track rivals and keep battlecards fresh | Competitors |

## 3. Goals and non-goals
**Goals for v1.0**
- A visitor understands the product in 10 seconds and signs up in under a minute.
- A new user sees a populated workspace within 30 seconds (sample data) and can run a real AI analysis in under 2 minutes.
- Every module in the sidebar does something real, backed by the database and Gemini.
- Runs entirely on free tiers.

**Non-goals for v1.0**
- Taking payments (pricing is shown, billing comes later).
- Syncing with CRMs, email or calendars (manual input and CSV import only).
- Team invitations and roles beyond owner (schema supports it).
- Mobile apps (the web app is fully responsive).

## 4. Information architecture
| Route | Access | Purpose |
|---|---|---|
| `/` | Public | Landing page |
| `/pricing` | Public | Plans (display only) |
| `/login`, `/signup`, `/forgot-password`, `/reset-password` | Public | Auth |
| `/terms`, `/privacy` | Public | Legal |
| `/onboarding` | Signed in, no workspace | Name the workspace, optional sample data |
| `/app` | Signed in | Command Center |
| `/app/leads` | Signed in | Lead Intelligence |
| `/app/meetings` | Signed in | Meeting Analyzer |
| `/app/churn` | Signed in | Churn Guard |
| `/app/competitors` | Signed in | Competitor Radar |
| `/app/revenue` | Signed in | Revenue Forecast |
| `/app/agents` | Signed in | Agent roster and activity |
| `/app/ceo` | Signed in | AI CEO console |
| `/app/insights` | Signed in | Daily brief |
| `/app/settings` | Signed in | Profile, workspace, agents, data, theme |
| `*` | Public | Branded 404 |

Signed-out visitors who open `/app/*` are redirected to `/login` and returned to the page afterwards.

## 5. Feature specs

### 5.1 Authentication and onboarding
- Email + password sign up with display name; email confirmation; password reset by email.
- Continue with Google (Supabase OAuth).
- "Remember me" is the default; sign out available in the user menu.
- After first sign-in a user with no workspace goes to `/onboarding`: workspace name, then "Start with sample data" (default on) or "Start empty".
- **Acceptance:** protected routes cannot be viewed signed out; refresh keeps the session; wrong password shows a clear error; reset email link lands on `/reset-password` and works once.

### 5.2 Command Center (`/app`)
- KPI cards: open pipeline (USD), weighted pipeline, hot leads, at-risk MRR. All computed from real rows.
- Pipeline funnel by deal stage, revenue trend chart, agent activity feed (from `agent_runs`), top 5 leads, top 5 at-risk accounts.
- "Run today's brief" button triggers the Insights agent.
- **Acceptance:** with sample data every number matches the underlying tables; with an empty workspace every card shows an empty state with a call to action.

### 5.3 Lead Intelligence (`/app/leads`)
- Table with search, status filter, sort (score, value, recency), pagination.
- Add / edit / delete lead; CSV import (name, company, email, source, deal value) with a preview and validation.
- Lead drawer: details, interaction history, **Analyze** (paste an email, chat or call notes).
- AI result updates the lead's score, intent, summary, objections and next action, and stores the full analysis on the interaction.
- **Acceptance:** analysis completes in under 15 seconds, shows a skeleton while running, and shows a friendly message if the daily AI limit is reached.

### 5.4 Meeting Analyzer (`/app/meetings`)
- Paste a transcript or upload a `.txt` / `.vtt` / `.srt` file (max 60,000 characters).
- AI returns summary, sentiment, key points, action items with owners, objections, risks and a deal-health score.
- Saved meetings list with search; detail view; copy action items.
- **Acceptance:** results persist and reload without calling AI again.

### 5.5 Churn Guard (`/app/churn`)
- Account list with MRR, health score, risk tier, renewal date, signals. Add / edit / delete accounts.
- **Analyze risk** uses the account's signals and notes to return risk level, reasons, retention plays and a draft message.
- **Acceptance:** risk tier filter works; "MRR at risk" total updates when an account's tier changes.

### 5.6 Competitor Radar (`/app/competitors`)
- Add a competitor name and public URL. **Scan** fetches the page server-side and returns positioning, strengths, weaknesses, pricing notes and a battlecard.
- Last scanned time shown; rescanning replaces the analysis.
- **Acceptance:** private or invalid URLs are rejected with a clear message (see SECURITY.md); a failed fetch never shows a blank screen.

### 5.7 Revenue Forecast (`/app/revenue`)
- Computed in code from `deals`: weighted pipeline by month, best / expected / worst case, win rate, average deal size.
- **Explain forecast** asks Gemini for a short narrative and 3 risks from the computed numbers (numbers are never invented by the model).
- Deals can be added, edited, moved between stages (drag between columns or a stage dropdown).
- **Acceptance:** moving a deal to Won updates the forecast immediately.

### 5.8 Agents (`/app/agents`)
- Six cards (CEO, Sales, Support, Marketing, Operations, Finance) with role, autonomy setting (off / suggest / auto), enabled toggle, last run and run count.
- Activity log from `agent_runs`, filterable by agent.
- **Acceptance:** disabling an agent disables its buttons elsewhere with an explanation.

### 5.9 AI CEO (`/app/ceo`)
- Text box ("Increase demo-to-close rate by 20% this quarter") with example chips.
- Gemini receives a compact summary of the workspace and returns a plan: goal, summary, phases, actions assigned to agents, KPIs, risks.
- Plans are saved; user can approve a plan (status change) and view history.
- **Acceptance:** plan renders progressively with animation; each action names one agent that exists.

### 5.10 Insights (`/app/insights`)
- One brief per day per workspace (cached in `insights`): headline, highlights, risks, opportunities, recommended actions.
- "Regenerate" allowed, counts against the daily AI quota.

### 5.11 Settings (`/app/settings`)
- Profile (name, avatar URL), workspace name, agent defaults, theme (dark / light / system), AI usage today, **Load / clear sample data**, export workspace data (JSON), delete account.

### 5.12 Landing and legal pages
See `docs/DESIGN.md` for section-by-section content. Rules:
- No fake customer logos, testimonials or user counts. Use product facts and honest "built with" credits.
- Pricing is display-only; buttons say "Start free" and "Join the Pro waitlist" (stored in a `waitlist` table in a later phase, or a mailto link in v1).
- Terms and Privacy pages must be real documents. Privacy must disclose that AI analysis is processed by Google Gemini.

## 6. Pricing (display only, USD)
| Plan | Price | Includes |
|---|---|---|
| Free | $0 | 1 workspace, 40 AI analyses per day, all 8 modules, sample data |
| Pro | $49 / month | Higher AI limits, team seats, CSV export, priority support (coming soon) |
| Scale | $149 / month | Integrations, API access, audit log, SSO (coming soon) |

Pro and Scale are labeled "Coming soon" until billing exists.

## 7. AI behavior
- Provider: Gemini via Supabase Edge Functions only. Model name comes from `GEMINI_MODEL`; fallback from `GEMINI_FALLBACK_MODEL`.
- All calls use JSON output with a response schema; the function validates the result with Zod before saving.
- Per-user daily limit: `AI_DAILY_LIMIT_PER_USER` (default 40). Friendly message when reached.
- Content from transcripts, emails and web pages is **untrusted data**. Prompts must say so, and model output is never executed or rendered as HTML.
- Each module has a fixed system prompt in `supabase/functions/_shared/prompts.ts`.

### Output schemas (Zod shapes the functions must enforce)
```
LeadAnalysis    { score 0-100, intent "high|medium|low", sentiment, summary, objections[], buying_signals[],
                  close_probability 0-100, next_best_action, suggested_reply }
MeetingAnalysis { summary, sentiment "positive|neutral|negative", key_points[], action_items[{owner, task, due?}],
                  objections[], risks[], next_steps[], deal_health 0-100 }
ChurnAnalysis   { risk_level "low|medium|high|critical", risk_score 0-100, reasons[],
                  retention_plays[{title, description, effort "low|medium|high"}], suggested_message }
CompetitorScan  { positioning, strengths[], weaknesses[], pricing_notes, recent_signals[],
                  battlecard{ win_themes[], landmines[], talk_track } }
CeoPlan         { goal, summary, phases[{name, duration, actions[{agent, task, expected_impact}]}], kpis[], risks[] }
DailyInsights   { headline, highlights[], risks[], opportunities[], recommended_actions[] }
ForecastNote    { narrative, risks[] }
```

## 8. Success metrics
- Landing: sign-up conversion, scroll depth to pricing, Lighthouse performance 90+.
- Activation: share of new users who run at least one AI analysis in the first session.
- Retention: weekly active workspaces.
- Reliability: AI call success rate above 97%, p95 under 15 seconds.

## 9. Risks
| Risk | Mitigation |
|---|---|
| Free Gemini limits change or run out | Daily per-user cap, fallback model, clear error state, switch model by env var |
| Free-tier prompts may be used by Google to improve products | Disclose in Privacy; tell users not to paste sensitive data; move to a paid key before onboarding real customers |
| Prompt injection from pasted content | Treat as data, schema-only output, no tools or actions executed from model text |
| Free hosting limits | Static frontend on Cloudflare Pages, small DB footprint, caching of AI results |
