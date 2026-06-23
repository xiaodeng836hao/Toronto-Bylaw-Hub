// ─────────────────────────────────────────────────────────────────────────────
//  Toronto Bylaw Guide — Photo Review bylaw SECTION retriever (V6.4)
//
//  Two-stage matching: (1) the curated matcher classifies the image into issue
//  categories; (2) for each category the retriever searches ONLY the routed
//  source chapters (primary first, then secondary — e.g. waste → 548, then
//  846/841) and attaches the best-scoring REAL sections from the section index.
//  Overmatch guardrails drop categories that lack a required clue or that the
//  AI's negative findings rule out (e.g. Pool Fence with "no pool is visible").
//  Sections are NEVER invented — when no indexed section clears the threshold the
//  result is marked "needs verification". Isomorphic (server after vision; the
//  client uses the lighter curated fallback in match-shared.ts).
// ─────────────────────────────────────────────────────────────────────────────

import { matchBylaws, type MatcherInput, type BylawMatch } from "@/lib/photo-review/bylaw-matcher";
import { sectionsForChapter, type BylawSectionEntry } from "@/data/rag/bylaw-section-index";
import { visualKeywordsForChapter } from "@/lib/photo-review/section-keyword-builder";
import { curatedSections, mergeSources } from "@/lib/photo-review/match-shared";
import { sourceChaptersFor } from "@/data/photo-review/category-source-routing";
import { failsRequiredClue, negatedByFindings, requiredCluesFor } from "@/data/photo-review/category-visual-criteria";
import { selectPropertyStandardsSections } from "@/lib/photo-review/property-standards-selector";
import type {
  PhotoReviewMatch, PhotoReviewMatchSection, PhotoReviewDebug, SourceCoverage, LocationContext,
} from "@/lib/ai/types";

export interface RetrieverInput extends MatcherInput {
  detectedObjects?: string[];
  searchKeywords?: string[];
  visualEvidence?: string[];
  negativeFindings?: string[];
  locationContext?: LocationContext;
}

export interface RetrievalOutput {
  matches: PhotoReviewMatch[];
  noStrongMatch: boolean;
  noise: boolean;
  debug: PhotoReviewDebug;
}

const STOP = new Set([
  "the", "and", "for", "any", "with", "that", "this", "from", "are", "near", "appears",
  "appear", "visible", "photo", "image", "yard", "wall", "area", "side", "private",
  "property", "front", "rear", "large", "small", "some", "there", "other",
]);

function norm(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9\s/-]/g, " ").replace(/\s+/g, " ").trim();
}

function tokenize(strings: string[]): string[] {
  const out = new Set<string>();
  for (const s of strings) {
    for (const w of norm(s).split(" ")) {
      if (w.length >= 4 && !STOP.has(w)) out.add(w);
    }
  }
  return [...out];
}

/** Score one section against the query tokens + phrases. Primary chapters get a boost. */
function scoreSection(
  section: BylawSectionEntry,
  tokens: string[],
  phrases: string[],
  primary: boolean,
): { score: number; matched: string[] } {
  const titleWords = new Set(norm(section.sectionTitle).split(" "));
  const kw = new Set(section.keywords);
  const visual = new Set(visualKeywordsForChapter(section.chapterNumber));
  // Body words let a token match section text even when it is not a top
  // frequency keyword (e.g. "erosion" appears once in § 629-11's body).
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
  // Sections from the category's PRIMARY chapter are preferred over secondary.
  if (score > 0 && primary) score += 1;
  return { score, matched: [...matched] };
}

function toSection(section: BylawSectionEntry): PhotoReviewMatchSection {
  return {
    sectionNumber: section.sectionNumber,
    sectionTitle: section.sectionTitle,
    chapterNumber: section.chapterNumber,
    sourceExcerpt: section.excerpt,
    plainLanguageSummary: section.sourceText.slice(0, 220),
    sourceUrl: section.officialSourceUrl,
    sourceFile: section.sourceFile,
    verificationStatus: "verified",
  };
}

const SECTION_THRESHOLD = 3;

