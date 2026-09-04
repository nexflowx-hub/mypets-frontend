# MyPets — Pessoas. Animais. Impacto Real.

> **Quem ajuda animais também merece ajuda.**
>
> MyPets is a social-impact initiative powered by **HUMAN IMPACT TECH LTD** (company number 17422257).

Production-oriented implementation of the **MyPets** landing/platform foundation, with the companion **FacePets** concept (*Every pet has a story*).

![MyPets](public/images/hero.jpg)

## Current status

### Implemented

- cinematic, mockup-faithful MyPets landing page;
- responsive desktop/mobile design;
- `pt-PT`, `pt-BR` and `en` UI dictionaries;
- EUR/BRL formatting;
- FacePets promotional panel;
- documentary/demo imagery with provenance manifest;
- stories, impact, newsletter, reports and mock contribution flow;
- versioned lightweight REST handlers under `/api/v1`;
- Prisma connected to **PostgreSQL**;
- canonical Supabase SQL migration + deterministic demo seed;
- Row Level Security baseline for the public slice;
- GitHub Actions CI with PostgreSQL 16, migration, seed, lint, typecheck and build;
- production-safe Next.js TypeScript checks and basic security headers.

### Not live yet

- real payments;
- payouts;
- real protector onboarding/KYC;
- real authentication dashboards;
- dedicated `facepets.org` hostname experience;
- extracted VPS backend/worker.

These remain intentionally disabled until reviewed and connected to production services.

## Architecture for the first release

```text
Cloudflare
   |
   +-- mypets.lat ------------> Vercel / Next.js (this repository)
   |
   +-- api.mypets.lat --------> VPS API/worker (later extraction)
   |
   +--------------------------> Supabase PostgreSQL/Auth/Storage
```

For the initial MyPets landing release, the lightweight `/api/v1` handlers can remain inside Next.js/Vercel. Business-critical flows will later move to `nexflowx-hub/mypets-backend` on the VPS.

## Database

**PostgreSQL/Supabase is canonical.** SQLite is no longer part of the shared/staging/production architecture.

Public/demo models currently implemented:

- `stories`
- `impact_metrics`
- `newsletter_subscribers`
- `contributions`
- `reports`
- `content_blocks`

Canonical files:

```text
prisma/schema.prisma
supabase/migrations/0001_init.sql
supabase/seed/0001_demo.sql
```

All fictional story/impact records use `is_demo = true`.

## Local development

Prerequisites:

- Bun
- PostgreSQL 16+ or a Supabase development/staging project

```bash
cp .env.example .env.local
bun install
bun run db:generate
bun run db:push
bun run db:seed
bun run dev
```

Then open:

```text
http://localhost:3000
```

Before committing:

```bash
bun run lint
bun run typecheck
bun run build
```

## Supabase staging bootstrap

Create a dedicated staging project and apply, in order:

```text
supabase/migrations/0001_init.sql
supabase/seed/0001_demo.sql
```

Use the Supabase pooled PostgreSQL connection string for Vercel `DATABASE_URL` when available. Never expose a database password or service-role key with a `NEXT_PUBLIC_` prefix.

## Vercel environment baseline

Required for the first database-backed preview:

```text
APP_ENV=staging
BRAND=mypets
SHOW_DEMO_IMPACT=true
DATABASE_URL=<Supabase pooled PostgreSQL URL>
PAYMENT_PROVIDER=mock
EMAIL_PROVIDER=console
PAYMENTS_LIVE=false
PAYOUTS_ENABLED=false
```

Supabase public/auth variables can be added when Auth is enabled. See `.env.example`.

## CI

The active workflow lives at:

```text
.github/workflows/ci.yml
```

It validates the canonical SQL migration against PostgreSQL 16, seeds demo data, then runs:

```text
lint
TypeScript typecheck
Next.js build
```

Do not merge changes that require `ignoreBuildErrors`.

## Main application structure

```text
src/
  app/
    page.tsx
    api/v1/
  components/
    brand/
    donate/
    layout/
    sections/
    ui/
  lib/
    i18n/
    db.ts
    stores.ts
    types.ts

prisma/
  schema.prisma
  seed.ts

supabase/
  migrations/
  seed/

public/
  images/
  media/

docs/
```

## Demo and trust rules

- demo content is explicitly marked as demo;
- AI-generated photography is placeholder/institutional material, not evidence of a real rescue;
- no claim that MyPets is a registered NGO/charity is made unless legally verified and deliberately enabled;
- no tax-deductibility claims;
- payment state cannot be marked `PAID` by the browser;
- real payments and payouts remain disabled by default.

## Deployment sequence

1. GitHub CI green.
2. Create/configure Supabase staging.
3. Vercel Preview deployment.
4. QA desktop/mobile/locales/API.
5. Connect `mypets.lat` and redirect `www.mypets.lat` to the canonical host.
6. Replace/disable demo claims before real public launch.
7. Build/extract the VPS backend when real payment, verification, AI, jobs and privileged workflows require it.
8. Implement the dedicated FacePets hostname experience before connecting `facepets.org` as a separate branded entry point.

## Institutional footer

Powered by **HUMAN IMPACT TECH LTD**  
Company number **17422257**  
**1-75 Shelton Street, Covent Garden, London, United Kingdom, WC2H 9JQ**  
**humanimpact.tech**

*Animais. Pessoas. Um futuro melhor.* ♡
