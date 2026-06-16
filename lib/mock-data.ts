// ─────────────────────────────────────────────────────────────────────────────
//  Toronto Bylaw Hub — centralized content data (V3)
//  All page content is sourced from this file so data stays separate from UI.
// ─────────────────────────────────────────────────────────────────────────────

import { prohibitedPlants } from "./prohibited-plants";

/** Official City of Toronto 311 service request page. Used for every external 311 button. */
export const OFFICIAL_311_URL =
  "https://www.toronto.ca/home/311-toronto-at-your-service/create-a-service-request/";

/** General Toronto Municipal Code landing page. */
export const TMC_INDEX_URL =
  "https://www.toronto.ca/city-government/city-administration/city-managers-office/agencies-corporations/toronto-municipal-code/";

// ─── Official zoning URLs (centralized) ─────────────────────────────────────────

/** Toronto Zoning Map Viewer (ZBL consultation app). */
export const ZONING_MAP_VIEWER_URL = "https://map.toronto.ca/maps/map.jsp?app=ZBL_CONSULT";

/** Official Zoning By-law & Preliminary Zoning Reviews page. */
export const OFFICIAL_ZONING_SOURCE_URL =
  "https://www.toronto.ca/city-government/planning-development/zoning-by-law-preliminary-zoning-reviews/";

/** Official Zoning By-law 569-2013 Chapter 10 (Residential) source page. */
export const CHAPTER_10_SOURCE_URL =
  "https://www.toronto.ca/zoning/bylaw_amendments/ZBL_NewProvision_Chapter10.htm";

/**
 * Canonical "official zoning by-law" link used across the site (zoning topics,
 * TMC zoning chapters, footer). Aliased to the corrected official source URL.
 */
export const ZONING_OFFICIAL_URL = OFFICIAL_ZONING_SOURCE_URL;

// ─── TMC Chapters ──────────────────────────────────────────────────────────────

export interface BylawChapter {
  /** URL slug, e.g. "629" or "zoning-569-2013-v1". */
  slug: string;
  /** Display identifier, e.g. "Chapter 629" content number. */
  chapterNumber: string;
  /** Official municode reference label, e.g. "1184_629". */
  codeRef: string;
  title: string;
  category: "Property" | "Waste" | "Zoning" | "Health & Safety" | "Business";
  plainLanguageSummary: string;
  whatThisCovers: string[];
  commonResidentQuestions: string[];
  commonExamples: string[];
  relatedIssueTypes: string[];
  tags: string[];
  whoItApplies: string;
  officialUrl: string;
  pdfUrl: string | null;
  /** Slugs of related chapters. */
  relatedChapters: string[];
}

export const tmcCategories = ["All", "Property", "Waste", "Zoning", "Health & Safety", "Business"] as const;

