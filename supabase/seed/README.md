# supabase/seed

`0001_demo.sql` contains deterministic fictional staging data. It is safe to re-run because it uses idempotent upserts.

All fictional story and impact rows are explicitly marked `is_demo = true` and must never be represented as real production impact.

The SQL seed mirrors `prisma/seed.ts` and currently includes:

- 2 protectors: **Ana • Porto** and **Carlos • São Paulo**;
- 2 animals: **Luna** and **Milo**;
- 6 demo impact metrics;
- the `legal.entity` content block for HUMAN IMPACT TECH LTD.

Supabase staging bootstrap order:

```text
supabase/migrations/0001_init.sql
supabase/seed/0001_demo.sql
```

Prisma/Bun equivalent after the schema exists:

```bash
bun run db:seed
```
