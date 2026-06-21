import Link from "next/link";
import SearchBar from "@/components/SearchBar";
import { OFFICIAL_311_URL, bylawChapters, zoningTopics } from "@/lib/mock-data";
import { prohibitedPlants } from "@/lib/prohibited-plants";
import { siteConfig } from "@/lib/site-config";
import {
  Camera, Waves, MapPin, MessageSquare, Phone, Leaf,
  ArrowRight, BookOpen, FileText, AlertTriangle, CheckSquare,
  ExternalLink, ChevronRight, Clock,
} from "lucide-react";

const featureCards = [
  {
    href: "/tmc-chapters",
    icon: BookOpen,
    title: "Toronto Municipal Code Chapters",
    description: "Browse and search Toronto Municipal Code chapters with plain-language summaries, common examples, official sources, and PDF downloads.",
    color: "from-blue-50 to-blue-100",
    ring: "ring-blue-600/10",
    iconColor: "text-blue-600",
    badge: "Bylaw Search",
  },
  {
    href: "/photo-review",
    icon: Camera,
    title: "Photo Review Helper",
    description: "Upload a photo and choose an issue type to see a preliminary reference match to a likely bylaw chapter, with an evidence checklist.",
    color: "from-violet-50 to-violet-100",
    ring: "ring-violet-600/10",
    iconColor: "text-violet-600",
    badge: "Preliminary Helper",
  },
  {
    href: "/pool-fence-guide",
    icon: Waves,
    title: "Pool Fence & Enclosure Guide",
    description: "Understand pool enclosure permits, fence height, and gate rules — with a printable inspection checklist.",
    color: "from-cyan-50 to-cyan-100",
    ring: "ring-cyan-600/10",
    iconColor: "text-cyan-600",
    badge: "Chapter 447",
  },
  {
    href: "/zoning",
    icon: MapPin,
    title: "Zoning Guide",
    description: "Plain-language answers to common zoning questions: front yard parking, setbacks, accessory structures, landscaping, and more.",
    color: "from-emerald-50 to-emerald-100",
    ring: "ring-emerald-600/10",
    iconColor: "text-emerald-600",
    badge: "By-law 569-2013",
  },
  {
    href: "/prohibited-plants",
    icon: Leaf,
    title: "Prohibited Plants Identifier",
    description: "Explore Toronto's prohibited plants, compare their seasonal appearance, and learn safe, resident-friendly removal methods.",
    color: "from-green-50 to-green-100",
    ring: "ring-green-600/10",
    iconColor: "text-green-600",
    badge: "Chapter 489",
    cta: "Explore Prohibited Plants",
  },
  {
    href: "/feedback",
    icon: MessageSquare,
    title: "Submit Feedback",
    description: "Report bugs, suggest missing bylaws, or correct content. Your input helps improve this public reference tool.",
    color: "from-amber-50 to-amber-100",
    ring: "ring-amber-600/10",
    iconColor: "text-amber-600",
    badge: "Open to All",
  },
];

// Site-coverage stats — computed from the content data so they stay accurate.
const quickStats = [
  { label: "Bylaw chapters", value: String(bylawChapters.length) },
  { label: "Zoning topics", value: String(zoningTopics.length) },
  { label: "Prohibited plants", value: String(prohibitedPlants.length) },
  { label: "Reference tools", value: "5" },
];

const commonViolations = [
  { chapter: "629", slug: "629", title: "Property Standards", example: "Damaged cladding, broken windows, unsafe stairs", color: "from-blue-500 to-blue-700" },
  { chapter: "489", slug: "489", title: "Turfgrass & Weeds", example: "Grass or weeds above the permitted height", color: "from-green-500 to-green-700" },
  { chapter: "485", slug: "485", title: "Graffiti", example: "Graffiti on walls, fences, or utility boxes", color: "from-purple-500 to-purple-700" },
  { chapter: "447", slug: "447", title: "Fences & Pool Enclosures", example: "Non-compliant pool gate, fence height issue", color: "from-cyan-500 to-cyan-700" },
  { chapter: "548", slug: "548", title: "Littering & Dumping", example: "Illegal dumping of furniture or appliances", color: "from-red-500 to-red-700" },
  { chapter: "497", slug: "497", title: "Heating", example: "Inadequate heat in a rental during winter", color: "from-orange-500 to-orange-700" },
];

