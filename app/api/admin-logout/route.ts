// ─────────────────────────────────────────────────────────────────────────────
//  /api/admin-logout — V7.0 clear the admin preview cookies.
//  GET  → clears cookies and redirects to /maintenance (used by the "Exit
//         preview" link in the banner).
//  POST → clears cookies and returns { ok: true }.
// ─────────────────────────────────────────────────────────────────────────────

import { NextResponse } from "next/server";
import { ADMIN_PREVIEW_COOKIE, ADMIN_PREVIEW_UI_COOKIE } from "@/lib/admin-preview/auth";

export const runtime = "nodejs";

function clearCookies(res: NextResponse): NextResponse {
  const secure = process.env.NODE_ENV === "production";
  const opts = { httpOnly: false, secure, sameSite: "lax" as const, path: "/", maxAge: 0 };
  res.cookies.set(ADMIN_PREVIEW_COOKIE, "", { ...opts, httpOnly: true });
  res.cookies.set(ADMIN_PREVIEW_UI_COOKIE, "", opts);
  res.headers.set("Cache-Control", "no-store");
  return res;
}

export async function GET(req: Request) {
  const res = NextResponse.redirect(new URL("/maintenance", req.url), { status: 303 });
  return clearCookies(res);
}

export async function POST() {
  return clearCookies(NextResponse.json({ ok: true }));
}
