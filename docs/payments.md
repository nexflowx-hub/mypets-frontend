# Payments

## Principle
Do **not** bind domain logic to Stripe (or any single provider). All money flows through a
`PaymentProvider` interface:

```ts
interface PaymentProvider {
  createPaymentIntent(input): Promise<Intent>
  confirmPayment(intentId): Promise<Result>      // server-side only
  createRecurringPlan(input): Promise<Plan>
  cancelRecurringPlan(planId): Promise<void>
  refundPayment(transactionId): Promise<void>
  handleWebhook(payload, signature): Promise<Event>
  getPaymentStatus(intentId): Promise<Status>
}
```

- `mock` provider — implemented, deterministic, always approves after a verification delay.
  Powers the end-to-end demo donation flow (intent → confirm → receipt).
- `stripe` / country-specific adapters — enabled later behind `payments_live` feature flag.
- Country payment methods are configurable: PT → Card, **MB WAY**, **Multibanco**;
  BR → Card, **Pix**, **Boleto**. Amount presets: `€5/€10/€25/€50` · `R$15/R$30/R$60/R$100` + *Other*.

## Security invariants (master prompt §48)
1. The browser can **never** set `payment_status = PAID` — only
   `POST /api/v1/contributions/:id/confirm` after provider verification.
2. Intents are idempotent (`idempotencyKey`, unique) — replays never double-charge.
3. Webhooks carry provider signatures; every event lands in `payment_events`.
4. All transitions auditable (`Contribution.status`, timestamps, provider refs).
5. Successful story-targeted contributions increment story progress inside a DB transaction.

## Payouts
Architecture-ready (`payouts`, `financial_ledger_entries`, `reconciliations`) but **disabled**:
`payouts_enabled = false`. No funds are transferred to protectors in demo mode, and no fake
legal/financial claims are ever displayed.

## Recurring (Guardians)
`frequency = MONTHLY` creates a recurring plan on the provider (mock in demo). The
MyPets Guardians program maps to `guardian_profiles` + `recurring_contributions`.