export default function Home() {
  return (
    <div>
      {/* Hero Section */}
      <section
        className="relative overflow-hidden border-b border-blue-100/60 bg-gradient-to-b from-[#e9f1ff] via-[#f1f6ff] to-[#f6f8fb]"
        aria-label="Introduction"
      >
        {/* Soft colour glows */}
        <div aria-hidden className="pointer-events-none absolute -top-32 -right-24 h-96 w-96 rounded-full bg-blue-300/20 blur-3xl" />
        <div aria-hidden className="pointer-events-none absolute -bottom-16 left-1/4 h-80 w-80 rounded-full bg-cyan-200/30 blur-3xl" />
        <div aria-hidden className="pointer-events-none absolute bottom-0 right-1/4 h-72 w-72 rounded-full bg-sky-200/25 blur-3xl" />

        {/* Warm horizon glow behind the skyline (premium depth) */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-56"
          style={{ background: "radial-gradient(120% 100% at 62% 100%, rgba(56,189,248,0.18), rgba(255,255,255,0) 68%)" }}
        />

        {/* Dotted grid accent */}
        <svg aria-hidden className="pointer-events-none absolute right-6 top-8 hidden text-blue-300/50 sm:block lg:right-12" width="132" height="84">
          <pattern id="hero-dots" x="0" y="0" width="16" height="16" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1.5" fill="currentColor" />
          </pattern>
          <rect width="132" height="84" fill="url(#hero-dots)" />
        </svg>

        {/* ── Toronto skyline (inline SVG, layered for depth — no external image) ── */}
        {/* Back layer: distant towers, lightest */}
        <svg
          aria-hidden
          viewBox="0 0 1440 220"
          preserveAspectRatio="none"
          className="pointer-events-none absolute inset-x-0 bottom-0 h-28 w-full text-blue-200/30 sm:h-40"
        >
          <path
            fill="currentColor"
            d="M0,220 V130 H60 V100 H110 V150 H180 V80 H240 V120 H300 V60 H340 V110 H410 V70 H480 V130 H540 V50 H610 V110 H670 V80 H740 V120 H810 V60 H890 V120 H960 V90 H1030 V130 H1100 V70 H1170 V115 H1240 V85 H1320 V135 H1390 V105 H1440 V220 Z"
          />
        </svg>

        {/* The CN Tower — Toronto's defining landmark (kept proportional, rises from behind the core) */}
        <svg
          aria-hidden
          viewBox="0 0 120 360"
          preserveAspectRatio="xMidYMax meet"
          className="pointer-events-none absolute bottom-0 right-[16%] hidden h-52 text-blue-300/45 sm:block lg:h-64"
        >
          <g fill="currentColor">
            {/* antenna mast */}
            <rect x="58.5" y="6" width="3" height="76" rx="1.5" />
            {/* SkyPod */}
            <ellipse cx="60" cy="86" rx="7" ry="5" />
            {/* upper shaft */}
            <path d="M56,90 H64 L66,152 H54 Z" />
            {/* main pod (the round observation deck) */}
            <ellipse cx="60" cy="166" rx="20" ry="14" />
            {/* tapering lower body flaring to the base */}
            <path d="M54,176 L50,300 C49,330 44,350 36,360 H84 C76,350 71,330 70,300 L66,176 Z" />
          </g>
        </svg>

        {/* Front layer: closer towers, slightly stronger — overlaps the CN Tower base for depth */}
        <svg
          aria-hidden
          viewBox="0 0 1440 160"
          preserveAspectRatio="none"
          className="pointer-events-none absolute inset-x-0 bottom-0 h-20 w-full text-blue-300/40 sm:h-28"
        >
          <path
            fill="currentColor"
            d="M0,160 V115 H80 V95 H150 V125 H230 V85 H300 V120 H380 V75 H450 V125 H520 V100 H600 V128 H680 V90 H760 V122 H840 V105 H920 V132 H1000 V95 H1080 V122 H1160 V105 H1240 V130 H1320 V100 H1400 V122 H1440 V160 Z"
          />
        </svg>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-24 md:pt-24 md:pb-32">
          <span className="inline-flex w-fit items-center gap-2 rounded-full bg-white/80 px-3 py-1 text-xs font-medium text-blue-700 ring-1 ring-blue-100 backdrop-blur">
            <AlertTriangle className="w-3.5 h-3.5" aria-hidden="true" />
            Informational reference tool · Not official legal advice
          </span>

          <h1 className="mt-6 max-w-3xl text-4xl font-bold leading-[1.05] tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
            Toronto{" "}
            <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
              Bylaw Guide
            </span>
          </h1>

          <p className="mt-5 max-w-2xl text-base leading-relaxed text-gray-600 sm:text-lg">
            Search the Toronto Municipal Code, understand common bylaw rules in plain
            language, and find the right official City resource — all in one
            resident-friendly place.
          </p>

          <div className="mt-8 max-w-2xl">
            <SearchBar />
          </div>

          {/* Popular searches */}
          <div className="mt-4 flex flex-wrap items-center gap-2 text-sm">
            <span className="text-gray-500">Popular:</span>
            {["garbage", "pool fence", "long grass", "heating", "graffiti"].map((term) => (
              <Link
                key={term}
                href={`/search?q=${encodeURIComponent(term)}`}
                className="rounded-full bg-white/70 px-3 py-1 text-gray-600 ring-1 ring-gray-200 transition-colors hover:text-blue-700 hover:ring-blue-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              >
                {term}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="border-b border-gray-100 bg-white" aria-label="At a glance">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-7">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-y-6">
            {quickStats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="font-mono text-3xl font-semibold tracking-tight text-gray-900 tabular-nums">{stat.value}</p>
                <p className="text-xs text-gray-500 mt-1.5">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Cards Bento Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="mb-10">
          <p className="kicker text-blue-600 mb-2.5">Tools &amp; Guides</p>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">What would you like to do?</h2>
          <p className="text-gray-500">Choose a tool below, or search across everything from the box above.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {featureCards.map((card) => {
            const Icon = card.icon;
            return (
              <Link
                key={card.href}
                href={card.href}
                className="group bg-white rounded-2xl p-6 border border-gray-100 subtle-shadow card-hover flex flex-col gap-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
              >
                <div className="flex items-start justify-between">
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center bg-gradient-to-br ${card.color} ring-1 ring-inset ${card.ring} shadow-[inset_0_1px_0_rgba(255,255,255,0.7)]`}>
                    <Icon className={`w-5 h-5 ${card.iconColor}`} aria-hidden="true" />
                  </div>
                  <span className="kicker text-gray-400 pt-1">
                    {card.badge}
                  </span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1.5 group-hover:text-blue-700 transition-colors">
                    {card.title}
                  </h3>
                  <p className="text-sm text-gray-500 leading-relaxed">
                    {card.description}
                  </p>
                </div>
                <div className="flex items-center gap-1 text-sm text-blue-600 font-medium mt-auto">
                  {"cta" in card && card.cta ? card.cta : "Get started"}
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
                </div>
              </Link>
            );
          })}

          {/* External: Report to Toronto 311 */}
          <a
            href={OFFICIAL_311_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative overflow-hidden rounded-2xl p-6 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 ring-1 ring-inset ring-white/10 subtle-shadow card-hover flex flex-col gap-4 text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300 focus-visible:ring-offset-2"
          >
            <div aria-hidden className="pointer-events-none absolute inset-0">
              <div className="absolute inset-x-0 -top-1/3 h-2/3" style={{ background: "radial-gradient(80% 100% at 50% 0%, rgba(255,255,255,0.16), transparent 70%)" }} />
              <div className="absolute -bottom-10 -right-8 h-36 w-36 rounded-full bg-cyan-300/25 blur-2xl" />
            </div>
            <div className="relative flex items-start justify-between">
              <div className="w-11 h-11 bg-white/15 rounded-xl flex items-center justify-center ring-1 ring-inset ring-white/10">
                <Phone className="w-5 h-5 text-white" aria-hidden="true" />
              </div>
              <span className="kicker text-blue-100/90 pt-1">
                Official City Service
              </span>
            </div>
            <div className="relative">
              <h3 className="font-semibold mb-1.5">Report to Toronto 311</h3>
              <p className="text-sm text-blue-50 leading-relaxed">
                Use the official City of Toronto 311 service request page to submit complaints or service requests.
              </p>
            </div>
            <div className="relative flex items-center gap-1 text-sm font-medium mt-auto">
              Visit Toronto 311
              <ExternalLink className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
            </div>
          </a>
        </div>

        {/* Noise — Coming Soon */}
        <Link
          href="/noise-complaints"
          className="group mt-5 flex items-center gap-4 p-5 rounded-2xl border border-dashed border-gray-300 bg-gray-50/60 hover:bg-white hover:border-gray-300 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
        >
          <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 bg-gradient-to-br from-gray-50 to-gray-100 ring-1 ring-inset ring-black/[0.04] shadow-[inset_0_1px_0_rgba(255,255,255,0.7)]">
            <Clock className="w-5 h-5 text-gray-400" aria-hidden="true" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-gray-700">Noise Complaints</h3>
              <span className="text-xs font-medium text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">Coming Soon</span>
            </div>
            <p className="text-sm text-gray-500 mt-0.5">Content under development — noise guidance is not yet available.</p>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-gray-400 transition-colors" aria-hidden="true" />
        </Link>
      </section>

      {/* Common Violations Quick Reference */}
      <section className="bg-white border-y border-gray-100" aria-label="Common bylaw topics">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
            <div>
              <p className="kicker text-blue-600 mb-2.5">Quick Reference</p>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Common Bylaw Topics</h2>
              <p className="text-gray-500">Frequently asked-about bylaw issues in Toronto.</p>
            </div>
            <Link href="/tmc-chapters" className="text-sm text-blue-600 font-medium hover:text-blue-700 flex items-center gap-1 whitespace-nowrap rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500">
              View all chapters <ChevronRight className="w-4 h-4" aria-hidden="true" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {commonViolations.map((item) => (
              <Link
                key={item.chapter}
                href={`/tmc-chapters/${item.slug}`}
                className="flex items-start gap-4 p-4 rounded-xl border border-gray-100 bg-gray-50/50 hover:bg-white hover:border-gray-200 hover:subtle-shadow transition-all group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
              >
                <div className={`bg-gradient-to-br ${item.color} text-white text-xs font-bold rounded-lg px-2 py-1 min-w-[52px] text-center flex-shrink-0 ring-1 ring-inset ring-white/15 shadow-[inset_0_1px_0_rgba(255,255,255,0.25)]`}>
                  Ch. {item.chapter}
                </div>
                <div>
                  <p className="font-medium text-gray-900 text-sm group-hover:text-blue-700 transition-colors">{item.title}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{item.example}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-300 ml-auto flex-shrink-0 group-hover:text-blue-400 transition-colors" aria-hidden="true" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Trust / About band */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16" aria-label="About this site">
        <div className="rounded-2xl border border-gray-100 bg-white subtle-shadow p-6 md:p-8">
          <p className="kicker text-blue-600 mb-2.5">About this site</p>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Built for plain-language bylaw understanding</h2>
          <p className="text-gray-500 max-w-2xl">
            {siteConfig.shortName} is an independent public reference tool designed to help residents understand selected Toronto bylaw topics. It summarizes official sources in plain English and links back to official City resources for verification.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            <Link
              href="/about"
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-xl hover:bg-gray-800 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2"
            >
              Learn About This Site <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
            <a
              href={siteConfig.officialTorontoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 text-gray-700 text-sm font-medium rounded-xl hover:bg-gray-50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
            >
              <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" /> View Official City Sources
            </a>
          </div>
        </div>
      </section>

      {/* 311 CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 p-8 md:p-12 text-white text-center ring-1 ring-inset ring-white/10 shadow-[0_24px_60px_-24px_rgba(37,99,235,0.55)]">
          <div aria-hidden className="pointer-events-none absolute inset-0">
            <div className="absolute inset-x-0 -top-1/2 h-full" style={{ background: "radial-gradient(70% 100% at 50% 0%, rgba(255,255,255,0.16), transparent 65%)" }} />
            <div className="absolute -top-16 -right-10 h-56 w-56 rounded-full bg-cyan-300/20 blur-3xl" />
            <div className="absolute -bottom-20 -left-12 h-56 w-56 rounded-full bg-indigo-400/20 blur-3xl" />
          </div>
          <FileText className="relative w-10 h-10 mx-auto mb-4 opacity-90" aria-hidden="true" />
          <h2 className="relative text-2xl md:text-3xl font-bold mb-3">Need to Report a Bylaw Concern?</h2>
          <p className="relative text-blue-100 mb-6 max-w-xl mx-auto">
            Use the City of Toronto&apos;s official 311 service to submit a bylaw complaint or service request.
          </p>
          <a
            href={OFFICIAL_311_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="relative inline-flex items-center gap-2 px-6 py-3 bg-white text-blue-600 font-semibold rounded-xl hover:bg-blue-50 transition-colors subtle-shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-blue-600"
          >
            <ExternalLink className="w-4 h-4" aria-hidden="true" />
            Submit a Service Request through 311 Toronto
          </a>
        </div>

        {/* Disclaimer */}
        <div className="mt-8 p-5 rounded-xl border border-amber-200 bg-amber-50 flex gap-3">
          <CheckSquare className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" aria-hidden="true" />
          <div>
            <p className="text-sm font-semibold text-amber-900 mb-1">Important Notice</p>
            <p className="text-sm text-amber-800 leading-relaxed">
              This platform is an informational reference tool only. Always verify with the official City of Toronto Municipal Code and City procedures before taking any action. Information provided here does not constitute legal advice.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
