import type { MetadataRoute } from "next";
import { bylawChapters } from "@/lib/mock-data";
import { prohibitedPlants } from "@/lib/prohibited-plants";
import { SITE_URL as BASE_URL } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticRoutes = [
    "",
    "/tmc-chapters",
    "/photo-review",
    "/pool-fence-guide",
    "/zoning",
    "/landscaping",
    "/prohibited-plants",
    "/search",
    "/feedback",
    "/about",
    "/disclaimer",
    "/noise-complaints",
  ].map((path) => ({
    url: `${BASE_URL}${path}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: path === "" ? 1 : 0.7,
  }));

  const chapterRoutes = bylawChapters.map((c) => ({
    url: `${BASE_URL}/tmc-chapters/${c.slug}`,
    lastModified: now,
    changeFrequency: "yearly" as const,
    priority: 0.6,
  }));

  const plantRoutes = prohibitedPlants.map((p) => ({
    url: `${BASE_URL}/prohibited-plants/${p.slug}`,
    lastModified: now,
    changeFrequency: "yearly" as const,
    priority: 0.6,
  }));

  return [...staticRoutes, ...chapterRoutes, ...plantRoutes];
}
