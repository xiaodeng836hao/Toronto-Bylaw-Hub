import { NextResponse } from "next/server";
import { isAiConfigured } from "@/lib/ai/provider";
import { isPlantIdConfigured } from "@/lib/plant-id/client";
import { loadLocalIndex } from "@/lib/rag/embeddings";

export const runtime = "nodejs";

/**
 * Cheap availability check (no body, no key exposure) so the client can decide
 * whether to upload an image at all. Also reports whether the RAG embedding
 * index is built/live, for production verification.
 */
export async function GET() {
  const index = await loadLocalIndex();
  return NextResponse.json({
    photoReview: isAiConfigured(),
    ask: isAiConfigured(),
    plantId: isPlantIdConfigured(),
    ragIndex: Boolean(index),
    ragChunks: index?.chunks.length ?? 0,
  });
}
