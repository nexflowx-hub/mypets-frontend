import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, HeartHandshake, Megaphone, UsersRound, Building2, ShieldCheck } from "lucide-react";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { AuthDialog } from "@/components/layout/auth-dialog";
import { CauseCheckout } from "@/components/payments/cause-checkout";
import { getCampaignConfig } from "@/lib/campaign-landings";

export const revalidate = 10;

export const metadata: Metadata = {
  title: "Apoiar o MyPets | MyPets",
  description: "Ajude o MyPets a continuar vivo, crescer e ampliar a capacidade de descobrir, verificar e apoiar causas animais reais.",
  alternates: { canonical: "/apoiar/mypets" },
};

const MYPETS_GENERAL_BRL_CAUSE_ID = "9a7f1000-0000-4a11-8c01-000000000001";

const paths = [
  {
    title: "Empresa ou parceiro",
    text: "Marcas, clínicas, fornecedores e empresas podem apoiar campanhas, infraestrutura, mídia, benefícios e programas de impacto.",
    href: "/join/projeto?utm_source=mypets&utm_medium=internal&utm_campaign=support_mypets&utm_content=partnership&src_cta=mypets_support_partner",
    cta: "Propor parceria",
    icon: Building2,
  },
  {
    title: "Tempo e competências",
    text: "Comunicação, conteúdo, fotografia, tecnologia, atendimento e apoio local também fazem a plataforma crescer.",
    href: "/join/voluntario?utm_source=mypets&utm_medium=internal&utm_campaign=support_mypets&utm_content=volunteer&src_cta=mypets_support_volunteer",
    cta: "Quero colaborar",
    icon: UsersRound,
  },
  {
    title: "Divulgar o MyPets",
    text: "Ajude a levar causas verificadas a novas pessoas, protetores e comunidades. Partilha qualificada também é impacto.",
    href: "/join/ajudar?utm_source=mypets&utm_medium=internal&utm_campaign=support_mypets&utm_content=ambassador&src_cta=mypets_support_share",
    cta: "Quero divulgar",
    icon: Megaphone,
  },
];

