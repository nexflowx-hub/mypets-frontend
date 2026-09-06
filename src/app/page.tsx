import type { StoryDTO, MetricDTO } from "@/lib/types";
import { apiGet } from "@/lib/api";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { HeroSection, FacePetsSection } from "@/components/sections/hero";
import { GrowthGateway } from "@/components/growth/growth-gateway";
import { MissionBand } from "@/components/sections/mission-band";
import { StoriesSection } from "@/components/sections/stories-section";
import { ImpactSection, PartnerBand } from "@/components/sections/impact-section";
import { SupportIntentDialog } from "@/components/donate/support-intent-dialog";
import { SearchDialog } from "@/components/layout/search-dialog";
import { AuthDialog } from "@/components/layout/auth-dialog";

export const dynamic = "force-dynamic";

type ApiEnvelope<T> = { data: T };

async function getStories(): Promise<StoryDTO[]> {
  try {
    const response = await apiGet<ApiEnvelope<StoryDTO[]>>("/stories");
    return response.data;
  } catch (error) {
    console.error("[page] failed to load stories from API", error);
    return [];
  }
}

async function getMetrics(): Promise<MetricDTO[]> {
  try {
    const response = await apiGet<ApiEnvelope<MetricDTO[]>>("/impact/public");
    return response.data;
  } catch (error) {
    console.error("[page] failed to load metrics from API", error);
    return [];
  }
}

function StructuredData() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "MyPets",
    url: "https://mypets.lat",
    logo: "https://mypets.lat/icon.svg",
    slogan: "Quem ajuda animais também merece ajuda.",
    sameAs: ["https://facepets.org"],
    parentOrganization: {
      "@type": "Organization",
      name: "HUMAN IMPACT TECH LTD",
      url: "https://humanimpact.tech",
    },
  };

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />;
}

export default async function HomePage() {
  const [stories, metrics] = await Promise.all([getStories(), getMetrics()]);

  return (
    <>
      <StructuredData />
      <SiteHeader />

      <main className="flex-1">
        <HeroSection />
        <GrowthGateway />
        <MissionBand />
        <StoriesSection stories={stories} />
        <ImpactSection metrics={metrics} />
        <FacePetsSection />
        <PartnerBand />
      </main>

      <SiteFooter />

      <SupportIntentDialog />
      <SearchDialog stories={stories} />
      <AuthDialog />
    </>
  );
}
