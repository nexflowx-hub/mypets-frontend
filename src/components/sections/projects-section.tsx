import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BadgeCheck, Clock3 } from "lucide-react";
import { impactProjects } from "@/lib/impact-projects";

export function ProjectsSection() {
  const projects = impactProjects();
  const active = projects.find((project) => project.status === "active");
  const preparing = projects.filter((project) => project.status === "preparing");

  if (!active) return null;

  return (
    <section id="projetos" className="bg-white py-14 lg:py-20">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-coral">MyPets Impact</p>
            <h2 className="mt-2 max-w-3xl text-balance text-3xl font-extrabold tracking-tight text-petrol sm:text-4xl">Projetos que apoiamos — cada um com o seu próprio funil.</h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">O Together We Feed é o primeiro projeto real integrado. As próximas frentes já ficam preparadas para receber casos e campanhas próprias.</p>
          </div>
          <Link href="/projetos" className="group inline-flex min-h-11 items-center gap-2 rounded-full border border-border bg-white px-5 text-sm font-extrabold text-petrol transition hover:border-coral/40 hover:text-coral">
            Ver projetos <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="mt-8 grid gap-5 lg:grid-cols-[1.3fr_1fr]">
          <Link href={`/projetos/${active.slug}`} className="group grid overflow-hidden rounded-3xl bg-petrol text-white shadow-[0_22px_46px_-30px_rgba(16,32,42,0.75)] sm:grid-cols-[0.95fr_1.05fr]">
            <div className="relative min-h-64 sm:min-h-80">
              <Image src={active.image} alt="" fill className="object-cover" sizes="(min-width: 1024px) 40vw, 100vw" />
            </div>
            <div className="flex flex-col justify-center p-6 sm:p-8">
              <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-xs font-extrabold"><BadgeCheck className="h-4 w-4 text-emerald-400" /> Primeiro projeto apoiado</span>
              <p className="mt-5 text-xs font-extrabold uppercase tracking-[0.14em] text-coral">{active.category}</p>
              <h3 className="mt-2 text-3xl font-extrabold tracking-tight">{active.title}</h3>
              <p className="mt-3 text-sm leading-6 text-white/70">{active.summary}</p>
              <span className="mt-6 inline-flex items-center gap-2 text-sm font-extrabold text-white">Conhecer e apoiar <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" /></span>
            </div>
          </Link>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
            {preparing.map((project) => (
              <Link key={project.slug} href={`/projetos/${project.slug}`} className="group flex items-center gap-4 rounded-2xl border border-border bg-cream p-4 transition hover:-translate-y-0.5 hover:border-coral/30 hover:bg-white hover:shadow-sm">
                <div className="relative h-20 w-24 shrink-0 overflow-hidden rounded-xl bg-sand"><Image src={project.image} alt="" fill className="object-cover" sizes="96px" /></div>
                <div className="min-w-0">
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-muted-foreground"><Clock3 className="h-3 w-3" /> Em preparação</span>
                  <h3 className="mt-1 truncate text-base font-extrabold text-petrol group-hover:text-coral">{project.title}</h3>
                  <p className="mt-1 line-clamp-2 text-xs leading-5 text-muted-foreground">{project.summary}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
