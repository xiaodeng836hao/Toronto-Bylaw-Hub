// ─────────────────────────────────────────────────────────────────────────────
//  Toronto Bylaw Guide — RAG answer generation (V6) — SERVER ONLY
//  Generates a grounded answer ONLY from retrieved chunks, and only when AI is
//  configured. Returns null otherwise so the caller uses the local fallback.
// ─────────────────────────────────────────────────────────────────────────────

import { isAiConfigured, chatJSON } from "@/lib/ai/provider";
import { ASK_RAG_SYSTEM } from "@/lib/ai/prompts";
import type { RagChunkRef, AskAnswerAI, Confidence } from "@/lib/ai/types";

function asConfidence(v: unknown): Confidence {
  return v === "high" || v === "medium" ? v : "low";
}

/**
 * Generate a source-grounded answer from retrieved chunks. Returns null when AI
 * is unavailable, no chunks were retrieved, or generation fails.
 */
export async function generateAnswer(query: string, chunks: RagChunkRef[]): Promise<AskAnswerAI | null> {
  if (!isAiConfigured() || chunks.length === 0) return null;

  const context = chunks
    .map((c, i) => `Source ${i + 1}: ${c.sourceTitle}${c.section ? ` (${c.section})` : ""}\n${c.text}`)
    .join("\n\n");

  try {
    const raw = await chatJSON<Partial<AskAnswerAI>>({
      system: ASK_RAG_SYSTEM,
      user: `Question: ${query}\n\nSource snippets:\n${context}\n\nAnswer using ONLY these snippets. Respond with the required JSON only.`,
      maxTokens: 500,
    });
    return {
      shortAnswer: typeof raw.shortAnswer === "string" ? raw.shortAnswer : "",
      explanation: typeof raw.explanation === "string" ? raw.explanation : "",
      relatedTopic: typeof raw.relatedTopic === "string" ? raw.relatedTopic : null,
      nextSteps: Array.isArray(raw.nextSteps) ? raw.nextSteps.filter((s) => typeof s === "string").slice(0, 6) : [],
      confidence: asConfidence(raw.confidence),
      disclaimer: typeof raw.disclaimer === "string" ? raw.disclaimer : "",
    };
  } catch {
    return null;
  }
}
