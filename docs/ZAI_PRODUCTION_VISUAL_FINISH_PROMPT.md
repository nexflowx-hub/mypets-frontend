# Z.AI EXECUTION PROMPT — MyPets Production Visual Finish

You are working on the production MyPets Digital Library. This is a **visual production task**, not a product redesign.

## Repository and branch

Repository:
`nexflowx-hub/mypets-frontend`

Base branch:
`main`

Canonical content:
`nexflowx-hub/mypets-data`

Pinned editorial release:
`6f4c6b0e60279ac81ef9c4273284e0566d474267`

Read first:
- `src/components/library/guide-cover.tsx`
- `src/components/library/library-media-slot.tsx`
- `src/components/library/library-markdown.tsx`
- `docs/zai-parallel-premium-visual-pass.md`
- in mypets-data: `docs/COVER_ART_DIRECTION_V1.md`
- in mypets-data: `media/media-placement-master.json`
- in mypets-data: `media/registry.yaml`

## NON-NEGOTIABLE — do not touch

Do not change:
- Pix or XPayments;
- campaign cause ids;
- R$12,90 unit pricing;
- 1 eBook = 1 kg accounting;
- backend API;
- payment status/reconciliation;
- receipt/cookie access security;
- entitlement keys;
- Supabase auth;
- Membro Fundador billing;
- growth lead API;
- medical/editorial copy.

No new dependency unless absolutely required.

## Mission A — final background art for 13 covers

The existing `GuideCover` component owns typography, exact titles, official MyPets seal and overlays.

Your task is to provide **13 distinct, topic-specific photographic/editorial background assets**. Do not put text or logo inside generated photography.

Create and commit:

`public/images/library/covers/01-cuidados-essenciais.webp`
`public/images/library/covers/02-primeiros-30-dias.webp`
`public/images/library/covers/03-treino-gentil.webp`
`public/images/library/covers/04-atlas-64.webp`
`public/images/library/covers/05-alimentacao-bem-estar.webp`
`public/images/library/covers/06-linguagem-corporal.webp`
`public/images/library/covers/07-passeios-sem-stress.webp`
`public/images/library/covers/08-ficar-sozinho.webp`
`public/images/library/covers/09-cao-em-apartamento.webp`
`public/images/library/covers/10-higiene-saude-oral.webp`
`public/images/library/covers/11-adotei-cao-adulto.webp`
`public/images/library/covers/12-caes-e-criancas.webp`
`public/images/library/covers/13-enriquecimento.webp`

### Visual requirements

- photorealistic;
- premium editorial photography, not cheap stock-photo look;
- Brazilian/Latin urban/domestic context where natural;
- natural animal anatomy;
- no distorted paws, teeth, eyes or leashes;
- no unsafe handling;
- no text in the photograph;
- no fake MyPets logo;
- enough negative space for overlay text;
- master crop approximately 2:3, but safe for 4:3 crop;
- minimum 1600px on the long side;
- optimized WebP;
- sensible file size.

### Scene briefs

01 Cuidados Essenciais:
calm adult dog with tutor in a safe home, warm morning light, subtle water/lead context. Competence + care.

02 Primeiros 30 Dias:
young puppy settling into a prepared home with bed/toy and adult hands nearby. New beginning + safety.

03 Treino Gentil:
dog making voluntary eye contact with tutor during reward-based training. Visible treat/reward, relaxed body. No aversive equipment.

04 Atlas 64:
editorial composition with visibly different dog sizes/types. Discovery and diversity. No “best breed” podium.

05 Alimentação & Bem-Estar:
healthy dog beside a tidy measured feeding/water setup in a real home. No unsupported ingredient-health claims.

06 Linguagem Corporal:
expressive dog with whole-body posture visible. Communication and observation, not aggression theatre.

07 Passeios sem Stress:
dog and tutor walking with a visibly loose lead in a calm outdoor route. Connection + exploration.

08 Ficar Sozinho:
relaxed dog resting independently in a safe home. Autonomy, not abandonment/sad-window imagery.

09 Cão em Apartamento:
content dog in a tasteful compact urban apartment with safe balcony/window context. Small space, full life.

10 Higiene & Saúde Oral:
cooperative grooming or tooth-care moment with relaxed dog and gentle human hands. No forced restraint.

11 Adotei um Cão Adulto:
adult adopted dog settling with new tutor/home. Trust + second beginning. No shelter bars/pity-first imagery.

12 Cães e Crianças:
dog and child sharing space with **visible adult supervision**, respectful distance, relaxed dog. Absolutely no face-hugging, child lying on dog or unsupervised interaction.

13 Enriquecimento:
engaged dog using nose/problem-solving with safe simple enrichment objects. Curiosity + play + mental work.

## Mission B — wire the 13 cover assets

Update the guide image mapping so all 13 covers use the new local WebP assets.

Preserve:
- `GuideCover` typography;
- official `MyPetsRoundSeal`;
- guide-specific kicker/icon/theme.

Do not bake price into cover images.

## Mission C — upgrade original MyPets visuals

The rich-media reader already renders exact canonical placements from:
`media/media-placement-master.json`.

There are **50 original-visual placement occurrences** in the canonical 103-placement pack. Upgrade the current accessible original-visual fallback in `LibraryMediaSlot` into reusable semantic SVG/HTML visuals for these families when canonical source data is sufficient:

- traffic-light
- timeline
- day-grid
- week-grid / weekly-grid
- process
- staircase
- matrix / comparison-matrix
- room-checklist
- floorplan
- trigger-map
- distance-diagram
- body-map
- warning-grid
- step-cards
- child-poster
- room-diagram
- category-wheel
- slider
- checklist-card
- decision-tree
- annotated-card
- annual-calendar
- tracker
- observation-board
- silhouette-guide
- annotated-label
- route-cards

### Critical editorial rule

Never invent:
- percentages;
- medical thresholds;
- compatibility scores;
- behavioural claims;
- steps not present in the canonical guide;
- nutritional numbers.

If the placement metadata does not contain enough structured information, render a polished summary visual using only the canonical alt/caption instead of fabricating detail.

**Completion rule:** all 50 original-visual placements must resolve to a deliberate family renderer or a deliberate polished summary renderer. No known production placement may fall back to the current generic icon + four bars placeholder.

## Mission D — quality assurance

Check:
- `/ajudar/ebooks`
- `/biblioteca`
- all 13 `/biblioteca/[slug]`
- entitled reader layout
- 360px mobile
- desktop
- print/PDF

Requirements:
- no horizontal overflow;
- cover text legible;
- dog faces not hidden by logo/title;
- official videos never autoplay;
- lazy-load media;
- Wikimedia attribution preserved;
- print fallbacks readable;
- no internal `[!MEDIA]` production instructions visible.

Run:
`bun run lint`
`bun run typecheck`
`bun run build`

## Git workflow

Create branch:
`feat/production-visual-finish`

Open draft PR:
`design: final MyPets cover backgrounds + bespoke editorial visuals`

Do **not** merge automatically.

Report in the PR:
- cover asset list and dimensions;
- file-size totals;
- visual families implemented;
- guide-by-guide screenshot/QA summary;
- any canonical placement that could not be safely rendered without invented information.
