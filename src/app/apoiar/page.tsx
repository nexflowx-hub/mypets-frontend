import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BadgeCheck, BookOpenCheck, HeartHandshake, PawPrint, ShoppingBag, Stethoscope, ShieldCheck, Siren, Home, HandHeart, Utensils } from "lucide-react";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { AuthDialog } from "@/components/layout/auth-dialog";
import { CauseCheckout } from "@/components/payments/cause-checkout";
import { getCampaignConfig } from "@/lib/campaign-landings";

export const revalidate = 10;

export const metadata: Metadata = {
  title: "Apoiar | MyPets",
  description: "Escolha como apoiar animais, causas e projetos dentro do ecossistema MyPets.",
  alternates: { canonical: "/apoiar" },
};

const MYPETS_GENERAL_BRL_CAUSE_ID = "9a7f1000-0000-4a11-8c01-000000000001";
const TWF_FUND_BRL_CAUSE_ID = "9a7f1000-0000-4a11-8c01-000000000006";

const options = [
  { title: "Tratamentos veterinários", text: "Consultas, exames, cirurgias, medicamentos e recuperação.", href: "/projetos/vet-help/apoiar", icon: Stethoscope },
  { title: "Resgates", text: "Operações urgentes, transporte, primeiros cuidados e segurança.", href: "/projetos/rescue/apoiar", icon: PawPrint },
  { title: "Abrigos e protetores", text: "Apoio recorrente a quem acolhe e protege animais todos os dias.", href: "/projetos/shelter/apoiar", icon: Home },
  { title: "Emergências", text: "Resposta rápida a enchentes, incêndios e outras situações críticas.", href: "/projetos/emergency/apoiar", icon: Siren },
];

