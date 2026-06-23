// ─────────────────────────────────────────────────────────────────────────────
//  Toronto Bylaw Guide — Photo Review Bylaw Matcher (V6.2)
//
//  Takes the image AI's visible observations + issue labels (and any optional
//  user description / selected issue hint) and returns the most relevant Toronto
//  bylaw chapters/sections, ranked by confidence. The AI describes what is
//  VISIBLE; this matcher — using the curated photoReviewBylawMap — decides which
//  bylaw may apply. The AI never invents chapter or section references.
//
//  Pure and isomorphic (no server-only imports): runs server-side after vision,
//  and client-side as a description/selection fallback when AI is unavailable.
// ─────────────────────────────────────────────────────────────────────────────

import {
  photoReviewBylawMap,
  type BylawMatchCategory,
  type BylawMatchSection,
  type OfficialSourceLink,
} from "@/data/photo-review-bylaw-map";

export type MatchConfidence = "low" | "medium" | "high";

export interface MatcherInput {
  /** Free-text conditions the AI says are visible in the image. */
  visibleObservations?: string[];
  /** Canonical issue labels the AI emitted (e.g. "graffiti", "pool fence"). */
  possibleIssueLabels?: string[];
  /** Optional user-typed description. */
  userDescription?: string;
  /** Optional manually selected issue type — a hint only, never required. */
  selectedIssueId?: string;
  /** Overall image confidence from the AI, used to temper match confidence. */
  imageConfidence?: MatchConfidence;
}

export interface BylawMatch {
  id: string;
  issueCategory: string;
  chapter: string;
  chapterSlug: string | null;
  internalUrl: string;
  guideLabel: string;
  askQuery: string;
  relatedSections: BylawMatchSection[];
  sectionStatus: "verified" | "needs-verification";
  explanation: string;
  evidenceChecklist: string[];
  nextSteps: string[];
  officialSources: OfficialSourceLink[];
  confidence: MatchConfidence;
  /** The signals that produced this match (for transparency / debugging). */
  matchedOn?: string[];
  comingSoon?: boolean;
}

export interface MatchResult {
  matches: BylawMatch[];
  /** True when no category scored above the noise floor. */
  noStrongMatch: boolean;
  /** True when a noise topic was detected (UI shows Coming Soon only). */
  noise: boolean;
}

const CONF_RANK: Record<MatchConfidence, number> = { low: 1, medium: 2, high: 3 };

function norm(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9\s/-]/g, " ").replace(/\s+/g, " ").trim();
}

/**
 * Whole-word/phrase containment. Uses word boundaries so "pool" does NOT match
 * inside "pooling"/"spool" (which previously surfaced a false Pool Fence match
 * for "water pooling"). Multi-word keywords still match as a phrase.
 */
function containsKeyword(haystack: string, keyword: string): boolean {
  const escaped = keyword.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(`(?:^|[^a-z0-9])${escaped}(?:[^a-z0-9]|$)`).test(haystack);
}

/** Score one category against the normalized haystack + AI labels. */
function scoreCategory(
  cat: BylawMatchCategory,
  haystack: string,
  labels: string[],
  selectedIssueId?: string,
): { score: number; matchedOn: string[] } {
  const matchedOn: string[] = [];
  let score = 0;

  // Canonical AI labels are the strongest signal.
  for (const label of labels) {
    if (cat.aiLabels.includes(label)) {
      score += 5;
      matchedOn.push(`label:${label}`);
    }
  }

  // Keyword hits in observations / description (whole-word / phrase match).
  for (const kw of cat.triggerKeywords) {
    if (containsKeyword(haystack, kw)) {
      score += 2;
      matchedOn.push(kw);
    }
  }

  // The manually selected issue is a hint only — a small nudge, never decisive.
  if (selectedIssueId && cat.id === selectedIssueId) {
    score += 1;
    matchedOn.push("selected-issue-hint");
  }

  return { score, matchedOn };
}

/** Map a raw score → confidence, tempered by the AI's overall image confidence. */
function toConfidence(score: number, imageConfidence?: MatchConfidence): MatchConfidence {
  let base: MatchConfidence = score >= 7 ? "high" : score >= 4 ? "medium" : "low";
  // A low-confidence image can't yield a high-confidence bylaw match.
  if (imageConfidence && CONF_RANK[base] > CONF_RANK[imageConfidence]) {
    base = imageConfidence;
  }
  return base;
}

function toMatch(cat: BylawMatchCategory, confidence: MatchConfidence, matchedOn: string[]): BylawMatch {
  return {
    id: cat.id,
    issueCategory: cat.issueCategory,
    chapter: cat.chapter,
    chapterSlug: cat.chapterSlug,
    internalUrl: cat.internalUrl,
    guideLabel: cat.guideLabel,
    askQuery: cat.askQuery,
    relatedSections: cat.relatedSections,
    sectionStatus: cat.sectionStatus,
    explanation: cat.explanation,
    evidenceChecklist: cat.evidenceChecklist,
    nextSteps: cat.nextSteps,
    officialSources: cat.officialSources,
    confidence,
    matchedOn,
    comingSoon: cat.comingSoon,
  };
}

/**
 * Match visible observations / labels to likely bylaw chapters & sections.
 * Returns matches ranked by confidence then by map priority.
 */
export function matchBylaws(input: MatcherInput): MatchResult {
  const labels = (input.possibleIssueLabels ?? []).map((l) => norm(l));
  const haystack = norm(
    [...(input.visibleObservations ?? []), input.userDescription ?? ""].join(" "),
  );

  // Noise takes precedence and short-circuits to the Coming Soon placeholder.
  const noiseCat = photoReviewBylawMap.find((c) => c.comingSoon);
  const noiseDetected =
    !!noiseCat &&
    (labels.includes("noise") ||
      input.selectedIssueId === "noise" ||
      noiseCat.triggerKeywords.some((kw) => containsKeyword(haystack, kw)));
  if (noiseDetected) {
    return { matches: [], noStrongMatch: false, noise: true };
  }

  const scored = photoReviewBylawMap
    .filter((c) => !c.comingSoon)
    .map((cat, idx) => {
      const { score, matchedOn } = scoreCategory(cat, haystack, labels, input.selectedIssueId);
      return { cat, idx, score, matchedOn };
    })
    .filter((s) => s.score > 0);

  // Pool-only categories must have an explicit pool signal, otherwise drop them
  // so a plain fence photo never surfaces the Pool Fence Guide.
  const filtered = scored.filter((s) => {
    if (!s.cat.poolOnly) return true;
    return s.matchedOn.some((m) => /pool/.test(m));
  });

  filtered.sort((a, b) => b.score - a.score || a.idx - b.idx);

  const matches = filtered.map((s) =>
    toMatch(s.cat, toConfidence(s.score, input.imageConfidence), s.matchedOn),
  );

  return {
    matches,
    noStrongMatch: matches.length === 0 || (matches[0]?.confidence === "low"),
    noise: false,
  };
}
