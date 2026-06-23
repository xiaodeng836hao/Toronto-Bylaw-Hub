// ─────────────────────────────────────────────────────────────────────────────
//  Toronto Bylaw Guide — shared Ask client (V6.8)
//
//  Single fetch wrapper around the existing Ask API (POST /api/ai/ask) so the
//  full /ask page and the floating Ask widget use the SAME retrieval/answer
//  logic. Returns the structured, source-grounded response unchanged. Pure
//  client utility — no AI logic runs here; the server does the retrieval.
// ─────────────────────────────────────────────────────────────────────────────

import type { RagChunkRef, AskAnswerAI, SourceCoverage } from "@/lib/ai/types";

export interface AskApiResponse {
  mode: "ai-rag" | "local-fallback" | "noise" | "none";
  answer?: AskAnswerAI | null;
  sources?: RagChunkRef[];
  topic?: string | null;
  coverage?: SourceCoverage;
  retrievalMode?: string;
  aiEnabled?: boolean;
}

export interface AskOptions {
  /** Current route, used only as a light tiebreaker when a query is ambiguous. */
  currentPath?: string;
  pageTitle?: string;
  signal?: AbortSignal;
}

/** Ask a bylaw question via the existing Ask API. Never throws on a non-2xx — returns mode "none". */
export async function askBylawGuide(query: string, opts: AskOptions = {}): Promise<AskApiResponse> {
  const res = await fetch("/api/ai/ask", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, currentPath: opts.currentPath, pageTitle: opts.pageTitle }),
    signal: opts.signal,
  });
  try {
    return (await res.json()) as AskApiResponse;
  } catch {
    return { mode: "none", sources: [] };
  }
}
