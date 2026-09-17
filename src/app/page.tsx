import type { Metadata } from "next";
import type { StoryDTO, MetricDTO } from "@/lib/types";
import { apiGet } from "@/lib/api";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { HeroSection } from "@/components/sections/hero";
import { ConversionTrustStrip } from "@/components/conversion/conversion-trust-strip";
import { GrowthGateway } from "@/components/growth/growth-gateway";
import { HomeDiscoverySection, type HomeCause } from "@/components/sections/home-discovery-section";
import { ProjectsSection } from "@/components/sections/projects-section";
import { ImpactSection, PartnerBand } from "@/components/sections/impact-section";
import { SupportIntentDialog } from "@/components/donate/support-intent-dialog";
import { SearchDialog } from "@/components/layout/search-dialog";
import { AuthDialog } from "@/components/layout/auth-dialog";
import { BRAND } from "@/lib/brand";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "MyPets — Apoio a animais, protetores e causas reais",
  description: "Encontre causas, projetos e protetores, acompanhe histórias reais e apoie resgates, tratamentos, alimentação e abrigo de animais pelo ecossistema MyPets.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "MyPets — Juntos, cada pet tem futuro.",
    description: "Apoie animais, protetores, ONGs e projetos com destino identificado e acompanhamento pelo ecossistema MyPets.",
    url: BRAND.siteUrl,
    siteName: BRAND.name,
    type: "website",
    locale: "pt_PT",
    alternateLocale: ["pt_BR", "en_US"],
    images: [{ url: BRAND.socialBannerUrl, alt: "MyPets — Pessoas. Animais. Impacto Real." }],
  },
  twitter: {
    card: "summary_large_image",
    title: "MyPets — Juntos, cada pet tem futuro.",
    description: "Apoie quem resgata, trata, alimenta e protege animais todos os dias.",
    images: [BRAND.socialBannerUrl],
  },
};

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
    const rows = (await apiGet<ApiEnvelope<HomeCause[]>>("/causes?limit=16")).data;
    return rows.filter((cause) => !cause.slug.startsWith("mypets-")).slice(0, 8);
  } catch (error) {
    console.error("[page] failed to load causes from API", error);
    return [];
  }
}

function StructuredData() {
  const organizationId = `${BRAND.siteUrl}/#organization`;
  const websiteId = `${BRAND.siteUrl}/#website`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": organizationId,
        name: BRAND.name,
        url: BRAND.siteUrl,
        logo: { "@type": "ImageObject", url: BRAND.logoUrl },
        image: BRAND.socialBannerUrl,
        slogan: "Quem ajuda animais também merece ajuda.",
        description: "Rede digital de apoio a animais, protetores, ONGs e projetos de impacto animal.",
        areaServed: [
          { "@type": "Country", name: "Brazil" },
          { "@type": "Country", name: "Portugal" },
        ],
        sameAs: [BRAND.facebookUrl, BRAND.instagramUrl, BRAND.facePetsUrl],
        parentOrganization: {
          "@type": "Organization",
          name: "HUMAN IMPACT TECH LTD",
          url: "https://humanimpact.tech",
        },
      },
      {
        "@type": "WebSite",
        "@id": websiteId,
        url: BRAND.siteUrl,
        name: BRAND.name,
        description: "Pessoas. Animais. Impacto Real.",
        inLanguage: ["pt-BR", "pt-PT", "en"],
        publisher: { "@id": organizationId },
      },
    ],
  };
  const safeJson = JSON.stringify(jsonLd).replace(/</g, "\\u003c");
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJson }} />;
}

export default async function HomePage() {
  const [stories, metrics, causes] = await Promise.all([getStories(), getMetrics(), getCauses()]);

  return (
    <>
      <StructuredData />
      <SiteHeader />
      <main className="flex-1 bg-white">
        <HeroSection />
        <ConversionTrustStrip />
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
