# supabase/seed

Deterministic fictional seed data (`is_demo = true` everywhere — never mixed with
production data). Mirrors `prisma/seed.ts`:

- 2 protectors: **Ana • Porto** (14 cats, EUR) and **Carlos • São Paulo** (23 dogs, BRL)
- 2 animals: **Luna** (in treatment) and **Milo** (needs care)
- 6 impact metrics (3.482 animals, 612 protectors, 1.920 needs, 285 adoptions, 48.7t food, +12.500 community)
- `legal.entity` content block (HUMAN IMPACT TECH LTD wording, configurable)

Reset/reseed locally: `bun prisma/seed.ts` (idempotent upserts).
