import { NextResponse } from "next/server";
import { identifyPlant, isPlantIdConfigured, type PlantIdError } from "@/lib/plant-id/client";
import { matchProhibited } from "@/lib/plant-id/prohibited-plant-matcher";
import { rateLimit, clientKey, validateImage } from "@/lib/ai/guard";
import type { PlantIdentificationResult, SourceLink } from "@/lib/plant-id/types";

export const runtime = "nodejs";

const OFFICIAL_SOURCES: SourceLink[] = [
  { title: "City of Toronto — Turfgrass & Prohibited Plants", url: "https://www.toronto.ca/city-government/public-notices-bylaws/bylaw-enforcement/turfgrass-prohibited-plants/" },
  { title: "Toronto Municipal Code — Chapter 489 (PDF)", url: "https://www.toronto.ca/legdocs/municode/1184_489.pdf" },
];
const DISCLAIMER =
  "Plant identification from a photo is a reference result only — not a legal or official determination. Confirm using multiple visual features (leaves, stems, flowers, berries, seed heads) and official City resources before any removal.";

const ERROR_MESSAGE: Record<PlantIdError, string> = {
  "not-configured": "Plant identification is temporarily unavailable. You can still browse the plant profiles and official links below.",
  "invalid-key": "Plant identification is temporarily unavailable.",
  "rate-limited": "Plant identification is busy right now. Please wait a moment and try again.",
  "unavailable": "Plant identification is temporarily unavailable. Please try again later.",
  "bad-response": "We couldn't read the identification result. Please try another image.",
};

export async function POST(req: Request) {
  if (!isPlantIdConfigured()) {
    return NextResponse.json({ configured: false, message: ERROR_MESSAGE["not-configured"] }, { status: 200 });
  }
  if (!rateLimit(`plantid:${clientKey(req)}`)) {
    return NextResponse.json({ configured: true, error: "Too many plant identification requests. Please wait a moment and try again." }, { status: 429 });
  }

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json({ configured: true, error: "Invalid request." }, { status: 400 });
  }

  const v = await validateImage(form.get("image"));
  if (!v.ok) return NextResponse.json({ configured: true, error: v.error }, { status: 400 });

  // Send pure base64 (strip the data: URL prefix). Image is not stored.
  const base64 = v.image.dataUrl.split(",")[1] ?? "";

  const idResult = await identifyPlant([base64]);
  if (!idResult.ok) {
    const status = idResult.error === "rate-limited" ? 429 : 503;
    return NextResponse.json({ configured: true, error: ERROR_MESSAGE[idResult.error] }, { status });
  }

  // Not a plant.
  if (idResult.isPlant === false) {
    const result: PlantIdentificationResult = {
      isPlant: false,
      topSuggestions: [],
      prohibitedMatches: [],
      noClearMatch: true,
      message: "The photo does not appear to clearly show a plant. Try a clearer photo showing leaves, stems, flowers, berries, or seed heads.",
      disclaimer: DISCLAIMER,
      officialSources: OFFICIAL_SOURCES,
    };
    return NextResponse.json({ configured: true, result });
  }

  const prohibitedMatches = matchProhibited(idResult.suggestions);
  const noClearMatch = prohibitedMatches.length === 0;
  const result: PlantIdentificationResult = {
    isPlant: idResult.isPlant,
    topSuggestions: idResult.suggestions,
    prohibitedMatches,
    noClearMatch,
    message: noClearMatch
      ? "No clear Toronto prohibited plant match was found. Try uploading a clearer photo showing leaves, stems, flowers, berries, or seed heads."
      : "Possible match to one of Toronto's prohibited plants — review the details and confirm before any action.",
    disclaimer: DISCLAIMER,
    officialSources: OFFICIAL_SOURCES,
  };
  return NextResponse.json({ configured: true, result });
}
