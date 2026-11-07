# AGENTS.md: Rules for AI coding agents working on Cadre

Cadre is "the AI team that runs your revenue": a web app where AI agents score leads, analyze meetings, spot churn, track competitors, forecast revenue and plan growth. This file is read before every task.

## Read these first, in order
1. `docs/PRD.md` (what to build)
2. `docs/DESIGN.md` (how it looks and moves)
3. `docs/ARCHITECTURE.md` (how it is built)
4. `docs/SECURITY.md` (what must never break)
5. `docs/LEGACY_CLEANUP.md` (what to remove from the old codebase)

If two documents disagree, `SECURITY.md` wins, then `PRD.md`, then the rest. If something is unclear, ask instead of guessing.

## Hard rules
- Package manager is **npm**. Do not use bun, yarn or pnpm. Keep `package-lock.json`.
- No code, packages, config, comments, env vars or file names from the old app builder may remain. See `docs/LEGACY_CLEANUP.md`.
- The Gemini API key lives only in Supabase Edge Function secrets. Never put it in the browser, in `VITE_` variables, or in git.
- Never commit `.env` or any secret. Only `.env.example` is committed.
- The browser only uses the Supabase **publishable** key. The service role key is never used in the frontend.
- Every table access must work under row level security. Never disable RLS to make something work.
- Currency is **USD** everywhere. Format money with `Intl.NumberFormat`, never hand-built strings.
- Do not invent features, customers, testimonials, logos or statistics. Real numbers come from the database; demo content must be labeled as sample data.

## Code style
- Write simple, natural, readable code, the way a careful human developer would. No clever one-liners, no over-engineering, no unnecessary abstractions or wrapper layers.
- Short comments only where the reason for something is not obvious. No comment that just repeats the code.
- TypeScript strict mode. No `any` unless there is a written reason.
- Keep files under about 300 lines. Split by feature, not by file type.
- Use the folder layout in `docs/ARCHITECTURE.md`.
- Validate all input at the edge (Zod) on both client forms and Edge Functions.

## Quality bar for every screen
- Has loading, empty and error states.
- Works from 360px wide to 1920px wide.
- Keyboard accessible, visible focus rings, proper labels and aria attributes.
- Respects `prefers-reduced-motion` (see `docs/DESIGN.md`).
- Uses design tokens from `src/styles/tokens.css`, never hard-coded colors.

## Workflow
- Work through `docs/ANTIGRAVITY_PROMPTS.md` in order, one prompt at a time.
- After each prompt run: `npm run lint && npm run typecheck && npm run build`. Fix everything before moving on.
- Keep `STATUS.md` at the repo root up to date: what is done, what is next, what is blocked, decisions made.
- Make small commits with clear messages (`feat: leads table`, `fix: auth redirect`).
- Do not delete the `legacy/` folder until the final prompt says so.
