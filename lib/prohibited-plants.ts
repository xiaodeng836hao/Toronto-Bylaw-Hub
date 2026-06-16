// ─────────────────────────────────────────────────────────────────────────────
//  Toronto Bylaw Hub — Prohibited Plants data (V3.1)
//
//  Educational reference content for the 10 prohibited plants recognized by the
//  City of Toronto (Toronto Municipal Code Chapter 489, Turfgrass and Prohibited
//  Plants). Framing follows the City's official page; species identification and
//  removal guidance reflect well-established public horticultural knowledge.
//
//  This content is for general education only and is NOT a legal determination.
//  Always confirm with official City of Toronto resources.
// ─────────────────────────────────────────────────────────────────────────────

/** Official City of Toronto prohibited plants page. */
export const PROHIBITED_PLANTS_OFFICIAL_URL =
  "https://www.toronto.ca/city-government/public-notices-bylaws/bylaw-enforcement/turfgrass-prohibited-plants/";

/** Toronto Municipal Code Chapter 489 — Turfgrass and Prohibited Plants. */
export const CHAPTER_489_PDF_URL = "https://www.toronto.ca/legdocs/municode/1184_489.pdf";

/** Ontario Invasive Plant Council — reputable, non-commercial educational resource. */
export const OIPC_URL = "https://www.ontarioinvasiveplants.ca/";

// ─── Enums / unions ──────────────────────────────────────────────────────────

export type HazardLevel = "Low" | "Moderate" | "High" | "Extreme";

export type HazardTag =
  | "skin-irritation"
  | "invasive-spread"
  | "allergy"
  | "chokes-natives";

export type LocationType =
  | "backyard"
  | "fence-line"
  | "ravine-edge"
  | "wetland-pond-edge"
  | "vacant-lot"
  | "garden-bed";

export type Season =
  | "early-spring"
  | "late-spring"
  | "summer"
  | "late-summer"
  | "fall"
  | "winter";

/** Icon + tone keys are mapped to concrete lucide icons / Tailwind classes in the UI. */
export type StageIcon =
  | "sprout"
  | "leaf"
  | "flower"
  | "seed"
  | "berry"
  | "reed"
  | "shrub"
  | "dormant"
  | "sun";

export type Tone = "green" | "lime" | "amber" | "rose" | "violet" | "teal" | "slate";

// ─── Display metadata for filters / badges ───────────────────────────────────

export const HAZARD_TAGS: { value: HazardTag; label: string; description: string }[] = [
  { value: "skin-irritation", label: "Skin irritation", description: "Sap or oils can burn or cause a rash" },
  { value: "invasive-spread", label: "Invasive spread", description: "Spreads aggressively and is hard to control" },
  { value: "allergy", label: "Allergy risk", description: "Pollen can trigger hay fever and allergies" },
  { value: "chokes-natives", label: "Chokes out natives", description: "Crowds out native plants and habitat" },
];

export const LOCATION_TYPES: { value: LocationType; label: string }[] = [
  { value: "backyard", label: "Backyard" },
  { value: "fence-line", label: "Fence line" },
  { value: "ravine-edge", label: "Ravine edge" },
  { value: "wetland-pond-edge", label: "Wetland / pond edge" },
  { value: "vacant-lot", label: "Vacant lot" },
  { value: "garden-bed", label: "Garden bed" },
];

export const SEASONS: { value: Season; label: string }[] = [
  { value: "early-spring", label: "Early spring" },
  { value: "late-spring", label: "Late spring" },
  { value: "summer", label: "Summer" },
  { value: "late-summer", label: "Late summer" },
  { value: "fall", label: "Fall" },
  { value: "winter", label: "Winter / dormant" },
];

export const HAZARD_LEVEL_META: Record<HazardLevel, { tone: Tone; description: string }> = {
  Low: { tone: "green", description: "Mostly a nuisance; low direct risk to people" },
  Moderate: { tone: "amber", description: "Spreads readily; handle with basic precautions" },
  High: { tone: "rose", description: "Significant risk — protective equipment needed" },
  Extreme: { tone: "rose", description: "Do not touch — risk of serious injury" },
};

// ─── Types ───────────────────────────────────────────────────────────────────

export interface MonthlyStage {
  /** Human-readable period, e.g. "April–May (Early spring)". */
  period: string;
  season: Season;
  /** What the plant looks like overall, including leaf/stem cues. */
  appearance: string;
  /** The stand-out flower / seed / plume / berry feature and what makes it recognizable now. */
  keyFeature: string;
  /** Typical height or spread during this period, if useful. */
  height?: string;
  icon: StageIcon;
  tone: Tone;
}

export interface PlantImage {
  /** Growth stage label, e.g. "Spring rosette", "Flowering". */
  stage: string;
  /** Descriptive alt text for screen readers. */
  alt: string;
  /** Visible identification traits shown as a caption. */
  caption: string;
  icon: StageIcon;
  tone: Tone;
  /** Where a real, licensed image could be sourced from later (metadata only). */
  sourceName: string;
  sourceUrl: string;
}

export interface LookAlike {
  name: string;
  howToTell: string;
}

export interface RemovalGuidance {
  method: string;
  tools: string[];
  bestTime: string;
  preventRegrowth: string;
  whatNotToDo: string[];
  disposal: string;
  monitoring: string;
}

/** Trait profile used by the rules-based identifier helper. */
export interface PlantTraits {
  hasFlowers: boolean;
  wetAreas: boolean;
  isVine: boolean;
  umbrellaFlowerHeads: boolean;
  skinIrritation: boolean;
  shrubOrSmallTree: boolean;
  reedLikeStems: boolean;
  springWoodlandEdge: boolean;
  fluffySeedsOrPlumes: boolean;
}

export interface OfficialSource {
  label: string;
  url: string;
}

export interface ProhibitedPlant {
  id: string;
  slug: string;
  commonName: string;
  scientificName: string;
  summary: string;
  whyProhibited: string;
  identificationFeatures: string[];
  lookAlikes: LookAlike[];
  commonLocations: LocationType[];
  bestMonthsToIdentify: string;
  identifySeasons: Season[];
  monthlyStages: MonthlyStage[];
  removal: RemovalGuidance;
  safetyCautions: string[];
  disposalGuidance: string;
  professionalHelpAdvice: string;
  hazardLevel: HazardLevel;
  hazardTags: HazardTag[];
  /** Compare-table fields. */
  keyVisualClue: string;
  seasonOfVisibility: string;
  easiestToIdentify: string;
  easiestToRemove: string;
  images: PlantImage[];
  officialSources: OfficialSource[];
  traits: PlantTraits;
  createdAt: string;
  updatedAt: string;
}

// ─── Shared source helper ────────────────────────────────────────────────────

const CITY_SOURCE: OfficialSource = { label: "City of Toronto — Prohibited Plants", url: PROHIBITED_PLANTS_OFFICIAL_URL };
const CH489_SOURCE: OfficialSource = { label: "Toronto Municipal Code Chapter 489 (PDF)", url: CHAPTER_489_PDF_URL };
const OIPC_SOURCE: OfficialSource = { label: "Ontario Invasive Plant Council", url: OIPC_URL };

const NOW = "2026-06-13T00:00:00.000Z";

// ─── The 10 prohibited plants ────────────────────────────────────────────────

