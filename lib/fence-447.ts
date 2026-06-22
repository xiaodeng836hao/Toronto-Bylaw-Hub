// ─────────────────────────────────────────────────────────────────────────────
//  Toronto Bylaw Hub — Chapter 447 (Fences) detail data (V3.6)
//
//  Simple, resident-facing data for the GENERAL fence requirements on the
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
  /** Simple explanation of when this row applies. */
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
    situation: "Front yard, near a street-side lot line",
    description: "Front yard, within 2.4 m of a public-highway lot line (a public lane doesn't count).",
    residential: "1.2 m",
    nonResidential: "1.2 m",
    hedge: "1.2 m",
    plain: "A front-yard fence close to the street has the lowest limit so it doesn't block sightlines.",
    example: "A picket fence right by the front sidewalk may be up to 1.2 m.",
  },
  {
    item: 2,
    situation: "Front yard, set back from the street",
    description: "Front yard, more than 2.4 m back from the public-highway lot line.",
    residential: "2.0 m",
    nonResidential: "2.0 m",
    hedge: "No maximum",
    plain: "Set back from the street, a front-yard fence can be taller; a hedge here has no set maximum.",
    example: "A fence partway up the front yard, well back from the sidewalk, may be up to 2.0 m.",
  },
  {
    item: 3,
    situation: "Side, near a street-side lot line and a driveway",
    description: "Not a front yard; within 2.4 m of both a public-highway side lot line and a driveway.",
    residential: "2.0 m",
    nonResidential: "2.0 m",
    hedge: "2.0 m",
    plain: "Close to both a street-side lot line and a driveway, so the limit keeps sightlines clear.",
    example: "A corner-lot side fence next to the driveway may be up to 2.0 m.",
  },
  {
    item: 4,
    situation: "Side, past the street-side lot line, near a driveway",
    description: "Not a front yard; past 2.4 m from the public-highway side lot line but within 2.4 m of a driveway.",
    residential: "2.0 m",
    nonResidential: "2.5 m",
    hedge: "No maximum",
    plain: "Further in along the side, still within 2.4 m of a driveway. Non-residential may be a bit taller.",
    example: "A side-yard fence beside the driveway may be up to 2.0 m (residential).",
  },
  {
    item: 5,
    situation: "On an unroofed deck",
    description: "On an unroofed deck (not a front yard, not within 2.4 m of a street-side lot line); measured from the deck.",
    residential: "2.0 m above deck",
    nonResidential: "2.0 m above deck",
    hedge: "No maximum",
    plain: "Measured from the deck surface — not the ground — so it sits higher above the yard.",
    example: "A privacy screen on a raised back deck may be up to 2.0 m from the deck floor.",
  },
  {
    item: 6,
    situation: "Abutting multi-res, non-res, a highway or a walkway",
    description: "Not a front yard (and not Items 3–5); abutting multi-residential, non-residential, a highway, or a public walkway.",
    residential: "2.5 m",
    nonResidential: "2.5 m",
    hedge: "No maximum",
    plain: "Backing onto an apartment/business property, road, or walkway allows a taller fence for buffering.",
    example: "A back fence along a property that backs onto a public walkway may be up to 2.5 m.",
  },
  {
    item: 7,
    situation: "Abutting a rapid transit right-of-way",
    description: "Abutting a rapid transit right-of-way.",
    residential: "2.5 m",
    nonResidential: "No maximum",
    hedge: "No maximum",
    plain: "A fence along a rapid transit corridor may be taller for buffering.",
    example: "A residential fence backing onto a subway/LRT corridor may be up to 2.5 m.",
  },
  {
    item: 8,
    situation: "Recreational facility (tennis, baseball, etc.)",
    description: "For a tennis court, baseball diamond, or other recreational facility.",
    residential: "3.0 m",
    nonResidential: "No maximum",
    hedge: "No maximum",
    plain: "Sports fencing can be much taller to contain balls and play.",
    example: "A backstop or tennis-court fence on a residential property may be up to 3.0 m.",
  },
  {
    item: 9,
    situation: "Any other fence",
    description: "Any other fence not covered above.",
    residential: "2.0 m",
    nonResidential: "2.5 m",
    hedge: "No maximum",
    plain: "The catch-all row — a typical rear-yard fence is generally up to 2.0 m (residential).",
    example: "A standard backyard fence between two houses may be up to 2.0 m (residential).",
  },
];

export const FENCE_HEIGHT_MEASUREMENT_NOTE =
  "Height is measured from the average grade level 1 m out on either side of the fence (§ 447-1.2B(1)). If parts of one fence match different rows, each part is judged separately (§ 447-1.2B(2)).";

export const FENCE_SCHOOL_NOTE =
  "School fences: max 1.5 m where adjacent to a public highway or right-of-way (§ 447-1.2B(3)).";

// ── General fence restrictions (§ 447-1.2A) ──────────────────────────────────
export interface FenceRestriction {
  title: string;
  text: string;
  sectionReference: string;
}

export const FENCE_RESTRICTIONS: FenceRestriction[] = [
  {
    title: "No barbed wire or sharp material",
    text:
      "Barbed wire, chicken wire, or sharp material isn't allowed — except above 2.5 m on 45° inward brackets, where the fence may exceed 2.5 m.",
    sectionReference: "§ 447-1.2A(2)",
  },
  {
    title: "No sheet or corrugated metal",
    text: "Sheet metal and corrugated metal panels can't be used in any fence.",
    sectionReference: "§ 447-1.2A(3)",
  },
  {
    title: "No electric fences (off-farm)",
    text:
      "Fences can't carry electricity, except low-voltage livestock fencing on farmland (≤12 V, livestock-only, warning signs every 12 m).",
    sectionReference: "§ 447-1.2A(4)",
  },
  {
    title: "Use permanent-fencing materials",
    text: "Use materials meant for permanent fencing unless another by-law allows otherwise.",
    sectionReference: "§ 447-1.2A(5)",
  },
  {
    title: "No temporary fences (snow fences excepted)",
    text: "Temporary fences aren't allowed; a snow fence is the exception, only Nov 15 – Apr 15.",
    sectionReference: "§ 447-1.2A(5), (6)",
  },
];

// ── Driveways and visibility (§ 447-1.2C–D) ──────────────────────────────────
export const FENCE_DRIVEWAY_VISIBILITY = {
  points: [
    "A fence within 2.4 m of a driveway must be open (see-through) construction — like chain-link — for 2.4 m from where the driveway meets the lot line, so it doesn't block the view of the street.",
    "Open construction gives drivers and pedestrians a clear view through the whole fence; parking-lot fences must stay open wherever they'd block sightlines.",
    "Don't let a hedge, plants, or objects grow into or block a fence that has to stay open.",
  ],
  example:
    "A tall, solid fence beside a driveway can hide approaching pedestrians or cyclists — an open construction like chain-link may be required there instead.",
  sectionReference: "§ 447-1.2C, D",
};

// ── Fences on unroofed decks (Table 1, Item 5) ───────────────────────────────
export const FENCE_DECK_RULES = {
  points: [
    "On an attached, unroofed deck (not a front yard, not within 2.4 m of a street-side lot line), a fence may be up to 2.0 m measured from the deck surface — not the ground.",
    "If the deck fence also acts as a guard, it must also meet Chapter 629; where rules overlap, the stricter one applies.",
  ],
  example:
    "A 2.0 m privacy screen on a raised deck is measured from the deck floor, so it can sit higher above the yard than a ground-level fence.",
  sectionReference: "§ 447-1.2B (Item 5); § 447-1.2E",
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
