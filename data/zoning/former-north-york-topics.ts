// ─────────────────────────────────────────────────────────────────────────────
//  Toronto Bylaw Guide — Former North York Zoning (V5.1)
//
//  A plain-language INDEX and OVERVIEW of the Township of North York Zoning
//  By-law No. 7625 (1952, as amended), drawn from the City of Toronto Archives
//  copy. The original is a historical OCR'd document — this file curates the
//  clearly verifiable structure (table of contents, zone categories, and key
//  definitions with their exact section numbers).
//
//  RULES:
//   • Do NOT fabricate section numbers or requirements.
//   • Definition section numbers below (2.x) are taken verbatim from the source.
//   • Zone-specific numeric requirements (exact yard distances, coverage %,
//     parking counts) live in the document's denser zone sections and are NOT
//     reproduced as exact figures — those are flagged `needsVerification: true`.
//   • This is a reference index only — never a property-specific determination.
// ─────────────────────────────────────────────────────────────────────────────

export const FNY_BYLAW = {
  number: "7625",
  title: "Township of North York Zoning By-law No. 7625",
  shortTitle: "Former North York Zoning By-law 7625",
  enacted: "1952 (as amended by By-laws 7956, 8365, 8428)",
  sourceNote:
    "Source: City of Toronto Archives — North York By-law Number 07625 (Box 396058). The original is a historical archival document; figures should be confirmed against the official record.",
  sectionCount: 37,
} as const;

// ── Official source links ───────────────────────────────────────────────────
export const ZONING_MAP_VIEWER_URL = "https://map.toronto.ca/maps/map.jsp?app=ZBL_CONSULT";
export const OFFICIAL_ZONING_SOURCE_URL =
  "https://www.toronto.ca/city-government/planning-development/zoning-by-law-preliminary-zoning-reviews/";
export const TORONTO_ARCHIVES_URL =
  "https://www.toronto.ca/city-government/accountability-operations-customer-service/access-city-information-or-records/city-of-toronto-archives/";

// ── Table of contents / index (verified from the by-law's contents page) ─────
export interface FnyIndexEntry {
  section: string;
  symbol?: string;
  title: string;
  page: number;
  group: string;
}

export const fnyIndex: FnyIndexEntry[] = [
  { section: "1", title: "Title", page: 1, group: "General" },
  { section: "2", title: "Definitions", page: 1, group: "General" },
  { section: "3", title: "Schedules", page: 17, group: "General" },
  { section: "4", title: "Districts", page: 17, group: "General" },
  { section: "5", title: "Zones", page: 19, group: "General" },
  { section: "6", title: "District Provisions", page: 22, group: "General" },
  { section: "7", symbol: "R", title: "General Provisions for One-Family Detached Dwelling Zone", page: 27, group: "Residential" },
  { section: "8", symbol: "R-R", title: "Rural Residential Zones", page: 33, group: "Residential" },
  { section: "9", symbol: "R-A", title: "Suburban Residential Zones", page: 38, group: "Residential" },
  { section: "10", symbol: "R1", title: "One-Family Detached Dwelling — First Density Zone", page: 44, group: "Residential" },
  { section: "11", symbol: "R2", title: "One-Family Detached Dwelling — Second Density Zone", page: 46, group: "Residential" },
  { section: "12", symbol: "R3", title: "One-Family Detached Dwelling — Third Density Zone", page: 49, group: "Residential" },
  { section: "13", symbol: "R4", title: "One-Family Detached Dwelling — Fourth Density Zone", page: 55, group: "Residential" },
  { section: "14", symbol: "R5", title: "One-Family Detached Dwelling — Fifth Density Zone", page: 58, group: "Residential" },
  { section: "15", symbol: "RM", title: "General Provisions for Multiple-Family Dwelling Zones", page: 61, group: "Residential" },
  { section: "16", symbol: "RM1", title: "Multiple-Family Dwelling — First Density Zone", page: 64, group: "Residential" },
  { section: "17", symbol: "RM2", title: "Multiple-Family Dwelling — Second Density Zone", page: 67, group: "Residential" },
  { section: "18", symbol: "RM3", title: "Multiple-Family Dwelling — Third Density Zone", page: 70, group: "Residential" },
  { section: "19", symbol: "RM4", title: "Multiple-Family Dwelling — Fourth Density Zone", page: 75, group: "Residential" },
  { section: "20", symbol: "RM5", title: "Multiple-Family Dwelling — Fifth Density Zone", page: 80, group: "Residential" },
  { section: "21", symbol: "G", title: "Greenbelt Zone", page: 86, group: "Open Space & Greenbelt" },
  { section: "22", symbol: "C", title: "General Provisions for Commercial Zones", page: 88, group: "Commercial" },
  { section: "23", symbol: "C1", title: "General Commercial Zones", page: 95, group: "Commercial" },
  { section: "24", symbol: "C2", title: "Local Shopping Centre Zone", page: 100, group: "Commercial" },
  { section: "25", symbol: "C3", title: "District Shopping Centre", page: 104, group: "Commercial" },
  { section: "26", symbol: "C4", title: "Restricted Commercial Zone", page: 107, group: "Commercial" },
  { section: "27", symbol: "C5", title: "Service Shop Zone", page: 110, group: "Commercial" },
  { section: "28", symbol: "M", title: "General Provisions for Industrial Zones", page: 114, group: "Industrial" },
  { section: "29", symbol: "M1–M4", title: "Warehousing, Manufacturing, Storage Yard, Railway Zones", page: 120, group: "Industrial" },
  { section: "30", symbol: "A", title: "Airport Hazard Area Zones", page: 122, group: "Industrial" },
  { section: "31", symbol: "O", title: "General Provisions for Open Space Zones", page: 123, group: "Open Space & Greenbelt" },
  { section: "32", symbol: "O1", title: "Public Park Zone", page: 125, group: "Open Space & Greenbelt" },
  { section: "33", symbol: "O2", title: "Private Open Space Zone", page: 126, group: "Open Space & Greenbelt" },
  { section: "34", symbol: "O3", title: "Semi-Public Open Space Zone", page: 127, group: "Open Space & Greenbelt" },
  { section: "35", title: "Administration", page: 128, group: "General" },
  { section: "36", title: "Continuation of Existing Regulations", page: 129, group: "General" },
  { section: "37", title: "Validity", page: 130, group: "General" },
];

