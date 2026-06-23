// ─────────────────────────────────────────────────────────────────────────────
//  Toronto Bylaw Guide — Parking Zoning Guide content (V6.9)
//
//  Source-based content for the dedicated /zoning/parking page. Parking
//  provisions and section references are drawn from Zoning By-law 569-2013,
//  Chapter 10 (Residential) — specifically:
//    • 10.5.80.10  Location (front-yard / street-yard / rear-yard / commercial
//                  vehicle parking) — VERBATIM transcribed in lib/zoning-chapter10.ts
//    • 10.10.80.40 Access to Parking Space (R zone) — garage entrance / lane access
//    • 10.5.50.10  Landscaping (front-yard paving limits; the by-law's definition
//                  of "landscaping" excludes driveways and parking areas)
//
//  This is summarized for GENERAL REFERENCE ONLY — not a legal interpretation or
//  a property-specific determination. Section numbers are taken from the official
//  by-law. Where the source does not clearly set a rule (e.g. interior side-yard
//  parking, recreational-vehicle size limits, commercial-zone parking lots,
//  driveway widths / parking-space dimensions), the content is flagged
//  "needs-verification" rather than inventing a number or a requirement.
// ─────────────────────────────────────────────────────────────────────────────

import {
  COMMITTEE_OF_ADJUSTMENT_URL,
  COMMITTEE_OF_ADJUSTMENT_FORMS_URL,
  ZONING_MAP_VIEWER_URL,
  OFFICIAL_ZONING_SOURCE_URL,
  CHAPTER_10_5_SOURCE_URL,
  minorVariancePoints,
  fourTests,
} from "./landscaping-guide";

export {
  COMMITTEE_OF_ADJUSTMENT_URL,
  COMMITTEE_OF_ADJUSTMENT_FORMS_URL,
  ZONING_MAP_VIEWER_URL,
  OFFICIAL_ZONING_SOURCE_URL,
  CHAPTER_10_5_SOURCE_URL,
  minorVariancePoints,
  fourTests,
};

export type VerificationStatus = "verified" | "needs-verification";

export type ParkingCategory =
  | "Front Yard Parking"
  | "Side Yard Parking"
  | "Rear Yard Parking"
  | "Commercial Parking"
  | "Recreational Vehicle Parking"
  | "Driveway / Parking Area"
  | "General Parking Zoning";

export interface ParkingSection {
  sectionNumber: string;
  sectionTitle: string;
  /** Verbatim or near-verbatim wording drawn from the zoning by-law source. */
  sourceExcerpt: string;
  plainLanguageSummary: string;
  verificationStatus: VerificationStatus;
}

export interface ParkingQuestion {
  question: string;
  answer: string;
  relatedSections: string[];
}

export interface ParkingIllustration {
  src: string;
  alt: string;
  caption: string;
  width: number;
  height: number;
}

export interface ParkingTopic {
  id: string;
  slug: string;
  title: string;
  category: ParkingCategory;
  plainLanguageSummary: string;
  relevantChapters: string[];
  relevantSections: ParkingSection[];
  keywords: string[];
  commonQuestions: ParkingQuestion[];
  examples: string[];
  whatToPrepare: string[];
  officialSources: Array<{ title: string; url: string }>;
  relatedInternalLinks: Array<{ label: string; url: string }>;
  /** Optional infographic illustrating this topic's rules. */
  illustration?: ParkingIllustration;
}

// Page-level overview infographic (front / side / rear yard parking locations).
export const yardLocationFigure: ParkingIllustration = {
  src: "/images/zoning/parking/yard-location-guide.png",
  alt:
    "Parking Requirements — Residential Zone Yard Location Guide. Four panels: (1) a standard lot diagram labelling front yard, side yards, and rear yard between the lot lines and the building footprint; (2) front yard parking rule — a parking space may not be in the front yard except on a driveway leading to a parking space; (3) corner lot side yard rule — parking is not permitted in a street side yard but may be located in an interior side yard, rear yard, or a building or structure; (4) rear yard parking limit — a maximum of 2 parking spaces may be located outside in the rear yard, for detached houses, semi-detached houses, and duplexes. Reference Zoning By-law 569-2013, 10.5.80.10.",
  caption:
    "Where parking may be located on a residential lot — front, side, and rear yards (By-law 569-2013, 10.5.80.10). Informational reference only.",
  width: 1040,
  height: 1480,
};

// ── Reusable bits ────────────────────────────────────────────────────────────
const RES_CATEGORY = "Residential Zone category (R & RD)";

const OFFICIAL_PARKING_SOURCES = [
  { title: "Official Zoning By-law & Preliminary Reviews", url: OFFICIAL_ZONING_SOURCE_URL },
  { title: "Open Zoning Map Viewer", url: ZONING_MAP_VIEWER_URL },
  { title: "Chapter 10 (Residential)", url: CHAPTER_10_5_SOURCE_URL },
];

const PARKING_SHORT_DISCLAIMER =
  "Parking compliance depends on the exact property, zoning category, layout, vehicle type, and measurements.";