export const bylawChapters: BylawChapter[] = [
  {
    slug: "629",
    chapterNumber: "629",
    codeRef: "1184_629",
    title: "Property Standards",
    category: "Property",
    plainLanguageSummary:
      "Sets the minimum maintenance and occupancy standards for all property in Toronto — structural safety, exterior and interior condition, yards, and basic habitability for both homes and commercial buildings.",
    whatThisCovers: [
      "Maintenance of exterior walls, roofs, eavestroughs, and downpipes",
      "Safe stairs, porches, decks, railings, and guards",
      "Weather-tight windows and doors",
      "Yard upkeep and removal of unsafe accumulations",
      "Minimum standards for rental and owner-occupied dwellings",
    ],
    commonResidentQuestions: [
      "My landlord won't fix a broken stair railing — what can I do?",
      "Is peeling paint or damaged siding a property standards issue?",
      "Who is responsible for maintaining the exterior of a rental building?",
    ],
    commonExamples: [
      "Damaged or deteriorated exterior cladding",
      "Broken windows or doors",
      "Defective eavestroughs and downpipes",
      "Unsafe stairs, porches, or railings",
      "Peeling paint exposing bare wood",
    ],
    relatedIssueTypes: ["Property Standards", "Vital Services", "Heating"],
    tags: ["property maintenance", "residential", "commercial", "structural", "yards"],
    whoItApplies: "All property owners and occupants in Toronto — residential and commercial.",
    officialUrl: "https://www.toronto.ca/legdocs/municode/1184_629.pdf",
    pdfUrl: "/pdfs/ch629.pdf",
    relatedChapters: ["632", "497", "835"],
  },
  {
    slug: "447",
    chapterNumber: "447",
    codeRef: "1184_447",
    title: "Fences",
    category: "Property",
    plainLanguageSummary:
      "Regulates the height, materials, and condition of fences on private property, and sets the safety requirements for swimming pool enclosures, which require a permit.",
    whatThisCovers: [
      "Maximum fence heights in front, side, and rear yards",
      "Prohibited fence materials",
      "Swimming pool enclosure requirements (height, gaps, gates)",
      "Self-closing and self-latching pool gates",
      "Maintenance of fences in a safe condition",
    ],
    commonResidentQuestions: [
      "How tall can my front yard fence be?",
      "Does my pool need a fence, and what are the rules?",
      "My neighbour's fence is falling down — is that reportable?",
    ],
    commonExamples: [
      "Front yard fence taller than the permitted height",
      "Pool enclosure without a self-latching gate",
      "Gaps in a pool fence larger than allowed",
      "Climbable objects within 1.2 m of a pool enclosure",
    ],
    relatedIssueTypes: ["Fence", "Pool Fence / Pool Enclosure", "Zoning Concern"],
    tags: ["fences", "pool enclosure", "permit", "height", "materials"],
    whoItApplies: "Property owners constructing, altering, or maintaining fences and pool enclosures.",
    officialUrl: "https://www.toronto.ca/legdocs/municode/1184_447.pdf",
    pdfUrl: "/pdfs/ch447.pdf",
    relatedChapters: ["629", "489"],
  },
  {
    slug: "485",
    chapterNumber: "485",
    codeRef: "1184_485",
    title: "Graffiti",
    category: "Property",
    plainLanguageSummary:
      "Prohibits creating graffiti and requires property owners to keep their property free of graffiti, removing it within the timeframe set by the City after notice.",
    whatThisCovers: [
      "Prohibition on creating or placing graffiti",
      "Owner responsibility to remove graffiti from their property",
      "Timeframes for removal after a City notice",
      "Application to walls, fences, and structures",
    ],
    commonResidentQuestions: [
      "There's graffiti on my fence — do I have to remove it?",
      "How do I report graffiti on a utility box or public property?",
      "How long do I have to remove graffiti after the City notifies me?",
    ],
    commonExamples: [
      "Tags or murals on a building exterior",
      "Graffiti on a wooden or metal fence",
      "Vandalism on a utility or hydro box",
      "Graffiti on a garage door",
    ],
    relatedIssueTypes: ["Graffiti", "Property Standards"],
    tags: ["graffiti", "vandalism", "removal", "defacement"],
    whoItApplies: "All property owners and occupants; anyone who creates graffiti.",
    officialUrl: "https://www.toronto.ca/legdocs/municode/1184_485.pdf",
    pdfUrl: "/pdfs/ch485.pdf",
    relatedChapters: ["629"],
  },
  {
    slug: "489",
    chapterNumber: "489",
    codeRef: "1184_489",
    title: "Turfgrass and Prohibited Plants",
    category: "Property",
    plainLanguageSummary:
      "Requires property owners to keep turfgrass cut and prevents prohibited or noxious plants. Helps keep yards safe, tidy, and free of overgrowth that can harbour pests.",
    whatThisCovers: [
      "Maximum permitted height for turfgrass",
      "Removal of prohibited and noxious plants",
      "Yard maintenance on occupied and vacant land",
      "Exemptions for natural gardens that meet requirements",
    ],
    commonResidentQuestions: [
      "How long can grass legally get before it's a violation?",
      "Is my neighbour's overgrown vacant lot reportable?",
      "Are there plants I'm not allowed to grow?",
    ],
    commonExamples: [
      "Turfgrass well above the permitted height",
      "Overgrown vegetation on a vacant property",
      "Prohibited invasive plants such as Giant Hogweed",
    ],
    relatedIssueTypes: ["Turfgrass / Weeds", "Property Standards"],
    tags: ["grass", "weeds", "turfgrass", "overgrown", "prohibited plants"],
    whoItApplies: "All property owners in Toronto, including owners of vacant lots.",
    officialUrl: "https://www.toronto.ca/legdocs/municode/1184_489.pdf",
    pdfUrl: "/pdfs/ch489.pdf",
    relatedChapters: ["629", "632"],
  },
  {
    slug: "497",
    chapterNumber: "497",
    codeRef: "1184_497",
    title: "Heating",
    category: "Property",
    plainLanguageSummary:
      "Requires landlords and building owners to provide adequate heat to occupied rooms during the heating season, maintaining a minimum indoor temperature.",
    whatThisCovers: [
      "Minimum indoor temperature requirements",
      "The defined heating season",
      "Landlord and building owner responsibilities",
      "Habitable rooms that must be heated",
    ],
    commonResidentQuestions: [
      "What's the minimum temperature my landlord must keep my unit at?",
      "My apartment is cold in winter — who do I contact?",
      "When does Toronto's heating season run?",
    ],
    commonExamples: [
      "Indoor temperature below the minimum during the heating season",
      "Landlord not repairing a broken furnace or boiler",
      "Heat repeatedly turned off overnight",
    ],
    relatedIssueTypes: ["Heating", "Vital Services", "Property Standards"],
    tags: ["heating", "landlord", "tenant", "temperature", "vital services"],
    whoItApplies: "Residential building owners and landlords providing rental accommodation.",
    officialUrl: "https://www.toronto.ca/legdocs/municode/1184_497.pdf",
    pdfUrl: "/pdfs/ch497.pdf",
    relatedChapters: ["835", "629"],
  },
  {
    slug: "548",
    chapterNumber: "548",
    codeRef: "1184_548",
    title: "Littering and Dumping of Refuse",
    category: "Waste",
    plainLanguageSummary:
      "Prohibits littering and the illegal dumping of refuse on public or private property, and requires owners to keep their land free of accumulated waste.",
    whatThisCovers: [
      "Prohibition on littering in public spaces",
      "Illegal dumping of furniture, appliances, and waste",
      "Owner duty to keep property free of refuse",
      "Disposal of waste on another person's property",
    ],
    commonResidentQuestions: [
      "Someone dumped a mattress on the boulevard — how do I report it?",
      "My neighbour's yard is full of garbage — what bylaw applies?",
      "Who cleans up illegal dumping on public property?",
    ],
    commonExamples: [
      "Mattress, furniture, or appliances dumped on a boulevard",
      "Accumulated garbage bags or debris in a yard",
      "Construction waste left between projects",
    ],
    relatedIssueTypes: ["Waste / Littering / Dumping", "Property Standards"],
    tags: ["littering", "dumping", "refuse", "waste", "illegal dumping"],
    whoItApplies: "All individuals and property owners in Toronto.",
    officialUrl: "https://www.toronto.ca/legdocs/municode/1184_548.pdf",
    pdfUrl: "/pdfs/ch548.pdf",
    relatedChapters: ["846", "841", "659"],
  },
  {
    slug: "632",
    chapterNumber: "632",
    codeRef: "1184_632",
    title: "Vacant or Hazardous Buildings",
    category: "Property",
    plainLanguageSummary:
      "Sets requirements for securing and maintaining vacant buildings and addresses buildings that are hazardous, to protect public safety and neighbouring properties.",
    whatThisCovers: [
      "Securing vacant buildings against entry",
      "Maintenance obligations for vacant property",
      "Addressing hazardous building conditions",
      "Boarding and registration requirements",
    ],
    commonResidentQuestions: [
      "There's an abandoned house on my street — who do I contact?",
      "A vacant building is open and unsafe — is that reportable?",
      "What does the City require owners of empty buildings to do?",
    ],
    commonExamples: [
      "Open, unsecured vacant building",
      "Hazardous structure at risk of collapse",
      "Vacant property attracting pests or dumping",
    ],
    relatedIssueTypes: ["Vacant or Hazardous Property", "Property Standards"],
    tags: ["vacant", "hazardous", "abandoned building", "boarding", "safety"],
    whoItApplies: "Owners of vacant or hazardous buildings in Toronto.",
    officialUrl: "https://www.toronto.ca/legdocs/municode/1184_632.pdf",
    pdfUrl: "/pdfs/ch632.pdf",
    relatedChapters: ["629", "489", "659"],
  },
  {
    slug: "659",
    chapterNumber: "659",
    codeRef: "1184_659",
    title: "Refrigerators and Other Appliances, Abandonment",
    category: "Health & Safety",
    plainLanguageSummary:
      "Addresses the unsafe abandonment of refrigerators and other appliances that could trap a child, requiring doors to be removed or the appliance secured before disposal.",
    whatThisCovers: [
      "Removal of doors from discarded refrigerators and similar appliances",
      "Preventing child entrapment hazards",
      "Safe handling of abandoned appliances",
    ],
    commonResidentQuestions: [
      "Is it illegal to leave an old fridge at the curb with the door on?",
      "How should I dispose of a refrigerator safely?",
      "Who do I contact about an abandoned appliance in a public space?",
    ],
    commonExamples: [
      "Discarded refrigerator with the door still attached",
      "Abandoned freezer in an accessible area",
      "Appliances left where children could become trapped",
    ],
    relatedIssueTypes: ["Vacant or Hazardous Property", "Waste / Littering / Dumping"],
    tags: ["refrigerator", "appliance", "abandonment", "child safety", "entrapment"],
    whoItApplies: "Anyone disposing of or abandoning refrigerators and similar appliances.",
    officialUrl: "https://www.toronto.ca/legdocs/municode/1184_659.pdf",
    pdfUrl: null,
    relatedChapters: ["548", "632"],
  },
  {
    slug: "835",
    chapterNumber: "835",
    codeRef: "1184_835",
    title: "Vital Services, Discontinuance of",
    category: "Property",
    plainLanguageSummary:
      "Protects tenants by addressing the discontinuance of vital services such as heat, water, electricity, or fuel in rental housing, and the City's ability to act.",
    whatThisCovers: [
      "Vital services that landlords must maintain (heat, water, electricity, fuel)",
      "Process when a vital service is cut off",
      "Tenant protections and City intervention",
    ],
    commonResidentQuestions: [
      "My landlord shut off the water — what can I do?",
      "What counts as a 'vital service'?",
      "Who do I call if my heat or electricity is cut off in a rental?",
    ],
    commonExamples: [
      "Heat discontinued during the heating season",
      "Water or electricity shut off to a rental unit",
      "Fuel supply interrupted by an owner",
    ],
    relatedIssueTypes: ["Vital Services", "Heating", "Property Standards"],
    tags: ["vital services", "heat", "water", "electricity", "tenant"],
    whoItApplies: "Landlords and owners of rental housing; affected tenants.",
    officialUrl: "https://www.toronto.ca/legdocs/municode/1184_835.pdf",
    pdfUrl: null,
    relatedChapters: ["497", "629"],
  },
  {
    slug: "841",
    chapterNumber: "841",
    codeRef: "1184_841",
    title: "Waste Collection — Commercial Properties",
    category: "Waste",
    plainLanguageSummary:
      "Sets out waste collection rules and requirements for commercial properties, including how and when commercial waste must be managed and presented.",
    whatThisCovers: [
      "Commercial waste collection eligibility and requirements",
      "How commercial waste must be stored and presented",
      "Diversion and recycling obligations for businesses",
    ],
    commonResidentQuestions: [
      "Does the City collect garbage from my business?",
      "How should a commercial property store and set out waste?",
      "What are the recycling rules for businesses?",
    ],
    commonExamples: [
      "Commercial waste set out improperly",
      "Overflowing commercial bins",
      "Business waste placed in residential collection",
    ],
    relatedIssueTypes: ["Waste / Littering / Dumping"],
    tags: ["waste collection", "commercial", "business", "recycling", "garbage"],
    whoItApplies: "Owners and operators of commercial properties in Toronto.",
    officialUrl: "https://www.toronto.ca/legdocs/municode/1184_841.pdf",
    pdfUrl: "/pdfs/ch841.pdf",
    relatedChapters: ["846", "548"],
  },
  {
    slug: "846",
    chapterNumber: "846",
    codeRef: "1184_846",
    title: "Waste Collection — Residential Properties",
    category: "Waste",
    plainLanguageSummary:
      "Sets out waste collection rules for residential properties, including garbage, recycling, organics, set-out times, and bin requirements.",
    whatThisCovers: [
      "Residential garbage, recycling, and organics collection",
      "When and how to set out waste and bins",
      "Bin requirements and limits",
      "Improper set-out and collection issues",
    ],
    commonResidentQuestions: [
      "What time do I need to put my bins out?",
      "My neighbour leaves bins at the curb for days — is that allowed?",
      "What goes in the green bin vs the blue bin?",
    ],
    commonExamples: [
      "Bins left at the curb long after collection",
      "Waste set out at the wrong time",
      "Improperly sorted recycling or organics",
    ],
    relatedIssueTypes: ["Waste / Littering / Dumping", "Property Standards"],
    tags: ["waste collection", "residential", "recycling", "organics", "garbage", "bins"],
    whoItApplies: "Residential property owners and occupants receiving City collection.",
    officialUrl: "https://www.toronto.ca/legdocs/municode/1184_846.pdf",
    pdfUrl: "/pdfs/ch846.pdf",
    relatedChapters: ["841", "548"],
  },
  {
    slug: "417",
    chapterNumber: "417",
    codeRef: "toronto-code-417",
    title: "Dust",
    category: "Health & Safety",
    plainLanguageSummary:
      "Addresses the prevention of dust from properties and activities so that dust does not become a nuisance or hazard to neighbouring properties.",
    whatThisCovers: [
      "Preventing dust from leaving a property",
      "Dust control during certain activities",
      "Owner responsibility to limit dust nuisance",
    ],
    commonResidentQuestions: [
      "A nearby site is creating constant dust — is that a bylaw issue?",
      "Who is responsible for controlling dust from a property?",
      "How do I report a dust nuisance?",
    ],
    commonExamples: [
      "Excessive dust drifting from a property onto neighbours",
      "Uncontrolled dust from stored material",
      "Dust nuisance affecting adjacent homes",
    ],
    relatedIssueTypes: ["Dust", "Property Standards"],
    tags: ["dust", "nuisance", "air", "health", "neighbour"],
    whoItApplies: "Property owners and operators whose activities may create dust.",
    officialUrl: "https://www.toronto.ca/legdocs/municode/toronto-code-417.pdf",
    pdfUrl: "/pdfs/ch417.pdf",
    relatedChapters: ["629", "632"],
  },
  {
    slug: "395",
    chapterNumber: "395",
    codeRef: "1184_395",
    title: "Clothing Drop Boxes",
    category: "Business",
    plainLanguageSummary:
      "Regulates clothing drop boxes in Toronto, including permitting, placement, and maintenance, to keep them safe and properly located.",
    whatThisCovers: [
      "Permit requirements for clothing drop boxes",
      "Where drop boxes may be placed",
      "Maintenance and overflow responsibilities",
      "Removal of non-compliant boxes",
    ],
    commonResidentQuestions: [
      "Is a clothing donation box allowed in this location?",
      "A drop box is overflowing — who do I report it to?",
      "Do clothing drop boxes need a permit?",
    ],
    commonExamples: [
      "Unpermitted clothing drop box",
      "Overflowing or damaged donation box",
      "Drop box placed in a prohibited location",
    ],
    relatedIssueTypes: ["Clothing Drop Box", "Waste / Littering / Dumping"],
    tags: ["clothing drop box", "donation box", "permit", "placement"],
    whoItApplies: "Owners and operators of clothing drop boxes.",
    officialUrl: "https://www.toronto.ca/legdocs/municode/1184_395.pdf",
    pdfUrl: "/pdfs/ch395.pdf",
    relatedChapters: ["548"],
  },
  {
    slug: "480",
    chapterNumber: "480",
    codeRef: "1184_480",
    title: "Garage Sales",
    category: "Business",
    plainLanguageSummary:
      "Sets the rules for residential garage and yard sales, including how many are permitted and basic conditions, so occasional sales stay neighbourly.",
    whatThisCovers: [
      "Number of garage sales permitted per year",
      "Conditions for holding a residential sale",
      "Signage and nuisance considerations",
    ],
    commonResidentQuestions: [
      "How many garage sales can I have in a year?",
      "Do I need anything to hold a yard sale?",
      "Are there rules about garage sale signs?",
    ],
    commonExamples: [
      "More garage sales than permitted",
      "A sale operating like an ongoing business",
      "Garage sale signage left up after the event",
    ],
    relatedIssueTypes: ["Garage Sale", "Zoning Concern"],
    tags: ["garage sale", "yard sale", "residential", "signage"],
    whoItApplies: "Residents holding garage or yard sales.",
    officialUrl: "https://www.toronto.ca/legdocs/municode/1184_480.pdf",
    pdfUrl: "/pdfs/ch480.pdf",
    relatedChapters: ["395"],
  },
  // ── Zoning By-law 569-2013 documents ──
  {
    slug: "zoning-569-2013-v1-ch1-800",
    chapterNumber: "569-2013 · Vol 1",
    codeRef: "569-2013 Volume 1 (Chapters 1–800)",
    title: "Zoning By-law No. 569-2013 — Volume 1 (Chapters 1–800)",
    category: "Zoning",
    plainLanguageSummary:
      "The foundational volume of Toronto's city-wide Zoning By-law, covering general provisions, definitions, and the core regulations that apply across zones.",
    whatThisCovers: [
      "General provisions and how the by-law is applied",
      "Definitions used throughout the by-law",
      "Core regulations for use, setbacks, height, and parking",
    ],
    commonResidentQuestions: [
      "Where do I find the general zoning rules for my property?",
      "What do common zoning terms mean?",
      "Which zone is my property in?",
    ],
    commonExamples: [
      "Looking up a definition used in the by-law",
      "Checking the general regulation for a residential zone",
    ],
    relatedIssueTypes: ["Zoning Concern", "Setbacks", "Parking"],
    tags: ["zoning", "569-2013", "general provisions", "definitions", "volume 1"],
    whoItApplies: "All property owners, builders, and occupants in Toronto.",
    officialUrl: ZONING_OFFICIAL_URL,
    pdfUrl: null,
    relatedChapters: ["zoning-569-2013-v1-ch900", "zoning-569-2013-v3", "zoning-569-2013-v4"],
  },
  {
    slug: "zoning-569-2013-v1-ch900",
    chapterNumber: "569-2013 · Vol 1",
    codeRef: "569-2013 Volume 1 (Chapters 900.10+)",
    title: "Zoning By-law No. 569-2013 — Volume 1 (Chapters 900.10–…)",
    category: "Zoning",
    plainLanguageSummary:
      "The continuation of Volume 1 covering specific-area and overlay provisions in the 900-series chapters of the Zoning By-law.",
    whatThisCovers: [
      "Specific-area zoning provisions",
      "Overlay and exception regulations",
      "Detailed 900-series chapters",
    ],
    commonResidentQuestions: [
      "Is there a special zoning rule for my specific area?",
      "What is an overlay or exception in zoning?",
    ],
    commonExamples: [
      "Checking a site-specific exception",
      "Reviewing an overlay that affects a property",
    ],
    relatedIssueTypes: ["Zoning Concern"],
    tags: ["zoning", "569-2013", "overlay", "exceptions", "volume 1"],
    whoItApplies: "Property owners and builders in affected areas of Toronto.",
    officialUrl: ZONING_OFFICIAL_URL,
    pdfUrl: null,
    relatedChapters: ["zoning-569-2013-v1-ch1-800", "zoning-569-2013-v3", "zoning-569-2013-v4"],
  },
  {
    slug: "zoning-569-2013-v3",
    chapterNumber: "569-2013 · Vol 3",
    codeRef: "569-2013 Volume 3 (Chapters 900.1–90…)",
    title: "Zoning By-law No. 569-2013 — Volume 3 (Chapters 900.1–90…)",
    category: "Zoning",
    plainLanguageSummary:
      "Volume 3 of the Zoning By-law, containing additional specific-area regulations and exceptions within the 900-series chapters.",
    whatThisCovers: [
      "Further specific-area regulations",
      "Site and area exceptions",
      "Supplementary 900-series provisions",
    ],
    commonResidentQuestions: [
      "Are there additional exceptions that apply to my property?",
      "Where do I find supplementary zoning provisions?",
    ],
    commonExamples: [
      "Reviewing a supplementary area regulation",
      "Confirming a site-specific exception",
    ],
    relatedIssueTypes: ["Zoning Concern"],
    tags: ["zoning", "569-2013", "exceptions", "volume 3"],
    whoItApplies: "Property owners and builders in affected areas of Toronto.",
    officialUrl: ZONING_OFFICIAL_URL,
    pdfUrl: null,
    relatedChapters: ["zoning-569-2013-v1-ch1-800", "zoning-569-2013-v1-ch900", "zoning-569-2013-v4"],
  },
  {
    slug: "zoning-569-2013-v4",
    chapterNumber: "569-2013 · Vol 4",
    codeRef: "569-2013 Volume 4 (Chapters 970–995)",
    title: "Zoning By-law No. 569-2013 — Volume 4 (Chapters 970–995)",
    category: "Zoning",
    plainLanguageSummary:
      "Volume 4 of the Zoning By-law, covering the 970–995 chapters including additional regulations and schedules.",
    whatThisCovers: [
      "970–995 series regulations",
      "Additional schedules and provisions",
      "Closing chapters of the by-law",
    ],
    commonResidentQuestions: [
      "Where are the later chapters and schedules of the by-law?",
      "What is contained in the 970–995 chapters?",
    ],
    commonExamples: [
      "Reviewing a schedule in the by-law",
      "Checking a late-chapter regulation",
    ],
    relatedIssueTypes: ["Zoning Concern"],
    tags: ["zoning", "569-2013", "schedules", "volume 4"],
    whoItApplies: "Property owners and builders in Toronto.",
    officialUrl: ZONING_OFFICIAL_URL,
    pdfUrl: null,
    relatedChapters: ["zoning-569-2013-v1-ch1-800", "zoning-569-2013-v1-ch900", "zoning-569-2013-v3"],
  },
  {
    slug: "former-north-york-zoning",
    chapterNumber: "Former NY",
    codeRef: "Former North York Zoning By-law",
    title: "Former North York Zoning By-law",
    category: "Zoning",
    plainLanguageSummary:
      "A legacy zoning by-law from the former City of North York that may still apply to some properties where the city-wide Zoning By-law 569-2013 does not fully replace it.",
    whatThisCovers: [
      "Legacy zoning provisions for former North York areas",
      "Regulations that may still apply to certain properties",
      "Reference for properties not fully covered by 569-2013",
    ],
    commonResidentQuestions: [
      "Does the old North York zoning by-law still apply to my property?",
      "Why are there two zoning by-laws for my area?",
    ],
    commonExamples: [
      "Confirming which zoning by-law governs a North York property",
      "Reviewing a legacy provision",
    ],
    relatedIssueTypes: ["Zoning Concern"],
    tags: ["zoning", "north york", "legacy by-law", "former municipality"],
    whoItApplies: "Property owners in former North York areas of Toronto.",
    officialUrl: ZONING_OFFICIAL_URL,
    pdfUrl: null,
    relatedChapters: ["zoning-569-2013-v1-ch1-800"],
  },
];

