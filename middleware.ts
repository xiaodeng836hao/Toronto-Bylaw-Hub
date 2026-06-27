// ─────────────────────────────────────────────────────────────────────────────
//  Toronto Bylaw Guide — V7.0 Maintenance Mode middleware (Edge runtime)
//
//  When PUBLIC_SITE_CLOSED === "true", the public site is closed: every protected
//  route requires a valid signed admin-preview cookie, otherwise pages redirect to
//  /maintenance and API routes return 503. When the flag is anything else, the
//  middleware is a no-op and the site behaves normally.
// ─────────────────────────────────────────────────────────────────────────────

import { NextResponse, type NextRequest } from "next/server";
import {
  ADMIN_PREVIEW_COOKIE,
  isPublicSiteClosed,
  verifyAdminPreviewToken,
} from "@/lib/admin-preview/auth";

// Always reachable while the public site is closed (no auth required).
const ALLOWED_EXACT = new Set<string>([
  "/maintenance",
  "/admin-login",
  "/api/admin-login",
  "/api/admin-logout",
  // Invasive Plant Check mobile app proxy — the app is a separate client and must
  // keep working even when the public website is in maintenance mode.
  "/api/plant-identify",
  "/robots.txt",
  "/sitemap.xml",
  "/favicon.ico",
  "/manifest.webmanifest",
]);

// Path prefixes that are always allowed (Next internals + public asset folders).
// The Invasive Plant Check app pages (overview + privacy policy) stay public even
// while the rest of the site is in maintenance, so the mobile app's store /
// privacy-policy links keep working.
const ALLOWED_PREFIX = [
  "/_next/",
  "/images/",
  "/assets/",
  "/design-reference/",
  "/invasive-plant-check",
];

function isAlwaysAllowed(pathname: string): boolean {
  if (ALLOWED_EXACT.has(pathname)) return true;
  if (ALLOWED_PREFIX.some((p) => pathname.startsWith(p))) return true;
  // Allow direct static files in /public (anything with a file extension),
  // e.g. /logo.svg, /icon.png — but NOT content routes (which have none).
  const last = pathname.slice(pathname.lastIndexOf("/") + 1);
  if (last.includes(".")) return true;
  return false;
}

export async function middleware(req: NextRequest) {
  // Site open → do nothing.
  if (!isPublicSiteClosed()) return NextResponse.next();

  const { pathname } = req.nextUrl;
  if (isAlwaysAllowed(pathname)) return NextResponse.next();

  // Protected route while closed — require a valid admin-preview cookie.
  const token = req.cookies.get(ADMIN_PREVIEW_COOKIE)?.value;
  const valid = await verifyAdminPreviewToken(token);
  if (valid) return NextResponse.next();

  // Block protected APIs with a generic 503 (no HTML redirect for fetch clients).
  if (pathname.startsWith("/api/")) {
    return NextResponse.json(
      { error: "The site is temporarily unavailable." },
      { status: 503, headers: { "Cache-Control": "no-store" } },
    );
  }

  // Redirect every other protected page to the maintenance page.
  const url = req.nextUrl.clone();
  url.pathname = "/maintenance";
  url.search = "";
  return NextResponse.redirect(url);
}

export const config = {
  // Run on everything except Next's build assets and image optimizer. The
  // function above further allows static files, public folders, and the
  // maintenance/admin endpoints.
  matcher: ["/((?!_next/static|_next/image).*)"],
};
