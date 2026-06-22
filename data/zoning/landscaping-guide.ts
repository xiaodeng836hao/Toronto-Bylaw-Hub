// ─────────────────────────────────────────────────────────────────────────────
//  Toronto Bylaw Guide — Landscaping Guide content (V4.3)
//
//  Simple content for the dedicated /landscaping page. Soft-landscaping
//  rules and section references are drawn from Zoning By-law 569-2013, Chapter
//  10.5 (General regulations for the Residential Zone category) — specifically
//  Clause 10.5.50.10 Landscaping — which applies across the Residential Zone (R),
//  Residential Detached Zone (RD), and the other residential zones.
//
//  This is summarized for general reference only — NOT a legal interpretation or
//  a property-specific determination. Section numbers are taken from the official
//  by-law. Where an exact value cannot be verified from the source, the content
//  says "Needs source verification" rather than inventing a number.
// ─────────────────────────────────────────────────────────────────────────────

// ── Official source links ────────────────────────────────────────────────────
export const COMMITTEE_OF_ADJUSTMENT_URL =
  "https://www.toronto.ca/city-government/planning-development/committee-of-adjustment/";
export const COMMITTEE_OF_ADJUSTMENT_FORMS_URL =
  "https://www.toronto.ca/city-government/planning-development/committee-of-adjustment/forms-submission-guidelines-fees/";
export const ZONING_MAP_VIEWER_URL = "https://map.toronto.ca/maps/map.jsp?app=ZBL_CONSULT";
export const OFFICIAL_ZONING_SOURCE_URL =
  "https://www.toronto.ca/city-government/planning-development/zoning-by-law-preliminary-zoning-reviews/";
export const CHAPTER_10_5_SOURCE_URL =
  "https://www.toronto.ca/zoning/bylaw_amendments/ZBL_NewProvision_Chapter10.htm";

// ── Definitions ──────────────────────────────────────────────────────────────
export interface LandscapeDefinition {
  term: string;
  plain: string;
  /** Verbatim or near-verbatim wording drawn from the zoning by-law source. */
  sourceExcerpt: string;
  sourceNote: string;
}

export const definitions: LandscapeDefinition[] = [
  {
    term: "Landscaping",
    plain:
      "“Landscaping” is the broad term. It covers living, growing material (trees, shrubs, flowers, vegetables, grass) and also certain decorative hard features such as walkways, patios, and decorative stonework. It does not include driveways or parking areas.",
    sourceExcerpt:
      "“landscaping means trees, shrubs, flowers, vegetables and other vegetation, decorative stonework, walkways, patios, screening or other horticultural or landscape architectural elements or any combination of these. Landscaping does not include driveways or parking areas and directly associated elements such as curbs or retaining walls.”",
    sourceNote: "Wording as it appears in Zoning By-law 569-2013 (definition of landscaping).",
  },
  {
    term: "Soft Landscaping",
    plain:
      "“Soft landscaping” is the narrower, greener term. It means permeable, living, planted ground — grass, gardens, shrubs, trees, and other vegetation. It does NOT include hard surfaces such as driveways, parking areas, decorative stonework, walkways, or patios.",
    sourceExcerpt:
      "“soft landscaping means trees, shrubs, grass, flowers, vegetables and other vegetation but does not include hard surfaced areas such as, but not limited to, driveways, parking areas, decorative stonework, walkways, patios, screening or other landscape architectural elements.”",
    sourceNote: "Wording as it appears in Zoning By-law 569-2013 (definition of soft landscaping).",
  },
];

// Lists for the “What is soft landscaping?” section.
export const softLandscapingExamples = [
  "Grass and lawn / turf (living)",
  "Garden beds and planting areas",
  "Shrubs and hedges",
  "Trees",
  "Groundcover plants",
  "Soil and mulch planting beds",
  "Other permeable, planted landscaped areas",
];

export const notSoftLandscapingExamples = [
  "Concrete",
  "Asphalt",
  "Interlocking pavers / brick paving",
  "Stone paving and decorative stonework",
  "Driveways and parking pads",
  "Patios",
  "Walkways",
  "Decks and platforms",
  "Other hard, paved, or built surfaces",
];

// Note on gravel and artificial turf — handled cautiously because the by-law
// wording does not list them by name.
export const cautionNote =
  "The by-law defines soft landscaping by what it is (living, planted vegetation) and gives examples of hard surfaces it excludes. It does not list every material by name. Gravel and artificial turf, for example, are not living vegetation, so they may not be counted as soft landscaping — but the final interpretation depends on the official definition and the specific site. Always check the definition in the official Zoning By-law.";

