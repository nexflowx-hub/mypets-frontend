# Database

## Canonical database

**Supabase PostgreSQL is the canonical shared database for MyPets.**

The previous SQLite sandbox compatibility layer has been removed from `prisma/schema.prisma` because it created a schema mismatch with the real Supabase migration and was unsuitable for Vercel persistence.

Current sources of truth:

- Prisma application mapping: `prisma/schema.prisma`
- Canonical SQL bootstrap: `supabase/migrations/0001_init.sql`
- Deterministic demo seed: `supabase/seed/0001_demo.sql`
- Prisma/Bun seed equivalent: `prisma/seed.ts`

## Environments

- **Local**: local PostgreSQL 16+ or a dedicated Supabase development project.
- **Staging**: dedicated Supabase project, demo records allowed, payment provider remains mock.
- **Production**: dedicated production Supabase project, real data only where explicitly approved.

Never share production database credentials with preview deployments.

## Current public/demo slice

The first release implements:

- `stories`
- `impact_metrics`
- `newsletter_subscribers`
- `contributions`
- `reports`
- `content_blocks`

Prisma model/column mappings intentionally match these snake_case PostgreSQL tables and UUID primary keys.

## Future platform model

The full product can extend toward:

`users, profiles, countries, locales, supporters, guardian_profiles, protectors,
protector_applications, protector_verifications, organizations, organization_members,
partners, partner_offers, pets, pet_photos, pet_updates, pet_health_events,
pet_status_history, pet_adoptions, needs, need_updates, need_categories, campaigns,
campaign_updates, campaign_support_allocations, recurring_contributions, payment_intents,
payment_transactions, payment_events, refunds, financial_ledger_entries, payouts,
reconciliations, follows, favorites, shares, referrals, in_kind_*, volunteer_*,
moderation_cases, moderation_actions, notifications, notification_preferences,
email_events, consents, privacy_requests, data_export_requests, deletion_requests,
impact_events, impact_aggregates, media_assets, media_consents, audit_logs,
feature_flags, system_settings`.

Do not create this entire schema prematurely; add tables through reviewed migrations as product flows are implemented.

## Conventions

- UUID primary keys;
- UTC/timestamptz timestamps;
- explicit constraints and foreign keys;
- cents/integer storage for monetary values;
- country + locale values validated at domain boundaries;
- public city/region only — never precise private residential coordinates;
- `is_demo` on fictional story/impact data;
- privileged financial/moderation state changes only from trusted server-side code.

## Row Level Security

RLS is enabled in the initial migration.

Public policies currently allow:

- active `stories` reads;
- `impact_metrics` reads;
- the explicitly public `legal.entity` content block.

There are **no anonymous read/write policies** for:

- newsletter subscriber records;
- contributions;
- reports.

These mutations go through trusted server-side handlers. Future user-owned tables must use `auth.uid()`-based policies and RLS allow/deny tests.

## Connection strategy

For Vercel/serverless Prisma traffic, prefer the Supabase pooled PostgreSQL connection string where available. Keep the connection string server-side as `DATABASE_URL`.

Never expose:

- database passwords;
- direct PostgreSQL credentials;
- Supabase service-role keys

through `NEXT_PUBLIC_*` variables.

## Seed and demo honesty

Both seed implementations are deterministic and mark fictional story/impact rows `is_demo = true`.

Before a real production launch:

- set `SHOW_DEMO_IMPACT=false`;
- ensure real production metrics are backed by real records;
- remove or clearly separate fictional story cards from real beneficiary cases.
