// ─────────────────────────────────────────────────────────────────────────────
//  Toronto Bylaw Guide — Zoning topic detail data (V4.2)
//
//  Rich, structured detail for each Zoning topic, keyed by the topic `id` in
//  lib/mock-data.ts (zoningTopics). Section references and rule summaries are
//  drawn from Zoning By-law 569-2013, Chapter 10 (Residential) — the general
//  Chapter 10.5 regulations plus the zone-specific limits in Chapter 10.10
//  (Residential Zone R) and Chapter 10.20 (Residential Detached Zone RD).
//
//  This is summarized for general reference only — NOT a legal interpretation or
//  a property-specific determination. Section numbers are taken from the official
//  by-law; where a rule is outside Chapter 10 or depends on the structure, the
//  text says so rather than inventing a section number.
// ─────────────────────────────────────────────────────────────────────────────

export type ZoneTag = "R" | "RD" | "R & RD" | "General" | "Other";

export interface RelevantSection {
  zone: ZoneTag;
  chapter: string;
  /** Section reference, e.g. "10.10.40.70". Use "—" if not a single section. */
  section: string;
  title: string;
  plainRule: string;
}

export interface TopicQA {
  question: string;
  answer: string;
  nextStep?: string;
}

export interface ZoningTopicDetail {
  applicableZones: string[];
  whyItMatters: string;
  relevantSections: RelevantSection[];
  questions: TopicQA[];
  examples: string[];
}

const R_AND_RD = ["Residential Zone (R)", "Residential Detached Zone (RD)"];

