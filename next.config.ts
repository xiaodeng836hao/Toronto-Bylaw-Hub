import type { NextConfig } from "next";

/**
 * Security headers applied to every route.
 *
 * These are intentionally conservative so they cannot break local assets or
 * official external links:
 *  - No Content-Security-Policy (a strict CSP risks blocking required local
 *    assets and is unnecessary here — the app loads no external runtime
 *    resources). Add one later only with careful testing.
 *  - X-Frame-Options: SAMEORIGIN prevents the site from being framed by others;
 *    the app itself never embeds external pages in an <iframe>.
 *  - Permissions-Policy disables sensors/features the site does not use.
 */
const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), browsing-topics=()",
  },
];

const nextConfig: NextConfig = {
  images: {
    // Serve images as-is from /public — no remote image domains are used, so
    // nothing depends on an external optimizer or remote host at runtime.
    unoptimized: true,
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
