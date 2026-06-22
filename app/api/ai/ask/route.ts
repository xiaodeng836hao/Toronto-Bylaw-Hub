import { NextResponse } from "next/server";
import { isAiConfigured } from "@/lib/ai/provider";
import { isNoiseQuery } from "@/lib/ask";
import { retrieve } from "@/lib/rag/retrieve";
import { generateAnswer } from "@/lib/rag/answer";
import { rateLimit, clientKey } from "@/lib/ai/guard";

export const runtime = "nodejs";

/**
 * RAG-grounded Ask endpoint. Retrieves source chunks (embeddings when available,
 * keyword fallback otherwise) and, when AI is configured, generates an answer
 * grounded ONLY in those chunks. Without AI it returns the retrieved sources so
 * the client can render its existing local (V5) answer.
 */
export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
  const query = typeof (body as { query?: unknown })?.query === "string" ? (body as { query: string }).query.trim() : "";
  if (!query) return NextResponse.json({ mode: "none", sources: [] });

  if (isNoiseQuery(query)) {
    return NextResponse.json({ mode: "noise", aiEnabled: isAiConfigured(), sources: [] });
  }

  if (!rateLimit(`ask:${clientKey(req)}`, 20)) {
    return NextResponse.json({ error: "Too many requests. Please wait a moment and try again." }, { status: 429 });
  }

  const { mode: retrievalMode, chunks } = await retrieve(query, 6);
  if (chunks.length === 0) {
    return NextResponse.json({ mode: "none", aiEnabled: isAiConfigured(), retrievalMode, sources: [] });
  }

  const answer = await generateAnswer(query, chunks);
  return NextResponse.json({
    mode: answer ? "ai-rag" : "local-fallback",
    aiEnabled: isAiConfigured(),
    retrievalMode,
    answer,
    sources: chunks,
  });
}
