import { NextResponse } from "next/server";
import { isAiConfigured, chatJSON } from "@/lib/ai/provider";
import { PHOTO_REVIEW_SYSTEM } from "@/lib/ai/prompts";
import { rateLimit, clientKey, validateImage } from "@/lib/ai/guard";
import { retrieveBylawMatches } from "@/lib/photo-review/bylaw-section-retriever";
import type { PhotoReviewAI, Confidence, LocationContext, ImageQuality } from "@/lib/ai/types";

export const runtime = "nodejs";

const FALLBACK_MSG = "AI analysis is currently unavailable. You can still use the source-based guide and official links.";

function asStringArray(v: unknown): string[] {
  return Array.isArray(v) ? v.filter((x) => typeof x === "string").slice(0, 12) : [];
}
function asConfidence(v: unknown): Confidence {
  return v === "high" || v === "medium" ? v : "low";
}
function asStr(v: unknown, fallback = ""): string {
  return typeof v === "string" ? v : fallback;
}
function asLocation(v: unknown): LocationContext {
  const o = (v ?? {}) as Record<string, unknown>;
  return { likelyArea: asStr(o.likelyArea, "unknown"), confidence: asConfidence(o.confidence), notes: asStr(o.notes) };
}
function asImageQuality(v: unknown): ImageQuality {
  const o = (v ?? {}) as Record<string, unknown>;
  const lighting = o.lighting === "good" || o.lighting === "poor" ? o.lighting : "acceptable";
  const viewAngle = o.viewAngle === "clear" || o.viewAngle === "limited" ? o.viewAngle : "acceptable";
  return { clarity: asConfidence(o.clarity), lighting, viewAngle, limitations: asStringArray(o.limitations) };
}

/** Validate + normalize the model's JSON so the retriever + UI always render safely. */
function normalize(raw: Partial<PhotoReviewAI>): PhotoReviewAI {
  return {
    visibleObservations: asStringArray(raw.visibleObservations),
    detectedObjects: asStringArray(raw.detectedObjects),
    possibleIssueLabels: asStringArray(raw.possibleIssueLabels),
    possibleIssueCategories: asStringArray(raw.possibleIssueCategories),
    searchKeywords: asStringArray(raw.searchKeywords),
    visualEvidence: asStringArray(raw.visualEvidence),
    negativeFindings: asStringArray(raw.negativeFindings),
    locationContext: asLocation(raw.locationContext),
    imageQuality: asImageQuality(raw.imageQuality),
    confidence: asConfidence(raw.confidence),
    plainLanguageExplanation: asStr(raw.plainLanguageExplanation),
    imageQualityNotes: asStr(raw.imageQualityNotes),
    needsMoreEvidence: asStringArray(raw.needsMoreEvidence),
    doNotDetermineViolation: true,
    disclaimer: asStr(raw.disclaimer),
    noise: raw.noise === true,
  };
}

export async function POST(req: Request) {
  // Graceful fallback when AI is not configured — the client runs the retriever
  // locally over the description + selected issue instead.
  if (!isAiConfigured()) {
    return NextResponse.json({ aiEnabled: false, message: FALLBACK_MSG }, { status: 200 });
  }

  if (!rateLimit(`photo:${clientKey(req)}`)) {
    return NextResponse.json({ aiEnabled: true, error: "Too many requests. Please wait a moment and try again." }, { status: 429 });
  }

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json({ aiEnabled: true, error: "Invalid request." }, { status: 400 });
  }

  // The selected issue type is an OPTIONAL hint only — analysis works without it.
  const issueType = String(form.get("issueType") ?? "");
  const location = String(form.get("location") ?? "").slice(0, 60);
  const description = String(form.get("description") ?? "").slice(0, 600);

  // Noise → Coming Soon only; never generate detailed noise guidance.
  if (issueType === "noise") {
    return NextResponse.json({ aiEnabled: true, noise: true });
  }

  const v = await validateImage(form.get("image"));
  if (!v.ok) return NextResponse.json({ aiEnabled: true, error: v.error }, { status: 400 });

  const userMsg = [
    issueType ? `Optional hint — the user selected issue type: "${issueType}". Use only if it matches what you see.` : "The user did not select an issue type.",
    location ? `Optional hint — the user says this is located at: "${location}". Use it for locationContext if consistent with the image.` : "",
    description ? `User description: "${description}".` : "",
    "Analyse carefully, record negative findings, tag issue labels from the controlled vocabulary, and produce searchKeywords. Respond with the required JSON only.",
  ].filter(Boolean).join("\n");

  try {
    const raw = await chatJSON<Partial<PhotoReviewAI>>({
      system: PHOTO_REVIEW_SYSTEM,
      user: userMsg,
      images: [{ url: v.image.dataUrl }],
      vision: true,
      maxTokens: 900,
    });
    const analysis = normalize(raw);
    if (analysis.noise) return NextResponse.json({ aiEnabled: true, noise: true });

    // Source-backed retrieval — the AI never decides chapter/section refs; the
    // section index (PDF/Markdown-derived) supplies them.
    const retrieved = retrieveBylawMatches({
      visibleObservations: analysis.visibleObservations,
      detectedObjects: analysis.detectedObjects,
      possibleIssueLabels: analysis.possibleIssueLabels,
      searchKeywords: analysis.searchKeywords,
      visualEvidence: analysis.visualEvidence,
      negativeFindings: analysis.negativeFindings,
      locationContext: analysis.locationContext,
      userDescription: description,
      selectedIssueId: issueType || undefined,
      imageConfidence: analysis.confidence,
    });
    if (retrieved.noise) return NextResponse.json({ aiEnabled: true, noise: true });

    return NextResponse.json({
      aiEnabled: true,
      result: {
        analysis,
        matches: retrieved.matches,
        noStrongMatch: retrieved.noStrongMatch,
        // Debug trace only outside production.
        debug: process.env.NODE_ENV === "development" ? retrieved.debug : undefined,
      },
    });
  } catch {
    return NextResponse.json({ aiEnabled: true, error: FALLBACK_MSG }, { status: 502 });
  }
}
