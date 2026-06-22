import { NextResponse } from "next/server";
import { isAiConfigured, chatJSON } from "@/lib/ai/provider";
import { PLANT_IDENTIFY_SYSTEM } from "@/lib/ai/prompts";
import { rateLimit, clientKey, validateImage } from "@/lib/ai/guard";
import { prohibitedPlants, PROHIBITED_PLANTS_OFFICIAL_URL } from "@/lib/prohibited-plants";
import type { PlantIdentifyAI, PlantMatchAI, Confidence } from "@/lib/ai/types";

export const runtime = "nodejs";

const FALLBACK_MSG = "AI analysis is currently unavailable. You can still browse the prohibited plant cards and official links.";

// Resolve the correct internal plant page + official source from our own data,
// so the model can't fabricate links.
function resolvePlant(name: string): { slug: string; official: { title: string; url: string }[] } | null {
  const n = name.toLowerCase();
  const p = prohibitedPlants.find(
    (pl) => n.includes(pl.commonName.toLowerCase()) || pl.commonName.toLowerCase().includes(n) ||
      n.includes(pl.scientificName.toLowerCase())
  );
  if (!p) return null;
  return {
    slug: p.slug,
    official: [{ title: "Toronto — Prohibited Plants (Chapter 489)", url: PROHIBITED_PLANTS_OFFICIAL_URL }],
  };
}

function asStringArray(v: unknown): string[] {
  return Array.isArray(v) ? v.filter((x) => typeof x === "string").slice(0, 10) : [];
}
function asConfidence(v: unknown): Confidence {
  return v === "high" || v === "medium" ? v : "low";
}

function normalizeMatch(raw: Partial<PlantMatchAI>): PlantMatchAI {
  const resolved = typeof raw.plantName === "string" ? resolvePlant(raw.plantName) : null;
  return {
    plantName: typeof raw.plantName === "string" ? raw.plantName : "Unknown",
    scientificName: typeof raw.scientificName === "string" ? raw.scientificName : "",
    confidence: asConfidence(raw.confidence),
    visibleFeatures: asStringArray(raw.visibleFeatures),
    missingOrUnclearFeatures: asStringArray(raw.missingOrUnclearFeatures),
    possibleLookAlikes: asStringArray(raw.possibleLookAlikes),
    growthStage: typeof raw.growthStage === "string" ? raw.growthStage : "",
    safetyCautions: asStringArray(raw.safetyCautions),
    removalGuidanceSummary: typeof raw.removalGuidanceSummary === "string" ? raw.removalGuidanceSummary : "",
    // Always use OUR resolved internal URL / official sources, never the model's invented ones.
    internalPlantUrl: resolved ? `/prohibited-plants/${resolved.slug}` : "/prohibited-plants",
    officialSources: resolved ? resolved.official : [{ title: "Toronto — Prohibited Plants (Chapter 489)", url: PROHIBITED_PLANTS_OFFICIAL_URL }],
  };
}

export async function POST(req: Request) {
  if (!isAiConfigured()) {
    return NextResponse.json({ aiEnabled: false, message: FALLBACK_MSG }, { status: 200 });
  }
  if (!rateLimit(`plant:${clientKey(req)}`)) {
    return NextResponse.json({ aiEnabled: true, error: "Too many requests. Please wait a moment and try again." }, { status: 429 });
  }

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json({ aiEnabled: true, error: "Invalid request." }, { status: 400 });
  }

  const season = String(form.get("season") ?? "").slice(0, 40);
  const location = String(form.get("location") ?? "").slice(0, 60);
  const v = await validateImage(form.get("image"));
  if (!v.ok) return NextResponse.json({ aiEnabled: true, error: v.error }, { status: 400 });

  const userMsg = [
    season ? `Season/month context: ${season}.` : "",
    location ? `Location context: ${location}.` : "",
    "Identify whether this is one of the 10 prohibited plants. Respond with the required JSON only.",
  ].filter(Boolean).join("\n");

  try {
    const raw = await chatJSON<Partial<PlantIdentifyAI>>({
      system: PLANT_IDENTIFY_SYSTEM,
      user: userMsg,
      images: [{ url: v.image.dataUrl }],
      vision: true,
      maxTokens: 900,
    });
    const matches = Array.isArray(raw.likelyMatches) ? raw.likelyMatches.map(normalizeMatch).slice(0, 4) : [];
    const result: PlantIdentifyAI = {
      likelyMatches: matches,
      noClearMatch: raw.noClearMatch === true || matches.length === 0,
      generalNotes: typeof raw.generalNotes === "string" ? raw.generalNotes : "",
      disclaimer: typeof raw.disclaimer === "string" ? raw.disclaimer : "",
    };
    return NextResponse.json({ aiEnabled: true, result });
  } catch {
    return NextResponse.json({ aiEnabled: true, error: FALLBACK_MSG }, { status: 502 });
  }
}
