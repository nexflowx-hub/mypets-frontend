"use client";

import * as React from "react";
import {
  Check,
  Copy,
  CreditCard,
  ExternalLink,
  Heart,
  Landmark,
  Loader2,
  LockKeyhole,
  QrCode,
  ShieldCheck,
  Smartphone,
  X,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { apiUrl } from "@/lib/api";
import { getValidSession } from "@/lib/auth-client";
import { cn } from "@/lib/utils";

type NativePaymentMethod = "pix" | "mb_way" | "multibanco" | "bizum";
type PaymentChoice = NativePaymentMethod | "checkout";
type NativeAction = Record<string, unknown>;

type CheckoutIntent = {
  id: string;
  sessionId: string | null;
  reference: string;
  amountCents: number;
  currency: "EUR" | "BRL";
  paymentMethod?: string | null;
  status: string;
  action?: NativeAction | null;
  checkoutUrl?: string | null;
  embedUrl?: string | null;
};

type Props = {
  causeId: string;
  causeTitle: string;
  currency: "EUR" | "BRL";
  enabled: boolean;
};

const methodLabel: Record<PaymentChoice, string> = {
  pix: "PIX",
  mb_way: "MB WAY",
  multibanco: "Multibanco",
  bizum: "Bizum",
  checkout: "Cartão e outros",
};

function amountOptions(currency: "EUR" | "BRL") {
  return currency === "BRL" ? [2000, 5000, 10000, 20000] : [500, 1000, 2000, 5000];
}

function money(cents: number, currency: string) {
  const hasCents = Math.abs(cents) % 100 !== 0;
  return new Intl.NumberFormat(currency === "BRL" ? "pt-BR" : "pt-PT", {
    style: "currency",
    currency,
    minimumFractionDigits: hasCents ? 2 : 0,
    maximumFractionDigits: 2,
  }).format(cents / 100);
}

function validEmail(value: string) {
  if (!value.trim()) return true;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

function actionValue(action: NativeAction | null | undefined, ...keys: string[]) {
  for (const key of keys) {
    const value = action?.[key];
    if (typeof value === "string" && value.trim()) return value.trim();
    if (typeof value === "number") return String(value);
  }
  return null;
}

function pixQrSource(action: NativeAction | null | undefined) {
  const base64 = actionValue(action, "qrCodeBase64", "qr_code_base64");
  if (base64) return base64.startsWith("data:") ? base64 : `data:image/png;base64,${base64}`;
  return actionValue(action, "qrCodeUrl", "qr_code_url", "qrCode", "qr_code");
}

function preferredNativeMethods(currency: "EUR" | "BRL", country: string | null): NativePaymentMethod[] {
  // BRL support is PIX-first by design. XPAYMENTS Native S2S returns the action
  // and MyPets renders the QR/copy-paste instructions itself.
  if (currency === "BRL") return ["pix"];
  if (currency === "EUR" && country === "PT") return ["mb_way", "multibanco"];
  if (currency === "EUR" && country === "ES") return ["bizum"];
  return [];
}

function methodIcon(method: PaymentChoice) {
  if (method === "pix") return <QrCode className="h-4 w-4" />;
  if (method === "mb_way" || method === "bizum") return <Smartphone className="h-4 w-4" />;
  if (method === "multibanco") return <Landmark className="h-4 w-4" />;
  return <CreditCard className="h-4 w-4" />;
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
  const [donorPhone, setDonorPhone] = React.useState("");
  const [donorDocument, setDonorDocument] = React.useState("");
  const [marketCountry, setMarketCountry] = React.useState<string | null>(null);
  const [choice, setChoice] = React.useState<PaymentChoice>("checkout");
  const selectionTouched = React.useRef(false);
  const [busy, setBusy] = React.useState(false);
  const [intent, setIntent] = React.useState<CheckoutIntent | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [verifying, setVerifying] = React.useState(false);
  const [paid, setPaid] = React.useState(false);
  const [iframeReady, setIframeReady] = React.useState(false);
  const [copiedAction, setCopiedAction] = React.useState(false);
  const idempotencyKeys = React.useRef<Record<string, string>>({});

  const effectiveAmount = customAmount.trim()
    ? Math.round((Number(customAmount.replace(",", ".")) || 0) * 100)
    : amountCents;
  const nativeMethods = React.useMemo(() => preferredNativeMethods(currency, marketCountry), [currency, marketCountry]);

  React.useEffect(() => {
    let cancelled = false;
    void fetch("/api/market", { cache: "no-store" })
      .then((response) => response.ok ? response.json() : null)
      .then((body: { data?: { country?: string | null } } | null) => {
        if (cancelled) return;
        const country = body?.data?.country?.toUpperCase() ?? null;
        setMarketCountry(country);
        const direct = preferredNativeMethods(currency, country);
        if (!selectionTouched.current && direct[0]) setChoice(direct[0]);
      })
      .catch(() => undefined);
    return () => { cancelled = true; };
  }, [currency]);

  const paymentKey = React.useCallback((method: PaymentChoice) => {
    if (!idempotencyKeys.current[method]) idempotencyKeys.current[method] = crypto.randomUUID();
    return idempotencyKeys.current[method]!;
  }, []);

  const resetCheckout = React.useCallback(() => {
    setIntent(null);
    setError(null);
    setVerifying(false);
    setPaid(false);
    setIframeReady(false);
    setCopiedAction(false);
    idempotencyKeys.current = {};
  }, []);

  React.useEffect(() => {
    setIframeReady(false);
  }, [intent?.sessionId]);

  const applyStatus = React.useCallback((status: string | undefined) => {
    if (status === "SUCCEEDED") {
      setPaid(true);
      setVerifying(false);
      setError(null);
      router.refresh();
      return true;
    }
    if (["FAILED", "CANCELLED", "EXPIRED"].includes(status ?? "")) {
      setVerifying(false);
      setError("O pagamento não foi concluído. Pode tentar novamente com segurança.");
      return true;
    }
    return false;
  }, [router]);

  const fetchPaymentStatus = React.useCallback(async (intentId: string) => {
    const response = await fetch(apiUrl(`/payments/${intentId}`), { cache: "no-store" });
    if (!response.ok) return undefined;
    const body = (await response.json()) as { data?: CheckoutIntent };
    return body.data?.status;
  }, []);

  const verifyPayment = React.useCallback(async (intentId: string) => {
    setVerifying(true);
    for (let attempt = 0; attempt < 18; attempt += 1) {
      try {
        const status = await fetchPaymentStatus(intentId);
        if (applyStatus(status)) return;
      } catch {
        // Reconciliation is best effort while XPayments finalises the transaction.
      }
      await new Promise((resolve) => window.setTimeout(resolve, 1800));
    }
    setVerifying(false);
    setError("O pagamento ainda está a ser confirmado. Pode fechar esta janela; a confirmação continuará no sistema.");
  }, [applyStatus, fetchPaymentStatus]);

  React.useEffect(() => {
    const intentId = intent?.id;
    if (!intentId || paid || verifying) return;
    let cancelled = false;
    async function reconcileSilently() {
      try {
        const status = await fetchPaymentStatus(intentId!);
        if (!cancelled) applyStatus(status);
      } catch {
        // Signed webhook / server-side reconciliation remains the source of truth.
      }
    }
    void reconcileSilently();
    const timer = window.setInterval(() => void reconcileSilently(), 5000);
    return () => {
      cancelled = true;
      window.clearInterval(timer);
    };
  }, [applyStatus, fetchPaymentStatus, intent?.id, paid, verifying]);

  React.useEffect(() => {
    function onMessage(event: MessageEvent) {
      if (event.origin !== "https://checkout.xpayments.digital") return;
      if (!event.data || event.data.type !== "XPAYMENTS_STATUS") return;
      if (event.data.status === "CLOSED") {
        setOpen(false);
        return;
      }
      if (event.data.status === "CANCELLED") {
        setError("O checkout foi cancelado. Pode retomar ou escolher outro meio de pagamento.");
        return;
      }
      if (event.data.status === "SUCCESS" && intent?.id) void verifyPayment(intent.id);
    }
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [intent?.id, verifyPayment]);

  function tracking() {
    return {
      source: searchParams.get("utm_source"),
      medium: searchParams.get("utm_medium"),
      campaign: searchParams.get("utm_campaign"),
      content: searchParams.get("utm_content"),
      refCode: searchParams.get("ref"),
    };
  }

  function validateCommon(requireName = false, requireEmail = false) {
    if (effectiveAmount < 100 || effectiveAmount > 5_000_000) {
      setError("Escolha um valor válido para continuar.");
      return false;
    }
    if (!validEmail(donorEmail)) {
      setError("Introduza um email válido ou deixe o campo vazio.");
      return false;
    }
    if (requireName && !donorName.trim()) {
      setError("Indique o nome do pagador para este meio de pagamento.");
      return false;
    }
    if (requireEmail && !donorEmail.trim()) {
      setError("Indique um email válido para este meio de pagamento.");
      return false;
    }
    return true;
  }

  async function requestPayment(path: string, method: PaymentChoice, payload: Record<string, unknown>) {
    const session = await getValidSession().catch(() => null);
    const response = await fetch(apiUrl(path), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Idempotency-Key": paymentKey(method),
        ...(session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : {}),
      },
      body: JSON.stringify(payload),
    });
    const body = (await response.json().catch(() => ({}))) as { data?: CheckoutIntent; error?: { message?: string } };
    if (!response.ok || !body.data) throw new Error(body.error?.message ?? "Não foi possível criar o pagamento.");
    return body.data;
  }

  async function startCheckout() {
    if (!enabled || !validateCommon()) return;
    setBusy(true);
    setError(null);
    try {
      const data = await requestPayment("/payments/checkout", "checkout", {
        causeId,
        amountCents: effectiveAmount,
        frequency: "ONE_TIME",
        donorName: donorName.trim() || null,
        donorEmail: donorEmail.trim() || null,
        ...tracking(),
      });
      if (!data.embedUrl) throw new Error("Não foi possível abrir o checkout seguro.");
      setIntent(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Não foi possível abrir o checkout seguro.");
    } finally {
      setBusy(false);
    }
  }

  async function startNative(method: NativePaymentMethod) {
    const requiresEmail = method !== "pix";
    if (!enabled || !validateCommon(true, requiresEmail)) return;
    if (method === "pix" && !/^\D*\d(?:\D*\d){10}(?:\D*\d{3})?\D*$/.test(donorDocument)) {
      setError("Informe um CPF ou CNPJ válido do pagador para gerar o PIX.");
      return;
    }
    if ((method === "mb_way" || method === "bizum") && !donorPhone.trim()) {
      setError(`Informe o número de telefone associado ao ${methodLabel[method]}.`);
      return;
    }

    setBusy(true);
    setError(null);
    try {
      const data = await requestPayment("/payments/native", method, {
        causeId,
        amountCents: effectiveAmount,
        method,
        donorName: donorName.trim() || null,
        donorEmail: donorEmail.trim() || null,
        donorPhone: donorPhone.trim() || null,
        donorDocument: donorDocument.trim() || null,
        ...tracking(),
      });
      setIntent(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : `Não foi possível iniciar ${methodLabel[method]}.`);
    } finally {
      setBusy(false);
    }
  }

  async function startSelected() {
    if (choice === "checkout") return startCheckout();
    return startNative(choice);
  }

  if (!enabled) return null;

  const triggerLabel = paid ? "Apoio confirmado" : intent ? "Retomar apoio" : "Apoiar agora";
  const hasEmbeddedCheckout = Boolean(intent?.embedUrl);
  const nativeMethod = intent?.paymentMethod && intent.paymentMethod !== "checkout" ? intent.paymentMethod as NativePaymentMethod : null;

  return (
    <>
      <Button onClick={() => setOpen(true)} className="min-h-12 rounded-xl bg-white px-5 text-sm font-extrabold text-petrol hover:bg-white/90">
        <Heart className="mr-2 h-4 w-4 fill-coral text-coral" /> {triggerLabel}
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          className={cn(
            "overflow-hidden border-border bg-white p-0",
            hasEmbeddedCheckout
              ? "h-[100dvh] max-h-none w-screen max-w-none rounded-none sm:h-[92svh] sm:max-w-2xl sm:rounded-2xl"
              : "max-w-md",
          )}
        >
          {!intent ? (
            <div>
              <div className="bg-petrol px-6 py-6 text-white">
                <DialogHeader className="text-left">
                  <DialogTitle className="text-xl font-extrabold text-white">Apoiar {causeTitle}</DialogTitle>
                  <DialogDescription className="text-sm text-white/65">
                    Escolha o valor e o meio de pagamento. O MyPets mantém a origem da campanha para medir o impacto do funil.
                  </DialogDescription>
                </DialogHeader>
              </div>

              <div className="max-h-[78svh] space-y-5 overflow-y-auto p-6">
                <div>
                  <p className="text-xs font-extrabold uppercase tracking-wide text-muted-foreground">Valor do apoio</p>
                  <div className="mt-3 grid grid-cols-4 gap-2">
                    {presets.map((cents) => (
                      <button
                        key={cents}
                        type="button"
                        onClick={() => { setAmountCents(cents); setCustomAmount(""); }}
                        className={cn(
                          "rounded-xl border px-2 py-3 text-sm font-extrabold transition",
                          !customAmount && amountCents === cents ? "border-coral bg-coral/5 text-coral" : "border-border text-petrol hover:border-coral/40",
                        )}
                      >
                        {money(cents, currency)}
                      </button>
                    ))}
                  </div>
                  <Input className="mt-3" inputMode="decimal" value={customAmount} onChange={(event) => setCustomAmount(event.target.value)} placeholder={`Outro valor (${currency})`} aria-label={`Outro valor em ${currency}`} />
                </div>

                <div>
                  <p className="text-xs font-extrabold uppercase tracking-wide text-muted-foreground">Como quer apoiar</p>
                  <div className="mt-3 grid gap-2 sm:grid-cols-2">
                    {[...nativeMethods, "checkout" as const].map((method) => (
                      <button
                        key={method}
                        type="button"
                        onClick={() => { selectionTouched.current = true; setChoice(method); setError(null); }}
                        className={cn(
                          "flex min-h-12 items-center gap-2 rounded-xl border px-4 text-left text-sm font-extrabold transition",
                          choice === method ? "border-coral bg-coral/5 text-coral" : "border-border text-petrol hover:border-coral/40",
                        )}
                      >
                        {methodIcon(method)} {methodLabel[method]}
                      </button>
                    ))}
                  </div>
                  {currency === "BRL" ? (
                    <p className="mt-2 text-[11px] text-muted-foreground">PIX é iniciado por integração S2S com a XPAYMENTS; o QR Code e o Copia e Cola são exibidos aqui no MyPets.</p>
                  ) : marketCountry ? (
                    <p className="mt-2 text-[11px] text-muted-foreground">Meios priorizados para {marketCountry}; a disponibilidade final é validada pela Store XPAYMENTS.</p>
                  ) : null}
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <Input value={donorName} onChange={(event) => setDonorName(event.target.value)} placeholder={choice === "checkout" ? "Nome (opcional)" : "Nome do pagador"} maxLength={120} />
                  <Input type="email" value={donorEmail} onChange={(event) => setDonorEmail(event.target.value)} placeholder={choice === "pix" || choice === "checkout" ? "Email (opcional)" : "Email"} maxLength={254} />
                </div>

                {(choice === "mb_way" || choice === "bizum") && (
                  <Input value={donorPhone} onChange={(event) => setDonorPhone(event.target.value)} inputMode="tel" placeholder={choice === "mb_way" ? "Telemóvel +351" : "Móvel +34"} maxLength={40} />
                )}
                {choice === "pix" && (
                  <Input value={donorDocument} onChange={(event) => setDonorDocument(event.target.value)} inputMode="numeric" placeholder="CPF ou CNPJ do pagador" maxLength={18} />
                )}

                {error && <p className="rounded-xl bg-destructive/5 px-4 py-3 text-sm text-destructive">{error}</p>}

                <Button onClick={() => void startSelected()} disabled={busy || effectiveAmount < 100 || effectiveAmount > 5_000_000} className="h-12 w-full rounded-xl bg-coral font-extrabold text-white hover:bg-coral-dark">
                  {busy ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <LockKeyhole className="mr-2 h-4 w-4" />}
                  {methodLabel[choice]} · {money(effectiveAmount, currency)}
                </Button>

                <div className="flex items-start gap-2 rounded-xl bg-sand/60 px-3 py-3 text-[11px] leading-relaxed text-muted-foreground">
                  <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                  <span>Pagamento orquestrado pela XPAYMENTS. Métodos locais usam API S2S; cartão e wallets permanecem em superfície segura do provedor. Criar um pagamento nunca é tratado como confirmação.</span>
                </div>
              </div>
            </div>
          ) : paid ? (
            <div className="flex min-h-[420px] flex-col items-center justify-center px-8 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50"><Heart className="h-8 w-8 fill-emerald-600 text-emerald-600" /></div>
              <h2 className="mt-5 text-2xl font-extrabold text-petrol">Apoio confirmado. Obrigado!</h2>
              <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">A XPAYMENTS confirmou o pagamento e o progresso da causa foi atualizado.</p>
              <Button onClick={() => { setOpen(false); resetCheckout(); }} className="mt-6 bg-petrol text-white hover:bg-petrol-light">Voltar à causa</Button>
            </div>
          ) : hasEmbeddedCheckout ? (
            <div className="flex h-full flex-col bg-cream">
              <div className="flex items-center justify-between border-b border-border bg-white px-4 py-3">
                <div><p className="text-sm font-extrabold text-petrol">Checkout seguro XPAYMENTS</p><p className="text-[11px] text-muted-foreground">{money(intent.amountCents, intent.currency)} · {causeTitle}</p></div>
                <div className="flex items-center gap-2">
                  {intent.checkoutUrl && <a href={intent.checkoutUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs font-bold text-coral hover:underline">Abrir separado <ExternalLink className="h-3.5 w-3.5" /></a>}
                  <button type="button" onClick={() => setOpen(false)} aria-label="Fechar checkout e retomar depois" className="rounded-lg p-2 text-muted-foreground hover:bg-sand"><X className="h-4 w-4" /></button>
                </div>
              </div>
              <div className="relative min-h-0 flex-1">
                <iframe src={intent.embedUrl ?? undefined} title={`Pagamento seguro para ${causeTitle}`} className="h-full w-full border-0 bg-white" allow="payment *" referrerPolicy="strict-origin-when-cross-origin" onLoad={() => setIframeReady(true)} />
                {!iframeReady && !verifying && <div className="absolute inset-0 flex flex-col items-center justify-center bg-white px-6 text-center"><Loader2 className="h-8 w-8 animate-spin text-coral" /><p className="mt-4 font-extrabold text-petrol">A abrir o checkout seguro…</p><p className="mt-1 text-sm text-muted-foreground">A sua sessão de pagamento está a ser preparada.</p></div>}
                {verifying && <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/95 px-6 text-center"><Loader2 className="h-8 w-8 animate-spin text-coral" /><p className="mt-4 font-extrabold text-petrol">A confirmar o pagamento…</p><p className="mt-1 max-w-sm text-sm text-muted-foreground">Não precisa repetir o pagamento. A confirmação final é feita entre o MyPets e a XPAYMENTS.</p></div>}
              </div>
              <div className="border-t border-border bg-white px-4 py-2 text-center text-[10px] text-muted-foreground">Pode fechar esta janela e retomar a mesma sessão enquanto ela estiver válida.</div>
              {error && <div className="border-t border-border bg-amber-50 px-4 py-3 text-xs text-amber-900">{error}</div>}
            </div>
          ) : (
            <NativePending
              intent={intent}
              method={nativeMethod}
              verifying={verifying}
              error={error}
              copied={copiedAction}
              onCopy={() => {
                const code = actionValue(intent.action, "copyPaste", "pixString", "pixCode", "pix_code", "copy_paste");
                if (!code) return;
                void navigator.clipboard.writeText(code).then(() => {
                  setCopiedAction(true);
                  window.setTimeout(() => setCopiedAction(false), 1800);
                });
              }}
              onClose={() => setOpen(false)}
              onRetry={() => { resetCheckout(); setOpen(true); }}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

function NativePending({
  intent,
  method,
  verifying,
  error,
  copied,
  onCopy,
  onClose,
  onRetry,
}: {
  intent: CheckoutIntent;
  method: NativePaymentMethod | null;
  verifying: boolean;
  error: string | null;
  copied: boolean;
  onCopy: () => void;
  onClose: () => void;
  onRetry: () => void;
}) {
  const action = intent.action ?? {};
  const pixCode = actionValue(action, "copyPaste", "pixString", "pixCode", "pix_code", "copy_paste");
  const qrSource = pixQrSource(action);
  const entity = actionValue(action, "entity", "entityNumber", "entity_number");
  const reference = actionValue(action, "paymentReference", "payment_reference", "reference");
  const redirect = actionValue(action, "redirectUrl", "redirect_url", "url");

  return (
    <div className="min-h-[470px] p-6">
      <div className="flex items-start justify-between gap-3">
        <div><p className="text-xs font-extrabold uppercase tracking-wide text-coral">{method ? methodLabel[method] : "Pagamento"}</p><h2 className="mt-1 text-xl font-extrabold text-petrol">{money(intent.amountCents, intent.currency)}</h2></div>
        <button type="button" onClick={onClose} aria-label="Fechar" className="rounded-lg p-2 text-muted-foreground hover:bg-sand"><X className="h-4 w-4" /></button>
      </div>

      {method === "pix" && (
        <div className="mt-6 space-y-4 text-center">
          {qrSource && <img src={qrSource} alt="QR Code PIX" className="mx-auto h-52 w-52 rounded-xl border border-border bg-white object-contain p-2" />}
          {pixCode && <><p className="text-xs text-muted-foreground">PIX Copia e Cola</p><div className="break-all rounded-xl bg-sand/70 p-3 text-left text-xs text-petrol">{pixCode}</div><Button type="button" variant="outline" onClick={onCopy} className="w-full rounded-xl">{copied ? <Check className="mr-2 h-4 w-4" /> : <Copy className="mr-2 h-4 w-4" />}{copied ? "Copiado" : "Copiar código PIX"}</Button></>}
        </div>
      )}

      {method === "multibanco" && (
        <div className="mt-6 rounded-2xl bg-sand/70 p-5">
          <p className="text-sm font-extrabold text-petrol">Referência para pagamento</p>
          <div className="mt-4 grid grid-cols-2 gap-3 text-sm"><div><p className="text-[10px] font-bold uppercase text-muted-foreground">Entidade</p><p className="mt-1 font-extrabold text-petrol">{entity ?? "Consulte as instruções"}</p></div><div><p className="text-[10px] font-bold uppercase text-muted-foreground">Referência</p><p className="mt-1 font-extrabold text-petrol">{reference ?? "—"}</p></div></div>
        </div>
      )}

      {(method === "mb_way" || method === "bizum") && (
        <div className="mt-8 text-center"><Smartphone className="mx-auto h-12 w-12 text-coral" /><p className="mt-4 font-extrabold text-petrol">Confirme no seu telemóvel</p><p className="mt-2 text-sm leading-6 text-muted-foreground">O pedido foi criado. A causa só será atualizada depois da confirmação financeira recebida pelo MyPets.</p></div>
      )}

      {redirect && <a href={redirect} target="_blank" rel="noopener noreferrer" className="mt-5 flex min-h-12 items-center justify-center rounded-xl bg-coral px-4 text-sm font-extrabold text-white">Continuar pagamento <ExternalLink className="ml-2 h-4 w-4" /></a>}

      <div className="mt-6 flex items-center justify-center gap-2 text-xs text-muted-foreground">{verifying || intent.status === "PENDING" || intent.status === "PROCESSING" ? <Loader2 className="h-4 w-4 animate-spin text-coral" /> : null}<span>{verifying ? "A confirmar…" : "Aguardando confirmação segura"}</span></div>
      {error && <p className="mt-4 rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-900">{error}</p>}
      <Button type="button" variant="ghost" onClick={onRetry} className="mt-5 w-full rounded-xl text-petrol">Escolher outro meio</Button>
    </div>
  );
}
