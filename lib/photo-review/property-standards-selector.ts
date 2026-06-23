// ─────────────────────────────────────────────────────────────────────────────
//  Toronto Bylaw Guide — Property Standards (Chapter 629) section selector (V6.5)
//
//  Picks the MOST SPECIFIC § 629 section for a Property-Standards image issue
//  using the curated keyword groups in data/photo-review/property-standards-
//  keywords.ts, then pulls the verified source excerpt from the section index.
//  This turns a broad "Chapter 629 — Property Standards" result into, e.g.,
//  "§ 629-27 Walls and ceilings". Section numbers + excerpts come from the MD
//  index only — never invented. Isomorphic (no server-only imports).
// ─────────────────────────────────────────────────────────────────────────────

import {
  propertyStandardsKeywordGroups, type PropertyStandardsKeywordGroup,
} from "@/data/photo-review/property-standards-keywords";
import { bylawSectionIndex, type BylawSectionEntry } from "@/data/rag/bylaw-section-index";
import type { PhotoReviewMatchSection, SourceCoverage } from "@/lib/ai/types";

// Spec scoring weights (data/photo-review — item 4).
const W = {
  sectionTerm: 40,
  visual: 35,
  resident: 25,
  technical: 20,
  title: 30,
  multipleOverlap: 20,
  negative: -35,
};

// Index lookup: "§ 629-27" → entry.
const INDEX_BY_SECTION = new Map<string, BylawSectionEntry>(
  bylawSectionIndex.filter((s) => s.chapterNumber === "629").map((s) => [s.sectionNumber, s]),
);

function norm(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9\s/-]/g, " ").replace(/\s+/g, " ").trim();
}

/** Whole-word containment ("ant" must not match "want"). */
function hasWord(haystack: string, word: string): boolean {
  return new RegExp(`(?:^|[^a-z0-9])${word.replace(/[-]/g, "\\-")}(?:[^a-z0-9]|$)`).test(haystack);
}

/**
 * Term containment. Multi-word terms match either as an exact phrase OR when all
 * of their significant (≥4-char) words appear — so "water stain ceiling" still
 * matches "ceiling water stain damaged surface" (order-independent).
 */
function containsTerm(haystack: string, term: string): boolean {
  const t = norm(term);
  if (!t) return false;
  if (!t.includes(" ")) return hasWord(haystack, t);
  if (haystack.includes(t)) return true;
  const sig = t.split(" ").filter((w) => w.length >= 4);
  return sig.length >= 2 && sig.every((w) => hasWord(haystack, w));
}

function countMatches(haystack: string, list: string[], out: Set<string>, cap: number): number {
  let n = 0;
  for (const kw of list) {
    if (containsTerm(haystack, kw)) { out.add(kw); n++; if (n >= cap) break; }
  }
  return n;
}

function titleHit(haystack: string, group: PropertyStandardsKeywordGroup): boolean {
  return norm(group.sectionTitle)
    .split(" ")
    .filter((w) => w.length >= 5)
    .some((w) => haystack.includes(w));
}

function scoreGroup(group: PropertyStandardsKeywordGroup, haystack: string): { score: number; matched: string[] } {
  const matched = new Set<string>();
  const vis = countMatches(haystack, group.visualKeywords, matched, 4);
  const res = countMatches(haystack, group.residentKeywords, matched, 3);
  const tech = countMatches(haystack, group.technicalKeywords, matched, 3);
  const terms = countMatches(haystack, group.sectionTerms, matched, 2);

  let score = vis * W.visual + res * W.resident + tech * W.technical + terms * W.sectionTerm;
  // A section-title match is only a BOOSTER on top of a real keyword hit, so a
  // generic title word (e.g. "water" in the Plumbing title) cannot win alone.
  if (vis + res + tech + terms >= 1 && titleHit(haystack, group)) score += W.title;
  if (vis + res + tech + terms >= 2) score += W.multipleOverlap;

  const negs = new Set<string>();
  const negCount = countMatches(haystack, group.negativeKeywords ?? [], negs, 3);
  score += negCount * W.negative;

  return { score, matched: [...matched] };
}

export interface PropertyStandardsSelection {
  sections: PhotoReviewMatchSection[];
  /** The most specific group's category, e.g. "Interior Walls / Ceilings". */
  issueCategory: string;
  matchedKeywords: string[];
  coverage: SourceCoverage;
  topSectionLabel: string;
  debugScores: { section: string; score: number }[];
}

function toSection(group: PropertyStandardsKeywordGroup): PhotoReviewMatchSection {
  const entry = INDEX_BY_SECTION.get(`§ ${group.section}`);
  return {
    sectionNumber: `§ ${group.section}`,
    sectionTitle: group.sectionTitle,
    chapterNumber: "629",
    // Prefer the verified MD excerpt; fall back to a sourced section phrase.
    sourceExcerpt: entry?.excerpt ?? group.sectionTerms[0] ?? "",
    plainLanguageSummary: entry?.sourceText.slice(0, 220) ?? group.sectionTerms[0] ?? "",
    sourceUrl: entry?.officialSourceUrl ?? "https://www.toronto.ca/legdocs/municode/1184_629.pdf",
    sourceFile: group.sourceFile,
    verificationStatus: "verified",
  };
}

/**
 * Select the best-matching § 629 section(s) for the given image text. Returns
 * null when no keyword group scores — the caller then keeps the generic
 * chapter-level Property Standards result.
 */
export function selectPropertyStandardsSections(haystackRaw: string): PropertyStandardsSelection | null {
  const haystack = norm(haystackRaw);
  if (!haystack) return null;

  const scored = propertyStandardsKeywordGroups
    .map((g) => ({ g, ...scoreGroup(g, haystack) }))
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score);

  if (scored.length === 0) return null;

  const top = scored.slice(0, 3);
  const topScore = top[0].score;
  const coverage: SourceCoverage = topScore >= 75 ? "strong" : topScore >= 40 ? "partial" : "chapter-only";

  return {
    sections: top.map((x) => toSection(x.g)),
    issueCategory: top[0].g.issueCategory,
    matchedKeywords: [...new Set(top.flatMap((x) => x.matched))].slice(0, 8),
    coverage,
    topSectionLabel: `§ ${top[0].g.section} ${top[0].g.sectionTitle}`,
    debugScores: top.map((x) => ({ section: `§ ${x.g.section}`, score: x.score })),
  };
}
