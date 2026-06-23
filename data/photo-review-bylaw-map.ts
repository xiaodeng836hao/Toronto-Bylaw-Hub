// ─────────────────────────────────────────────────────────────────────────────
//  Toronto Bylaw Guide — Photo Review Bylaw Match Map (V6.2)
//
//  Centralized, source-based mapping from visible photo conditions to the most
//  relevant Toronto Municipal Code chapter / Zoning By-law topic. The image AI
//  describes ONLY what is visible (observations + issue labels); this map — NOT
//  the AI — decides which bylaw chapter and section may apply.
//
//  RULES (see CONTENT_MAINTENANCE.md):
//   • Source-based only. No legal conclusions or official determinations.
//   • Do NOT invent section numbers. Use a verified reference, or set
//     sectionStatus: "needs-verification" and show the standard message.
//   • Cautious wording only ("possible", "may relate to", "appears to").
//   • Noise stays a "Coming Soon" placeholder — no detailed guidance.
//
//  This module is isomorphic (no server-only imports) so the matcher can run
//  both server-side (after AI vision) and client-side (description fallback).
// ─────────────────────────────────────────────────────────────────────────────

export type SectionStatus = "verified" | "needs-verification";

export interface BylawMatchSection {
  /** Verified section reference (e.g. "§ 447-1.3C") or the needs-verification message. */
  section: string;
  title: string;
  plainLanguageSummary: string;
}

export interface OfficialSourceLink {
  title: string;
  url: string;
}

export interface BylawMatchCategory {
  /** Stable id; mirrors a photoReviewIssues value where one exists. */
  id: string;
  issueCategory: string;
  /** Display chapter, e.g. "Chapter 485 — Graffiti". */
  chapter: string;
  /** Slug for /tmc-chapters/<slug>, or null for Zoning By-law topics. */
  chapterSlug: string | null;
  /** Internal BylawGuide page this maps to. */
  internalUrl: string;
  guideLabel: string;
  /** Question to pre-fill the Ask BylawGuide page. */
  askQuery: string;
  /** Lowercase keywords matched against AI observations + user description. */
  triggerKeywords: string[];
  /** Canonical AI issue labels that map to this category. */
  aiLabels: string[];
  relatedSections: BylawMatchSection[];
  sectionStatus: SectionStatus;
  explanation: string;
  evidenceChecklist: string[];
  nextSteps: string[];
  officialSources: OfficialSourceLink[];
  /** Only surfaced when a pool / pool gate is actually visible. */
  poolOnly?: boolean;
  /** Noise → Coming Soon placeholder only. */
  comingSoon?: boolean;
}

const MUNICODE = (n: string) => `https://www.toronto.ca/legdocs/municode/1184_${n}.pdf`;
const SRC_311: OfficialSourceLink = {
  title: "Toronto 311 — Create a Service Request",
  url: "https://www.toronto.ca/home/311-toronto-at-your-service/create-a-service-request/",
};
const SRC_ZONING: OfficialSourceLink = {
  title: "Zoning By-law & Preliminary Zoning Reviews",
  url: "https://www.toronto.ca/city-government/planning-development/zoning-by-law-preliminary-zoning-reviews/",
};

/** Standard text shown when a section cannot be confidently verified. */
export const NEEDS_VERIFICATION_TEXT =
  "Section reference needs verification from the official bylaw.";

const NEEDS_VERIFICATION = (chapterName: string): BylawMatchSection => ({
  section: NEEDS_VERIFICATION_TEXT,
  title: `${chapterName} — verify exact section`,
  plainLanguageSummary:
    "A specific section could not be confidently matched from the photo. Review the chapter and confirm the exact provision against the official bylaw.",
});

// ─────────────────────────────────────────────────────────────────────────────
//  The match map. Order is the default display priority for equal-confidence
//  matches. Pool enclosure precedes the general fence entry.
// ─────────────────────────────────────────────────────────────────────────────