/**
 * Run the full V6.4 retrieval: classify (curated) → route to source chapters →
 * score sections → apply overmatch guardrails. Returns ranked matches with
 * source-coverage status and a dev-only debug trace.
 */
export function retrieveBylawMatches(input: RetrieverInput): RetrievalOutput {
  // Fold the AI's location hint into the classification text so, e.g., a
  // "pool area" location can anchor the Pool Fence category.
  const locationHint = input.locationContext && input.locationContext.likelyArea !== "unknown"
    ? input.locationContext.likelyArea
    : "";
  const curated = matchBylaws({
    ...input,
    userDescription: [input.userDescription, locationHint].filter(Boolean).join(" "),
  });

  const tokens = tokenize([
    ...(input.visibleObservations ?? []),
    ...(input.detectedObjects ?? []),
    ...(input.possibleIssueLabels ?? []),
    ...(input.searchKeywords ?? []),
    ...(input.visualEvidence ?? []),
    input.userDescription ?? "",
    input.locationContext?.likelyArea ?? "",
  ]);
  const tokenSet = new Set(tokens);
  const rawText = [
    ...(input.visibleObservations ?? []),
    ...(input.detectedObjects ?? []),
    ...(input.possibleIssueLabels ?? []),
    input.userDescription ?? "",
    input.locationContext?.likelyArea ?? "",
  ].join(" ").toLowerCase();
  const phrases = [...(input.searchKeywords ?? []), ...(input.visibleObservations ?? [])]
    .map(norm)
    .filter((p) => p.length >= 5);
  const negatives = input.negativeFindings ?? [];
  // Richer text for the Property Standards section selector (keyword phrases).
  const psText = [
    ...(input.visibleObservations ?? []),
    ...(input.detectedObjects ?? []),
    ...(input.visualEvidence ?? []),
    ...(input.searchKeywords ?? []),
    ...(input.possibleIssueLabels ?? []),
    input.userDescription ?? "",
    input.locationContext?.likelyArea ?? "",
  ].join(" ");

  const debug: PhotoReviewDebug = {
    searchTokens: tokens,
    searchPhrases: phrases,
    selectedSourceChapters: [],
    retrievedSections: [],
    droppedCategories: [],
    usedCuratedFallback: false,
  };

  if (curated.noise) {
    return { matches: [], noStrongMatch: false, noise: true, debug };
  }

  // Stage 2 + guardrails.
  const matches: PhotoReviewMatch[] = [];
  for (const m of curated.matches) {
    // Overmatch guard 1 — AI negative finding rules the category out.
    if (negatedByFindings(m.id, negatives)) {
      debug.droppedCategories.push({ id: m.id, reason: "negative-finding" });
      continue;
    }
    // Overmatch guard 2 — category needs an explicit clue that is absent.
    if (failsRequiredClue(m.id, tokenSet, rawText)) {
      debug.droppedCategories.push({ id: m.id, reason: "missing-required-clue" });
      continue;
    }
    matches.push(enrichMatch(m, tokens, phrases, input, debug, psText));
  }

  return {
    matches,
    noStrongMatch: matches.length === 0 || matches.every((m) => m.confidence === "low"),
    noise: false,
    debug,
  };
}

