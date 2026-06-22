// ─────────────────────────────────────────────────────────────────────────────
//  Toronto Bylaw Guide — Prohibited-plant matcher (V6.1)
//
//  Compares Plant.id species suggestions against Toronto's 10 prohibited plants.
//  Plant.id identifies the SPECIES; BylawGuide decides (locally) whether that
//  species matches the Toronto prohibited list. We never ask Plant.id about
//  bylaws. Genus-only matches are deliberately low-confidence.
// ─────────────────────────────────────────────────────────────────────────────

import type { PlantIdSuggestion, ProhibitedPlantMatch, MatchConfidence } from "./types";

interface ProhibitedEntry {
  slug: string;
  commonName: string;
  /** Accepted scientific names + synonyms/aliases (lowercased at compare time). */
  scientificNames: string[];
  genera: string[];
  commonAliases: string[];
  safetyWarnings: string[];
  /** Extra caution appended to the explanation (e.g. subspecies). */
  note?: string;
}

const HOGWEED_WARN = "Do not touch suspected giant hogweed with bare skin. Sap exposure can cause serious skin reactions when exposed to sunlight. Consider professional help, especially for large or uncertain plants.";
const POISON_IVY_WARN = "Avoid direct skin contact. Wear protective clothing if handling. Do not burn poison ivy.";
const INVASIVE_SPREAD_WARN = "Improper removal may spread the plant. Avoid moving plant fragments or seeds, and check safe disposal guidance.";
const RAGWEED_WARN = "Ragweed pollen can trigger allergies. Wear protective equipment and avoid disturbing mature flowering plants if sensitive.";

const PROHIBITED: ProhibitedEntry[] = [
  { slug: "canada-thistle", commonName: "Canada Thistle", scientificNames: ["cirsium arvense"], genera: ["cirsium"], commonAliases: ["canada thistle", "creeping thistle", "field thistle"], safetyWarnings: [INVASIVE_SPREAD_WARN] },
  { slug: "buckthorn", commonName: "Buckthorn (Common & Glossy)", scientificNames: ["rhamnus cathartica", "frangula alnus", "rhamnus frangula"], genera: ["rhamnus", "frangula"], commonAliases: ["common buckthorn", "glossy buckthorn", "buckthorn"], safetyWarnings: [INVASIVE_SPREAD_WARN] },
  { slug: "dog-strangling-vine", commonName: "Dog-Strangling Vine", scientificNames: ["cynanchum rossicum", "cynanchum louiseae", "vincetoxicum rossicum", "vincetoxicum nigrum"], genera: ["cynanchum", "vincetoxicum"], commonAliases: ["dog-strangling vine", "dog strangling vine", "black swallowwort", "pale swallowwort", "swallowwort"], safetyWarnings: [INVASIVE_SPREAD_WARN] },
  { slug: "garlic-mustard", commonName: "Garlic Mustard", scientificNames: ["alliaria petiolata"], genera: ["alliaria"], commonAliases: ["garlic mustard", "jack-by-the-hedge"], safetyWarnings: [INVASIVE_SPREAD_WARN] },
  { slug: "giant-hogweed", commonName: "Giant Hogweed", scientificNames: ["heracleum mantegazzianum"], genera: ["heracleum"], commonAliases: ["giant hogweed", "hogweed", "cartwheel-flower"], safetyWarnings: [HOGWEED_WARN], note: "Giant hogweed has dangerous look-alikes (e.g. cow parsnip). Confirm carefully and keep your distance." },
  { slug: "japanese-knotweed", commonName: "Japanese Knotweed", scientificNames: ["reynoutria japonica", "fallopia japonica", "polygonum cuspidatum"], genera: ["reynoutria", "fallopia", "polygonum"], commonAliases: ["japanese knotweed", "knotweed", "asian knotweed"], safetyWarnings: [INVASIVE_SPREAD_WARN] },
  { slug: "phragmites", commonName: "Phragmites (European Common Reed)", scientificNames: ["phragmites australis subsp. australis", "phragmites australis"], genera: ["phragmites"], commonAliases: ["phragmites", "common reed", "european common reed"], safetyWarnings: [INVASIVE_SPREAD_WARN], note: "Native and invasive Phragmites subspecies look similar — distinguishing the subspecies may require expert confirmation." },
  { slug: "poison-ivy", commonName: "Poison Ivy", scientificNames: ["toxicodendron radicans", "rhus radicans"], genera: ["toxicodendron"], commonAliases: ["poison ivy", "eastern poison ivy"], safetyWarnings: [POISON_IVY_WARN] },
  { slug: "purple-loosestrife", commonName: "Purple Loosestrife", scientificNames: ["lythrum salicaria"], genera: ["lythrum"], commonAliases: ["purple loosestrife", "loosestrife", "spiked loosestrife"], safetyWarnings: [INVASIVE_SPREAD_WARN] },
  { slug: "ragweed", commonName: "Ragweed (Common)", scientificNames: ["ambrosia artemisiifolia"], genera: ["ambrosia"], commonAliases: ["common ragweed", "ragweed", "annual ragweed"], safetyWarnings: [RAGWEED_WARN] },
];