// ── Topic sections ───────────────────────────────────────────────────────────
export const parkingTopics: ParkingTopic[] = [
  // 1 ─ Front Yard Parking ────────────────────────────────────────────────────
  {
    id: "front-yard-parking",
    slug: "front-yard-parking",
    title: "Front Yard Parking",
    category: "Front Yard Parking",
    plainLanguageSummary:
      "“Front yard parking” means parking a vehicle in the yard between the front of the house and the street. In the Residential Zone category, a parking space generally may not be in a front yard or a side yard that faces a street. The main exception is parking on a private driveway that legally leads to a parking space. A paved area does not by itself make parking lawful, and front-yard paving is also limited by the landscaping rules.",
    relevantChapters: ["Zoning By-law 569-2013 — Chapter 10.5", "Chapter 10.10 (R)"],
    relevantSections: [
      {
        sectionNumber: "10.5.80.10(3)",
        sectionTitle: "Street Yard Parking Space",
        sourceExcerpt:
          "In the Residential Zone category, a parking space may not be in a front yard or a side yard abutting a street. This regulation does not apply if a parking space in the front yard is permitted by the City of Toronto under the authority of the City of Toronto Act, 2006, or its predecessor.",
        plainLanguageSummary:
          "A parking space generally may not be in the front yard or a street-facing side yard — unless a front-yard parking space is specifically permitted by the City under the City of Toronto Act.",
        verificationStatus: "verified",
      },
      {
        sectionNumber: "10.5.80.10(4)",
        sectionTitle: "Parking in the Front Yard",
        sourceExcerpt:
          "In the Residential Zone category, for a detached house, a semi-detached house, or a duplex, and for an individual townhouse dwelling unit where a private driveway leads directly to the dwelling unit, vehicles may be parked on the private portion of the driveway leading to a parking space.",
        plainLanguageSummary:
          "For a detached/semi-detached house or duplex (and certain townhouses), vehicles may be parked on the private portion of the driveway that leads to a parking space.",
        verificationStatus: "verified",
      },
      {
        sectionNumber: "10.5.50.10(1)",
        sectionTitle: "Front Yard Landscaping (paving limit)",
        sourceExcerpt:
          "A minimum of 50% of the front yard must be landscaping (60% for lots 15.0 m or wider; the whole front yard, excluding a permitted driveway or parking pad, for lots under 6.0 m), and at least 75% of that required landscaping must be soft landscaping.",
        plainLanguageSummary:
          "Even where a driveway is allowed, the front-yard landscaping minimums limit how much of the front yard can be paved for parking. See the Landscaping Guide.",
        verificationStatus: "verified",
      },
      {
        sectionNumber: "10.10.80.40(1)",
        sectionTitle: "Garage Entrance on Narrow Lots (R zone)",
        sourceExcerpt:
          "Despite regulation 10.5.80.40(1), if a lot in the R zone has a lot frontage of 7.6 metres or less, a vehicle entrance through the front main wall of a building, other than an ancillary building, is not permitted.",
        plainLanguageSummary:
          "In the R zone, on a narrow lot (frontage 7.6 m or less) a garage / vehicle entrance through the front wall of the house is not permitted.",
        verificationStatus: "verified",
      },
    ],
    keywords: [
      "front yard parking", "park on lawn", "park on grass", "front lawn parking",
      "parking pad", "front pad", "driveway", "paved front yard", "widen driveway",
      "driveway widening", "boulevard parking", "front yard driveway",
    ],
    commonQuestions: [
      {
        question: "Can I park in my front yard?",
        answer:
          "Generally no. In the Residential Zone category a parking space may not be in a front yard or a street-facing side yard, unless a front-yard space is specifically permitted by the City. You may park on a private driveway that legally leads to a parking space. Parking on grass or an unpaved front yard is not permitted.",
        relatedSections: ["10.5.80.10(3)", "10.5.80.10(4)"],
      },
      {
        question: "Does a paved front yard mean I can park there?",
        answer:
          "Not automatically. A hard surface does not by itself create a lawful parking space. Parking still has to be on a permitted driveway leading to a parking space, and the front-yard landscaping rules also limit how much of the front yard may be paved.",
        relatedSections: ["10.5.80.10(3)", "10.5.50.10(1)"],
      },
      {
        question: "Does a driveway count differently from a parking pad?",
        answer:
          "The by-law allows parking on the private portion of a driveway that leads to a parking space. A separate “parking pad” is treated cautiously: a paved pad is not automatically a lawful parking space, and a front-yard parking space generally needs to fall within the permitted driveway or be specifically authorized by the City. Confirm your situation before relying on a pad.",
        relatedSections: ["10.5.80.10(3)", "10.5.80.10(4)"],
      },
      {
        question: "What if the parking area existed before I bought the property?",
        answer:
          "An existing condition is not automatically legal, and it is not automatically a violation. Older driveways or pads may still need verification against the current rules. If a non-complying condition is to be kept, a Committee of Adjustment minor variance may be required.",
        relatedSections: ["10.5.80.10(3)"],
      },
      {
        question: "What should I check before widening a driveway?",
        answer:
          "Widening a driveway can run into both the parking-location rules and the front-yard landscaping minimums (which cap how much of the front yard can be paved), and on a narrow R-zone lot a front-wall garage entrance may not be permitted at all. A new or widened front-yard driveway generally needs City approval — confirm before paving.",
        relatedSections: ["10.5.50.10(1)", "10.10.80.40(1)"],
      },
    ],
    examples: [
      "A vehicle parked on the front lawn (no driveway) is generally not a permitted parking location.",
      "Paving part of the front yard to fit a second car may conflict with the front-yard landscaping minimum and usually needs City approval.",
    ],
    whatToPrepare: [
      "Property address and zoning category (from the Zoning Map Viewer)",
      "Whether there is an existing legal driveway leading to a parking space",
      "Front yard dimensions and how much is currently paved vs. soft landscaping",
      "Photos of the front yard surface and any vehicle location",
      "Any previous approvals, permits, or City authorizations for front-yard parking",
    ],
    officialSources: OFFICIAL_PARKING_SOURCES,
    relatedInternalLinks: [
      { label: "Landscaping Guide (front-yard paving limits)", url: "/landscaping" },
      { label: "Zoning Guide", url: "/zoning" },
    ],
  },

  // 2 ─ Side Yard Parking ─────────────────────────────────────────────────────
  {
    id: "side-yard-parking",
    slug: "side-yard-parking",
    title: "Side Yard Parking",
    category: "Side Yard Parking",
    plainLanguageSummary:
      "“Side yard parking” means parking in the strip of land between the side of the house and the side lot line. A parking space may not be in a side yard that faces a street (a flanking side yard on a corner lot). A parking space may, however, be located in an interior side yard — one that does not abut a street — as well as in a rear yard or in a building or structure. Lot layout, setbacks, and lawful access still apply.",
    relevantChapters: ["Zoning By-law 569-2013 — Chapter 10.5", "Chapter 10.10 (R)"],
    relevantSections: [
      {
        sectionNumber: "10.5.80.10(3)",
        sectionTitle: "Street Yard Parking Space",
        sourceExcerpt:
          "In the Residential Zone category, a parking space may not be in a front yard or a side yard abutting a street. ...",
        plainLanguageSummary:
          "A parking space may not be in a side yard that abuts (faces) a street — for example the flanking side yard of a corner lot.",
        verificationStatus: "verified",
      },
      {
        sectionNumber: "10.10.80.40(2)",
        sectionTitle: "Parking Access — Corner Lot / Lane (R zone)",
        sourceExcerpt:
          "On a corner lot, or a lot abutting a lane, vehicle access to any parking space on the lot must be from the flanking street or from the lane.",
        plainLanguageSummary:
          "On a corner lot or a lot that backs onto a lane, parking must be accessed from the flanking street or the lane — which affects where a side-yard parking area could be placed.",
        verificationStatus: "verified",
      },
      {
        sectionNumber: "10.5.80.10",
        sectionTitle: "Interior Side Yard Parking",
        sourceExcerpt:
          "A parking space may be located in an interior side yard or rear yard, or in a building or structure. (A parking space may not be in a front yard or a side yard abutting a street.)",
        plainLanguageSummary:
          "Parking may be located in an interior side yard (one that does not abut a street), as illustrated in the Yard Location Guide above — subject to lot layout, setbacks, and lawful access.",
        verificationStatus: "verified",
      },
    ],
    keywords: [
      "side yard parking", "park beside house", "parking beside house",
      "side driveway", "side yard parking pad", "interlock beside house",
      "gravel side yard", "flanking side yard parking",
    ],
    commonQuestions: [
      {
        question: "Can I park beside my house?",
        answer:
          "Often yes in an interior side yard — a parking space may be located in an interior side yard (one that does not face a street), a rear yard, or a building/structure. It may not be in a side yard that abuts a street (such as a corner-lot flanking side yard). Lot layout, setbacks, and lawful access still apply.",
        relatedSections: ["10.5.80.10"],
      },
      {
        question: "Can I create a parking pad in the side yard?",
        answer:
          "An interior side yard may be used for parking, but a street-facing side yard may not. Any new parking area also has to respect setbacks, drainage, the landscaping minimums, and lawful access — so confirm the layout before building.",
        relatedSections: ["10.5.80.10"],
      },
      {
        question: "Does interlock or gravel beside the house allow parking?",
        answer:
          "No — a hard or gravel surface does not by itself make parking lawful. Parking still has to be on a permitted parking space/driveway, and a street-facing side yard cannot be a parking space at all.",
        relatedSections: ["10.5.80.10(3)"],
      },
      {
        question: "What measurements should I check?",
        answer:
          "Whether the lot is a corner lot (side yard facing a street), the side-yard width, the required side-yard setback for your zone, and the location and access route of any existing or proposed parking area. Exact requirements should be confirmed with the City.",
        relatedSections: ["10.10.80.40(2)"],
      },
    ],
    examples: [
      "A parking space proposed in the flanking (street-facing) side yard of a corner lot is generally not permitted.",
      "A gravel strip beside the house used for parking may need verification against the parking, setback, and access rules.",
    ],
    whatToPrepare: [
      "Whether the lot is a corner lot (a side yard facing a street)",
      "Side yard width and the required side-yard setback for your zone",
      "Location and access route of any existing or proposed side-yard parking",
      "Photos of the side yard surface and any vehicle",
      "Survey or site plan, if available",
    ],
    officialSources: OFFICIAL_PARKING_SOURCES,
    relatedInternalLinks: [
      { label: "Zoning Guide (setbacks)", url: "/zoning?topic=setbacks" },
      { label: "Landscaping Guide (side yard)", url: "/landscaping#side-yard" },
    ],
  },

  // 3 ─ Rear Yard Parking ─────────────────────────────────────────────────────
  {
    id: "rear-yard-parking",
    slug: "rear-yard-parking",
    title: "Rear Yard Parking",
    category: "Rear Yard Parking",
    plainLanguageSummary:
      "“Rear yard parking” means parking behind the house. Unlike the front yard, the by-law expressly allows a limited number of outdoor parking spaces in the rear yard of certain houses. Rear-yard parking still depends on lawful access (often from a lane), the rear-yard soft-landscaping minimum, and the rules for detached garages and accessory structures.",
    relevantChapters: ["Zoning By-law 569-2013 — Chapter 10.5", "Chapter 10.10 (R)"],
    relevantSections: [
      {
        sectionNumber: "10.5.80.10(7)",
        sectionTitle: "Rear Yard Parking Spaces",
        sourceExcerpt:
          "In the Residential Zone category, on a lot with a detached house, a semi-detached house or a duplex, a maximum of 2 parking spaces may be located outside in the rear yard.",
        plainLanguageSummary:
          "On a lot with a detached/semi-detached house or duplex, a maximum of 2 outdoor parking spaces may be located in the rear yard.",
        verificationStatus: "verified",
      },
      {
        sectionNumber: "10.10.80.40(2)",
        sectionTitle: "Parking Access — Corner Lot / Lane (R zone)",
        sourceExcerpt:
          "On a corner lot, or a lot abutting a lane, vehicle access to any parking space on the lot must be from the flanking street or from the lane.",
        plainLanguageSummary:
          "Where the lot backs onto a lane, access to a rear-yard parking space must be from the lane (or, on a corner lot, the flanking street).",
        verificationStatus: "verified",
      },
      {
        sectionNumber: "10.5.50.10(3)",
        sectionTitle: "Rear Yard Soft Landscaping (paving limit)",
        sourceExcerpt:
          "For a residential building other than an apartment building, a minimum of 50% of the rear yard must be soft landscaping if the lot frontage is greater than 6.0 metres (25% if 6.0 metres or less).",
        plainLanguageSummary:
          "A rear yard cannot be fully paved for parking — most homes must keep at least 50% of the rear yard as soft landscaping (25% on very narrow lots).",
        verificationStatus: "verified",
      },
    ],
    keywords: [
      "rear yard parking", "backyard parking", "park in backyard", "back yard parking",
      "rear lane parking", "parking behind house", "rear parking pad",
      "detached garage parking", "two parking spaces rear yard",
    ],
    commonQuestions: [
      {
        question: "Can I park in my backyard?",
        answer:
          "Often yes, within limits. On a lot with a detached/semi-detached house or duplex, up to 2 outdoor parking spaces may be located in the rear yard. Access usually has to be lawful (frequently from a rear lane), and the rear-yard soft-landscaping minimum still applies.",
        relatedSections: ["10.5.80.10(7)", "10.5.50.10(3)"],
      },
      {
        question: "Can I park beside a detached garage?",
        answer:
          "Possibly, but the rear-yard outdoor parking maximum (2 spaces), the soft-landscaping minimum, and the detached-garage/accessory-structure rules all apply. The total parking and structures in the rear yard cannot exceed those limits.",
        relatedSections: ["10.5.80.10(7)", "10.5.50.10(3)"],
      },
      {
        question: "Does a rear lane change the rules?",
        answer:
          "Yes. Where a lot abuts a lane, vehicle access to a parking space must be from the lane (or the flanking street on a corner lot). A rear lane often makes rear-yard parking and lane-access garages the intended layout.",
        relatedSections: ["10.10.80.40(2)"],
      },
      {
        question: "Can a rear yard be fully paved for parking?",
        answer:
          "No. For most homes, at least 50% of the rear yard must remain soft landscaping (25% on lots 6.0 m wide or less), so the rear yard cannot be entirely paved for parking.",
        relatedSections: ["10.5.50.10(3)"],
      },
      {
        question: "Does parking in a rear yard affect landscaping requirements?",
        answer:
          "Yes. A paved parking area is a hard surface and does not count as soft landscaping, so it reduces the planted area counted toward the rear-yard soft-landscaping minimum. See the Landscaping Guide.",
        relatedSections: ["10.5.50.10(3)"],
      },
    ],
    examples: [
      "Three outdoor parking spaces in the rear yard of a detached house would exceed the 2-space maximum.",
      "Paving the entire backyard for parking would fall below the rear-yard soft-landscaping minimum.",
    ],
    whatToPrepare: [
      "Property address and zoning category",
      "Whether the lot abuts a rear lane (access route)",
      "Number and location of existing/proposed rear-yard parking spaces",
      "Rear yard area and how much is soft landscaping vs. hard surface",
      "Footprint of any detached garage or accessory structure",
    ],
    officialSources: OFFICIAL_PARKING_SOURCES,
    relatedInternalLinks: [
      { label: "Landscaping Guide (rear yard)", url: "/landscaping#rear-yard" },
      { label: "Zoning Guide (accessory structures)", url: "/zoning?topic=accessory-structures" },
    ],
  },

  // 4 ─ Commercial Parking ────────────────────────────────────────────────────
  {
    id: "commercial-parking",
    slug: "commercial-parking",
    title: "Commercial Parking",
    category: "Commercial Parking",
    plainLanguageSummary:
      "Commercial parking is treated differently from ordinary residential parking. The Residential Zone category restricts parking and storing commercial vehicles on residential lots — generally allowing them only inside a wholly enclosed building and only when an owner or tenant operates the vehicle, and prohibiting larger commercial/construction vehicles outdoors. Parking on a commercial-zoned property, or running a commercial parking lot, falls under different zoning provisions that need verification against the applicable zone.",
    relevantChapters: ["Zoning By-law 569-2013 — Chapter 10.5"],
    relevantSections: [
      {
        sectionNumber: "10.5.80.10(9)",
        sectionTitle: "Commercial Vehicle Parking Restriction",
        sourceExcerpt:
          "A parking space in the Residential Zone category may be used for a commercial vehicle, if: (A) an owner or tenant of a dwelling unit on the lot is the owner or operator of the vehicle; and (B) it is within a wholly enclosed building.",
        plainLanguageSummary:
          "On a residential lot, a commercial vehicle may only be parked if an owner or tenant operates it AND it is inside a wholly enclosed building.",
        verificationStatus: "verified",
      },
      {
        sectionNumber: "10.5.80.10(10)",
        sectionTitle: "Commercial Vehicle Parking Not Permitted in Yards",
        sourceExcerpt:
          "A parking space located outside of a building in the Residential Zone category may not be used for: (A) commercially licensed vehicles; (B) construction vehicles; (C) dump trucks; (D) agricultural vehicles; (E) repair or towing vehicles; (F) tracked vehicles; (G) vehicles with a traction engine; (H) vehicles designed to run only on rails; and (I) vehicles equipped with more than six wheels, excluding spare wheels.",
        plainLanguageSummary:
          "An outdoor parking space on a residential lot may not be used for commercially licensed vehicles, construction vehicles, dump trucks, agricultural vehicles, tow/repair vehicles, or vehicles with more than six wheels.",
        verificationStatus: "verified",
      },
      {
        sectionNumber: "Needs source verification",
        sectionTitle: "Commercial-zone parking / parking lots",
        sourceExcerpt:
          "Parking requirements for commercial-zoned properties and dedicated parking lots (parking-space counts, loading, access, surfacing, and screening) are set by parking and zone provisions outside the reviewed Chapter 10 (Residential) source.",
        plainLanguageSummary:
          "Commercial parking requirements need verification from the applicable zoning section.",
        verificationStatus: "needs-verification",
      },
    ],
    keywords: [
      "commercial parking", "commercial vehicle", "commercial vehicle parking",
      "work truck", "dump truck", "construction vehicle", "tow truck",
      "vehicle storage", "parking lot", "loading", "business parking",
    ],
    commonQuestions: [
      {
        question: "Can a commercial property use its yard for parking?",
        answer:
          "That falls under the parking and zone provisions for the specific commercial zone, which are outside the reviewed Residential Chapter 10 source. Commercial parking requirements need verification from the applicable zoning section. Use the Zoning Map Viewer to confirm the zone and a preliminary zoning review for details.",
        relatedSections: ["Needs source verification"],
      },
      {
        question: "Can vehicles be stored on a commercial lot?",
        answer:
          "On a residential lot, outdoor storage of commercial/construction vehicles is restricted (see below). For a commercial-zoned lot, vehicle storage depends on the permitted uses and parking provisions for that zone, which need verification.",
        relatedSections: ["10.5.80.10(10)", "Needs source verification"],
      },
      {
        question: "Are loading areas treated differently from parking spaces?",
        answer:
          "Generally yes — loading is regulated separately from parking spaces in the by-law's parking and loading provisions. The reviewed Residential source does not set those details, so loading requirements need verification from the applicable zoning section.",
        relatedSections: ["Needs source verification"],
      },
      {
        question: "What information should a business prepare before checking parking compliance?",
        answer:
          "The property address and zoning category, the permitted use, the number and dimensions of parking and loading spaces, access points, and any site plan or prior approvals. Then confirm with a City preliminary zoning review.",
        relatedSections: ["Needs source verification"],
      },
    ],
    examples: [
      "Parking a dump truck or a vehicle with more than six wheels in a residential driveway is generally not permitted outdoors.",
      "A commercially licensed work van left outdoors on a residential lot may not meet the residential commercial-vehicle restrictions.",
    ],
    whatToPrepare: [
      "Property address and zoning category (residential vs. commercial)",
      "Vehicle type and whether it is commercially licensed",
      "Whether the vehicle is parked indoors (wholly enclosed building) or outdoors",
      "For a business: number/size of parking and loading spaces and access points",
      "Site plan or prior approvals, if available",
    ],
    officialSources: OFFICIAL_PARKING_SOURCES,
    relatedInternalLinks: [
      { label: "Zoning Guide (permitted uses)", url: "/zoning?topic=permitted-uses" },
    ],
    illustration: {
      src: "/images/zoning/parking/commercial-vehicle-guide.png",
      alt:
        "Parking Requirements — Residential Zone Commercial Vehicle Guide. Four panels: (1) when a commercial vehicle is allowed — only if an owner or tenant of a dwelling unit on the lot owns or operates it, and it is parked within a wholly enclosed building; (2) outdoor yard parking not permitted — outside parking spaces in a residential zone may not be used for commercial vehicles in the front, side, or rear yard; (3) vehicles not permitted outside — commercially licensed vehicles, construction vehicles, dump trucks, agricultural vehicles, repair or towing vehicles, tracked vehicles, vehicles with a traction engine, vehicles designed to run only on rails, and vehicles with more than six wheels (excluding spare wheels); (4) quick compliance guide — not permitted parked outside on a driveway or yard, permitted inside a wholly enclosed building. Reference Zoning By-law 569-2013, 10.5.80.10.",
      caption:
        "Commercial vehicles on a residential lot: only inside a wholly enclosed building, never outdoors — with the prohibited vehicle types (By-law 569-2013, 10.5.80.10). Informational reference only.",
      width: 1040,
      height: 1480,
    },
  },

  // 5 ─ Recreational Vehicle Parking ──────────────────────────────────────────
  {
    id: "recreational-vehicle-parking",
    slug: "recreational-vehicle-parking",
    title: "Recreational Vehicle Parking",
    category: "Recreational Vehicle Parking",
    plainLanguageSummary:
      "Recreational vehicles can include RVs, trailers, campers, and boats. They must be stored either in a building or in a rear-yard parking space that is not required for soft landscaping — not in the front yard or on a soft-landscaped area. A maximum of 2 parking spaces on a residential lot may be used for recreational vehicles, and there may be no more than one camper trailer or one boat trailer. The outdoor-vehicle restrictions (for example, the more-than-six-wheels limit) can also apply to larger units.",
    relevantChapters: ["Zoning By-law 569-2013 — Chapter 10.5"],
    relevantSections: [
      {
        sectionNumber: "10.5.80.10(3)",
        sectionTitle: "Street Yard Parking Space",
        sourceExcerpt:
          "In the Residential Zone category, a parking space may not be in a front yard or a side yard abutting a street. ...",
        plainLanguageSummary:
          "A recreational vehicle, like any vehicle, generally may not occupy a parking space in the front yard or a street-facing side yard.",
        verificationStatus: "verified",
      },
      {
        sectionNumber: "10.5.80.10(10)",
        sectionTitle: "Vehicles Not Permitted in Outdoor Yards",
        sourceExcerpt:
          "A parking space located outside of a building in the Residential Zone category may not be used for: ... (I) vehicles equipped with more than six wheels, excluding spare wheels.",
        plainLanguageSummary:
          "The outdoor-vehicle restrictions (including the more-than-six-wheels limit) can apply to larger recreational vehicles and trailers.",
        verificationStatus: "verified",
      },
      {
        sectionNumber: "10.5.80.10",
        sectionTitle: "Recreational Vehicle Storage & Trailer Limit",
        sourceExcerpt:
          "Recreational vehicles must be stored either in a building or in a parking space in the rear yard area that is not required for soft landscaping. A maximum of 2 parking spaces on a residential lot may be used for recreational vehicles. There may be no more than one camper trailer or one boat trailer.",
        plainLanguageSummary:
          "Store recreational vehicles in a building or a rear-yard parking space not required for soft landscaping (not the front yard or a soft-landscaped area). Up to 2 parking spaces may be used for recreational vehicles, and no more than one camper trailer or one boat trailer — as shown in the guide below.",
        verificationStatus: "verified",
      },
    ],
    keywords: [
      "recreational vehicle parking", "rv parking", "rv", "trailer parking", "trailer",
      "camper parking", "camper", "boat parking", "boat", "motorhome",
      "store trailer in yard", "store boat", "vehicle storage",
    ],
    commonQuestions: [
      {
        question: "Can I park an RV in my driveway?",
        answer:
          "Recreational vehicles must be stored in a building or in a rear-yard parking space that is not required for soft landscaping — not in the front yard. A driveway in the front yard is therefore not a permitted storage location for an RV. Larger units may also run into the outdoor-vehicle restrictions (e.g. more than six wheels).",
        relatedSections: ["10.5.80.10"],
      },
      {
        question: "Can I store a trailer in my front yard?",
        answer:
          "No. Recreational vehicles and trailers must be stored in a building or a rear-yard parking space not required for soft landscaping — not in the front yard. There may also be no more than one camper trailer or one boat trailer on the lot.",
        relatedSections: ["10.5.80.10"],
      },
      {
        question: "Can I keep a boat in the side or rear yard?",
        answer:
          "A boat (or boat trailer) should be kept in a building or a rear-yard parking space not required for soft landscaping; a street-facing side yard cannot be a parking space. No more than one boat trailer is allowed, and up to 2 parking spaces total may be used for recreational vehicles.",
        relatedSections: ["10.5.80.10"],
      },
      {
        question: "Does recreational vehicle parking depend on size?",
        answer:
          "Partly. Up to 2 parking spaces may be used for recreational vehicles, with no more than one camper trailer or one boat trailer, and storage must be in a building or a rear-yard space not required for soft landscaping. Larger units may also be caught by the outdoor-vehicle restrictions (e.g. more than six wheels).",
        relatedSections: ["10.5.80.10"],
      },
      {
        question: "What should I check before storing an RV or trailer?",
        answer:
          "Where the vehicle would sit (front/side/rear yard), whether it is on a permitted driveway/parking space, its number of wheels and size, and whether the rear-yard space limit and soft-landscaping minimum are met. Confirm specifics with the City.",
        relatedSections: ["10.5.80.10(3)", "10.5.80.10(7)"],
      },
    ],
    examples: [
      "A large motorhome with more than six wheels stored outdoors on a residential lot may fall under the outdoor-vehicle restriction.",
      "A trailer or RV kept on the front lawn is not a permitted storage location.",
      "More than one camper trailer (or more than one boat trailer) on the lot exceeds the trailer limit.",
    ],
    whatToPrepare: [
      "Type of recreational vehicle (RV, trailer, camper, boat) and its size / number of wheels",
      "Where it would be stored (building or rear-yard parking space)",
      "Whether the rear-yard space is required for soft landscaping",
      "How many recreational vehicles / trailers are on the lot",
      "Photos of the vehicle and its location, and the property address / zoning category",
    ],
    officialSources: OFFICIAL_PARKING_SOURCES,
    relatedInternalLinks: [
      { label: "Landscaping Guide (rear yard)", url: "/landscaping#rear-yard" },
      { label: "Zoning Guide", url: "/zoning" },
    ],
    illustration: {
      src: "/images/zoning/parking/recreational-vehicle-guide.png",
      alt:
        "Parking Requirements — Residential Zone Recreational Vehicle Guide. Four panels: (1) where recreational vehicles may be stored — in a building or in a rear-yard parking space that is not required for soft landscaping; (2) maximum number of RV spaces — at most 2 parking spaces on a residential lot may be used for recreational vehicles; (3) trailer limit — no more than one camper trailer or one boat trailer; (4) compliant versus not compliant — compliant when stored in a building or a rear-yard parking space not required for soft landscaping, not compliant when stored in the front yard or on a soft-landscaped area. Reference Zoning By-law 569-2013, 10.5.80.10.",
      caption:
        "Recreational vehicle storage: building or rear-yard space, max 2 spaces, and one camper/one boat trailer (By-law 569-2013, 10.5.80.10). Informational reference only.",
      width: 1040,
      height: 1480,
    },
  },

  // 6 ─ Driveway / Parking Area & General Cautions ────────────────────────────
  {
    id: "driveway-parking-area",
    slug: "driveway-parking-area",
    title: "Driveways, Parking Areas & General Cautions",
    category: "Driveway / Parking Area",
    plainLanguageSummary:
      "A driveway or parking area is the surface a vehicle uses — and the by-law's definition of “landscaping” specifically excludes driveways and parking areas, which is why paving interacts with the landscaping minimums. General driveway-access and parking-space rules (such as 10.5.80.40) set where access and parking may be located; some access/dimension details are outside the reviewed source and need verification.",
    relevantChapters: ["Zoning By-law 569-2013 — Chapter 10.5", "Chapter 10.10 (R)"],
    relevantSections: [
      {
        sectionNumber: "10.5.50.10",
        sectionTitle: "Landscaping definition excludes driveways/parking",
        sourceExcerpt:
          "“landscaping ... does not include driveways or parking areas and directly associated elements such as curbs or retaining walls.” “soft landscaping ... does not include hard surfaced areas such as ... driveways, parking areas ...”",
        plainLanguageSummary:
          "Driveways and parking areas are not landscaping or soft landscaping, so paving for parking counts against the yard landscaping minimums.",
        verificationStatus: "verified",
      },
      {
        sectionNumber: "10.10.80.40",
        sectionTitle: "Access to Parking Space (R zone)",
        sourceExcerpt:
          "Garage entrance in front wall not permitted on lots with frontage 7.6 m or less; on a corner lot or a lot abutting a lane, vehicle access to any parking space must be from the flanking street or the lane.",
        plainLanguageSummary:
          "In the R zone, narrow lots can't have a front-wall garage entrance, and corner/lane lots must take parking access from the flanking street or the lane.",
        verificationStatus: "verified",
      },
      {
        sectionNumber: "10.5.80.40",
        sectionTitle: "General driveway / parking-space access & dimensions",
        sourceExcerpt:
          "Clause 10.5.80.40 (Access) is referenced by the zone rules but its full text — including any driveway width or parking-space dimension requirements — was not part of the reviewed source.",
        plainLanguageSummary:
          "Driveway width and parking-space dimension details need verification from the official by-law text of 10.5.80.40 and related parking provisions.",
        verificationStatus: "needs-verification",
      },
    ],
    keywords: [
      "driveway", "parking area", "parking space", "parking pad", "interlock parking",
      "paved parking", "driveway width", "widen driveway", "curb cut", "parking surface",
    ],
    commonQuestions: [
      {
        question: "Does interlock count as a driveway?",
        answer:
          "Interlock is a hard surface. The by-law's definition of landscaping excludes driveways and parking areas, so an interlocked driveway/parking area is not counted as landscaping. Whether a particular interlocked area is a lawful driveway/parking space is a separate question — confirm against the parking and access rules.",
        relatedSections: ["10.5.50.10"],
      },
      {
        question: "Does a paved area automatically allow parking?",
        answer:
          "No. A paved or hard-surfaced area does not by itself create a lawful parking space. Parking must be in a permitted location (e.g. on a private driveway leading to a parking space), and front/side-street parking remains restricted.",
        relatedSections: ["10.5.80.10(3)", "10.5.50.10"],
      },
      {
        question: "Can I widen my driveway?",
        answer:
          "Widening a driveway can run into the front-yard landscaping minimums (which limit paving) and, on a narrow R-zone lot, the front-wall garage-entrance restriction. Driveway width specifics are not in the reviewed source and need verification. A new or widened front-yard driveway generally needs City approval.",
        relatedSections: ["10.5.50.10", "10.10.80.40", "10.5.80.40"],
      },
    ],
    examples: [
      "Interlocking the front yard does not, on its own, make it a lawful parking area.",
      "A wider driveway that reduces the front-yard soft landscaping below the minimum may need a variance.",
    ],
    whatToPrepare: [
      "Property address and zoning category",
      "Driveway width and location, and parking-area dimensions",
      "How much of the yard is hard surface vs. soft landscaping",
      "Whether access is from the front street, a flanking street, or a lane",
      "Any previous permits, approvals, or City authorizations",
    ],
    officialSources: OFFICIAL_PARKING_SOURCES,
    relatedInternalLinks: [
      { label: "Landscaping Guide", url: "/landscaping" },
      { label: "Zoning Guide", url: "/zoning" },
    ],
  },
];

