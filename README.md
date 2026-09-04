# MyPets — Pessoas. Animais. Impacto Real.

> **Quem ajuda animais também merece ajuda.**
> MyPets is a social impact initiative powered by HUMAN IMPACT TECH LTD (company number 17422257).

Production-oriented implementation of the **MyPets** platform (with the companion brand **FacePets** — *Every pet has a story*), built from the master implementation prompt and the mandatory visual mockup `Maquete_MyPets.png`.

![MyPets](public/images/hero.jpg)

## What is implemented

### Landing experience (mockup-faithful)
- Cinematic documentary **hero** (dark left overlay, subject right) with the exact headline system per locale
- **FacePets** dark premium panel docked beside the hero on XL screens, standalone section below XL
- **Por trás de cada animal salvo…** — 4 documentary action cards (Resgatou / Alimentou / Tratou / Acolheu)
- **Como funciona?** — 5-step verification-first flow + closing statement
- **Três formas de ajudar** + **MyPets Guardians** premium dark card
- **Histórias que precisam de você agora** — DB-driven story cards (Ana • Porto, Carlos • São Paulo, Luna, Milo) with tags, progress, support CTA, per-card **Reportar** (moderation queue)
- Trust transparency strip (verified profiles, case updates, clear needs, moderation)
- **Juntos criamos um mundo mais humano** dark CTA + **Impacto em números** (6 animated metrics)
- Partner CTA band + **dark petrol footer** with newsletter, country selector and the full institutional line
- Global **search** (⌘K-style), **sign-in dialog** (demo), **donation dialog** with end-to-end **mock payment provider**

### Multilanguage (master prompt §4–5)
- `pt-PT`, `pt-BR` and `en` dictionaries — **no hardcoded copy in components**
- Natural country terminology (pt-PT *esterilizações/donativo*, pt-BR *castrações/doação*)
- Currency-aware formatting (EUR / BRL via `Intl.NumberFormat`)
- Locale persisted in `localStorage`, selector in header + footer country pills

### Backend (versioned REST — `/api/v1`)
| Endpoint | Method | Purpose |
| --- | --- | --- |
| `/api/v1/health` | GET | Liveness + DB probe |
| `/api/v1/stories` | GET | Active stories, localized (`?locale=`) |
| `/api/v1/impact/public` | GET | Impact metrics gated by `SHOW_DEMO_IMPACT` |
| `/api/v1/config` | GET | Brand/entity config + feature flags |
| `/api/v1/newsletter` | POST | Double-consent newsletter subscription |
| `/api/v1/contributions/intents` | POST | Creates `PENDING` contribution (mock `PaymentProvider`) |
| `/api/v1/contributions/:id/confirm` | POST | **The only place a contribution becomes `PAID`** (server-verified) |
| `/api/v1/reports` | POST | Report a concern → moderation queue |

Security invariants: the **frontend can never mark a payment as `PAID`**; confirmations happen server-side through the provider abstraction; contributions are idempotent (`idempotencyKey`); successful story contributions atomically increment story progress.

### Data model (Prisma)
`Story` · `ImpactMetric` · `NewsletterSubscriber` · `Contribution` · `Report` · `ContentBlock` — all demo rows flagged `is_demo`. SQLite in this environment; the identical model maps 1:1 to **Supabase PostgreSQL** for production (see `docs/database.md`).

## Quick start

```bash
cp .env.example .env       # adjust if needed
npm install                # or: bun install
npm run db:push            # create SQLite schema
npx tsx prisma/seed.ts     # or: bun prisma/seed.ts — deterministic demo data
npm run dev                # http://localhost:3000
```

## Tech stack
- **Next.js 16 (App Router)** + React 19 + TypeScript (strict)
- **Tailwind CSS 4** + shadcn/ui + Lucide icons
- **Prisma** ORM (SQLite dev / PostgreSQL-Supabase production)
- **Zustand** (UI state) — server state fetched via typed API routes
- **next/font** (Manrope + Caveat for handwritten accents)

## Project structure
```
src/
  app/
    page.tsx              # homepage (server component → DB)
    api/v1/…              # versioned REST API
  components/
    brand/                # MyPets / FacePets replaceable logos (SVG)
    layout/               # header, footer, search, auth dialogs
    sections/             # hero, facepets, mission, stories, impact
    donate/               # multi-step donation dialog (mock provider)
  lib/
    i18n/                 # dictionaries (pt-PT, pt-BR, en) + locale context
    stores.ts             # zustand stores
    db.ts                 # prisma client
prisma/                   # schema + deterministic seed
public/images/            # AI-generated demo photography (see manifest)
public/media/             # demo-manifest.json (provenance + replacement flags)
docs/                     # architecture, deployment, api-contract, security…
```

## Demo data & honesty rules (master prompt §62, §102–103)
- All demo rows are flagged `is_demo = true`; story cards show a “Demonstração” badge and the impact section shows a demo note when `SHOW_DEMO_IMPACT=true`.
- No fake legal claims (no “registered NGO/charity”, no tax-deductibility) — institutional wording is CMS-configurable via `ContentBlock` (`legal.entity`).
- All photography is **AI-generated placeholder** media, tracked in `public/media/demo-manifest.json` with `replacement_required: true`. AI imagery is never presented as a real rescue case.

## Documentation
- [`docs/architecture.md`](docs/architecture.md) — system topology (web / api / worker / Supabase / Cloudflare)
- [`docs/database.md`](docs/database.md) — schema conventions, Supabase migration & RLS strategy
- [`docs/api-contract.md`](docs/api-contract.md) — REST contract and error format
- [`docs/payments.md`](docs/payments.md) — PaymentProvider abstraction, mock provider, security invariants
- [`docs/localization.md`](docs/localization.md) — locale rules, dictionaries, routing strategy
- [`docs/media.md`](docs/media.md) — media provenance model and AI image prompts
- [`docs/security.md`](docs/security.md) — RLS, secrets, uploads, rate limiting, audit logs
- [`docs/deployment.md`](docs/deployment.md) — Vercel + VPS + Supabase + Cloudflare runbooks

## Deployment (summary)
- **Web (this app)** → GitHub → **Vercel** (`mypets.lat`, `www`, `facepets.org`)
- **API/Worker (production)** → Docker on VPS behind Caddy (`api.mypets.lat`)
- **Database/Auth/Storage** → **Supabase** (PostgreSQL, Auth, Storage buckets with RLS)
- **DNS/WAF** → **Cloudflare**

> The sandbox build runs the landing experience and API on a single Next.js app (single-route requirement of the preview environment). The production topology (separate API/worker containers, Supabase, hostname-aware MyPets/FacePets branding) is specified in `docs/`.

---

Powered by **HUMAN IMPACT TECH LTD** · Company number 17422257 · 1-75 Shelton Street, Covent Garden, London, United Kingdom, WC2H 9JQ · humanimpact.tech

*Animais. Pessoas. Um futuro melhor.* ♡
