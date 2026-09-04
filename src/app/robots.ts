import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: "https://mypets.lat/sitemap.xml",
    host: "https://mypets.lat",
  };
}
