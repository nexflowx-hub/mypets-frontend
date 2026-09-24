import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  Heart,
  HeartHandshake,
  LockKeyhole,
  PawPrint,
  ShieldCheck,
  ShoppingBag,
  UsersRound,
} from "lucide-react";
import { MyPetsLogo } from "@/components/brand/logo";
import { CampaignLandingTracker } from "@/components/conversion/campaign-landing-tracker";
import { CampaignShareButton, ShareFallbackNote } from "@/components/conversion/campaign-share-button";
import { CauseCheckout } from "@/components/payments/cause-checkout";
import { getCampaignConfig } from "@/lib/campaign-landings";

export const revalidate = 10;

export const metadata: Metadata = {
  title: "PetsKids — uma pequena iniciativa pode alimentar muitas histórias | MyPets",
  description:
    "Conheça o PetsKids, uma iniciativa comunitária do Centro-Oeste, e apoie a estrutura MyPets que ajuda projetos como este a ganhar organização, visibilidade e capacidade.",
  alternates: { canonical: "/ajudar/petskids" },
  openGraph: {
    title: "Eles começaram comprando ração no bairro. Ajude esta história a ir mais longe.",
    description:
      "Conheça o PetsKids e apoie a estrutura MyPets que ajuda iniciativas reais de proteção animal a ganhar visibilidade e capacidade.",
    url: "https://mypets.lat/ajudar/petskids",
    siteName: "MyPets",
    type: "website",
    images: [{ url: "https://mypets.lat/ajudar/petskids/opengraph-image", width: 1200, height: 630, alt: "PetsKids e MyPets" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "PetsKids + MyPets",
    description: "Uma pequena iniciativa local pode crescer quando encontra uma comunidade pronta para ajudar.",
    images: ["https://mypets.lat/ajudar/petskids/opengraph-image"],
  },
};

const MYPETS_GENERAL_BRL_CAUSE_ID = "9a7f1000-0000-4a11-8c01-000000000001";

export default async function PetsKidsCampaignPage() {
  const paymentConfig = await getCampaignConfig();
  const paymentReady = Boolean(
    paymentConfig.paymentsLive &&
      paymentConfig.paymentProvider === "xpayments" &&
      paymentConfig.paymentCurrencies?.includes("BRL"),
  );

  return (
    <main className="min-h-screen bg-[#f8f7f2] text-petrol">
      <CampaignLandingTracker variant="donation_petskids_v1" />

      <header className="sticky top-0 z-40 border-b border-black/5 bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <Link href="/" aria-label="MyPets"><MyPetsLogo /></Link>
          <div className="flex items-center gap-3">
            <span className="hidden items-center gap-2 text-[11px] font-bold text-muted-foreground sm:inline-flex">
              <LockKeyhole className="h-3.5 w-3.5 text-emerald-700" /> Ambiente seguro
            </span>
            <Link href="/ajudar" className="inline-flex min-h-10 items-center gap-2 rounded-full border border-border bg-white px-4 text-xs font-black text-petrol">
              <ArrowLeft className="h-3.5 w-3.5" /> Campanha MyPets
            </Link>
          </div>
        </div>
      </header>

      <section className="relative overflow-hidden bg-[#12231b] text-white">
        <div className="absolute inset-0">
          <Image src="/images/card-alimentou.jpg" alt="" fill priority sizes="100vw" className="object-cover object-center opacity-75" />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(8,26,18,.96)_0%,rgba(8,26,18,.83)_46%,rgba(8,26,18,.35)_76%,rgba(8,26,18,.20)_100%)]" />
        </div>

        <div className="relative mx-auto grid max-w-7xl gap-9 px-4 py-10 sm:px-6 lg:grid-cols-[minmax(0,1.08fr)_440px] lg:items-center lg:px-8 lg:py-16">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/8 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.16em] text-white/85">
              <PawPrint className="h-3.5 w-3.5 text-emerald-300" /> Projeto em integração · Centro-Oeste
            </span>
            <h1 className="mt-6 max-w-3xl text-balance text-4xl font-black leading-[1.02] tracking-[-0.035em] sm:text-5xl lg:text-6xl">
              Duas crianças começaram com <span className="text-emerald-300">sacos de ração.</span>
            </h1>
            <p className="mt-5 max-w-2xl text-lg font-semibold leading-8 text-white/80">
              O PetsKids nasceu de uma atitude simples: comprar ração no comércio do bairro e alimentar cães em situação de rua. O MyPets quer ajudar esta história a ganhar estrutura, visibilidade e continuidade.
            </p>

            <div className="mt-7 grid max-w-2xl gap-3 sm:grid-cols-3">
              {[
                ["Ação local", "na própria comunidade", ShoppingBag],
                ["Proteção infantil", "sem expor dados dos menores", ShieldCheck],
                ["Estrutura MyPets", "para organizar e ampliar", HeartHandshake],
              ].map(([title, text, Icon]) => {
                const ItemIcon = Icon as typeof PawPrint;
                return (
                  <div key={title as string} className="flex items-start gap-3 rounded-2xl border border-white/10 bg-black/15 p-3.5 backdrop-blur-sm">
                    <ItemIcon className="mt-0.5 h-5 w-5 shrink-0 text-emerald-300" />
                    <div><p className="text-xs font-black">{title as string}</p><p className="mt-0.5 text-[10px] leading-4 text-white/55">{text as string}</p></div>
                  </div>
                );
              })}
            </div>
          </div>

          <div id="doar" className="scroll-mt-24">
            {paymentReady ? (
              <CauseCheckout
                causeId={MYPETS_GENERAL_BRL_CAUSE_ID}
                causeTitle="o MyPets"
                currency="BRL"
                enabled
                presentation="campaign"
                defaultAmountCents={5000}
                campaignEyebrow="Ajude histórias como esta a crescer"
                campaignTitle="Escolha o valor do seu apoio"
                campaignDescription="O beneficiário financeiro desta página é o MyPets. O apoio mantém a estrutura que integra, verifica e desenvolve iniciativas elegíveis como o PetsKids."
                successShareText="Conheci o PetsKids através do MyPets: duas crianças transformando pequenas compras de ração em cuidado para cães de rua. Vale conhecer esta história."
                successShareUrl="/ajudar/petskids"
              />
            ) : (
              <div className="rounded-[1.75rem] bg-white p-6 text-petrol shadow-2xl">
                <ShieldCheck className="h-8 w-8 text-amber-600" />
                <h2 className="mt-4 text-2xl font-black">A história está disponível; o Pix só aparece quando a lane BRL estiver confirmada.</h2>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">Não geramos cobrança quando a API não confirma a operação financeira.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="border-b border-border bg-white">
        <div className="mx-auto grid max-w-7xl gap-4 px-4 py-6 sm:grid-cols-3 sm:px-6 lg:px-8">
          <div className="flex gap-3"><BadgeCheck className="mt-0.5 h-5 w-5 text-emerald-700" /><div><p className="text-sm font-black">História identificada</p><p className="mt-1 text-xs leading-5 text-muted-foreground">PetsKids entra como projeto em integração, não como campanha financeira autônoma.</p></div></div>
          <div className="flex gap-3"><ShieldCheck className="mt-0.5 h-5 w-5 text-emerald-700" /><div><p className="text-sm font-black">Menores protegidos</p><p className="mt-1 text-xs leading-5 text-muted-foreground">Sem exposição de dados pessoais e sem repasse financeiro direto a crianças.</p></div></div>
          <div className="flex gap-3"><LockKeyhole className="mt-0.5 h-5 w-5 text-emerald-700" /><div><p className="text-sm font-black">Pix confirmado no backend</p><p className="mt-1 text-xs leading-5 text-muted-foreground">QR Code gerado não é tratado como pagamento concluído.</p></div></div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid gap-8 lg:grid-cols-[1fr_.9fr] lg:items-center">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.16em] text-emerald-700">O que torna esta história especial</p>
            <h2 className="mt-3 text-balance text-3xl font-black tracking-tight sm:text-4xl">Não nasceu de uma grande estrutura. Nasceu de alguém decidir fazer alguma coisa.</h2>
            <p className="mt-5 text-sm leading-7 text-muted-foreground">
              O modelo é simples: comprar alimento, ir até onde estão os animais e distribuir. O desafio é transformar uma iniciativa espontânea numa história que consiga continuar, crescer e demonstrar impacto sem perder a simplicidade que a fez começar.
            </p>
            <div className="mt-6 rounded-3xl border border-emerald-100 bg-emerald-50 p-5">
              <p className="text-sm font-black text-emerald-900">O papel do MyPets nesta fase</p>
              <p className="mt-2 text-sm leading-6 text-emerald-900/70">Organizar o projeto, proteger os menores, trabalhar com um responsável adulto, criar transparência e preparar uma estrutura de acompanhamento antes de qualquer fundo dedicado.</p>
            </div>
          </div>

          <div className="relative min-h-[390px] overflow-hidden rounded-[2rem] bg-sand">
            <Image src="/images/card-alimentou.jpg" alt="Apoio alimentar a cães em situação de rua" fill sizes="(min-width:1024px) 46vw, 100vw" className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-petrol/85 via-transparent to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-6 text-white">
              <p className="font-serif text-2xl italic">“Uma atitude pequena pode ser enorme para quem estava com fome.”</p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-12 lg:py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-5 md:grid-cols-3">
            {[
              ["1", "Conhecer", "Apresentamos a história e o contexto de forma pública e responsável."],
              ["2", "Verificar", "Ligamos o projeto a um responsável adulto e organizamos as evidências necessárias."],
              ["3", "Acompanhar", "Evoluímos para metas, compras, recibos, entregas e atualizações quando a operação estiver pronta."],
            ].map(([number, title, text]) => (
              <article key={number} className="rounded-3xl border border-border bg-[#fbfcfa] p-6">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-petrol text-sm font-black text-white">{number}</span>
                <h3 className="mt-4 text-xl font-black">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-[#eef8f2]">
        <div className="mx-auto flex max-w-6xl flex-col gap-5 px-4 py-8 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.16em] text-emerald-700">Faça a história circular</p>
            <h2 className="mt-2 text-2xl font-black text-petrol">Nem todo apoio precisa começar com dinheiro.</h2>
            <div className="mt-2"><ShareFallbackNote /></div>
          </div>
          <CampaignShareButton
            sharePath="/go/petskids"
            shareText="Conheça o PetsKids: duas crianças do Centro-Oeste transformando pequenas compras de ração em cuidado para cães em situação de rua."
            label="Partilhar o PetsKids"
          />
        </div>
      </section>

      <section className="bg-[#0b291b] text-white">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[1fr_420px] lg:items-center lg:px-8 lg:py-16">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.16em] text-emerald-300">Ajude o MyPets a construir mais histórias assim</p>
            <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">O apoio de hoje financia capacidade. A capacidade permite chegar a mais projetos amanhã.</h2>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-white/68">O apoio desta página é institucional para o MyPets, não um repasse direto ao PetsKids. É essa separação que nos permite crescer com responsabilidade.</p>
          </div>
          {paymentReady && (
            <CauseCheckout
              causeId={MYPETS_GENERAL_BRL_CAUSE_ID}
              causeTitle="o MyPets"
              currency="BRL"
              enabled
              presentation="campaign"
              defaultAmountCents={5000}
              campaignEyebrow="Apoio institucional"
              campaignTitle="Coloque esta estrutura em movimento"
              campaignDescription="Escolha um valor e gere o Pix sem sair do MyPets."
              successShareText="Conheci o PetsKids através do MyPets. É uma história simples, local e bonita de cuidado com cães em situação de rua."
              successShareUrl="/ajudar/petskids"
            />
          )}
        </div>
      </section>

      <footer className="bg-petrol text-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-4 py-8 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
          <MyPetsLogo light />
          <div className="flex flex-wrap gap-4 text-xs font-bold text-white/55">
            <Link href="/ajudar" className="hover:text-white">Campanha MyPets</Link>
            <Link href="/projetos/petskids" className="hover:text-white">Projeto PetsKids</Link>
            <Link href="/legal/apoios" className="hover:text-white">Apoios</Link>
          </div>
        </div>
      </footer>

      {paymentReady && (
        <a href="#doar" className="fixed inset-x-4 bottom-4 z-50 flex min-h-14 items-center justify-center gap-2 rounded-2xl bg-emerald-500 px-5 text-base font-black text-white shadow-2xl shadow-black/25 md:hidden">
          <Heart className="h-5 w-5 fill-white" /> Quero ajudar esta história
        </a>
      )}
    </main>
  );
}
