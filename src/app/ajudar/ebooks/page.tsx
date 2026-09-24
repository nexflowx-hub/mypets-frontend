import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, BookOpen, CheckCircle2, Heart, LockKeyhole, PawPrint, ShieldCheck, Sparkles } from "lucide-react";
import { MyPetsLogo } from "@/components/brand/logo";
import { CampaignLandingTracker } from "@/components/conversion/campaign-landing-tracker";
import { CampaignShareButton } from "@/components/conversion/campaign-share-button";
import { EbookRacaoFunnel } from "@/components/conversion/ebook-racao-funnel";
import { getCampaignConfig } from "@/lib/campaign-landings";
import { solidarityEbooks } from "@/lib/solidarity-ebooks";

export const revalidate = 10;

export const metadata: Metadata = {
  title: "1 eBook = Ração | Campanha MyPets",
  description: "Participe com R$ 9,90, escolha um eBook de cuidados com cães e ajude o MyPets a colocar mais uma cota de alimentação em movimento.",
  alternates: { canonical: "/ajudar/ebooks" },
  openGraph: {
    title: "1 eBook = Ração — participe com R$ 9,90",
    description: "Escolha um guia digital, participe da campanha MyPets e transforme conhecimento em mais uma cota de alimentação.",
    url: "https://mypets.lat/ajudar/ebooks",
    siteName: "MyPets",
    type: "website",
    images: [{ url: "https://mypets.lat/ajudar/ebooks/opengraph-image", width: 1200, height: 630, alt: "1 eBook = Ração · MyPets" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "1 eBook = Ração · MyPets",
    description: "R$ 9,90 = um guia digital + uma cota de alimentação em movimento.",
    images: ["https://mypets.lat/ajudar/ebooks/opengraph-image"],
  },
};

export default async function EbookRacaoCampaignPage() {
  const config = await getCampaignConfig();
  const paymentReady = Boolean(
    config.paymentsLive &&
      config.paymentProvider === "xpayments" &&
      config.paymentCurrencies?.includes("BRL"),
  );

  return (
    <main className="min-h-screen bg-[#f8f6ef] text-petrol">
      <CampaignLandingTracker variant="ebook_racao_v1" />

      <header className="sticky top-0 z-40 border-b border-black/5 bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <Link href="/" aria-label="MyPets"><MyPetsLogo /></Link>
          <div className="flex items-center gap-3">
            <span className="hidden items-center gap-2 text-[11px] font-bold text-muted-foreground sm:inline-flex">
              <LockKeyhole className="h-3.5 w-3.5 text-emerald-700" /> Participação segura
            </span>
            <Link href="/ajudar" className="inline-flex min-h-10 items-center gap-2 rounded-full border border-border bg-white px-4 text-xs font-black text-petrol">
              <ArrowLeft className="h-3.5 w-3.5" /> Outras formas de ajudar
            </Link>
          </div>
        </div>
      </header>

      <section className="relative overflow-hidden bg-[#0f241b] text-white">
        <div className="absolute inset-0">
          <Image src="/images/card-alimentou.jpg" alt="" fill priority sizes="100vw" className="object-cover object-center opacity-45" />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(8,26,18,.97)_0%,rgba(8,26,18,.85)_46%,rgba(8,26,18,.48)_100%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_16%,rgba(74,222,128,.14),transparent_26%)]" />
        </div>

        <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-10 sm:px-6 lg:grid-cols-[minmax(0,1fr)_470px] lg:items-center lg:px-8 lg:py-16">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-emerald-300/20 bg-emerald-300/10 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.16em] text-emerald-200">
              <BookOpen className="h-3.5 w-3.5" /> Campanha solidária MyPets
            </span>
            <h1 className="mt-6 max-w-3xl text-balance text-5xl font-black leading-[.95] tracking-[-0.045em] sm:text-6xl lg:text-7xl">
              1 eBook <span className="text-emerald-300">= Ração.</span>
            </h1>
            <p className="mt-5 max-w-2xl text-lg font-semibold leading-8 text-white/78">
              Aprenda a cuidar melhor de um cão e ajude o MyPets a colocar alimento em movimento. Cada guia escolhido representa uma participação de <strong className="text-white">R$ 9,90</strong> e uma cota de alimentação.
            </p>

            <div className="mt-7 grid max-w-2xl gap-3 sm:grid-cols-3">
              {[
                ["Escolha", "um guia útil para si", BookOpen],
                ["Participe", "R$ 9,90 por eBook", Heart],
                ["Alimente", "1 cota por participação", PawPrint],
              ].map(([title, text, Icon]) => {
                const ItemIcon = Icon as typeof BookOpen;
                return (
                  <div key={title as string} className="rounded-2xl border border-white/10 bg-black/15 p-4 backdrop-blur-sm">
                    <ItemIcon className="h-5 w-5 text-emerald-300" />
                    <p className="mt-3 text-sm font-black">{title as string}</p>
                    <p className="mt-1 text-[11px] leading-4 text-white/55">{text as string}</p>
                  </div>
                );
              })}
            </div>

            <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-2 text-[11px] font-semibold text-white/55">
              <span className="inline-flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-emerald-300" /> Pix confirmado no backend</span>
              <span className="inline-flex items-center gap-1.5"><ShieldCheck className="h-4 w-4 text-emerald-300" /> Apoio recebido pelo MyPets</span>
              <span className="inline-flex items-center gap-1.5"><Sparkles className="h-4 w-4 text-emerald-300" /> eBook digital de agradecimento</span>
            </div>
          </div>

          <div id="participar" className="scroll-mt-24">
            <EbookRacaoFunnel paymentReady={paymentReady} />
          </div>
        </div>
      </section>

      <section className="border-b border-border bg-white">
        <div className="mx-auto grid max-w-7xl gap-0 px-4 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-8">
          {[
            ["Participação, não catálogo de loja", "O conteúdo digital funciona como recompensa de agradecimento e o apoio tem o MyPets como beneficiário."],
            ["Valor simples", "R$ 9,90 por guia selecionado, sem preço escondido no funil."],
            ["Destino identificado", "A campanha mede separadamente a origem, os materiais escolhidos e o apoio confirmado."],
            ["Impacto auditável", "Não inventamos quilos de ração. A equivalência física será publicada quando houver custo médio documentado."],
          ].map(([title, text]) => (
            <article key={title} className="border-b border-border/70 py-5 sm:px-4 lg:border-b-0 lg:border-r lg:last:border-r-0">
              <p className="text-xs font-black text-petrol">{title}</p>
              <p className="mt-1 text-[11px] leading-5 text-muted-foreground">{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-black uppercase tracking-[.16em] text-emerald-700">Escolha algo que realmente vai usar</p>
          <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">Conhecimento útil para si. Mais capacidade de alimentação para o projeto.</h2>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">Os primeiros guias foram pensados para dúvidas simples e recorrentes de quem vive com cães.</p>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          {solidarityEbooks.map((ebook) => (
            <article key={ebook.slug} className="group overflow-hidden rounded-3xl border border-border bg-white">
              <div className="relative h-44 overflow-hidden">
                <Image src={ebook.image} alt="" fill sizes="(min-width:1280px) 20vw, 50vw" className="object-cover transition duration-500 group-hover:scale-[1.03]" />
                <div className="absolute inset-0 bg-gradient-to-t from-petrol/55 to-transparent" />
                <span className="absolute left-3 top-3 rounded-full bg-white/95 px-2.5 py-1 text-[9px] font-black uppercase tracking-wide text-emerald-800">R$ 9,90</span>
              </div>
              <div className="p-5">
                <h3 className="text-base font-black">{ebook.shortTitle}</h3>
                <p className="mt-2 text-xs leading-5 text-muted-foreground">{ebook.promise}</p>
                <p className="mt-4 text-[10px] font-black uppercase tracking-wide text-emerald-700">1 guia · 1 cota de alimentação</p>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-8 text-center">
          <a href="#participar" className="inline-flex min-h-12 items-center gap-2 rounded-full bg-emerald-500 px-6 text-sm font-black text-white shadow-lg shadow-emerald-900/10">
            Quero escolher o meu eBook <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </section>

      <section className="bg-petrol text-white">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[.8fr_1.2fr] lg:items-center lg:px-8 lg:py-16">
          <div className="relative min-h-[350px] overflow-hidden rounded-[2rem]">
            <Image src="/images/cta-dog.jpg" alt="Cão representando a campanha de alimentação MyPets" fill sizes="(min-width:1024px) 42vw, 100vw" className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-transparent" />
            <div className="absolute bottom-0 p-6">
              <p className="font-serif text-2xl italic">“Conhecimento para uma família. Alimentação para uma causa.”</p>
            </div>
          </div>
          <div>
            <p className="text-xs font-black uppercase tracking-[.16em] text-emerald-300">Como funciona o dinheiro</p>
            <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">Não escondemos a mecânica atrás do eBook.</h2>
            <div className="mt-5 space-y-4 text-sm leading-7 text-white/68">
              <p>O pagamento é um apoio ao MyPets. O eBook é entregue como material digital de agradecimento e torna a participação mais útil, memorável e partilhável.</p>
              <p>A campanha regista a origem do visitante, os guias escolhidos, o valor do apoio e a confirmação financeira. QR Code gerado não conta como apoio recebido.</p>
              <p>A promessa “1 eBook = Ração” usa inicialmente uma <strong className="text-white">cota de alimentação</strong>. Quando tivermos compras recorrentes e recibos suficientes, o MyPets poderá publicar uma equivalência em gramas ou quilos baseada no custo real.</p>
            </div>
            <a href="#participar" className="mt-6 inline-flex min-h-12 items-center gap-2 rounded-full bg-emerald-500 px-6 text-sm font-black text-white">
              Participar com R$ 9,90 <Heart className="h-4 w-4 fill-white" />
            </a>
          </div>
        </div>
      </section>

      <section className="bg-[#eef8f2]">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-4 py-8 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
          <div>
            <p className="text-xs font-black uppercase tracking-[.16em] text-emerald-700">Faça esta ideia circular</p>
            <h2 className="mt-2 text-2xl font-black">Conhece alguém que gosta de cães e de boas causas?</h2>
          </div>
          <CampaignShareButton
            sharePath="/go/ebooks"
            shareText="Conheça a campanha 1 eBook = Ração do MyPets: escolha um guia digital sobre cães e transforme R$ 9,90 numa cota de alimentação."
            label="Partilhar a campanha"
          />
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <p className="text-center text-xs font-black uppercase tracking-[.16em] text-emerald-700">Perguntas importantes</p>
        <h2 className="mt-3 text-center text-3xl font-black tracking-tight">Antes de participar, saiba exatamente o que está a fazer.</h2>
        <div className="mt-7 space-y-3">
          {[
            ["Estou comprando um eBook?", "A experiência é apresentada pelo MyPets como participação solidária com recompensa digital. O apoio financeiro tem o MyPets como beneficiário; o enquadramento fiscal e documental da campanha deve permanecer coerente com a estrutura jurídica utilizada pelo MyPets."],
            ["Quanto custa cada participação?", "Cada eBook selecionado acrescenta R$ 9,90 ao apoio. Um guia = R$ 9,90; dois = R$ 19,80; três = R$ 29,70."],
            ["Quanto de ração representa R$ 9,90?", "Nesta primeira fase, R$ 9,90 representa uma cota de alimentação. Não publicamos peso artificial. Quando houver custo médio documentado das compras reais, a campanha poderá mostrar a equivalência física atualizada."],
            ["Quando recebo o eBook?", "O acesso aparece depois de o backend confirmar o pagamento. Gerar o QR Code não desbloqueia a etapa de agradecimento."],
            ["Posso escolher mais de um?", "Sim. Cada guia adicional acrescenta mais uma participação de R$ 9,90 e mais uma cota de alimentação."],
          ].map(([q, a]) => (
            <details key={q} className="rounded-2xl border border-border bg-white p-5">
              <summary className="cursor-pointer list-none text-sm font-black">{q}</summary>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">{a}</p>
            </details>
          ))}
        </div>
      </section>

      <footer className="bg-[#091a22] text-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-4 py-8 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
          <MyPetsLogo light />
          <div className="flex flex-wrap gap-4 text-xs font-bold text-white/55">
            <Link href="/ajudar">Apoiar MyPets</Link>
            <Link href="/legal/apoios">Como funcionam os apoios</Link>
            <Link href="/legal/privacidade">Privacidade</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
