"use client";
import { useState, useMemo } from "react";
import Link from "next/link";
import {
  prohibitedPlants, HAZARD_TAGS, LOCATION_TYPES, SEASONS,
  identifierQuestions, matchPlants,
  PROHIBITED_PLANTS_OFFICIAL_URL, CHAPTER_489_PDF_URL,
  type Season, type HazardTag, type LocationType, type TraitKey, type Answer,
} from "@/lib/prohibited-plants";
import { OFFICIAL_311_URL } from "@/lib/mock-data";
import { getPlantImages, IMAGE_USAGE_NOTICE } from "@/lib/plant-images";
import { PlantImagePanel, PlantCoverImage, HAZARD_LEVEL_CLASSES, HAZARD_TAG_CLASSES } from "@/components/plant-visuals";
import {
  Leaf, Search, Filter, Info, AlertTriangle, ShieldAlert, ChevronDown, ChevronUp,
  ArrowRight, Phone, ExternalLink, Calendar, MapPin, X, HelpCircle, Wand2, RotateCcw, FileText,
} from "lucide-react";

const hazardTagLabel = (t: HazardTag) => HAZARD_TAGS.find((h) => h.value === t)?.label ?? t;

function representativeImage(slug: string) {
  const plant = prohibitedPlants.find((p) => p.slug === slug)!;
  return plant.images.find((i) => i.icon === "flower") ?? plant.images.find((i) => i.icon === "leaf") ?? plant.images[0];
}

