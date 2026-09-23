import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  CheckCircle2,
  Heart,
  HeartHandshake,
  LockKeyhole,
  Megaphone,
  PawPrint,
  Server,
  ShieldCheck,
  Sparkles,
  UsersRound,
  Utensils,
} from "lucide-react";
import { MyPetsLogo } from "@/components/brand/logo";
import { CauseCheckout } from "@/components/payments/cause-checkout";
import { getCampaignConfig } from "@/lib/campaign-landings";

export const revalidate = 10;

export const metadata: Metadata = {
  title: "Ajude o MyPets a continuar vivo | MyPets",
  description:
    "Ajude o MyPets a encontrar, verificar e dar visibilidade a projetos reais de proteção animal. Apoio por Pix com confirmação segura.",
  alternates: { canonical: "/ajudar" },
  openGraph: {
    title: "Ajude o MyPets a continuar vivo",
    description:
      "O seu apoio mantém a estrutura que encontra projetos reais, organiza histórias e leva mais cuidado a animais em situação de vulnerabilidade.",
    url: "https://mypets.lat/ajudar",
    siteName: "MyPets",
    type: "website",
    images: [{ url: "https://mypets.lat/ajudar/opengraph-image", width: 1200, height: 630, alt: "Ajude o MyPets a continuar vivo" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Ajude o MyPets a continuar vivo",
    description: "Apoie por Pix a estrutura que conecta pessoas, projetos e histórias reais de proteção animal.",
    images: ["https://mypets.lat/ajudar/opengraph-image"],
  },
};

const MYPETS_GENERAL_BRL_CAUSE_ID = "9a7f1000-0000-4a11-8c01-000000000001";

const trustItems = [
  {
    title: "Projetos com contexto",
    text: "As iniciativas entram com origem, responsável e estado de verificação identificados.",
    icon: BadgeCheck,
  },
  {
    title: "Pagamento confirmado",
    text: "Gerar um Pix não conta como apoio concluído. O estado financeiro é confirmado pelo servidor.",
    icon: LockKeyhole,
  },
  {
    title: "Destino transparente",
    text: "O apoio institucional MyPets é separado das campanhas e fundos de terceiros.",
    icon: ShieldCheck,
  },
  {
    title: "Comunidade em construção",
    text: "Mais projetos podem apresentar-se, ganhar visibilidade e avançar para verificação.",
    icon: UsersRound,
  },
];

const allocation = [
  {
    title: "Tecnologia e infraestrutura",
    text: "Site, API, base de dados, checkout, segurança, monitorização e operação técnica.",
    icon: Server,
  },
  {
    title: "Verificação e triagem",
    text: "Análise de projetos, contacto com responsáveis, organização de evidências e redução de risco.",
    icon: ShieldCheck,
  },
  {
    title: "Conteúdo e distribuição",
    text: "Páginas, criativos, histórias e campanhas para que boas iniciativas sejam encontradas.",
    icon: Megaphone,
  },
  {
    title: "Operação da comunidade",
    text: "Atendimento, acompanhamento, parcerias e ligação entre quem precisa e quem quer ajudar.",
    icon: UsersRound,
  },
  {
    title: "Iniciativas elegíveis",
    text: "Capacidade para sustentar ações e projetos integrados, sempre com destino e contexto identificados.",
    icon: HeartHandshake,
  },
];

const faqs = [
  {
    q: "Este apoio vai diretamente para uma ONG?",
    a: "Não. Esta página capta apoio institucional para o próprio MyPets. O fundo MyPets é contabilmente separado das campanhas de terceiros e permite manter a tecnologia, a operação, a verificação, a divulgação e a capacidade de apoiar iniciativas elegíveis.",
  },
  {
    q: "Posso escolher uma causa ou projeto específico?",
    a: "Sim. O MyPets também disponibiliza páginas próprias para projetos e causas específicas. Nesta página, porém, o beneficiário é o próprio MyPets.",
  },
  {
    q: "Como sei que o Pix foi realmente confirmado?",
    a: "O MyPets não considera a geração do QR Code como pagamento. A confirmação final depende do estado financeiro recebido e reconciliado no backend.",
  },
  {
    q: "O PetsKids recebe dinheiro diretamente?",
    a: "Não. O PetsKids é conduzido por menores e, nesta fase, não existe repasse direto para crianças. O MyPets preserva a privacidade dos menores e organiza qualquer apoio através de uma estrutura responsável e rastreável.",
  },
];

export default async function HelpMyPetsCampaignPage() {
  const paymentConfig = await getCampaignConfig();
  const paymentReady = Boolean(
    paymentConfig.paymentsLive &&
      paymentConfig.paymentProvider === "xpayments" &&
      paymentConfig.paymentCurrencies?.includes("BRL"),
  );

  return (
    <main className="min-h-screen bg-[#f7f8f4] text-petrol">
      <header className="sticky top-0 z-40 border-b border-black/5 bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <Link href="/" aria-label="MyPets">
            <MyPetsLogo />
          </Link>
          <div className="flex items-center gap-3">
            <span className="hidden items-center gap-2 text-[11px] font-bold text-muted-foreground sm:inline-flex">
              <LockKeyhole className="h-3.5 w-3.5 text-emerald-700" /> Ambiente seguro
            </span>
            <Link
              href="/"
              className="inline-flex min-h-10 items-center gap-2 rounded-full border border-border bg-white px-4 text-xs font-black text-petrol transition hover:border-petrol/25"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Voltar ao site
            </Link>
          </div>
        </div>
      </header>

      <section className="relative overflow-hidden bg-[#101f2a] text-white">
        <div className="absolute inset-0">
          <Image
            src="/images/hero.jpg"
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover object-center opacity-70"
          />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(8,18,25,.92)_0%,rgba(8,18,25,.76)_42%,rgba(8,18,25,.28)_72%,rgba(8,18,25,.18)_100%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_82%_22%,rgba(48,201,103,.14),transparent_28%)]" />
        </div>

        <div className="relative mx-auto grid max-w-7xl gap-9 px-4 py-10 sm:px-6 lg:grid-cols-[minmax(0,1.08fr)_440px] lg:items-center lg:px-8 lg:py-16">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/8 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.16em] text-white/85">
              <Heart className="h-3.5 w-3.5 fill-emerald-400 text-emerald-400" /> Uma estrutura para muitas histórias
            </div>

            <p className="mt-8 max-w-xs font-serif text-xl italic leading-7 text-white/78 sm:text-2xl">
              “Eles não conseguem pedir ajuda. Mas nós conseguimos chegar até eles.”
            </p>

            <h1 className="mt-5 max-w-3xl text-balance text-4xl font-black leading-[1.02] tracking-[-0.035em] sm:text-5xl lg:text-6xl">
              Ajude o MyPets a <span className="text-emerald-400">continuar vivo.</span>
            </h1>
            <p className="mt-5 max-w-2xl text-base font-semibold leading-7 text-white/78 sm:text-lg">
              O seu apoio mantém no ar uma plataforma que encontra projetos, organiza histórias, verifica responsáveis e cria caminhos para levar mais cuidado a animais em situação de vulnerabilidade.
            </p>

            <div className="mt-7 grid max-w-2xl gap-3 sm:grid-cols-3">
              {[
                ["Mais ajuda", "para quem precisa", HeartHandshake],
                ["Projetos reais", "com contexto e verificação", BadgeCheck],
                ["Mais alcance", "para histórias que importam", PawPrint],
              ].map(([title, text, Icon]) => {
                const ItemIcon = Icon as typeof HeartHandshake;
                return (
                  <div key={title as string} className="flex items-start gap-3 rounded-2xl border border-white/10 bg-black/15 p-3.5 backdrop-blur-sm">
                    <ItemIcon className="mt-0.5 h-5 w-5 shrink-0 text-emerald-400" />
                    <div>
                      <p className="text-xs font-black text-white">{title as string}</p>
                      <p className="mt-0.5 text-[10px] leading-4 text-white/55">{text as string}</p>
                    </div>
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
                campaignEyebrow="Faça parte desta causa"
                campaignTitle="Escolha o valor do seu apoio"
                campaignDescription="Selecione um valor e avance para gerar o Pix seguro. O pagamento só é considerado concluído depois da confirmação financeira."
              />
            ) : (
              <div className="rounded-[1.75rem] border border-white/10 bg-white p-6 text-petrol shadow-2xl">
                <ShieldCheck className="h-8 w-8 text-amber-600" />
                <p className="mt-4 text-xs font-black uppercase tracking-[0.15em] text-amber-700">Pagamento temporariamente indisponível</p>
                <h2 className="mt-2 text-2xl font-black">Não vamos gerar um Pix sem a lane financeira confirmada.</h2>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">A página permanece ativa, mas o CTA financeiro só aparece quando a API confirma a operação BRL em produção.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="border-b border-border bg-white">
        <div className="mx-auto grid max-w-7xl gap-0 px-4 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-8">
          {trustItems.map(({ title, text, icon: Icon }) => (
            <article key={title} className="flex gap-3 border-b border-border/70 py-5 last:border-b-0 sm:px-4 lg:border-b-0 lg:border-r lg:last:border-r-0">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                <Icon className="h-5 w-5" />
              </span>
              <div>
                <h2 className="text-xs font-black text-petrol">{title}</h2>
                <p className="mt-1 text-[11px] leading-4 text-muted-foreground">{text}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid gap-8 lg:grid-cols-[.85fr_1.15fr] lg:items-center">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.16em] text-emerald-700">Por que o MyPets existe</p>
            <h2 className="mt-3 text-balance text-3xl font-black leading-tight tracking-tight text-petrol sm:text-4xl">
              Pequenos gestos podem criar <span className="text-emerald-600">grandes mudanças.</span>
            </h2>
            <p className="mt-4 max-w-xl text-sm leading-7 text-muted-foreground">
              Há pessoas a alimentar, resgatar e cuidar de animais todos os dias sem estrutura para chegar a quem quer ajudar. O MyPets existe para aproximar essas duas pontas, organizar a informação e construir confiança antes de ativar fluxos financeiros.
            </p>
            <div className="mt-6 space-y-3">
              {[
                "Descobrir e apresentar projetos reais",
                "Preservar a origem de cada campanha e cada apoio",
                "Separar apoio institucional de fundos e causas específicas",
                "Acompanhar pagamentos pelo estado financeiro real",
              ].map((item) => (
                <p key={item} className="flex items-center gap-2 text-sm font-bold text-petrol">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" /> {item}
                </p>
              ))}
            </div>
            <Link href="/sobre" className="mt-7 inline-flex min-h-11 items-center gap-2 rounded-full border border-emerald-500 px-5 text-sm font-black text-emerald-700 transition hover:bg-emerald-50">
              Conhecer o MyPets <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="relative min-h-[340px] overflow-hidden rounded-[2rem] bg-petrol shadow-xl sm:min-h-[430px]">
            <Image src="/images/cta-dog.jpg" alt="Cão representando as histórias apoiadas pelo ecossistema MyPets" fill sizes="(min-width:1024px) 55vw, 100vw" className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-petrol/80 via-petrol/15 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-6 text-white sm:p-8">
              <p className="font-serif text-2xl italic">“Toda vida importa.”</p>
              <p className="mt-2 max-w-lg text-xs leading-5 text-white/65">A nossa prioridade é construir infraestrutura de confiança antes de escalar promessas.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-12 lg:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.16em] text-emerald-700">Histórias que dão sentido à rede</p>
              <h2 className="mt-2 text-3xl font-black tracking-tight text-petrol">Projetos reais. Contextos diferentes. A mesma vontade de cuidar.</h2>
            </div>
            <Link href="/projetos" className="inline-flex items-center gap-2 text-sm font-black text-emerald-700">Ver projetos <ArrowRight className="h-4 w-4" /></Link>
          </div>

          <div className="mt-7 grid gap-5 lg:grid-cols-[1fr_1fr_.8fr]">
            <Link href="/projetos/petskids?utm_source=mypets&utm_medium=internal&utm_campaign=help_campaign&utm_content=project_story" className="group overflow-hidden rounded-3xl border border-border bg-[#fbfcfa] transition hover:-translate-y-1 hover:shadow-lg">
              <div className="relative h-60 overflow-hidden">
                <Image src="/images/card-alimentou.jpg" alt="Projeto PetsKids e apoio alimentar a animais" fill sizes="(min-width:1024px) 34vw, 100vw" className="object-cover transition duration-500 group-hover:scale-[1.025]" />
                <span className="absolute left-4 top-4 rounded-full bg-emerald-500 px-3 py-1.5 text-[10px] font-black uppercase tracking-wide text-white">Em integração</span>
              </div>
              <div className="p-6">
                <p className="text-xs font-black uppercase tracking-[0.14em] text-emerald-700">Centro-Oeste do Brasil</p>
                <h3 className="mt-2 text-2xl font-black text-petrol">PetsKids</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">Duas crianças transformam pequenas compras de ração em cuidado direto para cães em situação de rua na própria comunidade.</p>
                <p className="mt-4 text-xs leading-5 text-petrol/55">Por envolver menores, dados pessoais não são expostos e não existem repasses diretos a crianças.</p>
                <span className="mt-5 inline-flex items-center gap-2 text-sm font-black text-emerald-700">Conhecer projeto <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" /></span>
              </div>
            </Link>

            <Link href="/projetos/together-we-feed?utm_source=mypets&utm_medium=internal&utm_campaign=help_campaign&utm_content=project_story" className="group overflow-hidden rounded-3xl border border-border bg-[#fbfcfa] transition hover:-translate-y-1 hover:shadow-lg">
              <div className="relative h-60 overflow-hidden">
                <Image src="/images/cta-dog.jpg" alt="Projeto Together We Feed" fill sizes="(min-width:1024px) 34vw, 100vw" className="object-cover transition duration-500 group-hover:scale-[1.025]" />
                <span className="absolute left-4 top-4 rounded-full bg-petrol px-3 py-1.5 text-[10px] font-black uppercase tracking-wide text-white">Projeto integrado</span>
              </div>
              <div className="p-6">
                <p className="text-xs font-black uppercase tracking-[0.14em] text-emerald-700">Alimentação e apoio imediato</p>
                <h3 className="mt-2 text-2xl font-black text-petrol">Together We Feed</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">Uma frente dedicada à alimentação e ao apoio imediato de animais em situação de vulnerabilidade, integrada ao ecossistema MyPets.</p>
                <span className="mt-5 inline-flex items-center gap-2 text-sm font-black text-emerald-700">Conhecer projeto <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" /></span>
              </div>
            </Link>

            <Link href="/projetos/apresentar?utm_source=mypets&utm_medium=internal&utm_campaign=help_campaign&utm_content=submit_project" className="group flex min-h-[360px] flex-col justify-center rounded-3xl bg-[#eaf5ff] p-7 text-center transition hover:-translate-y-1 hover:shadow-lg">
              <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-white text-petrol shadow-sm"><PawPrint className="h-7 w-7" /></span>
              <p className="mt-5 text-xs font-black uppercase tracking-[0.14em] text-petrol/55">Também conhece quem ajuda?</p>
              <h3 className="mt-2 text-2xl font-black text-petrol">Apresente um projeto ao MyPets.</h3>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">ONG, associação, protetor ou iniciativa comunitária: o primeiro passo é contar a história.</p>
              <span className="mx-auto mt-6 inline-flex min-h-11 items-center gap-2 rounded-full bg-petrol px-5 text-sm font-black text-white">Apresentar projeto <ArrowRight className="h-4 w-4" /></span>
            </Link>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-[#092718] text-white">
        <div className="absolute inset-0">
          <Image src="/images/card-resgatou.jpg" alt="" fill sizes="100vw" className="object-cover opacity-20" />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(5,35,20,.96),rgba(5,35,20,.82),rgba(5,35,20,.70))]" />
        </div>
        <div className="relative mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[1fr_420px] lg:items-center lg:px-8 lg:py-16">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.17em] text-emerald-300">Transforme intenção em ação</p>
            <h2 className="mt-3 max-w-2xl text-balance text-3xl font-black leading-tight sm:text-4xl">Quanto quer colocar em movimento hoje?</h2>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-white/68">Não prometemos que uma contribuição isolada resolve tudo. Prometemos tratar cada apoio como responsabilidade: com destino identificado, confirmação financeira real e uma infraestrutura desenhada para acompanhar o que cresce.</p>
          </div>
          {paymentReady && (
            <CauseCheckout
              causeId={MYPETS_GENERAL_BRL_CAUSE_ID}
              causeTitle="o MyPets"
              currency="BRL"
              enabled
              presentation="campaign"
              defaultAmountCents={5000}
              campaignEyebrow="Apoio institucional MyPets"
              campaignTitle="Escolha o seu valor"
              campaignDescription="Pix no Brasil. O checkout abre no próprio MyPets e mantém a origem da campanha."
            />
          )}
        </div>
      </section>

      <section className="bg-white py-12 lg:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-xs font-black uppercase tracking-[0.16em] text-emerald-700">Para onde vai o apoio?</p>
            <h2 className="mt-3 text-3xl font-black tracking-tight text-petrol">Transparência antes de promessa.</h2>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">O fundo institucional mantém capacidade operacional do MyPets. Isso não transforma automaticamente cada apoio numa contribuição direta a uma causa externa.</p>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
            {allocation.map(({ title, text, icon: Icon }) => (
              <article key={title} className="rounded-3xl border border-border bg-[#fbfcfa] p-5">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-emerald-50 text-emerald-700"><Icon className="h-5 w-5" /></span>
                <h3 className="mt-4 text-base font-black text-petrol">{title}</h3>
                <p className="mt-2 text-xs leading-5 text-muted-foreground">{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid gap-8 lg:grid-cols-[1fr_.9fr] lg:items-start">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.16em] text-emerald-700">Perguntas frequentes</p>
            <h2 className="mt-3 text-3xl font-black tracking-tight text-petrol">As objeções importantes devem ser respondidas antes do Pix.</h2>
            <div className="mt-6 space-y-3">
              {faqs.map((item) => (
                <details key={item.q} className="group rounded-2xl border border-border bg-white p-5 open:shadow-sm">
                  <summary className="cursor-pointer list-none pr-6 text-sm font-black text-petrol">{item.q}</summary>
                  <p className="mt-3 text-sm leading-6 text-muted-foreground">{item.a}</p>
                </details>
              ))}
            </div>
          </div>

          <div className="relative min-h-[430px] overflow-hidden rounded-[2rem] bg-[#f4eee7]">
            <Image src="/images/card-acolheu.jpg" alt="Animais acolhidos representando o propósito MyPets" fill sizes="(min-width:1024px) 42vw, 100vw" className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0c1e29]/90 via-transparent to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-6 text-white sm:p-8">
              <Sparkles className="h-6 w-6 text-emerald-300" />
              <h3 className="mt-3 text-3xl font-black">Juntos, podemos fazer mais.</h3>
              <p className="mt-2 max-w-md text-sm leading-6 text-white/70">O MyPets é uma infraestrutura em construção. Cada apoio ajuda a aumentar a capacidade de encontrar, organizar e acompanhar mais histórias reais.</p>
              {paymentReady && <a href="#doar" className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-full bg-emerald-500 px-5 text-sm font-black text-white">Quero ajudar agora <Heart className="h-4 w-4 fill-white" /></a>}
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-petrol text-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-4 py-8 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
          <MyPetsLogo light />
          <div className="flex flex-wrap gap-x-5 gap-y-2 text-xs font-bold text-white/55">
            <Link href="/legal/termos" className="hover:text-white">Termos</Link>
            <Link href="/legal/privacidade" className="hover:text-white">Privacidade</Link>
            <Link href="/legal/apoios" className="hover:text-white">Apoios</Link>
            <Link href="/sobre" className="hover:text-white">Sobre</Link>
          </div>
        </div>
      </footer>

      {paymentReady && (
        <a
          href="#doar"
          className="fixed inset-x-4 bottom-4 z-50 flex min-h-14 items-center justify-center gap-2 rounded-2xl bg-emerald-500 px-5 text-base font-black text-white shadow-2xl shadow-black/25 md:hidden"
        >
          <Heart className="h-5 w-5 fill-white" /> Quero ajudar agora
        </a>
      )}
    </main>
  );
}
