import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BadgeCheck, Clock3, HeartHandshake, Megaphone, ShieldCheck } from "lucide-react";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { AuthDialog } from "@/components/layout/auth-dialog";
import { impactProjects } from "@/lib/impact-projects";

export const metadata: Metadata = {
  title: "Projetos de impacto | MyPets",
  description: "Conheça os projetos e ecossistemas de apoio do MyPets: alimentação, tratamentos veterinários, resgates, abrigos e emergências.",
  alternates: { canonical: "/projetos" },
};

export default function ProjectsPage() {
  const projects = impactProjects();
  return (
    <>
      <SiteHeader />
      <main className="min-h-screen bg-cream pt-[72px]">
        <section className="relative overflow-hidden bg-petrol px-4 py-14 text-white sm:px-6 lg:px-8 lg:py-20">
          <div aria-hidden className="absolute inset-0 bg-[radial-gradient(circle_at_12%_18%,rgba(255,98,88,0.18),transparent_28%),radial-gradient(circle_at_85%_64%,rgba(46,163,160,0.14),transparent_30%)]" />
          <div className="relative mx-auto max-w-7xl">
            <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-coral">MyPets Impact</p>
            <h1 className="mt-4 max-w-4xl text-balance text-4xl font-black leading-[1.05] tracking-tight sm:text-5xl">Um ecossistema para cada tipo de necessidade animal.</h1>
            <p className="mt-5 max-w-3xl text-base leading-7 text-white/70">Cada vertical tem mensagem, intenção e funil próprios. O núcleo MyPets continua único: perfis, animais, necessidades, causas, histórias, atribuição de tráfego e pagamentos seguros.</p>
            <div className="mt-7 flex flex-wrap gap-3"><Link href="/causas" className="inline-flex min-h-11 items-center gap-2 rounded-full bg-coral px-5 text-sm font-black text-white">Ver causas reais <ArrowRight className="h-4 w-4" /></Link><Link href="/projetos/apresentar?utm_source=mypets&utm_medium=internal&utm_campaign=impact_hub&utm_content=submit_project" className="inline-flex min-h-11 items-center rounded-full border border-white/20 bg-white/5 px-5 text-sm font-black text-white">Apresentar projeto</Link></div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {projects.map((project) => (
              <Link key={project.slug} href={`/projetos/${project.slug}`} className="group overflow-hidden rounded-3xl border border-border bg-white shadow-sm transition hover:-translate-y-1 hover:border-coral/30 hover:shadow-lg">
                <div className="relative h-52 overflow-hidden bg-sand"><img src={project.image} alt={`${project.title} — ${project.category}`} className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.035]" /><div className="absolute inset-0 bg-gradient-to-t from-petrol/48 via-transparent to-transparent" /><span className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-white/92 px-3 py-1.5 text-[10px] font-black uppercase tracking-wide text-petrol shadow-sm">{project.status === "active" ? <><BadgeCheck className="h-3.5 w-3.5 text-emerald-600" /> Projeto real ativo</> : <><Clock3 className="h-3.5 w-3.5 text-coral" /> Ecossistema em lançamento</>}</span></div>
                <div className="p-5 sm:p-6"><p className="text-[10px] font-black uppercase tracking-[0.15em] text-coral">{project.category}</p><h2 className="mt-1.5 text-2xl font-black tracking-tight text-petrol group-hover:text-coral">{project.title}</h2><p className="mt-2 text-sm leading-6 text-muted-foreground">{project.ecosystem?.lead ?? project.summary}</p><div className="mt-5 flex items-center justify-between gap-3"><span className="inline-flex items-center gap-2 text-sm font-black text-petrol">Abrir ecossistema <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" /></span><span className="text-[10px] font-bold text-muted-foreground">{project.fundingLabel ?? (project.status === "active" ? "Captação ativa" : "Funil preparado")}</span></div></div>
              </Link>
            ))}
          </div>

          <div className="mt-10 grid gap-4 rounded-3xl bg-white p-6 ring-1 ring-border sm:grid-cols-3 sm:p-8">
            <div className="flex gap-3"><ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" /><div><p className="font-black text-petrol">Mesmo núcleo de confiança</p><p className="mt-1 text-sm leading-5 text-muted-foreground">Projetos e campanhas usam as mesmas regras de publicação, acompanhamento e proteção de dados.</p></div></div>
            <div className="flex gap-3"><Megaphone className="mt-0.5 h-5 w-5 shrink-0 text-coral" /><div><p className="font-black text-petrol">Mensagens específicas</p><p className="mt-1 text-sm leading-5 text-muted-foreground">Cada vertical pode ter anúncios, landing pages e criativos próprios sem fragmentar a plataforma.</p></div></div>
            <div className="flex gap-3"><HeartHandshake className="mt-0.5 h-5 w-5 shrink-0 text-petrol" /><div><p className="font-black text-petrol">Conversão por intenção</p><p className="mt-1 text-sm leading-5 text-muted-foreground">Quem precisa de ajuda e quem quer apoiar entram por caminhos distintos, com origem e campanha preservadas.</p></div></div>
          </div>
        </section>
      </main>
      <SiteFooter />
      <AuthDialog />
    </>
  );
}
