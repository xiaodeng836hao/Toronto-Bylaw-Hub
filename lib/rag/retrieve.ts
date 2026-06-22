// ─────────────────────────────────────────────────────────────────────────────
//  Toronto Bylaw Guide — RAG retrieval (V6) — SERVER ONLY
//
//  Primary path: cosine similarity over the local embedding index (when AI is
//  configured AND the index has been built). Fallback path: the existing V5
//  keyword retrieval over the curated knowledge index — so /ask retrieval always
//  works, even without an API key or a built vector index.
// ─────────────────────────────────────────────────────────────────────────────

import { isAiConfigured, embedOne } from "@/lib/ai/provider";
import { loadLocalIndex, cosineSimilarity } from "@/lib/rag/embeddings";
import { sourceMetaForChapter } from "@/data/rag/source-manifest";
import { searchKnowledge } from "@/lib/ask";
import type { RagChunkRef } from "@/lib/ai/types";

export type RetrievalMode = "embeddings" | "keyword";

export interface RetrievalResult {
  mode: RetrievalMode;
  chunks: RagChunkRef[];
}

/** Keyword fallback: map curated knowledge items to chunk refs. */
function keywordRetrieve(query: string, limit: number): RagChunkRef[] {
  return searchKnowledge(query, limit).map((r) => {
    const k = r.item;
    return {
      id: k.id,
      sourceTitle: k.title,
      sourceType: k.type,
      chapter: k.relatedChapter,
      section: k.relatedSections[0] ?? null,
      sectionTitle: null,
      text: k.sourceText,
      internalUrl: k.internalUrl,
      officialUrl: k.officialSources[0]?.url ?? null,
      lastReviewed: k.lastReviewed,
      score: Math.min(1, r.score / 30),
    };
  });
}

/** Retrieve the most relevant source chunks for a query. */
export async function retrieve(query: string, limit = 6): Promise<RetrievalResult> {
  // Try the embedding index only when AI is configured (needs the query vector).
  if (isAiConfigured()) {
    try {
      const index = await loadLocalIndex();
      if (index && index.chunks.length > 0) {
        const q = await embedOne(query);
        const scored = index.chunks
          .map((c) => ({ c, score: cosineSimilarity(q, c.embedding) }))
          .sort((a, b) => b.score - a.score)
          .slice(0, limit);
        const chunks: RagChunkRef[] = scored.map(({ c, score }) => {
          const meta = c.chapter ? sourceMetaForChapter(c.chapter) : null;
          return {
            id: c.id,
            sourceTitle: meta?.title ?? c.sectionTitle ?? "Toronto Municipal Code",
            sourceType: meta?.type ?? "TMC Chapter",
            chapter: c.chapter,
            section: c.section,
            sectionTitle: c.sectionTitle,
            text: c.text,
            internalUrl: meta?.internalUrl ?? "/tmc-chapters",
            officialUrl: meta?.officialUrl ?? null,
            lastReviewed: meta?.lastReviewed ?? null,
            score,
          };
        });
        return { mode: "embeddings", chunks };
      }
    } catch {
      // Fall through to keyword retrieval on any embedding error.
    }
  }
  return { mode: "keyword", chunks: keywordRetrieve(query, limit) };
}
