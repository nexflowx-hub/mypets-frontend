# Supabase seed notes

The canonical Supabase seed entrypoint is:

```text
supabase/seed.sql
```

It contains deterministic fictional staging data and is safe to re-run because it uses idempotent upserts.

All fictional story and impact rows are explicitly marked `is_demo = true` and must never be represented as real production impact.

The SQL seed mirrors `prisma/seed.ts` and currently includes:

- 2 protectors: **Ana • Porto** and **Carlos • São Paulo**;
- 2 animals: **Luna** and **Milo**;
- 6 demo impact metrics;
- the `legal.entity` content block for HUMAN IMPACT TECH LTD.

After linking a staging Supabase project, the standard deployment path is:

```bash
supabase db push --include-seed
```

Prisma/Bun equivalent after the schema exists:

```bash
bun run db:seed
```
