import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/admin/",
        "/dashboard/",
        "/auth/",
        "/claim/",
        "/api/",
        "/s/",
      ],
    },
    sitemap: "https://mypets.lat/sitemap.xml",
    host: "https://mypets.lat",
  };
}
