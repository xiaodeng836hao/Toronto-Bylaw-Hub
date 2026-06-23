// ─────────────────────────────────────────────────────────────────────────────
//  Toronto Bylaw Guide — Section keyword builder (V6.3)
//
//  Derives the searchable vocabulary for each indexed bylaw section: the
//  frequency keywords extracted from the section text (already on the index) PLUS
//  the resident-facing "visual issue" keywords for that section's chapter, taken
//  from the curated photo-review map. This links what a photo AI describes
//  ("graffiti", "spray paint", "tag") to the legal section text — without ever
//  inventing a section number. Isomorphic (no server-only imports).
// ─────────────────────────────────────────────────────────────────────────────

import { photoReviewBylawMap } from "@/data/photo-review-bylaw-map";
import type { BylawSectionEntry } from "@/data/rag/bylaw-section-index";

/** chapterNumber → merged visual-issue keywords + AI labels from the curated map. */
const CHAPTER_VISUAL_KEYWORDS: Record<string, string[]> = (() => {
  const out: Record<string, Set<string>> = {};
  for (const cat of photoReviewBylawMap) {
    if (!cat.chapterSlug) continue;
    const set = (out[cat.chapterSlug] ??= new Set());
    for (const k of cat.triggerKeywords) set.add(k.toLowerCase());
    for (const l of cat.aiLabels) set.add(l.toLowerCase());
  }
  const flat: Record<string, string[]> = {};
  for (const [ch, set] of Object.entries(out)) flat[ch] = [...set];
  return flat;
})();

/** Visual-issue keywords associated with a chapter (resident wording / AI labels). */
export function visualKeywordsForChapter(chapterNumber: string): string[] {
  return CHAPTER_VISUAL_KEYWORDS[chapterNumber] ?? [];
}

export interface SectionKeywordBundle {
  /** Legal/frequency keywords extracted from the section body. */
  legal: string[];
  /** Section + chapter title words (plain-language anchors). */
  plainLanguage: string[];
  /** Visual issue keywords for the chapter (what a photo may show). */
  visual: string[];
}

function titleWords(s: string): string[] {
  return (s.toLowerCase().match(/[a-z][a-z-]{3,}/g) ?? []).filter((w) => w.length >= 4);
}

/** Full keyword bundle for a section (used for matching + the debug panel). */
export function buildSectionKeywords(section: BylawSectionEntry): SectionKeywordBundle {
  return {
    legal: section.keywords,
    plainLanguage: [...new Set([...titleWords(section.sectionTitle), ...titleWords(section.chapterTitle)])],
    visual: visualKeywordsForChapter(section.chapterNumber),
  };
}

/** Lowercased token/phrase haystack for a section, used by the retriever. */
export function sectionHaystack(section: BylawSectionEntry): string {
  const b = buildSectionKeywords(section);
  return [
    section.sectionTitle,
    section.chapterTitle,
    section.excerpt,
    ...b.legal,
    ...b.plainLanguage,
    ...b.visual,
  ]
    .join(" ")
    .toLowerCase();
}