// ── Yard sections ────────────────────────────────────────────────────────────
export interface YardProvision {
  chapter: string;
  section: string;
  title: string;
  /** Simple explanation of the rule. */
  plainRule: string;
  /** Short summarized source note / excerpt. */
  sourceNote: string;
  verified: boolean;
}

export interface YardQA {
  question: string;
  answer: string;
}

export interface YardSection {
  id: string;
  title: string;
  intro: string;
  whyItMatters: string;
  applicableZones: string[];
  provisions: YardProvision[];
  whatToMeasure: string[];
  questions: YardQA[];
}

const RES_ZONES = [
  "Residential Zone (R)",
  "Residential Detached Zone (RD)",
  "Other residential zones (RM, RS, RT, RA …)",
];

export const yardSections: YardSection[] = [
  {
    id: "front-yard",
    title: "Front Yard Soft Landscaping",
    intro:
      "Front yard soft landscaping is the planted, green portion of the yard between the front of your house and the front lot line (street). The zoning by-law limits how much of the front yard can be paved — both as overall landscaping and as soft (living, planted) landscaping.",
    whyItMatters:
      "Front yard rules protect the streetscape, help rainwater soak into the ground instead of running off, and keep neighbourhoods green. They directly limit how much of a front yard you can pave for parking or hard surfacing.",
    applicableZones: RES_ZONES,
    provisions: [
      {
        chapter: "Chapter 10.5",
        section: "10.5.50.10(1)",
        title: "Front Yard Landscaping — by lot frontage",
        plainRule:
          "On a lot with a detached house, semi-detached house, duplex, triplex, fourplex or townhouse: lots under 6.0 m frontage must keep the whole front yard as landscaping (excluding a permitted driveway or parking pad); lots 6.0 m to under 15.0 m must keep at least 50% as landscaping; lots 15.0 m or wider must keep at least 60% as landscaping.",
        sourceNote:
          "By-law 569-2013, 10.5.50.10(1)(A)–(C), Residential Zone category.",
        verified: true,
      },
      {
        chapter: "Chapter 10.5",
        section: "10.5.50.10(1)(D)",
        title: "Front Yard Soft Landscaping — 75% minimum",
        plainRule:
          "At least 75% of the required front yard landscaping must be soft landscaping. And if a lot has no permitted driveway in the front yard, at least 75% of the front yard itself must be soft landscaping.",
        sourceNote:
          "By-law 569-2013, 10.5.50.10(1)(D), Residential Zone category.",
        verified: true,
      },
      {
        chapter: "Chapter 10.5",
        section: "10.5.50.10(6)",
        title: "Exclusion for permitted encroachments",
        plainRule:
          "When the landscaping percentages are calculated, the area of a required setback covered by a structure that is permitted to encroach (such as certain porches or steps under 10.5.40.60) is excluded from the calculation.",
        sourceNote:
          "By-law 569-2013, 10.5.50.10(6), Residential Zone category.",
        verified: true,
      },
    ],
    whatToMeasure: [
      "Total front yard area (from the front wall of the house to the front lot line, across the lot width)",
      "Your lot frontage (width at the front lot line) — this sets which percentage applies",
      "Existing driveway / parking pad area in the front yard",
      "Existing soft (planted) area vs. hard-surfaced area",
      "Any walkways, porches, or steps in the front yard",
    ],
    questions: [
      {
        question: "Can I pave my entire front yard?",
        answer:
          "Generally no. Depending on your frontage, at least 50% (6.0–<15.0 m) or 60% (15.0 m or wider) of the front yard must stay as landscaping — and on lots under 6.0 m the whole front yard, except a permitted driveway or parking pad, must be landscaping. On top of that, at least 75% of that required landscaping must be soft (living, planted) landscaping.",
      },
      {
        question: "Does a driveway count as soft landscaping?",
        answer:
          "No. The by-law's definition of soft landscaping specifically excludes driveways and parking areas. A driveway is a hard surface, so it does not count toward the soft-landscaping minimum.",
      },
      {
        question: "Does a walkway count as soft landscaping?",
        answer:
          "A walkway is a hard surface, so it is generally not counted as soft landscaping. (It may count as part of the broader “landscaping” category, which includes walkways and patios — but not toward the soft-landscaping portion.)",
      },
      {
        question: "Does grass beside a driveway count?",
        answer:
          "Yes — living grass and planted areas beside a driveway are soft landscaping. The driveway surface itself is not, but the green strips and beds around it are.",
      },
      {
        question: "What if my front yard was paved before I bought the house?",
        answer:
          "An existing condition is not automatically legal, but it also is not automatically a violation. If the paving does not meet current requirements and you want to keep it, you may need to look at a Committee of Adjustment minor variance. Start by confirming your zone and measuring the soft vs. hard areas.",
      },
      {
        question: "What if I want to keep the current condition?",
        answer:
          "If your landscaping does not meet the zoning requirement and you want to keep or legalize it, the usual path is a minor variance application to the Committee of Adjustment. Approval is not guaranteed — see the Committee of Adjustment section below.",
      },
    ],
  },
  {
    id: "side-yard",
    title: "Side Yard Soft Landscaping",
    intro:
      "The side yard is the strip of land between the side of your house and the side lot line. The by-law's main soft-landscaping percentage for side yards applies to corner lots (the side yard that faces a street). For interior side yards, the source does not set a specific soft-landscaping percentage, so other rules — setbacks, encroachments, parking, and structure placement — usually govern what you can do there.",
    whyItMatters:
      "On a corner lot the side yard is highly visible from the flanking street, so the by-law treats it much like a front yard. On interior lots, the side yard is narrow and is mostly controlled by setback and access rules rather than a landscaping percentage.",
    applicableZones: RES_ZONES,
    provisions: [
      {
        chapter: "Chapter 10.5",
        section: "10.5.50.10(2)",
        title: "Side Yard Landscaping — corner lots",
        plainRule:
          "On a corner lot with a detached house, semi-detached house, duplex, triplex, fourplex or townhouse, at least 60% of the side yard abutting a street must be landscaping, and at least 75% of that required landscaping must be soft landscaping.",
        sourceNote:
          "By-law 569-2013, 10.5.50.10(2), Residential Zone category.",
        verified: true,
      },
      {
        chapter: "Chapter 10.5 / 10.10 / 10.20",
        section: "Needs source verification",
        title: "Interior side yard soft-landscaping percentage",
        plainRule:
          "The source does not set a specific soft-landscaping percentage for an interior (non-street-facing) side yard. Instead, an interior side yard is shaped by the side-yard setback, the rules for what may encroach into that setback (such as air conditioners, eaves, or steps), and where structures and parking may be placed.",
        sourceNote:
          "No interior side-yard soft-landscaping percentage was found in the source. Confirm against the official by-law for your zone and lot.",
        verified: false,
      },
    ],
    whatToMeasure: [
      "Whether your lot is a corner lot (has a side yard facing a street)",
      "Width of the side yard (house wall to side lot line)",
      "For a corner lot: total area of the street-facing side yard",
      "Hard surfaces in the side yard (walkway, pad, pavers)",
      "Location of any air conditioner, heat pump, or shed in the side yard",
    ],
    questions: [
      {
        question: "Can I hard-surface the side yard?",
        answer:
          "On a corner lot, the street-facing side yard must keep at least 60% as landscaping (75% of that soft), so it cannot be fully hard-surfaced. For an interior side yard, no specific soft-landscaping percentage was found in the source — but setbacks, permitted encroachments, drainage, and parking rules still apply, so confirm before paving.",
      },
      {
        question: "Can I install pavers along the side of my house?",
        answer:
          "Often yes for a reasonable walkway on an interior side yard, but pavers are a hard surface (not soft landscaping). On a corner lot they would count against the 60% landscaping / 75% soft-landscaping requirement for the street-facing side yard.",
      },
      {
        question: "Does the side yard need planting?",
        answer:
          "On a corner lot, yes — most of the street-facing side yard must be soft landscaping. On an interior side yard, the source does not require a specific planted percentage (marked “Needs source verification”), though other rules apply.",
      },
      {
        question: "Can an air conditioner or shed affect landscaping compliance?",
        answer:
          "It can. A/C units, heat pumps, and sheds occupy yard area and have their own placement and setback rules. They reduce the area available for soft landscaping and may interact with the encroachment exclusion in 10.5.50.10(6). Check the placement rules for that equipment or structure.",
      },
      {
        question: "What measurements should I check?",
        answer:
          "Whether the lot is a corner lot, the side yard width, the street-facing side yard area (if a corner lot), and how much of it is hard-surfaced versus planted.",
      },
    ],
  },
  {
    id: "rear-yard",
    title: "Rear Yard Soft Landscaping",
    intro:
      "The rear yard is the area behind your house between the rear wall and the rear lot line. For most homes (anything other than an apartment building), the by-law sets a minimum percentage of the rear yard that must be kept as soft landscaping.",
    whyItMatters:
      "Rear yard soft landscaping keeps green, permeable space for drainage, trees, and amenity area. It limits how much of a backyard can be covered with patio, deck, or paving.",
    applicableZones: RES_ZONES,
    provisions: [
      {
        chapter: "Chapter 10.5",
        section: "10.5.50.10(3)",
        title: "Rear Yard Soft Landscaping — by lot frontage",
        plainRule:
          "For a residential building other than an apartment building, at least 50% of the rear yard must be soft landscaping if the lot frontage is greater than 6.0 m, and at least 25% if the lot frontage is 6.0 m or less.",
        sourceNote:
          "By-law 569-2013, 10.5.50.10(3), Residential Zone category.",
        verified: true,
      },
      {
        chapter: "Chapter 10.5",
        section: "10.5.50.10(7)",
        title: "Swimming pools deemed soft landscaping",
        plainRule:
          "For the rear-yard soft-landscaping calculation, the water surface area of an outdoor swimming pool (or a similar water-holding structure such as a fountain or artificial pond) is included as soft landscaping.",
        sourceNote:
          "By-law 569-2013, 10.5.50.10(7), Residential Zone category.",
        verified: true,
      },
    ],
    whatToMeasure: [
      "Total rear yard area (rear wall of the house to the rear lot line, across the lot width)",
      "Your lot frontage — over 6.0 m needs 50% soft; 6.0 m or less needs 25%",
      "Existing soft (planted) area vs. hard surfaces (patio, deck, pad, pavers)",
      "Footprint of any shed, detached garage, or accessory structure",
      "Water surface area of any pool (counts toward soft landscaping)",
    ],
    questions: [
      {
        question: "Can I cover my whole backyard with patio stones?",
        answer:
          "No. For most homes, at least 50% of the rear yard (or 25% on lots 6.0 m wide or less) must remain soft landscaping. Patio stones are a hard surface, so covering the entire rear yard would not meet that minimum.",
      },
      {
        question: "Does a deck count as soft landscaping?",
        answer:
          "No. A deck is a built, hard surface, so it does not count toward the soft-landscaping minimum and reduces the planted area available in the rear yard.",
      },
      {
        question: "Does a shed reduce soft landscaping area?",
        answer:
          "Yes. A shed (or detached garage) occupies ground that is no longer soft landscaping, so it reduces the planted area counted toward the rear-yard minimum. Accessory structures also have their own coverage and setback limits.",
      },
      {
        question: "Does a swimming pool affect rear yard soft landscaping?",
        answer:
          "The by-law specifically includes the water surface area of an outdoor pool as soft landscaping for the rear-yard calculation (10.5.50.10(7)). The pool deck and surrounding paving, however, are hard surfaces.",
      },
      {
        question: "Does artificial turf count?",
        answer:
          "Artificial turf is not living vegetation, so it may not be counted as soft landscaping. The by-law defines soft landscaping as grass and other vegetation and excludes hard surfaced areas. Treat artificial turf cautiously and confirm with the official definition or City staff.",
      },
      {
        question: "What if my rear yard was already hard-surfaced?",
        answer:
          "An existing hard-surfaced rear yard is not automatically legal. If it does not meet the soft-landscaping minimum and you want to keep it, a Committee of Adjustment minor variance is the usual path — and approval is not guaranteed.",
      },
    ],
  },
];

