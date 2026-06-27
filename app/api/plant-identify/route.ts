// ─────────────────────────────────────────────────────────────────────────────
//  Mobile-facing plant identification proxy  (Invasive Plant Check)
//
//  The Invasive Plant Check mobile app (Expo) POSTs a plant photo here instead of
//  calling Plant.id directly. The provider API key (PLANT_ID_API_KEY) is read
//  SERVER-SIDE only and is never sent to the mobile app — this is the whole point
//  of the proxy: a public mobile-app env var is not a safe place for a paid key.
//
//  Contract (kept deliberately simple for the mobile client):
//    POST  { imageBase64: string, filename?: string }
//    ->    { suggestions: [{ commonName, scientificName, probability }],
//            provider: "plant-id", imageQualityWarning?, error? }
//
//  Toronto prohibited-plant matching stays in the mobile app for this phase.
// ─────────────────────────────────────────────────────────────────────────────

import { NextResponse } from "next/server";
import { identifyPlant, isPlantIdConfigured } from "@/lib/plant-id/client";
import { rateLimit, clientKey } from "@/lib/ai/guard";

export const runtime = "nodejs";

type ProxySuggestion = {
  commonName: string;
  scientificName: string;
  probability: number;
};

type ProxyResponse = {
  suggestions: ProxySuggestion[];
  provider: "plant-id";
  imageQualityWarning?: string;
  error?: string;
};

// Reject very large payloads (~6 MB image as base64) before doing any work.
const MAX_BASE64_CHARS = 8_000_000;

// Permissive CORS so the Expo app (and the web preview during development) can
// call this endpoint. The route is rate-limited and never returns the key.
// For a hardened production setup, restrict the origin to your app's domains.
const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

function reply(body: ProxyResponse, status = 200) {
  return NextResponse.json(body, { status, headers: CORS });
}

export function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS });
}

export async function POST(req: Request) {
  // No server-side key configured.
  if (!isPlantIdConfigured()) {
    return reply({
      suggestions: [],
      provider: "plant-id",
      error: "Plant identification service is not configured.",
    });
  }

  // Basic per-client rate limiting.
  if (!rateLimit(`plant-identify:${clientKey(req)}`)) {
    return reply(
      {
        suggestions: [],
        provider: "plant-id",
        error: "Too many requests. Please wait a moment and try again.",
      },
      429
    );
  }

  // Parse the JSON body.
  let body: { imageBase64?: unknown; filename?: unknown };
  try {
    body = await req.json();
  } catch {
    return reply(
      { suggestions: [], provider: "plant-id", error: "Invalid request body." },
      400
    );
  }

  const imageBase64 = typeof body.imageBase64 === "string" ? body.imageBase64 : "";
  if (!imageBase64) {
    return reply(
      { suggestions: [], provider: "plant-id", error: "No image was provided." },
      400
    );
  }
  if (imageBase64.length > MAX_BASE64_CHARS) {
    return reply(
      {
        suggestions: [],
        provider: "plant-id",
        error: "Image is too large. Please use a smaller photo.",
      },
      413
    );
  }

  // Strip an optional data: URL prefix. We never log the image data or the key.
  const pureBase64 = imageBase64.includes(",")
    ? imageBase64.split(",")[1]
    : imageBase64;

  try {
    const result = await identifyPlant([pureBase64]);

    if (!result.ok) {
      // Map any provider failure to a single friendly message (no details leaked).
      return reply(
        {
          suggestions: [],
          provider: "plant-id",
          error: "Plant identification is currently unavailable.",
        },
        503
      );
    }

    const suggestions: ProxySuggestion[] = result.suggestions.map((s) => ({
      scientificName: s.scientificName,
      commonName: s.commonNames[0] ?? s.scientificName,
      probability: s.probability,
    }));

    const imageQualityWarning =
      result.isPlant === false
        ? "The photo may not clearly show a plant. Try a closer, well-lit image."
        : undefined;

    return reply({ suggestions, provider: "plant-id", imageQualityWarning });
  } catch {
    return reply(
      {
        suggestions: [],
        provider: "plant-id",
        error: "The identification service returned an unexpected response.",
      },
      502
    );
  }
}