export default async function SupportMyPetsPage() {
  const paymentConfig = await getCampaignConfig();
  const paymentReady = Boolean(
    paymentConfig.paymentsLive &&
    paymentConfig.paymentProvider === "xpayments" &&
    paymentConfig.paymentCurrencies?.includes("BRL"),
  );

  return (
    <>
      <SiteHeader />
      <main className="min-h-screen bg-cream pt-[72px]">
        <section className="relative overflow-hidden bg-petrol text-white">
          <div aria-hidden className="absolute inset-0 bg-[radial-gradient(circle_at_15%_15%,rgba(255,98,88,0.18),transparent_30%),radial-gradient(circle_at_82%_62%,rgba(46,163,160,0.16),transparent_30%)]" />
          <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
            <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.18em] text-coral">Campanha permanente de sustentação</p>
                <h1 className="mt-4 max-w-4xl text-balance text-4xl font-black leading-[1.04] tracking-tight sm:text-5xl">Ajude o MyPets a continuar vivo — e a colocar mais ajuda onde ela faz diferença.</h1>
                <p className="mt-5 max-w-3xl text-base leading-7 text-white/72">O MyPets precisa de estrutura para descobrir projetos, verificar responsáveis, criar campanhas, manter tecnologia, atender a comunidade e ampliar a distribuição das causas. Este apoio tem o próprio MyPets como beneficiário e é contabilmente separado dos fundos de terceiros.</p>
              </div>
              <div className="min-w-[210px]">
                <CauseCheckout causeId={MYPETS_GENERAL_BRL_CAUSE_ID} causeTitle="o MyPets" currency="BRL" enabled={paymentReady} />
                {!paymentReady && <p className="max-w-[240px] text-xs leading-5 text-white/55">O botão financeiro aparece assim que a lane BRL estiver ativa.</p>}
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
          <div className="rounded-3xl bg-white p-6 ring-1 ring-border sm:p-8">
            <div className="grid gap-6 lg:grid-cols-[auto_1fr] lg:items-start">
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-coral/10 text-coral"><HeartHandshake className="h-7 w-7" /></span>
              <div>
                <p className="text-xs font-black uppercase tracking-[0.15em] text-coral">Fundo institucional MyPets</p>
                <h2 className="mt-2 text-2xl font-black text-petrol">Apoio geral, sem escolher uma causa específica.</h2>
                <p className="mt-3 max-w-3xl text-sm leading-6 text-muted-foreground">Este fundo é evergreen e não usa uma meta artificial. O valor recebido é registado como apoio ao MyPets. As frentes Vet Help, Rescue, Shelter e Emergency têm fundos próprios para quem prefere direcionar o apoio por tema.</p>
                <Link href="/apoiar" className="mt-5 inline-flex items-center gap-2 text-sm font-black text-coral">Ver fundos temáticos e causas <ArrowRight className="h-4 w-4" /></Link>
              </div>
            </div>
          </div>

          <section className="mt-6">
            <div className="mb-5">
              <p className="text-xs font-black uppercase tracking-[0.15em] text-coral">O que o seu apoio mantém vivo</p>
              <h2 className="mt-2 text-2xl font-black text-petrol sm:text-3xl">Uma infraestrutura pequena pode multiplicar o alcance de muitas causas.</h2>
            </div>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {[
                ["Tecnologia e infraestrutura", "Site, API, base de dados, checkout, segurança, monitorização e ferramentas de operação.", ShieldCheck],
                ["Verificação e triagem", "Análise de projetos, contacto com responsáveis, organização de evidências e redução de risco.", HeartHandshake],
                ["Conteúdo e distribuição", "Páginas, criativos, campanhas, descoberta e distribuição para que boas causas sejam encontradas.", Megaphone],
                ["Operação e comunidade", "Atendimento, acompanhamento, parcerias e capacidade de transformar pedidos em ações concretas.", UsersRound],
              ].map(([title, text, Icon]) => {
                const ItemIcon = Icon as typeof ShieldCheck;
                return (
                  <article key={title as string} className="rounded-3xl border border-border bg-white p-6">
                    <span className="flex h-11 w-11 items-center justify-center rounded-full bg-coral/10 text-coral"><ItemIcon className="h-5 w-5" /></span>
                    <h3 className="mt-4 text-lg font-black text-petrol">{title as string}</h3>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">{text as string}</p>
                  </article>
                );
              })}
            </div>
          </section>

          <section className="mt-8 rounded-[2rem] bg-petrol p-6 text-white sm:p-8">
            <p className="text-xs font-black uppercase tracking-[0.15em] text-coral">O impacto já tem nomes</p>
            <h2 className="mt-2 max-w-3xl text-2xl font-black sm:text-3xl">Projetos que ajudam a explicar por que o MyPets precisa existir.</h2>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-white/65">A estrutura do MyPets pode dar visibilidade, organização e uma rota segura de apoio a iniciativas muito diferentes entre si.</p>

            <div className="mt-6 grid gap-4 lg:grid-cols-2">
              <Link href="/projetos/together-we-feed" className="group rounded-3xl border border-white/10 bg-white/7 p-6 transition hover:bg-white/10">
                <p className="text-xs font-black uppercase tracking-wide text-coral">Alimentação · projeto integrado</p>
                <h3 className="mt-2 text-2xl font-black">Together We Feed</h3>
                <p className="mt-2 text-sm leading-6 text-white/65">Uma frente dedicada à alimentação e ao apoio imediato de animais em situação de vulnerabilidade, já integrada ao ecossistema MyPets.</p>
                <span className="mt-5 inline-flex items-center gap-2 text-sm font-black text-white">Conhecer projeto <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" /></span>
              </Link>

              <Link href="/projetos/petskids" className="group rounded-3xl border border-white/10 bg-white/7 p-6 transition hover:bg-white/10">
                <p className="text-xs font-black uppercase tracking-wide text-coral">Centro-Oeste do Brasil · em integração</p>
                <h3 className="mt-2 text-2xl font-black">PetsKids</h3>
                <p className="mt-2 text-sm leading-6 text-white/65">Duas crianças transformam pequenas compras de ração em cuidado direto para cães em situação de rua, distribuindo alimento na própria comunidade.</p>
                <p className="mt-3 text-xs leading-5 text-white/50">Por envolver menores, dados pessoais não são expostos e não há repasse financeiro direto a crianças. Nesta fase, o apoio financeiro é recebido e gerido pelo MyPets.</p>
                <span className="mt-5 inline-flex items-center gap-2 text-sm font-black text-white">Conhecer PetsKids <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" /></span>
              </Link>
            </div>
          </section>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {paths.map(({ title, text, href, cta, icon: Icon }) => (
              <Link key={title} href={href} className="group rounded-3xl border border-border bg-white p-6 transition hover:-translate-y-1 hover:border-coral/35 hover:shadow-lg sm:p-7">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-coral/10 text-coral"><Icon className="h-6 w-6" /></span>
                <h2 className="mt-5 text-2xl font-black text-petrol">{title}</h2>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{text}</p>
                <span className="mt-5 inline-flex items-center gap-2 text-sm font-black text-coral">{cta}<ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" /></span>
              </Link>
            ))}
          </div>

          <div className="mt-8 grid gap-4 rounded-3xl bg-white p-6 ring-1 ring-border sm:p-8 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.15em] text-coral">Transparência por desenho</p>
              <h2 className="mt-2 text-2xl font-black text-petrol">O apoio ao MyPets é separado do apoio a cada causa.</h2>
              <p className="mt-3 max-w-3xl text-sm leading-6 text-muted-foreground">Cada pagamento mantém um causeId/fundo próprio na base de dados e a origem de aquisição. Apoiar o MyPets nunca é apresentado como se o valor tivesse sido destinado a um protetor ou animal específico.</p>
            </div>
            <ShieldCheck className="h-10 w-10 text-emerald-600" />
          </div>
        </section>
      </main>
      <SiteFooter />
      <AuthDialog />
    </>
  );
}