export function getChapterBySlug(slug: string): BylawChapter | undefined {
  return bylawChapters.find((c) => c.slug === slug);
}

// ─── Zoning Topics ─────────────────────────────────────────────────────────────

export interface ZoningTopic {
  id: string;
  topic: string;
  plainExplanation: string;
  commonQuestion: string;
  bylawConsideration: string;
  whatToPrepare: string[];
  whenOfficial: string;
  officialUrl: string;
  show311: boolean;
  keywords: string[];
}

export const zoningTopics: ZoningTopic[] = [
  {
    id: "front-yard-parking",
    topic: "Front Yard Parking",
    plainExplanation:
      "In most Toronto residential zones, you generally need an approved driveway or parking pad to park in the front yard. Parking on grass or an unpaved front yard is usually not permitted.",
    commonQuestion: "Can I park my car on my front lawn or boulevard?",
    bylawConsideration: "Zoning By-law 569-2013 — parking in residential zones; front yard landscaping requirements.",
    whatToPrepare: [
      "Your property address and zoning designation",
      "Whether you have an existing legal driveway or parking pad",
      "Photos of the current front yard surface",
    ],
    whenOfficial:
      "Use official City resources before paving a front yard or creating a new parking pad — a permit and zoning review are usually required.",
    officialUrl: ZONING_OFFICIAL_URL,
    show311: true,
    keywords: ["front yard parking", "parking pad", "driveway", "boulevard parking", "lawn parking"],
  },
  {
    id: "hvac-ac-location",
    topic: "HVAC / Air Conditioner Location",
    plainExplanation:
      "Air conditioners and HVAC equipment usually must be set back from property lines and must not block required access. Many zones require a minimum side-yard setback for mechanical equipment.",
    commonQuestion: "Where am I allowed to put my air conditioner or heat pump?",
    bylawConsideration: "Zoning By-law 569-2013 — mechanical equipment setbacks in residential zones.",
    whatToPrepare: [
      "Proposed location and distance from each property line",
      "Your zoning designation",
      "Manufacturer clearance requirements for the unit",
    ],
    whenOfficial:
      "Confirm the required setback for your zone before installing any AC or heat pump near a property line.",
    officialUrl: ZONING_OFFICIAL_URL,
    show311: true,
    keywords: ["air conditioner", "HVAC", "AC unit", "heat pump", "mechanical equipment", "ac location"],
  },
  {
    id: "accessory-structures",
    topic: "Accessory Structures (Sheds, Garages, Pergolas)",
    plainExplanation:
      "Detached structures like sheds, garages, and pergolas must meet setback, height, and lot coverage limits. Small sheds may not need a building permit but still must meet zoning rules.",
    commonQuestion: "Do I need a permit for a shed, and how close to the fence can it go?",
    bylawConsideration: "Zoning By-law 569-2013 — accessory buildings and structures.",
    whatToPrepare: [
      "Proposed size, height, and location of the structure",
      "Distance to property lines",
      "Total lot coverage of existing structures",
    ],
    whenOfficial:
      "Check zoning and permit requirements before building any accessory structure, especially near a property line.",
    officialUrl: ZONING_OFFICIAL_URL,
    show311: true,
    keywords: ["shed", "garage", "pergola", "accessory structure", "detached structure", "outbuilding"],
  },
  {
    id: "landscaping",
    topic: "Landscaping Requirements",
    plainExplanation:
      "Many residential zones require a minimum portion of the lot to remain as soft landscaping (grass, plants, gardens). Paving too much of a lot may not comply with zoning.",
    commonQuestion: "Can I pave my entire front yard?",
    bylawConsideration: "Zoning By-law 569-2013 — soft landscaping and front yard requirements.",
    whatToPrepare: [
      "Current and proposed areas of hard vs. soft surfacing",
      "Your zoning designation",
      "Site sketch showing dimensions",
    ],
    whenOfficial:
      "Confirm the minimum landscaping requirement for your zone before adding hard surfaces.",
    officialUrl: ZONING_OFFICIAL_URL,
    show311: true,
    keywords: ["landscaping", "soft landscaping", "paving", "hard surface", "front yard coverage"],
  },
  {
    id: "home-occupation",
    topic: "Home Occupation (Working from Home)",
    plainExplanation:
      "Running a business from home is generally allowed in residential zones with limits: no disruptive customer traffic, limited signage, and restrictions on non-resident employees. Some uses need a licence.",
    commonQuestion: "Can I run a business or see clients from my home?",
    bylawConsideration: "Zoning By-law 569-2013 — home occupation provisions.",
    whatToPrepare: [
      "Type of business and whether clients would visit",
      "Whether you would have employees or signage",
      "Your zoning designation",
    ],
    whenOfficial:
      "Review the home occupation rules for your zone, and check whether a business licence is required, before operating.",
    officialUrl: ZONING_OFFICIAL_URL,
    show311: true,
    keywords: ["home occupation", "work from home", "home business", "residential business"],
  },
  {
    id: "parking",
    topic: "Parking Requirements",
    plainExplanation:
      "Residential parking requirements vary by zone and dwelling type. Most houses must provide a set number of parking spaces, and new parking areas often require separate approval.",
    commonQuestion: "How many parking spaces do I need, and can I add more?",
    bylawConsideration: "Zoning By-law 569-2013 — parking space requirements.",
    whatToPrepare: [
      "Dwelling type and number of units",
      "Existing legal parking spaces",
      "Proposed changes to parking",
    ],
    whenOfficial:
      "Check parking requirements before converting a garage or adding parking spaces.",
    officialUrl: ZONING_OFFICIAL_URL,
    show311: true,
    keywords: ["parking", "parking space", "residential parking", "parking requirement", "garage conversion"],
  },
  {
    id: "setbacks",
    topic: "Setbacks — How Close Can I Build?",
    plainExplanation:
      "Setbacks set the minimum distance between a structure and property lines. Front, side, and rear setbacks vary by zone and dwelling type.",
    commonQuestion: "How close to the property line can I build a deck or addition?",
    bylawConsideration: "Zoning By-law 569-2013 — required minimum setbacks.",
    whatToPrepare: [
      "Site plan showing distances to property lines",
      "Your zoning designation",
      "Proposed structure dimensions",
    ],
    whenOfficial:
      "Obtain a Zoning Certificate or consult City Planning before building near a property line.",
    officialUrl: ZONING_OFFICIAL_URL,
    show311: true,
    keywords: ["setback", "property line", "how close to build", "side yard", "rear yard", "front yard setback"],
  },
  {
    id: "fence-zoning-overlap",
    topic: "Fence and Zoning Overlap",
    plainExplanation:
      "Fences are governed by the Fences by-law (Chapter 447), but zoning can also affect what you build — for example, structures near a fence, corner-lot sight lines, or pool enclosures. Both may apply.",
    commonQuestion: "Do zoning rules affect my fence or what I build next to it?",
    bylawConsideration: "Chapter 447 (Fences) together with Zoning By-law 569-2013 for adjacent structures and sight lines.",
    whatToPrepare: [
      "Fence height, location, and materials",
      "Whether the fence is on a corner lot or near a driveway",
      "Any structures planned near the fence",
    ],
    whenOfficial:
      "Check both the Fences by-law and zoning before building a fence on a corner lot, near a pool, or alongside a new structure.",
    officialUrl: ZONING_OFFICIAL_URL,
    show311: true,
    keywords: ["fence", "fence zoning", "corner lot", "sight line", "pool enclosure", "fence height"],
  },
];

