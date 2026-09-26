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
import { BRAND } from "@/lib/brand";
import { recordGrowthEvent } from "@/lib/growth";
import { cn } from "@/lib/utils";

const EBOOK_RACAO_BRL_CAUSE_ID = "9a7f1000-0000-4a11-8c01-000000000007";

const petOptions = [
  { id: "dog", label: "Tenho cão", detail: "Quero cuidar ainda melhor." },
  { id: "cat", label: "Tenho gato", detail: "E também quero apoiar a causa." },
  { id: "other", label: "Tenho outro pet", detail: "Faço parte do mundo pet." },
  { id: "none", label: "Ainda não tenho", detail: "Mas gosto muito de animais." },
];

const experienceOptions = [
  { id: "new", label: "Menos de 1 ano", detail: "Ainda estou a descobrir muita coisa." },
  { id: "growing", label: "Entre 1 e 5 anos", detail: "Já tenho experiência, mas quero evoluir." },
  { id: "experienced", label: "Mais de 5 anos", detail: "Quero aprofundar e atualizar conhecimentos." },
  { id: "future", label: "Estou a preparar-me", detail: "Ainda não tenho pet ou estou a planear." },
];

const intents = [
  { id: "care", label: "Cuidados e rotina", detail: "Segurança, bem-estar e uma base sólida." },
  { id: "puppy", label: "Filhote / primeiros meses", detail: "Adaptação, sono, xixi, socialização e rotina." },
  { id: "training", label: "Treino e comportamento", detail: "Comandos úteis, comunicação e reforço positivo." },
  { id: "walks", label: "Passeios e vida urbana", detail: "Guia frouxa, farejo, reatividade e apartamento." },
  { id: "food", label: "Alimentação e higiene", detail: "Rotina alimentar, corpo, dentes, banho e grooming." },
  { id: "children", label: "Família e crianças", detail: "Convivência segura, supervisão e linguagem corporal." },
  { id: "breeds", label: "Raças, adoção e escolha", detail: "64 perfis, estilo de vida e decisão responsável." },
  { id: "enrichment", label: "Brincadeiras e gastar energia melhor", detail: "Farejo, desafios mentais e 50 atividades para cães." },
];

const bundleOptions = [
  { count: 1, label: "1 guia", impact: "1 kg", note: "Começar" },
  { count: 3, label: "3 guias", impact: "3 kg", note: "Mais escolhido" },
  { count: 5, label: "5 guias", impact: "5 kg", note: "Coleção essencial" },
  { count: 13, label: "Biblioteca completa", impact: "13 kg", note: "Maior impacto" },
];

function money(cents: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
  }).format(cents / 100);
}

