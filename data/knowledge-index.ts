// ─────────────────────────────────────────────────────────────────────────────
//  Toronto Bylaw Guide — Central Knowledge Index (V5)
//
//  Single source of truth for the "Ask BylawGuide" feature and the improved
//  site-wide search. Every answer the Ask page can give is grounded in one of
//  these curated, source-based items — the retrieval engine (lib/ask.ts) never
//  invents content beyond what is written here.
//
//  RULES (see CONTENT_MAINTENANCE.md):
//   • Source-based only. No legal conclusions or official determinations.
//   • Do not invent section numbers — use only references verified against the
//     official by-law / Municipal Code, or leave relatedSections empty.
//   • Keep wording cautious ("generally", "may", "verify with official sources").
//   • Noise stays a "Coming Soon" placeholder — no detailed guidance.
// ─────────────────────────────────────────────────────────────────────────────

export type KnowledgeType =
  | "TMC Chapter"
  | "Fence"
  | "Pool Fence Guide"
  | "Zoning"
  | "Landscaping"
  | "Prohibited Plant"
  | "Photo Review"
  | "Coming Soon"
  | "Official Source";

/** How cautious the answer should be presented. Drives the disclaimer shown. */
export type CautionLevel =
  | "general"
  | "verify-official-source"
  | "property-specific"
  | "pool-enclosure"
  | "coming-soon";

export interface KnowledgeSource {
  title: string;
  /** Source type label, e.g. "Official City of Toronto", "Municipal Code". */
  type?: string;
  url: string;
}

export interface KnowledgeItem {
  id: string;
  title: string;
  type: KnowledgeType;
  topic: string;
  summary: string;
  keywords: string[];
  synonyms: string[];
  relatedQuestions: string[];
  /** Short source excerpt or summarized source note (verbatim-ish, cautious). */
  sourceText: string;
  /** Simple reference answer shown on the Ask page. */
  plainLanguageAnswer: string;
  relatedChapter: string | null;
  /** Only verified section references. Empty array if none can be verified. */
  relatedSections: string[];
  officialSources: KnowledgeSource[];
  /** Internal BylawGuide page this maps to. */
  internalUrl: string;
  lastReviewed: string;
  cautionLevel: CautionLevel;
  /** Practical, non-legal next steps. */
  nextSteps: string[];
}

const REVIEWED = "2026-06-19";

const CITY = "Official City of Toronto";
const CODE = "Toronto Municipal Code";
const ZBL = "Zoning By-law 569-2013";

// ─── Shared official source links ───────────────────────────────────────────
const SRC_311: KnowledgeSource = {
  title: "Toronto 311 — Create a Service Request",
  type: CITY,
  url: "https://www.toronto.ca/home/311-toronto-at-your-service/create-a-service-request/",
};
const SRC_ZONING_REVIEW: KnowledgeSource = {
  title: "Zoning By-law & Preliminary Zoning Reviews",
  type: CITY,
  url: "https://www.toronto.ca/city-government/planning-development/zoning-by-law-preliminary-zoning-reviews/",
};
const SRC_ZONING_MAP: KnowledgeSource = {
  title: "Zoning Map Viewer",
  type: CITY,
  url: "https://map.toronto.ca/maps/map.jsp?app=ZBL_CONSULT",
};
const SRC_COA: KnowledgeSource = {
  title: "Committee of Adjustment",
  type: CITY,
  url: "https://www.toronto.ca/city-government/planning-development/committee-of-adjustment/",
};

