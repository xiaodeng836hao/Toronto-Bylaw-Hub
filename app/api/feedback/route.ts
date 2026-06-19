import { NextResponse } from "next/server";

const MAX_MESSAGE = 1000;

// Expected Prisma `Feedback` model fields (when a database is configured):
//   email String?  userType String  feedbackType String  feature String?  message String  canContact Boolean  createdAt DateTime @default(now())
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, userType, feedbackType, feature, message, canContact } = body ?? {};

    if (!userType || !feedbackType || !message?.trim()) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
    if (typeof message !== "string" || message.trim().length > MAX_MESSAGE) {
      return NextResponse.json({ error: `Message must be ${MAX_MESSAGE} characters or fewer` }, { status: 400 });
    }

    const record = {
      email: email || null,
      userType,
      feedbackType,
      feature: feature || null,
      message: message.trim(),
      canContact: Boolean(canContact) && !!email,
    };

    if (process.env.DATABASE_URL) {
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { PrismaClient } = await import("@prisma/client") as any;
        const prisma = new PrismaClient();
        await prisma.feedback.create({ data: record });
        await prisma.$disconnect();
      } catch (dbError) {
        console.error("[DB Error]", dbError);
        console.log("[Feedback received - DB unavailable]", record);
      }
    } else {
      console.log("[Feedback received - no DB configured]", record);
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
