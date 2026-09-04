# Database

## Environments
- **Sandbox/dev**: SQLite via Prisma (`prisma/schema.prisma`, `DATABASE_URL="file:./db/custom.db"`).
- **Production**: **Supabase PostgreSQL**. The Prisma models map 1:1 to the SQL migration set
  hosted in `supabase/migrations/` (generated with `prisma migrate diff` against the PG schema).

## Conventions (master prompt §38)
- UUID primary keys (`uuid_v4()` in PG, cuid in SQLite parity mode)
- UTC timestamps: `created_at`, `updated_at`, soft-delete `deleted_at` where appropriate
- Explicit status enums / lookup values, foreign keys, indexes, unique constraints
- Country + locale references instead of duplicated free text
- Public city/region only — **never** exact residential coordinates or addresses

## Core tables (production set)
`users, profiles, countries, locales, supporters, guardian_profiles, protectors,
protector_applications, protector_verifications, organizations, organization_members,
partners, partner_offers, pets, pet_photos, pet_updates, pet_health_events,
pet_status_history, pet_adoptions, needs, need_updates, need_categories, campaigns,
campaign_updates, campaign_support_allocations, contributions, recurring_contributions,
payment_intents, payment_transactions, payment_events, refunds, financial_ledger_entries,
payouts (disabled), reconciliations, follows, favorites, shares, referrals, comments
(feature-flagged), in_kind_*, volunteer_*, reports, moderation_cases, moderation_actions,
notifications, notification_preferences, email_events, consents, privacy_requests,
data_export_requests, deletion_requests, impact_events, impact_aggregates, media_assets,
media_consents, audit_logs, feature_flags, system_settings`

The six tables implemented here (`Story`, `ImpactMetric`, `NewsletterSubscriber`,
`Contribution`, `Report`, `ContentBlock`) are the public/demo slice of that model.

## Row Level Security
- Every table exposed to the Supabase client gets RLS:
  - public read: `pets (visibility=public)`, `stories`, `impact_aggregates`
  - owner read/write: `profiles`, `contributions (user_id = auth.uid())`
  - **no anon/service access** to `private-verification`, `private-finance` buckets/tables
- Privileged operations (verify protector, refund, payouts) happen **only** through the
  backend using the service-role key — never from the browser.
- RLS allow/deny tests ship with the production migration set (`supabase/tests/`).

## Seed
`prisma/seed.ts` is deterministic (no random content), mirrors `supabase/seed/`, and flags
every fictional row with `is_demo = true`: 2 protectors (Ana • Porto, Carlos • São Paulo),
2 animals (Luna, Milo), 6 impact metrics, the legal `ContentBlock`.
