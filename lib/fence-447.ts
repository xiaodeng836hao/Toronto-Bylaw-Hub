// ─────────────────────────────────────────────────────────────────────────────
//  Toronto Bylaw Hub — Chapter 447 (Fences) detail data (V3.6)
//
//  Plain-language, resident-facing data for the GENERAL fence requirements on the
//  Chapter 447 page. Height values are taken verbatim from Toronto Municipal Code
//  Chapter 447, § 447-1.2B, TABLE 1 (Maximum Height of Fences). Detailed swimming
//  pool ENCLOSURE requirements (§ 447-1.3) are intentionally NOT duplicated here —
//  they live on the dedicated Pool Fence Guide. Summarized for general reference
//  only; not legal advice. Always confirm the official chapter and Table 1.
// ─────────────────────────────────────────────────────────────────────────────

// ── Official sources ─────────────────────────────────────────────────────────
export const CHAPTER_447_PDF = "https://www.toronto.ca/legdocs/municode/1184_447.pdf";
export const CITY_FENCES_PAGE =
  "https://www.toronto.ca/city-government/public-notices-bylaws/bylaw-enforcement/fences/";
export const POOL_FENCE_GUIDE_ROUTE = "/pool-fence-guide";

export const FENCE_OFFICIAL_LINKS = [
  { label: "Official Chapter 447 (Fences) PDF", href: CHAPTER_447_PDF },
  { label: "City of Toronto — Fences", href: CITY_FENCES_PAGE },
];

// ── Fence height — Table 1 ───────────────────────────────────────────────────
export interface FenceHeightRow {
  /** Item number from Table 1. */
  item: number;
  /** Short situation label for quick scanning / mobile cards. */
  situation: string;
  /** Condensed description of the fence situation (close to the bylaw wording). */
  description: string;
  /** Max height on single or multiple residential property. */
  residential: string;
  /** Max height on non-residential property. */
  nonResidential: string;
  /** Max height for a hedge, shrub or other vegetation that acts as a fence. */
  hedge: string;
  /** Plain-English explanation of when this row applies. */
  plain: string;
  /** A practical example. */
  example: string;
}

/**
 * § 447-1.2B, TABLE 1 — MAXIMUM HEIGHT OF FENCES [Amended 2018-12-13 by By-law 54-2019].
 * Values are exact; "No maximum" is the bylaw's own wording for the hedge/vegetation
 * column on several rows. "2.4 m" thresholds and the "public highway does not include
 * a public lane" qualifier are reproduced from the official Table.
 */
