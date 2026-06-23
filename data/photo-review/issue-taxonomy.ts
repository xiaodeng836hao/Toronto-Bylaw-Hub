// ─────────────────────────────────────────────────────────────────────────────
//  Toronto Bylaw Guide — Photo Review controlled issue taxonomy (V6.4)
//
//  The fixed set of issue categories the image AI may classify into. The AI
//  picks ONLY from `label` values (never inventing its own), and each label maps
//  to a `curatedId` in data/photo-review-bylaw-map.ts so the retriever knows
//  which bylaw chapter/sections to search. Two terminal categories — Noise
//  (Coming Soon) and "Unknown / Insufficient Image Evidence" — never produce a
//  forced bylaw match. Isomorphic (no server-only imports).
// ─────────────────────────────────────────────────────────────────────────────

export interface IssueCategory {
  /** Canonical label the AI must use verbatim. */
  label: string;
  /** Maps to a category id in photoReviewBylawMap; null for terminal categories. */
  curatedId: string | null;
  /** Noise → Coming Soon placeholder only. */
  comingSoon?: boolean;
  /** Image too unclear / ambiguous to classify — no forced match. */
  unknown?: boolean;
}

export const ISSUE_TAXONOMY: IssueCategory[] = [
  { label: "Graffiti", curatedId: "graffiti" },
  { label: "Waste / Littering / Dumping", curatedId: "waste-dumping" },
  { label: "Residential Waste Collection", curatedId: "waste-dumping" },
  { label: "Commercial Waste Collection", curatedId: "waste-dumping" },
  { label: "Property Standards", curatedId: "property-standards" },
  { label: "Fence", curatedId: "fence" },
  { label: "Pool Fence / Pool Enclosure", curatedId: "pool-fence" },
  { label: "Turfgrass / Long Grass / Weeds", curatedId: "turfgrass-weeds" },
  { label: "Prohibited Plants", curatedId: "turfgrass-weeds" },
  { label: "Dust", curatedId: "dust" },
  { label: "Vacant or Hazardous Property", curatedId: "vacant-hazardous" },
  { label: "Heating", curatedId: "heating" },
  { label: "Vital Services", curatedId: "heating" },
  { label: "Abandoned Appliances", curatedId: "refrigerators" },
  { label: "Clothing Drop Box", curatedId: "clothing-drop-box" },
  { label: "Garage Sale", curatedId: "garage-sale" },
  { label: "Zoning", curatedId: "zoning" },
  { label: "Landscaping / Soft Landscaping", curatedId: "zoning" },
  { label: "Front Yard Parking", curatedId: "zoning" },
  { label: "HVAC / Air Conditioner", curatedId: "zoning" },
  { label: "Accessory Structure / Shed / Detached Garage", curatedId: "zoning" },
  { label: "Noise - Coming Soon", curatedId: null, comingSoon: true },
  { label: "Unknown / Insufficient Image Evidence", curatedId: null, unknown: true },
];

const BY_LABEL = new Map(ISSUE_TAXONOMY.map((c) => [c.label.toLowerCase(), c]));

/** Resolve a taxonomy entry from a label or curated id (case-insensitive). */
export function resolveCategory(value: string): IssueCategory | undefined {
  const v = value.toLowerCase().trim();
  return BY_LABEL.get(v) ?? ISSUE_TAXONOMY.find((c) => c.curatedId === v);
}

/** All labels, for embedding in the AI prompt. */
export function taxonomyLabels(): string[] {
  return ISSUE_TAXONOMY.map((c) => c.label);
}

/** True if the label is the unclear/insufficient-evidence terminal category. */
export function isUnknownCategory(label: string): boolean {
  return resolveCategory(label)?.unknown === true;
}

/** True if the label is the Noise placeholder. */
export function isNoiseCategory(label: string): boolean {
  return resolveCategory(label)?.comingSoon === true;
}