export const fnyIndexGroups = [
  "General",
  "Residential",
  "Commercial",
  "Industrial",
  "Open Space & Greenbelt",
] as const;

// ── Zone categories (verified from the by-law's contents) ────────────────────
export interface FnyZone {
  code: string;
  name: string;
  section: string;
  category: string;
}

export const fnyZones: FnyZone[] = [
  { code: "R", name: "One-Family Detached Dwelling (general provisions)", section: "7", category: "Residential" },
  { code: "R-R", name: "Rural Residential", section: "8", category: "Residential" },
  { code: "R-A", name: "Suburban Residential", section: "9", category: "Residential" },
  { code: "R1–R5", name: "One-Family Detached Dwelling — First to Fifth Density", section: "10–14", category: "Residential" },
  { code: "RM", name: "Multiple-Family Dwelling (general provisions)", section: "15", category: "Residential" },
  { code: "RM1–RM5", name: "Multiple-Family Dwelling — First to Fifth Density", section: "16–20", category: "Residential" },
  { code: "G", name: "Greenbelt", section: "21", category: "Open Space & Greenbelt" },
  { code: "C1", name: "General Commercial", section: "23", category: "Commercial" },
  { code: "C2", name: "Local Shopping Centre", section: "24", category: "Commercial" },
  { code: "C3", name: "District Shopping Centre", section: "25", category: "Commercial" },
  { code: "C4", name: "Restricted Commercial", section: "26", category: "Commercial" },
  { code: "C5", name: "Service Shop", section: "27", category: "Commercial" },
  { code: "M1–M4", name: "Warehousing, Manufacturing, Storage Yard, Railway", section: "29", category: "Industrial" },
  { code: "A", name: "Airport Hazard Area", section: "30", category: "Industrial" },
  { code: "O1", name: "Public Park", section: "32", category: "Open Space & Greenbelt" },
  { code: "O2", name: "Private Open Space", section: "33", category: "Open Space & Greenbelt" },
  { code: "O3", name: "Semi-Public Open Space", section: "34", category: "Open Space & Greenbelt" },
];

// ── Key definitions (verbatim section numbers from Section 2) ─────────────────
export interface FnyDefinition {
  term: string;
  section: string;
  text: string;
}

