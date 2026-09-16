import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, BadgeCheck, HeartHandshake, ShieldCheck } from "lucide-react";
import { AuthDialog } from "@/components/layout/auth-dialog";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { CauseCheckout } from "@/components/payments/cause-checkout";
import {
  CAMPAIGN_VERTICALS,
  campaignRoute,
  campaignSegmentForProject,
  getCampaignConfig,
  getVerticalCampaigns,
  type CampaignSummary,
} from "@/lib/campaign-landings";
import { impactProject } from "@/lib/impact-projects";

export const revalidate = 30;

const SUPPORT_SLUGS = ["vet-help", "rescue", "shelter", "emergency"] as const;
const TRACKING_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
  "utm_id",
  "utm_source_platform",
  "ref",
] as const;

const INTERNAL_FUNDS = {
  "vet-help": {
    id: "9a7f1000-0000-4a11-8c01-000000000002",
    title: "Fundo MyPets Vet Help",
    text: "Apoio ao MyPets para esta frente temática. O fundo pode sustentar a operação, verificação e iniciativas elegíveis de tratamentos veterinários.",
  },
  rescue: {
    id: "9a7f1000-0000-4a11-8c01-000000000003",
    title: "Fundo MyPets Rescue",
    text: "Apoio ao MyPets para esta frente temática. O fundo pode sustentar a operação, verificação e iniciativas elegíveis de resgate e primeiros cuidados.",
  },
  shelter: {
    id: "9a7f1000-0000-4a11-8c01-000000000004",
    title: "Fundo MyPets Shelter",
    text: "Apoio ao MyPets para esta frente temática. O fundo pode sustentar a operação, verificação e iniciativas elegíveis de abrigos, lares temporários e protetores.",
  },
  emergency: {
    id: "9a7f1000-0000-4a11-8c01-000000000005",
    title: "Fundo MyPets Emergency",
    text: "Apoio ao MyPets para esta frente temática. O fundo pode sustentar a operação, verificação e iniciativas elegíveis de resposta a emergências.",
  },
} as const;

type SearchParams = Record<string, string | string[] | undefined>;

