# DESIGN: Cadre

Direction: **Obsidian & Aurora**. A near-black canvas, soft aurora light in mint and cyan, a rare touch of gold. It should feel like a premium financial or developer product: calm, precise, expensive, and alive with motion that always has a purpose.

This replaces the old indigo and white look completely. No old colors, fonts, or gradients carry over.

---

## 1. Brand
- **Name:** Cadre
- **Voice:** confident, plain, specific. Short sentences. No buzzword soup.
- **Logo:** `public/logo-mark.svg` (three agent nodes converging on one leader node), `logo-lockup.svg` for dark backgrounds, `logo-lockup-light.svg` for light ones. The mark is the favicon.
- **Metaphor used across the UI:** agents are nodes; the CEO is the hub; lines of light connect them. Reuse it in the hero, loaders and empty states.

## 2. Color tokens (dark is the default theme)
Define as CSS variables in `src/styles/tokens.css` and map them in Tailwind v4 `@theme`.

| Token | Dark | Light | Use |
|---|---|---|---|
| `--bg` | `#05060A` | `#F6F7FB` | Page canvas |
| `--surface` | `#0B0D14` | `#FFFFFF` | Cards, sidebar |
| `--surface-2` | `#12151F` | `#EEF1F7` | Raised areas, inputs |
| `--border` | `rgba(255,255,255,0.08)` | `rgba(11,13,20,0.10)` | Hairlines |
| `--text` | `#F4F6FA` | `#0B0D14` | Primary text |
| `--text-2` | `#A7B0C3` | `#4A5368` | Secondary text |
| `--text-3` | `#6B7489` | `#6B7489` | Hints, disabled |
| `--primary` | `#2DE2A6` | `#0FB985` | Main accent (mint) |
| `--primary-ink` | `#04110C` | `#FFFFFF` | Text on primary buttons |
| `--secondary` | `#22D3EE` | `#0891B2` | Cyan accent |
| `--gold` | `#F5B94A` | `#B7791F` | Premium highlights, CEO, "Pro" |
| `--info` | `#7AA2FF` | `#3B6FE0` | Informational |
| `--warning` | `#FFB020` | `#B45309` | Warnings |
| `--danger` | `#FF5C7A` | `#D92D4F` | Errors, critical risk |
| `--success` | `#2DE2A6` | `#0FB985` | Success |

**Gradients**
- `--grad-aurora`: `linear-gradient(135deg, #2DE2A6 0%, #22D3EE 100%)` for primary buttons, key numbers, the logo.
- `--grad-gold`: `linear-gradient(135deg, #F5B94A, #FFDD9A)` for Pro and CEO accents.
- `--grad-hero`: layered radial gradients (mint top-left at 18%, cyan top-right at 14%, gold bottom at 6%) over `--bg`.

**Contrast:** body text must be at least 4.5:1. Never put `--primary` text on light surfaces; use the light-theme value.

## 3. Typography (self-hosted via Fontsource, no Google Fonts links)
| Role | Font | Notes |
|---|---|---|
| Display | Space Grotesk Variable | Headlines, big numbers. Tight tracking (-0.02em to -0.04em) |
| Body / UI | Inter Variable | 14px base in the app, 16-18px on the landing page |
| Data | JetBrains Mono Variable | Tables, IDs, code, tabular figures |

Scale: 12 / 14 / 16 / 18 / 24 / 32 / 44 / 64 / 88. Hero headline uses `clamp(2.75rem, 7vw, 5.5rem)`. Use `font-variant-numeric: tabular-nums` for all money and metrics.

## 4. Shape, spacing, elevation
- Spacing: 4px grid. Landing sections use 120-160px vertical padding on desktop, 72px on mobile.
- Radius: 8 (inputs, chips), 14 (cards), 20 (large panels), 999 (pills).
- Surfaces use a 1px `--border` plus an inner top highlight (`inset 0 1px 0 rgba(255,255,255,0.05)`).
- Glow shadows: `0 0 0 1px rgba(45,226,166,0.25), 0 8px 40px -8px rgba(45,226,166,0.35)` for focused or featured elements.
- Glass: `background: rgba(11,13,20,0.6); backdrop-filter: blur(16px) saturate(140%)`.
- Background texture: a faint grid (`1px` lines at 4% white, 56px cells) masked with a radial fade, plus 1.5% noise overlay.

