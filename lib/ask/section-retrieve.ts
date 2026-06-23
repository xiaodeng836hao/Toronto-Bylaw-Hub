// ─────────────────────────────────────────────────────────────────────────────
//  Toronto Bylaw Guide — Ask section-level retriever (V6.7) — SERVER ONLY
//
//  Retrieves PRECISE, source-backed bylaw SECTIONS for a question, so Ask answers
//  cite the right chapter + section instead of a broad page. It classifies the
//  question, searches the routed chapters first in the PDF/Markdown-derived
//  section index (data/rag/bylaw-section-index.json), and for Property Standards
//  uses the §629 keyword selector. Returns RagChunkRef[] — the same shape the
//  Ask UI and answer generator already consume — so nothing downstream changes.
//
//  Section numbers + excerpts come only from the indexed source; nothing is
//  invented. Import ONLY from server code (it loads the ~330KB section index).
// ─────────────────────────────────────────────────────────────────────────────

import { bylawSectionIndex, sectionsForChapter, type BylawSectionEntry } from "@/data/rag/bylaw-section-index";
import { visualKeywordsForChapter } from "@/lib/photo-review/section-keyword-builder";
import { selectPropertyStandardsSections } from "@/lib/photo-review/property-standards-selector";
import { sourceMetaForChapter } from "@/data/rag/source-manifest";
import { classifyQuery, type QueryClassification } from "@/lib/ask/classify-query";
import type { RagChunkRef, SourceCoverage } from "@/lib/ai/types";

export interface AskSectionResult {
  chunks: RagChunkRef[];
  classification: QueryClassification;
  coverage: SourceCoverage;
  matchedKeywords: string[];
}

const STOP = new Set([
  "the", "and", "for", "any", "with", "that", "this", "from", "are", "what", "which",
  "section", "applies", "apply", "does", "can", "how", "when", "where", "about",
  "bylaw", "by-law", "toronto", "rule", "rules", "need", "needs", "your", "their",
]);

function norm(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9\s/-]/g, " ").replace(/\s+/g, " ").trim();
}

function tokenize(s: string): string[] {
  return [...new Set(norm(s).split(" ").filter((w) => w.length >= 4 && !STOP.has(w)))];
}

/** Score a section against the query tokens + phrases. Primary chapters boosted. */
function scoreSection(section: BylawSectionEntry, tokens: string[], phrases: string[], primary: boolean): { score: number; matched: string[] } {
  const titleWords = new Set(norm(section.sectionTitle).split(" "));
  const kw = new Set(section.keywords);
  const visual = new Set(visualKeywordsForChapter(section.chapterNumber));
  const bodyWords = new Set(norm(section.sourceText).split(" "));
  const matched = new Set<string>();
  let score = 0;
  for (const t of tokens) {
    if (titleWords.has(t)) { score += 3; matched.add(t); }
    else if (kw.has(t)) { score += 2; matched.add(t); }
    else if (bodyWords.has(t)) { score += 1; matched.add(t); }
    if (visual.has(t)) { score += 1; matched.add(t); }
  }
  const hay = `${norm(section.sectionTitle)} ${norm(section.sourceText)}`;
  for (const p of phrases) {
    if (p.length >= 5 && hay.includes(p)) { score += 4; matched.add(p); }
  }
  if (score > 0 && primary) score += 1;
  return { score, matched: [...matched] };
}

function toChunk(section: BylawSectionEntry, score: number): RagChunkRef {
  const meta = sourceMetaForChapter(section.chapterNumber);
  return {
    id: section.id,
    sourceTitle: meta.title,
    sourceType: meta.type,
    chapter: section.chapterNumber,
    section: section.sectionNumber,
    sectionTitle: section.sectionTitle,
    text: section.sourceText,
    internalUrl: section.internalUrl || meta.internalUrl,
    officialUrl: section.officialSourceUrl || meta.officialUrl,
    lastReviewed: section.lastReviewed,
    score: Math.min(1, score / 14),
  };
}

const SECTION_THRESHOLD = 3;

