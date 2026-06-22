import { NextResponse } from "next/server";
import { searchKnowledge, isNoiseQuery } from "@/lib/ask";

// ─────────────────────────────────────────────────────────────────────────────
//  OPTIONAL AI summarization for the Ask page.
//
//  This route is purely additive. The Ask page works fully without it using
//  local source-based retrieval. If (and only if) an OPENAI_API_KEY is present
//  in the server environment, this route will ask the model to summarize the
//  RETRIEVED source snippets — it never answers without sources, never invents
//  section numbers, and never gives an official/legal determination.
//
//  Safety guarantees:
//   • No source retrieved  → no AI answer (returns retrievedSources: []).
//   • The key is read server-side only and is never returned to the client.
//   • Noise → placeholder only.
// ─────────────────────────────────────────────────────────────────────────────

const SYSTEM_PROMPT = `You are a cautious reference assistant for "BylawGuide", an INDEPENDENT, non-official Toronto bylaw reference tool. You are NOT the City of Toronto.
Rules:
- Answer ONLY using the provided source snippets. If the snippets do not contain the answer, say you could not find a clear source-based answer.
- Never invent section numbers, percentages, or requirements that are not in the snippets.
- Never give legal advice or an official determination of compliance/violation.
- Be concise (2-4 sentences), simple, and cautious ("generally", "may", "verify with official City sources").
- Always remind the reader to verify with official City of Toronto sources.`;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const query: string = typeof body?.query === "string" ? body.query.trim() : "";
    if (!query) {
      return NextResponse.json({ error: "Missing query" }, { status: 400 });
    }

    // Noise → placeholder only.
    if (isNoiseQuery(query)) {
      return NextResponse.json({
        aiEnabled: Boolean(process.env.OPENAI_API_KEY),
        summary: null,
        noise: true,
        retrievedSources: [],
      });
    }

    // Local, source-based retrieval first.
    const ranked = searchKnowledge(query, 3);
    const retrievedSources = ranked.map((r) => ({
      id: r.item.id,
      title: r.item.title,
      internalUrl: r.item.internalUrl,
      officialSources: r.item.officialSources,
    }));

    // No source retrieved → never generate an answer.
    if (ranked.length === 0) {
      return NextResponse.json({ aiEnabled: Boolean(process.env.OPENAI_API_KEY), summary: null, retrievedSources: [] });
    }

    const apiKey = process.env.OPENAI_API_KEY;
    // No key → page should fall back to local source-based search.
    if (!apiKey) {
      return NextResponse.json({ aiEnabled: false, summary: null, retrievedSources });
    }

    // Build a source-only context from the retrieved snippets.
    const context = ranked
      .map((r, i) =>
        `Source ${i + 1}: ${r.item.title}\n${r.item.sourceText}\nReference answer: ${r.item.plainLanguageAnswer}\nChapter: ${r.item.relatedChapter ?? "—"}; Sections: ${r.item.relatedSections.join(", ") || "—"}`
      )
      .join("\n\n");

    try {
      const resp = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: process.env.OPENAI_MODEL || "gpt-4o-mini",
          temperature: 0.2,
          max_tokens: 300,
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            { role: "user", content: `Question: ${query}\n\nSource snippets:\n${context}\n\nUsing only these snippets, give a concise source-based reference answer.` },
          ],
        }),
      });

      if (!resp.ok) {
        // On any API failure, degrade gracefully to local retrieval.
        return NextResponse.json({ aiEnabled: true, summary: null, retrievedSources });
      }
      const data = await resp.json();
      const summary: string | null = data?.choices?.[0]?.message?.content?.trim() || null;
      return NextResponse.json({ aiEnabled: true, summary, retrievedSources });
    } catch {
      return NextResponse.json({ aiEnabled: true, summary: null, retrievedSources });
    }
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
