/**
 * Canonical public site URL.
 *
 * Set `NEXT_PUBLIC_SITE_URL` to your custom production domain (e.g.
 * `https://www.yourdomain.ca`) before building/deploying. When unset it falls
 * back to a placeholder so local development and preview builds still work.
 *
 * This value is only used for SEO metadata (canonical URL), the sitemap, and
 * robots.txt — it is never used to load runtime assets, so it cannot cause
 * blocked requests on restricted networks. All page/API links inside the app
 * are relative.
 */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://toronto-bylaw-hub.example.ca"
).replace(/\/+$/, "");
