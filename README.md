# Cadre

**The AI team that runs your revenue.**

Cadre is a web app where a small team of AI agents reads your sales data and tells you what to do next: which leads to chase, which customers are about to leave, what competitors changed, and what your pipeline will look like next quarter.

> Status: rebuild in progress. See `STATUS.md` and `docs/ROADMAP.md`.

## What it does
- **Lead Intelligence:** score leads and get the next best action from any email, chat or call note
- **Meeting Analyzer:** transcript in, summary, action items and objections out
- **Churn Guard:** spot at-risk accounts and get retention plays
- **Competitor Radar:** scan a public competitor page and get a battlecard
- **Revenue Forecast:** pipeline math you can trust, plus a plain-English explanation
- **AI CEO:** describe a goal, get a phased plan assigned to the other agents
- **Daily Insights:** one short brief every day

## Stack
React 19, TypeScript, Vite, TanStack Router and Query, Tailwind CSS v4, Motion, Recharts, Supabase (Auth, Postgres, Edge Functions), Google Gemini. Hosted on Cloudflare Pages. Everything runs on free tiers.

## Getting started
```bash
npm install
cp .env.example .env        # then fill in the two Supabase values
npm run dev
```
1. Create a Supabase project and run `supabase/migrations/0001_init.sql`.
2. Put the project URL and publishable key in `.env`.
3. Create a Gemini key in Google AI Studio and set it as a function secret (see `docs/DEPLOYMENT.md`).
4. Deploy the Edge Functions, open http://localhost:5173, sign up.

## Scripts
| Command | What it does |
|---|---|
| `npm run dev` | Start the dev server |
| `npm run build` | Production build into `dist/` |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript check |
| `npm test` | Unit and component tests |
| `npm run test:e2e` | Playwright smoke tests |
| `npm run types` | Regenerate Supabase types |

## Documentation
| File | Purpose |
|---|---|
| `AGENTS.md` | Rules for AI coding agents |
| `docs/PRD.md` | What we are building |
| `docs/DESIGN.md` | Brand, colors, typography, motion |
| `docs/ARCHITECTURE.md` | How it is built |
| `docs/SECURITY.md` | Security requirements and launch checklist |
| `docs/DEPLOYMENT.md` | Free-tier deployment guide |
| `docs/ROADMAP.md` | Phases and checklists |
| `docs/LEGACY_CLEANUP.md` | Removing the old builder code |
| `docs/ANTIGRAVITY_PROMPTS.md` | Prompt sequence to build everything |

## Privacy note
On the free Gemini tier, Google may use inputs and outputs to improve its products. Do not enter passwords, payment data or health data. Move to a paid key before handling real customer data.

## Contributing

We welcome contributions to Cadre! Follow these conventions to keep the codebase clean, robust, and production-ready:

### Workflow & Scripts
1. **Prerequisites & Installation:**
   ```bash
   npm ci
   cp .env.example .env
   ```
2. **Local Development:**
   ```bash
   npm run dev
   ```
3. **Quality & Validation Suite:**
   Before committing or opening a pull request, ensure all checks pass cleanly:
   ```bash
   npm run lint        # ESLint strict rules
   npm run typecheck   # TypeScript strict typechecking (zero errors)
   npm test            # Vitest unit and component tests
   npm run build       # Vite production bundle build
   npm run test:e2e    # Playwright end-to-end test suite
   ```
4. **Hard Rules & Conventions:**
   - Package manager is **npm**. Never use yarn, bun, or pnpm.
   - Currency is **USD** everywhere, formatted strictly via `formatCurrency` or `Intl.NumberFormat`.
   - The Google Gemini API key and Supabase service role key live solely in secure server environments (Edge Function secrets). Zero server secrets in browser or git.
   - Every screen must feature loading, empty, and error states, with full WCAG 2.2 AA accessibility and responsive support (360px to 1920px).

## License
To be decided.
