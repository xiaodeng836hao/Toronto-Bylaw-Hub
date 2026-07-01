// ─────────────────────────────────────────────────────────────────────────────
//  Toronto Bylaw Hub — Chapter 548 (Littering and Dumping) detail data (V1.1)
//
//  Plain-language reorganization of Chapter 548, SCHEDULE B — PROHIBITED WASTE.
//  The official schedule lists items A–X in legal terms; here they are grouped
//  into 8 resident-friendly categories with condensed everyday examples and a
//  short note on where each type should go instead. Penalties are from § 548-9.
//
//  Summarized for general reference only — NOT legal advice, and NOT an official
//  disposal instruction. Disposal programs change over time; always confirm the
//  current options with the City of Toronto. Source: Toronto Municipal Code
//  Chapter 548 (Schedule B; § 548-9).
// ─────────────────────────────────────────────────────────────────────────────

// ── Official source ──────────────────────────────────────────────────────────
export const CHAPTER_548_PDF = "https://www.toronto.ca/legdocs/municode/1184_548.pdf";

export const PROHIBITED_WASTE_INTRO =
  "“Prohibited waste” (Schedule B) can’t go in regular garbage or be dumped. Here’s what falls in each group — and where it goes instead.";

export const PROHIBITED_WASTE_NOTE =
  "Plain-language summary of Schedule B — general reference, not legal advice. Disposal programs change, so confirm current options with the City.";

/** Icon + tone keys are resolved to Tailwind classes / lucide icons on the page. */
export type WasteIconKey =
  | "chemical" | "household" | "automotive" | "medical"
  | "construction" | "yard" | "tire" | "business";

export type WasteToneKey =
  | "rose" | "amber" | "orange" | "violet" | "slate" | "emerald" | "blue" | "gray";

export interface ProhibitedWasteCategory {
  icon: WasteIconKey;
  tone: WasteToneKey;
  /** Short category name for quick scanning. */
  category: string;
  /** Which Schedule B items this group covers (for traceability). */
  scheduleRefs: string;
  /** One condensed line of everyday examples (items separated by " · "). */
  examples: string;
  /** Short guidance on where it should go instead of the garbage. */
  disposeInstead: string;
}

/**
 * Schedule B (A–X) reorganized into 8 resident-friendly categories.
 * The `scheduleRefs` map each category back to the official lettered items.
 */
export const PROHIBITED_WASTE: ProhibitedWasteCategory[] = [
  {
    icon: "chemical",
    tone: "rose",
    category: "Hazardous & toxic chemicals",
    scheduleRefs: "Schedule B, A–J",
    examples: "Corrosive, ignitable, reactive & toxic waste · PCBs · radioactive · hazardous industrial",
    disposeInstead: "Household Hazardous Waste (HHW) Depot or Community Environment Day",
  },
  {
    icon: "household",
    tone: "amber",
    category: "Household hazardous products",
    scheduleRefs: "Schedule B, L",
    examples: "Bleach & cleaners · pesticides & weed killers · aerosols · fire extinguishers · pool chemicals",
    disposeInstead: "HHW Depot or Community Environment Day",
  },
  {
    icon: "automotive",
    tone: "orange",
    category: "Paints, solvents & automotive",
    scheduleRefs: "Schedule B, L",
    examples: "Paint & thinner · engine oil · antifreeze · brake fluid · car & rechargeable batteries · propane tanks",
    disposeInstead: "HHW Depot or a retailer take-back program",
  },
  {
    icon: "medical",
    tone: "violet",
    category: "Medical & biomedical waste",
    scheduleRefs: "Schedule B, K",
    examples: "Needles, syringes & vials · medicines · used bandages · animal or human tissue",
    disposeInstead: "Return to a pharmacy — never in any bin",
  },
  {
    icon: "construction",
    tone: "slate",
    category: "Construction & renovation debris",
    scheduleRefs: "Schedule B, M–N",
    examples: "Drywall, concrete, brick & tile · asphalt · wood · windows · scrap metal · insulation · asbestos",
    disposeInstead: "Transfer station or a licensed hauler / bin",
  },
  {
    icon: "yard",
    tone: "emerald",
    category: "Yard, soil & liquid waste",
    scheduleRefs: "Schedule B, O–Q",
    examples: "Sod & grass clippings · hay, straw & manure · any liquid or un-drained waste",
    disposeInstead: "City yard-waste program; dispose of soil & liquids properly",
  },
  {
    icon: "tire",
    tone: "blue",
    category: "Tires, glass & sharp items",
    scheduleRefs: "Schedule B, T–V",
    examples: "Tires · broken glass & sharp objects · material stuck to its bin",
    disposeInstead: "Tire retailer take-back; wrap sharp items safely",
  },
  {
    icon: "business",
    tone: "gray",
    category: "Business, industrial & banned items",
    scheduleRefs: "Schedule B, R, S, W–X",
    examples: "Commercial, retail & manufacturing waste · landfill-banned or take-back items",
    disposeInstead: "Private commercial hauler — not City collection",
  },
];

export interface LitteringPenalty {
  offence: string;
  reference: string;
  maxFine: string;
}

/** Offence penalties from § 548-9. */
export const LITTERING_PENALTIES: LitteringPenalty[] = [
  {
    offence: "Littering / depositing waste, or not clearing your land",
    reference: "§ 548-3, 548-5, 548-6",
    maxFine: "Up to $5,000",
  },
  {
    offence: "Illegal dumping — first conviction",
    reference: "§ 548-4",
    maxFine: "$10,000 · $50,000 corp.",
  },
  {
    offence: "Illegal dumping — repeat conviction",
    reference: "§ 548-4",
    maxFine: "$25,000 · $100,000 corp.",
  },
];