export function EbookRacaoFunnel({ paymentReady }: { paymentReady: boolean }) {
  const [petType, setPetType] = React.useState("dog");
  const [experience, setExperience] = React.useState("new");
  const [interest, setInterest] = React.useState("care");
  const [quizStep, setQuizStep] = React.useState<1 | 2 | 3>(1);
  const [selected, setSelected] = React.useState<string[]>([recommendationMap.care]);
  const [step, setStep] = React.useState<1 | 2 | 3>(1);
  const [supportTotalCents, setSupportTotalCents] = React.useState<number | null>(null);
  const [customSupportTotal, setCustomSupportTotal] = React.useState("");
  const recommendedSlug = recommendationMap[interest];
  const amountCents = solidarityAmountCents(selected.length || 1);

  React.useEffect(() => {
    if (step !== 1) return;
    setSelected([recommendedSlug]);
  }, [recommendedSlug, step]);

  React.useEffect(() => {
    setSupportTotalCents(null);
    setCustomSupportTotal("");
  }, [amountCents]);

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
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      void recordGrowthEvent({
        eventName: "SUPPORT_STARTED",
        source: params.get("utm_source"),
        medium: params.get("utm_medium"),
        campaign: params.get("utm_campaign") ?? "ebook_racao_quiz_v3",
        content: params.get("utm_content") ?? "quiz_completed",
        landingPath: `${window.location.pathname}${window.location.search}`.slice(0, 500),
        metadata: {
          stage: "quiz_completed",
          petType,
          experience,
          interest,
          recommendedSlug,
        },
      });
    }
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
  const firstRoundedTarget = Math.ceil(amountCents / 1000) * 1000;
  const supportTargets = [...new Set([
    Math.max(amountCents, firstRoundedTarget),
    Math.max(amountCents, firstRoundedTarget + 1000),
    Math.max(amountCents, firstRoundedTarget + 3000),
  ])].filter((value) => value > amountCents);
  const customParsedCents = customSupportTotal.trim()
    ? Math.round((Number(customSupportTotal.replace(",", ".")) || 0) * 100)
    : 0;
  const selectedSupportTotal = customParsedCents >= amountCents
    ? customParsedCents
    : supportTotalCents && supportTotalCents >= amountCents
      ? supportTotalCents
      : amountCents;
  const topUpCents = Math.max(0, selectedSupportTotal - amountCents);
  const collectionHref = `/ebooks/acesso?next=${encodeURIComponent("/ebooks/colecao")}&books=${encodeURIComponent(selectedEbooks.map((ebook) => ebook.slug).join(","))}&via=apoio-confirmado`;

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
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.14em] text-emerald-700">Quiz rápido · 3 perguntas</p>
              <p className="mt-1 text-sm font-black">
                {quizStep === 1 ? "Qual é a sua ligação com pets?" : quizStep === 2 ? "Há quanto tempo faz parte do mundo pet?" : "O que seria mais útil para você agora?"}
              </p>
            </div>
            <span className="text-[10px] font-black text-petrol/45">{quizStep}/3</span>
          </div>

          {quizStep === 1 && (
            <div className="space-y-2">
              {petOptions.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => { setPetType(item.id); setQuizStep(2); }}
                  className={cn(
                    "flex w-full items-center justify-between gap-4 rounded-2xl border p-4 text-left transition",
                    petType === item.id ? "border-petrol bg-petrol text-white" : "border-border bg-[#fbfcfa] hover:border-petrol/25",
                  )}
                >
                  <div>
                    <p className="text-sm font-black">{item.label}</p>
                    <p className={cn("mt-1 text-[11px]", petType === item.id ? "text-white/60" : "text-muted-foreground")}>{item.detail}</p>
                  </div>
                  <ChevronRight className="h-4 w-4 shrink-0" />
                </button>
              ))}
            </div>
          )}

          {quizStep === 2 && (
            <div>
              <div className="space-y-2">
                {experienceOptions.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => { setExperience(item.id); setQuizStep(3); }}
                    className={cn(
                      "flex w-full items-center justify-between gap-4 rounded-2xl border p-4 text-left transition",
                      experience === item.id ? "border-petrol bg-petrol text-white" : "border-border bg-[#fbfcfa] hover:border-petrol/25",
                    )}
                  >
                    <div>
                      <p className="text-sm font-black">{item.label}</p>
                      <p className={cn("mt-1 text-[11px]", experience === item.id ? "text-white/60" : "text-muted-foreground")}>{item.detail}</p>
                    </div>
                    <ChevronRight className="h-4 w-4 shrink-0" />
                  </button>
                ))}
              </div>
              <button type="button" onClick={() => setQuizStep(1)} className="mt-2 w-full py-2 text-[11px] font-bold text-muted-foreground">Voltar</button>
            </div>
          )}

          {quizStep === 3 && (
            <div>
              {petType !== "dog" && (
                <div className="mb-3 rounded-xl bg-amber-50 p-3 text-[10px] leading-5 text-amber-900">
                  A coleção de lançamento é focada em cães. Pode continuar para apoiar a causa, escolher um guia para si/presentear e entrar na lista das próximas coleções para outros pets.
                </div>
              )}
              <div className="grid gap-2 sm:grid-cols-2">
                {intents.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setInterest(item.id)}
                    className={cn(
                      "flex min-h-20 items-center justify-between gap-3 rounded-2xl border p-3.5 text-left transition",
                      interest === item.id ? "border-petrol bg-petrol text-white" : "border-border bg-[#fbfcfa] hover:border-petrol/25",
                    )}
                  >
                    <div>
                      <p className="text-xs font-black">{item.label}</p>
                      <p className={cn("mt-1 text-[10px] leading-4", interest === item.id ? "text-white/60" : "text-muted-foreground")}>{item.detail}</p>
                    </div>
                    <ChevronRight className="h-4 w-4 shrink-0" />
                  </button>
                ))}
              </div>

              <div className="mt-4 rounded-2xl bg-emerald-50 p-4">
                <p className="text-[9px] font-black uppercase tracking-[0.14em] text-emerald-700">A nossa recomendação inicial</p>
                <p className="mt-1 text-sm font-black text-emerald-950">{solidarityEbooks.find((ebook) => ebook.slug === recommendedSlug)?.title}</p>
                <p className="mt-1 text-[10px] leading-4 text-emerald-900/65">Pode alterar esta escolha e comparar todos os 13 guias no próximo passo.</p>
              </div>

              <button
                type="button"
                onClick={continueToSelection}
                className="mt-4 flex min-h-14 w-full items-center justify-center gap-2 rounded-2xl bg-emerald-500 px-5 text-sm font-black text-white shadow-[0_16px_30px_-18px_rgba(16,185,129,.8)] transition hover:-translate-y-0.5 hover:bg-emerald-600"
              >
                Ver minha recomendação e opções <ChevronRight className="h-4 w-4" />
              </button>
              <button type="button" onClick={() => setQuizStep(2)} className="mt-2 w-full py-2 text-[11px] font-bold text-muted-foreground">Voltar</button>
            </div>
          )}
        </div>
      )}

      {step === 2 && (
        <div className="mt-6">
          <div className="rounded-2xl bg-emerald-50 p-4">
            <p className="text-[10px] font-black uppercase tracking-[0.14em] text-emerald-700">Recomendado para você</p>
            <p className="mt-1 text-base font-black text-emerald-950">{solidarityEbooks.find((ebook) => ebook.slug === recommendedSlug)?.title}</p>
            <p className="mt-1 text-xs leading-5 text-emerald-900/65">Comece com 1 kg ou aumente o gesto. Cada eBook adicional acrescenta exatamente mais 1 kg à participação.</p>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4" aria-label="Escolher impacto">
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
                      : bundle.count === 13
                        ? active ? "bg-amber-300/15 text-amber-100" : "bg-amber-50 text-amber-800"
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
                <p className="text-base font-black text-emerald-950">Você está garantindo {impactLabel}.</p>
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

          <div className="mt-4 rounded-2xl border border-emerald-100 bg-white p-4">
            <p className="text-xs font-black text-petrol">Quer reforçar o apoio?</p>
            <p className="mt-1 text-[11px] leading-5 text-muted-foreground">Opcional. O valor base continua a garantir exatamente {kg} kg e {selectedEbooks.length} {selectedEbooks.length === 1 ? "eBook" : "eBooks"}. Qualquer valor acima disso reforça o fundo de alimentação e a operação da campanha, sem criar eBooks ou kg adicionais automaticamente.</p>
            <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
              <button
                type="button"
                onClick={() => { setSupportTotalCents(amountCents); setCustomSupportTotal(""); }}
                className={cn(
                  "min-h-12 rounded-xl border px-3 text-xs font-black transition",
                  selectedSupportTotal === amountCents && !customSupportTotal ? "border-petrol bg-petrol text-white" : "border-border bg-[#f8faf9] text-petrol",
                )}
              >
                {money(amountCents)}
                <span className="mt-0.5 block text-[9px] font-semibold opacity-60">valor base</span>
              </button>
              {supportTargets.map((target, index) => (
                <button
                  key={target}
                  type="button"
                  onClick={() => { setSupportTotalCents(target); setCustomSupportTotal(""); }}
                  className={cn(
                    "min-h-12 rounded-xl border px-3 text-xs font-black transition",
                    selectedSupportTotal === target && !customSupportTotal ? "border-emerald-600 bg-emerald-50 text-emerald-900" : "border-border bg-[#f8faf9] text-petrol",
                  )}
                >
                  {money(target)}
                  <span className="mt-0.5 block text-[9px] font-semibold opacity-60">{index === 0 ? "arredondar" : `+${money(target - amountCents)}`}</span>
                </button>
              ))}
            </div>
            <div className="mt-3">
              <label htmlFor="ebook-support-total" className="text-[10px] font-black uppercase tracking-wide text-muted-foreground">Ou escolha outro valor total</label>
              <div className="mt-1 flex items-center rounded-xl border border-border bg-[#f8faf9] px-3">
                <span className="text-xs font-black text-petrol">R$</span>
                <input
                  id="ebook-support-total"
                  inputMode="decimal"
                  value={customSupportTotal}
                  onChange={(event) => { setCustomSupportTotal(event.target.value); setSupportTotalCents(null); }}
                  placeholder={(amountCents / 100).toFixed(2).replace(".", ",")}
                  className="h-11 w-full bg-transparent px-2 text-sm font-black text-petrol outline-none"
                />
              </div>
              {customSupportTotal && customParsedCents < amountCents && (
                <p className="mt-1 text-[10px] font-semibold text-amber-700">O valor total não pode ser inferior a {money(amountCents)}.</p>
              )}
            </div>
            <div className="mt-3 flex items-center justify-between rounded-xl bg-emerald-50 px-3 py-2.5">
              <span className="text-[10px] font-bold text-emerald-900/70">{topUpCents > 0 ? `Base ${money(amountCents)} + reforço ${money(topUpCents)}` : "Sem reforço adicional"}</span>
              <span className="text-sm font-black text-emerald-950">Total {money(selectedSupportTotal)}</span>
            </div>
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
                lockedAmountCents={selectedSupportTotal}
                rewardKeys={selectedEbooks.map((ebook) => ebook.slug)}
                campaignEyebrow="Participação solidária"
                campaignTitle={`${selectedEbooks.length} ${selectedEbooks.length === 1 ? "eBook" : "eBooks"} · ${impactLabel}`}
                campaignDescription={topUpCents > 0 ? `Total ${money(selectedSupportTotal)}: ${money(amountCents)} garante ${impactLabel} e ${money(topUpCents)} reforça o projeto.` : "Depois da confirmação financeira, seus eBooks serão liberados imediatamente."}
                successActionHref={collectionHref}
                successActionLabel={selectedEbooks.length > 1 ? "Abrir meus eBooks" : "Abrir meu eBook"}
                requireEmail
                successShareCampaign="ebook_racao"
                successHeadline={`Conseguimos — ${kg} ${kg === 1 ? "kg garantido" : "kg garantidos"}.`}
                successDescription={topUpCents > 0 ? `Pagamento confirmado: ${impactLabel} garantidos e mais ${money(topUpCents)} de reforço livre para a campanha.` : `Pagamento confirmado: ${impactLabel} garantidos. Os seus eBooks já estão liberados.`}
                successWhatsappUrl={BRAND.whatsappSupportUrl}
                successCommunityWhatsappUrl={BRAND.whatsappCommunityUrl}
                successFacebookGroupUrl={BRAND.facebookGroupUrl}
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