export default function ProhibitedPlantsClient() {
  const [query, setQuery] = useState("");
  const [season, setSeason] = useState<Season | "all">("all");
  const [hazard, setHazard] = useState<HazardTag | "all">("all");
  const [location, setLocation] = useState<LocationType | "all">("all");

  const [wizardOpen, setWizardOpen] = useState(false);
  const [answers, setAnswers] = useState<Partial<Record<TraitKey, Answer>>>({});

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return prohibitedPlants.filter((p) => {
      if (q && !`${p.commonName} ${p.scientificName} ${p.keyVisualClue} ${p.summary}`.toLowerCase().includes(q)) return false;
      if (season !== "all" && !p.identifySeasons.includes(season)) return false;
      if (hazard !== "all" && !p.hazardTags.includes(hazard)) return false;
      if (location !== "all" && !p.commonLocations.includes(location)) return false;
      return true;
    });
  }, [query, season, hazard, location]);

  const matches = useMemo(() => matchPlants(answers), [answers]);
  const answeredCount = Object.values(answers).filter((a) => a === "yes" || a === "no").length;
  const activeFilters = (season !== "all" ? 1 : 0) + (hazard !== "all" ? 1 : 0) + (location !== "all" ? 1 : 0) + (query.trim() ? 1 : 0);

  function setAnswer(trait: TraitKey, value: Answer) {
    setAnswers((prev) => ({ ...prev, [trait]: prev[trait] === value ? undefined : value }));
  }
  function clearFilters() {
    setQuery(""); setSeason("all"); setHazard("all"); setLocation("all");
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-50 text-green-700 text-xs font-medium mb-4">
          <Leaf className="w-3.5 h-3.5" aria-hidden="true" />
          Chapter 489 · Turfgrass &amp; Prohibited Plants
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">Prohibited Plants Identifier</h1>
        <p className="text-gray-500 max-w-2xl mb-5">
          Learn how to identify Toronto&apos;s prohibited plants and how to remove them safely. Compare their seasonal appearance, check hazard levels, and follow resident-friendly removal steps.
        </p>
        <div className="flex flex-wrap gap-3">
          <a
            href={PROHIBITED_PLANTS_OFFICIAL_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2"
          >
            <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
            Official City Page
          </a>
          <a
            href={CHAPTER_489_PDF_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-white border border-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
          >
            <FileText className="w-3.5 h-3.5" aria-hidden="true" />
            Chapter 489 (PDF)
          </a>
          <a
            href={OFFICIAL_311_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-white border border-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Phone className="w-3.5 h-3.5" aria-hidden="true" />
            Report through Toronto 311
          </a>
        </div>
      </div>

      {/* Top disclaimer */}
      <div className="mb-8 p-4 rounded-xl border border-amber-200 bg-amber-50 flex gap-3">
        <Info className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" aria-hidden="true" />
        <p className="text-sm text-amber-800">
          This page is for general educational and reference purposes only. Identification results are not a legal determination. Always confirm prohibited plant information using official City of Toronto resources, and seek professional advice for hazardous species or large infestations.
        </p>
      </div>

      {/* Identifier wizard */}
      <section aria-labelledby="identifier-heading" className="mb-10 bg-white rounded-2xl border border-green-100 subtle-shadow overflow-hidden">
        <button
          onClick={() => setWizardOpen((o) => !o)}
          aria-expanded={wizardOpen}
          className="w-full flex items-center gap-3 p-5 text-left hover:bg-green-50/40 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-inset"
        >
          <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center flex-shrink-0">
            <Wand2 className="w-5 h-5 text-green-600" aria-hidden="true" />
          </div>
          <div className="flex-1">
            <h2 id="identifier-heading" className="font-semibold text-gray-900">Quick Identifier Helper</h2>
            <p className="text-sm text-gray-500">Answer a few questions to see likely matches among the 10 prohibited plants.</p>
          </div>
          {wizardOpen ? <ChevronUp className="w-5 h-5 text-gray-400" aria-hidden="true" /> : <ChevronDown className="w-5 h-5 text-gray-400" aria-hidden="true" />}
        </button>

        {wizardOpen && (
          <div className="px-5 pb-5 border-t border-gray-50">
            <p className="text-xs text-gray-400 mt-4 mb-4 flex items-center gap-1.5">
              <HelpCircle className="w-3.5 h-3.5" aria-hidden="true" />
              Pick Yes / No / Not sure. This is a reference tool only — always confirm with official City guidance.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {identifierQuestions.map((q) => (
                <fieldset key={q.trait} className="flex items-center justify-between gap-3 p-3 rounded-xl border border-gray-100 bg-gray-50/50">
                  <legend className="sr-only">{q.question}</legend>
                  <span className="text-sm text-gray-700">{q.question}</span>
                  <div className="flex gap-1 flex-shrink-0" role="group" aria-label={q.question}>
                    {(["yes", "no", "unsure"] as Answer[]).map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => setAnswer(q.trait, opt)}
                        aria-pressed={answers[q.trait] === opt}
                        className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-colors capitalize ${
                          answers[q.trait] === opt
                            ? "bg-green-600 text-white border-green-600"
                            : "bg-white text-gray-500 border-gray-200 hover:border-green-300"
                        }`}
                      >
                        {opt === "unsure" ? "Not sure" : opt}
                      </button>
                    ))}
                  </div>
                </fieldset>
              ))}
            </div>

            <div className="mt-5 flex items-center justify-between gap-3">
              <p className="text-sm text-gray-500" aria-live="polite">
                {answeredCount === 0
                  ? "Answer some questions to see matches."
                  : `${matches.length} likely match${matches.length !== 1 ? "es" : ""} from ${answeredCount} answer${answeredCount !== 1 ? "s" : ""}.`}
              </p>
              {answeredCount > 0 && (
                <button
                  onClick={() => setAnswers({})}
                  className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" /> Reset answers
                </button>
              )}
            </div>

            {answeredCount > 0 && matches.length > 0 && (
              <ul className="mt-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {matches.slice(0, 6).map((m) => (
                  <li key={m.plant.id}>
                    <Link
                      href={`/prohibited-plants/${m.plant.slug}`}
                      className="block h-full p-3 rounded-xl border border-gray-100 bg-white hover:border-green-200 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500"
                    >
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span className="font-medium text-sm text-gray-900">{m.plant.commonName}</span>
                        <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full border ${HAZARD_LEVEL_CLASSES[m.plant.hazardLevel]}`}>{m.plant.hazardLevel}</span>
                      </div>
                      <p className="text-xs text-gray-500 line-clamp-2">{m.plant.keyVisualClue}</p>
                      <span className="mt-2 inline-flex items-center gap-1 text-xs text-green-600 font-medium">View plant <ArrowRight className="w-3 h-3" aria-hidden="true" /></span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
            {answeredCount > 0 && matches.length === 0 && (
              <p className="mt-3 text-sm text-gray-500">No clear matches from those answers. Try adjusting your responses or browse all plants below.</p>
            )}
          </div>
        )}
      </section>

      {/* Quick Compare table */}
      <section aria-labelledby="compare-heading" className="mb-10">
        <h2 id="compare-heading" className="text-xl font-bold text-gray-900 mb-1">Quick Compare: Toronto Prohibited Plants</h2>
        <p className="text-sm text-gray-500 mb-4">A side-by-side reference for all 10 prohibited plants.</p>
        <div className="overflow-x-auto rounded-2xl border border-gray-100 subtle-shadow bg-white">
          <table className="w-full text-sm min-w-[820px]">
            <caption className="sr-only">Comparison of Toronto&apos;s prohibited plants by visual clue, season, hazard level, and timing.</caption>
            <thead>
              <tr className="bg-gray-50 text-left text-xs uppercase tracking-wide text-gray-500">
                <th scope="col" className="px-4 py-3 font-semibold">Plant</th>
                <th scope="col" className="px-4 py-3 font-semibold">Key visual clue</th>
                <th scope="col" className="px-4 py-3 font-semibold">Season visible</th>
                <th scope="col" className="px-4 py-3 font-semibold">Hazard</th>
                <th scope="col" className="px-4 py-3 font-semibold">Easiest to identify</th>
                <th scope="col" className="px-4 py-3 font-semibold">Easiest to remove</th>
                <th scope="col" className="px-4 py-3 font-semibold"><span className="sr-only">Details</span></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {prohibitedPlants.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50/60">
                  <th scope="row" className="px-4 py-3 text-left font-medium text-gray-900 align-top">
                    {p.commonName}
                    <span className="block text-xs font-normal italic text-gray-400">{p.scientificName}</span>
                  </th>
                  <td className="px-4 py-3 text-gray-600 align-top">{p.keyVisualClue}</td>
                  <td className="px-4 py-3 text-gray-600 align-top">{p.seasonOfVisibility}</td>
                  <td className="px-4 py-3 align-top">
                    <span className={`inline-block text-xs font-semibold px-2 py-0.5 rounded-full border ${HAZARD_LEVEL_CLASSES[p.hazardLevel]}`}>{p.hazardLevel}</span>
                  </td>
                  <td className="px-4 py-3 text-gray-600 align-top">{p.easiestToIdentify}</td>
                  <td className="px-4 py-3 text-gray-600 align-top">{p.easiestToRemove}</td>
                  <td className="px-4 py-3 align-top">
                    <Link href={`/prohibited-plants/${p.slug}`} className="inline-flex items-center gap-1 text-green-600 hover:text-green-700 font-medium whitespace-nowrap">
                      View <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Filters */}
      <section aria-labelledby="browse-heading">
        <h2 id="browse-heading" className="text-xl font-bold text-gray-900 mb-4">Browse Prohibited Plants</h2>
        <div className="bg-white rounded-2xl border border-gray-100 subtle-shadow p-5 mb-6">
          <div className="flex items-center gap-2 mb-4 text-sm font-medium text-gray-700">
            <Filter className="w-4 h-4 text-gray-400" aria-hidden="true" /> Filter &amp; search
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" aria-hidden="true" />
              <label htmlFor="plant-search" className="sr-only">Search plants by name</label>
              <input
                id="plant-search"
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by name…"
                className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500/20 focus-visible:border-green-400 transition-colors"
              />
            </div>

            <div>
              <label htmlFor="season-filter" className="sr-only">Filter by season</label>
              <select id="season-filter" value={season} onChange={(e) => setSeason(e.target.value as Season | "all")} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500/20 focus-visible:border-green-400">
                <option value="all">All seasons</option>
                {SEASONS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
              </select>
            </div>

            <div>
              <label htmlFor="hazard-filter" className="sr-only">Filter by hazard type</label>
              <select id="hazard-filter" value={hazard} onChange={(e) => setHazard(e.target.value as HazardTag | "all")} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500/20 focus-visible:border-green-400">
                <option value="all">All hazard types</option>
                {HAZARD_TAGS.map((h) => <option key={h.value} value={h.value}>{h.label}</option>)}
              </select>
            </div>

            <div>
              <label htmlFor="location-filter" className="sr-only">Filter by location type</label>
              <select id="location-filter" value={location} onChange={(e) => setLocation(e.target.value as LocationType | "all")} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500/20 focus-visible:border-green-400">
                <option value="all">All locations</option>
                {LOCATION_TYPES.map((l) => <option key={l.value} value={l.value}>{l.label}</option>)}
              </select>
            </div>
          </div>
          {activeFilters > 0 && (
            <div className="mt-3 flex items-center gap-3">
              <span className="text-xs text-gray-400">{filtered.length} of {prohibitedPlants.length} shown</span>
              <button onClick={clearFilters} className="inline-flex items-center gap-1 text-xs text-green-600 hover:text-green-700 font-medium">
                <X className="w-3.5 h-3.5" aria-hidden="true" /> Clear filters
              </button>
            </div>
          )}
        </div>

        {/* Cards grid */}
        {filtered.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
            <Search className="w-10 h-10 text-gray-200 mx-auto mb-3" aria-hidden="true" />
            <p className="text-gray-500 font-medium mb-1">No plants match those filters</p>
            <button onClick={clearFilters} className="text-sm text-green-600 hover:text-green-700 font-medium">Clear filters</button>
          </div>
        ) : (
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((p) => (
              <li key={p.id}>
                <Link
                  href={`/prohibited-plants/${p.slug}`}
                  className="group block h-full bg-white rounded-2xl border border-gray-100 subtle-shadow overflow-hidden hover:border-green-200 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2"
                >
                  {(() => {
                    const set = getPlantImages(p.slug);
                    return set ? (
                      <PlantCoverImage
                        src={set.main}
                        alt={set.mainAlt}
                        className="aspect-[4/3]"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 360px"
                      />
                    ) : (
                      <PlantImagePanel image={representativeImage(p.slug)} />
                    );
                  })()}
                  <div className="p-4">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h3 className="font-semibold text-gray-900 group-hover:text-green-700 transition-colors">{p.commonName}</h3>
                      <span className={`flex-shrink-0 text-[10px] font-semibold px-1.5 py-0.5 rounded-full border ${HAZARD_LEVEL_CLASSES[p.hazardLevel]}`}>{p.hazardLevel}</span>
                    </div>
                    <p className="text-xs italic text-gray-400 mb-2">{p.scientificName}</p>
                    <p className="text-sm text-gray-500 line-clamp-3 mb-3">{p.summary}</p>
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {p.hazardTags.map((t) => (
                        <span key={t} className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${HAZARD_TAG_CLASSES[t]}`}>{hazardTagLabel(t)}</span>
                      ))}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center gap-1 text-xs text-gray-400">
                        <Calendar className="w-3.5 h-3.5" aria-hidden="true" /> {p.easiestToIdentify}
                      </span>
                      <span className="inline-flex items-center gap-1 text-sm text-green-600 font-medium">View plant <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" aria-hidden="true" /></span>
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Report / 311 */}
      <section className="mt-12 rounded-2xl bg-green-600 p-6 sm:p-8 text-white">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
          <div className="w-12 h-12 bg-white/15 rounded-xl flex items-center justify-center flex-shrink-0">
            <ShieldAlert className="w-6 h-6 text-white" aria-hidden="true" />
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-bold mb-1">Need to report a prohibited plant?</h2>
            <p className="text-green-50 text-sm">
              If a prohibited plant is growing on a property, you can report it to the City through the official Toronto 311 service. For hazardous species like giant hogweed, keep your distance and let the City know.
            </p>
          </div>
          <a
            href={OFFICIAL_311_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-shrink-0 inline-flex items-center gap-2 px-5 py-2.5 bg-white text-green-700 text-sm font-semibold rounded-xl hover:bg-green-50 transition-colors"
          >
            <ExternalLink className="w-4 h-4" aria-hidden="true" />
            Report through Toronto 311
          </a>
        </div>
      </section>

      {/* Bottom disclaimers */}
      <div className="mt-10 space-y-3">
        <div className="p-4 rounded-xl border border-rose-200 bg-rose-50 flex gap-3">
          <AlertTriangle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" aria-hidden="true" />
          <p className="text-sm text-rose-800">
            <strong>Safety first.</strong> Some prohibited plants are hazardous. Giant hogweed sap can cause severe burns, and poison ivy causes a blistering rash — avoid direct contact and consider professional removal for hazardous species or large infestations.
          </p>
        </div>
        <p className="text-xs text-gray-400 leading-relaxed">
          Plant identification results are not a legal determination. Always confirm prohibited plant information using official City of Toronto resources. Species descriptions are provided for general education and may not reflect every variation in the field.
        </p>
        <p className="text-xs text-gray-400 leading-relaxed">{IMAGE_USAGE_NOTICE}</p>
      </div>
    </div>
  );
}
