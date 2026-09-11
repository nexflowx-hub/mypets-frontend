import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, BadgeCheck, ExternalLink, HeartHandshake, ShieldCheck } from "lucide-react";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { AuthDialog } from "@/components/layout/auth-dialog";
import { impactProject, impactProjects, trackedProjectFunnel } from "@/lib/impact-projects";

export function generateStaticParams() {
  return impactProjects().map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const project = impactProject(slug);
  if (!project) return { title: "Projeto | MyPets" };
  return {
    title: `${project.title} | MyPets`,
    description: project.summary,
    alternates: { canonical: `/projetos/${project.slug}` },
    openGraph: {
      title: `${project.title} | MyPets`,
      description: project.summary,
      url: `https://mypets.lat/projetos/${project.slug}`,
      siteName: "MyPets",
      type: "article",
      images: [{ url: project.media?.hero ?? project.image }],
    },
  };
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = impactProject(slug);
  if (!project) notFound();

  const funnel = trackedProjectFunnel(project);
  const active = project.status === "active";
  const heroImage = project.media?.hero ?? project.image;
  const remoteHero = heroImage.startsWith("http://") || heroImage.startsWith("https://");

  return (
    <>
      <SiteHeader />
      <main className="min-h-screen bg-cream pt-[68px]">
        <section className="bg-petrol text-white">
          <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[1fr_0.9fr] lg:px-8 lg:py-16">
            <div className="flex flex-col justify-center">
              <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-xs font-extrabold text-white">
                {active ? <BadgeCheck className="h-4 w-4 text-emerald-400" /> : <HeartHandshake className="h-4 w-4 text-coral" />}
                {active ? "Projeto apoiado pelo MyPets" : "Frente MyPets em preparação"}
              </span>
              <p className="mt-5 text-xs font-extrabold uppercase tracking-[0.16em] text-coral">{project.category}</p>
              <h1 className="mt-2 text-balance text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">{project.title}</h1>
              <p className="mt-5 max-w-2xl text-base leading-7 text-white/75 sm:text-lg">{project.summary}</p>

              <div className="mt-7 flex flex-wrap gap-3">
                {active && project.publicUrl ? (
                  <a href={project.publicUrl} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 items-center gap-2 rounded-xl bg-coral px-5 text-sm font-extrabold text-white transition hover:bg-coral-dark">
                    Visitar Together We Feed <ExternalLink className="h-4 w-4" />
                  </a>
                ) : active && funnel ? (
                  <a href={funnel} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 items-center gap-2 rounded-xl bg-coral px-5 text-sm font-extrabold text-white transition hover:bg-coral-dark">
                    Apoiar este projeto <ExternalLink className="h-4 w-4" />
                  </a>
                ) : (
                  <Link href={`/join/ajudar?utm_source=mypets&utm_medium=internal&utm_campaign=${project.slug}&src_cta=project_waitlist`} className="inline-flex min-h-12 items-center gap-2 rounded-xl bg-coral px-5 text-sm font-extrabold text-white transition hover:bg-coral-dark">
                    Quero apoiar quando abrir <ArrowRight className="h-4 w-4" />
                  </Link>
                )}
                <Link href="/projetos" className="inline-flex min-h-12 items-center gap-2 rounded-xl border border-white/20 bg-white/5 px-5 text-sm font-extrabold text-white transition hover:bg-white/10">
                  Ver todos os projetos
                </Link>
              </div>
            </div>

            <div className="relative min-h-72 overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-2xl shadow-black/10 sm:min-h-96">
              {remoteHero ? (
                <img src={heroImage} alt={`Together We Feed — ${project.category}`} className="absolute inset-0 h-full w-full object-cover" />
              ) : (
                <Image src={heroImage} alt="" fill priority className="object-cover" sizes="(min-width: 1024px) 45vw, 100vw" />
              )}
            </div>
          </div>
        </section>

        <section className="mx-auto grid max-w-7xl gap-6 px-4 py-10 sm:px-6 lg:grid-cols-[minmax(0,1fr)_340px] lg:px-8 lg:py-14">
          <div className="space-y-6">
            <article className="rounded-3xl border border-border bg-white p-6 sm:p-8">
              <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-coral">Dentro do ecossistema MyPets</p>
              <h2 className="mt-2 text-2xl font-extrabold text-petrol">Uma ligação simples entre quem precisa e quem quer ajudar</h2>
              <p className="mt-4 text-[15px] leading-7 text-ink/80">{project.description}</p>
              {active && (
                <div className="mt-6 rounded-2xl bg-sand p-5 text-sm leading-6 text-ink/80">
                  O funil de captação continua dedicado ao próprio projeto. O MyPets funciona como porta de entrada, selo de integração no ecossistema e, progressivamente, camada de acompanhamento de necessidades, atualizações e impacto.
                </div>
              )}
            </article>

            {project.media?.video && (
              <section className="overflow-hidden rounded-3xl border border-border bg-white">
                <div className="p-6 sm:p-8">
                  <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-coral">Conheça o projeto</p>
                  <h2 className="mt-2 text-2xl font-extrabold text-petrol">Veja a apresentação do Together We Feed</h2>
                  <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">O mesmo conteúdo audiovisual utilizado pelo projeto Together We Feed, apresentado aqui dentro do ecossistema MyPets.</p>
                </div>
                <div className="bg-petrol">
                  <video
                    controls
                    playsInline
                    preload="metadata"
                    poster={project.media.video.poster}
                    className="aspect-video w-full bg-petrol object-cover"
                    aria-label={project.media.video.title}
                  >
                    <source src={project.media.video.src} type="video/mp4" />
                    O seu navegador não suporta reprodução de vídeo HTML5.
                  </video>
                </div>
                {project.publicUrl && (
                  <div className="flex flex-col gap-3 border-t border-border p-5 sm:flex-row sm:items-center sm:justify-between sm:px-8">
                    <p className="text-sm font-semibold text-petrol">Quer conhecer a campanha completa ou apoiar diretamente?</p>
                    <a href={project.publicUrl} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-coral px-5 text-sm font-extrabold text-white transition hover:bg-coral-dark">
                      Abrir twf-help.vercel.app <ExternalLink className="h-4 w-4" />
                    </a>
                  </div>
                )}
              </section>
            )}

            {project.media?.gallery && project.media.gallery.length > 0 && (
              <section className="rounded-3xl border border-border bg-white p-6 sm:p-8">
                <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-coral">Imagens do projeto</p>
                <h2 className="mt-2 text-2xl font-extrabold text-petrol">Histórias, missão e impacto</h2>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">Seleção visual proveniente dos assets oficiais do Together We Feed.</p>
                <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {project.media.gallery.map((item) => (
                    <figure key={item.src} className="group overflow-hidden rounded-2xl bg-sand">
                      <div className="aspect-[4/3] overflow-hidden">
                        <img src={item.src} alt={item.alt} loading="lazy" className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]" />
                      </div>
                    </figure>
                  ))}
                </div>
              </section>
            )}
          </div>

          <aside className="space-y-4">
            <div className="rounded-3xl border border-border bg-white p-6">
              <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-coral">Modelo MyPets</p>
              <div className="mt-4 space-y-3 text-sm leading-6 text-muted-foreground">
                <p className="flex gap-2"><ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" /> Projeto identificado dentro do ecossistema.</p>
                <p className="flex gap-2"><HeartHandshake className="mt-0.5 h-4 w-4 shrink-0 text-coral" /> Funil dedicado para captação de apoiadores.</p>
                <p className="flex gap-2"><BadgeCheck className="mt-0.5 h-4 w-4 shrink-0 text-petrol" /> Estrutura preparada para acompanhamento e transparência.</p>
              </div>
            </div>

            {active && project.publicUrl && (
              <a href={project.publicUrl} target="_blank" rel="noopener noreferrer" className="group block rounded-3xl bg-coral p-6 text-white transition hover:-translate-y-0.5 hover:bg-coral-dark">
                <p className="text-xs font-bold text-white/75">Site do projeto</p>
                <p className="mt-1 text-lg font-extrabold">Together We Feed</p>
                <span className="mt-4 inline-flex items-center gap-2 text-sm font-extrabold">Visitar agora <ExternalLink className="h-4 w-4 transition group-hover:translate-x-1" /></span>
              </a>
            )}

            {project.sourceRepository && (
              <a href={project.sourceRepository} target="_blank" rel="noopener noreferrer" className="group block rounded-3xl border border-border bg-white p-6 text-petrol transition hover:-translate-y-0.5 hover:border-coral/30">
                <p className="text-xs font-bold text-muted-foreground">Projeto técnico</p>
                <p className="mt-1 font-extrabold">Repositório TogetherWeFeed</p>
                <span className="mt-3 inline-flex items-center gap-2 text-xs font-bold text-coral">Ver no GitHub <ExternalLink className="h-3.5 w-3.5" /></span>
              </a>
            )}

            <Link href="/join/projeto?utm_source=mypets&utm_medium=internal&utm_campaign=impact_projects&src_cta=project_page" className="group flex items-center justify-between gap-4 rounded-3xl bg-petrol p-6 text-white transition hover:-translate-y-0.5">
              <div><p className="text-xs font-bold text-white/60">Tem um projeto?</p><p className="mt-1 font-extrabold">Candidate-se ao ecossistema MyPets</p></div>
              <ArrowRight className="h-5 w-5 shrink-0 transition group-hover:translate-x-1" />
            </Link>
          </aside>
        </section>
      </main>
      <SiteFooter />
      <AuthDialog />
    </>
  );
}