export const zoningTopicDetails: Record<string, ZoningTopicDetail> = {
  setbacks: {
    applicableZones: R_AND_RD,
    whyItMatters:
      "Setbacks are the minimum distances between a building or structure and a lot line. They keep space between houses for light, access, drainage, and privacy. The required distance depends on the zone, the building type, and whether the yard is front, side, or rear.",
    relevantSections: [
      { zone: "R", chapter: "Chapter 10.10 (R)", section: "10.10.40.70", title: "Setbacks — Residential Zone", plainRule: "Default minimums: front yard 6.0 m, rear yard 7.5 m, side yard 0.9 m for a detached/semi-detached house, duplex, triplex or fourplex. A side wall with no windows or doors may be reduced to 0.45 m." },
      { zone: "RD", chapter: "Chapter 10.20 (RD)", section: "10.20.40.70", title: "Setbacks — Residential Detached Zone", plainRule: "Front yard 6.0 m; rear yard is the greater of 7.5 m or 25% of the lot depth; side yard scales with required lot frontage — from 0.6 m on the narrowest lots up to 3.0 m on lots 30 m or wider." },
      { zone: "R & RD", chapter: "Chapter 10.5", section: "10.5.40.70", title: "Front Yard Setback — Averaging", plainRule: "If neighbouring houses fronting the same street are within 15 m, the required front yard setback may instead be set by that building's setback (or the average of two). Buildings must also stay at least 2.5 m from a lane centreline." },
    ],
    questions: [
      { question: "How far does my house need to be from the front lot line?", answer: "In both the R and RD zones the default minimum front yard setback is 6.0 m. But if neighbouring houses are within 15 m, an averaging rule (10.5.40.70) can change that figure, and corner lots and major streets have separate rules.", nextStep: "Confirm your zone in the Zoning Map Viewer, then check 10.10.40.70 (R) or 10.20.40.70 (RD)." },
      { question: "How close to the side lot line can I build?", answer: "In the R zone the side yard is generally 0.9 m (or 0.45 m for a wall with no windows or doors). In the RD zone it depends on your lot's required frontage — from 0.6 m on narrow lots up to 3.0 m on lots 30 m or wider." },
      { question: "What is the rear yard setback?", answer: "7.5 m in the R zone. In the RD zone it is the greater of 7.5 m or 25% of the lot depth, so deeper lots need a larger rear yard." },
    ],
    examples: [
      "An addition that would sit 0.6 m from the side lot line on an R-zone lot is below the 0.9 m minimum (unless that wall has no windows or doors), so it may need review or a minor variance.",
      "On a deep RD lot where 25% of the lot depth is more than 7.5 m, the larger figure becomes the required rear yard.",
    ],
  },

  "front-yard-parking": {
    applicableZones: R_AND_RD,
    whyItMatters:
      "Parking on an unpaved front yard or a street-facing side yard is generally not permitted, and new front-yard driveways are tightly limited — to protect landscaping, drainage, and sightlines for pedestrians and drivers.",
    relevantSections: [
      { zone: "R & RD", chapter: "Chapter 10.5", section: "10.5.80.10", title: "Parking — Location", plainRule: "A parking space may not be in a front yard or a street-facing side yard. Exception: for a detached/semi-detached house or duplex (and certain townhouses), vehicles may park on the private driveway leading to a parking space. Up to 2 outdoor spaces are allowed in the rear yard." },
      { zone: "R", chapter: "Chapter 10.10 (R)", section: "10.10.80.40", title: "Access to Parking on Narrow Lots", plainRule: "On a lot with frontage 7.6 m or less, a garage/vehicle entrance through the front wall is not permitted. On a corner lot or a lot abutting a lane, parking must be accessed from the flanking street or the lane." },
    ],
    questions: [
      { question: "Can I park on my front lawn?", answer: "Generally no. A parking space can't be in the front yard or a street-facing side yard. You may park on a legal private driveway that leads to a parking space, but parking on grass or an unpaved front yard is not permitted.", nextStep: "A new front-yard driveway or parking pad usually needs City approval — confirm before paving." },
      { question: "Can I add a front-yard parking pad?", answer: "Front-yard parking is heavily restricted and, where allowed at all, generally requires City authorization (under the City of Toronto Act). On narrow lots a front garage entrance may not be permitted at all.", nextStep: "Check with the City; the front-yard landscaping rules also limit how much can be paved." },
    ],
    examples: [
      "Paving part of the front lawn to fit a second car likely needs City approval and may conflict with the front-yard landscaping minimum.",
    ],
  },

  "hvac-ac-location": {
    applicableZones: R_AND_RD,
    whyItMatters:
      "An air conditioner or heat pump is treated as equipment that may project into a required yard only by a limited amount, keeping noise and bulk a set distance from neighbours and lot lines.",
    relevantSections: [
      { zone: "R & RD", chapter: "Chapter 10.5", section: "10.5.40.60(8)", title: "Equipment — Permitted Encroachment", plainRule: "An air conditioner may encroach a maximum of 0.9 m into a required rear yard setback, and into a required side yard setback only if it is not located above the first storey. It must be no closer than 0.3 m to a lot line. (Vents/pipes 0.6 m; satellite dish/antenna 0.9 m.)" },
    ],
    questions: [
      { question: "Where can I put my air conditioner or heat pump?", answer: "It can project up to 0.9 m into a required rear yard setback, and into a required side yard only if it is not above the first storey — and it must stay at least 0.3 m from the lot line. The required setback itself comes from your zone (10.10 R / 10.20 RD).", nextStep: "Confirm your side/rear setback, then keep the unit within the 0.9 m / 0.3 m limits. Manufacturer clearances and the noise by-law may also apply." },
    ],
    examples: [
      "An AC condenser placed 0.2 m from the side lot line is closer than the 0.3 m minimum, so it may need to be relocated.",
    ],
  },

  "accessory-structures": {
    applicableZones: R_AND_RD,
    whyItMatters:
      "Sheds, detached garages, and similar ancillary buildings have their own size, lot-coverage, and setback limits — separate from the main house — even when a small structure does not need a building permit.",
    relevantSections: [
      { zone: "R", chapter: "Chapter 10.10 (R)", section: "10.10.60.70", title: "Ancillary Lot Coverage", plainRule: "Ancillary buildings and structures together may cover no more than 5% of the lot area (pools and parking garages are counted separately)." },
      { zone: "R", chapter: "Chapter 10.10 (R)", section: "10.10.60.20", title: "Detached Garage Setbacks", plainRule: "A structure containing a parking space must be at least 1.0 m from a rear/side lot line that abuts a street or lane, and has no minimum setback from an interior rear/side lot line." },
      { zone: "R & RD", chapter: "Chapter 10.5", section: "10.5.60", title: "General Ancillary Rules", plainRule: "Chapter 10.5.60 sets general ancillary-building requirements (height, location, separation). The RD zone applies these general rules; confirm exact figures for your lot." },
    ],
    questions: [
      { question: "Do I need a permit for a shed, and how big can it be?", answer: "Zoning limits ancillary buildings by lot coverage and setbacks even when a small shed doesn't need a building permit. In the R zone, all ancillary structures together can cover at most 5% of the lot.", nextStep: "Check 10.10.60 (R) plus the general 10.5.60 rules; measure the shed's footprint and location against them." },
      { question: "How close to the lot line can a detached garage go?", answer: "A detached garage (a structure with a parking space) must be at least 1.0 m from a rear/side lot line that abuts a street or lane, but has no minimum from an interior side/rear lot line in the R zone.", nextStep: "Confirm which of your lot lines abut a street or lane." },
    ],
    examples: [
      "A large shed plus a detached garage that together exceed 5% of the lot would be over the R-zone ancillary coverage limit.",
    ],
  },

  landscaping: {
    applicableZones: R_AND_RD,
    whyItMatters:
      "Zoning requires a minimum portion of the yard to stay as landscaping — and much of it as soft landscaping (plants and grass, not pavement) — which directly limits how much of a yard you can pave. Soft landscaping requirements can apply to front yards, side yards, and rear yards depending on the residential zone and property conditions.",
    relevantSections: [
      { zone: "R & RD", chapter: "Chapter 10.5", section: "10.5.50.10", title: "Landscaping — front, side & rear yards", plainRule: "Clause 10.5.50.10 sets front yard landscaping (50–60% depending on frontage, 75% of it soft), corner-lot side yard landscaping, and rear yard soft landscaping (50% if frontage is over 6.0 m, 25% if 6.0 m or less). See the dedicated Landscaping Guide for the full breakdown by yard." },
    ],
    questions: [
      { question: "Where can I find the full landscaping requirements?", answer: "The dedicated Landscaping Guide explains front yard, side yard, and rear yard soft landscaping in plain English, with what counts and does not count, common questions, and the minor variance option.", nextStep: "Open the Landscaping Guide for the full, source-based detail." },
    ],
    examples: [],
  },

  "home-occupation": {
    applicableZones: R_AND_RD,
    whyItMatters:
      "Running a business from home is allowed within limits, so it stays compatible with a residential neighbourhood. Section 150.5 controls the type of business, the floor area it can use, whether anyone can work there besides you, and whether clients may come to the home.",
    relevantSections: [
      { zone: "R", chapter: "Chapter 10.10 (R)", section: "10.10.20.20", title: "Permitted Use with Conditions", plainRule: "Home Occupation is a permitted use in the R zone subject to specific conditions, and must comply with the home-occupation regulations in Section 150.5. (The RD zone permits it on the same conditional basis.)" },
      { zone: "General", chapter: "Chapter 150", section: "150.5.20.1", title: "Use Requirements — What's Allowed / Not Allowed", plainRule: "A home occupation may NOT: sell, rent or lease physical goods from the home; be an animal shelter or kennel; be a vehicle repair, service or washing shop; or be a manufacturing use. Except for an education use, it may not have clients attend for consultations, services, or to pick up goods, and there may be no outdoor activity, display, or open storage. Generally no employee other than the business operator. Allowed in residential zones: limited personal services (barber, hairdresser, beautician, dressmaker, seamstress, tailor); a health-related professional office (which may have one employee in addition to the operator); and music or dance instruction (in a detached house only)." },
      { zone: "General", chapter: "Chapter 150", section: "150.5.40.40 · 150.5.40.1 · 150.5.60.1", title: "Floor Area & Building Limits", plainRule: "The home occupation may use no more than the lesser of 25% of the dwelling unit's interior floor area or 100 m². There may be no exterior alteration to the building to accommodate it, and it may not be located in an ancillary building such as a shed or detached garage." },
    ],
    questions: [
      { question: "What kinds of home businesses are allowed?", answer: "Quiet, contained uses — for example a home office or consulting/remote work, music or dance instruction (in a detached house only), and a limited set of personal services: a barber, hairdresser, beautician, dressmaker, seamstress, or tailor. A health-related professional office is also allowed and may have one employee besides the operator. Some uses also need a business licence.", nextStep: "Check your specific business against the Section 150.5 conditions, and whether a licence is required." },
      { question: "What is NOT allowed as a home occupation?", answer: "Selling, renting or leasing physical goods from the home; an animal shelter or kennel; a vehicle repair, service or washing shop; and any manufacturing use. Except for education uses, you also can't have clients come to the home for consultations, services, or to pick up goods, and there can be no outdoor activity, display, or storage. Generally no one but the operator may work there.", nextStep: "If your idea involves walk-in customers, outdoor work, or goods sales, confirm with the City first." },
      { question: "How much of my home can the business use?", answer: "No more than the lesser of 25% of the dwelling unit's interior floor area or 100 m². You also can't make exterior alterations to the building for the business, and it can't operate from a shed or detached garage.", nextStep: "Measure the area you plan to use and compare it to 25% of the unit (capped at 100 m²)." },
    ],
    examples: [
      "A home business with regular walk-in clients for consultations (other than an education use) would not meet the Section 150.5 use conditions.",
      "Running the business out of the detached garage, or using more than 25% of the home (or over 100 m²), would exceed the home-occupation limits.",
    ],
  },

  "permitted-uses": {
    applicableZones: R_AND_RD,
    whyItMatters:
      "Before height, setbacks, or anything else, zoning decides what you may build on a lot (the residential building type) and how it may be used. Some uses are permitted outright; others are permitted only if they meet specific conditions.",
    relevantSections: [
      { zone: "R", chapter: "Chapter 10.10 (R)", section: "10.10.20.10 · 10.10.20.40", title: "Permitted Use & Building Types", plainRule: "Permitted outright in the R zone: a dwelling unit in a permitted residential building type, a municipal shelter, and a park. Permitted residential building types: detached house, semi-detached house, townhouse, duplex, triplex, fourplex, and apartment building." },
      { zone: "RD", chapter: "Chapter 10.20 (RD)", section: "10.20.20.10 · 10.20.20.40", title: "Permitted Use & Building Types", plainRule: "Permitted outright in the RD (detached) zone: a dwelling unit in a permitted residential building type, a municipal shelter, and a park. Permitted building types: detached house, duplex, triplex, and fourplex — plus a townhouse or apartment building only if the lot abuts a major street." },
      { zone: "R & RD", chapter: "Chapter 10.10 / 10.20", section: "10.10.20.20 · 10.20.20.20", title: "Permitted Uses — with Conditions", plainRule: "Other uses are permitted only if they meet the specific conditions in 10.10.20.100 / 10.20.20.100. These include home occupation, secondary suite, garden suite, laneway suite, group home, private home daycare, day nursery, place of worship, community centre, library, public utility, short-term rental, and (in the R zone only) a retail store and tourist home — among others." },
    ],
    questions: [
      { question: "What can I build on a residential lot?", answer: "In the R zone the permitted residential building types are a detached house, semi-detached house, townhouse, duplex, triplex, fourplex, or apartment building. In the RD (detached) zone the standard types are a detached house, duplex, triplex, or fourplex — a townhouse or apartment building is permitted only if the lot abuts a major street. The exact type for your lot still depends on its zone label and other limits (height, setbacks, lot size).", nextStep: "Confirm your zone in the Zoning Map Viewer, then check 10.10.20.40 (R) or 10.20.20.40 (RD)." },
      { question: "Can I add a secondary suite, garden suite, or laneway suite?", answer: "These are listed as uses permitted with conditions in both the R and RD zones, so they're generally allowed if they meet the by-law's specific conditions (and other applicable rules). A home occupation, group home, and private home daycare are also conditional uses.", nextStep: "Check the conditions in 10.10.20.100 (R) or 10.20.20.100 (RD) for your specific use." },
      { question: "Can I run a non-residential use like a daycare or place of worship?", answer: "Some non-residential uses are permitted with conditions — for example a day nursery, private home daycare, place of worship, community centre, or library — typically subject to conditions about lot size, location, or being near a major street. A few uses (a small retail store, a tourist home) are conditional in the R zone but not listed for the RD zone.", nextStep: "Confirm the use is listed for your zone and review its specific conditions." },
    ],
    examples: [
      "A triplex is generally a permitted building type on an RD lot; adding a townhouse on that same RD lot is only permitted if it abuts a major street.",
      "A small home retail store is a conditional use in the R zone but is not listed for the RD zone — so the zone determines whether it's even possible.",
    ],
  },

  "fence-zoning-overlap": {
    applicableZones: ["Residential Zone (R)", "Residential Detached Zone (RD)", "Other zones"],
    whyItMatters:
      "Fences themselves are governed by the Fences by-law (Toronto Municipal Code Chapter 447), not the Zoning By-law — but zoning can still affect what you build near a fence, such as structures, corner-lot sightlines, and pool enclosures, so both may apply.",
    relevantSections: [
      { zone: "Other", chapter: "Municipal Code Chapter 447", section: "Ch. 447", title: "Fences — Height & Materials", plainRule: "Fence height, materials, and driveway visibility are set by Toronto Municipal Code Chapter 447 — separate from the Zoning By-law. See this site's Fences page." },
      { zone: "R & RD", chapter: "Zoning By-law (varies)", section: "—", title: "Zoning Near a Fence", plainRule: "Zoning still governs structures near a lot line (setbacks, ancillary buildings), corner-lot landscaping/visibility, and pool enclosures. The exact section depends on the specific structure — verify in the official by-law." },
    ],
    questions: [
      { question: "Do zoning rules affect my fence?", answer: "A fence itself is regulated by Chapter 447 (the Fences by-law), not the Zoning By-law. But if you build a structure near the fence, on a corner lot, or around a pool, zoning setbacks and landscaping rules may also apply.", nextStep: "For fence height/materials see the Fences page; for nearby structures, confirm the zoning setbacks for your lot." },
    ],
    examples: [
      "A tall solid fence beside a corner-lot driveway is governed by Chapter 447, while corner-lot visibility and landscaping zoning rules may also apply.",
    ],
  },
};

export function getZoningTopicDetail(id: string): ZoningTopicDetail | undefined {
  return zoningTopicDetails[id];
}