export const knowledgeItems: KnowledgeItem[] = [
  // ─── Fences (Chapter 447) ────────────────────────────────────────────────
  {
    id: "fence-height",
    title: "How high can my fence be?",
    type: "Fence",
    topic: "Fence",
    summary:
      "Residential fence height in Toronto is governed by the Fences by-law (Toronto Municipal Code Chapter 447), with different limits for front yards versus rear/side yards.",
    keywords: ["fence", "fence height", "how high", "tall", "back yard fence", "rear yard fence", "front yard fence", "447"],
    synonyms: ["backyard fence", "front yard fence", "hedge fence", "deck fence", "privacy fence", "boundary fence", "wall height"],
    relatedQuestions: [
      "How high can my backyard fence be?",
      "What is the maximum front yard fence height?",
      "Do I need a permit for a fence?",
    ],
    sourceText:
      "Fence height, materials, and driveway-visibility rules are set by Toronto Municipal Code Chapter 447. Front-yard fences are generally limited to a lower height than rear and side-yard fences. Exact limits depend on the fence's location and the property.",
    plainLanguageAnswer:
      "Fence height is set by the City's Fences by-law (Chapter 447), not zoning. In general, fences in the rear and side yards may be taller than fences in the front yard, and corner lots have extra rules to keep driveway sightlines clear. The exact maximum depends on where the fence is on your lot — see the Fences page for the height details and confirm with Chapter 447.",
    relatedChapter: "Chapter 447 — Fences",
    relatedSections: [],
    officialSources: [
      { title: "Chapter 447, Fences (PDF)", type: CODE, url: "https://www.toronto.ca/legdocs/municode/1184_447.pdf" },
      SRC_311,
    ],
    internalUrl: "/tmc-chapters/447",
    lastReviewed: REVIEWED,
    cautionLevel: "verify-official-source",
    nextSteps: [
      "Open the Fences chapter page for the height table and rules.",
      "Confirm the exact limit for your fence's location in Chapter 447.",
      "For corner lots, check the driveway-visibility (sightline) rules.",
    ],
  },
  {
    id: "fence-driveway-visibility",
    title: "Fences and driveway visibility on corner lots",
    type: "Fence",
    topic: "Fence",
    summary:
      "On corner lots, fences and hedges near a driveway or intersection are limited to keep sightlines clear for drivers and pedestrians.",
    keywords: ["fence", "corner lot", "driveway visibility", "sightline", "hedge", "intersection"],
    synonyms: ["driveway visibility", "corner fence", "sight triangle", "hedge height"],
    relatedQuestions: ["Can I put a tall fence next to my driveway?", "What are corner-lot fence rules?"],
    sourceText:
      "Toronto Municipal Code Chapter 447 limits fence and hedge height near driveways and corners to maintain visibility. Zoning may also apply to structures near a lot line.",
    plainLanguageAnswer:
      "Near a driveway or a corner, fences and hedges generally must be kept low enough to preserve clear sightlines for drivers and pedestrians. These limits come from the Fences by-law (Chapter 447). If you are building a structure (not just a fence) near a lot line, zoning setbacks may also apply.",
    relatedChapter: "Chapter 447 — Fences",
    relatedSections: [],
    officialSources: [
      { title: "Chapter 447, Fences (PDF)", type: CODE, url: "https://www.toronto.ca/legdocs/municode/1184_447.pdf" },
    ],
    internalUrl: "/tmc-chapters/447",
    lastReviewed: REVIEWED,
    cautionLevel: "verify-official-source",
    nextSteps: ["Review Chapter 447 for corner-lot and driveway-visibility limits."],
  },

  // ─── Pool Fence (Chapter 447 enclosure provisions) ───────────────────────
  {
    id: "pool-fence-permit",
    title: "Do I need a pool fence enclosure permit?",
    type: "Pool Fence Guide",
    topic: "Pool Fence",
    summary:
      "A swimming pool generally requires a compliant enclosure, and the City uses a permit/approval process before the pool can be filled and used.",
    keywords: ["pool", "pool fence", "pool enclosure", "permit", "swimming pool", "enclosure permit"],
    synonyms: ["pool permit", "pool enclosure", "pool barrier", "swimming pool fence"],
    relatedQuestions: [
      "Do I need a permit for a pool fence?",
      "What is required before filling my pool?",
    ],
    sourceText:
      "Toronto Municipal Code Chapter 447 requires a pool enclosure that controls access. The City's process typically involves a zoning certificate and a Pool Fence Enclosure Permit, and an inspection before the pool is filled or used.",
    plainLanguageAnswer:
      "Yes — a swimming pool generally needs a compliant enclosure, and you typically need City approval (a zoning certificate and a Pool Fence Enclosure Permit) before filling and using the pool. There is usually an inspection step too. See the Pool Fence Guide for the process, then confirm with Chapter 447 and Toronto Building.",
    relatedChapter: "Chapter 447 — Fences",
    relatedSections: ["§ 447-1.3"],
    officialSources: [
      { title: "Chapter 447, Fences (PDF)", type: CODE, url: "https://www.toronto.ca/legdocs/municode/1184_447.pdf" },
      { title: "Toronto Building", type: CITY, url: "https://www.toronto.ca/services-payments/building-construction/" },
    ],
    internalUrl: "/pool-fence-guide",
    lastReviewed: REVIEWED,
    cautionLevel: "pool-enclosure",
    nextSteps: [
      "Open the Pool Fence Guide for the step-by-step permit process.",
      "Do not fill or use the pool before the required inspection passes.",
      "Confirm exact requirements with Chapter 447 and Toronto Building.",
    ],
  },
  {
    id: "pool-fence-gate-self-closing",
    title: "Does my pool gate need to self-close and self-latch?",
    type: "Pool Fence Guide",
    topic: "Pool Fence",
    summary:
      "Pool enclosure gates must be designed to control access — generally self-closing, self-latching, and kept locked when the pool area is not in use.",
    keywords: ["pool", "gate", "self closing", "self latching", "latch", "pool gate", "pool enclosure", "locked"],
    synonyms: ["self closing gate", "self latching gate", "pool gate latch", "locked gate", "gate latch"],
    relatedQuestions: [
      "Does my pool gate need to self-close?",
      "Does my pool gate need to latch?",
      "Can my pool gate stay unlocked?",
    ],
    sourceText:
      "Under Chapter 447, a gate in a pool enclosure should be self-closing and self-latching, and kept locked when no one is using the enclosed pool area, so it effectively controls access.",
    plainLanguageAnswer:
      "Generally yes. A pool enclosure gate should be self-closing and self-latching, and kept locked whenever the pool area is not in use, so it controls access to the pool. The exact gate requirements are in Chapter 447 — see the Pool Fence Guide for a simple summary and checklist.",
    relatedChapter: "Chapter 447 — Fences",
    relatedSections: ["§ 447-1.3"],
    officialSources: [
      { title: "Chapter 447, Fences (PDF)", type: CODE, url: "https://www.toronto.ca/legdocs/municode/1184_447.pdf" },
    ],
    internalUrl: "/pool-fence-guide",
    lastReviewed: REVIEWED,
    cautionLevel: "pool-enclosure",
    nextSteps: [
      "Use the Pool Fence Guide checklist to compare your gate to the rules.",
      "Confirm the exact gate requirements in Chapter 447.",
    ],
  },
  {
    id: "hot-tub-cover",
    title: "Does a hot tub or spa need a pool enclosure?",
    type: "Pool Fence Guide",
    topic: "Pool Fence",
    summary:
      "A hot tub, whirlpool, or spa may be exempt from the enclosure requirement if it has a substantial, permanently attached, lockable cover that is kept locked when not in use.",
    keywords: ["hot tub", "spa", "whirlpool", "cover", "pool enclosure", "exempt"],
    synonyms: ["hot tub cover", "spa cover", "lockable cover"],
    relatedQuestions: ["Does my hot tub need a fence?", "Is a spa exempt from the pool enclosure rules?"],
    sourceText:
      "Chapter 447 may exempt a whirlpool, hot tub, or spa from the enclosure requirements if it has a substantial, structurally adequate cover that is permanently attached and securely locked when not in use.",
    plainLanguageAnswer:
      "Possibly. A hot tub, whirlpool, or spa may be exempt from the pool enclosure requirement if it has a substantial, permanently attached, lockable cover that is securely locked whenever it is not in use. Confirm the exemption details in Chapter 447.",
    relatedChapter: "Chapter 447 — Fences",
    relatedSections: [],
    officialSources: [
      { title: "Chapter 447, Fences (PDF)", type: CODE, url: "https://www.toronto.ca/legdocs/municode/1184_447.pdf" },
    ],
    internalUrl: "/pool-fence-guide",
    lastReviewed: REVIEWED,
    cautionLevel: "pool-enclosure",
    nextSteps: ["Check the hot tub / spa exemption details in Chapter 447."],
  },

  // ─── Landscaping (Zoning 10.5.50.10) ─────────────────────────────────────
  {
    id: "soft-landscaping-definition",
    title: "What counts as soft landscaping?",
    type: "Landscaping",
    topic: "Landscaping",
    summary:
      "Soft landscaping generally means living, planted, permeable areas (grass, gardens, shrubs, trees) and excludes hard surfaces like driveways, patios, and pavers.",
    keywords: ["soft landscaping", "landscaping", "grass", "garden", "permeable", "hard landscaping", "what counts"],
    synonyms: ["soft landscaping", "garden bed", "planting bed", "green space", "vegetation", "artificial turf", "interlock", "pavers"],
    relatedQuestions: [
      "What counts as soft landscaping?",
      "Does artificial turf count as soft landscaping?",
      "Do pavers count as soft landscaping?",
    ],
    sourceText:
      "In By-law 569-2013, soft landscaping means trees, shrubs, grass, flowers, vegetables and other vegetation, and does not include hard surfaced areas such as driveways, parking areas, decorative stonework, walkways, or patios.",
    plainLanguageAnswer:
      "Soft landscaping means permeable, living, planted areas — grass, garden beds, shrubs, trees, and other vegetation. It does NOT include hard surfaces like driveways, parking areas, patios, walkways, decorative stonework, or pavers. Artificial turf is not living vegetation, so it may not count. See the Landscaping page for what counts and how it's measured.",
    relatedChapter: `${ZBL} — Chapter 10.5`,
    relatedSections: ["10.5.50.10"],
    officialSources: [SRC_ZONING_REVIEW, SRC_ZONING_MAP],
    internalUrl: "/landscaping",
    lastReviewed: REVIEWED,
    cautionLevel: "property-specific",
    nextSteps: [
      "Open the Landscaping page for definitions and yard-by-yard requirements.",
      "Confirm your property's zone in the Zoning Map Viewer.",
    ],
  },
  {
    id: "pave-front-yard",
    title: "Can I pave my entire front yard?",
    type: "Landscaping",
    topic: "Landscaping",
    summary:
      "Residential zoning requires a minimum portion of the front yard to remain landscaping — much of it soft landscaping — so a front yard generally cannot be fully paved.",
    keywords: ["pave", "front yard", "paving", "driveway", "parking pad", "hard surface", "front yard landscaping"],
    synonyms: ["paved front yard", "pave driveway", "parking pad", "interlock front yard", "front yard paving", "front yard parking"],
    relatedQuestions: [
      "Can I pave my entire front yard?",
      "How much of my front yard can be paved?",
      "Can I add a front yard parking pad?",
    ],
    sourceText:
      "By-law 569-2013, Clause 10.5.50.10 requires a minimum percentage of the front yard to be landscaping (50% for lots 6.0–<15.0 m frontage; 60% for lots 15.0 m or wider), and at least 75% of that required landscaping must be soft landscaping.",
    plainLanguageAnswer:
      "Generally no. Depending on your lot frontage, at least 50–60% of the front yard must stay as landscaping, and at least 75% of that must be soft (living, planted) landscaping. Very narrow lots must keep the whole front yard, except a permitted driveway, as landscaping. So a front yard usually cannot be fully paved. See the Landscaping page, and confirm your zone first.",
    relatedChapter: `${ZBL} — Chapter 10.5`,
    relatedSections: ["10.5.50.10(1)"],
    officialSources: [SRC_ZONING_REVIEW, SRC_ZONING_MAP, SRC_COA],
    internalUrl: "/landscaping",
    lastReviewed: REVIEWED,
    cautionLevel: "property-specific",
    nextSteps: [
      "Measure your front yard area and frontage.",
      "Open the Landscaping page for the front-yard requirements.",
      "If you want to keep a non-compliant condition, see the Committee of Adjustment (minor variance) section.",
    ],
  },
  {
    id: "rear-yard-soft-landscaping",
    title: "How much of my rear yard must be soft landscaping?",
    type: "Landscaping",
    topic: "Landscaping",
    summary:
      "For most homes, a minimum percentage of the rear yard must be kept as soft landscaping, depending on lot frontage.",
    keywords: ["rear yard", "backyard", "soft landscaping", "patio", "deck", "back yard landscaping"],
    synonyms: ["backyard landscaping", "rear yard patio", "rear yard paving"],
    relatedQuestions: [
      "Can I cover my whole backyard with patio stones?",
      "How much of my rear yard must stay green?",
    ],
    sourceText:
      "By-law 569-2013, Clause 10.5.50.10(3): for a residential building other than an apartment, at least 50% of the rear yard must be soft landscaping if the lot frontage is greater than 6.0 m (25% if 6.0 m or less).",
    plainLanguageAnswer:
      "For most homes, at least 50% of the rear yard must be soft landscaping if your lot frontage is over 6.0 m (25% if it is 6.0 m or less). So you generally cannot cover the whole backyard with patio or pavers. A pool's water surface can count toward soft landscaping. See the Landscaping page for details.",
    relatedChapter: `${ZBL} — Chapter 10.5`,
    relatedSections: ["10.5.50.10(3)"],
    officialSources: [SRC_ZONING_REVIEW, SRC_ZONING_MAP],
    internalUrl: "/landscaping",
    lastReviewed: REVIEWED,
    cautionLevel: "property-specific",
    nextSteps: ["Measure your rear yard and frontage.", "Open the Landscaping page for rear-yard rules."],
  },

  // ─── Zoning ──────────────────────────────────────────────────────────────
  {
    id: "zoning-setbacks",
    title: "What are the zoning setbacks for my house?",
    type: "Zoning",
    topic: "Zoning",
    summary:
      "Setbacks are minimum distances between a building and the lot lines. They depend on the zone, building type, and which yard (front, side, rear).",
    keywords: ["setback", "zoning", "lot line", "front yard setback", "side yard", "rear yard", "how close"],
    synonyms: ["setback", "side yard", "rear yard", "building distance", "lot line distance", "how close can i build"],
    relatedQuestions: [
      "How far does my house need to be from the lot line?",
      "What is the rear yard setback?",
      "How close to the side lot line can I build?",
    ],
    sourceText:
      "By-law 569-2013: in the Residential Zone (R) default minimums include a 6.0 m front yard, 7.5 m rear yard, and 0.9 m side yard for a detached/semi-detached house (10.10.40.70). In the Residential Detached Zone (RD), the rear yard is the greater of 7.5 m or 25% of lot depth, and side yards scale with frontage (10.20.40.70). A front-yard averaging rule (10.5.40.70) can also apply.",
    plainLanguageAnswer:
      "Setbacks are the minimum distances a building must sit from each lot line, and they vary by zone and building type. In the R zone, common defaults are a 6.0 m front yard, 7.5 m rear yard, and 0.9 m side yard; the RD zone scales side and rear yards with the lot. A neighbour-averaging rule can change the front-yard figure. Confirm your zone in the Zoning Map Viewer, then check the relevant section. See the Zoning page.",
    relatedChapter: `${ZBL} — Chapter 10`,
    relatedSections: ["10.10.40.70", "10.20.40.70", "10.5.40.70"],
    officialSources: [SRC_ZONING_REVIEW, SRC_ZONING_MAP],
    internalUrl: "/zoning?topic=setbacks",
    lastReviewed: REVIEWED,
    cautionLevel: "property-specific",
    nextSteps: [
      "Confirm your zone in the Zoning Map Viewer.",
      "Open the Zoning page and review the setbacks topic.",
      "Check the section for your specific zone and building type.",
    ],
  },
  {
    id: "front-yard-parking",
    title: "Can I park in my front yard?",
    type: "Zoning",
    topic: "Zoning",
    summary:
      "Parking on an unpaved front yard or a street-facing side yard is generally not permitted, and new front-yard driveways are tightly restricted.",
    keywords: ["front yard parking", "park on lawn", "parking pad", "driveway", "boulevard parking"],
    synonyms: ["front yard parking", "park on grass", "parking pad", "lawn parking", "front pad"],
    relatedQuestions: ["Can I park on my front lawn?", "Can I add a front-yard parking pad?"],
    sourceText:
      "By-law 569-2013, 10.5.80.10: a parking space may not be in a front yard or a street-facing side yard, with limited exceptions for a legal private driveway. New front-yard parking is heavily restricted and generally needs City authorization.",
    plainLanguageAnswer:
      "Generally no — a parking space can't be in the front yard or a street-facing side yard, and parking on grass or an unpaved area is not permitted. You may park on a legal private driveway leading to a parking space. New front-yard driveways/pads are tightly limited and usually need City approval, and the front-yard landscaping minimums also restrict paving. See the Zoning and Landscaping pages.",
    relatedChapter: `${ZBL} — Chapter 10.5`,
    relatedSections: ["10.5.80.10"],
    officialSources: [SRC_ZONING_REVIEW, SRC_ZONING_MAP],
    internalUrl: "/zoning?topic=front-yard-parking",
    lastReviewed: REVIEWED,
    cautionLevel: "property-specific",
    nextSteps: [
      "Confirm your zone in the Zoning Map Viewer.",
      "Check the front-yard landscaping minimums before paving.",
      "A new front-yard driveway/pad usually needs City authorization.",
    ],
  },
  {
    id: "hvac-ac-location",
    title: "Where can I put my air conditioner or heat pump?",
    type: "Zoning",
    topic: "Zoning",
    summary:
      "An air conditioner or heat pump is treated as equipment that may project only a limited amount into a required yard and must stay a set distance from the lot line.",
    keywords: ["air conditioner", "ac", "hvac", "heat pump", "condenser", "equipment", "setback"],
    synonyms: ["air conditioner", "ac unit", "heat pump", "hvac", "condenser"],
    relatedQuestions: ["Where can I put my air conditioner?", "How close to the lot line can my AC be?"],
    sourceText:
      "By-law 569-2013, 10.5.40.60(8): an air conditioner may encroach up to 0.9 m into a required rear yard setback (and a side yard if not above the first storey), and must be no closer than 0.3 m to a lot line.",
    plainLanguageAnswer:
      "An air conditioner or heat pump can project up to about 0.9 m into a required rear-yard setback (and into a side yard if it's not above the first storey), but must stay at least 0.3 m from the lot line. The required setback itself depends on your zone. Manufacturer clearances and the noise by-law may also apply. See the Zoning page.",
    relatedChapter: `${ZBL} — Chapter 10.5`,
    relatedSections: ["10.5.40.60(8)"],
    officialSources: [SRC_ZONING_REVIEW, SRC_ZONING_MAP],
    internalUrl: "/zoning?topic=hvac-ac-location",
    lastReviewed: REVIEWED,
    cautionLevel: "property-specific",
    nextSteps: ["Confirm your side/rear setback for your zone.", "Keep the unit within the 0.9 m / 0.3 m limits."],
  },
  {
    id: "accessory-structures",
    title: "Do I need a permit for a shed or detached garage?",
    type: "Zoning",
    topic: "Zoning",
    summary:
      "Sheds, detached garages, and similar accessory structures have their own lot-coverage and setback limits, even when a small structure does not need a building permit.",
    keywords: ["shed", "detached garage", "accessory structure", "ancillary building", "outbuilding", "pergola", "lot coverage"],
    synonyms: ["shed", "detached garage", "accessory structure", "outbuilding", "ancillary building", "garden shed"],
    relatedQuestions: [
      "How big can my shed be?",
      "How close to the lot line can a detached garage go?",
    ],
    sourceText:
      "By-law 569-2013, 10.10.60.70: in the R zone, ancillary buildings and structures together may cover no more than 5% of the lot area. A detached garage must be at least 1.0 m from a rear/side lot line that abuts a street or lane (10.10.60.20).",
    plainLanguageAnswer:
      "Zoning limits accessory structures by lot coverage and setbacks even when a small shed doesn't need a building permit. In the R zone, all ancillary structures together can cover at most 5% of the lot. A detached garage must be at least 1.0 m from a rear/side lot line that abuts a street or lane. Measure your structure's footprint and location, and see the Zoning page.",
    relatedChapter: `${ZBL} — Chapter 10.10`,
    relatedSections: ["10.10.60.70", "10.10.60.20"],
    officialSources: [SRC_ZONING_REVIEW, SRC_ZONING_MAP],
    internalUrl: "/zoning?topic=accessory-structures",
    lastReviewed: REVIEWED,
    cautionLevel: "property-specific",
    nextSteps: ["Measure the structure's footprint and distance to each lot line.", "Open the Zoning page for accessory-structure rules."],
  },

  // ─── Former North York Zoning (By-law 7625) ──────────────────────────────
  {
    id: "former-north-york-zoning",
    title: "What is former North York zoning?",
    type: "Zoning",
    topic: "Former North York Zoning",
    summary:
      "A plain-language index and overview of the historical Township of North York Zoning By-law 7625, which may still be referenced for some properties.",
    keywords: ["former north york zoning", "north york zoning", "by-law 7625", "former municipal zoning", "north york bylaw", "township of north york"],
    synonyms: ["former north york", "north york zoning bylaw", "former municipal zoning", "old north york zoning", "north york front yard", "north york setback", "north york parking", "north york landscaping"],
    relatedQuestions: [
      "What is former North York zoning?",
      "Does the old North York zoning by-law still apply to my property?",
      "Where can I find North York zoning references?",
    ],
    sourceText:
      "The Township of North York Zoning By-law No. 7625 (1952, as amended) is a historical municipal by-law held by the City of Toronto Archives. The Former North York Zoning page organizes its 37-section structure, zone categories, and key definitions into a browsable index. Exact zone figures are flagged for verification.",
    plainLanguageAnswer:
      "Former North York zoning refers to the historical Township of North York Zoning By-law 7625 (1952). Toronto's city-wide Zoning By-law 569-2013 now applies, but former municipal provisions may still be referenced for some properties. The Former North York Zoning page gives a plain-language index, the zone categories (R1–R5, RM1–RM5, C, M, O, etc.), and key definitions with their section numbers. It is a reference index only — confirm any property-specific requirement with official City resources.",
    relatedChapter: "Former North York Zoning By-law 7625",
    relatedSections: [],
    officialSources: [SRC_ZONING_REVIEW, SRC_ZONING_MAP],
    internalUrl: "/zoning/former-north-york",
    lastReviewed: REVIEWED,
    cautionLevel: "property-specific",
    nextSteps: [
      "Open the Former North York Zoning page for the index and definitions.",
      "Confirm the property's current zoning in the Zoning Map Viewer.",
      "Verify any specific former-zoning figure with official City resources.",
    ],
  },
  {
    id: "former-north-york-yards",
    title: "Former North York front, side, and rear yards",
    type: "Zoning",
    topic: "Former North York Zoning",
    summary:
      "By-law 7625 defines front, side, and rear yards; the exact minimum yard requirements depend on the specific zone.",
    keywords: ["former north york front yard", "former north york setback", "north york yard", "north york rear yard", "north york side yard"],
    synonyms: ["north york front yard", "north york setback", "former north york yard", "north york rear yard"],
    relatedQuestions: [
      "What is the former North York front yard requirement?",
      "What are the former North York setbacks?",
    ],
    sourceText:
      "By-law 7625 defines a front yard (2.82.1), rear yard (2.82.2), and side yard (2.82.3) as the open space between the relevant lot line and the nearest wall of the building. The minimum required depth/width for each is set per zone in the zone sections.",
    plainLanguageAnswer:
      "The former North York by-law (7625) defines what front, side, and rear yards are (sections 2.82.1–2.82.3), but the exact minimum yard sizes depend on the specific zone (for example R1 vs R4) and are in the zone sections. See the Former North York Zoning page for the definitions and index, and confirm the exact figure for the applicable zone with official City resources.",
    relatedChapter: "Former North York Zoning By-law 7625",
    relatedSections: ["2.82.1", "2.82.2", "2.82.3"],
    officialSources: [SRC_ZONING_REVIEW, SRC_ZONING_MAP],
    internalUrl: "/zoning/former-north-york",
    lastReviewed: REVIEWED,
    cautionLevel: "property-specific",
    nextSteps: [
      "Open the Former North York Zoning page for the yard definitions.",
      "Confirm the exact yard figures for the applicable zone with official City resources.",
    ],
  },

  // ─── Prohibited Plants (Chapter 489) ─────────────────────────────────────
  {
    id: "giant-hogweed-removal",
    title: "How do I remove giant hogweed safely?",
    type: "Prohibited Plant",
    topic: "Prohibited Plants",
    summary:
      "Giant hogweed sap can cause severe skin burns. It should be handled with extreme caution, full protective cover, or by a professional.",
    keywords: ["giant hogweed", "hogweed", "remove", "removal", "burn", "sap", "prohibited plant", "invasive"],
    synonyms: ["hogweed", "giant hogweed", "invasive plant", "noxious weed"],
    relatedQuestions: ["How do I remove giant hogweed?", "Is giant hogweed dangerous?"],
    sourceText:
      "Giant hogweed is a prohibited/invasive plant. Its watery sap can cause severe burns and blistering when skin is exposed to sunlight. The Prohibited Plants Identifier provides resident-friendly, cautious removal guidance.",
    plainLanguageAnswer:
      "Giant hogweed is hazardous — its sap can cause severe skin burns in sunlight. Do not touch it with bare skin. If removal is needed, use full protective cover (or hire a professional), avoid getting sap on you, and follow the cautious steps on the Prohibited Plants page. For plants on City property, report through 311.",
    relatedChapter: "Chapter 489 — Turfgrass and Prohibited Plants",
    relatedSections: [],
    officialSources: [
      { title: "Chapter 489 (PDF)", type: CODE, url: "https://www.toronto.ca/legdocs/municode/1184_489.pdf" },
      { title: "Ontario Invasive Plant Council", type: "Reference", url: "https://www.ontarioinvasiveplants.ca/" },
      SRC_311,
    ],
    internalUrl: "/prohibited-plants/giant-hogweed",
    lastReviewed: REVIEWED,
    cautionLevel: "general",
    nextSteps: [
      "Open the Prohibited Plants page for safe, step-by-step removal guidance.",
      "Wear full protective cover or hire a professional.",
      "Report plants on City property through 311.",
    ],
  },
  {
    id: "prohibited-plants-overview",
    title: "What are Toronto's prohibited plants?",
    type: "Prohibited Plant",
    topic: "Prohibited Plants",
    summary:
      "Toronto identifies prohibited and invasive plants that owners are expected to control. The Identifier helps recognize them and learn safe removal.",
    keywords: ["prohibited plants", "invasive", "weeds", "noxious", "poison ivy", "ragweed", "knotweed", "buckthorn", "garlic mustard"],
    synonyms: ["weeds", "invasive plants", "noxious weeds", "poison ivy", "ragweed", "garlic mustard", "knotweed", "buckthorn", "dog-strangling vine"],
    relatedQuestions: ["What plants are prohibited in Toronto?", "How do I identify an invasive plant?"],
    sourceText:
      "Toronto Municipal Code Chapter 489 addresses turfgrass and prohibited plants. The Prohibited Plants Identifier covers a set of prohibited/invasive plants with seasonal appearance and safe removal methods.",
    plainLanguageAnswer:
      "Toronto identifies a set of prohibited and invasive plants (such as giant hogweed, poison ivy, ragweed, garlic mustard, knotweed, and buckthorn) that residents are expected to control. Use the Prohibited Plants Identifier to recognize them, compare seasonal appearance, and learn safe, resident-friendly removal methods.",
    relatedChapter: "Chapter 489 — Turfgrass and Prohibited Plants",
    relatedSections: [],
    officialSources: [
      { title: "Chapter 489 (PDF)", type: CODE, url: "https://www.toronto.ca/legdocs/municode/1184_489.pdf" },
      { title: "Ontario Invasive Plant Council", type: "Reference", url: "https://www.ontarioinvasiveplants.ca/" },
    ],
    internalUrl: "/prohibited-plants",
    lastReviewed: REVIEWED,
    cautionLevel: "general",
    nextSteps: ["Open the Prohibited Plants Identifier to recognize and safely remove plants."],
  },

  // ─── TMC Chapters: Graffiti, Dust, Property Standards, Heating/Vital ──────
  {
    id: "graffiti-private-property",
    title: "What should I do about graffiti on private property?",
    type: "TMC Chapter",
    topic: "Graffiti",
    summary:
      "Property owners are generally required to remove graffiti within the timeframe set by the City after notice (Chapter 485).",
    keywords: ["graffiti", "tagging", "spray paint", "vandalism", "remove graffiti", "485"],
    synonyms: ["graffiti", "tagging", "spray paint", "vandalism"],
    relatedQuestions: ["How do I report graffiti?", "Who removes graffiti on private property?"],
    sourceText:
      "Toronto Municipal Code Chapter 485 (Graffiti) generally requires owners to remove graffiti within the timeframe set by the City after notice. Graffiti on public property can be reported to 311.",
    plainLanguageAnswer:
      "Under the Graffiti by-law (Chapter 485), property owners are generally required to remove graffiti within the time the City sets after giving notice. If you see graffiti on City property, or want to report graffiti, you can submit a 311 service request. See the Chapter 485 page for a simple summary.",
    relatedChapter: "Chapter 485 — Graffiti",
    relatedSections: [],
    officialSources: [
      { title: "Chapter 485 (PDF)", type: CODE, url: "https://www.toronto.ca/legdocs/municode/1184_485.pdf" },
      SRC_311,
    ],
    internalUrl: "/tmc-chapters/485",
    lastReviewed: REVIEWED,
    cautionLevel: "general",
    nextSteps: ["Open the Chapter 485 page.", "Report graffiti through a 311 service request."],
  },
  {
    id: "dust-construction",
    title: "What bylaw applies to dust from construction?",
    type: "TMC Chapter",
    topic: "Dust",
    summary:
      "Toronto regulates dust and particulate matter from properties and activities; owners/operators are expected to prevent dust from leaving the site.",
    keywords: ["dust", "construction dust", "particulate", "demolition dust", "417"],
    synonyms: ["dust control", "construction dust", "demolition dust", "airborne dust"],
    relatedQuestions: ["How do I report construction dust?", "What rule covers dust from a site?"],
    sourceText:
      "Toronto's Dust by-law (Municipal Code Chapter 417) addresses dust and particulate matter from properties and activities, requiring reasonable measures to prevent dust from migrating off-site.",
    plainLanguageAnswer:
      "Dust from a property or activity (including construction) is addressed by the City's Dust by-law (Chapter 417). Owners and operators are generally expected to take reasonable measures so dust doesn't leave the site. See the Chapter 417 page, and report ongoing dust concerns through 311.",
    relatedChapter: "Chapter 417 — Dust",
    relatedSections: [],
    officialSources: [
      { title: "Chapter 417, Dust (PDF)", type: CODE, url: "https://www.toronto.ca/legdocs/bylaws/2020/law0417.pdf" },
      SRC_311,
    ],
    internalUrl: "/tmc-chapters/417",
    lastReviewed: REVIEWED,
    cautionLevel: "general",
    nextSteps: ["Open the Chapter 417 (Dust) page.", "Report ongoing dust through a 311 service request."],
  },
  {
    id: "property-standards",
    title: "What are property standards (repairs and maintenance)?",
    type: "TMC Chapter",
    topic: "Property Standards",
    summary:
      "Property Standards (Chapter 629) set minimum maintenance requirements for buildings and yards — structural elements, exterior, and safety.",
    keywords: ["property standards", "repairs", "maintenance", "broken window", "unsafe stairs", "mould", "leaking", "629"],
    synonyms: ["repairs", "maintenance", "broken window", "unsafe stairs", "mould", "leaking ceiling", "disrepair"],
    relatedQuestions: ["What can I do about a building in disrepair?", "Who enforces property maintenance?"],
    sourceText:
      "Toronto Municipal Code Chapter 629 (Property Standards) sets minimum maintenance standards for properties, including structural soundness, exterior condition, and safety elements.",
    plainLanguageAnswer:
      "Property Standards (Chapter 629) set the City's minimum maintenance requirements for buildings and yards — things like structural soundness, exterior condition, windows, and safe stairs. If a property may not meet these standards, you can submit a 311 service request under Property Standards. See the Chapter 629 page for what's covered.",
    relatedChapter: "Chapter 629 — Property Standards",
    relatedSections: [],
    officialSources: [
      { title: "Chapter 629 (PDF)", type: CODE, url: "https://www.toronto.ca/legdocs/municode/1184_629.pdf" },
      SRC_311,
    ],
    internalUrl: "/tmc-chapters/629",
    lastReviewed: REVIEWED,
    cautionLevel: "general",
    nextSteps: ["Open the Chapter 629 (Property Standards) page.", "Submit a 311 service request under Property Standards."],
  },
  {
    id: "heating-no-heat-rental",
    title: "What applies to no heat in a rental unit?",
    type: "TMC Chapter",
    topic: "Heating",
    summary:
      "Toronto requires landlords to provide adequate heat during the heating season (Chapter 497), and vital services like heat are protected (Chapter 835).",
    keywords: ["heat", "heating", "no heat", "rental", "landlord", "temperature", "497", "vital services", "835"],
    synonyms: ["no heat", "heating", "cold apartment", "landlord heat", "vital services", "heat in winter"],
    relatedQuestions: ["What can I do if my rental has no heat?", "What temperature must a rental be?"],
    sourceText:
      "Toronto Municipal Code Chapter 497 (Heating) requires adequate heat be provided during the heating season. Chapter 835 (Vital Services) addresses the discontinuance of vital services such as heat to a rental.",
    plainLanguageAnswer:
      "During the heating season, Toronto's Heating by-law (Chapter 497) requires that adequate heat be provided in a rental, and the Vital Services by-law (Chapter 835) protects services like heat from being cut off. If a rental has inadequate heat, you can submit a 311 service request. See the Chapter 497 and 835 pages.",
    relatedChapter: "Chapter 497 — Heating",
    relatedSections: [],
    officialSources: [
      { title: "Chapter 497, Heating (PDF)", type: CODE, url: "https://www.toronto.ca/legdocs/municode/1184_497.pdf" },
      { title: "Chapter 835, Vital Services (PDF)", type: CODE, url: "https://www.toronto.ca/legdocs/municode/1184_835.pdf" },
      SRC_311,
    ],
    internalUrl: "/tmc-chapters/497",
    lastReviewed: REVIEWED,
    cautionLevel: "general",
    nextSteps: ["Open the Chapter 497 (Heating) page.", "Submit a 311 service request for inadequate heat."],
  },
  {
    id: "waste-dumping",
    title: "What about littering or illegal dumping?",
    type: "TMC Chapter",
    topic: "Waste",
    summary:
      "Littering and illegal dumping of refuse are prohibited, and owners must keep property free of refuse (Chapter 548).",
    keywords: ["littering", "dumping", "illegal dumping", "garbage", "refuse", "waste", "548"],
    synonyms: ["dumping", "littering", "illegal dumping", "trash", "garbage dumping"],
    relatedQuestions: ["How do I report illegal dumping?", "Who is responsible for dumped garbage?"],
    sourceText:
      "Toronto Municipal Code Chapter 548 (Littering and Dumping of Refuse) prohibits littering and illegal dumping and requires owners to keep property free of refuse.",
    plainLanguageAnswer:
      "Littering and illegal dumping are prohibited under Chapter 548, and owners must keep property free of refuse. To report dumped waste, submit a 311 service request under Litter / Illegal Dumping. See the Chapter 548 page for a summary.",
    relatedChapter: "Chapter 548 — Littering and Dumping of Refuse",
    relatedSections: [],
    officialSources: [
      { title: "Chapter 548 (PDF)", type: CODE, url: "https://www.toronto.ca/legdocs/municode/1184_548.pdf" },
      SRC_311,
    ],
    internalUrl: "/tmc-chapters/548",
    lastReviewed: REVIEWED,
    cautionLevel: "general",
    nextSteps: ["Open the Chapter 548 page.", "Report illegal dumping through 311."],
  },

  // ─── Noise (Coming Soon placeholder) ─────────────────────────────────────
  {
    id: "noise-coming-soon",
    title: "Noise complaints",
    type: "Coming Soon",
    topic: "Noise",
    summary: "Noise Complaints content is currently under development.",
    keywords: ["noise", "loud", "sound", "amplified", "music", "construction noise", "barking"],
    synonyms: ["loud noise", "noisy neighbour", "amplified sound", "music noise", "construction noise"],
    relatedQuestions: ["What can I do about a noisy neighbour?", "What is the noise bylaw?"],
    sourceText: "Content under development.",
    plainLanguageAnswer: "Noise Complaints content is currently under development.",
    relatedChapter: null,
    relatedSections: [],
    officialSources: [SRC_311],
    internalUrl: "/noise-complaints",
    lastReviewed: REVIEWED,
    cautionLevel: "coming-soon",
    nextSteps: [],
  },
];

