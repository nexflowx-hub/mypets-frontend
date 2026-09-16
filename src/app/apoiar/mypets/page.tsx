import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, HeartHandshake, Megaphone, UsersRound, Building2, ShieldCheck } from "lucide-react";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { AuthDialog } from "@/components/layout/auth-dialog";

export const metadata: Metadata = {
  title: "Apoiar o MyPets | MyPets",
  description: "Conheça formas de apoiar a tecnologia, a operação e a divulgação do ecossistema MyPets.",
  alternates: { canonical: "/apoiar/mypets" },
};

const paths = [
  {
    title: "Apoio financeiro",
    text: "Registe o seu interesse em contribuir para tecnologia, verificação, operação e aquisição de utilizadores. A cobrança só será aberta quando o fluxo financeiro estiver certificado.",
    href: "/join/ajudar?utm_source=mypets&utm_medium=internal&utm_campaign=support_mypets&utm_content=financial_interest&src_cta=mypets_support_financial",
    cta: "Quero apoiar financeiramente",
    icon: HeartHandshake,
  },
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

export default function SupportMyPetsPage() {
  return (
    <>
      <SiteHeader />
      <main className="min-h-screen bg-cream pt-[72px]">
        <section className="relative overflow-hidden bg-petrol text-white">
          <div aria-hidden className="absolute inset-0 bg-[radial-gradient(circle_at_15%_15%,rgba(255,98,88,0.18),transparent_30%),radial-gradient(circle_at_82%_62%,rgba(46,163,160,0.16),transparent_30%)]" />
          <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-coral">Apoie a infraestrutura do impacto</p>
            <h1 className="mt-4 max-w-4xl text-balance text-4xl font-black leading-[1.04] tracking-tight sm:text-5xl">Ajude o MyPets a levar mais causas reais às pessoas certas.</h1>
            <p className="mt-5 max-w-3xl text-base leading-7 text-white/72">O MyPets precisa de tecnologia, verificação, atendimento, conteúdo, distribuição e parceiros para transformar necessidades em campanhas claras e acompanháveis.</p>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
          <div className="grid gap-4 md:grid-cols-2">
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
              <h2 className="mt-2 text-2xl font-black text-petrol">O apoio ao MyPets deve ser separado do apoio a cada causa.</h2>
              <p className="mt-3 max-w-3xl text-sm leading-6 text-muted-foreground">Quando a cobrança institucional for ativada, terá identificação e contabilização próprias. Nunca será apresentada como se fosse uma doação destinada a uma causa específica.</p>
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