export const FENCE_HEIGHT_TABLE: FenceHeightRow[] = [
  {
    item: 1,
    situation: "Front yard, near a public-highway lot line",
    description:
      "Fence in a front yard, and within 2.4 m of a lot line abutting a public highway (a public highway does not include a public lane).",
    residential: "1.2 m",
    nonResidential: "1.2 m",
    hedge: "1.2 m",
    plain:
      "A front-yard fence close to the street has the lowest limit so it does not box in the front of the property or block sightlines.",
    example: "A picket fence along the front of a house, right by the sidewalk, may be up to 1.2 m.",
  },
  {
    item: 2,
    situation: "Front yard, set back from the highway lot line",
    description:
      "Fence in a front yard, and NOT within 2.4 m of a lot line abutting a public highway (a public highway does not include a public lane).",
    residential: "2.0 m",
    nonResidential: "2.0 m",
    hedge: "No maximum",
    plain:
      "A front-yard fence set back more than 2.4 m from the street-side lot line can be taller. A hedge in this position has no set maximum.",
    example: "A fence partway up the front yard, well back from the sidewalk, may be up to 2.0 m.",
  },
  {
    item: 3,
    situation: "Side, near a highway side lot line and a driveway",
    description:
      "Fence not in a front yard, and within 2.4 m of a side lot line abutting a public highway (not a public lane), and within 2.4 m of a driveway.",
    residential: "2.0 m",
    nonResidential: "2.0 m",
    hedge: "2.0 m",
    plain:
      "A side-area fence that is close to both a street-side lot line and a driveway is limited to keep driveway sightlines clear.",
    example: "A corner-lot side fence next to the driveway, close to the flanking street, may be up to 2.0 m.",
  },
  {
    item: 4,
    situation: "Side, between the highway lot line and main wall, near a driveway",
    description:
      "Fence not in a front yard, and between 2.4 m from a side lot line abutting a public highway (not a public lane) and the nearest wall of the main building extended to the rear lot line, and within 2.4 m of a driveway.",
    residential: "2.0 m",
    nonResidential: "2.5 m",
    hedge: "No maximum",
    plain:
      "Further in along the side of the lot, but still within 2.4 m of a driveway. Non-residential property is allowed slightly taller here.",
    example: "A side-yard fence beside the driveway, set in from the flanking street, may be up to 2.0 m (residential).",
  },
  {
    item: 5,
    situation: "On an unroofed deck",
    description:
      "Fence on an unroofed deck, and not in a front yard, and not within 2.4 m of a lot line abutting a public highway (not a public lane).",
    residential: "2.0 m above surface of deck",
    nonResidential: "2.0 m above surface of deck",
    hedge: "No maximum",
    plain:
      "On an attached, unroofed deck the height is measured from the deck surface — not the ground — so a deck fence/privacy screen may be up to 2.0 m above the deck.",
    example: "A privacy screen on a raised back deck may be up to 2.0 m measured from the deck floor.",
  },
  {
    item: 6,
    situation: "Abutting multi-residential, non-residential, a highway or a public walkway",
    description:
      "Fence not in a front yard that is also not a fence under Items 3, 4 or 5, and abutting a multi-residential property, a non-residential property, a public highway or a public walkway.",
    residential: "2.5 m",
    nonResidential: "2.5 m",
    hedge: "No maximum",
    plain:
      "Where a rear/side fence backs onto an apartment property, a business property, a road, or a public walkway, a taller fence is allowed for privacy and buffering.",
    example: "A back fence along a property that backs onto a public walkway may be up to 2.5 m.",
  },
  {
    item: 7,
    situation: "Abutting a rapid transit right-of-way",
    description: "Fence abutting a rapid transit right of way.",
    residential: "2.5 m",
    nonResidential: "No maximum",
    hedge: "No maximum",
    plain: "A fence along a rapid transit corridor may be taller for buffering.",
    example: "A residential fence backing onto a subway/LRT corridor may be up to 2.5 m.",
  },
  {
    item: 8,
    situation: "Recreational facility (tennis, baseball, etc.)",
    description: "Fence for a tennis court, a baseball diamond or other recreational facility.",
    residential: "3.0 m",
    nonResidential: "No maximum",
    hedge: "No maximum",
    plain: "Sports/recreational fencing can be much taller to contain balls and play.",
    example: "A backstop or tennis-court fence on a residential property may be up to 3.0 m.",
  },
  {
    item: 9,
    situation: "Any other fence",
    description: "Any other fence not described by Items 1–8.",
    residential: "2.0 m",
    nonResidential: "2.5 m",
    hedge: "No maximum",
    plain:
      "The catch-all row. A typical rear-yard fence that does not match any other row falls here — generally up to 2.0 m on a residential property.",
    example: "A standard backyard fence between two houses may be up to 2.0 m (residential).",
  },
];

export const FENCE_HEIGHT_MEASUREMENT_NOTE =
  "Fence height is measured at any point along its length from the average grade level measured perpendicular to, and one metre away on either side of, the fence (§ 447-1.2B(1)). Where more than one description in Table 1 applies to a fence, each part that matches a single description is treated as a separate fence for height (§ 447-1.2B(2)). Always check Chapter 447 Table 1 for the exact wording.";

export const FENCE_SCHOOL_NOTE =
  "Special rule: a fence at any school must not exceed 1.5 m where it is adjacent to a public highway or right-of-way (§ 447-1.2B(3)).";

// ── General fence restrictions (§ 447-1.2A) ──────────────────────────────────
export interface FenceRestriction {
  title: string;
  text: string;
  sectionReference: string;
}