export function generateStaticParams() {
  return SUPPORT_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const project = impactProject(slug);
  const segment = campaignSegmentForProject(slug);
  if (!project || !segment) return { title: "Apoiar projeto | MyPets" };

  const title = `Apoiar ${project.title} | MyPets`;
  const description = `Apoie diretamente a frente ${project.title} ou escolha uma causa real deste ecossistema.`;
  const canonical = `/projetos/${project.slug}/apoiar`;

  return {
    title,
    description,
    alternates: { canonical },
    robots: { index: true, follow: true },
    openGraph: {
      title,
      description,
      url: `https://mypets.lat${canonical}`,
      siteName: "MyPets",
      type: "website",
      images: [{ url: project.image }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [project.image],
    },
  };
}

function valueOf(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function trackedCampaignHref(segment: keyof typeof CAMPAIGN_VERTICALS, campaignKey: string, searchParams: SearchParams) {
  const params = new URLSearchParams();
  for (const key of TRACKING_KEYS) {
    const value = valueOf(searchParams[key]);
    if (value) params.set(key, value.slice(0, 240));
  }
  if (!params.has("utm_source")) params.set("utm_source", "mypets");
  if (!params.has("utm_medium")) params.set("utm_medium", "internal");
  if (!params.has("utm_content")) params.set("utm_content", "project_support_gateway");
  params.set("src_cta", "vertical_support_gateway");

  const query = params.toString();
  const route = campaignRoute(segment, campaignKey);
  return query ? `${route}?${query}` : route;
}

function money(cents: number | null, currency: string | null) {
  if (cents == null || !currency) return null;
  try {
    return new Intl.NumberFormat(currency === "BRL" ? "pt-BR" : "pt-PT", {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(cents / 100);
  } catch {
    return `${(cents / 100).toFixed(0)} ${currency}`;
  }
}

function isFinancialCampaign(campaign: CampaignSummary) {
  return Boolean(
    campaign.campaignKey &&
    campaign.currency &&
    campaign.supportMode !== "NON_FINANCIAL",
  );
}

export default async function ProjectSupportPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<SearchParams>;
}) {
  const [{ slug }, tracking] = await Promise.all([params, searchParams]);
  const project = impactProject(slug);
  const segment = campaignSegmentForProject(slug);
  if (!project || !segment || !(slug in INTERNAL_FUNDS)) notFound();

  const config = CAMPAIGN_VERTICALS[segment];
  const fund = INTERNAL_FUNDS[slug as keyof typeof INTERNAL_FUNDS];
  const [allCampaigns, paymentConfig] = await Promise.all([
    getVerticalCampaigns(config.vertical, 24),
    getCampaignConfig(),
  ]);
  const campaigns = allCampaigns.filter(isFinancialCampaign);
  const fundReady = Boolean(
    paymentConfig.paymentsLive &&
    paymentConfig.paymentProvider === "xpayments" &&
    paymentConfig.paymentCurrencies?.includes("BRL"),
  );

  return (
    <>
      <SiteHeader />
      <main className="min-h-screen bg-cream pt-[72px]">
        <section className="relative overflow-hidden bg-petrol text-white">
          <div aria-hidden className="absolute inset-0 bg-[radial-gradient(circle_at_18%_10%,rgba(255,98,88,0.18),transparent_32%),radial-gradient(circle_at_82%_70%,rgba(46,163,160,0.16),transparent_34%)]" />
          <div className="relative mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
            <Link href={`/projetos/${project.slug}`} className="inline-flex items-center gap-2 text-xs font-black text-white/65 transition hover:text-white">
              <ArrowLeft className="h-4 w-4" /> Voltar a {project.title}
            </Link>
            <p className="mt-7 text-xs font-black uppercase tracking-[0.18em] text-coral">{project.category}</p>
            <h1 className="mt-2 max-w-3xl text-balance text-4xl font-black tracking-tight sm:text-5xl">Apoie {project.title}</h1>
            <p className="mt-4 max-w-3xl text-base leading-7 text-white/70">Pode apoiar diretamente o fundo temático MyPets ou escolher uma causa concreta deste ecossistema. O beneficiário fica explícito em cada opção.</p>
            <div className="mt-6 flex flex-wrap gap-2 text-xs font-bold text-white/70">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/12 bg-white/8 px-3 py-2"><ShieldCheck className="h-4 w-4 text-emerald-400" /> Destino financeiro identificado</span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/12 bg-white/8 px-3 py-2"><HeartHandshake className="h-4 w-4 text-coral" /> Fundo temático + causas específicas</span>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
          <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-petrol to-[#183f46] p-6 text-white shadow-lg sm:p-8">
            <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.15em] text-coral">Apoiar a categoria</p>
                <h2 className="mt-2 text-3xl font-black">{fund.title}</h2>
                <p className="mt-3 max-w-3xl text-sm leading-6 text-white/70">{fund.text}</p>
                <p className="mt-2 text-xs font-bold text-white/55">Beneficiário: MyPets · fundo BRL evergreen · separado das campanhas de terceiros.</p>
              </div>
              <div className="min-w-[190px]">
                <CauseCheckout causeId={fund.id} causeTitle={fund.title} currency="BRL" enabled={fundReady} />
                {!fundReady && <p className="max-w-[230px] text-xs leading-5 text-white/55">O apoio financeiro aparece quando a lane BRL estiver ativa.</p>}
              </div>
            </div>
          </div>

          <div className="mt-10 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.16em] text-coral">Causas específicas</p>
              <h2 className="mt-2 text-2xl font-black text-petrol sm:text-3xl">Ou escolha exatamente qual causa quer apoiar.</h2>
            </div>
            <Link href="/causas" className="inline-flex min-h-10 items-center gap-2 rounded-full border border-border bg-white px-4 text-xs font-black text-petrol transition hover:border-coral/40 hover:text-coral">Ver todas as causas <ArrowRight className="h-4 w-4" /></Link>
          </div>

          {campaigns.length === 0 ? (
            <div className="mt-7 rounded-3xl border border-border bg-white p-7 text-center sm:p-10">
              <HeartHandshake className="mx-auto h-10 w-10 text-coral" />
              <h3 className="mt-4 text-2xl font-black text-petrol">Ainda não há uma campanha financeira específica ativa neste ecossistema.</h3>
              <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">O fundo temático acima continua disponível. Assim que uma causa real for classificada em {config.label}, ela aparecerá aqui automaticamente.</p>
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <Link href={`/projetos/${project.slug}`} className="inline-flex min-h-11 items-center rounded-full bg-petrol px-5 text-sm font-black text-white">Conhecer o ecossistema</Link>
                <Link href="/causas" className="inline-flex min-h-11 items-center rounded-full border border-border bg-cream px-5 text-sm font-black text-petrol">Explorar causas ativas</Link>
              </div>
            </div>
          ) : (
            <div className="mt-7 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {campaigns.map((campaign) => {
                const currencyReady = Boolean(
                  paymentConfig.paymentsLive &&
                  paymentConfig.paymentProvider === "xpayments" &&
                  campaign.currency &&
                  paymentConfig.paymentCurrencies?.includes(campaign.currency),
                );
                const target = money(campaign.targetAmountCents, campaign.currency);
                const raised = money(campaign.raisedAmountCents, campaign.currency);
                const progress = campaign.targetAmountCents && campaign.targetAmountCents > 0
                  ? Math.min(100, Math.round((campaign.raisedAmountCents / campaign.targetAmountCents) * 100))
                  : null;
                const href = trackedCampaignHref(segment, campaign.campaignKey!, tracking);

                return (
                  <article key={campaign.id} className="overflow-hidden rounded-3xl border border-border bg-white shadow-sm">
                    <Link href={href} className="group block">
                      <div className="relative h-48 overflow-hidden bg-sand">
                        {campaign.primaryImage ? <img src={campaign.primaryImage} alt="" className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.025]" /> : <div className="flex h-full items-center justify-center bg-petrol/5"><HeartHandshake className="h-10 w-10 text-coral" /></div>}
                        <span className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-white/94 px-3 py-1.5 text-[10px] font-black uppercase tracking-wide text-petrol shadow-sm"><BadgeCheck className="h-3.5 w-3.5 text-emerald-600" /> Campanha ativa</span>
                      </div>
                      <div className="p-5">
                        <p className="text-[10px] font-black uppercase tracking-[0.14em] text-coral">{campaign.campaignMeta?.eyebrow || config.eyebrow}</p>
                        <h3 className="mt-1.5 text-xl font-black tracking-tight text-petrol group-hover:text-coral">{campaign.campaignMeta?.headline || campaign.title}</h3>
                        {campaign.summary && <p className="mt-2 line-clamp-3 text-sm leading-6 text-muted-foreground">{campaign.summary}</p>}

                        {(raised || target) && (
                          <div className="mt-4 rounded-2xl bg-cream p-3">
                            <div className="flex items-center justify-between gap-3 text-xs font-bold text-petrol">
                              <span>{raised ? `${raised} arrecadados` : "Campanha ativa"}</span>
                              {target && <span>Meta {target}</span>}
                            </div>
                            {progress != null && <div className="mt-2 h-2 overflow-hidden rounded-full bg-white"><div className="h-full rounded-full bg-coral" style={{ width: `${progress}%` }} /></div>}
                          </div>
                        )}

                        <div className={`mt-5 flex min-h-11 items-center justify-center gap-2 rounded-full px-5 text-sm font-black text-white transition ${currencyReady ? "bg-coral group-hover:bg-coral-dark" : "bg-petrol group-hover:bg-petrol/90"}`}>
                          {currencyReady ? "Doar agora" : "Conhecer a causa"}
                          <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                        </div>
                        {!currencyReady && <p className="mt-2 text-center text-[10px] font-bold text-muted-foreground">Pagamento online será exibido quando a lane {campaign.currency} estiver ativa.</p>}
                      </div>
                    </Link>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </main>
      <SiteFooter />
      <AuthDialog />
    </>
  );
}
