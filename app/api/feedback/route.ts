import { NextResponse } from "next/server";
import { rateLimit, clientKey } from "@/lib/ai/guard";
import { sendFeedbackEmail, isEmailConfigured } from "@/lib/email/send-feedback-email";

export const runtime = "nodejs";

const MAX_MESSAGE = 3000;
const MAX_NAME = 100;
const MAX_SUBJECT = 150;
const MAX_EMAIL = 254;

function str(v: unknown, max: number): string {
  return typeof v === "string" ? v.slice(0, max) : "";
}
function isValidEmail(v: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}

// Expected Prisma `Feedback` model fields (when a database is configured):
//   email String?  userType String  feedbackType String  feature String?  message String  canContact Boolean  createdAt DateTime @default(now())
export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);
    if (!body || typeof body !== "object") {
      return NextResponse.json({ error: "Invalid request." }, { status: 400 });
    }

    // Honeypot: a real user never fills `website`. Pretend success and send nothing.
    if (typeof body.website === "string" && body.website.trim()) {
      return NextResponse.json({ success: true });
    }

    // Rate limit (per-IP, in-memory). 5 submissions / minute is plenty.
    if (!rateLimit(`feedback:${clientKey(req)}`, 5)) {
      return NextResponse.json({ error: "Too many submissions. Please wait a moment and try again." }, { status: 429 });
    }

    // Accept both the existing field names and the V6.6 additions.
    const email = str(body.email, MAX_EMAIL).trim();
    const name = str(body.name, MAX_NAME).trim();
    const subject = str(body.subject ?? body.feature, MAX_SUBJECT).trim();
    const category = str(body.category ?? body.feedbackType, 80).trim();
    const userType = str(body.userType, 80).trim();
    const feature = str(body.feature, 120).trim();
    const pageUrl = str(body.pageUrl, 500).trim();
    const message = str(body.message, MAX_MESSAGE + 1);

    // Validation — only `message` is strictly required.
    if (!message.trim()) {
      return NextResponse.json({ error: "A message is required." }, { status: 400 });
    }
    if (message.length > MAX_MESSAGE) {
      return NextResponse.json({ error: `Message must be ${MAX_MESSAGE} characters or fewer.` }, { status: 400 });
    }
    if (email && !isValidEmail(email)) {
      return NextResponse.json({ error: "Please enter a valid email address, or leave it blank." }, { status: 400 });
    }
    // Keep backward-compat: the existing form requires userType + feedbackType.
    if (!userType || !category) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }

    const record = {
      email: email || null,
      userType,
      feedbackType: category,
      feature: feature || null,
      message: message.trim(),
      canContact: Boolean(body.canContact) && !!email,
    };

    // 1) Save to the database when one is configured (existing behaviour).
    if (process.env.DATABASE_URL) {
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { PrismaClient } = await import("@prisma/client") as any;
        const prisma = new PrismaClient();
        await prisma.feedback.create({ data: record });
        await prisma.$disconnect();
      } catch (dbError) {
        console.error("[Feedback DB Error]", dbError);
        console.log("[Feedback received - DB unavailable]", record);
      }
    } else {
      console.log("[Feedback received - no DB configured]", record);
    }

    // 2) Send the email notification (server-side, graceful on failure).
    let emailSent = false;
    if (isEmailConfigured()) {
      const result = await sendFeedbackEmail({
        name,
        email,
        subject,
        category,
        userType,
        message: message.trim(),
        pageUrl,
        userAgent: req.headers.get("user-agent") ?? undefined,
        submittedAt: new Date().toISOString(),
      });
      emailSent = result.ok;
      if (!result.ok) {
        // Log server-side only — never expose raw transport errors to the client.
        console.error("[Feedback email]", result.reason, result.error ?? "");
      }
    } else {
      console.warn("[Feedback email] No email provider configured — skipping notification.");
    }

    // 3) Respond. Submission is considered successful once received/stored, even
    //    if the email notification could not be delivered.
    return NextResponse.json({
      success: true,
      emailSent,
      message: emailSent
        ? "Thank you. Your feedback has been submitted."
        : "Your feedback was received, but the email notification could not be sent at this time.",
    });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