// ─── Pool Fence Checklist ───────────────────────────────────────────────────────

export const poolFenceChecklist = [
  { id: "1", title: "Permit Obtained", description: "A building permit has been issued by Toronto Building before constructing the pool enclosure.", category: "Permits", isRequired: true },
  { id: "2", title: "Fence Height ≥ 1.2 m", description: "The pool enclosure is at least 1.2 metres (about 4 feet) high on all sides.", category: "Structure", isRequired: true },
  { id: "3", title: "No Large Openings", description: "No opening allows passage of a sphere greater than 100 mm (about 4 inches).", category: "Structure", isRequired: true },
  { id: "4", title: "Gate is Self-Closing", description: "Every gate returns to the closed position on its own, without manual help.", category: "Gates", isRequired: true },
  { id: "5", title: "Gate is Self-Latching", description: "Every gate latches automatically when it closes.", category: "Gates", isRequired: true },
  { id: "6", title: "Latch Located Correctly", description: "The latch is on the pool side and high on the gate, or enclosed to prevent reach-around access.", category: "Gates", isRequired: true },
  { id: "7", title: "No Climbable Objects Within 1.2 m", description: "No furniture, equipment, or structures that could aid climbing are within 1.2 m of the enclosure.", category: "Structure", isRequired: true },
  { id: "8", title: "Pool Area Fully Enclosed", description: "The enclosure fully surrounds the pool and prevents direct access from outside.", category: "Structure", isRequired: true },
  { id: "9", title: "Inspection Completed", description: "A required inspection by Toronto Building has been completed and approved.", category: "Permits", isRequired: true },
  { id: "10", title: "Gate Swings Outward from Pool", description: "Gates are hinged to swing away from the pool to discourage children pushing through.", category: "Gates", isRequired: false },
  { id: "11", title: "No Gaps at Bottom of Fence", description: "The gap between the bottom of the fence and the ground is no larger than 100 mm.", category: "Structure", isRequired: true },
  { id: "12", title: "Horizontal Members Restricted", description: "Any horizontal members are on the inside (pool side) so they can't be used as footholds.", category: "Structure", isRequired: true },
];

