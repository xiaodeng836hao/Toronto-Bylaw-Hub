// ─────────────────────────────────────────────────────────────────────────────
//  Toronto Bylaw Guide — Chapter 485 (Graffiti) detail data (V7.1)
//
//  Resident-facing data for the Chapter 485 page: practical prevention measures
//  and the Graffiti Art / Mural exemption process. Summarized from the official
//  City of Toronto graffiti pages for general reference only — NOT legal advice,
//  and an exemption request is never guaranteed to be approved. Always confirm
//  current requirements, program availability, and application instructions on
//  the official City pages linked below.
// ─────────────────────────────────────────────────────────────────────────────

// ── Official sources ─────────────────────────────────────────────────────────
export const CHAPTER_485_PDF = "https://www.toronto.ca/legdocs/municode/1184_485.pdf";
export const CITY_GRAFFITI_PAGE =
  "https://www.toronto.ca/city-government/public-notices-bylaws/bylaw-enforcement/graffiti-postering-signs/";
export const GRAFFITI_ART_EXEMPTION_PAGE =
  "https://www.toronto.ca/city-government/public-notices-bylaws/bylaw-enforcement/graffiti-postering-signs/graffiti-art-in-the-city/";
export const STREETARTORONTO_PAGE =
  "https://www.toronto.ca/services-payments/streets-parking-transportation/enhancing-our-streets-and-public-realm/streetartoronto/";
export const GRAFFITI_EXEMPTION_EMAIL = "GraffitiExemption@toronto.ca";

export const GRAFFITI_OFFICIAL_LINKS = [
  { label: "Official Graffiti & Postering Information", href: CITY_GRAFFITI_PAGE },
  { label: "Graffiti Art / Mural Exemption", href: GRAFFITI_ART_EXEMPTION_PAGE },
  { label: "StreetARToronto", href: STREETARTORONTO_PAGE },
  { label: "Official Chapter 485 (Graffiti) PDF", href: CHAPTER_485_PDF },
];

// ── Prevention measures ──────────────────────────────────────────────────────
export type PreventionIconKey = "light" | "camera" | "lock" | "leaf" | "paint" | "mural";

export interface PreventionMeasure {
  icon: PreventionIconKey;
  title: string;
  description: string;
}

export const PREVENTION_INTRO =
  "Practical steps that may help reduce repeat tagging or vandalism. These are general options property owners may consider — what works depends on the site.";

export const PREVENTION_MEASURES: PreventionMeasure[] = [
  {
    icon: "light",
    title: "Improve lighting",
    description: "Install or improve exterior lighting so walls and entrances are visible at night — poorly lit surfaces are more likely to be tagged.",
  },
  {
    icon: "camera",
    title: "Security cameras",
    description: "Add visible security cameras covering surfaces that have been tagged before.",
  },
  {
    icon: "lock",
    title: "Limit access",
    description: "Use fences, gates, or locked storage areas to make walls, laneway surfaces, and rear areas harder to reach.",
  },
  {
    icon: "leaf",
    title: "Planting as a barrier",
    description: "Where appropriate, plant climbing vines or thorny shrubs against large blank walls so there is less open surface to tag.",
  },
  {
    icon: "paint",
    title: "Dark colours / anti-graffiti coating",
    description: "Use darker paint colours or apply an anti-graffiti coating so tags are less visible and easier to remove.",
  },
  {
    icon: "mural",
    title: "Commission a legal mural",
    description: "A commissioned, owner-approved mural can help deter future tagging. Funding or support may be available through StreetARToronto programs — check the official StreetARToronto page for current application status, eligibility, and deadlines.",
  },
];

// ── Know the Difference: graffiti tags vs. mural ─────────────────────────────
export interface DifferencePoint {
  icon: "cross" | "spray" | "notice" | "check" | "brush" | "shield";
  label: string;
  detail: string;
}

export const DIFFERENCE_INTRO =
  "Not all graffiti is the same. Understanding the difference helps keep Toronto vibrant and bylaw-compliant.";

export interface DifferenceSide {
  title: string;
  subtitle: string;
  /** Example illustration under /public (user-provided). */
  image: { src: string; alt: string };
  points: DifferencePoint[];
}

export const DIFFERENCE_TAGS: DifferenceSide = {
  title: "Graffiti Tags",
  subtitle: "Unauthorized markings",
  image: {
    src: "/images/graffiti/graffiti-tags-example.png",
    alt: "Example illustration of graffiti tags — unauthorized black spray-painted tag lettering on a white brick wall beside a sidewalk.",
  },
  points: [
    { icon: "cross", label: "Unauthorized", detail: "Created without permission from the property owner." },
    { icon: "spray", label: "Vandalism", detail: "Considered graffiti vandalism under Chapter 485." },
    { icon: "notice", label: "Enforcement", detail: "Property owners are required to remove it after a City notice, and may face costs if they don't." },
  ],
};

