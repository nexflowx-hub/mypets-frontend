# Z.AI Parallel Prompt — MyPets Premium Visual Editorial Pass

## Role

Act as a senior frontend engineer + editorial product designer. Work on the existing MyPets Digital Library. Do not redesign the business model or rebuild the product.

Repository:
`nexflowx-hub/mypets-frontend`

Base branch:
`feat/library-rich-media-launch-pass`

Canonical editorial source:
`nexflowx-hub/mypets-data`

Content release:
`release/library-v1.0.0-rc1`

## Non-negotiable boundaries

Do not change:
- Pix/payment flow;
- cause ids;
- pricing;
- 1 eBook = 1 kg unit logic;
- receipt/session security;
- Supabase auth;
- entitlement keys;
- checkout provider;
- backend API contracts.

Do not create new medical advice.

Do not rewrite guide copy unless required for visual labels and the canonical source already provides that label.

## Existing implementation

The base branch already:
- loads `media/media-placement-master.json`;
- loads `media/registry.yaml`;
- places media at exact guide H2/H3 anchors;
- renders images;
- renders official YouTube videos;
- renders accessible branded fallbacks for original MyPets visuals.

Your job is to upgrade the **original-visual fallback cards** into polished, bespoke semantic HTML/SVG components.

## Canonical visual families to implement

Implement reusable components for:
- traffic-light;
- timeline;
- day-grid;
- week-grid / weekly-grid;
- process;
- staircase;
- matrix / comparison-matrix;
- room-checklist;
- floorplan;
- trigger-map;
- distance-diagram;
- body-map;
- warning-grid;
- step-cards;
- child-poster;
- room-diagram;
- category-wheel;
- slider;
- checklist-card;
- decision-tree;
- annotated-card;
- photo-grid;
- annual-calendar;
- tracker;
- observation-board;
- silhouette-guide;
- annotated-label;
- route-cards.

## Editorial rule

Never invent factual content that is not already present in:
- the placement `alt`;
- the placement `caption`;
- the matching section of the guide;
- the existing guide media-pack definition.

If a component lacks enough structured data to render a truthful detailed diagram:
- render a polished summary visual using the canonical alt/caption;
- do not fabricate steps, percentages or medical thresholds.

## Visual language

Premium MyPets editorial system:
- deep petrol;
- emerald;
- warm cream;
- restrained gold/amber;
- rounded editorial panels;
- clean line icons;
- generous whitespace;
- not a SaaS dashboard;
- not childish except explicitly child-oriented cards.

Use the official existing round MyPets seal component only:
`MyPetsRoundSeal`

Never recreate the logo.

## Accessibility

Every component:
- semantic labels;
- readable without colour alone;
- full text equivalent;
- print-safe;
- grayscale-safe;
- keyboard accessible when interactive;
- prefers-reduced-motion;
- no hover-only critical information.

## Print/PDF

For every interactive visual, provide a static print representation.

Video already has print fallback; preserve it.

## Performance

- no heavy charting dependency;
- prefer SVG/CSS;
- no canvas;
- lazy media remains lazy;
- avoid client state unless the visual genuinely needs interaction.

## Cover integration

Do not generate or hard-code fake cover art.

Use the collection direction defined in:
`mypets-data/docs/COVER_ART_DIRECTION_V1.md`

If cover image assets are provided later:
- wire them through the existing guide image field/media registry;
- preserve the round MyPets seal;
- do not place price permanently inside the cover image.

## Acceptance criteria

1. all 13 guides build;
2. no payment/access regressions;
3. original visuals no longer look like generic placeholders where enough canonical data exists;
4. all visual families have a consistent MyPets language;
5. no invented facts;
6. print/PDF remains legible;
7. mobile 360px has no horizontal overflow;
8. `bun run lint`, `bun run typecheck`, `bun run build` pass.

## Branch

Create:
`feat/library-bespoke-visuals-v1`

from:
`feat/library-rich-media-launch-pass`

Open a draft PR titled:
`feat: upgrade MyPets original guide visuals to premium SVG components`

Do not merge to main automatically.
