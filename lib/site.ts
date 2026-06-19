/**
 * Canonical public site URL.
 *
 * Re-exported from {@link siteConfig} so SEO metadata (canonical URL), the
 * sitemap, and robots.txt all share one source of truth. The production domain
 * is `https://bylawguide.ca`; override with `NEXT_PUBLIC_SITE_URL` if needed.
 *
 * Only used for SEO/sitemap/robots — never to load runtime assets, so it cannot
 * cause blocked requests on restricted networks. All in-app links are relative.
 */
export { siteConfig } from "./site-config";
import { siteConfig } from "./site-config";

export const SITE_URL = siteConfig.siteUrl;
