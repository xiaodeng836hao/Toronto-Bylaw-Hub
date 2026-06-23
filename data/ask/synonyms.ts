// ─────────────────────────────────────────────────────────────────────────────
//  Toronto Bylaw Guide — Ask resident-language synonym map (V6.7)
//
//  Maps the everyday words residents type ("leaking ceiling", "no heat", "paved
//  yard") to the canonical bylaw vocabulary the section index + classifier
//  understand. Used to EXPAND a query before classification/retrieval so the
//  right chapter/section is found. Isomorphic (no server-only imports); does NOT
//  add bylaw section numbers — only vocabulary.
// ─────────────────────────────────────────────────────────────────────────────

export interface SynonymRule {
  /** Lowercased resident phrases that trigger this rule (substring match). */
  triggers: string[];
  /** Canonical terms appended to the query when a trigger is present. */
  expand: string[];
}

export const askSynonyms: SynonymRule[] = [
  // ── Property Standards (Chapter 629) ──
  { triggers: ["leaking ceiling", "ceiling leak", "water stain", "water mark", "stained ceiling"], expand: ["walls and ceilings", "roof", "interior surface", "property standards"] },
  { triggers: ["hole in wall", "cracked wall", "peeling paint", "damaged ceiling", "graffiti inside"], expand: ["walls and ceilings", "interior surface", "property standards"] },
  { triggers: ["broken window", "cracked window", "window won't lock", "draft from window"], expand: ["exterior openings doors windows skylights", "property standards"] },
  { triggers: ["no heat", "not enough heat", "too cold", "heating not working", "furnace", "thermostat"], expand: ["heating", "vital services", "property standards"] },
  { triggers: ["broken outlet", "exposed wire", "no power", "light switch broken"], expand: ["electrical service and outlets", "property standards"] },
  { triggers: ["bathroom fan", "exhaust fan", "no ventilation", "condensation"], expand: ["ventilation", "property standards"] },
  { triggers: ["clogged toilet", "toilet won't flush", "leaking pipe", "no hot water", "sewage"], expand: ["plumbing water and sanitary facilities", "property standards"] },
  { triggers: ["broken cupboard", "kitchen cabinet", "broken sink", "stove not working"], expand: ["kitchen facilities", "property standards"] },
  { triggers: ["missing handrail", "loose railing", "unsafe stairs", "broken steps", "deck railing", "balcony railing"], expand: ["stairs guards handrails", "property standards"] },
  { triggers: ["damaged floor", "floor hole", "uneven floor", "cracked tile"], expand: ["floors stairs and landings", "property standards"] },
  { triggers: ["mould", "mold", "mildew"], expand: ["water damage", "ventilation", "walls and ceilings", "property standards"] },
  { triggers: ["pest", "mice", "rats", "cockroach", "bed bug", "infestation"], expand: ["pest control", "property standards"] },
  { triggers: ["junk in yard", "messy yard", "abandoned vehicle", "scrap", "debris in yard"], expand: ["maintenance of yards", "property standards"] },
  { triggers: ["leaking gutter", "downspout", "eavestrough", "roof leak", "missing shingles", "chimney"], expand: ["roofs and roof structures", "property standards"] },
  { triggers: ["damaged fence", "fence falling", "leaning fence", "broken fence"], expand: ["enclosures", "fence maintenance", "property standards"] },

  // ── Fence (Chapter 447) ──
  { triggers: ["backyard fence", "rear fence", "side fence", "fence height", "fence too tall", "how high fence"], expand: ["fence", "fence height"] },
  { triggers: ["pool gate", "pool fence", "pool enclosure", "swimming pool fence", "temporary pool"], expand: ["pool fence", "pool enclosure", "swimming pool"] },
  { triggers: ["barbed wire", "fence material", "corrugated metal", "sheet metal fence"], expand: ["fence", "prohibited fence material"] },

  // ── Zoning / Landscaping (By-law 569-2013) ──
  { triggers: ["paved yard", "interlock front yard", "concrete front yard", "no grass", "artificial turf"], expand: ["soft landscaping", "hard surface", "landscaping", "zoning"] },
  { triggers: ["parking pad", "front yard parking", "park on lawn", "park on grass", "driveway widened", "widen driveway", "paved front yard parking"], expand: ["front yard parking", "parking", "landscaping", "zoning"] },
  { triggers: ["side yard parking", "park beside house", "rear yard parking", "backyard parking", "park in backyard", "parking behind house"], expand: ["parking", "zoning"] },
  { triggers: ["commercial vehicle", "commercial parking", "work truck", "dump truck", "vehicle storage"], expand: ["commercial parking", "commercial vehicle", "parking", "zoning"] },
  { triggers: ["rv", "recreational vehicle", "trailer", "boat parking", "camper", "motorhome", "park an rv", "store a trailer"], expand: ["recreational vehicle parking", "parking", "zoning"] },
  { triggers: ["ac unit", "air conditioner", "heat pump", "hvac"], expand: ["air conditioner", "hvac", "zoning"] },
  { triggers: ["shed", "detached garage", "accessory structure", "pergola"], expand: ["accessory structure", "zoning"] },
  { triggers: ["setback", "how close to property line", "lot line"], expand: ["setback", "zoning"] },

  // ── Prohibited plants / weeds (Chapter 489) ──
  { triggers: ["giant weed", "dangerous plant", "giant hogweed", "hogweed"], expand: ["giant hogweed", "prohibited plants"] },
  { triggers: ["allergy weed", "ragweed"], expand: ["ragweed", "prohibited plants"] },
  { triggers: ["invasive vine", "dog strangling", "dog-strangling"], expand: ["dog-strangling vine", "prohibited plants"] },
  { triggers: ["bamboo", "knotweed"], expand: ["japanese knotweed", "prohibited plants"] },
  { triggers: ["long grass", "tall grass", "overgrown lawn", "weeds"], expand: ["turfgrass", "long grass", "weeds"] },

  // ── Waste / graffiti / dust ──
  { triggers: ["garbage bags outside", "bins overflowing", "garbage room", "dumpster"], expand: ["garbage storage", "waste collection"] },
  { triggers: ["mattress outside", "dumped furniture", "illegal dumping", "construction debris"], expand: ["littering and dumping", "waste"] },
  { triggers: ["graffiti", "spray paint", "tagging"], expand: ["graffiti"] },
  { triggers: ["dust", "construction dust", "dirt cloud"], expand: ["dust"] },
];

/** Append canonical vocabulary for any resident phrases present in the query. */
export function expandQuery(query: string): string {
  const q = query.toLowerCase();
  const extra: string[] = [];
  for (const rule of askSynonyms) {
    if (rule.triggers.some((t) => q.includes(t))) extra.push(...rule.expand);
  }
  return extra.length ? `${query} ${[...new Set(extra)].join(" ")}` : query;
}
