import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BookOpen, CheckCircle2, Facebook, Heart, LockKeyhole, MessageCircle, PawPrint, PlayCircle, ShieldCheck, Sparkles } from "lucide-react";
import { MyPetsLogo } from "@/components/brand/logo";
import { MyPetsRoundSeal } from "@/components/brand/round-seal";
import { CampaignLandingTracker } from "@/components/conversion/campaign-landing-tracker";
import { CampaignShareButton } from "@/components/conversion/campaign-share-button";
import { EbookRacaoFunnel } from "@/components/conversion/ebook-racao-funnel";
import { getCampaignConfig } from "@/lib/campaign-landings";
import { apiGet } from "@/lib/api";
import { BRAND } from "@/lib/brand";
import { solidarityEbooks } from "@/lib/solidarity-ebooks";

export const revalidate = 10;

export const metadata: Metadata = {
  title: "1 eBook = 1 kg de Ração | Campanha MyPets",
  description: "Escolha entre 13 guias digitais MyPets. Cada R$ 12,90 confirmado desbloqueia 1 guia e garante o compromisso de 1 kg de ração.",
  alternates: { canonical: "/ajudar/ebooks" },
  openGraph: {
    title: "1 eBook = 1 kg de Ração — participe com R$ 12,90",
    description: "13 guias digitais, leitura web + PDF. Cada participação confirmada de R$ 12,90 desbloqueia 1 guia e garante 1 kg de ração.",
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
type CampaignImpact = {
  confirmedKg: number;
  confirmedContributions: number;
  totalReceivedCents: number;
  extraSupportCents: number;
  goalKg: number;
  progressPercent: number;
};

async function getCampaignImpact(): Promise<CampaignImpact | null> {
  try {
    return (await apiGet<Envelope<CampaignImpact>>("/campaigns/ebook-racao/impact")).data;
  } catch {
    return null;
  }
}

export default async function EbookRacaoCampaignPage() {
  const [config, impact] = await Promise.all([getCampaignConfig(), getCampaignImpact()]);
  const paymentReady = Boolean(
    config.paymentsLive &&
      config.paymentProvider === "xpayments" &&
      config.paymentCurrencies?.includes("BRL"),
  );
  const confirmedKg = impact?.confirmedKg ?? 0;
  const goalKg = impact?.goalKg ?? 100;
  const goalProgress = impact?.progressPercent ?? 0;
  const confirmedContributions = impact?.confirmedContributions ?? 0;
  const extraSupportCents = impact?.extraSupportCents ?? 0;
  const campaignVideoUrl = BRAND.ebookCampaignVideoUrl;
  const hasCommunity = Boolean(BRAND.whatsappCommunityUrl || BRAND.facebookGroupUrl);

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
              Escolha entre <strong className="text-white">13 guias digitais</strong>. Cada participação confirmada de <strong className="text-white">R$ 12,90</strong> desbloqueia 1 guia e cria o compromisso MyPets de <strong className="text-white">1 kg de ração.</strong>
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <a href="#participar" className="inline-flex min-h-14 items-center gap-2 rounded-2xl bg-emerald-400 px-6 text-sm font-black text-[#092017] shadow-[0_18px_40px_-18px_rgba(52,211,153,.8)] transition hover:-translate-y-0.5 hover:bg-emerald-300">
                Escolher meu eBook e garantir 1 kg <ArrowRight className="h-4 w-4" />
              </a>
              <Link href="/biblioteca" className="inline-flex min-h-14 items-center gap-2 rounded-2xl border border-white/15 bg-white/5 px-5 text-sm font-black text-white transition hover:bg-white/10">
                Ver a biblioteca <BookOpen className="h-4 w-4" />
              </Link>
              <span className="text-[11px] font-semibold text-white/55">Pix · acesso liberado após confirmação · sem assinatura</span>
            </div>

            <div className="mt-7 grid max-w-2xl gap-3 sm:grid-cols-3">
              {[
                ["13 guias", "conteúdo para diferentes momentos", BookOpen],
                ["Leitura web + PDF", "acesso digital depois do Pix", Sparkles],
                ["1 guia = 1 kg", "R$ 12,90 por unidade confirmada", PawPrint],
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
              <span className="inline-flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-emerald-300" /> Só contamos o kg após a confirmação do Pix</span>
              <span className="inline-flex items-center gap-1.5"><ShieldCheck className="h-4 w-4 text-emerald-300" /> Pagamento seguro via Pix</span>
              <span className="inline-flex items-center gap-1.5"><Sparkles className="h-4 w-4 text-emerald-300" /> eBook liberado após confirmação</span>
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
              <p className="mt-2 text-[10px] leading-4 text-white/50">Só entram aqui kg ligados a participações financeiras confirmadas. QR Code gerado não soma kg.</p>
              {(confirmedContributions > 0 || extraSupportCents > 0) && (
                <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 border-t border-white/10 pt-3 text-[10px] font-bold text-white/55">
                  <span>{confirmedContributions} {confirmedContributions === 1 ? "participação confirmada" : "participações confirmadas"}</span>
                  {extraSupportCents > 0 && <span>+ {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(extraSupportCents / 100)} em reforços livres</span>}
                </div>
              )}
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
          <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">Uma biblioteca para usar de verdade — não um PDF esquecido.</h2>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">São 13 guias, mais de 64 mil palavras, Atlas com 64 raças, checklists, planos práticos e vídeos selecionados. Pode ver a amostra de cada guia antes de participar.</p>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {solidarityEbooks.map((ebook) => (
            <article key={ebook.slug} className="group overflow-hidden rounded-3xl border border-border bg-white">
              <div className="relative h-44 overflow-hidden">
                <Image src={ebook.image} alt="" fill sizes="(min-width:1280px) 25vw, 50vw" className="object-cover transition duration-500 group-hover:scale-[1.03]" />
                <div className="absolute inset-0 bg-gradient-to-t from-petrol/55 to-transparent" />
                <span className="absolute left-3 top-3 rounded-full bg-white/95 px-2.5 py-1 text-[9px] font-black uppercase tracking-wide text-emerald-800">R$ 12,90 · 1 kg</span>
                <MyPetsRoundSeal className="absolute bottom-3 right-3 h-12 w-12" />
              </div>
              <div className="p-5">
                <h3 className="text-base font-black">{ebook.shortTitle}</h3>
                <p className="mt-2 text-xs leading-5 text-muted-foreground">{ebook.promise}</p>
                <div className="mt-4 flex items-center justify-between gap-3">
                  <p className="text-[10px] font-black uppercase tracking-wide text-emerald-700">1 guia · 1 kg de ração</p>
                  <Link href={"/biblioteca/" + ebook.slug} className="inline-flex items-center gap-1 text-[10px] font-black text-petrol/60 hover:text-emerald-700">
                    Ver amostra <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-8 text-center">
          <a href="#participar" className="inline-flex min-h-12 items-center gap-2 rounded-full bg-emerald-500 px-6 text-sm font-black text-white shadow-lg shadow-emerald-900/10">
            Escolher guias e impacto <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </section>

      <section className="border-y border-border bg-white">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
          <div className="grid gap-8 lg:grid-cols-[.82fr_1.18fr] lg:items-center">
            <div>
              <p className="text-xs font-black uppercase tracking-[.16em] text-emerald-700">Uma campanha feita para ser vista e compartilhada</p>
              <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">Da escolha do guia à tigela: uma história simples, visual e verificável.</h2>
              <p className="mt-4 text-sm leading-7 text-muted-foreground">A comunicação da campanha trabalha com imagens reais/identificadas do ecossistema MyPets e um vídeo curto de campanha quando o media oficial estiver configurado. O objetivo é mostrar o mecanismo sem inventar entregas ou números: escolher, confirmar, garantir alimento e acompanhar.</p>
              <div className="mt-5 grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
                {[
                  ["1. Escolher", "Um guia que a pessoa realmente quer usar."],
                  ["2. Confirmar", "Pix concluído e reconciliado no servidor."],
                  ["3. Acompanhar", "Kg garantidos, reforço extra e comunidade."],
                ].map(([title, text]) => (
                  <div key={title} className="rounded-2xl border border-border bg-[#f8faf9] p-4">
                    <p className="text-xs font-black text-petrol">{title}</p>
                    <p className="mt-1 text-[11px] leading-5 text-muted-foreground">{text}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="overflow-hidden rounded-[2rem] bg-petrol shadow-2xl shadow-petrol/15">
              {campaignVideoUrl ? (
                <div className="relative aspect-video bg-black">
                  <video
                    controls
                    playsInline
                    preload="metadata"
                    poster="/images/card-alimentou.jpg"
                    className="h-full w-full object-cover"
                  >
                    <source src={campaignVideoUrl} />
                  </video>
                </div>
              ) : (
                <div className="grid aspect-[16/10] grid-cols-2 gap-1 bg-petrol p-1">
                  <div className="relative row-span-2 overflow-hidden rounded-l-[1.7rem]">
                    <Image src="/images/card-alimentou.jpg" alt="Cão representando a frente de alimentação MyPets" fill sizes="40vw" className="object-cover" />
                  </div>
                  <div className="relative overflow-hidden rounded-tr-[1.7rem]">
                    <Image src="/images/cta-dog.jpg" alt="Cão na comunicação visual MyPets" fill sizes="30vw" className="object-cover" />
                  </div>
                  <div className="relative overflow-hidden rounded-br-[1.7rem]">
                    <Image src="/images/hero.jpg" alt="Animais na comunicação institucional MyPets" fill sizes="30vw" className="object-cover" />
                  </div>
                </div>
              )}
              <div className="flex items-center justify-between gap-4 px-5 py-4 text-white">
                <div>
                  <p className="text-xs font-black">{campaignVideoUrl ? "Vídeo oficial da campanha" : "Narrativa visual da campanha"}</p>
                  <p className="mt-1 text-[10px] text-white/55">{campaignVideoUrl ? "Veja, entenda e compartilhe em menos de 1 minuto." : "Escolher, confirmar, garantir alimento e acompanhar - sem números ou entregas inventadas."}</p>
                </div>
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/10"><PlayCircle className="h-5 w-5 text-emerald-300" /></span>
              </div>
            </div>
          </div>
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
              <p>O pagamento é um apoio ao MyPets. O eBook é entregue como material digital de agradecimento e torna a participação mais útil, memorável e compartilhável.</p>
              <p>A campanha registra a origem do visitante, os guias escolhidos, o valor do apoio e a confirmação financeira. QR Code gerado não conta como apoio recebido.</p>
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
            label="Compartilhar a campanha"
          />
        </div>
      </section>

      {hasCommunity && (
        <section className="bg-petrol text-white">
          <div className="mx-auto grid max-w-7xl gap-6 px-4 py-10 sm:px-6 lg:grid-cols-[.8fr_1.2fr] lg:items-center lg:px-8">
            <div>
              <p className="text-xs font-black uppercase tracking-[.16em] text-emerald-300">Não precisa terminar no Pix</p>
              <h2 className="mt-2 text-3xl font-black tracking-tight">Quem participa pode continuar perto da causa.</h2>
              <p className="mt-3 text-sm leading-7 text-white/65">Depois do apoio confirmado, a pessoa pode entrar voluntariamente na comunidade MyPets, acompanhar novidades, partilhar histórias e ajudar a campanha a chegar a mais tutores.</p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {BRAND.whatsappCommunityUrl && (
                <a href={BRAND.whatsappCommunityUrl} target="_blank" rel="noopener noreferrer" className="rounded-3xl border border-white/10 bg-white/7 p-5 transition hover:bg-white/10">
                  <MessageCircle className="h-6 w-6 text-emerald-300" />
                  <p className="mt-4 text-lg font-black">Comunidade WhatsApp</p>
                  <p className="mt-1 text-xs leading-5 text-white/55">Atualizações rápidas, mobilização e participação ativa.</p>
                  <span className="mt-4 inline-flex items-center gap-1 text-xs font-black text-emerald-300">Entrar voluntariamente <ArrowRight className="h-3.5 w-3.5" /></span>
                </a>
              )}
              {BRAND.facebookGroupUrl && (
                <a href={BRAND.facebookGroupUrl} target="_blank" rel="noopener noreferrer" className="rounded-3xl border border-white/10 bg-white/7 p-5 transition hover:bg-white/10">
                  <Facebook className="h-6 w-6 text-blue-300" />
                  <p className="mt-4 text-lg font-black">Grupo Facebook</p>
                  <p className="mt-1 text-xs leading-5 text-white/55">Discussões, histórias, conteúdos e ligação entre participantes.</p>
                  <span className="mt-4 inline-flex items-center gap-1 text-xs font-black text-blue-200">Participar do grupo <ArrowRight className="h-3.5 w-3.5" /></span>
                </a>
              )}
            </div>
          </div>
        </section>
      )}

      <section className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <p className="text-center text-xs font-black uppercase tracking-[.16em] text-emerald-700">Perguntas importantes</p>
        <h2 className="mt-3 text-center text-3xl font-black tracking-tight">Antes de participar, saiba exatamente como a campanha funciona.</h2>
        <div className="mt-7 space-y-3">
          {[
            ["Como funciona esta participação?", "O pagamento é um apoio financeiro ao MyPets com uma recompensa digital. O valor, o beneficiário e o compromisso de 1 kg são mostrados antes do Pix. A página não apresenta esta contribuição como doação dedutível de imposto."],
            ["Quanto custa cada participação?", "Cada guia selecionado acrescenta R$ 12,90 ao apoio e 1 kg ao compromisso. 1 guia = R$ 12,90 e 1 kg; 3 = R$ 38,70 e 3 kg; 5 = R$ 64,50 e 5 kg; os 13 guias = R$ 167,70 e 13 kg."],
            ["Como o MyPets garante 1 kg?", "A unidade da campanha é o peso, não uma estimativa visual. Cada R$ 12,90 confirmado cria o compromisso de financiar 1 kg. Se o custo de aquisição subir, o MyPets preserva os kg já confirmados e pode ajustar o valor apenas para participações futuras."],
            ["Quando recebo o guia?", "O acesso é liberado assim que o pagamento é confirmado pelo servidor. O link recebido cria uma sessão segura de acesso à sua biblioteca sem exigir que crie uma senha no checkout. Pedimos um email válido para entrega e recuperação. Gerar o QR Code, por si só, não libera os guias."],
            ["Posso arredondar ou apoiar com um valor maior?", "Sim. Depois de escolher os eBooks, pode manter o valor base ou arredondar/reforçar livremente. O valor base determina os eBooks e kg garantidos; o adicional reforça o fundo e a operação da campanha sem inflar artificialmente o contador de kg."],
            ["Posso escolher mais de um?", "Sim. Cada guia adicional acrescenta R$ 12,90 e mais 1 kg. Pode escolher 1, 3, 5 ou a biblioteca completa com 13 guias e personalizar a seleção."],
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
