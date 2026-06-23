// ─────────────────────────────────────────────────────────────────────────────
//  Toronto Bylaw Guide — Ask query classifier (V6.7)
//
//  Classifies a user question BEFORE retrieval so Ask can search the most
//  relevant source chapters first. Reuses the curated photo-review matcher
//  (whole-word keyword + label scoring, pool gating) for topic detection, the
//  category→source routing for chapter selection, and the resident-language
//  synonym map for query expansion. Isomorphic (no server-only imports).
// ─────────────────────────────────────────────────────────────────────────────

import { matchBylaws } from "@/lib/photo-review/bylaw-matcher";
import { sourceChaptersFor } from "@/data/photo-review/category-source-routing";
import { isNoiseQuery } from "@/lib/ask";
import { expandQuery } from "@/data/ask/synonyms";

export interface QueryClassification {
  /** Expanded query (resident synonyms appended). */
  expandedQuery: string;
  /** Curated category id (graffiti, property-standards, …) or null. */
  topicId: string | null;
  /** Human-readable category, e.g. "Property Standards". */
  topicLabel: string | null;
  /** Routed chapters to search first (primary then secondary). */
  chapters: { chapter: string; primary: boolean }[];
  isNoise: boolean;
  /** True when no topic was confidently identified (search broadly / clarify). */
  isVague: boolean;
}

/** Classify a question into a bylaw topic + the chapters to search first. */
export function classifyQuery(query: string): QueryClassification {
  const expandedQuery = expandQuery(query);

  if (isNoiseQuery(query)) {
    return { expandedQuery, topicId: null, topicLabel: null, chapters: [], isNoise: true, isVague: false };
  }

  // Reuse the curated matcher: it ranks categories from the (expanded) text with
  // whole-word keyword + label scoring and pool gating.
  const matched = matchBylaws({ userDescription: expandedQuery });
  const top = matched.matches[0];

  if (!top) {
    return { expandedQuery, topicId: null, topicLabel: null, chapters: [], isNoise: false, isVague: true };
  }

  return {
    expandedQuery,
    topicId: top.id,
    topicLabel: top.issueCategory,
    chapters: sourceChaptersFor(top.id),
    isNoise: false,
    isVague: top.confidence === "low",
  };
}
