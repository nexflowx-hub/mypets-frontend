import type { MetadataRoute } from "next";
import { apiGet } from "@/lib/api";

const BASE = "https://mypets.lat";

type CampaignItem = { campaignKey: string | null; vertical: string };
type Envelope<T> = { data: T };

const verticalRoutes = [
  ["VET", "vet-help"],
  ["RESCUE", "rescue"],
  ["SHELTER", "shelter"],
  ["EMERGENCY", "emergency"],
] as const;

async function campaignUrls() {
  const groups = await Promise.all(
    verticalRoutes.map(async ([vertical, route]) => {
      try {
        const response = await apiGet<Envelope<CampaignItem[]>>(`/causes/vertical/${vertical}?limit=50`);
        return response.data
          .filter((item) => item.campaignKey)
          .map((item) => `${BASE}/${route}/${encodeURIComponent(item.campaignKey!)}`);
      } catch {
        return [];
      }
    }),
  );
  return groups.flat();
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const evergreen = [
    "/causas",
    "/projetos",
    "/projetos/together-we-feed",
    "/projetos/vet-help",
    "/projetos/rescue",
    "/projetos/shelter",
    "/projetos/emergency",
    "/join",
    "/join/ajudar",
    "/join/voluntario",
    "/join/padrinho",
    "/join/protetor",
    "/join/adotar",
    "/join/projeto",
    "/join/encontrei-um-animal",
  ];
  const campaigns = await campaignUrls();

  return [
    { url: BASE, changeFrequency: "weekly", priority: 1 },
    ...evergreen.map((path, index) => ({
      url: `${BASE}${path}`,
      changeFrequency: "weekly" as const,
      priority: index <= 2 ? 0.9 : index <= 6 ? 0.75 : 0.8,
    })),
    ...campaigns.map((url) => ({
      url,
      changeFrequency: "daily" as const,
      priority: 0.9,
    })),
  ];
}