export const prohibitedPlants: ProhibitedPlant[] = [
  {
    id: "canada-thistle",
    slug: "canada-thistle",
    commonName: "Canada Thistle",
    scientificName: "Cirsium arvense",
    summary:
      "A spiny, deep-rooted perennial weed with small purple-pink flower heads. It spreads quickly by creeping underground roots and by fluffy, wind-blown seeds, forming dense patches.",
    whyProhibited:
      "Canada thistle out-competes native plants for space, water, and nutrients, crowding out garden plants, lawns, and native plant communities. Its sharp spines make areas hard to use, and a single patch can quickly take over a yard, fence line, or vacant lot.",
    identificationFeatures: [
      "Spiny, wavy-edged (lobed) green leaves with prickly margins",
      "Small purple to pinkish flower heads, about 1–2 cm across, in clusters",
      "Slender grooved stems, usually 0.6–1.5 m tall",
      "Spreads into dense patches from creeping horizontal roots",
      "Fluffy white seed tufts carried by the wind in late summer",
    ],
    lookAlikes: [
      { name: "Bull thistle", howToTell: "Bull thistle has much larger, solitary flower heads and very sharp spiny wings down the stem; Canada thistle flowers are small and clustered." },
      { name: "Sow thistle", howToTell: "Sow thistle has yellow dandelion-like flowers and milky sap, not purple flower heads." },
    ],
    commonLocations: ["backyard", "vacant-lot", "fence-line", "garden-bed"],
    bestMonthsToIdentify: "June to August, when the purple flower heads are open",
    identifySeasons: ["late-spring", "summer", "late-summer"],
    monthlyStages: [
      { period: "April–May (Early spring)", season: "early-spring", appearance: "Low rosettes of spiny, deeply lobed leaves emerge from last year's roots, often in a spreading patch.", keyFeature: "Prickly, wavy-edged leaves appearing in groups from creeping roots.", height: "5–20 cm", icon: "sprout", tone: "lime" },
      { period: "May–June (Late spring)", season: "late-spring", appearance: "Upright grooved stems shoot up with spiny leaves along their length.", keyFeature: "Fast vertical growth; spiny leaves and branching stems.", height: "30–80 cm", icon: "leaf", tone: "green" },
      { period: "June–August (Summer)", season: "summer", appearance: "Plants are now tall and branched, topped with clusters of small purple-pink flower heads.", keyFeature: "Clusters of small purple flower heads — the easiest ID stage.", height: "0.6–1.5 m", icon: "flower", tone: "violet" },
      { period: "August–September (Late summer)", season: "late-summer", appearance: "Flower heads turn to fluffy white seed tufts that blow away on the wind.", keyFeature: "Thistledown — fluffy white wind-borne seeds.", icon: "seed", tone: "slate" },
      { period: "October–winter (Dormant)", season: "fall", appearance: "Top growth dies back to brown stalks; the root system survives underground.", keyFeature: "Dead brown stems; roots remain alive below ground.", icon: "dormant", tone: "amber" },
    ],
    removal: {
      method:
        "For a small patch, cut or mow the plants down repeatedly before they flower to starve the roots, and dig out as much of the root system as you can with a fork or spade. Persistence over a season or two is key, because the roots resprout.",
      tools: ["Thick gardening gloves (spines are sharp)", "Long sleeves", "Spade or garden fork", "Pruning shears or a mower"],
      bestTime: "Cut repeatedly through spring and early summer; remove before flowers turn to seed.",
      preventRegrowth: "Keep cutting any regrowth to exhaust the roots, then plant or mulch the area densely so thistle can't re-establish.",
      whatNotToDo: [
        "Don't let it go to seed — cutting after the fluffy seeds form spreads it further",
        "Don't rototill an established patch; chopping the roots can create many new plants",
      ],
      disposal:
        "Bag flowering or seeding stems and put them in the garbage — do not compost seed heads, and avoid the green bin if seeds are present.",
      monitoring: "Check the area every few weeks through the growing season and again next spring for resprouts.",
    },
    safetyCautions: [
      "Wear thick gloves and long sleeves — the spines can prick and irritate skin",
      "Avoid cutting once seed tufts have formed, to prevent spreading seeds",
    ],
    disposalGuidance: "Bag seed heads and dispose in the garbage rather than composting. Clean tools and clothing of seeds before moving to another area.",
    professionalHelpAdvice: "Large, well-established patches on bigger lots may need a professional or repeated seasonal treatment to fully control.",
    hazardLevel: "Moderate",
    hazardTags: ["invasive-spread", "chokes-natives"],
    keyVisualClue: "Small purple flower clusters on spiny stems",
    seasonOfVisibility: "Late spring to late summer",
    easiestToIdentify: "Summer (in flower)",
    easiestToRemove: "Spring (young growth)",
    images: [
      { stage: "Spring rosette", alt: "Low rosette of spiny lobed Canada thistle leaves", caption: "Prickly, wavy-edged leaves in a low rosette", icon: "sprout", tone: "lime", sourceName: "Ontario Invasive Plant Council", sourceUrl: OIPC_URL },
      { stage: "Mature foliage", alt: "Upright Canada thistle stems with spiny leaves", caption: "Grooved stems with spiny leaves along their length", icon: "leaf", tone: "green", sourceName: "Ontario Invasive Plant Council", sourceUrl: OIPC_URL },
      { stage: "Flowering", alt: "Clusters of small purple Canada thistle flower heads", caption: "Small purple-pink flower heads in clusters", icon: "flower", tone: "violet", sourceName: "Ontario Invasive Plant Council", sourceUrl: OIPC_URL },
      { stage: "Seed stage", alt: "Fluffy white Canada thistle seed tufts", caption: "Fluffy white wind-borne seed tufts", icon: "seed", tone: "slate", sourceName: "Ontario Invasive Plant Council", sourceUrl: OIPC_URL },
    ],
    officialSources: [CITY_SOURCE, CH489_SOURCE, OIPC_SOURCE],
    traits: { hasFlowers: true, wetAreas: false, isVine: false, umbrellaFlowerHeads: false, skinIrritation: false, shrubOrSmallTree: false, reedLikeStems: false, springWoodlandEdge: false, fluffySeedsOrPlumes: true },
    createdAt: NOW,
    updatedAt: NOW,
  },

  {
    id: "buckthorn",
    slug: "buckthorn",
    commonName: "Buckthorn (Common & Glossy)",
    scientificName: "Rhamnus cathartica / Frangula alnus",
    summary:
      "A tall shrub or small tree that invades yards, hedgerows, and ravines. It leafs out early and keeps its green leaves late into fall, and its black berries are spread widely by birds.",
    whyProhibited:
      "Buckthorn degrades natural areas by forming a dense monoculture that shades out and inhibits the growth of native shrubs and wildflowers. It spreads rapidly because birds eat the berries and drop the seeds everywhere, and it is very difficult to remove once established.",
    identificationFeatures: [
      "Shrub or small tree, often 2–6 m tall, sometimes multi-stemmed",
      "Oval leaves with curved (arching) veins and finely toothed edges",
      "Stays green late into fall, after most native plants have dropped their leaves",
      "Clusters of small black berries on female plants in late summer and fall",
      "Common buckthorn often has a short thorn at the tip of twigs; cut bark is orange underneath",
    ],
    lookAlikes: [
      { name: "Native dogwoods", howToTell: "Dogwood leaf veins also curve, but dogwoods lack the late-fall green leaves and black berries, and have different bark." },
      { name: "Cherry / plum saplings", howToTell: "Cherries have horizontal lines (lenticels) on the bark and a single trunk; buckthorn bark is rougher and cut wood is orange." },
    ],
    commonLocations: ["backyard", "fence-line", "ravine-edge", "vacant-lot"],
    bestMonthsToIdentify: "October to November, when buckthorn stays green after other plants lose their leaves",
    identifySeasons: ["summer", "late-summer", "fall"],
    monthlyStages: [
      { period: "April–May (Early spring)", season: "early-spring", appearance: "One of the first shrubs to leaf out, with glossy oval leaves opening early.", keyFeature: "Early leaf-out — green before most native shrubs.", height: "2–6 m", icon: "leaf", tone: "green" },
      { period: "May–June (Late spring)", season: "late-spring", appearance: "Small, inconspicuous greenish-yellow flowers appear in the leaf joints.", keyFeature: "Tiny greenish flowers; leaves show curved veins.", icon: "flower", tone: "lime" },
      { period: "July–September (Summer)", season: "summer", appearance: "Dense, leafy shrub or small tree; green berries begin to form on female plants.", keyFeature: "Curved leaf veins and forming berry clusters.", icon: "leaf", tone: "green" },
      { period: "August–October (Late summer / fall)", season: "fall", appearance: "Berries ripen to black; foliage stays stubbornly green.", keyFeature: "Black berry clusters + late-season green leaves — the giveaway.", icon: "berry", tone: "slate" },
      { period: "November–winter (Dormant)", season: "winter", appearance: "Leaves finally drop, leaving twigs that may end in a small thorn; orange inner bark when cut.", keyFeature: "Thorn-tipped twigs; orange wood under the bark.", icon: "dormant", tone: "amber" },
    ],
    removal: {
      method:
        "Pull or dig out seedlings and small plants when the soil is moist — the whole root comes up more easily. For larger stems, cut them low; because cut stumps resprout vigorously, repeatedly cut the regrowth, or cover the stump to block light over the season.",
      tools: ["Gloves", "Pruning shears or a pruning saw", "Spade or a weed-pulling lever tool for small stems"],
      bestTime: "Fall is ideal for spotting and cutting buckthorn (it's still green); pull seedlings any time the soil is moist.",
      preventRegrowth: "Monitor cut stumps and pull new seedlings each year; replant the area with native shrubs to shade out returns.",
      whatNotToDo: [
        "Don't leave berry-laden branches lying around — birds and seeds can spread them",
        "Don't assume one cut is enough; uncut stumps will resprout",
      ],
      disposal:
        "Bag berries and seed-bearing branches for the garbage so seeds aren't spread. Woody stems with no berries can usually go out as yard waste per City rules.",
      monitoring: "Re-check cut stumps and surrounding soil for seedlings every year for several years.",
    },
    safetyCautions: [
      "Wear gloves and eye protection when cutting woody stems",
      "Watch for the small thorns at the tips of common buckthorn twigs",
    ],
    disposalGuidance: "Bag and garbage any berries or seed-bearing material; check City yard-waste rules for woody, berry-free branches.",
    professionalHelpAdvice: "Large thickets, or buckthorn growing along a ravine edge, are best handled with a professional or a community stewardship group.",
    hazardLevel: "Moderate",
    hazardTags: ["invasive-spread", "chokes-natives"],
    keyVisualClue: "Stays green late in fall; black berries; curved leaf veins",
    seasonOfVisibility: "Spring through late fall",
    easiestToIdentify: "Fall (still green)",
    easiestToRemove: "Fall, or any time for small seedlings",
    images: [
      { stage: "Early leaf-out", alt: "Buckthorn shrub leafing out early in spring", caption: "Glossy oval leaves opening earlier than native shrubs", icon: "leaf", tone: "green", sourceName: "Ontario Invasive Plant Council", sourceUrl: OIPC_URL },
      { stage: "Mature shrub", alt: "Dense buckthorn shrub with curved-vein leaves", caption: "Dense shrub/small tree with curved leaf veins", icon: "shrub", tone: "teal", sourceName: "Ontario Invasive Plant Council", sourceUrl: OIPC_URL },
      { stage: "Berry stage", alt: "Clusters of black buckthorn berries", caption: "Black berry clusters ripen in late summer to fall", icon: "berry", tone: "slate", sourceName: "Ontario Invasive Plant Council", sourceUrl: OIPC_URL },
      { stage: "Late season", alt: "Buckthorn keeping green leaves into late fall", caption: "Leaves stay green after native plants drop theirs", icon: "leaf", tone: "amber", sourceName: "Ontario Invasive Plant Council", sourceUrl: OIPC_URL },
    ],
    officialSources: [CITY_SOURCE, CH489_SOURCE, OIPC_SOURCE],
    traits: { hasFlowers: false, wetAreas: false, isVine: false, umbrellaFlowerHeads: false, skinIrritation: false, shrubOrSmallTree: true, reedLikeStems: false, springWoodlandEdge: false, fluffySeedsOrPlumes: false },
    createdAt: NOW,
    updatedAt: NOW,
  },

  {
    id: "dog-strangling-vine",
    slug: "dog-strangling-vine",
    commonName: "Dog-Strangling Vine",
    scientificName: "Cynanchum rossicum / Cynanchum louiseae",
    summary:
      "A twining perennial vine in the milkweed family that smothers other plants. It forms dense mats, climbs over vegetation, and releases fluffy wind-blown seeds from slender pods.",
    whyProhibited:
      "Dog-strangling vine grows over and smothers native plants, shrubs, and young trees, forming dense monocultures and releasing chemicals into the soil that inhibit other species (allelopathy). It also harms monarch butterflies, which mistakenly lay eggs on it because it is related to milkweed.",
    identificationFeatures: [
      "Twining vine that wraps around plants and stems, 1–2 m long",
      "Oval, pointed leaves arranged in opposite pairs along the stem",
      "Small star-shaped flowers, pink-brown to dark maroon, in summer",
      "Slender bean-like seed pods, 4–7 cm, that split to release fluffy seeds",
      "Grows in dense, tangled patches that choke out other plants",
    ],
    lookAlikes: [
      { name: "Native milkweed", howToTell: "Milkweed stands upright and does not twine; it has larger pink flower clusters and thicker pods." },
      { name: "Bindweed", howToTell: "Bindweed has white-to-pink trumpet flowers and arrowhead leaves, unlike the small dark star flowers of DSV." },
    ],
    commonLocations: ["backyard", "ravine-edge", "vacant-lot", "fence-line"],
    bestMonthsToIdentify: "July to September, when flowering and seed pods are present",
    identifySeasons: ["late-spring", "summer", "late-summer"],
    monthlyStages: [
      { period: "April–May (Early spring)", season: "early-spring", appearance: "New shoots emerge and begin to twine; paired oval leaves unfold.", keyFeature: "Twining shoots with opposite leaf pairs.", height: "10–40 cm", icon: "sprout", tone: "lime" },
      { period: "May–June (Late spring)", season: "late-spring", appearance: "Vines lengthen and climb over nearby plants and fences.", keyFeature: "Rapid climbing, tangling growth.", height: "0.5–1.5 m", icon: "leaf", tone: "green" },
      { period: "June–August (Summer)", season: "summer", appearance: "Small dark star-shaped flowers appear in the leaf joints.", keyFeature: "Tiny pink-brown to maroon star flowers.", icon: "flower", tone: "rose" },
      { period: "August–September (Late summer)", season: "late-summer", appearance: "Slender pods form and split open to release fluffy, wind-borne seeds.", keyFeature: "Bean-like pods releasing fluffy seeds (milkweed-style).", icon: "seed", tone: "slate" },
      { period: "October–winter (Dormant)", season: "fall", appearance: "Vines die back to straw-coloured tangles; roots survive underground.", keyFeature: "Dead tangled stems; persistent root crowns.", icon: "dormant", tone: "amber" },
    ],
    removal: {
      method:
        "Dig out the root crowns with a spade for small infestations — removing the root is essential because cutting alone won't kill it. Just as important, clip off and bag the seed pods before they open, so the patch can't spread by seed.",
      tools: ["Gloves", "Spade or garden fork", "Bags for seed pods"],
      bestTime: "Dig roots in spring or early summer; clip seed pods in August before they split open.",
      preventRegrowth: "Remove pods every year before they open and keep digging root crowns; replant with dense native plants to compete.",
      whatNotToDo: [
        "Don't just cut the tops — it resprouts from the roots",
        "Don't leave pods on cut vines; they can still ripen and release seeds",
      ],
      disposal:
        "Bag vines, roots, and especially seed pods and put them in the garbage. Do not compost, as seeds and root fragments can survive.",
      monitoring: "Check the area for new shoots through the season and for several years afterward.",
    },
    safetyCautions: [
      "Wear gloves; the milky sap can be mildly irritating to skin",
      "Bag seed pods carefully so seeds don't escape on the wind",
    ],
    disposalGuidance: "Bag all plant material — vines, roots, and seed pods — for the garbage. Never compost dog-strangling vine.",
    professionalHelpAdvice: "Large colonies, especially near ravines or natural areas, often need professional or coordinated stewardship efforts over multiple years.",
    hazardLevel: "Moderate",
    hazardTags: ["invasive-spread", "chokes-natives"],
    keyVisualClue: "Twining vine with dark star flowers and fluffy-seed pods",
    seasonOfVisibility: "Late spring to early fall",
    easiestToIdentify: "Summer (flowers/pods)",
    easiestToRemove: "Spring (dig roots)",
    images: [
      { stage: "Spring shoots", alt: "Young dog-strangling vine shoots beginning to twine", caption: "Twining shoots with paired oval leaves", icon: "sprout", tone: "lime", sourceName: "Ontario Invasive Plant Council", sourceUrl: OIPC_URL },
      { stage: "Climbing vine", alt: "Dog-strangling vine climbing over vegetation", caption: "Vines climb and smother nearby plants", icon: "leaf", tone: "green", sourceName: "Ontario Invasive Plant Council", sourceUrl: OIPC_URL },
      { stage: "Flowering", alt: "Small dark maroon star-shaped DSV flowers", caption: "Tiny pink-brown to maroon star-shaped flowers", icon: "flower", tone: "rose", sourceName: "Ontario Invasive Plant Council", sourceUrl: OIPC_URL },
      { stage: "Seed pods", alt: "Slender dog-strangling vine pods releasing fluffy seeds", caption: "Bean-like pods split to release fluffy seeds", icon: "seed", tone: "slate", sourceName: "Ontario Invasive Plant Council", sourceUrl: OIPC_URL },
    ],
    officialSources: [CITY_SOURCE, CH489_SOURCE, OIPC_SOURCE],
    traits: { hasFlowers: true, wetAreas: false, isVine: true, umbrellaFlowerHeads: false, skinIrritation: false, shrubOrSmallTree: false, reedLikeStems: false, springWoodlandEdge: false, fluffySeedsOrPlumes: true },
    createdAt: NOW,
    updatedAt: NOW,
  },

  {
    id: "garlic-mustard",
    slug: "garlic-mustard",
    commonName: "Garlic Mustard",
    scientificName: "Alliaria petiolata",
    summary:
      "A biennial woodland-edge weed that smells of garlic when crushed. It grows as a low rosette in its first year and sends up a tall flowering stem with small white flowers in its second spring.",
    whyProhibited:
      "Garlic mustard spreads quickly along woodland edges and gardens, releasing chemicals into the soil that suppress native plants and tree seedlings. A few plants can become a carpet within a couple of years.",
    identificationFeatures: [
      "Garlic or onion smell when the leaves or stems are crushed",
      "First-year plants: low rosette of round, kidney-shaped, scalloped leaves",
      "Second-year plants: tall stem (0.3–1 m) with triangular, toothed leaves",
      "Small white flowers with four petals in spring",
      "Thin, upright seed pods that follow the flowers",
    ],
    lookAlikes: [
      { name: "Violets", howToTell: "Violets have similar heart-shaped leaves but no garlic smell and purple (not white four-petalled) flowers." },
      { name: "Ground ivy (creeping Charlie)", howToTell: "Ground ivy creeps along the ground with scalloped leaves but has a minty smell and purple flowers." },
    ],
    commonLocations: ["backyard", "garden-bed", "ravine-edge", "fence-line"],
    bestMonthsToIdentify: "April to June, when the white flowers are open on second-year plants",
    identifySeasons: ["early-spring", "late-spring"],
    monthlyStages: [
      { period: "March–April (Early spring)", season: "early-spring", appearance: "First-year rosettes of round scalloped leaves green up early; second-year plants begin to bolt upward.", keyFeature: "Low rosettes of kidney-shaped leaves; garlic smell when crushed.", height: "5–15 cm", icon: "sprout", tone: "lime" },
      { period: "April–May (Late spring)", season: "late-spring", appearance: "Second-year plants send up a tall stem topped with small white four-petalled flowers.", keyFeature: "Clusters of small white four-petal flowers — easiest ID.", height: "0.3–1 m", icon: "flower", tone: "teal" },
      { period: "May–June (Late spring)", season: "late-spring", appearance: "Flowers give way to thin, upright seed pods along the stem.", keyFeature: "Slender upright seed pods forming.", icon: "seed", tone: "green" },
      { period: "July–August (Summer)", season: "summer", appearance: "Second-year plants dry out and die after dropping seed; first-year rosettes persist low to the ground.", keyFeature: "Dry tan stalks with pods; green rosettes remain below.", icon: "leaf", tone: "amber" },
      { period: "Fall–winter", season: "fall", appearance: "First-year rosettes stay green low to the ground, ready to flower next spring.", keyFeature: "Evergreen rosettes overwintering.", icon: "dormant", tone: "green" },
    ],
    removal: {
      method:
        "Hand-pull plants, including the slender taproot — the soil is usually soft and the whole plant comes up easily, especially after rain. Pull before the flowers set seed in spring. It's one of the easier prohibited plants for residents to manage.",
      tools: ["Gloves", "A bag for pulled plants (especially if flowering)"],
      bestTime: "Early to mid spring, before and during flowering, before seed pods ripen.",
      preventRegrowth: "Pull again each spring for several years to exhaust the seed bank; even small remaining plants can reseed.",
      whatNotToDo: [
        "Don't pull and leave flowering plants on the ground — they can still ripen seed",
        "Don't disturb the soil more than needed; bare soil invites new seedlings",
      ],
      disposal:
        "Bag flowering or seeding plants for the garbage so seeds aren't spread; do not compost plants that have flowered.",
      monitoring: "Revisit the patch each spring for at least 2–5 years, as seeds remain viable in the soil.",
    },
    safetyCautions: [
      "Low risk to handle — basic gloves are enough",
      "Bag flowering plants to avoid scattering seeds",
    ],
    disposalGuidance: "Bag and garbage any plants that have flowered or set seed; pre-flowering plants are lower risk but bagging is safest.",
    professionalHelpAdvice: "Rarely needs a professional; large woodland infestations may benefit from a coordinated community pull.",
    hazardLevel: "Moderate",
    hazardTags: ["invasive-spread", "chokes-natives"],
    keyVisualClue: "Garlic smell; white four-petal flowers; scalloped leaves",
    seasonOfVisibility: "Early spring to early summer",
    easiestToIdentify: "Spring (in flower)",
    easiestToRemove: "Spring (hand-pull)",
    images: [
      { stage: "First-year rosette", alt: "Low rosette of round scalloped garlic mustard leaves", caption: "Kidney-shaped, scalloped leaves in a low rosette", icon: "sprout", tone: "lime", sourceName: "Ontario Invasive Plant Council", sourceUrl: OIPC_URL },
      { stage: "Flowering (2nd year)", alt: "Garlic mustard stem with small white four-petalled flowers", caption: "Tall stem with small white four-petal flowers", icon: "flower", tone: "teal", sourceName: "Ontario Invasive Plant Council", sourceUrl: OIPC_URL },
      { stage: "Seed pods", alt: "Slender upright seed pods on garlic mustard", caption: "Thin upright seed pods along the stem", icon: "seed", tone: "green", sourceName: "Ontario Invasive Plant Council", sourceUrl: OIPC_URL },
      { stage: "Late season", alt: "Dry garlic mustard stalks with overwintering rosettes", caption: "Dry stalks; green rosettes overwinter below", icon: "leaf", tone: "amber", sourceName: "Ontario Invasive Plant Council", sourceUrl: OIPC_URL },
    ],
    officialSources: [CITY_SOURCE, CH489_SOURCE, OIPC_SOURCE],
    traits: { hasFlowers: true, wetAreas: false, isVine: false, umbrellaFlowerHeads: false, skinIrritation: false, shrubOrSmallTree: false, reedLikeStems: false, springWoodlandEdge: true, fluffySeedsOrPlumes: false },
    createdAt: NOW,
    updatedAt: NOW,
  },

  {
    id: "giant-hogweed",
    slug: "giant-hogweed",
    commonName: "Giant Hogweed",
    scientificName: "Heracleum mantegazzianum",
    summary:
      "A very large, hazardous plant with thick blotchy stems and huge white umbrella-shaped flower heads. Its watery sap can cause severe skin burns and blisters when skin is exposed to sunlight afterward.",
    whyProhibited:
      "Giant hogweed is a serious health hazard: contact with its sap, followed by sunlight, can cause painful burns, blistering, and long-lasting scars, and sap in the eye can damage sight. It also spreads readily and crowds out other plants.",
    identificationFeatures: [
      "Very tall — often 2–5 m when in flower",
      "Thick green stems (4–10 cm) with purple-red blotches and stiff white hairs",
      "Enormous, deeply divided leaves up to 1 m or more across",
      "Large white flower heads shaped like umbrellas (umbels), up to 0.5–0.8 m wide",
      "Sturdy, ridged hollow stems",
    ],
    lookAlikes: [
      { name: "Cow parsnip", howToTell: "Cow parsnip is smaller (1–2 m), with fuzzy stems lacking the strong purple blotches and a smaller flower head. Its sap can also irritate — handle any look-alike with care." },
      { name: "Angelica", howToTell: "Angelica has smooth, often purplish rounded stems and dome-shaped (not flat umbrella) flower clusters." },
      { name: "Queen Anne's lace", howToTell: "Queen Anne's lace is small (under 1.2 m) with a lacy flat flower and a single tiny dark flower in the centre." },
    ],
    commonLocations: ["ravine-edge", "wetland-pond-edge", "vacant-lot"],
    bestMonthsToIdentify: "June to August, when the giant white umbrella flower heads are visible — observe from a distance only",
    identifySeasons: ["late-spring", "summer"],
    monthlyStages: [
      { period: "April–May (Early spring)", season: "early-spring", appearance: "Huge, deeply lobed leaves expand near the ground; the plant is already large but not yet flowering.", keyFeature: "Enormous jagged leaves — do not touch.", height: "0.5–1.5 m", icon: "leaf", tone: "green" },
      { period: "May–June (Late spring)", season: "late-spring", appearance: "A thick, blotchy, hairy stem rises rapidly, carrying the developing flower head.", keyFeature: "Thick stem with purple blotches and white hairs.", height: "1.5–3 m", icon: "sprout", tone: "rose" },
      { period: "June–August (Summer)", season: "summer", appearance: "Towering plant topped with a massive white umbrella-shaped flower head.", keyFeature: "Giant white umbrella flower head — unmistakable, view from afar.", height: "2–5 m", icon: "flower", tone: "slate" },
      { period: "August–September (Late summer)", season: "late-summer", appearance: "Flowers turn to large flat, dry seeds; the plant begins to decline after seeding.", keyFeature: "Big flat seed heads forming.", icon: "seed", tone: "amber" },
      { period: "Fall–winter (Dormant)", season: "fall", appearance: "Top growth dies back to tall dry stalks; sap on dead stems can still irritate.", keyFeature: "Dead hollow stalks — still avoid contact.", icon: "dormant", tone: "slate" },
    ],
    removal: {
      method:
        "For giant hogweed, safety comes first — do not attempt casual removal. Because the sap is hazardous, the City and health authorities advise reporting it and, in most cases, having it removed by trained professionals with full protective equipment. If you believe you've found it, keep people and pets away and seek guidance rather than cutting it yourself.",
      tools: ["Do not handle without full protective equipment", "Professional removal strongly recommended"],
      bestTime: "Leave timing and method to professionals; the priority is to avoid any skin contact with the sap.",
      preventRegrowth: "Professionals typically manage the root and monitor the site over multiple seasons; report any regrowth.",
      whatNotToDo: [
        "Do NOT touch, cut, mow, or weed-whip it — this splatters hazardous sap",
        "Do NOT let the sap contact skin or eyes; do not burn it",
        "Do not let children or pets near the plant",
      ],
      disposal:
        "Disposal should be handled by professionals. Do not compost or chip giant hogweed, and do not move material around with the sap still present.",
      monitoring: "Professionals monitor the site for several years; report any new plants to the City.",
    },
    safetyCautions: [
      "DANGER: the watery sap plus sunlight can cause severe burns and blistering",
      "Sap in the eyes can cause serious, possibly permanent eye damage",
      "If sap contacts your skin, wash immediately with soap and water, keep the area out of sunlight, and seek medical advice",
      "Keep children and pets well away; do not attempt DIY removal",
    ],
    disposalGuidance: "Do not handle or compost. Arrange professional removal and disposal; report the location to the City and avoid all skin contact.",
    professionalHelpAdvice: "Always recommended. Giant hogweed should be assessed and removed by trained professionals using full protective equipment.",
    hazardLevel: "Extreme",
    hazardTags: ["skin-irritation", "invasive-spread"],
    keyVisualClue: "Giant white umbrella flowers on a blotchy, hairy stem (2–5 m)",
    seasonOfVisibility: "Late spring to summer",
    easiestToIdentify: "Summer (in flower) — from a distance",
    easiestToRemove: "Professional removal recommended",
    images: [
      { stage: "Early leaves", alt: "Large deeply divided giant hogweed leaves near the ground", caption: "Enormous jagged leaves — do not touch", icon: "leaf", tone: "green", sourceName: "Government of Ontario — Giant Hogweed", sourceUrl: "https://www.ontario.ca/page/giant-hogweed" },
      { stage: "Blotchy stem", alt: "Thick giant hogweed stem with purple blotches and white hairs", caption: "Thick stem with purple-red blotches and stiff hairs", icon: "sprout", tone: "rose", sourceName: "Government of Ontario — Giant Hogweed", sourceUrl: "https://www.ontario.ca/page/giant-hogweed" },
      { stage: "Flowering", alt: "Giant hogweed with a huge white umbrella-shaped flower head", caption: "Massive white umbrella flower head, up to ~0.8 m wide", icon: "flower", tone: "slate", sourceName: "Government of Ontario — Giant Hogweed", sourceUrl: "https://www.ontario.ca/page/giant-hogweed" },
      { stage: "Seed stage", alt: "Flat dry giant hogweed seed heads", caption: "Large flat seed heads as the plant declines", icon: "seed", tone: "amber", sourceName: "Government of Ontario — Giant Hogweed", sourceUrl: "https://www.ontario.ca/page/giant-hogweed" },
    ],
    officialSources: [
      CITY_SOURCE,
      CH489_SOURCE,
      { label: "Government of Ontario — Giant Hogweed", url: "https://www.ontario.ca/page/giant-hogweed" },
    ],
    traits: { hasFlowers: true, wetAreas: true, isVine: false, umbrellaFlowerHeads: true, skinIrritation: true, shrubOrSmallTree: false, reedLikeStems: false, springWoodlandEdge: false, fluffySeedsOrPlumes: false },
    createdAt: NOW,
    updatedAt: NOW,
  },

  {
    id: "japanese-knotweed",
    slug: "japanese-knotweed",
    commonName: "Japanese Knotweed",
    scientificName: "Reynoutria japonica var. japonica",
    summary:
      "An extremely persistent perennial with bamboo-like hollow stems and creamy-white flower sprays in late summer. Its strong roots can damage pavement and foundations, and it is very hard to get rid of.",
    whyProhibited:
      "Japanese knotweed spreads through tough underground roots (rhizomes) and even small fragments can start new plants. It forms dense stands that crowd out other vegetation and can damage walls, driveways, and building foundations.",
    identificationFeatures: [
      "Hollow, bamboo-like stems with reddish-purple speckles, 1–3 m tall",
      "Broad, shovel- or heart-shaped leaves that zig-zag along the stem",
      "Sprays of small creamy-white flowers in late summer",
      "Forms dense thickets that die back to hollow brown canes in winter",
      "New spring shoots are reddish and asparagus-like",
    ],
    lookAlikes: [
      { name: "Bamboo", howToTell: "Real bamboo has woody, evergreen stems; knotweed stems are herbaceous and die back each winter, with broad zig-zag leaves." },
      { name: "Dogwood / lilac", howToTell: "These are woody shrubs with persistent branches; knotweed has hollow canes that collapse over winter." },
    ],
    commonLocations: ["backyard", "fence-line", "ravine-edge", "vacant-lot"],
    bestMonthsToIdentify: "August to September, when the creamy-white flower sprays appear on bamboo-like stems",
    identifySeasons: ["late-spring", "summer", "late-summer"],
    monthlyStages: [
      { period: "April–May (Early spring)", season: "early-spring", appearance: "Reddish, asparagus-like shoots push up quickly, sometimes through cracks in pavement.", keyFeature: "Red asparagus-like spring shoots.", height: "10–60 cm", icon: "sprout", tone: "rose" },
      { period: "May–June (Late spring)", season: "late-spring", appearance: "Hollow bamboo-like stems with speckles grow fast; broad leaves unfurl in a zig-zag pattern.", keyFeature: "Bamboo-like speckled stems; zig-zag leaves.", height: "1–2 m", icon: "reed", tone: "green" },
      { period: "July–August (Summer)", season: "summer", appearance: "Tall, dense, leafy thicket reaching full height.", keyFeature: "Dense thicket of bamboo-like canes.", height: "2–3 m", icon: "leaf", tone: "green" },
      { period: "August–September (Late summer)", season: "late-summer", appearance: "Sprays of small creamy-white flowers appear near the tops of the stems.", keyFeature: "Creamy-white flower sprays — easiest ID stage.", icon: "flower", tone: "slate" },
      { period: "Fall–winter (Dormant)", season: "winter", appearance: "Leaves drop and stems turn into hollow, brown, bamboo-like canes that persist over winter.", keyFeature: "Standing hollow brown canes; roots alive below.", icon: "dormant", tone: "amber" },
    ],
    removal: {
      method:
        "Japanese knotweed is one of the hardest plants to remove. For small new patches, repeatedly cut the canes through the season to weaken the roots, and dig out what you can — but be aware roots run deep and even fragments regrow. Established stands usually need a professional and a multi-year plan. Above all, never move soil or cut stems off-site, as fragments start new infestations.",
      tools: ["Gloves", "Pruning saw or loppers", "Bags for cut canes (do not chip or compost)"],
      bestTime: "Cut growing canes repeatedly through spring and summer; treat established stands over multiple years.",
      preventRegrowth: "Keep cutting regrowth to exhaust the roots; monitor for years and never disturb and spread the soil.",
      whatNotToDo: [
        "Do NOT compost, chip, or move knotweed material — tiny fragments start new plants",
        "Don't dig and relocate soil from the area; it may contain root fragments",
        "Don't assume a single removal works; it regrows persistently",
      ],
      disposal:
        "Bag cut canes and put them in the garbage (not the green bin or yard waste). Do not compost or chip. Keep all fragments contained.",
      monitoring: "Monitor the site for several years; even after the tops are gone, roots can resprout.",
    },
    safetyCautions: [
      "Wear gloves when cutting canes",
      "Be extremely careful not to spread root or stem fragments to new areas",
      "Do not put knotweed in compost, yard waste, or fill that will be reused",
    ],
    disposalGuidance: "Bag and garbage all material; never compost, chip, or relocate soil. Containing fragments is the most important step.",
    professionalHelpAdvice: "Strongly recommended for anything beyond a tiny new patch. Established knotweed near structures should be assessed by a professional.",
    hazardLevel: "High",
    hazardTags: ["invasive-spread", "chokes-natives"],
    keyVisualClue: "Bamboo-like speckled hollow stems; creamy flower sprays",
    seasonOfVisibility: "Spring shoots to fall canes",
    easiestToIdentify: "Late summer (in flower)",
    easiestToRemove: "Very hard — early/small patches only",
    images: [
      { stage: "Spring shoots", alt: "Reddish asparagus-like Japanese knotweed spring shoots", caption: "Red, asparagus-like shoots emerge in spring", icon: "sprout", tone: "rose", sourceName: "Ontario Invasive Plant Council", sourceUrl: OIPC_URL },
      { stage: "Bamboo-like stems", alt: "Speckled hollow bamboo-like knotweed stems with zig-zag leaves", caption: "Hollow speckled stems; broad zig-zag leaves", icon: "reed", tone: "green", sourceName: "Ontario Invasive Plant Council", sourceUrl: OIPC_URL },
      { stage: "Flowering", alt: "Creamy-white Japanese knotweed flower sprays", caption: "Sprays of small creamy-white flowers in late summer", icon: "flower", tone: "slate", sourceName: "Ontario Invasive Plant Council", sourceUrl: OIPC_URL },
      { stage: "Winter canes", alt: "Standing hollow brown Japanese knotweed canes in winter", caption: "Hollow brown bamboo-like canes persist over winter", icon: "dormant", tone: "amber", sourceName: "Ontario Invasive Plant Council", sourceUrl: OIPC_URL },
    ],
    officialSources: [CITY_SOURCE, CH489_SOURCE, OIPC_SOURCE],
    traits: { hasFlowers: true, wetAreas: false, isVine: false, umbrellaFlowerHeads: false, skinIrritation: false, shrubOrSmallTree: false, reedLikeStems: true, springWoodlandEdge: false, fluffySeedsOrPlumes: false },
    createdAt: NOW,
    updatedAt: NOW,
  },

  {
    id: "phragmites",
    slug: "phragmites",
    commonName: "Phragmites (European Common Reed)",
    scientificName: "Phragmites australis subsp. australis",
    summary:
      "A very tall invasive reed that forms dense stands in wet areas and ditches. It has feathery seed plumes and blue-green leaves, and can grow taller than a person, crowding out wetland plants.",
    whyProhibited:
      "Invasive phragmites forms thick, tall stands — a monoculture that crowds out native wetland plants and offers little habitat value for birds, fish, and other wildlife. It spreads by seeds and creeping roots, and can clog ditches and shorelines.",
    identificationFeatures: [
      "Very tall reed, often 2–5 m, growing in dense stands",
      "Feathery, fluffy seed plumes (tan to purplish) at the top in late summer",
      "Blue-green leaves during the growing season; tan, rigid stems",
      "Dense, monoculture stands in ditches, wet ground, and shorelines",
      "Stems stay standing through winter as a beige thicket",
    ],
    lookAlikes: [
      { name: "Native phragmites", howToTell: "The native reed grows in sparser stands, is shorter, with reddish stems and a less dense plume; the invasive type forms tall, dense, tan-stemmed thickets." },
      { name: "Cattails", howToTell: "Cattails have the familiar brown 'hot dog' seed head and flat strap leaves, not a feathery plume." },
    ],
    commonLocations: ["wetland-pond-edge", "ravine-edge", "vacant-lot"],
    bestMonthsToIdentify: "August to October, when the feathery plumes are full and the stands are tallest",
    identifySeasons: ["summer", "late-summer", "fall"],
    monthlyStages: [
      { period: "April–May (Early spring)", season: "early-spring", appearance: "New green shoots emerge from last year's roots among the standing dead stems.", keyFeature: "Green shoots rising among old beige canes.", height: "0.3–1 m", icon: "sprout", tone: "lime" },
      { period: "June–July (Summer)", season: "summer", appearance: "Stems shoot up quickly with blue-green leaves, thickening the stand.", keyFeature: "Fast, tall growth; blue-green leaves.", height: "1.5–3 m", icon: "reed", tone: "teal" },
      { period: "August–September (Late summer)", season: "late-summer", appearance: "Tall stems are topped with large feathery plumes.", keyFeature: "Feathery tan-to-purple plumes — easiest ID.", height: "2–5 m", icon: "flower", tone: "violet" },
      { period: "September–October (Fall)", season: "fall", appearance: "Plumes turn fluffy and pale as seeds mature and catch the wind.", keyFeature: "Fluffy pale seed plumes.", icon: "seed", tone: "slate" },
      { period: "Winter (Dormant)", season: "winter", appearance: "Leaves drop; rigid beige stems and faded plumes stand through winter.", keyFeature: "Dense standing beige thicket.", icon: "dormant", tone: "amber" },
    ],
    removal: {
      method:
        "For small patches on dry ground, cut the stems low and dig out the roots, repeating through the season to weaken the stand. Because phragmites usually grows in wet areas, removal there can be difficult and may require special care or permits — check before working near water.",
      tools: ["Gloves", "Loppers or a sturdy cutting tool", "Spade for roots (small/dry patches)"],
      bestTime: "Cut in mid-to-late summer and repeat; remove before plumes release seed.",
      preventRegrowth: "Keep cutting regrowth to drain the roots' energy; monitor and re-treat for several years.",
      whatNotToDo: [
        "Don't work in or near water without checking permit and protection rules first",
        "Don't let cut plumes spread seeds; bag them",
      ],
      disposal:
        "Bag plumes and seed heads for the garbage. Let cut stems dry out away from water; follow City rules for the rest of the material.",
      monitoring: "Re-check the stand each year; phragmites resprouts vigorously from roots.",
    },
    safetyCautions: [
      "Wear gloves and long sleeves; cut stems and leaf edges can be sharp",
      "Take care working near water or soft, wet ground",
    ],
    disposalGuidance: "Bag seed plumes for the garbage; dry out cut stems away from water. Avoid spreading seeds or root fragments.",
    professionalHelpAdvice: "Recommended for large stands or any phragmites growing in or near wetlands, ponds, or shorelines, where permits and special methods may apply.",
    hazardLevel: "Moderate",
    hazardTags: ["invasive-spread", "chokes-natives"],
    keyVisualClue: "Very tall reed with feathery plumes in dense stands",
    seasonOfVisibility: "Summer to winter (stands persist)",
    easiestToIdentify: "Late summer (plumes)",
    easiestToRemove: "Summer, small dry-ground patches",
    images: [
      { stage: "Spring shoots", alt: "Green phragmites shoots among old beige stems", caption: "Green shoots rise among last year's beige canes", icon: "sprout", tone: "lime", sourceName: "Ontario Invasive Plant Council", sourceUrl: OIPC_URL },
      { stage: "Summer stand", alt: "Tall blue-green phragmites stand", caption: "Tall, dense stand with blue-green leaves", icon: "reed", tone: "teal", sourceName: "Ontario Invasive Plant Council", sourceUrl: OIPC_URL },
      { stage: "Plume stage", alt: "Feathery tan-purple phragmites plumes", caption: "Feathery tan-to-purple plumes top the stems", icon: "flower", tone: "violet", sourceName: "Ontario Invasive Plant Council", sourceUrl: OIPC_URL },
      { stage: "Winter thicket", alt: "Standing beige phragmites thicket in winter", caption: "Rigid beige stems stand through winter", icon: "dormant", tone: "amber", sourceName: "Ontario Invasive Plant Council", sourceUrl: OIPC_URL },
    ],
    officialSources: [CITY_SOURCE, CH489_SOURCE, OIPC_SOURCE],
    traits: { hasFlowers: true, wetAreas: true, isVine: false, umbrellaFlowerHeads: false, skinIrritation: false, shrubOrSmallTree: false, reedLikeStems: true, springWoodlandEdge: false, fluffySeedsOrPlumes: true },
    createdAt: NOW,
    updatedAt: NOW,
  },

  {
    id: "poison-ivy",
    slug: "poison-ivy",
    commonName: "Poison Ivy",
    scientificName: "Toxicodendron radicans",
    summary:
      "A native but prohibited plant known for the saying 'leaves of three, let it be.' Its oil (urushiol) causes an itchy, blistering rash on contact. It grows as a low plant, a small shrub, or a climbing vine.",
    whyProhibited:
      "Poison ivy is a direct health risk: touching any part of the plant can cause an itchy, blistering allergic rash, and the oil lingers on tools, clothing, and pet fur. Because it grows where people walk and play, it must be controlled on private property.",
    identificationFeatures: [
      "Clusters of three leaflets — the middle one on a longer stalk ('leaves of three')",
      "Leaflet edges can be smooth, toothed, or slightly lobed; surface may be glossy",
      "Reddish new leaves in spring, green in summer, red-orange in fall",
      "Small clusters of greenish-white berries",
      "Grows as groundcover, a low shrub, or a hairy climbing vine on trees and fences",
    ],
    lookAlikes: [
      { name: "Virginia creeper", howToTell: "Virginia creeper usually has five leaflets (not three) and blue-black berries; it's not poison ivy." },
      { name: "Boxelder seedlings", howToTell: "Young boxelder also has leaflets in threes but they grow opposite each other on the stem, and it lacks the longer middle-leaflet stalk." },
      { name: "Fragrant sumac", howToTell: "Fragrant sumac has three leaflets too, but the middle leaflet has little or no stalk and the plant is aromatic." },
    ],
    commonLocations: ["fence-line", "ravine-edge", "vacant-lot"],
    bestMonthsToIdentify: "May to October, when the three-leaflet pattern is clearest — but never test by touching",
    identifySeasons: ["late-spring", "summer", "fall"],
    monthlyStages: [
      { period: "April–May (Early spring)", season: "early-spring", appearance: "New leaves emerge reddish and glossy, in the classic clusters of three.", keyFeature: "Reddish, glossy 'leaves of three'.", height: "10–40 cm", icon: "sprout", tone: "rose" },
      { period: "May–June (Late spring)", season: "late-spring", appearance: "Leaves turn green; plants spread as groundcover, low shrubs, or climbing vines.", keyFeature: "Green leaflets in threes; middle leaflet on a longer stalk.", icon: "leaf", tone: "green" },
      { period: "June–August (Summer)", season: "summer", appearance: "Full green foliage; small greenish-white flowers then berries form.", keyFeature: "Three-leaflet clusters; greenish-white berries.", icon: "berry", tone: "lime" },
      { period: "September–October (Fall)", season: "fall", appearance: "Leaves turn bright red and orange — colourful but still potent.", keyFeature: "Vivid red-orange fall leaves (still cause rash).", icon: "leaf", tone: "amber" },
      { period: "Winter (Dormant)", season: "winter", appearance: "Leaves drop; hairy climbing vines remain on trees and fences and can still cause a rash.", keyFeature: "Bare hairy vines — still hazardous to touch.", icon: "dormant", tone: "slate" },
    ],
    removal: {
      method:
        "Only attempt removal if you are not sensitive and can fully protect your skin. Wearing waterproof gloves, long sleeves, and long pants, dig or pull the plant out with the roots when the soil is moist, ideally in spring or early summer. Bag everything. Wash all skin, tools, and clothing afterward, since the oil stays active. If you react strongly to poison ivy, have someone else or a professional do it.",
      tools: ["Waterproof / chemical-resistant gloves", "Long sleeves and long pants", "Closed shoes", "Spade", "Bags", "Soap for washing afterward"],
      bestTime: "Spring to early summer, when plants are smaller and soil is moist.",
      preventRegrowth: "Remove roots fully and monitor; resprouts and new seedlings should be removed promptly with the same precautions.",
      whatNotToDo: [
        "NEVER burn poison ivy — the smoke carries the oil and can severely harm your lungs and eyes",
        "Don't touch it with bare skin, and don't let the oil sit on tools, gloves, or clothing",
        "Don't weed-whip it, which can spray oil and plant bits",
      ],
      disposal:
        "Double-bag the plant material and put it in the garbage — never compost or burn it. Keep the bagged material away from skin contact.",
      monitoring: "Watch for resprouts and new seedlings; the oil remains active on any leftover roots and stems.",
    },
    safetyCautions: [
      "All parts of the plant — leaves, stems, roots, and bare winter vines — can cause an itchy, blistering rash",
      "Wear waterproof gloves, long sleeves, and long pants; avoid all bare-skin contact",
      "Never burn poison ivy; the smoke is hazardous to breathe",
      "If exposed, wash skin with soap and cool water as soon as possible, and clean tools and clothing",
    ],
    disposalGuidance: "Double-bag and garbage all material; never burn or compost. The oil stays active, so clean everything that touched the plant.",
    professionalHelpAdvice: "Recommended if you are sensitive to poison ivy, or for large patches and climbing vines on trees and structures.",
    hazardLevel: "High",
    hazardTags: ["skin-irritation"],
    keyVisualClue: "'Leaves of three'; reddish spring growth; red-orange in fall",
    seasonOfVisibility: "Spring to fall (vines visible in winter)",
    easiestToIdentify: "Summer (clear three-leaflet pattern)",
    easiestToRemove: "Spring (smaller plants) — with full protection",
    images: [
      { stage: "Spring growth", alt: "Reddish glossy new poison ivy leaves in threes", caption: "Reddish, glossy new 'leaves of three'", icon: "sprout", tone: "rose", sourceName: "Government of Ontario / Public Health resources", sourceUrl: "https://www.ontario.ca/" },
      { stage: "Summer foliage", alt: "Green poison ivy leaflets in clusters of three", caption: "Green three-leaflet clusters; longer middle stalk", icon: "leaf", tone: "green", sourceName: "Government of Ontario / Public Health resources", sourceUrl: "https://www.ontario.ca/" },
      { stage: "Berries", alt: "Greenish-white poison ivy berries", caption: "Small clusters of greenish-white berries", icon: "berry", tone: "lime", sourceName: "Government of Ontario / Public Health resources", sourceUrl: "https://www.ontario.ca/" },
      { stage: "Fall colour", alt: "Bright red and orange poison ivy leaves in fall", caption: "Vivid red-orange fall leaves — still cause rash", icon: "leaf", tone: "amber", sourceName: "Government of Ontario / Public Health resources", sourceUrl: "https://www.ontario.ca/" },
    ],
    officialSources: [
      CITY_SOURCE,
      CH489_SOURCE,
      { label: "Government of Ontario", url: "https://www.ontario.ca/" },
    ],
    traits: { hasFlowers: false, wetAreas: false, isVine: true, umbrellaFlowerHeads: false, skinIrritation: true, shrubOrSmallTree: false, reedLikeStems: false, springWoodlandEdge: false, fluffySeedsOrPlumes: false },
    createdAt: NOW,
    updatedAt: NOW,
  },

  {
    id: "purple-loosestrife",
    slug: "purple-loosestrife",
    commonName: "Purple Loosestrife",
    scientificName: "Lythrum salicaria",
    summary:
      "A wetland invader with striking spikes of magenta-purple flowers in summer. It forms dense stands along ponds, ditches, and shorelines, crowding out native wetland plants.",
    whyProhibited:
      "Purple loosestrife takes over wet areas, replacing the native plants that wetland birds, fish, and insects depend on. A single plant can produce huge numbers of seeds, letting it spread rapidly along shorelines and ditches.",
    identificationFeatures: [
      "Tall spikes of bright magenta-purple flowers in mid-to-late summer",
      "Square or angled stems, often 1–2 m tall",
      "Narrow, lance-shaped leaves in opposite pairs or whorls",
      "Forms dense, showy purple stands in wet ground",
      "Woody base on older plants with many stems",
    ],
    lookAlikes: [
      { name: "Fireweed", howToTell: "Fireweed has rounder pinker flowers, round stems, and grows in dry, open or burned ground, not wetlands." },
      { name: "Blazing star (Liatris)", howToTell: "Blazing star is a garden plant with fluffier flower spikes and grass-like leaves, typically in dry beds." },
    ],
    commonLocations: ["wetland-pond-edge", "ravine-edge", "vacant-lot"],
    bestMonthsToIdentify: "July to September, when the bright purple flower spikes are in bloom",
    identifySeasons: ["summer", "late-summer"],
    monthlyStages: [
      { period: "April–May (Early spring)", season: "early-spring", appearance: "New shoots emerge from the woody root crown; lance-shaped leaves appear in pairs.", keyFeature: "Paired lance-shaped leaves on square stems.", height: "10–40 cm", icon: "sprout", tone: "lime" },
      { period: "May–June (Late spring)", season: "late-spring", appearance: "Stems grow tall and bushy in wet ground.", keyFeature: "Upright square stems thickening into clumps.", height: "0.5–1.2 m", icon: "leaf", tone: "green" },
      { period: "July–August (Summer)", season: "summer", appearance: "Tall spikes of vivid magenta-purple flowers open — very showy.", keyFeature: "Bright magenta-purple flower spikes — easiest ID.", height: "1–2 m", icon: "flower", tone: "violet" },
      { period: "August–September (Late summer)", season: "late-summer", appearance: "Flowers fade to small seed capsules that release vast numbers of tiny seeds.", keyFeature: "Spikes turn to seed capsules (huge seed output).", icon: "seed", tone: "rose" },
      { period: "Fall–winter (Dormant)", season: "fall", appearance: "Stems dry to reddish-brown stalks; the woody crown survives winter.", keyFeature: "Dry reddish-brown stalks; persistent root crown.", icon: "dormant", tone: "amber" },
    ],
    removal: {
      method:
        "For a few plants, dig out the whole root crown with a spade before they set seed — pulling alone often leaves roots behind. Cut off and bag the flower spikes first so the seeds can't scatter. In wet shoreline areas, take extra care and check whether permits apply near water.",
      tools: ["Gloves", "Spade or garden fork", "Bags for flower spikes and roots"],
      bestTime: "Early summer at flowering, before seeds form; remove root crowns when soil is workable.",
      preventRegrowth: "Remove the entire root crown and monitor for seedlings; replant wet areas with native plants.",
      whatNotToDo: [
        "Don't let it go to seed — one plant can release enormous numbers of seeds",
        "Don't leave cut spikes lying around; bag them",
      ],
      disposal:
        "Bag flower spikes and roots for the garbage so seeds aren't spread. Do not compost flowering or seeding material.",
      monitoring: "Check the area for several years, as the seed bank in the soil can keep producing new plants.",
    },
    safetyCautions: [
      "Low direct risk to people — basic gloves are enough",
      "Take care on soft, wet ground near ponds and shorelines",
      "Bag flower spikes to stop seeds from spreading",
    ],
    disposalGuidance: "Bag and garbage flower spikes and roots; never compost seeding material. Avoid spreading seeds near water.",
    professionalHelpAdvice: "Recommended for large stands or shoreline/wetland areas where permits and careful methods may be required near water.",
    hazardLevel: "Moderate",
    hazardTags: ["invasive-spread", "chokes-natives"],
    keyVisualClue: "Bright magenta-purple flower spikes in wet areas",
    seasonOfVisibility: "Summer to early fall",
    easiestToIdentify: "Summer (in bloom)",
    easiestToRemove: "Early summer (dig before seeding)",
    images: [
      { stage: "Spring shoots", alt: "New purple loosestrife shoots with lance-shaped leaves", caption: "Paired lance-shaped leaves on square stems", icon: "sprout", tone: "lime", sourceName: "Ontario Invasive Plant Council", sourceUrl: OIPC_URL },
      { stage: "Mature clump", alt: "Bushy purple loosestrife clump before flowering", caption: "Tall, bushy clumps in wet ground", icon: "leaf", tone: "green", sourceName: "Ontario Invasive Plant Council", sourceUrl: OIPC_URL },
      { stage: "Flowering", alt: "Bright magenta-purple purple loosestrife flower spikes", caption: "Vivid magenta-purple flower spikes", icon: "flower", tone: "violet", sourceName: "Ontario Invasive Plant Council", sourceUrl: OIPC_URL },
      { stage: "Seed stage", alt: "Purple loosestrife spikes turning to seed capsules", caption: "Spikes turn to seed capsules with many seeds", icon: "seed", tone: "rose", sourceName: "Ontario Invasive Plant Council", sourceUrl: OIPC_URL },
    ],
    officialSources: [CITY_SOURCE, CH489_SOURCE, OIPC_SOURCE],
    traits: { hasFlowers: true, wetAreas: true, isVine: false, umbrellaFlowerHeads: false, skinIrritation: false, shrubOrSmallTree: false, reedLikeStems: false, springWoodlandEdge: false, fluffySeedsOrPlumes: false },
    createdAt: NOW,
    updatedAt: NOW,
  },

  {
    id: "ragweed",
    slug: "ragweed",
    commonName: "Ragweed (Common)",
    scientificName: "Ambrosia artemisiifolia",
    summary:
      "An inconspicuous annual weed that is a leading cause of late-summer hay fever. Its fern-like leaves and small green flower spikes release large amounts of allergenic pollen from August into fall.",
    whyProhibited:
      "Ragweed pollen is a major cause of seasonal allergies (hay fever) for many people, triggering sneezing, itchy eyes, and breathing problems in late summer and fall. Keeping it cut and removed reduces the pollen in the air.",
    identificationFeatures: [
      "Fern-like, deeply divided green leaves",
      "Upright green flower spikes at the stem tips (no showy petals)",
      "Usually 30 cm to 1.5 m tall, bushy and branched",
      "Releases clouds of fine pollen from late summer into fall",
      "Grows in disturbed soil, gardens, roadsides, and vacant lots",
    ],
    lookAlikes: [
      { name: "Goldenrod", howToTell: "Goldenrod has showy yellow flowers and is often blamed for allergies, but it is NOT the main allergy culprit; ragweed's green flowers are the pollen source." },
      { name: "Mugwort", howToTell: "Mugwort has similar divided leaves but they are silvery-white underneath and the plant is aromatic." },
    ],
    commonLocations: ["backyard", "garden-bed", "vacant-lot", "fence-line"],
    bestMonthsToIdentify: "August to September, when the green flower spikes appear and pollen is released",
    identifySeasons: ["summer", "late-summer", "fall"],
    monthlyStages: [
      { period: "May–June (Late spring)", season: "late-spring", appearance: "Seedlings appear in disturbed soil with soft, fern-like divided leaves.", keyFeature: "Fern-like divided seedling leaves.", height: "5–20 cm", icon: "sprout", tone: "lime" },
      { period: "June–July (Summer)", season: "summer", appearance: "Bushy, branched green plants grow quickly.", keyFeature: "Branched, bushy plant with fern-like leaves.", height: "30–80 cm", icon: "leaf", tone: "green" },
      { period: "August–September (Late summer)", season: "late-summer", appearance: "Upright green flower spikes form at the tips and release fine pollen.", keyFeature: "Green flower spikes shedding allergenic pollen — peak season.", height: "0.5–1.5 m", icon: "flower", tone: "teal" },
      { period: "September–October (Fall)", season: "fall", appearance: "Flower spikes finish and small seeds form before the plant dies with frost.", keyFeature: "Seeds form; plant declines with first frost.", icon: "seed", tone: "amber" },
    ],
    removal: {
      method:
        "Ragweed is an easy plant for residents to manage: pull or hoe it out, including the roots, before it flowers in mid-to-late summer. Removing it before the flower spikes shed pollen is the single most effective step to cut down on hay-fever pollen.",
      tools: ["Gloves (and a dust mask if you have hay fever)", "Hoe or hand trowel"],
      bestTime: "Mid-summer, before the green flower spikes open and release pollen (before mid-August is ideal).",
      preventRegrowth: "Pull new seedlings each year and keep soil covered or planted, since seeds can persist in the soil.",
      whatNotToDo: [
        "Don't wait until it's flowering to remove it — you'll release pollen by disturbing it",
        "Don't let it go to seed; that builds up next year's plants",
      ],
      disposal:
        "Bag flowering or seeding plants for the garbage. Pre-flowering plants can usually go in yard waste per City rules.",
      monitoring: "Check disturbed areas through summer and again next year for new seedlings.",
    },
    safetyCautions: [
      "If you have hay fever, wear a dust mask and remove plants before they flower",
      "Basic gloves are enough — ragweed is not a skin hazard, but its pollen is an allergen",
    ],
    disposalGuidance: "Bag and garbage flowering/seeding plants; pre-flowering plants may go in yard waste per City rules. Remove before pollen release.",
    professionalHelpAdvice: "Rarely needs a professional; large vacant-lot infestations may need repeated cutting before flowering each year.",
    hazardLevel: "Moderate",
    hazardTags: ["allergy"],
    keyVisualClue: "Fern-like leaves; plain green flower spikes (no petals)",
    seasonOfVisibility: "Summer to fall",
    easiestToIdentify: "Late summer (flower spikes)",
    easiestToRemove: "Mid-summer (before flowering)",
    images: [
      { stage: "Seedling", alt: "Young ragweed seedling with fern-like leaves", caption: "Soft, fern-like divided seedling leaves", icon: "sprout", tone: "lime", sourceName: "Ontario Invasive Plant Council", sourceUrl: OIPC_URL },
      { stage: "Mature foliage", alt: "Bushy branched ragweed plant with divided leaves", caption: "Branched, bushy plant with fern-like leaves", icon: "leaf", tone: "green", sourceName: "Ontario Invasive Plant Council", sourceUrl: OIPC_URL },
      { stage: "Flowering", alt: "Upright green ragweed flower spikes shedding pollen", caption: "Green flower spikes release allergenic pollen", icon: "flower", tone: "teal", sourceName: "Ontario Invasive Plant Council", sourceUrl: OIPC_URL },
      { stage: "Seed stage", alt: "Ragweed seed heads in fall", caption: "Seeds form before the plant dies with frost", icon: "seed", tone: "amber", sourceName: "Ontario Invasive Plant Council", sourceUrl: OIPC_URL },
    ],
    officialSources: [CITY_SOURCE, CH489_SOURCE, OIPC_SOURCE],
    traits: { hasFlowers: true, wetAreas: false, isVine: false, umbrellaFlowerHeads: false, skinIrritation: false, shrubOrSmallTree: false, reedLikeStems: false, springWoodlandEdge: false, fluffySeedsOrPlumes: false },
    createdAt: NOW,
    updatedAt: NOW,
  },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

export function getPlantBySlug(slug: string): ProhibitedPlant | undefined {
  return prohibitedPlants.find((p) => p.slug === slug);
}

// ─── Identifier helper (rules-based, NOT AI) ─────────────────────────────────

export type TraitKey = keyof PlantTraits;
export type Answer = "yes" | "no" | "unsure";

export interface IdentifierQuestion {
  trait: TraitKey;
  question: string;
}

export const identifierQuestions: IdentifierQuestion[] = [
  { trait: "hasFlowers", question: "Does it have noticeable flowers?" },
  { trait: "wetAreas", question: "Does it grow in wet areas (ponds, ditches, shorelines)?" },
  { trait: "isVine", question: "Is it a vine that twines or climbs?" },
  { trait: "umbrellaFlowerHeads", question: "Does it have large umbrella-shaped flower heads?" },
  { trait: "skinIrritation", question: "Have you heard it can cause skin irritation or a rash?" },
  { trait: "shrubOrSmallTree", question: "Does it look like a shrub or small tree?" },
  { trait: "reedLikeStems", question: "Does it have tall reed-like or bamboo-like stems?" },
  { trait: "springWoodlandEdge", question: "Is it common in spring along woodland or garden edges?" },
  { trait: "fluffySeedsOrPlumes", question: "Does it produce fluffy seeds or feathery plumes?" },
];

export interface IdentifierMatch {
  plant: ProhibitedPlant;
  score: number;
  maxScore: number;
}

/**
 * Rules-based matcher. For each answered question, reward plants whose trait
 * matches the answer and mildly penalize mismatches. "Unsure" is ignored.
 * This is a reference helper only — not a scientific identification.
 */
export function matchPlants(answers: Partial<Record<TraitKey, Answer>>): IdentifierMatch[] {
  const answered = (Object.entries(answers) as [TraitKey, Answer][]).filter(
    ([, a]) => a === "yes" || a === "no"
  );
  if (answered.length === 0) return [];

  return prohibitedPlants
    .map((plant) => {
      let score = 0;
      for (const [trait, answer] of answered) {
        const has = plant.traits[trait];
        if (answer === "yes") score += has ? 2 : -1;
        else if (answer === "no") score += has ? -1 : 1;
      }
      return { plant, score, maxScore: answered.length * 2 };
    })
    .filter((m) => m.score > 0)
    .sort((a, b) => b.score - a.score);
}
