import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
// pdf-parse v1 is a CommonJS module; use require to avoid ESM/CJS interop issues in Next.js
// eslint-disable-next-line @typescript-eslint/no-require-imports
const pdfParse = require("pdf-parse") as (buf: Buffer) => Promise<{ text: string }>;

const PDF_SOURCES = [
  { file: "ch629.pdf", chapterNumber: "629", chapterTitle: "Property Standards" },
  { file: "ch447.pdf", chapterNumber: "447", chapterTitle: "Fences" },
  { file: "ch485.pdf", chapterNumber: "485", chapterTitle: "Graffiti" },
  { file: "ch489.pdf", chapterNumber: "489", chapterTitle: "Grass and Weeds" },
  { file: "ch497.pdf", chapterNumber: "497", chapterTitle: "Heating" },
  { file: "ch548.pdf", chapterNumber: "548", chapterTitle: "Littering and Dumping of Refuse" },
  { file: "ch632.pdf", chapterNumber: "632", chapterTitle: "Vacant or Hazardous Buildings" },
  { file: "ch395.pdf", chapterNumber: "395", chapterTitle: "Clothing Drop Boxes" },
  { file: "ch480.pdf", chapterNumber: "480", chapterTitle: "Garage Sales" },
  { file: "ch841.pdf", chapterNumber: "841", chapterTitle: "Waste Collection – Commercial" },
  { file: "ch846.pdf", chapterNumber: "846", chapterTitle: "Waste Collection – Residential" },
  { file: "ch417.pdf", chapterNumber: "417", chapterTitle: "Dust" },
];

export interface BylawSection {
  chapterNumber: string;
  chapterTitle: string;
  sectionCode: string;
  sectionTitle: string;
  sectionText: string;
  pdfFile: string;
  score: number;
}

// Module-level cache: parsed once per server lifetime
let sectionCache: CachedSection[] | null = null;
let cacheLoading = false;

interface CachedSection {
  chapterNumber: string;
  chapterTitle: string;
  sectionCode: string;
  sectionTitle: string;
  pdfFile: string;
  _body: string;
}

function parseSectionsFromText(
  text: string,
  chapterNumber: string,
  chapterTitle: string,
  pdfFile: string
): CachedSection[] {
  const results: CachedSection[] = [];

  // Split on § markers — handles § 629-1. and § 629-1A. etc.
  // Also handle en-dash variants
  const parts = text.split(/(?=§\s*\d+[-–]\d+[A-Z]?\.)/);

  for (const part of parts) {
    const headerMatch = part.match(/§\s*(\d+[-–]\d+[A-Z]?)\.\s*([^\n]{3,120})/);
    if (!headerMatch) continue;

    const rawCode = headerMatch[1].replace("–", "-");
    const sectionCode = `§ ${rawCode}`;
    const sectionTitle = headerMatch[2].trim().replace(/\.$/, "");
    const body = part.slice(headerMatch[0].length).trim();

    if (sectionTitle.length < 4) continue;

    results.push({ chapterNumber, chapterTitle, sectionCode, sectionTitle, pdfFile, _body: body });
  }

  return results;
}

async function buildCache(): Promise<CachedSection[]> {
  const all: CachedSection[] = [];

  for (const { file, chapterNumber, chapterTitle } of PDF_SOURCES) {
    const pdfPath = path.join(process.cwd(), "public", "pdfs", file);
    if (!fs.existsSync(pdfPath)) continue;

    try {
      const buffer = fs.readFileSync(pdfPath);
      const { text } = await pdfParse(buffer);
      all.push(...parseSectionsFromText(text, chapterNumber, chapterTitle, file));
    } catch (err) {
      console.error(`[bylaw-search] Failed to parse ${file}:`, err);
    }
  }

  console.log(`[bylaw-search] Cache built: ${all.length} sections from ${PDF_SOURCES.length} PDFs`);
  return all;
}

async function getCache(): Promise<CachedSection[]> {
  if (sectionCache) return sectionCache;
  if (cacheLoading) {
    await new Promise<void>((res) => {
      const check = setInterval(() => {
        if (sectionCache) { clearInterval(check); res(); }
      }, 100);
    });
    return sectionCache!;
  }
  cacheLoading = true;
  sectionCache = await buildCache();
  cacheLoading = false;
  return sectionCache;
}

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

  const cache = await getCache();

  const terms = query
    .toLowerCase()
    .split(/\s+/)
    .filter((t) => t.length >= 2)
    // Remove common stop words
    .filter((t) => !["the", "and", "or", "of", "in", "a", "is", "to", "be", "for", "on", "at", "by"].includes(t));

  if (terms.length === 0) return NextResponse.json({ results: [], total: 0 });

  const scored: Array<BylawSection> = [];

  for (const section of cache) {
    const body = section._body ?? "";
    const searchText = `${section.sectionTitle} ${body}`.toLowerCase();

    let score = 0;
    for (const term of terms) {
      const matches = (searchText.match(new RegExp(term, "g")) ?? []).length;
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
