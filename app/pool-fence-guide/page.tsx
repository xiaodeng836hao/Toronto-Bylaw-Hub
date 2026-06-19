"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { poolFenceChecklist, OFFICIAL_311_URL } from "@/lib/mock-data";
import {
  CheckCircle2, Circle, ExternalLink, Waves, ShieldCheck, ShieldX, AlertTriangle,
  Info, ChevronDown, ChevronUp, ClipboardList, HardHat, Printer, BookOpen,
  Phone, Ruler, DoorClosed, Lock, Eye, Construction, ListChecks,
  Images, Maximize2, X, ChevronLeft, ChevronRight,
} from "lucide-react";

// ── Official sources ─────────────────────────────────────────────────────────
const CHAPTER_447_PDF = "https://www.toronto.ca/legdocs/municode/1184_447.pdf";
const CITY_FENCES_POOL =
  "https://www.toronto.ca/city-government/public-notices-bylaws/bylaw-enforcement/fences/?accordion=swimming-pool-enclosure";
const ZONING_CERT_POOL =
  "https://www.toronto.ca/services-payments/building-construction/building-permit/before-you-apply-for-a-building-permit/preliminary-zoning-reviews-information/apply-for-a-zoning-review/zoning-certificate-for-a-pool-fence-enclosure/";
const MLS_EMAIL = "MLSPoolPermits@toronto.ca";

function handlePrintChecklist() {
  if (typeof window !== "undefined") window.print();
}

const checklistCategories = ["All", "Structure", "Gates", "Permits"];

// ── Permit process (corrected) ───────────────────────────────────────────────
const PERMIT_STEPS = [
  { title: "Apply for a Zoning Certificate", desc: "Apply to Toronto Building for a Zoning Certificate for a Pool Fence Enclosure. This confirms the proposed enclosure meets zoning requirements for your property." },
  { title: "Apply for the Pool Fence Enclosure Permit", desc: "If the Zoning Certificate is approved, apply for a Pool Fence Enclosure Permit." },
  { title: "Submit the required documents", desc: "Generally: the completed Pool Fence Enclosure Permit application form, the approved Zoning Certificate, and the zoning-approved site plan/drawings showing fence location, fence height, and fence materials." },
  { title: "Email your application", desc: `Email the completed application and attachments to ${MLS_EMAIL}.`, email: true },
  { title: "Allow time for review", desc: "The City indicates a complete application may take approximately five business days to review, but it may take longer if information is missing or additional information is requested." },
  { title: "Arrange the inspection after construction", desc: "After the enclosure is built, arrange the required City inspection before filling or using the pool." },
];

// ── Homeowner preparation list (4 groups) ────────────────────────────────────
const PREP_GROUPS = [
  {
    group: "A. Before applying",
    items: [
      "Confirm whether your pool, hot tub, whirlpool, spa, or similar structure requires a pool enclosure.",
      "Check whether a locked-cover exemption may apply for a hot tub, whirlpool, or spa.",
      "Review the Chapter 447 pool enclosure requirements.",
      "Prepare a site plan before submitting the Zoning Certificate application.",
    ],
  },
  {
    group: "B. Site plan / drawing details to prepare",
    items: [
      "Property lines",
      "Pool location and pool dimensions",
      "Distance from the pool to the house",
      "Distance from the pool to the lot lines",
      "Location and size of any doors and windows facing or next to the pool area",
      "Location of pool equipment (heater, pump, filter)",
      "Distance from pool equipment to the lot lines",
      "Location of the proposed fence",
      "Height of the proposed fence",
      "Fence material",
      "Hard landscaping vs soft landscaping percentage, where applicable",
    ],
  },
  {
    group: "C. Preparing your submission",
    items: [
      "Make drawings scaled, dimensioned, and signed/dated where required.",
      "Use PDF format where the official process requires email submission.",
      "Prepare the completed Zoning Certificate / zoning review form.",
      "Prepare the Pool Fence Enclosure Permit application form after zoning approval.",
    ],
  },
  {
    group: "D. What not to forget",
    items: [
      "Do not fill or use the pool before the City inspection confirms the permanent enclosure complies.",
      "Keep your official confirmation and permit documents.",
      "Contact the City if you are unsure about anything before construction.",
    ],
  },
];

// ── Enclosure requirements ───────────────────────────────────────────────────
const ENCLOSURE_HEIGHTS = [
  { type: "Single residential property", height: "1.2 m" },
  { type: "Multiple residential property", height: "1.8 m" },
  { type: "Non-residential property", height: "1.8 m" },
];

