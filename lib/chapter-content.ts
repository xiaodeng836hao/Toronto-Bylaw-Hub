// ─────────────────────────────────────────────────────────────────────────────
//  Toronto Bylaw Hub — Rich chapter content (V3.4)
//
//  Structured, plain-language content for TMC chapter detail pages, keyed by the
//  chapter slug used in lib/mock-data.ts (bylawChapters). Section references are
//  taken from the official Toronto Municipal Code chapter text; where an exact
//  subsection could not be confirmed, the reference is given at the chapter level
//  and cautious wording is used. This is summarized for general reference only —
//  NOT legal advice. Always confirm the official chapter.
// ─────────────────────────────────────────────────────────────────────────────

import { OFFICIAL_311_URL } from "./mock-data";

export type ComplexityLevel = "simple" | "moderate" | "complex";

export interface KeyRequirement {
  title: string;
  plainLanguageExplanation: string;
  /** Chapter and (where confirmed) section reference. */
  sectionReference: string;
  complianceExample: string;
  nonComplianceExample: string;
}

export interface ComplianceStep {
  title: string;
  description: string;
  caution?: string;
}

export interface ChapterQuestion {
  question: string;
  answer: string;
  sectionReference?: string;
  practicalNextStep?: string;
}

export interface RelatedTopic {
  label: string;
  href: string;
  description?: string;
  external?: boolean;
}

export interface ChapterContent {
  complexityLevel: ComplexityLevel;
  plainLanguageOverview: string;
  keyRequirements: KeyRequirement[];
  practicalComplianceSteps: ComplianceStep[];
  commonQuestions: ChapterQuestion[];
  relatedTopics: RelatedTopic[];
  sourceNotes: string;
  lastReviewed: string;
}

const REVIEWED = "2026-06-14";
const T311: RelatedTopic = { label: "Report through Toronto 311", href: OFFICIAL_311_URL, description: "Submit a service request to the City.", external: true };
const PHOTO_REVIEW: RelatedTopic = { label: "Photo Review Helper", href: "/photo-review", description: "Match a photo to a likely bylaw and build an evidence checklist." };
const SOURCE_NOTE = (n: string) =>
  `This page summarizes Toronto Municipal Code Chapter ${n} in plain language for general reference only — it is not legal advice. Always confirm the exact requirement, wording, and any exemptions in the official chapter or with the City of Toronto.`;

