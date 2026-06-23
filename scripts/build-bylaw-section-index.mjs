// ─────────────────────────────────────────────────────────────────────────────
//  Build-time Markdown → JSON section indexer for Photo Review bylaw matching.
//
//  Parses the extracted Toronto Municipal Code Markdown in data/extracted-bylaws/
//  (one file per chapter) into a SECTION-AWARE index written to
//  data/rag/bylaw-section-index.json. Each entry preserves the chapter number,
//  the exact section number (e.g. "§ 447-1.2"), the section title, a cleaned
//  source excerpt, and derived keywords — so the Photo Review retriever can map
//  AI-detected image issues to real, source-backed sections (never invented).
//
//  Re-run whenever the Markdown in data/extracted-bylaws/ changes:
//    npm run build:bylaw-section-index
// ─────────────────────────────────────────────────────────────────────────────

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const SRC_DIR = path.join(ROOT, "data", "extracted-bylaws");
const OUT = path.join(ROOT, "data", "rag", "bylaw-section-index.json");
const REVIEWED = "2026-06-22";

// Nicer chapter titles + the BylawGuide internal page per chapter.
const CHAPTER_META = {
  "395": { title: "Clothing Drop Boxes", internal: "/tmc-chapters/395" },
  "447": { title: "Fences", internal: "/tmc-chapters/447" },
  "480": { title: "Garage Sales", internal: "/tmc-chapters/480" },
  "485": { title: "Graffiti", internal: "/tmc-chapters/485" },
  "489": { title: "Turfgrass and Prohibited Plants", internal: "/prohibited-plants" },
  "497": { title: "Heating", internal: "/tmc-chapters/497" },
  "548": { title: "Littering and Dumping of Refuse", internal: "/tmc-chapters/548" },
  "629": { title: "Property Standards", internal: "/tmc-chapters/629" },
  "632": { title: "Vacant or Hazardous Buildings", internal: "/tmc-chapters/632" },
  "659": { title: "Refrigerators and Other Appliances", internal: "/tmc-chapters/659" },
  "835": { title: "Vital Services", internal: "/tmc-chapters/835" },
  "841": { title: "Waste Collection (Commercial)", internal: "/tmc-chapters/841" },
  "846": { title: "Waste Collection (Residential)", internal: "/tmc-chapters/846" },
};

const OFFICIAL = (n) => `https://www.toronto.ca/legdocs/municode/1184_${n}.pdf`;

const STOPWORDS = new Set([
  "the", "and", "for", "any", "with", "that", "this", "shall", "not", "from", "are",
  "was", "which", "such", "have", "has", "had", "may", "all", "其", "under", "section",
  "subsection", "chapter", "article", "person", "city", "toronto", "municipal", "code",
  "where", "when", "than", "into", "upon", "been", "being", "other", "each", "their",
  "they", "them", "his", "her", "its", "out", "per", "who", "whom", "use", "used",
  "including", "include", "following", "described", "applicable", "respect", "means",
  "indicated", "definitions", "general", "references", "editor", "note", "law", "council",
  "amended", "adopted", "force", "came", "subject", "provided", "purpose", "purposes",
]);

/** Strip page banners, page numbers, and date/footer noise from a body line. */
function isNoiseLine(line) {
  const t = line.trim();
  if (!t) return true;
  if (/^TORONTO MUNICIPAL CODE$/i.test(t)) return true;
  if (/^CHAPTER\s+\d+[A-Z]?,/i.test(t)) return true;
  if (/^\d{2,4}-\d+$/.test(t)) return true; // page numbers e.g. 447-3
  if (/^(January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2},\s+\d{4}$/.test(t)) return true;
  if (/^\d{4}-\d{2}-\d{2}$/.test(t)) return true; // 2011-10-25
  return false;
}

/** Collapse a multi-line body into clean, readable, single-spaced text. */
function cleanBody(lines) {
  return lines
    .filter((l) => !isNoiseLine(l))
    .map((l) => l.trim())
    .join(" ")
    .replace(/\s{2,}/g, " ")
    .trim();
}

/** Derive simple frequency keywords from text (legal + plain words). */
function deriveKeywords(text, limit = 16) {
  const counts = new Map();
  for (const raw of text.toLowerCase().match(/[a-z][a-z-]{3,}/g) ?? []) {
    const w = raw.replace(/-+$/, "");
    if (w.length < 4 || STOPWORDS.has(w)) continue;
    counts.set(w, (counts.get(w) ?? 0) + 1);
  }
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([w]) => w);
}

