import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Stethoscope, PawPrint, Home, Siren, Building2, UsersRound } from "lucide-react";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { AuthDialog } from "@/components/layout/auth-dialog";

export const metadata: Metadata = {
  title: "Preciso de apoio | MyPets",
  description: "Apresente um projeto, causa ou necessidade animal ao MyPets pelo fluxo mais adequado.",
  alternates: { canonical: "/preciso-de-apoio" },
};

const needs = [
  { title: "Tratamento veterinário", text: "Consulta, exame, cirurgia, medicação ou recuperação.", href: "/join/protetor?utm_source=mypets&utm_medium=internal&utm_campaign=need_support_vet&utm_content=vet_help&src_cta=support_intake", icon: Stethoscope },
  { title: "Resgate urgente", text: "Animal em risco, transporte, primeiros cuidados ou operação de resgate.", href: "/join/protetor?utm_source=mypets&utm_medium=internal&utm_campaign=need_support_rescue&utm_content=rescue&src_cta=support_intake", icon: PawPrint },
  { title: "Abrigo ou protetor", text: "Ração, medicamentos, estrutura, manutenção ou apoio recorrente.", href: "/join/protetor?utm_source=mypets&utm_medium=internal&utm_campaign=need_support_shelter&utm_content=shelter&src_cta=support_intake", icon: Home },
  { title: "Emergência coletiva", text: "Enchentes, incêndios, evacuação, acolhimento ou resposta extraordinária.", href: "/join/protetor?utm_source=mypets&utm_medium=internal&utm_campaign=need_support_emergency&utm_content=emergency&src_cta=support_intake", icon: Siren },
  { title: "ONG, associação ou projeto", text: "Apresente a organização, iniciativa ou projeto e a forma de apoio de que precisa.", href: "/join/projeto?utm_source=mypets&utm_medium=internal&utm_campaign=need_support_project&utm_content=organization&src_cta=support_intake", icon: Building2 },
  { title: "Sou protetor independente", text: "Crie a porta de entrada para organizar animais, necessidades e futuras causas.", href: "/join/protetor?utm_source=mypets&utm_medium=internal&utm_campaign=need_support_protector&utm_content=independent_protector&src_cta=support_intake", icon: UsersRound },
];

export default function NeedSupportPage() {
  return (
    <>
      <SiteHeader />
      <main className="min-h-screen bg-cream pt-[72px]">
        <section className="bg-petrol text-white">
          <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-coral">Preciso de apoio</p>
            <h1 className="mt-3 max-w-4xl text-balance text-4xl font-black tracking-tight sm:text-5xl">Conte-nos o que está a acontecer. Comece pelo caminho certo.</h1>
            <p className="mt-4 max-w-3xl text-base leading-7 text-white/70">O primeiro passo não é pedir dados bancários nem documentos sensíveis. Recolhemos o contexto essencial e encaminhamos o caso para avaliação e estruturação.</p>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {needs.map(({ title, text, href, icon: Icon }) => (
              <Link key={title} href={href} className="group rounded-3xl border border-border bg-white p-6 transition hover:-translate-y-1 hover:border-coral/35 hover:shadow-lg">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#eef8f7] text-[#0d6e6b]"><Icon className="h-6 w-6" /></span>
                <h2 className="mt-5 text-xl font-black text-petrol">{title}</h2>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{text}</p>
                <span className="mt-5 inline-flex items-center gap-2 text-sm font-black text-[#0d6e6b]">Apresentar pedido <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" /></span>
              </Link>
            ))}
          </div>

          <div className="mt-8 rounded-3xl border border-border bg-white p-6 sm:p-8">
            <p className="text-xs font-black uppercase tracking-[0.15em] text-coral">Antes de publicar uma causa</p>
            <h2 className="mt-2 text-2xl font-black text-petrol">O MyPets separa pedido, verificação e campanha pública.</h2>
            <p className="mt-3 max-w-4xl text-sm leading-6 text-muted-foreground">Enviar um pedido não cria automaticamente uma campanha nem garante captação. Casos públicos devem ter responsável identificável, informação verificável, objetivo claro e autorização para divulgação.</p>
          </div>
        </section>
      </main>
      <SiteFooter />
      <AuthDialog />
    </>
  );
}
