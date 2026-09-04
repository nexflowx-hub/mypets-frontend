import { db } from "@/lib/db";
import type { StoryDTO, MetricDTO } from "@/lib/types";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { HeroSection, FacePetsSection } from "@/components/sections/hero";
import { MissionBand } from "@/components/sections/mission-band";
import { StoriesSection } from "@/components/sections/stories-section";
import { ImpactSection, PartnerBand } from "@/components/sections/impact-section";
import { DonateDialog } from "@/components/donate/donate-dialog";
import { SearchDialog } from "@/components/layout/search-dialog";
import { AuthDialog } from "@/components/layout/auth-dialog";

export const dynamic = "force-dynamic";

function stringTags(value: unknown): string[] {
  return Array.isArray(value)
    ? value.filter((tag): tag is string => typeof tag === "string")
    : [];
}

async function getStories(): Promise<StoryDTO[]> {
  try {
    const rows = await db.story.findMany({
      where: { active: true },
      orderBy: { sortOrder: "asc" },
      take: 12,
    });

    return rows.map((story) => ({
      id: story.id,
      slug: story.slug,
      kind: story.kind,
      name: story.name,
      location: story.location,
      country: story.country,
      currency: story.currency as "EUR" | "BRL",
      descPtPT: story.descPtPT,
      descPtBR: story.descPtBR,
      descEn: story.descEn,
      image: story.image,
      imageAlt: story.imageAlt,
      tags: stringTags(story.tags),
      targetCents: story.targetCents,
      raisedCents: story.raisedCents,
      progress:
        story.targetCents > 0
          ? Math.min(100, Math.round((story.raisedCents / story.targetCents) * 100))
          : 0,
      isDemo: story.isDemo,
    }));
  } catch (error) {
    console.error("[page] failed to load stories", error);
    return [];
  }
}

async function getMetrics(): Promise<MetricDTO[]> {
  try {
    return await db.impactMetric.findMany({ orderBy: { sortOrder: "asc" } });
  } catch (error) {
    console.error("[page] failed to load metrics", error);
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

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export default async function HomePage() {
  const [stories, metrics] = await Promise.all([getStories(), getMetrics()]);
  const showDemo = process.env.SHOW_DEMO_IMPACT !== "false";
  const visibleMetrics = showDemo ? metrics : metrics.filter((metric) => !metric.isDemo);

  return (
    <>
      <StructuredData />
      <SiteHeader />

      <main className="flex-1">
        <HeroSection />
        <MissionBand />
        <StoriesSection stories={stories} />
        <ImpactSection metrics={visibleMetrics} showDemo={showDemo} />
        <FacePetsSection />
        <PartnerBand />
      </main>

      <SiteFooter />

      <DonateDialog stories={stories} />
      <SearchDialog stories={stories} />
      <AuthDialog />
    </>
  );
}