const ENCLOSURE_RULES = [
  { icon: ShieldCheck, title: "Complete enclosure", text: "The pool area must be completely enclosed, with no opening except a gate that meets the bylaw. If a building wall forms part of the enclosure, there must be no door or access into the pool area through that wall." },
  { icon: DoorClosed, title: "Separate the pool from the house", text: "A compliant enclosure generally keeps building entrances outside the pool area. A rear door opening directly into the enclosed pool area may be a concern. Permitted: a gate as the only way in. Not permitted: a house door giving direct access into the pool area where prohibited." },
  { icon: Ruler, title: "Distance from the pool", text: "The enclosure must be no closer than 1.2 m horizontally to the water's edge." },
  { icon: AlertTriangle, title: "Distance from climbable objects", text: "The enclosure must be no closer than 1 m to easily climbable objects such as trees (unless the fence is at least 1.8 m high for 1 m on each side). Furniture, planters, retaining walls, stacked items, or equipment may also create access concerns if they help someone climb over." },
  { icon: ShieldX, title: "Non-climbable outside face", text: "The outside of the enclosure should not provide steps, rails, openings, or horizontal surfaces that help climbing. In particular, nothing on the outside between 100 mm (10 cm) and 1.2 m above the ground should help someone climb it." },
  { icon: Eye, title: "Visibility of the pool", text: "Where a fence separates the pool from a residential building on the same property, open-mesh chain-link or another open fence construction may be required so it does not block the view of the pool from doors or windows on the main living area that have a line of sight to the pool." },
];

const ENCLOSURE_MATERIALS = ["Chain-link", "Wood", "Metal picket", "Glass panel", "Masonry wall"];

// ── Gate requirements ────────────────────────────────────────────────────────
const GATE_RULES = [
  { title: "Substantial construction", desc: "Gates must be supported on substantial hinges and designed and maintained so they close properly." },
  { title: "Self-closing", desc: "When opened and released, the gate should close by itself without being pushed shut." },
  { title: "Self-latching", desc: "When the gate closes, the latch should engage automatically. The lockable self-latching device is located on the inside near the top of the gate, or on the outside at least 1.5 m above grade." },
  { title: "Kept locked", desc: "If no one is using the pool area, the gate should not be left unlocked or unsecured — it must be kept locked when the enclosed area is not in use." },
  { title: "Double gates", desc: "On a double gate, one leaf self-closes and self-latches, and the second leaf has a lockable drop bolt (extending into concrete, asphalt, or paving). Both leaves must stay secure and not create an opening." },
];

const GATE_PROBLEMS = [
  "Gate is tied or propped open",
  "Gate does not self-close",
  "Gate closes but does not latch",
  "Latch is broken or loose",
  "Double gate can be pushed open",
  "Gate is left unlocked when the pool area is not in use",
  "Gap under or beside the gate allows access",
];

// ── Temporary fencing ────────────────────────────────────────────────────────
const TEMP_BETTER = [
  "Fence panels secured to posts",
  "No large openings",
  "No loose bottom edge that can be lifted",
  "No gaps allowing access",
  "Stable gate or secured access point",
  "No climbable materials placed beside it",
];
const TEMP_PROBLEMS = [
  "Loose snow fence",
  "Fence tied only every other post",
  "Large gaps under panels",
  "Unsecured access point",
  "Panels that can be pushed aside",
  "Temporary fence lower than the required height",
  "Damaged or fallen panels",
];

// ── Common non-compliance ────────────────────────────────────────────────────
const NON_COMPLIANCE = [
  "Gate left propped or tied open",
  "Gate does not self-close or self-latch",
  "Latch reachable through a gap in the fence",
  "Climbable object (chair, planter, equipment) within 1 m of the fence",
  "Pool filled or used before the City inspection confirmed a compliant enclosure",
  "House door opening directly into the pool area where prohibited",
  "No permit or Zoning Certificate obtained before construction",
];

