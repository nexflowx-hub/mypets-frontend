# Deployment

## Frontend (this app) — GitHub → Vercel
1. Push this repository to GitHub (`nexflowx-hub/mypets-frontend`).
2. Vercel → *New Project* → import repo (framework auto-detected: Next.js).
3. Environment variables (from `.env.example`): at minimum
   `DATABASE_URL` (Supabase PG in production), `NEXT_PUBLIC_SUPABASE_URL/ANON_KEY`,
   `SUPABASE_URL/SERVICE_ROLE_KEY` (server-only), `SHOW_DEMO_IMPACT`,
   `EMAIL_PROVIDER`, `PAYMENT_PROVIDER`, feature flags.
4. Domains: `mypets.lat`, `www.mypets.lat`, `facepets.org`, `www.facepets.org`.
   Hostname-aware branding resolves MyPets vs FacePets at runtime (§31).
5. Previews get their own env group **without** production secrets.

## API + Worker — GitHub → Docker → VPS
```
docker build -t mypets-api apps/api         # NestJS/Fastify extraction (contract-compatible)
docker build -t mypets-worker apps/worker
docker compose -f docker-compose.production.example.yml up -d
```
- Healthchecks: `GET /health`, restart policy `unless-stopped`, graceful shutdown (SIGTERM).
- Logs: JSON stdout → docker logging driver; `LOG_LEVEL` configurable.
- Reverse proxy (Caddy example):
```
api.mypets.lat {
  reverse_proxy 127.0.0.1:8080
  header {
    Strict-Transport-Security "max-age=31536000; includeSubDomains; preload"
    X-Content-Type-Options "nosniff"
    Referrer-Policy "strict-origin-when-cross-origin"
  }
}
```

## Supabase
1. Create project → run `supabase/migrations/*.sql` (never click-edit schema).
2. Seed: `supabase/seed/` (fictional, `is_demo=true`).
3. Enable RLS policies from `supabase/policies/`; run `supabase/tests/` (allow/deny).
4. Storage buckets with policies (see `docs/media.md`).
5. Auth: email/password + verification; magic link prepared; social login behind flag.

## DNS (Cloudflare) — placeholders
| Record | Target |
| --- | --- |
| `mypets.lat`, `www` | Vercel (CNAME/A as instructed by Vercel) |
| `facepets.org`, `www` | Vercel |
| `api.mypets.lat` | VPS IP (A record, proxied) |

## Branch strategy
- `main` → production (protected). `develop` → preview. Feature branches → PR only.
- CI (GitHub Actions): lint · typecheck · test · build (web); + docker-build (api/worker).
  No automatic production deploys from feature branches.

## Environments
`development` (SQLite, mock providers, demo impact) → `preview/staging` (Supabase staging,
mock payments) → `production` (live providers, `SHOW_DEMO_IMPACT=false`).
Never share production secrets with preview.
