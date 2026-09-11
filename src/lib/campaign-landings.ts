import { apiGet } from "@/lib/api";

export type CampaignVertical = "FOOD" | "VET" | "RESCUE" | "SHELTER" | "EMERGENCY";

export const CAMPAIGN_VERTICALS = {
  "vet-help": {
    vertical: "VET" as const,
    projectSlug: "vet-help",
    label: "MyPets Vet Help",
    eyebrow: "Tratamentos veterinários",
  },
  rescue: {
    vertical: "RESCUE" as const,
    projectSlug: "rescue",
    label: "MyPets Rescue",
    eyebrow: "Resgates",
  },
  shelter: {
    vertical: "SHELTER" as const,
    projectSlug: "shelter",
    label: "MyPets Shelter",
    eyebrow: "Abrigos e protetores",
  },
  emergency: {
    vertical: "EMERGENCY" as const,
    projectSlug: "emergency",
    label: "MyPets Emergency",
    eyebrow: "Emergências",
  },
} as const;

export type CampaignRouteSegment = keyof typeof CAMPAIGN_VERTICALS;

export type CampaignMeta = {
  eyebrow?: string | null;
  headline?: string | null;
  subheadline?: string | null;
  urgencyLabel?: string | null;
  beneficiaryLabel?: string | null;
  trustNote?: string | null;
  primaryCtaLabel?: string | null;
  secondaryCtaLabel?: string | null;
  videoUrl?: string | null;
  galleryUrls?: string[];
};

export type CampaignSummary = {
  id: string;
  slug: string;
  title: string;
  summary: string | null;
  country: string;
  city: string | null;
  primaryImage: string | null;
  supportMode: string;
  targetAmountCents: number | null;
  raisedAmountCents: number;
  currency: string | null;
  vertical: string;
  campaignKey: string | null;
  campaignMeta: CampaignMeta;
  publishedAt: string | null;
};

export type CampaignCause = CampaignSummary & {
  story: string | null;
  protectorId: string;
  protector: {
    id: string;
    slug: string;
    displayName: string;
    verification: string;
    city: string | null;
    country: string;
  } | null;
  pets: Array<{ id: string; facepetsId: string; name: string; status: string; primaryImage: string | null }>;
  needs: Array<{
    id: string;
    type: string;
    title: string;
    description: string | null;
    supportMode: string;
    targetAmountCents: number | null;
    raisedAmountCents: number;
    currency: string | null;
    status: string;
  }>;
  updates: Array<{ id: string; title: string | null; body: string; imageUrl: string | null; createdAt: string }>;
  followers: number;
  sponsors: number;
};

export type PublicConfig = {
  paymentsLive: boolean;
  paymentProvider?: string | null;
  paymentCurrencies?: string[];
  embeddedCheckout?: boolean;
};

type Envelope<T> = { data: T };

export async function getCampaignSummary(campaignKey: string): Promise<CampaignSummary | null> {
  try {
    return (await apiGet<Envelope<CampaignSummary>>(`/cause-campaigns/${encodeURIComponent(campaignKey)}`)).data;
  } catch {
    return null;
  }
}

export async function getCampaignCause(slug: string): Promise<CampaignCause | null> {
  try {
    const cause = (await apiGet<Envelope<Omit<CampaignCause, "vertical" | "campaignKey" | "campaignMeta">>>(`/causes/${encodeURIComponent(slug)}`)).data;
    const marketing = await apiGet<Envelope<CampaignSummary>>(`/causes/${encodeURIComponent(slug)}/marketing`).catch(() => null);
    return {
      ...cause,
      vertical: marketing?.data.vertical ?? "GENERAL",
      campaignKey: marketing?.data.campaignKey ?? null,
      campaignMeta: marketing?.data.campaignMeta ?? {},
    } as CampaignCause;
  } catch {
    return null;
  }
}

export async function getCampaignConfig(): Promise<PublicConfig> {
  try {
    return (await apiGet<Envelope<PublicConfig>>("/config")).data;
  } catch {
    return { paymentsLive: false, paymentCurrencies: [] };
  }
}

export function campaignRoute(segment: CampaignRouteSegment, campaignKey: string) {
  return `/${segment}/${campaignKey}`;
}

export function isCampaignSegment(value: string): value is CampaignRouteSegment {
  return value in CAMPAIGN_VERTICALS;
}