// ─── Synonym groups: expand a query with resident-friendly alternatives ──────
//  Each group maps a set of equivalent phrases. When any phrase appears in a
//  query, the others are added as soft matches. Keep these source-neutral.
export const synonymGroups: string[][] = [
  ["fence", "fencing", "fence height", "backyard fence", "front yard fence", "privacy fence", "boundary fence"],
  ["pool fence", "pool enclosure", "pool gate", "pool barrier", "swimming pool fence"],
  ["self closing", "self latching", "gate latch", "locked gate"],
  ["hot tub", "spa", "whirlpool"],
  ["soft landscaping", "landscaping", "green space", "vegetation", "garden bed", "planting bed"],
  ["pave", "paving", "interlock", "pavers", "hard surface", "concrete", "asphalt"],
  ["front yard parking", "parking pad", "park on lawn", "park on grass", "front pad"],
  ["artificial turf", "fake grass", "artificial grass"],
  ["setback", "lot line", "how close can i build", "building distance"],
  ["air conditioner", "ac", "ac unit", "hvac", "heat pump", "condenser"],
  ["shed", "detached garage", "accessory structure", "outbuilding", "ancillary building"],
  ["giant hogweed", "hogweed"],
  ["prohibited plants", "invasive plants", "weeds", "noxious weeds", "invasive species"],
  ["graffiti", "tagging", "spray paint", "vandalism"],
  ["dust", "construction dust", "demolition dust", "particulate"],
  ["property standards", "repairs", "maintenance", "disrepair", "broken window", "unsafe stairs", "mould"],
  ["heat", "heating", "no heat", "vital services", "cold apartment"],
  ["littering", "dumping", "illegal dumping", "garbage", "refuse"],
  ["noise", "loud", "amplified", "construction noise", "barking"],
  ["zoning", "zone", "by-law 569-2013"],
  ["former north york", "north york zoning", "by-law 7625", "former municipal zoning", "township of north york"],
];
