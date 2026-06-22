// ─────────────────────────────────────────────────────────────────────────────
//  Toronto Bylaw Guide — AI types (V6)
//  Shared types for the server-side AI provider abstraction and API routes.
// ─────────────────────────────────────────────────────────────────────────────

export type Confidence = "low" | "medium" | "high";

/** Structured result from the photo-review vision prompt. */
export interface PhotoReviewAI {
  visibleObservations: string[];
  possibleIssueCategories: string[];
  confidence: Confidence;
  relatedChapters: string[];
  relatedSections: string[];
  plainLanguageExplanation: string;
  evidenceChecklist: string[];
  recommendedNextSteps: string[];
  sourceSearchTerms: string[];
  disclaimer: string;
  /** Set when the model is told to defer to the Noise placeholder. */
  noise?: boolean;
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
