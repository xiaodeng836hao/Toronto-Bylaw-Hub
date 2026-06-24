// ─────────────────────────────────────────────────────────────────────────────
//  GET /api/admin-preview/status — V7.0
//  Returns { active } where active === (public site closed) AND (valid signed
//  admin-preview cookie). Used by the AdminPreviewBanner to decide whether to
//  show the "Admin Preview Mode" bar. Reveals nothing sensitive.
// ─────────────────────────────────────────────────────────────────────────────

import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  ADMIN_PREVIEW_COOKIE,
  isPublicSiteClosed,
  verifyAdminPreviewToken,
} from "@/lib/admin-preview/auth";

export const runtime = "nodejs";

export async function GET() {
  const token = (await cookies()).get(ADMIN_PREVIEW_COOKIE)?.value;
  const valid = await verifyAdminPreviewToken(token);
  return NextResponse.json(
    { active: isPublicSiteClosed() && valid },
    { headers: { "Cache-Control": "no-store" } },
  );
}