## 5. Motion system
**Libraries:** `motion` (Framer Motion) for components, CSS for ambient effects, `lenis` for smooth scrolling on the landing page only, `recharts` for charts.

**Principles:** motion explains or delights, never blocks. Animate `transform` and `opacity` only. Nothing loops faster than 0.5 Hz. Every animation has a reduced-motion fallback.

**Tokens**
- Easing: `--ease-out: cubic-bezier(0.22, 1, 0.36, 1)`, `--ease-in-out: cubic-bezier(0.65, 0, 0.35, 1)`, spring `{ stiffness: 260, damping: 26 }`.
- Durations: 150ms (micro), 300ms (UI), 600-800ms (reveals), 1200ms+ (counters, charts).
- Stagger: 60-90ms between siblings.

### Motion catalog
| Name | Where | Spec |
|---|---|---|
| Aurora drift | Hero, final CTA | 3 blurred radial blobs, 24-32s alternate loops, CSS only |
| Grid spotlight | Hero background | Radial mask follows the cursor with a 120ms lerp |
| Word reveal | Hero headline | Words slide up 100% from a clipped line, 70ms stagger |
| Scroll reveal | All landing sections | Fade up 24px, 700ms, once per element |
| Product tilt | Hero dashboard preview | 3D tilt up to 6deg toward cursor, glare layer follows |
| Spotlight card | Feature cards, pricing | Cursor-tracked radial highlight via `--mx` `--my` |
| Animated border | Featured card, primary CTA | `conic-gradient` rotating through `@property --angle`, 6s |
| Magnetic button | Primary CTAs | Moves up to 8px toward cursor, springs back |
| Marquee | "Built with" strip | Infinite, pauses on hover |
| Count-up | Stats, KPI cards | Eases to value over 1.4s when in view, tabular figures |
| Agent orbit | Agents section | SVG hub-and-spoke: pulses travel along lines from the CEO node to five agents, staggered |
| Pinned story | "How Cadre works" | 3 steps pinned while scrolling; the visual morphs per step |
| Typing demo | Interactive demo | Pre-written lead message types in, result cards animate in with stagger |
| Scroll progress | Top of landing page | 2px aurora bar scaled by scroll |
| Page transition | App routes | Fade + 8px rise, 250ms, `AnimatePresence mode="wait"` |
| Skeleton shimmer | Loading states | Diagonal gradient sweep, 1.4s |
| Chart draw-in | Recharts | Lines draw over 900ms, bars grow from the baseline |
| Streaming reveal | AI results | Sections fade in one by one as results arrive |
| Success burst | First analysis, sample data loaded | Small mint particle burst, 700ms, once |
| Command palette | `Ctrl/Cmd+K` | Scale 0.97 to 1 plus fade, 180ms |
| Sidebar hover | App nav | Active pill slides between items using `layoutId` |

### Reduced motion
When `prefers-reduced-motion: reduce`: disable Lenis, aurora drift, tilt, magnetic, marquee, orbit pulses, particles, parallax and the pinned story (show steps stacked). Keep simple 150ms opacity fades and skeleton states. Provide a `useReducedMotion` wrapper used by every motion component.

### Performance budget
- Landing LCP under 2.5s on a mid-range phone; CLS under 0.05; INP under 200ms.
- Landing initial JS under 250KB gzipped. The `/app` bundle, charts and Lenis are code-split.
- No more than 3 large blurred layers on screen at once; use `contain: paint` and `will-change: transform` only on the layers that move.
- Pause offscreen animations with `IntersectionObserver`.

