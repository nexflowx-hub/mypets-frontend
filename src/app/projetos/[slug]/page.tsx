import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, BadgeCheck, CheckCircle2, ExternalLink, HeartHandshake, Megaphone, ShieldCheck, UsersRound } from "lucide-react";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { AuthDialog } from "@/components/layout/auth-dialog";
import { impactProject, impactProjects, internalProjectFunnel, trackedProjectFunnel } from "@/lib/impact-projects";

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
  const ecosystem = project.ecosystem;
  const requestHref = ecosystem ? internalProjectFunnel(project, "request", "project_page") : null;
  const supportHref = ecosystem ? internalProjectFunnel(project, "support", "project_page") : null;

  return (
    <>
      <SiteHeader />
      <main className="min-h-screen bg-cream pt-[72px]">
        <section className="relative overflow-hidden bg-petrol text-white">
          <div aria-hidden className="absolute inset-0 bg-[radial-gradient(circle_at_18%_12%,rgba(255,98,88,0.16),transparent_30%),radial-gradient(circle_at_84%_60%,rgba(46,163,160,0.14),transparent_34%)]" />
          <div className="relative mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[1fr_0.92fr] lg:px-8 lg:py-16">
            <div className="flex flex-col justify-center">
              <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-white/10 bg-white/8 px-3 py-1.5 text-xs font-extrabold text-white">
                {active ? <BadgeCheck className="h-4 w-4 text-emerald-400" /> : <HeartHandshake className="h-4 w-4 text-coral" />}
                {active ? "Projeto apoiado pelo MyPets" : "Ecossistema MyPets em lançamento"}
              </span>
              <p className="mt-5 text-xs font-extrabold uppercase tracking-[0.16em] text-coral">{project.category}</p>
              <h1 className="mt-2 text-balance text-4xl font-extrabold leading-[1.03] tracking-tight sm:text-5xl lg:text-6xl">{project.title}</h1>
              <p className="mt-5 max-w-2xl text-base leading-7 text-white/75 sm:text-lg">{ecosystem?.headline ?? project.summary}</p>
              {ecosystem && <p className="mt-3 max-w-2xl text-sm leading-6 text-white/58">{ecosystem.lead}</p>}

              <div className="mt-7 flex flex-wrap gap-3">
                {active && project.publicUrl ? (
                  <a href={project.publicUrl} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 items-center gap-2 rounded-full bg-coral px-6 text-sm font-extrabold text-white transition hover:bg-coral-dark">Visitar Together We Feed <ExternalLink className="h-4 w-4" /></a>
                ) : active && funnel ? (
                  <a href={funnel} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 items-center gap-2 rounded-full bg-coral px-6 text-sm font-extrabold text-white transition hover:bg-coral-dark">Apoiar este projeto <ExternalLink className="h-4 w-4" /></a>
                ) : ecosystem && supportHref ? (
                  <Link href={supportHref} className="inline-flex min-h-12 items-center gap-2 rounded-full bg-coral px-6 text-sm font-extrabold text-white transition hover:bg-coral-dark">{ecosystem.supportLabel} <ArrowRight className="h-4 w-4" /></Link>
                ) : null}
                {ecosystem && requestHref ? <Link href={requestHref} className="inline-flex min-h-12 items-center gap-2 rounded-full border border-white/25 bg-white/8 px-6 text-sm font-extrabold text-white transition hover:bg-white/14">{ecosystem.requestLabel}</Link> : <Link href="/projetos" className="inline-flex min-h-12 items-center gap-2 rounded-full border border-white/20 bg-white/5 px-5 text-sm font-extrabold text-white transition hover:bg-white/10">Ver todos os projetos</Link>}
              </div>
            </div>

            <div className="relative min-h-72 overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-2xl shadow-black/10 sm:min-h-96">
              {remoteHero ? <img src={heroImage} alt={`${project.title} — ${project.category}`} className="absolute inset-0 h-full w-full object-cover" /> : <Image src={heroImage} alt={`${project.title} — ${project.category}`} fill priority className="object-cover" sizes="(min-width: 1024px) 45vw, 100vw" />}
              <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-petrol/20 via-transparent to-transparent" />
            </div>
          </div>
        </section>

        <section className="mx-auto grid max-w-7xl gap-6 px-4 py-10 sm:px-6 lg:grid-cols-[minmax(0,1fr)_340px] lg:px-8 lg:py-14">
          <div className="space-y-6">
            <article className="rounded-3xl border border-border bg-white p-6 sm:p-8">
              <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-coral">Dentro do ecossistema MyPets</p>
              <h2 className="mt-2 text-2xl font-extrabold text-petrol">Uma ligação simples entre quem precisa e quem quer ajudar</h2>
              <p className="mt-4 text-[15px] leading-7 text-ink/80">{project.description}</p>
              <div className="mt-6 rounded-2xl bg-sand p-5 text-sm leading-6 text-ink/80">O MyPets funciona como porta de entrada, camada de confiança, descoberta, atribuição de tráfego e acompanhamento. Cada causa pode ter o seu próprio funil sem duplicar o modelo de dados nem tratar um retorno do navegador como confirmação de pagamento.</div>
            </article>

            {ecosystem && requestHref && supportHref && (
              <>
                <section className="grid gap-4 md:grid-cols-2">
                  <Link href={requestHref} className="group rounded-3xl border border-[#cfe8e6] bg-[#eef8f7] p-6 transition hover:-translate-y-1 hover:shadow-lg">
                    <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#0d6e6b] text-white"><UsersRound className="h-5 w-5" /></span>
                    <p className="mt-5 text-xs font-black uppercase tracking-[0.15em] text-[#0d6e6b]">Precisa de apoio?</p>
                    <h2 className="mt-2 text-2xl font-black tracking-tight text-petrol">{ecosystem.requestLabel}</h2>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">Entre pelo fluxo certo, apresente o caso e deixe o MyPets preservar a origem da campanha para acompanhamento e atribuição.</p>
                    <span className="mt-5 inline-flex items-center gap-2 text-sm font-black text-[#0d6e6b]">Começar agora <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" /></span>
                  </Link>
                  <Link href={supportHref} className="group rounded-3xl border border-[#ffe0db] bg-[#fff0ee] p-6 transition hover:-translate-y-1 hover:shadow-lg">
                    <span className="flex h-11 w-11 items-center justify-center rounded-full bg-coral text-white"><HeartHandshake className="h-5 w-5" /></span>
                    <p className="mt-5 text-xs font-black uppercase tracking-[0.15em] text-coral">Quer ajudar?</p>
                    <h2 className="mt-2 text-2xl font-black tracking-tight text-petrol">{ecosystem.supportLabel}</h2>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">Entre como apoiador e descubra causas, formas de participação e futuros links de campanha deste vertical.</p>
                    <span className="mt-5 inline-flex items-center gap-2 text-sm font-black text-coral">Quero participar <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" /></span>
                  </Link>
                </section>

                <section className="grid gap-5 rounded-3xl border border-border bg-white p-6 sm:p-8 md:grid-cols-2">
                  <div><p className="text-xs font-black uppercase tracking-[0.15em] text-coral">O que mobilizamos</p><h2 className="mt-2 text-2xl font-black text-petrol">Necessidades que este ecossistema pode organizar</h2><div className="mt-5 grid gap-3">{ecosystem.supportOptions.map((item) => <p key={item} className="flex items-center gap-2 text-sm font-bold text-ink/78"><CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />{item}</p>)}</div></div>
                  <div className="rounded-2xl bg-cream p-5"><p className="text-xs font-black uppercase tracking-[0.15em] text-petrol/55">Para quem</p><div className="mt-4 grid gap-3">{ecosystem.beneficiaries.map((item) => <p key={item} className="flex items-center gap-2 text-sm font-bold text-petrol"><ShieldCheck className="h-4 w-4 shrink-0 text-coral" />{item}</p>)}</div></div>
                </section>

                <section className="rounded-3xl border border-border bg-white p-6 sm:p-8">
                  <p className="text-xs font-black uppercase tracking-[0.15em] text-coral">Como funciona</p>
                  <h2 className="mt-2 text-2xl font-black text-petrol">Do pedido ao apoio, sem quebrar o modelo MyPets</h2>
                  <div className="mt-6 grid gap-4 md:grid-cols-3">{ecosystem.steps.map((step, index) => <article key={step.title} className="rounded-2xl bg-cream p-5"><span className="flex h-9 w-9 items-center justify-center rounded-full bg-petrol text-sm font-black text-white">{index + 1}</span><h3 className="mt-4 text-base font-black text-petrol">{step.title}</h3><p className="mt-2 text-sm leading-6 text-muted-foreground">{step.text}</p></article>)}</div>
                </section>

                <section className="overflow-hidden rounded-3xl bg-petrol p-6 text-white sm:p-8">
                  <div className="grid gap-6 md:grid-cols-[1fr_auto] md:items-center"><div><p className="text-xs font-black uppercase tracking-[0.16em] text-coral">Funil preparado para tráfego</p><h2 className="mt-2 text-2xl font-black">Links dedicados, origem preservada e uma mensagem por intenção.</h2><p className="mt-3 max-w-2xl text-sm leading-6 text-white/65">Os CTAs deste vertical já transportam campanha, origem, conteúdo e intenção. Quando as primeiras causas reais forem classificadas neste ecossistema, poderão receber landing pages e campanhas específicas sem alterar o núcleo da plataforma.</p></div><div className="flex flex-col gap-2"><Link href={supportHref} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-coral px-5 text-sm font-black text-white">{ecosystem.supportLabel}<ArrowRight className="h-4 w-4" /></Link><Link href={requestHref} className="inline-flex min-h-11 items-center justify-center rounded-full border border-white/20 bg-white/5 px-5 text-sm font-black text-white">{ecosystem.requestLabel}</Link></div></div>
                </section>
              </>
            )}

            {project.media?.video && (
              <section className="overflow-hidden rounded-3xl border border-border bg-white">
                <div className="p-6 sm:p-8"><p className="text-xs font-extrabold uppercase tracking-[0.16em] text-coral">Conheça o projeto</p><h2 className="mt-2 text-2xl font-extrabold text-petrol">Veja a apresentação do Together We Feed</h2><p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">O mesmo conteúdo audiovisual utilizado pelo projeto Together We Feed, apresentado aqui dentro do ecossistema MyPets.</p></div>
                <div className="bg-petrol"><video controls playsInline preload="metadata" poster={project.media.video.poster} className="aspect-video w-full bg-petrol object-cover" aria-label={project.media.video.title}><source src={project.media.video.src} type="video/mp4" />O seu navegador não suporta reprodução de vídeo HTML5.</video></div>
                {project.publicUrl && <div className="flex flex-col gap-3 border-t border-border p-5 sm:flex-row sm:items-center sm:justify-between sm:px-8"><p className="text-sm font-semibold text-petrol">Quer conhecer a campanha completa ou apoiar diretamente?</p><a href={project.publicUrl} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-coral px-5 text-sm font-extrabold text-white transition hover:bg-coral-dark">Abrir twf-help.vercel.app <ExternalLink className="h-4 w-4" /></a></div>}
              </section>
            )}

            {project.media?.gallery && project.media.gallery.length > 0 && (
              <section className="rounded-3xl border border-border bg-white p-6 sm:p-8"><p className="text-xs font-extrabold uppercase tracking-[0.16em] text-coral">Imagens do projeto</p><h2 className="mt-2 text-2xl font-extrabold text-petrol">Histórias, missão e impacto</h2><p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">Seleção visual proveniente dos assets oficiais do Together We Feed.</p><div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{project.media.gallery.map((item) => <figure key={item.src} className="group overflow-hidden rounded-2xl bg-sand"><div className="aspect-[4/3] overflow-hidden"><img src={item.src} alt={item.alt} loading="lazy" className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]" /></div></figure>)}</div></section>
            )}
          </div>

          <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-3xl border border-border bg-white p-6">
              <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-coral">Modelo MyPets</p>
              <div className="mt-4 space-y-3 text-sm leading-6 text-muted-foreground">
                <p className="flex gap-2"><ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" /> Projeto ou vertical identificado dentro do ecossistema.</p>
                <p className="flex gap-2"><HeartHandshake className="mt-0.5 h-4 w-4 shrink-0 text-coral" /> Funil dedicado para captação de apoiadores.</p>
                <p className="flex gap-2"><Megaphone className="mt-0.5 h-4 w-4 shrink-0 text-petrol" /> Origem e campanha preservadas nos links de tráfego.</p>
                <p className="flex gap-2"><BadgeCheck className="mt-0.5 h-4 w-4 shrink-0 text-petrol" /> Estrutura preparada para acompanhamento e transparência.</p>
              </div>
            </div>

            {ecosystem && supportHref && requestHref && <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-border"><p className="text-xs font-black uppercase tracking-[0.14em] text-muted-foreground">Escolha o seu caminho</p><Link href={supportHref} className="mt-4 flex min-h-11 items-center justify-center rounded-full bg-coral px-4 text-center text-sm font-black text-white">{ecosystem.supportLabel}</Link><Link href={requestHref} className="mt-2 flex min-h-11 items-center justify-center rounded-full border border-border bg-cream px-4 text-center text-sm font-black text-petrol">{ecosystem.requestLabel}</Link></div>}

            {active && project.publicUrl && <a href={project.publicUrl} target="_blank" rel="noopener noreferrer" className="group block rounded-3xl bg-coral p-6 text-white transition hover:-translate-y-0.5 hover:bg-coral-dark"><p className="text-xs font-bold text-white/75">Site do projeto</p><p className="mt-1 text-lg font-extrabold">Together We Feed</p><span className="mt-4 inline-flex items-center gap-2 text-sm font-extrabold">Visitar agora <ExternalLink className="h-4 w-4 transition group-hover:translate-x-1" /></span></a>}

            {project.sourceRepository && <a href={project.sourceRepository} target="_blank" rel="noopener noreferrer" className="group block rounded-3xl border border-border bg-white p-6 text-petrol transition hover:-translate-y-0.5 hover:border-coral/30"><p className="text-xs font-bold text-muted-foreground">Projeto técnico</p><p className="mt-1 font-extrabold">Repositório TogetherWeFeed</p><span className="mt-3 inline-flex items-center gap-2 text-xs font-bold text-coral">Ver no GitHub <ExternalLink className="h-3.5 w-3.5" /></span></a>}

            <Link href="/projetos" className="group flex items-center justify-between gap-4 rounded-3xl bg-petrol p-6 text-white transition hover:-translate-y-0.5"><div><p className="text-xs font-bold text-white/60">MyPets Impact</p><p className="mt-1 font-extrabold">Ver todos os ecossistemas</p></div><ArrowRight className="h-5 w-5 shrink-0 transition group-hover:translate-x-1" /></Link>
          </aside>
        </section>
      </main>
      <SiteFooter />
      <AuthDialog />
    </>
  );
}
