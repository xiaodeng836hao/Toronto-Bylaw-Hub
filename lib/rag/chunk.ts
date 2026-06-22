// ─────────────────────────────────────────────────────────────────────────────
//  Toronto Bylaw Guide — RAG chunking (V6)
//  Shared chunker used by both the app and the ingestion script logic.
// ─────────────────────────────────────────────────────────────────────────────

export interface ChunkOptions {
  maxChars?: number;
  overlap?: number;
}

/**
 * Split text into readable, source-specific chunks. Splits on paragraph/sentence
 * boundaries where possible and keeps a small overlap for context continuity.
 */
export function chunkText(text: string, opts: ChunkOptions = {}): string[] {
  const maxChars = opts.maxChars ?? 900;
  const overlap = opts.overlap ?? 120;
  const clean = text.replace(/\s+/g, " ").trim();
  if (!clean) return [];
  if (clean.length <= maxChars) return [clean];

  const sentences = clean.match(/[^.!?]+[.!?]?/g) ?? [clean];
  const chunks: string[] = [];
  let current = "";
  for (const s of sentences) {
    if ((current + s).length > maxChars && current) {
      chunks.push(current.trim());
      current = overlap > 0 ? current.slice(-overlap) + s : s;
    } else {
      current += s;
    }
  }
  if (current.trim()) chunks.push(current.trim());
  return chunks;
}