export const DIFFERENCE_MURAL: DifferenceSide = {
  title: "Mural / Graffiti Art",
  subtitle: "Planned and approved artwork",
  image: {
    src: "/images/graffiti/mural-example.png",
    alt: "Example illustration of an approved mural — a colourful commissioned wall painting of the Toronto skyline with the CN Tower, flowers, and the word TORONTO.",
  },
  points: [
    { icon: "check", label: "Authorized", detail: "Created with permission from the property owner." },
    { icon: "brush", label: "Enhances community", detail: "Aesthetically enhances the surface and has regard to community character and standards." },
    { icon: "shield", label: "Exemption may be available", detail: "May be eligible for a Graffiti Art / Mural exemption from the City — approval is not guaranteed." },
  ],
};

// ── Penalties & enforcement (§ 485-7, § 485-8) ───────────────────────────────
export interface GraffitiPenalty {
  offence: string;
  reference: string;
  /** Short headline amount / consequence. */
  maxFine: string;
}

/** From Chapter 485, § 485-8 (Offences) and § 485-7 (removal + cost recovery). */
export const GRAFFITI_PENALTIES: GraffitiPenalty[] = [
  {
    offence: "Contravening the chapter — e.g. placing graffiti vandalism, or failing to remove it after a City notice.",
    reference: "§ 485-8A",
    maxFine: "Up to $5,000",
  },
  {
    offence: "Continuing offences — e.g. hindering an officer, or providing false information in an application.",
    reference: "§ 485-8B, C",
    maxFine: "Up to $5,000 / day",
  },
  {
    offence: "City removal after non-compliance — costs recovered by action or added to your property tax bill.",
    reference: "§ 485-7",
    maxFine: "Removal costs",
  },
];

export const GRAFFITI_PENALTIES_NOTE =
  "A person convicted of an offence under § 485-8 is liable to a fine of not more than $5,000 (set under the City of Toronto Act, 2006 and the Provincial Offences Act). Offences under § 485-8B are continuing offences, subject to a fine for each day they continue. Amounts and enforcement may change — confirm with the official Chapter 485.";

// ── Graffiti Art / Mural exemption ───────────────────────────────────────────
export const EXEMPTION_INTRO =
  "If graffiti art or an art mural on a property has been mistaken for vandalism and the property owner has been issued a Notice of Violation for graffiti, the owner may request a Graffiti Art / Mural exemption. Approval is not guaranteed — the City may review whether the mural meets the applicable criteria.";

/** Single merged checklist: what the exemption request email should include
 *  (from the City's guidance) — short label for scanning + detail line. */
export interface ExemptionChecklistItem {
  label: string;
  detail: string;
}

export const EXEMPTION_CHECKLIST: ExemptionChecklistItem[] = [
  {
    label: "Address and exact mural location",
    detail: "For example: garage wall, fence, side wall, rear wall, or storefront shutter.",
  },
  {
    label: "Owner permission acknowledgement",
    detail: "Confirm the art mural or graffiti art was created with the property owner's permission.",
  },
  {
    label: "Aesthetic enhancement statement",
    detail: "Explain why the artwork aesthetically enhances the surface it covers.",
  },
  {
    label: "Community character and standards statement",
    detail: "Explain how or why the artwork has regard to community character and standards.",
  },
  {
    label: "Clear photos of the entire mural",
    detail: "One or more photos that accurately show all aspects of the artwork.",
  },
  {
    label: "Artist or company name, if applicable",
    detail: "The artist or company commissioned to complete the art mural or graffiti art.",
  },
  {
    label: "Notice of Violation reference, if available",
    detail: "Quote the reference number from the Notice you received.",
  },
];

export const EXEMPTION_CHECKLIST_NOTE =
  "Providing complete information may help the review process, but does not guarantee approval.";

export const EXEMPTION_KEEP_COPIES_NOTE =
  "Keep a copy of the Notice of Violation, photos, and all submitted materials.";

// ── Sample exemption email (template only) ───────────────────────────────────
export const SAMPLE_EMAIL_SUBJECT =
  "Graffiti Art / Mural Exemption Request – [Property Address]";

export const SAMPLE_EMAIL_BODY = `Hello,

I am requesting a Graffiti Art / Mural exemption for the artwork located at [exact address and location, such as garage wall, fence, side wall, or storefront].

The artwork was created with the permission of the property owner.

I believe the artwork aesthetically enhances the surface it covers because [brief explanation].

I also believe the artwork has regard to community character and standards because [brief explanation].

Attached are photos showing all aspects of the artwork.

Artist / company name, if applicable:
[Name]

Notice of Violation reference, if available:
[Reference number]

Thank you.`;

export const SAMPLE_EMAIL_NOTE =
  "This is a sample format only — adjust it to your own situation, and confirm the current submission requirements on the official City page before sending.";

export const EXEMPTION_DISCLAIMER =
  "This page is for general reference only. It does not determine whether a mural qualifies for an exemption and does not replace official City review. Always verify current requirements, program availability, and application instructions through official City sources.";
