"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, ArrowRight, Check, CreditCard, Heart, Loader2, Share2, Smartphone, Landmark, ReceiptText, PartyPopper } from "lucide-react";
import { useLocale } from "@/lib/i18n/locale-context";
import { amountPresets, LOCALE_META } from "@/lib/i18n/dictionaries";
import { useDonateStore } from "@/lib/stores";
import type { StoryDTO } from "@/lib/types";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

type Step = 0 | 1 | 2 | 3 | 4 | 5; // target | amount | frequency | payment | processing | done

const METHOD_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  CARD: CreditCard,
  MBWAY: Smartphone,
  MULTIBANCO: Landmark,
  PIX: Smartphone,
  BOLETO: ReceiptText,
};

export function DonateDialog({ stories }: { stories: StoryDTO[] }) {
  const { open, target, closeDonate } = useDonateStore();
  const { dict, locale, money } = useLocale();
  const { toast } = useToast();
  const router = useRouter();

  const currency = LOCALE_META[locale].currency;
  const presets = React.useMemo(() => amountPresets(currency), [currency]);
  const methods =
    currency === "BRL" ? ["CARD", "PIX", "BOLETO"] : ["CARD", "MBWAY", "MULTIBANCO"];

  const [step, setStep] = React.useState<Step>(0);
  const [targetType, setTargetType] = React.useState<string>("ANIMAL");
  const [storyId, setStoryId] = React.useState<string | null>(null);
  const [amountCents, setAmountCents] = React.useState<number>(presets[1].cents);
  const [custom, setCustom] = React.useState<string>("");
  const [useCustom, setUseCustom] = React.useState(false);
  const [frequency, setFrequency] = React.useState<"ONE_TIME" | "MONTHLY">("ONE_TIME");
  const [method, setMethod] = React.useState("CARD");
  const [donorName, setDonorName] = React.useState("");
  const [donorEmail, setDonorEmail] = React.useState("");
  const [busy, setBusy] = React.useState(false);
  const [receipt, setReceipt] = React.useState<{ id: string; status: string } | null>(null);
  const [errored, setErrored] = React.useState(false);

  const story = stories.find((s) => s.id === storyId) ?? null;

  // sync store target → local state on open
  React.useEffect(() => {
    if (!open) return;
    setErrored(false);
    setReceipt(null);
    if (target) {
      if (target.type === "GUARDIANS") {
        setTargetType("GUARDIANS");
        setStoryId(null);
        setFrequency("MONTHLY");
        setStep(1);
      } else if (target.storyId) {
        const s = stories.find((x) => x.id === target.storyId);
        setTargetType(s?.kind === "ANIMAL" ? "ANIMAL" : "PROTECTOR");
        setStoryId(target.storyId);
        setStep(1);
      } else {
        setTargetType(target.type);
        setStoryId(null);
        setStep(0);
      }
    } else {
      setTargetType("ANIMAL");
      setStoryId(null);
      setStep(0);
    }
  }, [open, target, stories]);

  const destinationLabel = story
    ? `${story.name}${story.location ? ` • ${story.location}` : ""}`
    : targetType === "GUARDIANS"
      ? dict.donate.guardianTitle
      : targetType === "PROTECTOR"
        ? dict.donate.targets[1].title
        : targetType === "ANIMAL"
          ? dict.donate.targets[0].title
          : "MyPets";

  const finalAmount = useCustom
    ? Math.round((parseFloat(custom.replace(",", ".")) || 0) * 100)
    : amountCents;

  const confirmContribution = async () => {
    setBusy(true);
    setStep(4);
    try {
      const res = await fetch("/api/v1/contributions/intents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          targetType: story ? (story.kind === "ANIMAL" ? "ANIMAL" : "PROTECTOR") : targetType,
          storyId,
          amountCents: finalAmount,
          currency,
          frequency,
          donorName: donorName || null,
          donorEmail: donorEmail || null,
        }),
      });
      if (!res.ok) throw new Error("intent");
      const { data } = await res.json();

      // mock provider processes → backend confirm (the only place PAID is set)
      const confirmRes = await fetch(`/api/v1/contributions/${data.id}/confirm`, { method: "POST" });
      if (!confirmRes.ok) throw new Error("confirm");
      const { data: paid } = await confirmRes.json();

      setReceipt({ id: paid.id, status: paid.status });
      setStep(5);
      // refresh server data so story progress bars reflect the new contribution
      router.refresh();
    } catch {
      setErrored(true);
      toast({ title: dict.donate.errorGeneric, variant: "destructive" });
      setStep(3);
    } finally {
      setBusy(false);
    }
  };

  const amountValid = finalAmount >= 100;
  const effectiveStep: Step = step === 0 && (target?.storyId || targetType === "GUARDIANS") ? 1 : step;
  const totalSteps = 4;

  const handleOpenChange = (v: boolean) => {
    if (!v) {
      closeDonate();
      setStep(0);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-h-[92svh] overflow-y-auto styled-scroll rounded-2xl border-border bg-white p-0 sm:max-w-[440px]">
        <div className="bg-petrol px-6 pb-5 pt-6 text-white sm:rounded-t-2xl">
          <DialogHeader className="space-y-1 text-left">
            <DialogTitle className="text-[19px] font-extrabold tracking-tight text-white">
              {targetType === "GUARDIANS" && step >= 1 ? dict.donate.guardianTitle : dict.donate.title}
              {story ? ` — ${story.name}` : ""}
            </DialogTitle>
            <DialogDescription className="text-[12.5px] leading-relaxed text-white/65">
              {targetType === "GUARDIANS" && step >= 1 ? dict.donate.guardianText : dict.donate.subtitle}
            </DialogDescription>
          </DialogHeader>
          {/* step dots */}
          {effectiveStep < 4 && (
            <div className="mt-4 flex items-center gap-2" aria-hidden>
              {Array.from({ length: totalSteps }).map((_, i) => (
                <span
                  key={i}
                  className={cn(
                    "h-1.5 flex-1 rounded-full transition-colors",
                    i <= Math.min(effectiveStep, totalSteps - 1) ? "bg-coral" : "bg-white/15"
                  )}
                />
              ))}
              <span className="ml-2 text-[11px] font-bold text-white/60">
                {dict.donate.step} {Math.min(effectiveStep, totalSteps - 1) + 1} {dict.donate.of} {totalSteps}
              </span>
            </div>
          )}
        </div>

        <div className="px-6 py-6">
          {/* ── Step 0 · target ── */}
          {step === 0 && (
            <div>
              <h3 className="text-[15px] font-extrabold text-petrol">{dict.donate.targetTitle}</h3>
              <div className="mt-4 flex flex-col gap-2.5">
                {dict.donate.targets.map((t) => (
                  <button
                    key={t.key}
                    onClick={() => {
                      setTargetType(t.key);
                      setStoryId(null);
                      setStep(1);
                    }}
                    className={cn(
                      "flex items-start gap-3 rounded-xl border p-4 text-left transition-all hover:border-coral/50 hover:bg-accent/40",
                      targetType === t.key ? "border-coral bg-accent/50" : "border-border"
                    )}
                  >
                    <Heart className="mt-0.5 h-4.5 w-4.5 text-coral" aria-hidden />
                    <span>
                      <span className="block text-[14px] font-extrabold text-petrol">{t.title}</span>
                      <span className="mt-0.5 block text-[12px] text-muted-foreground">{t.text}</span>
                    </span>
                  </button>
                ))}
              </div>
              {stories.length > 0 && (
                <div className="mt-5">
                  <p className="text-[12px] font-bold uppercase tracking-wide text-muted-foreground">
                    {dict.search.stories}
                  </p>
                  <div className="mt-2.5 flex flex-wrap gap-2">
                    {stories.map((s) => (
                      <button
                        key={s.id}
                        onClick={() => {
                          setTargetType(s.kind === "ANIMAL" ? "ANIMAL" : "PROTECTOR");
                          setStoryId(s.id);
                          setStep(1);
                        }}
                        className="min-h-9 rounded-full border border-border bg-white px-3.5 text-[12.5px] font-bold text-ink/80 transition-colors hover:border-coral hover:text-coral"
                      >
                        {s.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── Step 1 · amount ── */}
          {step === 1 && (
            <div>
              <h3 className="text-[15px] font-extrabold text-petrol">{dict.donate.amountTitle}</h3>
              <div className="mt-4 grid grid-cols-2 gap-2.5">
                {presets.map((p) => (
                  <button
                    key={p.cents}
                    onClick={() => {
                      setAmountCents(p.cents);
                      setUseCustom(false);
                    }}
                    className={cn(
                      "min-h-12 rounded-xl border text-[15px] font-extrabold transition-all",
                      !useCustom && amountCents === p.cents
                        ? "border-coral bg-coral text-white shadow-[0_8px_20px_-10px_rgba(255,98,88,0.6)]"
                        : "border-border bg-white text-petrol hover:border-coral/50"
                    )}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
              <div className="mt-2.5 flex items-center gap-2 rounded-xl border border-border px-3.5 focus-within:border-coral/60">
                <span className="text-[13px] font-bold text-muted-foreground">
                  {LOCALE_META[locale].currencySymbol}
                </span>
                <input
                  inputMode="decimal"
                  value={custom}
                  onFocus={() => setUseCustom(true)}
                  onChange={(e) => {
                    setUseCustom(true);
                    setCustom(e.target.value.replace(/[^\d.,]/g, ""));
                  }}
                  placeholder={dict.donate.custom}
                  aria-label={dict.donate.custom}
                  className="h-12 w-full bg-transparent text-[14px] font-semibold text-petrol placeholder:font-normal placeholder:text-muted-foreground focus:outline-none"
                />
              </div>
              <DialogActions
                onBack={() => setStep(0)}
                onNext={() => setStep(2)}
                nextDisabled={!amountValid}
                backLabel={target?.storyId || target?.type === "GUARDIANS" ? undefined : dict.donate.back}
                nextLabel={dict.donate.next}
              />
            </div>
          )}

          {/* ── Step 2 · frequency ── */}
          {step === 2 && (
            <div>
              <h3 className="text-[15px] font-extrabold text-petrol">{dict.donate.frequencyTitle}</h3>
              <div className="mt-4 grid grid-cols-2 gap-2.5">
                {(["ONE_TIME", "MONTHLY"] as const).map((f) => (
                  <button
                    key={f}
                    onClick={() => setFrequency(f)}
                    className={cn(
                      "flex min-h-16 flex-col items-center justify-center gap-0.5 rounded-xl border px-3 py-3 transition-all",
                      frequency === f
                        ? "border-coral bg-coral text-white shadow-[0_8px_20px_-10px_rgba(255,98,88,0.6)]"
                        : "border-border bg-white text-petrol hover:border-coral/50"
                    )}
                  >
                    <span className="text-[14px] font-extrabold">
                      {f === "ONE_TIME" ? dict.donate.oneTime : dict.donate.monthly}
                    </span>
                    {f === "MONTHLY" && (
                      <span className="text-[10px] font-bold uppercase tracking-wider opacity-80">
                        Guardian
                      </span>
                    )}
                  </button>
                ))}
              </div>
              {frequency === "MONTHLY" && (
                <p className="mt-3 rounded-lg bg-accent/60 px-3.5 py-2.5 text-[12px] font-medium leading-relaxed text-ink/80">
                  {dict.donate.monthlyNote}
                </p>
              )}
              <DialogActions
                onBack={() => setStep(1)}
                onNext={() => setStep(3)}
                backLabel={dict.donate.back}
                nextLabel={dict.donate.next}
              />
            </div>
          )}

          {/* ── Step 3 · payment + confirm ── */}
          {step === 3 && (
            <div>
              <h3 className="text-[15px] font-extrabold text-petrol">{dict.donate.paymentTitle}</h3>
              <div className="mt-4 grid grid-cols-3 gap-2">
                {methods.map((m) => {
                  const Icon = METHOD_ICONS[m] ?? CreditCard;
                  return (
                    <button
                      key={m}
                      onClick={() => setMethod(m)}
                      className={cn(
                        "flex min-h-[74px] flex-col items-center justify-center gap-1.5 rounded-xl border px-2 py-3 transition-all",
                        method === m
                          ? "border-coral bg-coral-soft text-coral-dark"
                          : "border-border bg-white text-ink/75 hover:border-coral/50"
                      )}
                    >
                      <Icon className="h-5 w-5" aria-hidden />
                      <span className="text-[11px] font-extrabold leading-none">{dict.donate.methods[m] ?? m}</span>
                    </button>
                  );
                })}
              </div>

              {/* mock card fields — demo provider, no real processing */}
              {method === "CARD" && (
                <div className="mt-4 grid grid-cols-2 gap-2.5">
                  <div className="col-span-2 rounded-xl border border-border px-3.5 py-2.5">
                    <label className="text-[10.5px] font-bold uppercase tracking-wide text-muted-foreground" htmlFor="cc-num">
                      {dict.donate.cardNumber}
                    </label>
                    <input
                      id="cc-num"
                      inputMode="numeric"
                      placeholder="4242 4242 4242 4242"
                      className="h-7 w-full bg-transparent text-[14px] font-semibold tracking-wide text-petrol placeholder:text-muted-foreground/70 focus:outline-none"
                    />
                  </div>
                  <div className="col-span-2 rounded-xl border border-border px-3.5 py-2.5">
                    <label className="text-[10.5px] font-bold uppercase tracking-wide text-muted-foreground" htmlFor="cc-name">
                      {dict.donate.cardName}
                    </label>
                    <input
                      id="cc-name"
                      placeholder="M. Silva"
                      className="h-7 w-full bg-transparent text-[14px] font-semibold text-petrol placeholder:text-muted-foreground/70 focus:outline-none"
                    />
                  </div>
                  <div className="rounded-xl border border-border px-3.5 py-2.5">
                    <label className="text-[10.5px] font-bold uppercase tracking-wide text-muted-foreground" htmlFor="cc-exp">
                      {dict.donate.expiry}
                    </label>
                    <input
                      id="cc-exp"
                      placeholder="12/28"
                      inputMode="numeric"
                      className="h-7 w-full bg-transparent text-[14px] font-semibold text-petrol placeholder:text-muted-foreground/70 focus:outline-none"
                    />
                  </div>
                  <div className="rounded-xl border border-border px-3.5 py-2.5">
                    <label className="text-[10.5px] font-bold uppercase tracking-wide text-muted-foreground" htmlFor="cc-cvv">
                      {dict.donate.cvv}
                    </label>
                    <input
                      id="cc-cvv"
                      placeholder="•••"
                      inputMode="numeric"
                      className="h-7 w-full bg-transparent text-[14px] font-semibold text-petrol placeholder:text-muted-foreground/70 focus:outline-none"
                    />
                  </div>
                </div>
              )}
              {method !== "CARD" && (
                <p className="mt-4 rounded-lg bg-sand px-3.5 py-3 text-[12px] font-medium leading-relaxed text-ink/75">
                  {dict.donate.methods[method]} — {dict.common.demoEnv}.
                </p>
              )}

              <div className="mt-4 grid grid-cols-1 gap-2.5">
                <Input
                  value={donorName}
                  onChange={(e) => setDonorName(e.target.value)}
                  placeholder={dict.donate.nameField}
                  className="h-11 rounded-xl border-border"
                />
                <Input
                  type="email"
                  value={donorEmail}
                  onChange={(e) => setDonorEmail(e.target.value)}
                  placeholder={dict.donate.emailField}
                  className="h-11 rounded-xl border-border"
                />
              </div>

              <div className="mt-5 flex items-center justify-between rounded-xl bg-petrol px-4 py-3.5 text-white">
                <div>
                  <p className="text-[10.5px] font-bold uppercase tracking-wider text-white/55">
                    {dict.donate.destinationLabel}
                  </p>
                  <p className="text-[13.5px] font-extrabold">{destinationLabel}</p>
                </div>
                <p className="text-[18px] font-extrabold text-coral">
                  {money(finalAmount, currency)}
                  {frequency === "MONTHLY" && <span className="text-[11px] font-semibold text-white/60">/m</span>}
                </p>
              </div>

              <DialogActions
                onBack={() => setStep(2)}
                onNext={confirmContribution}
                nextDisabled={busy || !amountValid}
                backLabel={dict.donate.back}
                nextLabel={dict.donate.confirm}
              />
            </div>
          )}

          {/* ── Step 4 · processing ── */}
          {step === 4 && (
            <div className="flex flex-col items-center py-10 text-center">
              <Loader2 className="h-10 w-10 animate-spin text-coral" aria-hidden />
              <p className="mt-5 text-[14px] font-bold text-petrol">{dict.donate.processing}</p>
              <p className="mt-1 text-[12.5px] text-muted-foreground">
                {money(finalAmount, currency)} → {destinationLabel}
              </p>
            </div>
          )}

          {/* ── Step 5 · thank you ── */}
          {step === 5 && receipt && (
            <div className="flex flex-col items-center py-2 text-center">
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-coral-soft text-coral">
                <PartyPopper className="h-7 w-7" aria-hidden />
              </span>
              <h3 className="mt-4 text-balance text-[19px] font-extrabold tracking-tight text-petrol">
                {dict.donate.thankYouTitle}
              </h3>
              <p className="mt-2 max-w-[300px] text-[12.5px] leading-relaxed text-muted-foreground">
                {dict.donate.thankYouText}
              </p>

              <dl className="mt-5 w-full space-y-2 rounded-xl border border-border bg-cream/60 p-4 text-left text-[12.5px]">
                <div className="flex justify-between">
                  <dt className="font-semibold text-muted-foreground">{dict.donate.amountLabel}</dt>
                  <dd className="font-extrabold text-petrol">
                    {money(finalAmount, currency)}
                    {frequency === "MONTHLY" ? " / mo" : ""}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="font-semibold text-muted-foreground">{dict.donate.destinationLabel}</dt>
                  <dd className="font-extrabold text-petrol">{destinationLabel}</dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="font-semibold text-muted-foreground">{dict.donate.statusLabel}</dt>
                  <dd className="inline-flex items-center gap-1 font-extrabold text-emerald-600">
                    <Check className="h-3.5 w-3.5" aria-hidden />
                    {dict.donate.statusPaid}
                  </dd>
                </div>
              </dl>

              <div className="mt-5 flex w-full flex-col gap-2.5">
                <Button
                  onClick={() => {
                    const text = encodeURIComponent(dict.donate.shareLabel);
                    if (navigator.share) {
                      navigator.share({ title: "MyPets", text, url: window.location.href }).catch(() => {});
                    } else {
                      navigator.clipboard.writeText(`${text}: ${window.location.href}`).catch(() => {});
                      toast({ title: dict.donate.shareCta + " ✓" });
                    }
                  }}
                  variant="outline"
                  className="h-11 rounded-xl border-border font-bold text-petrol hover:bg-sand"
                >
                  <Share2 className="mr-2 h-4 w-4" aria-hidden />
                  {dict.donate.shareCta}
                </Button>
                <Button
                  onClick={() => handleOpenChange(false)}
                  className="h-11 rounded-xl bg-coral font-bold text-white hover:bg-coral-dark"
                >
                  {dict.donate.closeCta}
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

function DialogActions({
  onBack,
  onNext,
  backLabel,
  nextLabel,
  nextDisabled,
}: {
  onBack?: () => void;
  onNext: () => void;
  backLabel?: string;
  nextLabel: string;
  nextDisabled?: boolean;
}) {
  const { dict } = useLocale();
  return (
    <div className="mt-6 flex items-center gap-2.5">
      {backLabel && onBack && (
        <Button
          variant="outline"
          onClick={onBack}
          className="h-12 flex-1 rounded-xl border-border font-bold text-petrol hover:bg-sand"
        >
          <ArrowLeft className="mr-1.5 h-4 w-4" aria-hidden />
          {backLabel}
        </Button>
      )}
      <Button
        onClick={onNext}
        disabled={nextDisabled}
        className="group h-12 flex-1 rounded-xl bg-coral font-bold text-white shadow-[0_10px_24px_-10px_rgba(255,98,88,0.6)] hover:bg-coral-dark disabled:opacity-50"
      >
        {nextLabel}
        <ArrowRight className="ml-1.5 h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
      </Button>
    </div>
  );
}
