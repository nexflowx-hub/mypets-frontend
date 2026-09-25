# Z.AI DELTA PROMPT — MyPets Digital Library Rich Media v1.1

## Context

You are working on the existing MyPets frontend. Do NOT rebuild the product from scratch.

Repository: `nexflowx-hub/mypets-frontend`
Stable launch branch to use as base: `feat/digital-library-launch-stable-v1`
Canonical content repository: `nexflowx-hub/mypets-data`
Canonical content ref for the current launch edition: `cf75919727dc611fa5c7064480e1f3042e0bfa43`

The stable launch already owns:
- checkout economics;
- Pix/payment flow;
- secure post-payment access;
- entitlement rules;
- public library catalog;
- public previews;
- premium reader;
- print/PDF;
- 13-guide catalog;
- round MyPets brand seal.

**Do not modify payment, price, entitlement, receipt/session, cause IDs, Supabase auth or campaign accounting.**

Your task is a visual/editorial enhancement layer only.

## Canonical inputs

Consume these files from `mypets-data`:
- `media/media-placement-master.json` — exact 103 section-level placements
- `media/guide-media-pack.yaml` — original visual component definitions
- `media/registry.yaml` — approved media/source/license metadata
- `library/pt-BR/breeds/index.json` — Atlas 64
- `docs/MEDIA_PLACEMENT_MASTER_MAP.md` — human-readable QA reference
- `docs/COVER_BRAND_SYSTEM.md` — cover/seal rules
- `docs/INTERACTIVE_EDITORIAL_PLAYBOOK.md` — interaction rules

Do not invent alternate placement logic when an exact section anchor already exists.

## Goal

Turn the current long-form reader into a premium editorial experience:
`text → visual → scenario → action/checklist → media → recap`

Keep it fast, mobile-first, accessible and printable.

## Architecture

Implement a small typed content-media adapter in the frontend:

1. fetch/cache the canonical placement manifest server-side;
2. map each guide ID/slug to its placements;
3. match placements by the exact canonical heading anchor;
4. render a `LibraryMediaSlot` immediately before/after the target section;
5. gracefully skip a media item if its asset is unavailable — never block the guide;
6. retain clean reader output if the content manifest is temporarily unreachable.

Suggested component surface:
- `LibraryMediaSlot`
- `LibraryImageFigure`
- `LibraryVideoLesson`
- `LibraryOriginalVisual`
- `GuideCoverSeal` (reuse existing `MyPetsRoundSeal`, do not create another logo system)
- `BreedAtlasGrid` / `BreedProfileCard`

## External media

Rules:
- official YouTube/video resources: embed from official publisher only;
- reusable photographs: respect registry attribution/license;
- no unlicensed scraping;
- do not display source-page HTML as the image;
- if a production image copy has not yet been ingested, show a graceful editorial placeholder or source link rather than a broken image.

Every visual must use the PT-BR `alt` and `caption` from the canonical placement/registry data where available.

## Video lesson pattern

Every video placement must render:
1. title/source;
2. responsive 16:9 player;
3. caption;
4. `Observe estes pontos` list from `watch_for`;
5. print fallback with video title + source/link/QR-friendly URL.

Do not autoplay.

## Original MyPets visuals

Render original visuals with semantic HTML/CSS/SVG, not bitmap screenshots.

Required visual families:
- traffic-light;
- timeline;
- day-grid / week-grid;
- process loop;
- room/floor map;
- body map;
- warning grid;
- comparison matrix;
- decision tree;
- tracker;
- child card/poster;
- route cards;
- distance diagram;
- category wheel;
- difficulty slider;
- checklist card.

Accessibility:
- never communicate meaning by colour alone;
- labels remain readable in grayscale;
- keyboard accessible if interactive;
- `prefers-reduced-motion` respected;
- print layout must contain the full information without hover/tap.

## Atlas 64

Build a premium Atlas view using `library/pt-BR/breeds/index.json`.

Required:
- all 64 profiles discoverable;
- search by breed name;
- filter by size, energy, grooming and trainability;
- real photo when asset is available;
- alt/caption from dataset;
- card opens a detail view;
- never output a deterministic 'best breed' score;
- clearly label traits as tendencies/context rather than guarantees.

Do not create fake numeric compatibility percentages.

## Cover system

Reuse the official round MyPets mark already implemented by the stable branch.

Rules:
- bottom-right editorial seal;
- approximately 4% safe margin;
- do not cover animal eyes/faces;
- standalone printable worksheets may use low-opacity watermark;
- never recreate, redraw or type a substitute logo.

## Reader UX

Preserve:
- current TOC;
- section progress;
- print/PDF button;
- clean premium URLs;
- current access session.

Enhance:
- visual rhythm;
- chapter opening spacing;
- source/media panels;
- mobile image handling;
- print fallbacks.

Do not add a mandatory account wall.

## Performance

- lazy-load below-the-fold media;
- reserve aspect ratio to avoid CLS;
- video player should not load heavy iframe JS until near viewport or user intent if practical;
- no huge client-side copy of the whole 103-placement manifest when server rendering can resolve the current guide;
- no dependency-heavy page-turn library for launch.

## Acceptance criteria

1. all 13 guide pages still build;
2. premium entitlement behavior is unchanged;
3. no receipt IDs are exposed in rendered HTML/WhatsApp copy;
4. at least one real media/original visual is rendered correctly in each guide where canonical data exists;
5. exact placement comes from `media-placement-master.json`;
6. alt/caption present for informational media;
7. videos are official embeds and never autoplay;
8. Atlas lists all 64 profiles;
9. print/PDF has usable fallbacks;
10. mobile 360px width has no horizontal overflow except intentionally scrollable tables;
11. Lighthouse/accessibility regression is avoided;
12. `bun run lint`, `bun run typecheck` and `bun run build` pass.

## Branch / PR

Create a new branch from `feat/digital-library-launch-stable-v1`:
`feat/digital-library-rich-media-v1-1`

Open a draft PR titled:
`feat: render canonical MyPets library media + Atlas 64 experience`

Do NOT merge it into the stable launch branch until the base launch is live and the visual layer passes QA.

## Non-goals

Do not:
- redesign the checkout;
- change R$12,90;
- change 1 guide = 1 kg;
- alter payment provider;
- add subscriptions;
- build FacePets AI in this PR;
- redesign Supabase auth;
- rewrite guide copy;
- replace canonical content with hard-coded frontend content.

Deliver this as a focused delta, not another full-site rewrite.
