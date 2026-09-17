import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Stethoscope, PawPrint, Home, Siren, Building2, UsersRound, BadgeCheck, Megaphone } from "lucide-react";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";

export const metadata: Metadata = {
  title: "Preciso de apoio | MyPets",
  description: "Publique uma causa animal no MyPets e avance, quando quiser, para verificação e captação de apoios.",
  alternates: { canonical: "/preciso-de-apoio" },
};

const needs = [
  { title: "Tratamento veterinário", text: "Consulta, exame, cirurgia, medicação ou recuperação.", href: "/preciso-de-apoio/publicar?type=VET_HELP&utm_source=mypets&utm_medium=internal&utm_campaign=need_support_vet", icon: Stethoscope },
  { title: "Resgate urgente", text: "Animal em risco, transporte, primeiros cuidados ou operação de resgate.", href: "/preciso-de-apoio/publicar?type=RESCUE&utm_source=mypets&utm_medium=internal&utm_campaign=need_support_rescue", icon: PawPrint },
  { title: "Abrigo ou protetor", text: "Ração, medicamentos, estrutura, manutenção ou apoio recorrente.", href: "/preciso-de-apoio/publicar?type=SHELTER&utm_source=mypets&utm_medium=internal&utm_campaign=need_support_shelter", icon: Home },
  { title: "Emergência coletiva", text: "Enchentes, incêndios, evacuação, acolhimento ou resposta extraordinária.", href: "/preciso-de-apoio/publicar?type=EMERGENCY&utm_source=mypets&utm_medium=internal&utm_campaign=need_support_emergency", icon: Siren },
  { title: "ONG, associação ou projeto", text: "Apresente a organização, iniciativa ou projeto e a forma de apoio de que precisa.", href: "/preciso-de-apoio/publicar?type=NGO_PROJECT&utm_source=mypets&utm_medium=internal&utm_campaign=need_support_project", icon: Building2 },
  { title: "Sou protetor independente", text: "Dê visibilidade ao seu trabalho e às necessidades que enfrenta agora.", href: "/preciso-de-apoio/publicar?type=OTHER&utm_source=mypets&utm_medium=internal&utm_campaign=need_support_protector", icon: UsersRound },
];

export default function NeedSupportPage() {
  return (
    <>
      <SiteHeader />
      <main className="min-h-screen bg-cream pt-[72px]">
        <section className="bg-petrol text-white">
          <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-coral">Preciso de apoio</p>
            <h1 className="mt-3 max-w-4xl text-balance text-4xl font-black tracking-tight sm:text-5xl">Transforme a necessidade numa causa pública em poucos minutos.</h1>
            <p className="mt-4 max-w-3xl text-base leading-7 text-white/70">Não precisa começar por documentos, dados bancários ou uma estrutura formal. Publique a história e ganhe uma presença partilhável no MyPets. A verificação e a captação financeira são uma segunda etapa.</p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link href="/preciso-de-apoio/publicar?utm_source=mypets&utm_medium=internal&utm_campaign=support_intake_direct" className="inline-flex min-h-12 items-center gap-2 rounded-xl bg-coral px-6 text-sm font-black text-white transition hover:bg-coral-dark">Publicar uma causa agora <ArrowRight className="h-4 w-4" /></Link>
              <Link href="/join/protetor" className="inline-flex min-h-12 items-center gap-2 rounded-xl border border-white/20 bg-white/5 px-5 text-sm font-bold text-white transition hover:bg-white/10">Já sou protetor e quero criar conta</Link>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
          <div className="mb-8 grid gap-4 md:grid-cols-2">
            <div className="rounded-3xl border border-border bg-white p-6"><Megaphone className="h-6 w-6 text-coral" /><h2 className="mt-4 text-xl font-black text-petrol">Nível 1 · Presença MyPets</h2><p className="mt-2 text-sm leading-6 text-muted-foreground">Publicação rápida, URL própria, redes sociais e entrada na fila editorial. A página mostra claramente que a causa foi enviada pela comunidade e ainda não foi verificada.</p></div>
            <div className="rounded-3xl border border-emerald-200 bg-white p-6"><BadgeCheck className="h-6 w-6 text-emerald-700" /><h2 className="mt-4 text-xl font-black text-petrol">Nível 2 · MyPets Verificado</h2><p className="mt-2 text-sm leading-6 text-muted-foreground">Validação do responsável e documentos, estrutura de beneficiário, habilitação para apoios financeiros e acompanhamento de valores a repassar/payouts através dos prestadores integrados.</p></div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {needs.map(({ title, text, href, icon: Icon }) => (
              <Link key={title} href={href} className="group rounded-3xl border border-border bg-white p-6 transition hover:-translate-y-1 hover:border-coral/35 hover:shadow-lg">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#eef8f7] text-[#0d6e6b]"><Icon className="h-6 w-6" /></span>
                <h2 className="mt-5 text-xl font-black text-petrol">{title}</h2>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{text}</p>
                <span className="mt-5 inline-flex items-center gap-2 text-sm font-black text-[#0d6e6b]">Publicar esta causa <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" /></span>
              </Link>
            ))}
          </div>

          <div className="mt-8 rounded-3xl border border-border bg-white p-6 sm:p-8">
            <p className="text-xs font-black uppercase tracking-[0.15em] text-coral">Confiança por etapas</p>
            <h2 className="mt-2 text-2xl font-black text-petrol">Visibilidade pode ser rápida. Dinheiro exige verificação.</h2>
            <p className="mt-3 max-w-4xl text-sm leading-6 text-muted-foreground">Uma submissão pública não recebe automaticamente o selo MyPets Verificado e não pode receber pagamentos pelo MyPets. Para ativar captação, o responsável solicita a verificação, apresenta identidade/documentação pelo canal indicado e passa pela análise aplicável antes da habilitação financeira.</p>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}