/**
 * Central site configuration — single source of truth for SEO metadata, the
 * sitemap, robots.txt, and shared official links.
 *
 * The production custom domain is **https://bylawguide.ca**. It can be
 * overridden at build time with `NEXT_PUBLIC_SITE_URL` (e.g. a staging domain),
 * but it never falls back to localhost or a preview/Vercel URL so SEO metadata
 * and the sitemap always reference the canonical public domain.
 *
 * This value is only used for SEO metadata, the sitemap, and robots.txt — it is
 * never used to load runtime assets, so it cannot cause blocked requests on
 * restricted networks. All page/API links inside the app are relative.
 */
export const siteConfig = {
  siteName: "Toronto Bylaw Guide",
  siteUrl: (process.env.NEXT_PUBLIC_SITE_URL ?? "https://bylawguide.ca").replace(/\/+$/, ""),
  defaultTitle: "Toronto Bylaw Guide",
  titleTemplate: "%s · Toronto Bylaw Guide",
  defaultDescription:
    "A resident-friendly guide to Toronto bylaws: search Toronto Municipal Code chapters, review photos for possible bylaw matches, and understand pool fence, fence height, zoning, and prohibited-plant rules. Links to official City of Toronto sources.",
  official311Url: "https://www.toronto.ca/home/311-toronto-at-your-service/create-a-service-request/",
  officialTorontoUrl: "https://www.toronto.ca/",
  /** Date the site's summarized bylaw content was last reviewed against official sources. */
  contentLastReviewed: "2026-06-19",
  /** Public-beta flag — drives the beta notice. */
  isPublicBeta: true,
} as const;

export type SiteConfig = typeof siteConfig;
