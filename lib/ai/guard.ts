// ─────────────────────────────────────────────────────────────────────────────
//  Toronto Bylaw Guide — AI request guards (V6) — SERVER ONLY
//  Lightweight in-memory rate limiting + image validation for AI endpoints.
//  In-memory limiting is per-instance (fine for dev / single instance). For
//  multi-instance production, swap in a shared store (documented in AI_SETUP.md).
// ─────────────────────────────────────────────────────────────────────────────

const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 8;
const hits = new Map<string, number[]>();

/** Returns true if the request is allowed; false if rate-limited. */
export function rateLimit(key: string, max = MAX_PER_WINDOW, windowMs = WINDOW_MS): boolean {
  const now = Date.now();
  const arr = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
  if (arr.length >= max) {
    hits.set(key, arr);
    return false;
  }
  arr.push(now);
  hits.set(key, arr);
  // Opportunistic cleanup to bound memory.
  if (hits.size > 5000) hits.clear();
  return true;
}

/** Derive a best-effort client key from request headers. */
export function clientKey(req: Request): string {
  const fwd = req.headers.get("x-forwarded-for");
  const ip = fwd?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "local";
  return ip;
}

export const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
export const MAX_IMAGE_BYTES = 8 * 1024 * 1024; // 8 MB

export interface ValidatedImage {
  dataUrl: string;
  mime: string;
  bytes: number;
}

/** Validate an uploaded image File server-side and return a data URL. */
export async function validateImage(file: unknown): Promise<{ ok: true; image: ValidatedImage } | { ok: false; error: string }> {
  if (!(file instanceof File)) return { ok: false, error: "No image was provided." };
  const mime = file.type;
  if (!ALLOWED_IMAGE_TYPES.includes(mime)) {
    return { ok: false, error: "Unsupported image type. Please upload a JPG, PNG, or WEBP image." };
  }
  if (file.size > MAX_IMAGE_BYTES) {
    return { ok: false, error: "Image is too large. Please upload an image under 8 MB." };
  }
  const buf = Buffer.from(await file.arrayBuffer());
  // Note: we do not persist the image; it is converted to a data URL only to
  // pass to the AI provider for this single request, then discarded.
  const dataUrl = `data:${mime};base64,${buf.toString("base64")}`;
  return { ok: true, image: { dataUrl, mime, bytes: file.size } };
}
