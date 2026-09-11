# MyPets conversion ecosystems

## Objective

The visual layer can evolve aggressively without fragmenting the MyPets domain model.

The homepage and impact verticals are acquisition/conversion surfaces. The existing VPS API remains the canonical source for causes, stories, impact metrics, auth and payment state.

## Production invariants

- `/stories` supplies public editorial/case stories.
- `/causes` supplies active public causes.
- `/impact/public` supplies validated public impact metrics.
- No fictional cause or impact number is rendered as real proof.
- `Profile`, `Protector`, `Pet`, `Need` and `Cause` remain distinct domain concepts.
- A need describes what is required; a cause describes how the public is mobilised.
- Browser callbacks never establish payment finality. Server-side verified payment state remains authoritative.
- Existing auth, newsletter, report, sharing, sponsorship and checkout flows remain independent from the visual redesign.

## Impact verticals

Current acquisition ecosystems:

1. `together-we-feed` — food / immediate feeding support; first real external project.
2. `vet-help` — veterinary treatment.
3. `rescue` — rescue operations.
4. `shelter` — shelters, foster networks and recurring operational support.
5. `emergency` — disasters and time-critical emergencies.

Each vertical has two primary intents:

- `request`: person/project/NGO needs support.
- `support`: visitor wants to help.

Internal funnel links preserve:

- `utm_source=mypets`
- `utm_medium=internal`
- `utm_campaign=<vertical>`
- `utm_content=<surface>`
- `vertical=<vertical>`
- `intent=request|support`

This lets future analytics and lead creation bind a conversion to a vertical without creating separate user accounts or separate domain models.

## Traffic model

Paid and organic campaigns should land on the most specific page possible:

- General brand traffic -> `/`
- Cause discovery -> `/causas`
- TWF campaign -> `/projetos/together-we-feed` or directly to the dedicated TWF funnel
- Veterinary creative -> `/projetos/vet-help`
- Rescue creative -> `/projetos/rescue`
- Shelter/recurring-support creative -> `/projetos/shelter`
- Disaster/emergency creative -> `/projetos/emergency`

A campaign page should have one dominant conversion intent and one secondary escape path. Do not send all paid traffic to the homepage.

## Backend evolution (future, not required by this redesign)

When real causes begin to populate the verticals, add a provider-neutral classification to the canonical cause/need model (for example a controlled `vertical` or category relation) and expose it as an optional filter on `/v1/causes`.

Do not create independent payment tables per vertical. Causes should continue binding to payment stores through the existing provider-neutral payment boundary.

## Measurement

Recommended event taxonomy for a later analytics pass:

- `VIEW_VERTICAL`
- `CLICK_REQUEST_SUPPORT`
- `CLICK_SUPPORT_VERTICAL`
- `VIEW_CAUSE`
- `START_CHECKOUT`
- `CHECKOUT_RETURNED`
- `PAYMENT_VERIFIED`
- `SHARE_CREATED`
- `SHARE_CLICKED`
- `LEAD_CREATED`
- `SIGNUP_COMPLETED`

`PAYMENT_VERIFIED` must only be emitted after authoritative server-side verification.
