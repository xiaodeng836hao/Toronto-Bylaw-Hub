import type { MetadataRoute } from "next";

const BASE_URL = "https://toronto-bylaw-hub.example.ca";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
