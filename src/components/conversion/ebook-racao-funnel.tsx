"use client";

import * as React from "react";
import { BookOpen, Check, ChevronDown, Heart, PawPrint, ShieldCheck, Sparkles } from "lucide-react";
import { CauseCheckout } from "@/components/payments/cause-checkout";
import {
  solidarityAmountCents,
  solidarityEbooks,
  SOLIDARITY_EBOOK_UNIT_CENTS,
} from "@/lib/solidarity-ebooks";
import { BRAND } from "@/lib/brand";
import { cn } from "@/lib/utils";

const EBOOK_RACAO_BRL_CAUSE_ID = "9a7f1000-0000-4a11-8c01-000000000007";

const curatedPackSlugs: Record<number, string[]> = {
  1: ["cuidados-essenciais"],
  3: ["cuidados-essenciais", "treino-gentil", "50-ideias-enriquecimento"],
  5: ["cuidados-essenciais", "treino-gentil", "50-ideias-enriquecimento", "alimentacao-bem-estar", "linguagem-corporal-canina"],
  13: solidarityEbooks.map((ebook) => ebook.slug),
};

const packOptions = [
  { count: 1, label: "1 guia", impact: "1 kg", note: "R$ 12,90" },
  { count: 3, label: "Pack 3", impact: "3 kg", note: "R$ 38,70", featured: true },
  { count: 13, label: "Todos os 13", impact: "13 kg", note: "R$ 167,70" },
];

function money(cents: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
  }).format(cents / 100);
}

