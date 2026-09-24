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
  ShieldCheck,
  Smartphone,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { PremiumSupportButton } from "@/components/conversion/premium-support-cta";
import { PixBrand } from "@/components/payments/pix-brand";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { apiUrl } from "@/lib/api";
import { getValidSession } from "@/lib/auth-client";
import { recordGrowthEvent } from "@/lib/growth";
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
  presentation?: "button" | "campaign";
  defaultAmountCents?: number;
  campaignEyebrow?: string;
  campaignTitle?: string;
  campaignDescription?: string;
  campaignClassName?: string;
  amountPresetsCents?: number[];
  lockedAmountCents?: number;
  trackingCampaignOverride?: string;
  trackingContentOverride?: string;
  rewardKeys?: string[];
  successActionHref?: string;
  successActionLabel?: string;
  requireEmail?: boolean;
  successShareText?: string;
  successShareUrl?: string;
};

const methodLabel: Record<PaymentChoice, string> = {
  pix: "Pix",
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

function cpfDigits(value: string) {
  return value.replace(/\D/g, "").slice(0, 11);
}

function formatCpf(value: string) {
  const digits = cpfDigits(value);
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `${digits.slice(0, 3)}.${digits.slice(3)}`;
  if (digits.length <= 9) return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`;
  return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9)}`;
}

function validCpf(value: string) {
  const digits = cpfDigits(value);
  if (digits.length !== 11 || /^(\d)\1{10}$/.test(digits)) return false;
  const numbers = digits.split("").map(Number);
  const digit = (length: number) => {
    const sum = numbers.slice(0, length).reduce((total, number, index) => total + number * (length + 1 - index), 0);
    const remainder = (sum * 10) % 11;
    return remainder === 10 ? 0 : remainder;
  };
  return digit(9) === numbers[9] && digit(10) === numbers[10];
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
  if (currency === "BRL") return ["pix"];
  if (currency === "EUR" && country === "PT") return ["mb_way", "multibanco"];
  if (currency === "EUR" && country === "ES") return ["bizum"];
  return [];
}

function methodIcon(method: PaymentChoice) {
  if (method === "pix") return <PixBrand className="h-4 w-auto" />;
  if (method === "mb_way" || method === "bizum") return <Smartphone className="h-4 w-4" />;
  if (method === "multibanco") return <Landmark className="h-4 w-4" />;
  return <CreditCard className="h-4 w-4" />;
}

export function CauseCheckout({
  causeId,
  causeTitle,
  currency,
  enabled,
  presentation = "button",
  defaultAmountCents,
  campaignEyebrow = "Faça parte desta causa",
  campaignTitle = "Escolha quanto quer colocar em movimento hoje",
  campaignDescription = "O valor escolhido abre o pagamento seguro já preparado para esta contribuição.",
  campaignClassName,
  amountPresetsCents,
  lockedAmountCents,
  trackingCampaignOverride,
  trackingContentOverride,
  rewardKeys,
  successActionHref,
  successActionLabel = "Aceder ao conteúdo",
  requireEmail = false,
  successShareText = "Eu apoiei o MyPets. Se esta causa também fizer sentido para você, conheça e compartilhe.",
  successShareUrl,
}: Props) {
  const router = useRouter();
  const brazilPixOnly = currency === "BRL";
  const presets = React.useMemo(
    () => amountPresetsCents?.length ? amountPresetsCents : amountOptions(currency),
    [amountPresetsCents, currency],
  );
  const initialAmount = lockedAmountCents && lockedAmountCents >= 100 && lockedAmountCents <= 5_000_000
    ? lockedAmountCents
    : defaultAmountCents && defaultAmountCents >= 100 && defaultAmountCents <= 5_000_000
      ? defaultAmountCents
      : presets[1] ?? presets[0] ?? 100;
  const [open, setOpen] = React.useState(false);
  const [amountCents, setAmountCents] = React.useState(initialAmount);
  const [customAmount, setCustomAmount] = React.useState("");
  const [campaignCustomOpen, setCampaignCustomOpen] = React.useState(false);
  const [donorName, setDonorName] = React.useState("");
  const [donorEmail, setDonorEmail] = React.useState("");
  const [donorPhone, setDonorPhone] = React.useState("");
  const [donorDocument, setDonorDocument] = React.useState("");
  const [payerOwnershipConfirmed, setPayerOwnershipConfirmed] = React.useState(false);
  const [marketCountry, setMarketCountry] = React.useState<string | null>(null);
  const [choice, setChoice] = React.useState<PaymentChoice>(brazilPixOnly ? "pix" : "checkout");
  const selectionTouched = React.useRef(false);
  const [busy, setBusy] = React.useState(false);
  const [intent, setIntent] = React.useState<CheckoutIntent | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [verifying, setVerifying] = React.useState(false);
  const [paid, setPaid] = React.useState(false);
  const [iframeReady, setIframeReady] = React.useState(false);
  const [copiedAction, setCopiedAction] = React.useState(false);
  const idempotencyKeys = React.useRef<Record<string, string>>({});

  const effectiveAmount = lockedAmountCents
    ? lockedAmountCents
    : customAmount.trim()
      ? Math.round((Number(customAmount.replace(",", ".")) || 0) * 100)
      : amountCents;
  const nativeMethods = React.useMemo(() => preferredNativeMethods(currency, marketCountry), [currency, marketCountry]);

  React.useEffect(() => {
    if (brazilPixOnly) {
      setChoice("pix");
      return;
    }
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
  }, [brazilPixOnly, currency]);

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

  React.useEffect(() => {
    if (!paid || !open) return;
    const timer = window.setTimeout(() => {
      setOpen(false);
      resetCheckout();
    }, presentation === "campaign" ? 20000 : 7000);
    return () => window.clearTimeout(timer);
  }, [open, paid, presentation, resetCheckout]);

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
    const timer = window.setInterval(() => void reconcileSilently(), 2000);
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
    const params = typeof window === "undefined" ? new URLSearchParams() : new URLSearchParams(window.location.search);
    return {
      source: params.get("utm_source"),
      medium: params.get("utm_medium"),
      campaign: trackingCampaignOverride ?? params.get("utm_campaign"),
      content: trackingContentOverride ?? params.get("utm_content"),
      refCode: params.get("ref"),
      landingPath: typeof window === "undefined" ? null : (window.location.pathname + window.location.search).slice(0, 500),
    };
  }

  function openCheckout() {
    const attribution = tracking();
    if (typeof window !== "undefined") {
      void recordGrowthEvent({
        eventName: "SUPPORT_STARTED",
        source: attribution.source,
        medium: attribution.medium,
        campaign: attribution.campaign,
        content: attribution.content,
        landingPath: `${window.location.pathname}${window.location.search}`.slice(0, 500),
        metadata: {
          causeId,
          causeTitle,
          currency,
          presentation,
        },
      });
    }
    setOpen(true);
  }

  async function shareConfirmedSupport() {
    if (typeof window === "undefined") return;
    const attribution = tracking();
    const campaignName = (successShareUrl || window.location.pathname).includes("petskids") ? "petskids_story" : "mypets_support";
    const destinationPath = successShareUrl || window.location.pathname;
    const targetUrl = new URL(destinationPath, window.location.origin);
    if (!targetUrl.searchParams.has("utm_source")) targetUrl.searchParams.set("utm_source", "share");
    if (!targetUrl.searchParams.has("utm_medium")) targetUrl.searchParams.set("utm_medium", "referral");
    if (!targetUrl.searchParams.has("utm_campaign")) targetUrl.searchParams.set("utm_campaign", campaignName);
    targetUrl.searchParams.set("utm_content", "post_donation");

    let target = targetUrl.toString();
    let personalized = false;
    const session = await getValidSession().catch(() => null);
    if (session?.access_token) {
      try {
        const response = await fetch(apiUrl("/growth/share-links"), {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({
            destinationPath,
            source: "mypets",
            medium: "share",
            campaign: campaignName,
            content: "post_donation",
          }),
        });
        const body = (await response.json().catch(() => ({}))) as { data?: { path?: string } };
        if (response.ok && body.data?.path) {
          target = new URL(body.data.path, window.location.origin).toString();
          personalized = true;
        }
      } catch {
        // Referral creation must never block sharing.
      }
    }

    const text = `${successShareText}\n\n${target}`;

    void recordGrowthEvent({
      eventName: "SHARE_CLICK",
      source: attribution.source,
      medium: attribution.medium,
      campaign: attribution.campaign,
      content: attribution.content,
      landingPath: `${window.location.pathname}${window.location.search}`.slice(0, 500),
      metadata: {
        causeId,
        causeTitle,
        currency,
        shareTarget: target,
        personalized,
        surface: "post_donation",
      },
    });

    if (navigator.share) {
      try {
        await navigator.share({ title: "MyPets", text: successShareText, url: target });
        return;
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") return;
      }
    }
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank", "noopener,noreferrer");
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
      setError("Indique o nome do titular pagador para continuar.");
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
    if (brazilPixOnly) {
      setChoice("pix");
      setError("No Brasil, os apoios em reais são processados por Pix.");
      return;
    }
    if (!enabled || !validateCommon(false, requireEmail)) return;
    setBusy(true);
    setError(null);
    try {
      const data = await requestPayment("/payments/checkout", "checkout", {
        causeId,
        amountCents: effectiveAmount,
        frequency: "ONE_TIME",
        donorName: donorName.trim() || null,
        donorEmail: donorEmail.trim() || null,
        rewardKeys,
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
    const requiresEmail = method !== "pix" || requireEmail;
    if (!enabled || !validateCommon(true, requiresEmail)) return;
    if (method === "pix") {
      if (!validCpf(donorDocument)) {
        setError("Informe um CPF válido do titular da conta que fará o Pix.");
        return;
      }
      if (!payerOwnershipConfirmed) {
        setError("Confirme que o CPF informado pertence ao titular da conta que realizará o Pix.");
        return;
      }
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
        donorDocument: method === "pix" ? cpfDigits(donorDocument) : donorDocument.trim() || null,
        rewardKeys,
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
    if (brazilPixOnly) return startNative("pix");
    if (choice === "checkout") return startCheckout();
    return startNative(choice);
  }

  if (!enabled) return null;

  const triggerLabel = paid ? "Apoio confirmado" : intent ? "Retomar apoio" : "Apoiar agora";
  const hasEmbeddedCheckout = Boolean(intent?.embedUrl);
  const successHrefWithReceipt = successActionHref && intent?.id
    ? `${successActionHref}${successActionHref.includes("?") ? "&" : "?"}receipt=${encodeURIComponent(intent.id)}`
    : successActionHref;
  const nativeMethod = intent?.paymentMethod && intent.paymentMethod !== "checkout" ? intent.paymentMethod as NativePaymentMethod : null;

  return (
    <>
      {presentation === "campaign" ? (
        <div className={cn("rounded-[1.75rem] border border-white/10 bg-white p-5 text-petrol shadow-2xl shadow-black/15 sm:p-6", campaignClassName)}>
          <p className="text-[10px] font-black uppercase tracking-[0.17em] text-emerald-700">{campaignEyebrow}</p>
          <h2 className="mt-2 text-xl font-black tracking-tight text-petrol sm:text-2xl">{campaignTitle}</h2>
          <p className="mt-2 text-xs leading-5 text-muted-foreground">{campaignDescription}</p>
          {lockedAmountCents ? (
            <div className="mt-5 rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-4">
              <p className="text-[10px] font-black uppercase tracking-[0.14em] text-emerald-700">Participação definida</p>
              <p className="mt-1 text-3xl font-black text-emerald-950">{money(lockedAmountCents, currency)}</p>
            </div>
          ) : (
            <>
              <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-5">
                {presets.map((cents) => (
                  <button
                    key={cents}
                    type="button"
                    onClick={() => { setAmountCents(cents); setCustomAmount(""); setCampaignCustomOpen(false); setError(null); }}
                    className={cn(
                      "min-h-11 rounded-xl border px-2 text-xs font-black transition sm:text-sm",
                      !campaignCustomOpen && !customAmount && amountCents === cents
                        ? "border-petrol bg-petrol text-white shadow-sm"
                        : "border-border bg-[#f7fafb] text-petrol hover:border-petrol/35",
                    )}
                  >
                    {money(cents, currency)}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => { setCampaignCustomOpen(true); setError(null); }}
                  className={cn(
                    "min-h-11 rounded-xl border px-2 text-xs font-black transition sm:text-sm",
                    campaignCustomOpen
                      ? "border-petrol bg-petrol text-white shadow-sm"
                      : "border-border bg-[#f7fafb] text-petrol hover:border-petrol/35",
                  )}
                >
                  Outro
                </button>
              </div>
              {campaignCustomOpen && (
                <div className="mt-2">
                  <Input
                    autoFocus
                    inputMode="decimal"
                    value={customAmount}
                    onChange={(event) => { setCustomAmount(event.target.value); setError(null); }}
                    placeholder={`Outro valor em ${currency}`}
                    aria-label={`Outro valor em ${currency}`}
                    className="h-11 bg-[#f7fafb]"
                  />
                  <p className="mt-1.5 text-[10px] leading-4 text-muted-foreground">Mínimo {money(100, currency)} · máximo {money(5_000_000, currency)}.</p>
                </div>
              )}
            </>
          )}
          <button
            type="button"
            onClick={openCheckout}
            className="mt-4 flex min-h-14 w-full items-center justify-center gap-2 rounded-2xl bg-emerald-500 px-5 text-base font-black text-white shadow-[0_16px_32px_-18px_rgba(16,185,129,.85)] transition hover:-translate-y-0.5 hover:bg-emerald-600"
          >
            <Heart className="h-5 w-5" />
            {intent ? "Retomar apoio" : `Quero ajudar agora · ${money(effectiveAmount, currency)}`}
          </button>
          <div className="mt-3 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-[10px] font-semibold text-muted-foreground">
            <span className="inline-flex items-center gap-1.5"><LockKeyhole className="h-3.5 w-3.5 text-emerald-700" /> Pagamento seguro</span>
            {brazilPixOnly && <span className="inline-flex items-center gap-1.5"><PixBrand className="h-3.5 w-auto" /> Pix no Brasil</span>}
            <span className="inline-flex items-center gap-1.5"><Check className="h-3.5 w-3.5 text-emerald-700" /> Confirmação pelo servidor</span>
          </div>
        </div>
      ) : (
        <PremiumSupportButton
          onClick={openCheckout}
          label={triggerLabel}
          detail={brazilPixOnly ? "Pix no Brasil" : "pagamento seguro"}
          className="min-w-[162px]"
        />
      )}

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
              <div className="relative overflow-hidden bg-petrol px-6 py-6 text-white">
                <div aria-hidden className="absolute -right-16 -top-16 h-44 w-44 rounded-full bg-[#32bcad]/10 blur-2xl" />
                <DialogHeader className="relative text-left">
                  {brazilPixOnly && <div className="mb-4 inline-flex w-fit items-center rounded-xl bg-white px-3 py-2"><PixBrand className="h-6 w-auto" /></div>}
                  <DialogTitle className="text-xl font-extrabold text-white">{brazilPixOnly ? `Apoiar com Pix · ${causeTitle}` : `Apoiar ${causeTitle}`}</DialogTitle>
                  <DialogDescription className="text-sm leading-6 text-white/65">
                    {brazilPixOnly
                      ? "Escolha o valor, identifique o titular pagador e gere o QR Code ou Pix Copia e Cola sem sair do MyPets."
                      : "Escolha o valor e o meio de pagamento. O MyPets mantém a origem da campanha para medir o impacto do funil."}
                  </DialogDescription>
                </DialogHeader>
              </div>

              <div className="max-h-[78svh] space-y-5 overflow-y-auto p-6">
                <div>
                  <p className="text-xs font-extrabold uppercase tracking-wide text-muted-foreground">Valor do apoio</p>
                  {lockedAmountCents ? (
                    <div className="mt-3 rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-4 text-center">
                      <p className="text-3xl font-black text-emerald-950">{money(lockedAmountCents, currency)}</p>
                      <p className="mt-1 text-[11px] font-semibold text-emerald-900/65">Valor definido pela participação selecionada.</p>
                    </div>
                  ) : (
                    <>
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
                    </>
                  )}
                </div>

                <div>
                  <p className="text-xs font-extrabold uppercase tracking-wide text-muted-foreground">Como quer apoiar</p>
                  {brazilPixOnly ? (
                    <div className="mt-3 flex items-center justify-between gap-4 rounded-2xl border border-[#32bcad]/30 bg-[#f2fbfa] p-4">
                      <div className="flex items-center gap-3">
                        <span className="flex h-12 min-w-16 items-center justify-center rounded-xl bg-white px-2 ring-1 ring-black/5"><PixBrand className="h-6 w-auto" /></span>
                        <div><p className="text-sm font-black text-petrol">Pix</p><p className="mt-0.5 text-[11px] leading-4 text-muted-foreground">Instantâneo · QR Code + Copia e Cola</p></div>
                      </div>
                      <span className="rounded-full bg-[#32bcad]/12 px-2.5 py-1 text-[9px] font-black uppercase tracking-wide text-[#147f75]">Brasil</span>
                    </div>
                  ) : (
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
                  )}
                  {brazilPixOnly ? (
                    <p className="mt-2 text-[11px] leading-5 text-muted-foreground">O Pix é criado via integração S2S com a XPAYMENTS e apresentado diretamente no MyPets. O pagamento só é considerado concluído após confirmação financeira.</p>
                  ) : marketCountry ? (
                    <p className="mt-2 text-[11px] text-muted-foreground">Meios priorizados para {marketCountry}; a disponibilidade final é validada pela Store XPAYMENTS.</p>
                  ) : null}
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <Input value={donorName} onChange={(event) => setDonorName(event.target.value)} placeholder={brazilPixOnly ? "Nome do titular pagador" : choice === "checkout" ? "Nome (opcional)" : "Nome do pagador"} maxLength={120} autoComplete="name" />
                  <Input type="email" value={donorEmail} onChange={(event) => setDonorEmail(event.target.value)} placeholder={requireEmail ? "Email para receber os eBooks" : choice === "pix" || choice === "checkout" ? "Email (opcional)" : "Email"} maxLength={254} autoComplete="email" />
                </div>

                {(choice === "mb_way" || choice === "bizum") && !brazilPixOnly && (
                  <Input value={donorPhone} onChange={(event) => setDonorPhone(event.target.value)} inputMode="tel" placeholder={choice === "mb_way" ? "Telemóvel +351" : "Móvel +34"} maxLength={40} />
                )}
                {brazilPixOnly && (
                  <div className="rounded-2xl border border-border bg-[#fbfcfc] p-4">
                    <label htmlFor={`pix-cpf-${causeId}`} className="text-xs font-extrabold text-petrol">CPF do titular da conta pagadora</label>
                    <Input
                      id={`pix-cpf-${causeId}`}
                      className="mt-2 bg-white"
                      value={donorDocument}
                      onChange={(event) => { setDonorDocument(formatCpf(event.target.value)); setPayerOwnershipConfirmed(false); setError(null); }}
                      inputMode="numeric"
                      autoComplete="off"
                      placeholder="000.000.000-00"
                      maxLength={14}
                      aria-describedby={`pix-cpf-help-${causeId}`}
                    />
                    <p id={`pix-cpf-help-${causeId}`} className="mt-2 text-[11px] leading-5 text-muted-foreground">Informe o CPF da pessoa titular da conta bancária que efetivamente fará este Pix. O documento é enviado à XPAYMENTS como identificação do pagador.</p>
                    <label className="mt-3 flex cursor-pointer items-start gap-3 rounded-xl bg-[#eef8f7] p-3 text-[11px] font-semibold leading-5 text-petrol">
                      <input
                        type="checkbox"
                        checked={payerOwnershipConfirmed}
                        onChange={(event) => { setPayerOwnershipConfirmed(event.target.checked); setError(null); }}
                        className="mt-0.5 h-4 w-4 shrink-0 accent-[#32bcad]"
                      />
                      <span>Confirmo que o CPF informado pertence ao titular da conta que realizará o Pix.</span>
                    </label>
                  </div>
                )}

                {error && <p className="rounded-xl bg-destructive/5 px-4 py-3 text-sm text-destructive">{error}</p>}

                {brazilPixOnly ? (
                  <button
                    type="button"
                    onClick={() => void startSelected()}
                    disabled={busy || effectiveAmount < 100 || effectiveAmount > 5_000_000}
                    className="group flex h-14 w-full items-center justify-center gap-3 rounded-2xl bg-petrol px-4 font-extrabold text-white shadow-[0_14px_30px_-17px_rgba(16,32,42,0.75)] transition hover:-translate-y-0.5 hover:bg-[#15323d] disabled:pointer-events-none disabled:opacity-50"
                  >
                    {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <span className="flex h-8 items-center rounded-lg bg-white px-2"><PixBrand className="h-5 w-auto" /></span>}
                    <span>{busy ? "Gerando Pix seguro…" : `Gerar Pix · ${money(effectiveAmount, currency)}`}</span>
                  </button>
                ) : (
                  <Button onClick={() => void startSelected()} disabled={busy || effectiveAmount < 100 || effectiveAmount > 5_000_000} className="h-12 w-full rounded-xl bg-coral font-extrabold text-white hover:bg-coral-dark">
                    {busy ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <LockKeyhole className="mr-2 h-4 w-4" />}
                    {methodLabel[choice]} · {money(effectiveAmount, currency)}
                  </Button>
                )}

                <div className="flex items-start gap-2 rounded-xl bg-sand/60 px-3 py-3 text-[11px] leading-relaxed text-muted-foreground">
                  <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                  <span>{brazilPixOnly ? "O MyPets não considera a geração do QR Code como pagamento concluído. A confirmação depende do estado financeiro recebido da XPAYMENTS." : "Pagamento orquestrado pela XPAYMENTS. Métodos locais usam API S2S; cartão e wallets permanecem em superfície segura do provedor. Criar um pagamento nunca é tratado como confirmação."}</span>
                </div>
              </div>
            </div>
          ) : paid ? (
            <div className="flex min-h-[420px] flex-col items-center justify-center px-8 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50"><Heart className="h-8 w-8 fill-emerald-600 text-emerald-600" /></div>
              <h2 className="mt-5 text-2xl font-extrabold text-petrol">Apoio confirmado. Obrigado!</h2>
              <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">O pagamento foi confirmado pelo servidor. Obrigado por apoiar {causeTitle}.</p>
              <p className="mt-2 text-xs font-semibold text-emerald-700">O apoio está confirmado. Se quiser ampliar o alcance, partilhe a campanha com alguém que também se importa.</p>
              <div className={cn("mt-6 grid w-full max-w-md gap-2", successHrefWithReceipt ? "sm:grid-cols-3" : "sm:grid-cols-2")}>
                {successHrefWithReceipt && (
                  <a href={successHrefWithReceipt} className="inline-flex min-h-10 items-center justify-center rounded-xl bg-petrol px-4 text-sm font-black text-white">
                    {successActionLabel}
                  </a>
                )}
                <Button onClick={() => void shareConfirmedSupport()} className="rounded-xl bg-emerald-600 text-white hover:bg-emerald-700">
                  <Heart className="mr-2 h-4 w-4 fill-white" /> Partilhar
                </Button>
                <Button onClick={() => { setOpen(false); resetCheckout(); }} variant="outline" className="rounded-xl border-border text-petrol">Fechar</Button>
              </div>
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
              onVerify={() => void verifyPayment(intent.id)}
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
  onVerify,
  onRetry,
}: {
  intent: CheckoutIntent;
  method: NativePaymentMethod | null;
  verifying: boolean;
  error: string | null;
  copied: boolean;
  onCopy: () => void;
  onClose: () => void;
  onVerify: () => void;
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
        <div>
          {method === "pix" ? <PixBrand className="h-7 w-auto" /> : <p className="text-xs font-extrabold uppercase tracking-wide text-coral">{method ? methodLabel[method] : "Pagamento"}</p>}
          <h2 className="mt-2 text-xl font-extrabold text-petrol">{money(intent.amountCents, intent.currency)}</h2>
        </div>
        <button type="button" onClick={onClose} aria-label="Fechar" className="rounded-lg p-2 text-muted-foreground hover:bg-sand"><X className="h-4 w-4" /></button>
      </div>

      {method === "pix" && (
        <div className="mt-5 space-y-4 text-center">
          <div className="rounded-2xl border border-[#32bcad]/25 bg-[#f4fbfa] p-4">
            <p className="text-sm font-black text-petrol">Escaneie no app do seu banco</p>
            <p className="mt-1 text-[11px] leading-5 text-muted-foreground">Use a conta de titularidade correspondente ao CPF informado no passo anterior.</p>
            {qrSource && <img src={qrSource} alt="QR Code Pix" className="mx-auto mt-4 h-52 w-52 rounded-xl border border-border bg-white object-contain p-2" />}
          </div>
          {pixCode && <><p className="text-xs font-bold text-muted-foreground">Pix Copia e Cola</p><div className="break-all rounded-xl bg-sand/70 p-3 text-left text-xs text-petrol">{pixCode}</div><Button type="button" variant="outline" onClick={onCopy} className="w-full rounded-xl">{copied ? <Check className="mr-2 h-4 w-4" /> : <Copy className="mr-2 h-4 w-4" />}{copied ? "Copiado" : "Copiar código Pix"}</Button></>}
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

      <div className="mt-6 flex items-center justify-center gap-2 text-xs text-muted-foreground">{verifying || intent.status === "PENDING" || intent.status === "PROCESSING" ? <Loader2 className="h-4 w-4 animate-spin text-coral" /> : null}<span>{verifying ? "A confirmar o pagamento…" : "Aguardando confirmação financeira"}</span></div>
      {method === "pix" && (
        <Button type="button" variant="outline" onClick={onVerify} disabled={verifying} className="mt-4 w-full rounded-xl border-[#32bcad]/40 text-petrol hover:bg-[#f2fbfa]">
          {verifying ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Check className="mr-2 h-4 w-4 text-[#147f75]" />}
          {verifying ? "Verificando…" : "Já paguei · verificar agora"}
        </Button>
      )}
      {error && <p className="mt-4 rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-900">{error}</p>}
      <Button type="button" variant="ghost" onClick={onRetry} className="mt-3 w-full rounded-xl text-petrol">{method === "pix" ? "Gerar novo Pix" : "Escolher outro meio"}</Button>
    </div>
  );
}