export const fnyDefinitions: FnyDefinition[] = [
  { term: "Yard", section: "2.82", text: "Any open, uncovered, unoccupied space appurtenant to a building, with the exception of a court. The minimum horizontal measurement is used in determining yard measurements." },
  { term: "Yard, Front", section: "2.82.1", text: "A yard extending across the full width of the lot between the front line and the nearest wall of any building or structure on the lot." },
  { term: "Yard, Rear", section: "2.82.2", text: "A yard extending across the full width of the lot between the rear lot line and the nearest wall of any building or structure on the lot." },
  { term: "Yard, Side", section: "2.82.3", text: "A yard extending from the front yard to the rear yard between the side lot line and the nearest wall of any building or structure on the lot." },
  { term: "Lot Area", section: "2.52.1", text: "The total horizontal area within the lot lines of a lot." },
  { term: "Lot Frontage", section: "2.52.6", text: "The horizontal distance between the side lot lines; where the side lot lines are not parallel, measured on a line twenty-five (25) feet back from the front lot line and parallel to it." },
  { term: "Lot, Depth of", section: "2.52.4", text: "The horizontal distance between the front and rear lot lines (where not parallel, the line joining their mid-points)." },
  { term: "Coverage", section: "2.28", text: "That percentage of the land or lot area covered by buildings." },
  { term: "Floor Area", section: "2.39", text: "The maximum habitable area within the outside walls, excluding (for a dwelling) any private garage, porch, verandah, sunroom, unfinished attic and basement." },
  { term: "Building Height", section: "2.10", text: "The vertical distance between the established grade and the highest point of the roof surface (for a flat roof), or the mean height level between eaves and ridge (for a gabled, hip or gambrel roof)." },
  { term: "Parking Space", section: "2.61.1", text: "An area of not less than two hundred (200) square feet, exclusive of driveways or aisles, for the temporary parking or storage of motor vehicles." },
  { term: "Garage, Private", section: "2.41.1", text: "A building (or part) not over one storey or fifteen (15) feet in height, used for the storage of private passenger motor vehicles, with no servicing for profit and no commercial vehicles." },
  { term: "Set-back", section: "2.74", text: "When used in reference to an upper portion of a building or structure, the setting back of the outer walls of that upper portion from the building line(s). (Note: this defines an upper-storey set-back, which differs from a yard requirement.)" },
  { term: "Dwelling, One-Family Detached", section: "2.32.5", text: "A separate building accommodating a single family and having front, rear and two (2) side yards." },
  { term: "Grade, Established", section: "2.42", text: "The average elevation of the surface of the ground at the base of a structure or main front wall (or the municipal sidewalk grade where provided)." },
];

// ── Topic detail cards ───────────────────────────────────────────────────────
export interface FnyQuestion {
  question: string;
  answer: string;
}

export interface FnyTopic {
  id: string;
  slug: string;
  title: string;
  category: string;
  /** Verified section reference, or null if only the definition is verifiable. */
  sectionReference: string | null;
  sectionTitle: string | null;
  plainLanguageSummary: string;
  sourceExcerpt: string;
  keywords: string[];
  commonQuestions: FnyQuestion[];
  practicalNotes: string[];
  /** True when the EXACT figures for a zone are not verifiable from the source. */
  needsVerification: boolean;
}

const VERIFY_NOTE = "Confirm the property's applicable zone and the exact figure in the relevant section of By-law 7625 with official City resources before relying on this summary.";

