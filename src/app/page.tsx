import type { StoryDTO, MetricDTO } from "@/lib/types";
import { apiGet } from "@/lib/api";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { HeroSection } from "@/components/sections/hero";
import { GrowthGateway } from "@/components/growth/growth-gateway";
import { HomeDiscoverySection, type HomeCause } from "@/components/sections/home-discovery-section";
import { ProjectsSection } from "@/components/sections/projects-section";
import { ImpactSection, PartnerBand } from "@/components/sections/impact-section";
import { SupportIntentDialog } from "@/components/donate/support-intent-dialog";
import { SearchDialog } from "@/components/layout/search-dialog";
import { AuthDialog } from "@/components/layout/auth-dialog";
import { BRAND } from "@/lib/brand";

export const dynamic = "force-dynamic";

type ApiEnvelope<T> = { data: T };

async function getStories(): Promise<StoryDTO[]> {
  try {
    return (await apiGet<ApiEnvelope<StoryDTO[]>>("/stories")).data;
  } catch (error) {
    console.error("[page] failed to load stories from API", error);
    return [];
  }
}

async function getMetrics(): Promise<MetricDTO[]> {
  try {
    return (await apiGet<ApiEnvelope<MetricDTO[]>>("/impact/public")).data;
  } catch (error) {
    console.error("[page] failed to load metrics from API", error);
    return [];
  }
}

async function getCauses(): Promise<HomeCause[]> {
  try {
    return (await apiGet<ApiEnvelope<HomeCause[]>>("/causes?limit=8")).data;
  } catch (error) {
    console.error("[page] failed to load causes from API", error);
    return [];
  }
}

function StructuredData() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: BRAND.name,
    url: BRAND.siteUrl,
    logo: BRAND.logoUrl,
    slogan: "Quem ajuda animais também merece ajuda.",
    sameAs: [BRAND.facebookUrl, BRAND.instagramUrl, BRAND.facePetsUrl],
    parentOrganization: {
      "@type": "Organization",
      name: "HUMAN IMPACT TECH LTD",
      url: "https://humanimpact.tech",
    },
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />;
}

export default async function HomePage() {
  const [stories, metrics, causes] = await Promise.all([getStories(), getMetrics(), getCauses()]);

  return (
    <>
      <StructuredData />
      <SiteHeader />
      <main className="flex-1 bg-white">
        <HeroSection />
        <GrowthGateway />
        <HomeDiscoverySection causes={causes} stories={stories} />
        <ProjectsSection />
        <ImpactSection metrics={metrics} />
        <PartnerBand />
      </main>
      <SiteFooter />
      <SupportIntentDialog />
      <SearchDialog stories={stories} />
      <AuthDialog />
    </>
  );
}
