// ─────────────────────────────────────────────────────────────────────────────
//  Toronto Bylaw Guide — Photo Review category visual criteria (V6.4)
//
//  Per-category visual requirements + guardrails used to AVOID overmatching:
//   • requiredClues — resident-readable cues; surfaced in the UI "to confirm,
//     include…" hint and the upload guidance.
//   • coreTerms + requiresClue — a category that requires a specific object is
//     dropped unless one of its core terms is actually present (e.g. Pool Fence
//     needs a pool, not just any fence).
//   • negativeKillers — if the image AI reports a matching negative finding
//     (e.g. "no swimming pool is visible"), the category is dropped.
//  Keyed by curated category id. Isomorphic (no server-only imports).
// ─────────────────────────────────────────────────────────────────────────────

export interface CategoryVisualCriteria {
  requiredClues: string[];
  /** Defining tokens; used with requiresClue + negative findings. */
  coreTerms: string[];
  /** Drop the category unless a core term is actually present. */
  requiresClue?: boolean;
  /** Lowercased substrings; if any appears in an AI negative finding, drop it. */
  negativeKillers?: string[];
}

export const CATEGORY_VISUAL_CRITERIA: Record<string, CategoryVisualCriteria> = {
  graffiti: {
    requiredClues: ["Markings, tags, spray paint, writing or symbols on a surface"],
    coreTerms: ["graffiti", "spray", "tag", "tags", "markings", "marking"],
  },
  "waste-dumping": {
    requiredClues: ["Garbage bags, dumped items, debris, mattress, furniture, or overflowing bins"],
    coreTerms: ["garbage", "waste", "debris", "dumped", "furniture", "mattress", "refuse", "litter", "bins"],
  },
  "property-standards": {
    requiredClues: [
      "A visible building deficiency (damaged wall/roof/soffit, broken window, unsafe stairs, deteriorated porch, missing guard) or a yard condition (bare/eroded soil, ponding water)",
    ],
    coreTerms: ["damaged", "broken", "unsafe", "deteriorated", "erosion", "ponding", "drainage"],
  },
  "pool-fence": {
    requiredClues: [
      "A swimming pool or pool area is visible AND a gate/enclosure is visible",
    ],
    coreTerms: ["pool", "swimming", "hot tub", "pool gate", "pool enclosure"],
    requiresClue: true,
    negativeKillers: ["no pool", "no swimming pool", "pool is not visible", "no pool is visible", "without a pool"],
  },
  fence: {
    requiredClues: ["A fence, barrier, wall-like fence, or hedge functioning as a fence"],
    coreTerms: ["fence", "fencing", "barbed", "hedge"],
  },
  "turfgrass-weeds": {
    requiredClues: [
      "Long/overgrown grass or weeds; for a specific prohibited plant, identifiable leaves, stems, flowers, berries or seed heads",
    ],
    coreTerms: ["grass", "weeds", "turfgrass", "overgrown", "vegetation"],
  },
  dust: {
    requiredClues: ["Visible airborne or settled dust leaving a property"],
    coreTerms: ["dust", "dusty", "airborne", "soil"],
    requiresClue: true,
  },
  "vacant-hazardous": {
    requiredClues: ["An unsecured, boarded, or open vacant building"],
    coreTerms: ["vacant", "boarded", "unsecured", "derelict", "abandoned building"],
    requiresClue: true,
  },
  heating: {
    requiredClues: ["Heating equipment, thermostat, furnace or radiator, or a described loss of heat / vital service"],
    coreTerms: ["heat", "heating", "furnace", "thermostat", "radiator", "heater", "vital"],
    requiresClue: true,
    negativeKillers: ["no heating", "no thermostat", "no furnace"],
  },
  refrigerators: {
    requiredClues: ["An abandoned refrigerator, freezer, or appliance left accessible"],
    coreTerms: ["refrigerator", "fridge", "freezer", "appliance"],
    requiresClue: true,
  },
  "clothing-drop-box": {
    requiredClues: ["A clothing donation / textile drop box"],
    coreTerms: ["clothing", "donation", "drop box", "textile", "bin"],
    requiresClue: true,
  },
  "garage-sale": {
    requiredClues: ["A garage/yard sale, sale signage, or items laid out for sale"],
    coreTerms: ["garage sale", "yard sale", "sale", "rummage"],
    requiresClue: true,
  },
  zoning: {
    requiredClues: [
      "Structure placement, a paved/parking surface, an accessory structure, or mechanical equipment — with enough context to judge; measurements are usually required",
    ],
    coreTerms: ["zoning", "parking", "driveway", "paved", "shed", "garage", "hvac", "air conditioner", "landscaping", "setback"],
  },
};

/** True when the category requires an explicit clue that is absent from tokens. */
export function failsRequiredClue(curatedId: string, tokens: Set<string>, rawText: string): boolean {
  const c = CATEGORY_VISUAL_CRITERIA[curatedId];
  if (!c?.requiresClue) return false;
  const hay = rawText.toLowerCase();
  return !c.coreTerms.some((t) => tokens.has(t) || hay.includes(t));
}

/** True when an AI negative finding explicitly rules the category out. */
export function negatedByFindings(curatedId: string, negativeFindings: string[]): boolean {
  const killers = CATEGORY_VISUAL_CRITERIA[curatedId]?.negativeKillers;
  if (!killers?.length) return false;
  const hay = negativeFindings.join(" • ").toLowerCase();
  return killers.some((k) => hay.includes(k));
}

/** Resident-readable required clues for a category (UI "to confirm" hint). */
export function requiredCluesFor(curatedId: string): string[] {
  return CATEGORY_VISUAL_CRITERIA[curatedId]?.requiredClues ?? [];
}
