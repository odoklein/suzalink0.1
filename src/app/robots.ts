import type { MetadataRoute } from "next";
import { indexable, site } from "@/config/site";

export default function robots(): MetadataRoute.Robots {
  // Staging and previews are never indexed.
  if (!indexable) return { rules: { userAgent: "*", disallow: "/" } };
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // /accueil/ holds the pre-rendered ?utm_audience home variants (noindex, canonical to /).
        disallow: ["/accueil/", "/api/"],
      },
    ],
    sitemap: `${site.url}/sitemap.xml`,
    host: site.url,
  };
}