const norm = (s: string) => s.toLowerCase().replace(/\s+/g, " ").trim();
const genusOf = (sci: string) => norm(sci).split(" ")[0] ?? "";

function confidenceFor(matchedBy: ProhibitedPlantMatch["matchedBy"], probability: number): MatchConfidence {
  if (matchedBy === "genus") return "low";
  if (matchedBy === "scientific-name") {
    if (probability >= 0.7) return "high";
    if (probability >= 0.4) return "medium";
    return "low";
  }
  if (matchedBy === "synonym" || matchedBy === "manual-alias") {
    return probability >= 0.5 ? "medium" : "low";
  }
  // common-name
  return probability >= 0.6 ? "medium" : "low";
}

/** Evaluate one suggestion against one prohibited entry; null if no match. */
function evaluate(entry: ProhibitedEntry, s: PlantIdSuggestion): ProhibitedPlantMatch | null {
  const sci = norm(s.scientificName);
  const names = s.commonNames.map(norm);
  let matchedBy: ProhibitedPlantMatch["matchedBy"] | null = null;

  // The first accepted name is the "canonical" species; the rest are synonyms.
  if (entry.scientificNames.length && sci === entry.scientificNames[0]) matchedBy = "scientific-name";
  else if (entry.scientificNames.slice(1).some((n) => sci === n || sci.startsWith(n + " "))) matchedBy = "synonym";
  else if (entry.scientificNames[0] && sci.startsWith(entry.scientificNames[0] + " ")) matchedBy = "scientific-name";
  else if (names.some((n) => entry.commonAliases.includes(n))) matchedBy = "common-name";
  else if (entry.genera.includes(genusOf(s.scientificName))) matchedBy = "genus";

  if (!matchedBy) return null;

  const confidence = confidenceFor(matchedBy, s.probability);
  let explanation =
    matchedBy === "scientific-name" ? `Plant.id suggested ${s.scientificName}, which matches ${entry.commonName}.`
    : matchedBy === "synonym" ? `Plant.id suggested ${s.scientificName}, a synonym used for ${entry.commonName}.`
    : matchedBy === "common-name" ? `Plant.id's common name suggestion matches ${entry.commonName}.`
    : `Plant.id suggested the genus of ${entry.commonName} (${s.scientificName}). A genus-level match is uncertain — confirm the species.`;
  if (entry.note) explanation += ` ${entry.note}`;

  return {
    prohibitedPlantSlug: entry.slug,
    commonName: entry.commonName,
    scientificNames: entry.scientificNames,
    matchedBy,
    confidence,
    probability: s.probability,
    explanation,
    safetyWarnings: entry.safetyWarnings,
    internalPlantUrl: `/prohibited-plants/${entry.slug}`,
  };
}

const RANK: Record<MatchConfidence, number> = { high: 3, medium: 2, low: 1 };

/** Match all suggestions; return the best match per prohibited plant, sorted. */
export function matchProhibited(suggestions: PlantIdSuggestion[]): ProhibitedPlantMatch[] {
  const best = new Map<string, ProhibitedPlantMatch>();
  for (const s of suggestions) {
    for (const entry of PROHIBITED) {
      const m = evaluate(entry, s);
      if (!m) continue;
      const prev = best.get(entry.slug);
      if (!prev || RANK[m.confidence] > RANK[prev.confidence] || (RANK[m.confidence] === RANK[prev.confidence] && m.probability > prev.probability)) {
        best.set(entry.slug, m);
      }
    }
  }
  return [...best.values()].sort((a, b) => RANK[b.confidence] - RANK[a.confidence] || b.probability - a.probability);
}
