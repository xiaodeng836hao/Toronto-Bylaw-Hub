"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Landmark, MapPin, Info, ExternalLink, FileText, Map,
  ArrowLeft, ClipboardList, BookOpen,
  HelpCircle, Tag, Compass, Building2, Sparkles, ListTree,
  Maximize2, ZoomIn, ZoomOut, X,
} from "lucide-react";
import SourceBadge from "@/components/SourceBadge";
import RelatedQuestions from "@/components/RelatedQuestions";
import {
  FNY_BYLAW, fnyIndex, fnyIndexGroups, fnyZones, fnyDefinitions,
  fnyHowToSteps,
  ZONING_MAP_VIEWER_URL, OFFICIAL_ZONING_SOURCE_URL, TORONTO_ARCHIVES_URL,
} from "@/data/zoning/former-north-york-topics";

const PAGE_SECTIONS = [
  { id: "overview", label: "Overview" },
  { id: "how-to", label: "How to use" },
  { id: "map", label: "Zoning map" },
  { id: "index", label: "Index" },
  { id: "zones", label: "Zone categories" },
  { id: "definitions", label: "Definitions" },
  { id: "sources", label: "Sources" },
];

export default function FormerNorthYorkClient() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Hero */}
      <div className="mb-8">
        <Link href="/zoning" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-emerald-700 transition-colors mb-5">
          <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" /> Back to Zoning Guide
        </Link>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-br from-emerald-50 to-emerald-100 text-emerald-700 ring-1 ring-inset ring-emerald-600/10 mb-4">
          <Landmark className="w-3.5 h-3.5" aria-hidden="true" />
          <span className="kicker">By-law 7625 · Township of North York</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">Former North York Zoning</h1>
        <p className="text-gray-500 max-w-2xl text-lg">
          Index and overview of former North York zoning references for properties where former municipal zoning provisions may still be relevant.
        </p>
        <SourceBadge className="mt-4" />
      </div>

      {/* On this page — sticky jump nav */}
      <nav aria-label="On this page" className="sticky top-16 z-30 mb-8">
        <div className="flex items-center gap-1.5 overflow-x-auto rounded-xl border border-gray-100 bg-white/85 px-1.5 py-1.5 backdrop-blur subtle-shadow">
          <span className="flex-shrink-0 self-center pl-2 pr-1 text-xs font-medium text-gray-400">On this page</span>
          {PAGE_SECTIONS.map((s) => (
            <a key={s.id} href={`#${s.id}`} className="flex-shrink-0 whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-medium text-gray-600 transition-colors hover:bg-emerald-50 hover:text-emerald-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500">
              {s.label}
            </a>
          ))}
        </div>
      </nav>

      {/* Disclaimer */}
      <div className="mb-8 p-5 rounded-xl border border-amber-200 bg-amber-50 flex gap-3">
        <Info className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" aria-hidden="true" />
        <p className="text-sm text-amber-800 leading-relaxed">
          Former municipal zoning rules can be complex and property-specific. This page is a plain-language reference index only.
          It does not confirm whether a property complies with zoning requirements. Always verify using official City of Toronto
          zoning resources, the Zoning Map Viewer, Toronto Building, or City staff.
        </p>
      </div>

      {/* Overview */}
      <section id="overview" aria-labelledby="overview-h" className="mb-10 scroll-mt-32">
        <div className="bg-white rounded-2xl border border-gray-100 subtle-shadow p-6">
          <h2 id="overview-h" className="font-bold text-gray-900 mb-2 flex items-center gap-2">
            <Building2 className="w-5 h-5 text-emerald-500" aria-hidden="true" /> About {FNY_BYLAW.title}
          </h2>
          <p className="text-sm text-gray-600 leading-relaxed mb-3">
            The Township of North York Zoning By-law No. {FNY_BYLAW.number} ({FNY_BYLAW.enacted}) is a historical municipal
            zoning by-law. Toronto&apos;s city-wide Zoning By-law 569-2013 now applies across the city, but former municipal
            provisions like this one may still be referenced for some properties or in legacy contexts. This page organizes the
            by-law&apos;s structure — its {FNY_BYLAW.sectionCount} sections, zone categories, and key definitions — into a
            browsable, plain-language index.
          </p>
          <div className="p-3 rounded-lg bg-gray-50 border border-gray-100">
            <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide mb-1 flex items-center gap-1.5">
              <FileText className="w-3 h-3" aria-hidden="true" /> Source
            </p>
            <p className="text-xs text-gray-600 leading-relaxed">{FNY_BYLAW.sourceNote}</p>
          </div>
        </div>
      </section>

      {/* How to use */}
      <section id="how-to" aria-labelledby="howto-h" className="mb-10 scroll-mt-32">
        <div className="bg-white rounded-2xl border border-gray-100 subtle-shadow p-6">
          <h2 id="howto-h" className="font-bold text-gray-900 mb-4 flex items-center gap-2">
            <ClipboardList className="w-5 h-5 text-emerald-500" aria-hidden="true" /> How to use this page
          </h2>
          <ol className="flex flex-col gap-3">
            {fnyHowToSteps.map((step, i) => (
              <li key={step} className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold flex items-center justify-center mt-0.5">{i + 1}</span>
                <p className="text-sm text-gray-700 leading-relaxed">{step}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Historical zoning map */}
      <section id="map" aria-labelledby="map-h" className="mb-10 scroll-mt-32">
        <h2 id="map-h" className="text-2xl font-bold text-gray-900 mb-1 flex items-center gap-2">
          <Map className="w-6 h-6 text-emerald-500" aria-hidden="true" /> Key Zoning Map — Schedule &ldquo;B&rdquo;
        </h2>
        <p className="text-gray-500 mb-4">
          The Schedule &ldquo;B&rdquo; Key Zoning Map accompanying By-law {FNY_BYLAW.number} (Township of North York). This is a
          historical reference image — zone boundaries and designations have changed over time. Click to enlarge.
        </p>
        <MapFigure />
      </section>

      {/* Index / TOC */}
      <section id="index" aria-labelledby="index-h" className="mb-10 scroll-mt-32">
        <h2 id="index-h" className="text-2xl font-bold text-gray-900 mb-1 flex items-center gap-2">
          <ListTree className="w-6 h-6 text-emerald-500" aria-hidden="true" /> Former North York Zoning index
        </h2>
        <p className="text-gray-500 mb-4">The {FNY_BYLAW.sectionCount}-section structure of By-law {FNY_BYLAW.number}, grouped by theme. Page numbers refer to the archival document.</p>
        <div className="flex flex-col gap-5">
          {fnyIndexGroups.map((group) => {
            const entries = fnyIndex.filter((e) => e.group === group);
            if (entries.length === 0) return null;
            return (
              <div key={group} className="bg-white rounded-2xl border border-gray-100 subtle-shadow p-5">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Tag className="w-4 h-4 text-emerald-500" aria-hidden="true" /> {group}
                </h3>
                <ul className="flex flex-col divide-y divide-gray-50">
                  {entries.map((e) => (
                    <li key={e.section} className="flex items-center gap-3 py-2">
                      <span className="font-mono text-[11px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded flex-shrink-0">§ {e.section}</span>
                      {e.symbol && <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded flex-shrink-0">{e.symbol}</span>}
                      <span className="text-sm text-gray-700 flex-1 min-w-0">{e.title}</span>
                      <span className="text-[11px] text-gray-400 flex-shrink-0">p. {e.page}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </section>

      {/* Zone categories */}
      <section id="zones" aria-labelledby="zones-h" className="mb-10 scroll-mt-32">
        <h2 id="zones-h" className="text-2xl font-bold text-gray-900 mb-1 flex items-center gap-2">
          <MapPin className="w-6 h-6 text-emerald-500" aria-hidden="true" /> Zone categories
        </h2>
        <p className="text-gray-500 mb-4">The zone codes used in By-law {FNY_BYLAW.number}. The specific zone for a property comes from the official zoning record.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {fnyZones.map((z) => (
            <div key={z.code} className="bg-white rounded-xl border border-gray-100 subtle-shadow p-3.5 flex items-center gap-3">
              <span className="font-mono text-xs font-bold text-emerald-700 bg-emerald-50 ring-1 ring-inset ring-emerald-200 rounded-lg px-2 py-1 flex-shrink-0 min-w-[3.5rem] text-center">{z.code}</span>
              <div className="min-w-0">
                <p className="text-sm text-gray-800 leading-snug">{z.name}</p>
                <p className="text-[11px] text-gray-400 mt-0.5">{z.category} · § {z.section}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Definitions */}
      <section id="definitions" aria-labelledby="def-h" className="mb-10 scroll-mt-32">
        <h2 id="def-h" className="text-2xl font-bold text-gray-900 mb-1 flex items-center gap-2">
          <BookOpen className="w-6 h-6 text-emerald-500" aria-hidden="true" /> Key definitions
        </h2>
        <p className="text-gray-500 mb-4">Selected definitions from Section 2 of the by-law, with their section numbers as they appear in the source.</p>
        <div className="bg-white rounded-2xl border border-gray-100 subtle-shadow divide-y divide-gray-50">
          {fnyDefinitions.map((d) => (
            <div key={d.section} className="p-4 flex flex-col sm:flex-row sm:items-baseline gap-1.5 sm:gap-3">
              <div className="flex items-center gap-2 sm:w-56 flex-shrink-0">
                <span className="font-mono text-[11px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">§ {d.section}</span>
                <span className="text-sm font-semibold text-gray-900">{d.term}</span>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">{d.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Sources + related */}
      <section id="sources" aria-labelledby="sources-h" className="mb-10 scroll-mt-32">
        <div className="bg-white rounded-2xl border border-gray-100 subtle-shadow p-6">
          <h2 id="sources-h" className="font-bold text-gray-900 mb-2 flex items-center gap-2">
            <Landmark className="w-5 h-5 text-emerald-500" aria-hidden="true" /> Official sources
          </h2>
          <p className="text-sm text-gray-600 mb-4">
            There is no single official URL for the historical By-law {FNY_BYLAW.number} text — it is held by the City of
            Toronto Archives. For current, property-specific zoning, use the City&apos;s official resources:
          </p>
          <div className="flex flex-wrap gap-3">
            <a href={ZONING_MAP_VIEWER_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 text-sm font-medium rounded-lg hover:bg-emerald-100 transition-colors">
              <Map className="w-3.5 h-3.5" aria-hidden="true" /> Zoning Map Viewer
            </a>
            <a href={OFFICIAL_ZONING_SOURCE_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 text-gray-700 text-sm font-medium rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors">
              <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" /> Official Zoning By-law &amp; Reviews
            </a>
            <a href={TORONTO_ARCHIVES_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 text-gray-700 text-sm font-medium rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors">
              <BookOpen className="w-3.5 h-3.5" aria-hidden="true" /> City of Toronto Archives
            </a>
          </div>
        </div>
      </section>

      {/* Ask integration / related questions */}
      <RelatedQuestions
        className="mb-10"
        questions={[
          "What is former North York zoning?",
          "What are the zoning setbacks for my house?",
          "What counts as soft landscaping?",
        ]}
      />

      {/* Related pages */}
      <section aria-label="Related pages" className="mb-10">
        <h2 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
          <Compass className="w-5 h-5 text-emerald-500" aria-hidden="true" /> Related pages
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {[
            { href: "/zoning", label: "Zoning Overview", desc: "Plain-language Toronto zoning topics and Chapter 10 search.", icon: MapPin },
            { href: "/landscaping", label: "Landscaping", desc: "Soft landscaping requirements for front, side, and rear yards.", icon: Building2 },
            { href: "/ask", label: "Ask BylawGuide", desc: "Ask a plain-language question and get a source-based answer.", icon: Sparkles },
            { href: "/tmc-chapters", label: "Bylaw Chapters", desc: "Browse Toronto Municipal Code chapters.", icon: BookOpen },
            { href: "/feedback", label: "Feedback", desc: "Suggest missing content or report an issue.", icon: HelpCircle },
          ].map((r) => {
            const Icon = r.icon;
            return (
              <Link key={r.href} href={r.href} className="group bg-white rounded-2xl border border-gray-100 subtle-shadow p-4 flex flex-col gap-2 hover:border-emerald-200 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500">
                <div className="flex items-center gap-2">
                  <span className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center flex-shrink-0"><Icon className="w-4 h-4 text-emerald-600" aria-hidden="true" /></span>
                  <span className="text-sm font-semibold text-gray-900 group-hover:text-emerald-700 transition-colors">{r.label}</span>
                </div>
                <p className="text-xs text-gray-500 leading-relaxed">{r.desc}</p>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Bottom disclaimer */}
      <div className="p-5 rounded-xl border border-amber-200 bg-amber-50 flex gap-3">
        <Info className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" aria-hidden="true" />
        <p className="text-sm text-amber-800 leading-relaxed">
          This page is a plain-language reference index of a historical by-law and does not confirm whether any property
          complies with zoning requirements. Always verify using the official Zoning By-law, Zoning Map Viewer, Toronto
          Building, or City staff.
        </p>
      </div>
    </div>
  );
}

// ── Historical zoning map (click-to-enlarge, zoomable) ──────────────────────
const MAP_SRC = "/images/zoning/former-north-york-zoning-map.jpg";
const MAP_W = 2400;
const MAP_H = 1355;
const MAP_ALT =
  "Schedule “B” Key Zoning Map for Township of North York By-law 7625 — a historical zoning map showing residential, commercial, industrial, and open-space zone designations across the township.";

function MapFigure() {
  const [open, setOpen] = useState(false);
  const [zoom, setZoom] = useState(1);
  const ZOOM_MIN = 1, ZOOM_MAX = 5, ZOOM_STEP = 0.5;

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", onKey); document.body.style.overflow = prev; };
  }, [open]);

  return (
    <figure className="m-0">
      <button
        type="button"
        onClick={() => { setZoom(1); setOpen(true); }}
        aria-label="Enlarge the Schedule B zoning map"
        className="group relative block w-full overflow-hidden rounded-2xl border border-gray-200 bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
      >
        <Image
          src={MAP_SRC}
          width={MAP_W}
          height={MAP_H}
          alt={MAP_ALT}
          sizes="(max-width: 1024px) 100vw, 960px"
          className="w-full h-auto"
        />
        <span className="absolute bottom-2 right-2 inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-black/55 text-white text-[11px] font-medium opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity">
          <Maximize2 className="w-3 h-3" aria-hidden="true" /> Enlarge
        </span>
      </button>
      <figcaption className="text-[11px] text-gray-400 mt-2">
        Source: City of Toronto Archives — North York By-law 7625, Schedule &ldquo;B&rdquo;. Historical reference only; not a current zoning map.
      </figcaption>

      {open && (
        <div
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/85 p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Schedule B zoning map — enlarged"
          onClick={() => setOpen(false)}
        >
          <div className="absolute top-4 right-4 z-10 flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
            <button type="button" onClick={() => setZoom((z) => Math.max(ZOOM_MIN, z - ZOOM_STEP))} disabled={zoom <= ZOOM_MIN} aria-label="Zoom out" className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-white/15 text-white hover:bg-white/25 disabled:opacity-40 disabled:cursor-not-allowed transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white">
              <ZoomOut className="w-4 h-4" aria-hidden="true" />
            </button>
            <span className="min-w-[3.25rem] text-center text-xs font-medium text-white/90 tabular-nums select-none">{Math.round(zoom * 100)}%</span>
            <button type="button" onClick={() => setZoom((z) => Math.min(ZOOM_MAX, z + ZOOM_STEP))} disabled={zoom >= ZOOM_MAX} aria-label="Zoom in" className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-white/15 text-white hover:bg-white/25 disabled:opacity-40 disabled:cursor-not-allowed transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white">
              <ZoomIn className="w-4 h-4" aria-hidden="true" />
            </button>
            <button type="button" autoFocus onClick={() => setOpen(false)} aria-label="Close enlarged image" className="ml-1 inline-flex items-center justify-center w-9 h-9 rounded-lg bg-white/15 text-white hover:bg-white/25 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white">
              <X className="w-5 h-5" aria-hidden="true" />
            </button>
          </div>
          <div
            className="relative flex max-h-[88vh] max-w-[96vw] items-center justify-center overflow-auto"
            onClick={(e) => e.stopPropagation()}
            onDoubleClick={() => setZoom((z) => (z > 1 ? 1 : 2))}
            style={{ cursor: "zoom-in" }}
          >
            <div style={{ transform: `scale(${zoom})`, transition: "transform 0.15s ease" }}>
              <Image src={MAP_SRC} width={MAP_W} height={MAP_H} alt={MAP_ALT} sizes="100vw" draggable={false} className="block w-auto h-auto max-h-[88vh] max-w-[96vw] rounded-lg select-none" />
            </div>
          </div>
          <p className="mt-3 max-w-2xl text-center text-xs text-gray-300" onClick={(e) => e.stopPropagation()}>
            Schedule &ldquo;B&rdquo; Key Zoning Map, By-law 7625 · use +/− to zoom, double-click to toggle, Esc to close
          </p>
        </div>
      )}
    </figure>
  );
}
