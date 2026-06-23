"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Car, MapPin, Home, Truck, Caravan, Route, Info, ExternalLink, FileText,
  Landmark, ChevronDown, ChevronUp, HelpCircle, ClipboardList, Scale, Map,
  AlertTriangle, ArrowLeft, ArrowRight, Leaf, BadgeCheck, Maximize2, X, Image as ImageIcon,
} from "lucide-react";
import SourceBadge from "@/components/SourceBadge";
import RelatedQuestions from "@/components/RelatedQuestions";
import {
  parkingTopics, type ParkingTopic, type ParkingCategory, type ParkingIllustration,
  yardLocationFigure,
  howToUseSteps, howToWarning, parkingAndLandscaping, whatToPrepare, parkingFaq,
  minorVariancePoints, fourTests,
  COMMITTEE_OF_ADJUSTMENT_URL, COMMITTEE_OF_ADJUSTMENT_FORMS_URL,
  ZONING_MAP_VIEWER_URL, OFFICIAL_ZONING_SOURCE_URL, CHAPTER_10_5_SOURCE_URL,
} from "@/data/zoning/parking-topics";

const categoryIcons: Record<ParkingCategory, React.ElementType> = {
  "Front Yard Parking": Home,
  "Side Yard Parking": MapPin,
  "Rear Yard Parking": Car,
  "Commercial Parking": Truck,
  "Recreational Vehicle Parking": Caravan,
  "Driveway / Parking Area": Route,
  "General Parking Zoning": Info,
};

// On-page jump navigation (sticky index + scroll-spy).
const PAGE_SECTIONS = [
  { id: "how-to", label: "How to use" },
  ...parkingTopics.map((t) => ({ id: t.slug, label: t.title.replace(/,.*$/, "") })),
  { id: "parking-landscaping", label: "Parking & Landscaping" },
  { id: "committee-of-adjustment", label: "Minor Variance" },
  { id: "prepare", label: "What to Prepare" },
  { id: "faq", label: "FAQ" },
];

