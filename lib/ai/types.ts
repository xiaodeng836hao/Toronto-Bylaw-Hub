// ─────────────────────────────────────────────────────────────────────────────
//  Toronto Bylaw Guide — AI types (V6)
//  Shared types for the server-side AI provider abstraction and API routes.
// ─────────────────────────────────────────────────────────────────────────────

export type Confidence = "low" | "medium" | "high";

/**
 * Structured result from the photo-review VISION prompt.
 *
 * The model returns ONLY what is visible in the image — observations + canonical
 * issue labels. It must NOT invent bylaw chapter or section numbers; the local
 * bylaw matcher (lib/photo-review/bylaw-matcher.ts) maps these labels to the
 * relevant chapters/sections after the model responds.
 */
export interface LocationContext {
  likelyArea: string;
  confidence: Confidence;
  notes: string;
}

export interface ImageQuality {
  clarity: Confidence;
  lighting: "poor" | "acceptable" | "good";
  viewAngle: "limited" | "acceptable" | "clear";
  limitations: string[];
}

export interface PhotoReviewAI {
  visibleObservations: string[];
  /** Concrete objects/conditions seen (e.g. "graffiti", "garbage bags"). */
  detectedObjects: string[];
  /** Canonical issue labels (e.g. "graffiti", "pool fence") for the matcher. */
  possibleIssueLabels: string[];
  /** Human-readable issue categories (display chips). */
  possibleIssueCategories: string[];
  /** Short search phrases the retriever runs against the bylaw section index. */
  searchKeywords: string[];
  /** Specific visual evidence cues (e.g. "markings on wall"). */
  visualEvidence: string[];
  /** What is NOT visible — used to rule categories out (anti-overmatch). */
  negativeFindings: string[];
  /** Where the condition likely is, with the model's confidence. */
  locationContext: LocationContext;
  /** Structured image-quality assessment. */
  imageQuality: ImageQuality;
  confidence: Confidence;
  plainLanguageExplanation: string;
  imageQualityNotes: string;
  /** What additional evidence would strengthen the assessment. */
  needsMoreEvidence: string[];
  /** Always true — a reminder the model must not determine a violation. */
  doNotDetermineViolation: boolean;
  disclaimer: string;
  /** Set when the model is told to defer to the Noise placeholder. */
  noise?: boolean;
}

/** How well a match is backed by an indexed bylaw section. */
export type SourceCoverage = "strong" | "partial" | "chapter-only" | "needs-verification";

/** Whether a section reference is sourced or still needs checking. */
export type VerificationStatus = "verified" | "needs-verification";

/** One source-backed section reference attached to a match. */
export interface PhotoReviewMatchSection {
  sectionNumber: string;
  sectionTitle: string;
  /** Chapter this section came from (may differ from the match's primary chapter). */
  chapterNumber?: string;
  sourceExcerpt: string;
  plainLanguageSummary: string;
  sourceUrl: string;
  sourceFile: string | null;
  verificationStatus: VerificationStatus;
}

/**
 * A possible bylaw match for an uploaded photo. Chapter/category come from the
 * curated map; sections + excerpts come from the PDF/Markdown-derived section
 * index (never invented by the AI).
 */
export interface PhotoReviewMatch {
  id: string;
  issueCategory: string;
  confidence: Confidence;
  chapter: string;
  chapterNumber: string;
  chapterSlug: string | null;
  internalUrl: string;
  guideLabel: string;
  askQuery: string;
  relatedSections: PhotoReviewMatchSection[];
  sourceCoverage: SourceCoverage;
  explanation: string;
  whyMatched: string;
  /** Why the match isn't higher confidence (missing evidence / measurements). */
  whyNotHigher?: string;
  matchedKeywords: string[];
  /** Resident-readable cues that would confirm this category. */
  requiredClues: string[];
  evidenceChecklist: string[];
  nextSteps: string[];
  officialSources: { title: string; url: string }[];
  comingSoon?: boolean;
}

/** Development-only retrieval trace (never shown in production). */
export interface PhotoReviewDebug {
  searchTokens: string[];
  searchPhrases: string[];
  selectedSourceChapters: string[];
  retrievedSections: { sectionNumber: string; chapter: string; score: number }[];
  droppedCategories: { id: string; reason: string }[];
  usedCuratedFallback: boolean;
}

/**
 * Full photo-review payload returned to the client: the AI's visible-image
 * analysis plus the section-matched bylaw results. `matches` is typed
 * structurally to avoid a server→client import of the retriever module.
 */
export interface PhotoReviewResult {
  analysis: PhotoReviewAI;
  matches: PhotoReviewMatch[];
  noStrongMatch: boolean;
  debug?: PhotoReviewDebug;
}

export interface PlantMatchAI {
  plantName: string;
  scientificName: string;
  confidence: Confidence;
  visibleFeatures: string[];
  missingOrUnclearFeatures: string[];
  possibleLookAlikes: string[];
  growthStage: string;
  safetyCautions: string[];
  removalGuidanceSummary: string;
  internalPlantUrl: string;
  officialSources: { title: string; url: string }[];
}

export interface PlantIdentifyAI {
  likelyMatches: PlantMatchAI[];
  noClearMatch: boolean;
  generalNotes: string;
  disclaimer: string;
}

/** A retrieved source chunk used to ground a RAG answer. */
export interface RagChunkRef {
  id: string;
  sourceTitle: string;
  sourceType: string;
  chapter: string | null;
  section: string | null;
  sectionTitle: string | null;
  text: string;
  internalUrl: string;
  officialUrl: string | null;
  lastReviewed: string | null;
  /** Similarity / relevance score (0..1-ish or keyword score). */
  score: number;
}

export interface AskAnswerAI {
  shortAnswer: string;
  explanation: string;
  relatedTopic: string | null;
  nextSteps: string[];
  confidence: Confidence;
  disclaimer: string;
}

/** Whether the answer was produced by the AI generator or local fallback. */
export type AnswerMode = "ai-rag" | "local-fallback" | "noise" | "none";
