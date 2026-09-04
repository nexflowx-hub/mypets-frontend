# Security

## Database
- **RLS everywhere** a Supabase client can reach; private buckets (`private-verification`,
  `private-finance`) are service-role only.
- `service_role` key **never** reaches the browser. Frontend uses anon key + session only.
- Privileged operations (verification, refunds, payouts, moderation) run through the backend.

## Application
- Input validation on every mutating endpoint (type/range checks; Zod schemas shared web/API
  in the production monorepo `packages/validation`).
- Contributions: idempotency keys, server-verified status transitions, transactional story
  increments; the UI cannot mark payments `PAID`.
- Sanitized errors: clients receive `{ error: { code, message } }` — no stack traces, no SQL.
- Rate limiting hooks on public POSTs (newsletter, reports, intents) at the edge
  (Cloudflare) and app layer in production.
- Admin actions require confirmation + write `audit_logs`
  (`actor_id, action, resource_type, resource_id, old_values, new_values, request_meta, created_at`).

## Uploads
- Allowed: `image/jpeg`, `image/png`, `image/webp`; strict size limits; private documents
  never in public buckets; AV/scanning hook documented for later.

## Transport & headers
- HTTPS enforced behind Cloudflare; HSTS, `X-Content-Type-Options`, `Referrer-Policy`,
  frame deny, CSP with allow-listed origins (Vercel, Supabase, image domains).

## Privacy (GDPR-ready)
- Explicit consent records (`consents`: type, version, accepted, timestamp, locale, source).
- Newsletter consent is never implied; cookie consent UI categories: necessary, analytics,
  personalization, marketing (Accept all / Necessary only / Customize).
- Self-service data export & deletion requests (`data_export_requests`, `deletion_requests`).

## Secrets
- Only `.env.example` is committed. Real secrets live in Vercel env, Docker secrets and
  Supabase vault. No credentials in the repository, ever.