// ── Soft vs hard comparison (visual module) ──────────────────────────────────
export const softVsHard = {
  soft: ["Grass / lawn", "Planting beds", "Shrubs & hedges", "Trees", "Mulch planting beds", "Swimming pool (water surface)", "Permeable planted areas"],
  hard: ["Driveway", "Concrete", "Asphalt", "Patio stones", "Parking pad", "Deck", "Artificial grass", "Solid paving"],
};

// ── Committee of Adjustment / Minor Variance ─────────────────────────────────
export const minorVariancePoints = [
  "A minor variance is a request for permission to vary from a requirement of the zoning by-law.",
  "The Committee of Adjustment considers applications for certain zoning changes, including minor variances.",
  "The applicant submits a Committee of Adjustment application.",
  "Applications are submitted digitally by email, following the City's official instructions.",
  "A complete application helps with review and scheduling.",
  "Fees apply and should be checked on the official City page, because they may change.",
  "The process may involve public notice and a hearing.",
  "The Committee decides the application using the required planning tests.",
  "Approval is not guaranteed; if approved, conditions may apply.",
  "If the application is refused or appealed, additional steps may follow.",
];

export const fourTests = [
  "Does the proposal maintain the general intent and purpose of the Official Plan?",
  "Does the proposal maintain the general intent and purpose of the Zoning By-law?",
  "Is the proposal appropriate for the development of the land or building?",
  "Is the requested variance minor?",
];

