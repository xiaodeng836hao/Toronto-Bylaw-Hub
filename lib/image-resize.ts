// ─────────────────────────────────────────────────────────────────────────────
//  Toronto Bylaw Guide — client-side image downscaling (V6.1) — BROWSER ONLY
//
//  Phone photos are often 5–12 MB, which makes uploads slow/unreliable on mobile
//  and risks proxy/body-size stalls. Downscale to a reasonable max dimension and
//  re-encode as JPEG before upload. Falls back to the original file if anything
//  fails (the server still validates type/size).
// ─────────────────────────────────────────────────────────────────────────────

const MAX_DIM = 1600;
const QUALITY = 0.82;

export async function downscaleImage(file: File): Promise<File> {
  // Only attempt in the browser with the needed APIs.
  if (typeof window === "undefined" || typeof createImageBitmap !== "function") return file;
  if (!file.type.startsWith("image/")) return file;

  try {
    const bitmap = await createImageBitmap(file);
    const { width, height } = bitmap;
    const scale = Math.min(1, MAX_DIM / Math.max(width, height));
    // Small images that are already under the cap and reasonably sized: keep as-is.
    if (scale === 1 && file.size <= 1_500_000) {
      bitmap.close?.();
      return file;
    }
    const w = Math.max(1, Math.round(width * scale));
    const h = Math.max(1, Math.round(height * scale));
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (!ctx) { bitmap.close?.(); return file; }
    ctx.drawImage(bitmap, 0, 0, w, h);
    bitmap.close?.();

    const blob: Blob | null = await new Promise((resolve) =>
      canvas.toBlob((b) => resolve(b), "image/jpeg", QUALITY)
    );
    if (!blob) return file;
    return new File([blob], file.name.replace(/\.[^.]+$/, "") + ".jpg", { type: "image/jpeg" });
  } catch {
    return file;
  }
}
