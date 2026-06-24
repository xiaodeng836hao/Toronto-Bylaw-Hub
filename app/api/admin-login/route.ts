// ─────────────────────────────────────────────────────────────────────────────
//  POST /api/admin-login — V7.0 admin preview login (SERVER ONLY)
//  Verifies the submitted password against ADMIN_PREVIEW_PASSWORD (server-side,
//  constant-time) and, on success, sets a signed httpOnly cookie. Rate-limited
//  per IP. Errors are intentionally generic (no config/state leakage).
// ─────────────────────────────────────────────────────────────────────────────

import { NextResponse } from "next/server";
import {
  ADMIN_PREVIEW_COOKIE,
  ADMIN_PREVIEW_UI_COOKIE,
  ADMIN_PREVIEW_COOKIE_MAX_AGE,
  createAdminPreviewToken,
  verifyAdminCredentials,
  isAdminPreviewConfigured,
} from "@/lib/admin-preview/auth";

export const runtime = "nodejs";

// Simple in-memory failed-attempt limiter (per IP). Per-instance only — for
// multi-instance production use a shared store (Redis / Vercel KV). See
// MAINTENANCE_MODE.md.
const FAIL_WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const FAIL_MAX = 5;
const failures = new Map<string, number[]>();

function clientIp(req: Request): string {
  const fwd = req.headers.get("x-forwarded-for");
  return fwd?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "local";
}

function recentFailures(ip: string): number[] {
  const now = Date.now();
  const arr = (failures.get(ip) ?? []).filter((t) => now - t < FAIL_WINDOW_MS);
  failures.set(ip, arr);
  return arr;
}

function recordFailure(ip: string): void {
  const arr = recentFailures(ip);
  arr.push(Date.now());
  failures.set(ip, arr);
  if (failures.size > 5000) failures.clear();
}

const NO_STORE = { "Cache-Control": "no-store" } as const;

export async function POST(req: Request) {
  const ip = clientIp(req);

  if (recentFailures(ip).length >= FAIL_MAX) {
    return NextResponse.json(
      { error: "Too many attempts. Please try again later." },
      { status: 429, headers: NO_STORE },
    );
  }

  let username: unknown = "";
  let password: unknown = "";
  try {
    const body = await req.json();
    username = (body as { username?: unknown })?.username ?? "";
    password = (body as { password?: unknown })?.password ?? "";
  } catch {
    // Malformed body is treated as an invalid attempt.
  }

  // If the preview isn't configured, behave exactly like an invalid attempt so
  // public users can't probe whether env vars are set.
  const ok = isAdminPreviewConfigured() && verifyAdminCredentials(username, password);
  const token = ok ? await createAdminPreviewToken() : null;

  if (!token) {
    recordFailure(ip);
    return NextResponse.json({ error: "Invalid username or password." }, { status: 401, headers: NO_STORE });
  }

  const res = NextResponse.json({ ok: true }, { headers: NO_STORE });
  const secure = process.env.NODE_ENV === "production";
  res.cookies.set(ADMIN_PREVIEW_COOKIE, token, {
    httpOnly: true,
    secure,
    sameSite: "lax",
    path: "/",
    maxAge: ADMIN_PREVIEW_COOKIE_MAX_AGE,
  });
  // Non-sensitive UI hint (value "1") so the banner can render without a probe.
  res.cookies.set(ADMIN_PREVIEW_UI_COOKIE, "1", {
    httpOnly: false,
    secure,
    sameSite: "lax",
    path: "/",
    maxAge: ADMIN_PREVIEW_COOKIE_MAX_AGE,
  });
  return res;
}
