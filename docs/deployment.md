# Deployment

## Release order

1. GitHub CI must be green.
2. Create/configure **Supabase staging**.
3. Deploy a **Vercel Preview** connected to staging.
4. QA the full landing, API handlers, mobile layouts and locales.
5. Connect `mypets.lat` / `www.mypets.lat`.
6. Implement the dedicated FacePets hostname experience before using `facepets.org` as a separate branded entry point.
7. Extract privileged API/worker workloads to the VPS only when those workloads are actually introduced.

## Frontend — GitHub → Vercel

Repository:

```text
nexflowx-hub/mypets-frontend
```

Framework: Next.js (auto-detected by Vercel).

Minimum staging environment variables:

```text
APP_ENV=staging
BRAND=mypets
SHOW_DEMO_IMPACT=true
DATABASE_URL=<Supabase pooled PostgreSQL connection string>
PAYMENT_PROVIDER=mock
EMAIL_PROVIDER=console
PAYMENTS_LIVE=false
PAYOUTS_ENABLED=false
```

Add Supabase public/auth values only when those features are enabled. Never expose the service-role key with `NEXT_PUBLIC_`.

Production previews must not receive production database/payment credentials.

## Canonical domain

Recommended canonical host:

```text
https://mypets.lat
```

Redirect:

```text
https://www.mypets.lat -> https://mypets.lat
```

Use the exact DNS targets shown by Vercel when adding the custom domains in Cloudflare.

## Supabase staging

Create a dedicated staging project. The repository already follows the Supabase CLI layout:

```text
supabase/migrations/20260904193000_init.sql
supabase/seed.sql
```

Deploy through migration history rather than manually editing the remote schema:

```bash
supabase login
supabase link --project-ref <STAGING_PROJECT_REF>
supabase db push --include-seed
```

The active GitHub CI applies the same migration/seed against PostgreSQL 16 before a successful build.

For Vercel/serverless Prisma traffic, use the Supabase transaction pooler connection string where appropriate. Use a migration-suitable connection mode for native migration tooling.

Do not enable live payments or payouts in staging.

## API/worker extraction — later

The production backend repository is reserved at:

```text
nexflowx-hub/mypets-backend
```

It is intentionally empty until MyPets needs persistent privileged workloads such as:

- live payment orchestration/webhooks;
- recurring payment reconciliation;
- protector verification;
- KYC/private document processing;
- AI jobs;
- queued email/notifications;
- moderation workers;
- financial audit/reconciliation.

At that point the target becomes:

```text
api.mypets.lat -> existing VPS reverse proxy -> mypets-api container
                                          \-> mypets-worker container
```

Do **not** install a second reverse proxy if the AtlasWallet VPS already has Nginx, Caddy or Traefik listening on ports 80/443.

## VPS application layout

Recommended multi-project structure:

```text
/srv/apps/
  atlaswallet/
  mypets/
    api/
    worker/
    compose/
    env/
    data/
    logs/
    backups/
```

Keep MyPets isolated from AtlasWallet:

- separate Docker Compose project;
- separate Docker network;
- separate environment files;
- separate secrets;
- separate volumes;
- separate logs;
- no shared database credentials.

MyPets PostgreSQL remains in Supabase rather than being installed on the VPS.

## Cloudflare targets

Current/near-term:

| Record | Target |
| --- | --- |
| `mypets.lat` | Vercel target supplied by Vercel |
| `www.mypets.lat` | Vercel / canonical redirect |

Later:

| Record | Target |
| --- | --- |
| `api.mypets.lat` | VPS public IP, proxied if compatible with the API setup |
| `facepets.org` | Vercel after hostname-aware FacePets implementation |
| `www.facepets.org` | Vercel / canonical redirect |

## Environments

```text
development -> PostgreSQL/Supabase dev, demo data, mock providers
staging     -> Supabase staging, demo data, mock providers
production  -> Supabase production, verified real content, live providers only after review
```

Before real production launch:

```text
SHOW_DEMO_IMPACT=false
PAYMENTS_LIVE=<enable only after provider/security review>
PAYOUTS_ENABLED=false
```

Payouts remain disabled until the legal, financial, KYC/AML and operational model is explicitly approved.
