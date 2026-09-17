import { apiGetPublic } from "@/lib/api";

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
  paymentWebhookCurrencies?: string[];
  embeddedCheckout?: boolean;
};

type Envelope<T> = { data: T };

export async function getCampaignSummary(campaignKey: string): Promise<CampaignSummary | null> {
  try {
    return (await apiGetPublic<Envelope<CampaignSummary>>(`/cause-campaigns/${encodeURIComponent(campaignKey)}`, 30)).data;
  } catch {
    return null;
  }
}

export async function getVerticalCampaigns(vertical: CampaignVertical, limit = 12): Promise<CampaignSummary[]> {
  try {
    const safeLimit = Math.max(1, Math.min(50, Math.trunc(limit)));
    return (await apiGetPublic<Envelope<CampaignSummary[]>>(`/causes/vertical/${vertical}?limit=${safeLimit}`, 30)).data;
  } catch {
    return [];
  }
}

export function campaignSegmentForProject(projectSlug: string): CampaignRouteSegment | null {
  const entry = (Object.entries(CAMPAIGN_VERTICALS) as Array<[CampaignRouteSegment, (typeof CAMPAIGN_VERTICALS)[CampaignRouteSegment]]>)
    .find(([, config]) => config.projectSlug === projectSlug);
  return entry?.[0] ?? null;
}

export async function getCampaignCause(slug: string): Promise<CampaignCause | null> {
  try {
    const cause = (await apiGetPublic<Envelope<Omit<CampaignCause, "vertical" | "campaignKey" | "campaignMeta">>>(`/causes/${encodeURIComponent(slug)}`, 20)).data;
    const marketing = await apiGetPublic<Envelope<CampaignSummary>>(`/causes/${encodeURIComponent(slug)}/marketing`, 30).catch(() => null);
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
    return (await apiGetPublic<Envelope<PublicConfig>>("/config", 10)).data;
  } catch {
    return { paymentsLive: false, paymentCurrencies: [], paymentWebhookCurrencies: [] };
  }
}

export function campaignRoute(segment: CampaignRouteSegment, campaignKey: string) {
  return `/${segment}/${campaignKey}`;
}

export function isCampaignSegment(value: string): value is CampaignRouteSegment {
  return value in CAMPAIGN_VERTICALS;
}
