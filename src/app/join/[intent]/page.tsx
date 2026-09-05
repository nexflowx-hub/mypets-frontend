import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { apiGet } from "@/lib/api";
import { GrowthFunnel } from "@/components/growth/growth-funnel";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { AuthDialog } from "@/components/layout/auth-dialog";

export const dynamic = "force-dynamic";

type GrowthIntent = "SUPPORT" | "VOLUNTEER" | "SPONSOR" | "DONATE" | "PROTECTOR" | "ADOPT" | "PROJECT" | "FOUND_ANIMAL";
type Campaign = {
  slug: string;
  name: string;
  intent: GrowthIntent;
  headline: string;
  subheadline: string | null;
  ctaLabel: string;
  country: "PT" | "BR" | null;
  landingVariant: string;
};
type Envelope<T> = { data: T };
type Search = Record<string, string | string[] | undefined>;

async function getCampaign(slug: string): Promise<Campaign | null> {
  try {
    return (await apiGet<Envelope<Campaign>>(`/growth/campaigns/${encodeURIComponent(slug)}`)).data;
  } catch {
    return null;
  }
}

function one(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export async function generateMetadata({ params }: { params: Promise<{ intent: string }> }): Promise<Metadata> {
  const { intent } = await params;
  const campaign = await getCampaign(intent);
  if (!campaign) return { title: "Participar | MyPets" };
  const canonical = `/join/${campaign.slug}`;
  return {
    title: `${campaign.name} | MyPets`,
    description: campaign.subheadline ?? campaign.headline,
    alternates: { canonical },
    openGraph: {
      title: campaign.headline,
      description: campaign.subheadline ?? "Participe no MyPets.",
      url: `https://mypets.lat${canonical}`,
      siteName: "MyPets",
      type: "website",
      images: [{ url: "/images/hero.jpg", width: 1440, height: 720, alt: campaign.headline }],
    },
  };
}

export default async function JoinPage({ params, searchParams }: { params: Promise<{ intent: string }>; searchParams: Promise<Search> }) {
  const { intent } = await params;
  const query = await searchParams;
  const baseCampaign = await getCampaign(intent);
  if (!baseCampaign) notFound();

  const requestedVariant = one(query.v)?.toLowerCase();
  const campaign: Campaign = {
    ...baseCampaign,
    landingVariant: requestedVariant === "social" ? "SOCIAL" : baseCampaign.landingVariant,
  };

  const tracking = {
    source: one(query.utm_source) ?? null,
    medium: one(query.utm_medium) ?? null,
    campaign: one(query.utm_campaign) ?? null,
    content: one(query.utm_content) ?? null,
    term: one(query.utm_term) ?? null,
    refCode: one(query.ref) ?? null,
    entryCta: one(query.src_cta) ?? null,
  };

  return (
    <>
      <SiteHeader />
      <GrowthFunnel campaign={campaign} tracking={tracking} />
      <SiteFooter />
      <AuthDialog />
    </>
  );
}
