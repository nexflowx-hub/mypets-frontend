import type { Metadata } from "next";
import Link from "next/link";
import { HeartHandshake, HandHeart, PawPrint, Users, Home, BriefcaseBusiness, Siren, Sparkles } from "lucide-react";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";

export const metadata: Metadata = {
  title: "Participar | MyPets",
  description: "Escolha como quer participar no MyPets: voluntariado, padrinhos, apoio, proteção animal, adoção ou projetos.",
};

const cards = [
  { href: "/join/ajudar", title: "Quero ajudar", text: "Ainda não sabe como? Comece aqui.", icon: Sparkles },
  { href: "/join/voluntario", title: "Quero ser voluntário", text: "Tempo, transporte, acolhimento, divulgação e competências.", icon: Users },
  { href: "/join/padrinho", title: "Quero apadrinhar", text: "Acompanhar e apoiar uma história ao longo do tempo.", icon: HeartHandshake },
  { href: "/join/doador", title: "Quero apoiar causas", text: "Registe o interesse em apoiar financeiramente quando XPAYMENTS estiver ativo.", icon: HandHeart },
  { href: "/join/protetor", title: "Eu ajudo animais", text: "Crie um perfil de protetor, registe animais e necessidades.", icon: PawPrint },
  { href: "/join/adotar", title: "Quero adotar", text: "Registe interesse numa adoção responsável.", icon: Home },
  { href: "/join/projeto", title: "Tenho um projeto", text: "Associação, iniciativa, empresa, clínica ou causa animal.", icon: BriefcaseBusiness },
  { href: "/join/encontrei-um-animal", title: "Encontrei um animal", text: "Peça orientação para o próximo passo.", icon: Siren },
];

export default function JoinIndexPage() {
  return (
    <>
      <SiteHeader />
      <main className="min-h-screen bg-cream px-4 pb-20 pt-28 sm:px-6 lg:px-8">
        <section className="mx-auto max-w-6xl">
          <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-coral">Uma conta. Muitas formas de participar.</p>
          <h1 className="mt-3 max-w-3xl text-4xl font-extrabold tracking-tight text-petrol sm:text-5xl">O que gostaria de fazer hoje?</h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground">Escolha um percurso curto. Não precisa preencher um perfil completo para demonstrar interesse.</p>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {cards.map(({ href, title, text, icon: Icon }) => (
              <Link key={href} href={`${href}?utm_source=mypets&utm_medium=onsite&utm_campaign=participation_hub&utm_content=${href.split("/").pop()}`} className="group rounded-3xl border border-border bg-white p-5 transition hover:-translate-y-1 hover:border-coral/40 hover:shadow-xl">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-coral/10 text-coral transition group-hover:bg-coral group-hover:text-white"><Icon className="h-5 w-5" /></span>
                <h2 className="mt-5 text-lg font-extrabold text-petrol">{title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{text}</p>
              </Link>
            ))}
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
