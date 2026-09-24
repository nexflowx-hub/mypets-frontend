"use client";

import * as React from "react";
import { BookOpen, Check, ChevronRight, Heart, PawPrint, Sparkles } from "lucide-react";
import { CauseCheckout } from "@/components/payments/cause-checkout";
import {
  FEED_EQUIVALENT_GRAMS,
  recommendationMap,
  solidarityAmountCents,
  solidarityEbooks,
  SOLIDARITY_EBOOK_UNIT_CENTS,
} from "@/lib/solidarity-ebooks";
import { cn } from "@/lib/utils";

const MYPETS_GENERAL_BRL_CAUSE_ID = "9a7f1000-0000-4a11-8c01-000000000001";

const intents = [
  { id: "care", label: "Quero cuidar melhor do meu cão", detail: "Rotina, segurança e bem-estar." },
  { id: "puppy", label: "Tenho ou vou receber um filhote", detail: "Primeiros dias e adaptação." },
  { id: "training", label: "Quero melhorar o treino", detail: "Comandos úteis e reforço positivo." },
  { id: "breeds", label: "Quero conhecer melhor perfis e raças", detail: "Compatibilidade antes da escolha." },
  { id: "food", label: "Quero organizar alimentação e rotina", detail: "Hábitos consistentes e observação." },
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
  const firstSelected = selectedEbooks[0] ?? solidarityEbooks[0];
  const impactLabel = FEED_EQUIVALENT_GRAMS
    ? `${selectedEbooks.length * FEED_EQUIVALENT_GRAMS} g de ração equivalente`
    : `${selectedEbooks.length} ${selectedEbooks.length === 1 ? "cota" : "cotas"} de alimentação`;

  return (
    <div className="rounded-[2rem] border border-white/10 bg-white p-5 text-petrol shadow-2xl shadow-black/20 sm:p-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.17em] text-emerald-700">1 eBook = 1 cota de alimentação</p>
          <h2 className="mt-1 text-2xl font-black tracking-tight">Escolha como quer participar.</h2>
        </div>
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-700">
          <BookOpen className="h-5 w-5" />
        </span>
      </div>

      <div className="mt-5 flex items-center gap-2">
        {[1, 2, 3].map((item) => (
          <div key={item} className="flex flex-1 items-center gap-2">
            <span className={cn(
              "flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[11px] font-black",
              step >= item ? "bg-petrol text-white" : "bg-sand text-petrol/45",
            )}>
              {step > item ? <Check className="h-3.5 w-3.5" /> : item}
            </span>
            <span className={cn("hidden text-[10px] font-black uppercase tracking-wide sm:block", step >= item ? "text-petrol" : "text-petrol/35")}>
              {item === 1 ? "Perfil" : item === 2 ? "eBooks" : "Participar"}
            </span>
            {item < 3 && <span className="h-px flex-1 bg-border" />}
          </div>
        ))}
      </div>

      {step === 1 && (
        <div className="mt-6">
          <p className="text-sm font-black">Qual destes temas combina mais consigo hoje?</p>
          <p className="mt-1 text-xs leading-5 text-muted-foreground">Usamos a resposta apenas para recomendar o primeiro guia. Pode escolher outro no passo seguinte.</p>
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
            className="mt-5 flex min-h-13 w-full items-center justify-center gap-2 rounded-2xl bg-emerald-500 px-5 text-sm font-black text-white transition hover:bg-emerald-600"
          >
            Ver o meu guia recomendado <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}

      {step === 2 && (
        <div className="mt-6">
          <div className="rounded-2xl bg-emerald-50 p-4">
            <p className="text-[10px] font-black uppercase tracking-[0.14em] text-emerald-700">Recomendado para si</p>
            <p className="mt-1 text-base font-black text-emerald-950">{solidarityEbooks.find((ebook) => ebook.slug === recommendedSlug)?.title}</p>
            <p className="mt-1 text-xs leading-5 text-emerald-900/65">Pode ficar apenas com este ou acrescentar outros guias. Cada guia escolhido representa mais uma participação de {money(SOLIDARITY_EBOOK_UNIT_CENTS)}.</p>
          </div>

          <div className="mt-4 grid gap-3">
            {solidarityEbooks.map((ebook) => {
              const active = selected.includes(ebook.slug);
              const recommended = ebook.slug === recommendedSlug;
              return (
                <button
                  key={ebook.slug}
                  type="button"
                  onClick={() => toggle(ebook.slug)}
                  className={cn(
                    "flex items-start gap-3 rounded-2xl border p-4 text-left transition",
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
                    <p className="mt-1 text-[11px] leading-5 text-muted-foreground">{ebook.promise}</p>
                  </div>
                  <span className="ml-auto shrink-0 text-xs font-black text-petrol">{money(SOLIDARITY_EBOOK_UNIT_CENTS)}</span>
                </button>
              );
            })}
          </div>

          <div className="mt-5 rounded-2xl border border-border bg-sand/50 p-4">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-[10px] font-black uppercase tracking-wide text-muted-foreground">A sua participação</p>
                <p className="mt-1 text-2xl font-black">{money(amountCents)}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-black text-emerald-700">{impactLabel}</p>
                <p className="mt-1 text-[10px] text-muted-foreground">{selectedEbooks.length} {selectedEbooks.length === 1 ? "guia digital" : "guias digitais"}</p>
              </div>
            </div>
          </div>

          <div className="mt-4 flex gap-2">
            <button type="button" onClick={() => setStep(1)} className="min-h-11 rounded-xl border border-border px-4 text-xs font-black">Voltar</button>
            <button type="button" onClick={() => setStep(3)} className="flex min-h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-500 px-4 text-sm font-black text-white">
              Continuar para o apoio <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="mt-6">
          <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-4">
            <div className="flex items-start gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-emerald-700"><PawPrint className="h-4 w-4" /></span>
              <div>
                <p className="text-sm font-black text-emerald-950">{impactLabel}</p>
                <p className="mt-1 text-[11px] leading-5 text-emerald-900/65">O apoio é recebido pelo MyPets. Os eBooks são materiais digitais de agradecimento e não alteram a separação contabilística dos fundos do projeto.</p>
              </div>
            </div>
          </div>

          <div className="mt-4 space-y-2">
            {selectedEbooks.map((ebook) => (
              <div key={ebook.slug} className="flex items-center justify-between gap-3 rounded-xl border border-border bg-white px-3 py-3">
                <span className="text-xs font-black">{ebook.shortTitle}</span>
                <span className="text-[10px] font-black text-emerald-700">incluído</span>
              </div>
            ))}
          </div>

          <p className="mt-4 text-[11px] leading-5 text-muted-foreground">
            A equivalência física em gramas ou quilos será mostrada quando o MyPets tiver um custo médio documentado das compras de ração. Até lá, a campanha usa a unidade auditável “cota de alimentação”.
          </p>

          <div className="mt-5">
            {paymentReady ? (
              <CauseCheckout
                causeId={MYPETS_GENERAL_BRL_CAUSE_ID}
                causeTitle="o MyPets"
                currency="BRL"
                enabled
                presentation="campaign"
                lockedAmountCents={amountCents}
                campaignEyebrow="Participação solidária"
                campaignTitle={`${selectedEbooks.length} ${selectedEbooks.length === 1 ? "eBook" : "eBooks"} · ${impactLabel}`}
                campaignDescription="Depois da confirmação financeira, o MyPets libera o acesso aos materiais digitais selecionados."
                trackingCampaignOverride="ebook_racao"
                trackingContentOverride={`ebooks:${selectedEbooks.map((ebook) => ebook.slug).join("+")}`.slice(0, 180)}
                successActionHref={`/ebooks/${firstSelected.slug}?via=apoio-confirmado`}
                successActionLabel={selectedEbooks.length > 1 ? "Abrir primeiro eBook" : "Abrir meu eBook"}
                successShareText="Participei da campanha 1 eBook = Ração do MyPets. Além de receber um guia digital, ajudei a colocar mais uma cota de alimentação em movimento."
                successShareUrl="/ajudar/ebooks"
              />
            ) : (
              <div className="rounded-2xl border border-amber-100 bg-amber-50 p-5">
                <p className="text-sm font-black text-amber-950">O funil está pronto; o Pix só aparece quando a lane BRL estiver confirmada pela API.</p>
              </div>
            )}
          </div>

          <button type="button" onClick={() => setStep(2)} className="mt-3 w-full py-2 text-xs font-black text-muted-foreground">Alterar os eBooks escolhidos</button>
        </div>
      )}

      <div className="mt-5 flex items-center justify-center gap-2 border-t border-border pt-4 text-[10px] font-semibold text-muted-foreground">
        <Heart className="h-3.5 w-3.5 fill-emerald-500 text-emerald-500" />
        Participação solidária · recompensa digital · confirmação financeira no backend
        <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
      </div>
    </div>
  );
}
