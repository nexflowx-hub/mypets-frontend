# Architecture

## Product family

| Brand | Domain | Role |
| --- | --- | --- |
| **MyPets** | `mypets.lat` / `www.mypets.lat` | Network & support infrastructure (protectors, needs, campaigns, contributions) |
| **FacePets** | `facepets.org` | Public identity & storytelling layer per animal (FacePets ID, timeline, QR) |

Both brands share **one** backend, database, auth and media infrastructure. The app resolves
`brand = "mypets" | "facepets"` from the hostname (`/api/v1/config`, middleware in production)
and swaps logo, palette accents, navigation and homepage emphasis — the app is never duplicated.

## Topology

```
                    ┌─────────────┐
   Cloudflare ─────▶│  Vercel     │──▶ Next.js web (this repo, SSR + /api/v1)
   DNS·WAF·Proxy    └─────────────┘
        │
        ├── api.mypets.lat ──▶ VPS Docker: NestJS/Fastify API (production extraction)
        │                       └──▶ worker container (email queue, webhooks retries,
        │                             scheduled jobs, impact calculation, media/AI jobs)
        └── Supabase: PostgreSQL · Auth · Storage (public-pets, public-protectors,
              public-campaigns, private-verification, private-finance, avatars,
              generated-assets) with RLS on every exposed table
```

### Sandbox reality (this repo)
The preview environment exposes **one port**, so the landing experience and `/api/v1`
run in a single Next.js app with Prisma/SQLite. Every seam needed to split into the
production topology already exists:

- All reads/writes go through `/api/v1` route handlers (or server helpers colocated in `page.tsx` that mirror the API).
- `src/lib/types.ts` defines the transport DTOs shared by web and API.
- Payment/email providers are interfaces with a working **mock** implementation.
- `docs/database.md` maps the Prisma models to the Supabase migration set.

## Key flows

### Contribution (mock provider)
```
UI (DonateDialog) ──POST /api/v1/contributions/intents──▶ PENDING (idempotencyKey)
                ──POST /api/v1/contributions/:id/confirm─▶ provider verify (server-only)
                                                          ▶ status=PAID (tx: increment story)
                                                          ▶ receipt rendered (step 6)
```
The client can **never** set `PAID`. Webhooks (`POST /v1/payment-webhooks/:provider`) are part
of the production API contract for asynchronous provider events.

### Verification-first moderation
Protector applications → verification cases (documents in **private** storage) →
`NEW → IDENTITY_VERIFIED → ACTIVITY_VERIFIED → MYPETS_VERIFIED`. Reports from any public
page enter the moderation queue (`Report.status = OPEN`).

### FacePets identity
Every pet gets an immutable public ID (`FP-PT-00001284`, `FP-BR-00003718`) with a
QR-compatible URL `facepets.org/p/{facepets_id}`; internal UUIDs stay authoritative.
