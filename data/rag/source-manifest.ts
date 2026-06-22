// ─────────────────────────────────────────────────────────────────────────────
//  Toronto Bylaw Guide — RAG source manifest (V6)
//
//  Maps source documents to their display metadata, official URL, and internal
//  BylawGuide page. Used to enrich retrieved chunks with citations. Only includes
//  real, source-based content — no 311 Navigator, Officer Tools, or Noise detail.
// ─────────────────────────────────────────────────────────────────────────────

export interface RagSourceMeta {
  title: string;
  type: string;
  officialUrl: string | null;
  internalUrl: string;
  lastReviewed: string;
}

const REVIEWED = "2026-06-19";
const MUNICODE = (n: string) => `https://www.toronto.ca/legdocs/municode/1184_${n}.pdf`;

/** Per-chapter metadata for Toronto Municipal Code chapters in the corpus. */
const CHAPTER_META: Record<string, { title: string; internal?: string; official?: string }> = {
  "417": { title: "Chapter 417 — Dust", official: "https://www.toronto.ca/legdocs/bylaws/2020/law0417.pdf" },
  "447": { title: "Chapter 447 — Fences" },
  "485": { title: "Chapter 485 — Graffiti" },
  "489": { title: "Chapter 489 — Turfgrass and Prohibited Plants", internal: "/prohibited-plants" },
  "497": { title: "Chapter 497 — Heating" },
  "548": { title: "Chapter 548 — Littering and Dumping of Refuse" },
  "629": { title: "Chapter 629 — Property Standards" },
  "632": { title: "Chapter 632 — Vacant or Hazardous Buildings" },
  "659": { title: "Chapter 659 — Refrigerators and Other Appliances" },
  "835": { title: "Chapter 835 — Vital Services" },
  "841": { title: "Chapter 841 — Waste Collection (Commercial)" },
  "846": { title: "Chapter 846 — Waste Collection (Residential)" },
  "395": { title: "Chapter 395 — Clothing Drop Boxes" },
  "480": { title: "Chapter 480 — Garage Sales" },
};

/** Resolve display + citation metadata for a corpus chapter number. */
export function sourceMetaForChapter(chapterNumber: string): RagSourceMeta {
  const meta = CHAPTER_META[chapterNumber];
  if (meta) {
    return {
      title: meta.title,
      type: "TMC Chapter",
      officialUrl: meta.official ?? MUNICODE(chapterNumber),
      internalUrl: meta.internal ?? `/tmc-chapters/${chapterNumber}`,
      lastReviewed: REVIEWED,
    };
  }
  return {
    title: `Toronto Municipal Code — Chapter ${chapterNumber}`,
    type: "TMC Chapter",
    officialUrl: MUNICODE(chapterNumber),
    internalUrl: `/tmc-chapters/${chapterNumber}`,
    lastReviewed: REVIEWED,
  };
}

/**
 * Documents available to RAG beyond the parsed TMC sections. Listed for the
 * maintenance docs and the ingestion manifest; the in-repo corpus
 * (lib/bylaw-sections.json) is the embeddable text source.
 */
export const ragSourceDocuments = [
  { id: "tmc-sections", title: "Toronto Municipal Code — parsed chapter sections", type: "TMC Chapter", file: "lib/bylaw-sections.json" },
  { id: "knowledge-index", title: "BylawGuide curated knowledge index", type: "Curated", file: "data/knowledge-index.ts" },
] as const;
