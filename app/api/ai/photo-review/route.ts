import { NextResponse } from "next/server";
import { isAiConfigured, chatJSON } from "@/lib/ai/provider";
import { PHOTO_REVIEW_SYSTEM } from "@/lib/ai/prompts";
import { rateLimit, clientKey, validateImage } from "@/lib/ai/guard";
import type { PhotoReviewAI, Confidence } from "@/lib/ai/types";

export const runtime = "nodejs";

const FALLBACK_MSG = "AI analysis is currently unavailable. You can still use the source-based guide and official links.";

function asStringArray(v: unknown): string[] {
  return Array.isArray(v) ? v.filter((x) => typeof x === "string").slice(0, 12) : [];
}
function asConfidence(v: unknown): Confidence {
  return v === "high" || v === "medium" ? v : v === "low" ? "low" : "low";
}

/** Validate + normalize the model's JSON so the UI always renders safely. */
function normalize(raw: Partial<PhotoReviewAI>): PhotoReviewAI {
  return {
    visibleObservations: asStringArray(raw.visibleObservations),
    possibleIssueCategories: asStringArray(raw.possibleIssueCategories),
    confidence: asConfidence(raw.confidence),
    relatedChapters: asStringArray(raw.relatedChapters),
    relatedSections: asStringArray(raw.relatedSections),
    plainLanguageExplanation: typeof raw.plainLanguageExplanation === "string" ? raw.plainLanguageExplanation : "",
    evidenceChecklist: asStringArray(raw.evidenceChecklist),
    recommendedNextSteps: asStringArray(raw.recommendedNextSteps),
    sourceSearchTerms: asStringArray(raw.sourceSearchTerms),
    disclaimer: typeof raw.disclaimer === "string" ? raw.disclaimer : "",
    noise: raw.noise === true,
  };
}

export async function POST(req: Request) {
  // Graceful fallback when AI is not configured — the client keeps its
  // existing source-based / rules-based result.
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

  const issueType = String(form.get("issueType") ?? "");
  const description = String(form.get("description") ?? "").slice(0, 600);

  // Noise → Coming Soon only; never generate detailed noise guidance.
  if (issueType === "noise") {
    return NextResponse.json({ aiEnabled: true, noise: true });
  }

  const v = await validateImage(form.get("image"));
  if (!v.ok) return NextResponse.json({ aiEnabled: true, error: v.error }, { status: 400 });

  const userMsg = [
    issueType ? `The user selected issue type: "${issueType}".` : "The user did not select an issue type.",
    description ? `User description: "${description}".` : "",
    "Analyze the image and respond with the required JSON only.",
  ].filter(Boolean).join("\n");

  try {
    const raw = await chatJSON<Partial<PhotoReviewAI>>({
      system: PHOTO_REVIEW_SYSTEM,
      user: userMsg,
      images: [{ url: v.image.dataUrl }],
      vision: true,
      maxTokens: 800,
    });
    const result = normalize(raw);
    if (result.noise) return NextResponse.json({ aiEnabled: true, noise: true });
    return NextResponse.json({ aiEnabled: true, result });
  } catch {
    return NextResponse.json({ aiEnabled: true, error: FALLBACK_MSG }, { status: 502 });
  }
}
