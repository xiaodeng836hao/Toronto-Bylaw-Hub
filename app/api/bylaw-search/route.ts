import { NextResponse } from "next/server";
import sectionsData from "@/lib/bylaw-sections.json";

// Section index is pre-built at dev time by scripts/build-bylaw-index.mjs
// (run `npm run build:bylaw-index` when the PDFs in /public/pdfs change).
// The runtime no longer loads `pdf-parse` or reads any PDF — it just searches
// this in-memory JSON, which keeps requests fast and memory low on shared hosting.

export interface BylawSection {
  chapterNumber: string;
  chapterTitle: string;
  sectionCode: string;
  sectionTitle: string;
  sectionText: string;
  pdfFile: string;
  score: number;
}

interface IndexedSection {
  chapterNumber: string;
  chapterTitle: string;
  sectionCode: string;
  sectionTitle: string;
  pdfFile: string;
  body: string;
}

const sections = sectionsData as IndexedSection[];

function escapeRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// Return the FULL section text with all search terms highlighted via **markers**.
function highlightSection(body: string, terms: string[]): string {
  if (!body) return "";
  // Collapse PDF line-wrapping into clean, readable prose.
  const clean = body.replace(/\s+/g, " ").trim();
  if (terms.length === 0) return clean;
  // Match longer terms first so they win in the alternation.
  const pattern = terms
    .map(escapeRegExp)
    .sort((a, b) => b.length - a.length)
    .join("|");
  return clean.replace(new RegExp(`(${pattern})`, "gi"), "**$1**");
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("q")?.trim() ?? "";

  if (!query || query.length < 2) {
    return NextResponse.json({ results: [], total: 0 });
  }

  const terms = query
    .toLowerCase()
    .split(/\s+/)
    .filter((t) => t.length >= 2)
    // Remove common stop words
    .filter((t) => !["the", "and", "or", "of", "in", "a", "is", "to", "be", "for", "on", "at", "by"].includes(t));

  if (terms.length === 0) return NextResponse.json({ results: [], total: 0 });

  const scored: Array<BylawSection> = [];

  for (const section of sections) {
    const body = section.body ?? "";
    const searchText = `${section.sectionTitle} ${body}`.toLowerCase();

    let score = 0;
    for (const term of terms) {
      const matches = (searchText.match(new RegExp(escapeRegExp(term), "g")) ?? []).length;
      score += matches;
      if (section.sectionTitle.toLowerCase().includes(term)) score += 8;
      if (body.toLowerCase().includes(query.toLowerCase())) score += 5;
    }

    if (score > 0) {
      scored.push({
        chapterNumber: section.chapterNumber,
        chapterTitle: section.chapterTitle,
        sectionCode: section.sectionCode,
        sectionTitle: section.sectionTitle,
        pdfFile: section.pdfFile,
        sectionText: highlightSection(body, terms),
        score,
      });
    }
  }

  const results = scored
    .sort((a, b) => b.score - a.score)
    .slice(0, 12);

  return NextResponse.json({ results, total: scored.length, query });
}
