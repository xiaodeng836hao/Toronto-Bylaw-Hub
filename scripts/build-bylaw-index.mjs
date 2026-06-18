// Build-time PDF → JSON indexer for the bylaw keyword search.
//
// Parses the official Toronto bylaw PDFs in /public/pdfs once, at build time,
// and writes a compact section index to lib/bylaw-sections.json. The runtime
// search API (app/api/bylaw-search/route.ts) then reads that JSON directly —
// it no longer loads `pdf-parse` or reads any PDF at request time. This keeps
// requests fast and memory low (important on shared hosting with a process cap).
//
// Re-run this whenever the PDFs in /public/pdfs change:
//   npm run build:bylaw-index

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
// pdf-parse v1 is CommonJS.
const pdfParse = require("pdf-parse");

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");

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

function parseSectionsFromText(text, chapterNumber, chapterTitle, pdfFile) {
  const results = [];

  // Split on § markers — handles § 629-1. and § 629-1A. etc. (incl. en-dash).
  const parts = text.split(/(?=§\s*\d+[-–]\d+[A-Z]?\.)/);

  for (const part of parts) {
    const headerMatch = part.match(/§\s*(\d+[-–]\d+[A-Z]?)\.\s*([^\n]{3,120})/);
    if (!headerMatch) continue;

    const rawCode = headerMatch[1].replace("–", "-");
    const sectionCode = `§ ${rawCode}`;
    const sectionTitle = headerMatch[2].trim().replace(/\.$/, "");
    const body = part.slice(headerMatch[0].length).trim();

    if (sectionTitle.length < 4) continue;

    results.push({ chapterNumber, chapterTitle, sectionCode, sectionTitle, pdfFile, body });
  }

  return results;
}

async function main() {
  const all = [];

  for (const { file, chapterNumber, chapterTitle } of PDF_SOURCES) {
    const pdfPath = path.join(ROOT, "public", "pdfs", file);
    if (!fs.existsSync(pdfPath)) {
      console.warn(`[build-bylaw-index] Missing PDF, skipping: ${file}`);
      continue;
    }
    const buffer = fs.readFileSync(pdfPath);
    const { text } = await pdfParse(buffer);
    const sections = parseSectionsFromText(text, chapterNumber, chapterTitle, file);
    all.push(...sections);
    console.log(`[build-bylaw-index] ${file}: ${sections.length} sections`);
  }

  const outPath = path.join(ROOT, "lib", "bylaw-sections.json");
  fs.writeFileSync(outPath, JSON.stringify(all));
  console.log(`[build-bylaw-index] Wrote ${all.length} sections → ${path.relative(ROOT, outPath)}`);
}

main().catch((err) => {
  console.error("[build-bylaw-index] Failed:", err);
  process.exit(1);
});