// ── FAQ ──────────────────────────────────────────────────────────────────────
const FAQ = [
  { q: "Do I need a permit for a pool fence enclosure?", a: "Generally yes. The City's process is to first obtain a Zoning Certificate for the pool fence enclosure, then apply for a Pool Fence Enclosure Permit. Always confirm with the official City source." },
  { q: "What do I need before applying for a Pool Fence Enclosure Permit?", a: "Generally an approved Zoning Certificate and a zoning-approved site plan showing the pool, the fence location, fence height, and fence materials, plus the completed permit application form." },
  { q: "Can I fill my pool before the inspection?", a: "No. The City indicates the pool should not be filled or used until an officer inspects and confirms a compliant permanent enclosure. (With approved temporary fencing during construction, water may be permitted, but the pool still cannot be used until the permanent enclosure passes inspection.)" },
  { q: "How high does the pool enclosure need to be?", a: "Generally 1.2 m for a single residential property, and 1.8 m for a multiple-residential or non-residential property, measured per Chapter 447." },
  { q: "Can my house wall be part of the pool enclosure?", a: "A building wall may form part of the enclosure, but generally there must be no door or access into the enclosed pool area through that wall. Building entrances should be outside the pool area." },
  { q: "Does the gate need to self-close and self-latch?", a: "Yes. A pool enclosure gate must self-close and self-latch, be on substantial hinges, and be kept locked when the pool area is not in use." },
  { q: "Can temporary fencing be used?", a: "Temporary fencing requirements depend on the situation. It may be allowed during construction if authorized by the City, but it is generally not a substitute for the required permanent enclosure. Always confirm with Chapter 447 or City staff." },
  { q: "What if my hot tub has a lockable cover?", a: "A whirlpool, hot tub, or spa may be exempt from the enclosure requirements if it has a substantial, structurally adequate cover that is permanently attached, and securely fastened and locked to prevent access whenever it is not in use. Confirm the exemption details in Chapter 447." },
  { q: "What should I check before calling for inspection?", a: "Use the compliance checklist below — full enclosure, correct height, distances from the pool and climbable objects, a non-climbable outside face, and a self-closing, self-latching, lockable gate. The checklist is a reference tool only, not an official inspection." },
];

const SOURCES = [
  { label: "Chapter 447, Fences (PDF)", href: CHAPTER_447_PDF, desc: "The full bylaw text, including § 447-1.3 swimming pool enclosures." },
  { label: "City of Toronto — Fences / Swimming Pool Enclosure", href: CITY_FENCES_POOL, desc: "Official pool fence enclosure permit information." },
  { label: "Zoning Certificate for a Pool Fence Enclosure", href: ZONING_CERT_POOL, desc: "How to apply for the zoning review you need first." },
];

// ── Visual Pool Fence Guide slides (3 provided illustrations) ─────────────────
interface VisualSlide {
  id: string;
  title: string;
  src: string;
  width: number;
  height: number;
  alt: string;
  caption: string;
}

const IMG_DIR = "/images/pool-fence-guide";

const VISUAL_SLIDES: VisualSlide[] = [
  {
    id: "quick-guide",
    title: "Toronto Quick Guide",
    src: `${IMG_DIR}/pool-fence-quick-guide.png`,
    width: 1055,
    height: 1491,
    alt: "Illustrated quick guide to Toronto swimming pool enclosure rules, including enclosure requirements, gate requirements, and permit steps.",
    caption: "Quick reference summary of common Toronto pool enclosure rules.",
  },
  {
    id: "compliant-examples",
    title: "Compliant and Non-Compliant Examples",
    src: `${IMG_DIR}/pool-fence-more-examples.png`,
    width: 1055,
    height: 1491,
    alt: "Illustrated examples of compliant and non-compliant pool fence situations, including climbable objects and unsafe access conditions.",
    caption: "Examples of compliant and non-compliant conditions, including climbable object issues.",
  },
  {
    id: "material-examples",
    title: "Fence Material Examples",
    src: `${IMG_DIR}/pool-fence-material-examples.png`,
    width: 1055,
    height: 1491,
    alt: "Illustrated examples of common pool fence materials, material rules, and materials generally not suitable for pool enclosures.",
    caption: "Examples of common fence materials and material-related rules for pool enclosures.",
  },
];

const VISUAL_DISCLAIMER =
  "These images are simplified educational examples only. Actual compliance depends on exact measurements, site conditions, and the official requirements of Toronto Municipal Code Chapter 447.";

