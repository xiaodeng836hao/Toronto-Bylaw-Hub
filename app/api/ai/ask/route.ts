import { NextResponse } from "next/server";
import { isAiConfigured } from "@/lib/ai/provider";
import { isNoiseQuery } from "@/lib/ask";
import { retrieve } from "@/lib/rag/retrieve";
import { retrieveAskSections } from "@/lib/ask/section-retrieve";
import { generateAnswer } from "@/lib/rag/answer";
import { rateLimit, clientKey } from "@/lib/ai/guard";

export const runtime = "nodejs";

/** Map the page the user is on to a light topic hint (V6.8 page context). */
function pageTopicHint(path: string): string {
  if (!path) return "";
  if (path.startsWith("/landscaping")) return "landscaping soft landscaping";
  if (path.startsWith("/pool-fence")) return "pool fence";
  if (path.startsWith("/zoning/parking")) return "parking front yard side yard rear yard commercial recreational vehicle";
  if (path.startsWith("/zoning")) return "zoning";
  if (path.startsWith("/prohibited-plants")) return "prohibited plants weeds";
  if (/\/tmc-chapters\/447\b/.test(path)) return "fence";
  if (/\/tmc-chapters\/629\b/.test(path)) return "property standards";
  if (/\/tmc-chapters\/485\b/.test(path)) return "graffiti";
  if (/\/tmc-chapters\/489\b/.test(path)) return "turfgrass prohibited plants";
  if (/\/tmc-chapters\/548\b/.test(path)) return "littering dumping waste";
  return "";
}

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
  const currentPath = typeof (body as { currentPath?: unknown })?.currentPath === "string" ? (body as { currentPath: string }).currentPath : "";
  if (!query) return NextResponse.json({ mode: "none", sources: [] });

  if (isNoiseQuery(query)) {
    return NextResponse.json({ mode: "noise", aiEnabled: isAiConfigured(), sources: [] });
  }

  if (!rateLimit(`ask:${clientKey(req)}`, 20)) {
    return NextResponse.json({ error: "Too many requests. Please wait a moment and try again." }, { status: 429 });
  }

  // V6.7: classify the question and retrieve precise SECTION-level chunks from
  // the clean Markdown-derived index first (chapter + section, source-backed).
  // V6.8: page context (currentPath) is used ONLY as a tiebreaker when the
  // direct query finds nothing — it never overrides an on-topic question.
  let section = retrieveAskSections(query, 6);
  if (section.chunks.length === 0) {
    const hint = pageTopicHint(currentPath);
    if (hint) section = retrieveAskSections(`${query} ${hint}`, 6);
  }
  let chunks = section.chunks;
  let retrievalMode: string = chunks.length ? "section-index" : "";
  let topic = section.classification.topicLabel;
  let coverage = section.coverage;

  // Fall back to the existing embedding / curated keyword retrieval when the
  // section index has no clear match (e.g. zoning, landscaping — not yet in the
  // Markdown corpus), so Ask still answers from the knowledge index.
  if (chunks.length === 0) {
    const fallback = await retrieve(query, 6);
    chunks = fallback.chunks;
    retrievalMode = fallback.mode;
    coverage = chunks.length ? "chapter-only" : "needs-verification";
    if (!topic && chunks[0]?.sourceTitle) topic = chunks[0].sourceTitle;
  }

  if (chunks.length === 0) {
    return NextResponse.json({ mode: "none", aiEnabled: isAiConfigured(), retrievalMode, topic, sources: [] });
  }

  const answer = await generateAnswer(query, chunks);
  return NextResponse.json({
    mode: answer ? "ai-rag" : "local-fallback",
    aiEnabled: isAiConfigured(),
    retrievalMode,
    topic,
    coverage,
    matchedKeywords: section.matchedKeywords,
    answer,
    sources: chunks,
  });
}
