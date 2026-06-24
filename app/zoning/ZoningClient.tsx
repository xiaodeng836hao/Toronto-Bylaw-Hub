"use client";
import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  zoningTopics, type ZoningTopic, OFFICIAL_311_URL,
  ZONING_MAP_VIEWER_URL, OFFICIAL_ZONING_SOURCE_URL,
} from "@/lib/mock-data";
import {
  searchChapter10, type ChapterProvision, CHAPTER_10_SOURCE_URL,
} from "@/lib/zoning-chapter10";
import {
  Search, MapPin, ExternalLink, Building2, Info, FileText, BookOpen,
  ChevronDown, ChevronUp, HelpCircle, ClipboardList, Phone, Scale, Tag, Map, Landmark,
  ArrowRight, AlertTriangle, Leaf, BadgeCheck, Car,
} from "lucide-react";
import SourceBadge from "@/components/SourceBadge";
import RelatedQuestions from "@/components/RelatedQuestions";
import { getZoningTopicDetail } from "@/data/zoning/zoning-topic-details";

const quickSearches = [
  "parking", "setback", "deck", "detached garage",
  "air conditioner", "Permitted Use", "landscaping", "Permitted Encroachments",
];

const HOW_TO_STEPS = [
  { icon: Map, title: "Find your zone", desc: "Look up your property's zoning category in the Zoning Map Viewer." },
  { icon: Landmark, title: "Confirm the zone", desc: "Check if it's Residential (R), Residential Detached (RD), or another zone." },
  { icon: Search, title: "Search a topic", desc: "Try setback, parking, landscaping, HVAC, or accessory structure." },
  { icon: FileText, title: "Review provisions", desc: "Read the chapter and section references shown in the results." },
  { icon: BadgeCheck, title: "Verify officially", desc: "Confirm the final requirements with official City resources or City staff." },
];

const PREPARE_ITEMS = [
  "Property address",
  "Zoning category from the Zoning Map Viewer",
  "Survey or site plan, if available",
  "Lot dimensions (frontage and depth)",
  "Building location on the lot",
  "Proposed structure dimensions",
  "Distance to each lot line",
  "Driveway or parking layout",
  "Soft landscaping area",
  "Photos, if relevant",
  "Any official notice or permit documents, if applicable",
];