export function EbookRacaoFunnel({ paymentReady }: { paymentReady: boolean }) {
  const [selected, setSelected] = React.useState<string[]>(curatedPackSlugs[1]);
  const [showAll, setShowAll] = React.useState(false);

  const selectedEbooks = solidarityEbooks.filter((ebook) => selected.includes(ebook.slug));
  const count = Math.max(1, selectedEbooks.length);
  const amountCents = solidarityAmountCents(count);
  const impactLabel = count === 1 ? "1 kg de ração" : count + " kg de ração";

  React.useEffect(() => {
    if (typeof window === "undefined") return;
    const url = new URL(window.location.href);
    url.searchParams.set("kg", String(count));
    url.searchParams.set("ebooks", selected.join("."));
    window.history.replaceState(window.history.state, "", url);
  }, [count, selected]);

  function choosePack(packCount: number) {
    setSelected(curatedPackSlugs[packCount] ?? curatedPackSlugs[1]);
    setShowAll(false);
  }

  function toggleGuide(slug: string) {
    setSelected((current) => {
      if (current.includes(slug)) {
        if (current.length === 1) return current;
        return current.filter((item) => item !== slug);
      }
      return [...current, slug].slice(0, solidarityEbooks.length);
    });
  }

  const collectionHref =
    "/ebooks/acesso?next=" +
    encodeURIComponent("/ebooks/colecao") +
    "&books=" +
    encodeURIComponent(selectedEbooks.map((ebook) => ebook.slug).join(",")) +
    "&via=apoio-confirmado";

  return (
    <div className="rounded-[2rem] border border-white/10 bg-white p-5 text-petrol shadow-2xl shadow-black/20 sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.17em] text-emerald-700">
            R$ 12,90 = 1 eBook = 1 kg de ração
          </p>
          <h2 className="mt-1 text-2xl font-black tracking-tight">Escolha. Pague por Pix. Pronto.</h2>
          <p className="mt-2 text-xs leading-5 text-muted-foreground">
            Comece com 1 guia, escolha o Pack 3 ou leve os 13. A lista completa só aparece se quiser personalizar.
          </p>
        </div>
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-700">
          <PawPrint className="h-5 w-5" />
        </span>
      </div>

      <div className="mt-5 grid grid-cols-3 gap-2" aria-label="Escolher pack">
        {packOptions.map((pack) => {
          const active = selected.length === pack.count && !showAll;
          return (
            <button
              key={pack.count}
              type="button"
              onClick={() => choosePack(pack.count)}
              className={cn(
                "relative rounded-2xl border px-3 py-3 text-left transition",
                active
                  ? "border-petrol bg-petrol text-white shadow-sm"
                  : "border-border bg-[#fbfcfa] hover:border-petrol/30",
              )}
            >
              {pack.featured && (
                <span className={cn(
                  "absolute right-2 top-2 rounded-full px-2 py-0.5 text-[8px] font-black uppercase tracking-wide",
                  active ? "bg-emerald-300/15 text-emerald-200" : "bg-emerald-100 text-emerald-800",
                )}>
                  popular
                </span>
              )}
              <span className={cn("block text-[9px] font-black uppercase tracking-wide", active ? "text-emerald-300" : "text-emerald-700")}>
                {pack.impact}
              </span>
              <span className="mt-1 block text-sm font-black">{pack.label}</span>
              <span className={cn("mt-1 block text-[10px] font-bold", active ? "text-white/60" : "text-muted-foreground")}>
                {pack.note}
              </span>
            </button>
          );
        })}
      </div>

      <div className="mt-4 rounded-2xl border border-emerald-100 bg-emerald-50 p-4">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-[9px] font-black uppercase tracking-[0.14em] text-emerald-700">Sua escolha</p>
            <p className="mt-1 text-2xl font-black text-emerald-950">{money(amountCents)}</p>
            <p className="mt-1 text-[10px] font-semibold text-emerald-900/60">
              {count} {count === 1 ? "eBook digital" : "eBooks digitais"}
            </p>
          </div>
          <div className="text-right">
            <p className="text-3xl font-black text-emerald-700">{count} kg</p>
            <p className="text-[10px] font-bold text-emerald-900/60">garantidos após confirmação</p>
          </div>
        </div>

        <div className="mt-3 border-t border-emerald-200/70 pt-3">
          <p className="text-xs font-black text-emerald-950">
            {count === 1 ? selectedEbooks[0]?.shortTitle : count === 13 ? "Biblioteca completa · 13 guias" : selectedEbooks.map((ebook) => ebook.shortTitle).join(" · ")}
          </p>
          <button
            type="button"
            onClick={() => setShowAll((current) => !current)}
            className="mt-2 inline-flex items-center gap-1 text-[10px] font-black text-emerald-800 hover:text-emerald-950"
          >
            {showAll ? "Fechar personalização" : count === 1 ? "Trocar guia / ver todos os 13" : "Personalizar guias / ver todos os 13"}
            <ChevronDown className={cn("h-3.5 w-3.5 transition", showAll && "rotate-180")} />
          </button>
        </div>
      </div>

      {showAll && (
        <div className="mt-3 max-h-[360px] space-y-1.5 overflow-y-auto rounded-2xl border border-border bg-[#fbfcfa] p-2">
          {solidarityEbooks.map((ebook) => {
            const active = selected.includes(ebook.slug);
            return (
              <button
                key={ebook.slug}
                type="button"
                onClick={() => toggleGuide(ebook.slug)}
                className={cn(
                  "flex w-full items-center gap-3 rounded-xl border px-3 py-2.5 text-left transition",
                  active ? "border-emerald-200 bg-white" : "border-transparent bg-transparent hover:bg-white",
                )}
              >
                <span className={cn(
                  "flex h-5 w-5 shrink-0 items-center justify-center rounded-md border",
                  active ? "border-petrol bg-petrol text-white" : "border-border bg-white text-transparent",
                )}>
                  <Check className="h-3.5 w-3.5" />
                </span>
                <span className="min-w-0 flex-1 truncate text-xs font-black">{ebook.shortTitle}</span>
                <span className="shrink-0 text-[9px] font-black text-emerald-700">1 kg</span>
              </button>
            );
          })}
          <p className="px-2 pb-1 pt-2 text-[9px] leading-4 text-muted-foreground">
            Cada guia selecionado acrescenta exatamente R$ 12,90 e 1 kg ao compromisso da campanha.
          </p>
        </div>
      )}

      <div className="mt-4">
        {paymentReady ? (
          <CauseCheckout
            causeId={EBOOK_RACAO_BRL_CAUSE_ID}
            causeTitle="a campanha 1 eBook = 1 kg"
            currency="BRL"
            enabled
            presentation="campaign"
            lockedAmountCents={amountCents}
            rewardKeys={selectedEbooks.map((ebook) => ebook.slug)}
            campaignEyebrow="Próximo passo · Pix"
            campaignTitle={"Gerar Pix · " + money(amountCents)}
            campaignDescription={"CPF do titular é obrigatório. Para receber ou recuperar o acesso, informe email ou WhatsApp — um dos dois basta."}
            successActionHref={collectionHref}
            successActionLabel={selectedEbooks.length > 1 ? "Abrir meus eBooks" : "Abrir meu eBook"}
            requireContact
            autoOpenSuccessAction
            successShareCampaign="ebook_racao"
            successHeadline={"Pagamento confirmado · " + impactLabel + " garantido" + (count > 1 ? "s" : "") + "."}
            successDescription="Pagamento confirmado pelo servidor. Estamos abrindo o seu conteúdo automaticamente."
            successWhatsappUrl={BRAND.whatsappSupportUrl}
            successCommunityWhatsappUrl={BRAND.whatsappCommunityUrl}
            successFacebookGroupUrl={BRAND.facebookGroupUrl}
            successShareText={"Participei da campanha 1 eBook = 1 kg do MyPets e ajudei a garantir " + impactLabel + "."}
            successShareUrl="/ajudar/ebooks"
          />
        ) : (
          <div className="rounded-2xl border border-amber-100 bg-amber-50 p-5">
            <p className="text-sm font-black text-amber-950">
              O Pix fica disponível assim que a API confirmar a lane BRL desta campanha.
            </p>
          </div>
        )}
      </div>

      <div className="mt-4 flex items-center justify-center gap-2 border-t border-border pt-4 text-[10px] font-semibold text-muted-foreground">
        <Heart className="h-3.5 w-3.5 fill-emerald-500 text-emerald-500" />
        1 eBook = 1 kg · cobrança única · acesso após confirmação
      </div>
    </div>
  );
}
