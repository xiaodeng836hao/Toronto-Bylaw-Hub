// ─────────────────────────────────────────────────────────────────────────────
//  Toronto Bylaw Hub — Prohibited Plant photo assets (V3.3)
//
//  Real photographs for each prohibited plant, organized under
//  /public/images/prohibited-plants/<slug>/. Each plant has a `main` image and a
//  `gallery` of growth-stage photos with simple visual descriptions.
//
//  Sources: resident/educational weed-identification photo sets supplied for this
//  project (Ontario weed-ID / invasive species reference material). To add or
//  replace a photo, drop the file in the matching slug folder and update the entry.
//
//  If a plant or stage has no photo, omit the entry — the UI falls back gracefully
//  to an illustrated placeholder panel and never shows a broken image.
// ─────────────────────────────────────────────────────────────────────────────

export interface PlantPhoto {
  /** Image path under /public. */
  src: string;
  /** Growth/visual stage label, e.g. "Flowering". */
  stage: string;
  /** Season or timing hint, e.g. "Summer" or "Late June". */
  season?: string;
  /** Descriptive alt text for screen readers. */
  alt: string;
  /** Simple description of what to notice visually at this stage. */
  description: string;
}

export interface PlantImageSet {
  /** Primary image showing the typical overall appearance. */
  main: string;
  mainAlt: string;
  mainCaption: string;
  /** Growth-stage gallery. */
  gallery: PlantPhoto[];
}

const BASE = "/images/prohibited-plants";

