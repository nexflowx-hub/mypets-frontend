import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://mypets.lat",
      changeFrequency: "weekly",
      priority: 1,
    },
  ];
}
