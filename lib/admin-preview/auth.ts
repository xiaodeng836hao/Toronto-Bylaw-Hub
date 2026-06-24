// ─────────────────────────────────────────────────────────────────────────────
//  Toronto Bylaw Guide — V7.0 Maintenance Mode / Admin Preview auth (SERVER ONLY)
//
//  Isomorphic helpers that work in BOTH the Next.js middleware (Edge runtime) and
//  Node route handlers. Signing uses Web Crypto (crypto.subtle), available in both
//  runtimes — no Node-only `crypto` import, so this file is safe to import from
//  middleware.ts.
//
//  SECURITY:
//   • ADMIN_PREVIEW_PASSWORD and ADMIN_PREVIEW_COOKIE_SECRET are read server-side
//     ONLY. They are never prefixed with NEXT_PUBLIC_ and never reach the client.
//   • The cookie stores a SIGNED token (HMAC-SHA256), not the raw password.
//   • Password comparison is constant-time.
// ─────────────────────────────────────────────────────────────────────────────

/** Signed, httpOnly cookie that proves admin-preview access. */
export const ADMIN_PREVIEW_COOKIE = "bylawguide_admin_preview";
/** Non-sensitive, client-readable hint cookie (value is just "1") used only to
 *  decide whether to render the preview banner without an extra request. */
export const ADMIN_PREVIEW_UI_COOKIE = "bylawguide_admin_preview_ui";
/** Cookie lifetime in seconds (7 days). */
export const ADMIN_PREVIEW_COOKIE_MAX_AGE = 60 * 60 * 24 * 7;

export interface AdminPreviewPayload {
  role: "admin-preview";
  issuedAt: number;
}

function getSecret(): string | null {
  const s = process.env.ADMIN_PREVIEW_COOKIE_SECRET;
  return s && s.length > 0 ? s : null;
}

function getPassword(): string | null {
  const p = process.env.ADMIN_PREVIEW_PASSWORD;
  return p && p.length > 0 ? p : null;
}

/** True when the public site is configured to be closed (maintenance mode on). */
export function isPublicSiteClosed(): boolean {
  return process.env.PUBLIC_SITE_CLOSED === "true";
}

/** True when maintenance mode is on AND the admin preview is fully configured. */
export function isAdminPreviewEnabled(): boolean {
  return isPublicSiteClosed() && !!getSecret() && !!getPassword();
}

/** True when an admin password is configured (without revealing its value). */
export function isAdminPreviewConfigured(): boolean {
  return !!getSecret() && !!getPassword();
}

// ── base64url (Edge + Node safe via btoa/atob) ───────────────────────────────
function bytesToBase64Url(bytes: Uint8Array): string {
  let bin = "";
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function base64UrlToBytes(str: string): Uint8Array {
  const pad = str.length % 4 === 0 ? "" : "=".repeat(4 - (str.length % 4));
  const b64 = str.replace(/-/g, "+").replace(/_/g, "/") + pad;
  const bin = atob(b64);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

async function hmacSha256(data: string, secret: string): Promise<string> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(data));
  return bytesToBase64Url(new Uint8Array(sig));
}

/** Constant-time string comparison (avoids early-exit timing leaks). */
export function safeEqual(a: string, b: string): boolean {
  if (typeof a !== "string" || typeof b !== "string") return false;
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

/** Create a signed admin-preview token. Returns null if the secret is unset. */
export async function createAdminPreviewToken(): Promise<string | null> {
  const secret = getSecret();
  if (!secret) return null;
  const payload: AdminPreviewPayload = { role: "admin-preview", issuedAt: Date.now() };
  const body = bytesToBase64Url(new TextEncoder().encode(JSON.stringify(payload)));
  const sig = await hmacSha256(body, secret);
  return `${body}.${sig}`;
}

/** Verify a signed admin-preview token (signature + role + freshness). */
export async function verifyAdminPreviewToken(token: string | undefined | null): Promise<boolean> {
  if (!token) return false;
  const secret = getSecret();
  if (!secret) return false;

  const dot = token.indexOf(".");
  if (dot < 1 || dot >= token.length - 1) return false;
  const body = token.slice(0, dot);
  const sig = token.slice(dot + 1);

  let expected: string;
  try {
    expected = await hmacSha256(body, secret);
  } catch {
    return false;
  }
  if (!safeEqual(sig, expected)) return false;

  try {
    const payload = JSON.parse(new TextDecoder().decode(base64UrlToBytes(body))) as AdminPreviewPayload;
    if (payload.role !== "admin-preview") return false;
    if (typeof payload.issuedAt !== "number") return false;
    if (Date.now() - payload.issuedAt > ADMIN_PREVIEW_COOKIE_MAX_AGE * 1000) return false;
    return true;
  } catch {
    return false;
  }
}

/** Default admin username when ADMIN_PREVIEW_USERNAME is not set. */
const DEFAULT_ADMIN_USERNAME = "admin";

/** Configured admin username (defaults to "admin"). */
export function getAdminUsername(): string {
  const u = process.env.ADMIN_PREVIEW_USERNAME;
  return u && u.trim().length > 0 ? u.trim() : DEFAULT_ADMIN_USERNAME;
}

/** Verify submitted username + password against the configured values (constant-time). */
export function verifyAdminCredentials(username: unknown, password: unknown): boolean {
  const expectedPassword = getPassword();
  if (!expectedPassword) return false;
  if (typeof username !== "string" || typeof password !== "string") return false;
  if (username.length === 0 || password.length === 0) return false;
  // Compute both comparisons before combining (avoids short-circuit timing leaks).
  const userOk = safeEqual(username, getAdminUsername());
  const passOk = safeEqual(password, expectedPassword);
  return userOk && passOk;
}