// ── What to prepare ──────────────────────────────────────────────────────────
export const whatToPrepare = [
  "Property address",
  "Zoning category from the Zoning Map Viewer",
  "Survey or site plan, if available",
  "Front yard, side yard, and rear yard measurements",
  "Total yard area for each yard",
  "Soft landscaped area measurements",
  "Hard surface area measurements",
  "Driveway / parking area dimensions",
  "Photos of existing yard conditions",
  "Proposed changes or drawings",
  "Any previous permits, approvals, or Committee of Adjustment decisions",
];

// ── Page-level FAQ (accordion) ───────────────────────────────────────────────
export interface FaqItem {
  question: string;
  answer: string;
}

export const faqItems: FaqItem[] = [
  {
    question: "What is soft landscaping?",
    answer:
      "Soft landscaping is permeable, living, planted ground — grass, gardens, shrubs, trees, and other vegetation. The by-law's definition excludes hard surfaced areas such as driveways, parking areas, decorative stonework, walkways, and patios.",
  },
  {
    question: "Does my driveway count as soft landscaping?",
    answer:
      "No. The by-law definition of soft landscaping specifically excludes driveways and parking areas. A driveway is a hard surface.",
  },
  {
    question: "Do pavers count as soft landscaping?",
    answer:
      "No. Interlocking pavers and stone paving are hard surfaces, so they are not soft landscaping. They may fall under the broader “landscaping” category but not the soft-landscaping portion.",
  },
  {
    question: "Does artificial turf count?",
    answer:
      "Artificial turf is not living vegetation. The by-law defines soft landscaping as grass and other vegetation, so artificial turf may not be counted. Confirm with the official definition or City staff before relying on it.",
  },
  {
    question: "Does a deck count as soft landscaping?",
    answer:
      "No. A deck is a built, hard surface and does not count toward the soft-landscaping minimum.",
  },
  {
    question: "Does a garden bed count as soft landscaping?",
    answer:
      "Yes. Garden beds, planting areas, shrubs, and trees are living, planted areas, so they count as soft landscaping.",
  },
  {
    question: "Can I pave my entire front yard?",
    answer:
      "Generally no. Depending on frontage, 50–60% of the front yard must stay as landscaping (or all of it except a permitted driveway on very narrow lots), and at least 75% of that landscaping must be soft landscaping.",
  },
  {
    question: "Are front yard and rear yard requirements different?",
    answer:
      "Yes. The front yard uses landscaping percentages by frontage (50% or 60%) plus a 75% soft-landscaping share. The rear yard uses a direct soft-landscaping percentage (50% if frontage is over 6.0 m, 25% if 6.0 m or less).",
  },
  {
    question: "Does zoning treat Residential Zone and Residential Detached Zone differently?",
    answer:
      "The Clause 10.5.50.10 landscaping rules apply across the Residential Zone category, which includes both the Residential Zone (R) and the Residential Detached Zone (RD). The landscaping percentages themselves come from this shared Chapter 10.5 clause. Other rules (setbacks, permitted uses) can differ by zone, so always confirm your specific zone.",
  },
  {
    question: "What if my landscaping was already like this when I bought the house?",
    answer:
      "An existing condition is not automatically legal or illegal. If it does not meet current requirements and you want to keep it, a Committee of Adjustment minor variance is the usual route. Start by confirming your zone and measuring soft vs. hard areas.",
  },
  {
    question: "What is a minor variance?",
    answer:
      "A minor variance is a request to the Committee of Adjustment for permission to vary from a zoning by-law requirement — for example, to keep a landscaping condition that does not meet the standard percentage.",
  },
  {
    question: "Does applying for a minor variance guarantee approval?",
    answer:
      "No. The Committee decides each application using four planning tests, and approval is not guaranteed. If approved, conditions may apply.",
  },
  {
    question: "Should I check the Zoning Map Viewer first?",
    answer:
      "Yes. The Zoning Map Viewer tells you your property's zoning category, which is the starting point for confirming which requirements apply to your lot.",
  },
];