/** Attach source-backed sections (routed to the right chapters) to one match. */
function enrichMatch(
  m: BylawMatch,
  tokens: string[],
  phrases: string[],
  input: RetrieverInput,
  debug: PhotoReviewDebug,
  psText: string,
): PhotoReviewMatch {
  let relatedSections: PhotoReviewMatchSection[];
  let sourceCoverage: SourceCoverage;
  let matchedKeywords: string[];
  let issueCategory = m.issueCategory;
  let whyMatched: string;

  // Chapter 629 gets a SPECIFIC section via the Property Standards selector,
  // so a broad "Property Standards" becomes e.g. "§ 629-27 Walls and ceilings".
  const ps = m.id === "property-standards" ? selectPropertyStandardsSections(psText) : null;

  if (ps) {
    relatedSections = ps.sections;
    sourceCoverage = ps.coverage;
    matchedKeywords = ps.matchedKeywords;
    issueCategory = ps.issueCategory;
    whyMatched = `The image appears to show ${ps.matchedKeywords.slice(0, 4).join(", ") || "a maintenance condition"}, which is more specific than a general property issue and may relate to ${ps.topSectionLabel}.`;
    debug.selectedSourceChapters.push("629");
    for (const d of ps.debugScores) debug.retrievedSections.push({ sectionNumber: d.section, chapter: "629", score: d.score });
  } else {
    // Stage 2: only search the chapters routed for this category (primary first).
    const routed = sourceChaptersFor(m.id);
    const chapters = routed.length
      ? routed
      : (m.chapterSlug ? [{ chapter: m.chapterSlug, primary: true }] : []);
    for (const c of chapters) if (!debug.selectedSourceChapters.includes(c.chapter)) debug.selectedSourceChapters.push(c.chapter);

    const scored = chapters
      .flatMap(({ chapter, primary }) =>
        sectionsForChapter(chapter).filter((s) => s.hasBody).map((s) => ({ s, primary, ...scoreSection(s, tokens, phrases, primary) })),
      )
      .filter((x) => x.score >= SECTION_THRESHOLD)
      .sort((a, b) => b.score - a.score);

    for (const x of scored.slice(0, 5)) {
      debug.retrievedSections.push({ sectionNumber: x.s.sectionNumber, chapter: x.s.chapterNumber, score: x.score });
    }

    const anyIndexed = chapters.some(({ chapter }) => sectionsForChapter(chapter).some((s) => s.hasBody));
    matchedKeywords = [...new Set(scored.flatMap((x) => x.matched))].slice(0, 12);

    if (scored.length > 0) {
      relatedSections = scored.slice(0, 3).map((x) => toSection(x.s));
      const top = scored[0].score;
      sourceCoverage = top >= 7 ? "strong" : top >= 4 ? "partial" : "chapter-only";
    } else if (anyIndexed) {
      debug.usedCuratedFallback = true;
      relatedSections = curatedSections(m);
      sourceCoverage = "chapter-only";
    } else {
      // No indexed source for this category (e.g. Dust 417, Zoning) — curated
      // fallback only; sections must be verified manually.
      debug.usedCuratedFallback = true;
      relatedSections = curatedSections(m);
      sourceCoverage = m.sectionStatus === "verified" ? "partial" : "needs-verification";
    }

    whyMatched = matchedKeywords.length
      ? `Matched on ${matchedKeywords.slice(0, 6).join(", ")} against ${m.chapter}.`
      : `Mapped to ${m.chapter} from the detected issue category.`;
  }

  // Transparency: why the match isn't higher confidence.
  const whyNotHigher = buildWhyNotHigher(m, sourceCoverage, input);

  const officialSources = mergeSources(m.officialSources, relatedSections);

  return {
    id: m.id,
    issueCategory,
    confidence: m.confidence,
    chapter: m.chapter,
    chapterNumber: m.chapterSlug ?? "",
    chapterSlug: m.chapterSlug,
    internalUrl: m.internalUrl,
    guideLabel: m.guideLabel,
    askQuery: m.askQuery,
    relatedSections,
    sourceCoverage,
    explanation: m.explanation,
    whyMatched,
    whyNotHigher,
    matchedKeywords,
    requiredClues: requiredCluesFor(m.id),
    evidenceChecklist: m.evidenceChecklist,
    nextSteps: m.nextSteps,
    officialSources,
    comingSoon: m.comingSoon,
  };
}

/** Short note on what limits the confidence / precision of this match. */
function buildWhyNotHigher(
  m: BylawMatch,
  coverage: SourceCoverage,
  input: RetrieverInput,
): string | undefined {
  const reasons: string[] = [];
  if (coverage === "needs-verification") reasons.push("the exact section is not in the indexed source yet");
  else if (coverage === "chapter-only") reasons.push("only a chapter-level match was found");
  if (input.imageConfidence === "low") reasons.push("the image is low quality or unclear");
  if (m.id === "zoning") reasons.push("zoning is property-specific and usually needs measurements and the exact zone");
  if (!reasons.length) return undefined;
  return `Confidence is limited because ${reasons.join("; ")}.`;
}