export const photoReviewBylawMap: BylawMatchCategory[] = [
  {
    id: "graffiti",
    issueCategory: "Graffiti",
    chapter: "Chapter 485 — Graffiti",
    chapterSlug: "485",
    internalUrl: "/tmc-chapters/485",
    guideLabel: "Open Chapter 485 — Graffiti",
    askQuery: "What should I do about graffiti on private property?",
    triggerKeywords: [
      "graffiti", "spray paint", "spray-paint", "marking", "markings", "tag", "tags",
      "tagging", "writing on wall", "scrawl", "vandalism", "painted wall", "scribble",
    ],
    aiLabels: ["graffiti"],
    relatedSections: [NEEDS_VERIFICATION("Chapter 485")],
    sectionStatus: "needs-verification",
    explanation:
      "The photo appears to show markings on an exterior surface that may relate to graffiti removal requirements for private property.",
    evidenceChecklist: [
      "Close-up photo of the marking",
      "Wider photo showing the location and surface",
      "Property address",
      "Date observed and whether the marking is still present",
    ],
    nextSteps: [
      "Review the Chapter 485 — Graffiti page",
      "Check the official City source for Chapter 485",
      "Use Toronto 311 if appropriate",
    ],
    officialSources: [{ title: "Toronto Municipal Code — Chapter 485 (Graffiti)", url: MUNICODE("485") }, SRC_311],
  },
  {
    id: "waste-dumping",
    issueCategory: "Waste / Littering / Dumping",
    chapter: "Chapter 548 — Littering and Dumping of Refuse",
    chapterSlug: "548",
    internalUrl: "/tmc-chapters/548",
    guideLabel: "Open Chapter 548 — Littering and Dumping",
    askQuery: "What about littering or illegal dumping?",
    triggerKeywords: [
      "garbage", "waste", "trash", "refuse", "debris", "dumped", "dumping", "litter",
      "furniture", "mattress", "couch", "sofa", "garbage bag", "garbage bags", "bin",
      "bins", "overflowing", "construction debris", "junk", "discarded",
    ],
    aiLabels: ["waste", "littering", "dumping"],
    relatedSections: [NEEDS_VERIFICATION("Chapter 548")],
    sectionStatus: "needs-verification",
    explanation:
      "The photo may show dumped items or accumulated refuse. This may relate to littering and dumping rules, and (for waste set-out) the residential or commercial waste collection chapters.",
    evidenceChecklist: [
      "Photo of the waste or debris",
      "Location on the property (front, side, rear) or address",
      "Type of waste (furniture, bags, appliances, construction debris)",
      "Whether the dumping appears to be ongoing",
    ],
    nextSteps: [
      "Review the Chapter 548 — Littering and Dumping page",
      "For set-out / collection issues, see Chapter 846 (residential) or 841 (commercial)",
      "Use Toronto 311 under Litter / Illegal Dumping if appropriate",
    ],
    officialSources: [
      { title: "Toronto Municipal Code — Chapter 548 (Littering & Dumping)", url: MUNICODE("548") },
      { title: "Toronto Municipal Code — Chapter 846 (Waste, Residential)", url: MUNICODE("846") },
      { title: "Toronto Municipal Code — Chapter 841 (Waste, Commercial)", url: MUNICODE("841") },
      SRC_311,
    ],
  },
  {
    id: "property-standards",
    issueCategory: "Property Standards",
    chapter: "Chapter 629 — Property Standards",
    chapterSlug: "629",
    internalUrl: "/tmc-chapters/629",
    guideLabel: "Open Chapter 629 — Property Standards",
    askQuery: "What are property standards?",
    triggerKeywords: [
      "damaged exterior", "broken window", "broken windows", "unsafe stairs", "deteriorated",
      "porch", "damaged roof", "missing guard", "peeling", "peeling paint", "cladding",
      "siding", "unsafe building", "structural", "crumbling", "rotting", "rot", "boarded window",
      "damaged wall", "exterior wall", "disrepair", "deterioration",
      // Yard landscaping / drainage / grading (§ 629-10, § 629-11):
      "erosion", "eroded", "bare soil", "exposed soil", "bare ground", "washout", "washed out",
      "mud", "muddy", "rutted", "drainage", "grading", "grade", "ponding", "standing water",
      "pooling water", "surface water", "unstable soil", "ground cover", "slope",
    ],
    aiLabels: ["property standards", "erosion", "bare soil", "drainage", "grading", "ponding"],
    relatedSections: [NEEDS_VERIFICATION("Chapter 629")],
    sectionStatus: "needs-verification",
    explanation:
      "The photo may show exterior deterioration (damaged cladding, broken elements, peeling paint, unsafe stairs) or a yard condition such as bare/eroded soil, poor drainage, or pooling water. Yards must generally be graded with suitable ground cover to prevent erosion, unstable soil and recurrent ponding. This may relate to minimum property maintenance standards.",
    evidenceChecklist: [
      "Clear close-up photo of the affected area",
      "Wider photo showing the location on the property",
      "Full property address (and unit number if applicable)",
      "Date you observed the issue",
    ],
    nextSteps: [
      "Review the Chapter 629 — Property Standards page",
      "Check the official City source for Chapter 629",
      "Use Toronto 311 under Property Standards if appropriate",
    ],
    officialSources: [{ title: "Toronto Municipal Code — Chapter 629 (Property Standards)", url: MUNICODE("629") }, SRC_311],
  },
  {
    id: "pool-fence",
    issueCategory: "Pool Fence / Pool Enclosure",
    chapter: "Chapter 447 — Fences (Pool Enclosures)",
    chapterSlug: "447",
    internalUrl: "/pool-fence-guide",
    guideLabel: "Open Pool Fence Guide",
    askQuery: "Does my pool gate need to self-close and self-latch?",
    poolOnly: true,
    triggerKeywords: [
      "swimming pool", "pool", "pool fence", "pool enclosure", "pool gate", "open pool gate",
      "pool access", "temporary pool", "above-ground pool", "inground pool", "pool ladder",
      "pool deck",
    ],
    aiLabels: ["pool fence", "pool enclosure"],
    relatedSections: [
      {
        section: "§ 447-1.3C",
        title: "Pool enclosure gates — self-closing and self-latching",
        plainLanguageSummary:
          "A gate in a pool enclosure must generally be self-closing and self-latching, and kept locked when the pool area is not in use.",
      },
      {
        section: "§ 447-1.3D",
        title: "Pool enclosure minimum height",
        plainLanguageSummary:
          "The enclosure is generally at least 1.2 m on a single residential property (1.8 m for multiple-residential or non-residential).",
      },
      {
        section: "§ 447-1.3E",
        title: "Pool enclosure — non-climbable construction and clearances",
        plainLanguageSummary:
          "The enclosure should be non-climbable, set back from the water's edge, and clear of climbable objects.",
      },
    ],
    sectionStatus: "verified",
    explanation:
      "The photo may show a pool enclosure that does not appear to meet safety requirements, such as a gate that may not self-latch or gaps that appear too large. Verify against the Pool Fence Guide and official sources.",
    evidenceChecklist: [
      "Photo of the gate (showing self-close / self-latch hardware)",
      "Photo of the full enclosure",
      "Photo showing distance from the pool edge",
      "Photo showing any climbable objects beside the fence",
      "Whether the gate self-closes and self-latches",
    ],
    nextSteps: [
      "Open the Pool Fence Guide and run the enclosure checklist",
      "Check Chapter 447 (§ 447-1.3) on the official City source",
      "Use Toronto 311 to report a pool safety concern if appropriate",
    ],
    officialSources: [{ title: "Toronto Municipal Code — Chapter 447 (Fences / Pool Enclosures)", url: MUNICODE("447") }, SRC_311],
  },
  {
    id: "fence",
    issueCategory: "Fence",
    chapter: "Chapter 447 — Fences",
    chapterSlug: "447",
    internalUrl: "/tmc-chapters/447",
    guideLabel: "Open Chapter 447 — Fences",
    askQuery: "How high can my fence be?",
    triggerKeywords: [
      "fence", "fencing", "damaged fence", "tall fence", "high fence", "barbed wire",
      "corrugated metal", "sheet metal fence", "fence near driveway", "hedge", "gate",
      "fence post", "chain link", "chain-link", "fence height",
    ],
    aiLabels: ["fence"],
    relatedSections: [
      {
        section: "§ 447-1.2B, Table 1",
        title: "Maximum height of fences",
        plainLanguageSummary:
          "Fence height limits vary by location (front, side, rear yard) and property type; Table 1 sets the maximums.",
      },
      {
        section: "§ 447-1.2A",
        title: "General fence restrictions (prohibited materials)",
        plainLanguageSummary:
          "Some materials, such as barbed wire or sheet/corrugated metal in residential areas, are generally restricted.",
      },
      {
        section: "§ 447-1.2C, D",
        title: "Driveways and visibility",
        plainLanguageSummary:
          "Near a driveway, an open-fence construction may be required so sightlines are not blocked.",
      },
    ],
    sectionStatus: "verified",
    explanation:
      "The photo may show a fence that appears to exceed the Table 1 height for its location, use a restricted material, or affect driveway sightlines. If this is a swimming pool enclosure, the Pool Fence match applies instead.",
    evidenceChecklist: [
      "Photo of the entire fence with an approximate height reference",
      "Photo showing the height and material",
      "Location: front yard / side yard / rear yard",
      "Property address and any driveway or visibility concern",
    ],
    nextSteps: [
      "Open the Chapter 447 Fences page (height table + helper)",
      "Check Chapter 447 on the official City source",
      "Use Toronto 311 if appropriate",
    ],
    officialSources: [{ title: "Toronto Municipal Code — Chapter 447 (Fences)", url: MUNICODE("447") }, SRC_311],
  },
  {
    id: "turfgrass-weeds",
    issueCategory: "Turfgrass / Prohibited Plants",
    chapter: "Chapter 489 — Turfgrass and Prohibited Plants",
    chapterSlug: "489",
    internalUrl: "/prohibited-plants",
    guideLabel: "Open Prohibited Plants",
    askQuery: "What are Toronto's prohibited plants?",
    triggerKeywords: [
      "long grass", "tall grass", "weeds", "overgrown", "overgrown vegetation", "prohibited plant",
      "invasive", "invasive plant", "poison ivy", "giant hogweed", "hogweed", "ragweed",
      "knotweed", "dog-strangling vine", "buckthorn", "garlic mustard", "phragmites",
      "purple loosestrife", "thistle", "unmaintained yard",
    ],
    aiLabels: ["turfgrass", "prohibited plants", "overgrown vegetation"],
    relatedSections: [NEEDS_VERIFICATION("Chapter 489")],
    sectionStatus: "needs-verification",
    explanation:
      "The photo may show turfgrass or weeds above the permitted height, or a plant that may be on Toronto's prohibited plants list. If a plant is clearly visible, the Prohibited Plants identifier can help narrow it down.",
    evidenceChecklist: [
      "Close-up leaf photo",
      "Stem photo",
      "Flower or seed-head photo if present",
      "Wider photo showing the location",
      "Month observed",
    ],
    nextSteps: [
      "Open the Prohibited Plants page (and the plant identifier if a plant is visible)",
      "Check Chapter 489 on the official City source",
      "Use Toronto 311 under Long Grass and Weeds if appropriate",
    ],
    officialSources: [{ title: "Toronto Municipal Code — Chapter 489 (Turfgrass & Prohibited Plants)", url: MUNICODE("489") }, SRC_311],
  },
  {
    id: "dust",
    issueCategory: "Dust",
    chapter: "Chapter 417 — Dust",
    chapterSlug: "417",
    internalUrl: "/tmc-chapters/417",
    guideLabel: "Open Chapter 417 — Dust",
    askQuery: "What bylaw applies to dust from construction?",
    triggerKeywords: [
      "dust", "airborne dust", "construction dust", "loose soil", "dirt tracking", "dusty",
      "dirt cloud", "sand cloud", "particulate",
    ],
    aiLabels: ["dust"],
    relatedSections: [NEEDS_VERIFICATION("Chapter 417")],
    sectionStatus: "needs-verification",
    explanation:
      "The photo may show dust leaving a property and affecting neighbours. This may relate to dust-control responsibilities for property owners.",
    evidenceChecklist: [
      "Photo or video showing the dust",
      "Location and source if known",
      "Dates and times observed",
    ],
    nextSteps: [
      "Review the Chapter 417 — Dust page",
      "Check the official City source for Chapter 417",
      "Use Toronto 311 about a dust nuisance if appropriate",
    ],
    officialSources: [
      { title: "Toronto Code — Chapter 417 (Dust)", url: "https://www.toronto.ca/legdocs/bylaws/2020/law0417.pdf" },
      SRC_311,
    ],
  },
  {
    id: "vacant-hazardous",
    issueCategory: "Vacant or Hazardous Property",
    chapter: "Chapter 632 — Vacant or Hazardous Buildings",
    chapterSlug: "632",
    internalUrl: "/tmc-chapters/632",
    guideLabel: "Open Chapter 632 — Vacant or Hazardous Buildings",
    askQuery: "What applies to a vacant or hazardous building?",
    triggerKeywords: [
      "unsecured vacant", "boarded", "boarded up", "boarded property", "open door", "broken entry",
      "unsafe vacant", "hazardous property", "abandoned building", "vacant building", "open window",
      "broken door", "derelict",
    ],
    aiLabels: ["vacant", "hazardous property"],
    relatedSections: [NEEDS_VERIFICATION("Chapter 632")],
    sectionStatus: "needs-verification",
    explanation:
      "The photo may show an unsecured vacant building or a hazardous structure. This may relate to requirements to secure and maintain such buildings to protect public safety.",
    evidenceChecklist: [
      "Photo of the building and the hazard",
      "Property address",
      "Whether the building appears open or unsecured",
    ],
    nextSteps: [
      "Review the Chapter 632 — Vacant or Hazardous Buildings page",
      "Check the official City source for Chapter 632",
      "Use Toronto 311 about a vacant or hazardous building if appropriate",
    ],
    officialSources: [{ title: "Toronto Municipal Code — Chapter 632 (Vacant or Hazardous)", url: MUNICODE("632") }, SRC_311],
  },
  {
    id: "heating",
    issueCategory: "Heating / Vital Services",
    chapter: "Chapter 497 — Heating",
    chapterSlug: "497",
    internalUrl: "/tmc-chapters/497",
    guideLabel: "Open Chapter 497 — Heating",
    askQuery: "What applies to no heat in a rental unit?",
    triggerKeywords: [
      "no heat", "heater", "furnace", "thermostat", "hot water", "disconnected utilities",
      "gas off", "electricity off", "cold unit", "heating", "vital services", "utilities cut",
    ],
    aiLabels: ["heating", "vital services"],
    relatedSections: [NEEDS_VERIFICATION("Chapter 497 / Chapter 835")],
    sectionStatus: "needs-verification",
    explanation:
      "Photos alone cannot confirm temperature or a disconnected service, but if a rental is too cold or a vital service appears cut off, this may relate to the heating and vital services chapters. A dated thermometer photo can help.",
    evidenceChecklist: [
      "Thermometer reading with date, time, and location",
      "Which service is affected (heat, water, electricity, fuel)",
      "When the issue started",
      "Unit address and unit number",
    ],
    nextSteps: [
      "Review the Chapter 497 — Heating page (and Chapter 835 — Vital Services)",
      "Check the official City sources",
      "Use Toronto 311 under Heat / Vital Services if appropriate",
    ],
    officialSources: [
      { title: "Toronto Municipal Code — Chapter 497 (Heating)", url: MUNICODE("497") },
      { title: "Toronto Municipal Code — Chapter 835 (Vital Services)", url: MUNICODE("835") },
      SRC_311,
    ],
  },
  {
    id: "refrigerators",
    issueCategory: "Refrigerators / Appliances",
    chapter: "Chapter 659 — Refrigerators and Other Appliances",
    chapterSlug: "659",
    internalUrl: "/tmc-chapters/659",
    guideLabel: "Open Chapter 659 — Appliances",
    askQuery: "What applies to an abandoned fridge or appliance?",
    triggerKeywords: [
      "abandoned fridge", "abandoned freezer", "refrigerator", "fridge", "freezer", "appliance outside",
      "refrigerator door", "discarded appliance",
    ],
    aiLabels: ["refrigerator", "appliance"],
    relatedSections: [NEEDS_VERIFICATION("Chapter 659")],
    sectionStatus: "needs-verification",
    explanation:
      "The photo may show an abandoned refrigerator, freezer, or appliance left accessible. This may relate to requirements to remove doors or secure such appliances.",
    evidenceChecklist: [
      "Photo of the appliance and its location",
      "Whether the door is still attached",
      "Location or address",
    ],
    nextSteps: [
      "Review the Chapter 659 — Appliances page",
      "Check the official City source for Chapter 659",
      "Use Toronto 311 if appropriate",
    ],
    officialSources: [{ title: "Toronto Municipal Code — Chapter 659 (Refrigerators & Appliances)", url: MUNICODE("659") }, SRC_311],
  },
  {
    id: "clothing-drop-box",
    issueCategory: "Clothing Drop Boxes",
    chapter: "Chapter 395 — Clothing Drop Boxes",
    chapterSlug: "395",
    internalUrl: "/tmc-chapters/395",
    guideLabel: "Open Chapter 395 — Clothing Drop Boxes",
    askQuery: "Do clothing donation bins need a permit?",
    triggerKeywords: [
      "clothing donation", "donation box", "donation bin", "textile bin", "clothing drop box",
      "drop box", "clothing bin",
    ],
    aiLabels: ["clothing drop box"],
    relatedSections: [NEEDS_VERIFICATION("Chapter 395")],
    sectionStatus: "needs-verification",
    explanation:
      "The photo may show a clothing drop box that appears unpermitted, overflowing, or poorly placed. This may relate to the permit and maintenance requirements for these boxes.",
    evidenceChecklist: [
      "Photo of the drop box and its surroundings",
      "Location or address",
      "Whether it is overflowing or damaged",
    ],
    nextSteps: [
      "Review the Chapter 395 — Clothing Drop Boxes page",
      "Check the official City source for Chapter 395",
      "Use Toronto 311 if appropriate",
    ],
    officialSources: [{ title: "Toronto Municipal Code — Chapter 395 (Clothing Drop Boxes)", url: MUNICODE("395") }, SRC_311],
  },
  {
    id: "garage-sale",
    issueCategory: "Garage Sales",
    chapter: "Chapter 480 — Garage Sales",
    chapterSlug: "480",
    internalUrl: "/tmc-chapters/480",
    guideLabel: "Open Chapter 480 — Garage Sales",
    askQuery: "How many garage sales can I have per year?",
    triggerKeywords: [
      "garage sale", "yard sale", "garage sale sign", "sale items on lawn", "rummage sale",
      "moving sale",
    ],
    aiLabels: ["garage sale"],
    relatedSections: [NEEDS_VERIFICATION("Chapter 480")],
    sectionStatus: "needs-verification",
    explanation:
      "The photo may relate to a garage or yard sale that appears to exceed the permitted number per year or operate like an ongoing business.",
    evidenceChecklist: [
      "Photo of the sale or signage",
      "Address",
      "How often sales appear to occur",
    ],
    nextSteps: [
      "Review the Chapter 480 — Garage Sales page",
      "Check the official City source for Chapter 480",
      "Use Toronto 311 if appropriate",
    ],
    officialSources: [{ title: "Toronto Municipal Code — Chapter 480 (Garage Sales)", url: MUNICODE("480") }, SRC_311],
  },
  {
    id: "zoning",
    issueCategory: "Zoning Concern",
    chapter: "Zoning By-law 569-2013",
    chapterSlug: null,
    internalUrl: "/zoning",
    guideLabel: "Open Zoning guide",
    askQuery: "What are the zoning setbacks for my house?",
    triggerKeywords: [
      "front yard parking", "parking pad", "parking on lawn", "hvac", "air conditioner", "heat pump",
      "ac unit", "accessory structure", "shed", "detached garage", "pergola", "landscaping",
      "paved front yard", "paved yard", "setback", "driveway widening", "boulevard parking",
    ],
    aiLabels: [
      "zoning", "front yard parking", "hvac", "air conditioner", "accessory structure",
      "shed", "landscaping",
    ],
    relatedSections: [NEEDS_VERIFICATION("Zoning By-law 569-2013")],
    sectionStatus: "needs-verification",
    explanation:
      "The photo may show a possible zoning or land-use concern such as front-yard parking, a paved yard, an accessory structure, or mechanical equipment placement. Zoning is property-specific and may need a City review.",
    evidenceChecklist: [
      "Photo of the structure, parking, surface, or equipment",
      "Full civic address",
      "Approximate measurements / distance to the property line",
      "Description of the concern",
    ],
    nextSteps: [
      "Open the Zoning guide (and Landscaping page for paved-yard / parking concerns)",
      "Run a preliminary zoning review with the City",
      "Use Toronto 311 under Zoning if appropriate",
    ],
    officialSources: [SRC_ZONING, SRC_311],
  },
  {
    id: "noise",
    issueCategory: "Noise",
    chapter: "Noise Complaints — Coming Soon",
    chapterSlug: null,
    internalUrl: "/noise-complaints",
    guideLabel: "Noise Complaints status",
    askQuery: "Noise complaints",
    comingSoon: true,
    triggerKeywords: ["noise", "loud", "loudspeaker", "amplified", "construction noise", "barking"],
    aiLabels: ["noise"],
    relatedSections: [],
    sectionStatus: "needs-verification",
    explanation:
      "Noise Complaints content is currently under development. Detailed noise guidance is not provided here yet.",
    evidenceChecklist: [],
    nextSteps: ["See the Noise Complaints status page", "Use official City resources for noise concerns"],
    officialSources: [SRC_311],
  },
];

/** Quick lookup by id. */
export function getBylawCategory(id: string): BylawMatchCategory | undefined {
  return photoReviewBylawMap.find((c) => c.id === id);
}
