"use client";

import * as React from "react";
import { ExternalLink, Heart, Loader2, LockKeyhole, ShieldCheck, X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { apiUrl } from "@/lib/api";
import { getValidSession } from "@/lib/auth-client";
import { cn } from "@/lib/utils";

type CheckoutIntent = {
  id: string;
  sessionId: string | null;
  reference: string;
  amountCents: number;
  currency: "EUR" | "BRL";
  status: string;
  checkoutUrl: string | null;
  embedUrl: string | null;
};

type Props = {
  causeId: string;
  causeTitle: string;
  currency: "EUR" | "BRL";
  enabled: boolean;
};

function amountOptions(currency: "EUR" | "BRL") {
  return currency === "BRL" ? [2000, 5000, 10000, 20000] : [500, 1000, 2000, 5000];
}

function money(cents: number, currency: string) {
  return new Intl.NumberFormat(currency === "BRL" ? "pt-BR" : "pt-PT", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(cents / 100);
}

export function CauseCheckout({ causeId, causeTitle, currency, enabled }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const presets = React.useMemo(() => amountOptions(currency), [currency]);
  const [open, setOpen] = React.useState(false);
  const [amountCents, setAmountCents] = React.useState(presets[1]);
  const [customAmount, setCustomAmount] = React.useState("");
  const [donorName, setDonorName] = React.useState("");
  const [donorEmail, setDonorEmail] = React.useState("");
  const [busy, setBusy] = React.useState(false);
  const [intent, setIntent] = React.useState<CheckoutIntent | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [verifying, setVerifying] = React.useState(false);
  const [paid, setPaid] = React.useState(false);
  const idempotencyKey = React.useRef<string | null>(null);

  const effectiveAmount = customAmount.trim()
    ? Math.round((Number(customAmount.replace(",", ".")) || 0) * 100)
    : amountCents;

  React.useEffect(() => {
    if (!open) {
      setIntent(null);
      setError(null);
      setVerifying(false);
      setPaid(false);
      idempotencyKey.current = null;
    }
  }, [open]);

  const verifyPayment = React.useCallback(async (intentId: string) => {
    setVerifying(true);
    for (let attempt = 0; attempt < 18; attempt += 1) {
      try {
        const response = await fetch(apiUrl(`/payments/${intentId}`), { cache: "no-store" });
        if (response.ok) {
          const body = (await response.json()) as { data?: CheckoutIntent };
          const status = body.data?.status;
          if (status === "SUCCEEDED") {
            setPaid(true);
            setVerifying(false);
            router.refresh();
            return;
          }
          if (["FAILED", "CANCELLED", "EXPIRED"].includes(status ?? "")) {
            setError("O pagamento não foi concluído. Pode tentar novamente.");
            setVerifying(false);
            return;
          }
        }
      } catch {
        // Reconciliation is best effort while the provider finalises the transaction.
      }
      await new Promise((resolve) => window.setTimeout(resolve, 1800));
    }
    setVerifying(false);
    setError("O pagamento ainda está a ser confirmado. Pode fechar esta janela; a confirmação continuará no sistema.");
  }, [router]);

  React.useEffect(() => {
    function onMessage(event: MessageEvent) {
      if (event.origin !== "https://checkout.xpayments.digital") return;
      if (!event.data || event.data.type !== "XPAYMENTS_STATUS") return;
      if (event.data.status === "CLOSED" || event.data.status === "CANCELLED") {
        setOpen(false);
        return;
      }
      if (event.data.status === "SUCCESS" && intent?.id) {
        void verifyPayment(intent.id);
      }
    }
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [intent?.id, verifyPayment]);

  async function startCheckout() {
    if (!enabled || effectiveAmount < 100 || effectiveAmount > 5_000_000) return;
    setBusy(true);
    setError(null);
    try {
      const session = await getValidSession().catch(() => null);
      if (!idempotencyKey.current) idempotencyKey.current = crypto.randomUUID();
      const response = await fetch(apiUrl("/payments/checkout"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Idempotency-Key": idempotencyKey.current,
          ...(session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : {}),
        },
        body: JSON.stringify({
          causeId,
          amountCents: effectiveAmount,
          frequency: "ONE_TIME",
          donorName: donorName.trim() || null,
          donorEmail: donorEmail.trim() || null,
          source: searchParams.get("utm_source"),
          medium: searchParams.get("utm_medium"),
          campaign: searchParams.get("utm_campaign"),
          content: searchParams.get("utm_content"),
          refCode: searchParams.get("ref"),
        }),
      });
      const body = (await response.json().catch(() => ({}))) as { data?: CheckoutIntent; error?: { message?: string } };
      if (!response.ok || !body.data?.embedUrl) throw new Error(body.error?.message ?? "Não foi possível abrir o checkout seguro.");
      setIntent(body.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Não foi possível abrir o checkout seguro.");
    } finally {
      setBusy(false);
    }
  }

  if (!enabled) return null;

  return (
    <>
      <Button onClick={() => setOpen(true)} className="min-h-12 rounded-xl bg-white px-5 text-sm font-extrabold text-petrol hover:bg-white/90">
        <Heart className="mr-2 h-4 w-4 fill-coral text-coral" /> Apoiar agora
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className={cn("overflow-hidden border-border bg-white p-0", intent ? "h-[92svh] max-w-2xl" : "max-w-md")}>
          {!intent ? (
            <div>
              <div className="bg-petrol px-6 py-6 text-white">
                <DialogHeader className="text-left">
                  <DialogTitle className="text-xl font-extrabold text-white">Apoiar {causeTitle}</DialogTitle>
                  <DialogDescription className="text-sm text-white/65">Escolha o valor. O pagamento é processado no checkout seguro XPAYMENTS.</DialogDescription>
                </DialogHeader>
              </div>
              <div className="space-y-5 p-6">
                <div>
                  <p className="text-xs font-extrabold uppercase tracking-wide text-muted-foreground">Valor do apoio</p>
                  <div className="mt-3 grid grid-cols-4 gap-2">
                    {presets.map((cents) => (
                      <button key={cents} type="button" onClick={() => { setAmountCents(cents); setCustomAmount(""); }} className={cn("rounded-xl border px-2 py-3 text-sm font-extrabold transition", !customAmount && amountCents === cents ? "border-coral bg-coral/5 text-coral" : "border-border text-petrol hover:border-coral/40")}>
                        {money(cents, currency)}
                      </button>
                    ))}
                  </div>
                  <Input className="mt-3" inputMode="decimal" value={customAmount} onChange={(event) => setCustomAmount(event.target.value)} placeholder={`Outro valor (${currency})`} />
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <Input value={donorName} onChange={(event) => setDonorName(event.target.value)} placeholder="Nome (opcional)" maxLength={120} />
                  <Input type="email" value={donorEmail} onChange={(event) => setDonorEmail(event.target.value)} placeholder="Email (opcional)" maxLength={254} />
                </div>
                {error && <p className="rounded-xl bg-destructive/5 px-4 py-3 text-sm text-destructive">{error}</p>}
                <Button onClick={startCheckout} disabled={busy || effectiveAmount < 100} className="h-12 w-full rounded-xl bg-coral font-extrabold text-white hover:bg-coral-dark">
                  {busy ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <LockKeyhole className="mr-2 h-4 w-4" />}
                  Continuar para pagamento seguro
                </Button>
                <div className="flex items-start gap-2 text-[11px] leading-relaxed text-muted-foreground"><ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />O MyPets não recebe nem armazena os dados do seu cartão. A cobrança é apresentada e processada pela XPAYMENTS.</div>
              </div>
            </div>
          ) : paid ? (
            <div className="flex h-full flex-col items-center justify-center px-8 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50"><Heart className="h-8 w-8 fill-emerald-600 text-emerald-600" /></div>
              <h2 className="mt-5 text-2xl font-extrabold text-petrol">Apoio confirmado. Obrigado!</h2>
              <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">A XPAYMENTS confirmou o pagamento e o progresso da causa foi atualizado.</p>
              <Button onClick={() => setOpen(false)} className="mt-6 bg-petrol text-white hover:bg-petrol-light">Voltar à causa</Button>
            </div>
          ) : (
            <div className="flex h-full flex-col bg-cream">
              <div className="flex items-center justify-between border-b border-border bg-white px-4 py-3">
                <div><p className="text-sm font-extrabold text-petrol">Checkout seguro XPAYMENTS</p><p className="text-[11px] text-muted-foreground">{money(intent.amountCents, intent.currency)} · {causeTitle}</p></div>
                <div className="flex items-center gap-2">
                  {intent.checkoutUrl && <a href={intent.checkoutUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs font-bold text-coral hover:underline">Abrir separado <ExternalLink className="h-3.5 w-3.5" /></a>}
                  <button type="button" onClick={() => setOpen(false)} aria-label="Fechar checkout" className="rounded-lg p-2 text-muted-foreground hover:bg-sand"><X className="h-4 w-4" /></button>
                </div>
              </div>
              <div className="relative min-h-0 flex-1">
                <iframe src={intent.embedUrl ?? undefined} title={`Pagamento seguro para ${causeTitle}`} className="h-full w-full border-0" allow="payment *" referrerPolicy="strict-origin-when-cross-origin" />
                {verifying && <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/95 px-6 text-center"><Loader2 className="h-8 w-8 animate-spin text-coral" /><p className="mt-4 font-extrabold text-petrol">A confirmar o pagamento…</p><p className="mt-1 text-sm text-muted-foreground">A confirmação final é feita entre o MyPets e a XPAYMENTS.</p></div>}
              </div>
              {error && <div className="border-t border-border bg-amber-50 px-4 py-3 text-xs text-amber-900">{error}</div>}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