export const FENCE_RESTRICTIONS: FenceRestriction[] = [
  {
    title: "No barbed wire, chicken wire, or sharp material (with a narrow exception)",
    text:
      "Barbed wire, chicken wire, or other barbed or sharp material generally cannot be used in a fence. The only exception is where the fence is permitted to exceed 2.5 m in height and the barbed/sharp material is installed at not less than 2.5 m, on metal brackets angled 45° back toward the enclosed area.",
    sectionReference: "§ 447-1.2A(2)",
  },
  {
    title: "No sheet metal or corrugated metal panels",
    text: "Sheet metal and corrugated metal panels are not allowed in any fence.",
    sectionReference: "§ 447-1.2A(3)",
  },
  {
    title: "Electric fences are generally not allowed",
    text:
      "A fence (or an attachment to it) must not be used as a conductor of electricity, except on agricultural land actually used for raising livestock — and only where it carries no more than 12 volts, is designed and installed only to contain livestock, and has warning signs at intervals of no more than 12 m.",
    sectionReference: "§ 447-1.2A(4)",
  },
  {
    title: "Use materials meant for permanent fencing",
    text:
      "Materials not usually intended for permanent fencing cannot be used unless specifically permitted by this chapter or another by-law.",
    sectionReference: "§ 447-1.2A(5)",
  },
  {
    title: "Temporary fences are generally not allowed — snow fences are the seasonal exception",
    text:
      "Temporary fencing is generally not permitted. A snow fence may be used on private property only between November 15 and April 15, and must comply with the corresponding standards in the chapter and other by-laws.",
    sectionReference: "§ 447-1.2A(5), (6)",
  },
];

// ── Driveways and visibility (§ 447-1.2C–D) ──────────────────────────────────
export const FENCE_DRIVEWAY_VISIBILITY = {
  points: [
    "Any fence within 2.4 m of a driveway must be open-fence construction (open mesh chain-link or an equivalent open construction) for at least 2.4 m from the lot line where the driveway begins, so it does not block the view of the boulevard or highway.",
    "In a parking lot, any fence must be open-fence construction anywhere it could otherwise restrict the sightlines of vehicles or pedestrians.",
    "Open-fence construction means a fence that gives motorists and pedestrians an unobstructed view of people, vehicles, and their movement through the entire length of the fence.",
    "No vegetation may be grown, and no object placed, in a way that obstructs the view through a fence that is required to be open-fence construction. This applies to hedges and to anything growing on or placed near the fence.",
  ],
  example:
    "A tall, solid fence right beside a driveway can hide approaching pedestrians or cyclists. In the driveway visibility area, an open construction such as chain-link may be required instead.",
  sectionReference: "§ 447-1.2C, § 447-1.2D",
};

// ── Fences on unroofed decks (Table 1, Item 5) ───────────────────────────────
export const FENCE_DECK_RULES = {
  points: [
    "Chapter 447 has a specific row for a fence on an attached, unroofed deck that is not in a front yard and not within 2.4 m of a lot line abutting a public highway.",
    "The maximum height is 2.0 m measured above the surface of the deck (not from the ground), on single, multiple-residential, and non-residential property.",
    "If the deck fence also acts as a guard (a protective barrier at the open side of a raised deck), it must also meet the guard requirements of Chapter 629, Property Standards. Where more than one by-law applies, the more restrictive requirement governs.",
  ],
  example:
    "A 2.0 m privacy screen on a raised back deck is measured from the deck floor, so it can sit higher above the yard than a ground-level fence of the same height.",
  sectionReference: "§ 447-1.2B (Table 1, Item 5); § 447-1.2E (guards)",
};

// ── Pool fence redirect callout ──────────────────────────────────────────────
export const POOL_FENCE_REDIRECT = {
  title: "Looking for Pool Fence Enclosure Requirements?",
  text:
    "Swimming pool enclosures have additional safety and permit requirements. For pool fences, gates, temporary pool fencing, permit steps, and the inspection checklist, use the dedicated Pool Fence Guide.",
  note:
    "Pool enclosure rules are part of Chapter 447 (§ 447-1.3), but this page focuses on general fence requirements.",
  buttonLabel: "Open Pool Fence Guide",
  href: POOL_FENCE_GUIDE_ROUTE,
};

