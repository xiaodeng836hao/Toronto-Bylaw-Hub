import type { MetadataRoute } from "next";
import { SITE_URL as BASE_URL } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  // While the public site is closed (maintenance mode), discourage crawling
  // entirely. SEO returns to normal automatically once PUBLIC_SITE_CLOSED is
  // unset/false (and the deployment is rebuilt).
  if (process.env.PUBLIC_SITE_CLOSED === "true") {
    return {
      rules: { userAgent: "*", disallow: "/" },
    };
  }

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // API routes carry no indexable content.
      disallow: ["/api/"],
    },
    sitemap: `${BASE_URL}/sitemap.xml`,
    host: BASE_URL,
  };
}
