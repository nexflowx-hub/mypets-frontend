# MyPets Digital Library — Stable Launch v1

**Decision date:** 2026-09-25  
**Goal:** freeze a launchable commercial/editorial scope instead of continuing indefinite incremental expansion.

## Scope freeze for v1.0

Launch v1.0 contains:
- 13 PT-BR guides;
- ~64k words in the canonical content repo;
- Atlas MyPets with 64 breed profiles;
- public library catalog;
- public sample/preview pages;
- premium web reader;
- print / Save as PDF;
- section progress stored locally;
- campaign funnel with 1, 3, 5 and 13-guide participation options;
- R$ 12,90 per guide / 1 confirmed guide unit = 1 kg campaign commitment;
- immediate post-payment access without mandatory account creation;
- round MyPets brand seal on library/campaign cover cards;
- backward compatibility with the original five reward keys.

Not a launch blocker:
- all 103 rich-media components rendered;
- cloud-synced reading progress;
- FacePets conversational avatar;
- account-linked library across devices;
- native mobile app;
- subscription product.

Those become v1.1+ after the campaign is live.

## Launch access model

### Default: low-friction authenticated link

Do **not** force account creation before payment.

Flow:
1. visitor selects guide(s);
2. checkout sends canonical reward keys to backend;
3. backend only considers the entitlement valid after payment status is SUCCEEDED;
4. success CTA receives a payment receipt UUID;
5. /ebooks/acesso validates that receipt server-side;
6. the receipt is moved into an HttpOnly, Secure, SameSite=Lax cookie;
7. browser is redirected to a clean /ebooks/colecao URL;
8. every premium reader request revalidates the receipt against the MyPets API and checks the guide reward key.

Security properties:
- receipt disappears from the normal reader URL;
- receipt is not included in WhatsApp support copy;
- premium pages are noindex;
- premium pages use no-referrer;
- payment status and cause id remain authoritative server-side;
- old ?receipt= links remain compatible and are upgraded through the bootstrap route.

This is a **bearer-capability access link**, not a public URL.

## Why no mandatory login at checkout

A forced sign-up between campaign intent and Pix adds avoidable friction.

Launch principle:
**pay first → read immediately → optionally create/link an account later.**

Account login remains useful for:
- cross-device recovery;
- cloud progress;
- consolidated purchases;
- future membership;
- FacePets personalization.

It is not necessary to deliver the paid guide on day one.

## Account-linked access — v1.1

Recommended next backend contract:

### GET /v1/library/entitlements
Authentication: Supabase bearer token.

Server requirements:
- verified/confirmed account email;
- match SUCCEEDED EBOOK_RACAO payment intents by normalized donor email and/or explicit user_id;
- return canonical reward keys;
- never accept entitlement claims based only on client-provided guide names.

### POST /v1/library/claim
Authentication: Supabase bearer token.

Body:
- payment receipt id.

Rules:
- receipt must be SUCCEEDED;
- correct EBOOK_RACAO cause;
- account email must match donor email unless an explicit secure transfer workflow exists;
- bind payment user_id if appropriate;
- idempotent.

Frontend then provides:
**“Guardar esta biblioteca na minha conta MyPets”**

Do not block the launch on this.

## Monetization v1

The campaign unit stays simple:
- 1 guide = R$ 12,90 = 1 kg;
- 3 guides = R$ 38,70 = 3 kg;
- 5 guides = R$ 64,50 = 5 kg;
- 13 guides = R$ 167,70 = 13 kg.

No fake discount is required. The value anchor comes from:
- depth of the library;
- practical plans/checklists;
- web reader + PDF;
- Atlas 64;
- visible impact unit.

Optional top-up remains separate:
- top-up adds financial support;
- it does **not** silently create extra guides or kg.

## Monetization after launch

Priorities after conversion data exists:

1. **Guide bundles by life moment** — Novo filhote, Vida urbana, Comportamento & treino, Família segura, Adoção responsável.
2. **Gift access** — buy a guide/library for another tutor with the same transparent impact accounting.
3. **Sponsored library access** — clinics, pet shops, employers or brands fund access codes; sponsorship remains clearly disclosed and editorial content stays independent.
4. **MyPets+** — future membership for expanded library, trackers, account sync and FacePets; define a separate explicit impact promise instead of pretending every unlimited read creates another kg.
5. **FacePets** — conversational companion / playful simulated pet for daily-life and educational interaction, explicitly outside veterinary diagnosis or emergency triage.

## Sales-page architecture

Above the fold:
- emotional promise;
- exact R$ 12,90 / guide / kg mechanism;
- real confirmed kg counter;
- primary CTA;
- secondary “Ver a biblioteca” CTA;
- trust line: Pix, immediate access, no subscription.

Middle:
- 13-guide catalog;
- free sample links;
- concrete library scale;
- impact mechanism;
- real campaign media;
- exact explanation of where money goes.

Checkout:
- one-question intent;
- recommended guide;
- 1 / 3 / 5 / 13 options;
- custom guide selection;
- optional top-up;
- required email;
- Pix.

Post-payment:
- explicit confirmed kg;
- open library;
- optional community;
- sharing;
- later: account claim.

## Conversion principles

Use clarity, visible product value, real impact data, free samples, precise pricing, low checkout friction and persistent access.

Do not use fake countdowns, invented scarcity, fabricated testimonials, fake donation totals, guilt/shame language or hidden add-ons.

## Release dependency

The frontend 13-guide checkout requires the backend entitlement whitelist to support all 13 canonical reward keys.

Backend branch: feat/ebook-library-13-entitlements  
Frontend branch: feat/digital-library-launch-stable-v1

Deploy order:
1. backend;
2. verify readiness / one controlled live payment;
3. frontend;
4. smoke test 1-guide and multi-guide entitlement;
5. launch traffic.

## Day-one smoke tests

1. /biblioteca lists 13 guides.
2. every public preview loads.
3. one R$12,90 checkout creates exactly one reward key.
4. post-payment access route strips receipt from URL.
5. entitled guide opens.
6. non-entitled guide redirects to collection.
7. old five-guide receipt aliases still work.
8. 3-guide checkout produces 3 kg metadata.
9. 13-guide checkout produces 13 canonical reward keys and R$167,70 minimum.
10. print/PDF works from the reader.
11. no production-only [!MEDIA] renderizar directives are visible.
12. mobile campaign CTA and Pix flow work.
