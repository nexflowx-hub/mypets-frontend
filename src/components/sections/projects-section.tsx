import Link from "next/link";
import { ArrowRight, BadgeCheck, Clock3 } from "lucide-react";
import { impactProjects } from "@/lib/impact-projects";

export function ProjectsSection() {
  const projects = impactProjects();
  const active = projects.find((project) => project.status === "active");
  const verticals = projects.filter((project) => project.slug !== active?.slug);
  if (!active) return null;

  return (
    <section id="projetos" className="border-t border-border/50 bg-cream py-9 lg:py-11">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div><p className="text-[10px] font-black uppercase tracking-[0.18em] text-coral">MyPets Impact</p><h2 className="mt-1.5 text-[25px] font-black tracking-tight text-petrol sm:text-[30px]">Um ecossistema para cada tipo de necessidade.</h2><p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">Together We Feed é o primeiro projeto real. Vet Help, Rescue, Shelter e Emergency já funcionam como verticais de aquisição, triagem e futura publicação de campanhas dedicadas.</p></div>
          <Link href="/projetos" className="group inline-flex min-h-10 items-center gap-2 rounded-full border border-border bg-white px-5 text-xs font-black text-petrol transition hover:border-coral/40 hover:text-coral">Ver todos <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" /></Link>
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-[1.25fr_1fr]">
          <Link href={`/projetos/${active.slug}`} className="group relative min-h-[290px] overflow-hidden rounded-3xl bg-petrol text-white shadow-[0_18px_40px_-30px_rgba(16,32,42,0.75)]">
            <img src={active.image} alt="Together We Feed" className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-[1.025]" />
            <div className="absolute inset-0 bg-gradient-to-r from-petrol/95 via-petrol/72 to-petrol/10" />
            <div className="relative flex min-h-[290px] max-w-xl flex-col justify-center p-6 sm:p-8">
              <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-[10px] font-black uppercase tracking-wide"><BadgeCheck className="h-4 w-4 text-emerald-400" /> Primeiro projeto real</span>
              <p className="mt-5 text-[10px] font-black uppercase tracking-[0.15em] text-coral">{active.category}</p>
              <h3 className="mt-1 text-3xl font-black tracking-tight">{active.title}</h3>
              <p className="mt-2 max-w-md text-sm leading-6 text-white/70">{active.summary}</p>
              <span className="mt-5 inline-flex items-center gap-2 text-sm font-black">Conhecer projeto <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" /></span>
            </div>
          </Link>

          <div className="grid gap-3 sm:grid-cols-2">
            {verticals.map((project) => (
              <Link key={project.slug} href={`/projetos/${project.slug}`} className="group overflow-hidden rounded-2xl border border-border bg-white transition hover:-translate-y-0.5 hover:border-coral/30 hover:shadow-md">
                <div className="relative h-28 overflow-hidden bg-sand"><img src={project.image} alt="" className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]" /><span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-white/90 px-2 py-1 text-[9px] font-black uppercase tracking-wide text-petrol shadow-sm"><Clock3 className="h-3 w-3 text-coral" /> Em lançamento</span></div>
                <div className="p-4"><p className="text-[9px] font-black uppercase tracking-[0.13em] text-coral">{project.category}</p><h3 className="mt-1 text-[16px] font-black text-petrol group-hover:text-coral">{project.title}</h3><p className="mt-1.5 line-clamp-2 text-[11px] leading-4.5 text-muted-foreground">{project.summary}</p><span className="mt-3 inline-flex items-center gap-1.5 text-[10.5px] font-black text-petrol">Abrir ecossistema <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-1" /></span></div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
