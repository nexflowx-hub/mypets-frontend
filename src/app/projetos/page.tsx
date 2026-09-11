import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BadgeCheck, Clock3 } from "lucide-react";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { AuthDialog } from "@/components/layout/auth-dialog";
import { impactProjects } from "@/lib/impact-projects";

export const metadata: Metadata = {
  title: "Projetos de impacto | MyPets",
  description: "Conheça os projetos e frentes de apoio do ecossistema MyPets.",
  alternates: { canonical: "/projetos" },
};

export default function ProjectsPage() {
  const projects = impactProjects();
  const active = projects.filter((project) => project.status === "active");
  const preparing = projects.filter((project) => project.status === "preparing");

  return (
    <>
      <SiteHeader />
      <main className="min-h-screen bg-cream pt-[68px]">
        <section className="bg-petrol px-4 py-14 text-white sm:px-6 lg:px-8 lg:py-20">
          <div className="mx-auto max-w-7xl">
            <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-coral">MyPets Impact</p>
            <h1 className="mt-4 max-w-4xl text-balance text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">
              Projetos que transformam apoio em impacto real.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-white/70">
              Cada projeto pode ter o seu próprio funil de captação, enquanto o MyPets reúne descoberta, confiança, comunidade e acompanhamento.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
          <div className="mb-6 flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-coral">Em apoio agora</p>
              <h2 className="mt-2 text-2xl font-extrabold text-petrol">Projetos ativos</h2>
            </div>
          </div>

          <div className="grid gap-5">
            {active.map((project) => (
              <Link key={project.slug} href={`/projetos/${project.slug}`} className="group grid overflow-hidden rounded-3xl border border-border bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg md:grid-cols-[0.9fr_1.1fr]">
                <div className="relative min-h-64 bg-sand md:min-h-80">
                  <Image src={project.image} alt="" fill className="object-cover" sizes="(min-width: 768px) 45vw, 100vw" />
                </div>
                <div className="flex flex-col justify-center p-6 sm:p-8">
                  <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-extrabold text-emerald-700">
                    <BadgeCheck className="h-4 w-4" /> Projeto apoiado pelo MyPets
                  </span>
                  <p className="mt-5 text-xs font-extrabold uppercase tracking-[0.14em] text-coral">{project.category}</p>
                  <h3 className="mt-2 text-3xl font-extrabold tracking-tight text-petrol">{project.title}</h3>
                  <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">{project.summary}</p>
                  <span className="mt-6 inline-flex items-center gap-2 text-sm font-extrabold text-coral">Conhecer e apoiar <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" /></span>
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-14">
            <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-coral">Próximas frentes</p>
            <h2 className="mt-2 text-2xl font-extrabold text-petrol">Estrutura pronta para novos funis dedicados</h2>
            <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {preparing.map((project) => (
                <Link key={project.slug} href={`/projetos/${project.slug}`} className="group overflow-hidden rounded-3xl border border-border bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg">
                  <div className="relative aspect-[16/10] bg-sand">
                    <Image src={project.image} alt="" fill className="object-cover" sizes="(min-width: 1024px) 25vw, 50vw" />
                  </div>
                  <div className="p-5">
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold text-muted-foreground"><Clock3 className="h-3.5 w-3.5" /> Em preparação</span>
                    <h3 className="mt-2 text-xl font-extrabold text-petrol group-hover:text-coral">{project.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">{project.summary}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
      <AuthDialog />
    </>
  );
}