export default async function SupportHubPage() {
  const paymentConfig = await getCampaignConfig();
  const myPetsBrReady = Boolean(
    paymentConfig.paymentsLive &&
    paymentConfig.paymentProvider === "xpayments" &&
    paymentConfig.paymentCurrencies?.includes("BRL"),
  );

  return (
    <>
      <SiteHeader />
      <main className="min-h-screen bg-cream pt-[72px]">
        <section className="bg-petrol text-white">
          <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-coral">Apoiar</p>
            <h1 className="mt-3 max-w-4xl text-balance text-4xl font-black tracking-tight sm:text-5xl">Escolha onde a sua ajuda pode fazer mais diferença.</h1>
            <p className="mt-4 max-w-3xl text-base leading-7 text-white/70">Pode apoiar diretamente o MyPets, uma frente temática do ecossistema ou uma causa concreta. O destino financeiro fica identificado em cada opção.</p>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
          <div id="apoio-rapido" className="mb-6 overflow-hidden rounded-3xl bg-gradient-to-br from-petrol to-[#183f46] p-6 text-white shadow-lg sm:p-8">
            <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
              <div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.14em] text-white/85"><HandHeart className="h-3.5 w-3.5 text-coral" /> Apoio rápido</span>
                <h2 className="mt-4 text-3xl font-black tracking-tight">Apoiar o MyPets agora</h2>
                <p className="mt-3 max-w-3xl text-sm leading-6 text-white/70">Não precisa escolher uma causa específica. Este apoio é destinado ao fundo institucional MyPets para tecnologia, verificação, operação, atendimento, conteúdo e crescimento do ecossistema.</p>
                <p className="mt-2 text-xs font-bold text-white/55">Beneficiário: MyPets · moeda inicial: BRL · fundo separado das causas de terceiros.</p>
              </div>
              <div className="min-w-[190px]">
                <CauseCheckout causeId={MYPETS_GENERAL_BRL_CAUSE_ID} causeTitle="o MyPets" currency="BRL" enabled={myPetsBrReady} />
                {!myPetsBrReady && <Link href="/apoiar/mypets" className="inline-flex min-h-12 w-full items-center justify-center rounded-xl bg-white px-5 text-sm font-black text-petrol">Conhecer o apoio ao MyPets</Link>}
              </div>
            </div>
          </div>

          <div className="mb-5 grid gap-5 overflow-hidden rounded-3xl bg-petrol p-6 text-white shadow-sm sm:p-8 md:grid-cols-[auto_1fr_auto] md:items-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white/10 text-coral"><Utensils className="h-7 w-7" /></span>
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.12em] text-white/85"><BadgeCheck className="h-3.5 w-3.5 text-emerald-400" /> Projeto ativo</span>
              <h2 className="mt-3 text-2xl font-black">Alimentação · Together We Feed</h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-white/65">O primeiro projeto real apoiado pelo ecossistema MyPets, dedicado a alimentação e apoio imediato a animais em situação de vulnerabilidade.</p>
              <p className="mt-2 text-xs font-bold text-white/50">Apoio direto recebido pelo MyPets e contabilizado separadamente para a frente Together We Feed.</p>
            </div>
            <div className="flex min-w-[190px] flex-col gap-2">
              {myPetsBrReady && <CauseCheckout causeId={TWF_FUND_BRL_CAUSE_ID} causeTitle="Together We Feed" currency="BRL" enabled />}
              <Link href="/projetos/together-we-feed?utm_source=mypets&utm_medium=internal&utm_campaign=always_on_support&utm_content=food_active_project" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-white/20 bg-white/8 px-5 text-sm font-black text-white transition hover:bg-white/14">Conhecer projeto <ArrowRight className="h-4 w-4" /></Link>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {options.map(({ title, text, href, icon: Icon }) => (
              <Link key={href} href={`${href}?utm_source=mypets&utm_medium=internal&utm_campaign=always_on_support&utm_content=support_hub`} className="group rounded-3xl border border-border bg-white p-6 transition hover:-translate-y-1 hover:border-coral/35 hover:shadow-lg sm:p-7">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-coral/10 text-coral"><Icon className="h-6 w-6" /></span>
                <h2 className="mt-5 text-2xl font-black text-petrol">{title}</h2>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{text}</p>
                <span className="mt-5 inline-flex items-center gap-2 text-sm font-black text-coral">Apoiar a frente ou escolher uma causa <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" /></span>
              </Link>
            ))}
          </div>

          <div className="mt-6 grid gap-4 lg:grid-cols-2">
            <Link href="/causas?utm_source=mypets&utm_medium=internal&utm_campaign=always_on_support&utm_content=all_causes" className="group rounded-3xl bg-white p-6 ring-1 ring-border transition hover:ring-coral/40 sm:p-8">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-petrol text-white"><HeartHandshake className="h-6 w-6" /></span>
              <h2 className="mt-5 text-2xl font-black text-petrol">Apoiar uma causa concreta</h2>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">Explore causas publicadas e escolha diretamente a história que quer acompanhar.</p>
              <span className="mt-5 inline-flex items-center gap-2 text-sm font-black text-petrol">Ver todas as causas <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" /></span>
            </Link>

            <Link href="/apoiar/mypets?utm_source=mypets&utm_medium=internal&utm_campaign=always_on_support&utm_content=mypets_project" className="group rounded-3xl bg-[#fff0ee] p-6 ring-1 ring-[#ffe0db] transition hover:-translate-y-1 hover:shadow-lg sm:p-8">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-coral text-white"><HandHeart className="h-6 w-6" /></span>
              <h2 className="mt-5 text-2xl font-black text-petrol">Apoiar o projeto MyPets</h2>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">Veja em detalhe como o fundo institucional se diferencia dos fundos temáticos e das causas de terceiros.</p>
              <span className="mt-5 inline-flex items-center gap-2 text-sm font-black text-coral">Conhecer o fundo MyPets <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" /></span>
            </Link>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <Link href="/guias" className="group rounded-3xl border border-border bg-white p-6 transition hover:border-coral/35 sm:p-7">
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#eef8f7] text-[#0d6e6b]"><BookOpenCheck className="h-5 w-5" /></span>
              <h2 className="mt-4 text-xl font-black text-petrol">Guias gratuitos MyPets</h2>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">Conteúdo prático para resgate, proteção e apoio responsável — útil mesmo para quem ainda não pode contribuir financeiramente.</p>
              <span className="mt-4 inline-flex items-center gap-2 text-sm font-black text-[#0d6e6b]">Abrir guias <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" /></span>
            </Link>

            <Link href="/loja" className="group rounded-3xl border border-border bg-white p-6 transition hover:border-coral/35 sm:p-7">
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-coral/10 text-coral"><ShoppingBag className="h-5 w-5" /></span>
              <h2 className="mt-4 text-xl font-black text-petrol">Loja MyPets · em preparação</h2>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">Estamos a desenhar um modelo em que compras elegíveis alimentam um fundo de impacto com votação e prestação de contas.</p>
              <span className="mt-4 inline-flex items-center gap-2 text-sm font-black text-coral">Conhecer o modelo <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" /></span>
            </Link>
          </div>

          <div className="mt-8 flex items-start gap-3 rounded-2xl border border-border bg-white p-5 text-sm leading-6 text-muted-foreground">
            <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
            <p>O MyPets distingue contabilmente o fundo institucional, os fundos temáticos e as causas concretas. Criar um pagamento não é tratado como confirmação financeira; o estado final continua a ser validado pelo backend.</p>
          </div>
        </section>
      </main>
      <SiteFooter />
      <AuthDialog />
    </>
  );
}
