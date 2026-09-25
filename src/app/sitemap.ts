import type { MetadataRoute } from "next";
import { apiGet } from "@/lib/api";

const BASE = "https://mypets.lat";

type CampaignItem = { campaignKey: string | null; vertical: string };
type CauseItem = { slug: string; updatedAt?: string | null };
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

async function causeEntries(): Promise<MetadataRoute.Sitemap> {
  try {
    const response = await apiGet<Envelope<CauseItem[]>>("/causes?limit=50");
    return response.data
      .filter((cause) => cause.slug && !cause.slug.startsWith("mypets-"))
      .map((cause) => {
        const lastModified = cause.updatedAt ? new Date(cause.updatedAt) : undefined;
        return {
          url: `${BASE}/causas/${encodeURIComponent(cause.slug)}`,
          changeFrequency: "daily" as const,
          priority: 0.9,
          ...(lastModified && !Number.isNaN(lastModified.getTime()) ? { lastModified } : {}),
        };
      });
  } catch {
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const evergreen = [
    "/sobre",
    "/institucional",
    "/legal/termos",
    "/legal/privacidade",
    "/legal/cookies",
    "/legal/loja",
    "/legal/entregas",
    "/legal/reembolsos",
    "/legal/apoios",
    "/causas",
    "/apoiar",
    "/ajudar",
    "/ajudar/ebooks",
    "/ajudar/petskids",
    "/apoiar/mypets",
    "/preciso-de-apoio",
    "/preciso-de-apoio/publicar",
    "/loja",
    "/guias",
    "/guias/primeiras-24h",
    "/biblioteca",
    "/biblioteca/cuidados-essenciais",
    "/biblioteca/primeiros-30-dias",
    "/biblioteca/treino-gentil",
    "/biblioteca/guia-das-racas",
    "/biblioteca/alimentacao-bem-estar",
    "/projetos",
    "/projetos/apresentar",
    "/projetos/together-we-feed",
    "/projetos/petskids",
    "/projetos/vet-help",
    "/projetos/vet-help/apoiar",
    "/projetos/rescue",
    "/projetos/rescue/apoiar",
    "/projetos/shelter",
    "/projetos/shelter/apoiar",
    "/projetos/emergency",
    "/projetos/emergency/apoiar",
    "/join",
    "/join/ajudar",
    "/join/voluntario",
    "/join/padrinho",
    "/join/protetor",
    "/join/adotar",
    "/join/projeto",
    "/join/encontrei-um-animal",
  ];
  const [campaigns, causes] = await Promise.all([campaignUrls(), causeEntries()]);

  return [
    { url: BASE, changeFrequency: "weekly", priority: 1 },
    ...evergreen.map((path, index) => ({
      url: `${BASE}${path}`,
      changeFrequency: "weekly" as const,
      priority:
        path === "/sobre" || path === "/institucional" ? 0.9 :
        path === "/biblioteca" || path.startsWith("/biblioteca/") ? 0.9 :
        path === "/apoiar" || path === "/preciso-de-apoio" || path === "/preciso-de-apoio/publicar" || path.endsWith("/apoiar") ? 0.9 :
        path.startsWith("/legal/") ? 0.65 :
        index <= 16 ? 0.85 : 0.75,
    })),
    ...causes,
    ...campaigns.map((url) => ({
      url,
      changeFrequency: "daily" as const,
      priority: 0.9,
    })),
  ];
}
