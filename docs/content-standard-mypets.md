# MyPets Content Standard v1

## Objective

Every MyPets guide must feel like a useful digital product, not a thin reward PDF.

The content should be:
- practical
- easy to scan on mobile
- evidence-informed
- original in wording and structure
- explicit about limits
- useful without pretending to replace a professional

## Required metadata

Each guide/release should define at minimum:

```yaml
id: guide-001
slug: cuidados-essenciais
locale: pt-BR
title: Cuidados Essenciais com o Seu Cão
subtitle: ...
version: 2.0.0
status: draft
access: entitled
audience:
  - tutor-iniciante
topics:
  - rotina
  - seguranca
  - higiene
reading_minutes: 45
reviewed_at: null
medical_risk: low
ai_use: restricted-general-education
child_safe: true
```

## Chapter pattern

A chapter should generally contain:

1. **Why this matters**
2. **What to observe**
3. **What to do**
4. **Common mistakes**
5. **When to ask for professional help**
6. **Practical action / checklist**
7. **References where the topic warrants them**

Not every chapter needs every block, but the guide should not become a sequence of short generic paragraphs.

## Editorial components

Reusable semantic blocks:

- `<KeyPoint>`
- `<DoToday>`
- `<Checklist>`
- `<CommonMistake>`
- `<Warning>`
- `<VetBoundary>`
- `<Example>`
- `<Table>`
- `<ProgressExercise>`
- `<SourceNote>`
- `<ImpactCTA>`

The web renderer and PDF renderer should style the same semantic components differently without changing the prose.

## Research standard

For health, nutrition, vaccination and behavior topics, prefer:
- veterinary associations
- professional guidelines
- recognized welfare organizations
- veterinary manuals
- primary or consensus sources when relevant

For breed information:
- official breed standards
- reputable breed/kennel organizations
- welfare/health context
- explicit acknowledgement of individual variation

Do not treat a single commercial blog as authority for a health claim.

## Source ledger

Each chapter with factual guidance should keep a compact ledger:

```yaml
- id: source-001
  publisher: ...
  title: ...
  url: ...
  accessed: YYYY-MM-DD
  source_type: guideline
  applies_to:
    - section-id
  reuse: facts-only
  notes: paraphrase; do not reproduce protected tables/graphics
```

"Free to read" is not the same as "free to copy." Facts may be researched and rewritten; protected expression, tables and illustrations must not be reproduced without an appropriate license.

## Medical / veterinary boundary

MyPets content may:
- explain routine care
- help organize observations
- explain general preventive concepts
- describe red flags
- encourage timely professional help

MyPets content must not:
- diagnose an animal
- prescribe medication or dosage
- provide a personalized vaccination schedule
- prescribe therapeutic diets
- replace urgent veterinary evaluation

Emergency/red-flag sections should be concise and action-oriented.

## Training and behavior

Default methodology:
- humane
- reward-based
- gradual progression
- environmental management
- avoidance of fear, pain or intimidation as training tools

Behavioral claims should distinguish normal variation from situations that merit individualized professional assessment.

## Tone

Use clear Brazilian Portuguese for the primary release:
- warm but not infantilized
- practical rather than academic
- explain jargon on first use
- avoid absolute promises
- avoid guilt-based language
- never shame a tutor for mistakes

## Depth targets

Standard guide:
- about 5,000–7,000 useful words

Flagship guide:
- about 7,000–10,000+ useful words

Depth is measured by usefulness, not by padding or page count.

A strong guide should include multiple practical assets such as:
- weekly plan
- 30-day plan
- tracker
- checklist
- comparison table
- printable worksheet
- questions for a professional

## Web-first writing

Paragraphs should remain relatively short.
Use descriptive headings.
Avoid giant blocks of prose.
Tables must remain understandable on mobile.
Images/illustrations need alt text.
Interactive elements must have a non-interactive PDF equivalent.

## Preview strategy

A guide can expose publicly:
- cover
- description
- table of contents
- selected introduction
- one useful sample section

The preview should demonstrate quality without giving away the entire paid/entitled product.

## SEO reuse

Selected chapters may have public derivatives for search discovery, but the public article and the premium chapter should not be maintained as independent copies.

Prefer generation/adaptation from canonical content with:
- canonical URLs
- clear internal linking
- CTA to the full guide
- no misleading medical search claims

## AI readiness and FacePets

Every chapter/section should support future retrieval metadata.

Suggested flags:
- `ai_use: allowed | restricted | blocked`
- `medical_risk: none | low | medium | high`
- `child_safe: true | false`
- `persona_use: companion | educational | none`

Future conversational systems may answer from approved low-risk material while clearly escalating health concerns to professional care.

The playful/companion FacePets layer must never imply that a simulated pet/avatar is a veterinarian or a substitute for real-world care.

## Release QA

Before publish:
- factual review completed
- references checked
- copyright/reuse check completed
- language revision completed
- mobile rendering checked
- PDF rendering checked
- no broken tables
- no orphan/blank pages
- accessibility basics checked
- paywall/entitlement tested
- version and changelog recorded