export default function ZoningClient() {
  const searchParams = useSearchParams();
  const initialTopic = searchParams.get("topic");
  const [query, setQuery] = useState(searchParams.get("q") ?? "");
  const [expandedId, setExpandedId] = useState<string | null>(initialTopic);

  // Deep-link: if arriving with ?topic=, expand and scroll to it.
  useEffect(() => {
    if (initialTopic) {
      setExpandedId(initialTopic);
      const el = document.getElementById(`topic-${initialTopic}`);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [initialTopic]);

  const term = query.trim();
  const provisionResults = useMemo(() => searchChapter10(term), [term]);
  const filteredTopics = useMemo(() => {
    const t = term.toLowerCase();
    if (!t) return zoningTopics;
    return zoningTopics.filter(
      (topic) =>
        topic.topic.toLowerCase().includes(t) ||
        topic.plainExplanation.toLowerCase().includes(t) ||
        topic.commonQuestion.toLowerCase().includes(t) ||
        topic.bylawConsideration.toLowerCase().includes(t) ||
        topic.keywords.some((k) => k.toLowerCase().includes(t))
    );
  }, [term]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-br from-emerald-50 to-emerald-100 text-emerald-700 ring-1 ring-inset ring-emerald-600/10 mb-4">
          <MapPin className="w-3.5 h-3.5" aria-hidden="true" />
          <span className="kicker">By-law 569-2013</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">Zoning Bylaw Guide</h1>
        <p className="text-gray-500 max-w-2xl">
          Simple answers to common Toronto zoning questions, plus a keyword search to help locate relevant provisions in Chapter 10 (Residential). Zoning is property-specific, so always confirm details with official City resources.
        </p>
        <SourceBadge className="mt-4" />
      </div>

      {/* About Zoning + official links */}
      <div className="bg-white rounded-2xl border border-gray-100 subtle-shadow p-6 mb-6">
        <div className="flex items-start gap-3">
          <Building2 className="w-6 h-6 text-emerald-500 flex-shrink-0 mt-0.5" aria-hidden="true" />
          <div>
            <h2 className="font-bold text-gray-900 mb-2">About Toronto Zoning By-law 569-2013</h2>
            <p className="text-sm text-gray-600 leading-relaxed mb-3">
              Toronto&apos;s city-wide Zoning By-law 569-2013 controls how land can be used, what can be built, and how structures are positioned. It covers residential, commercial, and mixed-use zones across the city.
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                href={OFFICIAL_ZONING_SOURCE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 text-sm font-medium rounded-lg hover:bg-emerald-100 transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
                Official Zoning By-law &amp; Preliminary Reviews
              </a>
              <a
                href={ZONING_MAP_VIEWER_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 text-gray-700 text-sm font-medium rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors"
              >
                <Map className="w-3.5 h-3.5" aria-hidden="true" />
                Open Zoning Map Viewer
              </a>
              <a
                href={CHAPTER_10_SOURCE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 text-gray-700 text-sm font-medium rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors"
              >
                <BookOpen className="w-3.5 h-3.5" aria-hidden="true" />
                Chapter 10 (Residential)
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Reliability notice */}
      <div className="mb-8 p-4 rounded-xl border border-blue-100 bg-blue-50/60 flex gap-3">
        <Info className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" aria-hidden="true" />
        <div className="text-sm text-blue-900 space-y-1.5">
          <p>
            This zoning search is a reference tool only. It helps locate possible sections in the City of Toronto Zoning By-law. It does not provide a legal zoning interpretation or property-specific determination.
          </p>
          <p>
            For accurate property-specific zoning information, use the official{" "}
            <a href={ZONING_MAP_VIEWER_URL} target="_blank" rel="noopener noreferrer" className="font-medium underline hover:text-blue-700">Zoning Map Viewer</a>{" "}
            or consult City of Toronto zoning resources.
          </p>
        </div>
      </div>

      {/* How to use this zoning guide — visual step flow */}
      <div className="bg-white rounded-2xl border border-gray-100 subtle-shadow p-6 mb-6">
        <h2 className="font-bold text-gray-900 mb-1 flex items-center gap-2">
          <ClipboardList className="w-5 h-5 text-emerald-500" aria-hidden="true" /> How to use this zoning guide
        </h2>
        <p className="text-sm text-gray-500 mb-5">Five quick steps — from your address to the right zoning provision.</p>

        <ol className="flex flex-col lg:flex-row lg:items-stretch gap-2.5 mb-5">
          {HOW_TO_STEPS.map((step, i) => {
            const Icon = step.icon;
            const last = i === HOW_TO_STEPS.length - 1;
            return (
              <li key={step.title} className="flex flex-1 flex-col lg:flex-row items-stretch gap-2.5">
                <div className="flex-1 rounded-xl bg-emerald-50/60 border border-emerald-100 p-4 flex flex-col gap-2.5">
                  <div className="flex items-center justify-between">
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                      <Icon className="w-5 h-5" aria-hidden="true" />
                    </span>
                    <span className="text-[11px] font-bold uppercase tracking-wide text-emerald-600/70">Step {i + 1}</span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{step.title}</p>
                    <p className="text-xs text-gray-600 leading-relaxed mt-1">{step.desc}</p>
                  </div>
                </div>
                {!last && (
                  <span aria-hidden="true" className="flex items-center justify-center text-emerald-300">
                    <ArrowRight className="hidden lg:block w-5 h-5" />
                    <ChevronDown className="lg:hidden w-4 h-4" />
                  </span>
                )}
              </li>
            );
          })}
        </ol>

        <div className="p-3.5 rounded-xl border border-amber-200 bg-amber-50 flex gap-2.5">
          <Info className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" aria-hidden="true" />
          <p className="text-xs text-amber-800">
            This guide cannot determine zoning compliance for a specific property. Zoning depends on exact property conditions, measurements, overlays, exceptions, and applicable chapters.
          </p>
        </div>
      </div>

      {/* Explore more zoning guides */}
      <section aria-labelledby="more-zoning" className="mb-8">
        <h2 id="more-zoning" className="font-bold text-gray-900 mb-3 flex items-center gap-2">
          <Map className="w-5 h-5 text-emerald-500" aria-hidden="true" /> Explore more zoning guides
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Link href="/landscaping" className="group bg-white rounded-2xl border border-gray-100 subtle-shadow p-4 flex items-start gap-3 hover:border-emerald-200 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500">
            <span className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center flex-shrink-0"><Leaf className="w-5 h-5 text-emerald-600" aria-hidden="true" /></span>
            <span className="min-w-0">
              <span className="block text-sm font-semibold text-gray-900 group-hover:text-emerald-700 transition-colors">Landscaping</span>
              <span className="block text-xs text-gray-500 leading-relaxed mt-0.5">Soft landscaping requirements for front, side, and rear yards.</span>
              <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600 mt-1.5">Open Landscaping Guide <ArrowRight className="w-3 h-3" aria-hidden="true" /></span>
            </span>
          </Link>
          <Link href="/zoning/former-north-york" className="group bg-white rounded-2xl border border-gray-100 subtle-shadow p-4 flex items-start gap-3 hover:border-emerald-200 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500">
            <span className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center flex-shrink-0"><Landmark className="w-5 h-5 text-emerald-600" aria-hidden="true" /></span>
            <span className="min-w-0">
              <span className="block text-sm font-semibold text-gray-900 group-hover:text-emerald-700 transition-colors">Former North York Zoning</span>
              <span className="block text-xs text-gray-500 leading-relaxed mt-0.5">Some properties may require review of former municipal zoning provisions. Browse an index and plain-language overview of Former North York zoning references.</span>
              <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600 mt-1.5">Open Former North York Zoning <ArrowRight className="w-3 h-3" aria-hidden="true" /></span>
            </span>
          </Link>
        </div>
      </section>

      {/* Search */}
      <div className="bg-white rounded-2xl border border-gray-100 subtle-shadow p-6 mb-8">
        <h2 className="font-semibold text-gray-900 mb-1">Find a Zoning Topic</h2>
        <p className="text-sm text-gray-500 mb-4">Search residential zoning provisions by keyword and read the verbatim by-law text. Covers the Chapter 10.5 general regulations plus the zone-specific limits in Chapter 10.10 (Residential Zone R) and Chapter 10.20 (Residential Detached Zone RD) — height, setbacks, lot frontage, building depth, lot coverage, and more.</p>
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" aria-hidden="true" />
          <label htmlFor="zoning-search" className="sr-only">Search zoning provisions</label>
          <input
            id="zoning-search"
            type="search"
            placeholder="e.g. front yard parking, building height, lot coverage, deck…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/20 focus-visible:border-emerald-400 transition-colors"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <span className="text-xs text-gray-400 self-center">Quick:</span>
          {quickSearches.map((qs) => (
            <button
              key={qs}
              onClick={() => setQuery(qs)}
              className="px-3 py-1 bg-gray-50 border border-gray-200 text-gray-600 text-xs rounded-full hover:bg-emerald-50 hover:border-emerald-200 hover:text-emerald-700 transition-colors"
            >
              {qs}
            </button>
          ))}
        </div>
      </div>

      {/* Chapter 10 provision results (only when searching) */}
      {term && (
        <section aria-labelledby="provision-heading" className="mb-10">
          <h2 id="provision-heading" className="text-xl font-bold text-gray-900 mb-1">
            Zoning By-law matches
          </h2>
          <p className="text-sm text-gray-500 mb-3" aria-live="polite">
            {provisionResults.length} provision{provisionResults.length !== 1 ? "s" : ""} in Chapter 10 for &ldquo;{term}&rdquo;
          </p>
          <p className="text-xs text-gray-400 mb-5">
            Zoning is property-specific. These are reference excerpts — confirm the exact rule for your lot with the official by-law and Zoning Map Viewer.
          </p>

          {provisionResults.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center">
              <Search className="w-10 h-10 text-gray-200 mx-auto mb-3" aria-hidden="true" />
              <p className="text-gray-500 font-medium mb-1">No matching Chapter 10 provisions</p>
              <p className="text-sm text-gray-400">Try a term like &ldquo;setback&rdquo;, &ldquo;height&rdquo;, &ldquo;lot coverage&rdquo;, or &ldquo;driveway&rdquo;.</p>
            </div>
          ) : (
            <ul className="grid grid-cols-1 gap-4">
              {provisionResults.map((p) => (
                <ProvisionCard key={p.id} provision={p} matched={term} />
              ))}
            </ul>
          )}
        </section>
      )}

      {/* Topics */}
      <h2 className="text-xl font-bold text-gray-900 mb-5">
        {term ? `Related zoning topics (${filteredTopics.length})` : "Common Zoning Topics"}
      </h2>

      {filteredTopics.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center">
          <p className="text-gray-500 font-medium mb-1">No matching topics</p>
          <p className="text-sm text-gray-400">Try a different keyword, or browse the provision results above.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {filteredTopics.map((topic) => (
            <ZoningTopicCard
              key={topic.id}
              topic={topic}
              isExpanded={expandedId === topic.id}
              onToggle={() => setExpandedId(expandedId === topic.id ? null : topic.id)}
              onSearch={setQuery}
            />
          ))}
        </div>
      )}

      {/* What information should I prepare? */}
      <section aria-label="What to prepare" className="mt-10 bg-white rounded-2xl border border-gray-100 subtle-shadow p-6">
        <h2 className="font-bold text-gray-900 mb-1 flex items-center gap-2">
          <ClipboardList className="w-5 h-5 text-emerald-500" aria-hidden="true" /> What information should I prepare before checking zoning?
        </h2>
        <p className="text-sm text-gray-500 mb-4">Having these ready makes it much easier to confirm requirements with the City or a professional.</p>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {PREPARE_ITEMS.map((item) => (
            <li key={item} className="flex items-start gap-2 text-sm text-gray-700">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 flex-shrink-0 mt-2" aria-hidden="true" /> {item}
            </li>
          ))}
        </ul>
      </section>

      {/* Related questions (Ask) */}
      <RelatedQuestions
        className="mt-10"
        questions={[
          "What are the zoning setbacks for my house?",
          "Can I park in my front yard?",
          "Where can I put my air conditioner or heat pump?",
          "Do I need a permit for a shed or detached garage?",
        ]}
      />

      {/* Property-specific disclaimer */}
      <div className="mt-6 p-5 rounded-xl border border-amber-200 bg-amber-50 flex gap-3">
        <Info className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" aria-hidden="true" />
        <p className="text-sm text-amber-800">
          Zoning rules are property-specific. This page summarizes selected zoning by-law provisions for general reference only. It is not a legal interpretation and does not confirm whether a property complies. Always verify using the official Zoning By-law, Zoning Map Viewer, Toronto Building, or City staff.
        </p>
      </div>
    </div>
  );
}

function ProvisionCard({ provision, matched }: { provision: ChapterProvision; matched: string }) {
  return (
    <li className="bg-white rounded-2xl border border-gray-100 subtle-shadow p-5 flex flex-col">
      <div className="flex flex-wrap items-center gap-2 mb-2">
        <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full border border-emerald-200 bg-emerald-50 text-emerald-700">
          <Landmark className="w-3 h-3" aria-hidden="true" /> {provision.appliesTo}
        </span>
        <span className="text-xs font-medium text-gray-500">{provision.chapter}</span>
        <span className="font-mono text-xs bg-gray-100 text-gray-700 px-1.5 py-0.5 rounded">{provision.section}</span>
      </div>

      <h3 className="font-semibold text-gray-900 mb-1.5">{provision.title}</h3>
      <p className="text-sm text-gray-600 leading-relaxed mb-3">{provision.plainExplanation}</p>

      {/* Verbatim by-law text */}
      <div className="mb-3">
        <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide mb-1.5 flex items-center gap-1.5">
          <FileText className="w-3 h-3" aria-hidden="true" /> By-law text (verbatim — By-law 569-2013)
        </p>
        <pre className="text-xs text-gray-700 leading-relaxed whitespace-pre-wrap font-sans bg-gray-50 border border-gray-100 rounded-lg p-3 max-h-72 overflow-y-auto">{provision.bylawText}</pre>
      </div>

      {/* Simple interpretation */}
      <div className="p-3 rounded-lg bg-emerald-50/60 border border-emerald-100 mb-3">
        <p className="text-[11px] font-semibold text-emerald-700 uppercase tracking-wide mb-1">Summarized provision (simple terms)</p>
        <p className="text-sm text-gray-700 leading-relaxed">{provision.provisionSummary}</p>
      </div>

      <div className="mt-auto flex items-center justify-between gap-2 pt-1">
        <span className="inline-flex items-center gap-1 text-xs text-gray-400 min-w-0">
          <Tag className="w-3 h-3 flex-shrink-0" aria-hidden="true" />
          <span className="truncate">Matched: {matched}</span>
        </span>
        <a
          href={provision.sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 text-white text-xs font-medium rounded-lg hover:bg-emerald-700 transition-colors"
        >
          <FileText className="w-3.5 h-3.5" aria-hidden="true" />
          View Official Chapter 10 Source
        </a>
      </div>
    </li>
  );
}

function ZoningTopicCard({
  topic,
  isExpanded,
  onToggle,
  onSearch,
}: {
  topic: ZoningTopic;
  isExpanded: boolean;
  onToggle: () => void;
  onSearch: (q: string) => void;
}) {
  const detail = getZoningTopicDetail(topic.id);
  // Parking has a dedicated guide — the expanded card is condensed to a pointer.
  const isParkingPointer = topic.id === "front-yard-parking";
  return (
    <div id={`topic-${topic.id}`} className={`bg-white rounded-2xl border transition-all scroll-mt-24 ${isExpanded ? "border-emerald-200 subtle-shadow" : "border-gray-100 hover:border-gray-200"}`}>
      <button
        onClick={onToggle}
        aria-expanded={isExpanded}
        className="w-full text-left p-5 flex items-start gap-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-inset rounded-2xl"
      >
        <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center flex-shrink-0">
          <MapPin className="w-5 h-5 text-emerald-600" aria-hidden="true" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900">{topic.topic}</h3>
          <p className="text-sm text-gray-500 mt-0.5 line-clamp-2">{topic.plainExplanation}</p>
        </div>
        {isExpanded ? <ChevronUp className="w-5 h-5 text-gray-400 flex-shrink-0" aria-hidden="true" /> : <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" aria-hidden="true" />}
      </button>

      {isExpanded && (
        <div className="px-5 pb-5 border-t border-gray-50 pt-5 flex flex-col gap-5">
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">What It Means</p>
            <p className="text-sm text-gray-700 leading-relaxed">{topic.plainExplanation}</p>
          </div>

          {isParkingPointer && detail && (
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Why this matters</p>
              <p className="text-sm text-gray-700 leading-relaxed">{detail.whyItMatters}</p>
            </div>
          )}

          {topic.id === "landscaping" && (
            <div className="rounded-xl border-2 border-emerald-200 bg-gradient-to-br from-emerald-50 to-white p-4 flex flex-col sm:flex-row sm:items-center gap-3">
              <div className="flex items-start gap-3 flex-1">
                <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Leaf className="w-5 h-5 text-emerald-600" aria-hidden="true" />
                </div>
                <p className="text-sm text-emerald-900 leading-relaxed">
                  Soft landscaping requirements can apply to front yards, side yards, and rear yards depending on the
                  residential zone and property conditions. Open the dedicated Landscaping Guide for more detail.
                </p>
              </div>
              <Link
                href="/landscaping"
                className="flex-shrink-0 inline-flex items-center gap-1.5 px-4 py-2.5 bg-emerald-600 text-white text-sm font-medium rounded-lg hover:bg-emerald-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
              >
                <Leaf className="w-3.5 h-3.5" aria-hidden="true" /> Open Landscaping Guide
              </Link>
            </div>
          )}

          {topic.id === "front-yard-parking" && (
            <div className="rounded-xl border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-white p-4 flex flex-col sm:flex-row sm:items-center gap-3">
              <div className="flex items-start gap-3 flex-1">
                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Car className="w-5 h-5 text-blue-600" aria-hidden="true" />
                </div>
                <p className="text-sm text-blue-900 leading-relaxed">
                  Front, side, rear, commercial, and recreational vehicle parking — with source-based by-law references.
                </p>
              </div>
              <Link
                href="/zoning/parking"
                className="flex-shrink-0 inline-flex items-center gap-1.5 px-4 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
              >
                <Car className="w-3.5 h-3.5" aria-hidden="true" /> Open Parking Guide
              </Link>
            </div>
          )}

          {!isParkingPointer && (
          <>
          {detail ? (
            <>
              {/* Applicable zones */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Applies to</span>
                {detail.applicableZones.map((z) => (
                  <span key={z} className="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full border border-emerald-200 bg-emerald-50 text-emerald-700">
                    <Landmark className="w-3 h-3" aria-hidden="true" /> {z}
                  </span>
                ))}
              </div>

              {/* Why it matters */}
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Why this matters</p>
                <p className="text-sm text-gray-700 leading-relaxed">{detail.whyItMatters}</p>
              </div>

              {/* Relevant provisions */}
              <div>
                <p className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                  <FileText className="w-3.5 h-3.5 text-emerald-500" aria-hidden="true" /> Relevant provisions
                </p>
                <div className="flex flex-col gap-2.5">
                  {detail.relevantSections.map((s) => (
                    <div key={s.section + s.title} className="rounded-xl border border-gray-100 bg-gray-50/60 p-3">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className="text-xs font-medium text-gray-500">{s.chapter}</span>
                        <span className="font-mono text-[11px] bg-white border border-gray-200 text-gray-700 px-1.5 py-0.5 rounded">{s.section}</span>
                        <span className="text-xs font-semibold text-gray-800">{s.title}</span>
                      </div>
                      <p className="text-sm text-gray-600 leading-relaxed">{s.plainRule}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Common questions with answers */}
              <div>
                <p className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                  <HelpCircle className="w-3.5 h-3.5 text-violet-500" aria-hidden="true" /> Common questions
                </p>
                <div className="flex flex-col gap-3">
                  {detail.questions.map((q) => (
                    <div key={q.question} className="rounded-xl border border-gray-100 p-3.5">
                      <p className="text-sm font-semibold text-gray-900 mb-1">{q.question}</p>
                      <p className="text-sm text-gray-600 leading-relaxed">{q.answer}</p>
                      {q.nextStep && (
                        <p className="mt-1.5 inline-flex items-start gap-1 text-xs text-emerald-700">
                          <ArrowRight className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" aria-hidden="true" /> {q.nextStep}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Examples */}
              {detail.examples.length > 0 && (
                <div>
                  <p className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-500" aria-hidden="true" /> Situations that may need review
                  </p>
                  <ul className="flex flex-col gap-2">
                    {detail.examples.map((ex) => (
                      <li key={ex} className="flex items-start gap-2 text-sm text-amber-900 bg-amber-50/70 border border-amber-100 rounded-lg p-2.5">
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-500 flex-shrink-0 mt-0.5" aria-hidden="true" /> {ex}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <p className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                  <HelpCircle className="w-3.5 h-3.5 text-violet-500" aria-hidden="true" /> Common Resident Question
                </p>
                <p className="text-sm text-gray-600 italic">&ldquo;{topic.commonQuestion}&rdquo;</p>
              </div>
              <div>
                <p className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                  <Scale className="w-3.5 h-3.5 text-blue-500" aria-hidden="true" /> Possible Bylaw Consideration
                </p>
                <p className="text-sm text-blue-700 font-medium">{topic.bylawConsideration}</p>
              </div>
            </div>
          )}

          <div>
            <p className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
              <ClipboardList className="w-3.5 h-3.5 text-emerald-500" aria-hidden="true" /> What Information to Prepare
            </p>
            <ul className="flex flex-col gap-1.5">
              {topic.whatToPrepare.map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-gray-600">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 flex-shrink-0 mt-1.5" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Suggested search keywords */}
          <div>
            <p className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
              <Tag className="w-3.5 h-3.5 text-gray-400" aria-hidden="true" /> Suggested Search Keywords
            </p>
            <div className="flex flex-wrap gap-2">
              {topic.keywords.map((kw) => (
                <button
                  key={kw}
                  type="button"
                  onClick={() => { onSearch(kw); if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" }); }}
                  className="px-2.5 py-1 bg-gray-50 border border-gray-200 text-gray-600 text-xs rounded-full hover:bg-emerald-50 hover:border-emerald-200 hover:text-emerald-700 transition-colors"
                >
                  {kw}
                </button>
              ))}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-100">
            <p className="text-xs font-semibold text-emerald-700 uppercase tracking-wide mb-1">When to Use Official City Resources</p>
            <p className="text-sm text-emerald-900">{topic.whenOfficial}</p>
          </div>

          <div className="flex flex-wrap gap-2 pt-1">
            <a
              href={topic.officialUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-emerald-600 text-white text-sm font-medium rounded-lg hover:bg-emerald-700 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
              Official Zoning By-law &amp; Preliminary Reviews
            </a>
            <a
              href={ZONING_MAP_VIEWER_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-white border border-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Map className="w-3.5 h-3.5" aria-hidden="true" />
              Open Zoning Map Viewer
            </a>
            {topic.show311 && (
              <a
                href={OFFICIAL_311_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-2 bg-white border border-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Phone className="w-3.5 h-3.5" aria-hidden="true" />
                Report through 311
              </a>
            )}
          </div>
          </>
          )}
        </div>
      )}
    </div>
  );
}
