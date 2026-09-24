import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BookOpen, CheckCircle2, Heart, LockKeyhole, PawPrint, ShieldCheck, Sparkles } from "lucide-react";
import { MyPetsLogo } from "@/components/brand/logo";
import { CampaignLandingTracker } from "@/components/conversion/campaign-landing-tracker";
import { CampaignShareButton } from "@/components/conversion/campaign-share-button";
import { EbookRacaoFunnel } from "@/components/conversion/ebook-racao-funnel";
import { getCampaignConfig } from "@/lib/campaign-landings";
import { apiGet } from "@/lib/api";
import { solidarityEbooks, SOLIDARITY_EBOOK_UNIT_CENTS } from "@/lib/solidarity-ebooks";

export const revalidate = 10;

export const metadata: Metadata = {
  title: "1 eBook = 1 kg de Ração | Campanha MyPets",
  description: "Participe com R$ 12,90, escolha um eBook de cuidados com cães e ajude o MyPets a financiar 1 kg de ração.",
  alternates: { canonical: "/ajudar/ebooks" },
  openGraph: {
    title: "1 eBook = 1 kg de Ração — participe com R$ 12,90",
    description: "Escolha um guia digital e transforme uma participação de R$ 12,90 em 1 kg de ração garantido.",
    url: "https://mypets.lat/ajudar/ebooks",
    siteName: "MyPets",
    type: "website",
    images: [{ url: "https://mypets.lat/ajudar/ebooks/opengraph-image", width: 1200, height: 630, alt: "1 eBook = 1 kg de Ração · MyPets" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "1 eBook = 1 kg de Ração · MyPets",
    description: "R$ 12,90 = um guia digital + 1 kg de ração garantido.",
    images: ["https://mypets.lat/ajudar/ebooks/opengraph-image"],
  },
};

type Envelope<T> = { data: T };
type CampaignCause = {
  raisedAmountCents: number;
  targetAmountCents: number | null;
};

async function getCampaignCause(): Promise<CampaignCause | null> {
  try {
    return (await apiGet<Envelope<CampaignCause>>("/causes/mypets-ebook-racao-brl")).data;
  } catch {
    return null;
  }
}

export default async function EbookRacaoCampaignPage() {
  const [config, campaignCause] = await Promise.all([getCampaignConfig(), getCampaignCause()]);
  const paymentReady = Boolean(
    config.paymentsLive &&
      config.paymentProvider === "xpayments" &&
      config.paymentCurrencies?.includes("BRL"),
  );
  const confirmedKg = campaignCause ? Math.floor(campaignCause.raisedAmountCents / SOLIDARITY_EBOOK_UNIT_CENTS) : 0;
  const goalKg = campaignCause?.targetAmountCents
    ? Math.max(1, Math.round(campaignCause.targetAmountCents / SOLIDARITY_EBOOK_UNIT_CENTS))
    : 100;
  const goalProgress = Math.min(100, Math.round((confirmedKg / goalKg) * 100));

  return (
    <main className="min-h-screen bg-[#f8f6ef] text-petrol">
      <CampaignLandingTracker variant="ebook_racao_1kg_v1" />

      <header className="sticky top-0 z-40 border-b border-black/5 bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <div aria-label="MyPets"><MyPetsLogo /></div>
          <div className="flex items-center gap-3">
            <span className="hidden items-center gap-2 text-[11px] font-bold text-muted-foreground sm:inline-flex">
              <LockKeyhole className="h-3.5 w-3.5 text-emerald-700" /> Participação segura
            </span>
            <a href="#como-funciona" className="inline-flex min-h-10 items-center gap-2 rounded-full border border-border bg-white px-4 text-xs font-black text-petrol">
              Como funciona
            </a>
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
              <BookOpen className="h-3.5 w-3.5" /> 1 eBook = 1 kg de ração
            </span>
            <h1 className="mt-6 max-w-3xl text-balance text-5xl font-black leading-[.95] tracking-[-0.045em] sm:text-6xl lg:text-7xl">
              Você cuida do seu cão. <span className="text-emerald-300">Hoje pode alimentar outro.</span>
            </h1>
            <p className="mt-5 max-w-2xl text-lg font-semibold leading-8 text-white/78">
              Escolha um guia útil para si. Cada participação confirmada de <strong className="text-white">R$ 12,90</strong> desbloqueia o eBook e cria o compromisso MyPets de <strong className="text-white">1 kg de ração.</strong>
            </p>

            <div className="mt-7 grid max-w-2xl gap-3 sm:grid-cols-3">
              {[
                ["Escolha", "um guia útil para si", BookOpen],
                ["Participe", "R$ 12,90 por eBook", Heart],
                ["Alimente", "1 kg garantido", PawPrint],
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

            <div className="mt-6 max-w-2xl rounded-2xl border border-white/10 bg-black/20 p-4 backdrop-blur-sm">
              <div className="flex items-end justify-between gap-4">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.15em] text-emerald-300">Meta de lançamento</p>
                  <p className="mt-1 text-2xl font-black text-white">{confirmedKg > 0 ? `${confirmedKg} kg já confirmados` : "Primeiros 100 kg"}</p>
                </div>
                <p className="text-right text-xs font-bold text-white/60">{confirmedKg} / {goalKg} kg</p>
              </div>
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10">
                <div className="h-full rounded-full bg-emerald-400 transition-[width]" style={{ width: `${goalProgress}%` }} />
              </div>
              <p className="mt-2 text-[10px] leading-4 text-white/50">Só entram aqui participações financeiras confirmadas. QR Code gerado não soma kg.</p>
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
            ["Apoio + recompensa digital", "O apoio tem o MyPets como beneficiário financeiro e o conteúdo digital é a recompensa desta campanha."],
            ["Valor simples", "R$ 12,90 por guia selecionado. Cada unidade confirmada corresponde a 1 kg."],
            ["Destino identificado", "A campanha mede separadamente a origem, os materiais escolhidos e o apoio confirmado."],
            ["Compromisso por peso", "Participações confirmadas preservam 1 kg garantido por participação confirmada. O preço pode ser revisto apenas para novas participações se o custo de aquisição variar."],
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
                <span className="absolute left-3 top-3 rounded-full bg-white/95 px-2.5 py-1 text-[9px] font-black uppercase tracking-wide text-emerald-800">R$ 12,90 · 1 kg</span>
              </div>
              <div className="p-5">
                <h3 className="text-base font-black">{ebook.shortTitle}</h3>
                <p className="mt-2 text-xs leading-5 text-muted-foreground">{ebook.promise}</p>
                <p className="mt-4 text-[10px] font-black uppercase tracking-wide text-emerald-700">1 guia · 1 kg de ração</p>
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

      <section id="como-funciona" className="scroll-mt-24 bg-petrol text-white">
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
              <p>A promessa é contabilizada por peso: <strong className="text-white">cada participação confirmada cria um compromisso de 1 kg de ração, preservado mesmo se o custo de compra variar.</strong> O MyPets usará compras e comprovantes para acompanhar o peso adquirido. Se os custos mudarem, os kg já confirmados permanecem preservados e o preço pode ser revisto somente para novas participações.</p>
            </div>
            <a href="#participar" className="mt-6 inline-flex min-h-12 items-center gap-2 rounded-full bg-emerald-500 px-6 text-sm font-black text-white">
              Participar com R$ 12,90 <Heart className="h-4 w-4 fill-white" />
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
            shareText="Conheça a campanha 1 eBook = 1 kg do MyPets: escolha um guia digital sobre cães e transforme R$ 12,90 em 1 kg de ração garantido."
            label="Partilhar a campanha"
          />
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <p className="text-center text-xs font-black uppercase tracking-[.16em] text-emerald-700">Perguntas importantes</p>
        <h2 className="mt-3 text-center text-3xl font-black tracking-tight">Antes de participar, saiba exatamente o que está a fazer.</h2>
        <div className="mt-7 space-y-3">
          {[
            ["Como funciona esta participação?", "O apoio financeiro desta campanha tem o MyPets como beneficiário e inclui uma recompensa digital. O tratamento fiscal, documental e de consumo deve permanecer coerente com a estrutura jurídica e os termos aplicáveis ao MyPets; a página não usa o nome da campanha para alterar esse enquadramento."],
            ["Quanto custa cada participação?", "Cada eBook selecionado acrescenta R$ 12,90 ao apoio. Um guia = R$ 12,90 e 1 kg; três = R$ 38,70 e 3 kg; a coleção completa = R$ 64,50 e 5 kg."],
            ["Como o MyPets garante 1 kg?", "A unidade da campanha é o peso, não uma estimativa visual. Cada R$ 12,90 confirmado cria o compromisso de financiar 1 kg. Se o custo de aquisição subir, o MyPets preserva os kg já confirmados e pode ajustar o valor apenas para participações futuras."],
            ["Quando recebo o eBook?", "O acesso aparece depois de o backend confirmar o pagamento. Gerar o QR Code não desbloqueia a etapa de agradecimento."],
            ["Posso escolher mais de um?", "Sim. Cada guia adicional acrescenta mais R$ 12,90 e mais 1 kg. Pode escolher 1, 3 ou os 5 eBooks e depois personalizar quais quer receber."],
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