// ── Fence Height Helper (non-AI reference tool) ──────────────────────────────
export type YesNo = "yes" | "no";

export interface FenceHelperAnswers {
  propertyType?: "residential" | "non-residential";
  vegetation?: YesNo;
  recreational?: YesNo;
  rapidTransit?: YesNo;
  frontYard?: YesNo;
  /** Front yard: within 2.4 m of a lot line abutting a public highway. */
  withinHighwayLotLine?: YesNo;
  /** Not front yard: on an unroofed deck. */
  onDeck?: YesNo;
  /** Not front yard: within 2.4 m of a driveway. */
  nearDriveway?: YesNo;
  /** Not front yard, near a driveway: within 2.4 m of a side lot line abutting a public highway. */
  nearSideHighway?: YesNo;
  /** Not front yard: abuts a multi-residential / non-residential property, public highway, or public walkway. */
  abutsMajor?: YesNo;
}

export interface FenceHelperMatch {
  row: FenceHeightRow;
  /** The applicable maximum height string for the chosen property/vegetation column. */
  appliedHeight: string;
  /** Which column was read. */
  column: "Hedge / vegetation" | "Single or multiple residential" | "Non-residential";
  /** Extra reminders (e.g. open-fence requirement near a driveway). */
  notes: string[];
}

/**
 * Find the Table 1 row that best matches the answers. Returns null when not enough
 * has been answered to identify a row. This is a reference tool only — it does not
 * give a legal determination, and several rows can apply to different parts of a fence.
 */
export function matchFenceHeightRule(a: FenceHelperAnswers): FenceHelperMatch | null {
  if (!a.propertyType || !a.vegetation) return null;

  const byItem = (n: number) => FENCE_HEIGHT_TABLE.find((r) => r.item === n)!;
  let row: FenceHeightRow | null = null;

  if (a.recreational === "yes") {
    row = byItem(8);
  } else if (a.rapidTransit === "yes") {
    row = byItem(7);
  } else if (a.frontYard === "yes") {
    if (a.withinHighwayLotLine === "yes") row = byItem(1);
    else if (a.withinHighwayLotLine === "no") row = byItem(2);
  } else if (a.frontYard === "no") {
    if (a.onDeck === "yes") {
      row = byItem(5);
    } else if (a.onDeck === "no") {
      if (a.nearDriveway === "yes") {
        if (a.nearSideHighway === "yes") row = byItem(3);
        else if (a.nearSideHighway === "no") row = byItem(4);
      } else if (a.nearDriveway === "no") {
        if (a.abutsMajor === "yes") row = byItem(6);
        else if (a.abutsMajor === "no") row = byItem(9);
      }
    }
  }

  if (!row) return null;

  let appliedHeight: string;
  let column: FenceHelperMatch["column"];
  if (a.vegetation === "yes") {
    appliedHeight = row.hedge;
    column = "Hedge / vegetation";
  } else if (a.propertyType === "residential") {
    appliedHeight = row.residential;
    column = "Single or multiple residential";
  } else {
    appliedHeight = row.nonResidential;
    column = "Non-residential";
  }

  const notes: string[] = [];
  if (a.nearDriveway === "yes") {
    notes.push(
      "Within 2.4 m of a driveway, the fence must also be open-fence construction (e.g. open mesh chain-link) regardless of the height limit (§ 447-1.2C).",
    );
  }
  if (a.withinHighwayLotLine === "yes" || a.nearSideHighway === "yes") {
    notes.push(
      "If the fence is at a school and adjacent to a public highway or right-of-way, a 1.5 m limit applies instead (§ 447-1.2B(3)).",
    );
  }
  notes.push(
    "If different parts of your fence match different rows, each part is assessed separately (§ 447-1.2B(2)).",
  );

  return { row, appliedHeight, column, notes };
}

export const FENCE_HELPER_DISCLAIMER =
  "This helper is for general reference only. Fence rules depend on the exact location and property conditions. Always confirm with Chapter 447 or City staff.";