## 6. Landing page (`/`), section by section
1. **Nav:** glass bar, logo lockup, links (Product, Agents, Pricing, FAQ), "Log in" and "Start free" (magnetic). Shrinks and gains a border after 40px of scroll. Mobile: full-screen menu with staggered links.
2. **Hero:** badge ("Powered by Gemini. Free to start."), headline "The AI team that runs your revenue." (word reveal), one-sentence subhead, two CTAs ("Start free", "Watch it work" scrolls to the demo). Below: tilting dashboard preview with live-looking agent activity ticking in. Aurora and grid spotlight behind.
3. **Built-with strip:** marquee of real technologies (Gemini, Supabase, React, Cloudflare). No customer logos.
4. **Problem to solution:** three short statements with count-up facts that are true about the product ("6 agents", "8 modules", "under 15s per analysis"), not invented customer numbers.
5. **Feature bento:** asymmetric grid of 6 spotlight cards (Leads, Meetings, Churn, Competitors, Revenue, AI CEO), each with a tiny looping illustration made from SVG and CSS.
6. **Agents orbit:** hub-and-spoke SVG with the CEO in the center (gold core) and five agents around it; hover a node to see its job.
7. **Interactive demo:** a sample lead message types in, "Analyze" runs a scripted animation, result cards (score ring, objections, next best action) stagger in. Clearly labeled "Sample". Real analysis requires sign up.
8. **How it works:** pinned three-step story: Connect your data, Let the agents work, Act on the plan.
9. **Pricing:** three cards, Pro highlighted with the animated border and gold badge, monthly/yearly toggle (yearly = 2 months free), "Coming soon" on Pro/Scale buttons until billing exists.
10. **FAQ:** accordion with smooth height animation (data privacy, free tier limits, Gemini, can I export my data, roadmap).
11. **Final CTA:** large aurora panel, headline "Put your AI team to work today.", Start free.
12. **Footer:** logo, product links, legal links, copyright, "Made with care in India" is optional and must be true.

SEO: title "Cadre: The AI team that runs your revenue", meta description, OpenGraph and Twitter cards with `public/og-image.png` (1200x630, generated from the logo and aurora), JSON-LD `SoftwareApplication`, `robots.txt`, `sitemap.xml`.

## 7. App shell and screens
- **Layout:** left sidebar (240px, collapsible to 72px icons, drawer on mobile), top bar (breadcrumb, `Ctrl+K` search, AI usage pill, theme toggle, user menu). Content max width 1440px.
- **Sidebar order:** Command Center, Leads, Meetings, Churn, Competitors, Revenue, Agents, AI CEO, Insights, Settings. Active item has a mint pill that slides between items.
- **Cards:** `--surface`, 1px border, 14px radius, spotlight on hover for clickable ones.
- **Tables:** sticky header, row hover highlight, mono numerals, row actions on hover, skeleton rows while loading.
- **Charts:** aurora gradient strokes with soft area fill, gridlines at 6% opacity, tooltips in glass style, draw-in animation.
- **Forms:** 40px inputs on `--surface-2`, mint focus ring, inline errors, helper text.
- **AI result panels:** left edge accent in mint (gold for CEO), "Generated by Gemini" caption, copy buttons, collapsible sections.
- **Empty states:** small SVG built from the node motif, one sentence, one primary action.
- **Toasts:** Sonner, styled to tokens, bottom right.
- **Risk colors:** low = primary, medium = info, high = warning, critical = danger. Always pair color with a text label.

## 8. Component inventory
Build in `src/components/ui` (shadcn-style, only what is used): Button, Input, Textarea, Select, Checkbox, Switch, Dialog, Drawer, Dropdown, Tabs, Tooltip, Badge, Card, Table, Skeleton, Progress, Avatar, Command, Toaster.
Build in `src/components/motion`: `Reveal`, `WordReveal`, `Magnetic`, `SpotlightCard`, `AnimatedBorder`, `CountUp`, `Marquee`, `Tilt`, `AuroraBackground`, `GridSpotlight`, `ScrollProgress`, `PageTransition`, `Burst`.
Build in `src/components/marketing`: `Nav`, `Hero`, `BuiltWith`, `Bento`, `AgentOrbit`, `Demo`, `HowItWorks`, `Pricing`, `Faq`, `FinalCta`, `Footer`.

## 9. Accessibility
- WCAG 2.2 AA. Visible 2px focus ring with 2px offset on every interactive element.
- Semantic landmarks, one `h1` per page, skip link, labels bound to inputs, `aria-live="polite"` for AI results and toasts.
- Targets at least 40x40px. Color is never the only signal.
- Test with keyboard only and with a screen reader on login, signup, leads table and the AI result panel.
