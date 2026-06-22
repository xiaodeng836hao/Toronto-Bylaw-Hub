// ─────────────────────────────────────────────────────────────────────────────
//  Toronto Bylaw Guide — RAG document/corpus builder (V6) — SERVER ONLY
//
//  Turns the in-repo parsed Municipal Code sections (lib/bylaw-sections.json)
//  into chunk records ready for embedding. The ingestion script
//  (scripts/ingest-rag.mjs) performs the same transformation in plain Node so it
//  can run without a TypeScript loader; this module mirrors it for app/test use.
// ─────────────────────────────────────────────────────────────────────────────

import sections from "@/lib/bylaw-sections.json";
import { chunkText } from "@/lib/rag/chunk";

interface RawSection {
  chapterNumber: string;
  chapterTitle: string;
  sectionCode: string;
  sectionTitle: string;
  body: string;
}

export interface CorpusChunk {
  id: string;
  chapter: string | null;
  section: string | null;
  sectionTitle: string | null;
  text: string;
}

/** Build embeddable chunk records from the parsed Municipal Code sections. */
export function getCorpusChunks(): CorpusChunk[] {
  const out: CorpusChunk[] = [];
  for (const s of sections as RawSection[]) {
    const body = (s.body ?? "").trim();
    if (body.length < 40) continue; // skip empty / heading-only sections
    const header = `${s.chapterTitle} — ${s.sectionCode} ${s.sectionTitle}`.trim();
    const parts = chunkText(body, { maxChars: 900, overlap: 120 });
    parts.forEach((text, i) => {
      out.push({
        id: `${s.chapterNumber}:${s.sectionCode}:${i}`,
        chapter: s.chapterNumber,
        section: s.sectionCode,
        sectionTitle: s.sectionTitle,
        text: `${header}\n${text}`,
      });
    });
  }
  return out;
}
