import Link from "next/link";
import SearchBar from "@/components/SearchBar";
import { OFFICIAL_311_URL } from "@/lib/mock-data";
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
    color: "bg-blue-50",
    iconColor: "text-blue-600",
    badge: "Bylaw Search",
  },
  {
    href: "/photo-review",
    icon: Camera,
    title: "Photo Review Helper",
    description: "Upload a photo and choose an issue type to see a preliminary reference match to a likely bylaw chapter, with an evidence checklist.",
    color: "bg-violet-50",
    iconColor: "text-violet-600",
    badge: "Preliminary Helper",
  },
  {
    href: "/pool-fence-guide",
    icon: Waves,
    title: "Pool Fence & Enclosure Guide",
    description: "Understand pool enclosure permits, fence height, and gate rules — with a printable inspection checklist.",
    color: "bg-cyan-50",
    iconColor: "text-cyan-600",
    badge: "Chapter 447",
  },
  {
    href: "/zoning",
    icon: MapPin,
    title: "Zoning Guide",
    description: "Plain-language answers to common zoning questions: front yard parking, setbacks, accessory structures, landscaping, and more.",
    color: "bg-emerald-50",
    iconColor: "text-emerald-600",
    badge: "By-law 569-2013",
  },
  {
    href: "/prohibited-plants",
    icon: Leaf,
    title: "Prohibited Plants Identifier",
    description: "Explore Toronto's prohibited plants, compare their seasonal appearance, and learn safe, resident-friendly removal methods.",
    color: "bg-green-50",
    iconColor: "text-green-600",
    badge: "Chapter 489",
    cta: "Explore Prohibited Plants",
  },
  {
    href: "/feedback",
    icon: MessageSquare,
    title: "Submit Feedback",
    description: "Report bugs, suggest missing bylaws, or correct content. Your input helps improve this public reference tool.",
    color: "bg-amber-50",
    iconColor: "text-amber-600",
    badge: "Open to All",
  },
];

const quickStats = [
  { label: "Municipal Code Chapters", value: "18" },
  { label: "Zoning Topics", value: "8" },
  { label: "Prohibited Plants", value: "10" },
  { label: "Photo Review Types", value: "16" },
  { label: "Checklist Items", value: "12" },
];

const commonViolations = [
  { chapter: "629", slug: "629", title: "Property Standards", example: "Damaged cladding, broken windows, unsafe stairs", color: "bg-blue-600" },
  { chapter: "489", slug: "489", title: "Turfgrass & Weeds", example: "Grass or weeds above the permitted height", color: "bg-green-600" },
  { chapter: "485", slug: "485", title: "Graffiti", example: "Graffiti on walls, fences, or utility boxes", color: "bg-purple-600" },
  { chapter: "447", slug: "447", title: "Fences & Pool Enclosures", example: "Non-compliant pool gate, fence height issue", color: "bg-cyan-600" },
  { chapter: "548", slug: "548", title: "Littering & Dumping", example: "Illegal dumping of furniture or appliances", color: "bg-red-600" },
  { chapter: "497", slug: "497", title: "Heating", example: "Inadequate heat in a rental during winter", color: "bg-orange-600" },
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
        <div aria-hidden className="pointer-events-none absolute -bottom-12 left-1/3 h-72 w-72 rounded-full bg-cyan-200/30 blur-3xl" />

        {/* Dotted grid accent */}
        <svg aria-hidden className="pointer-events-none absolute right-6 top-8 hidden text-blue-300/50 sm:block lg:right-12" width="132" height="84">
          <pattern id="hero-dots" x="0" y="0" width="16" height="16" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1.5" fill="currentColor" />
          </pattern>
          <rect width="132" height="84" fill="url(#hero-dots)" />
        </svg>

        {/* Toronto skyline silhouette (inline SVG — no external image) */}
        <svg
          aria-hidden
          viewBox="0 0 1440 200"
          preserveAspectRatio="none"
          className="pointer-events-none absolute inset-x-0 bottom-0 h-20 w-full text-blue-200/50 sm:h-28"
        >
          <path
            fill="currentColor"
            d="M0,200 V150 H60 V120 H110 V165 H170 V100 H230 V135 H290 V75 H360 V115 H420 V150 H470 V95 H520 V60 H545 V18 H560 V60 H585 V110 H640 V70 H700 V130 H760 V55 H830 V120 H890 V90 H950 V60 H1020 V140 H1080 V95 H1140 V120 H1210 V70 H1270 V150 H1340 V110 H1400 V160 H1440 V200 Z"
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
            {quickStats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-2xl font-bold text-blue-600">{stat.value}</p>
                <p className="text-xs text-gray-500 mt-0.5">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Cards Bento Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="mb-10">
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
                  <div className={`w-11 h-11 ${card.color} rounded-xl flex items-center justify-center`}>
                    <Icon className={`w-5 h-5 ${card.iconColor}`} aria-hidden="true" />
                  </div>
                  <span className="text-xs font-medium text-gray-400 bg-gray-50 px-2 py-1 rounded-full">
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
            className="group bg-blue-600 rounded-2xl p-6 subtle-shadow card-hover flex flex-col gap-4 text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300 focus-visible:ring-offset-2"
          >
            <div className="flex items-start justify-between">
              <div className="w-11 h-11 bg-white/15 rounded-xl flex items-center justify-center">
                <Phone className="w-5 h-5 text-white" aria-hidden="true" />
              </div>
              <span className="text-xs font-medium text-blue-50 bg-white/15 px-2 py-1 rounded-full">
                Official City Service
              </span>
            </div>
            <div>
              <h3 className="font-semibold mb-1.5">Report to Toronto 311</h3>
              <p className="text-sm text-blue-50 leading-relaxed">
                Use the official City of Toronto 311 service request page to submit complaints or service requests.
              </p>
            </div>
            <div className="flex items-center gap-1 text-sm font-medium mt-auto">
              Visit Toronto 311
              <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
            </div>
          </a>
        </div>

        {/* Noise — Coming Soon */}
        <Link
          href="/noise-complaints"
          className="group mt-5 flex items-center gap-4 p-5 rounded-2xl border border-dashed border-gray-300 bg-gray-50/60 hover:bg-white hover:border-gray-300 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
        >
          <div className="w-11 h-11 bg-gray-100 rounded-xl flex items-center justify-center flex-shrink-0">
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
                <div className={`${item.color} text-white text-xs font-bold rounded-lg px-2 py-1 min-w-[52px] text-center flex-shrink-0`}>
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

      {/* 311 CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-blue-600 rounded-2xl p-8 md:p-12 text-white text-center">
          <FileText className="w-10 h-10 mx-auto mb-4 opacity-90" aria-hidden="true" />
          <h2 className="text-2xl md:text-3xl font-bold mb-3">Need to Report a Bylaw Concern?</h2>
          <p className="text-blue-100 mb-6 max-w-xl mx-auto">
            Use the City of Toronto&apos;s official 311 service to submit a bylaw complaint or service request.
          </p>
          <a
            href={OFFICIAL_311_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white text-blue-600 font-semibold rounded-xl hover:bg-blue-50 transition-colors subtle-shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-blue-600"
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
