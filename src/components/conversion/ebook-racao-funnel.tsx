"use client";

import * as React from "react";
import { BookOpen, Check, ChevronRight, Heart, PawPrint, Scale, Sparkles } from "lucide-react";
import { CauseCheckout } from "@/components/payments/cause-checkout";
import {
  recommendationMap,
  solidarityAmountCents,
  solidarityEbooks,
  SOLIDARITY_EBOOK_UNIT_CENTS,
} from "@/lib/solidarity-ebooks";
import { cn } from "@/lib/utils";

const EBOOK_RACAO_BRL_CAUSE_ID = "9a7f1000-0000-4a11-8c01-000000000007";

const intents = [
  { id: "care", label: "Quero cuidar melhor do meu cão", detail: "Rotina, segurança e bem-estar." },
  { id: "puppy", label: "Tenho ou vou receber um filhote", detail: "Primeiros dias e adaptação." },
  { id: "training", label: "Quero melhorar o treino", detail: "Comandos úteis e reforço positivo." },
  { id: "breeds", label: "Quero escolher ou conhecer melhor um cão", detail: "Perfis, raças e compatibilidade." },
  { id: "food", label: "Quero organizar alimentação e rotina", detail: "Hábitos consistentes e observação." },
];

const bundleOptions = [
  { count: 1, label: "1 eBook", impact: "1 kg", note: "Começar simples" },
  { count: 3, label: "3 eBooks", impact: "3 kg", note: "Sugerido" },
  { count: 5, label: "Coleção completa", impact: "5 kg", note: "Todos os guias" },
];

function money(cents: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
  }).format(cents / 100);
}

