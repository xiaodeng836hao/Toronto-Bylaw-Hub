// ─────────────────────────────────────────────────────────────────────────────
//  Toronto Bylaw Guide — Ask / retrieval engine (V5)
//
//  Local, source-based retrieval over the central knowledge index. No AI is
//  required: queries are matched by exact topic/title, keywords, synonyms,
//  related questions, and summary text, with weighted scoring. The Ask page and
//  the site-wide search both build on this so answers stay grounded in curated,
//  source-backed content.
// ─────────────────────────────────────────────────────────────────────────────

import {
  knowledgeItems,
  synonymGroups,
  type KnowledgeItem,
} from "@/data/knowledge-index";

const STOPWORDS = new Set([
  "a", "an", "the", "is", "are", "do", "does", "i", "my", "me", "can", "could",
  "what", "how", "when", "where", "who", "to", "of", "in", "on", "for", "and",
  "or", "be", "it", "this", "that", "about", "should", "need", "with", "at",
  "from", "your", "you", "if", "any", "have", "has", "will", "would", "much",
  "high", "tall",
]);

export interface AskScored {
  item: KnowledgeItem;
  score: number;
}

export type AskConfidence = "high" | "medium" | "low";

export type AskStatus = "answer" | "low-confidence" | "none" | "noise";

export interface AskResult {
  query: string;
  status: AskStatus;
  /** Primary answer (when status is answer / low-confidence / noise). */
  answer: KnowledgeItem | null;
  confidence: AskConfidence | null;
  /** Other related knowledge items (excludes the primary answer). */
  related: KnowledgeItem[];
}

/** Normalize and split into meaningful tokens (stopwords removed). */
function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, " ")
    .split(/\s+/)
    .map((t) => t.trim())
    .filter((t) => t.length > 1 && !STOPWORDS.has(t));
}

/** Expand a query string with synonym-group phrases that it references. */
function expandWithSynonyms(query: string): string {
  const q = query.toLowerCase();
  const extra: string[] = [];
  for (const group of synonymGroups) {
    if (group.some((phrase) => q.includes(phrase))) {
      extra.push(...group);
    }
  }
  return `${q} ${extra.join(" ")}`;
}

/** True if the query is clearly about Noise (handled as a placeholder). */
export function isNoiseQuery(query: string): boolean {
  return /\bnoise\b|\bnoisy\b|\bloud\b|\bbarking\b|amplified/.test(query.toLowerCase());
}

/**
 * Score a single knowledge item against an (expanded) query.
 * Weights prioritize: exact topic/title > keyword > synonym > related question
 * > summary/source text.
 */
function scoreItem(item: KnowledgeItem, rawQuery: string, tokens: string[], expanded: string): number {
  const q = rawQuery.toLowerCase();
  let score = 0;

  const title = item.title.toLowerCase();
  const topic = item.topic.toLowerCase();

  // Exact / near-exact title or topic match.
  if (title === q) score += 40;
  if (q.length > 2 && title.includes(q)) score += 14;
  if (q.length > 2 && topic && q.includes(topic)) score += 10;

  // Token-level matches against weighted fields.
  for (const token of tokens) {
    if (title.includes(token)) score += 6;
    if (topic.includes(token)) score += 4;
    if (item.keywords.some((k) => k.toLowerCase().includes(token))) score += 5;
    if (item.synonyms.some((s) => s.toLowerCase().includes(token))) score += 4;
    if (item.relatedQuestions.some((rq) => rq.toLowerCase().includes(token))) score += 3;
    if (item.summary.toLowerCase().includes(token)) score += 1;
    if (item.plainLanguageAnswer.toLowerCase().includes(token)) score += 1;
  }

  // Phrase-level keyword/synonym hits from the synonym-expanded query.
  for (const kw of item.keywords) {
    if (kw.length > 3 && expanded.includes(kw.toLowerCase())) score += 4;
  }
  for (const syn of item.synonyms) {
    if (syn.length > 3 && expanded.includes(syn.toLowerCase())) score += 3;
  }
  for (const rq of item.relatedQuestions) {
    if (rq.toLowerCase() === q) score += 30;
  }

  return score;
}

/** Rank all knowledge items for a query. Returns scored items (score > 0). */
export function searchKnowledge(query: string, limit = 8): AskScored[] {
  const raw = query.trim();
  if (!raw) return [];
  const tokens = tokenize(raw);
  const expanded = expandWithSynonyms(raw);

  return knowledgeItems
    .map((item) => ({ item, score: scoreItem(item, raw, tokens, expanded) }))
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

function confidenceFromScore(score: number): AskConfidence {
  if (score >= 18) return "high";
  if (score >= 9) return "medium";
  return "low";
}

/**
 * Produce a source-based answer for a simple question.
 * Never fabricates: if nothing scores, returns status "none". Noise is special-
 * cased to the Coming Soon placeholder only.
 */
export function answerQuestion(query: string): AskResult {
  const raw = query.trim();
  if (!raw) {
    return { query: raw, status: "none", answer: null, confidence: null, related: [] };
  }

  // Noise → placeholder only (no detailed guidance).
  if (isNoiseQuery(raw)) {
    const noise = knowledgeItems.find((i) => i.type === "Coming Soon") ?? null;
    return { query: raw, status: "noise", answer: noise, confidence: null, related: [] };
  }

  const ranked = searchKnowledge(raw, 6);
  if (ranked.length === 0) {
    return { query: raw, status: "none", answer: null, confidence: null, related: [] };
  }

  const top = ranked[0];
  const confidence = confidenceFromScore(top.score);
  // A weak top match → present as low-confidence ("may be related").
  const status: AskStatus = confidence === "low" ? "low-confidence" : "answer";

  // Related = next items, excluding the Noise placeholder unless asked.
  const related = ranked
    .slice(1)
    .map((r) => r.item)
    .filter((i) => i.type !== "Coming Soon")
    .slice(0, 3);

  return { query: raw, status, answer: top.item, confidence, related };
}

/** Lightweight helper for the site-wide search to reuse knowledge results. */
export function knowledgeSearchResults(query: string, limit = 6): KnowledgeItem[] {
  return searchKnowledge(query, limit).map((r) => r.item);
}
