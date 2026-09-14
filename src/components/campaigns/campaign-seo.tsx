import type { Metadata } from "next";
import { BRAND } from "@/lib/brand";
import {
  CAMPAIGN_VERTICALS,
  campaignRoute,
  getCampaignSummary,
  type CampaignRouteSegment,
} from "@/lib/campaign-landings";

function descriptionFor(summary: Awaited<ReturnType<typeof getCampaignSummary>>) {
  if (!summary) return "Campanha de impacto animal no MyPets.";
  const meta = summary.campaignMeta ?? {};
  return (meta.subheadline || summary.summary || `Apoie ${summary.title} através do ecossistema MyPets.`).slice(0, 300);
}

function keywordsFor(segment: CampaignRouteSegment, summary: NonNullable<Awaited<ReturnType<typeof getCampaignSummary>>>) {
  const ecosystem = CAMPAIGN_VERTICALS[segment];
  return [
    summary.title,
    ecosystem.label,
    "MyPets",
    "ajuda animal",
    "apoio animal",
    "doação para animais",
    summary.city,
    summary.country === "BR" ? "Brasil" : summary.country === "PT" ? "Portugal" : summary.country,
  ].filter((value): value is string => Boolean(value));
}

export async function campaignSeoMetadata(segment: CampaignRouteSegment, campaignKey: string): Promise<Metadata> {
  const summary = await getCampaignSummary(campaignKey);
  const ecosystem = CAMPAIGN_VERTICALS[segment];
  if (!summary || summary.vertical !== ecosystem.vertical) {
    return {
      title: `Campanha não encontrada · ${ecosystem.label}`,
      robots: { index: false, follow: false },
    };
  }

  const meta = summary.campaignMeta ?? {};
  const headline = meta.headline || summary.title;
  const description = descriptionFor(summary);
  const canonicalPath = campaignRoute(segment, campaignKey);
  const canonicalUrl = new URL(canonicalPath, BRAND.siteUrl).toString();
  const image = summary.primaryImage || meta.galleryUrls?.[0] || BRAND.socialBannerUrl;

  return {
    title: `${headline} | ${ecosystem.label}`,
    description,
    keywords: keywordsFor(segment, summary),
    alternates: { canonical: canonicalPath },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 },
    },
    openGraph: {
      type: "article",
      url: canonicalUrl,
      siteName: BRAND.name,
      title: headline,
      description,
      locale: summary.country === "BR" ? "pt_BR" : "pt_PT",
      publishedTime: summary.publishedAt ?? undefined,
      images: [{ url: image, alt: headline }],
    },
    twitter: {
      card: "summary_large_image",
      title: headline,
      description,
      images: [image],
    },
  };
}

export async function CampaignStructuredData({ segment, campaignKey }: { segment: CampaignRouteSegment; campaignKey: string }) {
  const summary = await getCampaignSummary(campaignKey);
  const ecosystem = CAMPAIGN_VERTICALS[segment];
  if (!summary || summary.vertical !== ecosystem.vertical) return null;

  const meta = summary.campaignMeta ?? {};
  const headline = meta.headline || summary.title;
  const description = descriptionFor(summary);
  const canonicalPath = campaignRoute(segment, campaignKey);
  const url = new URL(canonicalPath, BRAND.siteUrl).toString();
  const image = summary.primaryImage || meta.galleryUrls?.[0] || BRAND.socialBannerUrl;
  const location = [summary.city, summary.country].filter(Boolean).join(", ");

  const organization = {
    "@type": "Organization",
    "@id": `${BRAND.siteUrl}/#organization`,
    name: BRAND.name,
    url: BRAND.siteUrl,
    logo: { "@type": "ImageObject", url: BRAND.logoUrl },
    sameAs: [BRAND.instagramUrl, BRAND.facebookUrl, BRAND.facePetsUrl],
  };

  const webPage: Record<string, unknown> = {
    "@type": "WebPage",
    "@id": `${url}#webpage`,
    url,
    name: headline,
    description,
    image,
    inLanguage: summary.country === "BR" ? "pt-BR" : "pt-PT",
    datePublished: summary.publishedAt ?? undefined,
    publisher: { "@id": `${BRAND.siteUrl}/#organization` },
    about: {
      "@type": "Thing",
      name: summary.title,
      description: summary.summary ?? description,
      ...(location ? { locationCreated: { "@type": "Place", name: location } } : {}),
    },
  };

  if (summary.supportMode !== "NON_FINANCIAL") {
    webPage.potentialAction = {
      "@type": "DonateAction",
      name: `Apoiar ${summary.title}`,
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${url}#apoio`,
        actionPlatform: [
          "https://schema.org/DesktopWebPlatform",
          "https://schema.org/MobileWebPlatform",
        ],
      },
    };
  }

  const breadcrumbs = {
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "MyPets", item: BRAND.siteUrl },
      { "@type": "ListItem", position: 2, name: ecosystem.label, item: new URL(`/projetos/${ecosystem.projectSlug}`, BRAND.siteUrl).toString() },
      { "@type": "ListItem", position: 3, name: headline, item: url },
    ],
  };

  const payload = {
    "@context": "https://schema.org",
    "@graph": [organization, webPage, breadcrumbs],
  };
  const json = JSON.stringify(payload).replace(/</g, "\\u003c");
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />;
}
