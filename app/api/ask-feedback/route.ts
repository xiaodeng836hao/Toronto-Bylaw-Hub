import { NextResponse } from "next/server";

const MAX = 1000;

/**
 * Lightweight feedback for Ask answers ("Was this answer helpful?").
 * Stored in the existing `Feedback` model when a database is configured — no
 * schema migration needed — otherwise logged. Best-effort and never blocking.
 *
 * Mapped fields: userType="ask", feedbackType="ask-helpful"|"ask-not-helpful",
 * feature=answerId, message="Q: <query>\n<comment>".
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { query, answerId, helpful, comment } = body ?? {};

    if (typeof helpful !== "boolean") {
      return NextResponse.json({ error: "Missing 'helpful' flag" }, { status: 400 });
    }

    const safeComment = typeof comment === "string" ? comment.trim().slice(0, MAX) : "";
    const record = {
      email: null as string | null,
      userType: "ask",
      feedbackType: helpful ? "ask-helpful" : "ask-not-helpful",
      feature: typeof answerId === "string" ? answerId.slice(0, 200) : null,
      message: `Q: ${typeof query === "string" ? query.slice(0, 400) : ""}${safeComment ? `\n${safeComment}` : ""}`.trim() || "(no message)",
      canContact: false,
    };

    if (process.env.DATABASE_URL) {
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { PrismaClient } = (await import("@prisma/client")) as any;
        const prisma = new PrismaClient();
        await prisma.feedback.create({ data: record });
        await prisma.$disconnect();
      } catch (dbError) {
        console.error("[Ask feedback DB error]", dbError);
        console.log("[Ask feedback - DB unavailable]", record);
      }
    } else {
      console.log("[Ask feedback - no DB configured]", record);
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