/** Skip mis-parsed "sections" that are really footnotes / adoption history. */
function isUsableSection(s: BylawSectionEntry): boolean {
  return s.hasBody && !/by-law no\.|came into force|editor'?s note/i.test(s.sectionTitle);
}

/**
 * Retrieve the most relevant bylaw sections for a question. Returns [] when the
 * question maps to no indexed source (the caller then falls back to the curated
 * knowledge index). Noise questions return [] with isNoise set.
 */
export function retrieveAskSections(query: string, limit = 6): AskSectionResult {
  const classification = classifyQuery(query);
  if (classification.isNoise) {
    return { chunks: [], classification, coverage: "needs-verification", matchedKeywords: [] };
  }

  const tokens = tokenize(classification.expandedQuery);
  const phrases = [norm(query)].filter((p) => p.length >= 5);

  // Candidate chapters: the routed ones first. If NO topic was identified, do a
  // best-effort broad search of every indexed chapter. If a topic IS known but
  // its chapters are not in the Markdown corpus (e.g. Zoning, Landscaping, Dust),
  // return nothing so the route defers to the curated knowledge-index fallback
  // rather than surfacing an unrelated chapter.
  const routed = classification.chapters.filter((c) => sectionsForChapter(c.chapter).some(isUsableSection));
  const candidates = routed.length
    ? routed
    : classification.topicId === null
      ? [...new Set(bylawSectionIndex.filter(isUsableSection).map((s) => s.chapterNumber))].map((c) => ({ chapter: c, primary: false }))
      : [];

  const scored = candidates
    .flatMap(({ chapter, primary }) =>
      sectionsForChapter(chapter).filter(isUsableSection).map((s) => ({ s, ...scoreSection(s, tokens, phrases, primary) })),
    )
    .filter((x) => x.score >= SECTION_THRESHOLD)
    .sort((a, b) => b.score - a.score);

  // Property Standards: prefer the precise §629 keyword selector when Chapter 629
  // is in scope (routed for this topic, or reached via the broad fallback).
  if (classification.topicId === "property-standards" || candidates.some((c) => c.chapter === "629")) {
    const ps = selectPropertyStandardsSections(classification.expandedQuery);
    if (ps && ps.sections.length) {
      const psChunks: RagChunkRef[] = ps.sections.map((s) => ({
        id: `ps-${s.sectionNumber}`,
        sourceTitle: "Chapter 629 — Property Standards",
        sourceType: "TMC Chapter",
        chapter: "629",
        section: s.sectionNumber,
        sectionTitle: s.sectionTitle,
        text: s.sourceExcerpt || s.plainLanguageSummary,
        internalUrl: "/tmc-chapters/629",
        officialUrl: s.sourceUrl,
        lastReviewed: null,
        score: 0.9,
      }));
      // Put PS sections first, then other scored sections (de-duplicated). When
      // the topic was unclassified (broad all-chapter fallback), drop the extra
      // sections so a §629 answer is not padded with unrelated chapters.
      const seen = new Set(psChunks.map((c) => `${c.chapter}${c.section}`));
      const rest = classification.topicId === null
        ? []
        : scored.map((x) => toChunk(x.s, x.score)).filter((c) => !seen.has(`${c.chapter}${c.section}`));
      const chunks = [...psChunks, ...rest].slice(0, limit);
      const matchedKeywords = [...new Set([...ps.matchedKeywords, ...scored.flatMap((x) => x.matched)])].slice(0, 12);
      return { chunks, classification, coverage: ps.coverage, matchedKeywords };
    }
  }

  const top = scored.slice(0, limit);
  const chunks = top.map((x) => toChunk(x.s, x.score));
  const matchedKeywords = [...new Set(scored.flatMap((x) => x.matched))].slice(0, 12);
  const coverage: SourceCoverage = !top.length
    ? "needs-verification"
    : top[0].score >= 7 ? "strong" : top[0].score >= 4 ? "partial" : "chapter-only";

  return { chunks, classification, coverage, matchedKeywords };
}
