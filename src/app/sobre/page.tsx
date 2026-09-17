import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BadgeCheck, Building2, Globe2, HeartHandshake, SearchCheck, ShieldCheck, UsersRound } from "lucide-react";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { BRAND } from "@/lib/brand";

export const metadata: Metadata = {
  title: "Sobre o MyPets — Rede de apoio e impacto animal",
  description:
    "Conheça o MyPets, a sua missão, como funciona a rede de apoio a animais e protetores, a relação com HUMAN IMPACT TECH LTD e os princípios de transparência do ecossistema.",
  alternates: { canonical: "/sobre" },
  openGraph: {
    title: "Sobre o MyPets — Pessoas. Animais. Impacto Real.",
    description:
      "Uma rede digital que aproxima quem quer ajudar de pessoas, protetores, organizações e projetos dedicados ao bem-estar animal.",
    url: `${BRAND.siteUrl}/sobre`,
    siteName: BRAND.name,
    type: "website",
    locale: "pt_BR",
    alternateLocale: ["pt_PT", "en_US"],
    images: [{ url: BRAND.socialBannerUrl, alt: "MyPets — Pessoas. Animais. Impacto Real." }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sobre o MyPets",
    description: "Conheça a missão, a estrutura e os princípios de transparência do MyPets.",
    images: [BRAND.socialBannerUrl],
  },
};

const principles = [
  {
    icon: SearchCheck,
    title: "Destino identificado",
    text: "Cada fluxo procura deixar claro se o apoio é destinado ao MyPets, a um fundo temático, a um projeto ou a uma causa específica.",
  },
  {
    icon: ShieldCheck,
    title: "Pagamento separado da narrativa",
    text: "Criar um pagamento ou gerar um QR Code nunca é tratado como confirmação. O estado financeiro confirmado continua a ser a referência.",
  },
  {
    icon: BadgeCheck,
    title: "Informação verificável",
    text: "Perfis, causas, projetos e atualizações devem ser apresentados com contexto suficiente para que a comunidade compreenda o que está a apoiar.",
  },
  {
    icon: UsersRound,
    title: "Rede, não intermediário invisível",
    text: "O MyPets foi desenhado para tornar visíveis as pessoas e iniciativas que cuidam dos animais, sem esconder o destino do apoio atrás da plataforma.",
  },
];

function StructuredData() {
  const url = `${BRAND.siteUrl}/sobre`;
  const organizationId = `${BRAND.siteUrl}/#organization`;
  const payload = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": organizationId,
        name: BRAND.name,
        url: BRAND.siteUrl,
        logo: { "@type": "ImageObject", url: BRAND.logoUrl },
        image: BRAND.socialBannerUrl,
        slogan: "Quem ajuda animais também merece ajuda.",
        description:
          "Rede digital de apoio a animais, protetores, organizações e projetos de impacto animal, com atuação orientada ao Brasil e Portugal.",
        areaServed: [
          { "@type": "Country", name: "Brazil" },
          { "@type": "Country", name: "Portugal" },
        ],
        knowsAbout: [
          "animal welfare",
          "animal rescue",
          "responsible adoption",
          "pet support",
          "animal protection",
        ],
        sameAs: [BRAND.instagramUrl, BRAND.facebookUrl, BRAND.facePetsUrl],
        parentOrganization: {
          "@type": "Organization",
          name: "HUMAN IMPACT TECH LTD",
          url: "https://humanimpact.tech",
        },
      },
      {
        "@type": "AboutPage",
        "@id": `${url}#webpage`,
        url,
        name: "Sobre o MyPets",
        description:
          "Missão, funcionamento, estrutura e princípios de transparência do ecossistema MyPets.",
        inLanguage: ["pt-BR", "pt-PT"],
        isPartOf: { "@id": `${BRAND.siteUrl}/#website` },
        about: { "@id": organizationId },
        publisher: { "@id": organizationId },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "MyPets", item: BRAND.siteUrl },
          { "@type": "ListItem", position: 2, name: "Sobre", item: url },
        ],
      },
    ],
  };
  const json = JSON.stringify(payload).replace(/</g, "\\u003c");
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />;
}