// ─── Photo Review Helper — issue types & reference results ──────────────────────

export interface PhotoIssueResult {
  possibleIssue: string;
  chapter: string | null;
  chapterSlug: string | null;
  section: string | null;
  explanation: string;
  evidenceChecklist: string[];
  nextStep: string;
}

export interface PhotoIssueType {
  value: string;
  label: string;
  comingSoon?: boolean;
  result?: PhotoIssueResult;
}

export const photoReviewIssues: PhotoIssueType[] = [
  {
    value: "property-standards",
    label: "Property Standards",
    result: {
      possibleIssue: "Property Standards — Exterior or structural maintenance",
      chapter: "Chapter 629 — Property Standards",
      chapterSlug: "629",
      section: "Property maintenance provisions",
      explanation:
        "The photo may show exterior deterioration such as damaged cladding, broken elements, peeling paint, or unsafe stairs. Property owners must maintain buildings to minimum property standards.",
      evidenceChecklist: [
        "Clear close-up photo of the affected area",
        "Full property address (and unit number if applicable)",
        "Date you observed the issue",
        "Location on the property (front, rear, side)",
      ],
      nextStep:
        "If the property may not meet minimum standards, you can submit a service request to Toronto 311 under Property Standards.",
    },
  },
  {
    value: "waste-dumping",
    label: "Waste / Littering / Dumping",
    result: {
      possibleIssue: "Littering or illegal dumping of refuse",
      chapter: "Chapter 548 — Littering and Dumping of Refuse",
      chapterSlug: "548",
      section: "Dumping and refuse provisions",
      explanation:
        "The photo may show dumped items or accumulated waste on public or private property. Littering and illegal dumping are prohibited, and owners must keep property free of refuse.",
      evidenceChecklist: [
        "Photo of the waste or debris",
        "Exact location or address",
        "Date and time observed",
        "Type of waste (furniture, bags, appliances, etc.)",
      ],
      nextStep:
        "Consider a Toronto 311 service request under Litter / Illegal Dumping.",
    },
  },
  {
    value: "graffiti",
    label: "Graffiti",
    result: {
      possibleIssue: "Graffiti requiring removal",
      chapter: "Chapter 485 — Graffiti",
      chapterSlug: "485",
      section: "Graffiti provisions",
      explanation:
        "The photo may show graffiti on a wall, fence, or structure. Owners are required to remove graffiti within the timeframe set by the City after notice.",
      evidenceChecklist: [
        "Full photo of the graffiti and surface",
        "Address or location of the surface",
        "Approximate date it appeared, if known",
      ],
      nextStep: "Consider a Toronto 311 service request under Graffiti.",
    },
  },
  {
    value: "turfgrass-weeds",
    label: "Turfgrass / Weeds",
    result: {
      possibleIssue: "Overgrown turfgrass or prohibited plants",
      chapter: "Chapter 489 — Turfgrass and Prohibited Plants",
      chapterSlug: "489",
      section: "Turfgrass height provisions",
      explanation:
        "The photo may show turfgrass or weeds above the permitted height, or prohibited plants. Owners must keep yards maintained.",
      evidenceChecklist: [
        "Photo showing the height (include something for scale)",
        "Full property address",
        "Whether the property appears occupied or vacant",
      ],
      nextStep:
        "Consider a Toronto 311 service request under Long Grass and Weeds.",
    },
  },
  {
    value: "fence",
    label: "Fence",
    result: {
      possibleIssue: "Fence height, materials, or condition concern",
      chapter: "Chapter 447 — Fences",
      chapterSlug: "447",
      section: "Fence height and maintenance provisions",
      explanation:
        "The photo may show a fence that exceeds the permitted height, uses prohibited materials, or is unsafe. Fence rules vary by yard location.",
      evidenceChecklist: [
        "Photo of the fence with an approximate height reference",
        "Property address",
        "Description of the concern (height, materials, condition)",
      ],
      nextStep:
        "Consider a Toronto 311 service request, or review Chapter 447.",
    },
  },
  {
    value: "pool-fence",
    label: "Pool Fence / Pool Enclosure",
    result: {
      possibleIssue: "Pool enclosure safety concern",
      chapter: "Chapter 447 — Fences (Pool Enclosures)",
      chapterSlug: "447",
      section: "Pool enclosure provisions",
      explanation:
        "The photo may show a pool enclosure that does not meet safety requirements, such as a gate that doesn't self-latch or gaps that are too large. Non-compliant enclosures are a drowning risk.",
      evidenceChecklist: [
        "Photo of the pool area and enclosure",
        "Property address",
        "Description of the specific concern (gate, height, gaps)",
      ],
      nextStep:
        "Pool safety concerns can be reported to Toronto 311. See the Pool Fence Guide for requirements.",
    },
  },
  {
    value: "heating",
    label: "Heating",
    result: {
      possibleIssue: "Inadequate heat in a rental unit",
      chapter: "Chapter 497 — Heating",
      chapterSlug: "497",
      section: "Minimum temperature provisions",
      explanation:
        "Photos alone can't confirm temperature, but if a rental is too cold during the heating season, landlords must maintain the minimum required temperature. A dated thermometer photo helps.",
      evidenceChecklist: [
        "Thermometer reading with date, time, and location",
        "Record of when heat was insufficient",
        "Any written communication with the landlord",
        "Unit address and unit number",
      ],
      nextStep:
        "Consider a Toronto 311 service request under Heat / Vital Services.",
    },
  },
  {
    value: "vital-services",
    label: "Vital Services",
    result: {
      possibleIssue: "Discontinued vital service in a rental",
      chapter: "Chapter 835 — Vital Services",
      chapterSlug: "835",
      section: "Vital services provisions",
      explanation:
        "If heat, water, electricity, or fuel has been cut off to a rental unit, that may engage the vital services by-law. Document the affected service and timing.",
      evidenceChecklist: [
        "Description of which service is affected",
        "Date and time the service stopped",
        "Unit address and unit number",
        "Any notice or communication from the owner",
      ],
      nextStep:
        "Vital services concerns can be reported to Toronto 311.",
    },
  },
  {
    value: "dust",
    label: "Dust",
    result: {
      possibleIssue: "Dust nuisance from a property or activity",
      chapter: "Chapter 417 — Dust",
      chapterSlug: "417",
      section: "Dust control provisions",
      explanation:
        "The photo may show dust leaving a property and affecting neighbours. Owners are responsible for preventing dust from becoming a nuisance.",
      evidenceChecklist: [
        "Photo or video showing the dust",
        "Location and source if known",
        "Dates and times observed",
      ],
      nextStep: "Consider a Toronto 311 service request about the dust nuisance.",
    },
  },
  {
    value: "vacant-hazardous",
    label: "Vacant or Hazardous Property",
    result: {
      possibleIssue: "Vacant or hazardous building",
      chapter: "Chapter 632 — Vacant or Hazardous Buildings",
      chapterSlug: "632",
      section: "Vacant building provisions",
      explanation:
        "The photo may show an unsecured vacant building or a hazardous structure. These must be secured and maintained to protect public safety.",
      evidenceChecklist: [
        "Photo of the building and the hazard",
        "Property address",
        "Whether the building appears open or unsecured",
      ],
      nextStep:
        "Consider a Toronto 311 service request about the vacant or hazardous building.",
    },
  },
  {
    value: "zoning",
    label: "Zoning Concern",
    result: {
      possibleIssue: "Possible zoning or land-use concern",
      chapter: "Zoning By-law 569-2013",
      chapterSlug: "zoning-569-2013-v1-ch1-800",
      section: "General zoning provisions",
      explanation:
        "The photo may show a possible zoning issue such as an unpermitted structure, parking, or use. Zoning is property-specific and may need a City review.",
      evidenceChecklist: [
        "Photo of the structure, parking, or use",
        "Full civic address",
        "Description of the concern",
      ],
      nextStep:
        "See the Zoning Guide, or submit a Toronto 311 service request under Zoning.",
    },
  },
  {
    value: "hvac-ac",
    label: "HVAC / Air Conditioner Location",
    result: {
      possibleIssue: "Air conditioner or HVAC placement concern",
      chapter: "Zoning By-law 569-2013",
      chapterSlug: "zoning-569-2013-v1-ch1-800",
      section: "Mechanical equipment setbacks",
      explanation:
        "The photo may show mechanical equipment installed too close to a property line. Zoning often requires a minimum setback for AC and HVAC units.",
      evidenceChecklist: [
        "Photo showing the unit and nearby property line",
        "Property address",
        "Approximate distance to the property line",
      ],
      nextStep:
        "See the Zoning Guide on HVAC / air conditioner location, or contact 311.",
    },
  },
  {
    value: "front-yard-parking",
    label: "Front Yard Parking",
    result: {
      possibleIssue: "Front yard or boulevard parking concern",
      chapter: "Zoning By-law 569-2013",
      chapterSlug: "zoning-569-2013-v1-ch1-800",
      section: "Residential parking provisions",
      explanation:
        "The photo may show a vehicle parked on an unpaved front yard or boulevard without an approved driveway, which is generally not permitted.",
      evidenceChecklist: [
        "Photo of the parked vehicle and surface",
        "Street address",
        "Whether parking appears regular or occasional",
      ],
      nextStep:
        "See the Zoning Guide on front yard parking, or submit a 311 request under Zoning.",
    },
  },
  {
    value: "accessory-structures",
    label: "Accessory Structures",
    result: {
      possibleIssue: "Accessory structure (shed, garage, pergola) concern",
      chapter: "Zoning By-law 569-2013",
      chapterSlug: "zoning-569-2013-v1-ch1-800",
      section: "Accessory structure provisions",
      explanation:
        "The photo may show an accessory structure that could exceed height, setback, or coverage limits. Zoning rules apply even when a permit isn't required.",
      evidenceChecklist: [
        "Photo of the structure and nearby property lines",
        "Property address",
        "Approximate size and height",
      ],
      nextStep:
        "See the Zoning Guide on accessory structures, or contact 311.",
    },
  },
  {
    value: "clothing-drop-box",
    label: "Clothing Drop Box",
    result: {
      possibleIssue: "Clothing drop box concern",
      chapter: "Chapter 395 — Clothing Drop Boxes",
      chapterSlug: "395",
      section: "Drop box provisions",
      explanation:
        "The photo may show an unpermitted, overflowing, or poorly placed clothing drop box. These boxes require a permit and must be maintained.",
      evidenceChecklist: [
        "Photo of the drop box and its surroundings",
        "Location or address",
        "Whether it is overflowing or damaged",
      ],
      nextStep:
        "Consider a Toronto 311 service request about the clothing drop box.",
    },
  },
  {
    value: "garage-sale",
    label: "Garage Sale",
    result: {
      possibleIssue: "Garage sale frequency or conditions concern",
      chapter: "Chapter 480 — Garage Sales",
      chapterSlug: "480",
      section: "Garage sale provisions",
      explanation:
        "The photo may relate to a garage or yard sale that exceeds the permitted number per year or operates like an ongoing business.",
      evidenceChecklist: [
        "Photo of the sale or signage",
        "Address",
        "How often sales appear to occur",
      ],
      nextStep:
        "Consider a Toronto 311 service request, or review Chapter 480.",
    },
  },
  {
    value: "noise",
    label: "Noise Complaints — Coming Soon",
    comingSoon: true,
  },
];

