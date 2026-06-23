// ─────────────────────────────────────────────────────────────────────────────
//  Toronto Bylaw Guide — PDF/Markdown-derived bylaw SECTION index (V6.3)
//
//  Typed loader for data/rag/bylaw-section-index.json, generated from the
//  extracted Municipal Code Markdown by scripts/build-bylaw-section-index.mjs
//  (`npm run build:bylaw-section-index`). This is the PRIMARY, section-aware,
//  source-backed reference used by the Photo Review retriever — every entry is a
//  real section from an uploaded bylaw document, so section numbers and excerpts
//  are never invented. Isomorphic: safe to import from server or client.
// ─────────────────────────────────────────────────────────────────────────────

import raw from "@/data/rag/bylaw-section-index.json";

export interface BylawSectionEntry {
  id: string;
  chapterNumber: string;
  chapterTitle: string;
  /** Exact section reference, e.g. "§ 447-1.2" or "Schedule A". */
  sectionNumber: string;
  sectionTitle: string;
  /** Cleaned section body (capped). */
  sourceText: string;
  /** Short readable excerpt for the UI. */
  excerpt: string;
  /** Frequency keywords derived from the section text. */
  keywords: string[];
  sourceFile: string;
  sourceType: "markdown" | "pdf" | "structured-data";
  officialSourceUrl: string;
  internalUrl: string;
  lastReviewed: string;
  /** False when only a heading was found (no usable body). */
  hasBody: boolean;
}

export const bylawSectionIndex = raw as BylawSectionEntry[];

/** All sections for a chapter number, in document order. */
export function sectionsForChapter(chapterNumber: string): BylawSectionEntry[] {
  return bylawSectionIndex.filter((s) => s.chapterNumber === chapterNumber);
}

/** Chapter numbers that have at least one indexed section with a body. */
export function indexedChapters(): string[] {
  return [...new Set(bylawSectionIndex.filter((s) => s.hasBody).map((s) => s.chapterNumber))];
}
