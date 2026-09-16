import Link from "next/link";
import { ArrowRight, BadgeCheck, Clock3, HeartHandshake } from "lucide-react";
import { impactProjects } from "@/lib/impact-projects";
import {
  CAMPAIGN_VERTICALS,
  campaignRoute,
  campaignSegmentForProject,
  getVerticalCampaigns,
  type CampaignRouteSegment,
  type CampaignSummary,
} from "@/lib/campaign-landings";

type VerticalProject = ReturnType<typeof impactProjects>[number] & {
  campaignSegment: CampaignRouteSegment | null;
  campaigns: CampaignSummary[];
};

async function verticalProjects(): Promise<VerticalProject[]> {
  const projects = impactProjects().filter((project) => project.slug !== "together-we-feed");
  return Promise.all(
    projects.map(async (project) => {
      const campaignSegment = campaignSegmentForProject(project.slug);
      const campaigns = campaignSegment
        ? await getVerticalCampaigns(CAMPAIGN_VERTICALS[campaignSegment].vertical, 3)
        : [];
      return { ...project, campaignSegment, campaigns };
    }),
  );
}

function supportGatewayHref(projectSlug: string) {
  const params = new URLSearchParams({
    utm_source: "mypets",
    utm_medium: "internal",
    utm_campaign: projectSlug.replaceAll("-", "_"),
    utm_content: "home_projects",
    intent: "support",
  });
  return `/projetos/${projectSlug}/apoiar?${params.toString()}`;
}

export async function ProjectsSection() {
  const projects = impactProjects();
  const active = projects.find((project) => project.status === "active");
  const verticals = await verticalProjects();
  if (!active) return null;

  return (
    <section id="projetos" className="border-t border-border/50 bg-cream py-9 lg:py-11">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-coral">MyPets Impact</p>
            <h2 className="mt-1.5 text-[25px] font-black tracking-tight text-petrol sm:text-[30px]">Um ecossistema para cada tipo de necessidade.</h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">Together We Feed é o primeiro projeto real. Vet Help, Rescue, Shelter e Emergency recebem automaticamente as campanhas reais classificadas no respetivo vertical.</p>
          </div>
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
            {verticals.map((project) => {
              const liveCampaigns = project.campaigns.filter((campaign) => campaign.campaignKey);
              const supportHref = supportGatewayHref(project.slug);
              return (
                <article key={project.slug} className="overflow-hidden rounded-2xl border border-border bg-white transition hover:-translate-y-0.5 hover:border-coral/30 hover:shadow-md">
                  <Link href={`/projetos/${project.slug}`} className="group block">
                    <div className="relative h-28 overflow-hidden bg-sand">
                      <img src={project.image} alt="" className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]" />
                      {liveCampaigns.length > 0 ? (
                        <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-emerald-600/95 px-2 py-1 text-[9px] font-black uppercase tracking-wide text-white shadow-sm"><BadgeCheck className="h-3 w-3" /> {liveCampaigns.length} {liveCampaigns.length === 1 ? "campanha ativa" : "campanhas ativas"}</span>
                      ) : (
                        <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-white/90 px-2 py-1 text-[9px] font-black uppercase tracking-wide text-petrol shadow-sm"><Clock3 className="h-3 w-3 text-coral" /> Em lançamento</span>
                      )}
                    </div>
                    <div className="p-4 pb-3">
                      <p className="text-[9px] font-black uppercase tracking-[0.13em] text-coral">{project.category}</p>
                      <h3 className="mt-1 text-[16px] font-black text-petrol group-hover:text-coral">{project.title}</h3>
                      <p className="mt-1.5 line-clamp-2 text-[11px] leading-4.5 text-muted-foreground">{project.summary}</p>
                      <span className="mt-3 inline-flex items-center gap-1.5 text-[10.5px] font-black text-petrol">Abrir ecossistema <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-1" /></span>
                    </div>
                  </Link>

                  <div className="border-t border-border/70 px-4 py-3">
                    <Link
                      href={supportHref}
                      className="group/support flex min-h-10 items-center justify-center gap-2 rounded-xl bg-coral px-4 text-[11px] font-black text-white transition hover:bg-coral-dark"
                    >
                      <HeartHandshake className="h-4 w-4" />
                      Apoiar agora
                      <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover/support:translate-x-1" />
                    </Link>

                    {liveCampaigns.length > 0 && project.campaignSegment && (
                      <div className="mt-2.5 flex flex-col gap-1.5">
                        {liveCampaigns.slice(0, 2).map((campaign) => (
                          <Link
                            key={campaign.id}
                            href={campaignRoute(project.campaignSegment!, campaign.campaignKey!)}
                            className="group/campaign flex items-center justify-between gap-3 rounded-lg bg-cream px-3 py-2 text-[10.5px] font-black text-petrol transition hover:bg-coral-soft hover:text-coral"
                          >
                            <span className="line-clamp-1">{campaign.campaignMeta?.headline || campaign.title}</span>
                            <ArrowRight className="h-3.5 w-3.5 shrink-0 transition-transform group-hover/campaign:translate-x-1" />
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
