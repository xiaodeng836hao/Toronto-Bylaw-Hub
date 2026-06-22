// ─────────────────────────────────────────────────────────────────────────────
//  Toronto Bylaw Guide — RAG embeddings + local vector index (V6) — SERVER ONLY
//
//  Dev/default store: a local JSON index at data/rag/index.json produced by
//  scripts/ingest-rag.mjs. Production can swap in Postgres + pgvector (see
//  RAG_SOURCE_MAINTENANCE.md) without changing the retrieve/answer callers.
// ─────────────────────────────────────────────────────────────────────────────

import { promises as fs } from "fs";
import path from "path";

export interface IndexedChunk {
  id: string;
  chapter: string | null;
  section: string | null;
  sectionTitle: string | null;
  text: string;
  embedding: number[];
}

export interface LocalIndex {
  model: string;
  createdAt: string;
  chunks: IndexedChunk[];
}

let cached: LocalIndex | null | undefined;

/** Load the local vector index once (cached). Returns null if not built yet. */
export async function loadLocalIndex(): Promise<LocalIndex | null> {
  if (cached !== undefined) return cached;
  try {
    const file = path.join(process.cwd(), "data", "rag", "index.json");
    const raw = await fs.readFile(file, "utf8");
    cached = JSON.parse(raw) as LocalIndex;
  } catch {
    cached = null;
  }
  return cached;
}

export function cosineSimilarity(a: number[], b: number[]): number {
  let dot = 0, na = 0, nb = 0;
  const len = Math.min(a.length, b.length);
  for (let i = 0; i < len; i++) {
    dot += a[i] * b[i];
    na += a[i] * a[i];
    nb += b[i] * b[i];
  }
  if (na === 0 || nb === 0) return 0;
  return dot / (Math.sqrt(na) * Math.sqrt(nb));
}