export const fnyTopics: FnyTopic[] = [
  {
    id: "fny-front-yard",
    slug: "front-yard",
    title: "Front Yard",
    category: "Yards & Setbacks",
    sectionReference: "Definition 2.82.1",
    sectionTitle: "Yard, Front",
    plainLanguageSummary:
      "The front yard is the open space across the full width of the lot between the front lot line (street) and the nearest wall of the building. Each zone (R1–R5, etc.) sets its own minimum front-yard depth.",
    sourceExcerpt:
      "“Yard, Front” (2.82.1): a yard extending across the full width of the lot between the front line and the nearest wall of any building or structure on the lot.",
    keywords: ["front yard", "yard", "setback", "front", "lot line"],
    commonQuestions: [
      {
        question: "How do I know which front yard rule applies?",
        answer:
          "The definition of a front yard is fixed by the by-law (2.82.1), but the minimum front-yard depth depends on the specific zone that applies to the property (for example R1 vs R4). Those exact figures are in the zone sections (Sections 7–20) and should be confirmed with the official record.",
      },
    ],
    practicalNotes: [
      "Confirm the property's zone first using the Zoning Map Viewer.",
      "The exact minimum front-yard depth depends on the zone — verify with official City resources.",
    ],
    needsVerification: true,
  },
  {
    id: "fny-side-yard",
    slug: "side-yard",
    title: "Side Yard",
    category: "Yards & Setbacks",
    sectionReference: "Definition 2.82.3",
    sectionTitle: "Yard, Side",
    plainLanguageSummary:
      "A side yard runs from the front yard to the rear yard, between the side lot line and the nearest wall of the building. The required minimum side-yard width varies by zone.",
    sourceExcerpt:
      "“Yard, Side” (2.82.3): a yard extending from the front yard to the rear yard between the side lot line and the nearest wall of any building or structure on the lot.",
    keywords: ["side yard", "yard", "setback", "side", "lot line"],
    commonQuestions: [
      {
        question: "What is the minimum side yard width?",
        answer:
          "The by-law defines what a side yard is (2.82.3), but the minimum width is set per zone in the zone sections. Confirm the exact figure for the applicable zone with official City resources.",
      },
    ],
    practicalNotes: [
      "Side-yard width requirements differ between zones and density categories.",
      "A one-family detached dwelling is defined as having two side yards (2.32.5).",
    ],
    needsVerification: true,
  },
  {
    id: "fny-rear-yard",
    slug: "rear-yard",
    title: "Rear Yard",
    category: "Yards & Setbacks",
    sectionReference: "Definition 2.82.2",
    sectionTitle: "Yard, Rear",
    plainLanguageSummary:
      "The rear yard is the open space across the full width of the lot between the rear lot line and the nearest wall of the building. The minimum rear-yard depth is set by the applicable zone.",
    sourceExcerpt:
      "“Yard, Rear” (2.82.2): a yard extending across the full width of the lot between the rear lot line and the nearest wall of any building or structure on the lot.",
    keywords: ["rear yard", "back yard", "yard", "setback", "rear", "lot line"],
    commonQuestions: [
      {
        question: "How big does the rear yard have to be?",
        answer:
          "The definition is fixed (2.82.2); the minimum rear-yard depth is a zone-specific figure found in the zone sections. Verify the exact requirement for the applicable zone with official City resources.",
      },
    ],
    practicalNotes: [VERIFY_NOTE],
    needsVerification: true,
  },
  {
    id: "fny-lot-frontage",
    slug: "lot-frontage",
    title: "Lot Frontage & Lot Area",
    category: "Lot & Building Requirements",
    sectionReference: "Definitions 2.52.6 / 2.52.1",
    sectionTitle: "Lot Frontage; Lot Area",
    plainLanguageSummary:
      "Lot frontage is the distance between the side lot lines (measured 25 feet back from the front lot line where they are not parallel). Lot area is the total horizontal area within the lot lines. Minimum lot frontage and area are set per zone.",
    sourceExcerpt:
      "“Lot Frontage” (2.52.6): the horizontal distance between the side lot lines… measured on a line twenty-five (25) feet back from the front lot line. “Lot Area” (2.52.1): the total horizontal area within the lot lines of a lot.",
    keywords: ["lot frontage", "lot area", "lot size", "lot width", "frontage", "lot"],
    commonQuestions: [
      {
        question: "What is the minimum lot frontage in a residential zone?",
        answer:
          "The by-law defines how frontage and area are measured (2.52.6, 2.52.1), but the minimum figures are set per zone (R1–R5, etc.). Confirm the exact minimums for the applicable zone with official City resources.",
      },
    ],
    practicalNotes: [VERIFY_NOTE],
    needsVerification: true,
  },
  {
    id: "fny-lot-coverage",
    slug: "lot-coverage",
    title: "Lot Coverage",
    category: "Lot & Building Requirements",
    sectionReference: "Definition 2.28",
    sectionTitle: "Coverage",
    plainLanguageSummary:
      "Coverage is the percentage of the lot area covered by buildings. Each zone sets a maximum lot coverage. The definition is fixed by the by-law; the maximum percentage depends on the zone.",
    sourceExcerpt: "“Coverage” (2.28): that percentage of the land or lot area covered by buildings.",
    keywords: ["lot coverage", "coverage", "building coverage", "footprint"],
    commonQuestions: [
      {
        question: "How much of my lot can be covered by buildings?",
        answer:
          "The by-law defines coverage as the percentage of the lot covered by buildings (2.28). The maximum allowed percentage is set per zone in the zone sections — confirm the exact figure for the applicable zone.",
      },
    ],
    practicalNotes: [VERIFY_NOTE],
    needsVerification: true,
  },
  {
    id: "fny-building-height",
    slug: "building-height",
    title: "Building Height",
    category: "Lot & Building Requirements",
    sectionReference: "Definition 2.10",
    sectionTitle: "Building Height",
    plainLanguageSummary:
      "Building height is measured from the established grade to the highest point of a flat roof (or the mean level between eaves and ridge for a pitched roof). The maximum permitted height is set by the applicable zone.",
    sourceExcerpt:
      "“Building Height” (2.10): the vertical distance between the established grade and the highest point of the roof surface (flat roof), or the mean height between eaves and ridge (gabled/hip/gambrel roof).",
    keywords: ["building height", "height", "storeys", "roof height"],
    commonQuestions: [
      {
        question: "What is the maximum building height?",
        answer:
          "The by-law defines how height is measured (2.10). The maximum height limit is a zone-specific figure in the zone sections — verify the exact limit for the applicable zone.",
      },
    ],
    practicalNotes: [VERIFY_NOTE],
    needsVerification: true,
  },
  {
    id: "fny-parking",
    slug: "parking",
    title: "Parking",
    category: "Parking & Driveways",
    sectionReference: "Definition 2.61.1",
    sectionTitle: "Parking Space",
    plainLanguageSummary:
      "A parking space is defined as an area of not less than 200 square feet (excluding driveways and aisles). The number of required parking spaces and where they may be located depend on the use and the applicable zone.",
    sourceExcerpt:
      "“Parking Space” (2.61.1): an area of not less than two hundred (200) square feet, exclusive of driveways or aisles, for the temporary parking or storage of motor vehicles.",
    keywords: ["parking", "parking space", "parking station", "driveway", "garage parking"],
    commonQuestions: [
      {
        question: "How many parking spaces are required?",
        answer:
          "The by-law fixes the minimum size of a parking space (200 sq ft, 2.61.1), but the number required and the rules for parking stations depend on the use and zone. Confirm the requirements for the applicable zone with official City resources.",
      },
    ],
    practicalNotes: [
      "A defined parking space is at least 200 sq ft, excluding driveways/aisles (2.61.1).",
      "The required count and location are zone- and use-specific — verify with official City resources.",
    ],
    needsVerification: true,
  },
  {
    id: "fny-private-garage",
    slug: "private-garage",
    title: "Private Garage & Accessory Buildings",
    category: "Accessory Structures",
    sectionReference: "Definition 2.41.1",
    sectionTitle: "Garage, Private",
    plainLanguageSummary:
      "A private garage is a building (or part) not over one storey or 15 feet high, used to store private passenger vehicles (no servicing for profit, no commercial vehicles). Accessory buildings have their own placement and size rules per zone.",
    sourceExcerpt:
      "“Garage, Private” (2.41.1): a building or part thereof not over one storey or fifteen (15) feet in height, used for the storage of private passenger motor vehicles…",
    keywords: ["garage", "private garage", "accessory building", "detached garage", "shed", "accessory structure"],
    commonQuestions: [
      {
        question: "How big can a private garage be?",
        answer:
          "A private garage is defined as not over one storey or 15 feet in height (2.41.1). Other limits — location, setbacks, and coverage for accessory buildings — are set in the zone sections; confirm with official City resources.",
      },
    ],
    practicalNotes: [VERIFY_NOTE],
    needsVerification: true,
  },
  {
    id: "fny-permitted-residential-uses",
    slug: "permitted-residential-uses",
    title: "Permitted Residential Uses",
    category: "Permitted Uses",
    sectionReference: "Definition 2.69; Sections 7–20",
    sectionTitle: "Residential Use, One-Family Detached",
    plainLanguageSummary:
      "The by-law sets out residential building types and uses across the R, R-R, R-A, R1–R5 (one-family detached) and RM, RM1–RM5 (multiple-family) zones. A one-family detached residential use is the use of land for a one-family detached dwelling, and may include an accessory building.",
    sourceExcerpt:
      "“Residential Use, One-Family Detached” (2.69): the use of land for the erection of a one-family detached dwelling; may include an accessory building not used for human habitation, but not an apartment, multiple dwelling, hotel, lodging house, etc.",
    keywords: ["permitted use", "residential use", "one family", "detached", "multiple family", "apartment", "zoning use"],
    commonQuestions: [
      {
        question: "What can I build or use a residential lot for?",
        answer:
          "The permitted residential building types and uses depend on the zone (R1–R5 for one-family detached; RM1–RM5 for multiple-family). The by-law defines the categories (2.69, 2.69.1); confirm what is permitted for the specific zone with official City resources.",
      },
    ],
    practicalNotes: [VERIFY_NOTE],
    needsVerification: true,
  },
];

export const fnyTopicCategories = [
  "All",
  "Yards & Setbacks",
  "Lot & Building Requirements",
  "Parking & Driveways",
  "Accessory Structures",
  "Permitted Uses",
] as const;

// ── How-to steps ─────────────────────────────────────────────────────────────
export const fnyHowToSteps = [
  "Start with the property address.",
  "Check the current zoning using the Zoning Map Viewer.",
  "Confirm whether former North York zoning provisions may be relevant to the property.",
  "Search or browse the index and topics below.",
  "Review the relevant section references.",
  "Confirm requirements through official City resources or City staff.",
];