// ── How to use this guide ────────────────────────────────────────────────────
export const howToUseSteps: string[] = [
  "Find your property’s zoning category using the Zoning Map Viewer.",
  "Confirm whether the issue is residential, commercial, or another use.",
  "Identify where the vehicle is parked: front yard, side yard, rear yard, driveway, parking area, or commercial parking area.",
  "Check the relevant parking topic below.",
  "Review the related by-law sections and source excerpts.",
  "Verify the final requirement through official City zoning resources.",
];

export const howToWarning =
  "Parking rules are property-specific. A photo or short description may not be enough to confirm compliance. Exact zoning, lot layout, yard location, legal parking areas, previous approvals, and measurements may matter.";

// ── Parking & Landscaping overlap ────────────────────────────────────────────
export const parkingAndLandscaping = {
  intro:
    "Parking often overlaps with landscaping because paved or hard-surfaced areas may reduce soft landscaping or change how a yard is used. A surface being hardscaped does not, on its own, make parking lawful.",
  points: [
    "Paved front yards are limited by the front-yard landscaping minimum (50–60% landscaping, 75% of it soft).",
    "Parking pads and driveways are hard surfaces — the by-law excludes them from “landscaping” and “soft landscaping”.",
    "Widening a driveway can push the soft-landscaping area below the required minimum.",
    "A hardscaped surface can still be an unlawful parking location even if it is paved.",
    "Rear-yard parking must still leave the required soft-landscaping percentage.",
  ],
};

