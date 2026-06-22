"use client";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Leaf, Sprout, MapPin, Info, ExternalLink, FileText, Landmark,
  ChevronDown, ChevronUp, HelpCircle, ClipboardList, Scale, Map,
  AlertTriangle, ArrowLeft, Ruler, Home,
  ChevronLeft, ChevronRight, Maximize2, ZoomIn, ZoomOut, X,
} from "lucide-react";
import SourceBadge from "@/components/SourceBadge";
import RelatedQuestions from "@/components/RelatedQuestions";
import {
  definitions, cautionNote,
  yardSections, softVsHard, minorVariancePoints, fourTests, whatToPrepare, faqItems,
  COMMITTEE_OF_ADJUSTMENT_URL, COMMITTEE_OF_ADJUSTMENT_FORMS_URL,
  ZONING_MAP_VIEWER_URL, OFFICIAL_ZONING_SOURCE_URL, CHAPTER_10_5_SOURCE_URL,
} from "@/data/zoning/landscaping-guide";

const yardIcons: Record<string, React.ElementType> = {
  "front-yard": Home,
  "side-yard": MapPin,
  "rear-yard": Sprout,
};

// On-page jump navigation (sticky horizontal index).
const PAGE_SECTIONS = [
  { id: "soft-landscaping", label: "What is soft landscaping?" },
  { id: "visual", label: "Soft vs. Hard" },
  { id: "front-yard", label: "Front Yard" },
  { id: "side-yard", label: "Side Yard" },
  { id: "rear-yard", label: "Rear Yard" },
  { id: "committee-of-adjustment", label: "Minor Variance" },
  { id: "prepare", label: "What to Prepare" },
  { id: "faq", label: "FAQ" },
];