export const plantImages: Record<string, PlantImageSet> = {
  "canada-thistle": {
    main: `${BASE}/canada-thistle/flowering.jpg`,
    mainAlt: "Clusters of small pinkish-purple Canada thistle flower heads",
    mainCaption: "Canada thistle in flower — small pinkish-purple flower heads on spiny stems.",
    gallery: [
      { src: `${BASE}/canada-thistle/seedling.jpg`, stage: "Seedling", season: "Spring", alt: "Canada thistle seedling with thick oval seed-leaves", description: "A young seedling with thick, oval seed-leaves (cotyledons) close to the ground." },
      { src: `${BASE}/canada-thistle/spring-shoot.jpg`, stage: "Spring shoot", season: "Late May", alt: "Leafy Canada thistle shoot emerging from a rhizome", description: "A leafy shoot emerging from the spreading underground root (rhizome) in late May." },
      { src: `${BASE}/canada-thistle/pre-flowering.jpg`, stage: "Pre-flowering", season: "Late June", alt: "Tall pre-flowering Canada thistle plant", description: "A tall, branched, spiny-leaved plant just before the flowers open." },
      { src: `${BASE}/canada-thistle/flowering.jpg`, stage: "Flowering", season: "Summer", alt: "Close-up of pinkish-purple Canada thistle flower heads", description: "Clusters of small pinkish-purple flower heads — the easiest stage to identify." },
      { src: `${BASE}/canada-thistle/seed.jpg`, stage: "Seed stage", season: "Late summer", alt: "Canada thistle seed head with white feathery fluff", description: "A mature seed head with the white feathery 'fluff' (pappus) that carries seeds on the wind." },
    ],
  },
  buckthorn: {
    main: `${BASE}/buckthorn/leaves.jpg`,
    mainAlt: "Common buckthorn branch with oval leaves and small green flowers",
    mainCaption: "Common buckthorn — oval leaves with curved veins; a shrub or small tree.",
    gallery: [
      { src: `${BASE}/buckthorn/shrub.jpg`, stage: "Mature shrub", season: "Summer–Fall", alt: "Dense buckthorn shrub forming a thicket", description: "A dense shrub or small tree that forms a thicket, leafing out early and staying green late into fall." },
      { src: `${BASE}/buckthorn/leaves.jpg`, stage: "Leaves & flowers", season: "Spring–Summer", alt: "Buckthorn leaves with curved veins and small green flowers", description: "Oval leaves with curved (arching) veins and small greenish flowers in the leaf joints." },
      { src: `${BASE}/buckthorn/berries.jpg`, stage: "Berry stage", season: "Late summer–Fall", alt: "Buckthorn twigs with green and black berries", description: "Clusters of berries ripening from green to black along the twigs — spread widely by birds." },
      { src: `${BASE}/buckthorn/bark.jpg`, stage: "Bark & twigs", season: "Year-round", alt: "Grey-brown buckthorn stem and twigs", description: "Grey-brown bark on a young stem; common buckthorn twigs often end in a short thorn." },
    ],
  },
  "dog-strangling-vine": {
    main: `${BASE}/dog-strangling-vine/flowering.jpg`,
    mainAlt: "Flowering dog-strangling vine plants forming a dense patch",
    mainCaption: "Dog-strangling vine — a twining vine that forms dense colonies.",
    gallery: [
      { src: `${BASE}/dog-strangling-vine/spring-shoot.jpg`, stage: "Spring growth", season: "Early June", alt: "New dog-strangling vine shoots from crown roots", description: "New vegetative shoots arising from the crown roots in early June, before twining." },
      { src: `${BASE}/dog-strangling-vine/foliage.jpg`, stage: "Climbing foliage", season: "Summer", alt: "Dog-strangling vine with paired opposite leaves", description: "A flowering plant showing the paired (opposite) leaves as the vine climbs and twines." },
      { src: `${BASE}/dog-strangling-vine/flowering.jpg`, stage: "Flowering", season: "Mid-June", alt: "Dog-strangling vine flowering along a trail", description: "Patches of flowering plants along a trail in mid-June — it forms dense colonies." },
      { src: `${BASE}/dog-strangling-vine/flower-closeup.jpg`, stage: "Flower close-up", season: "Summer", alt: "Star-shaped maroon dog-strangling vine flowers", description: "Small star-shaped maroon flowers with darker, lobed centres." },
      { src: `${BASE}/dog-strangling-vine/seed-pods.jpg`, stage: "Seed pods", season: "Late June", alt: "Dog-strangling vine flowers and slender seed pods", description: "Maroon flowers alongside slender bean-like pods that split to release fluffy seeds." },
    ],
  },
  "garlic-mustard": {
    main: `${BASE}/garlic-mustard/flowering.jpg`,
    mainAlt: "A cluster of flowering garlic mustard plants in a woodlot",
    mainCaption: "Garlic mustard in flower — tall stems with small white flowers; smells of garlic.",
    gallery: [
      { src: `${BASE}/garlic-mustard/seedling.jpg`, stage: "Spring seedling", season: "Spring", alt: "Young garlic mustard seedling", description: "A young seedling in spring, before the rosette fully forms." },
      { src: `${BASE}/garlic-mustard/rosette.jpg`, stage: "Rosette (1st year)", season: "Fall–Winter", alt: "Garlic mustard rosette with kidney-shaped leaves", description: "A low rosette of round, kidney-shaped, scalloped leaves — stays green through fall and winter." },
      { src: `${BASE}/garlic-mustard/flowering.jpg`, stage: "Flowering (2nd year)", season: "Spring–June", alt: "Flowering garlic mustard plants in a woodlot", description: "Second-year plants send up tall stems topped with small white flowers." },
      { src: `${BASE}/garlic-mustard/flowers-pods.jpg`, stage: "Flowers & seed pods", season: "Late spring", alt: "Garlic mustard white flowers with slender seed pods", description: "Small white 4-petalled flowers with long slender seed pods above triangular stem leaves." },
    ],
  },
  "giant-hogweed": {
    main: `${BASE}/giant-hogweed/flowering.jpg`,
    mainAlt: "Giant hogweed in flower, about 3.5 metres tall with a large white umbrella flower head",
    mainCaption: "Giant hogweed in flower (~3.5 m tall) — observe from a distance only; do not touch.",
    gallery: [
      { src: `${BASE}/giant-hogweed/seedling.jpg`, stage: "Seedling", season: "Spring", alt: "Giant hogweed seedling beside a mature stalk", description: "A newly emerged seedling beside a mature stalk — even young plants should not be touched." },
      { src: `${BASE}/giant-hogweed/rosette.jpg`, stage: "Rosette leaves", season: "Summer", alt: "Large giant hogweed rosette leaves", description: "Large rosette leaves from a plant that emerged in spring." },
      { src: `${BASE}/giant-hogweed/leaves.jpg`, stage: "Mature leaves", season: "Early June", alt: "Huge deeply divided giant hogweed leaves", description: "Huge, deeply divided leaves on elongated stems." },
      { src: `${BASE}/giant-hogweed/stem.jpg`, stage: "Stem detail", season: "Summer", alt: "Giant hogweed stem with purple speckles and white hairs", description: "The green stem with reddish-purple speckles and stiff, whisker-like hairs — a key warning sign." },
      { src: `${BASE}/giant-hogweed/flowering.jpg`, stage: "Flowering", season: "Late June", alt: "Giant hogweed flowering at about 3.5 metres tall", description: "A flowering plant about 3.5 m tall with a huge white umbrella flower head. View from a distance only." },
    ],
  },
  "japanese-knotweed": {
    main: `${BASE}/japanese-knotweed/stand.jpg`,
    mainAlt: "Tall dense stand of Japanese knotweed by water",
    mainCaption: "Japanese knotweed — tall, dense, bamboo-like growth, often near water.",
    gallery: [
      { src: `${BASE}/japanese-knotweed/stand.jpg`, stage: "Summer stand", season: "Summer", alt: "Tall leafy Japanese knotweed stand", description: "Tall, dense, leafy growth (often by water), reaching 2–3 m with arching bamboo-like stems." },
      { src: `${BASE}/japanese-knotweed/leaves.jpg`, stage: "Leaves & red stems", season: "Summer", alt: "Broad shovel-shaped knotweed leaves on reddish stems", description: "Broad, shovel/heart-shaped leaves on reddish stems, arranged in a zig-zag along the cane." },
      { src: `${BASE}/japanese-knotweed/flowering.jpg`, stage: "Flowering", season: "Late summer", alt: "Japanese knotweed in flower with a person for scale", description: "Sprays of small creamy-white flowers in late summer (person shown for scale)." },
      { src: `${BASE}/japanese-knotweed/thicket.jpg`, stage: "Dense thicket", season: "Summer", alt: "Dense Japanese knotweed thicket", description: "A dense monoculture thicket that crowds out other plants." },
    ],
  },
  phragmites: {
    main: `${BASE}/phragmites/tall-stand.jpg`,
    mainAlt: "Very tall dense stand of phragmites reeds with a person for scale",
    mainCaption: "Invasive phragmites — a very tall, dense stand of beige reeds.",
    gallery: [
      { src: `${BASE}/phragmites/tall-stand.jpg`, stage: "Tall stand", season: "Late summer–Winter", alt: "Tall dense phragmites stand with a person for scale", description: "A very tall, dense stand of reeds — often well over head height (person shown for scale)." },
      { src: `${BASE}/phragmites/plumes.jpg`, stage: "Feathery plumes", season: "Late summer", alt: "Feathery tan phragmites seed plumes", description: "Fluffy, feathery tan-to-purple seed plumes at the top of the stems." },
      { src: `${BASE}/phragmites/seed-heads.jpg`, stage: "Seed heads", season: "Fall", alt: "Close-up of phragmites seed heads", description: "Close-up of the dense seed heads as they mature and fade." },
    ],
  },
  "poison-ivy": {
    main: `${BASE}/poison-ivy/leaves.jpg`,
    mainAlt: "Poison ivy compound leaf with three leaflets",
    mainCaption: "Poison ivy — 'leaves of three': three leaflets, the middle one on a longer stalk.",
    gallery: [
      { src: `${BASE}/poison-ivy/spring-leaves.jpg`, stage: "Spring leaves", season: "Spring", alt: "Reddish glossy new poison ivy leaves in threes", description: "New compound leaves with three reddish, glossy leaflets — 'leaves of three.'" },
      { src: `${BASE}/poison-ivy/leaves.jpg`, stage: "Summer leaves", season: "Summer", alt: "Green poison ivy leaf with three leaflets and long middle stalk", description: "A compound leaf with three leaflets, the middle one on a longer stalk (petiole)." },
      { src: `${BASE}/poison-ivy/summer.jpg`, stage: "Summer growth", season: "August", alt: "Cluster of poison ivy plants along a woodlot edge", description: "A cluster of poison ivy plants growing along a woodlot edge." },
      { src: `${BASE}/poison-ivy/berries.jpg`, stage: "Berries", season: "Late summer–Fall", alt: "Round greenish-white poison ivy berries", description: "Round, greenish-white berry-like fruit clusters." },
    ],
  },
  "purple-loosestrife": {
    main: `${BASE}/purple-loosestrife/flowering.jpg`,
    mainAlt: "Tall spikes of magenta-purple purple loosestrife flowers",
    mainCaption: "Purple loosestrife — tall spikes of magenta-purple flowers on square stems.",
    gallery: [
      { src: `${BASE}/purple-loosestrife/flowering.jpg`, stage: "Flowering", season: "Mid–late summer", alt: "Vertical magenta-purple purple loosestrife flower spikes", description: "Tall spikes of bright magenta-purple flowers on square stems." },
      { src: `${BASE}/purple-loosestrife/cluster.jpg`, stage: "Flowering clump", season: "Summer", alt: "Clump of purple loosestrife flower spikes above wetland foliage", description: "A showy clump of purple flower spikes rising above wetland foliage." },
      { src: `${BASE}/purple-loosestrife/stand.jpg`, stage: "Wetland stand", season: "Summer", alt: "Wetland taken over by magenta purple loosestrife", description: "A wetland or field taken over by a sea of magenta loosestrife." },
    ],
  },
  ragweed: {
    main: `${BASE}/ragweed/foliage.jpg`,
    mainAlt: "Common ragweed plant with deeply divided fern-like leaves",
    mainCaption: "Common ragweed — soft, fern-like, deeply divided leaves; a major hay-fever pollen source.",
    gallery: [
      { src: `${BASE}/ragweed/seedlings.jpg`, stage: "Young plants", season: "Early summer", alt: "Young ragweed plants at 2 to 6 nodes", description: "Young ragweed plants ranging from 2 to 6 nodes (about 12 leaves)." },
      { src: `${BASE}/ragweed/foliage.jpg`, stage: "Mature foliage", season: "Summer", alt: "Ragweed plant with fern-like divided leaves", description: "A plant with soft, fern-like, deeply divided leaves." },
      { src: `${BASE}/ragweed/male-flowers.jpg`, stage: "Male flowers (pollen)", season: "Late summer", alt: "Upright green ragweed male flower spikes", description: "Upright green flower spikes like a row of upside-down bowls — these release the allergenic pollen." },
      { src: `${BASE}/ragweed/female-flower.jpg`, stage: "Female flowers (seed)", season: "Late summer–Fall", alt: "Ragweed female seed flowers in the leaf axils", description: "The small seed-producing female flowers tucked in the leaf axils." },
      { src: `${BASE}/ragweed/id-figure.jpg`, stage: "Identification guide", alt: "Labelled common ragweed identification figure", description: "A labelled identification figure showing ragweed's key features." },
    ],
  },
};

