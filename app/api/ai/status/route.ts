import { NextResponse } from "next/server";
import { isAiConfigured } from "@/lib/ai/provider";
import { isPlantIdConfigured } from "@/lib/plant-id/client";

export const runtime = "nodejs";

/**
 * Cheap availability check (no body, no key exposure) so the client can decide
 * whether to upload an image at all. Prevents the mobile "stuck spinner" where a
 * large photo is uploaded only for the server to reply "not configured".
 */
export function GET() {
  return NextResponse.json({
    photoReview: isAiConfigured(),
    ask: isAiConfigured(),
    plantId: isPlantIdConfigured(),
  });
}
