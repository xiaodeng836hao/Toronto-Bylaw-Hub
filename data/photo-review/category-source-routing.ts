// ─────────────────────────────────────────────────────────────────────────────
//  Toronto Bylaw Guide — Photo Review category → source-file routing (V6.4)
//
//  Tells the section retriever WHICH bylaw chapters to search for each issue
//  category, and in what priority. This narrows retrieval so a category only
//  pulls sections from its relevant Municipal Code chapters (primary first, then
//  secondary) instead of scanning everything — improving precision. Chapter
//  numbers correspond to the indexed Markdown in data/extracted-bylaws/ and the
//  source-manifest. Categories without indexed source (Dust 417, Zoning) route
//  to no chapters and fall back to the curated map ("needs verification").
//  Isomorphic (no server-only imports).
// ─────────────────────────────────────────────────────────────────────────────

export interface SourceRoute {
  /** Chapters searched first and scored highest. */
  primary: string[];
  /** Chapters searched too, scored slightly lower. */
  secondary: string[];
}

/** Keyed by curated category id (data/photo-review-bylaw-map.ts). */
export const CATEGORY_SOURCE_ROUTING: Record<string, SourceRoute> = {
  graffiti: { primary: ["485"], secondary: [] },
  // Littering/dumping first; waste-collection chapters as secondary context.
  "waste-dumping": { primary: ["548"], secondary: ["846", "841"] },
  "property-standards": { primary: ["629"], secondary: [] },
  fence: { primary: ["447"], secondary: [] },
  "pool-fence": { primary: ["447"], secondary: [] },
  "turfgrass-weeds": { primary: ["489"], secondary: [] },
  dust: { primary: [], secondary: [] }, // Chapter 417 not in the Markdown corpus yet.
  "vacant-hazardous": { primary: ["632"], secondary: ["629"] },
  // Heating + Vital Services live in adjacent chapters.
  heating: { primary: ["497"], secondary: ["835"] },
  refrigerators: { primary: ["659"], secondary: [] },
  "clothing-drop-box": { primary: ["395"], secondary: [] },
  "garage-sale": { primary: ["480"], secondary: [] },
  zoning: { primary: [], secondary: [] }, // Zoning By-law / Landscaping not in corpus yet.
};

/** Ordered, de-duplicated chapter list to search for a category. */
export function sourceChaptersFor(curatedId: string): { chapter: string; primary: boolean }[] {
  const route = CATEGORY_SOURCE_ROUTING[curatedId];
  if (!route) return [];
  const seen = new Set<string>();
  const out: { chapter: string; primary: boolean }[] = [];
  for (const c of route.primary) { if (!seen.has(c)) { seen.add(c); out.push({ chapter: c, primary: true }); } }
  for (const c of route.secondary) { if (!seen.has(c)) { seen.add(c); out.push({ chapter: c, primary: false }); } }
  return out;
}
