import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BadgeCheck, BookOpenCheck, HeartHandshake, PawPrint, ShoppingBag, Stethoscope, ShieldCheck, Siren, Home, HandHeart, Utensils } from "lucide-react";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { AuthDialog } from "@/components/layout/auth-dialog";

export const metadata: Metadata = {
  title: "Apoiar | MyPets",
  description: "Escolha como apoiar animais, causas e projetos dentro do ecossistema MyPets.",
  alternates: { canonical: "/apoiar" },
};

const options = [
  { title: "Tratamentos veterinários", text: "Consultas, exames, cirurgias, medicamentos e recuperação.", href: "/projetos/vet-help/apoiar", icon: Stethoscope },
  { title: "Resgates", text: "Operações urgentes, transporte, primeiros cuidados e segurança.", href: "/projetos/rescue/apoiar", icon: PawPrint },
  { title: "Abrigos e protetores", text: "Apoio recorrente a quem acolhe e protege animais todos os dias.", href: "/projetos/shelter/apoiar", icon: Home },
  { title: "Emergências", text: "Resposta rápida a enchentes, incêndios e outras situações críticas.", href: "/projetos/emergency/apoiar", icon: Siren },
];

export default function SupportHubPage() {
  return (
    <>
      <SiteHeader />
      <main className="min-h-screen bg-cream pt-[72px]">
        <section className="bg-petrol text-white">
          <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-coral">Apoiar</p>
            <h1 className="mt-3 max-w-4xl text-balance text-4xl font-black tracking-tight sm:text-5xl">Escolha onde a sua ajuda pode fazer mais diferença.</h1>
            <p className="mt-4 max-w-3xl text-base leading-7 text-white/70">O MyPets organiza causas reais por necessidade. Pode apoiar um projeto ativo, uma causa concreta, um vertical de impacto ou o próprio projeto MyPets.</p>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
          <Link href="/projetos/together-we-feed?utm_source=mypets&utm_medium=internal&utm_campaign=always_on_support&utm_content=food_active_project" className="group mb-5 grid gap-5 overflow-hidden rounded-3xl bg-petrol p-6 text-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg sm:p-8 md:grid-cols-[auto_1fr_auto] md:items-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white/10 text-coral"><Utensils className="h-7 w-7" /></span>
            <div><span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.12em] text-white/85"><BadgeCheck className="h-3.5 w-3.5 text-emerald-400" /> Projeto ativo</span><h2 className="mt-3 text-2xl font-black">Alimentação · Together We Feed</h2><p className="mt-2 max-w-2xl text-sm leading-6 text-white/65">O primeiro projeto real apoiado pelo ecossistema MyPets, dedicado a alimentação e apoio imediato a animais em situação de vulnerabilidade.</p></div>
            <span className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-coral px-5 text-sm font-black text-white">Conhecer e apoiar <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" /></span>
          </Link>

          <div className="grid gap-4 md:grid-cols-2">
            {options.map(({ title, text, href, icon: Icon }) => (
              <Link key={href} href={`${href}?utm_source=mypets&utm_medium=internal&utm_campaign=always_on_support&utm_content=support_hub`} className="group rounded-3xl border border-border bg-white p-6 transition hover:-translate-y-1 hover:border-coral/35 hover:shadow-lg sm:p-7">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-coral/10 text-coral"><Icon className="h-6 w-6" /></span>
                <h2 className="mt-5 text-2xl font-black text-petrol">{title}</h2>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{text}</p>
                <span className="mt-5 inline-flex items-center gap-2 text-sm font-black text-coral">Ver causas e apoiar <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" /></span>
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
              <p className="mt-2 text-sm leading-6 text-muted-foreground">Ajude a manter e desenvolver a plataforma, a operação de verificação, a tecnologia e a divulgação das causas.</p>
              <span className="mt-5 inline-flex items-center gap-2 text-sm font-black text-coral">Conhecer formas de apoiar <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" /></span>
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
            <p>Os pagamentos só são apresentados quando a respetiva lane financeira estiver operacional. Enquanto isso, o MyPets mantém os links, a descoberta e os formulários de interesse sem simular cobranças.</p>
          </div>
        </section>
      </main>
      <SiteFooter />
      <AuthDialog />
    </>
  );
}