export default function AboutPage() {
  return (
    <>
      <StructuredData />
      <SiteHeader />
      <main className="flex-1 bg-white pt-[72px]">
        <section className="relative overflow-hidden bg-[#073d3a] text-white">
          <div className="absolute -right-28 -top-28 h-80 w-80 rounded-full bg-coral/15 blur-3xl" />
          <div className="absolute -bottom-36 -left-28 h-96 w-96 rounded-full bg-[#43b8ad]/12 blur-3xl" />
          <div className="relative mx-auto max-w-[1180px] px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-[#8de0d8]">Sobre o MyPets</p>
            <h1 className="mt-5 max-w-4xl text-4xl font-black leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
              Tecnologia para aproximar quem quer ajudar de quem já está a cuidar.
            </h1>
            <p className="mt-6 max-w-3xl text-base leading-8 text-white/72 sm:text-lg">
              O MyPets organiza histórias, causas, projetos e formas de apoio num único ecossistema digital. A missão é simples: tornar mais fácil descobrir necessidades reais, compreender o destino do apoio e acompanhar o impacto gerado em torno dos animais e das pessoas que cuidam deles.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/causas" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-coral px-6 text-sm font-black text-white shadow-[0_18px_40px_-18px_rgba(232,79,69,.85)] transition hover:-translate-y-0.5 hover:bg-coral-dark">
                Ver causas <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/preciso-de-apoio" className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/20 bg-white/7 px-6 text-sm font-black text-white transition hover:border-white/40 hover:bg-white/12">
                Preciso de apoio
              </Link>
            </div>
          </div>
        </section>

        <section className="mx-auto grid max-w-[1180px] gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1.05fr_.95fr] lg:px-8 lg:py-24">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-coral">O que somos</p>
            <h2 className="mt-3 text-3xl font-black tracking-tight text-petrol sm:text-4xl">Uma rede de participação e apoio animal.</h2>
            <div className="mt-6 space-y-5 text-[15px] leading-7 text-muted-foreground">
              <p>
                O MyPets conecta apoiadores, protetores, organizações, projetos e histórias relacionadas ao bem-estar animal. A plataforma reúne descoberta, acompanhamento, participação comunitária e, quando aplicável, fluxos de apoio financeiro.
              </p>
              <p>
                Brasil e Portugal são hoje os mercados prioritários da experiência pública, com meios de pagamento e linguagem adaptados ao contexto local. No Brasil, os fluxos de apoio em BRL são orientados ao Pix.
              </p>
              <p>
                O ecossistema também se conecta ao FacePets para dar continuidade à dimensão de identidade e histórias dos animais.
              </p>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-3xl border border-border bg-[#f7fbfa] p-6">
              <Globe2 className="h-7 w-7 text-[#0d6e6b]" />
              <p className="mt-5 text-sm font-black text-petrol">Brasil e Portugal</p>
              <p className="mt-2 text-xs leading-6 text-muted-foreground">Experiências localizadas, moedas e meios de apoio adequados a cada mercado.</p>
            </div>
            <div className="rounded-3xl border border-border bg-[#fff8f6] p-6">
              <HeartHandshake className="h-7 w-7 text-coral" />
              <p className="mt-5 text-sm font-black text-petrol">Apoio com contexto</p>
              <p className="mt-2 text-xs leading-6 text-muted-foreground">A causa, o projeto ou o destino institucional devem permanecer claros ao longo da jornada.</p>
            </div>
            <div className="rounded-3xl border border-border bg-white p-6 sm:col-span-2">
              <Building2 className="h-7 w-7 text-petrol" />
              <p className="mt-5 text-sm font-black text-petrol">Estrutura tecnológica</p>
              <p className="mt-2 text-xs leading-6 text-muted-foreground">
                MyPets é um produto digital operado no ecossistema da HUMAN IMPACT TECH LTD. A infraestrutura financeira integrada ao produto utiliza XPAYMENTS para orquestração dos fluxos suportados.
              </p>
            </div>
          </div>
        </section>

        <section id="transparencia" className="border-y border-border/70 bg-[#fbfcfc]">
          <div className="mx-auto max-w-[1180px] px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-[#0d6e6b]">Transparência</p>
            <h2 className="mt-3 max-w-3xl text-3xl font-black tracking-tight text-petrol sm:text-4xl">Princípios que orientam a experiência pública.</h2>
            <div className="mt-10 grid gap-4 md:grid-cols-2">
              {principles.map(({ icon: Icon, title, text }) => (
                <article key={title} className="rounded-3xl border border-border bg-white p-6 shadow-[0_18px_50px_-38px_rgba(16,32,42,.4)]">
                  <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#eef8f7] text-[#0d6e6b]"><Icon className="h-5 w-5" /></span>
                  <h3 className="mt-5 text-lg font-black text-petrol">{title}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="parceiros" className="mx-auto max-w-[1180px] px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-coral">Ecossistema</p>
              <h2 className="mt-3 text-3xl font-black tracking-tight text-petrol sm:text-4xl">Uma plataforma com papéis distintos e identificáveis.</h2>
            </div>
            <div className="space-y-4 text-sm leading-7 text-muted-foreground">
              <p><strong className="text-petrol">MyPets</strong> é a experiência pública de descoberta, participação, histórias, causas, projetos e apoio.</p>
              <p><strong className="text-petrol">HUMAN IMPACT TECH LTD</strong> é apresentada como a estrutura empresarial responsável pelo produto digital.</p>
              <p><strong className="text-petrol">XPAYMENTS</strong> é a infraestrutura tecnológica utilizada na orquestração dos meios de pagamento integrados ao produto.</p>
              <p><strong className="text-petrol">FacePets</strong> complementa a dimensão de perfis e histórias dos animais no ecossistema.</p>
            </div>
          </div>
        </section>

        <section id="imprensa" className="bg-[#10202a] text-white">
          <div className="mx-auto grid max-w-[1180px] gap-8 px-4 py-14 sm:px-6 lg:grid-cols-2 lg:px-8">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-[#8de0d8]">Informação institucional</p>
              <h2 className="mt-3 text-2xl font-black">Marca, imprensa e parcerias.</h2>
              <p className="mt-4 max-w-xl text-sm leading-7 text-white/65">Para referências institucionais, integrações, parcerias e pedidos de informação, utilize os canais oficiais publicados pelo ecossistema.</p>
            </div>
            <div id="contato" className="rounded-3xl border border-white/10 bg-white/5 p-6">
              <p className="text-sm font-black">Canais oficiais</p>
              <div className="mt-4 flex flex-col gap-2 text-sm text-white/70">
                <a href={BRAND.siteUrl} className="hover:text-white">mypets.lat</a>
                <a href={BRAND.instagramUrl} target="_blank" rel="noopener noreferrer" className="hover:text-white">Instagram @mypets.lat</a>
                <a href={BRAND.facebookUrl} target="_blank" rel="noopener noreferrer" className="hover:text-white">Facebook @mypets.lat</a>
                <a href="https://humanimpact.tech" target="_blank" rel="noopener noreferrer" className="hover:text-white">humanimpact.tech</a>
              </div>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