export default function ParkingClient() {
  const [activeSection, setActiveSection] = useState<string>(PAGE_SECTIONS[0].id);

  // Scroll-spy: highlight the last section scrolled past the threshold line.
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
    const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(scan); } };
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
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-blue-700 transition-colors mb-5"
        >
          <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" /> Back to Zoning Guide
        </Link>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-br from-blue-50 to-indigo-100 text-blue-700 ring-1 ring-inset ring-blue-600/10 mb-4">
          <Car className="w-3.5 h-3.5" aria-hidden="true" />
          <span className="kicker">By-law 569-2013 · Chapter 10</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">Toronto Parking Zoning Guide</h1>
        <p className="text-gray-500 max-w-2xl text-lg">
          Understand common parking-related zoning topics, including front yard, side yard, rear yard, commercial, and
          recreational vehicle parking.
        </p>
        <SourceBadge className="mt-4" />
      </div>

      {/* ── Disclaimer ─────────────────────────────────────────────────────── */}
      <div className="mb-8 p-5 rounded-xl border border-red-200 bg-red-50 flex gap-3">
        <Info className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" aria-hidden="true" />
        <p className="text-sm text-red-800 leading-relaxed">
          Parking zoning rules are property-specific. This page summarizes selected parking-related zoning topics for
          general reference only. It is not a legal interpretation and does not confirm whether a property complies.
          Always verify using the official Zoning By-law, Zoning Map Viewer, Toronto Building, or City staff.
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
              className={`flex-shrink-0 whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${activeSection === s.id ? "bg-blue-100 text-blue-800 font-semibold" : "text-gray-600 hover:bg-blue-50 hover:text-blue-700"}`}
            >
              {s.label}
            </a>
          ))}
        </div>
      </nav>

      {/* ── Two-column: sticky vertical index (left) + content ─────────────── */}
      <div className="lg:grid lg:grid-cols-[230px_minmax(0,1fr)] lg:gap-10">
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
                      className={`-ml-px block origin-left rounded-r-lg border-l-2 pl-3 pr-2 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
                        isActive
                          ? "border-blue-500 bg-blue-50 text-blue-700 font-semibold text-sm py-2 scale-[1.04]"
                          : "border-transparent text-gray-500 hover:text-blue-700 hover:border-blue-200 text-xs py-1.5"
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
          {/* ── Official links ───────────────────────────────────────────── */}
          <div className="bg-white rounded-2xl border border-gray-100 subtle-shadow p-6 mb-10">
            <h2 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
              <Landmark className="w-5 h-5 text-blue-500" aria-hidden="true" /> Official sources
            </h2>
            <p className="text-sm text-gray-600 leading-relaxed mb-4">
              The parking topics below are drawn from Zoning By-law 569-2013, Chapter 10 (Residential) — mainly
              Clause 10.5.80.10 (parking location), 10.10.80.40 (access to parking), and 10.5.50.10 (landscaping limits
              on paving). Where the source does not clearly set a rule, the content says &ldquo;needs verification&rdquo;.
            </p>
            <div className="flex flex-wrap gap-3">
              <a href={ZONING_MAP_VIEWER_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors">
                <Map className="w-3.5 h-3.5" aria-hidden="true" /> Open Zoning Map Viewer
              </a>
              <a href={OFFICIAL_ZONING_SOURCE_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 text-sm font-medium rounded-lg hover:bg-blue-100 transition-colors">
                <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" /> Official Zoning By-law &amp; Preliminary Reviews
              </a>
              <a href={COMMITTEE_OF_ADJUSTMENT_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 text-gray-700 text-sm font-medium rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors">
                <Scale className="w-3.5 h-3.5" aria-hidden="true" /> Committee of Adjustment
              </a>
              <a href={CHAPTER_10_5_SOURCE_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 text-gray-700 text-sm font-medium rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors">
                <FileText className="w-3.5 h-3.5" aria-hidden="true" /> Chapter 10 (Residential)
              </a>
            </div>
          </div>

          {/* ── How to use this guide ────────────────────────────────────── */}
          <section id="how-to" aria-labelledby="how-to-heading" className="mb-10 scroll-mt-32">
            <div className="bg-white rounded-2xl border border-gray-100 subtle-shadow p-6">
              <h2 id="how-to-heading" className="font-bold text-gray-900 mb-1 flex items-center gap-2">
                <ClipboardList className="w-5 h-5 text-blue-500" aria-hidden="true" /> How to use this parking guide
              </h2>
              <p className="text-sm text-gray-500 mb-4">Six steps — from your address to the right parking provision.</p>
              <ol className="flex flex-col gap-2.5 mb-5">
                {howToUseSteps.map((step, i) => (
                  <li key={step} className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-xs font-bold flex items-center justify-center mt-0.5">{i + 1}</span>
                    <p className="text-sm text-gray-700 leading-relaxed">{step}</p>
                  </li>
                ))}
              </ol>
              <div className="p-3.5 rounded-xl border border-amber-200 bg-amber-50 flex gap-2.5">
                <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" aria-hidden="true" />
                <p className="text-xs text-amber-800">{howToWarning}</p>
              </div>
            </div>
          </section>

          {/* ── Overview infographic: parking by yard location ───────────── */}
          <section aria-labelledby="overview-figure-heading" className="mb-10 scroll-mt-32">
            <div className="bg-white rounded-2xl border border-gray-100 subtle-shadow p-6">
              <h2 id="overview-figure-heading" className="font-bold text-gray-900 mb-1 flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-blue-500" aria-hidden="true" /> Where parking may be located
              </h2>
              <p className="text-sm text-gray-500 mb-4">A visual overview of front, side, and rear yard parking on a residential lot.</p>
              <ParkingFigure illustration={yardLocationFigure} />
            </div>
          </section>

          {/* ── Parking topic sections ───────────────────────────────────── */}
          {parkingTopics.map((topic) => (
            <ParkingTopicSection key={topic.id} topic={topic} />
          ))}

          {/* ── Parking & Landscaping ────────────────────────────────────── */}
          <section id="parking-landscaping" aria-labelledby="pl-heading" className="mb-10 scroll-mt-32">
            <div className="rounded-2xl border-2 border-emerald-200 bg-gradient-to-br from-emerald-50/70 to-white p-6 md:p-8">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 mb-4">
                <Leaf className="w-3.5 h-3.5" aria-hidden="true" />
                <span className="kicker">Overlap</span>
              </div>
              <h2 id="pl-heading" className="text-2xl font-bold text-gray-900 mb-3">Parking and Landscaping</h2>
              <p className="text-gray-600 leading-relaxed mb-5 max-w-3xl">{parkingAndLandscaping.intro}</p>
              <ul className="flex flex-col gap-2 mb-6">
                {parkingAndLandscaping.points.map((pt) => (
                  <li key={pt} className="flex items-start gap-2 text-sm text-gray-700 leading-relaxed">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 flex-shrink-0 mt-1.5" aria-hidden="true" /> {pt}
                  </li>
                ))}
              </ul>
              <Link
                href="/landscaping"
                className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-emerald-600 text-white text-sm font-medium rounded-lg hover:bg-emerald-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
              >
                <Leaf className="w-3.5 h-3.5" aria-hidden="true" /> Open Landscaping Guide
              </Link>
            </div>
          </section>

          {/* ── Minor Variance / Committee of Adjustment ─────────────────── */}
          <section aria-labelledby="coa-heading" className="mb-10 scroll-mt-32" id="committee-of-adjustment">
            <div className="rounded-2xl border-2 border-violet-200 bg-gradient-to-br from-violet-50/70 to-white p-6 md:p-8">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-100 text-violet-700 mb-4">
                <Scale className="w-3.5 h-3.5" aria-hidden="true" />
                <span className="kicker">Committee of Adjustment</span>
              </div>
              <h2 id="coa-heading" className="text-2xl font-bold text-gray-900 mb-3">
                What if I want to keep parking that does not meet zoning requirements?
              </h2>
              <p className="text-gray-600 leading-relaxed mb-5 max-w-3xl">
                If an existing or proposed parking arrangement does not meet the applicable zoning requirements, and the
                owner wants to keep or legalize it, they may need planning advice or a Minor Variance application to the
                Committee of Adjustment:
              </p>
              <ul className="flex flex-col gap-2 mb-6">
                {minorVariancePoints.map((pt) => (
                  <li key={pt} className="flex items-start gap-2 text-sm text-gray-700 leading-relaxed">
                    <span className="w-1.5 h-1.5 rounded-full bg-violet-400 flex-shrink-0 mt-1.5" aria-hidden="true" /> {pt}
                  </li>
                ))}
              </ul>
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
                  Wanting to keep an existing condition does not automatically mean a variance will be approved. Committee
                  of Adjustment approval is not guaranteed. Requirements, fees, forms, and procedures may change. Always
                  check the official City of Toronto Committee of Adjustment page before applying.
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

          {/* ── What to prepare ──────────────────────────────────────────── */}
          <section id="prepare" aria-labelledby="prepare-heading" className="mb-10 scroll-mt-32">
            <div className="bg-white rounded-2xl border border-gray-100 subtle-shadow p-6">
              <h2 id="prepare-heading" className="font-bold text-gray-900 mb-1 flex items-center gap-2">
                <ClipboardList className="w-5 h-5 text-blue-500" aria-hidden="true" /> What should I prepare before checking parking zoning?
              </h2>
              <p className="text-sm text-gray-500 mb-4">Having these ready makes it much easier to confirm requirements with the City or a professional.</p>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
                {whatToPrepare.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-gray-700">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400 flex-shrink-0 mt-2" aria-hidden="true" /> {item}
                  </li>
                ))}
              </ul>
              <div className="p-3.5 rounded-xl border border-blue-100 bg-blue-50/60 flex gap-2.5">
                <Info className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" aria-hidden="true" />
                <p className="text-xs text-blue-900">Exact measurements and vehicle details matter because parking rules depend on location, lot layout, vehicle type, and lawful parking areas.</p>
              </div>
            </div>
          </section>

          {/* ── FAQ accordion ────────────────────────────────────────────── */}
          <section id="faq" aria-labelledby="faq-heading" className="mb-10 scroll-mt-32">
            <h2 id="faq-heading" className="text-2xl font-bold text-gray-900 mb-5 flex items-center gap-2">
              <HelpCircle className="w-6 h-6 text-violet-500" aria-hidden="true" /> Common Questions
            </h2>
            <div className="flex flex-col gap-2.5">
              {parkingFaq.map((item, i) => (
                <FaqRow key={item.question} item={item} index={i} />
              ))}
            </div>
          </section>

          {/* ── Related questions (Ask) ──────────────────────────────────── */}
          <RelatedQuestions
            className="mb-10"
            questions={[
              "Can I park in my front yard?",
              "Can I park in my backyard?",
              "Can I park an RV in my driveway?",
              "Can I widen my driveway?",
            ]}
          />

          {/* ── Bottom disclaimer ────────────────────────────────────────── */}
          <div className="p-5 rounded-xl border border-red-200 bg-red-50 flex gap-3">
            <Info className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" aria-hidden="true" />
            <p className="text-sm text-red-800 leading-relaxed">
              Parking zoning rules are property-specific. This page summarizes selected parking-related zoning topics for
              general reference only. It is not a legal interpretation and does not confirm whether a property complies.
              Always verify using the official Zoning By-law, Zoning Map Viewer, Toronto Building, or City staff.
            </p>
          </div>
        </div>{/* /main content column */}
      </div>{/* /two-column grid */}
    </div>
  );
}

// ── Parking topic section ───────────────────────────────────────────────────
function ParkingTopicSection({ topic }: { topic: ParkingTopic }) {
  const Icon = categoryIcons[topic.category] ?? Car;
  return (
    <section id={topic.slug} aria-labelledby={`${topic.slug}-heading`} className="mb-10 scroll-mt-32">
      <div className="bg-white rounded-2xl border border-gray-100 subtle-shadow p-6 md:p-8">
        <div className="flex items-start gap-3 mb-4">
          <div className="w-11 h-11 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0">
            <Icon className="w-5 h-5 text-blue-600" aria-hidden="true" />
          </div>
          <div>
            <h2 id={`${topic.slug}-heading`} className="text-2xl font-bold text-gray-900">{topic.title}</h2>
            <div className="flex flex-wrap items-center gap-1.5 mt-2">
              {topic.relevantChapters.map((c) => (
                <span key={c} className="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full border border-blue-200 bg-blue-50 text-blue-700">
                  <Landmark className="w-3 h-3" aria-hidden="true" /> {c}
                </span>
              ))}
            </div>
          </div>
        </div>

        <p className="text-gray-600 leading-relaxed mb-6">{topic.plainLanguageSummary}</p>

        {topic.illustration && (
          <div className="mb-6">
            <ParkingFigure illustration={topic.illustration} />
          </div>
        )}

        {/* Relevant sections */}
        <p className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
          <FileText className="w-3.5 h-3.5 text-blue-500" aria-hidden="true" /> Relevant by-law sections &amp; source excerpts
        </p>
        <div className="flex flex-col gap-2.5 mb-6">
          {topic.relevantSections.map((s) => {
            const needs = s.verificationStatus === "needs-verification";
            return (
              <div key={s.sectionNumber + s.sectionTitle} className="rounded-xl border border-gray-100 bg-gray-50/60 p-3.5">
                <div className="flex flex-wrap items-center gap-2 mb-1.5">
                  {needs ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-medium bg-red-50 border border-red-200 text-red-700 px-1.5 py-0.5 rounded">
                      <AlertTriangle className="w-3 h-3" aria-hidden="true" /> {s.sectionNumber === "Needs source verification" ? "Section reference needs verification" : s.sectionNumber}
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 font-mono text-[11px] bg-white border border-emerald-200 text-emerald-700 px-1.5 py-0.5 rounded">
                      <BadgeCheck className="w-3 h-3" aria-hidden="true" /> {s.sectionNumber}
                    </span>
                  )}
                  <span className="text-xs font-semibold text-gray-800">{s.sectionTitle}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-white border border-gray-100 mb-1.5">
                  <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide mb-1 flex items-center gap-1.5">
                    <FileText className="w-3 h-3" aria-hidden="true" /> {needs ? "Source note" : "By-law wording"}
                  </p>
                  <p className="text-xs text-gray-600 leading-relaxed italic">{s.sourceExcerpt}</p>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">{s.plainLanguageSummary}</p>
              </div>
            );
          })}
        </div>

        {/* Common questions */}
        <p className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
          <HelpCircle className="w-3.5 h-3.5 text-violet-500" aria-hidden="true" /> Common questions
        </p>
        <div className="flex flex-col gap-2.5 mb-6">
          {topic.commonQuestions.map((q) => (
            <div key={q.question} className="rounded-xl border border-gray-100 p-3.5">
              <p className="text-sm font-semibold text-gray-900 mb-1">{q.question}</p>
              <p className="text-sm text-gray-600 leading-relaxed">{q.answer}</p>
              {q.relatedSections.length > 0 && (
                <div className="flex flex-wrap items-center gap-1.5 mt-2">
                  {q.relatedSections.map((rs) => (
                    <span key={rs} className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${rs.startsWith("Needs") ? "bg-red-50 text-red-600 border border-red-200" : "bg-gray-100 text-gray-600"}`}>
                      {rs.startsWith("Needs") ? "needs verification" : rs}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Examples */}
        {topic.examples.length > 0 && (
          <div className="mb-6">
            <p className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-500" aria-hidden="true" /> Situations that may need review
            </p>
            <ul className="flex flex-col gap-2">
              {topic.examples.map((ex) => (
                <li key={ex} className="flex items-start gap-2 text-sm text-amber-900 bg-amber-50/70 border border-amber-100 rounded-lg p-2.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-500 flex-shrink-0 mt-0.5" aria-hidden="true" /> {ex}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* What to prepare (per topic) */}
        <div className="mb-2">
          <p className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
            <ClipboardList className="w-3.5 h-3.5 text-blue-500" aria-hidden="true" /> What to prepare
          </p>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
            {topic.whatToPrepare.map((m) => (
              <li key={m} className="flex items-start gap-2 text-sm text-gray-600">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400 flex-shrink-0 mt-1.5" aria-hidden="true" /> {m}
              </li>
            ))}
          </ul>
        </div>

        {/* Related internal links */}
        {topic.relatedInternalLinks.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-4 mt-4 border-t border-gray-100">
            {topic.relatedInternalLinks.map((l) => (
              <Link
                key={l.url}
                href={l.url}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 text-xs font-medium rounded-lg hover:bg-blue-100 transition-colors"
              >
                {l.label} <ArrowRight className="w-3 h-3" aria-hidden="true" />
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

// ── Infographic figure (click to enlarge in a lightbox) ────────────────────
function ParkingFigure({ illustration }: { illustration: ParkingIllustration }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open]);

  return (
    <figure>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={`Enlarge infographic: ${illustration.caption}`}
        className="group relative block w-full overflow-hidden rounded-xl border border-gray-200 bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
      >
        <Image
          src={illustration.src}
          width={illustration.width}
          height={illustration.height}
          alt={illustration.alt}
          sizes="(max-width: 1024px) 100vw, 720px"
          className="h-auto w-full object-contain"
        />
        <span className="absolute bottom-2 right-2 inline-flex items-center gap-1 rounded-lg bg-black/55 px-2 py-1 text-[11px] font-medium text-white opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
          <Maximize2 className="h-3 w-3" aria-hidden="true" /> Enlarge
        </span>
      </button>
      <figcaption className="mt-2 text-xs text-gray-500 leading-relaxed">{illustration.caption}</figcaption>

      {open && (
        <div
          className="fixed inset-0 z-[80] flex items-start justify-center overflow-auto bg-black/85 p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Enlarged infographic"
          onClick={() => setOpen(false)}
        >
          <button
            type="button"
            autoFocus
            onClick={() => setOpen(false)}
            aria-label="Close enlarged image"
            className="fixed top-4 right-4 z-10 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-white/15 text-white hover:bg-white/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
          <Image
            src={illustration.src}
            width={illustration.width}
            height={illustration.height}
            alt={illustration.alt}
            sizes="100vw"
            onClick={(e) => e.stopPropagation()}
            className="my-auto h-auto w-auto max-w-[min(100%,820px)] rounded-lg"
          />
        </div>
      )}
    </figure>
  );
}

// ── FAQ accordion row ───────────────────────────────────────────────────────
function FaqRow({ item, index }: { item: { question: string; answer: string }; index: number }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`bg-white rounded-2xl border transition-all ${open ? "border-violet-200 subtle-shadow" : "border-gray-100 hover:border-gray-200"}`}>
      <button
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-controls={`pfaq-${index}`}
        className="w-full text-left p-4 flex items-center gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-inset rounded-2xl"
      >
        <span className="font-medium text-gray-900 flex-1">{item.question}</span>
        {open ? <ChevronUp className="w-5 h-5 text-gray-400 flex-shrink-0" aria-hidden="true" /> : <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" aria-hidden="true" />}
      </button>
      {open && (
        <div id={`pfaq-${index}`} className="px-4 pb-4 -mt-1">
          <p className="text-sm text-gray-600 leading-relaxed">{item.answer}</p>
        </div>
      )}
    </div>
  );
}