export function getPhotoIssue(value: string): PhotoIssueType | undefined {
  return photoReviewIssues.find((i) => i.value === value);
}

// ─── Global Search index ────────────────────────────────────────────────────────

export type SearchType = "Chapter" | "Zoning" | "Guide" | "Photo Review" | "Identifier" | "Plant" | "Coming Soon";

export interface SearchEntry {
  id: string;
  title: string;
  type: SearchType;
  summary: string;
  chapter?: string;
  href: string;
  actionLabel: string;
  keywords: string[];
}

const staticSearchEntries: SearchEntry[] = [
  {
    id: "guide-pool-fence",
    title: "Pool Fence & Enclosure Guide",
    type: "Guide",
    summary:
      "Plain-language guide to swimming pool enclosure permits, fence height, gate self-closing and self-latching rules, and a printable inspection checklist.",
    chapter: "Chapter 447 — Fences",
    href: "/pool-fence-guide",
    actionLabel: "Read Guide",
    keywords: ["pool", "pool fence", "pool enclosure", "gate", "swimming pool", "permit", "fence", "447"],
  },
  {
    id: "tool-photo-review",
    title: "Photo Review Helper",
    type: "Photo Review",
    summary:
      "Upload a photo and select an issue type to see a preliminary reference match to a likely bylaw chapter, with an evidence checklist.",
    href: "/photo-review",
    actionLabel: "Open Photo Review",
    keywords: ["photo", "review", "upload", "violation", "helper", "evidence"],
  },
  {
    id: "placeholder-noise",
    title: "Noise Complaints",
    type: "Coming Soon",
    summary:
      "Content under development. Noise-related guidance is not yet available on this site.",
    href: "/noise-complaints",
    actionLabel: "View Status",
    keywords: ["noise", "loud", "sound", "amplified", "music", "construction noise"],
  },
  {
    id: "tool-prohibited-plants",
    title: "Prohibited Plants Identifier",
    type: "Identifier",
    summary:
      "Identify Toronto's 10 prohibited plants, compare their seasonal appearance, and learn safe, resident-friendly removal methods. Includes a rules-based identification helper.",
    href: "/prohibited-plants",
    actionLabel: "Open Identifier",
    keywords: [
      "prohibited plants", "weeds", "invasive plants", "invasive species", "noxious weeds",
      "poison ivy", "giant hogweed", "ragweed", "garlic mustard", "phragmites", "knotweed",
      "thistle", "buckthorn", "dog-strangling vine", "purple loosestrife", "plant identifier",
    ],
  },
];

