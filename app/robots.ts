import type { MetadataRoute } from "next";
import config from "@/config";

export default function robots(): MetadataRoute.Robots {
  // Use the URL from config
  const baseUrl = config.url;

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Disallow any potential admin or private routes
      disallow: ["/admin/", "/private/", "/api/*"],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
