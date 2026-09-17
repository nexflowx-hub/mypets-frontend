import type { ReactNode } from "react";
import { apiGet } from "@/lib/api";
import { BRAND } from "@/lib/brand";

type Cause = {
  slug: string;
  title: string;
  summary: string | null;
  story: string | null;
  country: string;
  city: string | null;
  primaryImage: string | null;
  supportMode: string;
  currency: string | null;
  publishedAt?: string | null;
  updatedAt?: string | null;
};

type Envelope<T> = { data: T };

async function getCause(slug: string): Promise<Cause | null> {
  try {
    return (await apiGet<Envelope<Cause>>(`/causes/${encodeURIComponent(slug)}`)).data;
  } catch {
    return null;
  }
}

export default async function CauseLayout({ children, params }: { children: ReactNode; params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const cause = await getCause(slug);
  if (!cause || cause.slug.startsWith("mypets-")) return children;

  const url = new URL(`/causas/${cause.slug}`, BRAND.siteUrl).toString();
  const description = (cause.summary || cause.story || "Conheça esta causa no MyPets.").slice(0, 500);
  const organizationId = `${BRAND.siteUrl}/#organization`;
  const webPage: Record<string, unknown> = {
    "@type": "WebPage",
    "@id": `${url}#webpage`,
    url,
    name: cause.title,
    description,
    inLanguage: cause.country === "BR" ? "pt-BR" : "pt-PT",
    isPartOf: { "@id": `${BRAND.siteUrl}/#website` },
    publisher: { "@id": organizationId },
    ...(cause.primaryImage ? { primaryImageOfPage: { "@type": "ImageObject", url: cause.primaryImage } } : {}),
    ...(cause.publishedAt ? { datePublished: cause.publishedAt } : {}),
    ...(cause.updatedAt ? { dateModified: cause.updatedAt } : {}),
    about: {
      "@type": "Thing",
      name: cause.title,
      description,
      ...(cause.city || cause.country ? { location: { "@type": "Place", name: [cause.city, cause.country].filter(Boolean).join(", ") } } : {}),
    },
  };

  if (cause.supportMode !== "NON_FINANCIAL" && (cause.currency === "BRL" || cause.currency === "EUR")) {
    webPage.potentialAction = {
      "@type": "DonateAction",
      name: `Apoiar ${cause.title}`,
      target: {
        "@type": "EntryPoint",
        urlTemplate: url,
        actionPlatform: [
          "https://schema.org/DesktopWebPlatform",
          "https://schema.org/MobileWebPlatform",
        ],
      },
    };
  }

  const payload = {
    "@context": "https://schema.org",
    "@graph": [
      webPage,
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "MyPets", item: BRAND.siteUrl },
          { "@type": "ListItem", position: 2, name: "Causas", item: new URL("/causas", BRAND.siteUrl).toString() },
          { "@type": "ListItem", position: 3, name: cause.title, item: url },
        ],
      },
    ],
  };
  const json = JSON.stringify(payload).replace(/</g, "\\u003c");

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />
      {children}
    </>
  );
}
