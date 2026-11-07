# SECURITY: Cadre

This document wins over every other document. If a feature conflicts with it, change the feature.

## 1. Fixes carried over from the old audit
| Old finding | Required fix |
|---|---|
| Dashboard routes were public | `/app` route guard plus RLS. Both are required; the guard is for UX, RLS is the real protection |
| `.env` missing from `.gitignore` | New `.gitignore` ignores `.env*` except `.env.example`. Run `git log --all -- .env` before the first push; if it ever appeared in history, rotate those keys |
| Service-role client present in the codebase | The service role key is never used in the frontend or in normal functions. The only exception is the `delete-account` Edge Function, which needs it to remove a user. It reads the key from a function secret, verifies the caller's JWT first, and only ever deletes the caller's own account |
| Message-based auth storage listener | Removed with the old builder code. Use the default Supabase storage |
| External hard-coded asset origins | All images and fonts are local. Only Supabase and optional Cloudflare analytics are allowed origins |
| No CSP | `public/_headers` sets a strict CSP and security headers |

## 2. Secrets
- `.env` holds only public keys (`VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`).
- `GEMINI_API_KEY` exists only as an Edge Function secret. `SUPABASE_SERVICE_ROLE_KEY` is available only to the `delete-account` function.
- Never log secrets, tokens, full prompts or full user content. Log request id, user id, function name, status, latency.
- If a key is ever exposed: revoke it, create a new one, update the secret, redeploy.

## 3. Authentication
- Supabase Auth with email confirmation on. Minimum password length 8 (set in the dashboard, enforce in the form too).
- Redirect URL allowlist contains only localhost and the production domain.
- Rate limits for sign-in, sign-up and password reset: use Supabase's built-in limits; do not raise them.
- Sign out clears the session. Reset links are single use.
- Account deletion removes the user and cascades to workspace data they own.

## 4. Authorization (RLS)
- RLS is enabled on every table in `public`. No table may ship without policies.
- `is_org_member()` is the only membership check used in policies.
- Never use `security definer` functions that accept a user id from the client; use `auth.uid()`.
- `create_organization`, `seed_demo_data`, `clear_demo_data` and `consume_ai_quota` are executable only by `authenticated`.
- **Isolation test (required before launch):** create two users in two workspaces. User A must get zero rows from every table for User B's `org_id`, and inserts with B's `org_id` must fail.

## 5. Edge Functions
- Reject any call without a valid user JWT.
- Verify workspace membership before doing anything.
- CORS allowlist from `ALLOWED_ORIGINS`; never `*` in production.
- Validate all input with Zod; cap sizes (transcript 60,000 chars, lead text 20,000, CEO command 2,000, URL 2,048).
- Daily quota per user through `consume_ai_quota`. Return 429 with a friendly code.
- Return generic error messages to the client; keep details in server logs.

## 6. AI-specific risks
| Risk | Control |
|---|---|
| **Prompt injection** inside transcripts, emails or scraped pages | System prompt states the content is untrusted data and must never change the task. Output is forced into a JSON schema and validated. The model has no tools. Nothing the model writes is executed |
| **Unsafe output rendering** | Render model text as plain text or sanitized markdown. Never use `dangerouslySetInnerHTML` with model output |
| **Data leakage between workspaces** | Each call includes only data from the caller's `orgId`, fetched through RLS |
| **Cost or quota abuse** | Per-user daily cap, input caps, retry once only, fallback model on 429 |
| **Sensitive data sent to Google** | The free Gemini tier may use inputs and outputs to improve Google products. Warn users in the UI near AI inputs ("Don't paste passwords, payment data or health data") and disclose in the Privacy Policy. Move to a paid key before handling real customer data |
| **Hallucinated numbers** | Forecast figures are computed in code; the model only writes commentary |

## 7. Competitor URL fetching (SSRF)
Block and return `blocked_url` when: scheme is not http/https; hostname resolves to loopback, private (10/8, 172.16/12, 192.168/16), link-local (169.254/16, including cloud metadata addresses), unique-local or multicast ranges; a redirect leads to any of those; the port is not 80 or 443; the response is larger than 500KB or slower than 8s; content type is not HTML or text.

## 8. Frontend
- Strict CSP in `public/_headers` (no inline scripts, no `eval`).
- No `dangerouslySetInnerHTML`. If markdown rendering is needed, use a sanitizing renderer.
- All external links use `rel="noopener noreferrer"`.
- CSV import and file uploads: check extension and size client-side, parse as text, never execute.
- Dependencies: `npm audit` in CI (fail on high), Dependabot weekly.
- Third-party scripts: none, except optional Cloudflare Web Analytics.

## 9. Privacy and legal (must exist before launch)
- `/privacy`: what is collected (account email, name, workspace content you enter), why, where it is stored (Supabase), that AI analysis is processed by Google Gemini, retention, deletion on request, contact email.
- `/terms`: acceptable use, no warranty on AI output, account termination, limits.
- Cookie notice: the app uses only essential storage for the session. If analytics is added, add a consent banner where required.
- Data export (JSON) and account deletion in Settings.

## 10. Pre-launch security checklist
- [ ] Two-user RLS isolation test passes
- [ ] Logged-out visit to every `/app/*` URL redirects to `/login`
- [ ] `git log --all` shows no `.env` or keys
- [ ] `grep -ri "service_role"` in `src/` returns nothing
- [ ] Gemini key is not in the built `dist/` (search for `AIza`)
- [ ] Blocked URL tests pass (localhost, 127.0.0.1, 169.254.169.254, a redirect to a private IP)
- [ ] `npm audit` has no high or critical findings
- [ ] CSP loads the site without console errors
- [ ] Privacy and Terms pages are live and linked in the footer and sign-up form