/** Centralized, derived search index across all searchable content. */
export const searchEntries: SearchEntry[] = [
  ...bylawChapters.map<SearchEntry>((c) => ({
    id: `chapter-${c.slug}`,
    title: c.title,
    type: "Chapter",
    summary: c.plainLanguageSummary,
    chapter: `Chapter ${c.chapterNumber}`,
    href: `/tmc-chapters/${c.slug}`,
    actionLabel: "View Chapter",
    keywords: [...c.tags, c.chapterNumber, c.title.toLowerCase(), ...c.relatedIssueTypes.map((t) => t.toLowerCase())],
  })),
  ...zoningTopics.map<SearchEntry>((z) => ({
    id: `zoning-${z.id}`,
    title: z.topic,
    type: "Zoning",
    summary: z.plainExplanation,
    chapter: "Zoning By-law 569-2013",
    href: `/zoning?topic=${z.id}`,
    actionLabel: "View Zoning Topic",
    keywords: z.keywords,
  })),
  ...prohibitedPlants.map<SearchEntry>((p) => ({
    id: `plant-${p.slug}`,
    title: p.commonName,
    type: "Plant",
    summary: p.summary,
    chapter: "Prohibited Plant · Chapter 489",
    href: `/prohibited-plants/${p.slug}`,
    actionLabel: "View Plant",
    keywords: [
      "prohibited plant", "invasive", "weed",
      p.commonName.toLowerCase(),
      p.scientificName.toLowerCase(),
      ...p.hazardTags,
      p.keyVisualClue.toLowerCase(),
    ],
  })),
  ...staticSearchEntries,
];

/** Search the index. A "noise" query returns ONLY the Noise placeholder. */
export function searchContent(query: string): SearchEntry[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];

  // Noise is intentionally limited to the placeholder result only.
  if (/\bnoise\b/.test(q) || q === "noise") {
    return searchEntries.filter((e) => e.type === "Coming Soon");
  }

  const terms = q.split(/\s+/).filter(Boolean);
  return searchEntries
    .map((entry) => {
      const haystack = `${entry.title} ${entry.summary} ${entry.keywords.join(" ")} ${entry.chapter ?? ""}`.toLowerCase();
      let score = 0;
      for (const term of terms) {
        if (entry.title.toLowerCase().includes(term)) score += 6;
        if (entry.keywords.some((k) => k.includes(term))) score += 4;
        if (haystack.includes(term)) score += 1;
      }
      return { entry, score };
    })
    .filter((r) => r.score > 0)
    // Don't surface the Noise placeholder unless the user searched noise (handled above).
    .filter((r) => r.entry.type !== "Coming Soon")
    .sort((a, b) => b.score - a.score)
    .map((r) => r.entry);
}
