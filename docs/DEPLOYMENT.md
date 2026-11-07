# DEPLOYMENT: Cadre on free tiers

Total monthly cost: $0 (a domain name is the only optional expense). Re-check each provider's current free-tier limits and terms before launch.

## 1. Accounts you need
- GitHub (code and CI)
- Supabase (database, auth, functions)
- Google AI Studio (Gemini API key): https://aistudio.google.com
- Cloudflare (Pages hosting)
- Optional: Google Cloud Console (OAuth client for "Continue with Google"), Sentry (errors)

## 2. Create the Supabase project
1. New project in the Supabase dashboard (pick the region closest to your users). Save the database password somewhere safe.
2. Open **SQL Editor**, paste `supabase/migrations/0001_init.sql`, run it. (Or link the CLI and run `npx supabase db push`.)
3. **Project Settings > API**: copy the Project URL and the publishable (anon) key into your local `.env`.
4. **Authentication > URL Configuration**: Site URL = your production URL; add Redirect URLs `http://localhost:5173/**` and `https://YOUR-DOMAIN/**`.
5. **Authentication > Providers > Email**: confirm email on, minimum password length 8.
6. **Authentication > Email Templates**: change the sender name and wording to Cadre. For real traffic, add custom SMTP (the default sender is heavily rate limited).
7. Optional Google sign-in: create an OAuth client in Google Cloud Console (type Web), add the Supabase callback URL shown in the provider settings, paste client id and secret into Supabase.
8. Generate types: `npx supabase gen types typescript --project-id YOUR_REF > src/types/database.ts`.

## 3. Gemini key and Edge Functions
```bash
npx supabase login
npx supabase link --project-ref YOUR_REF
npx supabase secrets set GEMINI_API_KEY=your_key
npx supabase secrets set GEMINI_MODEL=gemini-flash-latest
npx supabase secrets set GEMINI_FALLBACK_MODEL=gemini-flash-lite-latest
npx supabase secrets set AI_DAILY_LIMIT_PER_USER=40
npx supabase secrets set ALLOWED_ORIGINS=http://localhost:5173,https://YOUR-DOMAIN
npx supabase functions deploy analyze-lead analyze-meeting analyze-churn scan-competitor explain-forecast ceo-command daily-insights delete-account
```
Open Google AI Studio, check which Flash / Flash-Lite model is free for your project and its current per-minute and per-day limits, and adjust the model names and `AI_DAILY_LIMIT_PER_USER` so the whole app stays inside them.

## 4. Deploy the frontend (Cloudflare Pages)
1. Push the repo to GitHub.
2. Cloudflare dashboard > Workers & Pages > Create > Pages > Connect to Git.
3. Build command `npm run build`, output directory `dist`, Node version 22.
4. Environment variables (Production and Preview): `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`, `VITE_SITE_URL`.
5. Deploy. `public/_redirects` handles SPA routing and `public/_headers` sets security headers.
6. Add your custom domain under Custom domains, then update the Supabase Site URL and redirect URLs, the `ALLOWED_ORIGINS` secret, `robots.txt` and `sitemap.xml`.
7. Turn on Web Analytics (cookie-free) if wanted.

## 5. CI (GitHub Actions)
`.github/workflows/ci.yml` runs install, lint, typecheck, tests, build, a dependency audit and a check that no legacy-vendor strings remain. Protect `main` so merges require a passing run.

## 6. Monitoring and uptime
- Sentry free plan: set `VITE_SENTRY_DSN`; scrub emails and message content before sending.
- UptimeRobot (free): ping the production URL every 5 minutes.
- Supabase dashboard: watch database size, auth users, function errors.

## 7. Keep-alive and backups
- Free Supabase projects can be paused after a period of inactivity. Add a small scheduled GitHub Action that runs one cheap REST query weekly.
- Free plans may not include downloadable automatic backups. Add a weekly scheduled workflow running `supabase db dump` and store the file as a private artifact, or run it manually before every migration.

## 8. Release checklist
- [ ] Production Supabase project is separate from your dev one (or you accept shared data)
- [ ] All items in `SECURITY.md` section 10 are ticked
- [ ] Privacy and Terms pages written and linked
- [ ] `og-image.png` exists at 1200x630 and OG tags validate
- [ ] Lighthouse mobile: Performance 90+, Accessibility 95+, SEO 95+
- [ ] Tested sign up, confirm email, login, reset password, Google login on the live URL
- [ ] Sample data loads and clears; one AI analysis per module succeeds
- [ ] Quota message appears correctly when the daily limit is reached
- [ ] Error tracking receives a test error

## 9. Moving to paid later
- Gemini: attach billing to the Google Cloud project (removes free-tier data-use terms and raises limits).
- Supabase Pro: daily backups, no pausing, higher limits.
- Custom SMTP provider for auth emails.