export function getPlantImages(slug: string): PlantImageSet | undefined {
  return plantImages[slug];
}

// ─── Image credits / attribution ─────────────────────────────────────────────
//
//  NOTE: these source labels are INFERRED from the supplied file names and the
//  style of the material (the ragweed figure is named "omafra-weed-id-…"). They
//  must be VERIFIED and corrected to the exact rights holder / licence before
//  relying on them — accurate attribution is what avoids disputes. Edit the map
//  below in one place to update a plant's credit.

export interface ImageCredit {
  /** Displayed source / credit line. */
  source: string;
  /** Optional link to the source. */
  url?: string;
}

/** Ontario weed-identification photo material (OMAFRA / Ontario CropIPM style). */
const WEED_ID: ImageCredit = {
  source: "Ontario weed-identification reference (OMAFRA / Ontario CropIPM)",
};

export const imageCredits: Record<string, ImageCredit> = {
  "canada-thistle": WEED_ID,
  "dog-strangling-vine": WEED_ID,
  "garlic-mustard": WEED_ID,
  "giant-hogweed": WEED_ID,
  "poison-ivy": WEED_ID,
  ragweed: WEED_ID,
  buckthorn: { source: "Common buckthorn identification fact sheet (educational reference)" },
  "japanese-knotweed": { source: "Japanese knotweed identification fact sheet (educational reference)" },
  phragmites: { source: "Invasive phragmites identification fact sheet (educational reference)" },
  "purple-loosestrife": { source: "Purple loosestrife identification fact sheet (educational reference)" },
};

export function getImageCredit(slug: string): ImageCredit | undefined {
  return imageCredits[slug];
}

/** Site-wide usage notice shown alongside the plant photographs. */
export const IMAGE_USAGE_NOTICE =
  "Plant photographs are reproduced for non-commercial public education and identification reference only. Sources include Ontario weed-identification (OMAFRA / Ontario CropIPM) and invasive-species fact-sheet materials; all image rights remain with their respective owners. If you are a rights holder with a concern, please contact us through the Feedback page.";
