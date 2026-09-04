# Localization

## Locales
| Locale | Market | Currency | Notes |
| --- | --- | --- | --- |
| `pt-PT` | Portugal | EUR | default (matches mockup) |
| `pt-BR` | Brazil | BRL | **separate** localization, not a variant of pt-PT |
| `en` | International | EUR (configurable per country) | |

Ready for: `es-ES`, `es-419`, `fr-FR`, `de-DE`, `it-IT` (dictionaries are additive).

## Rules
- **All** interface copy lives in `src/lib/i18n/dictionaries.ts` — zero hardcoded strings in
  components (`useLocale().dict`).
- Natural country terminology, e.g.:
  | en | pt-PT | pt-BR |
  | --- | --- | --- |
  | Sterilization | Esterilizações | **Castrações** |
  | Donation | Donativo | **Doação** |
  | Mobile phone | Telemóvel | Celular |
- Currency via `Intl.NumberFormat(locale, { style: 'currency' })` on integer cents; stories
  keep their **native** currency (Ana €, Carlos R$) regardless of UI locale — exactly like
  the mockup.
- Hero copy per locale follows the master prompt §13–15 (pt-PT/pt-BR/EN verified variants).
- Locale switching: header dropdown + footer country pills; persisted in `localStorage`;
  `<html lang>` kept in sync; hydration-safe via `useSyncExternalStore`.

## Routing (production)
`mypets.lat/pt-BR/…`, `mypets.lat/pt-PT/…`, `mypets.lat/en/…` (same for `facepets.org`) via
next-intl segment routing. Detection may **suggest** a locale but never aggressively
redirects; a visible selector is always present. Hreflang + canonical pairs ship in the
metadata layer (`src/app/layout.tsx`).

> The sandbox preview exposes a single route, so locale switching is client-side here;
> the dictionary layer is routing-ready.