export const chapterContent: Record<string, ChapterContent> = {
  // ── 417 — Dust (MODEL PAGE) ────────────────────────────────────────────────
  "417": {
    complexityLevel: "simple",
    plainLanguageOverview:
      "Chapter 417 is a focused bylaw about dust created by residential construction or renovation. It says you must not let dust from work on a home (cutting, grinding, sanding, demolition-type activities, moving materials) drift off your property onto a neighbour's property — unless you take reasonable measures to keep it contained. It mainly applies to residential construction; commercial and industrial sites, City works, large multi-residential/subdivision builds, and permitted demolition projects are treated separately.",
    keyRequirements: [
      {
        title: "Keep construction dust on your own property",
        plainLanguageExplanation:
          "Dust created by residential construction activities must not be allowed to escape from your property onto a neighbouring property. This applies whether you do the work yourself or direct someone else to.",
        sectionReference: "Chapter 417, § 417-2.1 (Dust; general requirements)",
        complianceExample: "Cutting concrete pavers inside a tarped enclosure so the dust settles on your own lot.",
        nonComplianceExample: "Dry-cutting drywall or stone in the open on a windy day so clouds of dust drift into the neighbour's yard and windows.",
      },
      {
        title: "Use reasonable dust-control measures",
        plainLanguageExplanation:
          "The bylaw is not breached if reasonable preventative measures are used. It lists accepted measures: wetting the material, using a wet saw, using dustless saw technology, tarping or otherwise containing the dust source, installing wind fencing / a fence filter, or using a vacuum attachment when cutting.",
        sectionReference: "Chapter 417, § 417-2.2 (Exceptions)",
        complianceExample: "Wet-cutting tile, attaching a vacuum to the grinder, and tarping a debris pile.",
        nonComplianceExample: "No containment, no wetting, and no vacuum while creating large amounts of airborne dust next to a lot line.",
      },
      {
        title: "This chapter targets residential construction dust",
        plainLanguageExplanation:
          "'Dust' here means solid particles that become airborne from residential construction activities (such as trimming, drilling, crushing, grinding, sawing, cutting or moving clay, mortar, stone, concrete, tile and insulation). The chapter does not apply to necessary municipal work, work on commercial/industrial properties, construction of multi-residential/subdivision/mixed-use developments, or a residential demolition with an approved permit.",
        sectionReference: "Chapter 417, §§ 417-1.1 and 417-2.2C",
        complianceExample: "Knowing that ongoing dust from a house renovation next door may fall under this chapter.",
        nonComplianceExample: "Assuming everyday dust from normal yard work or a commercial site is covered here — it generally is not.",
      },
    ],
    practicalComplianceSteps: [
      { title: "Wet down dusty surfaces", description: "Lightly wet construction materials, cut surfaces, and debris before and during dusty work so particles stay down. Use a wet saw where practical." },
      { title: "Cover and contain loose material", description: "Cover loose soil, sand, gravel, and construction material with tarps, and tarp or enclose the source of dust so it can't blow off your lot." },
      { title: "Cut with dust capture", description: "Use dustless saw technology or a vacuum attachment when cutting, grinding, or sanding." },
      { title: "Use wind protection", description: "Install wind fencing or a fence filter along the work area, especially near a lot line." },
      { title: "Clean up without re-launching dust", description: "Avoid dry-sweeping dust into the air; use a vacuum or damp methods on hard surfaces, and keep debris from becoming airborne.", caution: "Do not use unsafe chemicals to control dust — only safe, reasonable measures." },
      { title: "Watch the weather and the scale of work", description: "Monitor dust closely during dry or windy conditions, and consider professional help (with proper containment) for large construction or demolition-related dust." },
    ],
    commonQuestions: [
      { question: "What counts as a dust problem under this bylaw?", answer: "Generally, dust created by residential construction or renovation activities that escapes your property onto another property. Everyday dust unrelated to residential construction is usually not covered by this chapter.", sectionReference: "§§ 417-1.1, 417-2.1", practicalNextStep: "Note when the dusty work is happening and confirm it relates to residential construction." },
      { question: "Can I report construction dust from a nearby home renovation?", answer: "Yes — dust from residential construction that drifts onto your property may be reportable. Note that the chapter generally does not apply to commercial/industrial sites, City works, large multi-residential/subdivision construction, or permitted residential demolition.", sectionReference: "§ 417-2.2C", practicalNextStep: "Submit a service request to Toronto 311 with the address, dates, and a description." },
      { question: "What should I do before contacting the City?", answer: "Document what you are seeing: the source of the dust, the dates and times, and how it is affecting your property. Photos or short videos that show dust leaving the other property are most helpful.", practicalNextStep: "Keep a simple dated log and gather photos/video before reporting." },
      { question: "What evidence should I collect?", answer: "Clear photos or video showing dust escaping the property, the address/location, and dates and times. This helps the City understand the situation.", practicalNextStep: "Store your photos with timestamps so the dates are easy to confirm." },
      { question: "How can a property owner doing work reduce dust?", answer: "Use one or more accepted measures: wet the material or use a wet saw, use dustless/vacuum cutting, tarp or contain the dust source, and add wind fencing. Using reasonable measures is exactly what the bylaw asks for.", sectionReference: "§ 417-2.2B", practicalNextStep: "Set up containment and wetting before starting dusty work." },
      { question: "Is dust from normal yard work treated the same as ongoing site dust?", answer: "This chapter is aimed at dust from residential construction activities, not routine yard work. Ongoing dust from a residential construction/renovation site is the kind of situation it addresses.", sectionReference: "§ 417-1.1", practicalNextStep: "If it relates to construction and is escaping onto your property, you can contact 311." },
    ],
    relatedTopics: [PHOTO_REVIEW, T311, { label: "Official Chapter 417 (Dust)", href: "https://www.toronto.ca/legdocs/municode/toronto-code-417.pdf", external: true }],
    sourceNotes: SOURCE_NOTE("417, Dust") + " Chapter 417 applies to residential construction dust; other dust sources may fall under different rules.",
    lastReviewed: REVIEWED,
  },

  // ── 395 — Clothing Drop Boxes ──────────────────────────────────────────────
  "395": {
    complexityLevel: "simple",
    plainLanguageOverview:
      "Chapter 395 regulates clothing donation drop boxes. A clothing drop box generally needs a City permit, must be placed only in permitted locations, and must be kept properly maintained. Unpermitted boxes can be removed by the City.",
    keyRequirements: [
      { title: "A permit is generally required", plainLanguageExplanation: "Clothing drop boxes generally require a clothing drop box permit and must meet the City's placement and maintenance requirements.", sectionReference: "Chapter 395, § 395-2 (general requirements)", complianceExample: "A box placed by a permitted operator in an approved location, kept clean and not overflowing.", nonComplianceExample: "A box dropped in a parking lot or boulevard with no permit and overflowing donations around it." },
      { title: "Boxes must be maintained", plainLanguageExplanation: "Boxes must be kept in good condition and not allowed to overflow or create a mess or hazard around them.", sectionReference: "Chapter 395, § 395-2", complianceExample: "Regular pickups so the box never overflows.", nonComplianceExample: "Donations piled on the ground around a damaged box for days." },
    ],
    practicalComplianceSteps: [
      { title: "Confirm the box is permitted", description: "If you operate a box, make sure it has a valid permit and is in an approved location before placing it." },
      { title: "Keep it maintained", description: "Schedule regular pickups and repairs so the box stays clean, undamaged, and not overflowing." },
      { title: "Report a problem box", description: "If a box is unpermitted, overflowing, or damaged, you can report it to the City with the location." },
    ],
    commonQuestions: [
      { question: "Is a clothing donation box allowed in this location?", answer: "It depends on whether the box is permitted and the location is approved. Boxes generally need a permit and must meet placement rules.", sectionReference: "§ 395-2", practicalNextStep: "Report the box's location to 311 if you think it may be unpermitted." },
      { question: "A drop box is overflowing — who do I contact?", answer: "You can report an overflowing or damaged box to the City. Operators are expected to keep boxes maintained.", practicalNextStep: "Submit a 311 service request with the box location and a photo." },
      { question: "Do clothing drop boxes need a permit?", answer: "Generally yes — a clothing drop box permit is typically required, and unpermitted boxes can be removed by the City.", sectionReference: "§§ 395-2, 395-4", practicalNextStep: "Check the official Chapter 395 for the exact permit requirements." },
    ],
    relatedTopics: [T311, { label: "Official Chapter 395", href: "https://www.toronto.ca/legdocs/municode/1184_395.pdf", external: true }],
    sourceNotes: SOURCE_NOTE("395, Clothing Drop Boxes"),
    lastReviewed: REVIEWED,
  },

  // ── 447 — Fences ───────────────────────────────────────────────────────────
  "447": {
    complexityLevel: "complex",
    plainLanguageOverview:
      "Chapter 447 sets the rules for fences on private property — including maximum heights (which vary by yard and property type), prohibited fence types, and the safety requirements for swimming pool enclosures. Pool enclosures have detailed safety rules (height, gaps, self-closing/self-latching gates) and a permit is required.",
    keyRequirements: [
      { title: "Fence height limits", plainLanguageExplanation: "Fences must not exceed the permitted height for their location. Height limits differ between front yards and side/rear yards, and by property type. Some fence types and materials are prohibited.", sectionReference: "Chapter 447, § 447-1.2 (Restrictions on fences; height)", complianceExample: "A rear-yard fence built within the permitted height for a residential lot.", nonComplianceExample: "A front-yard fence well above the permitted height, or a prohibited fence type." },
      { title: "Swimming pool enclosures are required and regulated", plainLanguageExplanation: "An outdoor pool (water depth that can exceed 600 mm) must be surrounded by a compliant enclosure. The enclosure must meet height, non-climbable, and gap standards, and gates must be self-closing and self-latching. A permit is required.", sectionReference: "Chapter 447, § 447-1.3 (Swimming pool enclosures)", complianceExample: "A 1.2 m+ non-climbable pool enclosure with a self-closing, self-latching gate and no large gaps.", nonComplianceExample: "A pool gate that doesn't self-latch, or gaps a small child could pass through." },
      { title: "Keep fences in safe condition", plainLanguageExplanation: "Fences must be maintained so they don't become unsafe (e.g., leaning, broken, or collapsing).", sectionReference: "Chapter 447 (maintenance provisions)", complianceExample: "Repairing a leaning fence section promptly.", nonComplianceExample: "A rotting, falling-down fence left unrepaired." },
    ],
    practicalComplianceSteps: [
      { title: "Check the height rules for your yard", description: "Before building, confirm the permitted fence height for the specific yard (front vs side/rear) and your property type." },
      { title: "Get a pool enclosure permit", description: "If you have or are installing a pool, obtain the required permit and build the enclosure to the safety standards.", caution: "Pool safety rules exist to prevent drowning — do not skip the self-closing/self-latching gate." },
      { title: "Use the Pool Fence Guide", description: "Use this site's Pool Fence Guide for a plain-language checklist of enclosure requirements." },
      { title: "Maintain the fence", description: "Keep fences upright, repaired, and safe over time." },
    ],
    commonQuestions: [
      { question: "How tall can my front yard fence be?", answer: "Front-yard fences generally have a lower height limit than side/rear-yard fences, and limits vary by property type. Check the exact figure for your situation in the official chapter.", sectionReference: "§ 447-1.2", practicalNextStep: "Confirm the permitted height before building, and check the Zoning Guide for corner-lot sight lines." },
      { question: "Does my pool need a fence, and what are the rules?", answer: "Yes — an outdoor pool generally requires a compliant enclosure with a self-closing, self-latching gate, a minimum non-climbable height, and no large gaps, and a permit is required.", sectionReference: "§ 447-1.3", practicalNextStep: "See the Pool Fence Guide and confirm requirements with Toronto Building." },
      { question: "My neighbour's fence is falling down — is that reportable?", answer: "Fences must be kept in a safe condition. A dangerous or collapsing fence may be reportable.", practicalNextStep: "You can submit a 311 service request describing the fence and address." },
    ],
    relatedTopics: [
      { label: "Pool Fence Guide", href: "/pool-fence-guide", description: "Plain-language pool enclosure checklist." },
      { label: "Zoning Guide", href: "/zoning", description: "Fence-and-zoning overlap, corner-lot sight lines." },
      PHOTO_REVIEW, T311,
      { label: "Official Chapter 447", href: "https://www.toronto.ca/legdocs/municode/1184_447.pdf", external: true },
    ],
    sourceNotes: SOURCE_NOTE("447, Fences") + " This chapter is detailed — only common resident-facing points are summarized here.",
    lastReviewed: REVIEWED,
  },

  // ── 480 — Garage Sales ─────────────────────────────────────────────────────
  "480": {
    complexityLevel: "simple",
    plainLanguageOverview:
      "Chapter 480 keeps residential garage/yard sales occasional and neighbourly. It limits how many sales you can hold per year and how long each can last, and limits what you can sell to your own used household items.",
    keyRequirements: [
      { title: "No more than two garage sales per year", plainLanguageExplanation: "A maximum of two garage sales may be held in any year from a residential premises, and this limit applies no matter who runs them. Each sale may not exceed two consecutive days.", sectionReference: "Chapter 480, § 480-2 (Frequency)", complianceExample: "Holding one weekend sale in spring and one in fall.", nonComplianceExample: "Running a sale most weekends, effectively operating an ongoing business." },
      { title: "Sell only your own used items", plainLanguageExplanation: "You may only sell personal property that has actually been used in connection with your home (or a neighbour's, in a joint sale). You can't sell items taken on consignment or items bought specifically to resell.", sectionReference: "Chapter 480, § 480-3 (Property restrictions)", complianceExample: "Selling your old furniture, tools, and household goods.", nonComplianceExample: "Selling new merchandise bought wholesale to resell at the sale." },
    ],
    practicalComplianceSteps: [
      { title: "Plan within the limits", description: "Keep to two sales per year, each no longer than two consecutive days." },
      { title: "Sell only household items", description: "Stick to your own used belongings; avoid consignment or resale merchandise." },
      { title: "Be a good neighbour", description: "Remove signage afterward and keep the sale tidy and safe." },
    ],
    commonQuestions: [
      { question: "How many garage sales can I have in a year?", answer: "Generally no more than two per year from a residential premises, and each may not exceed two consecutive days.", sectionReference: "§ 480-2", practicalNextStep: "Plan your sales around the two-per-year limit." },
      { question: "Can I sell items I bought just to resell?", answer: "No — garage sales are for your own used household items. Consignment items and items bought for resale are not permitted.", sectionReference: "§ 480-3", practicalNextStep: "Only put out personal property used in connection with your home." },
      { question: "Are there rules about garage sale signs?", answer: "Signage should not become a nuisance and is typically expected to be removed after the sale. Sign placement on public property is also regulated.", practicalNextStep: "Take signs down promptly after the sale ends." },
    ],
    relatedTopics: [T311, { label: "Official Chapter 480", href: "https://www.toronto.ca/legdocs/municode/1184_480.pdf", external: true }],
    sourceNotes: SOURCE_NOTE("480, Garage Sales"),
    lastReviewed: REVIEWED,
  },

  // ── 485 — Graffiti ─────────────────────────────────────────────────────────
  "485": {
    complexityLevel: "simple",
    plainLanguageOverview:
      "Chapter 485 prohibits graffiti vandalism and requires property owners and occupants to keep their property free of it. Approved art murals and graffiti art are treated differently and can be 'regularized' so they aren't considered vandalism. The City can issue a notice to remove graffiti and, if it isn't removed, can remove it and recover the cost.",
    keyRequirements: [
      { title: "Keep your property free of graffiti vandalism", plainLanguageExplanation: "The owner or occupant of a property must keep it free of graffiti vandalism, and no one may place graffiti vandalism on property. 'Graffiti vandalism' generally means deliberate, unapproved markings such as tags — not an approved art mural.", sectionReference: "Chapter 485, § 485-3 (Graffiti vandalism prohibited)", complianceExample: "Painting over or removing a tag sprayed on your garage or fence.", nonComplianceExample: "Leaving unapproved tags on a street-facing wall after being notified." },
      { title: "The City can require removal after notice", plainLanguageExplanation: "An officer who finds graffiti vandalism may give written notice to comply, generally allowing no sooner than 72 hours. You can ask the Graffiti Panel to review whether the markings are actually approved art.", sectionReference: "Chapter 485, §§ 485-4, 485-5", complianceExample: "Removing the graffiti within the time set out in the notice.", nonComplianceExample: "Ignoring the notice, after which the City may remove it and bill you." },
      { title: "Approved murals can be 'regularized'", plainLanguageExplanation: "Art murals and graffiti art that aesthetically enhance a surface and have owner approval can be regularized so they are not treated as vandalism.", sectionReference: "Chapter 485, § 485-6", complianceExample: "Registering a commissioned mural so it's recognized as art.", nonComplianceExample: "Assuming any spray-paint is 'art' without approval or regularization." },
    ],
    practicalComplianceSteps: [
      { title: "Remove tags promptly", description: "Paint over or clean off graffiti vandalism, especially on street-facing surfaces, before it spreads." },
      { title: "Respond to any notice", description: "If you receive a notice to comply, act within the time given. If you believe it's approved art, request a Graffiti Panel review.", caution: "If you don't comply, the City may remove the graffiti and add the cost to your property taxes." },
      { title: "Report graffiti you don't own", description: "Report graffiti on public property (utility boxes, transit, etc.) so the responsible body can address it." },
    ],
    commonQuestions: [
      { question: "Do I need to remove graffiti from my private property?", answer: "Generally, property owners and occupants are expected to keep their property free of graffiti vandalism. If graffiti is present, the City may require removal within a set time after notice. Check the official Chapter 485 for exact requirements and any exemptions.", sectionReference: "§§ 485-3, 485-4", practicalNextStep: "Remove the tag, or if you think it's approved art, request a Graffiti Panel review." },
      { question: "How do I report graffiti on a utility box or public property?", answer: "Report it to the City through 311; graffiti on public assets is handled by the responsible agency.", practicalNextStep: "Submit a 311 request with the location and a photo." },
      { question: "Is a commissioned mural treated as graffiti?", answer: "No — an art mural or graffiti art approved by the owner and registered/regularized is generally not treated as vandalism.", sectionReference: "§§ 485-1, 485-6", practicalNextStep: "Apply to regularize an approved mural so it's recognized as art." },
    ],
    relatedTopics: [PHOTO_REVIEW, T311, { label: "Official Chapter 485", href: "https://www.toronto.ca/legdocs/municode/1184_485.pdf", external: true }],
    sourceNotes: SOURCE_NOTE("485, Graffiti"),
    lastReviewed: REVIEWED,
  },

  // ── 489 — Turfgrass and Prohibited Plants ──────────────────────────────────
  "489": {
    complexityLevel: "simple",
    plainLanguageOverview:
      "Chapter 489 requires property owners to keep their grass cut and their land free of certain prohibited plants. Turfgrass over 20 cm must be cut, the 10 prohibited 'local weeds' (Schedule A) must be kept off the land, and vegetation must not block sidewalks or sight lines.",
    keyRequirements: [
      { title: "Cut turfgrass over 20 cm", plainLanguageExplanation: "Owners and occupants must cut the turfgrass on their land whenever it grows taller than 20 centimetres.", sectionReference: "Chapter 489, § 489-2 (Maximum height)", complianceExample: "Mowing the lawn before it passes 20 cm.", nonComplianceExample: "An overgrown lawn or vacant lot well past 20 cm." },
      { title: "Keep land free of prohibited plants", plainLanguageExplanation: "Private land must be kept free of the local weeds listed in Schedule A — Canada thistle, buckthorn, dog-strangling vine, garlic mustard, giant hogweed, Japanese knotweed, phragmites, poison ivy, purple loosestrife, and ragweed.", sectionReference: "Chapter 489, § 489-2.1 and Schedule A", complianceExample: "Removing giant hogweed or dog-strangling vine when it appears.", nonComplianceExample: "Letting a patch of a prohibited plant spread across the yard." },
      { title: "Don't block sidewalks or sight lines", plainLanguageExplanation: "Vegetation must not obstruct sidewalks or roadways, or block driver/pedestrian sight lines at intersections, driveways, and walkways.", sectionReference: "Chapter 489, § 489-2.1", complianceExample: "Trimming a hedge that was creeping over the sidewalk.", nonComplianceExample: "Overgrowth blocking a sidewalk or hiding a stop sign." },
    ],
    practicalComplianceSteps: [
      { title: "Mow before 20 cm", description: "Keep turfgrass cut so it doesn't exceed 20 cm, including on vacant land you own." },
      { title: "Identify and remove prohibited plants", description: "Learn to recognize the 10 prohibited plants and remove them safely. Use this site's Prohibited Plants Identifier for photos and safe-removal steps." },
      { title: "Handle hazardous species carefully", description: "For giant hogweed and poison ivy, avoid direct contact and consider professional removal.", caution: "Some prohibited plants are hazardous — never burn poison ivy, and avoid giant hogweed sap." },
      { title: "Keep edges clear", description: "Trim vegetation back from sidewalks, driveways, and corners so sight lines stay clear." },
    ],
    commonQuestions: [
      { question: "How long can grass legally get before it's a violation?", answer: "Generally, turfgrass must be cut once it grows taller than 20 centimetres.", sectionReference: "§ 489-2", practicalNextStep: "Mow before it passes 20 cm; report a chronically overgrown property to 311." },
      { question: "Are there plants I'm not allowed to grow?", answer: "Yes — the chapter lists 10 prohibited local weeds (Schedule A) that must be kept off private land, including giant hogweed and dog-strangling vine.", sectionReference: "§ 489-2.1, Schedule A", practicalNextStep: "Use the Prohibited Plants Identifier to identify and safely remove them." },
      { question: "Is my neighbour's overgrown vacant lot reportable?", answer: "Owners of vacant land must also keep turfgrass cut and prohibited plants removed, so an overgrown lot may be reportable.", practicalNextStep: "Submit a 311 service request with the address and a photo." },
      { question: "Does this apply to a natural garden?", answer: "The chapter is mainly about turfgrass height, prohibited weeds, and keeping sight lines clear; it notes it does not override the provincial Weed Control Act for natural gardens. Confirm details in the official chapter.", sectionReference: "§ 489-4", practicalNextStep: "Check the official Chapter 489 if you maintain a natural garden." },
    ],
    relatedTopics: [
      { label: "Prohibited Plants Identifier", href: "/prohibited-plants", description: "Identify the 10 prohibited plants and remove them safely." },
      PHOTO_REVIEW, T311,
      { label: "Official Chapter 489", href: "https://www.toronto.ca/legdocs/municode/1184_489.pdf", external: true },
    ],
    sourceNotes: SOURCE_NOTE("489, Turfgrass and Prohibited Plants"),
    lastReviewed: REVIEWED,
  },

  // ── 497 — Heating ──────────────────────────────────────────────────────────
  "497": {
    complexityLevel: "simple",
    plainLanguageOverview:
      "Chapter 497 protects tenants by requiring landlords to keep rental units adequately heated during the heating season. It sets a minimum indoor temperature and a defined season. (It also prohibits burning used motor oil in space heaters.)",
    keyRequirements: [
      { title: "Maintain at least 21°C during the heating season", plainLanguageExplanation: "A landlord must ensure a minimum air temperature of 21°C is maintained in all areas of a dwelling unit from October 1 to May 15, where the unit is normally heated at the landlord's expense. (If the unit is already at 21°C, the landlord doesn't have to run the heat.)", sectionReference: "Chapter 497, § 497-1.2 (Minimum temperature)", complianceExample: "A rental kept at 21°C or warmer throughout the winter.", nonComplianceExample: "A landlord-heated unit sitting at 17°C in January with no working heat." },
      { title: "Don't burn used motor oil in space heaters", plainLanguageExplanation: "No one may burn used motor oil within a space heater.", sectionReference: "Chapter 497, § 497-2.2", complianceExample: "Using approved heating fuel only.", nonComplianceExample: "Running a space heater on waste motor oil." },
    ],
    practicalComplianceSteps: [
      { title: "Tenants: document the temperature", description: "If your landlord-heated unit is too cold during the heating season, take dated photos of a thermometer reading in the affected rooms." },
      { title: "Tell your landlord in writing", description: "Report the problem to your landlord and keep a record of when you asked for the heat to be fixed." },
      { title: "Contact 311 if it isn't resolved", description: "If the unit stays below 21°C during the season, you can submit a service request to the City." },
    ],
    commonQuestions: [
      { question: "What's the minimum temperature my landlord must keep my unit at?", answer: "Generally 21°C, maintained in all areas of the unit from October 1 to May 15, where the unit is normally heated at the landlord's expense.", sectionReference: "§ 497-1.2", practicalNextStep: "Photograph a dated thermometer reading and notify your landlord." },
      { question: "My apartment is cold in winter — who do I contact?", answer: "Tell your landlord first and keep a record. If it isn't fixed during the heating season, contact Toronto 311.", practicalNextStep: "Submit a 311 request with your unit address and dated temperature evidence." },
      { question: "When does Toronto's heating season run?", answer: "Under the current chapter, the minimum-temperature requirement applies from October 1 to May 15.", sectionReference: "§ 497-1.2", practicalNextStep: "Confirm the current dates in the official Chapter 497, as they can be amended." },
    ],
    relatedTopics: [
      { label: "Vital Services (Chapter 835)", href: "/tmc-chapters/835", description: "Heat, water, electricity, and fuel in rentals." },
      PHOTO_REVIEW, T311,
      { label: "Official Chapter 497", href: "https://www.toronto.ca/legdocs/municode/1184_497.pdf", external: true },
    ],
    sourceNotes: SOURCE_NOTE("497, Heating") + " Season dates and temperatures can change by amendment — confirm the current values in the official chapter.",
    lastReviewed: REVIEWED,
  },

  // ── 548 — Littering and Dumping ────────────────────────────────────────────
  "548": {
    complexityLevel: "complex",
    plainLanguageOverview:
      "Chapter 548 prohibits littering and the illegal dumping of waste on public or private property, and requires owners to keep their land clear of accumulated waste. It is a broad chapter; the most common resident-facing points are summarized below.",
    keyRequirements: [
      { title: "No littering or depositing waste", plainLanguageExplanation: "No one may litter or deposit waste on public or private land where it doesn't belong.", sectionReference: "Chapter 548, § 548-3 (Littering and depositing waste prohibited)", complianceExample: "Using proper bins and taking waste to approved disposal.", nonComplianceExample: "Throwing trash on a boulevard or into a ravine." },
      { title: "No illegal dumping", plainLanguageExplanation: "Dumping waste — such as furniture, appliances, or construction debris — on public or private property is prohibited.", sectionReference: "Chapter 548, § 548-4 (Waste dumping prohibited)", complianceExample: "Booking a proper bulky-item pickup or using a transfer station.", nonComplianceExample: "Leaving a mattress or old couch on the curb or someone else's lot." },
      { title: "Keep your land clear of waste", plainLanguageExplanation: "Property owners must keep their land cleaned and cleared of accumulated waste.", sectionReference: "Chapter 548, § 548-5 (Cleaning and clearing)", complianceExample: "Removing accumulated garbage and debris from your yard.", nonComplianceExample: "A yard with piled-up garbage bags, junk, and debris." },
    ],
    practicalComplianceSteps: [
      { title: "Dispose of waste properly", description: "Use City collection, bulky-item pickups, or a transfer station for items that don't fit regular collection." },
      { title: "Keep your property clear", description: "Don't let garbage or debris accumulate on your land; clear it promptly." },
      { title: "Report dumping with details", description: "If you see illegal dumping, note the location, date/time, and what was dumped, and report it." },
    ],
    commonQuestions: [
      { question: "Someone dumped a mattress on the boulevard — how do I report it?", answer: "Illegal dumping is prohibited and can be reported to the City. Note the exact location and what was dumped.", sectionReference: "§ 548-4", practicalNextStep: "Submit a 311 request with the location, date, and a photo." },
      { question: "My neighbour's yard is full of garbage — what bylaw applies?", answer: "Owners must keep their land clear of accumulated waste; an overflowing yard may fall under this chapter (and Property Standards).", sectionReference: "§ 548-5", practicalNextStep: "Report the address to 311 with a photo." },
      { question: "Who cleans up illegal dumping on public property?", answer: "The City handles illegal dumping on public property once it's reported.", practicalNextStep: "Report the location to 311 so it can be scheduled for cleanup." },
    ],
    relatedTopics: [
      { label: "Waste Collection — Residential", href: "/tmc-chapters/846" },
      { label: "Refrigerators & Appliances (Chapter 659)", href: "/tmc-chapters/659" },
      PHOTO_REVIEW, T311,
      { label: "Official Chapter 548", href: "https://www.toronto.ca/legdocs/municode/1184_548.pdf", external: true },
    ],
    sourceNotes: SOURCE_NOTE("548, Littering and Dumping") + " This chapter is broad — only common points are summarized here.",
    lastReviewed: REVIEWED,
  },

  // ── 629 — Property Standards (complex) ─────────────────────────────────────
  "629": {
    complexityLevel: "complex",
    plainLanguageOverview:
      "Chapter 629 sets the minimum maintenance and occupancy standards for property in Toronto — covering structural safety, the exterior and interior condition of buildings, yards, and basic habitability for both rental and owner-occupied homes. It is a large, detailed chapter; the page below highlights common resident-facing topics rather than every section.",
    keyRequirements: [
      { title: "Maintain the building exterior", plainLanguageExplanation: "Exterior elements — walls, roofs, eavestroughs, downpipes, cladding, and trim — must be kept in good repair and weather-tight.", sectionReference: "Chapter 629 (property maintenance / exterior provisions)", complianceExample: "Repairing damaged siding and a leaking eavestrough.", nonComplianceExample: "Rotting cladding, holes in the wall, or a roof in disrepair." },
      { title: "Keep structural and safety elements sound", plainLanguageExplanation: "Stairs, porches, decks, railings, and guards must be safe and in good repair, and the building must be structurally sound.", sectionReference: "Chapter 629 (structural / guards and stairs provisions)", complianceExample: "Fixing a wobbly stair railing or a broken porch step.", nonComplianceExample: "A loose guardrail or unsafe, collapsing stairs." },
      { title: "Weather-tight windows and doors", plainLanguageExplanation: "Windows and doors must be maintained so they are weather-tight and secure.", sectionReference: "Chapter 629 (windows and doors provisions)", complianceExample: "Replacing a broken window and repairing a non-closing door.", nonComplianceExample: "Broken windows or doors that won't close or lock." },
      { title: "Yards and minimum standards", plainLanguageExplanation: "Yards must be kept free of unsafe accumulations, and rental units must meet minimum standards for habitability (pests, plumbing, etc.). Heat is addressed in Chapter 497.", sectionReference: "Chapter 629 (yards and minimum standards provisions)", complianceExample: "Clearing unsafe debris and addressing a pest problem in a rental.", nonComplianceExample: "Unsafe accumulations in the yard or an untreated pest infestation." },
    ],
    practicalComplianceSteps: [
      { title: "Keep up exterior repairs", description: "Address roof, wall, eavestrough, window, and door issues before they worsen." },
      { title: "Fix safety hazards first", description: "Prioritize stairs, railings, and guards so no one is at risk of a fall." },
      { title: "Tenants: report and document", description: "If you rent, report maintenance problems to your landlord in writing and keep dated photos.", caution: "Serious structural or safety hazards should be raised promptly." },
      { title: "Escalate to 311 if needed", description: "If standards aren't being met, you can submit a property standards service request to the City." },
    ],
    commonQuestions: [
      { question: "My landlord won't fix a broken stair railing — what can I do?", answer: "Property standards generally require stairs and railings to be safe and in good repair. Report it to your landlord in writing; if it isn't fixed, you can submit a property standards request to the City.", sectionReference: "Chapter 629 (structural/guards provisions)", practicalNextStep: "Document the hazard with dated photos and contact 311." },
      { question: "Is peeling paint or damaged siding a property standards issue?", answer: "Exterior surfaces generally must be maintained in good repair, so deteriorated cladding or extensive peeling may be a property standards concern.", sectionReference: "Chapter 629 (exterior provisions)", practicalNextStep: "Photograph the area and, for a rental, notify the owner; otherwise report to 311." },
      { question: "Who is responsible for maintaining the exterior of a rental building?", answer: "The property owner is generally responsible for maintaining the building to minimum property standards.", practicalNextStep: "Raise it with the owner; escalate to 311 if not addressed." },
    ],
    relatedTopics: [
      { label: "Heating (Chapter 497)", href: "/tmc-chapters/497" },
      { label: "Vital Services (Chapter 835)", href: "/tmc-chapters/835" },
      PHOTO_REVIEW, T311,
      { label: "Official Chapter 629", href: "https://www.toronto.ca/legdocs/municode/1184_629.pdf", external: true },
    ],
    sourceNotes: SOURCE_NOTE("629, Property Standards") + " This is a large chapter — only common topics are summarized; review the official chapter for complete requirements.",
    lastReviewed: REVIEWED,
  },

  // ── 632 — Vacant or Hazardous Property ─────────────────────────────────────
  "632": {
    complexityLevel: "moderate",
    plainLanguageOverview:
      "Chapter 632 addresses vacant buildings and hazardous property to protect public safety and neighbouring properties. It requires vacant buildings to be secured and maintained, hazardous property to be fenced, and dangerous trees or branches to be removed.",
    keyRequirements: [
      { title: "Secure and maintain vacant buildings", plainLanguageExplanation: "Vacant buildings must be secured against unauthorized entry and kept maintained so they don't become unsafe or attract problems.", sectionReference: "Chapter 632, § 632-3 (Vacant buildings)", complianceExample: "Boarding/securing all openings and maintaining an empty building.", nonComplianceExample: "An open, unsecured vacant house anyone can enter." },
      { title: "Fence hazardous property", plainLanguageExplanation: "Property that is hazardous must be fenced to keep people away from the danger.", sectionReference: "Chapter 632, § 632-4 (Fencing of hazardous property)", complianceExample: "Fencing off an excavation or unsafe structure.", nonComplianceExample: "An open hazard with no barrier near a sidewalk." },
      { title: "Remove dangerous trees or branches", plainLanguageExplanation: "Dangerous trees or branches that pose a risk must be removed.", sectionReference: "Chapter 632, § 632-5 (Removal of dangerous trees or branches)", complianceExample: "Removing a dead, leaning tree before it falls.", nonComplianceExample: "A clearly hazardous tree left to threaten people or property." },
    ],
    practicalComplianceSteps: [
      { title: "Secure empty buildings", description: "If you own a vacant building, secure all entry points and keep it maintained." },
      { title: "Barrier off hazards", description: "Fence or barrier any hazardous condition so the public is protected." },
      { title: "Report unsafe vacant property", description: "If a vacant building is open and unsafe, report the address to the City." },
    ],
    commonQuestions: [
      { question: "There's an abandoned house on my street — who do I contact?", answer: "Vacant buildings must be secured and maintained. An open, unsafe vacant building can be reported to the City.", sectionReference: "§ 632-3", practicalNextStep: "Submit a 311 request with the address and a photo." },
      { question: "A vacant building is open and unsafe — is that reportable?", answer: "Yes — if a vacant building isn't secured against entry, it may not meet this chapter's requirements.", sectionReference: "§ 632-3", practicalNextStep: "Report it to 311; note if it appears open or unsecured." },
      { question: "What does the City require owners of empty buildings to do?", answer: "Generally, to secure the building against entry and keep it maintained; hazardous conditions must also be addressed.", sectionReference: "§§ 632-3, 632-4", practicalNextStep: "Confirm specific obligations in the official Chapter 632." },
    ],
    relatedTopics: [
      { label: "Property Standards (Chapter 629)", href: "/tmc-chapters/629" },
      PHOTO_REVIEW, T311,
      { label: "Official Chapter 632", href: "https://www.toronto.ca/legdocs/municode/1184_632.pdf", external: true },
    ],
    sourceNotes: SOURCE_NOTE("632, Property, Vacant or Hazardous"),
    lastReviewed: REVIEWED,
  },

  // ── 659 — Refrigerators / Abandoned Appliances ─────────────────────────────
  "659": {
    complexityLevel: "simple",
    plainLanguageOverview:
      "Chapter 659 is a short safety bylaw. Before you discard, abandon, or leave out a refrigerator, freezer, washer, dryer, or similar appliance in a place a child could reach, you must remove all its doors and locks so no one can be trapped inside.",
    keyRequirements: [
      { title: "Remove all doors and locks before disposal", plainLanguageExplanation: "No one may leave, dispose of, or abandon a fridge, freezer, washer, dryer, or similar appliance in a place accessible to children without first removing all doors and locks and taking other precautions to prevent entrapment.", sectionReference: "Chapter 659, § 659-1 (Removal of all doors and locks)", complianceExample: "Taking the door off an old fridge before setting it out for pickup.", nonComplianceExample: "Leaving an old fridge at the curb or in a yard with the door still attached." },
      { title: "Limited retail/storage exception", plainLanguageExplanation: "The rule doesn't apply to appliances being displayed or stored by a manufacturer or retailer (indoors, or outdoors for sale) provided adequate precautions are taken.", sectionReference: "Chapter 659, § 659-2 (Exception)", complianceExample: "A retailer storing units indoors with precautions.", nonComplianceExample: "Treating a discarded appliance in a yard as if the retail exception applies." },
    ],
    practicalComplianceSteps: [
      { title: "Take the doors off first", description: "Remove all doors and locks from any appliance before discarding or storing it where children could reach it." },
      { title: "Arrange proper disposal", description: "Book an appliance/metal pickup or take it to a drop-off depot rather than abandoning it." },
      { title: "Report an unsafe appliance", description: "If you see an abandoned appliance with its door on in an accessible spot, report it.", caution: "An appliance with a door still on is a child-entrapment hazard." },
    ],
    commonQuestions: [
      { question: "Is it illegal to leave an old fridge at the curb with the door on?", answer: "Generally yes — you must remove all doors and locks before discarding or abandoning an appliance in a place accessible to children.", sectionReference: "§ 659-1", practicalNextStep: "Remove the doors, then arrange proper appliance pickup." },
      { question: "How should I dispose of a refrigerator safely?", answer: "Remove the doors and locks, then use a City appliance/metal pickup or an approved drop-off.", practicalNextStep: "Book a collection rather than leaving it out with the door on." },
      { question: "Who do I contact about an abandoned appliance in a public space?", answer: "Report it to the City, especially if a door is still attached and a child could reach it. The City can remove it at the owner's expense if needed.", sectionReference: "§ 659-4", practicalNextStep: "Submit a 311 request with the location and a photo." },
    ],
    relatedTopics: [
      { label: "Littering & Dumping (Chapter 548)", href: "/tmc-chapters/548" },
      T311,
      { label: "Official Chapter 659", href: "https://www.toronto.ca/legdocs/municode/1184_659.pdf", external: true },
    ],
    sourceNotes: SOURCE_NOTE("659, Refrigerators and Other Appliances, Abandoned"),
    lastReviewed: REVIEWED,
  },

  // ── 835 — Vital Services ───────────────────────────────────────────────────
  "835": {
    complexityLevel: "moderate",
    plainLanguageOverview:
      "Chapter 835 protects tenants by requiring landlords to provide vital services to rental units and prohibiting them from cutting those services off. 'Vital services' means fuel, hydro, gas, or hot or cold water.",
    keyRequirements: [
      { title: "Landlords must provide vital services", plainLanguageExplanation: "Every landlord must provide adequate and suitable vital services — fuel, hydro, gas, or hot or cold water — to each of their rental units.", sectionReference: "Chapter 835, §§ 835-1, 835-5", complianceExample: "Keeping water, electricity, gas, and fuel available to the unit.", nonComplianceExample: "A landlord shutting off the water or electricity to a tenant's unit." },
      { title: "Landlords must not cut services off", plainLanguageExplanation: "A landlord must not cease to provide a vital service. A landlord who is supposed to pay the supplier and fails to — causing the service to stop — is treated as having cut it off.", sectionReference: "Chapter 835, §§ 835-6, 835-7", complianceExample: "Paying utility bills so service continues.", nonComplianceExample: "Letting the hydro be disconnected by not paying the bill the landlord is responsible for." },
      { title: "Exception only for repairs", plainLanguageExplanation: "A landlord may stop a vital service only when necessary to alter or repair the unit, and only for the minimum time needed.", sectionReference: "Chapter 835, § 835-8", complianceExample: "Briefly shutting off water to fix a pipe, then restoring it.", nonComplianceExample: "Leaving a service off well beyond what a repair requires." },
    ],
    practicalComplianceSteps: [
      { title: "Tenants: document the loss of service", description: "Record which service stopped, and the date and time it was cut off." },
      { title: "Notify the landlord", description: "Tell the landlord in writing and keep a copy; ask for it to be restored." },
      { title: "Contact 311 if not restored", description: "If a vital service remains cut off in a way that isn't a permitted repair, you can report it to the City." },
    ],
    commonQuestions: [
      { question: "My landlord shut off the water — what can I do?", answer: "Landlords generally must provide vital services and must not cease them (except briefly for repairs). A shut-off may engage this chapter.", sectionReference: "§§ 835-5, 835-6", practicalNextStep: "Document the shut-off, notify the landlord in writing, and contact 311 if not restored." },
      { question: "What counts as a 'vital service'?", answer: "Fuel, hydro, gas, or hot or cold water.", sectionReference: "§ 835-1", practicalNextStep: "If one of these is cut off to your rental, note the details." },
      { question: "Who do I call if my heat or electricity is cut off in a rental?", answer: "You can report it to Toronto 311. (Heat is also addressed by the Heating bylaw, Chapter 497.)", practicalNextStep: "Submit a 311 request with your unit address and the date the service stopped." },
    ],
    relatedTopics: [
      { label: "Heating (Chapter 497)", href: "/tmc-chapters/497" },
      { label: "Property Standards (Chapter 629)", href: "/tmc-chapters/629" },
      T311,
      { label: "Official Chapter 835", href: "https://www.toronto.ca/legdocs/municode/1184_835.pdf", external: true },
    ],
    sourceNotes: SOURCE_NOTE("835, Vital Services, Discontinuance of"),
    lastReviewed: REVIEWED,
  },

  // ── 841 — Waste Collection, Commercial (complex) ───────────────────────────
  "841": {
    complexityLevel: "complex",
    plainLanguageOverview:
      "Chapter 841 sets the rules for waste collection at commercial properties — including which properties are eligible for City collection, how commercial waste must be stored and presented, and diversion/recycling obligations. It is a detailed chapter aimed at businesses; common points are summarized below.",
    keyRequirements: [
      { title: "Store and present commercial waste correctly", plainLanguageExplanation: "Commercial waste must be stored and set out according to the City's requirements (containers, location, and timing).", sectionReference: "Chapter 841 (storage and set-out provisions)", complianceExample: "Using the correct bins and setting out waste at the permitted time.", nonComplianceExample: "Overflowing commercial bins or waste set out improperly." },
      { title: "Meet diversion / recycling obligations", plainLanguageExplanation: "Businesses generally have recycling and waste-diversion obligations to separate materials from garbage.", sectionReference: "Chapter 841 (diversion / recycling provisions)", complianceExample: "Separating recyclables and organics as required.", nonComplianceExample: "Mixing recyclables into garbage where diversion is required." },
      { title: "Don't put commercial waste in residential collection", plainLanguageExplanation: "Business waste should not be placed into residential collection where that isn't permitted.", sectionReference: "Chapter 841 (eligibility provisions)", complianceExample: "Arranging the appropriate commercial collection or a private hauler.", nonComplianceExample: "Dumping business waste into nearby residential bins or collection." },
    ],
    practicalComplianceSteps: [
      { title: "Confirm your collection type", description: "Check whether your commercial property is eligible for City collection or needs a private hauler." },
      { title: "Sort and set out correctly", description: "Separate recyclables/organics as required and set out waste in the right containers at the right time." },
      { title: "Check the official requirements", description: "Because this chapter is detailed, confirm the specific rules for your property in the official chapter and on the City's business waste pages." },
    ],
    commonQuestions: [
      { question: "Does the City collect garbage from my business?", answer: "It depends on eligibility — not all commercial properties receive City collection. Confirm your property's status with the City.", practicalNextStep: "Check the City's commercial waste information or contact 311." },
      { question: "How should a commercial property store and set out waste?", answer: "Generally in approved containers, at the permitted location and time, with required materials separated for diversion.", practicalNextStep: "Review the official Chapter 841 set-out requirements." },
      { question: "What are the recycling rules for businesses?", answer: "Businesses generally must divert recyclables and organics from garbage. The specifics are set out in the chapter and City guidance.", practicalNextStep: "Confirm your diversion obligations in the official chapter." },
    ],
    relatedTopics: [
      { label: "Waste Collection — Residential", href: "/tmc-chapters/846" },
      { label: "Littering & Dumping (Chapter 548)", href: "/tmc-chapters/548" },
      T311,
      { label: "Official Chapter 841", href: "https://www.toronto.ca/legdocs/municode/1184_841.pdf", external: true },
    ],
    sourceNotes: SOURCE_NOTE("841, Waste Collection, Commercial Properties") + " This is a detailed chapter — only common topics are summarized.",
    lastReviewed: REVIEWED,
  },

  // ── 846 — Waste Collection, Residential ────────────────────────────────────
  "846": {
    complexityLevel: "complex",
    plainLanguageOverview:
      "This page covers residential waste collection — garbage, recycling (Blue Bin), and organics (Green Bin) — including how and when to set out waste and bins. Most day-to-day rules (set-out times, bin sizes, what goes in each bin) are operational and are published on the City's waste pages; confirm the current details there.",
    keyRequirements: [
      { title: "Sort waste into the right streams", plainLanguageExplanation: "Residential waste must be separated into garbage, recycling, and organics, with each placed in the correct bin.", sectionReference: "Residential waste collection rules (see City waste pages / Chapter 844)", complianceExample: "Recyclables in the Blue Bin, food/organics in the Green Bin, garbage in the garbage bin.", nonComplianceExample: "Recyclables or organics thrown in the garbage, or contaminated bins." },
      { title: "Set out bins at the right time", plainLanguageExplanation: "Bins must be set out and brought back within the City's permitted times, and not left at the curb for long periods.", sectionReference: "Residential waste collection rules (see City waste pages)", complianceExample: "Putting bins out the night before/morning of collection and returning them the same day.", nonComplianceExample: "Bins left at the curb for days before and after collection." },
    ],
    practicalComplianceSteps: [
      { title: "Check your collection schedule", description: "Use the City's collection schedule for your address to know your garbage, recycling, and organics days." },
      { title: "Sort correctly", description: "Put recyclables in the Blue Bin, food and organic waste in the Green Bin, and the rest in the garbage bin." },
      { title: "Set out and retrieve bins on time", description: "Put bins out within the permitted window and bring them back in promptly after collection." },
      { title: "Confirm specifics on the City site", description: "Set-out times, bin limits, and accepted items are operational details — verify them on the City's waste pages." },
    ],
    commonQuestions: [
      { question: "What time do I need to put my bins out?", answer: "Set-out times are published by the City for your collection area. Bins should be out within the permitted window and brought back the same day.", practicalNextStep: "Check the City's residential collection set-out times for your address." },
      { question: "What goes in the green bin vs the blue bin?", answer: "Food and organic waste go in the Green Bin; recyclable containers and paper go in the Blue Bin. The City's 'Waste Wizard' lists specific items.", practicalNextStep: "Use the City's Waste Wizard to look up a specific item." },
      { question: "My neighbour leaves bins at the curb for days — is that allowed?", answer: "Bins are generally meant to be set out and retrieved within the permitted times, not left out for long periods. Chronic issues can be reported.", practicalNextStep: "Report a persistent problem to 311 with the address." },
    ],
    relatedTopics: [
      { label: "Waste Collection — Commercial", href: "/tmc-chapters/841" },
      { label: "Littering & Dumping (Chapter 548)", href: "/tmc-chapters/548" },
      T311,
      { label: "City of Toronto — Garbage, Recycling & Organics", href: "https://www.toronto.ca/services-payments/recycling-organics-garbage/", external: true },
    ],
    sourceNotes:
      "Note: in the Toronto Municipal Code, residential waste collection rules are primarily in Chapter 844, while Chapter 846 covers waste management facilities. Day-to-day set-out times and accepted-item lists are operational and published on the City's waste pages — always confirm the current details there. Summarized for general reference only, not legal advice.",
    lastReviewed: REVIEWED,
  },

  // ── Former North York Zoning By-law ────────────────────────────────────────
  "former-north-york-zoning": {
    complexityLevel: "complex",
    plainLanguageOverview:
      "This is a legacy zoning by-law from the former City of North York that may still apply to some properties where the city-wide Zoning By-law 569-2013 does not fully replace it. Zoning is property-specific, so the right rules depend on the exact lot. Use the official zoning resources and the Zoning Map Viewer to confirm what applies.",
    keyRequirements: [
      { title: "Legacy zoning may still apply to some lots", plainLanguageExplanation: "For certain former North York properties, legacy zoning provisions may still govern use, setbacks, height, or other standards alongside or instead of By-law 569-2013.", sectionReference: "Former North York Zoning By-law (property-specific)", complianceExample: "Confirming which by-law governs your lot before designing a project.", nonComplianceExample: "Assuming only 569-2013 applies when a legacy provision still governs the lot." },
    ],
    practicalComplianceSteps: [
      { title: "Identify your zone", description: "Use the City's Zoning Map Viewer to find the zoning that applies to your specific property." },
      { title: "Use the Zoning Guide", description: "Use this site's Zoning Guide for plain-language explanations of common residential zoning topics." },
      { title: "Confirm with the City", description: "For a property-specific determination, rely on the official zoning resources or City staff." },
    ],
    commonQuestions: [
      { question: "Does the old North York zoning by-law still apply to my property?", answer: "It may, for some properties. Zoning is property-specific, so the only reliable answer comes from the official zoning resources for your exact lot.", practicalNextStep: "Check the Zoning Map Viewer and the Zoning Guide for your address." },
      { question: "Why are there two zoning by-laws for my area?", answer: "The city-wide By-law 569-2013 was harmonized across the former municipalities, but some legacy provisions can still apply in certain cases.", practicalNextStep: "Confirm which by-law governs your lot using official zoning resources." },
    ],
    relatedTopics: [
      { label: "Zoning Guide", href: "/zoning", description: "Plain-language residential zoning topics + Chapter 10 search." },
      { label: "Zoning Map Viewer", href: "https://map.toronto.ca/maps/map.jsp?app=ZBL_CONSULT", external: true },
      T311,
    ],
    sourceNotes:
      "Zoning is property-specific and this legacy by-law only applies to certain former North York lots. Always confirm the governing by-law using the official Zoning Map Viewer or City staff. Summarized for general reference only, not legal advice.",
    lastReviewed: REVIEWED,
  },
};

export function getChapterContent(slug: string): ChapterContent | undefined {
  return chapterContent[slug];
}