export default function LandscapingClient() {
  const [activeSection, setActiveSection] = useState<string>(PAGE_SECTIONS[0].id);

  // Scroll-spy: highlight the last section whose top has scrolled past the
  // threshold line; force the final section active at the bottom of the page.
  useEffect(() => {
    const ids = PAGE_SECTIONS.map((s) => s.id);
    let ticking = false;
    const scan = () => {
      ticking = false;
      const threshold = 140;
      let current = ids[0];
      for (const id of ids) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= threshold) current = id;
      }
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2) {
        current = ids[ids.length - 1];
      }
      setActiveSection(current);
    };
    const onScroll = () => {
      if (!ticking) { ticking = true; requestAnimationFrame(scan); }
    };
    scan();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* ── Hero ───────────────────────────────────────────────────────────── */}
      <div className="mb-8">
        <Link
          href="/zoning"
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-amber-700 transition-colors mb-5"
        >
          <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" /> Back to Zoning Guide
        </Link>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-br from-amber-50 to-amber-100 text-amber-700 ring-1 ring-inset ring-amber-600/10 mb-4">
          <Leaf className="w-3.5 h-3.5" aria-hidden="true" />
          <span className="kicker">By-law 569-2013 · Chapter 10.5</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">Toronto Residential Landscaping Guide</h1>
        <p className="text-gray-500 max-w-2xl text-lg">
          Understand soft landscaping requirements for front yards, side yards, and rear yards in Toronto residential zones.
        </p>
        <SourceBadge className="mt-4" />
      </div>

      {/* ── Disclaimer ─────────────────────────────────────────────────────── */}
      <div className="mb-8 p-5 rounded-xl border border-red-200 bg-red-50 flex gap-3">
        <Info className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" aria-hidden="true" />
        <p className="text-sm text-red-800 leading-relaxed">
          Zoning rules are property-specific. This page summarizes selected soft landscaping requirements for general
          reference only. It is not a legal interpretation and does not confirm whether a property complies. Always
          verify using the official Zoning By-law, Zoning Map Viewer, Toronto Building, or City staff.
        </p>
      </div>

      {/* ── Mobile: horizontal jump nav (lg+ uses the left sidebar) ────────── */}
      <nav aria-label="On this page" className="sticky top-16 z-30 mb-8 lg:hidden">
        <div className="flex items-center gap-1.5 overflow-x-auto rounded-xl border border-gray-100 bg-white/85 px-1.5 py-1.5 backdrop-blur subtle-shadow">
          <span className="flex-shrink-0 self-center pl-2 pr-1 text-xs font-medium text-gray-400">On this page</span>
          {PAGE_SECTIONS.map((s) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              className={`flex-shrink-0 whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 ${activeSection === s.id ? "bg-amber-100 text-amber-800 font-semibold" : "text-gray-600 hover:bg-amber-50 hover:text-amber-700"}`}
            >
              {s.label}
            </a>
          ))}
        </div>
      </nav>

      {/* ── Two-column: sticky vertical index (left) + content ─────────────── */}
      <div className="lg:grid lg:grid-cols-[230px_minmax(0,1fr)] lg:gap-10">
        {/* Left vertical scroll-spy index (desktop only) */}
        <aside className="hidden lg:block">
          <nav aria-label="On this page" className="sticky top-20">
            <p className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wide text-gray-400">On this page</p>
            <ul className="flex flex-col border-l border-gray-200">
              {PAGE_SECTIONS.map((s) => {
                const isActive = activeSection === s.id;
                return (
                  <li key={s.id} className="leading-tight">
                    <a
                      href={`#${s.id}`}
                      onClick={() => setActiveSection(s.id)}
                      aria-current={isActive ? "true" : undefined}
                      className={`-ml-px block origin-left rounded-r-lg border-l-2 pl-3 pr-2 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 ${
                        isActive
                          ? "border-amber-500 bg-amber-50 text-amber-700 font-semibold text-sm py-2 scale-[1.04]"
                          : "border-transparent text-gray-500 hover:text-amber-700 hover:border-amber-200 text-xs py-1.5"
                      }`}
                    >
                      {s.label}
                    </a>
                  </li>
                );
              })}
            </ul>
          </nav>
        </aside>

        {/* Main content column */}
        <div className="min-w-0">
      {/* ── Official links ─────────────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-gray-100 subtle-shadow p-6 mb-10">
        <h2 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
          <Landmark className="w-5 h-5 text-amber-500" aria-hidden="true" /> Official sources
        </h2>
        <p className="text-sm text-gray-600 leading-relaxed mb-4">
          The residential landscaping rules below come from Zoning By-law 569-2013, Clause 10.5.50.10 (Landscaping),
          which applies across the Residential Zone category — including the Residential Zone (R) and Residential
          Detached Zone (RD).
        </p>
        <div className="flex flex-wrap gap-3">
          <a href={OFFICIAL_ZONING_SOURCE_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 text-amber-700 text-sm font-medium rounded-lg hover:bg-amber-100 transition-colors">
            <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" /> Official Zoning By-law
          </a>
          <a href={ZONING_MAP_VIEWER_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 text-gray-700 text-sm font-medium rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors">
            <Map className="w-3.5 h-3.5" aria-hidden="true" /> Open Zoning Map Viewer
          </a>
          <a href={CHAPTER_10_5_SOURCE_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 text-gray-700 text-sm font-medium rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors">
            <FileText className="w-3.5 h-3.5" aria-hidden="true" /> Chapter 10 (Residential)
          </a>
        </div>
      </div>

      {/* ── What is soft landscaping? ──────────────────────────────────────── */}
      <section id="soft-landscaping" aria-labelledby="def-heading" className="mb-10 scroll-mt-32">
        <h2 id="def-heading" className="text-2xl font-bold text-gray-900 mb-2 flex items-center gap-2">
          <Sprout className="w-6 h-6 text-amber-500" aria-hidden="true" /> What is soft landscaping?
        </h2>
        <p className="text-gray-600 leading-relaxed mb-5 max-w-3xl">
          Soft landscaping generally means permeable, living, or planted landscape areas — vegetation and natural ground
          cover that lets water absorb into the ground. The zoning by-law gives precise definitions:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {definitions.map((d) => (
            <div key={d.term} className="bg-white rounded-2xl border border-gray-100 subtle-shadow p-5">
              <h3 className="font-semibold text-gray-900 mb-1.5 flex items-center gap-2">
                <Leaf className="w-4 h-4 text-amber-500" aria-hidden="true" /> {d.term}
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed mb-3">{d.plain}</p>
              <div className="p-3 rounded-lg bg-gray-50 border border-gray-100">
                <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide mb-1 flex items-center gap-1.5">
                  <FileText className="w-3 h-3" aria-hidden="true" /> By-law wording
                </p>
                <p className="text-xs text-gray-600 leading-relaxed italic">{d.sourceExcerpt}</p>
                <p className="text-[11px] text-gray-400 mt-1.5">{d.sourceNote}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 rounded-xl border border-blue-100 bg-blue-50/60 flex gap-3">
          <Info className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" aria-hidden="true" />
          <p className="text-xs text-blue-900 leading-relaxed">{cautionNote}</p>
        </div>
      </section>

      {/* ── Soft vs Hard visual comparison ─────────────────────────────────── */}
      <section id="visual" aria-labelledby="visual-heading" className="mb-10 scroll-mt-32">
        <h2 id="visual-heading" className="text-2xl font-bold text-gray-900 mb-2">Soft vs. Hard Landscaping</h2>
        <p className="text-gray-600 mb-5">A quick visual reference. Final interpretation depends on the official zoning definition and site conditions.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
          <div className="rounded-2xl border-2 border-amber-200 bg-gradient-to-br from-amber-50 to-white p-5">
            <p className="kicker text-amber-700 mb-3">Usually soft landscaping</p>
            <div className="grid grid-cols-2 gap-2">
              {softVsHard.soft.map((s) => (
                <span key={s} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-amber-200 text-sm text-amber-800 font-medium">
                  <Leaf className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" aria-hidden="true" /> {s}
                </span>
              ))}
            </div>
          </div>
          <div className="rounded-2xl border-2 border-gray-300 bg-gradient-to-br from-gray-100 to-white p-5">
            <p className="kicker text-gray-600 mb-3">Usually not soft landscaping</p>
            <div className="grid grid-cols-2 gap-2">
              {softVsHard.hard.map((h) => (
                <span key={h} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-gray-300 text-sm text-gray-700 font-medium">
                  <span className="w-3 h-3 rounded-sm bg-gray-400 flex-shrink-0" aria-hidden="true" /> {h}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Visual guide carousel */}
        <LandscapingVisualCarousel />
      </section>

      {/* ── Yard sections ──────────────────────────────────────────────────── */}
      {yardSections.map((section) => {
        const Icon = yardIcons[section.id] ?? MapPin;
        return (
          <section key={section.id} id={section.id} aria-labelledby={`${section.id}-heading`} className="mb-10 scroll-mt-32">
            <div className="bg-white rounded-2xl border border-gray-100 subtle-shadow p-6 md:p-8">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-11 h-11 bg-amber-50 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Icon className="w-5 h-5 text-amber-600" aria-hidden="true" />
                </div>
                <div>
                  <h2 id={`${section.id}-heading`} className="text-2xl font-bold text-gray-900">{section.title}</h2>
                  <div className="flex flex-wrap items-center gap-1.5 mt-2">
                    {section.applicableZones.map((z) => (
                      <span key={z} className="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full border border-amber-200 bg-amber-50 text-amber-700">
                        <Landmark className="w-3 h-3" aria-hidden="true" /> {z}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <p className="text-gray-600 leading-relaxed mb-3">{section.intro}</p>
              <div className="p-3.5 rounded-xl bg-amber-50/60 border border-amber-100 mb-6">
                <p className="text-xs font-semibold text-amber-700 uppercase tracking-wide mb-1">Why it matters</p>
                <p className="text-sm text-amber-900 leading-relaxed">{section.whyItMatters}</p>
              </div>

              {/* Provisions */}
              <p className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                <FileText className="w-3.5 h-3.5 text-amber-500" aria-hidden="true" /> Relevant provisions
              </p>
              <div className="flex flex-col gap-2.5 mb-6">
                {section.provisions.map((p) => (
                  <div key={p.section + p.title} className="rounded-xl border border-gray-100 bg-gray-50/60 p-3.5">
                    <div className="flex flex-wrap items-center gap-2 mb-1.5">
                      <span className="text-xs font-medium text-gray-500">{p.chapter}</span>
                      {p.verified ? (
                        <span className="font-mono text-[11px] bg-white border border-gray-200 text-gray-700 px-1.5 py-0.5 rounded">{p.section}</span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-medium bg-red-50 border border-red-200 text-red-700 px-1.5 py-0.5 rounded">
                          <AlertTriangle className="w-3 h-3" aria-hidden="true" /> {p.section}
                        </span>
                      )}
                      <span className="text-xs font-semibold text-gray-800">{p.title}</span>
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed mb-1.5">{p.plainRule}</p>
                    <p className="text-[11px] text-gray-400 italic">Source: {p.sourceNote}</p>
                  </div>
                ))}
              </div>

              {/* What to measure */}
              <div className="mb-6">
                <p className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                  <Ruler className="w-3.5 h-3.5 text-amber-500" aria-hidden="true" /> What to measure
                </p>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                  {section.whatToMeasure.map((m) => (
                    <li key={m} className="flex items-start gap-2 text-sm text-gray-600">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 flex-shrink-0 mt-1.5" aria-hidden="true" /> {m}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Common questions */}
              <p className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                <HelpCircle className="w-3.5 h-3.5 text-violet-500" aria-hidden="true" /> Common questions
              </p>
              <div className="flex flex-col gap-2.5">
                {section.questions.map((q) => (
                  <div key={q.question} className="rounded-xl border border-gray-100 p-3.5">
                    <p className="text-sm font-semibold text-gray-900 mb-1">{q.question}</p>
                    <p className="text-sm text-gray-600 leading-relaxed">{q.answer}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        );
      })}

      {/* ── Minor Variance / Committee of Adjustment ───────────────────────── */}
      <section aria-labelledby="coa-heading" className="mb-10 scroll-mt-32" id="committee-of-adjustment">
        <div className="rounded-2xl border-2 border-violet-200 bg-gradient-to-br from-violet-50/70 to-white p-6 md:p-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-100 text-violet-700 mb-4">
            <Scale className="w-3.5 h-3.5" aria-hidden="true" />
            <span className="kicker">Committee of Adjustment</span>
          </div>
          <h2 id="coa-heading" className="text-2xl font-bold text-gray-900 mb-3">
            What if I want to keep landscaping that does not meet zoning requirements?
          </h2>
          <p className="text-gray-600 leading-relaxed mb-5 max-w-3xl">
            If a property&apos;s landscaping does not meet the applicable zoning requirements, and the owner wants to keep or
            legalize the condition, they may need to apply to the Committee of Adjustment for a Minor Variance:
          </p>

          <ul className="flex flex-col gap-2 mb-6">
            {minorVariancePoints.map((pt) => (
              <li key={pt} className="flex items-start gap-2 text-sm text-gray-700 leading-relaxed">
                <span className="w-1.5 h-1.5 rounded-full bg-violet-400 flex-shrink-0 mt-1.5" aria-hidden="true" /> {pt}
              </li>
            ))}
          </ul>

          {/* Four tests */}
          <p className="text-sm font-semibold text-gray-900 mb-2">The Committee weighs four tests:</p>
          <ol className="flex flex-col gap-2 mb-6">
            {fourTests.map((test, i) => (
              <li key={test} className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-violet-100 text-violet-700 text-xs font-bold flex items-center justify-center mt-0.5">{i + 1}</span>
                <p className="text-sm text-gray-700 leading-relaxed">{test}</p>
              </li>
            ))}
          </ol>

          <div className="p-4 rounded-xl border border-red-200 bg-red-50 flex gap-3 mb-6">
            <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" aria-hidden="true" />
            <p className="text-sm text-red-800 leading-relaxed">
              Wanting to keep an existing condition does not automatically mean a variance will be approved. Committee of
              Adjustment approval is not guaranteed. Requirements, fees, forms, and procedures may change. Always check
              the official City of Toronto Committee of Adjustment page before applying.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <a href={COMMITTEE_OF_ADJUSTMENT_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-violet-600 text-white text-sm font-medium rounded-lg hover:bg-violet-700 transition-colors">
              <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" /> Learn About Committee of Adjustment
            </a>
            <a href={COMMITTEE_OF_ADJUSTMENT_FORMS_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-white border border-violet-200 text-violet-700 text-sm font-medium rounded-lg hover:bg-violet-50 transition-colors">
              <FileText className="w-3.5 h-3.5" aria-hidden="true" /> Forms, Submission Guidelines &amp; Fees
            </a>
          </div>
        </div>
      </section>

      {/* ── What to prepare ────────────────────────────────────────────────── */}
      <section id="prepare" aria-labelledby="prepare-heading" className="mb-10 scroll-mt-32">
        <div className="bg-white rounded-2xl border border-gray-100 subtle-shadow p-6">
          <h2 id="prepare-heading" className="font-bold text-gray-900 mb-1 flex items-center gap-2">
            <ClipboardList className="w-5 h-5 text-amber-500" aria-hidden="true" /> What should I prepare before asking about landscaping compliance?
          </h2>
          <p className="text-sm text-gray-500 mb-4">Having these ready makes it much easier to confirm requirements with the City or a professional.</p>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
            {whatToPrepare.map((item) => (
              <li key={item} className="flex items-start gap-2 text-sm text-gray-700">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 flex-shrink-0 mt-2" aria-hidden="true" /> {item}
              </li>
            ))}
          </ul>
          <div className="p-3.5 rounded-xl border border-blue-100 bg-blue-50/60 flex gap-2.5">
            <Info className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" aria-hidden="true" />
            <p className="text-xs text-blue-900">Exact measurements are important because landscaping requirements often depend on percentages or area calculations.</p>
          </div>
        </div>
      </section>

      {/* ── FAQ accordion ──────────────────────────────────────────────────── */}
      <section id="faq" aria-labelledby="faq-heading" className="mb-10 scroll-mt-32">
        <h2 id="faq-heading" className="text-2xl font-bold text-gray-900 mb-5 flex items-center gap-2">
          <HelpCircle className="w-6 h-6 text-violet-500" aria-hidden="true" /> Common Questions
        </h2>
        <div className="flex flex-col gap-2.5">
          {faqItems.map((item, i) => (
            <FaqRow key={item.question} item={item} index={i} />
          ))}
        </div>
      </section>

      {/* ── Related questions (Ask) ────────────────────────────────────────── */}
      <RelatedQuestions
        className="mb-10"
        questions={[
          "Can I pave my entire front yard?",
          "What counts as soft landscaping?",
          "How much of my rear yard must be soft landscaping?",
          "Can I park in my front yard?",
        ]}
      />

      {/* ── Bottom disclaimer ──────────────────────────────────────────────── */}
      <div className="p-5 rounded-xl border border-red-200 bg-red-50 flex gap-3">
        <Info className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" aria-hidden="true" />
        <p className="text-sm text-red-800 leading-relaxed">
          Zoning rules are property-specific. This page summarizes selected soft landscaping requirements for general
          reference only. It is not a legal interpretation and does not confirm whether a property complies. Always
          verify using the official Zoning By-law, Zoning Map Viewer, Toronto Building, or City staff.
        </p>
      </div>
        </div>{/* /main content column */}
      </div>{/* /two-column grid */}
    </div>
  );
}

// ── FAQ accordion row ──────────────────────────────────────────────────────
function FaqRow({ item, index }: { item: { question: string; answer: string }; index: number }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`bg-white rounded-2xl border transition-all ${open ? "border-violet-200 subtle-shadow" : "border-gray-100 hover:border-gray-200"}`}>
      <button
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-controls={`faq-${index}`}
        className="w-full text-left p-4 flex items-center gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-inset rounded-2xl"
      >
        <span className="font-medium text-gray-900 flex-1">{item.question}</span>
        {open ? <ChevronUp className="w-5 h-5 text-gray-400 flex-shrink-0" aria-hidden="true" /> : <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" aria-hidden="true" />}
      </button>
      {open && (
        <div id={`faq-${index}`} className="px-4 pb-4 -mt-1">
          <p className="text-sm text-gray-600 leading-relaxed">{item.answer}</p>
        </div>
      )}
    </div>
  );
}

// ── Visual guide carousel (rotating infographics + zoomable lightbox) ───────
interface VisualSlide {
  id: string;
  title: string;
  src: string;
  width: number;
  height: number;
  alt: string;
  caption: string;
}

const VISUAL_SLIDES: VisualSlide[] = [
  {
    id: "soft-vs-hard",
    title: "Soft vs. Hard Landscaping",
    src: "/images/landscaping/soft-vs-hard-landscaping.png",
    width: 1536,
    height: 1024,
    alt: "Illustrated comparison of what usually counts as soft landscaping (grass, planting beds, shrubs, trees, mulch beds, pool water surface, permeable planted areas) versus what usually does not (driveway, concrete, asphalt, parking pad, patio stones, deck, artificial grass, solid paving).",
    caption: "Common examples of what usually counts as soft landscaping and what usually does not.",
  },
  {
    id: "measurement-guide",
    title: "Soft Landscaping Measurement Guide",
    src: "/images/landscaping/soft-landscaping-measurement-guide.png",
    width: 1536,
    height: 1024,
    alt: "Worked example of a front-yard soft landscaping calculation under By-law 10.5.50.10: a 16.0 m frontage lot with a 6.5 m proposed front yard setback, showing front yard area, permitted encroachments excluded, required landscaping at 60%, and required soft landscaping at 75% of that.",
    caption: "A worked example of how front-yard soft landscaping is measured under By-law 10.5.50.10.",
  },
];

const VISUAL_DISCLAIMER =
  "These images are simplified educational examples only. Actual compliance depends on exact measurements, site conditions, and the official Zoning By-law.";

function LandscapingVisualCarousel() {
  const [slide, setSlide] = useState(0);
  const [paused, setPaused] = useState(false);
  const [lightbox, setLightbox] = useState<VisualSlide | null>(null);
  const [zoom, setZoom] = useState(1);
  const ZOOM_MIN = 1, ZOOM_MAX = 4, ZOOM_STEP = 0.5;

  const slideCount = VISUAL_SLIDES.length;
  const goPrev = () => setSlide((s) => (s - 1 + slideCount) % slideCount);
  const goNext = () => setSlide((s) => (s + 1) % slideCount);

  // Auto-advance (loops). Pauses on hover/focus and while the lightbox is open.
  useEffect(() => {
    if (paused || lightbox) return;
    const t = setInterval(() => setSlide((s) => (s + 1) % slideCount), 6000);
    return () => clearInterval(t);
  }, [paused, lightbox, slideCount]);

  // Close lightbox with Escape; lock body scroll while open; reset zoom on change.
  useEffect(() => {
    if (!lightbox) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setLightbox(null); };
    window.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [lightbox]);
  useEffect(() => { setZoom(1); }, [lightbox]);

  // Touch swipe handling.
  const touchStartX = useRef<number | null>(null);
  const onTouchStart = (e: React.TouchEvent) => { touchStartX.current = e.touches[0].clientX; };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(dx) > 40) (dx < 0 ? goNext : goPrev)();
    touchStartX.current = null;
  };

  return (
    <div
      className="relative"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
      role="group"
      aria-roledescription="carousel"
      aria-label="Landscaping infographics"
    >
      <p className="text-sm font-semibold text-gray-900 mb-3" aria-live="polite">
        <span className="text-amber-600">{slide + 1} / {slideCount}</span> · {VISUAL_SLIDES[slide].title}
      </p>

      <div
        className="relative overflow-hidden rounded-xl border border-gray-200 bg-gray-50"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <div className="flex transition-transform duration-500 ease-out" style={{ transform: `translateX(-${slide * 100}%)` }}>
          {VISUAL_SLIDES.map((s, i) => (
            <div
              key={s.id}
              className="w-full flex-shrink-0"
              role="group"
              aria-roledescription="slide"
              aria-label={`${i + 1} of ${slideCount}: ${s.title}`}
              aria-hidden={i !== slide}
            >
              <button
                type="button"
                onClick={() => setLightbox(s)}
                tabIndex={i === slide ? 0 : -1}
                aria-label={`Enlarge image: ${s.title}`}
                className="group relative block w-full h-[60vh] sm:h-[640px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-amber-500"
              >
                <Image
                  src={s.src}
                  fill
                  alt={s.alt}
                  sizes="(max-width: 1024px) 100vw, 900px"
                  className="object-contain p-2"
                />
                <span className="absolute bottom-2 right-2 inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-black/55 text-white text-[11px] font-medium opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity">
                  <Maximize2 className="w-3 h-3" aria-hidden="true" /> Enlarge
                </span>
              </button>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={goPrev}
          aria-label="Previous image"
          className="absolute left-2 top-1/2 -translate-y-1/2 inline-flex items-center justify-center w-9 h-9 rounded-full bg-white/90 text-gray-700 shadow hover:bg-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
        >
          <ChevronLeft className="w-5 h-5" aria-hidden="true" />
        </button>
        <button
          type="button"
          onClick={goNext}
          aria-label="Next image"
          className="absolute right-2 top-1/2 -translate-y-1/2 inline-flex items-center justify-center w-9 h-9 rounded-full bg-white/90 text-gray-700 shadow hover:bg-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
        >
          <ChevronRight className="w-5 h-5" aria-hidden="true" />
        </button>
      </div>

      <p className="text-xs text-gray-500 mt-3 text-center">{VISUAL_SLIDES[slide].caption}</p>

      <div className="flex justify-center gap-2 mt-3">
        {VISUAL_SLIDES.map((s, i) => (
          <button
            key={s.id}
            type="button"
            onClick={() => setSlide(i)}
            aria-label={`Show ${s.title}`}
            aria-current={slide === i}
            className={`h-2 rounded-full transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 ${slide === i ? "w-6 bg-amber-600" : "w-2 bg-gray-300 hover:bg-gray-400"}`}
          />
        ))}
      </div>

      <p className="text-[11px] text-gray-400 mt-3 text-center">{VISUAL_DISCLAIMER}</p>

      {/* Image lightbox (click-to-enlarge, with zoom) */}
      {lightbox && (
        <div
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/85 p-4"
          role="dialog"
          aria-modal="true"
          aria-label={`${lightbox.title} — enlarged image`}
          onClick={() => setLightbox(null)}
        >
          <div className="absolute top-4 right-4 z-10 flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              onClick={() => setZoom((z) => Math.max(ZOOM_MIN, z - ZOOM_STEP))}
              disabled={zoom <= ZOOM_MIN}
              aria-label="Zoom out"
              className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-white/15 text-white hover:bg-white/25 disabled:opacity-40 disabled:cursor-not-allowed transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              <ZoomOut className="w-4 h-4" aria-hidden="true" />
            </button>
            <span className="min-w-[3.25rem] text-center text-xs font-medium text-white/90 tabular-nums select-none">{Math.round(zoom * 100)}%</span>
            <button
              type="button"
              onClick={() => setZoom((z) => Math.min(ZOOM_MAX, z + ZOOM_STEP))}
              disabled={zoom >= ZOOM_MAX}
              aria-label="Zoom in"
              className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-white/15 text-white hover:bg-white/25 disabled:opacity-40 disabled:cursor-not-allowed transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              <ZoomIn className="w-4 h-4" aria-hidden="true" />
            </button>
            <button
              type="button"
              autoFocus
              onClick={() => setLightbox(null)}
              aria-label="Close enlarged image"
              className="ml-1 inline-flex items-center justify-center w-9 h-9 rounded-lg bg-white/15 text-white hover:bg-white/25 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              <X className="w-5 h-5" aria-hidden="true" />
            </button>
          </div>

          <div
            className="relative flex max-h-[84vh] max-w-[95vw] items-center justify-center overflow-auto"
            onClick={(e) => e.stopPropagation()}
            onDoubleClick={() => setZoom((z) => (z > 1 ? 1 : 2))}
            style={{ cursor: "zoom-in" }}
          >
            <div style={{ transform: `scale(${zoom})`, transition: "transform 0.15s ease" }}>
              <Image
                src={lightbox.src}
                width={lightbox.width}
                height={lightbox.height}
                alt={lightbox.alt}
                sizes="100vw"
                draggable={false}
                className="block w-auto h-auto max-h-[84vh] max-w-[95vw] rounded-lg select-none"
              />
            </div>
          </div>

          <p className="mt-3 max-w-2xl text-center text-xs text-gray-300" onClick={(e) => e.stopPropagation()}>
            {lightbox.caption} <span className="text-gray-400">· use +/− to zoom, double-click to toggle, Esc to close</span>
          </p>
        </div>
      )}
    </div>
  );
}
