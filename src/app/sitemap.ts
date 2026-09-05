import type { MetadataRoute } from "next";

const BASE = "https://mypets.lat";

export default function sitemap(): MetadataRoute.Sitemap {
  const evergreen = [
    "/join",
    "/join/ajudar",
    "/join/voluntario",
    "/join/padrinho",
    "/join/protetor",
    "/join/adotar",
    "/join/projeto",
    "/join/encontrei-um-animal",
  ];

  return [
    { url: BASE, changeFrequency: "weekly", priority: 1 },
    ...evergreen.map((path, index) => ({
      url: `${BASE}${path}`,
      changeFrequency: "weekly" as const,
      priority: index === 0 ? 0.9 : 0.8,
    })),
  ];
}
