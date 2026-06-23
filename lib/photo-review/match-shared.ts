// ─────────────────────────────────────────────────────────────────────────────
//  Toronto Bylaw Guide — shared photo-review match helpers (V6.3)
//
//  Index-free helpers shared by the server retriever and the client fallback.
//  Kept separate from bylaw-section-retriever.ts so the client does NOT bundle
//  the ~330KB section index: the client uses the curated map only, while the
//  server enriches matches with real indexed sections.
// ─────────────────────────────────────────────────────────────────────────────

import { matchBylaws, type MatcherInput, type BylawMatch } from "@/lib/photo-review/bylaw-matcher";
import { requiredCluesFor } from "@/data/photo-review/category-visual-criteria";
import type { PhotoReviewMatch, PhotoReviewMatchSection } from "@/lib/ai/types";

/** Curated relatedSections → PhotoReviewMatchSection (verification per status). */
export function curatedSections(m: BylawMatch): PhotoReviewMatchSection[] {
  return m.relatedSections.map((s) => ({
    sectionNumber: m.sectionStatus === "verified" ? s.section : "Section reference needs verification",
    sectionTitle: s.title,
    sourceExcerpt: "",
    plainLanguageSummary: s.plainLanguageSummary,
    sourceUrl: m.officialSources[0]?.url ?? "",
    sourceFile: null,
    verificationStatus: m.sectionStatus,
  }));
}

/** De-duplicated official sources, capped. */
export function mergeSources(
  base: { title: string; url: string }[],
  sections: PhotoReviewMatchSection[],
): { title: string; url: string }[] {
  const out = [...base];
  for (const s of sections) {
    if (s.sourceUrl && !out.some((o) => o.url === s.sourceUrl)) {
      out.push({ title: `Official source — ${s.sectionNumber}`, url: s.sourceUrl });
    }
  }
  return out.slice(0, 5);
}

/** Build a PhotoReviewMatch from a curated category with NO indexed sections. */
export function curatedToMatch(m: BylawMatch): PhotoReviewMatch {
  const relatedSections = curatedSections(m);
  return {
    id: m.id,
    issueCategory: m.issueCategory,
    confidence: m.confidence,
    chapter: m.chapter,
    chapterNumber: m.chapterSlug ?? "",
    chapterSlug: m.chapterSlug,
    internalUrl: m.internalUrl,
    guideLabel: m.guideLabel,
    askQuery: m.askQuery,
    relatedSections,
    sourceCoverage: m.sectionStatus === "verified" ? "partial" : "needs-verification",
    explanation: m.explanation,
    whyMatched: `Mapped to ${m.chapter} from the detected issue category.`,
    matchedKeywords: [],
    requiredClues: requiredCluesFor(m.id),
    evidenceChecklist: m.evidenceChecklist,
    nextSteps: m.nextSteps,
    officialSources: mergeSources(m.officialSources, relatedSections),
    comingSoon: m.comingSoon,
  };
}

export interface CuratedResult {
  matches: PhotoReviewMatch[];
  noStrongMatch: boolean;
  noise: boolean;
}

/** Lightweight curated-only matching (client fallback; no section index). */
export function curatedMatch(input: MatcherInput): CuratedResult {
  const r = matchBylaws(input);
  if (r.noise) return { matches: [], noStrongMatch: false, noise: true };
  return {
    matches: r.matches.map(curatedToMatch),
    noStrongMatch: r.noStrongMatch,
    noise: false,
  };
}
