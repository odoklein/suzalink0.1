# Suzalink 0.1: marketing site (suzalink.com)

The French marketing site for Suzalink, built from the Marketing Website PRD (30 Sept 2026). It is a separate, mostly static Next.js app. It shares nothing with the product and talks to it only through signup links and a leads API.

```bash
npm install
npm run dev          # http://localhost:3000
npm run build        # every page is pre-rendered
npm test             # pricing calculator, typography, lead rules
npm run lint
npm run check:claims # lists the claims that still block the public launch (exit 1 if any)
npm run build:map    # regenerates the V9 hosting map from Natural Earth
```

## Stack

- **Next.js 16** (App Router, Turbopack), React 19, TypeScript, **Tailwind CSS 4** with the site's own tokens (`src/app/globals.css`).
- **next-intl 4**, server side only: `fr` at the root, `/en` later with translated slugs. Links in the browser use a small local `Link` (`src/i18n/navigation.tsx`) that reads the same `src/i18n/config.ts`, so next-intl never ships to the client.
- **MDX** for long-form pages (the legal pages today; resources and comparisons in P1).
- **zod** on the server for form validation, **lucide-react** icons, **posthog-js** loaded lazily and only when a key is set.
- Vercel, with functions pinned to Paris (`vercel.json`, `cdg1`).

## Where things live

```
src/
  app/[locale]/…             one folder per page (24 P0 pages + 3 home variants + 404)
  app/actions/leads.ts       server actions for /demo and /sur-mesure
  app/sitemap.ts, robots.ts  SEO files; [locale]/opengraph-image.tsx builds the social card
  proxy.ts                   next-intl routing + ?utm_audience=… rewrite to a pre-rendered home variant
  config/
    pricing.config.ts        THE ONLY PLACE A PRICE IS TYPED (plans, seats, add-ons, Stripe lookup keys)
    claims.ts                product claims gated on the PRD "Product dependencies"
    visuals.ts               V1–V14 and S1–S6 manifest (placeholder until `src` is set)
    site.ts                  domains, app URLs, Cal.com links, public keys
  content/fr/                all copy, typed; `{{tokens}}` are filled from the pricing config
  components/                ui primitives, page blocks, home, pricing, forms, templates
  lib/pricing/calculate.ts   the calculator; checkout must reuse it to match Stripe to the cent
  lib/typo.ts                French typography (no-break spaces, guillemets, apostrophes), applied once
```

## Rules that keep the site honest

**One pricing config.** Cards, the calculator, the comparison table, the FAQ, the solution pages and the schema.org Offers all read `pricing.config.ts`. Copy never contains a price: it writes `{{equipe.extraSeat}}` and `src/content/tokens.ts` fills it in (an unknown token fails the build). Each plan and add-on carries the Stripe `lookup_key` to use at checkout. `calculate()` returns line items in cents plus `firstInvoice`, so the app's checkout can call the same function and assert equality.

**Claims gate.** Anything that depends on unfinished product work is declared in `src/config/claims.ts` and marked in copy with `claimed(text, claimId, fallback?)`. In strict mode (Vercel production, or `SITE_STRICT_CLAIMS=1`) an unverified claim is hidden, replaced by its fallback, or badged « Bientôt ». Previews and local dev show everything so the pages can be reviewed. Flip `verified: true` once a dependency ships and has been checked. `npm run check:claims` lists what is left.

**French typography.** Write copy with ordinary spaces (`« Appel : 79 € ? »`). `typo()` runs once on the whole dictionary (and on MDX text) and inserts the correct no-break spaces.

**Assets.** Generated visuals and product screenshots render as clearly labelled placeholders until delivered. See `public/visuals/README.md` for the prompt pack and the delivery log. Customer and integration logos are text tiles until the files and the written OK to use them arrive.

## Signup, demo and leads

- Trial CTAs go to `app.suzalink.com/inscription?plan=solo&billing=monthly`. Équipe and Agence use `plan=equipe|agence`, and the app makes the booking step required for them. At click time `Analytics` adds the visitor's billing choice and first-visit attribution (`utm_*`, `landing`).
- `/demo` and `/sur-mesure` do the form, then the embedded Cal.com slot, then a confirmation. The server action validates the input, rate-limits by IP, checks Turnstile when configured, scores the lead (hot at 6 or more) and POSTs it to `LEADS_API_URL`.
- Analytics events: `cta_clicked` (section, label, plan), `pricing_toggle`, `calculator_changed`, `demo_form_submitted`, `demo_booked`, `expert_form_submitted`, `expert_booked`. The app fires `signup_*`, `trial_activated`, `checkout_*` and `addon_added`.
- Consent: CNIL-style banner. « Accepter » and « Refuser » carry equal weight, and the choice is kept 6 months in the `sz_consent` cookie. PostHog runs memory-only until audience consent. LinkedIn Insight loads only after marketing consent.

See `.env.example` for every variable.

## Before the public launch

`npm run check:claims` is the source of truth. As of 30 Sept 2026, a code review of `suzalink-repo` shows:

- **Not built yet** (not in the PRD dependency list): email A/B variants, mailbox warmup, mailbox rotation, a daily AI report, HubSpot/Salesforce import presets, Grain and Fireflies connectors. They are gated.
- **« IA française »:** about eight routes still call OpenAI or Gemini, not three. They include Analyse IA Stratégique (GPT-4o), the assistant (GPT-4.1-mini first) and email sentiment.
- **Hosting:** `.env` points the database at Neon eu-central-1 (Frankfurt), which contradicts « hébergé en France » until it moves.
- **Encryption at rest:** `lib/encryption.ts` (AES-256-GCM) already exists, while the PRD still lists dependency #8. Confirm and flip `tokens-encrypted`.
- **Also found:**
  - Email sequence workers are never started (`startAllWorkers()` is never called).
  - `lib/auth.ts` has a master password that opens any account; remove it before any security claim.
  - Explorium returns fake data when its key is missing.
- **Still missing:** legal pages are drafts with « À compléter » placeholders, to be validated by counsel. Missing assets are the brand kit (logo, colours, fonts), V-visuals, S-screenshots, photos of the three faces, and the written OK for the customer logos.
