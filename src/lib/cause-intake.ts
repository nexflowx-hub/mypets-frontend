import { apiUrl } from "@/lib/api";

export type CommunityCauseType =
  | "VET_HELP"
  | "RESCUE"
  | "SHELTER"
  | "FEEDING"
  | "ADOPTION"
  | "EMERGENCY"
  | "NGO_PROJECT"
  | "OTHER";

export type CommunityCauseIntake = {
  projectName: string;
  contactName: string;
  contactEmail: string | null;
  whatsapp: string;
  publicWhatsapp: boolean;
  country: string;
  region: string;
  city: string | null;
  causeType: CommunityCauseType;
  details: string;
  publicMessage: string;
  instagramUrl: string | null;
  facebookUrl: string | null;
  tiktokUrl: string | null;
  primaryImageUrl: string | null;
  mediaLinks: Array<{ type: "LINK"; url: string; caption: string | null }>;
  source: string | null;
  medium: string | null;
  campaign: string | null;
  content: string | null;
  landingPath: string | null;
  contactConsent: true;
  publicationConsent: true;
  accuracyConfirmed: true;
  marketingConsent: boolean;
  website: string;
};

export type CommunityCauseResult = {
  id: string;
  causeId: string;
  slug: string;
  publicUrl: string;
  verificationStatus: "UNVERIFIED" | string;
  fundraisingStatus: "DISABLED" | string;
  promotionStatus: "QUEUED" | string;
  verificationWhatsappUrl: string;
  message: string;
};

type Envelope<T> = { data: T; error?: { message?: string } };

export async function publishCommunityCause(input: CommunityCauseIntake): Promise<CommunityCauseResult> {
  const response = await fetch(apiUrl("/cause-intake"), {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(input),
  });
  const body = (await response.json().catch(() => ({}))) as Envelope<CommunityCauseResult>;
  if (!response.ok || !body.data) {
    throw new Error(body.error?.message ?? "Não foi possível publicar a causa agora.");
  }
  return body.data;
}