export default function PoolFenceGuidePage() {
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [filterCat, setFilterCat] = useState("All");
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [lightbox, setLightbox] = useState<VisualSlide | null>(null);
  const [slide, setSlide] = useState(0);
  const [paused, setPaused] = useState(false);

  const slideCount = VISUAL_SLIDES.length;
  const goPrev = () => setSlide((s) => (s - 1 + slideCount) % slideCount);
  const goNext = () => setSlide((s) => (s + 1) % slideCount);

  // Jump the carousel to a specific slide and scroll the section into view
  // (used by the cross-reference links in other sections).
  const goToSlide = (index: number) => {
    setSlide(index);
    document.getElementById("visual-guide")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // Auto-advance the carousel (loops). Pauses on hover/focus and while the
  // lightbox is open.
  useEffect(() => {
    if (paused || lightbox) return;
    const t = setInterval(() => setSlide((s) => (s + 1) % slideCount), 5500);
    return () => clearInterval(t);
  }, [paused, lightbox, slideCount]);

  // Touch swipe handling for the carousel.
  const touchStartX = useRef<number | null>(null);
  const onTouchStart = (e: React.TouchEvent) => { touchStartX.current = e.touches[0].clientX; };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(dx) > 40) (dx < 0 ? goNext : goPrev)();
    touchStartX.current = null;
  };

  // Close the image lightbox with Escape and lock body scroll while open.
  useEffect(() => {
    if (!lightbox) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setLightbox(null); };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [lightbox]);

  const toggle = (id: string) => setChecked((p) => ({ ...p, [id]: !p[id] }));
  const filteredChecklist = poolFenceChecklist.filter((i) => filterCat === "All" || i.category === filterCat);
  const total = poolFenceChecklist.length;
  const done = poolFenceChecklist.filter((i) => checked[i.id]).length;
  const progress = total > 0 ? Math.round((done / total) * 100) : 0;

  return (
    <>
      {/* ════════ ON-SCREEN CONTENT (hidden when printing) ════════ */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 print:hidden">
        {/* 1 · Hero */}
        <div className="mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-50 text-cyan-600 text-xs font-medium mb-4">
            <Waves className="w-3.5 h-3.5" aria-hidden="true" />
            Chapter 447 — Fences (§ 447-1.3)
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">Pool Fence Enclosure Guide</h1>
          <p className="text-gray-500 max-w-2xl">
            A plain-language guide to Toronto&apos;s swimming pool enclosure rules — the permit process, what to prepare, enclosure and gate requirements, temporary fencing, and a printable compliance checklist. Based on Toronto Municipal Code Chapter 447 and official City of Toronto sources.
          </p>
        </div>

        {/* 2 · Important disclaimer */}
        <div className="mb-8 p-4 rounded-xl border border-amber-200 bg-amber-50 flex gap-3">
          <Info className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" aria-hidden="true" />
          <p className="text-sm text-amber-800">
            This guide is for general reference only and is not legal advice or an official determination. Requirements depend on your property and zone. Always confirm the exact requirements with Chapter 447 and the official City of Toronto sources before building.
          </p>
        </div>

        <div className="flex flex-col gap-6">
          {/* 3 · Permit Application Process */}
          <section className="bg-white rounded-2xl border border-gray-100 subtle-shadow p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-1 flex items-center gap-2">
              <ClipboardList className="w-5 h-5 text-cyan-500" aria-hidden="true" /> Permit Application Process
            </h2>
            <p className="text-sm text-gray-500 mb-5">The City indicates the general process is a Zoning Certificate first, then the Pool Fence Enclosure Permit. Always confirm with the official City source.</p>
            <ol className="flex flex-col gap-4">
              {PERMIT_STEPS.map((s, i) => (
                <li key={s.title} className="flex gap-4">
                  <div className="w-8 h-8 bg-cyan-600 text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">{i + 1}</div>
                  <div className="pt-0.5">
                    <p className="font-semibold text-gray-900 text-sm">{s.title}</p>
                    <p className="text-sm text-gray-500 mt-0.5">
                      {s.email ? (
                        <>Email the completed application and attachments to{" "}
                          <a href={`mailto:${MLS_EMAIL}`} className="text-cyan-600 hover:text-cyan-700 font-medium">{MLS_EMAIL}</a>.
                        </>
                      ) : s.desc}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
            <div className="flex flex-wrap gap-2 mt-5">
              <a href={CITY_FENCES_POOL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-600 text-white text-sm font-medium rounded-lg hover:bg-cyan-700 transition-colors">
                <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" /> City Pool Enclosure Page
              </a>
              <a href={ZONING_CERT_POOL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors">
                <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" /> Zoning Certificate Info
              </a>
            </div>
          </section>

          {/* 4 · Homeowner Preparation List */}
          <section className="bg-white rounded-2xl border border-gray-100 subtle-shadow p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-1 flex items-center gap-2">
              <HardHat className="w-5 h-5 text-amber-500" aria-hidden="true" /> Homeowner Preparation List
            </h2>
            <p className="text-sm text-gray-500 mb-5">Practical things to confirm and prepare for the Zoning Certificate and permit — no photo ID or grading plan needed for the pool fence enclosure review.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {PREP_GROUPS.map((g) => (
                <div key={g.group} className="rounded-xl border border-gray-100 p-4">
                  <p className="text-sm font-semibold text-gray-900 mb-2">{g.group}</p>
                  <ul className="flex flex-col gap-1.5">
                    {g.items.map((it) => (
                      <li key={it} className="flex items-start gap-2 text-sm text-gray-600">
                        <CheckCircle2 className="w-4 h-4 text-cyan-500 flex-shrink-0 mt-0.5" aria-hidden="true" /> {it}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          {/* 5 · Enclosure Requirements */}
          <section className="bg-white rounded-2xl border border-gray-100 subtle-shadow p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-2 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-cyan-500" aria-hidden="true" /> Enclosure Requirements
            </h2>
            <p className="text-sm text-gray-500 mb-5">
              See the{" "}
              <button type="button" onClick={() => goToSlide(0)} className="text-cyan-600 hover:text-cyan-700 font-medium underline-offset-2 hover:underline">Toronto Quick Guide</button>{" "}and{" "}
              <button type="button" onClick={() => goToSlide(1)} className="text-cyan-600 hover:text-cyan-700 font-medium underline-offset-2 hover:underline">Compliant / Non-Compliant Examples</button>{" "}in the visual guide below.
            </p>

            {/* Height table */}
            <div className="mb-5 rounded-xl border border-cyan-100 bg-cyan-50/50 p-4">
              <p className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-1.5"><Ruler className="w-4 h-4 text-cyan-600" aria-hidden="true" /> Minimum enclosure height (§ 447-1.3D)</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {ENCLOSURE_HEIGHTS.map((h) => (
                  <div key={h.type} className="rounded-lg bg-white border border-cyan-100 p-3 text-center">
                    <p className="text-2xl font-bold text-cyan-700">{h.height}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{h.type}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {ENCLOSURE_RULES.map((r) => {
                const Icon = r.icon;
                return (
                  <div key={r.title} className="rounded-xl border border-gray-100 p-4">
                    <p className="flex items-center gap-2 text-sm font-semibold text-gray-900 mb-1.5"><Icon className="w-4 h-4 text-cyan-500 flex-shrink-0" aria-hidden="true" /> {r.title}</p>
                    <p className="text-sm text-gray-600 leading-relaxed">{r.text}</p>
                  </div>
                );
              })}
            </div>

            <div className="mt-4 rounded-xl border border-gray-100 p-4">
              <p className="text-sm font-semibold text-gray-900 mb-2">Permitted construction types</p>
              <div className="flex flex-wrap gap-2 mb-2">
                {ENCLOSURE_MATERIALS.map((m) => (
                  <span key={m} className="text-xs font-medium bg-gray-100 text-gray-700 px-2.5 py-1 rounded-full">{m}</span>
                ))}
              </div>
              <p className="text-xs text-gray-500">Each material type has specific construction requirements (mesh size, spacing, supports, safety glass, etc.). See Chapter 447 for the exact wording.</p>
            </div>
          </section>

          {/* 6 · Gate Requirements */}
          <section className="bg-white rounded-2xl border border-gray-100 subtle-shadow p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-2 flex items-center gap-2">
              <Lock className="w-5 h-5 text-cyan-500" aria-hidden="true" /> Gate Requirements
            </h2>
            <p className="text-sm text-gray-500 mb-5">
              See the{" "}
              <button type="button" onClick={() => goToSlide(1)} className="text-cyan-600 hover:text-cyan-700 font-medium underline-offset-2 hover:underline">illustrated examples</button>{" "}in the visual guide below for common gate and access issues.
            </p>
            <div className="flex flex-col gap-3 mb-5">
              {GATE_RULES.map((g) => (
                <div key={g.title} className="flex gap-3 p-4 rounded-xl bg-gray-50 border border-gray-100">
                  <CheckCircle2 className="w-4 h-4 text-cyan-500 flex-shrink-0 mt-0.5" aria-hidden="true" />
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{g.title}</p>
                    <p className="text-sm text-gray-600 mt-0.5">{g.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="rounded-xl border border-red-100 bg-red-50/60 p-4">
              <p className="flex items-center gap-2 text-sm font-semibold text-red-800 mb-2"><ShieldX className="w-4 h-4" aria-hidden="true" /> Common gate problems</p>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                {GATE_PROBLEMS.map((p) => (
                  <li key={p} className="flex items-start gap-2 text-sm text-red-900"><AlertTriangle className="w-3.5 h-3.5 text-red-500 flex-shrink-0 mt-0.5" aria-hidden="true" /> {p}</li>
                ))}
              </ul>
            </div>
          </section>

          {/* 7 · Visual Pool Fence Guide */}
          <section id="visual-guide" className="bg-white rounded-2xl border border-gray-100 subtle-shadow p-6 scroll-mt-24">
            <h2 className="text-xl font-bold text-gray-900 mb-1 flex items-center gap-2">
              <Images className="w-5 h-5 text-cyan-500" aria-hidden="true" /> Visual Pool Fence Guide
            </h2>
            <p className="text-sm text-gray-500 mb-4">
              These illustrated examples help explain key pool enclosure rules, common non-compliant situations, and common fence material examples under Toronto&apos;s pool fence requirements.
            </p>
            <div className="mb-6 p-3.5 rounded-xl border border-amber-200 bg-amber-50 flex gap-2.5">
              <Info className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" aria-hidden="true" />
              <p className="text-xs text-amber-800">{VISUAL_DISCLAIMER}</p>
            </div>

            {/* Swipeable, auto-looping image carousel */}
            <div
              className="relative"
              onMouseEnter={() => setPaused(true)}
              onMouseLeave={() => setPaused(false)}
              onFocusCapture={() => setPaused(true)}
              onBlurCapture={() => setPaused(false)}
              role="group"
              aria-roledescription="carousel"
              aria-label="Pool fence illustrations"
            >
              <p className="text-sm font-semibold text-gray-900 mb-3" aria-live="polite">
                <span className="text-cyan-600">{slide + 1} / {slideCount}</span> · {VISUAL_SLIDES[slide].title}
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
                        className="group relative block w-full h-[58vh] sm:h-[600px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-cyan-500"
                      >
                        <Image
                          src={s.src}
                          fill
                          alt={s.alt}
                          sizes="(max-width: 896px) 100vw, 800px"
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
                  className="absolute left-2 top-1/2 -translate-y-1/2 inline-flex items-center justify-center w-9 h-9 rounded-full bg-white/90 text-gray-700 shadow hover:bg-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500"
                >
                  <ChevronLeft className="w-5 h-5" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={goNext}
                  aria-label="Next image"
                  className="absolute right-2 top-1/2 -translate-y-1/2 inline-flex items-center justify-center w-9 h-9 rounded-full bg-white/90 text-gray-700 shadow hover:bg-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500"
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
                    className={`h-2 rounded-full transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 ${slide === i ? "w-6 bg-cyan-600" : "w-2 bg-gray-300 hover:bg-gray-400"}`}
                  />
                ))}
              </div>
            </div>
          </section>

          {/* 8 · Temporary Fencing */}
          <section className="bg-white rounded-2xl border border-gray-100 subtle-shadow p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-2 flex items-center gap-2">
              <Construction className="w-5 h-5 text-amber-500" aria-hidden="true" /> Temporary Fencing
            </h2>
            <p className="text-sm text-gray-600 leading-relaxed mb-4">
              Temporary fencing requirements depend on the situation. During pool construction it may be allowed if authorized by the City, but it should not be assumed to satisfy the permanent enclosure requirements. Snow fencing is treated differently where the bylaw allows. Any temporary fence around a pool or unsafe condition must effectively prevent access, be stable and secured, and not be easily moved or opened. If used before the permanent enclosure is complete, confirm requirements with the City — it is not a substitute for the required permanent pool enclosure unless the bylaw or City direction allows it.
            </p>
            <p className="text-sm text-gray-500 mb-4">
              See the{" "}
              <button type="button" onClick={() => goToSlide(2)} className="text-cyan-600 hover:text-cyan-700 font-medium underline-offset-2 hover:underline">Fence Material Examples</button>{" "}in the visual guide above for material suitability context.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="rounded-xl border border-green-100 bg-green-50/60 p-4">
                <p className="flex items-center gap-2 text-sm font-semibold text-green-800 mb-2"><ShieldCheck className="w-4 h-4" aria-hidden="true" /> Better temporary condition</p>
                <ul className="flex flex-col gap-1.5">
                  {TEMP_BETTER.map((t) => (
                    <li key={t} className="flex items-start gap-2 text-sm text-green-900"><CheckCircle2 className="w-3.5 h-3.5 text-green-500 flex-shrink-0 mt-0.5" aria-hidden="true" /> {t}</li>
                  ))}
                </ul>
              </div>
              <div className="rounded-xl border border-red-100 bg-red-50/60 p-4">
                <p className="flex items-center gap-2 text-sm font-semibold text-red-800 mb-2"><ShieldX className="w-4 h-4" aria-hidden="true" /> Problem examples</p>
                <ul className="flex flex-col gap-1.5">
                  {TEMP_PROBLEMS.map((t) => (
                    <li key={t} className="flex items-start gap-2 text-sm text-red-900"><AlertTriangle className="w-3.5 h-3.5 text-red-500 flex-shrink-0 mt-0.5" aria-hidden="true" /> {t}</li>
                  ))}
                </ul>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-3">Always confirm temporary fencing requirements with Chapter 447 or City staff.</p>
          </section>

          {/* 8 · Common Non-Compliance Examples */}
          <section className="bg-white rounded-2xl border border-gray-100 subtle-shadow p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <ShieldX className="w-5 h-5 text-red-500" aria-hidden="true" /> Common Non-Compliance Examples
            </h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {NON_COMPLIANCE.map((n) => (
                <li key={n} className="flex items-start gap-2 text-sm text-gray-700"><AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" aria-hidden="true" /> {n}</li>
              ))}
            </ul>
          </section>

          {/* 9 · Compliance Checklist */}
          <section className="bg-white rounded-2xl border border-gray-100 subtle-shadow p-6">
            <div className="flex items-center justify-between mb-1">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <ListChecks className="w-5 h-5 text-cyan-500" aria-hidden="true" /> Compliance Checklist
              </h2>
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${progress === 100 ? "text-green-700 bg-green-50" : "text-cyan-700 bg-cyan-50"}`}>{done}/{total}</span>
            </div>
            <p className="text-sm text-gray-500 mb-4">A quick self-check. Print it (button below) to get a copy with a comment line under each item.</p>

            <div className="w-full bg-gray-100 rounded-full h-2 mb-4">
              <div className={`h-2 rounded-full transition-all ${progress === 100 ? "bg-green-500" : "bg-cyan-500"}`} style={{ width: `${progress}%` }} />
            </div>

            <div className="flex flex-wrap gap-1.5 mb-4">
              {checklistCategories.map((cat) => (
                <button key={cat} onClick={() => setFilterCat(cat)} aria-pressed={filterCat === cat}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${filterCat === cat ? "bg-cyan-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
                  {cat}
                </button>
              ))}
            </div>

            <div className="flex flex-col gap-1">
              {filteredChecklist.map((item) => (
                <button key={item.id} onClick={() => toggle(item.id)}
                  className="flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors text-left w-full group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500">
                  {checked[item.id]
                    ? <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" aria-hidden="true" />
                    : <Circle className="w-5 h-5 text-gray-300 group-hover:text-gray-400 flex-shrink-0 mt-0.5 transition-colors" aria-hidden="true" />}
                  <div>
                    <p className={`text-sm font-medium ${checked[item.id] ? "line-through text-gray-400" : "text-gray-800"}`}>{item.title}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{item.description}</p>
                  </div>
                </button>
              ))}
            </div>

            <div className="mt-3 p-3 rounded-lg bg-gray-50 border border-gray-100 text-xs text-gray-500">
              This checklist is a reference tool only and does not replace an official City inspection or the exact requirements of Chapter 447.
            </div>

            {/* 10 · Print button */}
            <div className="mt-4 flex flex-wrap gap-2">
              <button onClick={handlePrintChecklist}
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-cyan-600 text-white text-sm font-medium rounded-xl hover:bg-cyan-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:ring-offset-2">
                <Printer className="w-4 h-4" aria-hidden="true" /> Print Checklist
              </button>
              <button onClick={() => setChecked({})} className="inline-flex items-center px-4 py-2.5 text-sm text-gray-500 hover:text-gray-700 transition-colors">
                Reset
              </button>
            </div>
          </section>

          {/* 11 · FAQ */}
          <section className="bg-white rounded-2xl border border-gray-100 subtle-shadow p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-3">Frequently Asked Questions</h2>
            <div className="flex flex-col divide-y divide-gray-100">
              {FAQ.map((item, i) => (
                <div key={item.q}>
                  <button onClick={() => setOpenFaq(openFaq === i ? null : i)} aria-expanded={openFaq === i}
                    className="w-full text-left py-4 flex items-start justify-between gap-4 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 rounded">
                    <span className="text-sm font-semibold text-gray-900 group-hover:text-cyan-700 transition-colors pr-2">{item.q}</span>
                    {openFaq === i ? <ChevronUp className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" aria-hidden="true" /> : <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" aria-hidden="true" />}
                  </button>
                  {openFaq === i && <p className="text-sm text-gray-600 leading-relaxed pb-4">{item.a}</p>}
                </div>
              ))}
            </div>
          </section>

          {/* 12 · Official Sources */}
          <section className="bg-white rounded-2xl border border-gray-100 subtle-shadow p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-cyan-500" aria-hidden="true" /> Official Sources
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {SOURCES.map((s) => (
                <a key={s.href} href={s.href} target="_blank" rel="noopener noreferrer"
                  className="group flex items-start justify-between gap-3 p-4 rounded-xl border border-gray-100 hover:border-cyan-200 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500">
                  <div>
                    <p className="text-sm font-medium text-gray-900 group-hover:text-cyan-700 transition-colors">{s.label}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{s.desc}</p>
                  </div>
                  <ExternalLink className="w-4 h-4 text-gray-300 group-hover:text-cyan-400 flex-shrink-0" aria-hidden="true" />
                </a>
              ))}
              <Link href="/tmc-chapters/447" className="group flex items-start justify-between gap-3 p-4 rounded-xl border border-gray-100 hover:border-cyan-200 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500">
                <div>
                  <p className="text-sm font-medium text-gray-900 group-hover:text-cyan-700 transition-colors">Chapter 447 on this site</p>
                  <p className="text-xs text-gray-500 mt-0.5">Plain-language summary of the Fences chapter.</p>
                </div>
                <BookOpen className="w-4 h-4 text-gray-300 group-hover:text-cyan-400 flex-shrink-0" aria-hidden="true" />
              </Link>
            </div>
            <div className="mt-4 rounded-xl bg-cyan-600 p-5 text-white flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="flex-1">
                <p className="font-bold text-sm mb-0.5">Questions, or need to report a pool fence concern?</p>
                <p className="text-cyan-100 text-xs">Toronto Building: 416-338-0338 · toronto.ca/building</p>
              </div>
              <a href={OFFICIAL_311_URL} target="_blank" rel="noopener noreferrer"
                className="flex-shrink-0 inline-flex items-center gap-1.5 px-3.5 py-2 bg-white text-cyan-700 text-sm font-medium rounded-lg hover:bg-cyan-50 transition-colors">
                <Phone className="w-3.5 h-3.5" aria-hidden="true" /> Report through Toronto 311
              </a>
            </div>
          </section>
        </div>
      </div>

      {/* Image lightbox (click-to-enlarge) */}
      {lightbox && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 print:hidden"
          role="dialog"
          aria-modal="true"
          aria-label={`${lightbox.title} — enlarged image`}
          onClick={() => setLightbox(null)}
        >
          <button
            type="button"
            autoFocus
            onClick={() => setLightbox(null)}
            aria-label="Close enlarged image"
            className="absolute top-4 right-4 inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/15 text-white hover:bg-white/25 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
          <figure className="m-0 max-w-5xl" onClick={(e) => e.stopPropagation()}>
            <Image
              src={lightbox.src}
              width={lightbox.width}
              height={lightbox.height}
              alt={lightbox.alt}
              sizes="100vw"
              className="w-auto h-auto max-h-[86vh] max-w-full rounded-lg mx-auto"
            />
            <figcaption className="text-center text-xs text-gray-200 mt-2">{lightbox.caption}</figcaption>
          </figure>
        </div>
      )}

      {/* ════════ PRINT-ONLY CHECKLIST ════════ */}
      <div className="print-area hidden print:block" style={{ fontFamily: "system-ui, sans-serif", fontSize: 12, color: "#111", lineHeight: 1.4 }}>
        <h1 style={{ fontSize: 18, fontWeight: 700, margin: "0 0 2px" }}>Toronto Pool Fence Enclosure — Compliance Checklist</h1>
        <p style={{ fontSize: 11, color: "#444", margin: "0 0 10px" }}>Based on Toronto Municipal Code Chapter 447 (§ 447-1.3). Reference tool only — confirm with the City and an official inspection.</p>

        <div style={{ display: "flex", flexWrap: "wrap", gap: "4px 24px", fontSize: 11, margin: "0 0 12px" }}>
          <span>Property address: ______________________________</span>
          <span>Date: ____________________</span>
          <span>Reviewed by: ____________________</span>
        </div>

        <div>
          {poolFenceChecklist.map((item) => (
            <div key={item.id} className="pf-print-item" style={{ padding: "6px 0", borderBottom: "1px solid #ddd" }}>
              <div style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                <span style={{ display: "inline-block", width: 13, height: 13, border: "1.5px solid #333", borderRadius: 2, flexShrink: 0, marginTop: 1 }} />
                <span style={{ fontSize: 12, fontWeight: 600 }}>{item.title}</span>
              </div>
              <div style={{ marginLeft: 21, marginTop: 4, fontSize: 10, color: "#555" }}>
                Comment: <span style={{ display: "inline-block", borderBottom: "1px solid #999", width: "78%" }} />
              </div>
            </div>
          ))}
        </div>

        <p style={{ fontSize: 10, color: "#666", marginTop: 12 }}>
          This checklist is a reference tool only and does not replace an official City inspection or the exact requirements of Chapter 447. Sources: Chapter 447 (toronto.ca/legdocs/municode/1184_447.pdf) · Toronto Building 416-338-0338.
        </p>
      </div>
    </>
  );
}