// ── What to prepare (page-level) ─────────────────────────────────────────────
export const whatToPrepare: string[] = [
  "Property address",
  "Zoning category from the Zoning Map Viewer",
  "Survey or site plan, if available",
  "Front yard, side yard, and rear yard layout",
  "Photos of the parking area",
  "Driveway width and location",
  "Dimensions of the parking pad or parking area",
  "Vehicle type (passenger vehicle, commercial vehicle, trailer, boat, RV, or recreational vehicle)",
  "Whether a garage, lane, or driveway exists",
  "Previous approvals, permits, agreements, or minor variances, if available",
  "Any notice or complaint details, if applicable",
];

// ── Page-level FAQ ───────────────────────────────────────────────────────────
export interface ParkingFaq {
  question: string;
  answer: string;
}

export const parkingFaq: ParkingFaq[] = [
  {
    question: "Can I park in my front yard?",
    answer:
      "Generally no. A parking space may not be in a front yard or a street-facing side yard, unless the City specifically permits a front-yard space. You may park on a private driveway that legally leads to a parking space (10.5.80.10). " + PARKING_SHORT_DISCLAIMER,
  },
  {
    question: "Can I park in my side yard?",
    answer:
      "An interior side yard (one that does not abut a street) may be used for parking, along with a rear yard or a building/structure. A side yard that faces a street cannot be a parking space (10.5.80.10). " + PARKING_SHORT_DISCLAIMER,
  },
  {
    question: "Can I park in my rear yard?",
    answer:
      "Often yes, within limits. On a lot with a detached/semi-detached house or duplex, up to 2 outdoor parking spaces may be in the rear yard (10.5.80.10(7)), subject to lawful access and the rear-yard soft-landscaping minimum. " + PARKING_SHORT_DISCLAIMER,
  },
  {
    question: "Does interlock count as a driveway?",
    answer:
      "Interlock is a hard surface; the by-law excludes driveways and parking areas from “landscaping”. Whether a specific interlocked area is a lawful driveway/parking space is separate — confirm against the parking and access rules.",
  },
  {
    question: "Does a paved area automatically allow parking?",
    answer:
      "No. A hard surface does not by itself create a lawful parking space. Parking must be in a permitted location, and front/street-side parking remains restricted.",
  },
  {
    question: "Can I widen my driveway?",
    answer:
      "Widening can conflict with the front-yard landscaping minimum and, on narrow R-zone lots, the front-wall garage-entrance restriction. Driveway-width specifics need verification, and a new/widened front-yard driveway generally needs City approval.",
  },
  {
    question: "Can I park an RV, trailer, camper, or boat on my property?",
    answer:
      "Store it in a building or a rear-yard parking space not required for soft landscaping — not the front yard. Up to 2 parking spaces may be used for recreational vehicles, with no more than one camper trailer or one boat trailer (10.5.80.10). " + PARKING_SHORT_DISCLAIMER,
  },
  {
    question: "Are commercial vehicles treated differently?",
    answer:
      "Yes. On a residential lot, a commercial vehicle may only be parked if an owner/tenant operates it and it is inside a wholly enclosed building; outdoor parking of commercially licensed, construction, or large vehicles is prohibited (10.5.80.10(9)–(10)).",
  },
  {
    question: "What if the parking existed before I bought the property?",
    answer:
      "An existing condition is not automatically legal or a violation. Older parking areas may still need verification against current rules; keeping a non-complying condition may require a Committee of Adjustment minor variance.",
  },
  {
    question: "What if I want to keep a parking area that may not comply?",
    answer:
      "If a parking arrangement does not meet zoning requirements and you want to keep it, you may need planning advice or a Committee of Adjustment minor variance. Approval is not guaranteed.",
  },
  {
    question: "Do I need a minor variance?",
    answer:
      "Possibly — if a parking area does not meet a zoning requirement and you want to keep or build it, a minor variance may be the route. The Committee of Adjustment weighs four planning tests and approval is not guaranteed.",
  },
  {
    question: "Should I check the Zoning Map Viewer first?",
    answer:
      "Yes. The Zoning Map Viewer tells you your property's zoning category — the starting point for confirming which parking rules apply to your lot.",
  },
];

export { PARKING_SHORT_DISCLAIMER };