export function EbookRacaoFunnel({ paymentReady }: { paymentReady: boolean }) {
  const [interest, setInterest] = React.useState("care");
  const [selected, setSelected] = React.useState<string[]>([recommendationMap.care]);
  const [step, setStep] = React.useState<1 | 2 | 3>(1);
  const recommendedSlug = recommendationMap[interest];
  const amountCents = solidarityAmountCents(selected.length || 1);

  React.useEffect(() => {
    if (step !== 1) return;
    setSelected([recommendedSlug]);
  }, [recommendedSlug, step]);

  React.useEffect(() => {
    if (typeof window === "undefined") return;
    const url = new URL(window.location.href);
    url.searchParams.set("kg", String(Math.max(1, selected.length)));
    url.searchParams.set("ebooks", selected.join("."));
    window.history.replaceState(window.history.state, "", url);
  }, [selected]);

  function bundleSlugs(count: number) {
    const ordered = [
      recommendedSlug,
      ...solidarityEbooks.map((ebook) => ebook.slug).filter((slug) => slug !== recommendedSlug),
    ];
    return ordered.slice(0, count);
  }

  function chooseBundle(count: number) {
    setSelected(bundleSlugs(count));
  }

  function continueToSelection() {
    setSelected((current) => current.includes(recommendedSlug) ? current : [recommendedSlug]);
    setStep(2);
  }

  function toggle(slug: string) {
    setSelected((current) => {
      if (current.includes(slug)) {
        if (current.length === 1) return current;
        return current.filter((item) => item !== slug);
      }
      return [...current, slug].slice(0, solidarityEbooks.length);
    });
  }

  const selectedEbooks = solidarityEbooks.filter((ebook) => selected.includes(ebook.slug));
  const kg = Math.max(1, selectedEbooks.length);
  const impactLabel = `${kg} ${kg === 1 ? "kg" : "kg"} de ração`;
  const collectionHref = `/ebooks/colecao?books=${encodeURIComponent(selectedEbooks.map((ebook) => ebook.slug).join(","))}&via=apoio-confirmado`;

  return (
    <div className="rounded-[2rem] border border-white/10 bg-white p-5 text-petrol shadow-2xl shadow-black/20 sm:p-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.17em] text-emerald-700">R$ 12,90 = 1 eBook = 1 kg de ração</p>
          <h2 className="mt-1 text-2xl font-black tracking-tight">Escolha como quer participar.</h2>
        </div>
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-700">
          <BookOpen className="h-5 w-5" />
        </span>
      </div>

      <div className="mt-5 flex items-center gap-2" aria-label="Progresso do funil">
        {[1, 2, 3].map((item) => (
          <div key={item} className="flex flex-1 items-center gap-2">
            <span className={cn(
              "flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[11px] font-black",
              step >= item ? "bg-petrol text-white" : "bg-sand text-petrol/45",
            )}>
              {step > item ? <Check className="h-3.5 w-3.5" /> : item}
            </span>
            <span className={cn("hidden text-[10px] font-black uppercase tracking-wide sm:block", step >= item ? "text-petrol" : "text-petrol/35")}>
              {item === 1 ? "O que procura" : item === 2 ? "Impacto" : "Pix"}
            </span>
            {item < 3 && <span className="h-px flex-1 bg-border" />}
          </div>
        ))}
      </div>

      {step === 1 && (
        <div className="mt-6">
          <p className="text-sm font-black">Qual guia seria mais útil para si hoje?</p>
          <p className="mt-1 text-xs leading-5 text-muted-foreground">Uma pergunta, uma recomendação. No próximo passo pode mudar a escolha ou ampliar para 3 ou 5 kg.</p>
          <div className="mt-4 space-y-2">
            {intents.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setInterest(item.id)}
                className={cn(
                  "flex w-full items-center justify-between gap-4 rounded-2xl border p-4 text-left transition",
                  interest === item.id ? "border-petrol bg-petrol text-white" : "border-border bg-[#fbfcfa] hover:border-petrol/25",
                )}
              >
                <div>
                  <p className="text-sm font-black">{item.label}</p>
                  <p className={cn("mt-1 text-[11px]", interest === item.id ? "text-white/60" : "text-muted-foreground")}>{item.detail}</p>
                </div>
                <ChevronRight className="h-4 w-4 shrink-0" />
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={continueToSelection}
            className="mt-5 flex min-h-14 w-full items-center justify-center gap-2 rounded-2xl bg-emerald-500 px-5 text-sm font-black text-white shadow-[0_16px_30px_-18px_rgba(16,185,129,.8)] transition hover:-translate-y-0.5 hover:bg-emerald-600"
          >
            Continuar <ChevronRight className="h-4 w-4" />
          </button>
          <button type="button" onClick={() => { setSelected([recommendedSlug]); setStep(2); }} className="mt-2 w-full py-2 text-[11px] font-bold text-muted-foreground">
            Ver todos os eBooks
          </button>
        </div>
      )}

      {step === 2 && (
        <div className="mt-6">
          <div className="rounded-2xl bg-emerald-50 p-4">
            <p className="text-[10px] font-black uppercase tracking-[0.14em] text-emerald-700">Recomendado para si</p>
            <p className="mt-1 text-base font-black text-emerald-950">{solidarityEbooks.find((ebook) => ebook.slug === recommendedSlug)?.title}</p>
            <p className="mt-1 text-xs leading-5 text-emerald-900/65">Comece com 1 kg ou aumente o gesto. Cada eBook adicional acrescenta exatamente mais 1 kg à participação.</p>
          </div>

          <div className="mt-4 grid grid-cols-3 gap-2" aria-label="Escolher impacto">
            {bundleOptions.map((bundle) => {
              const active = selected.length === bundle.count;
              return (
                <button
                  key={bundle.count}
                  type="button"
                  onClick={() => chooseBundle(bundle.count)}
                  className={cn(
                    "rounded-2xl border px-2 py-3 text-center transition",
                    active ? "border-petrol bg-petrol text-white shadow-sm" : "border-border bg-white hover:border-petrol/25",
                  )}
                >
                  <span className={cn("block text-[9px] font-black uppercase tracking-wide", active ? "text-emerald-300" : "text-emerald-700")}>{bundle.impact}</span>
                  <span className="mt-1 block text-xs font-black">{bundle.label}</span>
                  <span className={cn(
                    "mx-auto mt-1 inline-flex rounded-full px-2 py-0.5 text-[8px] font-black uppercase tracking-wide",
                    bundle.count === 3
                      ? active ? "bg-emerald-300/15 text-emerald-200" : "bg-emerald-50 text-emerald-700"
                      : active ? "text-white/55" : "text-muted-foreground",
                  )}>{bundle.note}</span>
                  <span className={cn("mt-1 block text-[9px]", active ? "text-white/55" : "text-muted-foreground")}>{money(bundle.count * SOLIDARITY_EBOOK_UNIT_CENTS)}</span>
                </button>
              );
            })}
          </div>

          <p className="mt-5 text-[10px] font-black uppercase tracking-[0.14em] text-muted-foreground">Personalize os guias incluídos</p>
          <div className="mt-2 grid gap-2">
            {solidarityEbooks.map((ebook) => {
              const active = selected.includes(ebook.slug);
              const recommended = ebook.slug === recommendedSlug;
              return (
                <button
                  key={ebook.slug}
                  type="button"
                  onClick={() => toggle(ebook.slug)}
                  className={cn(
                    "flex items-start gap-3 rounded-2xl border p-3.5 text-left transition",
                    active ? "border-petrol bg-[#f5f8f8]" : "border-border bg-white hover:border-petrol/25",
                  )}
                >
                  <span className={cn(
                    "mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md border",
                    active ? "border-petrol bg-petrol text-white" : "border-border bg-white text-transparent",
                  )}>
                    <Check className="h-4 w-4" />
                  </span>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-sm font-black">{ebook.shortTitle}</p>
                      {recommended && <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[9px] font-black uppercase tracking-wide text-emerald-800">recomendado</span>}
                    </div>
                    <p className="mt-1 text-[11px] leading-4 text-muted-foreground">{ebook.promise}</p>
                  </div>
                  <span className="ml-auto shrink-0 rounded-full bg-emerald-50 px-2 py-1 text-[9px] font-black text-emerald-800">+1 kg</span>
                </button>
              );
            })}
          </div>

          <div className="mt-5 rounded-2xl border border-emerald-100 bg-emerald-50 p-4">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-[10px] font-black uppercase tracking-wide text-emerald-700">A sua participação</p>
                <p className="mt-1 text-2xl font-black text-emerald-950">{money(amountCents)}</p>
                <p className="mt-1 text-[10px] text-emerald-900/60">{selectedEbooks.length} {selectedEbooks.length === 1 ? "eBook digital" : "eBooks digitais"}</p>
              </div>
              <div className="text-right">
                <p className="text-3xl font-black text-emerald-700">{kg} kg</p>
                <p className="mt-1 text-[10px] font-bold text-emerald-900/60">de ração garantidos</p>
              </div>
            </div>
          </div>

          <div className="mt-4 flex gap-2">
            <button type="button" onClick={() => setStep(1)} className="min-h-12 rounded-xl border border-border px-4 text-xs font-black">Voltar</button>
            <button type="button" onClick={() => setStep(3)} className="flex min-h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-500 px-4 text-sm font-black text-white">
              Continuar <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="mt-6">
          <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-4">
            <div className="flex items-start gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-emerald-700"><Scale className="h-5 w-5" /></span>
              <div>
                <p className="text-base font-black text-emerald-950">Está a financiar {impactLabel}.</p>
                <p className="mt-1 text-[11px] leading-5 text-emerald-900/65">O compromisso da campanha é por peso: cada unidade confirmada de {money(SOLIDARITY_EBOOK_UNIT_CENTS)} garante 1 kg. Se o custo de compra variar, o MyPets completa a diferença necessária para preservar os kg já confirmados e pode rever o valor apenas para novas participações.</p>
              </div>
            </div>
          </div>

          <div className="mt-4 space-y-2">
            {selectedEbooks.map((ebook) => (
              <div key={ebook.slug} className="flex items-center justify-between gap-3 rounded-xl border border-border bg-white px-3 py-3">
                <span className="text-xs font-black">{ebook.shortTitle}</span>
                <span className="text-[10px] font-black text-emerald-700">1 eBook · 1 kg</span>
              </div>
            ))}
          </div>

          <div className="mt-4 rounded-xl bg-sand/55 p-3 text-[10px] leading-5 text-muted-foreground">
            <strong className="text-petrol">Como é contado:</strong> o pagamento é um apoio ao fundo MyPets desta campanha. O eBook é a recompensa digital. QR Code gerado não conta; a unidade só é considerada confirmada quando o backend recebe/reconcilia o estado financeiro como concluído.
          </div>

          <div className="mt-5">
            {paymentReady ? (
              <CauseCheckout
                causeId={EBOOK_RACAO_BRL_CAUSE_ID}
                causeTitle="a campanha 1 eBook = 1 kg"
                currency="BRL"
                enabled
                presentation="campaign"
                lockedAmountCents={amountCents}
                campaignEyebrow="Participação solidária"
                campaignTitle={`${selectedEbooks.length} ${selectedEbooks.length === 1 ? "eBook" : "eBooks"} · ${impactLabel}`}
                campaignDescription="Depois da confirmação financeira, terá acesso imediato à coleção digital selecionada."
                successActionHref={collectionHref}
                successActionLabel={selectedEbooks.length > 1 ? "Abrir meus eBooks" : "Abrir meu eBook"}
                successShareText={`Participei da campanha 1 eBook = 1 kg do MyPets e ajudei a garantir ${impactLabel}. Também recebi ${selectedEbooks.length === 1 ? "um guia digital" : "a minha coleção de guias digitais"} sobre cães.`}
                successShareUrl="/ajudar/ebooks"
              />
            ) : (
              <div className="rounded-2xl border border-amber-100 bg-amber-50 p-5">
                <p className="text-sm font-black text-amber-950">O funil está pronto; o Pix só aparece quando a lane BRL e o fundo desta campanha estiverem confirmados pela API.</p>
              </div>
            )}
          </div>

          <button type="button" onClick={() => setStep(2)} className="mt-3 w-full py-2 text-xs font-black text-muted-foreground">Alterar impacto ou eBooks</button>
        </div>
      )}

      <div className="mt-5 flex items-center justify-center gap-2 border-t border-border pt-4 text-[10px] font-semibold text-muted-foreground">
        <Heart className="h-3.5 w-3.5 fill-emerald-500 text-emerald-500" />
        1 eBook = 1 kg · recompensa digital · confirmação financeira no backend
        <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
      </div>
    </div>
  );
}