// Section header at line start: § 485-1.  |  § 447-1.2.  |  § 489-2.1A.
const SECTION_RE = /^§\s*(\d+-\d+(?:\.\d+)?[A-Z]?)\.\s*(.+?)\.?\s*$/;
// Schedules (e.g. Schedule A   Prohibited Local Weeds).
const SCHEDULE_RE = /^(Schedule\s+[A-Z])\b\s*(.*)$/;

function parseChapter(text, chapterNumber, chapterTitle, sourceFile) {
  const lines = text.split(/\r?\n/);
  /** @type {{code:string,title:string,lines:string[]}[]} */
  const raw = [];
  let current = null;

  for (const line of lines) {
    const sec = line.match(SECTION_RE);
    const sch = line.match(SCHEDULE_RE);
    if (sec) {
      current = { code: `§ ${sec[1]}`, title: sec[2].trim(), lines: [] };
      raw.push(current);
    } else if (sch && sch[1]) {
      current = { code: sch[1], title: (sch[2] || "").trim() || sch[1], lines: [] };
      raw.push(current);
    } else if (current) {
      current.lines.push(line);
    }
  }

  // Keep the richest occurrence per section code (TOC entries have empty bodies).
  const best = new Map();
  for (const s of raw) {
    const body = cleanBody(s.lines);
    const prev = best.get(s.code);
    if (!prev || body.length > prev.body.length) {
      best.set(s.code, { code: s.code, title: s.title, body });
    }
  }

  const out = [];
  for (const { code, title, body } of best.values()) {
    if (!title || title.length < 3) continue;
    const sourceText = body.slice(0, 1600);
    const excerpt = body.slice(0, 300).trim();
    const keywords = deriveKeywords(`${title} ${title} ${body}`);
    out.push({
      id: `${chapterNumber}-${code.replace(/[^0-9A-Za-z]+/g, "_").replace(/^_+|_+$/g, "")}`,
      chapterNumber,
      chapterTitle,
      sectionNumber: code,
      sectionTitle: title,
      sourceText,
      excerpt,
      keywords,
      sourceFile,
      sourceType: "markdown",
      officialSourceUrl: OFFICIAL(chapterNumber),
      internalUrl: CHAPTER_META[chapterNumber]?.internal ?? `/tmc-chapters/${chapterNumber}`,
      lastReviewed: REVIEWED,
      hasBody: body.length > 40,
    });
  }
  return out;
}

function main() {
  if (!fs.existsSync(SRC_DIR)) {
    console.error(`[build-bylaw-section-index] Missing source dir: ${path.relative(ROOT, SRC_DIR)}`);
    process.exit(1);
  }
  const files = fs.readdirSync(SRC_DIR).filter((f) => f.toLowerCase().endsWith(".md"));
  const all = [];
  const coverage = [];

  for (const file of files) {
    const m = file.match(/1184[_-]\s*(\d{3,4})/) ?? file.match(/\b(\d{3})\b/);
    if (!m) { console.warn(`[build-bylaw-section-index] No chapter number in: ${file}`); continue; }
    const chapterNumber = m[1];
    const chapterTitle = CHAPTER_META[chapterNumber]?.title
      ?? (file.split(" - ")[1]?.replace(/\.md$/i, "").trim() || `Chapter ${chapterNumber}`);
    const text = fs.readFileSync(path.join(SRC_DIR, file), "utf8");
    const sections = parseChapter(text, chapterNumber, chapterTitle, file);
    all.push(...sections);
    const withBody = sections.filter((s) => s.hasBody).length;
    coverage.push({ chapterNumber, file, sections: sections.length, withBody });
    console.log(`[build-bylaw-section-index] ch${chapterNumber}: ${sections.length} sections (${withBody} with body)`);
  }

  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(all));
  console.log(`[build-bylaw-section-index] Wrote ${all.length} sections from ${files.length} chapters → ${path.relative(ROOT, OUT)}`);

  const weak = coverage.filter((c) => c.withBody === 0);
  if (weak.length) {
    console.warn(`[build-bylaw-section-index] Chapters needing review (no section bodies): ${weak.map((c) => c.chapterNumber).join(", ")}`);
  }
}

main();
